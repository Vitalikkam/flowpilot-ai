import os
from fastapi import FastAPI
from sqlalchemy import create_engine, text

app = FastAPI(title="FlowPilot AI API")

# Read database configuration from environment variables
POSTGRES_USER = os.getenv("POSTGRES_USER", "flowpilot")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "change_me")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "db")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "flowpilot")

DATABASE_URL = (
    f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    f"@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)

engine = create_engine(DATABASE_URL)


@app.get("/health")
def health_check():
    """Check API status and database connectivity."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as exc:
        return {"status": "error", "database": "disconnected", "detail": str(exc)}