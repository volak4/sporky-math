import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client;

if (supabaseUrl && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn("Failed to initialize Supabase client:", err);
  }
}

if (!client) {
  console.warn("Supabase credentials not found. Running in Guest/Offline mode.");
  
  // Create a dummy chainable query builder
  const dummyQuery = {
    select: () => dummyQuery,
    eq: () => dummyQuery,
    single: async () => ({ data: null, error: { message: "Supabase not configured" } }),
    upsert: async () => ({ error: { message: "Supabase not configured" } })
  };

  client = {
    auth: {
      getUser: async () => ({ data: { user: null } }),
      signInWithPassword: async () => ({ error: { message: "Auth service not configured" } }),
      signUp: async () => ({ error: { message: "Auth service not configured" } }),
      resetPasswordForEmail: async () => ({ error: { message: "Auth service not configured" } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (callback) => {
        // Run callback with no session immediately for guest initialization
        setTimeout(() => {
          try {
            callback('INITIAL_SESSION', null);
          } catch (e) {
            console.error("Error in onAuthStateChange callback:", e);
          }
        }, 0);
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    from: () => dummyQuery
  };
}

export const supabase = client;
