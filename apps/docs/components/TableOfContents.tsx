"use client";

import React, { useEffect, useState } from "react";
import { TocHeading } from "@repo/docs-core";

interface TocProps {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="docs-toc">
      <div className="docs-toc-title">On This Page</div>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`docs-toc-item level-${h.level} ${activeId === h.id ? "active" : ""}`}
          style={{
            color: activeId === h.id ? "var(--accent-cyan)" : undefined,
            fontWeight: activeId === h.id ? 600 : 400,
          }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
