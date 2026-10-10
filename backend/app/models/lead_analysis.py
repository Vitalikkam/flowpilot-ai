import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class LeadAnalysis(Base):
    __tablename__ = "lead_analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(
        UUID(as_uuid=True),
        ForeignKey("leads.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    summary = Column(Text, nullable=False)
    category = Column(String(50), nullable=True)
    budget_usd = Column(Float, nullable=True)
    urgency = Column(String(20), nullable=True)
    model = Column(String(80), nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    lead = relationship("Lead", back_populates="analysis")

    def __repr__(self) -> str:
        return f"<LeadAnalysis lead_id={self.lead_id} category={self.category}>"