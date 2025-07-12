import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mnebxichjszbuzffmesx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZWJ4aWNoanN6YnV6ZmZtZXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTIzOTMsImV4cCI6MjA2MjM2ODM5M30.43QB7gpBfT5I22iK-ma2Y4K8htCh5KUILkLHaigo2zs";

// Singleton pattern to ensure only one client instance
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  }
  return supabaseClient;
}

// Export the client for backward compatibility
export const supabase = getSupabaseClient();

// Export the factory function for dynamic imports
export default getSupabaseClient;