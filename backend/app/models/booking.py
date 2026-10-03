from __future__ import annotations

from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import BusinessScopedMixin, JSONType, TimestampMixin


class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"
    COMPLETED = "completed"
    NO_SHOW = "no_show"


class Booking(Base, TimestampMixin, BusinessScopedMixin):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True)
    meeting_type_id: Mapped[int] = mapped_column(
        ForeignKey("meeting_types.id", ondelete="CASCADE"), nullable=False, index=True
    )
    host_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    guest_name: Mapped[str] = mapped_column(String(255), nullable=False)
    guest_email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    guest_timezone: Mapped[str] = mapped_column(String(64), default="UTC", nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[BookingStatus] = mapped_column(
        SAEnum(BookingStatus, native_enum=False, length=20),
        default=BookingStatus.CONFIRMED,
        nullable=False,
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    cancel_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    reschedule_token: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)
    cancel_token: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)
    answers: Mapped[dict | None] = mapped_column(JSONType, nullable=True)
    google_event_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
