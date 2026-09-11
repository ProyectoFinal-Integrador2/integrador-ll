import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://hfcfwoxdbzrpzfffflsl.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_xR_ojbuNnYXuryQ47OtRTQ_TJsOThTC';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'bd_sistema_incidencia',
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
