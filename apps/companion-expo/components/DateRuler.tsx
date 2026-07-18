import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
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

const TICK_WIDTH = 12;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const { width } = Dimensions.get('window');

// Number of ticks generated around today
const DAY_RANGE = 365;

export function DateRuler({ selectedDate, onSelectDate }: { selectedDate: string; onSelectDate: (d: string) => void }) {
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
  const translateX = useSharedValue(-initialOffsetDays * TICK_WIDTH);
  const contextX = useSharedValue(0);
  const previousIndex = useSharedValue(-initialOffsetDays);

  const [displayDateStr, setDisplayDateStr] = useState(selectedDate);

  const updateDisplayDate = (index: number) => {
    const d = new Date(todayTime + index * MS_PER_DAY);
    setDisplayDateStr(getLocalYYYYMMDD(d));
  };

  const handleSelectDate = (index: number) => {
    const d = new Date(todayTime + index * MS_PER_DAY);
    onSelectDate(getLocalYYYYMMDD(d));
  };

  useAnimatedReaction(
    () => Math.round(-translateX.value / TICK_WIDTH),
    (index) => {
      if (index !== previousIndex.value && index >= -DAY_RANGE && index <= DAY_RANGE) {
        previousIndex.value = index;
        runOnJS(updateDisplayDate)(index);
      }
    },
    [todayTime]
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
            const snappedIndex = Math.round(translateX.value / TICK_WIDTH);
            const snappedX = snappedIndex * TICK_WIDTH;
            translateX.value = withTiming(snappedX, { duration: 150 }, (finishedTiming) => {
              if (finishedTiming) {
                const index = Math.round(-snappedX / TICK_WIDTH);
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

  return (
    <View style={styles.container}>
      <Text style={[styles.dateText, { color: colors.fgPrimary }]}>{displayFormat}</Text>
      
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
                <View key={offset} style={[styles.tickContainer, { width: TICK_WIDTH }]}>
                  {isFriday && (
                    <Text style={[styles.tickLabel, { color: colors.fgSecondary }]}>{dateStr}</Text>
                  )}
                  {isToday && (
                    <View style={[styles.todayDot, { backgroundColor: colors.accentPrimary }]} />
                  )}
                  <View 
                    style={[
                      styles.tick, 
                      { backgroundColor: colors.cardBorder },
                      isFriday && styles.tickTall
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
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
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
    width: 2,
    height: 12,
    borderRadius: 1,
  },
  tickTall: {
    height: 24,
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
