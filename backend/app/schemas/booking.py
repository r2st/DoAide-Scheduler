from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.booking import BookingStatus


class BookingCreate(BaseModel):
    meeting_type_id: int
    start_time: datetime
    guest_name: str = Field(min_length=1, max_length=255)
    guest_email: EmailStr
    guest_timezone: str = Field(default="UTC", max_length=64)
    notes: str | None = None
    answers: dict | None = None


class BookingUpdate(BaseModel):
    status: BookingStatus | None = None
    notes: str | None = None
    cancel_reason: str | None = None


class BookingReschedule(BaseModel):
    new_start_time: datetime


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    business_id: int
    meeting_type_id: int
    host_user_id: int
    guest_name: str
    guest_email: str
    guest_timezone: str
    start_time: datetime
    end_time: datetime
    status: BookingStatus
    notes: str | None = None
    cancel_reason: str | None = None
    reschedule_token: str | None = None
    cancel_token: str | None = None
    answers: dict | None = None
    created_at: datetime
    updated_at: datetime
