import { AppCard } from "./AppCard";
import styles from "./AppShowcase.module.css";

const APPS = [
  {
    name: "TV-Set",
    description:
      "A retro TV channel-surfing experience with generative p5.js visuals and glitch effects. Flip through channels of mesmerizing procedural animations, each rendered in real-time with unique visual styles and CRT-inspired aesthetics.",
    techStack: ["Next.js", "p5.js", "Sass", "Tailwind"],
    href: "/tv-set",
    imageSrc: "/images/tv-set.png",
  },
  {
    name: "Companion",
    description:
      "A prayer and namaz activity tracker with authentication via Supabase. Track your daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha), maintain streaks, and visualize your consistency — all in a clean, focused interface.",
    techStack: ["Next.js", "Supabase", "Tailwind v4", "TypeScript"],
    href: "/companion",
    imageSrc: "/images/companion.png",
  },
  {
    name: "Planner",
    description:
      "A Kanban-style board and task planner with full authentication. Organize your workflow with draggable cards across customizable columns. Built for productivity with a clean, distraction-free design.",
    techStack: ["Next.js", "Supabase", "React", "TypeScript"],
    href: "/planner",
    imageSrc: "/images/planner.png",
  },
];

export function AppShowcase() {
  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          <span className="gradient-text">Projects</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Apps built within this monorepo — each a self-contained experience
        </p>

        <div className={styles.grid}>
          {APPS.map((app) => (
            <AppCard key={app.name} {...app} />
          ))}
        </div>
      </div>
    </section>
  );
}
