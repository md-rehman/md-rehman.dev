import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.fgPrimary }]}>Profile</Text>

        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.bgSecondary }]}>
              <Ionicons name="person" size={48} color={colors.fgSecondary} />
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.fgSecondary }]}>Email</Text>
            <Text style={[styles.value, { color: colors.fgPrimary }]}>
              {user?.email || 'Not logged in'}
            </Text>
          </View>

        </View>

        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}
          onPress={signOut}
        >
          <Text style={[styles.signOutText, { color: colors.accentPrimary }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  signOutButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 'auto',
  },
  signOutText: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});
