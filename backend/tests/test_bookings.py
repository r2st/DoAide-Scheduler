from __future__ import annotations

from datetime import datetime, timezone


def _create_meeting_type(client, auth_headers):
    resp = client.post("/api/v1/meeting-types/", json={
        "name": "Test Meeting",
        "duration_minutes": 30,
    }, headers=auth_headers)
    return resp.json()["id"]


def test_create_booking(client, auth_headers):
    mt_id = _create_meeting_type(client, auth_headers)
    resp = client.post("/api/v1/bookings/", json={
        "meeting_type_id": mt_id,
        "start_time": "2025-01-15T10:00:00+00:00",
        "guest_name": "Jane Doe",
        "guest_email": "jane@example.com",
    }, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["guest_name"] == "Jane Doe"
    assert data["status"] == "confirmed"
    assert data["cancel_token"] is not None


def test_list_bookings(client, auth_headers):
    mt_id = _create_meeting_type(client, auth_headers)
    client.post("/api/v1/bookings/", json={
        "meeting_type_id": mt_id,
        "start_time": "2025-01-15T10:00:00+00:00",
        "guest_name": "Guest 1",
        "guest_email": "g1@example.com",
    }, headers=auth_headers)
    client.post("/api/v1/bookings/", json={
        "meeting_type_id": mt_id,
        "start_time": "2025-01-15T14:00:00+00:00",
        "guest_name": "Guest 2",
        "guest_email": "g2@example.com",
    }, headers=auth_headers)

    resp = client.get("/api/v1/bookings/", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_update_booking_status(client, auth_headers):
    mt_id = _create_meeting_type(client, auth_headers)
    create = client.post("/api/v1/bookings/", json={
        "meeting_type_id": mt_id,
        "start_time": "2025-01-15T10:00:00+00:00",
        "guest_name": "Cancel Me",
        "guest_email": "cancel@example.com",
    }, headers=auth_headers)
    booking_id = create.json()["id"]

    resp = client.patch(f"/api/v1/bookings/{booking_id}", json={
        "status": "cancelled",
        "cancel_reason": "Changed plans",
    }, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["status"] == "cancelled"
