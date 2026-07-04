import { Navbar } from "@repo/atomic-ui/compounds";
import { HomeClock } from "@/components/page/home/HomeClock";
import { AppTray } from "@/components/page/home/AppTray";
import styles from "./page.module.css";

const COMPANION_LINKS = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/companion/prayers", icon: "🕌", label: "Prayers" },
  { href: "/companion/prayers_strict", icon: "📿", label: "Strict" },
];

export default function Home() {
  return (
    <div className={styles.homescreen}>
      <Navbar links={COMPANION_LINKS} />

      <div className={styles.centerContent}>
        <HomeClock />
      </div>

      <AppTray />
    </div>
  );
}
