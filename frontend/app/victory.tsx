import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/colors';
import PrimaryButton from '../src/components/PrimaryButton';
import GhostButton from '../src/components/GhostButton';

export default function VictoryScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const winner = Number(params.winner || 0);
  const p1Name = (params.p1Name as string) || 'Player 1';
  const p2Name = (params.p2Name as string) || 'Player 2';
  const moves1 = Number(params.moves1 || 0);
  const moves2 = Number(params.moves2 || 0);
  const walls1 = Number(params.walls1 || 0);
  const walls2 = Number(params.walls2 || 0);
  const timeSec = Number(params.time || 0);
  const mode = (params.mode as string) || 'ai';
  const difficulty = (params.difficulty as string) || '';

  const winnerName = winner === 0 ? p1Name : p2Name;
  const winnerColor = winner === 0 ? COLORS.player1 : COLORS.player2;
  const mins = Math.floor(timeSec / 60);
  const secs = timeSec % 60;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView testID="victory-screen" style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Trophy */}
        <View style={[styles.trophyGlow, { backgroundColor: winnerColor === COLORS.player1 ? COLORS.player1Glow : COLORS.player2Glow }]}>
          <View style={styles.trophyCircle}>
            <Ionicons name="trophy" size={48} color={winnerColor} />
          </View>
        </View>

        {/* Winner text */}
        <Text style={styles.winnerName}>{winnerName.toUpperCase()}</Text>
        <Text style={styles.winsLabel}>WINS</Text>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <StatItem label="MOVES" value1={moves1} value2={moves2} name1={p1Name} name2={p2Name} />
          </View>
          <View style={styles.divider} />
          <View style={styles.statsRow}>
            <StatItem label="WALLS" value1={walls1} value2={walls2} name1={p1Name} name2={p2Name} />
          </View>
          <View style={styles.divider} />
          <View style={styles.statsRow}>
            <View style={styles.statCenter}>
              <Text style={styles.statLabel}>TIME</Text>
              <Text style={styles.statValueLarge}>
                {mins}:{secs.toString().padStart(2, '0')}
              </Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <PrimaryButton
            testID="play-again-btn"
            title="PLAY AGAIN"
            onPress={() => {
              if (mode === 'ai') {
                router.replace({
                  pathname: '/game',
                  params: { mode: 'ai', difficulty, p1Name, p2Name, p1Color: COLORS.player1, p2Color: COLORS.player2 },
                } as never);
              } else {
                router.replace({
                  pathname: '/game',
                  params: { mode: 'local', p1Name, p2Name, p1Color: COLORS.player1, p2Color: COLORS.player2 },
                } as never);
              }
            }}
          />
          <GhostButton
            testID="home-btn"
            title="HOME"
            onPress={() => router.replace('/(tabs)' as never)}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

function StatItem({ label, value1, value2, name1, name2 }: {
  label: string; value1: number; value2: number; name1: string; name2: string;
}) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statRow}>
        <View style={styles.statSide}>
          <View style={[styles.playerDot, { backgroundColor: COLORS.player1 }]} />
          <Text style={styles.statPlayerName}>{name1}</Text>
          <Text style={styles.statValue}>{value1}</Text>
        </View>
        <View style={styles.statSide}>
          <View style={[styles.playerDot, { backgroundColor: COLORS.player2 }]} />
          <Text style={styles.statPlayerName}>{name2}</Text>
          <Text style={styles.statValue}>{value2}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  trophyGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  trophyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerName: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontFamily: 'Inter_800ExtraBold',
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
  },
  winsLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: COLORS.elevated,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginTop: 32,
  },
  statsRow: {
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  statItem: {
    gap: 8,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statPlayerName: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
  },
  statCenter: {
    alignItems: 'center',
    gap: 4,
  },
  statValueLarge: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
  },
  buttons: {
    width: '100%',
    marginTop: 32,
    gap: 8,
  },
});
