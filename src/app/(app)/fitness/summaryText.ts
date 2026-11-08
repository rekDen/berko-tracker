import { compareLatestTwo, formatMinutes } from "./analysis";
import type { ActivityGroup, WorkoutSpan } from "./analysis";
import type { FitnessLogRow } from "./types";

const SESSIONS_PER_EXERCISE = 6;
const TREND_WORD = { better: "besser", worse: "schlechter", same: "gleich" } as const;

function entryLine(e: FitnessLogRow): string {
  const parts = [
    e.sets != null && e.reps != null ? `${e.sets}×${e.reps}` : e.reps != null ? `${e.reps} Wdh.` : null,
    e.weight_kg != null ? `${e.weight_kg} kg` : null,
    e.duration_min != null ? `${e.duration_min} min` : null,
    e.distance_km != null ? `${e.distance_km} km` : null,
    e.note ? `Notiz: „${e.note}“` : null,
  ].filter(Boolean);
  return parts.join(", ") || "keine Details";
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b + "T00:00:00Z").getTime() - new Date(a + "T00:00:00Z").getTime()) / 86400000
  );
}

export function buildSummaryText(
  groups: ActivityGroup[],
  sessions: { date: string; span: WorkoutSpan }[],
  trainingDates: string[],
  today: string
): string {
  const lines: string[] = [];
  const dates = [...new Set(trainingDates)].sort();

  lines.push("# Mein Krafttraining – Zusammenfassung");
  lines.push("");
  lines.push("## Eckdaten");
  if (dates.length === 0) {
    lines.push("- Noch keine Trainingsdaten vorhanden.");
  } else {
    const first = dates[0];
    const last = dates[dates.length - 1];
    const weeks = Math.max(1, daysBetween(first, today) / 7);
    const recent = dates.filter((d) => daysBetween(d, today) <= 56).length;
    lines.push(`- Erstes erfasstes Training: ${first}, letztes: ${last} (Stand ${today})`);
    lines.push(`- Trainingstage insgesamt: ${dates.length} (≈ ${(dates.length / weeks).toFixed(1)} pro Woche im Schnitt)`);
    lines.push(`- Trainingstage in den letzten 8 Wochen: ${recent} (≈ ${(recent / 8).toFixed(1)} pro Woche)`);
  }
  if (sessions.length > 0) {
    const recentSessions = sessions.slice(0, 5);
    const avg = recentSessions.reduce((s, x) => s + x.span.minutes, 0) / recentSessions.length;
    lines.push(`- Ø Dauer der letzten ${recentSessions.length} Trainingstage (Laufband→Situps): ${formatMinutes(avg)}`);
  }
  lines.push("- Weitere Angaben (bitte ergänzen): Alter ?, Trainingserfahrung ?, Kalorienbilanz ?, Schlaf ?");
  lines.push("");

  lines.push("## Übungen (neueste zuerst, Gewicht in kg)");
  for (const g of groups) {
    lines.push("");
    lines.push(`### ${g.activity}`);
    if (g.days.length === 0) {
      lines.push("- keine Einträge");
      continue;
    }
    for (const day of g.days.slice(0, SESSIONS_PER_EXERCISE)) {
      lines.push(`- ${day.date}: ${day.entries.map(entryLine).join(" | ")}`);
    }
    const cmp = compareLatestTwo(g);
    if (cmp && cmp.changes.length > 0) {
      lines.push(
        `- Letzter Vergleich (${cmp.previousDate} → ${cmp.currentDate}): ` +
          cmp.changes
            .map((c) => `${c.label} ${c.previous} → ${c.current}${c.unit ? " " + c.unit : ""} (${TREND_WORD[c.trend]})`)
            .join("; ")
      );
    }
  }

  lines.push("");
  lines.push("## Frage");
  lines.push(
    "Bitte werte mein Training aus: Wo mache ich Fortschritte, wo stagniere ich? Wie realistisch ist es, " +
      "dass ich bei diesem Trainingsumfang und dieser Progression sichtbar Muskeln aufbaue, und wie lange wird das " +
      "voraussichtlich noch dauern? Was sollte ich an Trainingshäufigkeit, Volumen, Progression, Ernährung und Erholung ändern? " +
      "Fehlende Angaben (Körperdaten etc.) frag bitte nach."
  );
  lines.push("");
  lines.push("Täglich esse ich etwa 150g Protein und bin 89kg schwer und 181cm groß.");
  lines.push("Bei Bankdrücken und Kreuzheben habe ich die 20kg Stange nicht dazugerechnet.");
  return lines.join("\n");
}
