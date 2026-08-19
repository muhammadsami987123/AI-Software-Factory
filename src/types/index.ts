// ─── Core Domain Types ────────────────────────────────────────────────────────

export type AgentName = "product" | "architect" | "developer" | "qa" | "reviewer";
export type ProjectStatus = "idle" | "running" | "completed" | "failed";
export type RunStatus = "running" | "completed" | "failed";
export type AgentTaskStatus = "pending" | "running" | "completed" | "failed";
export type AIMode = "demo" | "anthropic" | "openai";

export type ArtifactType =
  | "requirements"
  | "user-stories"
  | "architecture"
  | "db-schema"
  | "api-plan"
  | "component-plan"
  | "tech-plan"
  | "test-plan"
  | "edge-cases"
  | "review-summary"
  | "recommendations";

export type ActivityEventType =
  | "run_started"
  | "agent_started"
  | "agent_progress"
  | "agent_completed"
  | "agent_failed"
  | "artifact_created"
  | "run_completed"
  | "run_failed";

// ─── Entity Interfaces ────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FactoryRun {
  id: string;
  projectId: string;
  status: RunStatus;
  mode: AIMode;
  startedAt: string;
  completedAt: string | null;
}

export interface AgentTask {
  id: string;
  runId: string;
  agentName: AgentName;
  status: AgentTaskStatus;
  startedAt: string | null;
  completedAt: string | null;
  summary: string | null;
  durationMs: number | null;
}

export interface Artifact {
  id: string;
  runId: string;
  agentName: AgentName;
  type: ArtifactType;
  title: string;
  content: string;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  runId: string;
  agentName: AgentName | null;
  eventType: ActivityEventType;
  message: string;
  createdAt: string;
}

export interface Settings {
  aiProvider: AIMode;
  anthropicApiKey: string | null;
  openaiApiKey: string | null;
  anthropicModel: string;
  openaiModel: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  activeProjects: number;
  completedProjects: number;
  totalRuns: number;
  successRate: number;
}

// ─── Agent Display Metadata ───────────────────────────────────────────────────

export interface AgentDisplayInfo {
  name: AgentName;
  displayName: string;
  role: string;
  description: string;
  responsibilities: string[];
}

// ─── SSE Event ───────────────────────────────────────────────────────────────

export interface SSEPayload {
  type: ActivityEventType | "run_completed" | "run_failed" | "state_snapshot";
  event?: ActivityEvent;
  task?: AgentTask;
  artifact?: Artifact;
  run?: FactoryRun;
  tasks?: AgentTask[];
  events?: ActivityEvent[];
}

// ─── AI Layer ────────────────────────────────────────────────────────────────

export interface CompletionOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface AIProvider {
  mode: AIMode;
  complete(prompt: string, options?: CompletionOptions): Promise<string>;
}

// ─── Agent Layer ─────────────────────────────────────────────────────────────

export interface AgentContext {
  projectId: string;
  runId: string;
  projectName: string;
  projectDescription: string;
  techStack: string[];
  previousArtifacts: Artifact[];
  provider: AIProvider;
}

export interface AgentResult {
  status: "completed" | "failed";
  artifacts: Omit<Artifact, "id" | "runId" | "createdAt">[];
  summary: string;
  durationMs: number;
}

export interface AgentInterface {
  agentName: AgentName;
  displayName: string;
  run(context: AgentContext): Promise<AgentResult>;
}
