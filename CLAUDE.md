# CLAUDE.md — AI Software Factory Engineering Rules

## Project

**AI Software Factory** is a visual multi-agent software development workspace. Users describe a product idea and five specialized AI agents collaborate through a software development pipeline — from requirements to architecture to implementation to testing to review — producing structured project artifacts.

**MVP scope:** The MVP focuses on an exceptional UI/UX experience with one functional AI workflow (demo mode + optional real AI provider). It does not build production applications autonomously; it generates structured planning and development artifacts.

---

## Architecture

### Frontend
- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **State:** React Context + `useReducer` for local UI state; server actions for mutations
- **Routing:** File-based App Router — `src/app/`
- **Components:** Colocated in `src/components/`, organized by feature domain

### Backend
- **API:** Next.js Route Handlers (`src/app/api/`)
- **Data access:** Server actions (`src/app/actions/`) for form mutations
- **Database:** SQLite via `better-sqlite3` for local MVP persistence; schema in `src/lib/db/`
- **Validation:** `zod` for all API inputs and form validation

### AI Layer
- **Provider abstraction:** `src/lib/ai/` — `AIProvider` interface with `DemoProvider`, `AnthropicProvider`, `OpenAIProvider`
- **Demo mode:** Realistic simulated agent execution — no API key required
- **Real mode:** Anthropic (claude-sonnet-4-6) or OpenAI when configured via env vars

### Agent Orchestration
- **Orchestrator:** `src/lib/agents/orchestrator.ts` — sequential pipeline execution
- **Agents:** `src/lib/agents/` — one file per agent, each implementing `AgentInterface`
- **Pipeline:** ProductAgent → ArchitectAgent → DeveloperAgent → QAAgent → ReviewerAgent
- **State:** Agent tasks stored in DB; SSE stream for real-time UI updates

### Database Schema
```
projects         — id, name, description, tech_stack, status, created_at, updated_at
factory_runs     — id, project_id, status, mode, started_at, completed_at
agent_tasks      — id, run_id, agent_name, status, started_at, completed_at, output
artifacts        — id, run_id, agent_name, type, title, content, created_at
activity_events  — id, run_id, agent_name, event_type, message, created_at
```

### API Routes
```
POST   /api/projects              — create project
GET    /api/projects              — list projects
GET    /api/projects/[id]         — get project
POST   /api/projects/[id]/run     — start factory run
GET    /api/projects/[id]/run     — get latest run status
GET    /api/runs/[id]/stream      — SSE stream for live updates
GET    /api/runs/[id]/artifacts   — get run artifacts
GET    /api/activity              — get activity log
GET    /api/agents                — get agent statuses
GET    /api/settings              — get settings (masked keys)
PUT    /api/settings              — update settings
```

### State Management
- Server state: fetched via `fetch` in Server Components where possible
- Client state: React Context (`FactoryContext`) for active run state
- Real-time: SSE (`EventSource`) for pipeline progress updates
- No Redux, no Zustand — keep it simple for MVP

### Testing
- **Unit:** Vitest — test agent logic, validation, state transitions
- **Integration:** Vitest — test API route handlers with mocked DB
- **E2E:** Playwright — full user flows

### Deployment
- Target: Vercel (zero-config) or Node.js server
- DB: SQLite file (local) — swap to Turso/libSQL for hosted deployment
- Env: `.env.local` for development, platform env vars for production

---

## Engineering Rules

- **TypeScript strict mode** — `strict: true` in tsconfig, no `any` without explicit justification
- **Clean architecture** — UI components do not import from `src/lib/agents/` directly; go through API
- **Reusable components** — shared UI in `src/components/ui/`, feature UI in `src/components/[feature]/`
- **Typed APIs** — all API responses typed with exported interfaces in `src/types/`
- **Server-side validation** — every API route validates with zod before processing
- **Secure environment variables** — all secrets via env vars, never hardcoded, never exposed client-side
- **Error handling** — all async operations wrapped in try/catch; API routes return typed error responses
- **Logging** — structured logs with `console.error` for errors, avoid excessive `console.log` in production
- **No unnecessary dependencies** — prefer built-ins; only add packages that earn their weight
- **No duplicated business logic** — shared logic lives in `src/lib/`, not copy-pasted into components
- **No hardcoded secrets** — use `process.env` always; validate required vars at startup

---

## AI Agent Rules

### Agent Responsibilities

| Agent | Role | Output Artifacts |
|-------|------|-----------------|
| ProductAgent | Analyze requirements, generate user stories, feature breakdown | `requirements`, `user-stories` |
| ArchitectAgent | System design, DB schema, API structure | `architecture`, `db-schema`, `api-plan` |
| DeveloperAgent | Component plan, implementation strategy | `component-plan`, `tech-plan` |
| QAAgent | Test plan, edge cases, validation strategy | `test-plan`, `edge-cases` |
| ReviewerAgent | Code quality review, security notes, maintainability score | `review-summary`, `recommendations` |

### Agent Interface
```typescript
interface AgentInterface {
  name: string;
  description: string;
  run(context: AgentContext): Promise<AgentResult>;
}

interface AgentContext {
  projectId: string;
  runId: string;
  projectName: string;
  projectDescription: string;
  techStack: string[];
  previousArtifacts: Artifact[];
  provider: AIProvider;
}

interface AgentResult {
  status: 'completed' | 'failed';
  artifacts: Artifact[];
  summary: string;
  durationMs: number;
}
```

### Agent State Transitions
```
pending → running → completed
pending → running → failed
```

### Workflow Orchestration
- Sequential: each agent receives previous agents' artifacts as context
- No parallel execution in MVP
- Orchestrator emits `activity_events` at each state transition
- SSE stream pushes events to client in real-time

### Failure Handling
- Agent failures do not crash the pipeline — mark task as failed, continue with partial context
- Failed agents produce a minimal placeholder artifact so downstream agents still have context
- Surface failure state clearly in UI

### Provider Abstraction
```typescript
interface AIProvider {
  mode: 'demo' | 'anthropic' | 'openai';
  complete(prompt: string, options?: CompletionOptions): Promise<string>;
}
```

---

## UI Rules

### Design System
- **Aesthetic:** Premium developer SaaS — inspired by Linear, Vercel, Stripe quality
- **Color palette:** Dark-first; near-black background (`#0a0a0b`), subtle borders (`#1e1e22`), accent blue (`#3b82f6`), muted text (`#8b8b97`)
- **Typography:** Geist Sans (UI) + Geist Mono (code/data)
- **Spacing:** 4px base unit, consistent scale (4, 8, 12, 16, 20, 24, 32, 48, 64)
- **Border radius:** Subtle — `rounded-lg` (8px) for cards, `rounded-md` (6px) for inputs
- **Shadows:** Minimal — prefer borders over heavy shadows

### Component Standards
- Every interactive component must have: default, hover, active, focus, disabled states
- Loading states: skeleton screens for data fetching, spinner for actions
- Empty states: descriptive with a clear CTA
- Error states: actionable — explain what went wrong and how to fix it

### Responsive Design
- Mobile-first CSS using Tailwind responsive prefixes
- Breakpoints: `sm` (640), `md` (768), `lg` (1024), `xl` (1280)
- Factory workspace: stack vertically on mobile, side-by-side on desktop
- Navigation: sidebar on desktop, bottom bar on mobile

### Animations
- Use `transition-all duration-150 ease-in-out` for hover/active states
- Pipeline status changes: subtle fade + slide
- Agent status dots: pulse animation for `running` state
- No gratuitous motion — every animation must serve the UX

### Accessibility
- All images need `alt` attributes
- Interactive elements need visible focus rings
- Color contrast: minimum 4.5:1 for text
- Keyboard navigable UI
- ARIA labels on icon-only buttons
