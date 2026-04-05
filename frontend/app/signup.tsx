import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/colors';
import { useAuth } from '../src/storage/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { signup, signInWithGoogle, googleAuthRequest } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);
  const pressedRef = useRef(false);

  const handleSignup = async () => {
    if (pressedRef.current) return;
    pressedRef.current = true;
    Keyboard.dismiss();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      pressedRef.current = false;
      return;
    }
    setLoading(true);
    const result = await signup(name.trim(), email.trim(), password);
    setLoading(false);
    pressedRef.current = false;
    if (result.success) {
      router.replace('/(tabs)' as never);
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading) return;
    setError('');
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    setGoogleLoading(false);
    if (!result.success && result.error && result.error !== 'Sign in cancelled') {
      setError(result.error);
    }
  };

  return (
    <SafeAreaView style={st.container}>
      <KeyboardAvoidingView style={st.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={st.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={st.inner}>
              <View style={st.logoArea}>
                <View style={st.gridIcon}>
                  <View style={st.gridDot} /><View style={st.gridDot} />
                  <View style={st.gridDot} /><View style={st.gridDot} />
                </View>
                <Text style={st.logoText}>QUORIDOR</Text>
              </View>

              <Text style={st.heading}>CREATE{'\n'}ACCOUNT</Text>
              <Text style={st.subheading}>Begin your strategic journey</Text>

              {error ? <Text style={st.errorText}>{error}</Text> : null}

              {/* Google Sign-In Button */}
              <TouchableOpacity
                style={st.googleBtn}
                onPress={handleGoogleSignIn}
                disabled={!googleAuthRequest || googleLoading}
                activeOpacity={0.85}
              >
                {googleLoading ? (
                  <ActivityIndicator color={COLORS.textPrimary} size="small" />
                ) : (
                  <>
                    <Ionicons name="logo-google" size={18} color={COLORS.textPrimary} />
                    <Text style={st.googleBtnText}>CONTINUE WITH GOOGLE</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={st.dividerRow}>
                <View style={st.dividerLine} />
                <Text style={st.dividerText}>OR</Text>
                <View style={st.dividerLine} />
              </View>

              <View style={st.inputGroup}>
                <View style={[st.inputWrap, focusedField === 'name' && st.inputFocused]}>
                  {focusedField === 'name' && <View style={st.pinstripe} />}
                  <Text style={st.inputLabel}>DISPLAY NAME</Text>
                  <TextInput style={st.input} value={name} onChangeText={setName} placeholder="Your username" placeholderTextColor={COLORS.textSecondary} autoCapitalize="none" onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()} maxLength={20} />
                </View>
                <View style={[st.inputWrap, focusedField === 'email' && st.inputFocused]}>
                  {focusedField === 'email' && <View style={st.pinstripe} />}
                  <Text style={st.inputLabel}>EMAIL</Text>
                  <TextInput ref={emailRef} style={st.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={COLORS.textSecondary} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()} />
                </View>
                <View style={[st.inputWrap, focusedField === 'password' && st.inputFocused]}>
                  {focusedField === 'password' && <View style={st.pinstripe} />}
                  <Text style={st.inputLabel}>PASSWORD</Text>
                  <TextInput ref={passwordRef} style={st.input} value={password} onChangeText={setPassword} placeholder="Min. 6 characters" placeholderTextColor={COLORS.textSecondary} secureTextEntry onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} returnKeyType="next" onSubmitEditing={() => confirmRef.current?.focus()} />
                </View>
                <View style={[st.inputWrap, focusedField === 'confirm' && st.inputFocused]}>
                  {focusedField === 'confirm' && <View style={st.pinstripe} />}
                  <Text style={st.inputLabel}>CONFIRM PASSWORD</Text>
                  <TextInput ref={confirmRef} style={st.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter password" placeholderTextColor={COLORS.textSecondary} secureTextEntry onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField(null)} returnKeyType="done" onSubmitEditing={handleSignup} />
                </View>
              </View>

              <TouchableOpacity style={[st.primaryBtn, loading && st.primaryBtnDisabled]} onPress={handleSignup} disabled={loading} activeOpacity={0.85}>
                {loading ? <ActivityIndicator color={COLORS.background} /> : <Text style={st.primaryBtnText}>CREATE ACCOUNT</Text>}
              </TouchableOpacity>

              <View style={st.bottomRow}>
                <Text style={st.bottomText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6}>
                  <Text style={st.bottomLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  inner: { flex: 1, paddingHorizontal: 24, paddingBottom: 24 },
  logoArea: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 16, marginBottom: 32 },
  gridIcon: { width: 20, height: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  gridDot: { width: 8, height: 8, borderRadius: 1.5, backgroundColor: COLORS.accent },
  logoText: { color: COLORS.textPrimary, fontSize: 16, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 3 },
  heading: { color: COLORS.textPrimary, fontSize: 36, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', lineHeight: 42 },
  subheading: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 8, marginBottom: 24 },
  errorText: { color: COLORS.error, fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginBottom: 12 },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: COLORS.elevated, borderRadius: 14, paddingVertical: 16, marginBottom: 4 },
  googleBtnText: { color: COLORS.textPrimary, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 0.5 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  dividerText: { color: COLORS.textSecondary, fontSize: 11, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1.5 },
  inputGroup: { gap: 12 },
  inputWrap: { backgroundColor: COLORS.elevated, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, overflow: 'hidden', position: 'relative' },
  inputFocused: { backgroundColor: COLORS.surfaceElevated },
  pinstripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.accent },
  inputLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  input: { color: COLORS.textPrimary, fontSize: 16, fontFamily: 'Inter_600SemiBold', fontWeight: '600', padding: 0 },
  primaryBtn: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginTop: 24 },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: COLORS.background, fontSize: 15, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', paddingTop: 24, alignItems: 'center' },
  bottomText: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular' },
  bottomLink: { color: COLORS.accent, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700' },
});
