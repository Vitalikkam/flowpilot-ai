from uuid import UUID
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Lead, LeadAnalysis


def upsert_analysis(
    db: Session,
    lead: Lead,
    summary: str,
    category: str,
    budget_usd: Optional[float],
    urgency: str,
    model: str,
) -> LeadAnalysis:
    """Create or update the analysis row for a lead.

    Idempotent: re-evaluating a lead updates its analysis rather than
    creating duplicates.
    """
    existing = db.execute(
        select(LeadAnalysis).where(LeadAnalysis.lead_id == lead.id)
    ).scalar_one_or_none()

    if existing is None:
        existing = LeadAnalysis(lead_id=lead.id)
        db.add(existing)

    existing.summary = summary
    existing.category = category
    existing.budget_usd = budget_usd
    existing.urgency = urgency
    existing.model = model

    db.commit()
    db.refresh(existing)
    return existing