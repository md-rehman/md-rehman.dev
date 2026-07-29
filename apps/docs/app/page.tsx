import Link from "next/link";
import path from "path";
import { getAllDocs } from "@repo/docs-core";

export default function Home() {
  const contentDir = path.join(process.cwd(), "content");
  const allDocs = getAllDocs(contentDir);
  const pinnedDocs = allDocs.filter((d) => d.frontmatter.pinned);

  return (
    <main className="docs-article">
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 className="docs-heading docs-h1" style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
          Documentation Hub 📖
        </h1>
        <p className="docs-paragraph" style={{ fontSize: "1.125rem", color: "var(--text-secondary)" }}>
          Centralized documentation engine for <strong>md-rehman.dev</strong> monorepo. Explore full architectures, package references, and AI agent session history.
        </p>
      </div>

      {/* Hero Category Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
        <Link href="/apps/companion" style={{ textDecoration: "none" }}>
          <div style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📱</div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem", fontSize: "1.125rem" }}>Monorepo Apps</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.5" }}>
              Companion, Planner, TV-Set, Companion Expo, Home landing page.
            </p>
          </div>
        </Link>

        <Link href="/packages/atomic-ui" style={{ textDecoration: "none" }}>
          <div style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📦</div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem", fontSize: "1.125rem" }}>Shared Packages</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.5" }}>
              Atomic UI, Auth, Backend, Shell, Docs Core, TypeScript configs.
            </p>
          </div>
        </Link>

        <Link href="/agents/pinned-summary" style={{ textDecoration: "none" }}>
          <div style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🤖</div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem", fontSize: "1.125rem" }}>AI Agents & Transcripts</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.5" }}>
              Pinned architectural decisions, chat logs, rules, and system context.
            </p>
          </div>
        </Link>
      </div>

      {/* Pinned / Featured Docs */}
      {pinnedDocs.length > 0 && (
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="docs-heading docs-h2">📌 Pinned Summaries</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {pinnedDocs.map((doc) => (
              <Link
                key={`${doc.category}-${doc.slug}`}
                href={`/${doc.category}/${doc.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "0.5rem",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div>
                    <h4 style={{ color: "var(--accent-cyan)", fontSize: "1rem", marginBottom: "0.25rem" }}>
                      {doc.frontmatter.title}
                    </h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {doc.frontmatter.description}
                    </p>
                  </div>
                  <span className="docs-badge">{doc.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Documents Quick List */}
      <section>
        <h2 className="docs-heading docs-h2">📄 All Documentation ({allDocs.length})</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.85rem" }}>
          {allDocs.map((doc) => (
            <Link
              key={`${doc.category}-${doc.slug}`}
              href={`/${doc.category}/${doc.slug}`}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "0.5rem",
                padding: "0.85rem 1rem",
                display: "block",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontWeight: 600, textTransform: "uppercase", marginBottom: "0.2rem" }}>
                {doc.category}
              </div>
              <div style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.9375rem" }}>
                {doc.frontmatter.title}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
