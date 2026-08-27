import type { AuthSessionRecord } from '../types';

type AccountSecurityCardProps = {
  sessions: AuthSessionRecord[];
  mfaState: {
    enabled: boolean;
    pending: boolean;
  } | null;
  mfaSetup: {
    secret: string;
    otpAuthUrl: string;
  } | null;
  mfaForm: {
    verifyCode: string;
    disableCode: string;
    disablePassword: string;
  };
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
  onMfaFormChange: (
    updater: (current: {
      verifyCode: string;
      disableCode: string;
      disablePassword: string;
    }) => {
      verifyCode: string;
      disableCode: string;
      disablePassword: string;
    },
  ) => void;
  onChangePassword: (event: React.FormEvent<HTMLFormElement>) => void;
  onStartMfaSetup: () => void;
  onEnableMfa: (event: React.FormEvent<HTMLFormElement>) => void;
  onDisableMfa: (event: React.FormEvent<HTMLFormElement>) => void;
  onRevokeSession: (sessionId: string) => void;
};

export function AccountSecurityCard({
  sessions,
  mfaState,
  mfaSetup,
  mfaForm,
  busy,
  passwordForm,
  onPasswordFormChange,
  onMfaFormChange,
  onChangePassword,
  onStartMfaSetup,
  onEnableMfa,
  onDisableMfa,
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
        <strong>Multi-factor authentication</strong>
        <small>
          Status: {mfaState?.enabled ? 'Enabled' : mfaState?.pending ? 'Pending verification' : 'Disabled'}
        </small>
        {!mfaState?.enabled ? (
          <button
            type="button"
            className="ghost-button"
            disabled={busy === 'mfa-setup'}
            onClick={onStartMfaSetup}
          >
            {busy === 'mfa-setup' ? 'Preparing...' : 'Start MFA setup'}
          </button>
        ) : null}
        {mfaSetup ? (
          <div className="callout">
            <strong>Authenticator setup</strong>
            <small>Add this secret or otpauth URL in your authenticator app.</small>
            <code>{mfaSetup.secret}</code>
            <code>{mfaSetup.otpAuthUrl}</code>
          </div>
        ) : null}
        {mfaState?.pending ? (
          <form className="site-form" onSubmit={onEnableMfa}>
            <label>
              Verification code
              <input
                value={mfaForm.verifyCode}
                onChange={(event) =>
                  onMfaFormChange((current) => ({
                    ...current,
                    verifyCode: event.target.value.replace(/\D+/g, '').slice(0, 6),
                  }))
                }
                inputMode="numeric"
                placeholder="123456"
                required
              />
            </label>
            <button className="ghost-button" disabled={busy === 'mfa-enable'}>
              {busy === 'mfa-enable' ? 'Verifying...' : 'Enable MFA'}
            </button>
          </form>
        ) : null}
        {mfaState?.enabled ? (
          <form className="site-form" onSubmit={onDisableMfa}>
            <label>
              Current password
              <input
                type="password"
                value={mfaForm.disablePassword}
                onChange={(event) =>
                  onMfaFormChange((current) => ({ ...current, disablePassword: event.target.value }))
                }
                autoComplete="current-password"
                required
              />
            </label>
            <label>
              MFA code
              <input
                value={mfaForm.disableCode}
                onChange={(event) =>
                  onMfaFormChange((current) => ({
                    ...current,
                    disableCode: event.target.value.replace(/\D+/g, '').slice(0, 6),
                  }))
                }
                inputMode="numeric"
                placeholder="123456"
                required
              />
            </label>
            <button className="ghost-button" disabled={busy === 'mfa-disable'}>
              {busy === 'mfa-disable' ? 'Disabling...' : 'Disable MFA'}
            </button>
          </form>
        ) : null}
      </div>

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
