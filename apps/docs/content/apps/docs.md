---
title: "Docs App"
description: "NativeBase-inspired Documentation app built with Next.js 16 and @repo/docs-core"
category: "apps"
order: 6
pinned: true
localOnly: true
author: "md-rehman"
updatedAt: "2026-07-24"
---

# Documentation Application 📖

The **Docs** application (`apps/docs`) is a documentation hub for the monorepo. Built with Next.js 16 App Router and powered by `@repo/docs-core`.

> [!TIP]
> Runs on port `4003` locally and at `/docs` in production.

## Features

1. **Automatic Content Indexing**: Reads `.md` files in `apps/docs/content/` automatically.
2. **Command Palette Search**: Instant search (`⌘K`) across all documentation.
3. **Table of Contents**: Scroll-synced heading navigation.
4. **Agent History Section**: Dedicated category for pinned summaries, chat histories, and agent rules.

## Adding New Content

To add a document, create a markdown file under `apps/docs/content/<category>/<slug>.md`:

```markdown
---
title: "My New Guide"
description: "Detailed description"
category: "packages"
order: 1
---

# Title
Document body here...
```
