import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/colors';
import { useAuth } from '../src/storage/AuthContext';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const confirmRef = useRef<TextInput>(null);
  const pressedRef = useRef(false);

  const getStrength = (): { label: string; color: string; width: string } => {
    if (newPassword.length === 0) return { label: '', color: COLORS.textSecondary, width: '0%' };
    if (newPassword.length < 6) return { label: 'WEAK', color: COLORS.error, width: '25%' };
    if (newPassword.length < 10) return { label: 'MODERATE', color: COLORS.warning, width: '60%' };
    return { label: 'STRONG', color: COLORS.success, width: '100%' };
  };
  const strength = getStrength();

  const handleReset = async () => {
    if (pressedRef.current) return;
    pressedRef.current = true;
    Keyboard.dismiss();
    setError('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); pressedRef.current = false; return; }
    setLoading(true);
    const result = await resetPassword(newPassword);
    setLoading(false);
    pressedRef.current = false;
    if (result.success) {
      router.replace('/reset-success' as never);
    } else {
      setError(result.error || 'Reset failed');
    }
  };

  return (
    <SafeAreaView style={st.container}>
      <KeyboardAvoidingView style={st.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={st.inner}>
            <TouchableOpacity onPress={() => router.back()} style={st.backBtn} activeOpacity={0.6}>
              <Ionicons name="arrow-back" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <View style={st.formArea}>
              <Text style={st.heading}>NEW{`\n`}PASSWORD</Text>
              <Text style={st.subheading}>Create a strong password for your account.</Text>
              {error ? <Text style={st.errorText}>{error}</Text> : null}
              <View style={st.inputGroup}>
                <View style={[st.inputWrap, focusedField === 'new' && st.inputFocused]}>
                  {focusedField === 'new' && <View style={st.pinstripe} />}
                  <Text style={st.inputLabel}>NEW PASSWORD</Text>
                  <TextInput style={st.input} value={newPassword} onChangeText={setNewPassword} placeholder="Min. 6 characters" placeholderTextColor={COLORS.textSecondary} secureTextEntry onFocus={() => setFocusedField('new')} onBlur={() => setFocusedField(null)} returnKeyType="next" onSubmitEditing={() => confirmRef.current?.focus()} />
                </View>
                {newPassword.length > 0 && (
                  <View style={st.strengthRow}>
                    <View style={st.strengthTrack}><View style={[st.strengthFill, { width: strength.width as any, backgroundColor: strength.color }]} /></View>
                    <Text style={[st.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
                  </View>
                )}
                <View style={[st.inputWrap, focusedField === 'confirm' && st.inputFocused]}>
                  {focusedField === 'confirm' && <View style={st.pinstripe} />}
                  <Text style={st.inputLabel}>CONFIRM PASSWORD</Text>
                  <TextInput ref={confirmRef} style={st.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter password" placeholderTextColor={COLORS.textSecondary} secureTextEntry onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField(null)} returnKeyType="done" onSubmitEditing={handleReset} />
                </View>
              </View>
              <TouchableOpacity style={[st.primaryBtn, loading && st.primaryBtnDisabled]} onPress={handleReset} disabled={loading} activeOpacity={0.85}>
                {loading ? <ActivityIndicator color={COLORS.background} /> : <Text style={st.primaryBtnText}>RESET PASSWORD</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 24 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', marginTop: 8 },
  formArea: { flex: 1, justifyContent: 'center' },
  heading: { color: COLORS.textPrimary, fontSize: 36, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', lineHeight: 42 },
  subheading: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20, marginTop: 8, marginBottom: 32 },
  errorText: { color: COLORS.error, fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginBottom: 16 },
  inputGroup: { gap: 12 },
  inputWrap: { backgroundColor: COLORS.elevated, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, overflow: 'hidden', position: 'relative' },
  inputFocused: { backgroundColor: COLORS.surfaceElevated },
  pinstripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.accent },
  inputLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  input: { color: COLORS.textPrimary, fontSize: 16, fontFamily: 'Inter_600SemiBold', fontWeight: '600', padding: 0 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  strengthTrack: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 1.5 },
  strengthFill: { height: 3, borderRadius: 1.5 },
  strengthLabel: { fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1 },
  primaryBtn: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginTop: 24 },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: COLORS.background, fontSize: 15, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
});
