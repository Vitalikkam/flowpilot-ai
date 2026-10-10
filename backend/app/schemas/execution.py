from datetime import datetime
from typing import Optional, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


ExecutionStatus = Literal["running", "success", "failed"]


class WorkflowExecutionCreate(BaseModel):
    """Payload for creating an execution record."""
    lead_id: Optional[UUID] = None
    workflow_name: str
    status: ExecutionStatus = "running"
    stage: Optional[str] = None
    error_message: Optional[str] = None


class WorkflowExecutionUpdate(BaseModel):
    """Partial update for an execution record (used to close it out)."""
    status: Optional[ExecutionStatus] = None
    stage: Optional[str] = None
    error_message: Optional[str] = None
    finished_at: Optional[datetime] = None


class WorkflowExecutionResponse(BaseModel):
    """Execution record returned by the API."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    lead_id: Optional[UUID]
    workflow_name: str
    status: str
    stage: Optional[str]
    error_message: Optional[str]
    started_at: datetime
    finished_at: Optional[datetime]