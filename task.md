# AI Software Factory — Claude Code MVP Build Prompt

You are a **Principal AI Engineer, Senior Full-Stack Engineer, Product Architect, and Premium SaaS UI/UX Designer**.

Build a polished MVP called:

# AI Software Factory

## Product Concept

AI Software Factory is a visual multi-agent software development workspace where a user gives an application idea and specialized AI agents collaborate through a software development pipeline.

The product experience should communicate:

> **Idea → Planning → Architecture → Development → Testing → Review → Deployment**

This is an **MVP**, not a full autonomous software engineering platform.

Prioritize:

1. Exceptional UI/UX
2. Realistic product experience
3. One small but functional AI workflow
4. Professional architecture
5. Excellent demo/video presentation
6. Responsive design
7. Clean documentation

Do NOT over-engineer the backend.

---

# IMPORTANT: ONLY 2 PHASES

Build the entire project in exactly **2 phases**.

## PHASE 1

Repository foundation, documentation, architecture and configuration.

## PHASE 2

Build the complete MVP, UI, workflow, backend, testing and final polish.

Do not create a third phase.

At the end of Phase 1, stop and wait for:

`START PHASE 2`

---

# PHASE 1 — FOUNDATION

Before writing application features, inspect the repository.

Understand:

* Existing framework
* Package manager
* Existing dependencies
* Existing source structure
* Existing configuration
* Existing components

Reuse existing infrastructure where appropriate.

Do not unnecessarily delete existing work.

---

## Create CLAUDE.md

Create:

`CLAUDE.md`

This must contain the complete engineering rules for this project.

Document:

### Project

Explain AI Software Factory and its MVP scope.

### Architecture

Document:

* Frontend
* Backend
* AI layer
* Agent orchestration
* Database
* API
* State management
* Testing
* Deployment

### Engineering Rules

Include:

* TypeScript strict mode
* Clean architecture
* Reusable components
* Typed APIs
* Server-side validation
* Secure environment variables
* Error handling
* Logging
* No unnecessary dependencies
* No duplicated business logic
* No hardcoded secrets

### AI Agent Rules

Define:

* Agent responsibilities
* Agent input/output
* Agent state
* Workflow orchestration
* Tool execution
* Failure handling
* Provider abstraction

### UI Rules

Define:

* Premium developer SaaS aesthetic
* Responsive design
* Accessibility
* Loading states
* Empty states
* Error states
* Success states
* Consistent design system
* Subtle animations
* Professional typography
* Proper spacing

---

# Create AGENTS.md

Create:

`AGENTS.md`

Explain how future coding agents should work inside this repository.

Include:

* Project structure
* Important directories
* Development commands
* Build commands
* Test commands
* Coding conventions
* UI conventions
* Agent architecture
* API conventions
* Git conventions
* Security rules

---

# Create README.md

Create a professional GitHub README.

Include:

## AI Software Factory

Short product description.

## What It Does

Explain the concept.

## Core Features

List implemented MVP features.

## Architecture

Include a clear architecture diagram such as:

```text
                    AI Software Factory

                           User
                            │
                            ▼
                     Project Workspace
                            │
                            ▼
                     AI Orchestrator
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
 Product Agent       Architect Agent       Developer Agent
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                       QA Agent
                            │
                            ▼
                     Review / Results
                            │
                            ▼
                       Deployment
```

## Tech Stack

Only list technologies actually used.

## Project Structure

Document the actual structure.

## Getting Started

Installation and development instructions.

## Environment Variables

Document `.env.example`.

## Demo

Add a placeholder for the future demo video.

## Roadmap

Clearly separate MVP from future functionality.

## License

Reference the project license.

---

# Create LICENSE

Use:

**MIT License**

Create:

`LICENSE`

Use the current year.

Do not invent a company name or owner if one is not available.

---

# Supporting Files

Create where appropriate:

```text
.env.example
.gitignore
.editorconfig
```

Only add formatting/lint configuration when compatible with the existing project.

---

# Phase 1 Verification

Run:

* Typecheck
* Lint
* Build

Fix all issues.

Then output a concise report:

```text
PHASE 1 COMPLETE

Created:
- CLAUDE.md
- AGENTS.md
- README.md
- LICENSE
- .env.example
- project configuration

Verified:
- Typecheck
- Lint
- Build

Waiting for:
START PHASE 2
```

STOP.

---

# PHASE 2 — COMPLETE MVP

Start this phase only after I explicitly say:

`START PHASE 2`

Build the entire application in this phase.

Do not split the implementation into additional phases.

---

# PRODUCT EXPERIENCE

AI Software Factory should feel like a serious AI developer platform.

The main experience should be:

```text
Create Project
      ↓
Describe Product
      ↓
Start AI Factory
      ↓
Planning
      ↓
Architecture
      ↓
Development
      ↓
Testing
      ↓
Review
      ↓
Project Result
```

The workflow should be visually impressive even though the MVP backend remains intentionally small.

---

# LANDING PAGE

Create a polished public landing page.

Include:

* Navbar
* Logo
* Hero
* Product preview
* Features
* How it works
* Agent workflow
* Technology section
* Final CTA
* Footer

Hero headline should communicate the product clearly.

Example direction:

> **Turn Product Ideas Into Software With AI Agents.**

Supporting copy should explain that multiple specialized AI agents collaborate across the software development lifecycle.

Primary CTA:

**Start Building**

Secondary CTA:

**Explore Factory**

---

# PREMIUM UI DIRECTION

The UI is the highest priority.

Design it like a premium developer SaaS product.

Use visual inspiration from the quality level of:

* Linear
* Vercel
* Stripe
* Raycast
* GitHub
* modern AI developer platforms

Do not copy them.

Create an original visual identity for AI Software Factory.

Avoid:

* generic AI dashboards
* excessive gradients
* excessive glassmorphism
* giant glowing blobs
* childish illustrations
* random colors
* unnecessary 3D effects
* excessive animations

Prefer:

* sophisticated typography
* strong hierarchy
* subtle borders
* refined cards
* clean data visualization
* tasteful gradients
* elegant transitions
* excellent spacing
* professional iconography

---

# APPLICATION DASHBOARD

Create the main workspace.

Navigation:

* Overview
* Projects
* Factory
* Agents
* Activity
* Results
* Settings

Dashboard overview should display:

* Active Projects
* Completed Projects
* AI Tasks
* Success Rate
* Recent Activity
* Agent Status
* Recent Projects

---

# PROJECT CREATION

Create a beautiful project creation screen.

User enters:

### Project Name

Example:

`AI Customer Support Platform`

### Project Description

Large product requirement editor.

Example:

> Build a SaaS customer support platform where businesses can manage customer conversations, AI-generated replies, support tickets and analytics.

### Technology

Show selectable options such as:

* Next.js
* React
* Node.js
* Python
* PostgreSQL

The MVP does not need to actually generate a complete production application.

---

# FACTORY WORKSPACE

This is the most important UI screen.

Create a visually impressive AI software factory workspace.

Show the agents working through the pipeline.

Example:

```text
┌───────────────────────────────────────────────────────┐
│ AI SOFTWARE FACTORY                         Running ● │
├───────────────────────────────────────────────────────┤
│                                                       │
│  Product Manager                                      │
│       ✓ Requirements analyzed                          │
│                ↓                                      │
│  Software Architect                                    │
│       ✓ Architecture designed                          │
│                ↓                                      │
│  Developer                                             │
│       ● Generating implementation                      │
│                ↓                                      │
│  QA Engineer                                           │
│       ○ Waiting                                        │
│                ↓                                      │
│  Code Reviewer                                         │
│       ○ Waiting                                        │
│                                                       │
└───────────────────────────────────────────────────────┘
```

Make this screen excellent for screen recording.

---

# AGENTS

Create an agent overview.

Agents:

### Product Manager

Responsibilities:

* Requirements
* User stories
* Feature breakdown

### Software Architect

Responsibilities:

* Architecture
* Database design
* API structure

### Developer

Responsibilities:

* Implementation
* Components
* APIs

### QA Engineer

Responsibilities:

* Testing
* Edge cases
* Validation

### Code Reviewer

Responsibilities:

* Code quality
* Security
* Maintainability

Each agent should have:

* Status
* Description
* Current task
* Recent activity
* Completion percentage

---

# AGENT EXECUTION

At least one real workflow should execute.

Implement a lightweight orchestrator.

Example:

```text
Project Requirement
        ↓
Product Agent
        ↓
Architecture Agent
        ↓
Developer Agent
        ↓
QA Agent
        ↓
Review Agent
        ↓
Final Result
```

The agents do NOT need to generate an entire production application.

For the MVP, they can produce structured artifacts such as:

* requirements
* user stories
* architecture summary
* API plan
* component plan
* test plan
* review summary

This is sufficient for the MVP.

---

# DEMO MODE

The product MUST work without requiring external AI API keys.

Create a professional demo mode.

Demo mode should simulate realistic agent execution.

Show:

* Agent status changes
* Progress
* Tasks
* Execution timeline
* Generated artifacts
* Logs
* Completion states

Clearly label simulated/demo results where necessary.

Do not pretend simulated execution is real AI execution.

If an AI provider is configured, allow the real provider to be used.

---

# PROJECT RESULT

After the factory finishes, show a professional results screen.

Include:

### Project Summary

### Requirements

### Architecture

### Development Plan

### API Plan

### Test Plan

### Code Review

### Factory Timeline

### Agent Performance

Include actions:

* Export
* Run Again
* Create New Project

---

# ACTIVITY / LOGS

Create an activity page showing events such as:

```text
14:32:08  Product Agent started
14:32:14  Requirements generated
14:32:21  Architect Agent started
14:32:29  Architecture completed
14:32:34  Developer Agent started
14:32:48  Implementation plan generated
14:32:53  QA Agent started
```

Use realistic timestamps and statuses.

---

# AGENT DETAILS

Clicking an agent should open a detailed view.

Display:

* Agent description
* Current task
* Status
* Completed tasks
* Execution history
* Output artifacts
* Performance

---

# SETTINGS

Create:

* General
* AI Providers
* Models
* Notifications
* Appearance

Never expose API keys.

Use masked values.

---

# BACKEND

Keep backend intentionally small.

Implement only what is necessary for the MVP.

Minimum real functionality:

* Project creation
* Project persistence
* Factory execution
* Agent state management
* Execution events
* Result persistence

Do not build:

* full autonomous coding infrastructure
* distributed agent clusters
* complex billing
* enterprise RBAC
* complex deployment infrastructure
* dozens of integrations

This is an MVP.

---

# DATA MODEL

Keep the schema simple.

Potential entities:

```text
projects
agents
factory_runs
agent_tasks
artifacts
activity_events
```

Use proper:

* IDs
* timestamps
* relationships
* status fields
* indexes

---

# AI ABSTRACTION

Create a provider abstraction.

Conceptually:

```text
AIProvider
   ├── OpenAI
   ├── Anthropic
   └── DemoProvider
```

The application should not be tightly coupled to one provider.

---

# RESPONSIVE DESIGN

The entire application must work on:

* Desktop
* Laptop
* Tablet
* Mobile

Pay special attention to:

* Factory workspace
* Agent timeline
* Tables
* Navigation
* Project creation
* Results

Do not simply shrink desktop layouts.

Create proper responsive layouts.

---

# MICRO-INTERACTIONS

Use subtle animations for:

* Agent status changes
* Progress
* Pipeline transitions
* Loading
* Cards
* Dialogs
* Tabs
* Success states

Animations should feel premium and purposeful.

---

# LOADING / EMPTY / ERROR STATES

Every major feature must have:

* Loading state
* Empty state
* Error state
* Success state

Use skeletons where appropriate.

---

# TESTING

Create a practical MVP test suite.

### Unit Tests

Test:

* project validation
* factory state transitions
* agent task states
* result formatting

### Integration Tests

Test:

* project creation
* factory execution
* agent task persistence
* result retrieval

### E2E Tests

Test:

```text
Landing Page
→ Create Project
→ Start Factory
→ Watch Agents
→ View Results
```

And:

```text
Projects
→ Open Project
→ Factory
→ Results
```

---

# UI QUALITY AUDIT

Before completing Phase 2, inspect every major screen.

Fix:

* alignment
* spacing
* typography
* responsive issues
* overflow
* inconsistent components
* broken states
* poor empty states
* awkward animations
* visual inconsistencies

The application must look polished enough for a professional product demo video.

---

# PERFORMANCE & SECURITY

Check:

* unnecessary client rendering
* unnecessary dependencies
* API validation
* environment variables
* secret exposure
* unsafe input
* error handling
* production build

Do not leave obvious warnings or errors.

---

# FINAL VERIFICATION

Run:

```text
typecheck
lint
test
test:e2e
build
```

Use the project's actual commands where different.

Fix all failures.

---

# README UPDATE

After implementation, update README.md with:

* Actual features
* Actual architecture
* Actual tech stack
* Setup instructions
* Demo instructions
* Screenshots section
* MVP limitations
* Future roadmap

Never document features that do not exist.

---

# FINAL REPORT

At the end provide:

```text
AI SOFTWARE FACTORY MVP COMPLETE

Implemented:
- Landing Page
- Dashboard
- Project Creation
- Factory Workspace
- Multi-Agent Workflow
- Agent Views
- Activity Logs
- Results
- Demo Mode
- Backend
- Database
- Testing

UI:
Premium / Responsive / Production-quality

Verification:
Typecheck: PASS
Lint: PASS
Tests: PASS
E2E: PASS
Build: PASS
```

Then provide:

### LinkedIn Demo Flow

Give me a **30-60 second screen-recording sequence** showing the strongest parts of the product.

### Portfolio Description

Give me a concise technical description based ONLY on the functionality actually implemented.

---

# MOST IMPORTANT RULE

This is an **MVP**.

Do not spend unnecessary time building deep backend infrastructure.

Spend the majority of implementation effort on:

**UI + UX + workflow visualization + responsive design + product polish.**

When I record the project for LinkedIn, the application should immediately communicate:

> “This is a serious AI software engineering platform.”

Build the product, not a collection of disconnected demo screens.

Start with **PHASE 1 only**.

Stop after Phase 1 and wait for:

`START PHASE 2`
