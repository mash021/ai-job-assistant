import Link from "next/link";

import { ComparisonDetail } from "@/components/ComparisonDetail";

export default async function ComparisonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <header className="animate-slide-up mb-12 flex items-center gap-5">
        <Link href="/history" className="btn-ghost">
          ← Back
        </Link>
        <div>
          <p className="label-caps">Record</p>
          <h1 className="mt-1 font-mono text-xl text-[var(--text)]">#{id}</h1>
        </div>
      </header>
      <ComparisonDetail id={Number(id)} />
    </main>
  );
}
