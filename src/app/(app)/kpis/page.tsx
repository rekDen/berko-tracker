import { createClient } from "@/lib/supabase/server";
import NewKpiForm from "./NewKpiForm";
import KpiCard from "./KpiCard";
import type { KpiEntryRow, KpiRow } from "./types";

export default async function KpisPage() {
  const supabase = await createClient();

  const { data: kpis } = await supabase
    .from("kpis")
    .select("id, name, unit, target_value, created_at")
    .order("created_at", { ascending: true });

  const kpiRows = (kpis ?? []) as KpiRow[];
  const kpiIds = kpiRows.map((k) => k.id);

  let entriesByKpi = new Map<string, KpiEntryRow[]>();
  if (kpiIds.length > 0) {
    const { data: entries } = await supabase
      .from("kpi_entries")
      .select("id, kpi_id, logged_date, value, note, created_at")
      .in("kpi_id", kpiIds)
      .order("logged_date", { ascending: false });

    entriesByKpi = (entries ?? []).reduce((map, entry) => {
      const list = map.get(entry.kpi_id) ?? [];
      list.push(entry as KpiEntryRow);
      map.set(entry.kpi_id, list);
      return map;
    }, new Map<string, KpiEntryRow[]>());
  }

  return (
    <>
      <NewKpiForm />

      {kpiRows.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">
          Noch keine KPIs angelegt. Lege oben deine erste Kennzahl an.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {kpiRows.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} entries={entriesByKpi.get(kpi.id) ?? []} />
          ))}
        </div>
      )}
    </>
  );
}
