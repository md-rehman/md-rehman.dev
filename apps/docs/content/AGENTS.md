# Documentation Hub Agent Directives

> **Scope**: Root `content/` directory and all nested documentation folders.

## Purpose & Overview
This directory serves as the centralized Documentation, Planning, and Information Hub for **md-rehman.dev** monorepo, shared between human developers and AI agents.

## Core Rules for AI Agents
1. **Directory Taxonomy**:
   - `info-hub/`: Architectural specifications and technical references for applications (`info-hub/apps/`) and packages (`info-hub/packages/`).
   - `planning/`: Task lifecycle folders (`planning/todo/`, `planning/in-progress/`, `planning/done/`, `planning/archive/`).
   - `agents/`: System prompts, rules, transcripts, and AI agent session logs.
2. **Markdown Standards**:
   - Every document must include YAML frontmatter (`title`, `description`, `category`, `order`, `pinned`, `localOnly`, `author`, `updatedAt`).
   - Use GitHub-style callouts (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`).
   - Keep heading hierarchy semantic (`#`, `##`, `###`).
3. **No Unstructured Edits**: Always maintain valid markdown syntax and preserve existing metadata schemas when modifying files.
4. **Internal / Local Scope**: The `docs` app (`apps/docs`) is strictly for local development and internal workspace tracking. Never apply production SEO metadata, sitemap entries, or public search indexing changes to the `docs` app.
