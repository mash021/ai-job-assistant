import { HistoryList } from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <header className="animate-slide-up mb-12 space-y-3">
        <p className="label-caps">Archive</p>
        <h1 className="text-4xl font-bold tracking-tight text-[var(--vivid-orange)]">
          History
        </h1>
        <p className="text-sm font-medium text-[var(--text-muted)]">Past resume analyses.</p>
      </header>
      <HistoryList />
    </main>
  );
}
