import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { usePrayerTimings, PrayerKey } from "../hooks/usePrayerTimings";
import { usePrayerNotifications } from "../hooks/usePrayerNotifications";
import { useTheme } from "../context/ThemeContext";

const PRAYER_EMOJIS: Record<PrayerKey, string> = {
  fajr: "🌅",
  dhuhr: "☀️",
  asr: "🌤️",
  maghrib: "🌇",
  isha: "🌙",
};

interface NextPrayerTimerProps {
  selectedDate?: string;
}

export function NextPrayerTimer({ selectedDate }: NextPrayerTimerProps) {
  const { colors } = useTheme();
  const { loading, error, timingsList, nextPrayer, coords } =
    usePrayerTimings(selectedDate);

  const { enabled: notifEnabled, toggleNotifications } =
    usePrayerNotifications(nextPrayer);

  if (loading) {
    return (
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <ActivityIndicator size="small" color={colors.accentPrimary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <Text style={[styles.errorText, { color: "#ff5252" }]}>
          ⚠️ Could not load prayer timings: {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={[styles.locationBadge, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
          <Text style={styles.badgeEmoji}>📍</Text>
          <Text style={[styles.badgeText, { color: colors.fgPrimary }]}>
            {coords.locationName || "Mecca (Default)"}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.notifButton,
            {
              backgroundColor: notifEnabled ? colors.badgeBg : colors.bgSecondary,
              borderColor: notifEnabled ? colors.accentPrimary : colors.cardBorder,
            },
          ]}
          onPress={toggleNotifications}
          activeOpacity={0.7}
        >
          <Text style={styles.notifEmoji}>{notifEnabled ? "🔔" : "🔕"}</Text>
          <Text
            style={[
              styles.notifText,
              { color: notifEnabled ? colors.accentPrimary : colors.fgSecondary },
            ]}
          >
            {notifEnabled ? "Alerts On" : "Enable Alerts"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hero Timer Display */}
      {nextPrayer ? (
        <View style={styles.hero}>
          <Text style={[styles.nextLabel, { color: colors.fgMuted }]}>
            UPCOMING PRAYER
          </Text>

          <View style={styles.prayerTitleRow}>
            <Text style={styles.prayerEmoji}>{PRAYER_EMOJIS[nextPrayer.key]}</Text>
            <Text style={[styles.prayerTitle, { color: colors.fgPrimary }]}>
              {nextPrayer.name}
            </Text>
          </View>

          <Text style={[styles.timerDisplay, { color: colors.accentPrimary }]}>
            {nextPrayer.formattedCountdown}
          </Text>

          <Text style={[styles.startTimeText, { color: colors.fgSecondary }]}>
            Starts today at{" "}
            <Text style={{ color: colors.fgPrimary, fontWeight: "700" }}>
              {nextPrayer.timeStr}
            </Text>
          </Text>

          {/* Progress bar */}
          <View style={[styles.progressTrack, { backgroundColor: colors.bgSecondary }]}>
            <View
              style={[
                styles.progressBar,
                {
                  backgroundColor: colors.accentPrimary,
                  width: `${nextPrayer.progressPercent}%`,
                },
              ]}
            />
          </View>
        </View>
      ) : (
        <View style={styles.hero}>
          <Text style={[styles.prayerTitle, { color: colors.fgPrimary }]}>
            All Prayers Complete Today
          </Text>
        </View>
      )}

      {/* Timings Horizontal Schedule Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timingsRowContainer}
      >
        {timingsList.map((item) => {
          const isNext = item.isNext;
          const isCurrent = item.isCurrent;

          return (
            <View
              key={item.key}
              style={[
                styles.timingPill,
                {
                  backgroundColor: isNext
                    ? colors.badgeBg
                    : isCurrent
                    ? colors.bgTertiary
                    : colors.bgSecondary,
                  borderColor: isNext
                    ? colors.accentPrimary
                    : isCurrent
                    ? colors.cardHoverBorder
                    : colors.cardBorder,
                  borderWidth: isNext ? 1.5 : 1,
                },
              ]}
            >
              <Text style={[styles.pillName, { color: isNext ? colors.accentPrimary : colors.fgPrimary }]}>
                {PRAYER_EMOJIS[item.key]} {item.name}
              </Text>
              <Text style={[styles.pillTime, { color: isNext ? colors.fgPrimary : colors.fgSecondary }]}>
                {item.timeStr}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "92%",
    maxWidth: 420,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginVertical: 14,
    alignSelf: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  notifButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  notifEmoji: {
    fontSize: 13,
    marginRight: 4,
  },
  notifText: {
    fontSize: 12,
    fontWeight: "600",
  },
  hero: {
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 16,
  },
  nextLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  prayerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  prayerEmoji: {
    fontSize: 26,
    marginRight: 8,
  },
  prayerTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  timerDisplay: {
    fontSize: 38,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
    letterSpacing: 1.5,
    marginVertical: 6,
  },
  startTimeText: {
    fontSize: 13,
    marginBottom: 14,
  },
  progressTrack: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  timingsRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  timingPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
    minWidth: 70,
  },
  pillName: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
  },
  pillTime: {
    fontSize: 10,
    fontWeight: "500",
  },
  errorText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
  },
});
