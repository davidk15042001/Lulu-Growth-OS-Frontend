import { mkdir, readFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { config } from './config.js';
import type { AppState, SiteConnection, SiteRun } from './types.js';

const DEFAULT_STATE: AppState = {
  sites: [],
  runs: [],
};

type PersistedRow = {
  id: string;
  data: string;
};

let databasePromise: Promise<DatabaseSync> | null = null;

async function ensureStorePath() {
  const absolutePath = path.resolve(process.cwd(), config.STORE_PATH);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  return absolutePath;
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

    CREATE INDEX IF NOT EXISTS idx_runs_site_created_at
      ON runs (site_id, created_at DESC);
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
      insertSite.run(site.id, site.createdAt, site.updatedAt, JSON.stringify(site));
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

export async function listSites() {
  const database = await getDatabase();
  const rows = database
    .prepare('SELECT id, data FROM sites ORDER BY created_at DESC')
    .all() as PersistedRow[];
  return parseRows<SiteConnection>(rows);
}

export async function listRuns(siteId?: string) {
  const database = await getDatabase();
  const statement = siteId
    ? database.prepare('SELECT id, data FROM runs WHERE site_id = ? ORDER BY created_at DESC')
    : database.prepare('SELECT id, data FROM runs ORDER BY created_at DESC');
  const rows = (siteId ? statement.all(siteId) : statement.all()) as PersistedRow[];
  return parseRows<SiteRun>(rows);
}

export async function getSite(siteId: string) {
  const database = await getDatabase();
  const row = database
    .prepare('SELECT id, data FROM sites WHERE id = ? LIMIT 1')
    .get(siteId) as PersistedRow | undefined;
  return parseRow<SiteConnection>(row);
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
  database
    .prepare(`
      INSERT INTO sites (id, created_at, updated_at, data)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        updated_at = excluded.updated_at,
        data = excluded.data
    `)
    .run(site.id, site.createdAt, site.updatedAt, JSON.stringify(site));
  return site;
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
      statement.run(site.id, site.createdAt, site.updatedAt, JSON.stringify(site));
    }
  });
}

export async function resetStateForTests() {
  const database = await getDatabase();
  runTransaction(database, () => {
    database.exec('DELETE FROM runs; DELETE FROM sites;');
  });
}
