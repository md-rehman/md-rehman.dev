"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./AppCard.module.css";

interface AppCardProps {
  name: string;
  description: string;
  techStack: string[];
  href: string;
  imageSrc: string;
}

export function AppCard({
  name,
  description,
  techStack,
  href,
  imageSrc,
}: AppCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <a
      href={href}
      className={styles.card}
      id={`app-card-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt={`${name} app preview`}
          width={400}
          height={400}
          className={styles.image}
        />
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.appName}>{name}</h3>

        <div
          className={`${styles.description} ${isExpanded ? styles.descriptionExpanded : ""}`}
        >
          <p>{description}</p>
        </div>

        <button
          className={styles.expandToggle}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
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
        </button>

        <div className={styles.techStack}>
          {techStack.map((tech) => (
            <span key={tech} className={styles.techBadge}>
              {tech}
            </span>
          ))}
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.visitLabel}>
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
          </span>
        </div>
      </div>
    </a>
  );
}
