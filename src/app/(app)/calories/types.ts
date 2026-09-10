export interface FoodLogRow {
  id: string;
  food_id: string | null;
  name: string;
  logged_date: string;
  amount_g: number;
  calories_kcal: number;
  protein_g: number;
  carbs_g: number;
  sugar_g: number;
  fat_g: number;
  fiber_g: number | null;
  salt_g: number | null;
  is_corrected: boolean;
  created_at: string;
}
