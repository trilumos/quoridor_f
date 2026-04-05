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

export default function LoginScreen() {
  const router = useRouter();
  const { login, signInWithGoogle, googleAuthRequest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const passwordRef = useRef<TextInput>(null);
  const pressedRef = useRef(false);

  const handleLogin = async () => {
    if (pressedRef.current) return;
    pressedRef.current = true;
    Keyboard.dismiss();
    setError('');
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    pressedRef.current = false;
    if (result.success) {
      router.replace('/(tabs)' as never);
    } else {
      setError(result.error || 'Login failed');
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
    // If success, onAuthStateChange will navigate
  };

  return (
    <SafeAreaView style={st.container}>
      <KeyboardAvoidingView style={st.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={st.inner}>
            {/* Logo */}
            <View style={st.logoArea}>
              <View style={st.gridIcon}>
                <View style={st.gridDot} /><View style={st.gridDot} />
                <View style={st.gridDot} /><View style={st.gridDot} />
              </View>
              <Text style={st.logoText}>QUORIDOR</Text>
            </View>

            <View style={st.formArea}>
              <Text style={st.heading}>WELCOME{'\n'}BACK</Text>
              <Text style={st.subheading}>Sign in to continue your journey</Text>

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
                <View style={[st.inputWrap, focusedField === 'email' && st.inputFocused]}>
                  {focusedField === 'email' && <View style={st.pinstripe} />}
                  <Text style={st.inputLabel}>EMAIL</Text>
                  <TextInput
                    style={st.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />
                </View>

                <View style={[st.inputWrap, focusedField === 'password' && st.inputFocused]}>
                  {focusedField === 'password' && <View style={st.pinstripe} />}
                  <Text style={st.inputLabel}>PASSWORD</Text>
                  <TextInput
                    ref={passwordRef}
                    style={st.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor={COLORS.textSecondary}
                    secureTextEntry
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                </View>
              </View>

              <TouchableOpacity onPress={() => router.push('/forgot-password' as never)} activeOpacity={0.6} style={st.forgotBtn}>
                <Text style={st.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[st.primaryBtn, loading && st.primaryBtnDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.background} />
                ) : (
                  <Text style={st.primaryBtnText}>SIGN IN</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={st.bottomRow}>
              <Text style={st.bottomText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup' as never)} activeOpacity={0.6}>
                <Text style={st.bottomLink}>Sign Up</Text>
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
  inner: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  logoArea: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 16 },
  gridIcon: { width: 20, height: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  gridDot: { width: 8, height: 8, borderRadius: 1.5, backgroundColor: COLORS.accent },
  logoText: { color: COLORS.textPrimary, fontSize: 16, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 3 },
  formArea: { flex: 1, justifyContent: 'center' },
  heading: { color: COLORS.textPrimary, fontSize: 36, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', lineHeight: 42 },
  subheading: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 8, marginBottom: 24 },
  errorText: { color: COLORS.error, fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginBottom: 16 },
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
  forgotBtn: { alignSelf: 'flex-end', marginTop: 12, paddingVertical: 4 },
  forgotText: { color: COLORS.accent, fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  primaryBtn: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginTop: 20 },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: COLORS.background, fontSize: 15, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 24, alignItems: 'center' },
  bottomText: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular' },
  bottomLink: { color: COLORS.accent, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700' },
});
