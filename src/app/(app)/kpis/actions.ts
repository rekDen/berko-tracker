"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nicht angemeldet");
  return { supabase, user };
}

export async function createKpi(input: {
  name: string;
  unit: string | null;
  targetValue: number | null;
}) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("kpis").insert({
    user_id: user.id,
    name: input.name,
    unit: input.unit,
    target_value: input.targetValue,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/kpis");
}

export async function deleteKpi(id: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("kpis").delete().eq("id", id).eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/kpis");
}

export async function addKpiEntry(input: {
  kpiId: string;
  loggedDate: string;
  value: number;
  note: string | null;
}) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("kpi_entries").insert({
    kpi_id: input.kpiId,
    user_id: user.id,
    logged_date: input.loggedDate,
    value: input.value,
    note: input.note,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/kpis");
}

export async function updateKpiEntry(input: {
  id: string;
  value?: number;
  loggedDate?: string;
  note?: string | null;
}) {
  const { supabase, user } = await requireUser();

  const updates: Record<string, unknown> = {};
  if (input.value !== undefined) updates.value = input.value;
  if (input.loggedDate !== undefined) updates.logged_date = input.loggedDate;
  if (input.note !== undefined) updates.note = input.note;

  const { error } = await supabase
    .from("kpi_entries")
    .update(updates)
    .eq("id", input.id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/kpis");
}

export async function deleteKpiEntry(id: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("kpi_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/kpis");
}
