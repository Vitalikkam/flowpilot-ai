from datetime import datetime
from typing import Optional, Literal
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, ConfigDict


LeadStatus = Literal["pending", "qualified", "rejected", "needs_review"]
LeadPriority = Literal["low", "medium", "high"]
LeadSource = Literal["website", "email", "form", "api", "other"]


class LeadCreate(BaseModel):
    """Payload for creating a new lead. Sent by n8n or the dashboard."""
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    company: Optional[str] = Field(None, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)
    source: LeadSource = "website"


class LeadUpdate(BaseModel):
    """Partial update for a lead. All fields optional."""
    status: Optional[LeadStatus] = None
    priority: Optional[LeadPriority] = None


class LeadResponse(BaseModel):
    """Lead returned by the API."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    email: EmailStr
    company: Optional[str]
    message: str
    source: str
    status: str
    priority: Optional[str]
    created_at: datetime
    updated_at: datetime