type PasswordResetCardProps = {
  form: {
    token: string;
    newPassword: string;
  };
  busy: boolean;
  onFormChange: (
    updater: (current: { token: string; newPassword: string }) => { token: string; newPassword: string },
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function PasswordResetCard({ form, busy, onFormChange, onSubmit }: PasswordResetCardProps) {
  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Password reset</p>
          <h2>Confirm reset token</h2>
        </div>
      </div>

      <form className="site-form" onSubmit={onSubmit}>
        <label>
          Reset token
          <textarea
            rows={3}
            value={form.token}
            onChange={(event) => onFormChange((current) => ({ ...current, token: event.target.value }))}
            required
          />
        </label>
        <label>
          New password
          <input
            type="password"
            value={form.newPassword}
            onChange={(event) =>
              onFormChange((current) => ({ ...current, newPassword: event.target.value }))
            }
            autoComplete="new-password"
            required
          />
        </label>
        <button className="ghost-button" disabled={busy}>
          {busy ? 'Resetting...' : 'Reset password'}
        </button>
      </form>
    </section>
  );
}
