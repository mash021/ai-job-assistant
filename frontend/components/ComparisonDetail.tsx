"use client";

/**
 * Comparison detail view (Epic 7).
 *
 * Fetches one full comparison by id and renders it. It reuses the existing
 * <AnalysisResult /> component for the score/skills/summary/cover-letter
 * display, and additionally shows the original inputs (resume + job text).
 *
 * Keeps loading and error states (including a friendly 404 message).
 */

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
        err instanceof ApiError ? err.message : "Failed to load comparison.";
      setState({ kind: "error", message, notFound });
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (state.kind === "loading") {
    return (
      <Card>
        <Loading label="Loading comparison…" />
      </Card>
    );
  }

  if (state.kind === "error") {
    return (
      <Card>
        <ErrorMessage
          title={state.notFound ? "Comparison not found" : "Could not load"}
          details={state.message}
          onRetry={state.notFound ? undefined : load}
        />
        <div className="mt-4">
          <Link href="/history" className="text-sm font-medium underline">
            ← Back to history
          </Link>
        </div>
      </Card>
    );
  }

  const { data } = state;

  return (
    <div className="space-y-6">
      <Card title="Analysis result">
        <AnalysisResult result={data} />
      </Card>

      <Card title="Original inputs">
        <div className="space-y-4">
          <div>
            <h4 className="mb-1 text-sm font-semibold">Job description</h4>
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              {data.job_description_text}
            </pre>
          </div>
          <div>
            <h4 className="mb-1 text-sm font-semibold">Resume text</h4>
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              {data.resume_text}
            </pre>
          </div>
        </div>
      </Card>

      <Link href="/history" className="text-sm font-medium underline">
        ← Back to history
      </Link>
    </div>
  );
}
