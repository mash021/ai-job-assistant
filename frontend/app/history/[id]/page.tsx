/**
 * Comparison detail route: /history/[id]
 *
 * In Next.js 15 `params` is async, so we await it, parse the id, and hand it to
 * the <ComparisonDetail /> client component which fetches and renders the data.
 */

import { ComparisonDetail } from "@/components/ComparisonDetail";

export default async function ComparisonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-bold">Comparison #{id}</h1>
      <ComparisonDetail id={Number(id)} />
    </main>
  );
}
