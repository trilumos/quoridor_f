import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../theme/colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  active?: boolean;
  testID?: string;
}

export default function Card({ children, style, active, testID }: Props) {
  return (
    <View testID={testID} style={[styles.card, active && styles.active, style]}>
      {active && <View style={styles.pinstripe} />}
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.elevated,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  active: {},
  pinstripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.accent,
    zIndex: 1,
  },
  inner: {
    padding: 16,
  },
});
