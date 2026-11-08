"use client";

import { useState, useTransition } from "react";
import { saveTips } from "./actions";

export default function TipsEditor({ initial }: { initial: string }) {
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const dirty = text !== saved;

  function save() {
    setError(null);
    setDone(false);
    startTransition(async () => {
      try {
        await saveTips(text);
        setSaved(text);
        setDone(true);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setDone(false);
        }}
        rows={16}
        className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm leading-relaxed outline-none focus:border-black/40 dark:focus:border-white/40"
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty}
          className="rounded-md bg-foreground text-background py-1.5 px-3 text-xs font-medium disabled:opacity-60"
        >
          {pending ? "Speichern…" : "Speichern"}
        </button>
        {done && !dirty && <span className="text-[11px] text-green-600 dark:text-green-400">Gespeichert ✓</span>}
        {dirty && !pending && <span className="text-[11px] text-black/50 dark:text-white/50">Ungespeicherte Änderungen</span>}
      </div>
    </div>
  );
}
