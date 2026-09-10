import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import NavLinks from "./NavLinks";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-2xl mx-auto flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Tracker</h1>
          <p className="text-xs text-black/50 dark:text-white/50">{user?.email}</p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="text-xs underline underline-offset-2 text-black/60 dark:text-white/60"
          >
            Abmelden
          </button>
        </form>
      </header>

      <NavLinks />

      {children}
    </div>
  );
}
