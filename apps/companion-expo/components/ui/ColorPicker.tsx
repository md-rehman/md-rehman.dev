import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  presetSwatches?: string[];
}

const DEFAULT_SWATCHES = [
  '#0b0d1a', '#050505', '#1a1a2e', '#f8f9fc', '#ffffff',
  '#7c4dff', '#5c4dff', '#00ffc8', '#00e5ff', '#3d5afe',
  '#ff4081', '#ff1744', '#ff9100', '#ffea00', '#00e676',
];

export function ColorPicker({ label, color, onChange, presetSwatches = DEFAULT_SWATCHES }: ColorPickerProps) {
  const { colors } = useTheme();
  const [hexInput, setHexInput] = useState(color);

  useEffect(() => {
    setHexInput(color);
  }, [color]);

  const handleHexChange = (text: string) => {
    let formatted = text;
    if (!formatted.startsWith('#') && formatted.length > 0) {
      formatted = '#' + formatted;
    }
    setHexInput(formatted);
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(formatted)) {
      onChange(formatted);
    }
  };

  const handleSwatchPress = (swatch: string) => {
    setHexInput(swatch);
    onChange(swatch);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.fgSecondary }]}>{label}</Text>
        <View style={styles.previewContainer}>
          <Text style={[styles.hexCode, { color: colors.fgSecondary }]}>{color.toUpperCase()}</Text>
          <View style={[styles.previewSwatch, { backgroundColor: color, borderColor: colors.cardBorder }]}>
            {Platform.OS === 'web' && (
              <input
                type="color"
                value={color.length === 7 ? color : '#7c4dff'}
                onChange={(e) => {
                  const val = e.target.value;
                  setHexInput(val);
                  onChange(val);
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            )}
          </View>
        </View>
      </View>

      <View style={styles.swatchGrid}>
        {presetSwatches.map((swatch) => (
          <TouchableOpacity
            key={swatch}
            style={[
              styles.swatch,
              { backgroundColor: swatch, borderColor: colors.cardBorder },
              color.toLowerCase() === swatch.toLowerCase() && [styles.activeSwatch, { borderColor: colors.fgPrimary }],
            ]}
            onPress={() => handleSwatchPress(swatch)}
            activeOpacity={0.8}
          />
        ))}
      </View>

      <View style={[styles.inputRow, { backgroundColor: colors.bgTertiary, borderColor: colors.cardBorder }]}>
        <Text style={[styles.inputPrefix, { color: colors.fgMuted }]}>HEX</Text>
        <TextInput
          style={[styles.input, { color: colors.fgPrimary }]}
          value={hexInput}
          onChangeText={handleHexChange}
          placeholder="#7C4DFF"
          placeholderTextColor={colors.fgMuted}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={7}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hexCode: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  previewSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    overflow: 'hidden',
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
  },
  activeSwatch: {
    borderWidth: 2.5,
    transform: [{ scale: 1.1 }],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  inputPrefix: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
