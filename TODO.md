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

## Epic 2 — Backend Foundation (FastAPI)

**Goal:** A structured, testable API skeleton.

- [ ] Initialize FastAPI app (`app/main.py`)
- [ ] Set up project config/settings (`app/core/`)
- [ ] Configure SQLAlchemy session and DB connection (`app/db/`)
- [ ] Set up database migrations (e.g. Alembic)
- [ ] Define the `Comparison` ORM model
- [ ] Define Pydantic request/response schemas
- [ ] Add CORS configuration for the frontend
- [ ] Set up logging

---

## Epic 3 — Frontend Foundation (Next.js)

**Goal:** A clean, modern UI shell.

- [ ] Initialize Next.js + TypeScript project
- [ ] Configure Tailwind CSS
- [ ] Set up global layout and theme
- [ ] Create an API client wrapper (`lib/`)
- [ ] Define shared TypeScript types
- [ ] Build the landing/home page
- [ ] Add loading and error UI states

---

## Epic 4 — Core Inputs & Parsing

**Goal:** Accept and process resume + job description.

- [ ] Build resume upload component (PDF/text)
- [ ] Build job description input component
- [ ] Backend endpoint to accept uploads
- [ ] Implement resume text extraction (PDF/text)
- [ ] Implement job description text extraction
- [ ] Implement basic skill keyword extraction
- [ ] Validate and sanitize inputs
- [ ] Persist raw inputs to the database

---

## Epic 5 — AI Provider Layer

**Goal:** A swappable AI integration, Mock-first.

- [ ] Define the `AIProvider` interface
- [ ] Implement the **Mock provider** (deterministic results)
- [ ] Implement the OpenAI provider
- [ ] Implement the Claude provider
- [ ] Add provider selection via `AI_PROVIDER` env var
- [ ] Write prompt template for match scoring
- [ ] Write prompt template for skill gap analysis
- [ ] Write prompt template for cover letter generation
- [ ] Add error handling and fallbacks for provider failures

---

## Epic 6 — Core Feature: Analyze

**Goal:** The full value loop, end to end.

- [ ] Implement `POST /api/analyze` endpoint
- [ ] Orchestrate parsing + provider call + persistence
- [ ] Return `{ score, missing_skills, cover_letter, summary }`
- [ ] Build the results page UI
- [ ] Display the match score (with visual indicator)
- [ ] Display the missing skills list
- [ ] Display the generated cover letter
- [ ] Add copy-to-clipboard for the cover letter

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
| 2 — Backend Foundation        | Not started   |
| 3 — Frontend Foundation       | Not started   |
| 4 — Core Inputs & Parsing     | Not started   |
| 5 — AI Provider Layer         | Not started   |
| 6 — Core Feature: Analyze     | Not started   |
| 7 — Persistence & History     | Not started   |
| 8 — Testing & Quality         | Not started   |
| 9 — Deployment                | Not started   |
| 10 — Future Improvements      | Backlog       |
