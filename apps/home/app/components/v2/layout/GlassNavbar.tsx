"use client";

import React, { useSyncExternalStore, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./GlassNavbar.module.css";
import { useUIPreferences } from "../context/UIPreferencesContext";
import { FEATURE_FLAGS } from "../config/features";
import { GlassTooltip } from "../glass/GlassTooltip";
import {
  TvIcon,
  RulerIcon,
  CompanionIcon,
  PlannerIcon,
  LayersIcon,
  DiceIcon,
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

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => { };
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot(): boolean {
  if (typeof document === "undefined") return true;
  return document.documentElement.getAttribute("data-theme") !== "light";
}

function getServerThemeSnapshot(): boolean {
  return true;
}

export function GlassNavbar() {
  const { toggleModal, isRandomizeEnabled, toggleRandomize } = useUIPreferences();
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [isPulsing, setIsPulsing] = useState(false);

  // Attention-grabbing pulse when Randomize is in OFF state
  useEffect(() => {
    if (isRandomizeEnabled) return;

    let pulseTimer: NodeJS.Timeout | null = null;
    let resetTimer: NodeJS.Timeout | null = null;
    let isMounted = true;

    const scheduleNextPulse = () => {
      // Random interval between 6s and 11s
      const delay = Math.round(6000 + Math.random() * 5000);
      pulseTimer = setTimeout(() => {
        if (!isMounted) return;
        setIsPulsing(true);

        // Reset pulse after heartbeat animation completes (900ms)
        resetTimer = setTimeout(() => {
          if (!isMounted) return;
          setIsPulsing(false);
          scheduleNextPulse();
        }, 900);
      }, delay);
    };

    scheduleNextPulse();

    return () => {
      isMounted = false;
      if (pulseTimer) clearTimeout(pulseTimer);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [isRandomizeEnabled]);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "nebula";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("app-theme", nextTheme);
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.brandLink} title="Mohd. Rehman Baig" aria-label="Home">
          <Image
            src="/logo.png"
            alt="Mohd. Rehman Baig Logo"
            width={28}
            height={28}
            className={styles.brandLogo}
            priority
          />
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
        {/* Floating Glass Inspector Modal Launcher (Hidden from Navbar by default, code preserved) */}
        {FEATURE_FLAGS.ENABLE_INSPECTOR_BUTTON && (
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
        )}

        {/* Randomize Experience Toggle Button */}
        <GlassTooltip
          content={
            isRandomizeEnabled
              ? "Randomize: ON (Click to re-roll or disable)"
              : "Randomize Experience (Shuffle color, pattern & effects)"
          }
          placement="bottom"
        >
          <button
            type="button"
            className={`${styles.iconButton} ${
              isRandomizeEnabled ? styles.randomizeActive : ""
            } ${!isRandomizeEnabled && isPulsing ? styles.attentionPulse : ""}`}
            onClick={toggleRandomize}
            aria-label={
              isRandomizeEnabled
                ? "Disable Randomize Experience"
                : "Enable Randomize Experience"
            }
            aria-pressed={isRandomizeEnabled}
          >
            <DiceIcon size={18} />
          </button>
        </GlassTooltip>

        {/* Theme Toggle */}
        <GlassTooltip
          content={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          placement="bottom"
        >
          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            suppressHydrationWarning
          >
            {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
        </GlassTooltip>

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
