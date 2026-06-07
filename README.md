# AI Job Assistant

> An AI-powered, full-stack portfolio project that helps job seekers tailor their applications. Upload a resume, paste a job description, and get an AI match score, a list of missing skills, and a custom-generated cover letter.

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Folder Structure](#folder-structure)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [Running with Docker](#running-with-docker)
9. [AI Providers](#ai-providers)
10. [MVP Scope](#mvp-scope)
11. [Future Improvements](#future-improvements)
12. [Project Documents](#project-documents)
13. [License](#license)

---

## Overview

**AI Job Assistant** is designed as a portfolio-grade, full-stack application that demonstrates modern web development, clean API design, database modeling, AI integration, and DevOps practices.

The core idea is simple but valuable: job seekers often send the same generic resume and cover letter to every job. This tool helps them understand **how well they match a specific role** and **how to improve their application** for it.

The user journey looks like this:

1. The user uploads a resume (PDF or text).
2. The user pastes or uploads a job description.
3. The system extracts text and key skills from both.
4. An AI provider compares them and returns:
   - A **match score** (0–100).
   - A list of **missing or weak skills**.
   - A **tailored cover letter** for that specific job.
5. The user can review, copy, and refine the results.

---

## Key Features

- **Resume Upload & Parsing** — Accept PDF/text resumes and extract clean text.
- **Job Description Input** — Paste raw text or upload a file.
- **AI Match Score** — A numeric compatibility score with a short explanation.
- **Skill Gap Analysis** — Highlights skills present in the job description but missing from the resume.
- **Cover Letter Generation** — Produces a personalized cover letter draft.
- **Mock AI Provider** — Run the whole app locally without API keys or cost.
- **History** — Saved comparisons stored in PostgreSQL for later review.

---

## Tech Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| **Frontend** | Next.js, TypeScript, Tailwind CSS                       |
| **Backend**  | FastAPI, Python                                         |
| **Database** | PostgreSQL                                              |
| **AI**       | Claude / OpenAI provider, plus a Mock provider for dev  |
| **DevOps**   | Docker, docker-compose                                  |
| **Hosting**  | Vercel (frontend), container host (backend + database)  |

---

## Architecture

The system follows a clean, decoupled client–server architecture.

```
┌──────────────┐         HTTPS / REST        ┌──────────────┐
│              │ ──────────────────────────> │              │
│  Next.js     │                             │  FastAPI     │
│  Frontend    │ <────────────────────────── │  Backend     │
│  (Vercel)    │         JSON responses      │              │
└──────────────┘                             └──────┬───────┘
                                                    │
                                  ┌─────────────────┼─────────────────┐
                                  │                 │                 │
                                  ▼                 ▼                 ▼
                          ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
                          │ PostgreSQL  │   │ AI Provider │   │ File / Text │
                          │  Database   │   │ Abstraction │   │  Parsing    │
                          └─────────────┘   └──────┬──────┘   └─────────────┘
                                                   │
                              ┌────────────────────┼────────────────────┐
                              ▼                    ▼                    ▼
                       ┌────────────┐      ┌────────────┐       ┌────────────┐
                       │ Mock       │      │ OpenAI     │       │ Claude     │
                       │ Provider   │      │ Provider   │       │ Provider   │
                       └────────────┘      └────────────┘       └────────────┘
```

**Design principles:**

- **Separation of concerns** — Frontend handles UI/UX; backend handles logic, parsing, and AI orchestration.
- **Provider abstraction** — The AI layer is behind an interface, so providers (Mock/OpenAI/Claude) are swappable via configuration.
- **Stateless API** — The backend exposes clean REST endpoints; persistence lives in PostgreSQL.
- **Local-first development** — The Mock provider lets contributors run everything without paid API keys.

---

## Folder Structure

> **Status:** Epic 1 (Infrastructure & DevOps Foundation) is complete. The files
> marked ✅ exist now. Items without a mark are part of the **planned/target**
> structure and arrive in later epics.

```
ai-job-assistant/
├── README.md                  # ✅ This file
├── PROJECT_PLAN.md            # ✅ Scrum roadmap, architecture, milestones
├── TODO.md                    # ✅ Epics + detailed task checklist
├── docker-compose.yml         # ✅ Orchestrates frontend, backend, database
├── .env.example               # ✅ Sample environment variables
├── .gitignore                 # ✅
│
├── frontend/                  # Next.js + TypeScript + Tailwind
│   ├── app/                   # ✅ App Router pages and layouts
│   │   ├── layout.tsx         # ✅ Root layout + top nav (Analyze/History)
│   │   ├── page.tsx           # ✅ Landing page (features + analyze + health)
│   │   ├── history/           # ✅ History feature routes
│   │   │   ├── page.tsx       # ✅ /history (list)
│   │   │   └── [id]/page.tsx  # ✅ /history/[id] (detail)
│   │   └── globals.css        # ✅ Tailwind entry styles
│   ├── components/            # ✅ Reusable UI components
│   │   ├── Card.tsx           # ✅ Card container
│   │   ├── Loading.tsx        # ✅ Spinner / loading state
│   │   ├── ErrorMessage.tsx   # ✅ Error state + retry
│   │   ├── HealthCheck.tsx    # ✅ Backend connectivity widget
│   │   ├── AnalyzeForm.tsx    # ✅ Resume upload + job description form
│   │   ├── AnalysisResult.tsx # ✅ Score, skills, cover letter display
│   │   ├── HistoryList.tsx    # ✅ Saved comparisons list + delete
│   │   ├── ComparisonDetail.tsx # ✅ Detail view (reuses AnalysisResult)
│   │   └── CopyButton.tsx     # ✅ Copy-to-clipboard button
│   ├── lib/                   # ✅ API client, config, shared types
│   │   ├── api.ts             # ✅ Typed fetch wrapper + ApiError
│   │   ├── config.ts          # ✅ Reads NEXT_PUBLIC_ env vars
│   │   └── types.ts           # ✅ Shared TypeScript types
│   ├── package.json           # ✅
│   ├── tsconfig.json          # ✅
│   ├── next.config.js         # ✅
│   ├── tailwind.config.ts     # ✅
│   ├── postcss.config.js      # ✅
│   └── Dockerfile             # ✅
│
├── backend/                   # FastAPI + Python
│   ├── app/
│   │   ├── main.py            # ✅ FastAPI entry point + /health endpoint
│   │   ├── core/              # ✅ Config (settings) + logging
│   │   │   ├── config.py      # ✅ Env-driven settings
│   │   │   └── logging.py     # ✅ Logging setup
│   │   ├── db/                # ✅ SQLAlchemy base, session, get_db
│   │   │   ├── base.py        # ✅ Declarative Base
│   │   │   ├── base_all.py    # ✅ Imports all models for Alembic
│   │   │   └── session.py     # ✅ Engine + SessionLocal + get_db
│   │   ├── models/            # ✅ SQLAlchemy ORM models
│   │   │   └── comparison.py  # ✅ Comparison model
│   │   ├── schemas/           # ✅ Pydantic request/response schemas
│   │   │   └── comparison.py  # ✅ Comparison schemas
│   │   ├── api/               # ✅ Routers/endpoints
│   │   │   └── comparisons.py # ✅ create + list + detail + delete
│   │   ├── services/          # ✅ Business logic
│   │   │   ├── parsing.py     # ✅ PDF/text extraction
│   │   │   └── skills.py      # ✅ Keyword skill extraction
│   │   └── ai/                # ✅ Provider abstraction
│   │       ├── base.py        # ✅ AIProvider interface + AnalysisResult
│   │       ├── mock_provider.py    # ✅ Deterministic mock provider
│   │       ├── openai_provider.py  # ✅ OpenAI stub (Epic 6)
│   │       ├── claude_provider.py  # ✅ Claude stub (Epic 6)
│   │       ├── factory.py     # ✅ Provider selection via AI_PROVIDER
│   │       └── prompts/       # ✅ Prompt templates + loader
│   ├── alembic/               # ✅ Migration environment + versions/
│   ├── alembic.ini            # ✅ Alembic config
│   ├── tests/                 #    Pytest test suite (later)
│   ├── requirements.txt       # ✅
│   └── Dockerfile             # ✅
│
└── docs/                      # ✅ Extended documentation
```

---

## Getting Started

> Epic 1 is implemented. You can run the full stack locally with Docker today.

### Prerequisites

- Docker & docker-compose (the only requirement to run via Docker)
- *(Optional, for running services without Docker)* Node.js 20+ and Python 3.11+

### Quick start (Docker — recommended)

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Build and start all services (frontend, backend, db)
docker-compose up --build
```

Then open:

- **Frontend:** http://localhost:3000 — shows a "Backend health check" card that
  should display **"Backend is reachable"** with the JSON `{"status":"ok",...}`.
- **Backend health endpoint:** http://localhost:8000/health
- **Backend API docs (Swagger):** http://localhost:8000/docs

To stop the services:

```bash
# Press Ctrl+C, then:
docker-compose down

# To also remove the database volume (wipes data):
docker-compose down -v
```

---

## Environment Variables

> Defined here for planning. The actual `.env.example` file is created during implementation.

| Variable             | Description                                          | Example                  |
| -------------------- | ---------------------------------------------------- | ------------------------ |
| `AI_PROVIDER`        | Which AI provider to use: `mock`, `openai`, `claude` | `mock`                   |
| `OPENAI_API_KEY`     | API key for OpenAI (if used)                         | `sk-...`                 |
| `ANTHROPIC_API_KEY`  | API key for Claude (if used)                         | `sk-ant-...`             |
| `DATABASE_URL`       | PostgreSQL connection string                         | `postgresql://...`       |
| `BACKEND_URL`        | Base URL the frontend uses to call the API           | `http://localhost:8000`  |

---

## Running with Docker

The `docker-compose.yml` defines three services:

- **frontend** — Next.js app (port 3000)
- **backend** — FastAPI app (port 8000)
- **db** — PostgreSQL (port 5432)

This makes the project reproducible across machines and easy to demo.

### Common commands

```bash
# Start everything (rebuilding images if needed)
docker-compose up --build

# Start in the background (detached)
docker-compose up --build -d

# View logs (all services, follow mode)
docker-compose logs -f

# View logs for a single service
docker-compose logs -f backend

# Rebuild a single service
docker-compose build backend

# Stop and remove containers (keeps the database volume)
docker-compose down

# Stop and also delete the database volume
docker-compose down -v
```

### Verify it works

```bash
# Backend health endpoint should return {"status":"ok",...}
curl http://localhost:8000/health
```

> **Note on running without Docker:** the frontend image installs dependencies
> during the build, so no local `node_modules` is required to run via Docker. If
> you instead run the frontend directly on your host (`npm install && npm run
> dev` inside `frontend/`), a `package-lock.json` will be generated for you.

---

## Backend Setup & Database Migrations

The backend is a structured FastAPI app (Epic 2). Configuration is read from
environment variables via `app/core/config.py`, the database layer uses
SQLAlchemy, and schema changes are managed with **Alembic**.

### Applying migrations (with Docker — recommended)

After the stack is up (`docker-compose up --build`), create the database tables
by running Alembic **inside** the backend container:

```bash
# Apply all migrations against the running PostgreSQL service
docker-compose exec backend alembic upgrade head
```

This creates the `comparisons` table. Verify it:

```bash
docker-compose exec db psql -U postgres -d ai_job_assistant -c "\dt"
```

### Creating a new migration (after changing models)

```bash
# Autogenerate a migration from model changes, then apply it
docker-compose exec backend alembic revision --autogenerate -m "describe change"
docker-compose exec backend alembic upgrade head
```

### Running the backend without Docker (optional)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Point at a reachable PostgreSQL instance
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_job_assistant

alembic upgrade head
uvicorn app.main:app --reload
```

> **Note:** The backend image gained new dependencies in Epic 2 (SQLAlchemy,
> Alembic, psycopg2). If you already had the stack running from Epic 1, rebuild
> it with `docker-compose up --build` so the backend container installs them.

## Frontend Setup & Structure

The frontend is a Next.js (App Router) app written in TypeScript and styled with
Tailwind CSS (Epic 3). It is organized for clarity and reuse:

- **`lib/`** — non-UI logic:
  - `config.ts` centralizes `NEXT_PUBLIC_` environment variables.
  - `types.ts` holds shared types that mirror the backend API contract.
  - `api.ts` is a typed `fetch` wrapper that throws `ApiError` on failure, so
    components get consistent error handling.
- **`components/`** — reusable presentational pieces: `Card`, `Loading`,
  `ErrorMessage`, and `HealthCheck` (which proves frontend↔backend connectivity).
- **`app/`** — routes and layout. `page.tsx` is the landing page: a hero, a
  preview of upcoming features ("Coming soon"), and the live health check.

> Resume upload and AI analysis are **not** implemented yet — the feature cards
> on the landing page are previews for later epics.

### Running the frontend

Easiest path is Docker (see [Quick start](#quick-start-docker--recommended)):
open http://localhost:3000.

To run it directly on your host instead:

```bash
cd frontend
npm install
# Optional: point at a non-default backend
export NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
npm run dev
```

The app expects the backend at `NEXT_PUBLIC_BACKEND_URL` (defaults to
`http://localhost:8000`). The landing page should show **"Backend is reachable"**
once the backend is running; otherwise it shows an error with a **Try again**
button.

## Analyze a Resume (Core Feature)

The end-to-end value loop: submit a resume + job description, and the backend
parses the inputs, runs the AI provider, and returns a **match score**, **skill
gaps**, and a **tailored cover letter** — then saves the record.

> Analysis currently uses the deterministic **mock provider** (Epic 6). Real
> OpenAI/Claude calls arrive in a later epic. No authentication and no history
> page yet.

### What happens on submit

1. Frontend sends `multipart/form-data` to `POST /api/comparisons` with a
   `resume` file and a `job_description` text field.
2. Backend validates the file type (`.pdf`/`.txt`), file size (≤ 5 MB), and the
   job description length (30–20,000 chars).
3. Backend extracts clean text (`pypdf` for PDFs, UTF-8 decode for text).
4. Backend detects known skills in the resume and the job description.
5. Backend runs the configured AI provider's `analyze()` to compute the score,
   missing skills, summary, and cover letter. Failures return a clear error
   (e.g. `501` if a real provider is selected but not implemented).
6. Backend stores `resume_text`, `job_description_text`, `extracted_skills`
   (including the `matched` list), `score`, `missing_skills`, `summary`,
   `cover_letter`, and `provider`, then returns the full record.

### Using it from the UI

1. Make sure migrations are applied (see below) and the stack is running.
2. Open http://localhost:3000.
3. In **"Analyze a resume against a job"**, choose a `.pdf` or `.txt` resume,
   paste a job description, and click **Analyze**.
4. You'll see the **match score**, **matched** and **missing** skills, a short
   **summary**, and the generated **cover letter** with a **Copy** button.

### Applying migrations

The schema grew over Epics 4 and 6 (`extracted_skills`, then `summary`), so run
migrations after rebuilding:

```bash
docker-compose up --build
docker-compose exec backend alembic upgrade head
```

### Trying it from the command line

```bash
# Plain-text resume example
printf "Experienced Python developer skilled in FastAPI, Docker and PostgreSQL." > resume.txt

curl -X POST http://localhost:8000/api/comparisons \
  -F "resume=@resume.txt;type=text/plain" \
  -F "job_description=We need a backend engineer with Python, FastAPI, AWS and Kubernetes experience for our team."
```

The response includes `score`, `missing_skills`, `summary`, `cover_letter`,
`provider`, and `extracted_skills` (with `resume`, `job_description`, and
`matched`).

## History (Epic 7)

Every analysis is saved, and you can revisit, inspect, and delete past
comparisons. No authentication — all records are shared in this single-user dev
setup. No new database tables were added; history reuses the existing
`comparisons` table.

### Endpoints

| Method   | Path                       | Description                                  |
| -------- | -------------------------- | -------------------------------------------- |
| `GET`    | `/api/comparisons`         | List saved comparisons (compact), newest first |
| `GET`    | `/api/comparisons/{id}`    | Fetch one full comparison (`404` if missing) |
| `DELETE` | `/api/comparisons/{id}`    | Delete one comparison (`404` if missing)     |

The **list** returns a compact item (`id`, `score`, `provider`, `summary`,
`missing_skills`, `extracted_skills`, `created_at`) — it omits heavy fields like
`resume_text` and `cover_letter`. The **detail** endpoint returns the full
`ComparisonRead` (including the raw inputs and cover letter).

### Using it from the UI

1. Click **History** in the top navigation (or visit http://localhost:3000/history).
2. Each row shows the id, score, provider, created date, a short summary, and
   missing skills, with **View** and **Delete** actions.
3. **View** opens `/history/[id]`, which reuses the `AnalysisResult` component to
   show the score, matched/missing skills, summary, and cover letter (with copy),
   plus the original resume and job description text.
4. **Delete** removes the record (with a confirmation prompt).

### Trying it from the command line

```bash
# List
curl -s http://localhost:8000/api/comparisons

# Detail (replace 1 with a real id)
curl -s http://localhost:8000/api/comparisons/1

# Delete
curl -s -X DELETE http://localhost:8000/api/comparisons/1
```

## AI Providers (Epic 5)

The backend defines a single **provider interface** (`app/ai/base.py`) so the
rest of the app depends only on an abstraction. Providers are swapped purely via
the `AI_PROVIDER` environment variable — no code changes required.

### Architecture

```
            app code  ──►  get_ai_provider()  ──►  AIProvider.analyze(...)
                              (factory.py)                │
                                                          ▼
                                                  AnalysisResult
                              ┌───────────────────────────┴───────────────┐
                              ▼                  ▼                          ▼
                       MockAIProvider     OpenAIProvider            ClaudeProvider
                       (deterministic)    (stub → Epic 6)           (stub → Epic 6)
```

- **`AIProvider`** (interface): one method, `analyze(resume_text,
  job_description_text) -> AnalysisResult`.
- **`AnalysisResult`** (dataclass): `score`, `missing_skills`, `summary`,
  `cover_letter`, `provider` (+ `matched_skills` for context). These map onto the
  `Comparison` columns persisted in a later epic.
- **`get_ai_provider()`** (`factory.py`): returns the implementation named by
  `AI_PROVIDER`. Unknown names raise `UnknownProviderError`. At startup the app
  resolves the provider and logs it (or logs a clear error) without crashing.

### Implementations

- **Mock Provider** — Fully implemented and **deterministic**: the same inputs
  always produce the same output. It derives the score from keyword skill
  overlap and renders a templated summary + cover letter. No API keys, no cost —
  ideal for local development, tests, and CI. This is the default
  (`AI_PROVIDER=mock`).
- **OpenAI Provider** — **Stub** for now. Recognized by the factory but
  `analyze()` raises `NotImplementedError`. Real calls arrive in Epic 6.
- **Claude Provider** — **Stub** for now, same as above.

### Prompt templates

Prompt text for the real providers lives in `app/ai/prompts/` as editable
`.txt` files (`system`, `match_score`, `skill_gap`, `cover_letter`) with
`{resume_text}` / `{job_description_text}` placeholders. A small loader
(`prompts/__init__.py`) renders them. **The mock provider does not use these** —
it is self-contained. They are scaffolding for Epic 6.

> **Note:** As of Epic 6 the provider is wired into `POST /api/comparisons`,
> which calls `analyze()` and persists the result. The mock provider is the
> default; OpenAI/Claude remain stubs until a later epic.

---

## MVP Scope

The Minimum Viable Product focuses on the core value loop:

1. Upload resume + paste job description.
2. Get a match score and skill gap list.
3. Generate one tailored cover letter.
4. Works fully with the Mock provider locally.

Anything beyond this (accounts, dashboards, analytics) is intentionally deferred — see [Future Improvements](#future-improvements).

---

## Future Improvements

- User authentication and saved profiles.
- Multiple resume versions and A/B comparison.
- Rich analytics dashboard (score trends over time).
- Export cover letters to PDF/DOCX.
- Browser extension to capture job postings.
- Multi-language support.
- Rate limiting, caching, and observability.

---

## Project Documents

- **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** — Scrum-style roadmap, sprints, architecture details, and milestones.
- **[TODO.md](./TODO.md)** — Detailed epic-and-task checklist for tracking progress.

---

## License

MIT (to be confirmed by the project owner).
