import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Companion Expo | Mohd. Rehman Baig",
  description: "A beautiful prayer tracking mobile app built with Expo and React Native.",
};

export default function CompanionExpoPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/#projects" className={styles.backLink}>
          ← Back to Projects
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>Companion Expo</h1>
          <p className={styles.subtitle}>
            The mobile companion for your daily prayers. Track your namaz activity,
            maintain streaks, and visualize your consistency natively on Android and iOS.
            Built with Expo, React Native, and Supabase.
          </p>
          <a
            href="https://expo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.downloadButton}
          >
            Download via EAS
          </a>
        </header>

        <div className={styles.mediaGrid}>
          <div className={styles.mediaCard}>
            <h2 className={styles.mediaTitle}>App Preview</h2>
            <div className={styles.mediaPlaceholder}>
              {/* Replace with actual image or gif */}
              <p>GIF Placeholder</p>
            </div>
          </div>
          <div className={styles.mediaCard}>
            <h2 className={styles.mediaTitle}>Walkthrough Video</h2>
            <div className={styles.mediaPlaceholder}>
              {/* Replace with actual video */}
              <p>Video Placeholder</p>
            </div>
          </div>
        </div>

        <section className={styles.easSection}>
          <h2 className={styles.easTitle}>Install on your Device</h2>
          <p className={styles.easText}>
            Scan the QR code below or click the link to download the latest Android APK
            directly from Expo Application Services (EAS).
          </p>
          <div className={styles.qrPlaceholder}>
            QR Code
          </div>
        </section>
      </div>
    </div>
  );
}
