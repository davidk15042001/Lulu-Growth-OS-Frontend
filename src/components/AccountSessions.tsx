import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { authApi, type ActiveSession } from '../api/auth';
import { getFriendlyErrorMessage } from '../api/client';
import { useTranslation } from '../i18n/GlobalLanguageSwitcher';

export function AccountSessions({ onClose }: { onClose: () => void }) {
  const t = useTranslation();
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const load = async () => setSessions((await authApi.sessions()).data.items);
  useEffect(() => { void load().catch(cause => setError(getFriendlyErrorMessage(cause))).finally(() => setBusy(false)); }, []);
  const revoke = async (id?: string) => {
    setBusy(true); setError('');
    try { if (id) await authApi.revokeSession(id); else await authApi.revokeOtherSessions(); await load(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause)); } finally { setBusy(false); }
  };
  return createPortal(<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4" onKeyDown={event => { if(event.key === 'Escape') onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="session-title" className="max-h-[85vh] w-full max-w-xl overflow-auto rounded-xl border border-border bg-card p-6 text-foreground shadow-xl">
      <div className="flex justify-between gap-4"><h2 id="session-title" className="text-xl font-semibold">{t('Active sessions')}</h2><button autoFocus onClick={onClose}>{t('Close')}</button></div>
      <p className="my-3 text-sm text-muted-foreground">{t('Revoke a session to end its access. Only a coarse browser label is stored.')}</p>
      {error && <p role="alert" className="text-destructive">{t(error)}</p>}
      {busy && <p role="status">{t('Loading…')}</p>}
      <ul className="divide-y divide-border">{sessions.map(session => <li key={session.id} className="flex justify-between gap-3 py-3">
        <div><strong>{session.deviceLabel} {session.current && t('(current session)')}</strong><p className="text-sm">{t('Last active')}: {new Date(session.lastUsedAt).toLocaleString()}</p><p className="text-xs text-muted-foreground">{t('Expires')}: {new Date(session.expiresAt).toLocaleString()}</p></div>
        {!session.current && <button disabled={busy} onClick={() => void revoke(session.id)}>{t('Revoke session')}</button>}
      </li>)}</ul>
      <button className="mt-4 rounded-md border border-border px-3 py-2 disabled:opacity-50" disabled={busy || sessions.length < 2} onClick={() => void revoke()}>{t('Revoke all other sessions')}</button>
    </section></div>,document.body);
}
