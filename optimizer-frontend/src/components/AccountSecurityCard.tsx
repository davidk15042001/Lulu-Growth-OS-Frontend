import type { AuthSessionRecord } from '../types';

type AccountSecurityCardProps = {
  sessions: AuthSessionRecord[];
  busy: string | null;
  passwordForm: {
    currentPassword: string;
    newPassword: string;
  };
  onPasswordFormChange: (
    updater: (current: { currentPassword: string; newPassword: string }) => {
      currentPassword: string;
      newPassword: string;
    },
  ) => void;
  onChangePassword: (event: React.FormEvent<HTMLFormElement>) => void;
  onRevokeSession: (sessionId: string) => void;
};

export function AccountSecurityCard({
  sessions,
  busy,
  passwordForm,
  onPasswordFormChange,
  onChangePassword,
  onRevokeSession,
}: AccountSecurityCardProps) {
  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Security</p>
          <h2>Account access</h2>
        </div>
      </div>

      <form className="site-form" onSubmit={onChangePassword}>
        <label>
          Current password
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(event) =>
              onPasswordFormChange((current) => ({ ...current, currentPassword: event.target.value }))
            }
            autoComplete="current-password"
            required
          />
        </label>
        <label>
          New password
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(event) =>
              onPasswordFormChange((current) => ({ ...current, newPassword: event.target.value }))
            }
            autoComplete="new-password"
            required
          />
        </label>
        <button className="ghost-button" disabled={busy === 'change-password'}>
          {busy === 'change-password' ? 'Updating...' : 'Change password'}
        </button>
      </form>

      <div className="stack-list">
        <strong>My sessions</strong>
        {sessions.map((session) => (
          <div key={session.id} className="table-row">
            <span>
              <strong>{session.userAgent || 'Unknown device'}</strong>
              <small>
                Last seen: {new Date(session.lastUsedAt).toLocaleString()} | Expires:{' '}
                {new Date(session.expiresAt).toLocaleString()}
              </small>
            </span>
            <button
              type="button"
              className="ghost-button"
              disabled={busy === `revoke-own-${session.id}` || Boolean(session.revokedAt)}
              onClick={() => onRevokeSession(session.id)}
            >
              {session.revokedAt ? 'Revoked' : 'Revoke'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
