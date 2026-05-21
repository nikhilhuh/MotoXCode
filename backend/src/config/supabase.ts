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

/**
 * Verifies the Supabase connection is reachable and the key is valid
 * by making a lightweight auth.getUser() probe.
 * Called during server bootstrap — logs success or failure clearly.
 */
export async function verifySupabaseConnection(): Promise<void> {
  try {
    // Use the admin API to verify the service_role key is valid.
    // Listing users with a limit of 1 is a minimal, low-cost probe.
    const { error } = await supabase.auth.admin.listUsers({ perPage: 1 });
    if (error) {
      throw new Error(error.message);
    }
    console.log(`✅ Supabase connected: ${env.SUPABASE_URL}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ Supabase connection failed: ${message}`);
    console.error(
      "   → Check that SUPABASE_SERVICE_ROLE_KEY is the service_role key (not anon) from:\n" +
      "     Supabase Dashboard → Project Settings → API → service_role (secret)"
    );
    process.exit(1);
  }
}

export { supabase };
