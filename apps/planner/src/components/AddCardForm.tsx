"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./AddCardForm.module.css";

interface AddCardFormProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

export function AddCardForm({ onSubmit, onCancel }: AddCardFormProps) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit() {
    const trimmed = title.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setTitle("");
    }
  }

  return (
    <div className={styles.form}>
      <textarea
        ref={inputRef}
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
          if (e.key === "Escape") {
            onCancel();
          }
        }}
        placeholder="Enter a title for this card…"
        rows={2}
      />
      <div className={styles.actions}>
        <button onClick={handleSubmit} className={styles.submitBtn}>
          Add card
        </button>
        <button onClick={onCancel} className={styles.cancelBtn} title="Cancel">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
