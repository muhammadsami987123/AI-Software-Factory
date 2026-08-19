<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# AI Software Factory — Agent Guide

This document tells coding agents how to work inside this repository.

## Project Overview

AI Software Factory is a visual multi-agent software development workspace built with Next.js 16, TypeScript, and Tailwind CSS v4. Agents collaborate through a pipeline to produce structured project artifacts.

---

## Project Structure

```
/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (landing)/              # Public landing page
│   │   ├── (dashboard)/            # Dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   ├── factory/
│   │   │   ├── agents/
│   │   │   ├── activity/
│   │   │   ├── results/
│   │   │   └── settings/
│   │   ├── api/                    # Route Handlers
│   │   │   ├── projects/
│   │   │   ├── runs/
│   │   │   ├── activity/
│   │   │   ├── agents/
│   │   │   └── settings/
│   │   ├── actions/                # Server Actions
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                     # Shared design system primitives
│   │   ├── layout/                 # Navigation, sidebar, header
│   │   ├── landing/                # Landing page sections
│   │   ├── dashboard/              # Dashboard widgets
│   │   ├── factory/                # Factory workspace components
│   │   ├── agents/                 # Agent cards and detail views
│   │   ├── projects/               # Project creation and list
│   │   └── results/                # Results display
│   ├── lib/
│   │   ├── ai/                     # AI provider abstraction
│   │   ├── agents/                 # Agent implementations + orchestrator
│   │   ├── db/                     # Database layer
│   │   └── utils/                  # Shared utilities
│   └── types/                      # Shared TypeScript types
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
├── CLAUDE.md
├── AGENTS.md
├── README.md
├── .env.example
└── package.json
```

---

## Development Commands

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check (tsc --noEmit)
npm run test         # Run unit + integration tests (Vitest)
npm run test:e2e     # Run E2E tests (Playwright)
npm run test:watch   # Watch mode for unit tests
```

---

## Coding Conventions

### TypeScript
- Strict mode enabled — no `any` without explicit comment justification
- Use `interface` for object shapes, `type` for unions and utility types
- Export types from `src/types/` for cross-module use
- Never use `as` casts to silence type errors — fix the types

### File Naming
- Components: `PascalCase.tsx`
- Utilities/hooks: `camelCase.ts`
- Route handlers: `route.ts` inside the route directory

### Imports
- Use `@/*` alias for `src/*` imports
- Group: React → Next.js → third-party → internal `@/lib` → internal `@/components` → types

### Error Handling
- API routes must return typed `{ error: string }` on failure with appropriate HTTP status
- Use `try/catch` for all async operations
- Never swallow errors silently

---

## UI Conventions

- Follow the design system defined in `CLAUDE.md`
- Generic UI primitives in `src/components/ui/`
- Feature-specific components in `src/components/[feature]/`
- Use Tailwind CSS v4 utility classes — no custom CSS unless necessary
- Every component must handle: loading, empty, error, and success states
- Dark theme is the primary theme

---

## Agent Architecture

The factory pipeline is sequential:

```
ProductAgent → ArchitectAgent → DeveloperAgent → QAAgent → ReviewerAgent
```

Each agent:
1. Receives `AgentContext` (project info + previous artifacts + AI provider)
2. Calls the AI provider (demo or real) with a structured prompt
3. Returns `AgentResult` (artifacts + summary)
4. Orchestrator persists artifacts and emits activity events

Agents are in `src/lib/agents/`. Keep route handlers thin — business logic goes in `src/lib/`.

---

## API Conventions

- All route handlers in `src/app/api/[resource]/route.ts`
- Validate all input with zod before processing
- Consistent response shapes:
  ```typescript
  { data: T }           // Success
  { error: string }     // Error
  ```
- SSE routes: use `ReadableStream` with `text/event-stream` content type

---

## Git Conventions

- Branch naming: `feature/`, `fix/`, `chore/`
- Commit messages: imperative mood, lowercase
- Never commit: `.env`, `node_modules`, `.next`

---

## Security Rules

- Never log or expose API keys
- Never commit `.env` or `.env.local`
- Validate all user input server-side with zod
- No `dangerouslySetInnerHTML` unless content is explicitly sanitized
