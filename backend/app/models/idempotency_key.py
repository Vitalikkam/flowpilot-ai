import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class IdempotencyKey(Base):
    __tablename__ = "idempotency_keys"

    key = Column(String(128), primary_key=True)
    lead_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<IdempotencyKey {self.key} lead_id={self.lead_id}>"