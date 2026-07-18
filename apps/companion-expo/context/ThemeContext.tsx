import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME_PRESETS, ThemeKey, deriveColors, DerivedColors } from '../constants/theme';

interface ThemeContextType {
  themeKey: ThemeKey | 'custom';
  colors: DerivedColors;
  setTheme: (key: ThemeKey) => void;
  setCustomColors: (bgPrimary: string, accentPrimary: string) => void;
}

const defaultColors = deriveColors(
  THEME_PRESETS.nebula.bgPrimary,
  THEME_PRESETS.nebula.accentPrimary,
  THEME_PRESETS.nebula.mixColor,
  THEME_PRESETS.nebula.fgPrimary,
  THEME_PRESETS.nebula.shadowColor
);

const ThemeContext = createContext<ThemeContextType>({
  themeKey: 'nebula',
  colors: defaultColors,
  setTheme: () => {},
  setCustomColors: () => {},
});

const THEME_STORAGE_KEY = '@companion_theme_key';
const CUSTOM_COLORS_KEY = '@companion_custom_colors';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeKey, setThemeState] = useState<ThemeKey | 'custom'>('nebula');
  const [colors, setColors] = useState<DerivedColors>(defaultColors);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedKey = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeKey | 'custom' | null;
      if (savedKey === 'custom') {
        const savedCustom = await AsyncStorage.getItem(CUSTOM_COLORS_KEY);
        if (savedCustom) {
          const { bgPrimary, accentPrimary } = JSON.parse(savedCustom);
          applyCustom(bgPrimary, accentPrimary);
        } else {
          applyTheme('nebula');
        }
      } else if (savedKey && THEME_PRESETS[savedKey as ThemeKey]) {
        applyTheme(savedKey as ThemeKey);
      } else {
        applyTheme('nebula');
      }
    } catch (e) {
      console.error('Failed to load theme', e);
      applyTheme('nebula');
    } finally {
      setIsLoaded(true);
    }
  };

  const applyTheme = (key: ThemeKey) => {
    setThemeState(key);
    const preset = THEME_PRESETS[key];
    setColors(deriveColors(preset.bgPrimary, preset.accentPrimary, preset.mixColor, preset.fgPrimary, preset.shadowColor));
  };

  const applyCustom = (bgPrimary: string, accentPrimary: string) => {
    setThemeState('custom');
    setColors(deriveColors(bgPrimary, accentPrimary, 'ffffff', '#e8eaf6', 'rgba(0,0,0,0.4)'));
  };

  const setTheme = async (key: ThemeKey) => {
    applyTheme(key);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, key);
  };

  const setCustomColors = async (bgPrimary: string, accentPrimary: string) => {
    applyCustom(bgPrimary, accentPrimary);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, 'custom');
    await AsyncStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify({ bgPrimary, accentPrimary }));
  };

  if (!isLoaded) {
    return null; // Or a splash screen
  }

  return (
    <ThemeContext.Provider value={{ themeKey, colors, setTheme, setCustomColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
