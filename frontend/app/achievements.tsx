import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/colors';
import { useGameContext } from '../src/storage/GameContext';

export default function AchievementsScreen() {
  const router = useRouter();
  const { achievements } = useGameContext();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <SafeAreaView style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={st.backBtn} activeOpacity={0.6}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <Text style={st.label}>HALL OF HONOR</Text>
        <Text style={st.heading}>ACHIEVEMENTS</Text>

        <View style={st.progressCard}>
          <Text style={st.progressLabel}>COMPLETION</Text>
          <View style={st.progressRow}>
            <Text style={st.progressValue}>{unlockedCount}/{achievements.length}</Text>
            <View style={st.progressTrack}>
              <View style={[st.progressFill, { width: `${(unlockedCount / achievements.length) * 100}%` }]} />
            </View>
          </View>
        </View>

        <View style={st.list}>
          {achievements.map((a) => (
            <View key={a.id} style={[st.achievementCard, a.unlocked && st.achievementUnlocked]}>
              {a.unlocked && <View style={st.achievementPinstripe} />}
              <View style={[st.achievementIcon, a.unlocked && st.achievementIconUnlocked]}>
                <Ionicons name={a.unlocked ? 'ribbon' : 'ribbon-outline'} size={24} color={a.unlocked ? COLORS.accent : COLORS.textSecondary} />
              </View>
              <View style={st.achievementInfo}>
                <Text style={[st.achievementName, !a.unlocked && st.achievementNameLocked]}>{a.name}</Text>
                <Text style={st.achievementDesc}>{a.description}</Text>
                {a.target > 1 && (
                  <View style={st.achievementProgress}>
                    <View style={st.achievementTrack}>
                      <View style={[st.achievementFill, { width: `${(a.progress / a.target) * 100}%` }]} />
                    </View>
                    <Text style={st.achievementCount}>{a.progress}/{a.target}</Text>
                  </View>
                )}
              </View>
              {a.unlocked && <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />}
            </View>
          ))}
        </View>

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
  progressCard: { backgroundColor: COLORS.elevated, borderRadius: 14, padding: 18, marginBottom: 20 },
  progressLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1.5 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  progressValue: { color: COLORS.textPrimary, fontSize: 20, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', width: 50 },
  progressTrack: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: COLORS.accent, borderRadius: 2 },
  list: { gap: 8 },
  achievementCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.elevated, borderRadius: 12, padding: 16, gap: 12, overflow: 'hidden', position: 'relative' },
  achievementUnlocked: {},
  achievementPinstripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.accent },
  achievementIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center' },
  achievementIconUnlocked: { backgroundColor: COLORS.accentAlpha15 },
  achievementInfo: { flex: 1 },
  achievementName: { color: COLORS.textPrimary, fontSize: 15, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  achievementNameLocked: { color: COLORS.textSecondary },
  achievementDesc: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  achievementProgress: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  achievementTrack: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 1.5 },
  achievementFill: { height: 3, backgroundColor: COLORS.accent, borderRadius: 1.5 },
  achievementCount: { color: COLORS.textSecondary, fontSize: 11, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
});
