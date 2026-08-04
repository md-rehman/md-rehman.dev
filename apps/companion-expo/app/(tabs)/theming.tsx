import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { THEME_PRESETS, ThemeKey } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColorPicker } from '../../components/ui/ColorPicker';

export default function ThemingScreen() {
  const { themeKey, colors, setTheme, setCustomColors } = useTheme();

  const [customBg, setCustomBg] = useState(colors.bgPrimary);
  const [customAccent, setCustomAccent] = useState(colors.accentPrimary);
  const [customFg, setCustomFg] = useState(colors.fgPrimary);

  useEffect(() => {
    setCustomBg(colors.bgPrimary);
    setCustomAccent(colors.accentPrimary);
    setCustomFg(colors.fgPrimary);
  }, [colors.bgPrimary, colors.accentPrimary, colors.fgPrimary]);

  const handleApplyCustom = () => {
    setCustomColors(customBg, customAccent, customFg);
  };

  const handleBgChange = (newBg: string) => {
    setCustomBg(newBg);
    if (themeKey === 'custom') {
      setCustomColors(newBg, customAccent, customFg);
    }
  };

  const handleAccentChange = (newAccent: string) => {
    setCustomAccent(newAccent);
    if (themeKey === 'custom') {
      setCustomColors(customBg, newAccent, customFg);
    }
  };

  const handleFgChange = (newFg: string) => {
    setCustomFg(newFg);
    if (themeKey === 'custom') {
      setCustomColors(customBg, customAccent, newFg);
    }
  };

  const presetKeys = Object.keys(THEME_PRESETS) as ThemeKey[];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.fgPrimary }]}>Theming App</Text>
        
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.fgPrimary }]}>Theme Preset</Text>
          <View style={styles.presetContainer}>
            {presetKeys.map(key => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.presetButton,
                  { 
                    backgroundColor: colors.bgSecondary, 
                    borderColor: themeKey === key ? colors.accentPrimary : colors.cardBorder 
                  }
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
                { 
                  backgroundColor: colors.bgSecondary, 
                  borderColor: themeKey === 'custom' ? colors.accentPrimary : colors.cardBorder 
                }
              ]}
              onPress={() => setCustomColors(customBg, customAccent, customFg)}
            >
              <Text style={[styles.presetText, { color: themeKey === 'custom' ? colors.accentPrimary : colors.fgSecondary }]}>
                Custom
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {themeKey === 'custom' && (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.sectionTitle, { color: colors.fgPrimary }]}>Custom Theme Colors</Text>
            
            <ColorPicker
              label="Background Primary"
              color={customBg}
              onChange={handleBgChange}
              presetSwatches={['#0b0d1a', '#050505', '#121212', '#1a1a2e', '#f8f9fc', '#ffffff']}
            />
            
            <ColorPicker
              label="Accent Primary"
              color={customAccent}
              onChange={handleAccentChange}
              presetSwatches={['#7c4dff', '#5c4dff', '#00ffc8', '#00e5ff', '#ff4081', '#ff9100', '#00e676']}
            />
            
            <ColorPicker
              label="Text Primary (Main Text)"
              color={customFg}
              onChange={handleFgChange}
              presetSwatches={['#e8eaf6', '#e0e0e0', '#ffffff', '#1a1a2e', '#2c3e50', '#ffd700', '#00ffc8']}
            />

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.accentPrimary }]}
              onPress={handleApplyCustom}
            >
              <Text style={[styles.buttonText, { color: '#ffffff' }]}>Save Custom Theme</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.fgPrimary }]}>Theme Preview</Text>

          {/* Color Palette Samples */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
            <View style={{ flex: 1, height: 50, backgroundColor: colors.bgSecondary, borderColor: colors.cardBorder, borderWidth: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: colors.fgSecondary, fontSize: 12, fontWeight: '600' }}>bgSecondary</Text>
            </View>
            <View style={{ flex: 1, height: 50, backgroundColor: colors.accent1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '600' }}>accent1</Text>
            </View>
            <View style={{ flex: 1, height: 50, backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder, borderWidth: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: colors.badgeText, fontSize: 12, fontWeight: '600' }}>badgeText</Text>
            </View>
          </View>

          {/* Text Color Shades Preview */}
          <View style={[styles.previewTextContainer, { backgroundColor: colors.bgSecondary, borderColor: colors.cardBorder }]}>
            <Text style={{ color: colors.fgPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
              Main Text (fgPrimary)
            </Text>
            <Text style={{ color: colors.fgSecondary, fontSize: 14, fontWeight: '500', marginBottom: 4 }}>
              Secondary Text (fgSecondary) - Derived
            </Text>
            <Text style={{ color: colors.fgMuted, fontSize: 12, fontWeight: '400' }}>
              Muted Text (fgMuted) - Calculated Shade
            </Text>
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
    marginBottom: 16,
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
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  previewTextContainer: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
});
