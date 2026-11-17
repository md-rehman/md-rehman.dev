"use client";

import React from "react";
import styles from "./GlassHero.module.css";
import { GlassTooltip } from "../glass/GlassTooltip";
import {
  GithubIcon,
  XIcon,
  LinkedInIcon,
  MailIcon,
} from "../icons";

const SKILLS = [
  "React",
  "React Native",
  "Next.js",
  "TypeScript",
  "Design Systems",
  "Micro-frontends",
  "Module Federation",
];

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/md-rehman",
    icon: <GithubIcon size={20} />,
  },
  {
    label: "X",
    href: "https://x.com/_mdrehman",
    icon: <XIcon size={18} />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/md-rehman",
    icon: <LinkedInIcon size={19} />,
  },
  {
    label: "Email",
    href: "mailto:rehman.2468@gmail.com",
    icon: <MailIcon size={19} />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_mdrehman",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Website",
    href: "https://www.md-rehman.dev",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export function GlassHero() {
  return (
    <section id="hero" className={styles.hero}>
      {/* Visually hidden section for SEO search crawlers and screen readers (Exact original) */}
      <div
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: "0",
        }}
      >
        <h1>
          MD Rehman — md-rehman — Rehman Dev — Developer Rehman — Rehman React Native Developer
        </h1>
        <p>
          Official portfolio of MD Rehman (Mohd. Rehman Baig), Senior React & React Native Engineer specializing in cross-platform engineering, design systems, and mobile architecture.
        </p>
      </div>

      {/* Floating Glass Role Badge */}
      <div className={styles.badge}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span>Senior React & React Native Engineer</span>
      </div>

      <div className={styles.greeting}>Hello, I&apos;m</div>

      <h1 className={styles.headline}>
        <span
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: "0",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: "0",
          }}
        >
          md-rehman — Mohd. Rehman Baig — md-rehman.dev —{" "}
        </span>
        <span className={styles.gradientText}>Mohd. Rehman Baig</span>
      </h1>

      <p className={styles.summary}>
        7+ years of experience building scalable, high-performance applications and UI platforms. Core
        contributor to <strong>NativeBase</strong> (20K+ GitHub stars), specializing in design
        systems, cross-platform component architecture, and developer tooling.
      </p>

      {/* Skills in floating glass pills */}
      <div className={styles.skills}>
        {SKILLS.map((skill) => (
          <span key={skill} className={styles.skillPill}>
            {skill}
          </span>
        ))}
      </div>

      {/* Social links as 40x40 floating glass icon buttons */}
      <div className={styles.socials}>
        {SOCIALS.map((social) => (
          <GlassTooltip key={social.label} content={social.label} placement="bottom">
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialButton}
              aria-label={social.label}
            >
              {social.icon}
            </a>
          </GlassTooltip>
        ))}
      </div>
    </section>
  );
}
