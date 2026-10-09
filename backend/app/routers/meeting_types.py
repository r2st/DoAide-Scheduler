from __future__ import annotations

import re

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.meeting_type import MeetingType
from app.models.user import User
from app.schemas.meeting_type import MeetingTypeCreate, MeetingTypeOut, MeetingTypeUpdate

router = APIRouter(prefix="/meeting-types", tags=["meeting_types"])


def _slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "meeting"


@router.get("/", response_model=list[MeetingTypeOut])
def list_meeting_types(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[MeetingTypeOut]:
    types = db.execute(
        select(MeetingType).where(MeetingType.business_id == user.business_id)
    ).scalars().all()
    return [MeetingTypeOut.model_validate(t) for t in types]


@router.post("/", response_model=MeetingTypeOut, status_code=status.HTTP_201_CREATED)
def create_meeting_type(
    body: MeetingTypeCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MeetingTypeOut:
    slug = _slugify(body.name)
    mt = MeetingType(
        business_id=user.business_id,
        name=body.name,
        slug=slug,
        description=body.description,
        duration_minutes=body.duration_minutes,
        buffer_before_minutes=body.buffer_before_minutes,
        buffer_after_minutes=body.buffer_after_minutes,
        max_per_day=body.max_per_day,
        color=body.color,
        requires_confirmation=body.requires_confirmation,
        location=body.location,
        questions=body.questions,
    )
    db.add(mt)
    db.commit()
    db.refresh(mt)
    return MeetingTypeOut.model_validate(mt)


@router.get("/{meeting_type_id}", response_model=MeetingTypeOut)
def get_meeting_type(
    meeting_type_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MeetingTypeOut:
    mt = db.execute(
        select(MeetingType).where(
            MeetingType.id == meeting_type_id,
            MeetingType.business_id == user.business_id,
        )
    ).scalar_one_or_none()
    if not mt:
        raise HTTPException(status_code=404, detail="Meeting type not found")
    return MeetingTypeOut.model_validate(mt)


@router.patch("/{meeting_type_id}", response_model=MeetingTypeOut)
def update_meeting_type(
    meeting_type_id: int,
    body: MeetingTypeUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MeetingTypeOut:
    mt = db.execute(
        select(MeetingType).where(
            MeetingType.id == meeting_type_id,
            MeetingType.business_id == user.business_id,
        )
    ).scalar_one_or_none()
    if not mt:
        raise HTTPException(status_code=404, detail="Meeting type not found")

    updates = body.model_dump(exclude_unset=True)
    if "name" in updates:
        updates["slug"] = _slugify(updates["name"])
    for key, value in updates.items():
        setattr(mt, key, value)

    db.commit()
    db.refresh(mt)
    return MeetingTypeOut.model_validate(mt)


@router.delete("/{meeting_type_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
def delete_meeting_type(
    meeting_type_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    mt = db.execute(
        select(MeetingType).where(
            MeetingType.id == meeting_type_id,
            MeetingType.business_id == user.business_id,
        )
    ).scalar_one_or_none()
    if not mt:
        raise HTTPException(status_code=404, detail="Meeting type not found")
    db.delete(mt)
    db.commit()
