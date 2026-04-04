import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/theme/colors';
import { useAuth } from '../src/storage/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const tagFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
      Animated.timing(tagFade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(tabs)' as never);
        } else {
          router.replace('/login' as never);
        }
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated]);

  return (
    <View testID="splash-screen" style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoGrid}>
            <View style={[styles.logoCell, { backgroundColor: COLORS.player1 }]} />
            <View style={[styles.logoCellEmpty, { borderColor: COLORS.gridLine }]} />
            <View style={[styles.logoCellEmpty, { borderColor: COLORS.gridLine }]} />
            <View style={[styles.logoCell, { backgroundColor: COLORS.player2 }]} />
          </View>
          <View style={styles.logoWallH} />
          <View style={styles.logoWallV} />
        </View>
        <Text style={styles.title}>QUORIDOR</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: tagFade }]}>
        THINK IN WALLS.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { alignItems: 'center' },
  logoContainer: { width: 80, height: 80, marginBottom: 20, position: 'relative' },
  logoGrid: { width: 80, height: 80, flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', alignItems: 'center' },
  logoCell: { width: 34, height: 34, borderRadius: 6 },
  logoCellEmpty: { width: 34, height: 34, borderRadius: 6, borderWidth: 2 },
  logoWallH: { position: 'absolute', top: 35, left: 5, width: 70, height: 4, backgroundColor: COLORS.wallPlaced, borderRadius: 2 },
  logoWallV: { position: 'absolute', top: 5, left: 38, width: 4, height: 70, backgroundColor: COLORS.wallPlaced, borderRadius: 2 },
  title: { fontSize: 42, fontFamily: 'Inter_800ExtraBold', fontWeight: '800', color: COLORS.accent, letterSpacing: 6 },
  tagline: { fontSize: 11, color: COLORS.textSecondary, letterSpacing: 1.1, marginTop: 8, fontFamily: 'Inter_700Bold', fontWeight: '700', textTransform: 'uppercase' },
});
