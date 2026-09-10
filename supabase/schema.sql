-- Tracker – Datenbankschema für Supabase
-- Im Supabase SQL Editor des Projekts ausführen (Dashboard -> SQL Editor -> New query).

-- 1) Eigene Nährwert-Datenbank (Cache für lokal angelegte + aus dem Internet
--    übernommene Lebensmittel). Werte beziehen sich immer auf 100 g/ml.
create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  calories_kcal numeric not null,
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  sugar_g numeric not null default 0,
  fat_g numeric not null default 0,
  fiber_g numeric,
  salt_g numeric,
  source text not null default 'manual' check (source in ('manual', 'openfoodfacts', 'local')),
  external_id text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create extension if not exists pg_trgm;

create index if not exists foods_name_trgm_idx on public.foods using gin (name gin_trgm_ops);
create unique index if not exists foods_external_id_idx on public.foods (source, external_id) where external_id is not null;

-- 2) Tageseinträge des Nutzers (Tagebuch). Nährwerte werden beim Anlegen als
--    Snapshot übernommen (amount_g * Wert je 100g), damit spätere Korrekturen
--    an "foods" alte Einträge nicht rückwirkend verändern.
create table if not exists public.food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  food_id uuid references public.foods (id) on delete set null,
  name text not null,
  logged_date date not null default (now() at time zone 'utc')::date,
  amount_g numeric not null,
  calories_kcal numeric not null,
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  sugar_g numeric not null default 0,
  fat_g numeric not null default 0,
  fiber_g numeric,
  salt_g numeric,
  is_corrected boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists food_logs_user_date_idx on public.food_logs (user_id, logged_date);

-- Trigger: updated_at automatisch pflegen
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists food_logs_set_updated_at on public.food_logs;
create trigger food_logs_set_updated_at
  before update on public.food_logs
  for each row execute function public.set_updated_at();

-- 3) Row Level Security
alter table public.foods enable row level security;
alter table public.food_logs enable row level security;

-- foods: gemeinsame Nährwert-Datenbank – alle eingeloggten Nutzer dürfen lesen
-- und neue Einträge (z. B. aus Open Food Facts) hinzufügen.
drop policy if exists "foods_select_authenticated" on public.foods;
create policy "foods_select_authenticated"
  on public.foods for select
  to authenticated
  using (true);

drop policy if exists "foods_insert_authenticated" on public.foods;
create policy "foods_insert_authenticated"
  on public.foods for insert
  to authenticated
  with check (auth.uid() = created_by);

drop policy if exists "foods_update_own" on public.foods;
create policy "foods_update_own"
  on public.foods for update
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- food_logs: strikt pro Nutzer
drop policy if exists "food_logs_select_own" on public.food_logs;
create policy "food_logs_select_own"
  on public.food_logs for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "food_logs_insert_own" on public.food_logs;
create policy "food_logs_insert_own"
  on public.food_logs for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "food_logs_update_own" on public.food_logs;
create policy "food_logs_update_own"
  on public.food_logs for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "food_logs_delete_own" on public.food_logs;
create policy "food_logs_delete_own"
  on public.food_logs for delete
  to authenticated
  using (auth.uid() = user_id);

-- 4) Tabellenrechte
-- RLS schraenkt nur ein, welche Zeilen sichtbar/aenderbar sind. Sie ersetzt
-- nicht die grundlegenden Tabellenrechte, die Supabase bei per SQL (statt
-- ueber den Table Editor) angelegten Tabellen nicht automatisch vergibt.
-- Ohne diese Grants schlaegt jeder Zugriff mit "permission denied" fehl,
-- selbst fuer angemeldete Nutzer mit passender RLS-Policy.
grant usage on schema public to authenticated;
grant select, insert, update on public.foods to authenticated;
grant select, insert, update, delete on public.food_logs to authenticated;

-- 5) Fitness: jede Trainingseinheit ist eine eigene Zeile, Felder decken
--    sowohl Kraft- (Sätze/Wiederholungen/Gewicht) als auch Ausdauertraining
--    (Dauer/Distanz) ab; nicht Zutreffendes bleibt einfach leer.
create table if not exists public.fitness_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_date date not null default (now() at time zone 'utc')::date,
  activity text not null,
  duration_min numeric,
  calories_burned numeric,
  sets integer,
  reps integer,
  weight_kg numeric,
  distance_km numeric,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fitness_logs_user_date_idx on public.fitness_logs (user_id, logged_date);

drop trigger if exists fitness_logs_set_updated_at on public.fitness_logs;
create trigger fitness_logs_set_updated_at
  before update on public.fitness_logs
  for each row execute function public.set_updated_at();

alter table public.fitness_logs enable row level security;

drop policy if exists "fitness_logs_select_own" on public.fitness_logs;
create policy "fitness_logs_select_own"
  on public.fitness_logs for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "fitness_logs_insert_own" on public.fitness_logs;
create policy "fitness_logs_insert_own"
  on public.fitness_logs for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "fitness_logs_update_own" on public.fitness_logs;
create policy "fitness_logs_update_own"
  on public.fitness_logs for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "fitness_logs_delete_own" on public.fitness_logs;
create policy "fitness_logs_delete_own"
  on public.fitness_logs for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.fitness_logs to authenticated;

-- 6) Produktivität: einzelne Aufgaben/Zeitblöcke pro Tag.
create table if not exists public.productivity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_date date not null default (now() at time zone 'utc')::date,
  task text not null,
  category text,
  duration_min numeric,
  completed boolean not null default true,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists productivity_logs_user_date_idx on public.productivity_logs (user_id, logged_date);

drop trigger if exists productivity_logs_set_updated_at on public.productivity_logs;
create trigger productivity_logs_set_updated_at
  before update on public.productivity_logs
  for each row execute function public.set_updated_at();

alter table public.productivity_logs enable row level security;

drop policy if exists "productivity_logs_select_own" on public.productivity_logs;
create policy "productivity_logs_select_own"
  on public.productivity_logs for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "productivity_logs_insert_own" on public.productivity_logs;
create policy "productivity_logs_insert_own"
  on public.productivity_logs for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "productivity_logs_update_own" on public.productivity_logs;
create policy "productivity_logs_update_own"
  on public.productivity_logs for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "productivity_logs_delete_own" on public.productivity_logs;
create policy "productivity_logs_delete_own"
  on public.productivity_logs for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.productivity_logs to authenticated;

-- 7) KPIs: eigene Kennzahlen definieren (Name/Einheit/Zielwert) und Werte
--    über die Zeit erfassen. Zwei Tabellen, da Definition und Messwerte
--    unterschiedliche Lebenszyklen haben (eine KPI, viele Einträge).
create table if not exists public.kpis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  unit text,
  target_value numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.kpi_entries (
  id uuid primary key default gen_random_uuid(),
  kpi_id uuid not null references public.kpis (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_date date not null default (now() at time zone 'utc')::date,
  value numeric not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kpis_user_idx on public.kpis (user_id);
create index if not exists kpi_entries_kpi_date_idx on public.kpi_entries (kpi_id, logged_date);

drop trigger if exists kpi_entries_set_updated_at on public.kpi_entries;
create trigger kpi_entries_set_updated_at
  before update on public.kpi_entries
  for each row execute function public.set_updated_at();

alter table public.kpis enable row level security;
alter table public.kpi_entries enable row level security;

drop policy if exists "kpis_select_own" on public.kpis;
create policy "kpis_select_own"
  on public.kpis for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "kpis_insert_own" on public.kpis;
create policy "kpis_insert_own"
  on public.kpis for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "kpis_update_own" on public.kpis;
create policy "kpis_update_own"
  on public.kpis for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "kpis_delete_own" on public.kpis;
create policy "kpis_delete_own"
  on public.kpis for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "kpi_entries_select_own" on public.kpi_entries;
create policy "kpi_entries_select_own"
  on public.kpi_entries for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "kpi_entries_insert_own" on public.kpi_entries;
create policy "kpi_entries_insert_own"
  on public.kpi_entries for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "kpi_entries_update_own" on public.kpi_entries;
create policy "kpi_entries_update_own"
  on public.kpi_entries for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "kpi_entries_delete_own" on public.kpi_entries;
create policy "kpi_entries_delete_own"
  on public.kpi_entries for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.kpis to authenticated;
grant select, insert, update, delete on public.kpi_entries to authenticated;
