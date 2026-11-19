"use client";

import React, { useRef, useCallback } from "react";
import styles from "./GlassTimeline.module.css";

// EXACT ORIGINAL EXPERIENCES FROM apps/home/app/components/ExperienceTimeline.tsx
interface Experience {
  company: string;
  role: string;
  duration: string;
  location: string;
  details: string[];
}

const EXPERIENCES: Experience[] = [
  {
    company: "Canterr IT Services (Wayfair)",
    role: "Senior Software Engineer",
    duration: "May 2023 – Present",
    location: "Remote (India)",
    details: [
      "Built scalable micro-frontend architecture using Module Federation, enabling independent deployment across teams",
      "Migrated global navigation system to Contentful, enabling dynamic updates without code deployments",
      "Contributed to enterprise design system and shared component library used across multiple teams",
      "Improved developer productivity by standardizing reusable UI patterns and components",
      "Worked on platform-level frontend infrastructure supporting large-scale applications",
    ],
  },
  {
    company: "Anar App Pvt Ltd",
    role: "Software Engineer",
    duration: "Apr 2022 – Aug 2022",
    location: "Remote (India)",
    details: [
      "Led adoption of TypeScript and modern React patterns, improving code quality and maintainability",
      "Built dynamic calling feature used by 100K+ users",
      "Established code review guidelines and PR standards, improving team-wide code quality",
      "Introduced scalable frontend architecture practices for faster feature development",
    ],
  },
  {
    company: "GeekyAnts",
    role: "Software Engineer",
    duration: "Jul 2020 – Mar 2022",
    location: "Bangalore (Remote)",
    details: [
      "Core contributor to NativeBase 3.0, building cross-platform UI components used by 50K+ developers",
      "Designed and implemented reusable components, hooks, and utilities for large-scale usage",
      "Led development of the NativeBase KitchenSink app to showcase component capabilities",
      "Contributed to documentation system and automation workflows",
      "Actively engaged with developer community via GitHub and Discord",
    ],
  },
  {
    company: "Apostek Software LLP",
    role: "Associate UI Developer",
    duration: "Sep 2018 – Jun 2020",
    location: "Bangalore, India",
    details: [
      "Migrated legacy monolithic application to modern React architecture",
      "Built new frontend modules and improved performance using React Hooks",
      "Implemented responsive web designs ensuring cross-browser compatibility",
      "Participated in Agile development cycles and daily standups",
    ],
  },
];

function GlassExperienceCard({ exp }: { exp: Experience }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseMove={handleMouseMove}
    >
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.roleTitle}>{exp.role}</h3>
          <div className={styles.company}>{exp.company}</div>
        </div>
        <div className={styles.metaBadges}>
          <span className={styles.glassPill}>{exp.duration}</span>
          <span className={styles.glassPill}>{exp.location}</span>
        </div>
      </div>

      <ul className={styles.detailsList}>
        {exp.details.map((detail, idx) => (
          <li key={idx} className={styles.detailItem}>
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GlassTimeline() {
  return (
    <section id="experience" className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTag}>Career</span>
        <h2 className={styles.sectionTitle}>
          <span className={styles.gradientText}>Experience</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          My professional journey in software engineering, building platforms, design systems, and mobile applications.
        </p>
      </div>

      <div className={styles.timeline}>
        {EXPERIENCES.map((exp) => (
          <GlassExperienceCard key={exp.company} exp={exp} />
        ))}
      </div>
    </section>
  );
}

