import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/theme/colors';
import { useAuth } from '../src/storage/AuthContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const emailRef = useRef<TextInput>(null);

  const handleSave = () => {
    Keyboard.dismiss();
    updateProfile({ displayName: displayName.trim().toUpperCase(), email: email.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SafeAreaView style={st.container}>
      <KeyboardAvoidingView style={st.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={st.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={st.inner}>
              <TouchableOpacity onPress={() => router.back()} style={st.backBtn} activeOpacity={0.6}>
                <Ionicons name="arrow-back" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>

              <Text style={st.label}>IDENTITY</Text>
              <Text style={st.heading}>EDIT PROFILE</Text>

              {/* Avatar */}
              <View style={st.avatarArea}>
                <View style={st.avatarCircle}>
                  <Ionicons name="person" size={36} color={COLORS.textSecondary} />
                </View>
                <TouchableOpacity style={st.changeAvatarBtn} activeOpacity={0.6}>
                  <Text style={st.changeAvatarText}>Change Avatar</Text>
                </TouchableOpacity>
              </View>

              <View style={st.inputGroup}>
                <View style={[st.inputWrap, focusedField === 'name' && st.inputFocused]}>
                  {focusedField === 'name' && <View style={st.pinstripe} />}
                  <Text style={st.inputLabel}>DISPLAY NAME</Text>
                  <TextInput style={st.input} value={displayName} onChangeText={setDisplayName} placeholder="Your display name" placeholderTextColor={COLORS.textSecondary} autoCapitalize="none" onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()} maxLength={20} />
                </View>
                <View style={[st.inputWrap, focusedField === 'email' && st.inputFocused]}>
                  {focusedField === 'email' && <View style={st.pinstripe} />}
                  <Text style={st.inputLabel}>EMAIL</Text>
                  <TextInput ref={emailRef} style={st.input} value={email} onChangeText={setEmail} placeholder="your@email.com" placeholderTextColor={COLORS.textSecondary} keyboardType="email-address" autoCapitalize="none" onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} returnKeyType="done" onSubmitEditing={handleSave} />
                </View>
              </View>

              <TouchableOpacity style={st.saveBtn} onPress={handleSave} activeOpacity={0.85}>
                <Text style={st.saveBtnText}>{saved ? 'SAVED!' : 'SAVE CHANGES'}</Text>
              </TouchableOpacity>
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
  inner: { flex: 1, paddingHorizontal: 24 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', marginTop: 8 },
  label: { color: COLORS.accent, fontSize: 11, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 2 },
  heading: { color: COLORS.textPrimary, fontSize: 32, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', marginTop: 4, marginBottom: 24 },
  avatarArea: { alignItems: 'center', marginBottom: 32 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.elevated, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  changeAvatarBtn: { paddingVertical: 6 },
  changeAvatarText: { color: COLORS.accent, fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  inputGroup: { gap: 12 },
  inputWrap: { backgroundColor: COLORS.elevated, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, overflow: 'hidden', position: 'relative' },
  inputFocused: { backgroundColor: COLORS.surfaceElevated },
  pinstripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.accent },
  inputLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Inter_700Bold', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  input: { color: COLORS.textPrimary, fontSize: 16, fontFamily: 'Inter_600SemiBold', fontWeight: '600', padding: 0 },
  saveBtn: { backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginTop: 32 },
  saveBtnText: { color: COLORS.background, fontSize: 15, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', letterSpacing: 1 },
});
