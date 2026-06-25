import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { AppShowcase } from "./components/AppShowcase";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />
      <HeroSection />

      <div className={styles.divider} />

      <ExperienceTimeline />

      <div className={styles.divider} />

      <AppShowcase />

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            Built with{" "}
            <span className={styles.heart}>❤️</span>{" "}
            using Next.js & Turborepo
          </p>
          <div className={styles.footerLinks}>
            <a
              href="https://github.com/md-rehman"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <span className={styles.footerDot}>·</span>
            <a
              href="https://linkedin.com/in/md-rehman"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <span className={styles.footerDot}>·</span>
            <a href="mailto:rehman.2468@gmail.com">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
