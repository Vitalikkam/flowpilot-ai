"""Seed the database with demo data for portfolio screenshots and local testing.

Usage (from project root):
    docker compose exec api python seed.py

WARNING: This is destructive. It truncates all leads, analyses,
executions, and idempotency keys before inserting fresh synthetic data.
"""

import random
import uuid
from datetime import datetime, timedelta

from sqlalchemy import text

from app.core.database import SessionLocal, engine
from app.models import Lead, LeadAnalysis, WorkflowExecution


# ─── Demo data ─────────────────────────────────────────────
# Realistic, synthetic, and varied. No real client data.

DEMO_LEADS = [
    {
        "name": "Alex Morgan",
        "email": "alex@morgandigital.com",
        "company": "Morgan Digital",
        "message": "We need a custom web application with an $8,000 budget. Would like to start this month.",
        "source": "website",
        "status": "qualified",
        "priority": "high",
        "analysis": {
            "summary": "Custom web application project with defined budget and near-term timeline.",
            "category": "web_development",
            "budget_usd": 8000,
            "urgency": "high",
        },
        "days_ago": 0.3,
    },
    {
        "name": "Sarah Chen",
        "email": "s.chen@northwindlabs.io",
        "company": "Northwind Labs",
        "message": "Looking for help automating our customer onboarding workflow. Budget around $15k, timeline is flexible but we'd like to see a prototype soon.",
        "source": "form",
        "status": "qualified",
        "priority": "high",
        "analysis": {
            "summary": "Automation of customer onboarding workflow with substantial budget.",
            "category": "automation",
            "budget_usd": 15000,
            "urgency": "medium",
        },
        "days_ago": 0.8,
    },
    {
        "name": "Marcus Webb",
        "email": "marcus@webbconsulting.co",
        "company": "Webb Consulting",
        "message": "Need a Python backend developer for a 3-month contract. Starting ASAP.",
        "source": "email",
        "status": "qualified",
        "priority": "high",
        "analysis": {
            "summary": "Three-month Python backend contract starting immediately.",
            "category": "consulting",
            "budget_usd": None,
            "urgency": "high",
        },
        "days_ago": 1.2,
    },
    {
        "name": "Elena Popova",
        "email": "elena@brightline.dev",
        "company": "Brightline",
        "message": "Curious about your consulting rates.",
        "source": "website",
        "status": "needs_review",
        "priority": "low",
        "analysis": {
            "summary": "General pricing inquiry without project details.",
            "category": "other",
            "budget_usd": None,
            "urgency": "low",
        },
        "days_ago": 1.7,
    },
    {
        "name": "James O'Connor",
        "email": "james@oconnorandsons.com",
        "company": "O'Connor & Sons",
        "message": "Want to discuss a potential partnership. No rush.",
        "source": "email",
        "status": "needs_review",
        "priority": "low",
        "analysis": {
            "summary": "Partnership discussion without specifics or timeline.",
            "category": "other",
            "budget_usd": None,
            "urgency": "low",
        },
        "days_ago": 2.1,
    },
    {
        "name": "Priya Sharma",
        "email": "priya@fintechco.io",
        "company": "Fintech Co",
        "message": "We need to integrate our CRM with a custom AI lead scoring system. $20,000 budget, immediate start.",
        "source": "form",
        "status": "qualified",
        "priority": "high",
        "analysis": {
            "summary": "CRM integration with AI lead scoring, high budget, immediate timeline.",
            "category": "automation",
            "budget_usd": 20000,
            "urgency": "high",
        },
        "days_ago": 3.0,
    },
    {
        "name": "Yuki Tanaka",
        "email": "yuki@tanakastudio.jp",
        "company": "Tanaka Studio",
        "message": "Interested in a small automation project — Slack notifications from our booking system. Around $500.",
        "source": "website",
        "status": "qualified",
        "priority": "medium",
        "analysis": {
            "summary": "Small automation project for Slack notifications, modest budget.",
            "category": "automation",
            "budget_usd": 500,
            "urgency": "low",
        },
        "days_ago": 4.2,
    },
    {
        "name": "Rachel Kim",
        "email": "rachel@kimanalytics.com",
        "company": "Kim Analytics",
        "message": "Building a data pipeline. Need help with n8n workflows. Budget flexible.",
        "source": "form",
        "status": "qualified",
        "priority": "medium",
        "analysis": {
            "summary": "Data pipeline work using n8n, flexible budget.",
            "category": "automation",
            "budget_usd": None,
            "urgency": "medium",
        },
        "days_ago": 5.1,
    },
    {
        "name": "David Levin",
        "email": "david@levinlaw.com",
        "company": "Levin Law",
        "message": "Looking for a website redesign. Small budget.",
        "source": "website",
        "status": "pending",
        "priority": None,
        "analysis": None,
        "days_ago": 5.8,
    },
    {
        "name": "Anna Novak",
        "email": "anna@novakdesign.cz",
        "company": "Novak Design",
        "message": "Want to explore AI integration for our design tool. Let's talk.",
        "source": "email",
        "status": "qualified",
        "priority": "medium",
        "analysis": {
            "summary": "AI integration exploration for a design tool.",
            "category": "consulting",
            "budget_usd": None,
            "urgency": "medium",
        },
        "days_ago": 6.5,
    },
    {
        "name": "Omar Hassan",
        "email": "omar@hassanlogistics.ae",
        "company": "Hassan Logistics",
        "message": "Need custom dashboard for shipment tracking. $12,000 budget.",
        "source": "website",
        "status": "qualified",
        "priority": "high",
        "analysis": {
            "summary": "Custom shipment tracking dashboard with defined budget.",
            "category": "web_development",
            "budget_usd": 12000,
            "urgency": "medium",
        },
        "days_ago": 7.3,
    },
    {
        "name": "Lisa Romano",
        "email": "lisa@romanofoods.it",
        "company": "Romano Foods",
        "message": "Wrong number, sorry.",
        "source": "form",
        "status": "rejected",
        "priority": "low",
        "analysis": {
            "summary": "Not a business inquiry.",
            "category": "other",
            "budget_usd": None,
            "urgency": "low",
        },
        "days_ago": 8.9,
    },
    {
        "name": "Kevin Park",
        "email": "kevin@parkventures.vc",
        "company": "Park Ventures",
        "message": "Interested in AI automation for our portfolio companies. Would like to discuss options.",
        "source": "form",
        "status": "qualified",
        "priority": "medium",
        "analysis": {
            "summary": "AI automation inquiry from a venture firm for portfolio companies.",
            "category": "consulting",
            "budget_usd": None,
            "urgency": "low",
        },
        "days_ago": 10.1,
    },
    {
        "name": "Maya Patel",
        "email": "maya@patelhealth.com",
        "company": "Patel Health",
        "message": "Healthcare compliance-heavy project. Looking for quotes.",
        "source": "website",
        "status": "pending",
        "priority": None,
        "analysis": None,
        "days_ago": 11.4,
    },
    {
        "name": "Nicolas Fontaine",
        "email": "nicolas@fontaineav.fr",
        "company": "Fontaine AV",
        "message": "We need a booking system integrated with our existing calendar. ~€6,000 budget.",
        "source": "email",
        "status": "qualified",
        "priority": "medium",
        "analysis": {
            "summary": "Calendar-integrated booking system with defined budget.",
            "category": "web_development",
            "budget_usd": 6500,
            "urgency": "medium",
        },
        "days_ago": 12.6,
    },
]


# ─── Execution scenarios ───────────────────────────────────
# A few leads get a failed execution to make the reliability story visible.

FAILED_EXECUTIONS = {
    "elena@brightline.dev": {
        "stage": "ai_validation",
        "error": "summary is empty; urgency must be one of: low, medium, high",
    },
    "lisa@romanofoods.it": {
        "stage": "ai_validation",
        "error": "category must be one of: web_development, automation, consulting, other",
    },
}


def truncate_all():
    """Clear all demo-relevant tables. Idempotency keys are included."""
    with engine.connect() as conn:
        conn.execute(
            text(
                "TRUNCATE workflow_executions, lead_analyses, leads, "
                "idempotency_keys RESTART IDENTITY CASCADE"
            )
        )
        conn.commit()


def seed():
    random.seed(42)  # Deterministic — same data every run
    truncate_all()

    db = SessionLocal()
    now = datetime.utcnow()
    leads_created = 0
    analyses_created = 0
    executions_created = 0

    try:
        for spec in DEMO_LEADS:
            created_at = now - timedelta(days=spec["days_ago"])
            lead_id = uuid.uuid4()

            lead = Lead(
                id=lead_id,
                name=spec["name"],
                email=spec["email"],
                company=spec.get("company"),
                message=spec["message"],
                source=spec["source"],
                status=spec["status"],
                priority=spec.get("priority"),
                created_at=created_at,
                updated_at=created_at,
            )
            db.add(lead)
            leads_created += 1

            # Analysis
            if spec.get("analysis"):
                a = spec["analysis"]
                db.add(
                    LeadAnalysis(
                        id=uuid.uuid4(),
                        lead_id=lead_id,
                        summary=a["summary"],
                        category=a["category"],
                        budget_usd=a["budget_usd"],
                        urgency=a["urgency"],
                        model="llama3.2",
                        created_at=created_at + timedelta(seconds=4),
                    )
                )
                analyses_created += 1

            # Execution
            exec_spec = FAILED_EXECUTIONS.get(spec["email"])
            started = created_at + timedelta(seconds=2)

            if exec_spec:
                status = "failed"
                stage = exec_spec["stage"]
                error = exec_spec["error"]
                finished = started + timedelta(seconds=random.uniform(0.8, 2.5))
            elif spec["status"] == "pending":
                status = "running"
                stage = "created"
                error = None
                finished = None
            else:
                status = "success"
                stage = "completed"
                error = None
                finished = started + timedelta(seconds=random.uniform(1.5, 6.0))

            db.add(
                WorkflowExecution(
                    id=uuid.uuid4(),
                    lead_id=lead_id,
                    workflow_name="Lead Intake & AI Qualification",
                    status=status,
                    stage=stage,
                    error_message=error,
                    started_at=started,
                    finished_at=finished,
                )
            )
            executions_created += 1

        db.commit()
        print(
            f"✓ Seeded {leads_created} leads, "
            f"{analyses_created} analyses, "
            f"{executions_created} executions"
        )
    except Exception as exc:
        db.rollback()
        print(f"✗ Seed failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()