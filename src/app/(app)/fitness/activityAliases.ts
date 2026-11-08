// Übungen, die unter mehreren Namen erfasst wurden und als eine gelten.
// Schlüssel = kanonischer Name, Wert = alle abweichenden Schreibweisen.
// Groß-/Kleinschreibung und doppelte Leerzeichen spielen beim Zuordnen keine Rolle.
const GROUPS: Record<string, string[]> = {
  Situps: ["Bauchmuskeln"],
  "Bizeps (Seilzug)": [
    "Bizeps (Seilzug von unten Stange)",
    "Bizeps (Seilzug, Stange, breiter Griff)",
    "Bizeps (Seilzug) breiter Griff",
  ],
  "Brachialis (Seilzug)": [
    "Brachialis",
    "Brachialis (Seilzug nach oben)",
    "Brachialis (Seilzug Seil von unten)",
    "Brachialis (Seilzug, Seil)",
  ],
  "Schulter (seitliches Heben)": [
    "Schulter seitliches heben hanteln",
    "Seitliche Schulter",
    "Seitliche Schulter (Hanteln)",
    "Seitliche Schulter (seitliches Heben)",
    "Seitliches Schulter",
  ],
  "Trizeps (Seilzug, Einwurf)": [
    "Trizeps (Seilzug von hinten oben Einwurf)",
    "Trizeps (Seilzug von oben Einwurf )",
    "Trizeps (Seilzug über Kopf)",
  ],
  "Trizeps (Seilzug nach unten)": [
    "Trizeps",
    "Trizeps (Seilzug, Seil nach unten)",
    "Trizeps (Seilzug)",
    "Trizeps (Seilzug) Seile",
    "Trizeps Seilzug",
  ],
};

const normalize = (name: string) => name.trim().replace(/\s+/g, " ").toLowerCase();

const CANONICAL_BY_NAME = new Map<string, string>();
for (const [canonical, aliases] of Object.entries(GROUPS)) {
  for (const alias of aliases) CANONICAL_BY_NAME.set(normalize(alias), canonical);
}

export function canonicalActivity(name: string): string {
  return CANONICAL_BY_NAME.get(normalize(name)) ?? name;
}

/** Alle Schreibweisen (exakt wie gespeichert), die zur selben Übung gehören. */
export function activityNames(name: string): string[] {
  const canonical = canonicalActivity(name);
  return [canonical, ...(GROUPS[canonical] ?? [])];
}
