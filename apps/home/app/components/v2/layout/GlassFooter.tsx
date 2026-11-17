"use client";

import React from "react";
import styles from "./GlassFooter.module.css";

export function GlassFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>
          Built with <span className={styles.heart}>❤️</span> by Mohd. Rehman Baig
        </p>

        <div className={styles.footerLinks}>
          <a
            href="https://github.com/md-rehman"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            GitHub
          </a>
          <span className={styles.footerDot}>·</span>
          <a
            href="https://linkedin.com/in/md-rehman"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            LinkedIn
          </a>
          <span className={styles.footerDot}>·</span>
          <a href="mailto:rehman.2468@gmail.com" className={styles.footerLink}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
