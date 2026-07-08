import { redirect } from "next/navigation";
import { createClient } from "@repo/auth/server";
import { Board } from "@/components/Board";
import { SignOutButton } from "@/components/SignOutButton";
import styles from "./page.module.css";

export default async function PlannerPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <span className={styles.brandName}>Planner</span>
        </div>

        <div className={styles.headerRight}>
          {user && (
            <span className={styles.userEmail}>{user.email}</span>
          )}
          <SignOutButton />
        </div>
      </header>

      <main className={styles.main}>
        <Board />
      </main>
    </div>
  );
}
