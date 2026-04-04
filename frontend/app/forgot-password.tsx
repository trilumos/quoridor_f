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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const pressedRef = useRef(false);

  const handleSubmit = async () => {
    if (pressedRef.current) return;
    pressedRef.current = true;
    Keyboard.dismiss();
    setError('');
    setLoading(true);
    const result = await requestPasswordReset(email.trim());
    setLoading(false);
    pressedRef.current = false;
    if (result.success) {
      router.push({ pathname: '/reset-email-sent', params: { email: email.trim() } } as never);
    } else {
      setError(result.error || 'Failed to send reset email');
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
              <Text style={st.heading}>RESET{`\n`}PASSWORD</Text>
              <Text style={st.subheading}>Enter your email and we'll send you instructions to reset your password.</Text>

              {error ? <Text style={st.errorText}>{error}</Text> : null}

              <View style={[st.inputWrap, focused && st.inputFocused]}>
                {focused && <View style={st.pinstripe} />}
                <Text style={st.inputLabel}>EMAIL</Text>
                <TextInput style={st.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={COLORS.textSecondary} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} returnKeyType="done" onSubmitEditing={handleSubmit} />
              </View>

              <TouchableOpacity style={[st.primaryBtn, loading && st.primaryBtnDisabled]} onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
                {loading ? <ActivityIndicator color={COLORS.background} /> : <Text style={st.primaryBtnText}>SEND RESET LINK</Text>}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.back()} style={st.bottomBtn} activeOpacity={0.6}>
              <Text style={st.bottomText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, justifyContent: 'center', marginTop: 8 },
  formArea: { flex: 1, justifyContent: 'center' },
  heading: { color: COLORS.textPrimary, fontSize: 36, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', lineHeight: 42 },
  subheading: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20, marginTop: 8, marginBottom: 32 },
  errorText: { color: COLORS.error, fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginBottom: 16 },
  inputWrap: { backgroundColor: COLORS.elevated, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, overflow: 'hidden', position: 'relative' },
  inputFocused: { backgroundColor: COLORS.surfaceElevated },
  pinstripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.accent },
  inputLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  input: { color: COLORS.textPrimary, fontSize: 16, fontFamily: 'Inter_600SemiBold', fontWeight: '600', padding: 0 },
  primaryBtn: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginTop: 24 },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: COLORS.background, fontSize: 15, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  bottomBtn: { alignItems: 'center', paddingBottom: 24, paddingTop: 16 },
  bottomText: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
});
