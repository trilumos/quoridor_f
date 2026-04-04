import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/colors';

export default function ResetSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={st.container}>
      <View style={st.inner}>
        <View style={st.content}>
          <View style={st.iconCircle}>
            <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
          </View>
          <Text style={st.heading}>PASSWORD{`\n`}UPDATED</Text>
          <Text style={st.subheading}>Your password has been reset successfully. You can now sign in with your new credentials.</Text>
          <TouchableOpacity
            style={st.primaryBtn}
            onPress={() => router.replace('/login' as never)}
            activeOpacity={0.85}
          >
            <Text style={st.primaryBtnText}>SIGN IN</Text>
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
  iconCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(34,197,94,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  heading: { color: COLORS.textPrimary, fontSize: 32, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', lineHeight: 38, textAlign: 'center' },
  subheading: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20, marginTop: 12, textAlign: 'center', paddingHorizontal: 16 },
  primaryBtn: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginTop: 32, width: '100%' },
  primaryBtnText: { color: COLORS.background, fontSize: 15, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
});
