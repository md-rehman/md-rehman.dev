import { ThemeSwitcher } from "../molecules/ThemeSwitcher";
import { ColorPicker } from "../molecules/ColorPicker";
import styles from "./Navbar.module.css";

export type NavLink = {
  href: string;
  icon: string;
  label: string;
};

type NavbarProps = {
  links?: NavLink[];
};

export function Navbar({ links = [] }: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={styles.navLink}
            aria-label={link.label}
            title={link.label}
          >
            <span className={styles.icon}>{link.icon}</span>
            <span className={styles.label}>{link.label}</span>
          </a>
        ))}
      </div>
      <div className={styles.controls}>
        <ColorPicker />
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
