/**
 * History page (Epic 7).
 *
 * Lists all saved comparisons. The interactive list (loading, error, delete)
 * lives in the <HistoryList /> client component.
 */

import { HistoryList } from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Saved comparisons</h1>
        <p className="text-slate-600">
          Your previously analyzed resumes and job descriptions.
        </p>
      </header>

      <HistoryList />
    </main>
  );
}
