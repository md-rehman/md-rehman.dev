"use client";

import { useState, useEffect } from "react";
import styles from "./HomeClock.module.css";

export function HomeClock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();

      // Time: HH:MM
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );

      // Date: "Friday, July 4"
      setDate(
        now.toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );

      // Greeting
      const hour = now.getHours();
      if (hour < 6) setGreeting("Late night? Rest well 🌙");
      else if (hour < 12) setGreeting("Good morning ☀️");
      else if (hour < 17) setGreeting("Good afternoon 🌤️");
      else if (hour < 21) setGreeting("Good evening 🌅");
      else setGreeting("Good night 🌙");
    };

    update();
    setMounted(true);
    const interval = setInterval(update, 10_000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <>
        <div className={styles.clock}>&nbsp;</div>
        <div className={styles.date}>&nbsp;</div>
      </>
    );
  }

  return (
    <>
      <div className={styles.clock}>{time}</div>
      <div className={styles.date}>{date}</div>
      <div className={styles.greeting}>{greeting}</div>
    </>
  );
}
