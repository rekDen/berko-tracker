"use client";

import { useState, useTransition } from "react";
import { addProductivityEntry } from "./actions";

const EMPTY = {
  task: "",
  category: "",
  durationMin: "",
  completed: true,
  note: "",
};

export default function AddProductivityEntry({ loggedDate }: { loggedDate: string }) {
  const [form, setForm] = useState(EMPTY);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!form.task.trim()) {
      setError("Bitte eine Aufgabe angeben.");
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        await addProductivityEntry({
          loggedDate,
          task: form.task.trim(),
          category: form.category.trim() || null,
          durationMin: toNumberOrNull(form.durationMin),
          completed: form.completed,
          note: form.note.trim() || null,
        });
        setForm(EMPTY);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-4">
      <h2 className="text-sm font-semibold mb-3">Aufgabe hinzufügen</h2>
      <div className="flex flex-col gap-3">
        <Field label="Aufgabe">
          <input
            type="text"
            placeholder="z. B. Rechnungen bearbeiten, Deep Work Block…"
            value={form.task}
            onChange={(e) => setForm((f) => ({ ...f, task: e.target.value }))}
            className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Kategorie (optional)">
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
            />
          </Field>
          <Field label="Dauer (min)">
            <input
              type="number"
              step="1"
              value={form.durationMin}
              onChange={(e) => setForm((f) => ({ ...f, durationMin: e.target.value }))}
              className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
            />
          </Field>
        </div>

        <Field label="Notiz (optional)">
          <input
            type="text"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.completed}
            onChange={(e) => setForm((f) => ({ ...f, completed: e.target.checked }))}
          />
          Erledigt
        </label>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="rounded-md bg-foreground text-background py-2 text-sm font-medium disabled:opacity-60"
        >
          {pending ? "Speichern…" : "Eintrag hinzufügen"}
        </button>
      </div>
    </div>
  );
}

function toNumberOrNull(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-black/70 dark:text-white/70">
      {label}
      {children}
    </label>
  );
}
