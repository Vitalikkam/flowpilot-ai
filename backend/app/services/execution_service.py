from datetime import datetime
from typing import Optional, Sequence
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import WorkflowExecution
from app.schemas import WorkflowExecutionCreate, WorkflowExecutionUpdate


def create_execution(
    db: Session, payload: WorkflowExecutionCreate
) -> WorkflowExecution:
    """Start a new execution record in 'running' state."""
    execution = WorkflowExecution(
        lead_id=payload.lead_id,
        workflow_name=payload.workflow_name,
        status="running",
        stage=payload.stage,
    )
    db.add(execution)
    db.commit()
    db.refresh(execution)
    return execution


def get_execution(db: Session, execution_id: UUID) -> Optional[WorkflowExecution]:
    return db.get(WorkflowExecution, execution_id)


def list_executions(
    db: Session,
    status: Optional[str] = None,
    lead_id: Optional[UUID] = None,
    workflow_name: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> Sequence[WorkflowExecution]:
    stmt = select(WorkflowExecution).order_by(WorkflowExecution.started_at.desc())
    if status is not None:
        stmt = stmt.where(WorkflowExecution.status == status)
    if lead_id is not None:
        stmt = stmt.where(WorkflowExecution.lead_id == lead_id)
    if workflow_name is not None:
        stmt = stmt.where(WorkflowExecution.workflow_name == workflow_name)
    stmt = stmt.limit(limit).offset(offset)
    return db.execute(stmt).scalars().all()


def update_execution(
    db: Session,
    execution: WorkflowExecution,
    payload: WorkflowExecutionUpdate,
) -> WorkflowExecution:
    """Apply a partial update. Sets finished_at when status leaves 'running'."""
    data = payload.model_dump(exclude_unset=True)

    # Do not reopen a finished execution.
    if execution.status in {"success", "failed"} and data.get("status") == "running":
        raise ValueError("Cannot reopen a finished execution")

    for field, value in data.items():
        setattr(execution, field, value)

    if execution.status in {"success", "failed"} and execution.finished_at is None:
        execution.finished_at = datetime.utcnow()

    db.commit()
    db.refresh(execution)
    return execution