# @repo/auth

## Description
The Auth package is a centralized authentication module for the monorepo, providing a unified way to handle user logins, sessions, and security across multiple applications. It abstracts away the complexity of authentication workflows.

## Tech Stack
- **Backend as a Service:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **Framework Compatibility:** Next.js (middleware and server components)
- **Language:** TypeScript

## Exports
- `./client`: Utilities for client-side authentication.
- `./server`: Utilities for server-side operations and API routes.
- `./middleware`: Next.js middleware for route protection.

## Upcoming Features
- Multi-provider OAuth integration (Google, GitHub, etc.).
- Role-Based Access Control (RBAC) helpers.
- Enhanced session management and token refreshing hooks.
