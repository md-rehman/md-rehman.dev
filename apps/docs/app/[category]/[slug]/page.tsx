import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDocBySlug, compileMarkdownToHtml, getAllDocs } from "@repo/docs-core";
import { TableOfContents } from "../../../components/TableOfContents";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { category, slug } = await params;
  const contentDir = path.join(process.cwd(), "content");
  const doc = getDocBySlug(contentDir, category, slug);

  if (!doc) return { title: "Doc Not Found — md-rehman.dev" };

  return {
    title: `${doc.frontmatter.title} — Docs`,
    description: doc.frontmatter.description || `Documentation for ${doc.frontmatter.title}`,
  };
}

export default async function DocArticlePage({ params }: PageProps) {
  const { category, slug } = await params;
  const contentDir = path.join(process.cwd(), "content");
  const doc = getDocBySlug(contentDir, category, slug);

  if (!doc) {
    notFound();
  }

  const compiledHtml = compileMarkdownToHtml(doc.content);
  const allDocs = getAllDocs(contentDir);
  const currentIndex = allDocs.findIndex((d) => d.category === category && d.slug === slug);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return (
    <>
      <main className="docs-article">
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          <Link href="/">Docs</Link>
          <span>/</span>
          <span style={{ textTransform: "capitalize" }}>{category}</span>
          <span>/</span>
          <span style={{ color: "var(--text-primary)" }}>{doc.frontmatter.title}</span>
        </div>

        {/* Header Metadata */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="docs-heading docs-h1">{doc.frontmatter.title}</h1>
          {doc.frontmatter.description && (
            <p className="docs-paragraph" style={{ fontSize: "1.125rem", color: "var(--text-secondary)" }}>
              {doc.frontmatter.description}
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "1rem" }}>
            <span>⏱️ {doc.readingTimeMinutes} min read</span>
            {doc.frontmatter.updatedAt && <span>📅 Updated {doc.frontmatter.updatedAt}</span>}
            {doc.frontmatter.author && <span>✍️ By {doc.frontmatter.author}</span>}
          </div>
        </div>

        {/* Compiled Article HTML */}
        <article
          dangerouslySetInnerHTML={{ __html: compiledHtml }}
          style={{ minHeight: "300px" }}
        />

        <hr className="docs-hr" />

        {/* Prev / Next Navigation Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
          {prevDoc ? (
            <Link
              href={`/${prevDoc.category}/${prevDoc.slug}`}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                textDecoration: "none",
                display: "block",
                maxWidth: "48%",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>← Previous</div>
              <div style={{ color: "var(--accent-cyan)", fontWeight: 600, fontSize: "0.875rem" }}>
                {prevDoc.frontmatter.title}
              </div>
            </Link>
          ) : <div />}

          {nextDoc ? (
            <Link
              href={`/${nextDoc.category}/${nextDoc.slug}`}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                textDecoration: "none",
                display: "block",
                textAlign: "right",
                maxWidth: "48%",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Next →</div>
              <div style={{ color: "var(--accent-cyan)", fontWeight: 600, fontSize: "0.875rem" }}>
                {nextDoc.frontmatter.title}
              </div>
            </Link>
          ) : <div />}
        </div>
      </main>

      {/* Right side Table of Contents */}
      <TableOfContents headings={doc.headings} />
    </>
  );
}
