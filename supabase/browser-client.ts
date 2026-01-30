import { ENV } from "@/lib/env.utils";
import type { Database } from "@/supabase/types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient<Database> | null = null;

export function createBrowserClient(): SupabaseClient<Database> {
  if (typeof window === "undefined") {
    return createClient<Database>(
      ENV.SUPABASE_URL,
      ENV.SUPABASE_PUBLISHABLE_KEY
    );
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(
      ENV.SUPABASE_URL,
      ENV.SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          storage: localStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      }
    );
  }
  return supabaseInstance;
}

export const supabase = typeof window !== "undefined"
  ? createBrowserClient()
  : (null as unknown as SupabaseClient<Database>);
