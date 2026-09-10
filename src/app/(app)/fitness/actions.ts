"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AddFitnessEntryInput {
  loggedDate: string;
  activity: string;
  durationMin: number | null;
  caloriesBurned: number | null;
  sets: number | null;
  reps: number | null;
  weightKg: number | null;
  distanceKm: number | null;
  note: string | null;
}

export interface UpdateFitnessEntryInput {
  id: string;
  activity?: string;
  durationMin?: number | null;
  caloriesBurned?: number | null;
  sets?: number | null;
  reps?: number | null;
  weightKg?: number | null;
  distanceKm?: number | null;
  note?: string | null;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nicht angemeldet");
  return { supabase, user };
}

export async function addFitnessEntry(input: AddFitnessEntryInput) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("fitness_logs").insert({
    user_id: user.id,
    logged_date: input.loggedDate,
    activity: input.activity,
    duration_min: input.durationMin,
    calories_burned: input.caloriesBurned,
    sets: input.sets,
    reps: input.reps,
    weight_kg: input.weightKg,
    distance_km: input.distanceKm,
    note: input.note,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/fitness");
}

export async function updateFitnessEntry(input: UpdateFitnessEntryInput) {
  const { supabase, user } = await requireUser();

  const updates: Record<string, unknown> = {};
  if (input.activity !== undefined) updates.activity = input.activity;
  if (input.durationMin !== undefined) updates.duration_min = input.durationMin;
  if (input.caloriesBurned !== undefined) updates.calories_burned = input.caloriesBurned;
  if (input.sets !== undefined) updates.sets = input.sets;
  if (input.reps !== undefined) updates.reps = input.reps;
  if (input.weightKg !== undefined) updates.weight_kg = input.weightKg;
  if (input.distanceKm !== undefined) updates.distance_km = input.distanceKm;
  if (input.note !== undefined) updates.note = input.note;

  const { error } = await supabase
    .from("fitness_logs")
    .update(updates)
    .eq("id", input.id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/fitness");
}

export async function deleteFitnessEntry(id: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("fitness_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/fitness");
}
