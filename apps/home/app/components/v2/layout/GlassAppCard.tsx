"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./GlassAppCard.module.css";
import { ExternalLinkIcon, GithubIcon, NpmIcon, CopyIcon, CheckIcon, SparklesIcon } from "../icons";
import { GlassTooltip } from "../glass/GlassTooltip";

export interface GlassAppCardProps {
  name: string;
  description: string;
  techStack: string[];
  href: string;
  imageSrc: string;
  imageBgColor?: string;
  priority?: boolean;
  badge?: string;
  githubUrl?: string;
  npmUrl?: string;
  featured?: boolean;
  categories?: string[];
  metrics?: string[];
  installCmd?: string;
  deviceFrame?: "mobile" | "browser" | "default";
}

export function GlassAppCard({
  name,
  description,
  techStack,
  href,
  imageSrc,
  imageBgColor,
  priority,
  badge,
  githubUrl,
  npmUrl,
  featured = false,
  metrics,
  installCmd,
  deviceFrame = "default",
}: GlassAppCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("a, button, [role='button']")) return;
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  };

  const handleCopyInstall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!installCmd) return;
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${featured ? styles.cardFeatured : ""}`}
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleCardClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      }}
    >
      {/* Image Preview Container */}
      <div className={`${styles.imageWrapper} ${deviceFrame === "mobile" ? styles.mobileWrapper : ""}`}>
        <div
          className={`${styles.imageContainer} ${deviceFrame === "mobile" ? styles.mobileFrame : ""}`}
          style={imageBgColor ? { backgroundColor: imageBgColor } : undefined}
        >
          {deviceFrame === "mobile" && <div className={styles.mobileSpeaker} />}
          <Image
            src={imageSrc}
            alt={`${name} app preview`}
            width={featured ? 600 : 400}
            height={featured ? 360 : 260}
            className={styles.image}
            priority={priority}
          />
        </div>

        {/* Floating Quick Install Pill for featured packages */}
        {installCmd && (
          <div className={styles.installPill} onClick={handleCopyInstall}>
            <span className={styles.terminalPrompt}>$</span>
            <code>{installCmd}</code>
            <button
              type="button"
              className={styles.copyBtn}
              aria-label="Copy install command"
              onClick={handleCopyInstall}
            >
              {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3 className={styles.appName}>
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={styles.appNameLink}
            >
              {name}
            </a>
          </h3>

          {featured && (
            <span className={styles.flagshipBadge}>
              <SparklesIcon size={12} />
              <span>{badge || "Flagship"}</span>
            </span>
          )}
        </div>

        {/* Verifiable Impact & Metric Badges */}
        {metrics && metrics.length > 0 && (
          <div className={styles.metricsRow}>
            {metrics.map((metric) => (
              <span key={metric} className={styles.metricBadge}>
                {metric}
              </span>
            ))}
          </div>
        )}

        <p className={`${styles.description} ${isExpanded ? styles.descriptionExpanded : ""}`}>
          {description}
        </p>

        {description.length > 120 && (
          <button
            type="button"
            className={styles.readMoreBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}

        <div className={styles.techStack}>
          {techStack.map((tech) => (
            <span key={tech} className={styles.techTag}>
              {tech}
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          {githubUrl && (
            <GlassTooltip content="GitHub Repository" placement="top">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionBtn}
                aria-label={`${name} GitHub`}
                onClick={(e) => e.stopPropagation()}
              >
                <GithubIcon size={15} />
                <span>Source</span>
              </a>
            </GlassTooltip>
          )}

          {npmUrl && (
            <GlassTooltip content="npm Package" placement="top">
              <a
                href={npmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionBtn}
                aria-label={`${name} npm`}
                onClick={(e) => e.stopPropagation()}
              >
                <NpmIcon size={15} />
                <span>npm</span>
              </a>
            </GlassTooltip>
          )}

          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            onClick={(e) => e.stopPropagation()}
          >
            <span>Launch</span>
            <ExternalLinkIcon size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
