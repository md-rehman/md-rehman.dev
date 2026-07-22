import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DateRuler } from '../../components/DateRuler';
import { DateRulerV2 } from '../../components/DateRulerV2';
import { DateRulerV3 } from '../../components/DateRulerV3';
import { PrayerTrackerRadial } from '../../components/PrayerTrackerRadial';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLocalYYYYMMDD } from '../../utils/date';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(() => getLocalYYYYMMDD());

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      {/* <DateRuler selectedDate={selectedDate} onSelectDate={setSelectedDate} showResetToToday={true} />

      <View style={styles.separator}>
        <Text style={[styles.separatorText, { color: colors.fgSecondary }]}>V2</Text>
      </View>

      <DateRulerV2 selectedDate={selectedDate} onSelectDate={setSelectedDate} showResetToToday={true} />

      <View style={styles.separator}>
        <Text style={[styles.separatorText, { color: colors.fgSecondary }]}>V3</Text>
      </View> */}

      <DateRulerV3 selectedDate={selectedDate} onSelectDate={setSelectedDate} showResetToToday={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.trackerContainer}>
          <PrayerTrackerRadial selectedDate={selectedDate} />
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
});
