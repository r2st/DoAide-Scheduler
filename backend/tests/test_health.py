from __future__ import annotations


def test_health(client):
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] in ("healthy", "degraded")
    assert "version" in data


def test_readiness(client):
    resp = client.get("/api/v1/health/ready")
    assert resp.status_code == 200
    assert "ready" in resp.json()


def test_root(client):
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["app"] == "DoAide Scheduler"
