"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@repo/atomic-ui/compounds";
import styles from "../login/page.module.css";

const ERROR_MESSAGES = [
  "Looks like we took a wrong turn at Albuquerque.",
  "Well, this is awkward...",
  "Houston, we have a problem.",
  "The server is on a coffee break. Please try again later.",
  "We've dispatched our best digital monkeys to fix this.",
  "Error 404: Sense of direction not found.",
  "Something went wrong, but at least you look great today!",
  "A wild Error appeared! It was super effective.",
  "Our hamsters running the server wheel need a breather.",
  "We're currently experiencing a disturbance in the Force.",
  "Did you try turning it off and on again?",
  "This wasn't supposed to happen. Blame it on the weather.",
  "The electrons got lost on their way to your screen.",
  "Our highly trained ninjas couldn't find the page.",
  "I swear it was working on my machine...",
  "Don't panic! It's just a tiny hiccup in the space-time continuum.",
  "The server tripped over a wire. We're getting it a band-aid.",
  "Looks like the internet elves are on strike today.",
  "You've found our secret error page! Your prize is... disappointment.",
  "My code never has bugs, it just develops random unexpected features."
];

export default function ErrorPage() {
  const [message, setMessage] = useState("Sorry, something went wrong.");

  useEffect(() => {
    const randomMsg = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
    setMessage(randomMsg);
  }, []);

  return (
    <>
      <Navbar links={[]} />
      <div className={styles.loginPage}>
        <div className={styles.card}>
          <div className={styles.branding}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ margin: "0 auto", display: "block", color: "var(--color-text-dim, #888)" }}
            >
              <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/>
              <path d="m13 11-4 5h6l-4 5"/>
            </svg>
          </div>

          <h2 className={styles.title} style={{ marginTop: "1rem" }}>Oops!</h2>

          <div style={{ textAlign: "center", marginBottom: "2rem", color: "var(--color-text-dim, #888)" }}>
            <p>{message}</p>
          </div>

          <div className={styles.actions}>
            <Link
              href="/"
              className={styles.btnPrimary}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
