# Tracker

Next.js-App zum Tracken von allem Möglichen. Jeder Bereich (Kalorien,
Fitness, Produktivität, KPIs) hat eine eigene Tabelle mit passenden Feldern
statt eines Einheitsschemas, weil die Eigenschaften zu unterschiedlich sind.

Aktuell umgesetzt:

- **Kalorien**: tägliche Mahlzeiten erfassen. Nährwerte (Kalorien, Eiweiß,
  Kohlenhydrate, Zucker, Fett …) werden automatisch aus der eigenen
  Supabase-Datenbank oder – falls dort noch nicht vorhanden – aus
  [Open Food Facts](https://world.openfoodfacts.org/) ermittelt und beim
  Speichern zwischengespeichert.
- **Fitness**: Trainingseinheiten mit Dauer, verbrannten Kalorien, Sätzen/
  Wiederholungen/Gewicht oder Distanz.
- **Produktivität**: Aufgaben/Zeitblöcke pro Tag mit Kategorie, Dauer und
  Erledigt-Status.
- **KPIs**: frei definierbare Kennzahlen (Name, Einheit, Zielwert) mit
  Werten über die Zeit.

Alle Werte lassen sich jederzeit manuell korrigieren.

## Setup

### 1. Supabase-Projekt anlegen

1. Auf [supabase.com](https://supabase.com) ein neues Projekt erstellen.
2. Im Dashboard unter **SQL Editor** den Inhalt von [`supabase/schema.sql`](supabase/schema.sql)
   ausführen. Das legt alle Tabellen (`foods`, `food_logs`, `fitness_logs`,
   `productivity_logs`, `kpis`, `kpi_entries`) inklusive Row Level Security
   und Tabellenrechten an. Die Datei ist idempotent – erneutes Ausführen
   (z. B. nach einem Update) ist gefahrlos möglich.
3. Unter **Authentication → Providers** ist "Email" standardmäßig aktiv –
   das reicht für diese App. Für den lokalen Start kann unter
   **Authentication → Settings** die E-Mail-Bestätigung deaktiviert werden,
   damit man sich direkt nach der Registrierung anmelden kann.
4. Unter **Project Settings → API** die `Project URL` und den `anon public`
   Key kopieren.

### 2. Umgebungsvariablen

```bash
cp .env.local.example .env.local
```

Und die Werte aus Supabase eintragen:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. App starten

```bash
npm install
npm run dev
```

Dann [http://localhost:3000](http://localhost:3000) öffnen, ein Konto
registrieren und loslegen.

## Funktionsweise

- **Suche (Kalorien)**: Beim Eintippen eines Lebensmittels wird zuerst die
  eigene Supabase-Tabelle `foods` durchsucht, danach ergänzend die
  öffentliche Open-Food-Facts-Datenbank (`src/lib/nutrition/openfoodfacts.ts`).
- **Automatische Übernahme**: Wird ein Open-Food-Facts-Treffer oder ein
  manuell erfasstes Lebensmittel geloggt, landet es zusätzlich in `foods`,
  damit es beim nächsten Mal direkt aus der eigenen Datenbank kommt.
- **Korrektur**: Werte lassen sich vor dem Speichern anpassen und bei
  bestehenden Einträgen jederzeit über "Korrigieren" nachträglich ändern.
- **Tagesansicht**: Kalorien/Fitness/Produktivität zeigen eine Tagesbilanz
  mit Datumsnavigation über `?date=YYYY-MM-DD`. KPIs sind zeitraumübergreifend
  (Verlauf pro Kennzahl statt Tagesansicht).

## Struktur

- `supabase/schema.sql` – Datenbankschema, Policies & Tabellenrechte zum
  Ausführen in Supabase.
- `src/lib/supabase/` – Browser-, Server- und Middleware-Clients.
- `src/lib/nutrition/` – Open-Food-Facts-Anbindung & gemeinsame Typen.
- `src/app/login/` – Anmeldung/Registrierung (Supabase Auth).
- `src/app/(app)/layout.tsx` – gemeinsamer Header/Navigation für alle
  Tracker-Bereiche.
- `src/app/(app)/calories/` – Kalorien-Tracker (Suche, Tagesliste, Actions).
- `src/app/(app)/fitness/` – Fitness-Tracker.
- `src/app/(app)/productivity/` – Produktivitäts-Tracker.
- `src/app/(app)/kpis/` – KPI-Definitionen & Werteverlauf.
- `src/components/DateNav.tsx` – geteilte Datumsnavigation.
- `src/app/api/nutrition/search/` – Route Handler für die Live-Suche.
