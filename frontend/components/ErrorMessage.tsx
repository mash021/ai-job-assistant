export function ErrorMessage({
  title = "Something went wrong",
  details,
  onRetry,
}: {
  title?: string;
  details?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-sm font-medium text-[var(--text)]">{title}</p>
      {details && (
        <pre className="overflow-x-auto text-sm leading-relaxed text-[var(--text-muted)]">
          {details}
        </pre>
      )}
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary">
          Try again
        </button>
      )}
    </div>
  );
}
