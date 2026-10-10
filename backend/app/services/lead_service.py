from typing import Optional, Sequence
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Lead
from app.schemas import LeadCreate, LeadUpdate


def create_lead(db: Session, payload: LeadCreate) -> Lead:
    """Create and persist a new lead in pending state."""
    lead = Lead(
        name=payload.name,
        email=payload.email,
        company=payload.company,
        message=payload.message,
        source=payload.source,
        status="pending",
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


def get_lead(db: Session, lead_id: UUID) -> Optional[Lead]:
    """Return a lead by id, or None."""
    return db.get(Lead, lead_id)


def list_leads(
    db: Session,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> Sequence[Lead]:
    """List leads with optional status and priority filters."""
    stmt = select(Lead).order_by(Lead.created_at.desc())
    if status is not None:
        stmt = stmt.where(Lead.status == status)
    if priority is not None:
        stmt = stmt.where(Lead.priority == priority)
    stmt = stmt.limit(limit).offset(offset)
    return db.execute(stmt).scalars().all()


def update_lead(db: Session, lead: Lead, payload: LeadUpdate) -> Lead:
    """Apply a partial update to a lead."""
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(lead, field, value)
    db.commit()
    db.refresh(lead)
    return lead