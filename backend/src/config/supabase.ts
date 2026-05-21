import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env.config";

/**
 * Server-side Supabase admin client.
 *
 * Uses the service_role key — bypasses Row Level Security (RLS).
 * This client is strictly for server-side operations (file/image bucket
 * management, admin queries). Never expose this key to the frontend.
 */
const supabase: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      // Disable automatic session persistence — server-side clients
      // should not persist sessions in local storage.
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export { supabase };
