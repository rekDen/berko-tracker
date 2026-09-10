-- Ergänzt calories_burned für die bereits importierte Fitness-Historie
-- (backfill_fitness_history.sql muss vorher gelaufen sein).
--
-- Methodik (v2, kalibriert auf reale Erfahrungswerte: ca. 300-450 kcal
-- pro Stunde Krafttraining):
--   Laufband: unverändert 1,0 kcal je kg Körpergewicht je km (etablierte
--     Faustregel für Laufen, weitgehend tempounabhängig) -> bei 88 kg
--     = 88 kcal/km. Läuft deutlich über 375 kcal/h, das ist normal und
--     korrekt so (Laufen ist intensiver als Krafttraining).
--   Krafttraining: 375 kcal/h (Mittelwert aus 300-450 kcal/h) x geschätzte
--     Gesamtdauer pro Übung. Gesamtdauer = 3 Minuten Aufwärmen/Gerät
--     einstellen/Transition + 3 Minuten je Satz (Arbeit + Pause). Das bildet
--     eine reale Trainingsstation ab, nicht nur die reine Satzarbeit.
--     Beispiel: 3 Sätze -> 3 + 3x3 = 12 Minuten -> 75 kcal.
--   Bei 5 Einträgen war im Original keine Satzanzahl vermerkt; dort wurde
--     ersatzweise mit 3 Sätzen gerechnet (häufigster Wert im Rest der Daten):
--     18.03.2024 Bizeps, 03.02.2024 Bankdrücken, 07.02.2024 Bankdrücken,
--     16.12.2025 Bauchmuskeln, 01.04.2024 Seitliche Schulter.
--
-- Körpergewicht 88 kg fest einprogrammiert (Stand: aktuelles Gewicht).
-- Kann gefahrlos mehrfach ausgeführt werden (setzt Werte nur neu, auch
-- wenn vorher schon per v1 dieses Skripts befüllt).

do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from auth.users order by created_at asc limit 1;

  if v_user_id is null then
    raise exception 'Kein Supabase-User gefunden - bitte zuerst im Tracker registrieren/anmelden.';
  end if;

  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2023-11-13' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2023-11-16' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2023-11-19' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2023-11-23' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2023-11-28' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2023-12-02' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2023-12-07' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2023-12-16' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2023-12-20' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2023-12-23' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2023-12-28' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2023-12-31' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-01-04' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-01-07' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-01-12' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-01-15' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-02-03' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-02-07' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-02-10' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-02-12' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-02-19' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-02-25' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-03-18' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-04-01' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2024-09-26' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2025-01-06' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2025-07-12' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2025-07-20' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2025-07-26' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 44 where user_id = v_user_id and logged_date = '2025-12-16' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 53 where user_id = v_user_id and logged_date = '2026-03-21' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2026-09-03' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 88 where user_id = v_user_id and logged_date = '2026-09-07' and activity = 'Laufband';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-06' and activity = 'Latzug';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-10' and activity = 'Latzug';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-13' and activity = 'Latzug';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-16' and activity = 'Latzug';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-19' and activity = 'Latzug';
  update public.fitness_logs set calories_burned = 56 where user_id = v_user_id and logged_date = '2023-11-06' and activity = 'Brust/Butterfly';
  update public.fitness_logs set calories_burned = 56 where user_id = v_user_id and logged_date = '2023-11-10' and activity = 'Brust/Butterfly';
  update public.fitness_logs set calories_burned = 56 where user_id = v_user_id and logged_date = '2023-11-13' and activity = 'Brust/Butterfly';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-16' and activity = 'Brust/Butterfly';
  update public.fitness_logs set calories_burned = 56 where user_id = v_user_id and logged_date = '2023-11-19' and activity = 'Brust/Butterfly';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-06' and activity = 'Trizeps';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-10' and activity = 'Trizeps';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-13' and activity = 'Trizeps';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-16' and activity = 'Trizeps';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-19' and activity = 'Trizeps';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2025-07-12' and activity = 'Trizeps';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2025-07-20' and activity = 'Trizeps';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2026-09-07' and activity = 'Trizeps';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-16' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-23' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-28' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-02' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-07' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-10' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-16' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-20' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-23' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-31' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-01-04' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-01-12' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-01-15' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-03-18' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-04-01' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2025-01-06' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2025-07-12' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2025-07-26' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2025-12-16' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2026-03-21' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2026-09-03' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2026-09-07' and activity = 'Bizeps (Langstange)';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-06' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-10' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-13' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-25' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-28' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-02' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-07' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-12' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-16' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-20' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-23' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-27' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-31' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-01-04' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2024-01-07' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-01-12' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2024-01-15' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-02-03' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-02-07' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-02-10' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2024-02-12' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2024-02-19' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2024-02-25' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-03-18' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2024-04-01' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-09-26' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2025-01-06' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2025-07-12' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2025-07-20' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2025-07-26' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2025-12-16' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2026-03-21' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2026-09-03' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2026-09-07' and activity = 'Bankdrücken';
  update public.fitness_logs set calories_burned = 56 where user_id = v_user_id and logged_date = '2023-11-06' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 56 where user_id = v_user_id and logged_date = '2023-11-10' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-13' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-16' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-23' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-02' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-23' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-01-07' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-01-12' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-02-10' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-02-12' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-09-26' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2025-12-16' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 56 where user_id = v_user_id and logged_date = '2026-09-03' and activity = 'Bauchmuskeln';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-25' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-11-28' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-02' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-07' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-12' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-16' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-20' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-23' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-28' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2023-12-31' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-01-04' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-01-07' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-01-12' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-01-15' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-02-03' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2024-02-07' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 112 where user_id = v_user_id and logged_date = '2024-02-10' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 112 where user_id = v_user_id and logged_date = '2024-02-12' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 112 where user_id = v_user_id and logged_date = '2024-02-19' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 131 where user_id = v_user_id and logged_date = '2024-02-25' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 112 where user_id = v_user_id and logged_date = '2024-03-18' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-04-01' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-09-26' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2025-01-06' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 112 where user_id = v_user_id and logged_date = '2025-07-20' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2025-07-26' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 112 where user_id = v_user_id and logged_date = '2025-12-16' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2026-03-21' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2026-09-03' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2026-09-07' and activity = 'Kreuzheben';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-01-06' and activity = 'Seitliche Schulter';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2024-04-01' and activity = 'Seitliche Schulter';
  update public.fitness_logs set calories_burned = 56 where user_id = v_user_id and logged_date = '2025-07-12' and activity = 'Seitliche Schulter';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2025-07-20' and activity = 'Seitliche Schulter';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2025-07-26' and activity = 'Seitliche Schulter';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2025-12-16' and activity = 'Seitliche Schulter';
  update public.fitness_logs set calories_burned = 94 where user_id = v_user_id and logged_date = '2026-03-21' and activity = 'Seitliche Schulter';
  update public.fitness_logs set calories_burned = 75 where user_id = v_user_id and logged_date = '2026-09-03' and activity = 'Seitliche Schulter';

  raise notice 'calories_burned aktualisiert für user_id %', v_user_id;
end $$;

-- Kontrolle nach dem Ausführen:
-- select logged_date, sum(calories_burned) as kcal_gesamt, array_agg(activity) as übungen
-- from public.fitness_logs
-- group by logged_date
-- order by logged_date;
