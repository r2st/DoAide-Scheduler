from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models.business import BusinessPlan
from app.models.user import UserRole


class BusinessOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    website: str | None = None
    logo_url: str | None = None
    timezone: str
    plan: BusinessPlan
    is_active: bool
    created_at: datetime


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str | None = None
    timezone: str
    role: UserRole
    is_active: bool
    business_id: int
    created_at: datetime


class MeOut(UserOut):
    business: BusinessOut


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    business_name: str = Field(min_length=1, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    timezone: str = Field(default="UTC", max_length=64)

    @field_validator("password")
    @classmethod
    def _not_weak(cls, v: str) -> str:
        if v.strip() == "":
            raise ValueError("Password cannot be only whitespace")
        return v


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegisterResponse(BaseModel):
    user: UserOut
    business: BusinessOut
    access_token: str
    token_type: str = "bearer"
