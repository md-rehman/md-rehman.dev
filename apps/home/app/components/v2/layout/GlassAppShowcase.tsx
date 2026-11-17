"use client";

import React, { useState } from "react";
import styles from "./GlassAppShowcase.module.css";
import { GlassAppCard, GlassAppCardProps } from "./GlassAppCard";
import { FEATURE_FLAGS } from "../config/features";

export type ProjectCategory = "all" | "libraries" | "apps" | "mobile";

interface CategoryFilter {
  id: ProjectCategory;
  label: string;
}

const CATEGORIES: CategoryFilter[] = [
  { id: "all", label: "All Projects" },
  { id: "libraries", label: "Libraries & Tools" },
  { id: "apps", label: "Full-Stack Web" },
  { id: "mobile", label: "Mobile & Expo" },
];

interface ShowcaseApp extends GlassAppCardProps {
  categories: ProjectCategory[];
}

// EXACT ORIGINAL APPS LIST FROM apps/home/app/components/AppShowcase.tsx
const APPS: ShowcaseApp[] = [
  {
    name: "react-native-ruler-date-picker",
    description:
      "A performant, customizable horizontal ruler date picker & scroll wheel for React Native and Expo. Powered by 60 FPS Reanimated 3 physics, dual-speed haptic feedback, compound anatomy, and fluid date range selection.",
    techStack: ["React Native", "Expo", "Reanimated 3", "TypeScript"],
    href: "/react-native-ruler-date-picker",
    imageSrc: "/images/react-native-ruler-date-picker.png",
    imageBgColor: "#050b14",
    githubUrl: "https://github.com/md-rehman/react-native-ruler-date-picker",
    npmUrl: "https://www.npmjs.com/package/react-native-ruler-date-picker",
    priority: true,
    featured: FEATURE_FLAGS.ENABLE_BENTO_PROJECT_LAYOUT,
    categories: ["libraries", "mobile"],
    metrics: ["⚡ 60 FPS Reanimated 3", "📱 Expo Config Plugin", "📦 npm v0.2.1"],
    installCmd: "npm i react-native-ruler-date-picker",
  },
  {
    name: "TV-Set",
    description:
      "A retro TV channel-surfing experience with generative p5.js visuals and glitch effects. Flip through channels of mesmerizing procedural animations, each rendered in real-time with unique visual styles and CRT-inspired aesthetics.",
    techStack: ["Next.js", "p5.js", "Sass", "Tailwind"],
    href: "/tv-set",
    imageSrc: "/images/tv-set.png",
    categories: ["apps"],
    metrics: ["🎨 Generative p5.js", "📺 CRT Glitch Shaders", "🔀 10 Channels"],
  },
  {
    name: "Companion",
    description:
      "A prayer and namaz activity tracker with authentication via Supabase. Track your daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha), maintain streaks, and visualize your consistency — all in a clean, focused interface.",
    techStack: ["Next.js", "Supabase", "Tailwind v4", "TypeScript"],
    href: "/companion",
    imageSrc: "/images/companion-web.png",
    categories: ["apps"],
    metrics: ["🔐 Supabase Auth", "🎨 Tailwind v4", "🕌 Prayer Activity Tracker"],
  },
  {
    name: "Planner",
    description:
      "A Kanban-style board and task planner with full authentication. Organize your workflow with draggable cards across customizable columns. Built for productivity with a clean, distraction-free design.",
    techStack: ["Next.js", "Supabase", "React", "TypeScript"],
    href: "/planner",
    imageSrc: "/images/planner.png",
    categories: ["apps"],
    metrics: ["📋 Kanban State Machine", "🎯 Drag & Drop", "⚡ Realtime Sync"],
  },
  {
    name: "Companion Expo",
    description:
      "A mobile app version of Companion built with Expo and React Native. Includes prayer tracking and seamless synchronization.",
    techStack: ["React Native", "Expo", "TypeScript"],
    href: "/companion-app",
    imageSrc: "/images/companion.png",
    categories: ["mobile"],
    metrics: ["📱 React Native & Expo", "🔄 Offline Cache & Sync", "🔔 Timed Notifications"],
  },
  {
    name: "NativeBase",
    description:
      "An accessible, utility-first component library that helps you build consistent UI across Android, iOS and Web. Highly themeable and responsive, inspired by Styled System.",
    techStack: ["React Native", "React", "TypeScript"],
    href: "https://nativebase.io/",
    imageSrc: "/images/nativebase.png",
    imageBgColor: "#0b0f19",
    githubUrl: "https://github.com/GeekyAnts/NativeBase",
    npmUrl: "https://www.npmjs.com/package/native-base",
    featured: FEATURE_FLAGS.ENABLE_BENTO_PROJECT_LAYOUT,
    badge: "Core Contributor",
    categories: ["libraries"],
    metrics: ["⭐ 20K+ GitHub Stars", "🧩 40+ Components", "👥 50K+ Active Devs"],
    installCmd: "npm i native-base",
  },
  {
    name: "NativeBase Kitchen Sink",
    description:
      "A comprehensive showcase of nearly 40 components provided by NativeBase, including action sheets, menus, spinners, popovers, and breadcrumbs, demonstrating universal components for React and React Native.",
    techStack: ["React Native", "NativeBase", "Expo"],
    href: "https://docs.nativebase.io/kitchen-sink",
    imageSrc: "/images/nativebase-kitchen-sink.png",
    imageBgColor: "#0f172a",
    categories: ["libraries"],
    metrics: ["📱 Expo Component Showcase", "✨ Universal Web & Mobile", "🚀 Live Controls"],
  },
];

export function GlassAppShowcase() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");

  const getCategoryCount = (catId: ProjectCategory) => {
    if (catId === "all") return APPS.length;
    return APPS.filter((app) => app.categories.includes(catId)).length;
  };

  const filteredApps =
    !FEATURE_FLAGS.ENABLE_PROJECT_FILTERS || activeCategory === "all"
      ? APPS
      : APPS.filter((app) => app.categories.includes(activeCategory));

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTag}>Portfolio</span>
        <h2 className={styles.sectionTitle}>
          <span className={styles.gradientText}>Projects</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          A collection of personal projects crafted with care, alongside open-source systems I&apos;ve helped shape 💡
        </p>

        {/* Feature-Flagged Category Filter Bar */}
        {FEATURE_FLAGS.ENABLE_PROJECT_FILTERS && (
          <div className={styles.filterBar} role="tablist" aria-label="Project categories">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span>{cat.label}</span>
                  <span className={styles.filterCount}>{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {filteredApps.map((app) => (
          <GlassAppCard key={app.name} {...app} />
        ))}
      </div>
    </section>
  );
}
