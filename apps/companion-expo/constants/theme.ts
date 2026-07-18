export function colorMix(color1: string, percentage: number, color2: string): string {
  // Simple hex color blender to simulate CSS color-mix(in srgb, color1 percentage%, color2)
  const c1 = color1.replace('#', '');
  const c2 = (color2 === 'white' ? 'ffffff' : color2 === 'black' ? '000000' : color2.replace('#', ''));
  
  const r1 = parseInt(c1.substring(0, 2), 16) || 0;
  const g1 = parseInt(c1.substring(2, 4), 16) || 0;
  const b1 = parseInt(c1.substring(4, 6), 16) || 0;
  
  const r2 = parseInt(c2.substring(0, 2), 16) || 0;
  const g2 = parseInt(c2.substring(2, 4), 16) || 0;
  const b2 = parseInt(c2.substring(4, 6), 16) || 0;
  
  const p = percentage / 100;
  const r = Math.round(r1 * p + r2 * (1 - p));
  const g = Math.round(g1 * p + g2 * (1 - p));
  const b = Math.round(b1 * p + b2 * (1 - p));
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function rgba(hex: string, alpha: number) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const THEME_PRESETS = {
  nebula: {
    name: 'Nebula',
    bgPrimary: '#0b0d1a',
    accentPrimary: '#7c4dff',
    mixColor: 'ffffff',
    fgPrimary: '#e8eaf6',
    shadowColor: 'rgba(0, 0, 0, 0.4)',
  },
  'dark-glitch': {
    name: 'Dark Glitch',
    bgPrimary: '#050505',
    accentPrimary: '#00ffc8',
    mixColor: 'ffffff',
    fgPrimary: '#e0e0e0',
    shadowColor: 'rgba(0, 0, 0, 0.6)',
  },
  light: {
    name: 'Light',
    bgPrimary: '#f8f9fc',
    accentPrimary: '#5c4dff',
    mixColor: '000000',
    fgPrimary: '#1a1a2e',
    shadowColor: 'rgba(0, 0, 30, 0.08)',
  },
};

export type ThemeKey = keyof typeof THEME_PRESETS;

export function deriveColors(bgPrimary: string, accentPrimary: string, mixColor: string, fgPrimary: string, shadowColor: string) {
  const fgSecondaryBase = colorMix(fgPrimary, 75, bgPrimary);
  return {
    bgPrimary,
    accentPrimary,
    mixColor,
    fgPrimary,
    shadowColor,
    bgSecondary: colorMix(bgPrimary, 96, mixColor),
    bgTertiary: colorMix(bgPrimary, 92, mixColor),
    glassBg: rgba(bgPrimary, 0.8),
    cardBg: rgba(bgPrimary, 0.9),
    
    accent1: accentPrimary,
    accent2: colorMix(accentPrimary, 70, 'ffffff'),
    accent3: colorMix(accentPrimary, 50, '000000'),
    
    cardBorder: rgba(accentPrimary, 0.15),
    cardHoverBorder: rgba(accentPrimary, 0.4),
    cardGlow: rgba(accentPrimary, 0.08),
    
    badgeBg: rgba(accentPrimary, 0.12),
    badgeBorder: rgba(accentPrimary, 0.25),
    badgeText: colorMix(accentPrimary, 80, 'ffffff'),
    
    fgSecondary: colorMix(accentPrimary, 30, fgSecondaryBase),
    fgMuted: colorMix(accentPrimary, 40, colorMix(accentPrimary, 30, fgSecondaryBase)),
  };
}

export type DerivedColors = ReturnType<typeof deriveColors>;
