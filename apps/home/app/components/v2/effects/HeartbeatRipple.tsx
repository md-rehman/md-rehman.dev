"use client";

import React from "react";
import { HEARTBEAT_RIPPLE_CONFIG } from "../config/features";
import styles from "./HeartbeatRipple.module.css";

interface HeartbeatRippleProps {
  cycleDuration?: number;
  secondaryDelay?: number;
}

export function HeartbeatRipple({
  cycleDuration = HEARTBEAT_RIPPLE_CONFIG.CYCLE_DURATION_SEC,
  secondaryDelay = HEARTBEAT_RIPPLE_CONFIG.SECONDARY_PULSE_DELAY_SEC,
}: HeartbeatRippleProps) {
  const customStyles = {
    "--heartbeat-cycle": `${cycleDuration}s`,
    "--heartbeat-delay": `${secondaryDelay}s`,
  } as React.CSSProperties;

  return (
    <div className={styles.rippleContainer} style={customStyles} aria-hidden="true">
      <div className={styles.rippleWave} />
      <div className={`${styles.rippleWave} ${styles.waveSecondary}`} />
    </div>
  );
}

