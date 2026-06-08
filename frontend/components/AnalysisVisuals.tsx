"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { AnalysisStatsPanel } from "@/components/AnalysisStatsPanel";
import { buildAnalysisStats } from "@/lib/analysisStats";
import type { Comparison } from "@/lib/types";

const AnalysisCharts3D = dynamic(
  () =>
    import("@/components/charts/AnalysisCharts3D").then((mod) => mod.AnalysisCharts3D),
  {
    ssr: false,
    loading: () => (
      <div className="chart-canvas-wrap flex items-center justify-center">
        <p className="text-sm text-[var(--text-muted)]">Loading 3D charts…</p>
      </div>
    ),
  },
);

function useClientReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

export function AnalysisVisuals({ result }: { result: Comparison }) {
  const stats = useMemo(() => buildAnalysisStats(result), [result]);
  const clientReady = useClientReady();

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
        {clientReady ? (
          <AnalysisCharts3D stats={stats} />
        ) : (
          <div className="chart-canvas-wrap flex items-center justify-center">
            <p className="text-sm text-[var(--text-muted)]">Loading 3D charts…</p>
          </div>
        )}
      </div>

      <AnalysisStatsPanel stats={stats} />
    </section>
  );
}
