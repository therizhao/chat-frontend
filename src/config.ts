import { createClient } from '@supabase/supabase-js';

export const BACKEND_URL =
  'https://chat-backend-production-a7da.up.railway.app/';

const SUPABASE_URL = 'https://piuzwrnjlllzzokawbtd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_QmHf1W4fjAKaGMQ1w5E9wA_KNrG_sEx';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
