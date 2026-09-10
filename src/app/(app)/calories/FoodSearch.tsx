"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { NutritionResult } from "@/lib/nutrition/types";
import { addLogEntry } from "./actions";

const EMPTY_PER_100 = {
  caloriesKcal: 0,
  proteinG: 0,
  carbsG: 0,
  sugarG: 0,
  fatG: 0,
  fiberG: null as number | null,
  saltG: null as number | null,
};

const SOURCE_LABEL: Record<NutritionResult["source"], string> = {
  local: "Eigene DB",
  openfoodfacts: "Open Food Facts",
  manual: "Manuell",
};

export default function FoodSearch({ loggedDate }: { loggedDate: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NutritionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<NutritionResult | null>(null);
  const [amountG, setAmountG] = useState(100);
  const [per100, setPer100] = useState(EMPTY_PER_100);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (selected || manualMode) return;

    const handle = setTimeout(async () => {
      const trimmed = query.trim();
      if (trimmed.length < 2) {
        setResults([]);
        setSearchError(null);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setSearchError(null);
      try {
        const res = await fetch(
          `/api/nutrition/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );

        if (res.status === 401) {
          setResults([]);
          setSearchError("Sitzung abgelaufen – bitte Seite neu laden und erneut anmelden.");
          return;
        }

        if (!res.ok) {
          setResults([]);
          setSearchError(`Suche fehlgeschlagen (${res.status}).`);
          return;
        }

        const data = await res.json();
        setResults(data.results ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setResults([]);
          setSearchError("Suche fehlgeschlagen. Bitte erneut versuchen.");
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [query, selected, manualMode]);

  function selectResult(result: NutritionResult) {
    setSelected(result);
    setName(result.name);
    setBrand(result.brand);
    setPer100({
      caloriesKcal: result.caloriesKcal,
      proteinG: result.proteinG,
      carbsG: result.carbsG,
      sugarG: result.sugarG,
      fatG: result.fatG,
      fiberG: result.fiberG,
      saltG: result.saltG,
    });
    setResults([]);
  }

  function startManual() {
    setManualMode(true);
    setSelected(null);
    setName(query);
    setBrand(null);
    setPer100(EMPTY_PER_100);
    setResults([]);
  }

  function reset() {
    setQuery("");
    setResults([]);
    setSelected(null);
    setManualMode(false);
    setName("");
    setBrand(null);
    setAmountG(100);
    setPer100(EMPTY_PER_100);
    setError(null);
  }

  function submit() {
    if (!name.trim()) {
      setError("Bitte einen Namen angeben.");
      return;
    }
    if (amountG <= 0) {
      setError("Bitte eine Menge größer als 0 angeben.");
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        await addLogEntry({
          name: name.trim(),
          brand,
          amountG,
          loggedDate,
          source: manualMode ? "manual" : selected?.source ?? "manual",
          foodId: selected?.foodId ?? null,
          externalId: selected?.externalId ?? null,
          per100,
        });
        reset();
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  const showForm = selected || manualMode;

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-4">
      <h2 className="text-sm font-semibold mb-3">Lebensmittel hinzufügen</h2>

      {!showForm && (
        <div className="relative">
          <input
            type="text"
            placeholder="z. B. Banane, Haferflocken, Hähnchenbrust…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
          />
          {loading && (
            <p className="mt-2 text-xs text-black/50 dark:text-white/50">Suche…</p>
          )}
          {searchError && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">{searchError}</p>
          )}
          {!loading &&
            !searchError &&
            query.trim().length >= 2 &&
            results.length === 0 && (
              <p className="mt-2 text-xs text-black/50 dark:text-white/50">
                Keine Treffer gefunden.
              </p>
            )}
          {results.length > 0 && (
            <ul className="mt-2 divide-y divide-black/10 dark:divide-white/10 rounded-md border border-black/10 dark:border-white/10 overflow-hidden">
              {results.map((r, i) => (
                <li key={`${r.source}-${r.externalId ?? r.foodId ?? i}`}>
                  <button
                    type="button"
                    onClick={() => selectResult(r)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-between gap-2"
                  >
                    <span className="truncate">
                      {r.name}
                      {r.brand ? (
                        <span className="text-black/50 dark:text-white/50"> · {r.brand}</span>
                      ) : null}
                    </span>
                    <span className="shrink-0 text-xs text-black/50 dark:text-white/50">
                      {r.caloriesKcal} kcal/100g · {SOURCE_LABEL[r.source]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {query.trim().length >= 2 && !loading && (
            <button
              type="button"
              onClick={startManual}
              className="mt-2 text-xs underline underline-offset-2 text-black/60 dark:text-white/60"
            >
              Nicht gefunden? Manuell eingeben
            </button>
          )}
        </div>
      )}

      {showForm && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{name || "Neues Lebensmittel"}</p>
              {brand && (
                <p className="text-xs text-black/50 dark:text-white/50">{brand}</p>
              )}
              <p className="text-xs text-black/50 dark:text-white/50">
                {selected ? SOURCE_LABEL[selected.source] : "Manuell erfasst"}
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-xs underline underline-offset-2 text-black/60 dark:text-white/60"
            >
              Abbrechen
            </button>
          </div>

          {manualMode && (
            <Field label="Name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
              />
            </Field>
          )}

          <Field label="Menge (g/ml)">
            <input
              type="number"
              min={0}
              step="1"
              value={amountG}
              onChange={(e) => setAmountG(Number(e.target.value))}
              className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
            />
          </Field>

          <details className="text-sm" open={manualMode}>
            <summary className="cursor-pointer text-black/60 dark:text-white/60 text-xs">
              Nährwerte je 100 g/ml {manualMode ? "" : "(automatisch ermittelt – bei Bedarf korrigieren)"}
            </summary>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <NumberField
                label="Kalorien (kcal)"
                value={per100.caloriesKcal}
                onChange={(v) => setPer100((p) => ({ ...p, caloriesKcal: v }))}
              />
              <NumberField
                label="Eiweiß (g)"
                value={per100.proteinG}
                onChange={(v) => setPer100((p) => ({ ...p, proteinG: v }))}
              />
              <NumberField
                label="Kohlenhydrate (g)"
                value={per100.carbsG}
                onChange={(v) => setPer100((p) => ({ ...p, carbsG: v }))}
              />
              <NumberField
                label="davon Zucker (g)"
                value={per100.sugarG}
                onChange={(v) => setPer100((p) => ({ ...p, sugarG: v }))}
              />
              <NumberField
                label="Fett (g)"
                value={per100.fatG}
                onChange={(v) => setPer100((p) => ({ ...p, fatG: v }))}
              />
              <NumberField
                label="Ballaststoffe (g)"
                value={per100.fiberG ?? 0}
                onChange={(v) => setPer100((p) => ({ ...p, fiberG: v }))}
              />
            </div>
          </details>

          <div className="rounded-md bg-black/5 dark:bg-white/5 px-3 py-2 text-xs text-black/70 dark:text-white/70">
            Für {amountG} g/ml: <strong>{round((per100.caloriesKcal * amountG) / 100)} kcal</strong>
            {" · "}E {round((per100.proteinG * amountG) / 100)} g
            {" · "}KH {round((per100.carbsG * amountG) / 100)} g
            {" · "}Zucker {round((per100.sugarG * amountG) / 100)} g
            {" · "}Fett {round((per100.fatG * amountG) / 100)} g
          </div>

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
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-black/70 dark:text-white/70">
      {label}
      {children}
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-black/70 dark:text-white/70">
      {label}
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
      />
    </label>
  );
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
