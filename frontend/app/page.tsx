"use client";

/**
 * Home page for Epic 1.
 *
 * Its only job right now is to prove that the frontend can talk to the backend.
 * It calls the backend `/health` endpoint and shows the result. This validates
 * the full networking path: browser -> Next.js -> FastAPI.
 *
 * The backend URL comes from the public env var `NEXT_PUBLIC_BACKEND_URL` so it
 * can differ between local Docker, local dev, and production without code edits.
 */

import { useEffect, useState } from "react";

// `NEXT_PUBLIC_` vars are exposed to the browser. We default to localhost:8000
// so the page still works when run outside Docker.
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

type HealthStatus = "loading" | "ok" | "error";

export default function Home() {
  const [status, setStatus] = useState<HealthStatus>("loading");
  const [payload, setPayload] = useState<string>("");

  useEffect(() => {
    // Ask the backend whether it is alive when the page first loads.
    fetch(`${BACKEND_URL}/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setStatus("ok");
        setPayload(JSON.stringify(data));
      })
      .catch((err) => {
        setStatus("error");
        setPayload(String(err));
      });
  }, []);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">AI Job Assistant</h1>
        <p className="text-slate-600">
          Infrastructure foundation (Epic 1). The card below confirms the
          frontend can reach the backend API.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Backend health check</h2>

        {status === "loading" && (
          <p className="text-slate-500">Checking backend…</p>
        )}

        {status === "ok" && (
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 font-medium text-green-700">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              Backend is reachable
            </p>
            <pre className="overflow-x-auto rounded-lg bg-slate-100 p-3 text-sm">
              {payload}
            </pre>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 font-medium text-red-700">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              Could not reach backend
            </p>
            <pre className="overflow-x-auto rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {payload}
            </pre>
            <p className="text-sm text-slate-500">
              Make sure the backend is running at{" "}
              <code className="rounded bg-slate-100 px-1">{BACKEND_URL}</code>.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
