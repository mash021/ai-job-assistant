export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-[var(--text-muted)]">
      <span
        className="h-5 w-5 animate-spin rounded-full border-[3px] border-[var(--vivid-teal)] border-t-[var(--vivid-orange)]"
        aria-hidden="true"
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}
