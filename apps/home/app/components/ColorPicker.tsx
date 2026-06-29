"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./ColorPicker.module.css";

const PREDEFINED_ACCENTS = ["#FFADAD", "#FFD6A5", "#FDFFB6", "#E4F1EE", "#D9EDF4", "#DEDAF4"];
const PREDEFINED_BGS = ["#0b0d1a", "#050505", "#1a1a2e", "#f8f9fc", "#ffffff", "#f4f4f5"];

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
                +
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
                +
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
