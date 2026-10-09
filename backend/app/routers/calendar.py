from __future__ import annotations

import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.calendar_connection import CalendarConnection
from app.models.user import User
from app.services.google_calendar import exchange_code, get_auth_url

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.get("/connect/google")
def google_connect(user: User = Depends(get_current_user)) -> dict:
    if not settings.google_client_id:
        raise HTTPException(status_code=501, detail="Google Calendar integration not configured")
    state = f"{user.id}:{secrets.token_urlsafe(16)}"
    return {"auth_url": get_auth_url(state)}


@router.get("/callback")
async def google_callback(
    code: str, state: str, db: Session = Depends(get_db)
) -> dict:
    user_id = int(state.split(":")[0])

    tokens = await exchange_code(code)

    existing = db.execute(
        select(CalendarConnection).where(
            CalendarConnection.user_id == user_id,
            CalendarConnection.provider == "google",
        )
    ).scalar_one_or_none()

    if existing:
        existing.access_token = tokens.get("access_token")
        existing.refresh_token = tokens.get("refresh_token", existing.refresh_token)
        existing.token_expires_at = str(tokens.get("expires_in", ""))
    else:
        conn = CalendarConnection(
            user_id=user_id,
            provider="google",
            access_token=tokens.get("access_token"),
            refresh_token=tokens.get("refresh_token"),
            token_expires_at=str(tokens.get("expires_in", "")),
        )
        db.add(conn)

    db.commit()
    return {"status": "connected"}


@router.get("/connections")
def list_connections(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[dict]:
    connections = db.execute(
        select(CalendarConnection).where(CalendarConnection.user_id == user.id)
    ).scalars().all()
    return [
        {
            "id": c.id,
            "provider": c.provider,
            "is_active": c.is_active,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c in connections
    ]


@router.delete("/connections/{connection_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
def disconnect(
    connection_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    conn = db.execute(
        select(CalendarConnection).where(
            CalendarConnection.id == connection_id,
            CalendarConnection.user_id == user.id,
        )
    ).scalar_one_or_none()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    db.delete(conn)
    db.commit()
