import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../theme/colors';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

export default function PrimaryButton({ title, onPress, disabled, testID }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.96,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.85}
        style={[styles.button, disabled && styles.disabled]}
      >
        <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textDisabled: {
    color: COLORS.background,
  },
});
