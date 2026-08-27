import { copyFile, mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { config } from './config.js';
import type {
  AppState,
  AuditLogEntry,
  AuthSession,
  PasswordResetToken,
  Permission,
  RequestContext,
  RunQueueJob,
  SiteConnection,
  SiteRun,
  StoreBackup,
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

type UserRow = {
  id: string;
  email: string | null;
  data: string;
};

type SessionRow = {
  id: string;
  user_id: string;
  workspace_id: string;
  refresh_token_hash: string;
  expires_at: string;
  revoked_at: string | null;
  data: string;
};

type PasswordResetTokenRow = {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
  revoked_at: string | null;
  data: string;
};

type QueueJobRow = {
  id: string;
  workspace_id: string;
  site_id: string;
  run_id: string;
  status: RunQueueJob['status'];
  created_at: string;
  data: string;
};

let databasePromise: Promise<DatabaseSync> | null = null;
let databaseInstance: DatabaseSync | null = null;

async function ensureStorePath() {
  const absolutePath = path.resolve(process.cwd(), config.STORE_PATH);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  return absolutePath;
}

async function ensureBackupDirectory() {
  const absolutePath = path.resolve(process.cwd(), config.BACKUP_DIR);
  await mkdir(absolutePath, { recursive: true });
  return absolutePath;
}

function backupMetadataPath(directoryPath: string, backupId: string) {
  return path.join(directoryPath, `${backupId}.json`);
}

function sanitizeBackupReason(reason?: string) {
  if (!reason) return undefined;
  const normalized = reason.trim().slice(0, 80);
  return normalized.length > 0 ? normalized : undefined;
}

function normalizeSite(site: SiteConnection): SiteConnection {
  return {
    ...site,
    workspaceId: site.workspaceId ?? DEFAULT_WORKSPACE_ID,
    ownerUserId: site.ownerUserId ?? DEFAULT_USER_ID,
  };
}

function normalizeUser(user: UserAccount): UserAccount {
  return {
    ...user,
    email: user.email.trim().toLowerCase(),
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
      email TEXT,
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

    CREATE TABLE IF NOT EXISTS auth_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      refresh_token_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      revoked_at TEXT,
      data TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      actor_user_id TEXT,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      outcome TEXT NOT NULL,
      created_at TEXT NOT NULL,
      data TEXT NOT NULL,
      FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used_at TEXT,
      revoked_at TEXT,
      data TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS run_queue_jobs (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      site_id TEXT NOT NULL,
      run_id TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      data TEXT NOT NULL,
      FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_runs_site_created_at
      ON runs (site_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_workspace_memberships_workspace
      ON workspace_memberships (workspace_id, role);

    CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_workspace
      ON auth_sessions (user_id, workspace_id, expires_at DESC);

    CREATE INDEX IF NOT EXISTS idx_auth_sessions_refresh_token_hash
      ON auth_sessions (refresh_token_hash);

    CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace_created_at
      ON audit_logs (workspace_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user
      ON password_reset_tokens (user_id, expires_at DESC);

    CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_hash
      ON password_reset_tokens (token_hash);

    CREATE INDEX IF NOT EXISTS idx_run_queue_jobs_workspace_status
      ON run_queue_jobs (workspace_id, status, created_at ASC);
  `);

  const userColumns = database.prepare('PRAGMA table_info(users)').all() as Array<{ name: string }>;
  if (!userColumns.some((column) => column.name === 'email')) {
    database.exec('ALTER TABLE users ADD COLUMN email TEXT');
  }

  const authSessionColumns = database
    .prepare('PRAGMA table_info(auth_sessions)')
    .all() as Array<{ name: string }>;
  if (!authSessionColumns.some((column) => column.name === 'refresh_token_hash')) {
    database.exec('ALTER TABLE auth_sessions ADD COLUMN refresh_token_hash TEXT');
  }

  const passwordResetColumns = database
    .prepare('PRAGMA table_info(password_reset_tokens)')
    .all() as Array<{ name: string }>;
  if (passwordResetColumns.length > 0 && !passwordResetColumns.some((column) => column.name === 'token_hash')) {
    database.exec('ALTER TABLE password_reset_tokens ADD COLUMN token_hash TEXT');
  }

  const existingUsers = database
    .prepare('SELECT id, email, data FROM users WHERE email IS NULL OR email = ?')
    .all('') as UserRow[];

  if (existingUsers.length > 0) {
    const updateEmail = database.prepare(`
      UPDATE users
      SET email = ?
      WHERE id = ?
    `);

    runTransaction(database, () => {
      for (const row of existingUsers) {
        const user = normalizeUser(JSON.parse(row.data) as UserAccount);
        updateEmail.run(user.email, user.id);
      }
    });
  }

  database.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email
      ON users (email);
  `);

  const existingMigrations = database
    .prepare('SELECT COUNT(*) as count FROM schema_migrations')
    .get() as { count: number };
  if (existingMigrations.count === 0) {
    const appliedAt = new Date().toISOString();
    database
      .prepare(`
        INSERT OR IGNORE INTO schema_migrations (version, name, applied_at)
        VALUES (?, ?, ?)
      `)
      .run(1, 'baseline_schema', appliedAt);
    database
      .prepare(`
        INSERT OR IGNORE INTO schema_migrations (version, name, applied_at)
        VALUES (?, ?, ?)
      `)
      .run(2, 'auth_email_indexes', appliedAt);
    database
      .prepare(`
        INSERT OR IGNORE INTO schema_migrations (version, name, applied_at)
        VALUES (?, ?, ?)
      `)
      .run(3, 'run_queue_jobs', appliedAt);
  }
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
  databaseInstance = database;

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

export async function closeDatabaseConnection() {
  const database = databasePromise ? await databasePromise : databaseInstance;
  databasePromise = null;
  if (database) {
    database.close();
  }
  databaseInstance = null;
}

export async function listAppliedMigrations() {
  const database = await getDatabase();
  return database
    .prepare(`
      SELECT version, name, applied_at
      FROM schema_migrations
      ORDER BY version ASC
    `)
    .all() as Array<{ version: number; name: string; applied_at: string }>;
}

export async function getStoreStatus() {
  const storePath = await ensureStorePath();
  try {
    const fileStat = await stat(storePath);
    return {
      path: storePath,
      exists: true,
      sizeBytes: fileStat.size,
      updatedAt: fileStat.mtime.toISOString(),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {
        path: storePath,
        exists: false,
        sizeBytes: 0,
        updatedAt: null,
      };
    }
    throw error;
  }
}

async function readBackupMetadata(filePath: string) {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw) as StoreBackup;
}

async function cleanupOldBackups(backups: StoreBackup[], backupDirectory: string) {
  const staleBackups = backups.slice(config.BACKUP_RETENTION_COUNT);
  await Promise.all(
    staleBackups.flatMap((backup) => [
      rm(path.join(backupDirectory, backup.fileName), { force: true }),
      rm(backupMetadataPath(backupDirectory, backup.id), { force: true }),
    ]),
  );
}

export async function listStoreBackups() {
  const backupDirectory = await ensureBackupDirectory();
  const entries = await readdir(backupDirectory);
  const metadataFiles = entries.filter((entry) => entry.endsWith('.json'));
  const backups = await Promise.all(
    metadataFiles.map(async (entry) => readBackupMetadata(path.join(backupDirectory, entry))),
  );
  return backups.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function createStoreBackup(reason?: string) {
  const database = await getDatabase();
  const backupDirectory = await ensureBackupDirectory();
  const backupId = `backup-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const fileName = `${backupId}.sqlite`;
  const destinationPath = path.join(backupDirectory, fileName);
  const normalizedReason = sanitizeBackupReason(reason);

  database.exec('PRAGMA wal_checkpoint(FULL);');
  database.exec(`VACUUM INTO '${destinationPath.replace(/'/g, "''")}'`);

  const fileStat = await stat(destinationPath);
  const backup: StoreBackup = {
    id: backupId,
    fileName,
    createdAt: new Date().toISOString(),
    sizeBytes: fileStat.size,
    reason: normalizedReason,
    sourcePath: path.resolve(process.cwd(), config.STORE_PATH),
  };

  await writeFile(
    backupMetadataPath(backupDirectory, backup.id),
    JSON.stringify(backup, null, 2),
    'utf8',
  );
  await cleanupOldBackups(await listStoreBackups(), backupDirectory);
  return backup;
}

export async function restoreStoreBackup(backupId: string) {
  const backupDirectory = await ensureBackupDirectory();
  const metadata = await readBackupMetadata(backupMetadataPath(backupDirectory, backupId));
  const sourcePath = path.join(backupDirectory, metadata.fileName);
  const storePath = await ensureStorePath();

  await closeDatabaseConnection();
  await rm(storePath, { force: true });
  await rm(`${storePath}-wal`, { force: true });
  await rm(`${storePath}-shm`, { force: true });
  await copyFile(sourcePath, storePath);
  await getDatabase();

  return metadata;
}

export function permissionsForRole(role: UserRole): Permission[] {
  const permissionsByRole: Record<UserRole, Permission[]> = {
    viewer: ['sites:read'],
    editor: ['sites:read', 'sites:write', 'runs:execute'],
    admin: [
      'sites:read',
      'sites:write',
      'runs:execute',
      'scheduler:run',
      'admin:users:read',
      'admin:users:write',
      'admin:sessions:read',
      'admin:sessions:revoke',
      'admin:audit:read',
      'admin:metrics:read',
      'admin:queue:read',
      'admin:migrations:read',
      'admin:backups:read',
      'admin:backups:write',
    ],
  };
  return permissionsByRole[role];
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
  const normalized = normalizeUser(user);
  database
    .prepare(`
      INSERT INTO users (id, email, data, created_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email = excluded.email,
        data = excluded.data
    `)
    .run(normalized.id, normalized.email, JSON.stringify(normalized), normalized.createdAt);
  return normalized;
}

export async function getUser(userId: string) {
  const database = await getDatabase();
  const row = database
    .prepare(`
      SELECT id, email, data
      FROM users
      WHERE id = ?
      LIMIT 1
    `)
    .get(userId) as UserRow | undefined;
  const user = parseRow<UserAccount>(row);
  return user ? normalizeUser(user) : null;
}

export async function getUserByEmail(email: string) {
  const database = await getDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const row = database
    .prepare(`
      SELECT id, email, data
      FROM users
      WHERE email = ?
      LIMIT 1
    `)
    .get(normalizedEmail) as UserRow | undefined;
  const user = parseRow<UserAccount>(row);
  return user ? normalizeUser(user) : null;
}

export async function listUsers() {
  const database = await getDatabase();
  const rows = database.prepare('SELECT id, email, data FROM users ORDER BY created_at ASC').all() as UserRow[];
  return rows
    .map((row) => parseRow<UserAccount>(row))
    .filter((user): user is UserAccount => Boolean(user))
    .map(normalizeUser);
}

export async function saveAuthSession(session: AuthSession) {
  const database = await getDatabase();
  database
    .prepare(`
      INSERT INTO auth_sessions (
        id,
        user_id,
        workspace_id,
        refresh_token_hash,
        expires_at,
        revoked_at,
        data
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        refresh_token_hash = excluded.refresh_token_hash,
        expires_at = excluded.expires_at,
        revoked_at = excluded.revoked_at,
        data = excluded.data
    `)
    .run(
      session.id,
      session.userId,
      session.workspaceId,
      session.refreshTokenHash,
      session.expiresAt,
      session.revokedAt ?? null,
      JSON.stringify(session),
    );
  return session;
}

export async function getAuthSession(sessionId: string) {
  const database = await getDatabase();
  const row = database
    .prepare(`
      SELECT id, user_id, workspace_id, refresh_token_hash, expires_at, revoked_at, data
      FROM auth_sessions
      WHERE id = ?
      LIMIT 1
    `)
    .get(sessionId) as SessionRow | undefined;
  return parseRow<AuthSession>(row);
}

export async function getAuthSessionByRefreshTokenHash(refreshTokenHash: string) {
  const database = await getDatabase();
  const row = database
    .prepare(`
      SELECT id, user_id, workspace_id, refresh_token_hash, expires_at, revoked_at, data
      FROM auth_sessions
      WHERE refresh_token_hash = ? AND revoked_at IS NULL
      LIMIT 1
    `)
    .get(refreshTokenHash) as SessionRow | undefined;
  return parseRow<AuthSession>(row);
}

export async function revokeAuthSession(
  sessionId: string,
  input: { revokedAt: string; reason: string; replacedBySessionId?: string },
) {
  const session = await getAuthSession(sessionId);
  if (!session) return null;
  const revokedSession: AuthSession = {
    ...session,
    revokedAt: input.revokedAt,
    revokedReason: input.reason,
    replacedBySessionId: input.replacedBySessionId,
  };
  await saveAuthSession(revokedSession);
  return revokedSession;
}

export async function revokeUserWorkspaceSessions(
  workspaceId: string,
  userId: string,
  input: { revokedAt: string; reason: string; exceptSessionId?: string },
) {
  const database = await getDatabase();
  const rows = database
    .prepare(`
      SELECT id, user_id, workspace_id, refresh_token_hash, expires_at, revoked_at, data
      FROM auth_sessions
      WHERE user_id = ? AND workspace_id = ? AND revoked_at IS NULL
    `)
    .all(userId, workspaceId) as SessionRow[];

  const sessions = rows
    .map((row) => parseRow<AuthSession>(row))
    .filter((session): session is AuthSession => Boolean(session))
    .filter((session) => session.id !== input.exceptSessionId);

  await Promise.all(
    sessions.map((session) =>
      revokeAuthSession(session.id, {
        revokedAt: input.revokedAt,
        reason: input.reason,
      }),
    ),
  );

  return sessions.length;
}

export async function listAuthSessions(workspaceId?: string, userId?: string) {
  const database = await getDatabase();
  let rows: SessionRow[];
  if (workspaceId && userId) {
    rows = database
      .prepare(`
        SELECT id, user_id, workspace_id, refresh_token_hash, expires_at, revoked_at, data
        FROM auth_sessions
        WHERE workspace_id = ? AND user_id = ?
        ORDER BY expires_at DESC
      `)
      .all(workspaceId, userId) as SessionRow[];
  } else if (workspaceId) {
    rows = database
      .prepare(`
        SELECT id, user_id, workspace_id, refresh_token_hash, expires_at, revoked_at, data
        FROM auth_sessions
        WHERE workspace_id = ?
        ORDER BY expires_at DESC
      `)
      .all(workspaceId) as SessionRow[];
  } else if (userId) {
    rows = database
      .prepare(`
        SELECT id, user_id, workspace_id, refresh_token_hash, expires_at, revoked_at, data
        FROM auth_sessions
        WHERE user_id = ?
        ORDER BY expires_at DESC
      `)
      .all(userId) as SessionRow[];
  } else {
    rows = database
      .prepare(`
        SELECT id, user_id, workspace_id, refresh_token_hash, expires_at, revoked_at, data
        FROM auth_sessions
        ORDER BY expires_at DESC
      `)
      .all() as SessionRow[];
  }

  return rows
    .map((row) => parseRow<AuthSession>(row))
    .filter((session): session is AuthSession => Boolean(session));
}

export async function savePasswordResetToken(token: PasswordResetToken) {
  const database = await getDatabase();
  database
    .prepare(`
      INSERT INTO password_reset_tokens (
        id,
        user_id,
        token_hash,
        expires_at,
        used_at,
        revoked_at,
        data
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        token_hash = excluded.token_hash,
        expires_at = excluded.expires_at,
        used_at = excluded.used_at,
        revoked_at = excluded.revoked_at,
        data = excluded.data
    `)
    .run(
      token.id,
      token.userId,
      token.tokenHash,
      token.expiresAt,
      token.usedAt ?? null,
      token.revokedAt ?? null,
      JSON.stringify(token),
    );
  return token;
}

export async function getPasswordResetTokenByHash(tokenHash: string) {
  const database = await getDatabase();
  const row = database
    .prepare(`
      SELECT id, user_id, token_hash, expires_at, used_at, revoked_at, data
      FROM password_reset_tokens
      WHERE token_hash = ?
      LIMIT 1
    `)
    .get(tokenHash) as PasswordResetTokenRow | undefined;
  return parseRow<PasswordResetToken>(row);
}

export async function revokeOutstandingPasswordResetTokens(userId: string, revokedAt: string) {
  const database = await getDatabase();
  const rows = database
    .prepare(`
      SELECT id, user_id, token_hash, expires_at, used_at, revoked_at, data
      FROM password_reset_tokens
      WHERE user_id = ? AND used_at IS NULL AND revoked_at IS NULL
    `)
    .all(userId) as PasswordResetTokenRow[];

  await Promise.all(
    rows
      .map((row) => parseRow<PasswordResetToken>(row))
      .filter((token): token is PasswordResetToken => Boolean(token))
      .map((token) =>
        savePasswordResetToken({
          ...token,
          revokedAt,
        }),
      ),
  );
}

export async function saveAuditLog(entry: AuditLogEntry) {
  const database = await getDatabase();
  database
    .prepare(`
      INSERT INTO audit_logs (
        id,
        workspace_id,
        actor_user_id,
        action,
        target_type,
        target_id,
        outcome,
        created_at,
        data
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      entry.id,
      entry.workspaceId ?? null,
      entry.actorUserId ?? null,
      entry.action,
      entry.targetType,
      entry.targetId ?? null,
      entry.outcome,
      entry.createdAt,
      JSON.stringify(entry),
    );
  return entry;
}

export async function listAuditLogs(workspaceId: string, limit = 100) {
  const database = await getDatabase();
  const rows = database
    .prepare(`
      SELECT id, data
      FROM audit_logs
      WHERE workspace_id = ? OR workspace_id IS NULL
      ORDER BY created_at DESC
      LIMIT ?
    `)
    .all(workspaceId, limit) as PersistedRow[];
  return parseRows<AuditLogEntry>(rows);
}

export async function saveRunQueueJob(job: RunQueueJob) {
  const database = await getDatabase();
  database
    .prepare(`
      INSERT INTO run_queue_jobs (id, workspace_id, site_id, run_id, status, created_at, data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        workspace_id = excluded.workspace_id,
        site_id = excluded.site_id,
        run_id = excluded.run_id,
        status = excluded.status,
        created_at = excluded.created_at,
        data = excluded.data
    `)
    .run(job.id, job.workspaceId, job.siteId, job.runId, job.status, job.createdAt, JSON.stringify(job));
  return job;
}

export async function getRunQueueJob(jobId: string) {
  const database = await getDatabase();
  const row = database
    .prepare(`
      SELECT id, workspace_id, site_id, run_id, status, created_at, data
      FROM run_queue_jobs
      WHERE id = ?
      LIMIT 1
    `)
    .get(jobId) as QueueJobRow | undefined;
  return parseRow<RunQueueJob>(row);
}

export async function listRunQueueJobs(workspaceId?: string, statuses?: RunQueueJob['status'][]) {
  const database = await getDatabase();
  const rows = database
    .prepare(`
      SELECT id, workspace_id, site_id, run_id, status, created_at, data
      FROM run_queue_jobs
      ORDER BY created_at ASC
    `)
    .all() as QueueJobRow[];
  return rows
    .map((row) => parseRow<RunQueueJob>(row))
    .filter((job): job is RunQueueJob => Boolean(job))
    .filter((job) => (workspaceId ? job.workspaceId === workspaceId : true))
    .filter((job) => (statuses && statuses.length > 0 ? statuses.includes(job.status) : true));
}

export async function countActiveAuthSessions(workspaceId?: string) {
  const database = await getDatabase();
  const now = new Date().toISOString();
  const row = workspaceId
    ? (database
        .prepare(`
          SELECT COUNT(*) as count
          FROM auth_sessions
          WHERE workspace_id = ? AND revoked_at IS NULL AND expires_at > ?
        `)
        .get(workspaceId, now) as { count: number })
    : (database
        .prepare(`
          SELECT COUNT(*) as count
          FROM auth_sessions
          WHERE revoked_at IS NULL AND expires_at > ?
        `)
        .get(now) as { count: number });
  return row.count;
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

export async function deleteMembership(workspaceId: string, userId: string) {
  const database = await getDatabase();
  const result = database
    .prepare(`
      DELETE FROM workspace_memberships
      WHERE workspace_id = ? AND user_id = ?
    `)
    .run(workspaceId, userId);
  return result.changes > 0;
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
      INSERT INTO users (id, email, data, created_at) VALUES (?, ?, ?, ?)
    `);
    const insertMembership = database.prepare(`
      INSERT INTO workspace_memberships (workspace_id, user_id, role, created_at)
      VALUES (?, ?, ?, ?)
    `);

    for (const workspace of input.workspaces) {
      insertWorkspace.run(workspace.id, JSON.stringify(workspace), workspace.createdAt);
    }
    for (const user of input.users) {
      const normalizedUser = normalizeUser(user);
      insertUser.run(
        normalizedUser.id,
        normalizedUser.email,
        JSON.stringify(normalizedUser),
        normalizedUser.createdAt,
      );
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
  const [membership, user] = await Promise.all([getMembership(workspaceId, userId), getUser(userId)]);
  if (!membership || !user) return null;
  return {
    workspaceId: membership.workspaceId,
    userId: membership.userId,
    role: membership.role,
    permissions: permissionsForRole(membership.role),
    email: user.email,
    name: user.name,
  };
}

export async function resetStateForTests() {
  const database = await getDatabase();
  runTransaction(database, () => {
    database.exec(`
      DELETE FROM audit_logs;
      DELETE FROM auth_sessions;
      DELETE FROM password_reset_tokens;
      DELETE FROM run_queue_jobs;
      DELETE FROM runs;
      DELETE FROM sites;
      DELETE FROM workspace_memberships;
      DELETE FROM users;
      DELETE FROM workspaces;
    `);
  });
}
