from typing import Optional

from app.schemas import QualificationResult


# Configurable thresholds. In a later chapter these can move to env vars.
HIGH_BUDGET_THRESHOLD = 5000.0
MEDIUM_BUDGET_THRESHOLD = 1000.0

HIGH_FIT_CATEGORIES = {"web_development", "automation"}


def qualify(
    category: str,
    budget_usd: Optional[float],
    urgency: str,
    has_valid_contact: bool,
) -> QualificationResult:
    """Apply deterministic rules to classify a lead.

    The AI provides context (category, budget, urgency). This function
    alone decides priority and status. It is pure — no database access,
    no side effects — so it is easy to test.
    """
    reasons: list[str] = []

    # Rule 1: invalid contact → reject outright.
    if not has_valid_contact:
        reasons.append("Missing valid contact information")
        return QualificationResult(
            priority="low",
            status="rejected",
            reasons=reasons,
        )

    score = 0

    # Rule 2: urgency.
    if urgency == "high":
        score += 3
        reasons.append("High urgency indicated")
    elif urgency == "medium":
        score += 1
        reasons.append("Medium urgency indicated")

    # Rule 3: budget.
    if budget_usd is not None:
        if budget_usd >= HIGH_BUDGET_THRESHOLD:
            score += 3
            reasons.append(f"Budget >= ${HIGH_BUDGET_THRESHOLD:.0f}")
        elif budget_usd >= MEDIUM_BUDGET_THRESHOLD:
            score += 1
            reasons.append(f"Budget >= ${MEDIUM_BUDGET_THRESHOLD:.0f}")
    else:
        reasons.append("Budget not specified")

    # Rule 4: category fit.
    if category in HIGH_FIT_CATEGORIES:
        score += 2
        reasons.append(f"High-fit category: {category}")
    elif category == "consulting":
        score += 1
        reasons.append("Consulting engagement")
    elif category == "other":
        reasons.append("Category unclear")

    # Rule 5: unclear-input override.
    if category == "other" and budget_usd is None:
        reasons.append("Insufficient information — flagging for review")
        return QualificationResult(
            priority="low",
            status="needs_review",
            reasons=reasons,
        )

    # Map score to priority and status.
    if score >= 5:
        return QualificationResult(priority="high", status="qualified", reasons=reasons)
    if score >= 3:
        return QualificationResult(priority="medium", status="qualified", reasons=reasons)
    if score >= 1:
        return QualificationResult(priority="low", status="qualified", reasons=reasons)

    reasons.append("Insufficient signal to qualify")
    return QualificationResult(priority="low", status="needs_review", reasons=reasons)