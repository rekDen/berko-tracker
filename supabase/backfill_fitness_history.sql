-- Einmaliger Import der historischen Fitness-Daten (Laufband, Latzug,
-- Brust/Butterfly, Trizeps, Bizeps, Bankdrücken, Bauch, Deadlift, Schulter).
--
-- WICHTIG: Nur EINMAL ausführen! Ein erneuter Lauf legt alle Zeilen doppelt an,
-- da es keine natürliche Eindeutigkeit (z. B. Datum+Übung) erzwingt.
--
-- Das Skript nimmt an, dass es genau einen Nutzer-Account im Projekt gibt
-- (den ältesten). Falls mehrere Accounts existieren, vorher die Zeile mit
-- "select id into v_user_id ..." anpassen (z. B. per E-Mail-Filter).
--
-- Korrigierte Tippfehler im Originaltext (Jahr ergab im Kontext keinen Sinn):
--   2.12.2022 -> 2.12.2023 (Laufband)
--   13.10.2022 -> 13.11.2023 (Trizeps)
--   16.11.2022 -> 16.11.2023 (Trizeps)
--   10.02.2014 -> 10.02.2024 (Laufband)
--   13.10.2023 -> 13.11.2023 (Bankdrücken)
--   18.03.1024 -> 18.03.2024 (Bizeps)
--   2.11.2023 -> 2.12.2023 (Bauchmuskeln)
--
-- Nicht importiert (kein Datum im Original vorhanden):
--   Seitliche Schulter: "4kgx7x5-6 (schräg)", "4kgx8.5x3 (schräg)", "5kgx8x4"
--   -> bei Bedarf mit Datum nachtragen.

do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from auth.users order by created_at asc limit 1;

  if v_user_id is null then
    raise exception 'Kein Supabase-User gefunden - bitte zuerst im Tracker registrieren/anmelden.';
  end if;

  insert into public.fitness_logs
    (user_id, logged_date, activity, sets, reps, weight_kg, distance_km, duration_min, note)
  values
    -- Laufband
    (v_user_id, '2023-11-13', 'Laufband', null, null, null, 1, null, '12,8 km/h'),
    (v_user_id, '2023-11-16', 'Laufband', null, null, null, 1, null, '13 km/h'),
    (v_user_id, '2023-11-19', 'Laufband', null, null, null, 1, null, '13,2 km/h'),
    (v_user_id, '2023-11-23', 'Laufband', null, null, null, 1, null, '13,25 km/h'),
    (v_user_id, '2023-11-28', 'Laufband', null, null, null, 1, null, '13,3 km/h'),
    (v_user_id, '2023-12-02', 'Laufband', null, null, null, 1, null, '13,5 km/h'),
    (v_user_id, '2023-12-07', 'Laufband', null, null, null, 1, null, '13,5 km/h'),
    (v_user_id, '2023-12-16', 'Laufband', null, null, null, 1, null, '14,05 km/h'),
    (v_user_id, '2023-12-20', 'Laufband', null, null, null, 1, null, '13,5 km/h'),
    (v_user_id, '2023-12-23', 'Laufband', null, null, null, 1, null, '13,5 km/h'),
    (v_user_id, '2023-12-28', 'Laufband', null, null, null, 1, null, '13,5 km/h'),
    (v_user_id, '2023-12-31', 'Laufband', null, null, null, 1, null, '13,8 km/h'),
    (v_user_id, '2024-01-04', 'Laufband', null, null, null, 1, null, '14,2 km/h'),
    (v_user_id, '2024-01-07', 'Laufband', null, null, null, 1, null, '14 km/h'),
    (v_user_id, '2024-01-12', 'Laufband', null, null, null, 1, null, '13,5 km/h'),
    (v_user_id, '2024-01-15', 'Laufband', null, null, null, 1, null, '13,5 km/h'),
    (v_user_id, '2024-02-03', 'Laufband', null, null, null, 1, null, '13,5 km/h'),
    (v_user_id, '2024-02-07', 'Laufband', null, null, null, 1, null, '13,5 km/h'),
    (v_user_id, '2024-02-10', 'Laufband', null, null, null, 1, null, '13,5 km/h mit Sprint'),
    (v_user_id, '2024-02-12', 'Laufband', null, null, null, 1, null, '13,5 km/h (easy)'),
    (v_user_id, '2024-02-19', 'Laufband', null, null, null, 1, null, '14 km/h'),
    (v_user_id, '2024-02-25', 'Laufband', null, null, null, 1, null, '13,7 km/h'),
    (v_user_id, '2024-03-18', 'Laufband', null, null, null, 1, null, '13,5 km/h'),
    (v_user_id, '2024-04-01', 'Laufband', null, null, null, 1, null, '13,7 km/h'),
    (v_user_id, '2024-09-26', 'Laufband', null, null, null, 1, null, '14 km/h'),
    (v_user_id, '2025-01-06', 'Laufband', null, null, null, 1, null, '13,5 km/h'),
    (v_user_id, '2025-07-12', 'Laufband', null, null, null, 1, null, '13,3 km/h'),
    (v_user_id, '2025-07-20', 'Laufband', null, null, null, 1, null, '14,5 km/h'),
    (v_user_id, '2025-07-26', 'Laufband', null, null, null, 1, null, '13 km/h (schräges Laufband, Crunch Fit)'),
    (v_user_id, '2025-12-16', 'Laufband', null, null, null, 0.5, null, 'Unklarer Originaltext: "Tot 11 auf 0.5km" - bitte prüfen/korrigieren'),
    (v_user_id, '2026-03-21', 'Laufband', null, null, null, 0.6, null, null),
    (v_user_id, '2026-09-03', 'Laufband', null, null, null, 1, 5, '12,3 km/h'),
    (v_user_id, '2026-09-07', 'Laufband', null, null, null, 1, 5, '12 km/h'),

    -- Latzug
    (v_user_id, '2023-11-06', 'Latzug', 3, 10, 45, null, null, null),
    (v_user_id, '2023-11-10', 'Latzug', 3, 10, 45, null, null, null),
    (v_user_id, '2023-11-13', 'Latzug', 3, 10, 50, null, null, null),
    (v_user_id, '2023-11-16', 'Latzug', 3, 10, 55, null, null, null),
    (v_user_id, '2023-11-19', 'Latzug', 3, null, 55, null, null, '2 Sätze a 10 Wdh. mit 55kg + 1 Satz a 10 Wdh. mit 50kg (Originaltext unklar, bitte prüfen)'),

    -- Brust/Butterfly
    (v_user_id, '2023-11-06', 'Brust/Butterfly', 2, 10, 35, null, null, 'zusätzlich 1 Satz a 10 Wdh. mit 30kg (Originaltext teilweise unklar: "5kg x 2")'),
    (v_user_id, '2023-11-10', 'Brust/Butterfly', 2, 10, 35, null, null, 'zusätzlich 1 Satz a 10 Wdh. mit 30kg (Originaltext teilweise unklar: "5kg x 2")'),
    (v_user_id, '2023-11-13', 'Brust/Butterfly', 2, 10, 35, null, null, 'zusätzlich 1 Satz a 10 Wdh. mit 30kg (Originaltext teilweise unklar: "5kg x 2")'),
    (v_user_id, '2023-11-16', 'Brust/Butterfly', 3, 10, 35, null, null, null),
    (v_user_id, '2023-11-19', 'Brust/Butterfly', 2, 10, 40, null, null, '+ 1 Satz a 10 Wdh. mit 35kg'),

    -- Trizeps
    (v_user_id, '2023-11-06', 'Trizeps', 3, 10, 16.75, null, null, null),
    (v_user_id, '2023-11-10', 'Trizeps', 3, 10, 16.75, null, null, null),
    (v_user_id, '2023-11-13', 'Trizeps', 3, 8, 18.75, null, null, '(Datum im Original "13.10.2022" - Tippfehler, korrigiert)'),
    (v_user_id, '2023-11-16', 'Trizeps', 3, 8, 21.5, null, null, '(Datum im Original "16.11.2022" - Tippfehler, korrigiert)'),
    (v_user_id, '2023-11-19', 'Trizeps', 3, 8, 23.75, null, null, null),
    (v_user_id, '2025-07-12', 'Trizeps', 3, 9, 20, null, null, null),
    (v_user_id, '2025-07-20', 'Trizeps', 3, 7, 15, null, null, 'Seilzug'),
    (v_user_id, '2026-09-07', 'Trizeps', 3, 6, 40, null, null, null),

    -- Bizeps (Langstange)
    (v_user_id, '2023-11-16', 'Bizeps (Langstange)', 3, null, 20, null, null, '7,5 Wiederholungen pro Satz'),
    (v_user_id, '2023-11-23', 'Bizeps (Langstange)', 3, 7, 25, null, null, null),
    (v_user_id, '2023-11-28', 'Bizeps (Langstange)', 3, 9, 20, null, null, null),
    (v_user_id, '2023-12-02', 'Bizeps (Langstange)', 3, 6, 25, null, null, null),
    (v_user_id, '2023-12-07', 'Bizeps (Langstange)', 3, 7, 25, null, null, null),
    (v_user_id, '2023-12-10', 'Bizeps (Langstange)', 3, 10, 25, null, null, null),
    (v_user_id, '2023-12-16', 'Bizeps (Langstange)', 3, 5, 30, null, null, null),
    (v_user_id, '2023-12-20', 'Bizeps (Langstange)', 3, 6, 25, null, null, 'Auf Handgelenke achten (Klacken links)'),
    (v_user_id, '2023-12-23', 'Bizeps (Langstange)', 3, null, 25, null, null, '6,5 Wiederholungen pro Satz'),
    (v_user_id, '2023-12-31', 'Bizeps (Langstange)', 3, null, 25, null, null, '7,5 Wiederholungen pro Satz'),
    (v_user_id, '2024-01-04', 'Bizeps (Langstange)', 3, null, 25, null, null, '7,5 Wiederholungen pro Satz'),
    (v_user_id, '2024-01-12', 'Bizeps (Langstange)', 3, null, 25, null, null, '8,5 Wiederholungen pro Satz'),
    (v_user_id, '2024-01-15', 'Bizeps (Langstange)', 3, 9, 25, null, null, 'letzter Durchgang tricky'),
    (v_user_id, '2024-03-18', 'Bizeps (Langstange)', null, 8, 25, null, null, null),
    (v_user_id, '2024-04-01', 'Bizeps (Langstange)', 3, null, 25, null, null, 'Wiederholungen je Satz: 8, 8, 5'),
    (v_user_id, '2025-01-06', 'Bizeps (Langstange)', 3, null, 10, null, null, 'Sätze: 8 Wdh. a 10kg, 7 Wdh. a 10kg, 8 Wdh. a 8kg'),
    (v_user_id, '2025-07-12', 'Bizeps (Langstange)', 3, null, 8, null, null, 'Wiederholungen je Satz: 9, 8, 9'),
    (v_user_id, '2025-07-26', 'Bizeps (Langstange)', 3, null, 10, null, null, 'Wiederholungen je Satz: 10, 10, 6'),
    (v_user_id, '2025-12-16', 'Bizeps (Langstange)', 3, null, 8, null, null, 'Wiederholungen je Satz: 10, 10, 9'),
    (v_user_id, '2026-03-21', 'Bizeps (Langstange)', 4, null, 10, null, null, 'Wiederholungen je Satz: 8, 8, 6, 5'),
    (v_user_id, '2026-09-03', 'Bizeps (Langstange)', 3, null, 10, null, null, 'Wiederholungen je Satz: 10, 9, 7,5'),
    (v_user_id, '2026-09-07', 'Bizeps (Langstange)', 3, 5, 12, null, null, null),

    -- Bankdrücken
    (v_user_id, '2023-11-06', 'Bankdrücken', 3, 8, 20, null, null, null),
    (v_user_id, '2023-11-10', 'Bankdrücken', 3, 8, 20, null, null, null),
    (v_user_id, '2023-11-13', 'Bankdrücken', 3, 10, 20, null, null, '(Datum im Original "13.10.2023" - Tippfehler, korrigiert)'),
    (v_user_id, '2023-11-25', 'Bankdrücken', 3, 6, 20, null, null, null),
    (v_user_id, '2023-11-28', 'Bankdrücken', 3, null, 25, null, null, '4,5 Wiederholungen pro Satz'),
    (v_user_id, '2023-12-02', 'Bankdrücken', 3, 5, 25, null, null, null),
    (v_user_id, '2023-12-07', 'Bankdrücken', 3, 6, 25, null, null, null),
    (v_user_id, '2023-12-12', 'Bankdrücken', 3, 5, 30, null, null, null),
    (v_user_id, '2023-12-16', 'Bankdrücken', 3, 6, 30, null, null, null),
    (v_user_id, '2023-12-20', 'Bankdrücken', 3, null, 30, null, null, '4,5 Wiederholungen pro Satz'),
    (v_user_id, '2023-12-23', 'Bankdrücken', 3, 5, 30, null, null, null),
    (v_user_id, '2023-12-27', 'Bankdrücken', 3, 5, 30, null, null, null),
    (v_user_id, '2023-12-31', 'Bankdrücken', 3, 5, 30, null, null, null),
    (v_user_id, '2024-01-04', 'Bankdrücken', 3, 5, 30, null, null, null),
    (v_user_id, '2024-01-07', 'Bankdrücken', 4, null, 30, null, null, '3 Sätze a 5 Wdh. + 1 Satz a 3 Wdh. (gute Durchgänge)'),
    (v_user_id, '2024-01-12', 'Bankdrücken', 3, 4, 30, null, null, 'schwächerer Durchgang - vielleicht weil ich damit angefangen habe?'),
    (v_user_id, '2024-01-15', 'Bankdrücken', 4, 5, 30, null, null, 'Steigerung'),
    (v_user_id, '2024-02-03', 'Bankdrücken', null, 5, 30, null, null, null),
    (v_user_id, '2024-02-07', 'Bankdrücken', null, 5, 30, null, null, null),
    (v_user_id, '2024-02-10', 'Bankdrücken', 3, 5, 30, null, null, null),
    (v_user_id, '2024-02-12', 'Bankdrücken', 4, null, 30, null, null, '4,5 Wiederholungen pro Satz (fällt schwer, Technik besser, aber zu wenige Sätze)'),
    (v_user_id, '2024-02-19', 'Bankdrücken', 4, null, 30, null, null, 'Wiederholungen je Satz: 5, 5, 4, 3'),
    (v_user_id, '2024-02-25', 'Bankdrücken', 4, null, 30, null, null, 'Wiederholungen je Satz: 5, 5, 5, 4'),
    (v_user_id, '2024-03-18', 'Bankdrücken', 3, 5, 30, null, null, null),
    (v_user_id, '2024-04-01', 'Bankdrücken', 4, null, 30, null, null, 'Wiederholungen je Satz: 5, 5, 4, 3'),
    (v_user_id, '2024-09-26', 'Bankdrücken', 3, 5, 20, null, null, null),
    (v_user_id, '2025-01-06', 'Bankdrücken', 4, null, 20, null, null, 'Wiederholungen je Satz: 6, 5, 4, 5'),
    (v_user_id, '2025-07-12', 'Bankdrücken', 3, null, 15, null, null, 'Wiederholungen je Satz: 10, 8, 7'),
    (v_user_id, '2025-07-20', 'Bankdrücken', 4, null, 15, null, null, '3 Sätze a 7 Wdh. + 1 Satz a 5 Wdh.'),
    (v_user_id, '2025-07-26', 'Bankdrücken', 4, null, 20, null, null, '2 Sätze a 6 Wdh., 1 Satz a 5 Wdh., 1 Satz a 4 Wdh. (mit Halten); Zusatzzeichen "2" im Original unklar'),
    (v_user_id, '2025-12-16', 'Bankdrücken', 4, null, 20, null, null, 'Wiederholungen je Satz: 6, 5, 4, 3'),
    (v_user_id, '2026-03-21', 'Bankdrücken', 4, null, 20, null, null, 'Wiederholungen je Satz: 7, 5, 5, 3'),
    (v_user_id, '2026-09-03', 'Bankdrücken', 3, 6, 20, null, null, null),
    (v_user_id, '2026-09-07', 'Bankdrücken', 3, 4, 30, null, null, null),

    -- Bauchmuskeln
    (v_user_id, '2023-11-06', 'Bauchmuskeln', 2, 20, null, null, null, '1,5-2 Sätze der schweren Variante + 20 einfachere Wiederholungen'),
    (v_user_id, '2023-11-10', 'Bauchmuskeln', 2, 20, null, null, null, '1,5-2 Sätze der schweren Variante + 20 einfachere Wiederholungen'),
    (v_user_id, '2023-11-13', 'Bauchmuskeln', 3, 20, null, null, null, null),
    (v_user_id, '2023-11-16', 'Bauchmuskeln', 3, 20, null, null, null, 'ganze Wiederholungen'),
    (v_user_id, '2023-11-23', 'Bauchmuskeln', 3, 23, null, null, null, 'ganze Wiederholungen'),
    (v_user_id, '2023-12-02', 'Bauchmuskeln', 3, 20, null, null, null, 'richtig ganze Wiederholungen (Datum im Original "2.11.2023" - Tippfehler, korrigiert)'),
    (v_user_id, '2023-12-23', 'Bauchmuskeln', 3, 23, null, null, null, null),
    (v_user_id, '2024-01-07', 'Bauchmuskeln', 3, 23, null, null, null, 'vollständige Durchgänge'),
    (v_user_id, '2024-01-12', 'Bauchmuskeln', 3, 25, null, null, null, 'vollständig'),
    (v_user_id, '2024-02-10', 'Bauchmuskeln', 3, 25, null, null, null, null),
    (v_user_id, '2024-02-12', 'Bauchmuskeln', 3, 25, null, null, null, null),
    (v_user_id, '2024-09-26', 'Bauchmuskeln', 3, 25, null, null, null, 'eine längere Pause dazwischen'),
    (v_user_id, '2025-12-16', 'Bauchmuskeln', null, 15, null, null, null, null),
    (v_user_id, '2026-09-03', 'Bauchmuskeln', 2, 20, null, null, null, null),

    -- Deadlift / Kreuzheben
    (v_user_id, '2023-11-25', 'Kreuzheben', 3, 7, 20, null, null, null),
    (v_user_id, '2023-11-28', 'Kreuzheben', 3, 7, 30, null, null, null),
    (v_user_id, '2023-12-02', 'Kreuzheben', 3, 5, 40, null, null, 'je Wiederholung ca. 5 Sekunden'),
    (v_user_id, '2023-12-07', 'Kreuzheben', 3, null, 40, null, null, '5,5 Wiederholungen pro Satz, je ca. 7 Sekunden'),
    (v_user_id, '2023-12-12', 'Kreuzheben', 3, 5, 45, null, null, 'je Wiederholung ca. 5 Sekunden'),
    (v_user_id, '2023-12-16', 'Kreuzheben', 3, 5, 50, null, null, 'je Wiederholung ca. 8 Sekunden'),
    (v_user_id, '2023-12-20', 'Kreuzheben', 3, 5, 50, null, null, 'je Wiederholung ca. 8 Sekunden'),
    (v_user_id, '2023-12-23', 'Kreuzheben', 3, 7, 50, null, null, 'je Wiederholung ca. 8 Sekunden'),
    (v_user_id, '2023-12-28', 'Kreuzheben', 3, 7, 50, null, null, null),
    (v_user_id, '2023-12-31', 'Kreuzheben', 3, 8, 50, null, null, 'Hände konnten am Ende nicht mehr'),
    (v_user_id, '2024-01-04', 'Kreuzheben', 3, 8, 50, null, null, 'Hände waren gut, kleinere Stange (vmtl. etwas weniger Gewicht)'),
    (v_user_id, '2024-01-07', 'Kreuzheben', 3, 8, 50, null, null, 'größere Stange'),
    (v_user_id, '2024-01-12', 'Kreuzheben', 3, 8, 50, null, null, 'Hände Blasen - nicht fest genug gehalten'),
    (v_user_id, '2024-01-15', 'Kreuzheben', 3, 10, 50, null, null, 'Hände an der Grenze - nur ganz leichte Verbesserung'),
    (v_user_id, '2024-02-03', 'Kreuzheben', 3, 10, 50, null, null, null),
    (v_user_id, '2024-02-07', 'Kreuzheben', 4, 5, 60, null, null, null),
    (v_user_id, '2024-02-10', 'Kreuzheben', 5, 5, 60, null, null, null),
    (v_user_id, '2024-02-12', 'Kreuzheben', 5, 5, 60, null, null, null),
    (v_user_id, '2024-02-19', 'Kreuzheben', 5, 5, 60, null, null, null),
    (v_user_id, '2024-02-25', 'Kreuzheben', 6, 5, 60, null, null, 'Steigerung, sehr gut'),
    (v_user_id, '2024-03-18', 'Kreuzheben', 5, 5, 60, null, null, null),
    (v_user_id, '2024-04-01', 'Kreuzheben', 3, 5, 60, null, null, null),
    (v_user_id, '2024-09-26', 'Kreuzheben', 3, 5, 50, null, null, null),
    (v_user_id, '2025-01-06', 'Kreuzheben', 4, 5, 40, null, null, null),
    (v_user_id, '2025-07-20', 'Kreuzheben', 5, 5, 40, null, null, null),
    (v_user_id, '2025-07-26', 'Kreuzheben', 4, 5, 40, null, null, null),
    (v_user_id, '2025-12-16', 'Kreuzheben', 5, 5, 40, null, null, null),
    (v_user_id, '2026-03-21', 'Kreuzheben', 4, 5, 40, null, null, null),
    (v_user_id, '2026-09-03', 'Kreuzheben', 3, 5, 40, null, null, null),
    (v_user_id, '2026-09-07', 'Kreuzheben', 3, 5, 50, null, null, null),

    -- Seitliche Schulter
    (v_user_id, '2024-01-06', 'Seitliche Schulter', 3, null, 5, null, null, 'Wiederholungen je Satz: 8, 7, 7'),
    (v_user_id, '2024-04-01', 'Seitliche Schulter', null, 8, 5, null, null, null),
    (v_user_id, '2025-07-12', 'Seitliche Schulter', 2, null, 4, null, null, 'Wiederholungen je Satz: 10, 8'),
    (v_user_id, '2025-07-20', 'Seitliche Schulter', 4, null, 4, null, null, '3 Sätze a 7 Wdh. + 1 Satz a 5 Wdh.'),
    (v_user_id, '2025-07-26', 'Seitliche Schulter', 4, null, 4, null, null, 'Wiederholungen je Satz: 10, 9, 8, 6,5'),
    (v_user_id, '2025-12-16', 'Seitliche Schulter', 4, null, 4, null, null, 'Wiederholungen je Satz: 8, 8, 6, 6'),
    (v_user_id, '2026-03-21', 'Seitliche Schulter', 4, 6, 6, null, null, null),
    (v_user_id, '2026-09-03', 'Seitliche Schulter', 3, 6, 6, null, null, null);

  raise notice 'Fitness-Historie importiert für user_id %', v_user_id;
end $$;

-- Kontrolle nach dem Ausführen:
-- select activity, count(*), min(logged_date), max(logged_date)
-- from public.fitness_logs
-- group by activity
-- order by activity;
