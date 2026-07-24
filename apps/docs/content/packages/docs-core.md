---
title: "Docs Core Package"
description: "Core MDX & Markdown document parsing engine for docs app"
category: "packages"
order: 3
pinned: true
author: "md-rehman"
updatedAt: "2026-07-24"
---

# `@repo/docs-core` 🛠️

Core MDX and Markdown engine driving document scanning, frontmatter parsing (`gray-matter`), TOC generation, search indexing, and markdown HTML compilation.

## Functions

- `getAllDocs(contentDir)`: Scans content directory and returns ordered array of documents.
- `getDocBySlug(contentDir, category, slug)`: Retrieves single document with frontmatter and compiled headings.
- `getSidebarCategories(contentDir)`: Constructs category tree for sidebar navigation.
- `searchDocs(contentDir, query)`: Performs fast string matching search across documents.
- `compileMarkdownToHtml(markdown)`: Compiles raw markdown into HTML with GitHub callouts (`> [!NOTE]`), tables, and syntax code blocks.
