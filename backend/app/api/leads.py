from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas import LeadCreate, LeadResponse, LeadUpdate, EvaluateLeadRequest, EvaluateLeadResponse
from app.services import lead_service, analysis_service, qualification

router = APIRouter(prefix="/api/leads", tags=["leads"])


@router.post("", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead(payload: LeadCreate, db: Session = Depends(get_db)):
    return lead_service.create_lead(db, payload)


@router.get("", response_model=list[LeadResponse])
def list_leads(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    return lead_service.list_leads(
        db, status=status_filter, priority=priority, limit=limit, offset=offset
    )


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: UUID, db: Session = Depends(get_db)):
    lead = lead_service.get_lead(db, lead_id)
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.patch("/{lead_id}", response_model=LeadResponse)
def update_lead(lead_id: UUID, payload: LeadUpdate, db: Session = Depends(get_db)):
    lead = lead_service.get_lead(db, lead_id)
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead_service.update_lead(db, lead, payload)

@router.post("/{lead_id}/evaluate", response_model=EvaluateLeadResponse)
def evaluate_lead(
    lead_id: UUID,
    payload: EvaluateLeadRequest,
    db: Session = Depends(get_db),
):
    lead = lead_service.get_lead(db, lead_id)
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")

    analysis = analysis_service.upsert_analysis(
        db,
        lead=lead,
        summary=payload.summary,
        category=payload.category,
        budget_usd=payload.budget_usd,
        urgency=payload.urgency,
        model=payload.model,
    )

    result = qualification.qualify(
        category=payload.category,
        budget_usd=payload.budget_usd,
        urgency=payload.urgency,
        has_valid_contact=payload.has_valid_contact,
    )

    lead_service.apply_classification(
        db, lead, status=result.status, priority=result.priority
    )

    return EvaluateLeadResponse(
        lead_id=lead.id,
        analysis_id=analysis.id,
        priority=result.priority,
        status=result.status,
        reasons=result.reasons,
    )