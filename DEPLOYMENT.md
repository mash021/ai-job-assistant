# Deployment Guide — Epic 9

Deploy **AI Job Assistant** when local development and CI are green. The recommended stack:

| Layer    | Host    | Why                          |
| -------- | ------- | ---------------------------- |
| Frontend | Vercel  | Native Next.js, free tier    |
| Backend  | Railway | Docker + Postgres in one place |
| Database | Railway | Managed PostgreSQL plugin      |

Use `AI_PROVIDER=mock` in production until OpenAI billing is active.

---

## Prerequisites

- GitHub repo pushed: [mash021/ai-job-assistant](https://github.com/mash021/ai-job-assistant)
- [Vercel](https://vercel.com) account (GitHub login)
- [Railway](https://railway.app) account (GitHub login)
- CI passing on `main`

---

## Step 1 — Railway (backend + database)

1. **New Project** → **Deploy from GitHub** → select `ai-job-assistant`.
2. **Add PostgreSQL** (Plugins → PostgreSQL).
3. **Add Service** from the same repo (or configure the existing service):
   - Root uses `railway.toml` → builds `backend/Dockerfile.prod`
   - On boot: `alembic upgrade head` then Uvicorn on `$PORT`
4. **Variables** on the backend service:

   | Variable               | Value                                      |
   | ---------------------- | ------------------------------------------ |
   | `DATABASE_URL`         | Reference → PostgreSQL → `DATABASE_URL`    |
   | `AI_PROVIDER`          | `mock`                                     |
   | `BACKEND_CORS_ORIGINS` | `https://YOUR-APP.vercel.app` (after Step 2) |
   | `LOG_LEVEL`            | `INFO`                                     |

5. **Generate domain**: Settings → Networking → Generate Domain.
6. Copy the public URL, e.g. `https://ai-job-assistant-production.up.railway.app`.

### Verify backend

```bash
curl https://YOUR-BACKEND.up.railway.app/health
# {"status":"ok","service":"ai-job-assistant-backend","version":"0.2.0"}
```

---

## Step 2 — Vercel (frontend)

1. **Add New Project** → import `ai-job-assistant` from GitHub.
2. **Root Directory**: `frontend`
3. Framework is auto-detected (Next.js). `frontend/vercel.json` is optional metadata.
4. **Environment variable**:

   | Name                         | Value                          |
   | ---------------------------- | ------------------------------ |
   | `NEXT_PUBLIC_BACKEND_URL`    | Your Railway backend URL (no trailing slash) |

5. **Deploy**.

6. Copy the Vercel URL, e.g. `https://ai-job-assistant.vercel.app`.

---

## Step 3 — Link CORS

1. In **Railway** → backend service → Variables:
   ```
   BACKEND_CORS_ORIGINS=https://ai-job-assistant.vercel.app
   ```
   (Use your real Vercel URL; comma-separate multiple origins if needed.)
2. Redeploy / restart the backend service.

---

## Step 4 — Smoke test (production)

1. Open the Vercel URL.
2. **System status** on the home page should show backend `ok`.
3. Upload a resume + job description → **Analyze** → results appear.
4. **Save PDF** downloads `Mike-Sharifi-{Company}.pdf`.
5. **History** lists past analyses.

```bash
# Optional API check from terminal
curl -s https://YOUR-BACKEND.up.railway.app/health | jq .
curl -s https://YOUR-BACKEND.up.railway.app/api/comparisons | jq .
```

---

## OpenAI in production (optional)

When billing is ready on [platform.openai.com](https://platform.openai.com):

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Redeploy Railway. Keep `mock` for demos with zero API cost.

---

## Environment reference

See `.env.production.example` for all production variables.

| Variable | Where        | Notes |
| -------- | ------------ | ----- |
| `NEXT_PUBLIC_BACKEND_URL` | Vercel | Build-time; redeploy after change |
| `DATABASE_URL` | Railway | Auto from Postgres plugin |
| `BACKEND_CORS_ORIGINS` | Railway | Your Vercel origin(s) |
| `AI_PROVIDER` | Railway | `mock` (default) or `openai` |
| `PORT` | Railway | Set by platform — do not hardcode |

---

## Docker production images (self-hosted alternative)

```bash
# Backend (expects DATABASE_URL + PORT)
docker build -f backend/Dockerfile.prod -t ai-job-backend ./backend

# Frontend (pass backend URL at build time)
docker build -f frontend/Dockerfile.prod \
  --build-arg NEXT_PUBLIC_BACKEND_URL=https://api.example.com \
  -t ai-job-frontend ./frontend
```

Local development stays on `docker compose up` with dev Dockerfiles.

---

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| Frontend can't reach API | Check `NEXT_PUBLIC_BACKEND_URL`; redeploy Vercel after change |
| CORS error in browser | Set `BACKEND_CORS_ORIGINS` to exact Vercel URL (no `*`) |
| 500 on analyze | Railway logs; run `alembic upgrade head` manually if migrations failed |
| OpenAI 502 | Quota/billing — switch to `AI_PROVIDER=mock` |
| DB connection fails | Confirm `DATABASE_URL` references Postgres plugin |

---

## Checklist (Epic 9)

- [ ] Railway Postgres provisioned
- [ ] Backend deployed, `/health` returns 200
- [ ] Vercel frontend deployed
- [ ] `NEXT_PUBLIC_BACKEND_URL` points to Railway
- [ ] `BACKEND_CORS_ORIGINS` points to Vercel
- [ ] End-to-end analyze works on live URL
- [ ] History + PDF work on live URL
