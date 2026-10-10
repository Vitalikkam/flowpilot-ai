from fastapi import FastAPI
from sqlalchemy import text

from app.core.database import engine

app = FastAPI(title="FlowPilot AI API")


@app.get("/health")
def health_check():
    """Check API status and database connectivity."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as exc:
        return {"status": "error", "database": "disconnected", "detail": str(exc)}