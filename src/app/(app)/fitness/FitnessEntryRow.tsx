"use client";

import { useState, useTransition } from "react";
import type { FitnessLogRow } from "./types";
import { deleteFitnessEntry, updateFitnessEntry } from "./actions";

export default function FitnessEntryRow({ entry }: { entry: FitnessLogRow }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    activity: entry.activity,
    durationMin: entry.duration_min?.toString() ?? "",
    caloriesBurned: entry.calories_burned?.toString() ?? "",
    sets: entry.sets?.toString() ?? "",
    reps: entry.reps?.toString() ?? "",
    weightKg: entry.weight_kg?.toString() ?? "",
    distanceKm: entry.distance_km?.toString() ?? "",
    note: entry.note ?? "",
  });

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await updateFitnessEntry({
          id: entry.id,
          activity: form.activity.trim(),
          durationMin: toNumberOrNull(form.durationMin),
          caloriesBurned: toNumberOrNull(form.caloriesBurned),
          sets: toNumberOrNull(form.sets),
          reps: toNumberOrNull(form.reps),
          weightKg: toNumberOrNull(form.weightKg),
          distanceKm: toNumberOrNull(form.distanceKm),
          note: form.note.trim() || null,
        });
        setEditing(false);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  function remove() {
    startTransition(async () => {
      try {
        await deleteFitnessEntry(entry.id);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  if (editing) {
    return (
      <li className="py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={form.activity}
            onChange={(e) => setForm((f) => ({ ...f, activity: e.target.value }))}
            className="text-sm font-medium rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1"
          />
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
          <MiniField label="Dauer" value={form.durationMin} onChange={(v) => setForm((f) => ({ ...f, durationMin: v }))} />
          <MiniField label="Kalorien" value={form.caloriesBurned} onChange={(v) => setForm((f) => ({ ...f, caloriesBurned: v }))} />
          <MiniField label="Distanz" value={form.distanceKm} onChange={(v) => setForm((f) => ({ ...f, distanceKm: v }))} />
          <MiniField label="Sätze" value={form.sets} onChange={(v) => setForm((f) => ({ ...f, sets: v }))} />
          <MiniField label="Wdh." value={form.reps} onChange={(v) => setForm((f) => ({ ...f, reps: v }))} />
          <MiniField label="Gewicht" value={form.weightKg} onChange={(v) => setForm((f) => ({ ...f, weightKg: v }))} />
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </li>
    );
  }

  return (
    <li className="py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{entry.activity}</p>
        <p className="text-xs text-black/50 dark:text-white/50">
          {[
            entry.duration_min != null && `${entry.duration_min} min`,
            entry.calories_burned != null && `${entry.calories_burned} kcal`,
            entry.distance_km != null && `${entry.distance_km} km`,
            entry.sets != null && entry.reps != null && `${entry.sets}×${entry.reps}`,
            entry.weight_kg != null && `${entry.weight_kg} kg`,
          ]
            .filter(Boolean)
            .join(" · ") || "Keine Details"}
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

function toNumberOrNull(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function MiniField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-[10px] font-medium text-black/60 dark:text-white/60">
      {label}
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
      />
    </label>
  );
}
