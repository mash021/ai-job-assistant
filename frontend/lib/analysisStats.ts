import type { Comparison } from "@/lib/types";

export interface AnalysisStats {
  score: number;
  resumeSkillCount: number;
  jdSkillCount: number;
  matchedCount: number;
  missingCount: number;
  totalRequired: number;
  matchRate: number;
  gapRate: number;
  matched: string[];
  missing: string[];
  resumeOnly: string[];
}

export function buildAnalysisStats(result: Comparison): AnalysisStats {
  const matched = result.extracted_skills?.matched ?? [];
  const missing = result.missing_skills ?? [];
  const resumeSkills = result.extracted_skills?.resume ?? [];
  const jdSkills = result.extracted_skills?.job_description ?? [];
  const matchedSet = new Set(matched);
  const resumeOnly = resumeSkills.filter((skill) => !matchedSet.has(skill));

  const matchedCount = matched.length;
  const missingCount = missing.length;
  const totalRequired = matchedCount + missingCount;
  const score = result.score ?? 0;

  return {
    score,
    resumeSkillCount: resumeSkills.length,
    jdSkillCount: jdSkills.length,
    matchedCount,
    missingCount,
    totalRequired,
    matchRate: totalRequired > 0 ? Math.round((matchedCount / totalRequired) * 100) : 0,
    gapRate: totalRequired > 0 ? Math.round((missingCount / totalRequired) * 100) : 0,
    matched,
    missing,
    resumeOnly,
  };
}
