# AI Software Factory

A visual multi-agent software development workspace where product ideas become structured software artifacts through a collaborative AI pipeline.

---

## What It Does

AI Software Factory lets you describe a software product and watch five specialized AI agents work through the entire development lifecycle — from requirements gathering to architecture design to implementation planning to QA to code review. Each agent hands its work to the next, producing a complete set of structured project artifacts.

---

## Core Features

- **Visual AI Pipeline** — Watch agents work through Planning → Architecture → Development → Testing → Review in real-time
- **Multi-Agent Workspace** — Five specialized agents: Product Manager, Software Architect, Developer, QA Engineer, Code Reviewer
- **Demo Mode** — Fully functional without any API keys; simulates realistic agent execution
- **Real AI Mode** — Connect Anthropic (Claude) or OpenAI to run the actual AI workflow
- **Project Management** — Create, track, and manage multiple software factory runs
- **Structured Artifacts** — Requirements, architecture docs, API plans, test plans, review summaries
- **Live Activity Log** — Real-time event stream showing agent activity with timestamps
- **Results Dashboard** — Comprehensive project result view with all artifacts and agent performance metrics
- **Responsive Design** — Desktop, laptop, tablet, and mobile support

---

## Architecture

```
                    AI Software Factory

                           User
                            |
                            v
                     Project Workspace
                            |
                            v
                     AI Orchestrator
                            |
        +-------------------+-------------------+
        v                   v                   v
 Product Agent       Architect Agent       Developer Agent
        |                   |                   |
        +-------------------+-------------------+
                            |
                       QA Agent
                            |
                            v
                  Code Reviewer Agent
                            |
                            v
                     Review / Results
                            |
                            v
               Export / Run Again / New Project
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| Runtime | React 19 |
| Database | SQLite (better-sqlite3) |
| Validation | Zod |
| Testing | Vitest + Playwright |
| AI Providers | Anthropic (Claude), OpenAI, Demo |
| Deployment | Vercel / Node.js |

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── (landing)/        # Public landing page
│   ├── (dashboard)/      # Dashboard routes
│   ├── api/              # REST API route handlers
│   └── actions/          # Server Actions
├── components/
│   ├── ui/               # Design system primitives
│   ├── layout/           # Navigation, sidebar, header
│   ├── landing/          # Landing page sections
│   ├── factory/          # Factory workspace and pipeline visualization
│   ├── agents/           # Agent cards, detail views, status
│   ├── projects/         # Project creation and management
│   └── results/          # Results display and export
├── lib/
│   ├── ai/               # AI provider abstraction (Demo, Anthropic, OpenAI)
│   ├── agents/           # Agent implementations and orchestrator
│   ├── db/               # SQLite database layer and schema
│   └── utils/            # Shared utilities
└── types/                # Shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone <repository-url>
cd "AI Software Factory"
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

The app runs fully in **Demo Mode** without any API keys.

To enable real AI execution:

```env
# .env.local
ANTHROPIC_API_KEY=your_key_here
AI_PROVIDER=anthropic
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | No | Anthropic API key for real Claude execution |
| `OPENAI_API_KEY` | No | OpenAI API key for real GPT execution |
| `AI_PROVIDER` | No | Default provider: `demo`, `anthropic`, `openai` (default: `demo`) |
| `DATABASE_PATH` | No | SQLite file path (default: `./data/factory.db`) |
| `NEXT_PUBLIC_APP_URL` | No | Public app URL for SSE connections |

---

## Demo

> **Video demo coming soon.**

To experience the product:
1. Run `npm run dev`
2. Visit `http://localhost:3000`
3. Click **Start Building**
4. Create a project and click **Start AI Factory**
5. Watch all five agents work through the pipeline

No API key required — Demo Mode runs automatically.

---

## MVP Limitations

- Agents produce structured planning artifacts, not executable code
- Single-user only — no authentication or team workspaces
- SQLite database — not suitable for multi-server deployment as-is
- Demo mode uses pre-structured outputs with simulated timing

---

## Roadmap

### MVP (Current)
- [x] Landing page
- [x] Dashboard overview
- [x] Project creation
- [x] Factory workspace with pipeline visualization
- [x] Five specialized AI agents (demo + real AI mode)
- [x] Structured artifact generation
- [x] Real-time activity log
- [x] Results screen with export
- [x] Settings (AI provider configuration)
- [x] Responsive design

### Future
- [ ] User authentication and team workspaces
- [ ] Actual code file generation
- [ ] GitHub integration
- [ ] Deployment pipeline integration
- [ ] Custom agent configuration
- [ ] Usage analytics

---

## License

MIT — see [LICENSE](LICENSE).
