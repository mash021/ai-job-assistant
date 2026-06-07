/**
 * Reusable loading indicator.
 *
 * A small animated spinner plus an optional label. Used anywhere the UI is
 * waiting on an async operation (e.g. an API call).
 */

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-500">
      {/* Tailwind's `animate-spin` rotates the bordered circle. */}
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
