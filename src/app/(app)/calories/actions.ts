"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { NutritionSource } from "@/lib/nutrition/types";

export interface AddLogEntryInput {
  name: string;
  brand: string | null;
  amountG: number;
  loggedDate: string;
  source: NutritionSource;
  foodId: string | null;
  externalId: string | null;
  per100: {
    caloriesKcal: number;
    proteinG: number;
    carbsG: number;
    sugarG: number;
    fatG: number;
    fiberG: number | null;
    saltG: number | null;
  };
}

export interface UpdateLogEntryInput {
  id: string;
  amountG?: number;
  name?: string;
  caloriesKcal?: number;
  proteinG?: number;
  carbsG?: number;
  sugarG?: number;
  fatG?: number;
  fiberG?: number | null;
  saltG?: number | null;
}

function scale(per100Value: number, amountG: number): number {
  return round((per100Value * amountG) / 100);
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nicht angemeldet");
  return { supabase, user };
}

export async function addLogEntry(input: AddLogEntryInput) {
  const { supabase, user } = await requireUser();

  let foodId = input.foodId;

  // Neues Lebensmittel (aus Open Food Facts oder manuell erfasst) in die
  // eigene Datenbank übernehmen, damit es beim nächsten Mal lokal gefunden wird.
  if (!foodId) {
    if (input.source === "openfoodfacts" && input.externalId) {
      const { data: existing } = await supabase
        .from("foods")
        .select("id")
        .eq("source", "openfoodfacts")
        .eq("external_id", input.externalId)
        .maybeSingle();

      if (existing) {
        foodId = existing.id;
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from("foods")
          .insert({
            name: input.name,
            brand: input.brand,
            calories_kcal: input.per100.caloriesKcal,
            protein_g: input.per100.proteinG,
            carbs_g: input.per100.carbsG,
            sugar_g: input.per100.sugarG,
            fat_g: input.per100.fatG,
            fiber_g: input.per100.fiberG,
            salt_g: input.per100.saltG,
            source: "openfoodfacts",
            external_id: input.externalId,
            created_by: user.id,
          })
          .select("id")
          .single();

        if (insertError) throw new Error(insertError.message);
        foodId = inserted.id;
      }
    } else if (input.source === "manual") {
      const { data: inserted, error: insertError } = await supabase
        .from("foods")
        .insert({
          name: input.name,
          brand: input.brand,
          calories_kcal: input.per100.caloriesKcal,
          protein_g: input.per100.proteinG,
          carbs_g: input.per100.carbsG,
          sugar_g: input.per100.sugarG,
          fat_g: input.per100.fatG,
          fiber_g: input.per100.fiberG,
          salt_g: input.per100.saltG,
          source: "manual",
          external_id: null,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (insertError) throw new Error(insertError.message);
      foodId = inserted.id;
    }
  }

  const { error } = await supabase.from("food_logs").insert({
    user_id: user.id,
    food_id: foodId,
    name: input.name,
    logged_date: input.loggedDate,
    amount_g: input.amountG,
    calories_kcal: scale(input.per100.caloriesKcal, input.amountG),
    protein_g: scale(input.per100.proteinG, input.amountG),
    carbs_g: scale(input.per100.carbsG, input.amountG),
    sugar_g: scale(input.per100.sugarG, input.amountG),
    fat_g: scale(input.per100.fatG, input.amountG),
    fiber_g: input.per100.fiberG != null ? scale(input.per100.fiberG, input.amountG) : null,
    salt_g: input.per100.saltG != null ? scale(input.per100.saltG, input.amountG) : null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/calories");
}

export async function updateLogEntry(input: UpdateLogEntryInput) {
  const { supabase, user } = await requireUser();

  const updates: Record<string, unknown> = { is_corrected: true };
  if (input.name !== undefined) updates.name = input.name;
  if (input.amountG !== undefined) updates.amount_g = input.amountG;
  if (input.caloriesKcal !== undefined) updates.calories_kcal = input.caloriesKcal;
  if (input.proteinG !== undefined) updates.protein_g = input.proteinG;
  if (input.carbsG !== undefined) updates.carbs_g = input.carbsG;
  if (input.sugarG !== undefined) updates.sugar_g = input.sugarG;
  if (input.fatG !== undefined) updates.fat_g = input.fatG;
  if (input.fiberG !== undefined) updates.fiber_g = input.fiberG;
  if (input.saltG !== undefined) updates.salt_g = input.saltG;

  const { error } = await supabase
    .from("food_logs")
    .update(updates)
    .eq("id", input.id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/calories");
}

export async function deleteLogEntry(id: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("food_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/calories");
}
