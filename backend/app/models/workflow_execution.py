import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class WorkflowExecution(Base):
    __tablename__ = "workflow_executions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(
        UUID(as_uuid=True),
        ForeignKey("leads.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    workflow_name = Column(String(120), nullable=False)
    status = Column(String(30), nullable=False, default="running")
    stage = Column(String(60), nullable=True)
    error_message = Column(Text, nullable=True)

    started_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)

    lead = relationship("Lead", back_populates="executions")

    def __repr__(self) -> str:
        return f"<WorkflowExecution {self.id} status={self.status} stage={self.stage}>"