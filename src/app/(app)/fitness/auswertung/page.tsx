import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateDisplay, todayISO } from "@/lib/date";
import { compareLatestTwo, formatClock, formatMinutes, groupByActivity, workoutSpan } from "../analysis";
import type { ActivityGroup, MetricChange, Trend } from "../analysis";
import CopySummary from "./CopySummary";
import { buildSummaryText } from "../summaryText";
import { EVALUATED_EXERCISES } from "../evaluatedExercises";
import type { FitnessLogRow } from "../types";

const COLUMNS =
  "id, logged_date, activity, duration_min, calories_burned, sets, reps, weight_kg, distance_km, note, created_at";

const TREND_STYLE: Record<Trend, string> = {
  better: "text-green-600 dark:text-green-400",
  worse: "text-red-600 dark:text-red-400",
  same: "text-black/50 dark:text-white/50",
};
const TREND_ICON: Record<Trend, string> = { better: "▲", worse: "▼", same: "＝" };
const CARD = "rounded-xl border border-black/10 dark:border-white/10 p-4";
const MUTED = "text-black/50 dark:text-white/50";

export default async function FitnessAnalysisPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("fitness_logs")
    .select(COLUMNS)
    .order("logged_date", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(5000);

  const byName = new Map(
    groupByActivity((data ?? []) as FitnessLogRow[]).map((g) => [g.activity, g])
  );
  const groups: ActivityGroup[] = EVALUATED_EXERCISES.map(
    (name) => byName.get(name) ?? { activity: name, days: [] }
  );
  const allRows = (data ?? []) as FitnessLogRow[];
  const rowsByDate = new Map<string, FitnessLogRow[]>();
  for (const r of allRows) {
    rowsByDate.set(r.logged_date, [...(rowsByDate.get(r.logged_date) ?? []), r]);
  }
  const sessions = [...rowsByDate.entries()]
    .map(([date, dayRows]) => ({ date, span: workoutSpan(dayRows) }))
    .filter((s): s is { date: string; span: NonNullable<typeof s.span> } => s.span !== null)
    .sort((x, y) => y.date.localeCompare(x.date));

  const summaryText = buildSummaryText(
    groups,
    sessions,
    allRows.map((r) => r.logged_date),
    todayISO()
  );

  const rows = groups.map((group) => ({ group, comparison: compareLatestTwo(group) }));

  const compared = rows.filter((r) => r.comparison);
  const count = (t: Trend | "neutral") =>
    compared.filter((r) => r.comparison!.overall === t).length;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Fitness-Auswertung</h1>
        <Link href="/fitness" className="text-sm underline underline-offset-2">
          ← Zurück
        </Link>
      </div>

      <section className={CARD}>
        <h2 className="text-sm font-semibold">Summary</h2>
        <p className={`text-xs ${MUTED} mb-3`}>
          Letzter Trainingstag im Vergleich zum davor.
        </p>
        <p className="text-sm mb-3 flex flex-wrap gap-x-4 gap-y-1">
          <span className={TREND_STYLE.better}>▲ {count("better")} verbessert</span>
          <span className={TREND_STYLE.worse}>▼ {count("worse")} verschlechtert</span>
          <span className={TREND_STYLE.same}>
            ＝ {count("same") + count("neutral")} unverändert/gemischt
          </span>
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={MUTED}>
              <tr>
                <th className="py-1 pr-3 font-medium">Übung</th>
                <th className="py-1 pr-3 font-medium">Vergleich</th>
                <th className="py-1 font-medium">Veränderung</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ group, comparison }) => (
                <tr
                  key={group.activity}
                  className="border-t border-black/10 dark:border-white/10 align-top"
                >
                  <td className="py-2 pr-3 font-medium">
                    <a href={`#${anchor(group.activity)}`} className="hover:underline">
                      {group.activity}
                    </a>
                  </td>
                  {comparison ? (
                    <>
                      <td className={`py-2 pr-3 whitespace-nowrap ${MUTED}`}>
                        {shortDate(comparison.previousDate)} → {shortDate(comparison.currentDate)}
                      </td>
                      <td className="py-2">
                        <ul className="flex flex-col gap-0.5">
                          {comparison.changes.map((m) => (
                            <ChangeItem key={m.label} m={m} />
                          ))}
                        </ul>
                      </td>
                    </>
                  ) : (
                    <td colSpan={2} className={`py-2 ${MUTED}`}>
                      {group.days.length === 0
                        ? "Noch keine Einträge"
                        : "Nur ein Trainingstag – kein Vergleich möglich"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={CARD}>
        <h2 className="text-sm font-semibold">Zusammenfassung zum Kopieren</h2>
        <p className={`text-xs ${MUTED} mb-3`}>
          Textfassung deiner letzten Trainingsergebnisse – einfach kopieren und z. B. Claude einfügen, inklusive Frage
          nach dem Muskelaufbau. Die Zeile „Weitere Angaben“ bitte vorher ergänzen.
        </p>
        <CopySummary text={summaryText} />
      </section>

      <section className={CARD}>
        <h2 className="text-sm font-semibold">Trainingsdauer</h2>
        <p className={`text-xs ${MUTED} mb-3`}>
          Von der ersten Laufband-Eingabe bis zur letzten Situps-Eingabe (Zeitpunkt der Erfassung).
        </p>
        {sessions.length === 0 ? (
          <p className={`text-sm ${MUTED}`}>Noch keine Trainingstage mit Laufband und Situps.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className={MUTED}>
                <tr>
                  <th className="py-1 pr-3 font-medium">Datum</th>
                  <th className="py-1 pr-3 font-medium">Start (Laufband)</th>
                  <th className="py-1 pr-3 font-medium">Ende (Situps)</th>
                  <th className="py-1 font-medium">Dauer</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(({ date, span }) => (
                  <tr key={date} className="border-t border-black/10 dark:border-white/10">
                    <td className="py-1.5 pr-3 whitespace-nowrap">{shortDate(date)}</td>
                    <td className="py-1.5 pr-3">{formatClock(span.start)} Uhr</td>
                    <td className="py-1.5 pr-3">{formatClock(span.end)} Uhr</td>
                    <td className="py-1.5 font-medium">{formatMinutes(span.minutes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Verlauf je Übung</h2>
        {groups.map((group) => (
          <details
            key={group.activity}
            id={anchor(group.activity)}
            className={`${CARD} group scroll-mt-4`}
          >
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{group.activity}</span>
              <span className={`text-xs ${MUTED}`}>
                {group.days.length === 0
                  ? "keine Einträge"
                  : `${group.days.length} Tage · zuletzt ${shortDate(group.days[0].date)}`}
              </span>
            </summary>
            {group.days.length > 0 && (
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs text-left">
                  <thead className={MUTED}>
                    <tr>
                      <th className="py-1 pr-3 font-medium">Datum</th>
                      <th className="py-1 pr-3 font-medium">Sätze × Wdh.</th>
                      <th className="py-1 pr-3 font-medium">Gewicht</th>
                      <th className="py-1 pr-3 font-medium">Dauer</th>
                      <th className="py-1 pr-3 font-medium">Distanz</th>
                      <th className="py-1 pr-3 font-medium">kcal</th>
                      <th className="py-1 font-medium">Kommentar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.days.flatMap((day) =>
                      day.entries.map((e, i) => (
                        <tr
                          key={e.id}
                          className={`align-top ${
                            i === 0 ? "border-t border-black/10 dark:border-white/10" : ""
                          }`}
                        >
                          <td className="py-1.5 pr-3 whitespace-nowrap font-medium">
                            {i === 0 ? shortDate(day.date) : ""}
                          </td>
                          <td className="py-1.5 pr-3 whitespace-nowrap">
                            {e.sets != null && e.reps != null ? `${e.sets}×${e.reps}` : e.reps ?? "–"}
                          </td>
                          <td className="py-1.5 pr-3 whitespace-nowrap">{val(e.weight_kg, "kg")}</td>
                          <td className="py-1.5 pr-3 whitespace-nowrap">{val(e.duration_min, "min")}</td>
                          <td className="py-1.5 pr-3 whitespace-nowrap">{val(e.distance_km, "km")}</td>
                          <td className="py-1.5 pr-3 whitespace-nowrap">{val(e.calories_burned, "")}</td>
                          <td className="py-1.5 min-w-40">{e.note || "–"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </details>
        ))}
      </div>
    </>
  );
}

function ChangeItem({ m }: { m: MetricChange }) {
  return (
    <li className={TREND_STYLE[m.trend]}>
      {TREND_ICON[m.trend]} {m.label}: {m.previous} → {m.current}
      {m.unit && ` ${m.unit}`}
    </li>
  );
}

function val(v: number | null, unit: string) {
  return v == null ? "–" : unit ? `${v} ${unit}` : `${v}`;
}

function anchor(name: string) {
  return "ex-" + name.toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-");
}

function shortDate(iso: string) {
  return formatDateDisplay(iso).replace(/^\S+,\s*/, "");
}
