import { login } from "./actions";
import { loginAsGuest } from "@repo/auth";
import Link from "next/link";
import { Navbar } from "@repo/atomic-ui/compounds";
import styles from "./page.module.css";


import { NavLink } from "@repo/atomic-ui/compounds";
import Image from "next/image";
import companionImg from "../../../public/images/Companion.png";

const COMPANION_LINKS: NavLink[] = [
  { href: "/", icon: "🏠", label: "Home", size: "md" },
  // { href: "/tv-set", icon: "📺", label: "TV-Set", size: "md" },
  // { href: "/planner", icon: "📋", label: "Planner", size: "md" },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

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
              style={{ width: "auto", height: "auto", margin: "0 auto" }}
            />
          </div>

          <h2 className={styles.title}>Welcome Back</h2>

          {error && (
            <div style={{ padding: "10px", margin: "10px 0", borderRadius: "6px", backgroundColor: "#fee2e2", color: "#991b1b", fontSize: "14px", textAlign: "center" }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{ padding: "10px", margin: "10px 0", borderRadius: "6px", backgroundColor: "#e0f2fe", color: "#075985", fontSize: "14px", textAlign: "center" }}>
              {message}
            </div>
          )}


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
                formAction={login}
              >
                Log in
              </button>

              <button
                type="submit"
                formNoValidate
                className={styles.btnSecondary}
                formAction={loginAsGuest}
                style={{ width: "100%", marginTop: "8px" }}
              >
                👤 Continue as Guest
              </button>

              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>or</span>
                <span className={styles.dividerLine} />
              </div>

              <Link
                href="/signup"
                className={styles.btnSecondary}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
              >
                New here? Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
