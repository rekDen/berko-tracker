import { createClient } from "@/lib/supabase/server";
import { isValidISODate, todayISO } from "@/lib/date";
import DateNav from "@/components/DateNav";
import FoodSearch from "./FoodSearch";
import LogEntryRow from "./LogEntryRow";
import type { FoodLogRow } from "./types";

export default async function CaloriesPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = isValidISODate(params.date) ? params.date : todayISO();

  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("food_logs")
    .select(
      "id, food_id, name, logged_date, amount_g, calories_kcal, protein_g, carbs_g, sugar_g, fat_g, fiber_g, salt_g, is_corrected, created_at"
    )
    .eq("logged_date", date)
    .order("created_at", { ascending: true });

  const rows = (entries ?? []) as FoodLogRow[];
  const totals = rows.reduce(
    (acc, r) => ({
      calories: acc.calories + Number(r.calories_kcal),
      protein: acc.protein + Number(r.protein_g),
      carbs: acc.carbs + Number(r.carbs_g),
      sugar: acc.sugar + Number(r.sugar_g),
      fat: acc.fat + Number(r.fat_g),
    }),
    { calories: 0, protein: 0, carbs: 0, sugar: 0, fat: 0 }
  );

  return (
    <>
      <DateNav date={date} basePath="/calories" />

      <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
        <h2 className="text-sm font-semibold mb-3">Tagesbilanz</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <Stat label="Kalorien" value={`${round(totals.calories)}`} unit="kcal" />
          <Stat label="Eiweiß" value={`${round(totals.protein)}`} unit="g" />
          <Stat label="Kohlenhydrate" value={`${round(totals.carbs)}`} unit="g" />
          <Stat label="davon Zucker" value={`${round(totals.sugar)}`} unit="g" />
          <Stat label="Fett" value={`${round(totals.fat)}`} unit="g" />
        </div>
      </section>

      <FoodSearch loggedDate={date} />

      <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
        <h2 className="text-sm font-semibold mb-1">Einträge</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50 py-3">
            Noch keine Einträge für diesen Tag.
          </p>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10">
            {rows.map((entry) => (
              <LogEntryRow key={entry.id} entry={entry} />
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
        <span className="text-xs font-normal text-black/50 dark:text-white/50"> {unit}</span>
      </p>
      <p className="text-[11px] text-black/50 dark:text-white/50">{label}</p>
    </div>
  );
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
