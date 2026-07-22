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

// ── Haptic tuning constants ──────────────────────────────────────────────
// When the number of ticks crossed in a single frame exceeds this,
// switch from discrete per-tick haptics to continuous haptic buzz.
const FAST_SWIPE_TICK_THRESHOLD = 1;

// Interval (ms) between haptic pulses in fast/continuous mode.
// Lower = more intense buzz. ~20ms feels close to the iOS picker spin.
const CONTINUOUS_HAPTIC_INTERVAL_MS = 20;

export interface DateRulerV3Props {
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

export function DateRulerV3({
  selectedDate,
  onSelectDate,
  tickSpacing = 24,
  tickHeight = 12,
  tickTallHeight = 24,
  tickThickness = 4,
  showResetToToday = false,
}: DateRulerV3Props) {
  const { colors } = useTheme();

  const todayTime = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const initialOffsetDays = useMemo(() => {
    const d = new Date(selectedDate);
    d.setHours(0, 0, 0, 0);
    return Math.round((d.getTime() - todayTime) / MS_PER_DAY);
  }, []);

  const halfVisible = Math.ceil(SCREEN_WIDTH / 2 / tickSpacing);
  const windowSize = halfVisible + BUFFER_TICKS;

  const translateX = useSharedValue(-initialOffsetDays * tickSpacing);
  const contextX = useSharedValue(0);
  const previousIndex = useSharedValue(-initialOffsetDays);
  // Tracks current haptic mode on the UI thread so we only fire mode-switch
  // calls when actually transitioning (not every frame)
  const isFastMode = useSharedValue(false);

  const [displayDateStr, setDisplayDateStr] = useState(selectedDate);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [windowCenter, setWindowCenter] = useState(-initialOffsetDays);

  // ── Haptic interval ref (JS thread) ────────────────────────────────────
  const hapticIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // ── Haptic functions (JS thread) ───────────────────────────────────────

  /** Fire a single discrete haptic — used in slow mode */
  const fireDiscreteHaptic = useCallback(() => {
    if (Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.selectionAsync();
    }
  }, []);

  /** Start a continuous haptic buzz — used in fast mode */
  const startContinuousHaptic = useCallback(() => {
    // Already running — don't double-start
    if (hapticIntervalRef.current) return;

    // Fire one immediately so the transition isn't silent
    if (Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    hapticIntervalRef.current = setInterval(() => {
      if (Platform.OS === 'android') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }, CONTINUOUS_HAPTIC_INTERVAL_MS);
  }, []);

  /** Stop the continuous haptic buzz */
  const stopContinuousHaptic = useCallback(() => {
    if (hapticIntervalRef.current) {
      clearInterval(hapticIntervalRef.current);
      hapticIntervalRef.current = null;
    }
  }, []);

  // ── Tick change callbacks (called from UI thread via scheduleOnRN) ─────

  /** Called on every tick crossing — updates date display + manages haptic mode */
  const onTickChanged = useCallback(
    (index: number, enteringFastMode: boolean) => {
      if (enteringFastMode) {
        startContinuousHaptic();
      } else {
        // Slow mode — stop continuous if it was running, fire discrete
        stopContinuousHaptic();
        fireDiscreteHaptic();
      }

      // Update display date
      const d = new Date(todayTime + index * MS_PER_DAY);
      const dateStr = getLocalYYYYMMDD(d);
      setDisplayDateStr(dateStr);
      setWindowCenter(index);

      // Debounce the heavy onSelectDate callback
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onSelectDate(dateStr);
      }, UPDATE_DEBOUNCE_MS);
    },
    [todayTime, onSelectDate, startContinuousHaptic, stopContinuousHaptic, fireDiscreteHaptic],
  );

  /** Called when the animation fully stops — always clean up and fire alignment haptic */
  const onAnimationSettled = useCallback(
    (index: number) => {
      stopContinuousHaptic();
      fireDiscreteHaptic();
      const d = new Date(todayTime + index * MS_PER_DAY);
      const dateStr = getLocalYYYYMMDD(d);
      setDisplayDateStr(dateStr);
      setWindowCenter(index);
      onSelectDate(dateStr);
    },
    [todayTime, onSelectDate, stopContinuousHaptic, fireDiscreteHaptic],
  );

  // ── Animated reaction — fires on the UI thread every frame ─────────────
  useAnimatedReaction(
    () => Math.round(-translateX.value / tickSpacing),
    (index, prev) => {
      if (index !== prev && index >= -DAY_RANGE && index <= DAY_RANGE) {
        previousIndex.value = index;
        const ticksSkipped = prev !== null ? Math.abs(index - prev) : 1;
        const shouldBeFast = ticksSkipped > FAST_SWIPE_TICK_THRESHOLD;

        if (shouldBeFast && !isFastMode.value) {
          // Transition: slow → fast
          isFastMode.value = true;
          scheduleOnRN(onTickChanged, index, true);
        } else if (!shouldBeFast && isFastMode.value) {
          // Transition: fast → slow
          isFastMode.value = false;
          scheduleOnRN(onTickChanged, index, false);
        } else if (!shouldBeFast) {
          // Steady slow mode — fire discrete haptic per tick
          scheduleOnRN(onTickChanged, index, false);
        }
        // In steady fast mode, we don't need to call onTickChanged for haptics
        // (the interval handles it), but we still need to update the date display
        if (shouldBeFast && isFastMode.value) {
          scheduleOnRN(onTickChanged, index, true);
        }
      }
    },
    [tickSpacing],
  );

  // ── Pan gesture ────────────────────────────────────────────────────────
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
            const maxOffset = DAY_RANGE * tickSpacing;
            const clampedX = Math.min(Math.max(translateX.value, -maxOffset), maxOffset);
            const snappedIndex = Math.round(clampedX / tickSpacing);
            const snappedX = snappedIndex * tickSpacing;
            translateX.value = withTiming(snappedX, { duration: 150 }, (done) => {
              if (done) {
                isFastMode.value = false;
                const index = Math.round(-snappedX / tickSpacing);
                scheduleOnRN(onAnimationSettled, index);
              }
            });
          }
        },
      );
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // ── Header ─────────────────────────────────────────────────────────────
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
    stopContinuousHaptic();
    translateX.value = withTiming(0, { duration: 300 });
    const todayStr = getLocalYYYYMMDD(new Date(todayTime));
    setDisplayDateStr(todayStr);
    setWindowCenter(0);
    onSelectDate(todayStr);
  }, [todayTime, onSelectDate, stopContinuousHaptic]);

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
    position: 'absolute',
    height: '100%',
    width: 0,
    left: SCREEN_WIDTH / 2,
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
