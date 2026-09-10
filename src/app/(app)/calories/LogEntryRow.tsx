"use client";

import { useState, useTransition } from "react";
import type { FoodLogRow } from "./types";
import { deleteLogEntry, updateLogEntry } from "./actions";

export default function LogEntryRow({ entry }: { entry: FoodLogRow }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    amountG: entry.amount_g,
    caloriesKcal: entry.calories_kcal,
    proteinG: entry.protein_g,
    carbsG: entry.carbs_g,
    sugarG: entry.sugar_g,
    fatG: entry.fat_g,
  });

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await updateLogEntry({ id: entry.id, ...form });
        setEditing(false);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  function remove() {
    startTransition(async () => {
      try {
        await deleteLogEntry(entry.id);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  if (editing) {
    return (
      <li className="py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{entry.name}</p>
          <div className="flex gap-3 text-xs">
            <button onClick={save} disabled={pending} className="underline underline-offset-2">
              Speichern
            </button>
            <button onClick={() => setEditing(false)} className="underline underline-offset-2 text-black/50 dark:text-white/50">
              Abbrechen
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <MiniField label="Menge (g)" value={form.amountG} onChange={(v) => setForm((f) => ({ ...f, amountG: v }))} />
          <MiniField label="kcal" value={form.caloriesKcal} onChange={(v) => setForm((f) => ({ ...f, caloriesKcal: v }))} />
          <MiniField label="Eiweiß" value={form.proteinG} onChange={(v) => setForm((f) => ({ ...f, proteinG: v }))} />
          <MiniField label="KH" value={form.carbsG} onChange={(v) => setForm((f) => ({ ...f, carbsG: v }))} />
          <MiniField label="Zucker" value={form.sugarG} onChange={(v) => setForm((f) => ({ ...f, sugarG: v }))} />
          <MiniField label="Fett" value={form.fatG} onChange={(v) => setForm((f) => ({ ...f, fatG: v }))} />
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </li>
    );
  }

  return (
    <li className="py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">
          {entry.name}
          {entry.is_corrected && (
            <span className="ml-2 text-[10px] uppercase tracking-wide text-amber-600 dark:text-amber-400">
              korrigiert
            </span>
          )}
        </p>
        <p className="text-xs text-black/50 dark:text-white/50">
          {entry.amount_g} g · {entry.calories_kcal} kcal · E {entry.protein_g}g · KH {entry.carbs_g}g
          {" "}(Zucker {entry.sugar_g}g) · Fett {entry.fat_g}g
        </p>
      </div>
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

function MiniField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-[10px] font-medium text-black/60 dark:text-white/60">
      {label}
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
      />
    </label>
  );
}
