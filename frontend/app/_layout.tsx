import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { GameProvider } from '../src/storage/GameContext';
import { AuthProvider } from '../src/storage/AuthContext';
import { useAuthStore } from '../src/store/authStore';
import { useStatsStore } from '../src/store/statsStore';
import { useGameStore } from '../src/store/gameStore';

SplashScreen.preventAutoHideAsync();

function StoreInitializer() {
  const router = useRouter();
  const segments = useSegments();
  const { initialize, isAuthenticated, isLoading, user } = useAuthStore();
  const { fetchStats, fetchAchievements, reset: resetStats } = useStatsStore();
  const { loadSavedGame, reset: resetGame } = useGameStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'forgot-password' || segments[0] === 'reset-email-sent' || segments[0] === 'reset-password' || segments[0] === 'reset-success' || segments[0] === 'index';

    if (isAuthenticated && user) {
      fetchStats(user.id);
      fetchAchievements(user.id);
      loadSavedGame(user.id);
      if (inAuth) {
        router.replace('/(tabs)' as never);
      }
    } else if (!isAuthenticated && !inAuth) {
      resetStats();
      resetGame();
      router.replace('/login' as never);
    }
  }, [isAuthenticated, isLoading, user]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <GameProvider>
        <StoreInitializer />
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#0D0D0D' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="reset-email-sent" />
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="reset-success" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="mode-select" />
          <Stack.Screen name="pregame-ai" />
          <Stack.Screen name="pregame-local" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="paywall" />
          <Stack.Screen name="game" />
          <Stack.Screen name="victory" />
          <Stack.Screen name="defeat" />
          <Stack.Screen name="trainer" />
          <Stack.Screen name="achievements" />
          <Stack.Screen name="match-history" />
          <Stack.Screen name="edit-profile" />
          <Stack.Screen name="subscription" />
          <Stack.Screen name="ad-interstitial" />
          <Stack.Screen name="daily-puzzle" />
        </Stack>
      </GameProvider>
    </AuthProvider>
  );
}
