import { AnalyzeForm } from "@/components/AnalyzeForm";
import { HealthCheck } from "@/components/HealthCheck";
import { IconDocument, IconLayers, IconTarget } from "@/components/Icons";

const FEATURES = [
  {
    icon: IconTarget,
    title: "Match score",
    description: "A clear compatibility rating for every role you pursue.",
  },
  {
    icon: IconLayers,
    title: "Skill analysis",
    description: "See which requirements you meet — and which you don't.",
  },
  {
    icon: IconDocument,
    title: "Cover letter",
    description: "A tailored draft written for the specific position.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <header className="animate-slide-up mb-16 space-y-5">
        <p className="label-caps">Resume intelligence</p>
        <h1 className="max-w-md text-4xl font-bold leading-[1.1] tracking-tight text-[var(--text)] sm:text-5xl">
          Know where you{" "}
          <span className="text-[var(--vivid-orange)]">stand</span> before you apply.
        </h1>
        <p className="max-w-sm text-base font-medium leading-relaxed text-[var(--text-muted)]">
          Upload a resume, add a job description, and receive a structured
          analysis in seconds.
        </p>
      </header>

      <section className="mb-16 grid gap-4 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <article key={title} className="card-interactive space-y-4">
            <span className="icon-box">
              <Icon />
            </span>
            <h3 className="text-base font-bold text-[var(--text)]">{title}</h3>
            <p className="text-sm font-medium leading-relaxed text-[var(--text-muted)]">
              {description}
            </p>
          </article>
        ))}
      </section>

      <AnalyzeForm />

      <details className="mt-14">
        <summary className="label-caps cursor-pointer transition hover:text-[var(--text)]">
          System status
        </summary>
        <div className="mt-5">
          <HealthCheck />
        </div>
      </details>

      <footer className="mt-16 text-center">
        <p className="label-caps">Mock provider · Development</p>
      </footer>
    </main>
  );
}
