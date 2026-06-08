/** Extract employer and role hints from a job description for letter formatting. */

const COMPANY_PATTERNS: RegExp[] = [
  /(?:company|employer|organization)\s*:\s*(.+)/i,
  /(?:join|about)\s+([A-Z][A-Za-z0-9&.,'+\-\s]{2,48}?)(?:\s+(?:team|is|as|we|are|seeks|looking))/i,
  /(?:position|role|opportunity)\s+at\s+([A-Za-z0-9&.,'+\-\s]{2,48})/i,
  /^([A-Z][A-Za-z0-9&.,'+\-\s]{2,40})\s+(?:is hiring|is looking|seeks|hiring)/im,
  /^([A-Z][A-Za-z0-9&.,'+\-\s]{2,40})\s*[-–|]\s/im,
];

const TITLE_PATTERNS: RegExp[] = [
  /(?:job title|position|role)\s*:\s*(.+)/i,
  /^([A-Za-z0-9/&+\-\s]{4,70}?\b(?:engineer|developer|designer|manager|analyst|specialist|lead|architect|consultant|coordinator|director)\b[^.\n]*)/im,
  /^([A-Z][^.\n]{8,70})$/m,
];

function clean(value: string): string {
  return value.replace(/\s+/g, " ").replace(/[.,;:]+$/, "").trim();
}

export function extractCompanyName(jobDescription: string): string {
  const text = jobDescription.trim();
  if (!text) return "Hiring Team";

  for (const pattern of COMPANY_PATTERNS) {
    const match = text.match(pattern);
    const candidate = clean(match?.[1] ?? "");
    if (candidate.length >= 2 && candidate.length <= 50) return candidate;
  }

  const firstLine = text.split("\n")[0]?.trim() ?? "";
  const companyPart = firstLine.split(/\s*[-–—|]\s*/)[0]?.trim() ?? "";
  if (
    companyPart.length >= 2 &&
    companyPart.length <= 45 &&
    !/\b(seeking|looking|required|responsibilities|description)\b/i.test(companyPart)
  ) {
    return clean(companyPart);
  }

  return "Hiring Team";
}

export function extractJobTitle(jobDescription: string): string | null {
  const text = jobDescription.trim();
  if (!text) return null;

  const firstLine = text.split("\n")[0]?.trim() ?? "";
  const titlePart = firstLine.split(/\s*[-–—|]\s*/).slice(1).join(" - ").trim();
  if (titlePart.length >= 4 && titlePart.length <= 80) return clean(titlePart);

  for (const pattern of TITLE_PATTERNS) {
    const match = text.match(pattern);
    const candidate = clean(match?.[1] ?? "");
    if (candidate.length >= 4 && candidate.length <= 80) return candidate;
  }

  return null;
}

export function applicationPdfFileName(companyName: string): string {
  const slug =
    companyName
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "application";
  return `Mike-Sharifi-${slug}.pdf`;
}
