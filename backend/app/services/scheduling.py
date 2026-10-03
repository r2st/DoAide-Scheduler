from __future__ import annotations

import secrets
from datetime import datetime, timedelta

from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.models.availability_rule import AvailabilityRule
from app.models.booking import Booking, BookingStatus
from app.models.meeting_type import MeetingType


def get_available_slots(
    db: Session,
    meeting_type: MeetingType,
    user_id: int,
    date: datetime,
) -> list[dict]:
    day_of_week = date.weekday()
    rules = db.execute(
        select(AvailabilityRule).where(
            and_(
                AvailabilityRule.user_id == user_id,
                AvailabilityRule.day_of_week == day_of_week,
                AvailabilityRule.is_active.is_(True),
            )
        )
    ).scalars().all()

    if not rules:
        return []

    existing_bookings = db.execute(
        select(Booking).where(
            and_(
                Booking.host_user_id == user_id,
                Booking.start_time >= date.replace(hour=0, minute=0, second=0),
                Booking.start_time < date.replace(hour=0, minute=0, second=0) + timedelta(days=1),
                Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
            )
        )
    ).scalars().all()

    if meeting_type.max_per_day and len(existing_bookings) >= meeting_type.max_per_day:
        return []

    booked_ranges = [
        (b.start_time - timedelta(minutes=meeting_type.buffer_before_minutes),
         b.end_time + timedelta(minutes=meeting_type.buffer_after_minutes))
        for b in existing_bookings
    ]

    slots = []
    for rule in rules:
        start_h, start_m = map(int, rule.start_time.split(":"))
        end_h, end_m = map(int, rule.end_time.split(":"))

        slot_start = date.replace(hour=start_h, minute=start_m, second=0, microsecond=0)
        rule_end = date.replace(hour=end_h, minute=end_m, second=0, microsecond=0)

        while slot_start + timedelta(minutes=meeting_type.duration_minutes) <= rule_end:
            slot_end = slot_start + timedelta(minutes=meeting_type.duration_minutes)
            buffered_start = slot_start - timedelta(minutes=meeting_type.buffer_before_minutes)
            buffered_end = slot_end + timedelta(minutes=meeting_type.buffer_after_minutes)

            conflict = any(
                buffered_start < be and buffered_end > bs
                for bs, be in booked_ranges
            )

            if not conflict:
                slots.append({"start": slot_start.isoformat(), "end": slot_end.isoformat()})

            slot_start += timedelta(minutes=30)

    return slots


def generate_token() -> str:
    return secrets.token_urlsafe(32)
