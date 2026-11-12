"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import styles from "./GlassNavbar.module.css";
import { useUIPreferences } from "../context/UIPreferencesContext";
import { GlassTooltip } from "../glass/GlassTooltip";
import {
  TvIcon,
  RulerIcon,
  CompanionIcon,
  PlannerIcon,
  PatternIcon,
  LayersIcon,
  SunIcon,
  MoonIcon,
  GithubIcon,
} from "../icons";

const HOME_NAV_ITEMS = [
  { href: "/tv-set", label: "TV-Set", icon: TvIcon },
  { href: "/react-native-ruler-date-picker", label: "Ruler Picker", icon: RulerIcon },
  { href: "/companion", label: "Companion", icon: CompanionIcon },
  { href: "/planner", label: "Planner", icon: PlannerIcon },
];

export function GlassNavbar() {
  const { cyclePattern, currentPatternConfig, toggleModal } = useUIPreferences();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return true;
    const currentTheme = document.documentElement.getAttribute("data-theme") || "nebula";
    return currentTheme !== "light";
  });

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "nebula";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("app-theme", nextTheme);
    setIsDark(!isDark);
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.brandLink} title="Mohd. Rehman Baig" aria-label="Home">
          R
        </Link>

        {HOME_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navButton}
              title={item.label}
              aria-label={item.label}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className={styles.right}>
        {/* Background Pattern Switcher Button on the right (Requested) */}
        <GlassTooltip
          content={
            <div>
              <div style={{ fontWeight: 600 }}>Background Pattern</div>
              <div style={{ opacity: 0.85 }}>{currentPatternConfig.name}</div>
              <div style={{ fontSize: "0.7rem", marginTop: 4, color: "var(--color-accent)" }}>
                Click to switch pattern
              </div>
            </div>
          }
          placement="bottom"
        >
          <button
            type="button"
            className={styles.navButton}
            onClick={cyclePattern}
            aria-label={`Toggle background pattern. Currently ${currentPatternConfig.name}`}
          >
            <PatternIcon size={16} />
            <span>Pattern</span>
            <span className={styles.patternBadge}>{currentPatternConfig.badge}</span>
          </button>
        </GlassTooltip>

        {/* Floating Glass Inspector Modal Launcher */}
        <GlassTooltip content="Open Glass Inspector" placement="bottom">
          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleModal}
            aria-label="Open Glass Inspector"
          >
            <LayersIcon size={18} />
          </button>
        </GlassTooltip>

        {/* Theme Toggle */}
        {mounted && (
          <GlassTooltip
            content={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
            placement="bottom"
          >
            <button
              type="button"
              className={styles.iconButton}
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>
          </GlassTooltip>
        )}

        {/* GitHub */}
        <GlassTooltip content="GitHub Profile" placement="bottom">
          <a
            href="https://github.com/md-rehman"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconButton}
            aria-label="GitHub"
          >
            <GithubIcon size={18} />
          </a>
        </GlassTooltip>
      </div>
    </header>
  );
}
