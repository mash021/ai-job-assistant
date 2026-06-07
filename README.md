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
│   │   ├── layout.tsx         # ✅ Root layout
│   │   ├── page.tsx           # ✅ Home page (backend health check)
│   │   └── globals.css        # ✅ Tailwind entry styles
│   ├── components/            #    Reusable UI components (later)
│   ├── lib/                   #    API client, helpers, types (later)
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
│   │   ├── api/               #    Routers/endpoints (later)
│   │   ├── core/              #    Config, settings, security (later)
│   │   ├── models/            #    SQLAlchemy ORM models (later)
│   │   ├── schemas/           #    Pydantic request/response schemas (later)
│   │   ├── services/          #    Business logic (parsing, scoring) (later)
│   │   ├── ai/                #    Provider abstraction (later)
│   │   └── db/                #    Session, migrations (later)
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

## AI Providers

The backend defines a single **provider interface** with a method such as `analyze(resume, job_description)`. Three implementations are planned:

- **Mock Provider** — Returns deterministic, realistic-looking results without any external calls. Used for local development, tests, and CI.
- **OpenAI Provider** — Calls OpenAI models for scoring, skill gaps, and cover letters.
- **Claude Provider** — Calls Anthropic Claude models for the same tasks.

Switching providers is done purely through the `AI_PROVIDER` environment variable — no code changes required.

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
