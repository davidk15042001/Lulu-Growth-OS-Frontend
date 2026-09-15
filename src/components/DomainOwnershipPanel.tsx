import { useEffect, useState } from 'react';
import { websitesApi, type WebsiteSite } from '../api/websites';
import { getFriendlyErrorMessage } from '../api/client';
import { useTranslation } from '../i18n/GlobalLanguageSwitcher';

export function DomainOwnershipPanel({ site, workspaceId, onSiteCreated }: { site: WebsiteSite | null; workspaceId?: string | null; onSiteCreated?: (site: WebsiteSite) => void }) {
  const t = useTranslation();
  const [current, setCurrent] = useState(site);
  const [hostname, setHostname] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => setCurrent(site), [site]);
  const act = async (kind: 'add'|'verify'|'renew', domainId?: string) => {
    if (busy) return;
    if (kind === 'add' && !current && !workspaceId) return;
    if (kind !== 'add' && !current) return;
    setBusy(true); setError('');
    try {
      if (kind === 'add') {
        const domainSite = current ?? (await websitesApi.create(workspaceId!, {
          provider: 'managed',
          ownershipMode: 'managed',
          name: 'Lulu Website',
        })).data;
        const result = await websitesApi.addDomain(domainSite.workspaceId, domainSite.id, hostname.trim());
        const nextSite = { ...domainSite, domains: [...domainSite.domains, result.data] };
        setCurrent(nextSite); onSiteCreated?.(nextSite); setHostname('');
      } else {
        const result = await websitesApi[kind === 'verify' ? 'verifyDomain' : 'renewDomain'](current!.workspaceId,current!.id,domainId!);
        setCurrent(result.data);
      }
    } catch(cause) { setError(getFriendlyErrorMessage(cause)); } finally { setBusy(false); }
  };
  const reason = (code: string) => t(({
    DNS_CHALLENGE_NOT_FOUND: 'The required TXT record was not found. Check the value and allow time for DNS propagation.',
    DNS_CHALLENGE_EXPIRED: 'This challenge has expired. Renew it and update the TXT record.',
    DNS_LOOKUP_FAILED: 'DNS lookup failed. Please try again later.',
    DNS_REVERIFICATION_REQUIRED: 'This domain needs a new DNS ownership check.',
  } as Record<string,string>)[code] ?? code);
  return <section className="rounded-xl border border-border bg-card p-5 text-foreground">
    <h2 className="text-xl font-semibold">{t('Domain ownership')}</h2>
    <p className="my-3 text-sm">{t('Add the TXT record at your DNS provider, then check ownership. Lulu never changes your DNS automatically.')}</p>
    <form className="flex flex-wrap gap-2" onSubmit={event => { event.preventDefault(); void act('add'); }}><input aria-label={t('Domain')} className="min-w-0 flex-1 rounded border border-border bg-background px-3 py-2" value={hostname} onChange={event => setHostname(event.target.value)} placeholder="example.com" required /><button disabled={busy || !hostname.trim() || !workspaceId} className="rounded border border-border px-3">{t('Add domain')}</button></form>
    {!current && <p className="mt-2 text-xs text-muted-foreground">{t('You can connect a domain before creating the website. Lulu will attach it to your managed website draft and keep it ready for the first publication.')}</p>}
    {error && <p role="alert" className="mt-3 text-destructive">{t(error)}</p>}
    {busy && <p role="status">{t('Checking…')}</p>}
    <div className="mt-5 space-y-4">{(current?.domains ?? []).map(domain => <article key={domain.id} className="rounded border border-border p-4">
      <div className="flex justify-between gap-3"><strong>{domain.hostname}</strong><span>{t(domain.status)}</span></div>
      {domain.status !== 'verified' && <><dl className="mt-3 space-y-2 break-all text-sm"><dt>{t('TXT record name')}</dt><dd><code>{domain.recordName}</code></dd><dt>{t('TXT record value')}</dt><dd><code>{domain.verificationToken}</code></dd><dt>{t('Expires')}</dt><dd>{new Date(domain.expiresAt).toLocaleString()}</dd></dl>
        {domain.lastError && <p role="status" className="my-3 text-sm">{reason(domain.lastError)}</p>}
        <div className="mt-3 flex gap-3"><button disabled={busy} onClick={() => void act('verify',domain.id)}>{t('Check ownership')}</button><button disabled={busy} onClick={() => void act('renew',domain.id)}>{t('Renew challenge')}</button></div></>}
      {domain.status === 'verified' && <div className="mt-3 rounded-lg bg-secondary p-3 text-sm"><p className="font-medium">{t('Connect this domain to Lulu')}</p><p className="mt-1 text-muted-foreground">{domain.cnameTarget ? <>{t('Create a CNAME record pointing to')} <code>{domain.cnameTarget}</code>.</> : t('The Lulu edge hostname is not configured on this server yet. An administrator must set LULU_MANAGED_WEBSITE_HOSTNAME before routing can be activated.')}</p><p className="mt-2 text-muted-foreground">{t('Once DNS is connected, this domain shows the current Lulu template immediately and updates automatically when your website is published.')}</p></div>}
    </article>)}</div>
  </section>;
}
