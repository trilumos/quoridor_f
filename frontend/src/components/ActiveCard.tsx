import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../theme/colors';

interface ActiveCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export default function ActiveCard({ children, style, testID }: ActiveCardProps) {
  return (
    <View testID={testID} style={[styles.card, style]}>
      <View style={styles.pinstripe} />
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.elevated,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    overflow: 'hidden',
    position: 'relative',
  },
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
