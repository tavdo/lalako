import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '../utils/supabase/client';

export const supabase: SupabaseClient | null = createClient();

/** true when running against Supabase, false when using local dev fallback */
export const isRemote = supabase !== null;
