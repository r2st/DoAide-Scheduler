from __future__ import annotations

import re

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.models.business import Business, BusinessPlan
from app.models.user import User, UserRole
from app.schemas.auth import MeOut, RegisterRequest, RegisterResponse, Token, BusinessOut, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


def _slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "business"


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)) -> RegisterResponse:
    existing = db.execute(select(User).where(User.email == body.email)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    base_slug = _slugify(body.business_name)
    slug = base_slug
    counter = 1
    while db.execute(select(Business).where(Business.slug == slug)).scalar_one_or_none():
        slug = f"{base_slug}-{counter}"
        counter += 1

    business = Business(
        name=body.business_name,
        slug=slug,
        timezone=body.timezone,
        plan=BusinessPlan.FREE,
    )
    db.add(business)
    db.flush()

    user = User(
        business_id=business.id,
        email=body.email,
        hashed_password=hash_password(body.password),
        full_name=body.full_name,
        timezone=body.timezone,
        role=UserRole.OWNER,
    )
    db.add(user)
    db.flush()

    # Create default availability (Mon-Fri 9:00-17:00)
    from app.models.availability_rule import AvailabilityRule
    for day in range(5):
        db.add(AvailabilityRule(
            user_id=user.id,
            business_id=business.id,
            day_of_week=day,
            start_time="09:00",
            end_time="17:00",
        ))

    db.commit()
    db.refresh(user)
    db.refresh(business)

    token = create_access_token(user.id)
    return RegisterResponse(
        user=UserOut.model_validate(user),
        business=BusinessOut.model_validate(business),
        access_token=token,
    )


@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> Token:
    user = db.execute(select(User).where(User.email == form.username)).scalar_one_or_none()
    hashed = user.hashed_password if user else None
    if not verify_password(form.password, hashed):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")
    token = create_access_token(user.id)
    return Token(access_token=token)


@router.get("/me", response_model=MeOut)
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> MeOut:
    business = db.execute(
        select(Business).where(Business.id == user.business_id)
    ).scalar_one()
    user_out = UserOut.model_validate(user)
    return MeOut(
        **user_out.model_dump(),
        business=BusinessOut.model_validate(business),
    )
