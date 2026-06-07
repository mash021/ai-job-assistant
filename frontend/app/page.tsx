/**
 * Landing page (Epic 3 — Frontend Foundation).
 *
 * This is a server component that composes the page layout. It shows a feature
 * preview, embeds the interactive <AnalyzeForm /> (resume + job description
 * intake), and keeps the <HealthCheck /> connectivity proof visible.
 *
 * Epic 4 implements parsing & saving only — no AI match score or cover letter
 * yet. The feature cards below remain previews marked "Coming soon".
 */

import { AnalyzeForm } from "@/components/AnalyzeForm";
import { HealthCheck } from "@/components/HealthCheck";

// Static preview of the product's planned core features.
const FEATURES = [
  {
    title: "Match score",
    description:
      "See how well your resume matches a specific job description with an AI-powered score from 0 to 100.",
  },
  {
    title: "Skill gap analysis",
    description:
      "Discover which skills the job asks for that are missing or weak in your resume.",
  },
  {
    title: "Tailored cover letter",
    description:
      "Generate a personalized cover letter draft crafted for the exact role you want.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
      {/* Hero / introduction */}
      <header className="space-y-4 text-center">
        <span className="inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
          Portfolio project
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AI Job Assistant
        </h1>
        <p className="mx-auto max-w-xl text-lg text-slate-600">
          Upload your resume, compare it against any job description, and get an
          AI match score, missing skills, and a tailored cover letter.
        </p>
      </header>

      {/* Feature preview grid */}
      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-slate-600">{feature.description}</p>
            <span className="mt-auto pt-2 text-xs font-medium text-slate-400">
              Coming soon
            </span>
          </article>
        ))}
      </section>

      {/* Resume + job description intake (parsing & saving only) */}
      <AnalyzeForm />

      {/* Live backend connectivity check (client component) */}
      <HealthCheck />

      <footer className="text-center text-sm text-slate-400">
        Parsing stage · Epic 4. Match score and cover letter come later.
      </footer>
    </main>
  );
}
