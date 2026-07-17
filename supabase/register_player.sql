-- =============================================================
-- LALAKO TDM CUP — public self-registration RPC
-- Run after schema.sql.
-- =============================================================

create or replace function public.register_player(
  p_name text,
  p_tag text default '',
  p_avatar text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := btrim(coalesce(p_name, ''));
  v_reg jsonb;
begin
  if char_length(v_name) < 2 or char_length(v_name) > 24 then
    raise exception 'invalid name length';
  end if;

  -- avatar data URLs are client-resized to ~256px; cap size defensively
  if p_avatar is not null and char_length(p_avatar) > 200000 then
    raise exception 'avatar too large';
  end if;

  -- duplicate nickname check across players and pending registrations
  if exists (
    select 1
    from public.tournament t,
         jsonb_array_elements(t.data->'players' || t.data->'registrations') e
    where t.id = 'main'
      and lower(btrim(e->>'name')) = lower(v_name)
  ) then
    raise exception 'duplicate nickname';
  end if;

  v_reg := jsonb_build_object(
    'id', encode(gen_random_bytes(8), 'hex'),
    'name', v_name,
    'tag', nullif(btrim(coalesce(p_tag, '')), ''),
    'avatar', p_avatar,
    'registeredAt', to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
  );

  update public.tournament
  set data = jsonb_set(
        data,
        '{registrations}',
        coalesce(data->'registrations', '[]'::jsonb) || v_reg
      ),
      updated_at = now()
  where id = 'main';
end;
$$;

revoke all on function public.register_player(text, text, text) from public;
grant execute on function public.register_player(text, text, text) to anon, authenticated;
