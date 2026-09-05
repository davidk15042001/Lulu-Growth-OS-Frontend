import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Link2, LoaderCircle, PlugZap, RefreshCw, Trash2, Unplug } from 'lucide-react';
import { onboardingApi, type Platform } from '../../../../api/onboarding';
import { getFriendlyErrorMessage } from '../../../../api/client';
import { workspaceAppApi } from '../../../../api/workspace-app';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { LuluGlobalNavigation } from '../../../../components/LuluGlobalNavigation';

const oauthProviders = new Set(['salesforce', 'pipedrive', 'hubspot', 'webflow', 'wordpress', 'shopify']);
const connectedStatuses = new Set(['connected', 'syncing']);

function labelStatus(status: string) {
  return status.replaceAll('_', ' ');
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Not synced yet';
}

export function LuluIntegrations() {
  const { selectedWorkspace, can } = useLuluApp();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [draft, setDraft] = useState({ name: '', category: 'custom', integrationKey: '' });

  const load = useCallback(async () => {
    if (!selectedWorkspace) { setPlatforms([]); setLoading(false); return; }
    setLoading(true); setError('');
    try { setPlatforms((await onboardingApi.platforms(selectedWorkspace.id)).data.items); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, 'Integrations could not be loaded.')); }
    finally { setLoading(false); }
  }, [selectedWorkspace]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 3_000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const connected = useMemo(() => platforms.filter((platform) => connectedStatuses.has(platform.connectionStatus)).length, [platforms]);
  const needsAttention = useMemo(() => platforms.filter((platform) => platform.connectionStatus === 'error').length, [platforms]);

  const beginOAuth = async (platform: Platform) => {
    if (!selectedWorkspace) return;
    const provider = platform.integrationKey?.trim().toLowerCase();
    if (!provider || !oauthProviders.has(provider)) {
      setError('This integration does not have a configured OAuth provider.');
      return;
    }
    const shop = provider === 'shopify' ? window.prompt('Enter your Shopify shop domain (example.myshopify.com)')?.trim() : undefined;
    if (provider === 'shopify' && !shop) return;
    setBusyId(platform.id); setError('');
    try {
      const result = await onboardingApi.startOAuth(selectedWorkspace.id, provider, shop, window.location.pathname);
      window.location.assign(result.data.authorizationUrl);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'The provider authorization could not be started.'));
      setBusyId(null);
    }
  };

  const disconnect = async (platform: Platform) => {
    if (!selectedWorkspace || !window.confirm(`Disconnect ${platform.name}? Existing synchronized records will remain available.`)) return;
    setBusyId(platform.id); setError('');
    try {
      await onboardingApi.updatePlatform(selectedWorkspace.id, platform.id, { connectionStatus: 'disconnected' });
      await load(); setNotice(`${platform.name} disconnected.`);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'The integration could not be disconnected.')); }
    finally { setBusyId(null); }
  };

  const sync = async (platform: Platform) => {
    if (!selectedWorkspace) return;
    setBusyId(platform.id); setError('');
    try {
      await workspaceAppApi.syncIntegration(selectedWorkspace.id, platform.id);
      await load(); setNotice(`${platform.name} sync queued.`);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'The synchronization could not be queued.')); }
    finally { setBusyId(null); }
  };

  const remove = async (platform: Platform) => {
    if (!selectedWorkspace || !window.confirm(`Remove ${platform.name} from this workspace?`)) return;
    setBusyId(platform.id); setError('');
    try {
      await onboardingApi.deletePlatform(selectedWorkspace.id, platform.id);
      await load(); setNotice(`${platform.name} removed.`);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'The integration could not be removed.')); }
    finally { setBusyId(null); }
  };

  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedWorkspace || !can('administer')) return;
    setBusyId('new'); setError('');
    try {
      await onboardingApi.createPlatform(selectedWorkspace.id, { name: draft.name.trim(), category: draft.category.trim(), integrationKey: draft.integrationKey.trim() || null, connectionStatus: 'not_connected' });
      setDraft({ name: '', category: 'custom', integrationKey: '' });
      await load(); setNotice('Integration added.');
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'The integration could not be added.')); }
    finally { setBusyId(null); }
  };

  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-64 lg:border-r lg:border-border lg:bg-card"><LuluGlobalNavigation activeSlug="glad-coast-1428" /></aside>
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:ml-64 lg:px-12 lg:py-12">
      <header className="mb-8 flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Workspace settings</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Integrations</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Only provider connections saved for this workspace are shown. Credentials and OAuth tokens are never displayed.</p></div><button type="button" onClick={() => void load()} disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium disabled:opacity-50"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} />Refresh</button></header>
      <section className="mb-6 grid gap-3 sm:grid-cols-3"><article className="rounded-2xl border border-border bg-card p-5"><p className="text-xs text-muted-foreground">Configured</p><p className="mt-2 text-3xl font-semibold">{platforms.length}</p></article><article className="rounded-2xl border border-border bg-card p-5"><p className="text-xs text-muted-foreground">Connected or syncing</p><p className="mt-2 text-3xl font-semibold">{connected}</p></article><article className="rounded-2xl border border-border bg-card p-5"><p className="text-xs text-muted-foreground">Need attention</p><p className="mt-2 text-3xl font-semibold">{needsAttention}</p></article></section>
      {error && <div role="alert" className="mb-5 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><AlertCircle size={18} className="shrink-0" /><span>{error}</span></div>}
      {notice && <div role="status" className="mb-5 flex gap-3 rounded-xl border border-border bg-secondary p-4 text-sm"><CheckCircle2 size={18} className="shrink-0" /><span>{notice}</span></div>}
      {loading ? <div className="grid min-h-72 place-items-center rounded-2xl border border-border bg-card text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><LoaderCircle size={17} className="animate-spin" />Loading saved connections…</span></div> : <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="border-b border-border p-5"><h2 className="font-semibold">Configured connections</h2><p className="mt-1 text-sm text-muted-foreground">Connection status and sync information are returned by the workspace backend.</p></div>{platforms.length === 0 ? <div className="p-10 text-center"><PlugZap className="mx-auto text-muted-foreground" size={34} /><h3 className="mt-4 text-lg font-semibold">No integrations configured</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Add an integration below or complete a supported OAuth connection. No sample applications are displayed.</p></div> : <div className="divide-y divide-border">{platforms.map((platform) => { const connectedPlatform = connectedStatuses.has(platform.connectionStatus); const busy = busyId === platform.id; return <article key={platform.id} className="p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{platform.name}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${connectedPlatform ? 'bg-secondary text-foreground' : platform.connectionStatus === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground'}`}>{labelStatus(platform.connectionStatus)}</span></div><p className="mt-1 text-sm text-muted-foreground">{platform.category}{platform.integrationKey ? ` · ${platform.integrationKey}` : ''}</p><p className="mt-2 text-xs text-muted-foreground">Last sync: {formatDate(platform.lastSyncedAt)}{platform.lastError ? ` · ${platform.lastError}` : ''}</p></div><div className="flex flex-wrap gap-2">{connectedPlatform ? <><button type="button" onClick={() => void sync(platform)} disabled={busy || !can('administer')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50"><RefreshCw size={14} className={platform.connectionStatus === 'syncing' ? 'animate-spin' : ''} />Sync</button><button type="button" onClick={() => void disconnect(platform)} disabled={busy || !can('administer')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50"><Unplug size={14} />Disconnect</button></> : <button type="button" onClick={() => void beginOAuth(platform)} disabled={busy || !can('administer') || !platform.integrationKey || !oauthProviders.has(platform.integrationKey.toLowerCase())} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"><Link2 size={14} />Connect</button>}<button type="button" onClick={() => void remove(platform)} disabled={busy || !can('administer')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-destructive disabled:opacity-50"><Trash2 size={14} />Remove</button></div></div></article>; })}</div>}</section>}
      {can('administer') && <section className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6"><h2 className="text-lg font-semibold">Add integration</h2><p className="mt-1 text-sm text-muted-foreground">This creates a tenant-scoped integration record. It does not create any provider account or credential.</p><form onSubmit={(event) => void add(event)} className="mt-5 grid gap-3 md:grid-cols-4"><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required placeholder="Integration name" className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary" /><input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} required placeholder="Category" className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary" /><input value={draft.integrationKey} onChange={(event) => setDraft({ ...draft, integrationKey: event.target.value })} placeholder="Provider key (optional)" className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary" /><button disabled={busyId === 'new'} className="h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50">{busyId === 'new' ? 'Adding…' : 'Add integration'}</button></form></section>}
    </main>
  </div>;
}
