---
title: "Graphify Commands & Dependency Graph Guide"
description: "All required CLI commands for running, updating, querying, and visualizing monorepo graphs using Graphify"
category: "agents"
order: 5
pinned: true
author: "Antigravity AI"
updatedAt: "2026-07-25"
---

# Graphify Commands & Monorepo Graphing 🕸️

`graphify` is an AST + semantic code graph analysis tool used to track monorepo dependencies, architectural god-nodes, and impact paths in **md-rehman.dev**.

> [!IMPORTANT]
> Always check `graphify-out/GRAPH_REPORT.md` before making architectural decisions or proposing refactors to understand monorepo dependencies.

---

## 🚀 Quick Command Reference

### 1. Generating & Updating Graphs

| Action | Command | Description |
| :--- | :--- | :--- |
| **Incremental Update (Fast)** | `graphify update .` | Re-extracts local AST code changes without needing an LLM key. |
| **Force Re-Extraction** | `graphify update . --force` | Overwrites `graph.json` even if a refactor deleted code files. |
| **Full AI Extraction** | `graphify extract .` | Full AST + semantic LLM extraction for initial setup or deep indexing. |
| **Code-Only Extraction** | `graphify extract . --code-only` | Index code files (local AST) and skip doc/paper/image files. |
| **Watch Mode** | `graphify watch .` | Watches the workspace and automatically rebuilds the graph on save. |

---

### 2. Querying & Impact Analysis

| Action | Command | Description |
| :--- | :--- | :--- |
| **Query Dependencies** | `graphify query "How is companion connected to docs-core?"` | Traverses `graph.json` to answer architectural questions. |
| **Node Explanation** | `graphify explain "apps/companion-expo/components/DateRulerV3.tsx"` | Plain-language breakdown of a file/symbol and its direct neighbors. |
| **Impact Analysis** | `graphify affected "packages/auth"` | Finds all downstream nodes & apps impacted by changes to a component/package. |
| **Shortest Path** | `graphify path "apps/home" "packages/docs-core"` | Displays the shortest dependency chain between two files or modules. |

---

### 3. Graph Visualization

| Action | Command | Description |
| :--- | :--- | :--- |
| **Collapsible Tree HTML** | `graphify tree` | Generates a D3 v7 interactive tree chart at `graphify-out/GRAPH_TREE.html`. |
| **Call-Flow Diagram** | `graphify export callflow-html` | Exports a Mermaid-based architecture & call-flow diagram. |

---

### 4. Integration & Agent Skill Setup

| Action | Command | Description |
| :--- | :--- | :--- |
| **Google Antigravity** | `graphify antigravity install` | Installs Graphify skills, workflows, and rules for Antigravity AI. |
| **Git Hooks** | `graphify hook install` | Installs post-commit & post-checkout git hooks for auto-updating graphs. |
| **Check Update Status** | `graphify check-update .` | Cron-safe check to verify if graph re-extraction is pending. |

---

## 📁 Key Output Files (`graphify-out/`)

* 📄 `graphify-out/GRAPH_REPORT.md`: Comprehensive Markdown report summarizing monorepo clusters, hubs, and metrics.
* 🌐 `graphify-out/graph.html`: Interactive web visualization of the monorepo graph.
* 🌳 `graphify-out/GRAPH_TREE.html`: D3 collapsible hierarchy view.
* 📊 `graphify-out/graph.json`: Machine-readable node and edge dependency payload.
