from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas import (
    WorkflowExecutionCreate,
    WorkflowExecutionResponse,
    WorkflowExecutionUpdate,
)
from app.services import execution_service

router = APIRouter(prefix="/api/executions", tags=["executions"])


@router.post("", response_model=WorkflowExecutionResponse, status_code=status.HTTP_201_CREATED)
def create_execution(
    payload: WorkflowExecutionCreate, db: Session = Depends(get_db)
):
    return execution_service.create_execution(db, payload)


@router.get("", response_model=list[WorkflowExecutionResponse])
def list_executions(
    status_filter: Optional[str] = Query(None, alias="status"),
    lead_id: Optional[UUID] = Query(None),
    workflow_name: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    return execution_service.list_executions(
        db,
        status=status_filter,
        lead_id=lead_id,
        workflow_name=workflow_name,
        limit=limit,
        offset=offset,
    )


@router.get("/{execution_id}", response_model=WorkflowExecutionResponse)
def get_execution(execution_id: UUID, db: Session = Depends(get_db)):
    execution = execution_service.get_execution(db, execution_id)
    if execution is None:
        raise HTTPException(status_code=404, detail="Execution not found")
    return execution


@router.patch("/{execution_id}", response_model=WorkflowExecutionResponse)
def update_execution(
    execution_id: UUID,
    payload: WorkflowExecutionUpdate,
    db: Session = Depends(get_db),
):
    execution = execution_service.get_execution(db, execution_id)
    if execution is None:
        raise HTTPException(status_code=404, detail="Execution not found")
    try:
        return execution_service.update_execution(db, execution, payload)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc))