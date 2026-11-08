import { createClient } from "@/lib/supabase/server";
import { DEFAULT_TIPS } from "./defaultTips";
import TipsEditor from "./TipsEditor";

export default async function TippsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("tips").select("content").maybeSingle();

  // Solange noch nichts gespeichert wurde, wird der Standardtext angezeigt.
  const content = data ? (data.content as string) : DEFAULT_TIPS;

  return (
    <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
      <h2 className="text-sm font-semibold mb-1">Tipps</h2>
      <p className="text-xs text-black/50 dark:text-white/50 mb-3">
        Freier Text – du kannst ihn jederzeit bearbeiten und speichern.
      </p>
      <TipsEditor initial={content} />
    </section>
  );
}
