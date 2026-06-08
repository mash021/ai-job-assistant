"use client";

import { AnalysisVisuals } from "@/components/AnalysisVisuals";
import { CopyButton } from "@/components/CopyButton";
import { SkillBadge } from "@/components/SkillBadge";
import type { Comparison } from "@/lib/types";

export function AnalysisResult({
  result,
  onReset,
  resetLabel = "New analysis",
}: {
  result: Comparison;
  onReset?: () => void;
  resetLabel?: string;
}) {
  const matched = result.extracted_skills?.matched ?? [];
  const missing = result.missing_skills ?? [];
  const score = result.score ?? 0;

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between border-b border-[var(--border)] pb-8">
        <div>
          <p className="label-caps mb-3">Match score</p>
          <p className="score-display">{score}</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{verdict(score)}</p>
        </div>
        <div className="text-right text-sm">
          <p className="label-caps">Provider</p>
          <p className="mt-1 font-mono text-[var(--text-muted)]">
            {result.provider ?? "—"}
          </p>
          <p className="mt-3 label-caps">Record</p>
          <p className="mt-1 font-mono text-[var(--text-muted)]">#{result.id}</p>
        </div>
      </div>

      {result.summary && (
        <p className="rounded-xl border-l-4 border-[var(--vivid-orange)] bg-[var(--surface)] px-5 py-4 text-sm font-medium leading-relaxed text-[var(--text)]">
          {result.summary}
        </p>
      )}

      <AnalysisVisuals result={result} />

      <div className="grid gap-8 sm:grid-cols-2">
        <SkillList
          title="Matched"
          skills={matched}
          emptyText="None detected."
          variant="matched"
        />
        <SkillList
          title="Missing"
          skills={missing}
          emptyText="None detected."
          variant="missing"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="label-caps">Cover letter</p>
          {result.cover_letter && (
            <CopyButton text={result.cover_letter} label="Copy" />
          )}
        </div>
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 text-sm leading-relaxed text-[var(--text-muted)]">
          {result.cover_letter ?? "Not generated."}
        </pre>
      </div>

      {onReset && (
        <button type="button" onClick={onReset} className="btn-secondary">
          {resetLabel}
        </button>
      )}
    </div>
  );
}

function verdict(score: number): string {
  if (score >= 80) return "Strong alignment with role requirements.";
  if (score >= 50) return "Partial alignment — room to improve.";
  return "Limited alignment — significant gaps present.";
}

function SkillList({
  title,
  skills,
  emptyText,
  variant,
}: {
  title: string;
  skills: string[];
  emptyText: string;
  variant: "matched" | "missing";
}) {
  return (
    <div>
      <p className="label-caps mb-4">{title}</p>
      {skills.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">{emptyText}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <SkillBadge key={skill} skill={skill} variant={variant} />
          ))}
        </ul>
      )}
    </div>
  );
}
