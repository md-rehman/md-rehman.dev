"use client";

import React from "react";
import { AppModal } from "./AppModal";
import styles from "./AppTray.module.css";

export type AppItem = {
  id: string;
  icon: string;
  label: string;
  accentColor: string;
};

export const APPS: AppItem[] = [
  { id: "prayers", icon: "🕌", label: "Prayers", accentColor: "#00ffc8" },
  { id: "prayer-strict", icon: "📿", label: "Prayer Strict", accentColor: "#7c4dff" },
  { id: "quran", icon: "📖", label: "Quran", accentColor: "#ffea00" },
  { id: "calendar", icon: "📅", label: "Calendar", accentColor: "#ff0080" },
  { id: "notes", icon: "📝", label: "Notes", accentColor: "#00b8ff" },
  { id: "settings", icon: "⚙️", label: "Settings", accentColor: "#d500f9" },
  { id: "profile", icon: "👤", label: "Profile", accentColor: "#39ff14" },
];

interface AppTrayProps {
  activeApp?: AppItem | null;
  onSelectApp?: (app: AppItem | null) => void;
}

export const AppTray = React.memo(function AppTray({ activeApp: externalActiveApp, onSelectApp }: AppTrayProps) {
  const [internalActiveApp, setInternalActiveApp] = React.useState<AppItem | null>(null);

  const activeApp = externalActiveApp !== undefined ? externalActiveApp : internalActiveApp;
  const setActiveApp = onSelectApp || setInternalActiveApp;

  return (
    <>
      <div className={styles.dock}>
        <div className={styles.dockInner}>
          {APPS.map((app) => (
            <button
              key={app.id}
              className={styles.dockItem}
              onClick={() => setActiveApp(app)}
              aria-label={`Open ${app.label}`}
              title={app.label}
            >
              <span className={styles.dockIcon}>{app.icon}</span>
              <span className={styles.dockLabel}>{app.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AppModal
        isOpen={activeApp !== null}
        onClose={() => setActiveApp(null)}
        appId={activeApp?.id}
        icon={activeApp?.icon ?? ""}
        label={activeApp?.label ?? ""}
        accentColor={activeApp?.accentColor}
      />
    </>
  );
});
