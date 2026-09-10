import type { NutritionResult } from "./types";

interface OffNutriments {
  "energy-kcal_100g"?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fat_100g?: number;
  fiber_100g?: number;
  salt_100g?: number;
}

interface OffHit {
  code: string;
  product_name?: string;
  product_name_de?: string;
  brands?: string[];
  nutriments?: OffNutriments;
}

interface OffSearchResponse {
  hits?: OffHit[];
}

// Search-a-licious: der von Open Food Facts empfohlene Nachfolger der
// veralteten /cgi/search.pl Volltextsuche.
// Doku: https://openfoodfacts.github.io/openfoodfacts-server/api/ und
// https://search.openfoodfacts.org/docs
const SEARCH_URL = "https://search.openfoodfacts.org/search";
const FIELDS = "code,product_name,product_name_de,brands,nutriments";

// Durchsucht die öffentliche Open Food Facts Datenbank nach Lebensmitteln
// und normalisiert die Treffer auf unser gemeinsames Nährwert-Format (pro 100g).
export async function searchOpenFoodFacts(
  query: string,
  limit = 10
): Promise<NutritionResult[]> {
  const url = new URL(SEARCH_URL);
  url.searchParams.set("q", query);
  // Deutschsprachige Felder (product_name.de etc.) bei der Suche bevorzugen.
  url.searchParams.set("langs", "de");
  url.searchParams.set("page_size", String(limit));
  url.searchParams.set("fields", FIELDS);

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "Tracker/1.0 (Next.js + Supabase App)",
    },
    // Suchergebnisse dürfen kurz gecacht werden, ändern sich selten.
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Open Food Facts Anfrage fehlgeschlagen: ${res.status}`);
  }

  const data = (await res.json()) as OffSearchResponse;
  const hits = data.hits ?? [];

  return hits.map(normalizeHit).filter((p): p is NutritionResult => p !== null);
}

function normalizeHit(hit: OffHit): NutritionResult | null {
  const name = hit.product_name_de || hit.product_name;
  const n = hit.nutriments;

  if (!name || !n || n["energy-kcal_100g"] == null) {
    return null;
  }

  return {
    foodId: null,
    name,
    brand: hit.brands?.[0]?.trim() || null,
    caloriesKcal: round(n["energy-kcal_100g"]),
    proteinG: round(n.proteins_100g ?? 0),
    carbsG: round(n.carbohydrates_100g ?? 0),
    sugarG: round(n.sugars_100g ?? 0),
    fatG: round(n.fat_100g ?? 0),
    fiberG: n.fiber_100g != null ? round(n.fiber_100g) : null,
    saltG: n.salt_100g != null ? round(n.salt_100g) : null,
    source: "openfoodfacts",
    externalId: hit.code,
  };
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
