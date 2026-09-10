import { createClient } from "@/lib/supabase/server";
import { isValidISODate, todayISO } from "@/lib/date";
import DateNav from "@/components/DateNav";
import AddFitnessEntry from "./AddFitnessEntry";
import FitnessEntryRow from "./FitnessEntryRow";
import QuickAddFitness from "./QuickAddFitness";
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

  const historyResults = await Promise.all(
    PRESET_EXERCISES.map((activity) =>
      supabase
        .from("fitness_logs")
        .select(FITNESS_LOG_COLUMNS)
        .eq("activity", activity)
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

  return (
    <>
      <DateNav date={date} basePath="/fitness" />

      <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
        <h2 className="text-sm font-semibold mb-3">Tagesbilanz</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Einheiten" value={`${rows.length}`} unit="" />
          <Stat label="Dauer" value={`${round(totalDuration)}`} unit="min" />
          <Stat label="Verbrannt" value={`${round(totalCalories)}`} unit="kcal" />
        </div>
      </section>

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
