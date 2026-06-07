"use client";

/**
 * Copy-to-clipboard button.
 *
 * Copies the provided text via the browser Clipboard API and briefly shows a
 * "Copied!" confirmation. Falls back gracefully if the API is unavailable.
 */

import { useState } from "react";

export function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // Reset the label after a short delay.
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can fail (e.g. insecure context); keep the UI silent-safe.
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
