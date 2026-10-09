from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.availability_rule import AvailabilityRule
from app.models.user import User
from app.schemas.availability import AvailabilityRuleCreate, AvailabilityRuleOut, AvailabilityRuleUpdate

router = APIRouter(prefix="/availability", tags=["availability"])


@router.get("/", response_model=list[AvailabilityRuleOut])
def list_rules(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[AvailabilityRuleOut]:
    rules = db.execute(
        select(AvailabilityRule).where(
            AvailabilityRule.user_id == user.id,
        ).order_by(AvailabilityRule.day_of_week, AvailabilityRule.start_time)
    ).scalars().all()
    return [AvailabilityRuleOut.model_validate(r) for r in rules]


@router.post("/", response_model=AvailabilityRuleOut, status_code=status.HTTP_201_CREATED)
def create_rule(
    body: AvailabilityRuleCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AvailabilityRuleOut:
    rule = AvailabilityRule(
        user_id=user.id,
        business_id=user.business_id,
        day_of_week=body.day_of_week,
        start_time=body.start_time,
        end_time=body.end_time,
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return AvailabilityRuleOut.model_validate(rule)


@router.patch("/{rule_id}", response_model=AvailabilityRuleOut)
def update_rule(
    rule_id: int,
    body: AvailabilityRuleUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AvailabilityRuleOut:
    rule = db.execute(
        select(AvailabilityRule).where(
            AvailabilityRule.id == rule_id,
            AvailabilityRule.user_id == user.id,
        )
    ).scalar_one_or_none()
    if not rule:
        raise HTTPException(status_code=404, detail="Availability rule not found")

    updates = body.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(rule, key, value)

    db.commit()
    db.refresh(rule)
    return AvailabilityRuleOut.model_validate(rule)


@router.delete("/{rule_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
def delete_rule(
    rule_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    rule = db.execute(
        select(AvailabilityRule).where(
            AvailabilityRule.id == rule_id,
            AvailabilityRule.user_id == user.id,
        )
    ).scalar_one_or_none()
    if not rule:
        raise HTTPException(status_code=404, detail="Availability rule not found")
    db.delete(rule)
    db.commit()
