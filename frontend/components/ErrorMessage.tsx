/**
 * Reusable error display.
 *
 * Shows a clear, friendly error message with optional details and an optional
 * "Try again" action. Used to standardize how failures look across the app.
 */

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
    <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="inline-flex items-center gap-2 font-medium text-red-700">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden="true" />
        {title}
      </p>

      {details && (
        <pre className="overflow-x-auto rounded-md bg-red-100/60 p-3 text-sm text-red-800">
          {details}
        </pre>
      )}

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
