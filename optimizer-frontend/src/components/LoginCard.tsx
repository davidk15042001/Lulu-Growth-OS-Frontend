import type { LoginInput } from '../types';

type LoginCardProps = {
  form: LoginInput;
  busy: boolean;
  onFormChange: (updater: (current: LoginInput) => LoginInput) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function LoginCard({ form, busy, onFormChange, onSubmit }: LoginCardProps) {
  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Authentication</p>
          <h2>Sign in to workspace</h2>
        </div>
      </div>

      <form className="site-form" onSubmit={onSubmit}>
        <label>
          Workspace ID
          <input
            value={form.workspaceId}
            onChange={(event) =>
              onFormChange((current) => ({ ...current, workspaceId: event.target.value }))
            }
            placeholder="demo-workspace"
            autoComplete="organization"
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => onFormChange((current) => ({ ...current, email: event.target.value }))}
            placeholder="admin@demo.example"
            autoComplete="username"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              onFormChange((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </label>
        <label>
          MFA code
          <input
            value={form.mfaCode ?? ''}
            onChange={(event) =>
              onFormChange((current) => ({ ...current, mfaCode: event.target.value.replace(/\D+/g, '').slice(0, 6) }))
            }
            placeholder="123456"
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </label>

        <div className="helper-copy">
          Demo users: `admin@demo.example`, `editor@demo.example`, `viewer@demo.example`,
          `owner@second.example`.
        </div>

        <button className="primary-button" disabled={busy}>
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}
