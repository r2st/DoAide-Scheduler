from __future__ import annotations

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.business import Business
from app.models.meeting_type import MeetingType
from app.models.user import User
from app.schemas.booking import BookingOut
from app.services.email import send_booking_cancelled, send_booking_confirmation
from app.services.scheduling import generate_token, get_available_slots
from app.services.usage import check_limit, increment_usage

router = APIRouter(prefix="/book", tags=["public"])


class PublicBookingRequest(BaseModel):
    start_time: datetime
    guest_name: str = Field(min_length=1, max_length=255)
    guest_email: EmailStr
    guest_timezone: str = Field(default="UTC", max_length=64)
    notes: str | None = None
    answers: dict | None = None


@router.post("/cancel/{token}")
def cancel_by_token(token: str, db: Session = Depends(get_db)) -> dict:
    booking = db.execute(
        select(Booking).where(Booking.cancel_token == token)
    ).scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status == BookingStatus.CANCELLED:
        return {"status": "already_cancelled"}

    booking.status = BookingStatus.CANCELLED
    db.commit()

    send_booking_cancelled(
        guest_email=booking.guest_email,
        guest_name=booking.guest_name,
        meeting_name="Meeting",
        start_time=booking.start_time.isoformat(),
    )

    return {"status": "cancelled"}


class RescheduleRequest(BaseModel):
    new_start_time: datetime


@router.post("/reschedule/{token}")
def reschedule_by_token(
    token: str, body: RescheduleRequest, db: Session = Depends(get_db)
) -> dict:
    booking = db.execute(
        select(Booking).where(Booking.reschedule_token == token)
    ).scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    mt = db.execute(
        select(MeetingType).where(MeetingType.id == booking.meeting_type_id)
    ).scalar_one_or_none()
    duration = mt.duration_minutes if mt else 30

    booking.start_time = body.new_start_time
    booking.end_time = body.new_start_time + timedelta(minutes=duration)
    booking.status = BookingStatus.RESCHEDULED
    booking.reschedule_token = generate_token()
    db.commit()

    return {"status": "rescheduled", "new_start": booking.start_time.isoformat()}


@router.get("/{business_slug}/{meeting_slug}")
def get_booking_page(
    business_slug: str, meeting_slug: str, db: Session = Depends(get_db)
) -> dict:
    business = db.execute(
        select(Business).where(Business.slug == business_slug, Business.is_active.is_(True))
    ).scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    mt = db.execute(
        select(MeetingType).where(
            MeetingType.business_id == business.id,
            MeetingType.slug == meeting_slug,
            MeetingType.is_active.is_(True),
        )
    ).scalar_one_or_none()
    if not mt:
        raise HTTPException(status_code=404, detail="Meeting type not found")

    return {
        "business": {"name": business.name, "slug": business.slug, "logo_url": business.logo_url},
        "meeting_type": {
            "name": mt.name,
            "slug": mt.slug,
            "description": mt.description,
            "duration_minutes": mt.duration_minutes,
            "color": mt.color,
            "location": mt.location,
            "questions": mt.questions,
        },
    }


@router.get("/{business_slug}/{meeting_slug}/slots")
def get_slots(
    business_slug: str, meeting_slug: str, date: str, db: Session = Depends(get_db)
) -> list[dict]:
    business = db.execute(
        select(Business).where(Business.slug == business_slug)
    ).scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    mt = db.execute(
        select(MeetingType).where(
            MeetingType.business_id == business.id,
            MeetingType.slug == meeting_slug,
            MeetingType.is_active.is_(True),
        )
    ).scalar_one_or_none()
    if not mt:
        raise HTTPException(status_code=404, detail="Meeting type not found")

    host = db.execute(
        select(User).where(User.business_id == business.id)
    ).scalars().first()
    if not host:
        return []

    dt = datetime.fromisoformat(date)
    return get_available_slots(db, mt, host.id, dt)


@router.post("/{business_slug}/{meeting_slug}", response_model=BookingOut,
             status_code=status.HTTP_201_CREATED)
def create_public_booking(
    business_slug: str,
    meeting_slug: str,
    body: PublicBookingRequest,
    db: Session = Depends(get_db),
) -> BookingOut:
    business = db.execute(
        select(Business).where(Business.slug == business_slug, Business.is_active.is_(True))
    ).scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    mt = db.execute(
        select(MeetingType).where(
            MeetingType.business_id == business.id,
            MeetingType.slug == meeting_slug,
            MeetingType.is_active.is_(True),
        )
    ).scalar_one_or_none()
    if not mt:
        raise HTTPException(status_code=404, detail="Meeting type not found")

    allowed, count, limit = check_limit(db, business.id, business.plan)
    if not allowed:
        raise HTTPException(status_code=429, detail="This business has reached its meeting limit")

    host = db.execute(select(User).where(User.business_id == business.id)).scalars().first()
    if not host:
        raise HTTPException(status_code=404, detail="No host available")

    end_time = body.start_time + timedelta(minutes=mt.duration_minutes)

    booking = Booking(
        business_id=business.id,
        meeting_type_id=mt.id,
        host_user_id=host.id,
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
    increment_usage(db, business.id)
    db.commit()
    db.refresh(booking)

    send_booking_confirmation(
        guest_email=booking.guest_email,
        guest_name=booking.guest_name,
        host_name=host.full_name or host.email,
        meeting_name=mt.name,
        start_time=booking.start_time.isoformat(),
        cancel_url=f"/cancel/{booking.cancel_token}",
        reschedule_url=f"/reschedule/{booking.reschedule_token}",
    )

    return BookingOut.model_validate(booking)
