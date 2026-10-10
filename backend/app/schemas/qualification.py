from typing import Literal, Optional
from uuid import UUID

from pydantic import BaseModel


Priority = Literal["low", "medium", "high"]
QualificationStatus = Literal["qualified", "rejected", "needs_review"]


class EvaluateLeadRequest(BaseModel):
    """Payload sent by n8n after AI analysis.

    Combines the AI output fields with metadata the backend needs
    to make deterministic decisions and persist the analysis.
    """
    summary: str
    category: str
    budget_usd: Optional[float] = None
    urgency: str
    model: str = "llama3.2"
    has_valid_contact: bool = True


class QualificationResult(BaseModel):
    """Output of the deterministic qualification logic."""
    priority: Priority
    status: QualificationStatus
    reasons: list[str]


class EvaluateLeadResponse(BaseModel):
    """Full response from the evaluate endpoint."""
    lead_id: UUID
    analysis_id: UUID
    priority: Priority
    status: QualificationStatus
    reasons: list[str]