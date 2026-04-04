import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/colors';

export default function ResetEmailSentScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  return (
    <SafeAreaView style={st.container}>
      <View style={st.inner}>
        <View style={st.content}>
          <View style={st.iconCircle}>
            <Ionicons name="mail-outline" size={40} color={COLORS.accent} />
          </View>
          <Text style={st.heading}>CHECK YOUR{`\n`}EMAIL</Text>
          <Text style={st.subheading}>
            We've sent password reset instructions to{`\n`}
            <Text style={st.emailHighlight}>{email || 'your email'}</Text>
          </Text>
          <TouchableOpacity
            style={st.primaryBtn}
            onPress={() => router.push('/reset-password' as never)}
            activeOpacity={0.85}
          >
            <Text style={st.primaryBtnText}>ENTER RESET CODE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/login' as never)} style={st.ghostBtn} activeOpacity={0.6}>
            <Text style={st.ghostText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  content: { alignItems: 'center' },
  iconCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.accentAlpha15, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  heading: { color: COLORS.textPrimary, fontSize: 32, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', lineHeight: 38, textAlign: 'center' },
  subheading: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20, marginTop: 12, textAlign: 'center' },
  emailHighlight: { color: COLORS.textPrimary, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  primaryBtn: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginTop: 32, width: '100%' },
  primaryBtnText: { color: COLORS.background, fontSize: 15, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  ghostBtn: { marginTop: 16, paddingVertical: 12 },
  ghostText: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
});
