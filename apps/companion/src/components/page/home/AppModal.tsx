import { useEffect, useRef } from "react";
import styles from "./AppModal.module.css";
import { ProfileBody } from "./modal-bodies/ProfileBody";

type AppBodyProps = {
  accentColor?: string;
};

const APP_BODY_REGISTRY: Record<string, React.ComponentType<AppBodyProps>> = {
  profile: ProfileBody,
};

type AppModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appId?: string;
  icon: string;
  label: string;
  accentColor?: string;
};

export function AppModal({ isOpen, onClose, appId, icon, label, accentColor }: AppModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.window}>
        {/* ── macOS-style Title Bar ── */}
        <div className={styles.titleBar}>
          <div className={styles.trafficLights}>
            <button
              className={`${styles.trafficBtn} ${styles.close}`}
              onClick={onClose}
              aria-label="Close"
              title="Close"
            >
              <svg width="6" height="6" viewBox="0 0 6 6">
                <path d="M0.5 0.5L5.5 5.5M5.5 0.5L0.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            <span className={`${styles.trafficBtn} ${styles.minimize}`} />
            <span className={`${styles.trafficBtn} ${styles.maximize}`} />
          </div>
          <div className={styles.titleCenter}>
            <span className={styles.titleIcon}>{icon}</span>
            <span className={styles.titleText}>{label}</span>
          </div>
          <div className={styles.titleSpacer} />
        </div>

        {/* ── Window Body ── */}
        <div className={styles.body}>
          {appId && APP_BODY_REGISTRY[appId] ? (
            (() => {
              const BodyComponent = APP_BODY_REGISTRY[appId];
              return <BodyComponent accentColor={accentColor} />;
            })()
          ) : (
            <div className={styles.emptyState}>
              <span
                className={styles.emptyIcon}
                style={accentColor ? { filter: `drop-shadow(0 0 20px ${accentColor})` } : undefined}
              >
                {icon}
              </span>
              <p className={styles.emptyTitle}>{label}</p>
              <p className={styles.emptyDesc}>Coming soon — this feature is under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
