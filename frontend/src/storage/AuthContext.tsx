import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from './StorageService';

export interface UserProfile {
  displayName: string;
  email: string;
  avatar: string;
  joinDate: string;
  rank: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AUTH_KEY = '@quoridor_auth';
const USER_KEY = '@quoridor_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    (async () => {
      const authState = await StorageService.get<boolean>(AUTH_KEY);
      const savedUser = await StorageService.get<UserProfile>(USER_KEY);
      if (authState && savedUser) {
        setIsAuthenticated(true);
        setUser(savedUser);
      }
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Mock validation
    if (!email.trim()) return { success: false, error: 'Email is required' };
    if (!password.trim()) return { success: false, error: 'Password is required' };
    if (!/\S+@\S+\.\S+/.test(email)) return { success: false, error: 'Invalid email format' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const profile: UserProfile = {
      displayName: email.split('@')[0].toUpperCase(),
      email,
      avatar: '',
      joinDate: new Date().toISOString(),
      rank: 'STRATEGIST II',
    };

    setUser(profile);
    setIsAuthenticated(true);
    await StorageService.set(AUTH_KEY, true);
    await StorageService.set(USER_KEY, profile);
    return { success: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    if (!name.trim()) return { success: false, error: 'Name is required' };
    if (!email.trim()) return { success: false, error: 'Email is required' };
    if (!password.trim()) return { success: false, error: 'Password is required' };
    if (!/\S+@\S+\.\S+/.test(email)) return { success: false, error: 'Invalid email format' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };
    if (name.length < 2) return { success: false, error: 'Name must be at least 2 characters' };

    await new Promise(r => setTimeout(r, 800));

    const profile: UserProfile = {
      displayName: name.toUpperCase(),
      email,
      avatar: '',
      joinDate: new Date().toISOString(),
      rank: 'NOVICE',
    };

    setUser(profile);
    setIsAuthenticated(true);
    await StorageService.set(AUTH_KEY, true);
    await StorageService.set(USER_KEY, profile);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setUser(null);
    await StorageService.clear(AUTH_KEY);
    await StorageService.clear(USER_KEY);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      StorageService.set(USER_KEY, next);
      return next;
    });
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!email.trim()) return { success: false, error: 'Email is required' };
    if (!/\S+@\S+\.\S+/.test(email)) return { success: false, error: 'Invalid email format' };
    await new Promise(r => setTimeout(r, 800));
    return { success: true };
  }, []);

  const resetPassword = useCallback(async (newPassword: string) => {
    if (newPassword.length < 6) return { success: false, error: 'Password must be at least 6 characters' };
    await new Promise(r => setTimeout(r, 800));
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated, isLoading, user,
      login, signup, logout, updateProfile,
      requestPasswordReset, resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
