import hashlib
from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.models import IdempotencyKey


def compute_fallback_key(email: str, message: str) -> str:
    """Deterministic key derived from email + message.

    Used when the client doesn't send an Idempotency-Key header.
    Catches accidental double-submits with identical content.
    """
    digest = hashlib.sha256(f"{email.lower()}::{message}".encode()).hexdigest()
    return f"auto:{digest[:60]}"


def find_existing(db: Session, key: str) -> Optional[UUID]:
    """Return the lead_id associated with this key, or None."""
    row = db.get(IdempotencyKey, key)
    return row.lead_id if row else None


def record(db: Session, key: str, lead_id: UUID) -> None:
    """Persist the key → lead_id mapping.

    Caller must commit. Idempotent: if the key already exists, do nothing.
    """
    existing = db.get(IdempotencyKey, key)
    if existing is None:
        db.add(IdempotencyKey(key=key, lead_id=lead_id))