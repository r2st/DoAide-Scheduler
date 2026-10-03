from __future__ import annotations

from app.models.business import BusinessPlan
from app.services.usage import check_limit, get_current_period, increment_usage


def test_get_current_period():
    period = get_current_period()
    assert len(period) == 7
    assert "-" in period


def test_check_limit_free_tier(db_session):
    from app.models.business import Business
    b = Business(name="Test", slug="test-usage", plan=BusinessPlan.FREE)
    db_session.add(b)
    db_session.flush()

    allowed, count, limit = check_limit(db_session, b.id, BusinessPlan.FREE)
    assert allowed is True
    assert count == 0
    assert limit == 20


def test_increment_usage(db_session):
    from app.models.business import Business
    b = Business(name="Test", slug="test-inc", plan=BusinessPlan.FREE)
    db_session.add(b)
    db_session.flush()

    usage = increment_usage(db_session, b.id)
    assert usage.meetings_count == 1

    usage = increment_usage(db_session, b.id)
    assert usage.meetings_count == 2


def test_pro_plan_no_limit(db_session):
    from app.models.business import Business
    b = Business(name="Pro", slug="test-pro", plan=BusinessPlan.PRO)
    db_session.add(b)
    db_session.flush()

    allowed, count, limit = check_limit(db_session, b.id, BusinessPlan.PRO)
    assert allowed is True
    assert limit == -1
