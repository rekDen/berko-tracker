"use client";

import { useState, useTransition } from "react";
import { createKpi } from "./actions";

export default function NewKpiForm() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!name.trim()) {
      setError("Bitte einen Namen angeben.");
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        await createKpi({
          name: name.trim(),
          unit: unit.trim() || null,
          targetValue: targetValue.trim() === "" ? null : Number(targetValue),
        });
        setName("");
        setUnit("");
        setTargetValue("");
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-4">
      <h2 className="text-sm font-semibold mb-3">Neue KPI anlegen</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Name, z. B. Umsatz, Schlafstunden…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        />
        <input
          type="text"
          placeholder="Einheit (optional), z. B. €, h, Stück"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        />
        <input
          type="number"
          step="0.1"
          placeholder="Zielwert (optional)"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={pending}
        className="mt-3 rounded-md bg-foreground text-background py-2 px-4 text-sm font-medium disabled:opacity-60"
      >
        {pending ? "Anlegen…" : "KPI anlegen"}
      </button>
    </div>
  );
}
