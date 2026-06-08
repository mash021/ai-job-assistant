"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import { AnalysisStatsPanel } from "@/components/AnalysisStatsPanel";
import { ChartErrorBoundary } from "@/components/charts/ChartErrorBoundary";
import { buildAnalysisStats } from "@/lib/analysisStats";
import type { Comparison } from "@/lib/types";

function ChartLoading() {
  return (
    <div className="chart-canvas-wrap flex items-center justify-center">
      <p className="text-sm text-[var(--text-muted)]">Loading 3D charts…</p>
    </div>
  );
}

function ChartUnavailable() {
  return (
    <div className="chart-canvas-wrap flex items-center justify-center p-6 text-center">
      <p className="text-sm text-[var(--text-muted)]">
        3D charts could not load. Refresh the page or use the stats below.
      </p>
    </div>
  );
}

const AnalysisCharts3D = dynamic(
  () =>
    import("@/components/charts/AnalysisCharts3D")
      .then((mod) => mod.AnalysisCharts3D)
      .catch(() => ChartUnavailable),
  {
    ssr: false,
    loading: ChartLoading,
  },
);

export function AnalysisVisuals({ result }: { result: Comparison }) {
  const stats = useMemo(() => buildAnalysisStats(result), [result]);

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="label-caps">Charts</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--text)]">Match & skill overview</h2>
        </div>
        <p className="hidden text-right text-xs text-[var(--text-muted)] sm:block">
          {stats.matchedCount} matched · {stats.missingCount} missing
        </p>
      </div>

      <div className="card overflow-hidden p-3 sm:p-4">
        <ChartErrorBoundary fallback={<ChartUnavailable />}>
          <AnalysisCharts3D stats={stats} />
        </ChartErrorBoundary>
      </div>

      <AnalysisStatsPanel stats={stats} />
    </section>
  );
}
