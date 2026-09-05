import { useEffect, useState } from 'react';
import { websitesApi, type WebsiteSite } from '../api/websites';
import { getFriendlyErrorMessage } from '../api/client';
import { useTranslation } from '../i18n/GlobalLanguageSwitcher';

export function DomainOwnershipPanel({ site }: { site: WebsiteSite | null }) {
  const t = useTranslation();
  const [current, setCurrent] = useState(site);
  const [hostname, setHostname] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => setCurrent(site), [site]);
  const act = async (kind: 'add'|'verify'|'renew', domainId?: string) => {
    if (!current || busy) return;
    setBusy(true); setError('');
    try {
      if (kind === 'add') {
        const result = await websitesApi.addDomain(current.workspaceId, current.id, hostname.trim());
        setCurrent({...current,domains:[...current.domains,result.data]}); setHostname('');
      } else {
        const result = await websitesApi[kind === 'verify' ? 'verifyDomain' : 'renewDomain'](current.workspaceId,current.id,domainId!);
        setCurrent(result.data);
      }
    } catch(cause) { setError(getFriendlyErrorMessage(cause)); } finally { setBusy(false); }
  };
  if(!current) return <p>{t('Connect a website before adding a domain.')}</p>;
  const reason = (code: string) => t(({
    DNS_CHALLENGE_NOT_FOUND: 'The required TXT record was not found. Check the value and allow time for DNS propagation.',
    DNS_CHALLENGE_EXPIRED: 'This challenge has expired. Renew it and update the TXT record.',
    DNS_LOOKUP_FAILED: 'DNS lookup failed. Please try again later.',
    DNS_REVERIFICATION_REQUIRED: 'This domain needs a new DNS ownership check.',
  } as Record<string,string>)[code] ?? code);
  return <section className="rounded-xl border border-border bg-card p-5 text-foreground">
    <h2 className="text-xl font-semibold">{t('Domain ownership')}</h2>
    <p className="my-3 text-sm">{t('Add the TXT record at your DNS provider, then check ownership. Lulu never changes your DNS automatically.')}</p>
    <form className="flex gap-2" onSubmit={event => { event.preventDefault(); void act('add'); }}><input aria-label={t('Domain')} className="min-w-0 flex-1 rounded border border-border bg-background px-3 py-2" value={hostname} onChange={event => setHostname(event.target.value)} placeholder="example.com" required /><button disabled={busy || !hostname} className="rounded border border-border px-3">{t('Add domain')}</button></form>
    {error && <p role="alert" className="mt-3 text-destructive">{t(error)}</p>}
    {busy && <p role="status">{t('Checking…')}</p>}
    <div className="mt-5 space-y-4">{current.domains.map(domain => <article key={domain.id} className="rounded border border-border p-4">
      <div className="flex justify-between gap-3"><strong>{domain.hostname}</strong><span>{t(domain.status)}</span></div>
      {domain.status !== 'verified' && <><dl className="mt-3 space-y-2 break-all text-sm"><dt>{t('TXT record name')}</dt><dd><code>{domain.recordName}</code></dd><dt>{t('TXT record value')}</dt><dd><code>{domain.verificationToken}</code></dd><dt>{t('Expires')}</dt><dd>{new Date(domain.expiresAt).toLocaleString()}</dd></dl>
        {domain.lastError && <p role="status" className="my-3 text-sm">{reason(domain.lastError)}</p>}
        <div className="mt-3 flex gap-3"><button disabled={busy} onClick={() => void act('verify',domain.id)}>{t('Check ownership')}</button><button disabled={busy} onClick={() => void act('renew',domain.id)}>{t('Renew challenge')}</button></div></>}
    </article>)}</div>
  </section>;
}
