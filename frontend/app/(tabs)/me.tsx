import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/theme/colors';
import { useAuthStore } from '../../src/store/authStore';
import { useStatsStore } from '../../src/store/statsStore';

const ACHIEVEMENT_MAP: Record<string, { name: string; desc: string }> = {
  first_victory: { name: 'First Victory', desc: 'Win your first game' },
  wall_master: { name: 'Wall Master', desc: 'Use all 10 walls and win' },
  speedrun: { name: 'Speedrun', desc: 'Win in 15 moves or fewer' },
  pacifist: { name: 'Pacifist', desc: 'Win without placing any walls' },
  strategist: { name: 'Strategist', desc: 'Beat Grandmaster AI' },
  dedicated: { name: 'Dedicated', desc: 'Play 25 games' },
  veteran: { name: 'Veteran', desc: 'Play 100 games' },
};

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, isPremium, user } = useAuthStore();
  const { stats, achievements } = useStatsStore();

  const totalGames = stats?.total_games ?? 0;
  const totalWins = stats?.total_wins ?? 0;
  const totalLosses = stats?.total_losses ?? 0;
  const bestStreak = stats?.best_streak ?? 0;
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
  const displayName = profile?.username || user?.user_metadata?.display_name || 'COMMANDER';
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

  return (
    <SafeAreaView style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
        <View style={st.profileHeader}>
          <View style={st.avatarCircle}>
            <Ionicons name="person" size={36} color={COLORS.textSecondary} />
          </View>
          <Text style={st.displayName}>{displayName.toUpperCase()}</Text>
          <Text style={st.rankLabel}>STRATEGIST II</Text>
          {isPremium && (
            <View style={st.premiumBadge}>
              <Ionicons name="diamond" size={12} color={COLORS.accent} />
              <Text style={st.premiumText}>PREMIUM</Text>
            </View>
          )}
          {memberSince ? <Text style={st.memberSince}>Member since {memberSince}</Text> : null}
          <TouchableOpacity style={st.editBtn} onPress={() => router.push('/edit-profile' as never)} activeOpacity={0.7}>
            <Text style={st.editBtnText}>EDIT PROFILE</Text>
          </TouchableOpacity>
        </View>

        <View style={st.statsCard}>
          <View style={st.statsRow}>
            <View style={st.statItem}>
              <Text style={st.statValue}>{stats?.rating ?? 1200}</Text>
              <Text style={st.statLabel}>RATING</Text>
            </View>
            <View style={st.statItem}>
              <Text style={st.statValue}>{totalGames}</Text>
              <Text style={st.statLabel}>GAMES</Text>
            </View>
            <View style={st.statItem}>
              <Text style={st.statValue}>{winRate}%</Text>
              <Text style={st.statLabel}>WIN RATE</Text>
            </View>
          </View>
        </View>

        <View style={st.detailCard}>
          <View style={st.detailRow}>
            <Text style={st.detailLabel}>WINS</Text>
            <Text style={st.detailValue}>{totalWins}</Text>
          </View>
          <View style={st.detailRow}>
            <Text style={st.detailLabel}>LOSSES</Text>
            <Text style={st.detailValue}>{totalLosses}</Text>
          </View>
          <View style={st.detailRow}>
            <Text style={st.detailLabel}>BEST STREAK</Text>
            <Text style={st.detailValue}>{bestStreak}</Text>
          </View>
        </View>

        {achievements.length > 0 && (
          <View style={st.achSection}>
            <Text style={st.achTitle}>UNLOCKED ACHIEVEMENTS</Text>
            {achievements.map((key) => {
              const info = ACHIEVEMENT_MAP[key];
              if (!info) return null;
              return (
                <View key={key} style={st.achRow}>
                  <Ionicons name="ribbon" size={18} color={COLORS.accent} />
                  <View style={st.achInfo}>
                    <Text style={st.achName}>{info.name}</Text>
                    <Text style={st.achDesc}>{info.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={st.menuGroup}>
          <TouchableOpacity style={st.menuItem} onPress={() => router.push('/achievements' as never)} activeOpacity={0.7}>
            <View style={st.menuIconWrap}><Ionicons name="ribbon-outline" size={20} color={COLORS.accent} /></View>
            <View style={st.menuInfo}>
              <Text style={st.menuTitle}>Achievements</Text>
              <Text style={st.menuSub}>{achievements.length}/{Object.keys(ACHIEVEMENT_MAP).length} unlocked</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={st.menuItem} onPress={() => router.push('/match-history' as never)} activeOpacity={0.7}>
            <View style={st.menuIconWrap}><Ionicons name="time-outline" size={20} color={COLORS.textPrimary} /></View>
            <View style={st.menuInfo}>
              <Text style={st.menuTitle}>Match History</Text>
              <Text style={st.menuSub}>{totalGames} games played</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={st.menuItem} onPress={() => router.push('/settings' as never)} activeOpacity={0.7}>
            <View style={st.menuIconWrap}><Ionicons name="settings-outline" size={20} color={COLORS.textPrimary} /></View>
            <View style={st.menuInfo}>
              <Text style={st.menuTitle}>Settings</Text>
              <Text style={st.menuSub}>Preferences & account</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={st.menuItem} onPress={() => router.push(isPremium ? '/subscription' as never : '/paywall' as never)} activeOpacity={0.7}>
            <View style={[st.menuIconWrap, { backgroundColor: COLORS.accentAlpha15 }]}><Ionicons name="diamond-outline" size={20} color={COLORS.accent} /></View>
            <View style={st.menuInfo}>
              <Text style={st.menuTitle}>{isPremium ? 'Subscription' : 'Go Premium'}</Text>
              <Text style={st.menuSub}>{isPremium ? 'Manage your plan' : 'Unlock all features'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 20 },
  profileHeader: { alignItems: 'center', paddingTop: 24, paddingBottom: 20 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.elevated, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  displayName: { color: COLORS.textPrimary, fontSize: 24, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 2 },
  rankLabel: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2, marginTop: 4 },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.accentAlpha15, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  premiumText: { color: COLORS.accent, fontSize: 10, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  memberSince: { color: COLORS.textSecondary, fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 6 },
  editBtn: { backgroundColor: COLORS.secondaryBg, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10, marginTop: 16 },
  editBtnText: { color: COLORS.textPrimary, fontSize: 12, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  statsCard: { backgroundColor: COLORS.elevated, borderRadius: 14, padding: 20, marginTop: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { color: COLORS.textPrimary, fontSize: 24, fontFamily: 'Inter_800ExtraBold', fontWeight: '800' },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1, marginTop: 4 },
  detailCard: { backgroundColor: COLORS.elevated, borderRadius: 14, padding: 16, marginTop: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  detailLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  detailValue: { color: COLORS.textPrimary, fontSize: 16, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  achSection: { marginTop: 16 },
  achTitle: { color: COLORS.accent, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  achRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.elevated, borderRadius: 10, padding: 12, marginBottom: 6 },
  achInfo: { flex: 1 },
  achName: { color: COLORS.textPrimary, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  achDesc: { color: COLORS.textSecondary, fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  menuGroup: { marginTop: 20, gap: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.elevated, borderRadius: 12, padding: 16, gap: 12 },
  menuIconWrap: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center' },
  menuInfo: { flex: 1 },
  menuTitle: { color: COLORS.textPrimary, fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  menuSub: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
});
