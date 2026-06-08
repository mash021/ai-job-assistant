import type { AnalysisStats } from "@/lib/analysisStats";

type MetricKey = keyof Pick<
  AnalysisStats,
  "score" | "matchRate" | "gapRate" | "resumeSkillCount" | "jdSkillCount" | "totalRequired"
>;

const METRICS: { key: MetricKey; label: string; suffix: string; accent?: boolean }[] = [
  { key: "score", label: "AI match score", suffix: "%", accent: true },
  { key: "matchRate", label: "Required skills met", suffix: "%" },
  { key: "gapRate", label: "Skill gap", suffix: "%" },
  { key: "resumeSkillCount", label: "Resume skills", suffix: "" },
  { key: "jdSkillCount", label: "Job skills", suffix: "" },
  { key: "totalRequired", label: "Required total", suffix: "" },
];

export function AnalysisStatsPanel({ stats }: { stats: AnalysisStats }) {
  return (
    <section className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {METRICS.map(({ key, label, suffix, accent }) => (
          <div
            key={key}
            className={
              accent
                ? "rounded-2xl border-2 border-[var(--vivid-orange)] bg-[color-mix(in_srgb,var(--vivid-orange)_12%,var(--bg-elevated))] p-4"
                : "rounded-2xl border-2 border-[var(--vivid-teal)] bg-[var(--bg-elevated)] p-4"
            }
          >
            <p className="label-caps">{label}</p>
            <p
              className={
                accent
                  ? "mt-2 text-3xl font-bold tabular-nums text-[var(--vivid-orange)]"
                  : "mt-2 text-2xl font-bold tabular-nums text-[var(--text)]"
              }
            >
              {stats[key]}
              {suffix}
            </p>
          </div>
        ))}
      </div>

      {stats.resumeOnly.length > 0 && (
        <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="label-caps mb-2">Extra on resume</p>
          <p className="text-sm text-[var(--text-muted)]">
            Skills on your resume not required by this job:{" "}
            <span className="font-semibold text-[var(--text)]">
              {stats.resumeOnly.join(", ")}
            </span>
          </p>
        </div>
      )}
    </section>
  );
}
