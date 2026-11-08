"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveTips(content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nicht angemeldet");

  const { error } = await supabase
    .from("tips")
    .upsert({ user_id: user.id, content }, { onConflict: "user_id" });
  if (error) throw new Error(error.message);

  revalidatePath("/fitness/tipps");
}
