from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.schemas.auth import UserOut

router = APIRouter(prefix="/team", tags=["team"])


class InviteMemberRequest(BaseModel):
    email: EmailStr
    full_name: str | None = Field(default=None, max_length=255)
    role: UserRole = UserRole.MEMBER
    password: str = Field(min_length=8, max_length=128)


@router.get("/members", response_model=list[UserOut])
def list_members(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[UserOut]:
    members = db.execute(
        select(User).where(User.business_id == user.business_id)
    ).scalars().all()
    return [UserOut.model_validate(m) for m in members]


@router.post("/members", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def add_member(
    body: InviteMemberRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserOut:
    if user.role != UserRole.OWNER:
        raise HTTPException(status_code=403, detail="Only owners can add team members")

    existing = db.execute(select(User).where(User.email == body.email)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    member = User(
        business_id=user.business_id,
        email=body.email,
        hashed_password=hash_password(body.password),
        full_name=body.full_name,
        role=body.role,
        timezone=user.timezone,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return UserOut.model_validate(member)


@router.delete("/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_member(
    member_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    if user.role != UserRole.OWNER:
        raise HTTPException(status_code=403, detail="Only owners can remove team members")
    if member_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot remove yourself")

    member = db.execute(
        select(User).where(
            User.id == member_id,
            User.business_id == user.business_id,
        )
    ).scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    db.delete(member)
    db.commit()
