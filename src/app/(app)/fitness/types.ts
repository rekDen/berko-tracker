export interface FitnessLogRow {
  id: string;
  logged_date: string;
  activity: string;
  duration_min: number | null;
  calories_burned: number | null;
  sets: number | null;
  reps: number | null;
  weight_kg: number | null;
  distance_km: number | null;
  note: string | null;
  created_at: string;
}
