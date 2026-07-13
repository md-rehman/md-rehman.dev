import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { THEME_PRESETS, ThemeKey } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { themeKey, colors, setTheme, setCustomColors } = useTheme();
  const { signOut } = useAuth();

  const [customBg, setCustomBg] = useState(colors.bgPrimary);
  const [customAccent, setCustomAccent] = useState(colors.accentPrimary);

  const handleApplyCustom = () => {
    setCustomColors(customBg, customAccent);
  };

  const presetKeys = Object.keys(THEME_PRESETS) as ThemeKey[];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.fgPrimary }]}>Settings</Text>
        
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.fgPrimary }]}>Theme Preset</Text>
          <View style={styles.presetContainer}>
            {presetKeys.map(key => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.presetButton,
                  { backgroundColor: colors.bgSecondary, borderColor: themeKey === key ? colors.accentPrimary : 'transparent' }
                ]}
                onPress={() => setTheme(key)}
              >
                <Text style={[styles.presetText, { color: themeKey === key ? colors.accentPrimary : colors.fgSecondary }]}>
                  {THEME_PRESETS[key].name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.presetButton,
                { backgroundColor: colors.bgSecondary, borderColor: themeKey === 'custom' ? colors.accentPrimary : 'transparent' }
              ]}
              onPress={() => setCustomColors(customBg, customAccent)}
            >
              <Text style={[styles.presetText, { color: themeKey === 'custom' ? colors.accentPrimary : colors.fgSecondary }]}>
                Custom
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {themeKey === 'custom' && (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.sectionTitle, { color: colors.fgPrimary }]}>Custom Colors (Hex)</Text>
            
            <Text style={[styles.label, { color: colors.fgSecondary }]}>Background Primary</Text>
            <TextInput
              style={[styles.input, { color: colors.fgPrimary, backgroundColor: colors.bgTertiary, borderColor: colors.cardBorder }]}
              value={customBg}
              onChangeText={setCustomBg}
              autoCapitalize="none"
            />
            
            <Text style={[styles.label, { color: colors.fgSecondary }]}>Accent Primary</Text>
            <TextInput
              style={[styles.input, { color: colors.fgPrimary, backgroundColor: colors.bgTertiary, borderColor: colors.cardBorder }]}
              value={customAccent}
              onChangeText={setCustomAccent}
              autoCapitalize="none"
            />
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.accentPrimary }]}
              onPress={handleApplyCustom}
            >
              <Text style={styles.buttonText}>Apply Colors</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.fgPrimary }]}>Theme Preview</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <View style={{ flex: 1, height: 60, backgroundColor: colors.bgSecondary, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: colors.fgSecondary }}>bgSecondary</Text>
            </View>
            <View style={{ flex: 1, height: 60, backgroundColor: colors.accent1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#fff' }}>accent1</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <View style={{ flex: 1, height: 60, backgroundColor: colors.cardBg, borderColor: colors.cardBorder, borderWidth: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: colors.fgPrimary }}>cardBg</Text>
            </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
  },
  presetText: {
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signOutButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 10,
  },
  signOutText: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});
