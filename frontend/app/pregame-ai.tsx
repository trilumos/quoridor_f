import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/colors';
import { useGameContext } from '../src/storage/GameContext';

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTIES: { key: Difficulty; label: string; icon: string; desc: string }[] = [
  { key: 'easy', label: 'NOVICE', icon: 'school-outline', desc: 'Linear Patterns & Fundamental Blocking' },
  { key: 'medium', label: 'STRATEGIC', icon: 'flash-outline', desc: 'Path Minimization & Resource Efficiency' },
  { key: 'hard', label: 'GRANDMASTER', icon: 'skull-outline', desc: 'Heuristic Symmetry & Infinite Game Loops' },
];

export default function PregameAI() {
  const router = useRouter();
  const { isPremium } = useGameContext();
  const [selected, setSelected] = useState<Difficulty | null>(null);

  const handleStart = () => {
    if (!selected) return;
    router.push({
      pathname: '/game',
      params: {
        mode: 'ai',
        difficulty: selected,
        p1Name: 'ARCHITECT_X',
        p2Name: selected === 'easy' ? 'Novice AI' : selected === 'medium' ? 'Strategic AI' : 'Grandmaster AI',
        p1Color: COLORS.player1,
        p2Color: COLORS.player2,
      },
    } as never);
  };

  return (
    <SafeAreaView style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
        {/* Header */}
        <View style={st.header}>
          <View style={st.logoRow}>
            <View style={st.gridIcon}>
              <View style={st.gridDot} /><View style={st.gridDot} />
              <View style={st.gridDot} /><View style={st.gridDot} />
            </View>
            <Text style={st.logoText}>QUORIDOR</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/settings' as never)} activeOpacity={0.6}>
            <Ionicons name="settings-outline" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={st.configLabel}>GAME CONFIGURATION</Text>
        <Text style={st.pageTitle}>{'Select Strategic\nComplexity'}</Text>

        {/* Difficulty Cards */}
        <View style={st.cards}>
          {DIFFICULTIES.map((d) => {
            const isSelected = selected === d.key;
            const isLocked = d.key === 'hard' && !isPremium;
            return (
              <TouchableOpacity
                key={d.key}
                testID={`diff-${d.key}`}
                style={[st.diffCard, isSelected && st.diffCardSelected, isLocked && st.diffCardLocked]}
                onPress={() => { if (!isLocked) setSelected(d.key); }}
                activeOpacity={isLocked ? 0.4 : 0.7}
              >
                {isSelected && <View style={st.pinstripe} />}
                <View style={st.diffInner}>
                  <View style={st.diffLeft}>
                    <View style={st.diffIconWrap}>
                      <Ionicons name={d.icon as any} size={20} color={isSelected ? COLORS.accent : COLORS.textSecondary} />
                    </View>
                    <View style={st.diffText}>
                      <View style={st.diffTitleRow}>
                        <Text style={[st.diffTitle, isLocked && { color: COLORS.textSecondary }]}>{d.label}</Text>
                        {d.key === 'medium' && (
                          <View style={st.recoBadge}>
                            <Text style={st.recoText}>RECOMMENDED</Text>
                          </View>
                        )}
                      </View>
                      <Text style={st.diffDesc}>{d.desc}</Text>
                    </View>
                  </View>
                  {/* Radio button */}
                  <View style={[st.radio, isSelected && st.radioSelected]}>
                    {isSelected && <View style={st.radioInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* System Preview */}
        <View style={st.previewCard}>
          <Text style={st.previewLabel}>SYSTEM PREVIEW</Text>
          <Text style={st.previewDesc}>
            The AI evaluates <Text style={st.bold}>Shortest Path</Text> algorithms in real-time, adapting wall placement to maximize path disruption while minimizing resource expenditure.
          </Text>
          <View style={st.previewBar}>
            <View style={[st.previewBarFill, { width: '65%' }]} />
          </View>
          <View style={st.previewStats}>
            <Text style={st.previewPercent}>65% Win-rate</Text>
            <Text style={st.previewNote}>AVERAGE DIFFICULTY AT YOUR CURRENT RANK</Text>
          </View>
        </View>

        {/* Bottom buttons */}
        <View style={st.bottomBtns}>
          <TouchableOpacity style={st.changeModeBtn} onPress={() => router.back()} activeOpacity={0.6}>
            <Ionicons name="arrow-back" size={16} color={COLORS.textSecondary} />
            <Text style={st.changeModeText}>CHANGE MODE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="start-ai-btn"
            style={[st.continueBtn, !selected && st.continueBtnDisabled]}
            onPress={handleStart}
            activeOpacity={0.85}
            disabled={!selected}
          >
            <Text style={st.continueBtnText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  gridIcon: { width: 20, height: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  gridDot: { width: 8, height: 8, borderRadius: 1.5, backgroundColor: COLORS.accent },
  logoText: { color: COLORS.textPrimary, fontSize: 18, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 3 },
  configLabel: { color: COLORS.accent, fontSize: 11, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2, marginTop: 24 },
  pageTitle: { color: COLORS.textPrimary, fontSize: 30, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', lineHeight: 36, marginTop: 8 },
  cards: { gap: 10, marginTop: 24 },
  diffCard: { backgroundColor: COLORS.elevated, borderRadius: 14, overflow: 'hidden', position: 'relative' },
  diffCardSelected: { borderWidth: 1.5, borderColor: COLORS.accent },
  diffCardLocked: { opacity: 0.45 },
  pinstripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2.5, backgroundColor: COLORS.accent, zIndex: 1 },
  diffInner: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingRight: 18 },
  diffLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  diffIconWrap: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center' },
  diffText: { flex: 1 },
  diffTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  diffTitle: { color: COLORS.textPrimary, fontSize: 14, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  recoBadge: { backgroundColor: COLORS.accentAlpha15, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  recoText: { color: COLORS.accent, fontSize: 8, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 0.5 },
  diffDesc: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 3 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: COLORS.accent },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.accent },
  previewCard: { backgroundColor: COLORS.elevated, borderRadius: 14, padding: 18, marginTop: 20 },
  previewLabel: { color: COLORS.accent, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2 },
  previewDesc: { color: COLORS.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 19, marginTop: 10 },
  bold: { fontFamily: 'Inter_700Bold', fontWeight: '700', color: COLORS.textPrimary },
  previewBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 16 },
  previewBarFill: { height: 4, backgroundColor: COLORS.accent, borderRadius: 2 },
  previewStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  previewPercent: { color: COLORS.textPrimary, fontSize: 13, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  previewNote: { color: COLORS.textSecondary, fontSize: 9, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 0.5, flex: 1, textAlign: 'right', marginLeft: 12 },
  bottomBtns: { marginTop: 28, gap: 12 },
  changeModeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14 },
  changeModeText: { color: COLORS.textSecondary, fontSize: 13, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  continueBtn: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  continueBtnDisabled: { opacity: 0.4 },
  continueBtnText: { color: COLORS.background, fontSize: 15, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
});
