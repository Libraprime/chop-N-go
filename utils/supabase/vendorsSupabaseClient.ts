import { createClient } from '@supabase/supabase-js';

// Get the public environment variables for the client-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_VENDORS_DB_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_VENDORS_DB_ANON_KEY;

// Ensure the variables exist, otherwise throw an error
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_VENDORS_DB_URL or NEXT_PUBLIC_VENDORS_DB_ANON_KEY environment variables');
}

// Create and export the Supabase client for use in Client Components
export const vendorsSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
