"use client";

import { useAuth } from "@/providers/Auth";
import { createClient } from "@repo/auth/client";
import { useRouter } from "next/navigation";
import styles from "./ProfileBody.module.css";

export function ProfileBody({ accentColor }: { accentColor?: string }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <p className={styles.message}>You're not logged in</p>
        <button className={styles.button} onClick={handleLogin}>
          Go to Login
        </button>
      </div>
    );
  }

  const initial = user.email ? user.email.charAt(0).toUpperCase() : "?";

  return (
    <div className={styles.container}>
      <div 
        className={styles.avatar} 
        style={accentColor ? { boxShadow: `0 0 20px ${accentColor}`, borderColor: accentColor } : undefined}
      >
        {initial}
      </div>
      <p className={styles.email}>{user.email}</p>
      <button className={styles.button} onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}
