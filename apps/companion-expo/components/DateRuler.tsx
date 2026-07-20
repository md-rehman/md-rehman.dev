import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDecay,
  withTiming,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../context/ThemeContext';
import { getLocalYYYYMMDD } from '../utils/date';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const { width } = Dimensions.get('window');

// Number of ticks generated around today
const DAY_RANGE = 365;
const UPDATE_DEBOUNCE_MS = 100;

export interface DateRulerProps {
  selectedDate: string;
  onSelectDate: (d: string) => void;
  tickSpacing?: number;
  tickHeight?: number;
  tickTallHeight?: number;
  tickThickness?: number;
  showResetToToday?: boolean;
}

export function DateRuler({
  selectedDate,
  onSelectDate,
  tickSpacing = 24,
  tickHeight = 12,
  tickTallHeight = 24,
  tickThickness = 4,
  showResetToToday = false,
}: DateRulerProps) {
  const { colors } = useTheme();

  const todayTime = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })();

  const initialOffsetDays = (() => {
    const d = new Date(selectedDate);
    d.setHours(0, 0, 0, 0);
    return Math.round((d.getTime() - todayTime) / MS_PER_DAY);
  })();

  // Position is negative since swiping left means moving into the future (positive days)
  const translateX = useSharedValue(-initialOffsetDays * tickSpacing);
  const contextX = useSharedValue(0);
  const previousIndex = useSharedValue(-initialOffsetDays);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [displayDateStr, setDisplayDateStr] = useState(selectedDate);

  const updateDisplayDate = (index: number) => {
    const d = new Date(todayTime + index * MS_PER_DAY);
    const dateStr = getLocalYYYYMMDD(d);
    setDisplayDateStr(dateStr);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onSelectDate(dateStr);
    }, UPDATE_DEBOUNCE_MS);
  };

  const handleSelectDate = (index: number) => {
    const d = new Date(todayTime + index * MS_PER_DAY);
    onSelectDate(getLocalYYYYMMDD(d));
  };

  useAnimatedReaction(
    () => Math.round(-translateX.value / tickSpacing),
    (index) => {
      if (index !== previousIndex.value && index >= -DAY_RANGE && index <= DAY_RANGE) {
        previousIndex.value = index;
        runOnJS(Haptics.selectionAsync)();
        runOnJS(updateDisplayDate)(index);
      }
    },
    [todayTime, tickSpacing]
  );

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
            // Snap to nearest tick
            const snappedIndex = Math.round(translateX.value / tickSpacing);
            const snappedX = snappedIndex * tickSpacing;
            translateX.value = withTiming(snappedX, { duration: 150 }, (finishedTiming) => {
              if (finishedTiming) {
                const index = Math.round(-snappedX / tickSpacing);
                runOnJS(handleSelectDate)(index);
              }
            });
          }
        }
      );
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const displayFormat = new Date(displayDateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const ticks = Array.from({ length: DAY_RANGE * 2 + 1 }, (_, i) => i - DAY_RANGE);

  const displayYear = new Date(displayDateStr).getFullYear();
  const currentYear = new Date().getFullYear();
  const showYear = displayYear !== currentYear;
  const isTodaySelected = displayDateStr === getLocalYYYYMMDD(new Date(todayTime));

  const handleResetToToday = () => {
    translateX.value = withTiming(0, { duration: 300 });
    const todayStr = getLocalYYYYMMDD(new Date(todayTime));
    setDisplayDateStr(todayStr);
    onSelectDate(todayStr);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.dateHeader}>
          {showYear && (
            <Text style={[styles.yearText, { color: colors.fgSecondary }]}>{displayYear}</Text>
          )}
          <Text style={[styles.dateText, { color: colors.fgPrimary }]}>{displayFormat}</Text>
        </View>

        {showResetToToday && !isTodaySelected && (
          <TouchableOpacity onPress={handleResetToToday} style={styles.resetBtn}>
            <Text style={[styles.resetText, { color: colors.accentPrimary }]}>Today</Text>
          </TouchableOpacity>
        )}
      </View>

      <GestureDetector gesture={pan}>
        <View style={styles.rulerContainer}>
          <View style={[styles.centerIndicator, { backgroundColor: colors.accentPrimary }]} />

          <Animated.View style={[styles.ticksWrapper, animatedStyle]}>
            {ticks.map((offset) => {
              const d = new Date(todayTime + offset * MS_PER_DAY);
              const isToday = offset === 0;
              const isFriday = d.getDay() === 5;
              const dateStr = d.getDate().toString();

              return (
                <View key={offset} style={[styles.tickContainer, { width: tickSpacing }]}>
                  {isFriday && (
                    <Text style={[styles.tickLabel, { color: colors.fgSecondary }]}>{dateStr}</Text>
                  )}
                  {isToday && (
                    <View style={[styles.todayDot, { backgroundColor: colors.accentPrimary }]} />
                  )}
                  <View
                    style={[
                      styles.tick,
                      {
                        backgroundColor: colors.cardBorder,
                        width: tickThickness,
                        height: isFriday ? tickTallHeight : tickHeight,
                        borderRadius: tickThickness / 2
                      }
                    ]}
                  />
                </View>
              );
            })}
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
    width: width,
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'absolute',
    height: '100%',
  },
  tickContainer: {
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tick: {
    // dynamically sized via props
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
  }
});
