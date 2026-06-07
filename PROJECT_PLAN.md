# Project Plan — AI Job Assistant

This document describes **how** we will build the AI Job Assistant: the vision, the architecture, the Scrum-style roadmap, and the milestones. It is meant to be readable by both technical and non-technical people.

---

## 1. Vision & Problem Statement

**Problem:** Job seekers send generic resumes and cover letters to many jobs. They rarely know how well they match a specific role or how to improve their application for it.

**Solution:** A web app that compares a resume against a job description using AI, then returns:

- a **match score**,
- a **skill gap analysis**, and
- a **tailored cover letter**.

**Why it's a good portfolio project:** It touches every layer of a modern stack — a polished frontend, a clean API, a relational database, AI integration with a swappable provider pattern, and containerized DevOps.

---

## 2. Goals & Non-Goals

### Goals

- Deliver a working end-to-end MVP that runs locally with zero paid API keys (via the Mock provider).
- Demonstrate clean architecture and clear separation of concerns.
- Make the AI layer pluggable (Mock / OpenAI / Claude).
- Ship reproducible infrastructure with Docker and docker-compose.
- Deploy the frontend to Vercel.

### Non-Goals (for v1)

- Full user account system with billing.
- Mobile native apps.
- Advanced analytics and reporting.
- Real-time collaboration.

---

## 3. Target Users

- **Active job seekers** tailoring applications to specific roles.
- **Career changers** who want to see which skills they are missing.
- **Students / new grads** who need help writing cover letters.

---

## 4. System Architecture

### 4.1 High-Level Components

| Component        | Responsibility                                                            |
| ---------------- | ------------------------------------------------------------------------- |
| **Frontend**     | UI for upload, input, and displaying results. Built with Next.js.         |
| **Backend API**  | Parsing, orchestration, scoring logic, persistence. Built with FastAPI.   |
| **Database**     | Stores users (later), comparisons, and generated outputs. PostgreSQL.     |
| **AI Layer**     | Abstracted provider interface with Mock/OpenAI/Claude implementations.    |
| **DevOps**       | Docker images and docker-compose for local + deployable environments.     |

### 4.2 Request Flow (Core Use Case)

1. Frontend sends resume + job description to `POST /api/analyze`.
2. Backend extracts text and key skills from both inputs.
3. Backend calls the configured AI provider's `analyze()` method.
4. Provider returns `{ score, missing_skills, cover_letter, summary }`.
5. Backend stores the result in PostgreSQL and returns it to the frontend.
6. Frontend renders the score, skill gaps, and cover letter.

### 4.3 AI Provider Abstraction

```
AIProvider (interface)
├── analyze(resume_text, job_text) -> AnalysisResult
│
├── MockProvider     # deterministic, offline, free
├── OpenAIProvider   # uses OPENAI_API_KEY
└── ClaudeProvider   # uses ANTHROPIC_API_KEY
```

Selected at runtime via the `AI_PROVIDER` environment variable.

### 4.4 Data Model (Initial Draft)

- **Comparison**
  - `id`, `created_at`
  - `resume_text`, `job_description_text`
  - `score` (int)
  - `missing_skills` (json/array)
  - `cover_letter` (text)
  - `provider` (string)

(User-related tables are introduced in a later phase.)

---

## 5. Folder Structure (Target)

```
ai-job-assistant/
├── README.md
├── PROJECT_PLAN.md
├── TODO.md
├── docker-compose.yml
├── .env.example
├── frontend/        # Next.js + TypeScript + Tailwind
├── backend/         # FastAPI + Python
└── docs/            # Extended docs (optional)
```

See `README.md` for the expanded breakdown of each directory.

---

## 6. Scrum-Style Roadmap

We use lightweight Scrum: short sprints, each ending with a demoable increment. Suggested sprint length is **1 week**, but this can be adjusted.

### Sprint 0 — Planning & Setup *(current)*

**Goal:** Establish the plan and project scaffolding decisions.

- Define vision, scope, and architecture.
- Produce `README.md`, `PROJECT_PLAN.md`, `TODO.md`.
- Agree on tech stack and folder structure.
- **Deliverable:** Approved planning documents.

### Sprint 1 — Foundation & Infrastructure

**Goal:** A running skeleton across all layers.

- Scaffold frontend (Next.js + Tailwind + TypeScript).
- Scaffold backend (FastAPI) with a health-check endpoint.
- Set up PostgreSQL and database connection.
- Write `docker-compose.yml` and `.env.example`.
- **Deliverable:** `docker-compose up` brings up all services; frontend can reach a backend health endpoint.

### Sprint 2 — Core Inputs & Parsing

**Goal:** Users can submit a resume and job description.

- Build resume upload + job description input UI.
- Implement file/text parsing in the backend.
- Define request/response schemas.
- Persist raw inputs to the database.
- **Deliverable:** Inputs are accepted, parsed, and stored.

### Sprint 3 — AI Layer (Mock First)

**Goal:** Produce analysis results end to end.

- Implement the `AIProvider` interface.
- Implement the **Mock provider** (deterministic output).
- Wire `POST /api/analyze` to return score, missing skills, and a cover letter.
- Display results in the frontend.
- **Deliverable:** Full core loop works locally with the Mock provider.

### Sprint 4 — Real AI Providers

**Goal:** Plug in real models.

- Implement OpenAI provider.
- Implement Claude provider.
- Add prompt templates for scoring, skill gaps, and cover letters.
- Add graceful fallback/error handling.
- **Deliverable:** App produces real AI results when keys are configured.

### Sprint 5 — Polish, Persistence & History

**Goal:** Make it feel like a product.

- Add a history/list view of past comparisons.
- Improve UI/UX, loading states, and error handling.
- Add copy-to-clipboard and basic export.
- **Deliverable:** Polished, demoable app with saved history.

### Sprint 6 — Testing, CI & Deployment

**Goal:** Ship it.

- Backend tests (Pytest) and frontend tests.
- Set up CI for lint/test.
- Deploy frontend to Vercel; deploy backend + database.
- Write deployment docs.
- **Deliverable:** Live, deployed application.

---

## 7. Milestones

| Milestone | Description                                  | Exit Criteria                                  |
| --------- | -------------------------------------------- | ---------------------------------------------- |
| **M1**    | Planning approved                            | README/PLAN/TODO approved                      |
| **M2**    | Infrastructure running                       | All services start via docker-compose          |
| **M3**    | Core loop with Mock provider                 | Analyze returns score + skills + cover letter  |
| **M4**    | Real AI providers integrated                 | OpenAI/Claude produce results                  |
| **M5**    | Product polish + history                     | Saved comparisons + clean UX                   |
| **M6**    | Deployed                                      | Live URLs for frontend and backend             |

---

## 8. Definition of Done (per task)

A task is "done" when:

- The code works locally via docker-compose.
- It has appropriate tests (where applicable).
- It is documented (README/docstrings).
- It passes lint/type checks.
- It has been reviewed/approved.

---

## 9. Risks & Mitigations

| Risk                                   | Mitigation                                              |
| -------------------------------------- | ------------------------------------------------------ |
| AI API costs during development        | Default to the Mock provider locally and in CI.        |
| Resume parsing edge cases              | Start with text/PDF; expand formats incrementally.     |
| Provider API changes                   | Isolate providers behind a stable interface.           |
| Scope creep                            | Strict MVP; defer extras to Future Improvements.       |
| Deployment complexity                  | Containerize everything; document each step.           |

---

## 10. Success Metrics

- A new contributor can run the app locally in under 10 minutes.
- The core loop (upload → analyze → results) works with the Mock provider.
- Swapping providers requires only an env var change.
- The frontend is deployed and publicly accessible.

---

## 11. Next Step

Await approval of these planning documents before any application code is written.
