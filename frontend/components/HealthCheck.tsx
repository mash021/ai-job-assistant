"use client";

/**
 * Backend health-check widget.
 *
 * Calls the backend via the typed API client and renders one of three states
 * using the shared Loading / ErrorMessage components. This keeps the live proof
 * that "frontend can reach backend" visible (required through Epic 3) while
 * demonstrating the new lib/ + components/ structure.
 */

import { useCallback, useEffect, useState } from "react";

import { Card } from "@/components/Card";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Loading } from "@/components/Loading";
import { api, ApiError } from "@/lib/api";
import { BACKEND_URL } from "@/lib/config";
import type { HealthResponse } from "@/lib/types";

type State =
  | { kind: "loading" }
  | { kind: "ok"; data: HealthResponse }
  | { kind: "error"; message: string };

export function HealthCheck() {
  const [state, setState] = useState<State>({ kind: "loading" });

  // `useCallback` keeps the same function reference so it can be reused both on
  // mount and by the "Try again" button.
  const check = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const data = await api.getHealth();
      setState({ kind: "ok", data });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? `${err.message} (status ${err.status})`
          : String(err);
      setState({ kind: "error", message });
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return (
    <Card title="Backend health check">
      {state.kind === "loading" && <Loading label="Checking backend…" />}

      {state.kind === "ok" && (
        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 font-medium text-green-700">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Backend is reachable
          </p>
          <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-slate-500">Service</dt>
            <dd className="font-mono">{state.data.service}</dd>
            <dt className="text-slate-500">Status</dt>
            <dd className="font-mono">{state.data.status}</dd>
            <dt className="text-slate-500">Version</dt>
            <dd className="font-mono">{state.data.version}</dd>
          </dl>
        </div>
      )}

      {state.kind === "error" && (
        <ErrorMessage
          title="Could not reach backend"
          details={`${state.message}\nExpected backend at: ${BACKEND_URL}`}
          onRetry={check}
        />
      )}
    </Card>
  );
}
