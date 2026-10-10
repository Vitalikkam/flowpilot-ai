# FlowPilot AI

AI-powered business automation platform. Combines n8n orchestration, a local AI model (Ollama), a FastAPI backend, PostgreSQL, and a React dashboard.

## Status
🚧 Under construction. Chapter 2 (Local Infrastructure) complete. Backend and workflow under development.

## Architecture

    React + TypeScript Dashboard
                 ↓
          FastAPI Backend
                 ↓
    ┌──────┬─────┴────┬─────────┐
    │      │          │         │
 PostgreSQL n8n    Ollama   (Logs)
                     ↑
              Local AI model

- **n8n** — workflow orchestration and external integrations
- **Ollama** — local AI inference (no paid AI APIs)
- **FastAPI** — business rules, validation, dashboard API
- **PostgreSQL** — persistence for leads, analyses, executions
- **React + TypeScript** — dashboard (Chapter 6)

## Stack

| Layer | Technology |
|---|---|
| Workflow orchestration | n8n Community Edition |
| AI inference | Ollama (`llama3.2`) |
| Backend API | Python + FastAPI |
| Frontend | React + TypeScript + Vite |
| Database | PostgreSQL 16 |
| Local runtime | Docker Compose |
| Tests | pytest + HTTPX |

## Prerequisites

- Docker and Docker Compose installed
- Ollama installed on the host (macOS or Linux)
- `llama3.2` model pulled: `ollama pull llama3.2`
- On macOS: start Ollama with `OLLAMA_HOST=0.0.0.0:11434 ollama serve`
- On Linux: configure systemd override for `OLLAMA_HOST=0.0.0.0:11434`

## Local Setup

1. Clone the repository:

       git clone https://github.com/Vitalikkam/flowpilot-ai.git
       cd flowpilot-ai

2. Create your local `.env` from the example:

       cp .env.example .env

   Then edit `.env` and set a real `POSTGRES_PASSWORD`.

3. Start the stack:

       docker compose up -d

4. Verify:

       curl http://127.0.0.1:8000/health
       docker compose exec n8n wget -qO- http://api:8000/health

   Both should return `{"status":"ok","database":"connected"}`.

5. Open the services:

   - n8n editor: http://localhost:5678
   - FastAPI docs: http://127.0.0.1:8000/docs

## Repository Structure

    flowpilot-ai/
    ├── backend/           FastAPI application
    ├── frontend/          React + TypeScript dashboard (in progress)
    ├── n8n/workflows/     Exported n8n workflow JSON
    ├── docker-compose.yml
    ├── .env.example
    └── README.md

## Security Notes

- All services bind to `127.0.0.1` only.
- Do not expose n8n or Ollama to the public internet.
- Secrets live in `.env` which is not committed.
- Use Tailscale or a similar tool for private remote access.

## Roadmap

- [x] Chapter 1 — Scope and repository skeleton
- [x] Chapter 2 — Local infrastructure
- [ ] Chapter 3 — Backend core (models, endpoints, tests)
- [ ] Chapter 4 — n8n workflow
- [ ] Chapter 5 — Local AI integration
- [ ] Chapter 6 — React dashboard
- [ ] Chapter 7 — Reliability and security
- [ ] Chapter 8 — Tests, docs, portfolio