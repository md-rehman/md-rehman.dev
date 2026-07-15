# MD-REHMAN.DEV Monorepo

## Description
This is a Turborepo-powered monorepo where I keep all my experiments, full-stack applications, and reusable packages. It serves as a centralized workspace for managing my portfolio, side projects, and shared UI libraries.

## Tech Stack
- **Monorepo Management:** Turborepo, Yarn Workspaces
- **Core Frameworks:** Next.js, React
- **Languages:** TypeScript, JavaScript
- **Styling:** Tailwind CSS, Sass
- **Tooling:** ESLint, Prettier

## Included Apps
- **TVSet:** Portfolio app mimicking a retro TV experience (Port 3011).
- **Home:** Main landing hub (Port 4000).
- **Planner:** Trello clone for task management (Port 4002).
- **Companion:** Personal assistant application (Port 3012).
- **Companion Expo:** Mobile app version of the personal assistant (Expo / React Native).
- **Empty / Web / Docs:** Various template and documentation projects.

## Included Packages
- **@repo/atomic-ui:** Component library based on Atomic Design.
- **@repo/auth:** Supabase authentication utilities.
- **@repo/ui, @repo/channel, @repo/shell:** Other shared UI and utility packages.

## Naming Guidelines & Ports

| **App Name**     | **Port** | **Notes**                                    |
| ---------------- | -------- | -------------------------------------------- |
| `tv-set`         | `3011`   | Portfolio                                    |
| `companion`      | `3001`   | -                                            |
| `companion-expo` | `8081`   | Mobile App (Expo default port)               |
| `home`           | `4000`   | Home page                                    |
| `doc`            | `4001`   | -                                            |
| `planner`        | `4002`   | Trello clone                                 |
| `empty`          | `5000`   | Just an empty project to be used as template |
| `web`            | `5001`   | -                                            |

_NOTE: Deployed (stable projects) app will use `3***` ports, experimental (unfinished or underdeveloped) apps will `4***` ports and randoms for testing will use `5***` ports._
