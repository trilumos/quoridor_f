import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
  color?: string;
}

export default function GhostButton({ title, onPress, disabled, testID, color }: Props) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.6}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={[styles.text, color ? { color } : null]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.35 },
  text: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
