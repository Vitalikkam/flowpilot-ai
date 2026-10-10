from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status, Header
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas import (
    EvaluateLeadRequest,
    EvaluateLeadResponse,
    LeadAnalysisResponse,
    LeadCreate,
    LeadResponse,
    LeadUpdate,
)
from app.services import lead_service, analysis_service, qualification, idempotency_service

router = APIRouter(prefix="/api/leads", tags=["leads"])


@router.post("", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead(
    payload: LeadCreate,
    db: Session = Depends(get_db),
    idempotency_key: Optional[str] = Header(None, alias="Idempotency-Key"),
):
    # Determine the effective key: client-supplied, or derived from payload.
    key = (
        idempotency_key.strip()
        if idempotency_key and idempotency_key.strip()
        else idempotency_service.compute_fallback_key(
            email=str(payload.email), message=payload.message
        )
    )

    # If we've seen this key before, return the existing lead.
    existing_lead_id = idempotency_service.find_existing(db, key)
    if existing_lead_id is not None:
        existing = lead_service.get_lead(db, existing_lead_id)
        if existing is not None:
            return existing
        # Lead was deleted — fall through and create a new one,
        # then re-record the key against it.

    lead = lead_service.create_lead(db, payload)
    idempotency_service.record(db, key, lead.id)
    db.commit()
    db.refresh(lead)
    return lead


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


@router.get("/{lead_id}/analysis", response_model=LeadAnalysisResponse)
def get_lead_analysis(lead_id: UUID, db: Session = Depends(get_db)):
    lead = lead_service.get_lead(db, lead_id)
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")

    analysis = analysis_service.get_analysis(db, lead_id)
    if analysis is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis