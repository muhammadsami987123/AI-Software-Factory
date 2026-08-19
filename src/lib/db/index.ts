/**
 * Pure JavaScript JSON file database.
 * No native modules — works on all platforms without compilation.
 */

import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type {
  Project,
  FactoryRun,
  AgentTask,
  Artifact,
  ActivityEvent,
  AgentName,
  ProjectStatus,
  RunStatus,
  AgentTaskStatus,
  ArtifactType,
  ActivityEventType,
  AIMode,
  Settings,
} from "@/types";

// ─── Internal Row Types ───────────────────────────────────────────────────────

interface ProjectRow {
  id: string;
  name: string;
  description: string;
  tech_stack: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface RunRow {
  id: string;
  project_id: string;
  status: string;
  mode: string;
  started_at: string;
  completed_at: string | null;
}

interface TaskRow {
  id: string;
  run_id: string;
  agent_name: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  summary: string | null;
  duration_ms: number | null;
}

interface ArtifactRow {
  id: string;
  run_id: string;
  agent_name: string;
  type: string;
  title: string;
  content: string;
  created_at: string;
}

interface EventRow {
  id: string;
  run_id: string;
  agent_name: string | null;
  event_type: string;
  message: string;
  created_at: string;
  _row_id: number;
}

interface JsonDbData {
  projects: Record<string, ProjectRow>;
  factory_runs: Record<string, RunRow>;
  agent_tasks: Record<string, TaskRow>;
  artifacts: Record<string, ArtifactRow>;
  activity_events: EventRow[];
  settings: Record<string, string>;
  _next_row_id: number;
}

// ─── DB File Path ─────────────────────────────────────────────────────────────

function getDbPath(): string {
  return path.resolve(process.env.DATABASE_PATH ?? "./data/factory.db.json");
}

function emptyDb(): JsonDbData {
  return {
    projects: {},
    factory_runs: {},
    agent_tasks: {},
    artifacts: {},
    activity_events: [],
    settings: {},
    _next_row_id: 1,
  };
}

function readDb(): JsonDbData {
  const dbPath = getDbPath();
  if (!fs.existsSync(dbPath)) return emptyDb();
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(raw) as JsonDbData;
  } catch {
    return emptyDb();
  }
}

function writeDb(data: JsonDbData): void {
  const dbPath = getDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = dbPath + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmp, dbPath);
}

// ─── Row Mappers ─────────────────────────────────────────────────────────────

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    techStack: JSON.parse(row.tech_stack || "[]") as string[],
    status: row.status as ProjectStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRun(row: RunRow): FactoryRun {
  return {
    id: row.id,
    projectId: row.project_id,
    status: row.status as RunStatus,
    mode: row.mode as AIMode,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  };
}

function mapTask(row: TaskRow): AgentTask {
  return {
    id: row.id,
    runId: row.run_id,
    agentName: row.agent_name as AgentName,
    status: row.status as AgentTaskStatus,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    summary: row.summary,
    durationMs: row.duration_ms,
  };
}

function mapArtifact(row: ArtifactRow): Artifact {
  return {
    id: row.id,
    runId: row.run_id,
    agentName: row.agent_name as AgentName,
    type: row.type as ArtifactType,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
  };
}

function mapEvent(row: EventRow): ActivityEvent {
  return {
    id: row.id,
    runId: row.run_id,
    agentName: (row.agent_name as AgentName) ?? null,
    eventType: row.event_type as ActivityEventType,
    message: row.message,
    createdAt: row.created_at,
  };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export function createProject(data: {
  name: string;
  description: string;
  techStack: string[];
}): Project {
  const db = readDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  db.projects[id] = {
    id,
    name: data.name,
    description: data.description,
    tech_stack: JSON.stringify(data.techStack),
    status: "idle",
    created_at: now,
    updated_at: now,
  };
  writeDb(db);
  return mapProject(db.projects[id]);
}

export function getProject(id: string): Project | null {
  const db = readDb();
  const row = db.projects[id];
  return row ? mapProject(row) : null;
}

export function listProjects(): Project[] {
  const db = readDb();
  return Object.values(db.projects)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(mapProject);
}

export function updateProjectStatus(id: string, status: ProjectStatus): void {
  const db = readDb();
  if (db.projects[id]) {
    db.projects[id].status = status;
    db.projects[id].updated_at = new Date().toISOString();
    writeDb(db);
  }
}

// ─── Factory Runs ─────────────────────────────────────────────────────────────

export function createRun(projectId: string, mode: AIMode): FactoryRun {
  const db = readDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  db.factory_runs[id] = {
    id,
    project_id: projectId,
    status: "running",
    mode,
    started_at: now,
    completed_at: null,
  };
  writeDb(db);
  return mapRun(db.factory_runs[id]);
}

export function getRun(id: string): FactoryRun | null {
  const db = readDb();
  const row = db.factory_runs[id];
  return row ? mapRun(row) : null;
}

export function getLatestRunForProject(projectId: string): FactoryRun | null {
  const db = readDb();
  const runs = Object.values(db.factory_runs)
    .filter((r) => r.project_id === projectId)
    .sort((a, b) => b.started_at.localeCompare(a.started_at));
  return runs[0] ? mapRun(runs[0]) : null;
}

export function updateRunStatus(id: string, status: RunStatus): void {
  const db = readDb();
  if (db.factory_runs[id]) {
    db.factory_runs[id].status = status;
    if (status !== "running") {
      db.factory_runs[id].completed_at = new Date().toISOString();
    }
    writeDb(db);
  }
}

// ─── Agent Tasks ──────────────────────────────────────────────────────────────

const AGENT_ORDER: AgentName[] = ["product", "architect", "developer", "qa", "reviewer"];

export function createAgentTasks(runId: string): AgentTask[] {
  const db = readDb();
  const tasks: AgentTask[] = [];
  for (const agentName of AGENT_ORDER) {
    const id = randomUUID();
    const row: TaskRow = {
      id,
      run_id: runId,
      agent_name: agentName,
      status: "pending",
      started_at: null,
      completed_at: null,
      summary: null,
      duration_ms: null,
    };
    db.agent_tasks[id] = row;
    tasks.push(mapTask(row));
  }
  writeDb(db);
  return tasks;
}

export function getTasksForRun(runId: string): AgentTask[] {
  const db = readDb();
  return Object.values(db.agent_tasks)
    .filter((t) => t.run_id === runId)
    .sort((a, b) => AGENT_ORDER.indexOf(a.agent_name as AgentName) - AGENT_ORDER.indexOf(b.agent_name as AgentName))
    .map(mapTask);
}

export function updateTaskStarted(id: string): AgentTask {
  const db = readDb();
  if (db.agent_tasks[id]) {
    db.agent_tasks[id].status = "running";
    db.agent_tasks[id].started_at = new Date().toISOString();
    writeDb(db);
  }
  return mapTask(db.agent_tasks[id]);
}

export function updateTaskCompleted(id: string, summary: string, durationMs: number): AgentTask {
  const db = readDb();
  if (db.agent_tasks[id]) {
    db.agent_tasks[id].status = "completed";
    db.agent_tasks[id].completed_at = new Date().toISOString();
    db.agent_tasks[id].summary = summary;
    db.agent_tasks[id].duration_ms = durationMs;
    writeDb(db);
  }
  return mapTask(db.agent_tasks[id]);
}

export function updateTaskFailed(id: string, summary: string): AgentTask {
  const db = readDb();
  if (db.agent_tasks[id]) {
    db.agent_tasks[id].status = "failed";
    db.agent_tasks[id].completed_at = new Date().toISOString();
    db.agent_tasks[id].summary = summary;
    writeDb(db);
  }
  return mapTask(db.agent_tasks[id]);
}

// ─── Artifacts ────────────────────────────────────────────────────────────────

export function createArtifact(data: {
  runId: string;
  agentName: AgentName;
  type: ArtifactType;
  title: string;
  content: string;
}): Artifact {
  const db = readDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  const row: ArtifactRow = {
    id,
    run_id: data.runId,
    agent_name: data.agentName,
    type: data.type,
    title: data.title,
    content: data.content,
    created_at: now,
  };
  db.artifacts[id] = row;
  writeDb(db);
  return mapArtifact(row);
}

export function getArtifactsForRun(runId: string): Artifact[] {
  const db = readDb();
  return Object.values(db.artifacts)
    .filter((a) => a.run_id === runId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map(mapArtifact);
}

// ─── Activity Events ──────────────────────────────────────────────────────────

export function createEvent(data: {
  runId: string;
  agentName?: AgentName;
  eventType: ActivityEventType;
  message: string;
}): ActivityEvent {
  const db = readDb();
  const id = randomUUID();
  const rowId = db._next_row_id++;
  const row: EventRow = {
    id,
    run_id: data.runId,
    agent_name: data.agentName ?? null,
    event_type: data.eventType,
    message: data.message,
    created_at: new Date().toISOString(),
    _row_id: rowId,
  };
  db.activity_events.push(row);
  writeDb(db);
  return mapEvent(row);
}

export function getEventsForRun(runId: string, afterRowId?: number): ActivityEvent[] {
  const db = readDb();
  return db.activity_events
    .filter((e) => e.run_id === runId && (afterRowId === undefined || e._row_id > afterRowId))
    .map(mapEvent);
}

export function getLastEventRowId(runId: string): number {
  const db = readDb();
  const events = db.activity_events.filter((e) => e.run_id === runId);
  if (events.length === 0) return 0;
  return events[events.length - 1]._row_id;
}

export function getRecentEvents(limit = 50): ActivityEvent[] {
  const db = readDb();
  return db.activity_events
    .slice(-limit)
    .reverse()
    .map(mapEvent);
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function getSetting(key: string): string | null {
  const db = readDb();
  return db.settings[key] ?? null;
}

export function setSetting(key: string, value: string): void {
  const db = readDb();
  db.settings[key] = value;
  writeDb(db);
}

export function getSettings(): Settings {
  return {
    aiProvider: (getSetting("ai_provider") ?? process.env.AI_PROVIDER ?? "demo") as Settings["aiProvider"],
    anthropicApiKey: getSetting("anthropic_api_key"),
    openaiApiKey: getSetting("openai_api_key"),
    anthropicModel: getSetting("anthropic_model") ?? "claude-sonnet-4-6",
    openaiModel: getSetting("openai_model") ?? "gpt-4o",
  };
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function getDashboardStats() {
  const db = readDb();
  const projects = Object.values(db.projects);
  const runs = Object.values(db.factory_runs);
  const activeProjects = projects.filter((p) => p.status === "running").length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const totalRuns = runs.length;
  const completedRuns = runs.filter((r) => r.status === "completed").length;
  const successRate = totalRuns > 0 ? Math.round((completedRuns / totalRuns) * 100) : 0;
  return { activeProjects, completedProjects, totalRuns, successRate };
}
