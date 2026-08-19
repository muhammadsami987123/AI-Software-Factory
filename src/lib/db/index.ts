import Database from "better-sqlite3";
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

// ─── DB Initialization ────────────────────────────────────────────────────────

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  const dbPath = process.env.DATABASE_PATH || "./data/factory.db";
  const dir = path.dirname(path.resolve(dbPath));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  _db = new Database(dbPath);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      tech_stack TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'idle',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS factory_runs (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id),
      status TEXT NOT NULL DEFAULT 'running',
      mode TEXT NOT NULL DEFAULT 'demo',
      started_at TEXT NOT NULL,
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS agent_tasks (
      id TEXT PRIMARY KEY,
      run_id TEXT NOT NULL REFERENCES factory_runs(id),
      agent_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      started_at TEXT,
      completed_at TEXT,
      summary TEXT,
      duration_ms INTEGER
    );

    CREATE TABLE IF NOT EXISTS artifacts (
      id TEXT PRIMARY KEY,
      run_id TEXT NOT NULL REFERENCES factory_runs(id),
      agent_name TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activity_events (
      id TEXT PRIMARY KEY,
      run_id TEXT NOT NULL REFERENCES factory_runs(id),
      agent_name TEXT,
      event_type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_runs_project ON factory_runs(project_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_run ON agent_tasks(run_id);
    CREATE INDEX IF NOT EXISTS idx_artifacts_run ON artifacts(run_id);
    CREATE INDEX IF NOT EXISTS idx_events_run ON activity_events(run_id);
  `);
}

// ─── Row Mappers ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    techStack: JSON.parse(row.tech_stack || "[]"),
    status: row.status as ProjectStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRun(row: any): FactoryRun {
  return {
    id: row.id,
    projectId: row.project_id,
    status: row.status as RunStatus,
    mode: row.mode as AIMode,
    startedAt: row.started_at,
    completedAt: row.completed_at ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTask(row: any): AgentTask {
  return {
    id: row.id,
    runId: row.run_id,
    agentName: row.agent_name as AgentName,
    status: row.status as AgentTaskStatus,
    startedAt: row.started_at ?? null,
    completedAt: row.completed_at ?? null,
    summary: row.summary ?? null,
    durationMs: row.duration_ms ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArtifact(row: any): Artifact {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEvent(row: any): ActivityEvent {
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
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO projects (id, name, description, tech_stack, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'idle', ?, ?)`
  ).run(id, data.name, data.description, JSON.stringify(data.techStack), now, now);
  return mapProject(db.prepare("SELECT * FROM projects WHERE id = ?").get(id));
}

export function getProject(id: string): Project | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
  return row ? mapProject(row) : null;
}

export function listProjects(): Project[] {
  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (db.prepare("SELECT * FROM projects ORDER BY created_at DESC").all() as any[]).map(mapProject);
}

export function updateProjectStatus(id: string, status: ProjectStatus): void {
  const db = getDb();
  db.prepare("UPDATE projects SET status = ?, updated_at = ? WHERE id = ?").run(
    status,
    new Date().toISOString(),
    id
  );
}

// ─── Factory Runs ─────────────────────────────────────────────────────────────

export function createRun(projectId: string, mode: AIMode): FactoryRun {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO factory_runs (id, project_id, status, mode, started_at) VALUES (?, ?, 'running', ?, ?)`
  ).run(id, projectId, mode, now);
  return mapRun(db.prepare("SELECT * FROM factory_runs WHERE id = ?").get(id));
}

export function getRun(id: string): FactoryRun | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM factory_runs WHERE id = ?").get(id);
  return row ? mapRun(row) : null;
}

export function getLatestRunForProject(projectId: string): FactoryRun | null {
  const db = getDb();
  const row = db.prepare(
    "SELECT * FROM factory_runs WHERE project_id = ? ORDER BY started_at DESC LIMIT 1"
  ).get(projectId);
  return row ? mapRun(row) : null;
}

export function updateRunStatus(id: string, status: RunStatus): void {
  const db = getDb();
  const completedAt = status !== "running" ? new Date().toISOString() : null;
  db.prepare(
    "UPDATE factory_runs SET status = ?, completed_at = ? WHERE id = ?"
  ).run(status, completedAt, id);
}

// ─── Agent Tasks ──────────────────────────────────────────────────────────────

const AGENT_ORDER: AgentName[] = ["product", "architect", "developer", "qa", "reviewer"];

export function createAgentTasks(runId: string): AgentTask[] {
  const db = getDb();
  const now = new Date().toISOString();
  const tasks: AgentTask[] = [];
  for (const agentName of AGENT_ORDER) {
    const id = randomUUID();
    db.prepare(
      `INSERT INTO agent_tasks (id, run_id, agent_name, status, started_at, completed_at, summary, duration_ms)
       VALUES (?, ?, ?, 'pending', NULL, NULL, NULL, NULL)`
    ).run(id, runId, agentName);
    tasks.push({
      id,
      runId,
      agentName,
      status: "pending",
      startedAt: null,
      completedAt: null,
      summary: null,
      durationMs: null,
    });
    void now;
  }
  return tasks;
}

export function getTasksForRun(runId: string): AgentTask[] {
  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (db.prepare("SELECT * FROM agent_tasks WHERE run_id = ? ORDER BY rowid").all(runId) as any[]).map(mapTask);
}

export function updateTaskStarted(id: string): AgentTask {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    "UPDATE agent_tasks SET status = 'running', started_at = ? WHERE id = ?"
  ).run(now, id);
  return mapTask(db.prepare("SELECT * FROM agent_tasks WHERE id = ?").get(id));
}

export function updateTaskCompleted(
  id: string,
  summary: string,
  durationMs: number
): AgentTask {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    "UPDATE agent_tasks SET status = 'completed', completed_at = ?, summary = ?, duration_ms = ? WHERE id = ?"
  ).run(now, summary, durationMs, id);
  return mapTask(db.prepare("SELECT * FROM agent_tasks WHERE id = ?").get(id));
}

export function updateTaskFailed(id: string, summary: string): AgentTask {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    "UPDATE agent_tasks SET status = 'failed', completed_at = ?, summary = ? WHERE id = ?"
  ).run(now, summary, id);
  return mapTask(db.prepare("SELECT * FROM agent_tasks WHERE id = ?").get(id));
}

// ─── Artifacts ────────────────────────────────────────────────────────────────

export function createArtifact(data: {
  runId: string;
  agentName: AgentName;
  type: ArtifactType;
  title: string;
  content: string;
}): Artifact {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO artifacts (id, run_id, agent_name, type, title, content, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.runId, data.agentName, data.type, data.title, data.content, now);
  return mapArtifact(db.prepare("SELECT * FROM artifacts WHERE id = ?").get(id));
}

export function getArtifactsForRun(runId: string): Artifact[] {
  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (db.prepare("SELECT * FROM artifacts WHERE run_id = ? ORDER BY created_at").all(runId) as any[]).map(mapArtifact);
}

// ─── Activity Events ──────────────────────────────────────────────────────────

export function createEvent(data: {
  runId: string;
  agentName?: AgentName;
  eventType: ActivityEventType;
  message: string;
}): ActivityEvent {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO activity_events (id, run_id, agent_name, event_type, message, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, data.runId, data.agentName ?? null, data.eventType, data.message, now);
  return mapEvent(db.prepare("SELECT * FROM activity_events WHERE id = ?").get(id));
}

export function getEventsForRun(runId: string, afterRowId?: number): ActivityEvent[] {
  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rows: any[];
  if (afterRowId !== undefined) {
    rows = db
      .prepare("SELECT * FROM activity_events WHERE run_id = ? AND rowid > ? ORDER BY rowid")
      .all(runId, afterRowId) as any[];
  } else {
    rows = db
      .prepare("SELECT * FROM activity_events WHERE run_id = ? ORDER BY rowid")
      .all(runId) as any[];
  }
  return rows.map(mapEvent);
}

export function getLastEventRowId(runId: string): number {
  const db = getDb();
  const row = db
    .prepare("SELECT rowid FROM activity_events WHERE run_id = ? ORDER BY rowid DESC LIMIT 1")
    .get(runId) as { rowid: number } | undefined;
  return row?.rowid ?? 0;
}

export function getRecentEvents(limit = 50): ActivityEvent[] {
  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (db.prepare("SELECT * FROM activity_events ORDER BY created_at DESC LIMIT ?").all(limit) as any[]).map(mapEvent);
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function getSetting(key: string): string | null {
  const db = getDb();
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value ?? null;
}

export function setSetting(key: string, value: string): void {
  const db = getDb();
  db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).run(key, value);
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
  const db = getDb();
  const activeProjects = (
    db.prepare("SELECT COUNT(*) as c FROM projects WHERE status = 'running'").get() as { c: number }
  ).c;
  const completedProjects = (
    db.prepare("SELECT COUNT(*) as c FROM projects WHERE status = 'completed'").get() as { c: number }
  ).c;
  const totalRuns = (
    db.prepare("SELECT COUNT(*) as c FROM factory_runs").get() as { c: number }
  ).c;
  const completedRuns = (
    db.prepare("SELECT COUNT(*) as c FROM factory_runs WHERE status = 'completed'").get() as { c: number }
  ).c;
  const successRate = totalRuns > 0 ? Math.round((completedRuns / totalRuns) * 100) : 0;
  return { activeProjects, completedProjects, totalRuns, successRate };
}
