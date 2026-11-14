"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./GlassAppCard.module.css";
import { ExternalLinkIcon, GithubIcon, NpmIcon } from "../icons";
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
}

export function GlassAppCard({
  name,
  description,
  techStack,
  href,
  imageSrc,
  imageBgColor,
  priority,
  githubUrl,
  npmUrl,
}: GlassAppCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("a, button, [role='button']")) return;
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  };

  return (
    <div
      className={styles.card}
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleCardClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      }}
    >
      {/* Image Preview Container */}
      <div className={styles.imageWrapper}>
        <div
          className={styles.imageContainer}
          style={imageBgColor ? { backgroundColor: imageBgColor } : undefined}
        >
          <Image
            src={imageSrc}
            alt={`${name} app preview`}
            width={400}
            height={260}
            className={styles.image}
            priority={priority}
          />
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
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
