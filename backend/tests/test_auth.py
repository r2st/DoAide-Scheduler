from __future__ import annotations


def test_register(client):
    resp = client.post("/api/v1/auth/register", json={
        "email": "new@example.com",
        "password": "securepass123",
        "business_name": "My Company",
        "full_name": "John Doe",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["user"]["email"] == "new@example.com"
    assert data["business"]["name"] == "My Company"
    assert data["access_token"]


def test_register_duplicate_email(client):
    payload = {
        "email": "dup@example.com",
        "password": "securepass123",
        "business_name": "Company",
    }
    client.post("/api/v1/auth/register", json=payload)
    resp = client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 409


def test_login(client):
    client.post("/api/v1/auth/register", json={
        "email": "login@example.com",
        "password": "securepass123",
        "business_name": "Login Co",
    })
    resp = client.post("/api/v1/auth/login", data={
        "username": "login@example.com",
        "password": "securepass123",
    })
    assert resp.status_code == 200
    assert resp.json()["access_token"]


def test_login_wrong_password(client):
    client.post("/api/v1/auth/register", json={
        "email": "wrong@example.com",
        "password": "securepass123",
        "business_name": "Wrong Co",
    })
    resp = client.post("/api/v1/auth/login", data={
        "username": "wrong@example.com",
        "password": "wrongpassword",
    })
    assert resp.status_code == 401


def test_me(client, auth_headers):
    resp = client.get("/api/v1/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "test@example.com"
    assert data["business"]["name"] == "Test Business"


def test_me_unauthorized(client):
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401
