from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MeetingTypeCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    duration_minutes: int = Field(default=30, ge=5, le=480)
    buffer_before_minutes: int = Field(default=0, ge=0, le=120)
    buffer_after_minutes: int = Field(default=15, ge=0, le=120)
    max_per_day: int | None = Field(default=None, ge=1, le=50)
    color: str = Field(default="#10B981", max_length=7)
    requires_confirmation: bool = False
    location: str | None = Field(default=None, max_length=512)
    questions: dict | None = None


class MeetingTypeUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    duration_minutes: int | None = Field(default=None, ge=5, le=480)
    buffer_before_minutes: int | None = Field(default=None, ge=0, le=120)
    buffer_after_minutes: int | None = Field(default=None, ge=0, le=120)
    max_per_day: int | None = Field(default=None, ge=1, le=50)
    color: str | None = Field(default=None, max_length=7)
    is_active: bool | None = None
    requires_confirmation: bool | None = None
    location: str | None = Field(default=None, max_length=512)
    questions: dict | None = None


class MeetingTypeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    business_id: int
    name: str
    slug: str
    description: str | None = None
    duration_minutes: int
    buffer_before_minutes: int
    buffer_after_minutes: int
    max_per_day: int | None = None
    color: str
    is_active: bool
    requires_confirmation: bool
    location: str | None = None
    questions: dict | None = None
    created_at: datetime
    updated_at: datetime
