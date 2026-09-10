"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthState } from "./actions";

const initialState: AuthState = { error: null };

export default function LoginForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    initialState
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    initialState
  );

  const isSignIn = mode === "signin";
  const state = isSignIn ? signInState : signUpState;
  const pending = isSignIn ? signInPending : signUpPending;

  return (
    <div className="w-full max-w-sm rounded-xl border border-black/10 dark:border-white/10 p-6 shadow-sm">
      <h1 className="text-xl font-semibold mb-1">Tracker</h1>
      <p className="text-sm text-black/60 dark:text-white/60 mb-6">
        {isSignIn ? "Melde dich an" : "Erstelle ein Konto"}
      </p>

      <form action={isSignIn ? signInAction : signUpAction} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            E-Mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Passwort
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={isSignIn ? "current-password" : "new-password"}
            className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
          />
        </div>

        {state.error && (
          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-md bg-foreground text-background py-2 text-sm font-medium disabled:opacity-60"
        >
          {pending ? "Bitte warten…" : isSignIn ? "Anmelden" : "Registrieren"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(isSignIn ? "signup" : "signin")}
        className="mt-4 text-sm text-black/60 dark:text-white/60 underline underline-offset-2"
      >
        {isSignIn
          ? "Noch kein Konto? Jetzt registrieren"
          : "Schon ein Konto? Jetzt anmelden"}
      </button>
    </div>
  );
}
