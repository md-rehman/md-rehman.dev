---
title: "Docs Core Package"
description: "Core MDX & Markdown document parsing engine for docs app"
category: "packages"
order: 3
pinned: true
localOnly: true
author: "md-rehman"
updatedAt: "2026-07-24"
---

# `@repo/docs-core` 🛠️

Core MDX and Markdown engine driving document scanning, frontmatter parsing (`gray-matter`), TOC generation, search indexing, and markdown HTML compilation.

## Frontmatter Properties

- `title`: Document title.
- `description`: Subtitle or description.
- `category`: Category name (e.g., `apps`, `packages`, `agents`).
- `order`: Numeric order in sidebar and navigation footer.
- `pinned`: Boolean to display doc on home page hero.
- `localOnly`: Boolean flag (`true` / `false`). When `true`, document is only visible in local development mode or when `DOCS_ENV=local`. Excluded from production builds.

## Functions

- `getAllDocs(contentDir, options)`: Scans content directory and returns ordered array of documents. Automatically filters `localOnly` docs in production.
- `getDocBySlug(contentDir, category, slug, options)`: Retrieves single document with frontmatter and compiled headings. Returns `null` if document is `localOnly` in production.
- `getSidebarCategories(contentDir, options)`: Constructs category tree for sidebar navigation, omitting empty categories in production.
- `searchDocs(contentDir, query, options)`: Performs fast string matching search across documents.
- `compileMarkdownToHtml(markdown)`: Compiles raw markdown into HTML with GitHub callouts (`> [!NOTE]`), tables, and syntax code blocks.
