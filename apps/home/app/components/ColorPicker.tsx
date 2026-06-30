"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./ColorPicker.module.css";

const PREDEFINED_ACCENTS = [
  "#ff0080", "#00ffc8", "#ffea00", "#d500f9", "#00b8ff", "#39ff14",
  "#ff3300ff", "#7000ffff", "#00ff66ff", "#ff00ffff", "#0044ffff", "#ff8c00ff", "#f80000ff", "#b2ff05ff"
];
const PREDEFINED_BGS = ["#0b0d1a", "#050505", "#1a1a2e", "#2e1a2cff", "#1a2e2cff", "#a7d3d3ff", "#fbd9eaff", "#e0f2feff", "#f5f5f6ff"];

export function ColorPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [accent, setAccent] = useState("");
  const [bg, setBg] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read from localStorage on mount
    const savedAccent = localStorage.getItem("home-accent-primary");
    const savedBg = localStorage.getItem("home-bg-primary");

    if (savedAccent) {
      setAccent(savedAccent);
      document.documentElement.style.setProperty("--accent-primary", savedAccent);
    }
    if (savedBg) {
      setBg(savedBg);
      document.documentElement.style.setProperty("--bg-primary", savedBg);
    }

    // click outside to close
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleReset = () => {
      setBg("");
      setAccent("");
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("theme-reset-colors", handleReset);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("theme-reset-colors", handleReset);
    };
  }, []);

  const updateAccent = (color: string) => {
    setAccent(color);
    document.documentElement.style.setProperty("--accent-primary", color);
    localStorage.setItem("home-accent-primary", color);
  };

  const updateBg = (color: string) => {
    setBg(color);
    document.documentElement.style.setProperty("--bg-primary", color);
    localStorage.setItem("home-bg-primary", color);
  };

  return (
    <div className={styles.container} ref={popoverRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Color Picker"
        title="Custom Colors"
      >
        <div className={styles.swatch} style={{ background: accent || "var(--accent-primary)" }} />
      </button>

      {isOpen && (
        <div className={styles.popover}>
          <div className={styles.section}>
            <span className={styles.label}>Background Color</span>
            <div className={styles.colors}>
              {PREDEFINED_BGS.map((c) => (
                <button
                  key={c}
                  className={styles.colorBtn}
                  style={{ background: c }}
                  onClick={() => updateBg(c)}
                  title={c}
                />
              ))}
              <label className={styles.customColorBtn} title="Custom Background">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m2 22 1-1h3l9-9" />
                  <path d="M3 21v-3l9-9" />
                  <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
                </svg>
                <input
                  type="color"
                  value={bg || "#0b0d1a"}
                  onChange={(e) => updateBg(e.target.value)}
                  className={styles.hiddenInput}
                />
              </label>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <span className={styles.label}>Accent Color</span>
            <div className={styles.colors}>
              {PREDEFINED_ACCENTS.map((c) => (
                <button
                  key={c}
                  className={styles.colorBtn}
                  style={{ background: c }}
                  onClick={() => updateAccent(c)}
                  title={c}
                />
              ))}
              <label className={styles.customColorBtn} title="Custom Accent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m2 22 1-1h3l9-9" />
                  <path d="M3 21v-3l9-9" />
                  <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
                </svg>
                <input
                  type="color"
                  value={accent || "#7c4dff"}
                  onChange={(e) => updateAccent(e.target.value)}
                  className={styles.hiddenInput}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
