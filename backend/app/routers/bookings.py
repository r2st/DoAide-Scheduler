from __future__ import annotations

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.booking import Booking, BookingStatus
from app.models.business import Business
from app.models.meeting_type import MeetingType
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingOut, BookingUpdate
from app.services.email import send_booking_confirmation
from app.services.scheduling import generate_token
from app.services.usage import check_limit, increment_usage

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.get("/", response_model=list[BookingOut])
def list_bookings(
    status_filter: BookingStatus | None = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[BookingOut]:
    query = select(Booking).where(Booking.business_id == user.business_id)
    if status_filter:
        query = query.where(Booking.status == status_filter)
    query = query.order_by(Booking.start_time.desc())
    bookings = db.execute(query).scalars().all()
    return [BookingOut.model_validate(b) for b in bookings]


@router.post("/", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(
    body: BookingCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BookingOut:
    mt = db.execute(
        select(MeetingType).where(
            MeetingType.id == body.meeting_type_id,
            MeetingType.business_id == user.business_id,
        )
    ).scalar_one_or_none()
    if not mt:
        raise HTTPException(status_code=404, detail="Meeting type not found")

    business = db.execute(select(Business).where(Business.id == user.business_id)).scalar_one()
    allowed, count, limit = check_limit(db, user.business_id, business.plan)
    if not allowed:
        raise HTTPException(status_code=429, detail=f"Monthly meeting limit reached ({count}/{limit})")

    end_time = body.start_time + timedelta(minutes=mt.duration_minutes)

    booking = Booking(
        business_id=user.business_id,
        meeting_type_id=mt.id,
        host_user_id=user.id,
        guest_name=body.guest_name,
        guest_email=body.guest_email,
        guest_timezone=body.guest_timezone,
        start_time=body.start_time,
        end_time=end_time,
        status=BookingStatus.PENDING if mt.requires_confirmation else BookingStatus.CONFIRMED,
        notes=body.notes,
        answers=body.answers,
        reschedule_token=generate_token(),
        cancel_token=generate_token(),
    )
    db.add(booking)
    increment_usage(db, user.business_id)
    db.commit()
    db.refresh(booking)

    send_booking_confirmation(
        guest_email=booking.guest_email,
        guest_name=booking.guest_name,
        host_name=user.full_name or user.email,
        meeting_name=mt.name,
        start_time=booking.start_time.isoformat(),
        cancel_url=f"/cancel/{booking.cancel_token}",
        reschedule_url=f"/reschedule/{booking.reschedule_token}",
    )

    return BookingOut.model_validate(booking)


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(
    booking_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BookingOut:
    booking = db.execute(
        select(Booking).where(
            Booking.id == booking_id,
            Booking.business_id == user.business_id,
        )
    ).scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return BookingOut.model_validate(booking)


@router.patch("/{booking_id}", response_model=BookingOut)
def update_booking(
    booking_id: int,
    body: BookingUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BookingOut:
    booking = db.execute(
        select(Booking).where(
            Booking.id == booking_id,
            Booking.business_id == user.business_id,
        )
    ).scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    updates = body.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(booking, key, value)

    db.commit()
    db.refresh(booking)
    return BookingOut.model_validate(booking)
