import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';
import { DateRuler } from '../../components/DateRuler';
import { DateRulerV2 } from '../../components/DateRulerV2';
import { DateRulerV3 } from '../../components/DateRulerV3';
import { PrayerTrackerRadial } from '../../components/PrayerTrackerRadial';
import { NextPrayerTimer } from '../../components/NextPrayerTimer';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLocalYYYYMMDD } from '../../utils/date';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(() => getLocalYYYYMMDD());

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <DateRulerV3 selectedDate={selectedDate} onSelectDate={setSelectedDate} showResetToToday={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <NextPrayerTimer selectedDate={selectedDate} />
        <View style={styles.trackerContainer}>
          <PrayerTrackerRadial selectedDate={selectedDate} />
        </View>

        <View style={[styles.testPanel, { backgroundColor: colors.bgSecondary }]}>
          <Text style={[styles.testTitle, { color: colors.fgPrimary }]}>Haptics Test Panel</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.testButton, { backgroundColor: colors.accentPrimary }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            >
              <Text style={styles.buttonText}>Medium</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testButton, { backgroundColor: colors.accentPrimary }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
            >
              <Text style={styles.buttonText}>Heavy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testButton, { backgroundColor: colors.accentPrimary }]}
              onPress={() => Vibration.vibrate(500)}
            >
              <Text style={styles.buttonText}>Vib 500ms</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testButton, { backgroundColor: colors.accentPrimary }]}
              onPress={() => Vibration.vibrate([0, 200, 100, 200])}
            >
              <Text style={styles.buttonText}>Pattern</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  separatorText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    opacity: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  trackerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  testPanel: {
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
  },
  testTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  testButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
