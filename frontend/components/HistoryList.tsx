"use client";

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
    if (!window.confirm(`Delete #${id}?`)) return;
    setDeletingId(id);
    try {
      await api.deleteComparison(id);
      setState((prev) =>
        prev.kind === "ok"
          ? { kind: "ok", items: prev.items.filter((i) => i.id !== id) }
          : prev,
      );
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

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
        <ErrorMessage title="Could not load" details={state.message} onRetry={load} />
      </Card>
    );
  }

  if (state.items.length === 0) {
    return (
      <Card>
        <p className="text-sm text-[var(--text-muted)]">No analyses yet.</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Start analysis
        </Link>
      </Card>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)]">
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
  const created = new Date(item.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-start justify-between gap-6 bg-[var(--bg-elevated)] px-6 py-5 transition hover:bg-[var(--surface)]">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-bold tabular-nums text-[var(--vivid-orange)]">
            {item.score ?? "—"}
          </span>
          <span className="pill-accent font-mono">#{item.id}</span>
          <span className="text-xs text-[var(--text-muted)]">
            {created} · {item.provider}
          </span>
        </div>
        {item.summary && (
          <p className="line-clamp-1 text-sm text-[var(--text-muted)]">{item.summary}</p>
        )}
        {missing.length > 0 && (
          <p className="text-xs text-[var(--text-muted)]">
            Missing · {missing.join(", ")}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link href={`/history/${item.id}`} className="btn-ghost">
          View
        </Link>
        <button type="button" onClick={onDelete} disabled={deleting} className="btn-danger">
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
