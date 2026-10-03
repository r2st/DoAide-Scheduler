from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AvailabilityRuleCreate(BaseModel):
    day_of_week: int = Field(ge=0, le=6)
    start_time: str = Field(max_length=5)
    end_time: str = Field(max_length=5)


class AvailabilityRuleUpdate(BaseModel):
    start_time: str | None = Field(default=None, max_length=5)
    end_time: str | None = Field(default=None, max_length=5)
    is_active: bool | None = None


class AvailabilityRuleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    business_id: int
    day_of_week: int
    start_time: str
    end_time: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class TimeSlot(BaseModel):
    start: datetime
    end: datetime
