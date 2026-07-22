import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDecay,
  withTiming,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../context/ThemeContext';
import { getLocalYYYYMMDD } from '../utils/date';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const SCREEN_WIDTH = Dimensions.get('window').width;

const DAY_RANGE = 365;
const UPDATE_DEBOUNCE_MS = 100;

// How many ticks to render beyond the visible edges (buffer on each side)
const BUFFER_TICKS = 10;

export interface DateRulerV2Props {
  selectedDate: string;
  onSelectDate: (d: string) => void;
  tickSpacing?: number;
  tickHeight?: number;
  tickTallHeight?: number;
  tickThickness?: number;
  showResetToToday?: boolean;
}

// Memoized single tick to avoid re-renders of unchanged ticks
const Tick = React.memo(function Tick({
  offset,
  isFriday,
  isToday,
  dateStr,
  tickSpacing,
  tickHeight,
  tickTallHeight,
  tickThickness,
  tickColor,
  labelColor,
  accentColor,
}: {
  offset: number;
  isFriday: boolean;
  isToday: boolean;
  dateStr: string;
  tickSpacing: number;
  tickHeight: number;
  tickTallHeight: number;
  tickThickness: number;
  tickColor: string;
  labelColor: string;
  accentColor: string;
}) {
  return (
    <View
      style={[
        styles.tickContainer,
        {
          width: tickSpacing,
          // Position absolutely within the strip based on offset from center
          position: 'absolute',
          left: offset * tickSpacing - tickSpacing / 2,
        },
      ]}
    >
      {isFriday && (
        <Text style={[styles.tickLabel, { color: labelColor }]}>{dateStr}</Text>
      )}
      {isToday && (
        <View style={[styles.todayDot, { backgroundColor: accentColor }]} />
      )}
      <View
        style={{
          backgroundColor: tickColor,
          width: tickThickness,
          height: isFriday ? tickTallHeight : tickHeight,
          borderRadius: tickThickness / 2,
        }}
      />
    </View>
  );
});

export function DateRulerV2({
  selectedDate,
  onSelectDate,
  tickSpacing = 24,
  tickHeight = 12,
  tickTallHeight = 24,
  tickThickness = 4,
  showResetToToday = false,
}: DateRulerV2Props) {
  const { colors } = useTheme();

  // Compute today at midnight — stable across the component lifetime
  const todayTime = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const initialOffsetDays = useMemo(() => {
    const d = new Date(selectedDate);
    d.setHours(0, 0, 0, 0);
    return Math.round((d.getTime() - todayTime) / MS_PER_DAY);
  }, []);  // Only compute once on mount

  // How many ticks fit on half the screen
  const halfVisible = Math.ceil(SCREEN_WIDTH / 2 / tickSpacing);
  const windowSize = halfVisible + BUFFER_TICKS;

  // Shared values for the UI-thread gesture
  const translateX = useSharedValue(-initialOffsetDays * tickSpacing);
  const contextX = useSharedValue(0);
  const previousIndex = useSharedValue(-initialOffsetDays);

  // JS-thread state for display
  const [displayDateStr, setDisplayDateStr] = useState(selectedDate);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Which center tick index the window is built around (JS-thread)
  const [windowCenter, setWindowCenter] = useState(-initialOffsetDays);

  // Compute visible tick offsets based on the current window center
  const visibleTicks = useMemo(() => {
    const ticks: Array<{
      offset: number;
      isFriday: boolean;
      isToday: boolean;
      dateStr: string;
    }> = [];

    const start = Math.max(windowCenter - windowSize, -DAY_RANGE);
    const end = Math.min(windowCenter + windowSize, DAY_RANGE);

    for (let i = start; i <= end; i++) {
      const d = new Date(todayTime + i * MS_PER_DAY);
      ticks.push({
        offset: i,
        isFriday: d.getDay() === 5,
        isToday: i === 0,
        dateStr: d.getDate().toString(),
      });
    }
    return ticks;
  }, [windowCenter, windowSize, todayTime]);

  const fireHaptic = useCallback(() => {
    if (Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.selectionAsync();
    }
  }, []);

  // Max catch-up haptics per frame — beyond this the swipe is so fast
  // individual ticks are imperceptible anyway
  const MAX_CATCHUP_HAPTICS = 6;
  // Interval between catch-up haptics (ms) — just enough for the motor to reset
  const HAPTIC_INTERVAL_MS = 12;

  // Called from the UI thread via scheduleOnRN when the tick index changes
  const onTickChanged = useCallback(
    (index: number, ticksSkipped: number) => {
      // Fire haptic for the current tick immediately
      fireHaptic();

      // Fire catch-up haptics for any ticks we jumped over
      const catchups = Math.min(ticksSkipped - 1, MAX_CATCHUP_HAPTICS - 1);
      for (let i = 1; i <= catchups; i++) {
        setTimeout(fireHaptic, i * HAPTIC_INTERVAL_MS);
      }

      // Update display date (lightweight — just a local state set)
      const d = new Date(todayTime + index * MS_PER_DAY);
      const dateStr = getLocalYYYYMMDD(d);
      setDisplayDateStr(dateStr);

      // Shift window center if the user has scrolled far enough
      setWindowCenter(index);

      // Debounce the heavy onSelectDate callback
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onSelectDate(dateStr);
      }, UPDATE_DEBOUNCE_MS);
    },
    [todayTime, onSelectDate, fireHaptic],
  );

  const handleSelectDate = useCallback(
    (index: number) => {
      const d = new Date(todayTime + index * MS_PER_DAY);
      const dateStr = getLocalYYYYMMDD(d);
      setDisplayDateStr(dateStr);
      setWindowCenter(index);
      onSelectDate(dateStr);
    },
    [todayTime, onSelectDate],
  );

  // UI-thread reaction: fires every frame the tick index changes
  useAnimatedReaction(
    () => Math.round(-translateX.value / tickSpacing),
    (index, prev) => {
      if (index !== prev && index >= -DAY_RANGE && index <= DAY_RANGE) {
        const ticksSkipped = prev !== null ? Math.abs(index - prev) : 1;
        previousIndex.value = index;
        scheduleOnRN(onTickChanged, index, ticksSkipped);
      }
    },
    [tickSpacing],
  );

  // Pan gesture with decay + snap
  const pan = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
    })
    .onUpdate((event) => {
      translateX.value = contextX.value + event.translationX;
    })
    .onEnd((event) => {
      translateX.value = withDecay(
        {
          velocity: event.velocityX,
          deceleration: 0.99,
        },
        (finished) => {
          if (finished) {
            const snappedIndex = Math.round(translateX.value / tickSpacing);
            const snappedX = snappedIndex * tickSpacing;
            translateX.value = withTiming(snappedX, { duration: 150 }, (done) => {
              if (done) {
                const index = Math.round(-snappedX / tickSpacing);
                scheduleOnRN(handleSelectDate, index);
              }
            });
          }
        },
      );
    });

  // Animated transform for the tick strip
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Header display
  const displayFormat = new Date(displayDateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const displayYear = new Date(displayDateStr).getFullYear();
  const currentYear = new Date().getFullYear();
  const showYear = displayYear !== currentYear;
  const isTodaySelected = displayDateStr === getLocalYYYYMMDD(new Date(todayTime));

  const handleResetToToday = useCallback(() => {
    translateX.value = withTiming(0, { duration: 300 });
    const todayStr = getLocalYYYYMMDD(new Date(todayTime));
    setDisplayDateStr(todayStr);
    setWindowCenter(0);
    onSelectDate(todayStr);
  }, [todayTime, onSelectDate]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.dateHeader}>
          {showYear && (
            <Text style={[styles.yearText, { color: colors.fgSecondary }]}>
              {displayYear}
            </Text>
          )}
          <Text style={[styles.dateText, { color: colors.fgPrimary }]}>
            {displayFormat}
          </Text>
        </View>

        {showResetToToday && !isTodaySelected && (
          <TouchableOpacity onPress={handleResetToToday} style={styles.resetBtn}>
            <Text style={[styles.resetText, { color: colors.accentPrimary }]}>
              Today
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <GestureDetector gesture={pan}>
        <View style={styles.rulerContainer}>
          <View
            style={[styles.centerIndicator, { backgroundColor: colors.accentPrimary }]}
          />

          <Animated.View style={[styles.ticksWrapper, animatedStyle]}>
            {visibleTicks.map((tick) => (
              <Tick
                key={tick.offset}
                offset={tick.offset}
                isFriday={tick.isFriday}
                isToday={tick.isToday}
                dateStr={tick.dateStr}
                tickSpacing={tickSpacing}
                tickHeight={tickHeight}
                tickTallHeight={tickTallHeight}
                tickThickness={tickThickness}
                tickColor={colors.cardBorder}
                labelColor={colors.fgSecondary}
                accentColor={colors.accentPrimary}
              />
            ))}
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
    height: 40,
  },
  dateHeader: {
    alignItems: 'center',
  },
  yearText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  resetBtn: {
    position: 'absolute',
    right: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rulerContainer: {
    height: 60,
    width: SCREEN_WIDTH,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  centerIndicator: {
    position: 'absolute',
    width: 2,
    height: 40,
    zIndex: 10,
    bottom: 0,
  },
  ticksWrapper: {
    // No flexDirection: 'row' — children are absolutely positioned
    position: 'absolute',
    height: '100%',
    width: 0, // ticks positioned via absolute left offsets from center
    left: SCREEN_WIDTH / 2, // anchor point at screen center
  },
  tickContainer: {
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tickLabel: {
    fontSize: 10,
    position: 'absolute',
    top: 10,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 25,
  },
});
