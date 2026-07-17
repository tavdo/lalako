import { useCallback, useEffect, useState } from 'react';
import { supabase, isRemote } from './supabase';
import { defaultTournament, uid, type Registration, type Tournament } from './types';
import { syncBracket } from './bracket';

const LS_KEY = 'lalako-tdm-cup';

function readLocal(): Tournament {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...defaultTournament(), ...(JSON.parse(raw) as Tournament) };
  } catch {
    /* corrupted local data — start fresh */
  }
  return defaultTournament();
}

function writeLocal(t: Tournament) {
  localStorage.setItem(LS_KEY, JSON.stringify(t));
}

export interface TournamentState {
  tournament: Tournament | null;
  loading: boolean;
  live: boolean; // realtime channel connected
  remote: boolean; // Supabase configured
  error: string | null;
  refresh: () => Promise<void>;
}

/** Read-only live view of the tournament (public page). */
export function useTournament(): TournamentState {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setTournament(syncBracket(readLocal()));
      setLoading(false);
      return;
    }
    const { data, error: err } = await supabase
      .from('tournament')
      .select('data')
      .eq('id', 'main')
      .maybeSingle();
    if (err) {
      setError('მონაცემების ჩატვირთვა ვერ მოხერხდა');
    } else {
      setError(null);
      setTournament(
        syncBracket({ ...defaultTournament(), ...((data?.data as Tournament) ?? {}) }),
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    if (!supabase) {
      const onStorage = (e: StorageEvent) => {
        if (e.key === LS_KEY) void refresh();
      };
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    }
    const channel = supabase
      .channel('tournament-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tournament' },
        () => void refresh(),
      )
      .subscribe((status) => setLive(status === 'SUBSCRIBED'));
    return () => {
      void supabase?.removeChannel(channel);
    };
  }, [refresh]);

  return { tournament, loading, live, remote: isRemote, error, refresh };
}

/** Persist tournament data (admin). Requires the admin password when remote. */
export async function saveTournament(t: Tournament, password: string): Promise<void> {
  const synced = syncBracket(t);
  if (!supabase) {
    writeLocal(synced);
    return;
  }
  const { error } = await supabase.rpc('save_tournament', {
    p_password: password,
    p_data: synced,
  });
  if (error) throw new Error(error.message);
}

/** Public self-registration. */
export async function registerPlayer(
  name: string,
  tag: string,
  avatar: string | null,
): Promise<void> {
  if (!supabase) {
    const t = readLocal();
    const exists = [...t.players, ...t.registrations].some(
      (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
    if (exists) throw new Error('duplicate');
    const reg: Registration = {
      id: uid(),
      name: name.trim(),
      tag: tag.trim() || undefined,
      avatar: avatar ?? undefined,
      registeredAt: new Date().toISOString(),
    };
    writeLocal({ ...t, registrations: [...t.registrations, reg] });
    return;
  }
  const { error } = await supabase.rpc('register_player', {
    p_name: name.trim(),
    p_tag: tag.trim(),
    p_avatar: avatar,
  });
  if (error) {
    if (error.message.includes('duplicate')) throw new Error('duplicate');
    throw new Error(error.message);
  }
}
