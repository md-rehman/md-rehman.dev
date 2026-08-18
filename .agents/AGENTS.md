# AI Agent Rules

- Always read `graphify-out/GRAPH_REPORT.md` before making architectural decisions or proposing refactors to understand the monorepo dependencies.
- Always share an implementation plan before making significant changes, and ask clarifying questions if the requirements are not entirely clear.
- Use the `apps/docs/content/planning/` directory (`todo/`, `in-progress/`, `done/`, `archive/`) for task tracking and feature planning. When presenting an implementation plan for any feature or significant change, present the user with the following choices:
  1. **Only add to `todo/` without implementation**: Create the task document under `apps/docs/content/planning/todo/` for future scheduling. When implemented later, update its location and frontmatter status (`todo/` → `in-progress/` → `done/`).
  2. **Add to `todo/` (or `in-progress/`) and implement**: Create the task document in the planning directory and proceed with immediate implementation.
  3. **Implement without adding (Recommended Default)**: Implement the changes directly without creating a persistent task file in `apps/docs/content/planning/`.

- **Hotfixes & Minor Edits**: Minor hotfixes, typo fixes, formatting tweaks, or quick bugfixes bypass the prompt and default directly to Option 3 (immediate implementation).
- **Default Selection**: Option 3 ("Implement without adding") is designated as the recommended default choice if no explicit selection is made.
- **Docs App Scope (`apps/docs`)**: The `docs` application is strictly for internal development, task planning, and local workspace documentation. Do not apply production SEO metadata, sitemap entries, or public indexing updates to `apps/docs`.
- **Conventional Commits**: Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:`, `chore:`, `revert:`) for all commit messages.
- **Granular Commits**: When committing changes, split work into separate, logical, and granular commits based on concerns or packages rather than creating monolithic commits.
- **Commit Confirmation**: Do NOT commit changes automatically. Always ask for user confirmation before executing `git commit`.
