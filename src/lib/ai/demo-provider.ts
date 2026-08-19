import type { AIProvider, CompletionOptions } from "@/types";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class DemoProvider implements AIProvider {
  readonly mode = "demo" as const;

  async complete(prompt: string, options?: CompletionOptions): Promise<string> {
    // Simulate realistic latency based on expected output length
    const delay = options?.maxTokens ? Math.min(options.maxTokens * 1.5, 6000) : 3000;
    await sleep(delay);

    // Route to appropriate template based on prompt content
    if (prompt.includes("PRODUCT_MANAGER") || prompt.includes("requirements")) {
      return this.generateRequirements(prompt);
    }
    if (prompt.includes("ARCHITECT") || prompt.includes("architecture")) {
      return this.generateArchitecture(prompt);
    }
    if (prompt.includes("DEVELOPER") || prompt.includes("implementation")) {
      return this.generateImplementation(prompt);
    }
    if (prompt.includes("QA") || prompt.includes("testing")) {
      return this.generateTestPlan(prompt);
    }
    if (prompt.includes("REVIEWER") || prompt.includes("review")) {
      return this.generateReview(prompt);
    }
    return "Analysis complete. Output generated successfully.";
  }

  private extractProjectInfo(prompt: string): { name: string; description: string; tech: string } {
    const nameMatch = prompt.match(/Project:\s*([^\n]+)/);
    const descMatch = prompt.match(/Description:\s*([^\n]+)/);
    const techMatch = prompt.match(/Tech Stack:\s*([^\n]+)/);
    return {
      name: nameMatch?.[1]?.trim() ?? "Software Platform",
      description: descMatch?.[1]?.trim() ?? "A modern software application",
      tech: techMatch?.[1]?.trim() ?? "Next.js, TypeScript, PostgreSQL",
    };
  }

  private generateRequirements(prompt: string): string {
    const { name, description } = this.extractProjectInfo(prompt);

    return `# Requirements Analysis

## Project: ${name}

### Executive Summary
${description}

This requirements document captures the functional and non-functional requirements for the ${name} platform, derived from comprehensive stakeholder analysis and product vision review.

---

## Functional Requirements

### FR-001: User Authentication & Authorization
**Priority:** Critical
- Email and password-based authentication with JWT session management
- Role-based access control with Admin, Manager, and User roles
- Secure password reset flow via email verification
- Session expiry and automatic token refresh

### FR-002: Core Platform Features
**Priority:** Critical
- Full CRUD operations for primary domain entities
- Real-time data updates via WebSocket connections
- Advanced search and filtering with pagination
- Bulk operations support for power users

### FR-003: Dashboard & Analytics
**Priority:** High
- Executive summary dashboard with KPI widgets
- Time-series charts for trend analysis
- Exportable reports in PDF and CSV formats
- Customizable date range filtering

### FR-004: Notifications & Alerts
**Priority:** Medium
- In-app notification center with read/unread states
- Email notifications for critical events
- Configurable alert thresholds and notification preferences
- Push notification support (web)

### FR-005: Integration & API
**Priority:** Medium
- REST API with OpenAPI 3.0 specification
- Webhook support for third-party integrations
- OAuth 2.0 for external service authentication
- Rate limiting and API key management

---

## Non-Functional Requirements

### Performance
- API response time < 200ms for 95th percentile under normal load
- Page load time < 2 seconds for LCP (Largest Contentful Paint)
- Support 10,000 concurrent active users
- Database query execution < 50ms for indexed lookups

### Security
- OWASP Top 10 compliance
- All data encrypted at rest (AES-256) and in transit (TLS 1.3)
- Input validation and sanitization on all user inputs
- SQL injection, XSS, and CSRF protection

### Reliability
- 99.9% uptime SLA (less than 8.7 hours downtime per year)
- Automated database backups every 6 hours
- Graceful degradation when non-critical services fail
- Circuit breaker pattern for external service calls

### Scalability
- Horizontal scaling via stateless API design
- Database read replicas for high-read scenarios
- CDN integration for static asset delivery
- Caching layer (Redis) for frequently accessed data

---

## User Stories

### Authentication Epic

**US-001: User Registration**
> As a new user, I want to create an account so that I can access the platform.
- Given I am on the registration page
- When I submit a valid email and password meeting security requirements
- Then my account is created, I receive a confirmation email, and I am redirected to onboarding

**US-002: User Login**
> As a registered user, I want to sign in securely so that I can access my workspace.
- Given I have a verified account
- When I submit correct credentials
- Then I am authenticated and redirected to my dashboard

**US-003: Password Reset**
> As a user who forgot their password, I want to reset it so that I can regain access.
- Given I provide my registered email
- When I submit the reset request
- Then I receive an email with a time-limited reset link

### Core Features Epic

**US-004: Create Primary Entity**
> As an authenticated user, I want to create new records so that I can manage my data.
- Given I am on the creation form
- When I fill in required fields and submit
- Then the record is saved and I see a confirmation with the new entry

**US-005: Search and Filter**
> As a user, I want to search and filter data so that I can find specific information quickly.
- Given I have multiple records
- When I use the search bar or apply filters
- Then results are updated in real-time showing only matching records

**US-006: Export Data**
> As a manager, I want to export data so that I can analyze it in external tools.
- Given I have a dataset in view
- When I click Export and select a format
- Then a file is downloaded with the current filtered data

### Admin Epic

**US-007: User Management**
> As an admin, I want to manage team members so that I can control platform access.
- Given I am in the admin panel
- When I invite, deactivate, or change roles for a user
- Then the changes take effect immediately and the user is notified

---

## Feature Breakdown

| Feature | Priority | Complexity | Sprint |
|---------|----------|-----------|--------|
| Authentication system | Critical | Medium | 1 |
| User dashboard | Critical | Medium | 1-2 |
| Core CRUD operations | Critical | Low | 2 |
| Search & filtering | High | Medium | 2-3 |
| Analytics & reporting | High | High | 3-4 |
| Notification system | Medium | Medium | 4 |
| API & integrations | Medium | High | 4-5 |
| Admin panel | Medium | Medium | 5 |
| Mobile optimization | Low | Medium | 6 |

**Estimated Timeline:** 6 two-week sprints (12 weeks)
**Team Size:** 3-5 engineers + 1 designer`;
  }

  private generateArchitecture(prompt: string): string {
    const { name, tech } = this.extractProjectInfo(prompt);
    const techList = tech.split(",").map((t) => t.trim());
    const primaryFrontend = techList[0] ?? "Next.js";
    const primaryBackend = techList[1] ?? "Node.js";
    const database = techList.find((t) => /postgres|mysql|mongo|sqlite/i.test(t)) ?? "PostgreSQL";

    return `# System Architecture

## Project: ${name}

### Architecture Overview

The ${name} platform uses a modern three-tier architecture with a clear separation between presentation, application, and data layers. The system is designed for horizontal scalability and operational simplicity.

---

## High-Level Architecture

\`\`\`
                    ┌─────────────────────────────────────┐
                    │            CDN / Edge               │
                    │    (Static assets, API caching)     │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │         Load Balancer               │
                    │         (Nginx / ALB)               │
                    └──────────────┬──────────────────────┘
                                   │
              ┌────────────────────┼─────────────────────┐
              │                    │                      │
   ┌──────────▼─────────┐ ┌───────▼────────┐ ┌─────────▼──────────┐
   │   ${primaryFrontend} App     │ │   API Server   │ │  Background Jobs   │
   │   (SSR/SSG/CSR)    │ │  (${primaryBackend})    │ │  (Queue Workers)   │
   └────────────────────┘ └───────┬────────┘ └─────────┬──────────┘
                                   │                    │
                    ┌──────────────┼────────────────────┘
                    │              │
         ┌──────────▼──────┐ ┌────▼─────────┐ ┌──────────────────┐
         │  ${database}      │ │    Redis     │ │   Object Store   │
         │  (Primary DB)   │ │   (Cache)    │ │   (Files/Media)  │
         └─────────────────┘ └──────────────┘ └──────────────────┘
\`\`\`

---

## Component Architecture

### Frontend Layer
- **Framework:** ${primaryFrontend} with App Router
- **State Management:** React Context + Server State (React Query)
- **Styling:** Tailwind CSS with design token system
- **Component Library:** Custom component library with atomic design
- **API Client:** Type-safe API client generated from OpenAPI spec

### API Layer
- **Runtime:** ${primaryBackend}
- **API Style:** RESTful with JSON:API conventions
- **Authentication:** JWT with refresh token rotation
- **Validation:** Schema validation on all inputs (Zod)
- **Documentation:** Auto-generated OpenAPI 3.0 docs

### Data Layer
- **Primary Database:** ${database}
- **ORM:** Prisma for type-safe database access
- **Migrations:** Versioned migrations with rollback support
- **Caching:** Redis for session storage and hot data
- **Search:** Full-text search via PostgreSQL tsvector

---

## Database Schema

\`\`\`sql
-- Users and authentication
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255) NOT NULL,
  role        VARCHAR(50) NOT NULL DEFAULT 'user',
  password_hash TEXT NOT NULL,
  email_verified_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User sessions
CREATE TABLE sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(255) NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Core domain entity
CREATE TABLE workspace_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  user_id     UUID NOT NULL REFERENCES users(id),
  title       VARCHAR(500) NOT NULL,
  content     TEXT,
  status      VARCHAR(50) NOT NULL DEFAULT 'active',
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity audit log
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  action      VARCHAR(255) NOT NULL,
  resource    VARCHAR(255) NOT NULL,
  resource_id UUID,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_items_workspace ON workspace_items(workspace_id);
CREATE INDEX idx_items_user ON workspace_items(user_id);
CREATE INDEX idx_items_status ON workspace_items(status);
CREATE INDEX idx_items_created ON workspace_items(created_at DESC);
CREATE INDEX idx_audit_user ON audit_log(user_id, created_at DESC);
\`\`\`

---

## API Structure

### Authentication Endpoints
\`\`\`
POST   /api/v1/auth/register      Create new account
POST   /api/v1/auth/login         Sign in and get tokens
POST   /api/v1/auth/refresh       Refresh access token
POST   /api/v1/auth/logout        Invalidate session
POST   /api/v1/auth/forgot        Request password reset
POST   /api/v1/auth/reset         Complete password reset
GET    /api/v1/auth/me            Get current user
\`\`\`

### Core Resource Endpoints
\`\`\`
GET    /api/v1/items              List items (paginated, filterable)
POST   /api/v1/items              Create item
GET    /api/v1/items/:id          Get single item
PATCH  /api/v1/items/:id          Update item
DELETE /api/v1/items/:id          Delete item
POST   /api/v1/items/bulk         Bulk operations
GET    /api/v1/items/:id/activity Get item activity log
\`\`\`

### Analytics Endpoints
\`\`\`
GET    /api/v1/analytics/summary  Dashboard KPIs
GET    /api/v1/analytics/trends   Time-series data
GET    /api/v1/analytics/export   Export data
\`\`\`

---

## Security Architecture

- **Transport:** TLS 1.3 enforced, HSTS headers
- **Authentication:** JWT (15min access) + Refresh tokens (7 days, HttpOnly cookie)
- **Authorization:** Row-level security in PostgreSQL + application-level checks
- **Rate Limiting:** 100 req/min per IP, 1000 req/min per authenticated user
- **CORS:** Strict origin whitelist
- **Headers:** CSP, X-Frame-Options, X-Content-Type-Options

---

## Deployment Architecture

\`\`\`
Production Environment:
  - Frontend: Vercel (edge functions, global CDN)
  - API: Railway or Render (auto-scaling containers)
  - Database: Neon (serverless PostgreSQL, branching)
  - Cache: Upstash Redis (serverless)
  - Storage: Cloudflare R2 (S3-compatible)
  - Monitoring: Sentry (errors) + Vercel Analytics
\`\`\``;
  }

  private generateImplementation(prompt: string): string {
    const { name, tech } = this.extractProjectInfo(prompt);

    return `# Implementation Plan

## Project: ${name}

### Technology Decisions

The implementation follows a feature-first directory structure with clear separation of concerns. All code uses TypeScript strict mode with comprehensive type coverage.

---

## Component Architecture

### Design System Primitives

\`\`\`
src/components/ui/
├── Button.tsx         # Variants: primary, secondary, ghost, destructive
├── Input.tsx          # With validation states and helper text
├── Select.tsx         # Single and multi-select with search
├── Modal.tsx          # Accessible dialog with focus trap
├── Table.tsx          # Sortable, filterable, paginated
├── Badge.tsx          # Status indicators
├── Card.tsx           # Surface container
├── Skeleton.tsx       # Loading placeholders
├── Toast.tsx          # Notification system
└── Tabs.tsx           # Tab navigation
\`\`\`

### Feature Components

\`\`\`
src/components/
├── auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── PasswordResetForm.tsx
├── dashboard/
│   ├── StatsGrid.tsx
│   ├── ActivityFeed.tsx
│   └── QuickActions.tsx
├── items/
│   ├── ItemCard.tsx
│   ├── ItemList.tsx
│   ├── ItemForm.tsx
│   └── ItemDetail.tsx
├── analytics/
│   ├── KPICard.tsx
│   ├── TrendChart.tsx
│   └── ExportButton.tsx
└── layout/
    ├── AppLayout.tsx
    ├── Sidebar.tsx
    ├── Header.tsx
    └── MobileNav.tsx
\`\`\`

---

## Core Implementation Patterns

### API Client Pattern
\`\`\`typescript
// Type-safe API client with automatic error handling
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  async get<T>(path: string): Promise<T> {
    const response = await fetch(\`\${this.baseUrl}\${path}\`, {
      headers: this.headers(),
    });
    if (!response.ok) throw new ApiError(response);
    return response.json() as T;
  }

  async post<T, B>(path: string, body: B): Promise<T> {
    const response = await fetch(\`\${this.baseUrl}\${path}\`, {
      method: 'POST',
      headers: { ...this.headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new ApiError(response);
    return response.json() as T;
  }
}
\`\`\`

### Server Action Pattern
\`\`\`typescript
// Type-safe server actions with Zod validation
const CreateItemSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().optional(),
  status: z.enum(['active', 'archived']).default('active'),
});

export async function createItem(
  data: z.infer<typeof CreateItemSchema>
): Promise<ActionResult<Item>> {
  const validated = CreateItemSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.message };
  }

  const item = await db.items.create({ data: validated.data });
  revalidatePath('/items');
  return { success: true, data: item };
}
\`\`\`

### Custom Hook Pattern
\`\`\`typescript
// Data fetching hook with optimistic updates
function useItems(filters?: ItemFilters) {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (data: CreateItemInput) => {
    const optimisticItem = { ...data, id: 'temp-' + Date.now(), createdAt: new Date() };
    setItems(prev => [optimisticItem, ...prev]);
    try {
      const result = await api.items.create(data);
      setItems(prev => prev.map(i => i.id === optimisticItem.id ? result : i));
    } catch (err) {
      setItems(prev => prev.filter(i => i.id !== optimisticItem.id));
      throw err;
    }
  }, []);

  return { items, isLoading, error, create };
}
\`\`\`

---

## Implementation Phases

### Phase 1 — Core Infrastructure (Week 1-2)
- [ ] Project setup with TypeScript, ESLint, Prettier
- [ ] Database schema and migrations
- [ ] Authentication system (register, login, JWT)
- [ ] Base API structure with error handling middleware
- [ ] Design system foundation (colors, typography, spacing)
- [ ] Layout components (sidebar, header, mobile nav)

### Phase 2 — Core Features (Week 3-4)
- [ ] Dashboard page with stats
- [ ] CRUD operations for primary entities
- [ ] Search and filtering UI
- [ ] Form components with validation
- [ ] Error and loading states throughout

### Phase 3 — Advanced Features (Week 5-6)
- [ ] Analytics dashboard with charts
- [ ] Notification system
- [ ] Data export functionality
- [ ] Admin panel
- [ ] Performance optimization

### Phase 4 — Polish & Launch (Week 7-8)
- [ ] Comprehensive test suite
- [ ] Accessibility audit and fixes
- [ ] Performance profiling
- [ ] Documentation
- [ ] Staging environment validation
- [ ] Production deployment

---

## Tech Stack Details

**${tech}**

| Technology | Version | Purpose |
|------------|---------|---------|
| TypeScript | 5.x | Type safety throughout |
| Zod | 3.x | Runtime validation |
| Prisma | 5.x | Type-safe ORM |
| React Query | 5.x | Server state management |
| Tailwind CSS | 4.x | Utility-first styling |
| Vitest | 1.x | Unit and integration tests |
| Playwright | 1.x | End-to-end tests |

---

## Performance Strategy

1. **Server Components** — Render data-heavy pages on server, ship minimal JS
2. **Streaming** — Progressive rendering with Suspense boundaries
3. **Caching** — Redis for hot data, Next.js cache for static content
4. **Images** — Next.js Image with lazy loading and WebP conversion
5. **Code Splitting** — Dynamic imports for heavy components
6. **Bundle Analysis** — Regular bundle size audits`;
  }

  private generateTestPlan(prompt: string): string {
    const { name } = this.extractProjectInfo(prompt);

    return `# Test Plan

## Project: ${name}

### Testing Philosophy

We follow the Testing Trophy pattern — prioritizing integration tests that exercise real user interactions, supported by targeted unit tests for complex business logic, and E2E tests for critical user journeys.

\`\`\`
         /\\
        /E2E\\      ← Critical user flows (10%)
       /──────\\
      /Integration\\ ← API and component tests (60%)
     /────────────\\
    /  Unit Tests   \\ ← Business logic (30%)
   /────────────────\\
\`\`\`

---

## Test Categories

### Unit Tests

**Authentication Logic**
\`\`\`typescript
describe('Auth utilities', () => {
  test('hashPassword creates bcrypt hash', async () => {
    const hash = await hashPassword('SecurePass123!');
    expect(hash).toMatch(/^\$2[ab]\$/);
    expect(hash).not.toBe('SecurePass123!');
  });

  test('verifyPassword validates correct password', async () => {
    const hash = await hashPassword('test123');
    expect(await verifyPassword('test123', hash)).toBe(true);
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });

  test('generateJWT creates valid token with claims', () => {
    const token = generateJWT({ userId: 'abc', role: 'admin' });
    const decoded = verifyJWT(token);
    expect(decoded.userId).toBe('abc');
    expect(decoded.role).toBe('admin');
  });
});
\`\`\`

**Validation Schemas**
\`\`\`typescript
describe('Input validation', () => {
  test('rejects email without @ symbol', () => {
    const result = UserSchema.safeParse({ email: 'notanemail', password: 'Pass123!' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain('email');
  });

  test('rejects weak passwords', () => {
    const result = UserSchema.safeParse({ email: 'a@b.com', password: '123' });
    expect(result.success).toBe(false);
  });
});
\`\`\`

**State Transitions**
\`\`\`typescript
describe('Item status transitions', () => {
  test('allows valid transitions', () => {
    expect(canTransition('draft', 'active')).toBe(true);
    expect(canTransition('active', 'archived')).toBe(true);
  });

  test('rejects invalid transitions', () => {
    expect(canTransition('archived', 'draft')).toBe(false);
    expect(canTransition('deleted', 'active')).toBe(false);
  });
});
\`\`\`

---

### Integration Tests

**API Endpoints**
\`\`\`typescript
describe('POST /api/v1/items', () => {
  test('creates item for authenticated user', async () => {
    const token = await loginAs('user@test.com');
    const response = await request(app)
      .post('/api/v1/items')
      .set('Authorization', \`Bearer \${token}\`)
      .send({ title: 'Test Item', content: 'Description' });

    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe('Test Item');
    expect(response.body.data.id).toBeDefined();
  });

  test('returns 401 for unauthenticated requests', async () => {
    const response = await request(app)
      .post('/api/v1/items')
      .send({ title: 'Test' });
    expect(response.status).toBe(401);
  });

  test('returns 400 for invalid input', async () => {
    const token = await loginAs('user@test.com');
    const response = await request(app)
      .post('/api/v1/items')
      .set('Authorization', \`Bearer \${token}\`)
      .send({ title: '' }); // empty title
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
\`\`\`

**Database Operations**
\`\`\`typescript
describe('Item repository', () => {
  beforeEach(async () => await seedTestDatabase());
  afterEach(async () => await cleanTestDatabase());

  test('findById returns correct item', async () => {
    const item = await db.items.findById('known-id');
    expect(item?.title).toBe('Expected Title');
  });

  test('list returns paginated results', async () => {
    const result = await db.items.list({ page: 1, limit: 10 });
    expect(result.items).toHaveLength(10);
    expect(result.total).toBeGreaterThan(10);
    expect(result.hasMore).toBe(true);
  });
});
\`\`\`

---

### End-to-End Tests

**Critical User Journey 1: New User Registration**
\`\`\`typescript
test('complete registration flow', async ({ page }) => {
  await page.goto('/register');
  await page.fill('[name=email]', 'newuser@example.com');
  await page.fill('[name=password]', 'SecurePass123!');
  await page.fill('[name=confirmPassword]', 'SecurePass123!');
  await page.click('[type=submit]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
\`\`\`

**Critical User Journey 2: Core Workflow**
\`\`\`typescript
test('create, update, and delete an item', async ({ page }) => {
  await loginUser(page, 'user@test.com');

  // Create
  await page.click('[data-testid=create-item-btn]');
  await page.fill('[name=title]', 'My Test Item');
  await page.click('[type=submit]');
  await expect(page.locator('[data-testid=item-card]').first()).toContainText('My Test Item');

  // Update
  await page.click('[data-testid=edit-item]');
  await page.fill('[name=title]', 'Updated Title');
  await page.click('[type=submit]');
  await expect(page.locator('[data-testid=item-card]').first()).toContainText('Updated Title');

  // Delete
  await page.click('[data-testid=delete-item]');
  await page.click('[data-testid=confirm-delete]');
  await expect(page.locator('[data-testid=item-card]')).toHaveCount(0);
});
\`\`\`

---

## Edge Cases

### Authentication Edge Cases
- Expired JWT token → automatic refresh or redirect to login
- Concurrent logins from multiple devices → all sessions valid
- Login with unverified email → clear error message
- Rate limiting after 5 failed login attempts → 15-minute lockout
- Password reset link used twice → second use rejected

### Data Edge Cases
- Empty list states → informative empty state with CTA
- Single character inputs → accepted if within min length
- Maximum length inputs → truncation or rejection with message
- Unicode and emoji in text fields → properly stored and displayed
- Concurrent updates to same record → last-write-wins with conflict notification

### Network Edge Cases
- Request timeout (> 30s) → user-friendly timeout message
- 503 Service Unavailable → retry with exponential backoff
- Offline mode → cached data shown, write operations queued
- Large file uploads → chunked upload with progress indicator

### UI Edge Cases
- Very long text in card titles → CSS truncation with tooltip
- Tables with 0 rows → styled empty state
- Rapid button clicks → debounced, loading state prevents duplicates
- Back navigation during form fill → unsaved changes warning

---

## Test Coverage Targets

| Layer | Target Coverage | Priority |
|-------|----------------|----------|
| Business logic (utils) | 95% | Critical |
| API route handlers | 80% | Critical |
| React components | 70% | High |
| Database queries | 85% | High |
| E2E critical paths | 100% of journeys | Critical |

**Estimated Test Suite Size:** ~150 unit tests, ~60 integration tests, ~20 E2E scenarios`;
  }

  private generateReview(prompt: string): string {
    const { name } = this.extractProjectInfo(prompt);

    return `# Code Review Summary

## Project: ${name}

### Review Overview

This code review evaluates the proposed implementation across four dimensions: code quality, security, performance, and maintainability. The review is based on the requirements, architecture, and implementation plan produced in earlier pipeline stages.

**Overall Assessment: ✅ Strong Foundation with Minor Improvements Recommended**

---

## Code Quality

### Strengths
- TypeScript strict mode enforced throughout — eliminates entire classes of runtime errors
- Consistent use of Zod for runtime validation at API boundaries
- Custom hook pattern properly separates data fetching from presentation
- Error handling is explicit with typed error responses
- Component composition follows atomic design principles

### Recommendations

**1. Avoid Large Component Files**
\`\`\`typescript
// ❌ Avoid: monolithic component
function Dashboard() {
  // 400+ lines mixing state, UI, and side effects
}

// ✅ Prefer: composed from focused components
function Dashboard() {
  return (
    <DashboardLayout>
      <StatsGrid />
      <ActivityFeed />
      <QuickActions />
    </DashboardLayout>
  );
}
\`\`\`

**2. Extract Repetitive Fetch Logic**
\`\`\`typescript
// ❌ Avoid: duplicated fetch pattern in every page
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
useEffect(() => { fetch(...).then(setData).finally(() => setLoading(false)); }, []);

// ✅ Prefer: shared abstraction
const { data, isLoading, error } = useQuery('/api/items', fetchItems);
\`\`\`

**3. Prefer Named Exports for Tree-Shaking**
\`\`\`typescript
// ❌ Avoid: default exports for utilities
export default function formatDate(date: Date): string { ... }

// ✅ Prefer: named exports
export function formatDate(date: Date): string { ... }
\`\`\`

---

## Security Assessment

### Critical Checks ✅

| Check | Status | Notes |
|-------|--------|-------|
| Input validation (server-side) | ✅ Pass | Zod schemas on all endpoints |
| SQL injection prevention | ✅ Pass | Parameterized queries via Prisma |
| XSS prevention | ✅ Pass | React escapes by default, no dangerouslySetInnerHTML |
| CSRF protection | ✅ Pass | SameSite cookies + CSRF tokens |
| Authentication on all protected routes | ✅ Pass | Middleware-based auth guard |
| API keys in environment variables | ✅ Pass | No hardcoded secrets detected |
| Sensitive data in logs | ⚠️ Review | Ensure passwords never logged |
| Rate limiting | ⚠️ Review | Implement on auth endpoints |

### Security Recommendations

\`\`\`typescript
// ✅ Always sanitize user content before display
import DOMPurify from 'dompurify';
const safeContent = DOMPurify.sanitize(userContent);

// ✅ Use parameterized queries (never template literals)
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// ✅ Mask sensitive data in API responses
function serializeUser(user: User) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

// ✅ Rate limit authentication endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.post('/api/auth/login', authLimiter, loginHandler);
\`\`\`

---

## Performance Assessment

### Optimization Opportunities

**1. Database Query Optimization**
\`\`\`sql
-- Ensure composite indexes for common query patterns
CREATE INDEX CONCURRENTLY idx_items_workspace_status
ON workspace_items(workspace_id, status, created_at DESC);

-- Use EXPLAIN ANALYZE on slow queries
EXPLAIN ANALYZE SELECT * FROM workspace_items
WHERE workspace_id = $1 AND status = 'active'
ORDER BY created_at DESC LIMIT 20;
\`\`\`

**2. React Rendering Optimization**
\`\`\`typescript
// Memoize expensive list renders
const ItemList = memo(function ItemList({ items }: { items: Item[] }) {
  return items.map(item => <ItemCard key={item.id} item={item} />);
});

// Use useMemo for derived data
const sortedItems = useMemo(
  () => [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  [items]
);
\`\`\`

**3. API Response Caching**
\`\`\`typescript
// Cache stable data at the edge
export async function GET(request: Request) {
  const data = await fetchStableData();
  return Response.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
  });
}
\`\`\`

---

## Maintainability Score

| Dimension | Score | Reasoning |
|-----------|-------|-----------|
| Code readability | 9/10 | TypeScript + descriptive naming |
| Test coverage approach | 8/10 | Trophy pattern well-defined |
| Documentation quality | 8/10 | Inline docs on complex logic |
| Dependency management | 9/10 | Minimal, purposeful dependencies |
| Error handling | 9/10 | Typed errors throughout |
| Deployment simplicity | 9/10 | Single-command deploy |

**Overall Maintainability: 8.7/10**

---

## Final Recommendations

### Must Do Before Launch
1. Add rate limiting to all authentication endpoints
2. Implement structured logging (never log passwords or tokens)
3. Add database query timeout configuration
4. Validate all environment variables at startup

### Should Do in Next Sprint
1. Add request ID tracing for debugging
2. Implement database connection pooling metrics
3. Add automated dependency vulnerability scanning (npm audit in CI)
4. Create runbook documentation for on-call engineers

### Nice to Have
1. OpenTelemetry for distributed tracing
2. Feature flag system for gradual rollouts
3. Automated performance regression testing
4. Database query performance monitoring dashboard

---

## Summary

The ${name} implementation plan represents a well-structured, security-conscious approach to modern web application development. The chosen stack is production-proven, the architecture scales horizontally, and the security posture is strong. With the minor improvements noted above, this project is ready to move into active development.

**Estimated Development Confidence: High**
**Risk Level: Low**
**Recommended Next Step: Begin Sprint 1 with authentication infrastructure**`;
  }
}
