import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { searchOpenFoodFacts } from "@/lib/nutrition/openfoodfacts";
import type { NutritionResult } from "@/lib/nutrition/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const { data: localFoods, error } = await supabase
    .from("foods")
    .select(
      "id, name, brand, calories_kcal, protein_g, carbs_g, sugar_g, fat_g, fiber_g, salt_g, source, external_id"
    )
    .ilike("name", `%${q}%`)
    .order("name")
    .limit(8);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const localResults: NutritionResult[] = (localFoods ?? []).map((f) => ({
    foodId: f.id,
    name: f.name,
    brand: f.brand,
    caloriesKcal: Number(f.calories_kcal),
    proteinG: Number(f.protein_g),
    carbsG: Number(f.carbs_g),
    sugarG: Number(f.sugar_g),
    fatG: Number(f.fat_g),
    fiberG: f.fiber_g != null ? Number(f.fiber_g) : null,
    saltG: f.salt_g != null ? Number(f.salt_g) : null,
    source: "local",
    externalId: f.external_id,
  }));

  let externalResults: NutritionResult[] = [];
  try {
    externalResults = await searchOpenFoodFacts(q, 8);
  } catch {
    // Open Food Facts nicht erreichbar – lokale Treffer reichen trotzdem aus.
    externalResults = [];
  }

  // Bereits lokal gecachte Open-Food-Facts-Produkte nicht doppelt anzeigen.
  const localExternalIds = new Set(
    localResults.filter((r) => r.externalId).map((r) => r.externalId)
  );
  const dedupedExternal = externalResults.filter(
    (r) => !r.externalId || !localExternalIds.has(r.externalId)
  );

  return NextResponse.json({
    results: [...localResults, ...dedupedExternal],
  });
}
