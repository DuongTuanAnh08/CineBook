# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start Next.js development server
pnpm build      # Production build
pnpm start      # Run production server
pnpm lint       # Run ESLint
```

> This project uses **pnpm** as its package manager.

## Architecture Overview

**CineBook** is a demo movie ticketing platform built with Next.js 16 App Router, TypeScript, and Tailwind CSS v4. It has no backend — all data is mocked.

### Directory Structure

- `app/` — Next.js App Router pages. Routes: `/` (home), `/movies/[id]`, `/booking/[movieId]`, `/admin/*` (dashboard + management pages).
- `components/layout/` — `MainLayout` (public pages) and `AdminLayout` (admin pages with sidebar). These wrap all page content.
- `components/movies/`, `components/booking/`, `components/schedule/` — Feature components grouped by domain.
- `components/ui/` — 60+ Shadcn/ui primitives (Radix UI-based). Do not modify these manually; use the `shadcn` CLI to add/update.
- `contexts/auth-context.tsx` — Only global state. Exposes `useAuth()` with `user`, `isAuthenticated`, `login`, `logout`, `setMockUser`.
- `lib/mock-data.ts` — All application data (movies, cinemas, genres, showtimes). The single source of truth for data in this demo.
- `lib/utils.ts` — Exports `cn()` (clsx + tailwind-merge). Use it for all dynamic classname logic.
- `types/` — TypeScript interfaces: `auth.ts`, `movie.ts`, `booking.ts`, `schedule.ts`.

### Key Architectural Patterns

**Authentication is purely mock.** The home page lets users switch between four roles (`guest`, `customer`, `admin`, `manager`) via `setMockUser(role)`. No real login/session exists. All auth-gated UI checks `useAuth()` from the context.

**Layouts are chosen by route.** Admin routes (`/admin/*`) use `AdminLayout`; all other routes use `MainLayout`. This is wired in the individual page files, not in `app/layout.tsx`.

**Tailwind CSS v4** is used via `@tailwindcss/postcss` — there is no `tailwind.config.ts`. Theme tokens (colors, sidebar variables) are defined as CSS custom properties in `app/globals.css` using OKLch color space. The site is always dark-themed.

**Component styling** uses `class-variance-authority` for variant patterns, and `cn()` must always be used when merging conditional Tailwind classes to avoid class conflicts.

**Shadcn/ui configuration** is in `components.json` (style: "new-york", baseColor: neutral, icon library: lucide).

### TypeScript

Strict mode is enabled. Path alias `@/` maps to the project root. `next.config.mjs` has `ignoreBuildErrors: true` and `images.unoptimized: true` (demo accommodations — don't rely on these for production patterns).
