import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import {
  usePrayerTracker,
  PRAYER_NAMES,
  STATUS_META,
  DEBOUNCE_DELAY_MS,
  PrayerName,
} from '../hooks/usePrayerTracker';
import { useTheme } from '../context/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PRAYER_DISPLAY: Record<PrayerName, { name: string; emoji: string }> = {
  fajr: { name: 'Fajr', emoji: '🌅' },
  dhuhr: { name: 'Dhuhr', emoji: '☀️' },
  asr: { name: 'Asr', emoji: '🌤️' },
  maghrib: { name: 'Maghrib', emoji: '🌇' },
  isha: { name: 'Isha', emoji: '🌙' },
};

export function PrayerTrackerRadial({ selectedDate }: { selectedDate: string }) {
  const { prayers, cycleStatus, score, isSaving, debounceKey } = usePrayerTracker(selectedDate);
  const { colors } = useTheme();

  const radius = 120;
  const nodePositions = PRAYER_NAMES.map((_, i) => {
    const angle = (i * 360) / 5 - 90;
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius,
    };
  });

  const progressPercent = score.total > 0 ? (score.completed / score.total) * 100 : 0;
  const circumference = 2 * Math.PI * 90;
  
  const animatedProgress = useSharedValue(progressPercent);

  useEffect(() => {
    animatedProgress.value = withTiming(progressPercent, { duration: 500 });
  }, [progressPercent]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (animatedProgress.value / 100) * circumference;
    return {
      strokeDashoffset,
    };
  });

  const debounceProgress = useSharedValue(0);
  useEffect(() => {
    if (debounceKey !== 0) {
      debounceProgress.value = 0;
      debounceProgress.value = withTiming(100, { duration: DEBOUNCE_DELAY_MS });
    } else {
      debounceProgress.value = 0;
    }
  }, [debounceKey]);

  const debounceProps = useAnimatedProps(() => {
    const circ = 2 * Math.PI * 34;
    const offset = circ - (debounceProgress.value / 100) * circ;
    return {
      strokeDashoffset: offset,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg width={240} height={240} viewBox="0 0 240 240">
          <Defs>
            <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.accent1} />
              <Stop offset="50%" stopColor={colors.accent2} />
              <Stop offset="100%" stopColor={colors.accent1} />
            </LinearGradient>
          </Defs>
          <Circle
            cx="120"
            cy="120"
            r="90"
            stroke={colors.cardBorder}
            strokeWidth="3"
            fill="none"
          />
          <AnimatedCircle
            cx="120"
            cy="120"
            r="90"
            stroke="url(#progressGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            transform="rotate(-90 120 120)"
          />
        </Svg>
      </View>

      <View style={styles.centerBadge}>
        {isSaving ? (
          <ActivityIndicator color={colors.accentPrimary} size="large" />
        ) : (
          <>
            {debounceKey !== 0 && (
              <View style={StyleSheet.absoluteFill}>
                <Svg width={72} height={72} viewBox="0 0 72 72">
                  <Defs>
                    <LinearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor={colors.accent1} />
                      <Stop offset="50%" stopColor={colors.accent2} />
                      <Stop offset="100%" stopColor={colors.accent1} />
                    </LinearGradient>
                  </Defs>
                  <AnimatedCircle
                    cx="36"
                    cy="36"
                    r="34"
                    stroke="url(#timerGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 34}
                    animatedProps={debounceProps}
                    transform="rotate(-90 36 36)"
                  />
                </Svg>
              </View>
            )}
            <Text style={[styles.scoreText, { color: colors.fgPrimary }]}>
              {score.completed} <Text style={{ color: colors.fgMuted }}>/ {score.total}</Text>
            </Text>
          </>
        )}
      </View>

      <View style={styles.nodesContainer}>
        {PRAYER_NAMES.map((name, i) => {
          const pos = nodePositions[i];
          const status = prayers[name];
          const meta = STATUS_META[status];
          const display = PRAYER_DISPLAY[name];
          
          return (
            <TouchableOpacity
              key={name}
              style={[
                styles.node,
                {
                  transform: [{ translateX: pos.x }, { translateY: pos.y }],
                  borderColor: meta.color,
                  backgroundColor: colors.cardBg,
                  shadowColor: meta.color,
                }
              ]}
              onPress={() => cycleStatus(name)}
              disabled={isSaving}
            >
              <Text style={styles.nodeIcon}>{meta.icon}</Text>
              <Text style={[styles.nodeName, { color: colors.fgPrimary }]}>{display.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    position: 'absolute',
  },
  centerBadge: {
    position: 'absolute',
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 36,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nodesContainer: {
    position: 'absolute',
    width: 0,
    height: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  node: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    marginTop: -28,
    marginLeft: -28,
  },
  nodeIcon: {
    fontSize: 16,
  },
  nodeName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
});
