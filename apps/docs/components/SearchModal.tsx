"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SearchDocResult } from "@repo/docs-core";

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchDocResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/docs/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="docs-modal-overlay" onClick={onClose}>
      <div className="docs-modal" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className="docs-modal-input"
          placeholder="Search all documentation (e.g., companion, auth, agent rules)..."
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="docs-modal-results">
          {loading && <div style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>Searching...</div>}
          {!loading && results.length === 0 && query && (
            <div style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
              No documents matching &quot;{query}&quot;
            </div>
          )}
          {results.map((r) => (
            <Link
              key={`${r.category}-${r.slug}`}
              href={`/${r.category}/${r.slug}`}
              className="docs-search-item"
              onClick={onClose}
            >
              <div className="docs-search-item-title">{r.title}</div>
              <div className="docs-search-item-snippet">{r.matchSnippet || r.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
