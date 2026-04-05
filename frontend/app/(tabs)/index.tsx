import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/theme/colors';
import { useGameContext } from '../../src/storage/GameContext';
import { useAuthStore } from '../../src/store/authStore';
import { useStatsStore } from '../../src/store/statsStore';
import { useGameStore } from '../../src/store/gameStore';

export default function HomeScreen() {
  const router = useRouter();
  const { stats: ctxStats, savedGame: ctxSaved, clearSavedGame, shouldShowAd, loaded } = useGameContext();
  const { user, profile } = useAuthStore();
  const { stats: supaStats } = useStatsStore();
  const { savedGame: storeSaved, deleteSavedGame } = useGameStore();
  const [showResume, setShowResume] = useState(false);

  const rating = supaStats?.rating ?? ctxStats.rating;
  const totalWins = supaStats?.total_wins ?? ctxStats.totalWins;
  const totalLosses = supaStats?.total_losses ?? ctxStats.totalLosses;
  const totalGames = supaStats?.total_games ?? ctxStats.totalGames;
  const currentStreak = supaStats?.current_streak ?? ctxStats.currentStreak;
  const bestStreak = supaStats?.best_streak ?? ctxStats.bestStreak;
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  const hasSavedGame = !!(storeSaved || ctxSaved);

  useFocusEffect(
    useCallback(() => {
      if (user && supaStats) {
        // data already fetched by _layout StoreInitializer
      }
      if (hasSavedGame) {
        setShowResume(true);
      }
    }, [loaded, hasSavedGame, user])
  );

  const handleContinue = () => {
    setShowResume(false);
    if (storeSaved) {
      router.push({ pathname: '/game', params: { mode: storeSaved.mode, difficulty: storeSaved.difficulty || '', resume: 'true' } } as never);
    } else if (ctxSaved) {
      router.push({ pathname: '/game', params: { mode: ctxSaved.mode, difficulty: ctxSaved.difficulty || '', resume: 'true' } } as never);
    }
  };

  const handleNewGame = () => {
    if (user && storeSaved) deleteSavedGame(user.id);
    else clearSavedGame();
    setShowResume(false);
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <View style={s.header}>
          <View style={s.logoRow}>
            <View style={s.gridIcon}>
              <View style={s.gridDot} /><View style={s.gridDot} />
              <View style={s.gridDot} /><View style={s.gridDot} />
            </View>
            <Text style={s.logoText}>QUORIDOR</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/settings' as never)} activeOpacity={0.6}>
            <Ionicons name="settings-outline" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={s.heroSection}>
          <Text style={s.heroLabel}>GRANDMASTER JOURNEY</Text>
          <Text style={s.heroTitle}>{'COMMAND THE\nBOARD.'}</Text>
          <TouchableOpacity testID="start-game-btn" style={s.startBtn} activeOpacity={0.85} onPress={() => router.push('/mode-select' as never)}>
            <Text style={s.startBtnText}>START GAME</Text>
            <Ionicons name="play" size={18} color={COLORS.background} />
          </TouchableOpacity>
        </View>

        <View style={s.card}>
          <View style={s.streakHeader}>
            <Text style={s.sectionLabel}>ACTIVE STREAK</Text>
            <Ionicons name="flame-outline" size={20} color={COLORS.accent} />
          </View>
          <View style={s.streakValue}>
            <Text style={s.bigNum}>{currentStreak}</Text>
            <Text style={s.bigNumUnit}> Wins</Text>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${Math.min(currentStreak * 20, 100)}%` }]} />
          </View>
          <Text style={s.mutedText}>{currentStreak > 0 ? `Best streak: ${bestStreak}` : 'Win games to build your streak.'}</Text>
        </View>

        <View style={s.statsGrid}>
          <View style={s.statCell}>
            <Text style={s.statLabel}>RATING</Text>
            <View style={s.statRow}>
              <Text style={s.statValue}>{rating}</Text>
            </View>
          </View>
          <View style={s.statCell}>
            <Text style={s.statLabel}>WINS</Text>
            <Text style={s.statValue}>{totalWins}</Text>
          </View>
          <View style={s.statCell}>
            <Text style={s.statLabel}>LOSSES</Text>
            <Text style={s.statValue}>{totalLosses}</Text>
          </View>
          <View style={s.statCell}>
            <Text style={s.statLabel}>WIN RATE</Text>
            <View style={s.statRow}>
              <Text style={s.statValue}>{winRate}%</Text>
              <View style={s.statBar} />
            </View>
          </View>
        </View>

        <Text style={s.dividerLabel}>TRAINING GROUNDS</Text>
        <TouchableOpacity style={s.trainingCard} activeOpacity={0.7} onPress={() => router.push('/trainer' as never)}>
          <View style={s.trainingImage}>
            <View style={s.trainingGrid}>
              {Array.from({ length: 16 }).map((_, i) => (
                <View key={i} style={s.trainingGridCell} />
              ))}
            </View>
            <Text style={s.trainingOverlay}>STRATEGY</Text>
          </View>
          <View style={s.trainingContent}>
            <Text style={s.eliteLabel}>ELITE MASTERY</Text>
            <Text style={s.trainingTitle}>{'The Path to\nGrandmaster'}</Text>
            <Text style={s.trainingDesc}>Master wall placement, corridor traps, and endgame theory.</Text>
            <View style={s.readLink}>
              <Text style={s.readLinkText}>Read Chapter 1</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.accent} />
            </View>
          </View>
        </TouchableOpacity>

        <Text style={s.dividerLabel}>QUICK ACTIONS</Text>
        <View style={s.quickRow}>
          <TouchableOpacity style={s.quickCard} onPress={() => router.push('/achievements' as never)} activeOpacity={0.7}>
            <Ionicons name="ribbon-outline" size={22} color={COLORS.accent} />
            <Text style={s.quickTitle}>Achievements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.quickCard} onPress={() => router.push('/match-history' as never)} activeOpacity={0.7}>
            <Ionicons name="time-outline" size={22} color={COLORS.textPrimary} />
            <Text style={s.quickTitle}>Match History</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {showResume && (
        <TouchableOpacity style={[StyleSheet.absoluteFill, s.overlay]} activeOpacity={1} onPress={() => setShowResume(false)}>
          <View style={s.resumeCard}>
            <Text style={s.resumeTitle}>GAME IN PROGRESS</Text>
            <Text style={s.resumeDesc}>You have an unfinished game. Would you like to continue?</Text>
            <View style={s.resumeBtns}>
              <TouchableOpacity style={s.resumeContinueBtn} onPress={handleContinue} activeOpacity={0.85}>
                <Text style={s.resumeContinueText}>CONTINUE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.resumeNewBtn} onPress={handleNewGame} activeOpacity={0.7}>
                <Text style={s.resumeNewText}>NEW GAME</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  gridIcon: { width: 20, height: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  gridDot: { width: 8, height: 8, borderRadius: 1.5, backgroundColor: COLORS.accent },
  logoText: { color: COLORS.textPrimary, fontSize: 18, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 3 },
  heroSection: { marginTop: 24 },
  heroLabel: { color: COLORS.textSecondary, fontSize: 11, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2 },
  heroTitle: { color: COLORS.textPrimary, fontSize: 38, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', lineHeight: 44, marginTop: 8 },
  startBtn: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 },
  startBtnText: { color: COLORS.background, fontSize: 16, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  card: { backgroundColor: COLORS.elevated, borderRadius: 14, padding: 18, marginTop: 16 },
  streakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1.5 },
  streakValue: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  bigNum: { color: COLORS.textPrimary, fontSize: 42, fontFamily: 'Inter_800ExtraBold', fontWeight: '800' },
  bigNumUnit: { color: COLORS.textSecondary, fontSize: 18, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 14 },
  progressFill: { height: 4, backgroundColor: COLORS.accent, borderRadius: 2 },
  mutedText: { color: COLORS.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 },
  statCell: { width: '50%', paddingVertical: 12, paddingRight: 12 },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1.5 },
  statValue: { color: COLORS.textPrimary, fontSize: 34, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', marginTop: 2 },
  statDelta: { color: COLORS.accent, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', marginLeft: 6, marginTop: 14 },
  statRow: { flexDirection: 'row', alignItems: 'center' },
  statBar: { width: 32, height: 3, backgroundColor: COLORS.accent, borderRadius: 1.5, marginLeft: 8, marginTop: 14 },
  dividerLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2, marginTop: 32, marginBottom: 4 },
  trainingCard: { backgroundColor: COLORS.elevated, borderRadius: 14, overflow: 'hidden', marginTop: 12 },
  trainingImage: { height: 120, backgroundColor: COLORS.surfaceLowest, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  trainingGrid: { flexDirection: 'row', flexWrap: 'wrap', width: 120, opacity: 0.15, position: 'absolute' },
  trainingGridCell: { width: 28, height: 28, borderWidth: 1, borderColor: COLORS.accent },
  trainingOverlay: { color: COLORS.accent, fontSize: 28, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 6, opacity: 0.35 },
  trainingContent: { padding: 18 },
  eliteLabel: { color: COLORS.accent, fontSize: 11, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2 },
  trainingTitle: { color: COLORS.textPrimary, fontSize: 22, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', lineHeight: 28, marginTop: 6 },
  trainingDesc: { color: COLORS.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 19, marginTop: 8 },
  readLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  readLinkText: { color: COLORS.accent, fontSize: 15, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  quickRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  quickCard: { flex: 1, backgroundColor: COLORS.elevated, borderRadius: 14, padding: 18, alignItems: 'center', gap: 8 },
  quickTitle: { color: COLORS.textPrimary, fontSize: 13, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  overlay: { backgroundColor: COLORS.overlayGlass, alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  resumeCard: { backgroundColor: COLORS.elevated, borderRadius: 20, padding: 32, width: 300, alignItems: 'center' },
  resumeTitle: { color: COLORS.textPrimary, fontSize: 18, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 2 },
  resumeDesc: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 12, lineHeight: 20 },
  resumeBtns: { width: '100%', marginTop: 24, gap: 8 },
  resumeContinueBtn: { backgroundColor: COLORS.accent, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  resumeContinueText: { color: COLORS.background, fontSize: 14, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  resumeNewBtn: { backgroundColor: COLORS.secondaryBg, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  resumeNewText: { color: COLORS.textPrimary, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
});
