"use client";

import { useState, useTransition } from "react";
import { addFitnessEntry } from "./actions";

const EMPTY = {
  activity: "",
  durationMin: "",
  caloriesBurned: "",
  sets: "",
  reps: "",
  weightKg: "",
  distanceKm: "",
  note: "",
};

export default function AddFitnessEntry({ loggedDate }: { loggedDate: string }) {
  const [form, setForm] = useState(EMPTY);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!form.activity.trim()) {
      setError("Bitte eine Aktivität angeben.");
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        await addFitnessEntry({
          loggedDate,
          activity: form.activity.trim(),
          durationMin: toNumberOrNull(form.durationMin),
          caloriesBurned: toNumberOrNull(form.caloriesBurned),
          sets: toNumberOrNull(form.sets),
          reps: toNumberOrNull(form.reps),
          weightKg: toNumberOrNull(form.weightKg),
          distanceKm: toNumberOrNull(form.distanceKm),
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
      <h2 className="text-sm font-semibold mb-3">Training hinzufügen</h2>
      <div className="flex flex-col gap-3">
        <Field label="Aktivität">
          <input
            type="text"
            placeholder="z. B. Laufen, Krafttraining Brust, Yoga…"
            value={form.activity}
            onChange={(e) => setForm((f) => ({ ...f, activity: e.target.value }))}
            className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
          />
        </Field>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <NumField label="Dauer (min)" value={form.durationMin} onChange={(v) => setForm((f) => ({ ...f, durationMin: v }))} />
          <NumField label="Kalorien" value={form.caloriesBurned} onChange={(v) => setForm((f) => ({ ...f, caloriesBurned: v }))} />
          <NumField label="Distanz (km)" value={form.distanceKm} onChange={(v) => setForm((f) => ({ ...f, distanceKm: v }))} />
          <NumField label="Sätze" value={form.sets} onChange={(v) => setForm((f) => ({ ...f, sets: v }))} />
          <NumField label="Wdh." value={form.reps} onChange={(v) => setForm((f) => ({ ...f, reps: v }))} />
          <NumField label="Gewicht (kg)" value={form.weightKg} onChange={(v) => setForm((f) => ({ ...f, weightKg: v }))} />
        </div>

        <Field label="Notiz (optional)">
          <input
            type="text"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
          />
        </Field>

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

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-black/70 dark:text-white/70">
      {label}
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
      />
    </label>
  );
}
