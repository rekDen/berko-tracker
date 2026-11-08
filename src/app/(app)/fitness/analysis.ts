import { canonicalActivity } from "./activityAliases";
import type { FitnessLogRow } from "./types";

export interface DayGroup {
  date: string;
  entries: FitnessLogRow[];
}

export interface ActivityGroup {
  activity: string;
  days: DayGroup[]; // neueste zuerst
}

export type Trend = "better" | "worse" | "same";

export interface MetricChange {
  label: string;
  unit: string;
  previous: number;
  current: number;
  trend: Trend;
}

export interface ActivityComparison {
  activity: string;
  previousDate: string;
  currentDate: string;
  changes: MetricChange[];
  overall: Trend | "neutral";
}

export function groupByActivity(rows: FitnessLogRow[]): ActivityGroup[] {
  const map = new Map<string, Map<string, FitnessLogRow[]>>();
  for (const row of rows) {
    const activity = canonicalActivity(row.activity);
    const byDate = map.get(activity) ?? new Map<string, FitnessLogRow[]>();
    const list = byDate.get(row.logged_date) ?? [];
    list.push(row);
    byDate.set(row.logged_date, list);
    map.set(activity, byDate);
  }
  return [...map.entries()]
    .map(([activity, byDate]) => ({
      activity,
      days: [...byDate.entries()]
        .map(([date, entries]) => ({
          date,
          entries: entries.sort((a, b) => a.created_at.localeCompare(b.created_at)),
        }))
        .sort((a, b) => b.date.localeCompare(a.date)),
    }))
    .sort((a, b) => a.activity.localeCompare(b.activity, "de"));
}

interface DayMetrics {
  weight?: number;
  totalReps?: number;
  volume?: number;
  distance?: number;
  pace?: number; // min/km, niedriger = besser
  duration?: number;
}

function sum(values: (number | null)[]): number | undefined {
  const present = values.filter((v): v is number => v != null);
  return present.length ? present.reduce((a, b) => a + b, 0) : undefined;
}

function dayMetrics(entries: FitnessLogRow[]): DayMetrics {
  const weights = entries.map((e) => e.weight_kg).filter((v): v is number => v != null);
  const repsPerEntry = entries.map((e) =>
    e.reps != null ? (e.sets ?? 1) * e.reps : null
  );
  const volumePerEntry = entries.map((e) =>
    e.reps != null && e.weight_kg != null ? (e.sets ?? 1) * e.reps * e.weight_kg : null
  );
  const distance = sum(entries.map((e) => e.distance_km));
  const duration = sum(entries.map((e) => e.duration_min));
  // Tempo nur aus Einträgen, die beides haben
  const paced = entries.filter((e) => e.distance_km && e.duration_min);
  const pacedDistance = sum(paced.map((e) => e.distance_km));
  const pacedDuration = sum(paced.map((e) => e.duration_min));

  return {
    weight: weights.length ? Math.max(...weights) : undefined,
    totalReps: sum(repsPerEntry),
    volume: sum(volumePerEntry),
    distance,
    pace: pacedDistance && pacedDuration ? pacedDuration / pacedDistance : undefined,
    duration,
  };
}

const round = (v: number) => Math.round(v * 100) / 100;

function compare(
  label: string,
  unit: string,
  prev: number | undefined,
  cur: number | undefined,
  higherIsBetter: boolean | null
): MetricChange | null {
  if (prev == null || cur == null) return null;
  const p = round(prev);
  const c = round(cur);
  let trend: Trend = "same";
  if (c !== p && higherIsBetter !== null) {
    trend = c > p === higherIsBetter ? "better" : "worse";
  }
  return { label, unit, previous: p, current: c, trend };
}

/** Vergleicht die letzten beiden Trainingstage einer Übung. */
export function compareLatestTwo(group: ActivityGroup): ActivityComparison | null {
  if (group.days.length < 2) return null;
  const [current, previous] = group.days;
  const cur = dayMetrics(current.entries);
  const prev = dayMetrics(previous.entries);

  const hasStrength = cur.totalReps != null && prev.totalReps != null;
  const changes = [
    compare("Gewicht", "kg", prev.weight, cur.weight, true),
    compare("Wdh. gesamt", "", prev.totalReps, cur.totalReps, true),
    compare("Volumen", "kg", prev.volume, cur.volume, true),
    compare("Distanz", "km", prev.distance, cur.distance, true),
    compare("Tempo", "min/km", prev.pace, cur.pace, false),
    // Dauer nur bewerten, wenn sie die einzige Kennzahl ist (z. B. Plank)
    compare("Dauer", "min", prev.duration, cur.duration, hasStrength || cur.distance != null ? null : true),
  ].filter((c): c is MetricChange => c !== null);

  const better = changes.filter((c) => c.trend === "better").length;
  const worse = changes.filter((c) => c.trend === "worse").length;
  const overall: ActivityComparison["overall"] =
    changes.every((c) => c.trend === "same") ? "same"
    : better > worse ? "better"
    : worse > better ? "worse"
    : "neutral";

  return {
    activity: group.activity,
    previousDate: previous.date,
    currentDate: current.date,
    changes,
    overall,
  };
}

export interface WorkoutSpan {
  start: string; // created_at der ersten Laufband-Eingabe
  end: string; // created_at der letzten Situps-Eingabe
  minutes: number;
}

/**
 * Trainingstag = von der ersten Laufband-Eingabe bis zur letzten Situps-Eingabe
 * (jeweils Zeitpunkt der Erfassung). Erwartet die Einträge eines einzelnen Tages.
 */
export function workoutSpan(dayRows: FitnessLogRow[]): WorkoutSpan | null {
  const run = dayRows
    .filter((r) => canonicalActivity(r.activity) === "Laufband")
    .map((r) => r.created_at)
    .sort();
  const situps = dayRows
    .filter((r) => canonicalActivity(r.activity) === "Situps")
    .map((r) => r.created_at)
    .sort();
  if (run.length === 0 || situps.length === 0) return null;

  const start = run[0];
  const end = situps[situps.length - 1];
  const minutes = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  if (!(minutes > 0)) return null;
  return { start, end, minutes };
}

export function formatClock(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  }).format(new Date(iso));
}

export function formatMinutes(minutes: number): string {
  const total = Math.round(minutes);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}
