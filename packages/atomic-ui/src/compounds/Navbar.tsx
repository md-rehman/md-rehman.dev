import React from "react";
import { ThemeSwitcher } from "../molecules/ThemeSwitcher";
import { ColorPicker } from "../molecules/ColorPicker";
import styles from "./Navbar.module.css";

export type NavLink = {
  href: string;
  icon: string;
  label: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
};

type NavbarProps = {
  links?: NavLink[];
};

export const Navbar = React.memo(function Navbar({ links = [] }: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${styles[`size-${link.size || 'md'}`]}`}
            aria-label={link.label}
            title={link.label}
          >
            <span className={styles.icon}>
              {link.icon}
            </span>
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
});
