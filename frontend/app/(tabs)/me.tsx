import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/theme/colors';
import { useGameContext } from '../../src/storage/GameContext';
import { useAuth } from '../../src/storage/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { stats, isPremium, achievements } = useGameContext();
  const { user } = useAuth();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const winRate = stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0;

  return (
    <SafeAreaView style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
        {/* Profile Header */}
        <View style={st.profileHeader}>
          <View style={st.avatarCircle}>
            <Ionicons name="person" size={36} color={COLORS.textSecondary} />
          </View>
          <Text style={st.displayName}>{user?.displayName || 'COMMANDER'}</Text>
          <Text style={st.rankLabel}>{user?.rank || 'STRATEGIST II'}</Text>
          {isPremium && (
            <View style={st.premiumBadge}>
              <Ionicons name="diamond" size={12} color={COLORS.accent} />
              <Text style={st.premiumText}>PREMIUM</Text>
            </View>
          )}
          <TouchableOpacity style={st.editBtn} onPress={() => router.push('/edit-profile' as never)} activeOpacity={0.7}>
            <Text style={st.editBtnText}>EDIT PROFILE</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={st.statsCard}>
          <View style={st.statsRow}>
            <View style={st.statItem}>
              <Text style={st.statValue}>{stats.rating}</Text>
              <Text style={st.statLabel}>RATING</Text>
            </View>
            <View style={st.statItem}>
              <Text style={st.statValue}>{stats.totalGames}</Text>
              <Text style={st.statLabel}>GAMES</Text>
            </View>
            <View style={st.statItem}>
              <Text style={st.statValue}>{winRate}%</Text>
              <Text style={st.statLabel}>WIN RATE</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={st.menuGroup}>
          <TouchableOpacity style={st.menuItem} onPress={() => router.push('/achievements' as never)} activeOpacity={0.7}>
            <View style={st.menuIconWrap}><Ionicons name="ribbon-outline" size={20} color={COLORS.accent} /></View>
            <View style={st.menuInfo}>
              <Text style={st.menuTitle}>Achievements</Text>
              <Text style={st.menuSub}>{unlockedCount}/{achievements.length} unlocked</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={st.menuItem} onPress={() => router.push('/match-history' as never)} activeOpacity={0.7}>
            <View style={st.menuIconWrap}><Ionicons name="time-outline" size={20} color={COLORS.textPrimary} /></View>
            <View style={st.menuInfo}>
              <Text style={st.menuTitle}>Match History</Text>
              <Text style={st.menuSub}>{stats.totalGames} games played</Text>
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
  editBtn: { backgroundColor: COLORS.secondaryBg, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10, marginTop: 16 },
  editBtnText: { color: COLORS.textPrimary, fontSize: 12, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  statsCard: { backgroundColor: COLORS.elevated, borderRadius: 14, padding: 20, marginTop: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { color: COLORS.textPrimary, fontSize: 24, fontFamily: 'Inter_800ExtraBold', fontWeight: '800' },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1, marginTop: 4 },
  menuGroup: { marginTop: 20, gap: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.elevated, borderRadius: 12, padding: 16, gap: 12 },
  menuIconWrap: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center' },
  menuInfo: { flex: 1 },
  menuTitle: { color: COLORS.textPrimary, fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  menuSub: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
});
