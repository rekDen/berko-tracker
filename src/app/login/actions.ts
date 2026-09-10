"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error: string | null;
}

export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Anmeldung fehlgeschlagen: " + error.message };
  }

  redirect("/calories");
}

export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: "Registrierung fehlgeschlagen: " + error.message };
  }

  redirect("/calories");
}

// Entfernt unsichtbare Unicode-Zeichen (z. B. Non-Breaking Space oder
// Zero-Width Space aus Autofill/Copy-Paste), die Supabase sonst als
// ungueltige E-Mail-Adresse ablehnt. Codepoints statt Literalen, damit
// die Zeichen im Quelltext nicht unsichtbar/unklar bleiben.
const INVISIBLE_CHAR_CODES = [0x00a0, 0x200b, 0x200c, 0x200d, 0x2060, 0xfeff];
const INVISIBLE_CHARS = new RegExp(
  `[${INVISIBLE_CHAR_CODES.map((c) => `\\u${c.toString(16).padStart(4, "0")}`).join("")}]`,
  "g"
);

function normalizeEmail(value: FormDataEntryValue | null): string {
  return String(value ?? "")
    .replace(INVISIBLE_CHARS, "")
    .trim()
    .toLowerCase();
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
