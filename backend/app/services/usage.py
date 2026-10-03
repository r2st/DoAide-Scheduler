from __future__ import annotations

from datetime import datetime

from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.business import BusinessPlan
from app.models.usage_tracking import UsageTracking


def get_current_period() -> str:
    return datetime.utcnow().strftime("%Y-%m")


def get_usage(db: Session, business_id: int) -> UsageTracking | None:
    period = get_current_period()
    return db.execute(
        select(UsageTracking).where(
            and_(
                UsageTracking.business_id == business_id,
                UsageTracking.period == period,
            )
        )
    ).scalar_one_or_none()


def increment_usage(db: Session, business_id: int) -> UsageTracking:
    period = get_current_period()
    usage = get_usage(db, business_id)
    if usage is None:
        usage = UsageTracking(
            business_id=business_id,
            period=period,
            meetings_count=1,
        )
        db.add(usage)
    else:
        usage.meetings_count += 1
    db.flush()
    return usage


def check_limit(db: Session, business_id: int, plan: BusinessPlan) -> tuple[bool, int, int]:
    if plan != BusinessPlan.FREE:
        return True, 0, -1

    usage = get_usage(db, business_id)
    count = usage.meetings_count if usage else 0
    limit = settings.free_tier_monthly_meetings
    return count < limit, count, limit
