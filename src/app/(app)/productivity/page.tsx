import { createClient } from "@/lib/supabase/server";
import { isValidISODate, todayISO } from "@/lib/date";
import DateNav from "@/components/DateNav";
import AddProductivityEntry from "./AddProductivityEntry";
import ProductivityEntryRow from "./ProductivityEntryRow";
import type { ProductivityLogRow } from "./types";

export default async function ProductivityPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = isValidISODate(params.date) ? params.date : todayISO();

  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("productivity_logs")
    .select("id, logged_date, task, category, duration_min, completed, note, created_at")
    .eq("logged_date", date)
    .order("created_at", { ascending: true });

  const rows = (entries ?? []) as ProductivityLogRow[];
  const totalDuration = rows.reduce((sum, r) => sum + (r.duration_min ?? 0), 0);
  const completedCount = rows.filter((r) => r.completed).length;

  return (
    <>
      <DateNav date={date} basePath="/productivity" />

      <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
        <h2 className="text-sm font-semibold mb-3">Tagesbilanz</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Aufgaben" value={`${rows.length}`} unit="" />
          <Stat label="Erledigt" value={`${completedCount}/${rows.length}`} unit="" />
          <Stat label="Zeit" value={`${round(totalDuration)}`} unit="min" />
        </div>
      </section>

      <AddProductivityEntry loggedDate={date} />

      <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
        <h2 className="text-sm font-semibold mb-1">Einträge</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50 py-3">
            Noch keine Einträge für diesen Tag.
          </p>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10">
            {rows.map((entry) => (
              <ProductivityEntryRow key={entry.id} entry={entry} />
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
