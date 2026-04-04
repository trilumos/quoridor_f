import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

interface WallIconProps {
  total?: number;
  remaining: number;
}

export default function WallIcon({ total = 10, remaining }: WallIconProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.wall,
            {
              backgroundColor:
                i < remaining ? COLORS.wallAvailable : COLORS.wallUsed,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  wall: {
    width: 3,
    height: 14,
    borderRadius: 1,
  },
});
