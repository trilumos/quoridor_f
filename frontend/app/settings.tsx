import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/colors';
import { useGameContext } from '../src/storage/GameContext';
import { useAuth } from '../src/storage/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings, isPremium } = useGameContext();
  const { user, logout } = useAuth();
  const [contrastOn, setContrastOn] = useState(settings.highContrast ?? false);

  const handleLogout = () => {
    logout();
    router.replace('/login' as never);
  };

  return (
    <SafeAreaView style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={st.backBtn} activeOpacity={0.6}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <Text style={st.pageTitle}>SETTINGS</Text>
        <Text style={st.pageSubtitle}>CONFIGURATION INTERFACE</Text>

        <Text style={st.sectionLabel}>ACCOUNT</Text>
        <View style={st.card}>
          <TouchableOpacity style={st.settingsRow} activeOpacity={0.6} onPress={() => router.push('/edit-profile' as never)}>
            <View style={st.avatarCircle}>
              <Ionicons name="person" size={22} color={COLORS.textSecondary} />
            </View>
            <View style={st.rowInfo}>
              <Text style={st.rowTitle}>{user?.displayName || 'Commander'}</Text>
              <Text style={st.rowSub}>View and edit profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={st.card}>
          <TouchableOpacity style={st.settingsRow} activeOpacity={0.6} onPress={() => router.push(isPremium ? '/subscription' as never : '/paywall' as never)}>
            <View style={[st.iconCircle, { backgroundColor: COLORS.accentAlpha15 }]}>
              <Ionicons name="diamond-outline" size={18} color={COLORS.accent} />
            </View>
            <View style={st.rowInfo}>
              <Text style={st.rowTitle}>Premium Membership</Text>
              <Text style={st.rowSub}>{isPremium ? 'Active • Grandmaster Pass' : 'Upgrade to Premium'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={st.sectionLabel}>PREFERENCES</Text>
        <View style={st.card}>
          <View style={st.settingsRow}>
            <View style={st.iconCircle}>
              <Ionicons name="volume-high-outline" size={18} color={COLORS.textPrimary} />
            </View>
            <View style={st.rowInfo}>
              <Text style={st.rowTitle}>Sound Effects</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(v) => updateSettings({ soundEnabled: v })}
              trackColor={{ false: 'rgba(255,255,255,0.08)', true: COLORS.accent }}
              thumbColor={Platform.OS === 'android' ? COLORS.textPrimary : undefined}
            />
          </View>
        </View>
        <View style={st.card}>
          <View style={st.settingsRow}>
            <View style={st.iconCircle}>
              <Ionicons name="phone-portrait-outline" size={18} color={COLORS.textPrimary} />
            </View>
            <View style={st.rowInfo}>
              <Text style={st.rowTitle}>Haptic Feedback</Text>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(v) => updateSettings({ hapticsEnabled: v })}
              trackColor={{ false: 'rgba(255,255,255,0.08)', true: COLORS.accent }}
              thumbColor={Platform.OS === 'android' ? COLORS.textPrimary : undefined}
            />
          </View>
        </View>
        <View style={st.card}>
          <View style={st.settingsRow}>
            <View style={st.iconCircle}>
              <Ionicons name="moon-outline" size={18} color={COLORS.textPrimary} />
            </View>
            <View style={st.rowInfo}>
              <Text style={st.rowTitle}>High Contrast UI</Text>
            </View>
            <Switch
              value={contrastOn}
              onValueChange={(v) => { setContrastOn(v); updateSettings({ highContrast: v }); }}
              trackColor={{ false: 'rgba(255,255,255,0.08)', true: COLORS.accent }}
              thumbColor={Platform.OS === 'android' ? COLORS.textPrimary : undefined}
            />
          </View>
        </View>

        <Text style={st.sectionLabel}>ABOUT</Text>
        <View style={st.card}>
          <TouchableOpacity style={st.settingsRow} activeOpacity={0.6}>
            <View style={st.rowInfo}><Text style={st.rowTitle}>Privacy Policy</Text></View>
            <Ionicons name="open-outline" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={st.card}>
          <TouchableOpacity style={st.settingsRow} activeOpacity={0.6}>
            <View style={st.rowInfo}><Text style={st.rowTitle}>Terms of Service</Text></View>
            <Ionicons name="open-outline" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={st.card}>
          <View style={st.settingsRow}>
            <View style={st.rowInfo}><Text style={st.rowTitle}>Version</Text></View>
            <Text style={st.versionText}>2.4.0 (Gold)</Text>
          </View>
        </View>

        <TouchableOpacity style={st.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={st.logoutText}>LOG OUT</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', marginTop: 8 },
  pageTitle: { color: COLORS.textPrimary, fontSize: 34, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', marginTop: 4 },
  pageSubtitle: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2, marginTop: 4 },
  sectionLabel: { color: COLORS.accent, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2, marginTop: 28, marginBottom: 10 },
  card: { backgroundColor: COLORS.elevated, borderRadius: 12, marginBottom: 8, overflow: 'hidden' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  avatarCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center' },
  rowInfo: { flex: 1 },
  rowTitle: { color: COLORS.textPrimary, fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  rowSub: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  versionText: { color: COLORS.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular' },
  logoutBtn: { backgroundColor: COLORS.secondaryBg, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 32 },
  logoutText: { color: COLORS.error, fontSize: 14, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1.5 },
});
