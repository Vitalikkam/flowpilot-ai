import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app import models  # noqa: F401  -- register models with Base
from app.core.database import Base, get_db
from app.main import app

TEST_DB_NAME = "flowpilot_test"

POSTGRES_USER = os.getenv("POSTGRES_USER", "flowpilot")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "change_me")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "db")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")

ADMIN_URL = (
    f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    f"@{POSTGRES_HOST}:{POSTGRES_PORT}/postgres"
)
TEST_DB_URL = (
    f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    f"@{POSTGRES_HOST}:{POSTGRES_PORT}/{TEST_DB_NAME}"
)


@pytest.fixture(scope="session", autouse=True)
def test_database():
    """Create the test DB once per session and drop it at the end."""
    admin_engine = create_engine(ADMIN_URL, isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as conn:
        exists = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :name"),
            {"name": TEST_DB_NAME},
        ).scalar()
        if not exists:
            conn.execute(text(f'CREATE DATABASE "{TEST_DB_NAME}"'))
    admin_engine.dispose()

    engine = create_engine(TEST_DB_URL)
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture
def db_engine():
    return create_engine(TEST_DB_URL)


@pytest.fixture(autouse=True)
def clean_tables(db_engine):
    """Truncate all tables after each test for isolation."""
    yield
    with db_engine.connect() as conn:
        conn.execute(
            text(
                "TRUNCATE workflow_executions, lead_analyses, leads "
                "RESTART IDENTITY CASCADE"
            )
        )
        conn.commit()
    db_engine.dispose()


@pytest.fixture
def db_session(db_engine):
    Session = sessionmaker(bind=db_engine, autoflush=False, autocommit=False)
    session = Session()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db_session):
    """TestClient with the app's DB dependency overridden to the test session."""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()