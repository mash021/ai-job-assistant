"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { AnalysisResult } from "@/components/AnalysisResult";
import { Card } from "@/components/Card";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Loading } from "@/components/Loading";
import { api, ApiError } from "@/lib/api";
import type { Comparison } from "@/lib/types";

type State =
  | { kind: "loading" }
  | { kind: "ok"; data: Comparison }
  | { kind: "error"; message: string; notFound: boolean };

export function ComparisonDetail({ id }: { id: number }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const data = await api.getComparison(id);
      setState({ kind: "ok", data });
    } catch (err) {
      const notFound = err instanceof ApiError && err.status === 404;
      const message =
        err instanceof ApiError ? err.message : "Failed to load.";
      setState({ kind: "error", message, notFound });
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (state.kind === "loading") {
    return (
      <Card>
        <Loading />
      </Card>
    );
  }

  if (state.kind === "error") {
    return (
      <Card>
        <ErrorMessage
          title={state.notFound ? "Not found" : "Error"}
          details={state.message}
          onRetry={state.notFound ? undefined : load}
        />
        <Link href="/history" className="btn-secondary mt-6 inline-flex">
          Back
        </Link>
      </Card>
    );
  }

  const { data } = state;

  return (
    <div className="space-y-8">
      <Card title="Analysis">
        <AnalysisResult result={data} />
      </Card>

      <Card title="Source material">
        <div className="space-y-8">
          <div>
            <p className="label-caps mb-3">Job description</p>
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm leading-relaxed text-[var(--text-muted)]">
              {data.job_description_text}
            </pre>
          </div>
          <div className="divider" />
          <div>
            <p className="label-caps mb-3">Resume</p>
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm leading-relaxed text-[var(--text-muted)]">
              {data.resume_text}
            </pre>
          </div>
        </div>
      </Card>

      <Link href="/history" className="btn-secondary inline-flex">
        Back to history
      </Link>
    </div>
  );
}
