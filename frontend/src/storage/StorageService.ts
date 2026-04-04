import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  STATS: '@quoridor_stats',
  SETTINGS: '@quoridor_settings',
  PREMIUM: '@quoridor_premium',
  SAVED_GAME: '@quoridor_saved_game',
  ACHIEVEMENTS: '@quoridor_achievements',
  AD_COUNTER: '@quoridor_ad_counter',
};

async function get<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function set(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('StorageService.set failed:', key, e);
  }
}

async function clear(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn('StorageService.clear failed:', key, e);
  }
}

export const StorageService = { get, set, clear, KEYS };
