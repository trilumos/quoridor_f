// SSR-safe storage service
const isSSR = typeof window === 'undefined';

const KEYS = {
  STATS: '@quoridor_stats',
  SETTINGS: '@quoridor_settings',
  PREMIUM: '@quoridor_premium',
  SAVED_GAME: '@quoridor_saved_game',
  ACHIEVEMENTS: '@quoridor_achievements',
  AD_COUNTER: '@quoridor_ad_counter',
};

// In-memory fallback for SSR
const memStore: Record<string, string> = {};

// Lazy-loaded AsyncStorage getter
let _asyncStorage: any = null;
function getStorage() {
  if (isSSR) return null;
  if (_asyncStorage) return _asyncStorage;
  
  try {
    _asyncStorage = require('@react-native-async-storage/async-storage').default;
  } catch {
    _asyncStorage = null;
  }
  return _asyncStorage;
}

async function get<T>(key: string): Promise<T | null> {
  try {
    const storage = getStorage();
    if (!storage) {
      // SSR or no storage available - use memory
      const raw = memStore[key];
      return raw ? JSON.parse(raw) : null;
    }
    const raw = await storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function set(key: string, value: unknown): Promise<void> {
  try {
    const storage = getStorage();
    const json = JSON.stringify(value);
    if (!storage) {
      // SSR or no storage available - use memory
      memStore[key] = json;
      return;
    }
    await storage.setItem(key, json);
  } catch (e) {
    // Silent fail
  }
}

async function clear(key: string): Promise<void> {
  try {
    const storage = getStorage();
    if (!storage) {
      delete memStore[key];
      return;
    }
    await storage.removeItem(key);
  } catch (e) {
    // Silent fail
  }
}

export const StorageService = { get, set, clear, KEYS };
