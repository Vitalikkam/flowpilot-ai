import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    email = Column(String(320), nullable=False)
    company = Column(String(200), nullable=True)
    message = Column(Text, nullable=False)
    source = Column(String(50), nullable=False, default="website")

    status = Column(String(30), nullable=False, default="pending")
    priority = Column(String(20), nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    analysis = relationship(
        "LeadAnalysis",
        back_populates="lead",
        uselist=False,
        cascade="all, delete-orphan",
    )
    executions = relationship(
        "WorkflowExecution",
        back_populates="lead",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Lead {self.id} {self.email} status={self.status}>"