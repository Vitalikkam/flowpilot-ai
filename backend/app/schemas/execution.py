from datetime import datetime
from typing import Optional, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


ExecutionStatus = Literal["running", "success", "failed"]


class WorkflowExecutionCreate(BaseModel):
    """Payload for creating an execution record (n8n logs a run start)."""
    lead_id: Optional[UUID] = None
    workflow_name: str
    stage: Optional[str] = None


class WorkflowExecutionUpdate(BaseModel):
    """Partial update used to move an execution through its lifecycle."""
    status: Optional[ExecutionStatus] = None
    stage: Optional[str] = None
    error_message: Optional[str] = None


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