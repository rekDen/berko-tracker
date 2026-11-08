-- Tipps: ein frei editierbarer Text pro Nutzer.
-- Im Supabase SQL Editor ausführen (auch in schema.sql enthalten).
create table if not exists public.tips (
  user_id uuid primary key references auth.users (id) on delete cascade,
  content text not null default '',
  updated_at timestamptz not null default now()
);

drop trigger if exists tips_set_updated_at on public.tips;
create trigger tips_set_updated_at
  before update on public.tips
  for each row execute function public.set_updated_at();

alter table public.tips enable row level security;

drop policy if exists "tips_select_own" on public.tips;
create policy "tips_select_own" on public.tips for select to authenticated using (auth.uid() = user_id);

drop policy if exists "tips_insert_own" on public.tips;
create policy "tips_insert_own" on public.tips for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "tips_update_own" on public.tips;
create policy "tips_update_own" on public.tips for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update on public.tips to authenticated;
