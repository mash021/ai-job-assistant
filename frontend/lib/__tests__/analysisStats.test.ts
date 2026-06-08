import { describe, expect, it } from "vitest";

import { buildAnalysisStats } from "@/lib/analysisStats";
import type { Comparison } from "@/lib/types";

function makeComparison(overrides: Partial<Comparison> = {}): Comparison {
  return {
    id: 1,
    resume_text: "resume",
    job_description_text: "job",
    extracted_skills: {
      resume: ["Python", "Git", "Docker"],
      job_description: ["Python", "React", "TypeScript"],
      matched: ["Python"],
    },
    score: 65,
    missing_skills: ["React", "TypeScript"],
    summary: "Partial fit.",
    cover_letter: "Dear team",
    provider: "mock",
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("buildAnalysisStats", () => {
  it("computes match and gap rates from skills", () => {
    const stats = buildAnalysisStats(makeComparison());

    expect(stats.matchedCount).toBe(1);
    expect(stats.missingCount).toBe(2);
    expect(stats.totalRequired).toBe(3);
    expect(stats.matchRate).toBe(33);
    expect(stats.gapRate).toBe(67);
    expect(stats.resumeOnly).toEqual(["Git", "Docker"]);
  });

  it("handles empty skill lists", () => {
    const stats = buildAnalysisStats(
      makeComparison({
        extracted_skills: { resume: [], job_description: [], matched: [] },
        missing_skills: [],
        score: 0,
      }),
    );

    expect(stats.matchRate).toBe(0);
    expect(stats.gapRate).toBe(0);
    expect(stats.resumeOnly).toEqual([]);
  });
});
