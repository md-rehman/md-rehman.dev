"use client";

import { useEffect } from "react";

/**
 * Reads saved theme & custom colors from localStorage and applies them
 * to the document on mount. This ensures the background/accent persist
 * across all pages — even those without a Navbar/ColorPicker.
 */
export function ThemeInitializer() {
  useEffect(() => {
    // Apply saved theme
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }

    // Apply saved custom colors
    const savedBg = localStorage.getItem("app-bg-primary");
    const savedAccent = localStorage.getItem("app-accent-primary");

    if (savedBg) {
      document.documentElement.style.setProperty("--bg-primary", savedBg);
    }
    if (savedAccent) {
      document.documentElement.style.setProperty("--accent-primary", savedAccent);
    }
  }, []);

  return null;
}
