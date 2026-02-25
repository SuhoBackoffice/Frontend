# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build
npm run lint       # ESLint check
npm run lint:fix   # Auto-fix lint issues
npm run format     # Format with Prettier
```

Environment: requires `.env` with `NEXT_PUBLIC_API_SERVER_URL=http://localhost:8080` and a running backend.

## Architecture

**Suho Tech Logistics Automation System** — A Next.js 16 App Router application (TypeScript) for managing logistics/production projects.

### Tech Stack
- **UI**: shadcn/ui + Radix UI + Tailwind CSS v4 + Lucide icons
- **State**: Zustand v5 (auth only, with localStorage persistence)
- **Tables**: TanStack React Table v8
- **Forms/Validation**: Zod
- **Notifications**: Sonner (Toaster at bottom-center)
- **Charts**: Recharts
- **API**: Centralized fetch wrapper at `lib/api/api-client.ts`

### Directory Layout

```
app/                        # Next.js App Router pages
  project/[projectId]/      # Dynamic project routes
    material/               # Material/production management
    branch/                 # Branch capacity management
    straight/               # Straight line management
    reports/                # Work reports
components/
  ui/                       # shadcn/ui base components
  auth/                     # Auth dialogs (Login, Logout, Signup)
  layouts/                  # Header, Footer, Navigation
  project/                  # Project-specific components
lib/
  api/                      # API call functions by domain (auth, project, material, branch, work)
    api-client.ts           # Fetch wrapper — always use this for API calls
  store/
    auth.store.ts           # Zustand auth store (useAuthStore)
  auth/
    roles.ts                # Role hierarchy: WORKER=1, STAFF=2, ADMIN=3
    role-routes.ts          # ROUTE_ROLE_MAP for middleware enforcement
  hooks/                    # Custom React hooks
types/                      # TypeScript types organized by domain
middleware.ts               # Route protection (enforces role requirements for /project/*)
```

### Key Patterns

**API calls**: Always use `fetchApi` from `lib/api/api-client.ts`. It automatically attaches cookies (`credentials: 'include'`) and handles SSR cookie injection. Throws `ApiError` on failure.

**Authentication**: Auth state lives in `useAuthStore` (Zustand + localStorage persist). Check `_hasHydrated` before reading store on client to avoid hydration mismatches. Roles checked in `middleware.ts` via cookies (`accessToken`, `userRole`).

**Role-based access**: Three tiers — WORKER < STAFF < ADMIN. Route permissions defined in `ROUTE_ROLE_MAP` (regex patterns). Unauthorized → `/unauthorized` (401), insufficient role → `/forbidden` (403).

**Component structure**: Server Components by default; add `'use client'` only when needed. Loading states use separate `.Loading.tsx` files for Suspense. Feature-specific sub-components go in `_components/` folders within the page directory.

**Styling**: `cn()` from `lib/utils.ts` for className merging. Colors use oklch CSS variables. Dark mode via `next-themes`. Prettier auto-sorts Tailwind classes (print width: 100).

**Images**: Remote images from AWS S3 (`suho-tech-s3-bucket.s3.ap-northeast-2.amazonaws.com`) are allowed in `next.config.ts`.

**Path alias**: `@/` maps to the repository root.
