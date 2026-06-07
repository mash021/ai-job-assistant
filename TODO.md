# TODO — AI Job Assistant

A detailed, epic-based checklist for tracking progress. Each **epic** maps roughly to a sprint in `PROJECT_PLAN.md`. Check items off (`[x]`) as they are completed.

**Legend:** `[ ]` not started · `[~]` in progress · `[x]` done

---

## Epic 0 — Planning & Project Setup

**Goal:** Lock in scope, architecture, and documentation before coding.

- [x] Define project vision and problem statement
- [x] Choose tech stack
- [x] Write `README.md`
- [x] Write `PROJECT_PLAN.md`
- [x] Write `TODO.md`
- [x] Get planning documents approved
- [x] Initialize git repository and `.gitignore`
- [x] Create base folder structure (`frontend/`, `backend/`, `docs/`)

---

## Epic 1 — Infrastructure & DevOps Foundation ✅

**Goal:** A reproducible environment where all services run together.

- [x] Create `.env.example` with all required variables
- [x] Write `frontend/Dockerfile`
- [x] Write `backend/Dockerfile`
- [x] Write `docker-compose.yml` (frontend, backend, db)
- [x] Configure PostgreSQL service in docker-compose
- [x] Verify `docker-compose up` starts all services cleanly
- [x] Add a backend `/health` endpoint
- [x] Confirm frontend can reach the backend (health-check card on home page)

---

## Epic 2 — Backend Foundation (FastAPI) ✅

**Goal:** A structured, testable API skeleton.

- [x] Initialize FastAPI app (`app/main.py`)
- [x] Set up project config/settings (`app/core/`)
- [x] Configure SQLAlchemy session and DB connection (`app/db/`)
- [x] Set up database migrations (Alembic + initial migration)
- [x] Define the `Comparison` ORM model
- [x] Define Pydantic request/response schemas
- [x] Add CORS configuration for the frontend (driven by settings)
- [x] Set up logging

---

## Epic 3 — Frontend Foundation (Next.js) ✅

**Goal:** A clean, modern UI shell.

- [x] Initialize Next.js + TypeScript project
- [x] Configure Tailwind CSS
- [x] Set up global layout and theme
- [x] Create an API client wrapper (`lib/`)
- [x] Define shared TypeScript types
- [x] Build the landing/home page
- [x] Add loading and error UI states (reusable components)

---

## Epic 4 — Core Inputs & Parsing ✅

**Goal:** Accept and process resume + job description.

- [x] Build resume upload component (PDF/text)
- [x] Build job description input component
- [x] Backend endpoint to accept uploads (`POST /api/comparisons`)
- [x] Implement resume text extraction (PDF/text)
- [x] Implement job description text extraction
- [x] Implement basic skill keyword extraction
- [x] Validate and sanitize inputs (file type, size, length)
- [x] Persist raw inputs + extracted skills to the database

---

## Epic 5 — AI Provider Layer ✅

**Goal:** A swappable AI integration, Mock-first.

- [x] Define the `AIProvider` interface
- [x] Implement the **Mock provider** (deterministic results)
- [~] Implement the OpenAI provider (stub only — real calls in Epic 6)
- [~] Implement the Claude provider (stub only — real calls in Epic 6)
- [x] Add provider selection via `AI_PROVIDER` env var (factory)
- [x] Write prompt template for match scoring
- [x] Write prompt template for skill gap analysis
- [x] Write prompt template for cover letter generation
- [x] Add error handling for unsupported provider names

---

## Epic 6 — Core Feature: Analyze ✅

**Goal:** The full value loop, end to end.

- [x] Implement analyze flow (wired into `POST /api/comparisons`)
- [x] Orchestrate parsing + provider call + persistence
- [x] Return `{ score, missing_skills, summary, cover_letter, provider, extracted_skills }`
- [x] Build the results UI (component)
- [x] Display the match score (with visual indicator)
- [x] Display the missing skills list (and matched skills)
- [x] Display the generated cover letter
- [x] Add copy-to-clipboard for the cover letter

---

## Epic 7 — Persistence & History

**Goal:** Let users revisit past comparisons.

- [ ] Endpoint to list past comparisons
- [ ] Endpoint to fetch a single comparison
- [ ] History list view in the frontend
- [ ] Comparison detail view
- [ ] Delete a comparison

---

## Epic 8 — Testing & Quality

**Goal:** Confidence and maintainability.

- [ ] Backend unit tests (parsing, services)
- [ ] Backend tests for the Mock provider
- [ ] Backend API/integration tests
- [ ] Frontend component tests
- [ ] Configure linting (frontend + backend)
- [ ] Configure type checking (TypeScript + mypy)
- [ ] Set up CI pipeline (lint + test)

---

## Epic 9 — Deployment

**Goal:** Make it publicly available.

- [ ] Deploy frontend to Vercel
- [ ] Configure frontend environment variables in Vercel
- [ ] Deploy backend (container host)
- [ ] Provision a managed PostgreSQL database
- [ ] Run database migrations in production
- [ ] Configure production CORS and secrets
- [ ] Smoke-test the live deployment
- [ ] Write deployment documentation

---

## Epic 10 — Future Improvements (Backlog)

**Goal:** Ideas beyond the MVP.

- [ ] User authentication and profiles
- [ ] Multiple resume versions + A/B comparison
- [ ] Analytics dashboard (score trends)
- [ ] Export cover letter to PDF/DOCX
- [ ] Browser extension to capture job postings
- [ ] Multi-language support
- [ ] Rate limiting and caching
- [ ] Observability (metrics, tracing, alerts)

---

## Progress Snapshot

| Epic                          | Status        |
| ----------------------------- | ------------- |
| 0 — Planning & Setup          | Done          |
| 1 — Infrastructure & DevOps   | Done          |
| 2 — Backend Foundation        | Done          |
| 3 — Frontend Foundation       | Done          |
| 4 — Core Inputs & Parsing     | Done          |
| 5 — AI Provider Layer         | Done (mock)   |
| 6 — Core Feature: Analyze     | Done          |
| 7 — Persistence & History     | Not started   |
| 8 — Testing & Quality         | Not started   |
| 9 — Deployment                | Not started   |
| 10 — Future Improvements      | Backlog       |
