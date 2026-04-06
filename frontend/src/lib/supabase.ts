import 'react-native-url-polyfill/auto';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton
let _client: SupabaseClient | null = null;

// In-memory storage fallback
const memStore: Record<string, string> = {};
const memoryStorage = {
  getItem: (key: string) => memStore[key] || null,
  setItem: (key: string, value: string) => { memStore[key] = value; },
  removeItem: (key: string) => { delete memStore[key]; },
};

/**
 * Get or create the Supabase client.
 * MUST only be called from client-side code (useEffect, event handlers, etc.)
 * Never call at module level or during SSR.
 */
export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  // We're now in client-side code, safe to import
  const { createClient } = require('@supabase/supabase-js');
  const { Platform } = require('react-native');

  let storage: any = memoryStorage;

  if (Platform.OS === 'web') {
    // Web: use localStorage
    storage = {
      getItem: (key: string) => {
        try { return window.localStorage.getItem(key); }
        catch { return null; }
      },
      setItem: (key: string, value: string) => {
        try { window.localStorage.setItem(key, value); }
        catch {}
      },
      removeItem: (key: string) => {
        try { window.localStorage.removeItem(key); }
        catch {}
      },
    };
  } else {
    // Native: use AsyncStorage
    try {
      storage = require('@react-native-async-storage/async-storage').default;
    } catch {}
  }

  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  // Auto-refresh on foreground (native only)
  if (Platform.OS !== 'web') {
    try {
      const { AppState } = require('react-native');
      AppState.addEventListener('change', (state: string) => {
        if (state === 'active') {
          _client?.auth.startAutoRefresh();
        } else {
          _client?.auth.stopAutoRefresh();
        }
      });
    } catch {}
  }

  return _client;
}

// For backward compatibility - but this MUST NOT be accessed at module load time
// Export a getter that delays initialization
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop: string) {
    // Safety check - if we're in SSR, return a no-op
    if (typeof window === 'undefined') {
      // Return mock methods for SSR
      if (prop === 'auth') {
        return {
          getSession: async () => ({ data: { session: null }, error: null }),
          getUser: async () => ({ data: { user: null }, error: null }),
          signOut: async () => ({ error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: async () => ({ data: { session: null, user: null }, error: null }),
          signUp: async () => ({ data: { session: null, user: null }, error: null }),
          signInWithIdToken: async () => ({ data: { session: null, user: null }, error: null }),
          resetPasswordForEmail: async () => ({ error: null }),
          updateUser: async () => ({ data: { user: null }, error: null }),
          startAutoRefresh: () => {},
          stopAutoRefresh: () => {},
        };
      }
      if (prop === 'from') {
        return () => ({
          select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
          insert: async () => ({ error: null }),
          update: () => ({ eq: async () => ({ error: null }) }),
          upsert: async () => ({ error: null }),
        });
      }
      if (prop === 'rpc') {
        return async () => ({ error: null });
      }
      return undefined;
    }
    
    // Client-side: get real client
    const client = getSupabase();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
