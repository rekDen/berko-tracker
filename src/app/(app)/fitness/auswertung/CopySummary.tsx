"use client";

import { useState } from "react";

export default function CopySummary({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: Text im Feld markieren, damit manuelles Kopieren möglich ist
      document.getElementById("summary-text")?.focus();
      (document.getElementById("summary-text") as HTMLTextAreaElement | null)?.select();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        id="summary-text"
        readOnly
        value={text}
        rows={12}
        className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1.5 text-xs font-mono"
      />
      <button
        type="button"
        onClick={copy}
        className="self-start rounded-md bg-foreground text-background py-1.5 px-3 text-xs font-medium"
      >
        {copied ? "Kopiert ✓" : "In Zwischenablage kopieren"}
      </button>
    </div>
  );
}
