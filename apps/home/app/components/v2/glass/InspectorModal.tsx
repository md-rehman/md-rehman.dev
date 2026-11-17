"use client";

import React from "react";
import { GlassModal } from "./GlassModal";
import { useUIPreferences } from "../context/UIPreferencesContext";
import { BACKGROUND_PATTERNS } from "../background/patterns";
import { LayersIcon, CheckIcon } from "../icons";

export function InspectorModal() {
  const { isModalOpen, closeModal, pattern, setPattern } = useUIPreferences();

  if (!isModalOpen) return null;

  return (
    <GlassModal
      id="home-glass-inspector"
      title="Glass & Canvas Inspector"
      icon={<LayersIcon size={16} />}
      badge="Interactive"
      onClose={closeModal}
      defaultPosition={{ x: 24, y: 100 }}
      width={320}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--glass-text-muted)",
              marginBottom: 8,
            }}
          >
            Select Canvas Pattern
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: "360px",
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {BACKGROUND_PATTERNS.map((p) => {
              const isActive = pattern === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPattern(p.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm, 8px)",
                    background: isActive
                      ? "rgba(var(--color-accent-rgb, 10, 132, 255), 0.15)"
                      : "var(--color-surface)",
                    border: isActive
                      ? "1px solid var(--color-accent)"
                      : "1px solid var(--glass-border)",
                    color: isActive
                      ? "var(--color-accent)"
                      : "var(--color-text-primary)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                    <div
                      style={{
                        fontSize: "0.825rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--glass-text-secondary)",
                        marginTop: 2,
                      }}
                    >
                      {p.badge}
                    </div>
                  </div>
                  {isActive && <CheckIcon size={16} />}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: "var(--radius-sm, 8px)",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--glass-border)",
            fontSize: "0.75rem",
            lineHeight: 1.5,
            color: "var(--glass-text-secondary)",
          }}
        >
          💡 <strong>Pro-Tip:</strong> Try dragging this modal by its header to the left or right edge of the screen to snap and dock it as a compact edge tab!
        </div>
      </div>
    </GlassModal>
  );
}

