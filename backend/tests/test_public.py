from __future__ import annotations


def _setup_booking_page(client, auth_headers):
    client.post("/api/v1/meeting-types/", json={
        "name": "Quick Call",
        "duration_minutes": 15,
    }, headers=auth_headers)


def test_get_public_booking_page(client, auth_headers):
    _setup_booking_page(client, auth_headers)
    resp = client.get("/api/v1/book/test-business/quick-call")
    assert resp.status_code == 200
    data = resp.json()
    assert data["business"]["name"] == "Test Business"
    assert data["meeting_type"]["name"] == "Quick Call"


def test_get_public_booking_page_not_found(client):
    resp = client.get("/api/v1/book/nonexistent/meeting")
    assert resp.status_code == 404


def test_create_public_booking(client, auth_headers):
    _setup_booking_page(client, auth_headers)
    resp = client.post("/api/v1/book/test-business/quick-call", json={
        "start_time": "2025-02-01T10:00:00+00:00",
        "guest_name": "Public Guest",
        "guest_email": "guest@example.com",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["guest_name"] == "Public Guest"
    assert data["cancel_token"] is not None


def test_cancel_by_token(client, auth_headers):
    _setup_booking_page(client, auth_headers)
    booking = client.post("/api/v1/book/test-business/quick-call", json={
        "start_time": "2025-02-01T10:00:00+00:00",
        "guest_name": "Cancel Guest",
        "guest_email": "cancel@example.com",
    }).json()
    token = booking["cancel_token"]

    resp = client.post(f"/api/v1/book/cancel/{token}")
    assert resp.status_code == 200
    assert resp.json()["status"] == "cancelled"
