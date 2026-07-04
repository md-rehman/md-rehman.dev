import { login, signup } from "./actions";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <div className={styles.card}>
        <div className={styles.branding}>
          <span className={styles.brandIcon}>🕌</span>
          <span className={styles.brandName}>Companion</span>
        </div>

        <h2 className={styles.title}>Welcome Back</h2>

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

            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>or</span>
              <span className={styles.dividerLine} />
            </div>

            <button
              className={styles.btnSecondary}
              formAction={signup}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
