import type { FitnessLogRow } from "./types";

export function formatEntrySummary(entry: FitnessLogRow): string {
  return (
    [
      entry.duration_min != null && `${entry.duration_min} min`,
      entry.calories_burned != null && `${entry.calories_burned} kcal`,
      entry.distance_km != null && `${entry.distance_km} km`,
      entry.sets != null && entry.reps != null && `${entry.sets}×${entry.reps}`,
      entry.weight_kg != null && `${entry.weight_kg} kg`,
    ]
      .filter(Boolean)
      .join(" · ") || "Keine Details"
  );
}
