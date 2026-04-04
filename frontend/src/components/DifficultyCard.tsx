import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface Props {
  level: 'novice' | 'strategic' | 'grandmaster';
  label: string;
  description: string;
  selected: boolean;
  locked?: boolean;
  recommended?: boolean;
  onPress: () => void;
  testID?: string;
}

export default function DifficultyCard({ level, label, description, selected, locked, recommended, onPress, testID }: Props) {
  const iconName = level === 'novice' ? 'shield-outline' : level === 'strategic' ? 'flash-outline' : 'skull-outline';
  const iconColor = level === 'novice' ? '#22C55E' : level === 'strategic' ? COLORS.accent : '#EF4444';

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      activeOpacity={locked ? 0.5 : 0.7}
      style={[styles.card, selected && styles.cardSelected, locked && styles.cardLocked]}
    >
      {selected && <View style={styles.pinstripe} />}
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: iconColor + '18' }]}>
            {locked ? (
              <Ionicons name="lock-closed" size={20} color={COLORS.textSecondary} />
            ) : (
              <Ionicons name={iconName as any} size={20} color={iconColor} />
            )}
          </View>
          <View style={styles.labels}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, locked && styles.titleLocked]}>{label}</Text>
              {recommended && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>RECOMMENDED</Text>
                </View>
              )}
              {locked && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>PREMIUM</Text>
                </View>
              )}
            </View>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.elevated,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cardSelected: {},
  cardLocked: { opacity: 0.5 },
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labels: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  titleLocked: {
    color: COLORS.textSecondary,
  },
  badge: {
    backgroundColor: COLORS.accentAlpha15,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  premiumText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
});
