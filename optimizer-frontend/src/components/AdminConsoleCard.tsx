import type {
  AppliedMigration,
  AuthSessionRecord,
  CreateWorkspaceUserInput,
  Permission,
  RunQueueJob,
  UpdateWorkspaceUserInput,
  WorkspaceUser,
} from '../types';

type AdminConsoleCardProps = {
  users: WorkspaceUser[];
  sessions: AuthSessionRecord[];
  queueJobs: RunQueueJob[];
  appliedMigrations: AppliedMigration[];
  permissions: Permission[];
  createForm: CreateWorkspaceUserInput;
  busy: string | null;
  resetTokenInfo: { token: string; email: string; expiresAt: string } | null;
  onCreateFormChange: (updater: (current: CreateWorkspaceUserInput) => CreateWorkspaceUserInput) => void;
  onCreateUser: (event: React.FormEvent<HTMLFormElement>) => void;
  onUpdateUser: (userId: string, payload: UpdateWorkspaceUserInput) => void;
  onRemoveMembership: (userId: string) => void;
  onCreateResetToken: (userId: string) => void;
  onRevokeSession: (sessionId: string) => void;
};

export function AdminConsoleCard({
  users,
  sessions,
  queueJobs,
  appliedMigrations,
  permissions,
  createForm,
  busy,
  resetTokenInfo,
  onCreateFormChange,
  onCreateUser,
  onUpdateUser,
  onRemoveMembership,
  onCreateResetToken,
  onRevokeSession,
}: AdminConsoleCardProps) {
  const canReadUsers = permissions.includes('admin:users:read');
  const canWriteUsers = permissions.includes('admin:users:write');
  const canReadSessions = permissions.includes('admin:sessions:read');
  const canRevokeSessions = permissions.includes('admin:sessions:revoke');
  const canReadQueue = permissions.includes('admin:queue:read');
  const canReadMigrations = permissions.includes('admin:migrations:read');

  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Administration</p>
          <h2>User and session management</h2>
        </div>
      </div>

      {canWriteUsers ? (
        <form className="site-form" onSubmit={onCreateUser}>
          <label>
            Name
            <input
              value={createForm.name}
              onChange={(event) => onCreateFormChange((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={createForm.email}
              onChange={(event) =>
                onCreateFormChange((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Role
            <select
              value={createForm.role}
              onChange={(event) =>
                onCreateFormChange((current) => ({
                  ...current,
                  role: event.target.value as CreateWorkspaceUserInput['role'],
                }))
              }
            >
              <option value="viewer">viewer</option>
              <option value="editor">editor</option>
              <option value="admin">admin</option>
            </select>
          </label>
          <label>
            Initial password
            <input
              type="password"
              value={createForm.password}
              onChange={(event) =>
                onCreateFormChange((current) => ({ ...current, password: event.target.value }))
              }
              required
            />
          </label>
          <button className="primary-button" disabled={busy === 'create-user'}>
            {busy === 'create-user' ? 'Creating...' : 'Create user'}
          </button>
        </form>
      ) : null}

      {resetTokenInfo ? (
        <div className="callout">
          <strong>Password reset token</strong>
          <small>{resetTokenInfo.email}</small>
          <code>{resetTokenInfo.token}</code>
          <small>Expires: {new Date(resetTokenInfo.expiresAt).toLocaleString()}</small>
        </div>
      ) : null}

      {canReadUsers ? (
        <div className="stack-list">
          <strong>Workspace members</strong>
          {users.map((user) => (
            <div key={user.id} className="stack-card">
              <div className="stack-card__header">
                <span>
                  <strong>{user.name}</strong>
                  <small>
                    {user.email} | Active sessions: {user.activeSessionCount}
                  </small>
                </span>
                <select
                  value={user.role}
                  onChange={(event) =>
                    onUpdateUser(user.id, {
                      role: event.target.value as WorkspaceUser['role'],
                    })
                  }
                  disabled={busy === `update-user-${user.id}` || !canWriteUsers}
                >
                  <option value="viewer">viewer</option>
                  <option value="editor">editor</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              {canWriteUsers ? (
                <div className="actions">
                  <button
                    type="button"
                    className="ghost-button"
                    disabled={busy === `reset-token-${user.id}`}
                    onClick={() => onCreateResetToken(user.id)}
                  >
                    Reset password
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    disabled={busy === `remove-member-${user.id}`}
                    onClick={() => onRemoveMembership(user.id)}
                  >
                    Remove member
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {canReadSessions ? (
        <div className="stack-list">
          <strong>Workspace sessions</strong>
          {sessions.map((session) => (
            <div key={session.id} className="table-row">
              <span>
                <strong>{session.user?.email ?? session.userId}</strong>
                <small>
                  {session.userAgent || 'Unknown device'} | Last seen:{' '}
                  {new Date(session.lastUsedAt).toLocaleString()}
                </small>
              </span>
              <button
                type="button"
                className="ghost-button"
                disabled={
                  busy === `revoke-session-${session.id}` || Boolean(session.revokedAt) || !canRevokeSessions
                }
                onClick={() => onRevokeSession(session.id)}
              >
                {session.revokedAt ? 'Revoked' : 'Revoke'}
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {canReadQueue ? (
        <div className="stack-list">
          <strong>Run queue</strong>
          {queueJobs.map((job) => (
            <div key={job.id} className="table-row">
              <span>
                <strong>{job.type}</strong>
                <small>
                  {job.status} | Attempts: {job.attempts} | {new Date(job.createdAt).toLocaleString()}
                </small>
              </span>
              <span>{job.error ? job.error : job.siteId}</span>
            </div>
          ))}
        </div>
      ) : null}

      {canReadMigrations ? (
        <div className="stack-list">
          <strong>Schema migrations</strong>
          {appliedMigrations.map((migration) => (
            <div key={migration.version} className="table-row">
              <span>
                <strong>v{migration.version}</strong>
                <small>{migration.name}</small>
              </span>
              <span>{new Date(migration.applied_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
