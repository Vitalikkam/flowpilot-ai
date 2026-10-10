from app.services.qualification import qualify


def test_high_value_high_urgency_lead_is_qualified_high():
    result = qualify(
        category="web_development",
        budget_usd=8000,
        urgency="high",
        has_valid_contact=True,
    )
    assert result.priority == "high"
    assert result.status == "qualified"
    assert any("urgency" in r.lower() for r in result.reasons)


def test_invalid_contact_is_rejected():
    result = qualify(
        category="web_development",
        budget_usd=10000,
        urgency="high",
        has_valid_contact=False,
    )
    assert result.status == "rejected"
    assert result.priority == "low"


def test_unclear_input_goes_to_needs_review():
    result = qualify(
        category="other",
        budget_usd=None,
        urgency="low",
        has_valid_contact=True,
    )
    assert result.status == "needs_review"


def test_medium_signals_are_qualified_medium():
    result = qualify(
        category="consulting",
        budget_usd=2000,
        urgency="medium",
        has_valid_contact=True,
    )
    assert result.status == "qualified"
    assert result.priority == "medium"


def test_high_budget_low_urgency_web_dev_is_qualified():
    result = qualify(
        category="web_development",
        budget_usd=6000,
        urgency="low",
        has_valid_contact=True,
    )
    assert result.status == "qualified"