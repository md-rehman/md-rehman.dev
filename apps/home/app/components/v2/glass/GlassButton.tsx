"use client";

import React from "react";
import styles from "./GlassButton.module.css";
import { GlassTooltip } from "./GlassTooltip";

export interface GlassButtonProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "pill" | "icon" | "cta" | "chip";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  target?: string;
  rel?: string;
  tooltip?: React.ReactNode;
  tooltipPlacement?: "top" | "bottom";
  ariaLabel?: string;
  title?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function GlassButton({
  children,
  icon,
  variant = "pill",
  size = "md",
  active = false,
  className = "",
  onClick,
  href,
  target,
  rel,
  tooltip,
  tooltipPlacement = "bottom",
  ariaLabel,
  title,
  disabled,
  type = "button",
}: GlassButtonProps) {
  const combinedClasses = [
    styles.button,
    styles[variant],
    styles[size],
    active ? styles.active : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon}
      {children && <span>{children}</span>}
    </>
  );

  let element: React.ReactElement;

  if (href) {
    element = (
      <a
        href={href}
        target={target}
        rel={rel || (target === "_blank" ? "noopener noreferrer" : undefined)}
        className={combinedClasses}
        onClick={onClick}
        aria-label={ariaLabel}
        title={tooltip ? undefined : title}
      >
        {content}
      </a>
    );
  } else {
    element = (
      <button
        type={type}
        className={combinedClasses}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        title={tooltip ? undefined : title}
      >
        {content}
      </button>
    );
  }

  if (tooltip) {
    return (
      <GlassTooltip content={tooltip} placement={tooltipPlacement}>
        {element}
      </GlassTooltip>
    );
  }

  return element;
}

