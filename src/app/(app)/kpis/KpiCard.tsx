"use client";

import { useState, useTransition } from "react";
import { todayISO, formatDateDisplay } from "@/lib/date";
import type { KpiEntryRow, KpiRow } from "./types";
import { addKpiEntry, deleteKpi, deleteKpiEntry, updateKpiEntry } from "./actions";

export default function KpiCard({
  kpi,
  entries,
}: {
  kpi: KpiRow;
  entries: KpiEntryRow[];
}) {
  const [value, setValue] = useState("");
  const [loggedDate, setLoggedDate] = useState(todayISO());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const latest = entries[0];

  function submitEntry() {
    if (value.trim() === "" || Number.isNaN(Number(value))) {
      setError("Bitte einen Wert angeben.");
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        await addKpiEntry({ kpiId: kpi.id, loggedDate, value: Number(value), note: null });
        setValue("");
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  function removeKpi() {
    if (!confirm(`KPI "${kpi.name}" inklusive aller Werte löschen?`)) return;
    startTransition(async () => {
      try {
        await deleteKpi(kpi.id);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{kpi.name}</h3>
          <p className="text-xs text-black/50 dark:text-white/50">
            {latest ? `Zuletzt: ${latest.value}${kpi.unit ? ` ${kpi.unit}` : ""} · ${formatDateDisplay(latest.logged_date)}` : "Noch kein Wert erfasst"}
            {kpi.target_value != null && ` · Ziel: ${kpi.target_value}${kpi.unit ? ` ${kpi.unit}` : ""}`}
          </p>
        </div>
        <button
          type="button"
          onClick={removeKpi}
          className="text-xs underline underline-offset-2 text-red-600 dark:text-red-400 shrink-0"
        >
          KPI löschen
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-xs font-medium text-black/70 dark:text-white/70">
          Datum
          <input
            type="date"
            value={loggedDate}
            onChange={(e) => setLoggedDate(e.target.value)}
            className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1.5 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-black/70 dark:text-white/70">
          Wert{kpi.unit ? ` (${kpi.unit})` : ""}
          <input
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-28 rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1.5 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={submitEntry}
          disabled={pending}
          className="rounded-md bg-foreground text-background py-1.5 px-3 text-sm font-medium disabled:opacity-60"
        >
          Erfassen
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}

      {entries.length > 0 && (
        <ul className="mt-3 divide-y divide-black/10 dark:divide-white/10 border-t border-black/10 dark:border-white/10">
          {entries.slice(0, 10).map((entry) => (
            <KpiEntryItem key={entry.id} entry={entry} unit={kpi.unit} />
          ))}
        </ul>
      )}
    </div>
  );
}

function KpiEntryItem({ entry, unit }: { entry: KpiEntryRow; unit: string | null }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(entry.value.toString());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    if (value.trim() === "" || Number.isNaN(Number(value))) {
      setError("Ungültiger Wert.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await updateKpiEntry({ id: entry.id, value: Number(value) });
        setEditing(false);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  function remove() {
    startTransition(async () => {
      try {
        await deleteKpiEntry(entry.id);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <li className="py-2 flex items-center justify-between gap-3 text-sm">
      <span className="text-black/60 dark:text-white/60">{formatDateDisplay(entry.logged_date)}</span>
      {editing ? (
        <input
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-24 rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1 text-sm"
        />
      ) : (
        <span className="font-medium">
          {entry.value}
          {unit ? ` ${unit}` : ""}
        </span>
      )}
      <div className="flex gap-2 text-xs shrink-0">
        {editing ? (
          <>
            <button onClick={save} disabled={pending} className="underline underline-offset-2">
              Speichern
            </button>
            <button onClick={() => setEditing(false)} className="underline underline-offset-2 text-black/50 dark:text-white/50">
              Abbrechen
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="underline underline-offset-2">
              Korrigieren
            </button>
            <button onClick={remove} disabled={pending} className="underline underline-offset-2 text-red-600 dark:text-red-400">
              Löschen
            </button>
          </>
        )}
      </div>
      {error && <span className="text-red-600 dark:text-red-400">{error}</span>}
    </li>
  );
}
