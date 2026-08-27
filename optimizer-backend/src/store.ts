import { mkdir, readFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { config } from './config.js';
import type {
  AppState,
  RequestContext,
  SiteConnection,
  SiteRun,
  UserAccount,
  UserRole,
  Workspace,
  WorkspaceMembership,
} from './types.js';

const DEFAULT_STATE: AppState = {
  sites: [],
  runs: [],
};

const DEFAULT_WORKSPACE_ID = 'demo-workspace';
const DEFAULT_USER_ID = 'demo-admin';

type PersistedRow = {
  id: string;
  data: string;
};

type MembershipRow = {
  workspace_id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
};

let databasePromise: Promise<DatabaseSync> | null = null;

async function ensureStorePath() {
  const absolutePath = path.resolve(process.cwd(), config.STORE_PATH);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  return absolutePath;
}

function normalizeSite(site: SiteConnection): SiteConnection {
  return {
    ...site,
    workspaceId: site.workspaceId ?? DEFAULT_WORKSPACE_ID,
    ownerUserId: site.ownerUserId ?? DEFAULT_USER_ID,
  };
}

function parseRow<T>(row: PersistedRow | undefined | null): T | null {
  if (!row) return null;
  return JSON.parse(row.data) as T;
}

function parseRows<T>(rows: PersistedRow[]): T[] {
  return rows.map((row) => JSON.parse(row.data) as T);
}

function isSqliteHeader(buffer: Buffer) {
  return buffer.subarray(0, 16).equals(Buffer.from('SQLite format 3\0'));
}

async function readLegacyState(absolutePath: string): Promise<AppState | null> {
  try {
    const raw = await readFile(absolutePath);
    if (raw.byteLength === 0) return null;
    if (isSqliteHeader(raw)) return null;
    const decoded = raw.toString('utf8').trim();
    if (!decoded.startsWith('{')) {
      throw new Error('Legacy store file is neither SQLite nor JSON.');
    }
    return JSON.parse(decoded) as AppState;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

function createSchema(database: DatabaseSync) {
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;

    CREATE TABLE IF NOT EXISTS sites (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS runs (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      data TEXT NOT NULL,
      FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workspace_memberships (
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (workspace_id, user_id),
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_runs_site_created_at
      ON runs (site_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_workspace_memberships_workspace
      ON workspace_memberships (workspace_id, role);
  `);
}

function runTransaction<T>(database: DatabaseSync, operation: () => T): T {
  database.exec('BEGIN IMMEDIATE');
  try {
    const result = operation();
    database.exec('COMMIT');
    return result;
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}

function importLegacyState(database: DatabaseSync, state: AppState) {
  const insertSite = database.prepare(`
    INSERT OR REPLACE INTO sites (id, created_at, updated_at, data)
    VALUES (?, ?, ?, ?)
  `);
  const insertRun = database.prepare(`
    INSERT OR REPLACE INTO runs (id, site_id, created_at, data)
    VALUES (?, ?, ?, ?)
  `);

  runTransaction(database, () => {
    for (const site of state.sites) {
      const normalized = normalizeSite(site);
      insertSite.run(
        normalized.id,
        normalized.createdAt,
        normalized.updatedAt,
        JSON.stringify(normalized),
      );
    }
    for (const run of state.runs) {
      insertRun.run(run.id, run.siteId, run.createdAt, JSON.stringify(run));
    }
  });
}

async function openDatabase() {
  const absolutePath = await ensureStorePath();
  const legacyState = await readLegacyState(absolutePath);

  if (legacyState) {
    const backupPath = `${absolutePath}.legacy-${Date.now()}.json`;
    await rename(absolutePath, backupPath);
  }

  const database = new DatabaseSync(absolutePath);
  createSchema(database);

  if (legacyState) {
    importLegacyState(database, legacyState);
  }

  return database;
}

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = openDatabase();
  }
  return databasePromise;
}

export async function saveWorkspace(workspace: Workspace) {
  const database = await getDatabase();
  database
    .prepare(`
      INSERT INTO workspaces (id, data, created_at)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        data = excluded.data
    `)
    .run(workspace.id, JSON.stringify(workspace), workspace.createdAt);
  return workspace;
}

export async function listWorkspaces() {
  const database = await getDatabase();
  const rows = database
    .prepare('SELECT id, data FROM workspaces ORDER BY created_at ASC')
    .all() as PersistedRow[];
  return parseRows<Workspace>(rows);
}

export async function saveUser(user: UserAccount) {
  const database = await getDatabase();
  database
    .prepare(`
      INSERT INTO users (id, data, created_at)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        data = excluded.data
    `)
    .run(user.id, JSON.stringify(user), user.createdAt);
  return user;
}

export async function saveMembership(membership: WorkspaceMembership) {
  const database = await getDatabase();
  database
    .prepare(`
      INSERT INTO workspace_memberships (workspace_id, user_id, role, created_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(workspace_id, user_id) DO UPDATE SET
        role = excluded.role
    `)
    .run(membership.workspaceId, membership.userId, membership.role, membership.createdAt);
  return membership;
}

export async function getMembership(workspaceId: string, userId: string) {
  const database = await getDatabase();
  const row = database
    .prepare(`
      SELECT workspace_id, user_id, role, created_at
      FROM workspace_memberships
      WHERE workspace_id = ? AND user_id = ?
      LIMIT 1
    `)
    .get(workspaceId, userId) as MembershipRow | undefined;
  if (!row) return null;
  return {
    workspaceId: row.workspace_id,
    userId: row.user_id,
    role: row.role,
    createdAt: row.created_at,
  } satisfies WorkspaceMembership;
}

export async function listMemberships(workspaceId: string) {
  const database = await getDatabase();
  const rows = database
    .prepare(`
      SELECT workspace_id, user_id, role, created_at
      FROM workspace_memberships
      WHERE workspace_id = ?
      ORDER BY created_at ASC
    `)
    .all(workspaceId) as MembershipRow[];
  return rows.map((row) => ({
    workspaceId: row.workspace_id,
    userId: row.user_id,
    role: row.role,
    createdAt: row.created_at,
  })) satisfies WorkspaceMembership[];
}

export async function listSites(workspaceId?: string) {
  const database = await getDatabase();
  const rows = database
    .prepare('SELECT id, data FROM sites ORDER BY created_at DESC')
    .all() as PersistedRow[];
  const sites = parseRows<SiteConnection>(rows).map(normalizeSite);
  return workspaceId ? sites.filter((site) => site.workspaceId === workspaceId) : sites;
}

export async function listRuns(workspaceId?: string, siteId?: string) {
  const database = await getDatabase();
  const statement = siteId
    ? database.prepare('SELECT id, data FROM runs WHERE site_id = ? ORDER BY created_at DESC')
    : database.prepare('SELECT id, data FROM runs ORDER BY created_at DESC');
  const rows = (siteId ? statement.all(siteId) : statement.all()) as PersistedRow[];
  const runs = parseRows<SiteRun>(rows);
  if (!workspaceId) return runs;
  const sites = await listSites(workspaceId);
  const siteIds = new Set(sites.map((site) => site.id));
  return runs.filter((run) => siteIds.has(run.siteId));
}

export async function getSite(workspaceId: string, siteId: string) {
  const database = await getDatabase();
  const row = database
    .prepare('SELECT id, data FROM sites WHERE id = ? LIMIT 1')
    .get(siteId) as PersistedRow | undefined;
  const site = parseRow<SiteConnection>(row);
  if (!site) return null;
  const normalized = normalizeSite(site);
  return normalized.workspaceId === workspaceId ? normalized : null;
}

export async function getRun(runId: string) {
  const database = await getDatabase();
  const row = database
    .prepare('SELECT id, data FROM runs WHERE id = ? LIMIT 1')
    .get(runId) as PersistedRow | undefined;
  return parseRow<SiteRun>(row);
}

export async function saveSite(site: SiteConnection) {
  const database = await getDatabase();
  const normalized = normalizeSite(site);
  database
    .prepare(`
      INSERT INTO sites (id, created_at, updated_at, data)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        updated_at = excluded.updated_at,
        data = excluded.data
    `)
    .run(
      normalized.id,
      normalized.createdAt,
      normalized.updatedAt,
      JSON.stringify(normalized),
    );
  return normalized;
}

export async function saveRun(run: SiteRun) {
  const database = await getDatabase();
  database
    .prepare(`
      INSERT INTO runs (id, site_id, created_at, data)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        site_id = excluded.site_id,
        created_at = excluded.created_at,
        data = excluded.data
    `)
    .run(run.id, run.siteId, run.createdAt, JSON.stringify(run));
  return run;
}

export async function seedDemoDataIfEmpty(seedSites: SiteConnection[]) {
  const database = await getDatabase();
  const row = database.prepare('SELECT COUNT(*) as count FROM sites').get() as { count: number };
  if (row.count > 0) return;
  runTransaction(database, () => {
    const statement = database.prepare(`
      INSERT INTO sites (id, created_at, updated_at, data)
      VALUES (?, ?, ?, ?)
    `);
    for (const site of seedSites) {
      const normalized = normalizeSite(site);
      statement.run(
        normalized.id,
        normalized.createdAt,
        normalized.updatedAt,
        JSON.stringify(normalized),
      );
    }
  });
}

export async function seedAccessControlIfEmpty(input: {
  workspaces: Workspace[];
  users: UserAccount[];
  memberships: WorkspaceMembership[];
}) {
  const database = await getDatabase();
  const count = database
    .prepare('SELECT COUNT(*) as count FROM workspace_memberships')
    .get() as { count: number };
  if (count.count > 0) return;

  runTransaction(database, () => {
    const insertWorkspace = database.prepare(`
      INSERT INTO workspaces (id, data, created_at) VALUES (?, ?, ?)
    `);
    const insertUser = database.prepare(`
      INSERT INTO users (id, data, created_at) VALUES (?, ?, ?)
    `);
    const insertMembership = database.prepare(`
      INSERT INTO workspace_memberships (workspace_id, user_id, role, created_at)
      VALUES (?, ?, ?, ?)
    `);

    for (const workspace of input.workspaces) {
      insertWorkspace.run(workspace.id, JSON.stringify(workspace), workspace.createdAt);
    }
    for (const user of input.users) {
      insertUser.run(user.id, JSON.stringify(user), user.createdAt);
    }
    for (const membership of input.memberships) {
      insertMembership.run(
        membership.workspaceId,
        membership.userId,
        membership.role,
        membership.createdAt,
      );
    }
  });
}

export async function buildRequestContext(workspaceId: string, userId: string): Promise<RequestContext | null> {
  const membership = await getMembership(workspaceId, userId);
  if (!membership) return null;
  return {
    workspaceId: membership.workspaceId,
    userId: membership.userId,
    role: membership.role,
  };
}

export async function resetStateForTests() {
  const database = await getDatabase();
  runTransaction(database, () => {
    database.exec(`
      DELETE FROM runs;
      DELETE FROM sites;
      DELETE FROM workspace_memberships;
      DELETE FROM users;
      DELETE FROM workspaces;
    `);
  });
}
