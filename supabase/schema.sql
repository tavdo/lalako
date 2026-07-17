-- =============================================================
-- LALAKO TDM CUP — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor).
-- =============================================================

-- 1) Tournament table: a single row (id = 'main') holding all data as JSON.
create table if not exists public.tournament (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.tournament (id, data)
values (
  'main',
  jsonb_build_object(
    'name', 'LALAKO TDM CUP',
    'date', '',
    'format', 'TDM · 1v1',
    'owner', 'Lalako',
    'playerCount', 8,
    'mvp', '',
    'players', '[]'::jsonb,
    'registrations', '[]'::jsonb,
    'seeds', '[null,null,null,null,null,null,null,null]'::jsonb,
    'matches', '[]'::jsonb
  )
)
on conflict (id) do nothing;

-- 2) RLS: public read; all direct writes forbidden (writes go through RPCs).
alter table public.tournament enable row level security;

drop policy if exists "public read" on public.tournament;
create policy "public read"
  on public.tournament for select
  using (true);
-- No insert/update/delete policies → direct writes are rejected.

-- 3) Admin write RPC.
--    !!! Change 'lalako2026!!' below AND NEXT_PUBLIC_ADMIN_PASSWORD together !!!
create or replace function public.save_tournament(p_password text, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_password is distinct from 'lalako2026!!' then
    raise exception 'invalid password';
  end if;

  update public.tournament
  set data = p_data,
      updated_at = now()
  where id = 'main';
end;
$$;

revoke all on function public.save_tournament(text, jsonb) from public;
grant execute on function public.save_tournament(text, jsonb) to anon, authenticated;

-- 4) Realtime replication for live sync.
do $$
begin
  alter publication supabase_realtime add table public.tournament;
exception
  when duplicate_object then null;
end;
$$;
