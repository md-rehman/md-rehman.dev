"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./AppCard.module.css";

interface AppCardProps {
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

export function AppCard({
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
}: AppCardProps) {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("a, button, [role='button']")) return;
    if (e.key === "Enter") {
      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
      }
    }
  };

  return (
    <div
      className={styles.card}
      id={`app-card-${name.toLowerCase().replace(/\s+/g, "-")}`}
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.imageWrapper}>
        {badge && <span className={styles.categoryBadge}>{badge}</span>}
        <div
          className={styles.imageContainer}
          style={imageBgColor ? { backgroundColor: imageBgColor } : undefined}
        >
          <Image
            src={imageSrc}
            alt={`${name} app preview`}
            width={400}
            height={400}
            className={styles.image}
            priority={priority}
          />
          <div className={styles.imageTintOverlay} />
        </div>
        <div className={styles.imageOverlay} />
      </div>

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

        <div
          className={`${styles.description} ${isExpanded ? styles.descriptionExpanded : ""}`}
        >
          <p>{description}</p>
        </div>

        <span
          role="button"
          tabIndex={0}
          className={styles.expandToggle}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }
          }}
          aria-label={isExpanded ? "Show less" : "Read more"}
        >
          {isExpanded ? "Show less" : "Read more"}
          <svg
            className={`${styles.expandArrow} ${isExpanded ? styles.expandArrowUp : ""}`}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>

        <div className={styles.techStack}>
          {techStack.map((tech) => (
            <span key={tech} className={styles.techBadge}>
              {tech}
            </span>
          ))}
        </div>

        <div className={styles.cardFooter}>
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={styles.visitLabel}
            onClick={(e) => e.stopPropagation()}
          >
            Visit App
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>

          {(githubUrl || npmUrl) && (
            <div className={styles.actionLinks}>
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionIconLink}
                  aria-label={`${name} GitHub repository`}
                  title="GitHub Repository"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              )}
              {npmUrl && (
                <a
                  href={npmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionIconLink}
                  aria-label={`${name} npm package`}
                  title="npm Package"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
                  </svg>
                  <span>npm</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
