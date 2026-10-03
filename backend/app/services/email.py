from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, html_body: str) -> bool:
    if not settings.smtp_host:
        logger.info("Email skipped (no SMTP configured): to=%s subject=%s", to, subject)
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.smtp_from_address
    msg["To"] = to
    msg.attach(MIMEText(html_body, "html"))

    try:
        if settings.smtp_use_tls:
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port)
            server.starttls()
        else:
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port)

        if settings.smtp_username:
            server.login(settings.smtp_username, settings.smtp_password)

        server.sendmail(settings.smtp_from_address, to, msg.as_string())
        server.quit()
        logger.info("Email sent: to=%s subject=%s", to, subject)
        return True
    except Exception as exc:
        logger.error("Email failed: to=%s error=%s", to, exc)
        return False


def send_booking_confirmation(guest_email: str, guest_name: str, host_name: str,
                              meeting_name: str, start_time: str, cancel_url: str,
                              reschedule_url: str) -> bool:
    subject = f"Booking Confirmed: {meeting_name}"
    body = f"""
    <html><body>
    <h2>Your meeting is confirmed!</h2>
    <p>Hi {guest_name},</p>
    <p>Your <strong>{meeting_name}</strong> with {host_name} is confirmed.</p>
    <p><strong>When:</strong> {start_time}</p>
    <p>
        <a href="{reschedule_url}">Reschedule</a> |
        <a href="{cancel_url}">Cancel</a>
    </p>
    </body></html>
    """
    return send_email(guest_email, subject, body)


def send_booking_cancelled(guest_email: str, guest_name: str,
                           meeting_name: str, start_time: str) -> bool:
    subject = f"Booking Cancelled: {meeting_name}"
    body = f"""
    <html><body>
    <h2>Meeting Cancelled</h2>
    <p>Hi {guest_name},</p>
    <p>Your <strong>{meeting_name}</strong> scheduled for {start_time} has been cancelled.</p>
    </body></html>
    """
    return send_email(guest_email, subject, body)
