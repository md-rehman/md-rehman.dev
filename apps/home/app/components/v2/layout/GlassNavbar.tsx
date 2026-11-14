"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import styles from "./GlassNavbar.module.css";
import { useUIPreferences } from "../context/UIPreferencesContext";
import { GlassTooltip } from "../glass/GlassTooltip";
import {
  TvIcon,
  RulerIcon,
  CompanionIcon,
  PlannerIcon,
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

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
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
  const { toggleModal } = useUIPreferences();
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "nebula";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("app-theme", nextTheme);
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
