import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/theme/colors';
import { useGameContext } from '../../src/storage/GameContext';

const THEMES = [
  { id: 'obsidian', name: 'Obsidian Dark', desc: 'Default premium dark theme', locked: false, active: true },
  { id: 'walnut', name: 'Polished Walnut', desc: 'Warm wood-grain aesthetic', locked: false, active: false },
  { id: 'marble', name: 'Carrara Marble', desc: 'Classic Italian stone finish', locked: true, premium: true },
  { id: 'neon', name: 'Neon Circuit', desc: 'Cyberpunk grid overlay', locked: true, premium: true },
  { id: 'frost', name: 'Arctic Frost', desc: 'Cool blue tonal palette', locked: true, premium: true },
  { id: 'gold', name: 'Royal Gold', desc: 'Luxurious gilded surfaces', locked: true, premium: true },
];

export default function CollectionScreen() {
  const router = useRouter();
  const { isPremium } = useGameContext();

  return (
    <SafeAreaView style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
        <View style={st.headerArea}>
          <Text style={st.label}>VISUAL IDENTITY</Text>
          <Text style={st.heading}>THEMES</Text>
        </View>

        {/* Active Theme */}
        <View style={st.activeThemeCard}>
          <View style={st.activeThemeOverlay}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={st.activeThemeLine} />
            ))}
          </View>
          <View style={st.activeThemeContent}>
            <Text style={st.activeLabel}>CURRENTLY ACTIVE</Text>
            <Text style={st.activeTitle}>OBSIDIAN DARK</Text>
            <Text style={st.activeDesc}>The signature board material. Deep contrast with precision grid lines.</Text>
          </View>
        </View>

        {/* Theme Grid */}
        <View style={st.themeGrid}>
          {THEMES.map((theme) => {
            const isLocked = theme.locked && !isPremium;
            return (
              <TouchableOpacity
                key={theme.id}
                style={[st.themeCard, theme.active && st.themeCardActive, isLocked && st.themeCardLocked]}
                activeOpacity={isLocked ? 0.5 : 0.7}
                onPress={() => { if (isLocked) router.push('/paywall' as never); }}
              >
                {theme.active && <View style={st.themePinstripe} />}
                <View style={[st.themePreview, theme.active && { backgroundColor: COLORS.surface }]}>
                  <View style={st.themeGridLines}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <View key={i} style={st.themeGridLine} />
                    ))}
                  </View>
                </View>
                <Text style={[st.themeName, isLocked && st.themeNameLocked]}>{theme.name}</Text>
                <Text style={st.themeDesc}>{theme.desc}</Text>
                {isLocked && (
                  <View style={st.lockBadge}>
                    <Ionicons name="lock-closed" size={10} color={COLORS.accent} />
                    <Text style={st.lockText}>PREMIUM</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 20 },
  headerArea: { marginTop: 20, marginBottom: 20 },
  label: { color: COLORS.accent, fontSize: 11, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2 },
  heading: { color: COLORS.textPrimary, fontSize: 32, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', marginTop: 4 },
  activeThemeCard: { backgroundColor: COLORS.elevated, borderRadius: 14, overflow: 'hidden', position: 'relative', minHeight: 140 },
  activeThemeOverlay: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', flexDirection: 'row', gap: 6, opacity: 0.08, paddingTop: 10, paddingRight: 10 },
  activeThemeLine: { width: 2, flex: 1, backgroundColor: COLORS.accent },
  activeThemeContent: { padding: 20, zIndex: 1 },
  activeLabel: { color: COLORS.accent, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2 },
  activeTitle: { color: COLORS.textPrimary, fontSize: 22, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', marginTop: 6 },
  activeDesc: { color: COLORS.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 19, marginTop: 8 },
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 20 },
  themeCard: { width: '47%', backgroundColor: COLORS.elevated, borderRadius: 12, padding: 14, overflow: 'hidden', position: 'relative' },
  themeCardActive: {},
  themeCardLocked: { opacity: 0.5 },
  themePinstripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.accent },
  themePreview: { height: 60, backgroundColor: COLORS.surfaceLowest, borderRadius: 8, marginBottom: 10, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  themeGridLines: { flexDirection: 'row', gap: 6, opacity: 0.2 },
  themeGridLine: { width: 2, height: 40, backgroundColor: COLORS.textPrimary },
  themeName: { color: COLORS.textPrimary, fontSize: 13, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  themeNameLocked: { color: COLORS.textSecondary },
  themeDesc: { color: COLORS.textSecondary, fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  lockBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  lockText: { color: COLORS.accent, fontSize: 9, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
});
