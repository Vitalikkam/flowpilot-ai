from datetime import datetime
from typing import Optional, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


Category = Literal["web_development", "automation", "consulting", "other"]
Urgency = Literal["low", "medium", "high"]


class AIAnalysisPayload(BaseModel):
    """Strict schema for Ollama's structured output.

    This is the contract the local model must satisfy. Anything that
    doesn't match is rejected before it reaches the database.
    """
    summary: str
    category: Category
    budget_usd: Optional[float] = None
    urgency: Urgency


class LeadAnalysisResponse(BaseModel):
    """Analysis returned by the API."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    lead_id: UUID
    summary: str
    category: Optional[str]
    budget_usd: Optional[float]
    urgency: Optional[str]
    model: Optional[str]
    created_at: datetime