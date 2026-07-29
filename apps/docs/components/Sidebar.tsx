"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarCategory } from "@repo/docs-core";

interface SidebarProps {
  categories: SidebarCategory[];
}

export function Sidebar({ categories }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="docs-sidebar">
      {categories.map((cat) => (
        <div key={cat.id} className="docs-sidebar-section">
          <div className="docs-sidebar-title">{cat.label}</div>
          {cat.items.map((item) => {
            const href = `/${item.category}/${item.slug}`;
            const isActive = pathname === href || pathname === `/docs${href}`;

            return (
              <Link
                key={`${item.category}-${item.slug}`}
                href={href}
                className={`docs-sidebar-link ${isActive ? "active" : ""}`}
              >
                <span>{item.title}</span>
                {item.pinned && <span style={{ fontSize: "0.75rem" }}>📌</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
