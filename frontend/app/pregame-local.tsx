import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../src/theme/colors';
import TopBar from '../src/components/TopBar';
import SectionLabel from '../src/components/SectionLabel';
import PrimaryButton from '../src/components/PrimaryButton';

export default function PregameLocal() {
  const router = useRouter();
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [focusedInput, setFocusedInput] = useState<1 | 2 | null>(null);
  const input2Ref = useRef<TextInput>(null);

  const handleStart = () => {
    Keyboard.dismiss();
    router.push({
      pathname: '/game',
      params: {
        mode: 'local',
        p1Name: p1Name.trim() || 'Player 1',
        p2Name: p2Name.trim() || 'Player 2',
        p1Color: COLORS.player1,
        p2Color: COLORS.player2,
      },
    } as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar title="PASS & PLAY" showBack onBack={() => router.back()} />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.section}>
              <SectionLabel text="PLAYER NAMES" />
            </View>

            <View style={styles.inputGroup}>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 1 && styles.inputFocused,
                ]}
              >
                {focusedInput === 1 && <View style={styles.pinstripe} />}
                <Text style={styles.inputLabel}>PLAYER 1</Text>
                <TextInput
                  testID="p1-input"
                  style={styles.input}
                  value={p1Name}
                  onChangeText={setP1Name}
                  placeholder="Enter name"
                  placeholderTextColor={COLORS.textSecondary}
                  onFocus={() => setFocusedInput(1)}
                  onBlur={() => setFocusedInput(null)}
                  returnKeyType="next"
                  onSubmitEditing={() => input2Ref.current?.focus()}
                  maxLength={16}
                />
              </View>

              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 2 && styles.inputFocused,
                ]}
              >
                {focusedInput === 2 && <View style={styles.pinstripe} />}
                <Text style={styles.inputLabel}>PLAYER 2</Text>
                <TextInput
                  ref={input2Ref}
                  testID="p2-input"
                  style={styles.input}
                  value={p2Name}
                  onChangeText={setP2Name}
                  placeholder="Enter name"
                  placeholderTextColor={COLORS.textSecondary}
                  onFocus={() => setFocusedInput(2)}
                  onBlur={() => setFocusedInput(null)}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  maxLength={16}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <PrimaryButton
          testID="start-local-btn"
          title="START GAME"
          onPress={handleStart}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  inputGroup: {
    gap: 12,
  },
  inputWrapper: {
    backgroundColor: COLORS.elevated,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  inputFocused: {
    backgroundColor: COLORS.elevated,
  },
  pinstripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.accent,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    padding: 0,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
});
