"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchModal } from "./SearchModal";

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="docs-header">
        <div className="docs-brand">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>📚 MD-REHMAN DOCS</span>
            <span className="docs-brand-badge">v1.0</span>
          </Link>
        </div>

        <nav className="docs-nav-tabs">
          <Link
            href="/apps/companion"
            className={`docs-nav-tab ${pathname.startsWith("/apps") ? "active" : ""}`}
          >
            📱 Apps
          </Link>
          <Link
            href="/packages/atomic-ui"
            className={`docs-nav-tab ${pathname.startsWith("/packages") ? "active" : ""}`}
          >
            📦 Packages
          </Link>
          <Link
            href="/agents/pinned-summary"
            className={`docs-nav-tab ${pathname.startsWith("/agents") ? "active" : ""}`}
          >
            🤖 Agents
          </Link>
        </nav>

        <div className="docs-header-actions">
          <button className="docs-search-btn" onClick={() => setIsSearchOpen(true)}>
            <span>🔍 Search docs...</span>
            <span className="docs-kbd">⌘K</span>
          </button>
          <a
            href="https://github.com/GeekyAnts/nativebase-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="docs-nav-tab"
            style={{ fontSize: "0.8125rem" }}
          >
            GitHub ↗
          </a>
        </div>
      </header>

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
