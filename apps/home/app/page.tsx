import { HomeV2 } from "./components/v2";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ExperienceTimeline } from "./components/ExperienceTimeline";
import { AppShowcase } from "./components/AppShowcase";
import styles from "./page.module.css";

interface PageProps {
  searchParams?: Promise<{ v?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isClassic = resolvedSearchParams?.v === "classic" || resolvedSearchParams?.v === "v1";

  // Classic fallback preserved intact
  if (isClassic) {
    return (
      <div className={styles.page}>
        <Navbar />
        <HeroSection />

        <div className={styles.divider} />

        <AppShowcase />

        <div className={styles.divider} />

        <ExperienceTimeline />

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              Built with
              <span className={styles.heart}>❤️</span>
              by Mohd. Rehman Baig
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

  // Redesigned Glass UI System (v2)
  return <HomeV2 />;
}
