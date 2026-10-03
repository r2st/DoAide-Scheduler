from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.notification import Notification
from app.models.user import User

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/")
def list_notifications(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[dict]:
    notifications = db.execute(
        select(Notification).where(
            Notification.user_id == user.id,
        ).order_by(Notification.created_at.desc()).limit(50)
    ).scalars().all()
    return [
        {
            "id": n.id,
            "type": n.notification_type.value,
            "subject": n.subject,
            "body": n.body,
            "is_read": n.is_read,
            "sent_at": n.sent_at.isoformat() if n.sent_at else None,
            "created_at": n.created_at.isoformat() if n.created_at else None,
        }
        for n in notifications
    ]


@router.patch("/{notification_id}/read")
def mark_read(
    notification_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    notif = db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == user.id,
        )
    ).scalar_one_or_none()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"status": "read"}
