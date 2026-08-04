"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTreeNode } from "@repo/docs-core";

interface SidebarProps {
  tree: SidebarTreeNode[];
}

function hasActiveChild(node: SidebarTreeNode, pathname: string): boolean {
  if (node.type === "file" && node.href) {
    return pathname === node.href || pathname === `/docs${node.href}`;
  }
  if (node.children) {
    return node.children.some((child) => hasActiveChild(child, pathname));
  }
  return false;
}

interface TreeNodeItemProps {
  node: SidebarTreeNode;
  depth?: number;
}

function TreeNodeItem({ node, depth = 0 }: TreeNodeItemProps) {
  const pathname = usePathname();
  const isActivePath = hasActiveChild(node, pathname);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Auto expand if this folder contains the active page
  useEffect(() => {
    if (isActivePath) {
      setIsExpanded(true);
    }
  }, [isActivePath]);

  if (node.type === "folder") {
    return (
      <div className="docs-tree-folder" style={{ marginTop: depth === 0 ? "0.6rem" : "0.25rem" }}>
        <button
          type="button"
          className={`docs-tree-folder-header ${isExpanded ? "expanded" : ""}`}
          onClick={() => setIsExpanded((prev) => !prev)}
          style={{ paddingLeft: `${depth * 0.75 + 0.5}rem` }}
        >
          <span className="docs-tree-chevron">{isExpanded ? "▼" : "▶"}</span>
          {node.icon && <span className="docs-tree-icon">{node.icon}</span>}
          <span className="docs-tree-folder-name">{node.name}</span>
        </button>

        {isExpanded && node.children && (
          <div className="docs-tree-children">
            {node.children.map((child) => (
              <TreeNodeItem key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // File item
  const href = node.href || "#";
  const isActive = pathname === href || pathname === `/docs${href}`;

  return (
    <div className="docs-tree-file" style={{ paddingLeft: `${depth * 0.75 + 0.5}rem` }}>
      <Link href={href} className={`docs-sidebar-link ${isActive ? "active" : ""}`}>
        <span className="docs-tree-file-title">{node.name}</span>
        {node.pinned && <span style={{ fontSize: "0.75rem", marginLeft: "0.25rem" }}>📌</span>}
      </Link>
    </div>
  );
}

export function Sidebar({ tree }: SidebarProps) {
  return (
    <aside className="docs-sidebar">
      <div className="docs-sidebar-header" style={{ marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
          Navigation Tree
        </span>
      </div>
      <div className="docs-sidebar-tree">
        {tree.map((node) => (
          <TreeNodeItem key={node.id} node={node} depth={0} />
        ))}
      </div>
    </aside>
  );
}
