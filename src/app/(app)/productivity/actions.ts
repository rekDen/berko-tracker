"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AddProductivityEntryInput {
  loggedDate: string;
  task: string;
  category: string | null;
  durationMin: number | null;
  completed: boolean;
  note: string | null;
}

export interface UpdateProductivityEntryInput {
  id: string;
  task?: string;
  category?: string | null;
  durationMin?: number | null;
  completed?: boolean;
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

export async function addProductivityEntry(input: AddProductivityEntryInput) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("productivity_logs").insert({
    user_id: user.id,
    logged_date: input.loggedDate,
    task: input.task,
    category: input.category,
    duration_min: input.durationMin,
    completed: input.completed,
    note: input.note,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/productivity");
}

export async function updateProductivityEntry(input: UpdateProductivityEntryInput) {
  const { supabase, user } = await requireUser();

  const updates: Record<string, unknown> = {};
  if (input.task !== undefined) updates.task = input.task;
  if (input.category !== undefined) updates.category = input.category;
  if (input.durationMin !== undefined) updates.duration_min = input.durationMin;
  if (input.completed !== undefined) updates.completed = input.completed;
  if (input.note !== undefined) updates.note = input.note;

  const { error } = await supabase
    .from("productivity_logs")
    .update(updates)
    .eq("id", input.id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/productivity");
}

export async function deleteProductivityEntry(id: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("productivity_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/productivity");
}
