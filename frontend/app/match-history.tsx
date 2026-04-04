import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/colors';
import { useGameContext } from '../src/storage/GameContext';

const MOCK_MATCHES = [
  { id: '1', mode: 'ai', difficulty: 'medium', result: 'win', moves: 24, walls: 6, date: '2 hours ago', opponent: 'Strategic AI' },
  { id: '2', mode: 'ai', difficulty: 'easy', result: 'win', moves: 18, walls: 3, date: '5 hours ago', opponent: 'Novice AI' },
  { id: '3', mode: 'local', difficulty: '', result: 'loss', moves: 31, walls: 8, date: 'Yesterday', opponent: 'Player 2' },
  { id: '4', mode: 'ai', difficulty: 'hard', result: 'loss', moves: 42, walls: 10, date: '2 days ago', opponent: 'Grandmaster AI' },
  { id: '5', mode: 'ai', difficulty: 'medium', result: 'win', moves: 22, walls: 5, date: '3 days ago', opponent: 'Strategic AI' },
];

export default function MatchHistoryScreen() {
  const router = useRouter();
  const { stats } = useGameContext();

  const matches = stats.totalGames > 0 ? MOCK_MATCHES : [];

  return (
    <SafeAreaView style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={st.backBtn} activeOpacity={0.6}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <Text style={st.label}>VAULT ACTIVITY</Text>
        <Text style={st.heading}>MATCH HISTORY</Text>

        {matches.length === 0 ? (
          <View style={st.emptyState}>
            <View style={st.emptyIcon}>
              <Ionicons name="game-controller-outline" size={40} color={COLORS.textSecondary} />
            </View>
            <Text style={st.emptyTitle}>NO MATCHES YET</Text>
            <Text style={st.emptyDesc}>Complete your first game to start building your match history.</Text>
            <TouchableOpacity style={st.emptyBtn} onPress={() => router.replace('/mode-select' as never)} activeOpacity={0.85}>
              <Text style={st.emptyBtnText}>PLAY NOW</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={st.list}>
            {matches.map((match) => (
              <View key={match.id} style={st.matchCard}>
                {match.result === 'win' && <View style={st.matchPinstripe} />}
                <View style={st.matchHeader}>
                  <View style={[st.resultBadge, match.result === 'win' ? st.winBadge : st.lossBadge]}>
                    <Text style={[st.resultText, match.result === 'win' ? st.winText : st.lossText]}>
                      {match.result === 'win' ? 'VICTORY' : 'DEFEAT'}
                    </Text>
                  </View>
                  <Text style={st.matchDate}>{match.date}</Text>
                </View>
                <View style={st.matchDetails}>
                  <View style={st.matchDetail}>
                    <Text style={st.matchDetailLabel}>OPPONENT</Text>
                    <Text style={st.matchDetailValue}>{match.opponent}</Text>
                  </View>
                  <View style={st.matchDetail}>
                    <Text style={st.matchDetailLabel}>MOVES</Text>
                    <Text style={st.matchDetailValue}>{match.moves}</Text>
                  </View>
                  <View style={st.matchDetail}>
                    <Text style={st.matchDetailLabel}>WALLS</Text>
                    <Text style={st.matchDetailValue}>{match.walls}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 20 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', marginTop: 8 },
  label: { color: COLORS.accent, fontSize: 11, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2 },
  heading: { color: COLORS.textPrimary, fontSize: 32, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', marginTop: 4, marginBottom: 20 },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.elevated, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 18, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 2 },
  emptyDesc: { color: COLORS.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 8, lineHeight: 19, paddingHorizontal: 20 },
  emptyBtn: { backgroundColor: COLORS.accent, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32, marginTop: 24 },
  emptyBtnText: { color: COLORS.background, fontSize: 14, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  list: { gap: 10 },
  matchCard: { backgroundColor: COLORS.elevated, borderRadius: 12, padding: 16, overflow: 'hidden', position: 'relative' },
  matchPinstripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.accent },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  winBadge: { backgroundColor: 'rgba(34,197,94,0.12)' },
  lossBadge: { backgroundColor: 'rgba(239,68,68,0.12)' },
  resultText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  winText: { color: COLORS.success },
  lossText: { color: COLORS.error },
  matchDate: { color: COLORS.textSecondary, fontSize: 11, fontFamily: 'Inter_400Regular' },
  matchDetails: { flexDirection: 'row', marginTop: 12, gap: 16 },
  matchDetail: {},
  matchDetailLabel: { color: COLORS.textSecondary, fontSize: 9, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  matchDetailValue: { color: COLORS.textPrimary, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', marginTop: 2 },
});
