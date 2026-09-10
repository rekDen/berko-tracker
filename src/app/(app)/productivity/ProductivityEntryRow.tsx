"use client";

import { useState, useTransition } from "react";
import type { ProductivityLogRow } from "./types";
import { deleteProductivityEntry, updateProductivityEntry } from "./actions";

export default function ProductivityEntryRow({ entry }: { entry: ProductivityLogRow }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    task: entry.task,
    category: entry.category ?? "",
    durationMin: entry.duration_min?.toString() ?? "",
    completed: entry.completed,
    note: entry.note ?? "",
  });

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await updateProductivityEntry({
          id: entry.id,
          task: form.task.trim(),
          category: form.category.trim() || null,
          durationMin: toNumberOrNull(form.durationMin),
          completed: form.completed,
          note: form.note.trim() || null,
        });
        setEditing(false);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  function toggleCompleted() {
    startTransition(async () => {
      try {
        await updateProductivityEntry({ id: entry.id, completed: !entry.completed });
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  function remove() {
    startTransition(async () => {
      try {
        await deleteProductivityEntry(entry.id);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  if (editing) {
    return (
      <li className="py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            value={form.task}
            onChange={(e) => setForm((f) => ({ ...f, task: e.target.value }))}
            className="flex-1 text-sm font-medium rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1"
          />
          <div className="flex gap-3 text-xs shrink-0">
            <button onClick={save} disabled={pending} className="underline underline-offset-2">
              Speichern
            </button>
            <button onClick={() => setEditing(false)} className="underline underline-offset-2 text-black/50 dark:text-white/50">
              Abbrechen
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Kategorie"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="text-sm rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1"
          />
          <input
            type="number"
            placeholder="Dauer (min)"
            value={form.durationMin}
            onChange={(e) => setForm((f) => ({ ...f, durationMin: e.target.value }))}
            className="text-sm rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1"
          />
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </li>
    );
  }

  return (
    <li className="py-3 flex items-center justify-between gap-3">
      <label className="flex items-center gap-2 min-w-0">
        <input type="checkbox" checked={entry.completed} onChange={toggleCompleted} />
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${entry.completed ? "line-through text-black/40 dark:text-white/40" : ""}`}>
            {entry.task}
          </p>
          <p className="text-xs text-black/50 dark:text-white/50">
            {[entry.category, entry.duration_min != null && `${entry.duration_min} min`]
              .filter(Boolean)
              .join(" · ") || "Keine Details"}
          </p>
        </div>
      </label>
      <div className="flex gap-3 text-xs shrink-0">
        <button onClick={() => setEditing(true)} className="underline underline-offset-2">
          Korrigieren
        </button>
        <button onClick={remove} disabled={pending} className="underline underline-offset-2 text-red-600 dark:text-red-400">
          Löschen
        </button>
      </div>
    </li>
  );
}

function toNumberOrNull(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
