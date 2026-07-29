---
title: "Agent Rules & Directives"
description: "Repository-specific agent directives from AGENTS.md and customization roots"
category: "agents"
order: 3
pinned: false
localOnly: true
author: "Antigravity AI"
updatedAt: "2026-07-24"
---

# Repository Agent Rules 📏

Rules defined in `.agents/AGENTS.md` and global settings that AI assistants must adhere to:

```markdown
# AI Agent Rules

- Always read `graphify-out/GRAPH_REPORT.md` before making architectural decisions or proposing refactors to understand the monorepo dependencies.
- Always share an implementation plan before making significant changes, and ask clarifying questions if the requirements are not entirely clear.
```

## Quality Enforcement Checklist

- [x] Run `yarn build` or `yarn lint` to verify code changes before claiming success.
- [x] Maintain docstring and documentation integrity.
- [x] Create clickable markdown links for all modified files using `file://` URLs.
