import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Detect SSR / Node.js environment
const isSSR = typeof window === 'undefined';

// In-memory storage for SSR
const memStore: Record<string, string> = {};
const memoryStorage = {
  getItem: (key: string) => memStore[key] || null,
  setItem: (key: string, value: string) => { memStore[key] = value; },
  removeItem: (key: string) => { delete memStore[key]; },
};

// Create a storage adapter that is SSR-safe
let storageAdapter: any = memoryStorage;

if (!isSSR) {
  // Only import AsyncStorage in client environment
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    storageAdapter = AsyncStorage;
  } catch {
    storageAdapter = memoryStorage;
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter,
    autoRefreshToken: true,
    persistSession: !isSSR,
    detectSessionInUrl: false,
  },
});

// Auto-refresh token when app comes to foreground (mobile only, non-SSR)
if (!isSSR && Platform.OS !== 'web') {
  try {
    const { AppState } = require('react-native');
    AppState.addEventListener('change', (state: string) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });
  } catch {
    // Ignore
  }
}
