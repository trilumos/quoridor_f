import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

interface Props {
  text: string;
  color?: string;
}

export default function SectionLabel({ text, color }: Props) {
  return (
    <Text testID={`section-${text}`} style={[styles.label, color ? { color } : null]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
