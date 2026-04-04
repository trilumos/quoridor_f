import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../src/theme/colors';
import { useAuth } from '../src/storage/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
              <Text style={st.heading}>WELCOME{`\n`}BACK</Text>
              <Text style={st.subheading}>Sign in to continue your journey</Text>

              {error ? <Text style={st.errorText}>{error}</Text> : null}

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
  subheading: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 8, marginBottom: 32 },
  errorText: { color: COLORS.error, fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginBottom: 16 },
  inputGroup: { gap: 12 },
  inputWrap: { backgroundColor: COLORS.elevated, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, overflow: 'hidden', position: 'relative' },
  inputFocused: { backgroundColor: COLORS.surfaceElevated },
  pinstripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.accent },
  inputLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  input: { color: COLORS.textPrimary, fontSize: 16, fontFamily: 'Inter_600SemiBold', fontWeight: '600', padding: 0 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 12, paddingVertical: 4 },
  forgotText: { color: COLORS.accent, fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  primaryBtn: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginTop: 24 },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: COLORS.background, fontSize: 15, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 24, alignItems: 'center' },
  bottomText: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular' },
  bottomLink: { color: COLORS.accent, fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700' },
});
