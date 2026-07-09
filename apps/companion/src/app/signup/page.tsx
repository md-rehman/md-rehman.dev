import { signup } from "./actions";
import Link from "next/link";
import { Navbar } from "@repo/atomic-ui/compounds";
import styles from "../login/page.module.css";

import { NavLink } from "@repo/atomic-ui/compounds";
import Image from "next/image";
import companionImg from "../../../public/images/Companion.png";

const COMPANION_LINKS: NavLink[] = [
  { href: "/", icon: "🏠", label: "Home", size: "md" },
  { href: "/tv-set", icon: "📺", label: "TV-Set", size: "md" },
  { href: "/planner", icon: "📋", label: "Planner", size: "md" },
];

export default function SignupPage() {
  return (
    <>
      <Navbar links={[]} />
      <div className={styles.loginPage}>
        <div className={styles.card}>
          <div className={styles.branding}>
            <Image
              src={companionImg}
              alt="Companion Logo"
              width={96}
              height={96}
              priority
              className={styles.brandIcon}
              style={{ width: "auto", height: "auto", margin: "0 auto", borderRadius: "24px" }}
            />
          </div>

          <h2 className={styles.title}>Create Account</h2>

          <form className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email Address
              </label>
              <input
                className={styles.input}
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                className={styles.input}
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <div className={styles.actions}>
              <button
                className={styles.btnPrimary}
                formAction={signup}
              >
                Sign up
              </button>

              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>or</span>
                <span className={styles.dividerLine} />
              </div>

              <Link
                href="/login"
                className={styles.btnSecondary}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
              >
                Already have an account? Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
