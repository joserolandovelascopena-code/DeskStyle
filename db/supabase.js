import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://vzqahakooffxpjogcxph.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_P0LCP2IEBQRx0LEg6LccPg_ghbKlNQl";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
