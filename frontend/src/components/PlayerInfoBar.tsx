import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../theme/colors';
import WallIcon from './WallIcon';

interface PlayerInfoBarProps {
  player: { name: string; wallsRemaining: number };
  isActive: boolean;
  label?: string;
  testID?: string;
}

const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export default function PlayerInfoBar({
  player,
  isActive,
  label,
  testID,
}: PlayerInfoBarProps) {
  const pinstripeStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 1 : 0, {
      duration: 300,
      easing: EASING,
    }),
  }));

  const containerOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 1 : 0.6, {
      duration: 300,
      easing: EASING,
    }),
  }));

  return (
    <Animated.View
      testID={testID || `player-info-${player.name}`}
      style={[styles.container, containerOpacity]}
    >
      <Animated.View style={[styles.pinstripe, pinstripeStyle]} />
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.name} numberOfLines={1}>
            {player.name}
          </Text>
          {label ? <Text style={styles.label}>{label}</Text> : null}
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.wallsLabel}>WALLS REMAINING</Text>
          <WallIcon remaining={player.wallsRemaining} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.elevated,
    borderRadius: 12,
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  leftSection: {
    flex: 1,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 6,
  },
  wallsLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
