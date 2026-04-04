import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

export default function SecondaryButton({ title, onPress, disabled, testID }: Props) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.4 },
  text: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
