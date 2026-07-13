import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DateRuler } from '../../components/DateRuler';
import { PrayerTrackerRadial } from '../../components/PrayerTrackerRadial';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <DateRuler selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      
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
