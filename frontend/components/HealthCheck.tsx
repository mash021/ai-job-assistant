"use client";

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
    <Card>
      {state.kind === "loading" && <Loading label="Checking…" />}

      {state.kind === "ok" && (
        <dl className="grid grid-cols-3 gap-6 text-sm">
          {[
            ["Service", state.data.service],
            ["Status", state.data.status],
            ["Version", state.data.version],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="label-caps">{label}</dt>
              <dd className="mt-2 font-mono text-[var(--text)]">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {state.kind === "error" && (
        <ErrorMessage
          title="Unreachable"
          details={`${state.message}\n${BACKEND_URL}`}
          onRetry={check}
        />
      )}
    </Card>
  );
}
