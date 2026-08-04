# Planning Directory Agent Directives

> **Scope**: `content/planning/` (Task planning and lifecycle management).

## Lifecycle Pipeline
1. `todo/`: Drafted feature requests, backlogs, and unscheduled proposals.
2. `in-progress/`: Active sprint items and currently undergoing development tasks.
3. `done/`: Verified completed tasks with implementation summaries.
4. `archive/`: Deprecated or superseded plans.

## Workflow Rules & Implementation Options
When proposing an implementation plan for any feature or significant task, offer the user 3 execution options:
1. **Only add to `todo/` without implementation**: Create task markdown under `todo/`. When work starts in the future, move to `in-progress/` and update `category: "planning/in-progress"`. When completed, move to `done/` and set `category: "planning/done"`.
2. **Add to `todo/` (or `in-progress/`) and implement**: Create the task doc in `content/planning/` and immediately implement the feature.
3. **Implement without adding (Recommended Default)**: Implement code changes directly without creating a persistent task file in `content/planning/`.

- **Minor Hotfixes & Edits**: Quick hotfixes, typo fixes, and trivial edits bypass the prompt and default to Option 3 directly.
- **Default Choice**: Option 3 is the recommended default choice if no explicit selection is made.
