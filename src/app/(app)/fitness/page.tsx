import { createClient } from "@/lib/supabase/server";
import { isValidISODate, todayISO } from "@/lib/date";
import Link from "next/link";
import DateNav from "@/components/DateNav";
import AddFitnessEntry from "./AddFitnessEntry";
import FitnessEntryRow from "./FitnessEntryRow";
import QuickAddFitness from "./QuickAddFitness";
import { formatClock, formatMinutes, workoutSpan } from "./analysis";
import { activityNames } from "./activityAliases";
import { PRESET_EXERCISES } from "./presetExercises";
import type { FitnessLogRow } from "./types";

const FITNESS_LOG_COLUMNS =
  "id, logged_date, activity, duration_min, calories_burned, sets, reps, weight_kg, distance_km, note, created_at";

export default async function FitnessPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = isValidISODate(params.date) ? params.date : todayISO();

  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("fitness_logs")
    .select(FITNESS_LOG_COLUMNS)
    .eq("logged_date", date)
    .order("created_at", { ascending: true });

  const [{ data: prevRow }, { data: nextRow }] = await Promise.all([
    supabase
      .from("fitness_logs")
      .select("logged_date")
      .lt("logged_date", date)
      .order("logged_date", { ascending: false })
      .limit(1),
    supabase
      .from("fitness_logs")
      .select("logged_date")
      .gt("logged_date", date)
      .order("logged_date", { ascending: true })
      .limit(1),
  ]);
  const prevEntryDate = (prevRow?.[0]?.logged_date as string | undefined) ?? null;
  const nextEntryDate = (nextRow?.[0]?.logged_date as string | undefined) ?? null;

  const historyResults = await Promise.all(
    PRESET_EXERCISES.map((activity) =>
      supabase
        .from("fitness_logs")
        .select(FITNESS_LOG_COLUMNS)
        .in("activity", activityNames(activity))
        .order("logged_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(3)
    )
  );

  const historyByActivity: Record<string, FitnessLogRow[]> = {};
  PRESET_EXERCISES.forEach((activity, i) => {
    historyByActivity[activity] = (historyResults[i].data ?? []) as FitnessLogRow[];
  });

  const rows = (entries ?? []) as FitnessLogRow[];
  const totalDuration = rows.reduce((sum, r) => sum + (r.duration_min ?? 0), 0);
  const totalCalories = rows.reduce((sum, r) => sum + (r.calories_burned ?? 0), 0);

  const span = workoutSpan(rows);

  return (
    <>
      <DateNav
        date={date}
        basePath="/fitness"
        prevEntryDate={prevEntryDate}
        nextEntryDate={nextEntryDate}
      />

      <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
        <h2 className="text-sm font-semibold mb-3">Tagesbilanz</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Einheiten" value={`${rows.length}`} unit="" />
          <Stat label="Dauer" value={`${round(span ? span.minutes : totalDuration)}`} unit="min" />
          <Stat label="Verbrannt" value={`${round(totalCalories)}`} unit="kcal" />
        </div>
        <p className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 text-xs text-black/60 dark:text-white/60">
          {span ? (
            <>
              Trainingstag: <strong>{formatMinutes(span.minutes)}</strong> · erste Eingabe Laufband{" "}
              {formatClock(span.start)} Uhr → letzte Eingabe Situps {formatClock(span.end)} Uhr
            </>
          ) : (
            "Trainingsdauer: sobald Laufband und Situps eingetragen sind (Zeit von der ersten Laufband- bis zur letzten Situps-Eingabe)."
          )}
        </p>
      </section>

      <Link
        href="/fitness/auswertung"
        className="rounded-xl border border-black/10 dark:border-white/10 p-4 text-sm font-medium text-center hover:bg-black/5 dark:hover:bg-white/10"
      >
        Auswertung aller Übungen →
      </Link>

      <QuickAddFitness loggedDate={date} historyByActivity={historyByActivity} />

      <AddFitnessEntry loggedDate={date} />

      <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
        <h2 className="text-sm font-semibold mb-1">Einträge</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50 py-3">
            Noch keine Einträge für diesen Tag.
          </p>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10">
            {rows.map((entry) => (
              <FitnessEntryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <p className="text-lg font-semibold leading-tight">
        {value}
        {unit && <span className="text-xs font-normal text-black/50 dark:text-white/50"> {unit}</span>}
      </p>
      <p className="text-[11px] text-black/50 dark:text-white/50">{label}</p>
    </div>
  );
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
