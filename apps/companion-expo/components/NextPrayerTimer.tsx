import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
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

  const [modalVisible, setModalVisible] = useState(false);

  if (loading) {
    return (
      <View style={styles.compactContainer}>
        <TouchableOpacity
          style={[styles.compactPill, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
          disabled
        >
          <ActivityIndicator size="small" color={colors.accentPrimary} style={{ marginRight: 6 }} />
          <Text style={[styles.compactText, { color: colors.fgSecondary }]}>Loading timings...</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error || !nextPrayer) {
    return (
      <View style={styles.compactContainer}>
        <TouchableOpacity
          style={[styles.compactPill, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.compactEmoji}>🕌</Text>
          <Text style={[styles.compactText, { color: colors.fgPrimary }]}>Prayers Complete Today</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.compactContainer}>
      {/* Compact Inline Pill on Home Screen */}
      <TouchableOpacity
        style={[
          styles.compactPill,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.compactEmoji}>{PRAYER_EMOJIS[nextPrayer.key]}</Text>
        <Text style={[styles.compactText, { color: colors.fgPrimary }]}>
          {nextPrayer.name} in{" "}
          <Text style={[styles.compactHighlight, { color: colors.accentPrimary }]}>
            {nextPrayer.shortCountdown}
          </Text>
        </Text>
      </TouchableOpacity>

      {/* ActionSheet Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.sheetContainer,
                  {
                    backgroundColor: colors.bgPrimary || "#141419",
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                {/* Drag Handle Bar */}
                <View style={styles.dragHandleBar}>
                  <View style={[styles.dragHandle, { backgroundColor: colors.cardBorder }]} />
                </View>

                {/* Header Row: Title & Close Button (Separated from Subheader) */}
                <View style={styles.sheetHeaderRow}>
                  <Text style={[styles.sheetTitle, { color: colors.fgPrimary }]}>Prayer Schedule</Text>
                  <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: colors.badgeBg }]}
                    onPress={() => setModalVisible(false)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={[styles.closeButtonText, { color: colors.fgSecondary }]}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Subheader Bar (Location + Notification Toggle) */}
                <View style={styles.subHeader}>
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

                {/* Main Scrollable Content (Hero Timer + Prayer Times List) */}
                <ScrollView
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={styles.sheetScrollContent}
                  bounces={true}
                >
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

                  {/* Section Divider Header */}
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.fgMuted }]}>
                      TODAY'S TIMINGS
                    </Text>
                  </View>

                  {/* Vertically Scrollable Prayer Times List */}
                  <View style={styles.timingsListContainer}>
                    {timingsList.map((item) => {
                      const isNext = item.isNext;
                      const isCurrent = item.isCurrent;

                      return (
                        <View
                          key={item.key}
                          style={[
                            styles.timingRow,
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
                          <View style={styles.timingRowLeft}>
                            <Text style={styles.timingRowEmoji}>{PRAYER_EMOJIS[item.key]}</Text>
                            <Text style={[styles.timingRowName, { color: isNext ? colors.accentPrimary : colors.fgPrimary }]}>
                              {item.name}
                            </Text>
                          </View>

                          <View style={styles.timingRowRight}>
                            <Text style={[styles.timingRowTime, { color: isNext ? colors.accentPrimary : colors.fgPrimary }]}>
                              {item.timeStr}
                            </Text>
                            {isNext ? (
                              <View style={[styles.statusBadge, { backgroundColor: colors.accentPrimary }]}>
                                <Text style={styles.statusBadgeText}>NEXT</Text>
                              </View>
                            ) : isCurrent ? (
                              <View style={[styles.statusBadge, { backgroundColor: colors.cardHoverBorder }]}>
                                <Text style={styles.statusBadgeText}>NOW</Text>
                              </View>
                            ) : null}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  compactPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  compactEmoji: {
    fontSize: 15,
    marginRight: 6,
  },
  compactText: {
    fontSize: 14,
    fontWeight: "600",
  },
  compactHighlight: {
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    maxHeight: "85%",
  },
  dragHandleBar: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: "100%",
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  subHeader: {
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
  sheetScrollContent: {
    paddingBottom: 16,
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
  sectionHeader: {
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  timingsListContainer: {
    gap: 8,
  },
  timingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  timingRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  timingRowEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  timingRowName: {
    fontSize: 15,
    fontWeight: "700",
  },
  timingRowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  timingRowTime: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
});

