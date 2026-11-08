"use client";

import { useState, useTransition } from "react";
import { addFitnessEntry } from "./actions";
import { formatEntrySummary } from "./format";
import { PRESET_EXERCISES } from "./presetExercises";
import type { FitnessLogRow } from "./types";

export default function QuickAddFitness({
  loggedDate,
  historyByActivity,
}: {
  loggedDate: string;
  historyByActivity: Record<string, FitnessLogRow[]>;
}) {
  return (
    <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
      <h2 className="text-sm font-semibold mb-3">Standardübungen</h2>
      <div className="flex flex-col gap-3">
        {PRESET_EXERCISES.map((activity) => {
          const entries = historyByActivity[activity] ?? [];
          return (
            <QuickAddCard
              key={`${activity}-${entries[0]?.id ?? "empty"}`}
              activity={activity}
              loggedDate={loggedDate}
              entries={entries}
            />
          );
        })}
      </div>
    </section>
  );
}

function QuickAddCard({
  activity,
  loggedDate,
  entries,
}: {
  activity: string;
  loggedDate: string;
  entries: FitnessLogRow[];
}) {
  const latest = entries[0];
  const [form, setForm] = useState({
    durationMin: latest?.duration_min?.toString() ?? "",
    caloriesBurned: latest?.calories_burned?.toString() ?? "",
    distanceKm: latest?.distance_km?.toString() ?? "",
    sets: latest?.sets?.toString() ?? "",
    reps: latest?.reps?.toString() ?? "",
    weightKg: latest?.weight_kg?.toString() ?? "",
    note: "",
  });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function submit() {
    setError(null);
    setDone(false);
    startTransition(async () => {
      try {
        await addFitnessEntry({
          loggedDate,
          activity,
          durationMin: toNumberOrNull(form.durationMin),
          caloriesBurned: toNumberOrNull(form.caloriesBurned),
          sets: toNumberOrNull(form.sets),
          reps: toNumberOrNull(form.reps),
          weightKg: toNumberOrNull(form.weightKg),
          distanceKm: toNumberOrNull(form.distanceKm),
          note: form.note.trim() || null,
        });
        setDone(true);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-3">
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="text-sm font-medium">{activity}</p>
        {done && <span className="text-[11px] text-green-600 dark:text-green-400">Hinzugefügt ✓</span>}
      </div>

      {entries.length > 0 && (
        <ul className="text-[11px] text-black/50 dark:text-white/50 mb-2 space-y-0.5">
          {entries.map((entry) => (
            <li key={entry.id}>
              {formatShortDate(entry.logged_date)} · {formatEntrySummary(entry)}
              {entry.note && <span className="italic"> · „{entry.note}“</span>}
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <MiniField label="Dauer" value={form.durationMin} onChange={(v) => setForm((f) => ({ ...f, durationMin: v }))} />
        <MiniField label="Kalorien" value={form.caloriesBurned} onChange={(v) => setForm((f) => ({ ...f, caloriesBurned: v }))} />
        <MiniField label="Distanz" value={form.distanceKm} onChange={(v) => setForm((f) => ({ ...f, distanceKm: v }))} />
        <MiniField label="Sätze" value={form.sets} onChange={(v) => setForm((f) => ({ ...f, sets: v }))} />
        <MiniField label="Wdh." value={form.reps} onChange={(v) => setForm((f) => ({ ...f, reps: v }))} />
        <MiniField label="Gewicht" value={form.weightKg} onChange={(v) => setForm((f) => ({ ...f, weightKg: v }))} />
      </div>

      <label className="mt-2 flex flex-col gap-1 text-[10px] font-medium text-black/60 dark:text-white/60">
        Notiz
        <input
          type="text"
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          placeholder="Optional"
          className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </label>

      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-2">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={pending}
        className="mt-2 rounded-md bg-foreground text-background py-1.5 px-3 text-xs font-medium disabled:opacity-60"
      >
        {pending ? "Speichern…" : "Hinzufügen"}
      </button>
    </div>
  );
}

function toNumberOrNull(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function formatShortDate(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${day}.${month}.`;
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
