import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/colors';
import { useGameContext } from '../src/storage/GameContext';

const FEATURES = [
  { icon: 'hardware-chip-outline', label: 'Grandmaster AI', desc: 'The ultimate strategic challenge.' },
  { icon: 'color-palette-outline', label: 'All Themes', desc: 'Exclusive board skins and materials.' },
  { icon: 'ban-outline', label: 'Ad-free', desc: 'Zero interruptions. Pure strategy.' },
];

export default function PaywallScreen() {
  const router = useRouter();
  const { setPremium } = useGameContext();
  const pressedRef = useRef(false);

  const handlePurchase = () => {
    if (pressedRef.current) return;
    pressedRef.current = true;
    setPremium(true);
    setTimeout(() => {
      pressedRef.current = false;
      router.back();
    }, 300);
  };

  return (
    <SafeAreaView style={st.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
        <View style={st.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6} style={st.closeBtn}>
            <Ionicons name="close" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={st.badge}>
          <Text style={st.badgeText}>ELITE MEMBERSHIP</Text>
        </View>

        <Text style={st.title}>GRANDMASTER{`\n`}PASS</Text>
        <Text style={st.subtitle}>
          Unlock the full strategic arsenal. Advanced AI, exclusive board skins, deep game analysis, and an ad-free command center.
        </Text>

        <View style={st.features}>
          {FEATURES.map((f, i) => (
            <View key={i} style={st.featureCard}>
              <View style={st.featureIcon}>
                <Ionicons name={f.icon as any} size={20} color={COLORS.accent} />
              </View>
              <Text style={st.featureLabel}>{f.label}</Text>
              <Text style={st.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        <View style={st.planCardHighlight}>
          <View style={st.bestValueBadge}>
            <Text style={st.bestValueText}>BEST VALUE</Text>
          </View>
          <Text style={st.planTitle}>ANNUAL PASS</Text>
          <View style={st.priceRow}>
            <Text style={st.priceMain}>$49.99</Text>
            <Text style={st.pricePer}>/year</Text>
          </View>
          <Text style={st.planDesc}>Billed annually. That's just $4.17/mo.</Text>
          <TouchableOpacity style={st.unlockBtn} onPress={handlePurchase} activeOpacity={0.85}>
            <Text style={st.unlockBtnText}>UNLOCK NOW</Text>
          </TouchableOpacity>
        </View>

        <View style={st.planCard}>
          <Text style={st.planTitle}>MONTHLY PASS</Text>
          <View style={st.priceRow}>
            <Text style={st.priceMain}>$6.99</Text>
            <Text style={st.pricePer}>/month</Text>
          </View>
          <Text style={st.planDesc}>Cancel anytime. No commitments.</Text>
          <TouchableOpacity style={st.monthlyBtn} onPress={handlePurchase} activeOpacity={0.85}>
            <Text style={st.monthlyBtnText}>START MONTHLY</Text>
          </TouchableOpacity>
        </View>

        <Text style={st.legalText}>
          Payment will be charged to your account at confirmation. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
        </Text>
        <View style={st.legalLinks}>
          <TouchableOpacity><Text style={st.legalLink}>TERMS OF SERVICE</Text></TouchableOpacity>
          <Text style={st.legalSep}>|</Text>
          <TouchableOpacity><Text style={st.legalLink}>PRIVACY POLICY</Text></TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 12 },
  closeBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  badge: { backgroundColor: COLORS.accentAlpha15, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  badgeText: { color: COLORS.accent, fontSize: 10, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 2 },
  title: { color: COLORS.textPrimary, fontSize: 36, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', lineHeight: 42, marginTop: 12 },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20, marginTop: 12 },
  features: { flexDirection: 'row', gap: 10, marginTop: 24 },
  featureCard: { flex: 1, backgroundColor: COLORS.elevated, borderRadius: 12, padding: 14, alignItems: 'center' },
  featureIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.accentAlpha15, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  featureLabel: { color: COLORS.textPrimary, fontSize: 12, fontFamily: 'Inter_700Bold', fontWeight: '700', textAlign: 'center' },
  featureDesc: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 4, lineHeight: 14 },
  planCardHighlight: { backgroundColor: COLORS.elevated, borderRadius: 14, padding: 20, marginTop: 24, position: 'relative', overflow: 'hidden' },
  bestValueBadge: { position: 'absolute', top: 14, right: 14, backgroundColor: COLORS.accent, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  bestValueText: { color: COLORS.background, fontSize: 9, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  planCard: { backgroundColor: COLORS.elevated, borderRadius: 14, padding: 20, marginTop: 12 },
  planTitle: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 6 },
  priceMain: { color: COLORS.textPrimary, fontSize: 32, fontFamily: 'Inter_800ExtraBold', fontWeight: '800' },
  pricePer: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular', marginLeft: 4 },
  planDesc: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 4 },
  unlockBtn: { backgroundColor: COLORS.accent, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 18 },
  unlockBtnText: { color: COLORS.background, fontSize: 14, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  monthlyBtn: { backgroundColor: COLORS.secondaryBg, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 18 },
  monthlyBtnText: { color: COLORS.textPrimary, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  legalText: { color: COLORS.textSecondary, fontSize: 11, fontFamily: 'Inter_400Regular', lineHeight: 16, textAlign: 'center', marginTop: 24 },
  legalLinks: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12 },
  legalLink: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  legalSep: { color: COLORS.textSecondary, fontSize: 10 },
});
