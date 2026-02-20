import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    // Use a simple lock implementation instead of Navigator Locks API
    // Navigator Locks can get permanently stuck if a tab crashes or is force-closed,
    // which blocks ALL auth operations (getSession, getUser, signIn, etc.)
    lock: async (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
      // Simple implementation that just runs the function without cross-tab locking
      // This is safe for single-tab usage and avoids the NavigatorLockAcquireTimeoutError
      return await fn();
    },
  },
});