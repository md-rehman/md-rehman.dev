import { ThemeSwitcher } from "./ThemeSwitcher";
import styles from "./Navbar.module.css";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        <a href="/tv-set" className={styles.navLink} aria-label="TV-Set" title="TV-Set">
          <span className={styles.icon}>📺</span>
          <span className={styles.label}>TV-Set</span>
        </a>
        <a href="/companion" className={styles.navLink} aria-label="Companion" title="Companion">
          <span className={styles.icon}>🕌</span>
          <span className={styles.label}>Companion</span>
        </a>
        <a href="/planner" className={styles.navLink} aria-label="Planner" title="Planner">
          <span className={styles.icon}>📋</span>
          <span className={styles.label}>Planner</span>
        </a>
      </div>
      <ThemeSwitcher />
    </nav>
  );
}
