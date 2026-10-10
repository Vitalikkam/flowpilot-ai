from typing import Literal
from pydantic import BaseModel


Priority = Literal["low", "medium", "high"]
QualificationStatus = Literal["qualified", "rejected", "needs_review"]


class QualificationRequest(BaseModel):
    """Payload sent by n8n after AI analysis.

    n8n forwards the validated AI analysis here. FastAPI applies
    deterministic rules and returns a priority + status + reasons.
    """
    category: str
    budget_usd: float | None = None
    urgency: str
    has_valid_contact: bool = True


class QualificationResult(BaseModel):
    """Output of the deterministic qualification logic."""
    priority: Priority
    status: QualificationStatus
    reasons: list[str]