export type NutritionSource = "local" | "openfoodfacts" | "manual";

// Alle Nährwerte beziehen sich auf 100 g bzw. 100 ml des Lebensmittels.
export interface NutritionResult {
  foodId: string | null;
  name: string;
  brand: string | null;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  sugarG: number;
  fatG: number;
  fiberG: number | null;
  saltG: number | null;
  source: NutritionSource;
  externalId: string | null;
}
