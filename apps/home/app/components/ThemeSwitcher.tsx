"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeSwitcher.module.css";

const THEMES = ["nebula", "dark-glitch", "light"] as const;
type Theme = (typeof THEMES)[number];

const THEME_META: Record<Theme, { icon: string; label: string }> = {
  nebula: { icon: "🌌", label: "Nebula" },
  "dark-glitch": { icon: "⚡", label: "Glitch" },
  light: { icon: "☀️", label: "Light" },
};

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("dark-glitch");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("home-theme") as Theme | null;
    if (saved && THEMES.includes(saved)) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const nextIndex = (THEMES.indexOf(theme) + 1) % THEMES.length;
    const next = THEMES[nextIndex];
    if (!next) return;
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("home-theme", next);

    // Reset custom colors when theme changes
    localStorage.removeItem("home-bg-primary");
    localStorage.removeItem("home-accent-primary");
    document.documentElement.style.removeProperty("--bg-primary");
    document.documentElement.style.removeProperty("--accent-primary");
    window.dispatchEvent(new Event("theme-reset-colors"));
  };

  if (!mounted) return null;

  const meta = THEME_META[theme];

  return (
    <button
      id="theme-switcher"
      className={styles.switcher}
      onClick={cycleTheme}
      aria-label={`Switch theme. Current: ${meta.label}`}
      title={`Theme: ${meta.label}`}
    >
      <span className={styles.icon}>{meta.icon}</span>
      <span className={styles.label}>{meta.label}</span>
    </button>
  );
}
