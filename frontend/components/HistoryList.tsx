"use client";

/**
 * History list (Epic 7).
 *
 * Loads all saved comparisons (compact items) and renders them newest-first.
 * Each row shows id, score, provider, created date, a short summary, and the
 * missing skills, plus links to the detail view and a delete button.
 *
 * Keeps loading and error states via the shared components.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { Card } from "@/components/Card";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Loading } from "@/components/Loading";
import { api, ApiError } from "@/lib/api";
import type { ComparisonListItem } from "@/lib/types";

type State =
  | { kind: "loading" }
  | { kind: "ok"; items: ComparisonListItem[] }
  | { kind: "error"; message: string };

export function HistoryList() {
  const [state, setState] = useState<State>({ kind: "loading" });
  // Tracks which row is currently being deleted (to disable its button).
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const items = await api.listComparisons();
      setState({ kind: "ok", items });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to load history.";
      setState({ kind: "error", message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: number) {
    if (!window.confirm(`Delete comparison #${id}? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await api.deleteComparison(id);
      // Optimistically remove the row from the current list.
      setState((prev) =>
        prev.kind === "ok"
          ? { kind: "ok", items: prev.items.filter((i) => i.id !== id) }
          : prev,
      );
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to delete.";
      window.alert(message);
    } finally {
      setDeletingId(null);
    }
  }

  if (state.kind === "loading") {
    return (
      <Card>
        <Loading label="Loading history…" />
      </Card>
    );
  }

  if (state.kind === "error") {
    return (
      <Card>
        <ErrorMessage
          title="Could not load history"
          details={state.message}
          onRetry={load}
        />
      </Card>
    );
  }

  if (state.items.length === 0) {
    return (
      <Card>
        <p className="text-slate-500">
          No saved comparisons yet.{" "}
          <Link href="/" className="font-medium text-slate-900 underline">
            Analyze a resume
          </Link>{" "}
          to create one.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {state.items.map((item) => (
        <HistoryRow
          key={item.id}
          item={item}
          deleting={deletingId === item.id}
          onDelete={() => handleDelete(item.id)}
        />
      ))}
    </div>
  );
}

function HistoryRow({
  item,
  deleting,
  onDelete,
}: {
  item: ComparisonListItem;
  deleting: boolean;
  onDelete: () => void;
}) {
  const missing = item.missing_skills ?? [];
  const created = new Date(item.created_at).toLocaleString();

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">
              #{item.id}
            </span>
            <span className="text-sm font-medium">
              Score: {item.score ?? "—"}
            </span>
            <span className="text-xs text-slate-500">
              {item.provider ?? "unknown"} · {created}
            </span>
          </div>

          {item.summary && (
            <p className="text-sm text-slate-700">{item.summary}</p>
          )}

          {missing.length > 0 && (
            <p className="text-xs text-slate-500">
              Missing: {missing.join(", ")}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <Link
            href={`/history/${item.id}`}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            View
          </Link>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </Card>
  );
}
