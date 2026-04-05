import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

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
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  googleAuthRequest: ReturnType<typeof Google.useIdTokenAuthRequest>[0];
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

function userToProfile(user: User): UserProfile {
  const meta = user.user_metadata || {};
  return {
    displayName: (meta.display_name || meta.full_name || meta.name || user.email?.split('@')[0] || 'PLAYER').toUpperCase(),
    email: user.email || '',
    avatar: meta.avatar_url || meta.picture || '',
    joinDate: user.created_at || new Date().toISOString(),
    rank: 'STRATEGIST II',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Google Auth
  const redirectUri = makeRedirectUri({ preferLocalhost: true });
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    redirectUri,
  });

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSession(session);
        setUser(userToProfile(session.user));
        setIsAuthenticated(true);
      } else {
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        setUser(userToProfile(session.user));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        supabase.auth.signInWithIdToken({
          provider: 'google',
          token: id_token,
        }).then(({ error }) => {
          if (error) console.error('Google sign-in error:', error.message);
        });
      }
    }
  }, [response]);

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim()) return { success: false, error: 'Email is required' };
    if (!password.trim()) return { success: false, error: 'Password is required' };
    if (!/\S+@\S+\.\S+/.test(email)) return { success: false, error: 'Invalid email format' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    if (!name.trim()) return { success: false, error: 'Name is required' };
    if (!email.trim()) return { success: false, error: 'Email is required' };
    if (!password.trim()) return { success: false, error: 'Password is required' };
    if (!/\S+@\S+\.\S+/.test(email)) return { success: false, error: 'Invalid email format' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };
    if (name.length < 2) return { success: false, error: 'Name must be at least 2 characters' };

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: name.trim(),
          full_name: name.trim(),
        },
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setSession(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const metadata: Record<string, string> = {};
    if (updates.displayName) metadata.display_name = updates.displayName;
    if (updates.email) metadata.email = updates.email;

    if (Object.keys(metadata).length > 0) {
      await supabase.auth.updateUser({ data: metadata });
    }

    setUser(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!email.trim()) return { success: false, error: 'Email is required' };
    if (!/\S+@\S+\.\S+/.test(email)) return { success: false, error: 'Invalid email format' };

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const resetPassword = useCallback(async (newPassword: string) => {
    if (newPassword.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        return { success: true };
      }
      if (result?.type === 'cancel' || result?.type === 'dismiss') {
        return { success: false, error: 'Sign in cancelled' };
      }
      return { success: false, error: 'Google sign in failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Google sign in failed' };
    }
  }, [promptAsync]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated, isLoading, user, session,
      login, signup, logout, updateProfile,
      requestPasswordReset, resetPassword,
      signInWithGoogle, googleAuthRequest: request,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
