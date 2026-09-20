import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Link2, LoaderCircle, MessageCircle, PlugZap, RefreshCw, Trash2, Unplug } from 'lucide-react';
import { onboardingApi, type Platform } from '../../../../api/onboarding';
import { getFriendlyErrorMessage } from '../../../../api/client';
import { workspaceAppApi } from '../../../../api/workspace-app';
import { providerControlApi, type ProviderLaunchReadiness } from '../../../../api/providers';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { LuluGlobalNavigation } from '../../../../components/LuluGlobalNavigation';
import { ComposioCatalog } from '../../../../components/ComposioCatalog';
import { navigateApp, routes } from '../../../../routing';

const oauthProviders = new Set(['salesforce', 'pipedrive', 'hubspot', 'webflow', 'wordpress', 'shopify', 'whatsapp']);
const connectedStatuses = new Set(['connected', 'syncing']);

type WhatsAppConnectionSummary = {
  provider: 'unifyport';
  selfServiceAllowed: boolean;
  customerConnection: { address?: string; displayName: string; senderStatus: string; status: string; lastError: string | null } | null;
  pendingConnection?: { accountId: string; authStatus: string; runtimeStatus: string; authPayload: Record<string, unknown> | null; lastError: string | null; phone: string | null } | null;
  adminFallback: { configured: boolean; displayName: string | null; status: string; provider: 'unifyport' };
  effectiveMode: 'CUSTOMER_OWNED' | 'LULU_MANAGED';
};

function labelStatus(status: string) {
  return status.replaceAll('_', ' ');
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Not synced yet';
}

export function LuluIntegrations() {
  const { selectedWorkspace, can } = useLuluApp();
  const canEdit = can('edit');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [whatsappConnection, setWhatsappConnection] = useState<WhatsAppConnectionSummary | null>(null);
  const [providerReadiness, setProviderReadiness] = useState<ProviderLaunchReadiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [whatsappSetupOpen, setWhatsappSetupOpen] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappDisplayName, setWhatsappDisplayName] = useState('');
  const [whatsappBusy, setWhatsappBusy] = useState(false);
  const [draft, setDraft] = useState({ name: '', category: 'custom', integrationKey: '' });

  const load = useCallback(async () => {
    if (!selectedWorkspace) {
      setPlatforms([]);
      setWhatsappConnection(null);
      setProviderReadiness(null);
      setLoading(false);
      return;
    }
    setLoading(true); setError('');
    try {
      const [platformResponse, whatsappResponse, readinessResponse] = await Promise.all([
        onboardingApi.platforms(selectedWorkspace.id),
        onboardingApi.whatsappConnection(selectedWorkspace.id).catch(() => null),
        providerControlApi.launchReadiness(selectedWorkspace.id).catch(() => null),
      ]);
      setPlatforms(platformResponse.data.items);
      setWhatsappConnection(whatsappResponse?.data ?? null);
      setProviderReadiness(readinessResponse?.data ?? null);
    }
    catch (cause) { setError(getFriendlyErrorMessage(cause, 'Integrations could not be loaded.')); }
    finally { setLoading(false); }
  }, [selectedWorkspace]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 3_000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!selectedWorkspace) return;
    let active = true;
    let requestRunning = false;
    const refresh = async () => {
      if (requestRunning) return;
      requestRunning = true;
      try {
        const response = await onboardingApi.whatsappConnection(selectedWorkspace.id);
        if (active) setWhatsappConnection(response.data);
      } catch {
        // The initial load owns visible errors; background refreshes stay quiet.
      } finally {
        requestRunning = false;
      }
    };
    const timer = window.setInterval(() => { void refresh(); }, 5_000);
    window.addEventListener('focus', refresh);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, [selectedWorkspace]);

  const connected = useMemo(() => platforms.filter((platform) => connectedStatuses.has(platform.connectionStatus)).length, [platforms]);
  const needsAttention = useMemo(() => platforms.filter((platform) => platform.connectionStatus === 'error').length, [platforms]);
  const whatsappPlatform = useMemo(() => platforms.find((platform) => platform.integrationKey?.toLowerCase() === 'whatsapp'), [platforms]);
  const whatsappCustomerConnected = Boolean(whatsappConnection?.customerConnection);
  const whatsappSelfServiceReady = whatsappConnection?.selfServiceAllowed === true;
  const showManagedWhatsApp = Boolean(whatsappConnection?.adminFallback.configured) && !whatsappPlatform && !whatsappSelfServiceReady;
  const showWhatsAppCard = !whatsappPlatform && Boolean(whatsappConnection) && (whatsappSelfServiceReady || showManagedWhatsApp);
  const configuredCount = platforms.length + (showWhatsAppCard ? 1 : 0);

  const beginOAuth = async (platform: Platform) => {
    if (!selectedWorkspace) return;
    const provider = platform.integrationKey?.trim().toLowerCase();
    if (!provider || !oauthProviders.has(provider)) {
      setError('This integration does not have a configured OAuth provider.');
      return;
    }
    if (provider === 'whatsapp') {
      setWhatsappSetupOpen(true);
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

  const beginWhatsApp = async () => {
    if (!selectedWorkspace || !canEdit || !whatsappPhone.trim()) return;
    setWhatsappBusy(true); setError('');
    try {
      const result = await onboardingApi.connectWhatsApp(selectedWorkspace.id, {
        phone: whatsappPhone.trim(),
        ...(whatsappDisplayName.trim() ? { displayName: whatsappDisplayName.trim() } : {}),
      });
      setWhatsappConnection(result.data.connection);
      setWhatsappSetupOpen(true);
      await load();
      setNotice('WhatsApp pairing started. Enter the code in WhatsApp → Linked devices.');
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'The WhatsApp pairing flow could not be started.')); }
    finally { setWhatsappBusy(false); }
  };

  const disconnectWhatsApp = async () => {
    if (!selectedWorkspace || !window.confirm('Disconnect this WhatsApp account from the workspace?')) return;
    setBusyId('whatsapp'); setError('');
    try { await onboardingApi.disconnectWhatsApp(selectedWorkspace.id); await load(); setNotice('WhatsApp disconnected.'); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, 'WhatsApp could not be disconnected.')); }
    finally { setBusyId(null); }
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
      <section className="mb-6 grid gap-3 sm:grid-cols-3"><article className="rounded-2xl border border-border bg-card p-5"><p className="text-xs text-muted-foreground">Available</p><p className="mt-2 text-3xl font-semibold">{configuredCount}</p></article><article className="rounded-2xl border border-border bg-card p-5"><p className="text-xs text-muted-foreground">Connected or syncing</p><p className="mt-2 text-3xl font-semibold">{connected}</p></article><article className="rounded-2xl border border-border bg-card p-5"><p className="text-xs text-muted-foreground">Need attention</p><p className="mt-2 text-3xl font-semibold">{needsAttention}</p></article></section>
      {error && <div role="alert" className="mb-5 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><AlertCircle size={18} className="shrink-0" /><span>{error}</span></div>}
      {notice && <div role="status" className="mb-5 flex gap-3 rounded-xl border border-border bg-secondary p-4 text-sm"><CheckCircle2 size={18} className="shrink-0" /><span>{notice}</span></div>}
      {providerReadiness && <section className="mb-6 rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Production readiness</p><h2 className="mt-2 text-xl font-semibold">Provider Control Plane</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Autonomous work is allowed only when every provider gate is ready.</p></div><span className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${providerReadiness.totalConnections === 0 ? 'bg-secondary text-muted-foreground' : providerReadiness.overallReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{providerReadiness.totalConnections === 0 ? 'No integrations configured.' : providerReadiness.overallReady ? 'Ready' : `${providerReadiness.readyCount}/${providerReadiness.totalConnections}`}</span></div>{!providerReadiness.overallReady && providerReadiness.connections.length > 0 && <div className="mt-5 space-y-3">{providerReadiness.connections.filter((connection) => !connection.ready).map((connection) => <article key={connection.connectionId} className="rounded-xl border border-border bg-secondary p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-semibold">{connection.displayName}</p><p className="text-xs text-muted-foreground">{connection.providerKey}</p></div><span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Readiness check</span></div><ul className="mt-3 space-y-1 text-sm text-muted-foreground">{connection.blockers.map((blocker) => <li key={`${connection.connectionId}-${blocker.code}`}>{blocker.message}</li>)}</ul></article>)}</div>}</section>}
      {selectedWorkspace && <ComposioCatalog workspaceId={selectedWorkspace.id} />}
      {loading ? <div className="grid min-h-72 place-items-center rounded-2xl border border-border bg-card text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><LoaderCircle size={17} className="animate-spin" />Loading available connections…</span></div> : <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="border-b border-border p-5"><h2 className="font-semibold">Available connections</h2><p className="mt-1 text-sm text-muted-foreground">Admin-approved providers appear here immediately, even before the workspace has completed its connection.</p></div>{platforms.length === 0 && !showWhatsAppCard ? <div className="p-10 text-center"><PlugZap className="mx-auto text-muted-foreground" size={34} /><h3 className="mt-4 text-lg font-semibold">No integrations available</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Ask your Lulu administrator to enable a managed provider or add a custom integration below.</p></div> : <div className="divide-y divide-border">{showWhatsAppCard && <article className="p-5" data-provider="unifyport" data-channel="whatsapp"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary"><MessageCircle size={16} /></span><h3 className="font-semibold">WhatsApp</h3><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${whatsappSelfServiceReady ? 'bg-secondary text-foreground' : 'bg-emerald-100 text-emerald-700'}`}>{whatsappSelfServiceReady ? 'Connect your WhatsApp' : 'Managed via UnifyPort'}</span></div><p className="mt-2 text-sm text-muted-foreground">{whatsappSelfServiceReady ? 'Your administrator enabled self-service. Pair your own WhatsApp number with a secure UnifyPort code.' : 'The Lulu administrator-authorized UnifyPort sender is active for this workspace.'}</p><p className="mt-1 text-xs text-muted-foreground">{whatsappConnection?.adminFallback.displayName ? `Admin fallback: ${whatsappConnection.adminFallback.displayName}` : 'No admin fallback sender has been set.'}</p></div>{whatsappSelfServiceReady ? <button type="button" onClick={() => setWhatsappSetupOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"><Link2 size={15} />Connect</button> : <button type="button" onClick={() => navigateApp(routes.app.connections)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium"><Link2 size={15} />View connection</button>}</div></article>}{platforms.map((platform) => { const connectedPlatform = connectedStatuses.has(platform.connectionStatus); const busy = busyId === platform.id; const isWhatsApp = platform.integrationKey?.toLowerCase() === 'whatsapp'; const managedByUnifyPort = isWhatsApp && !whatsappSelfServiceReady && !whatsappCustomerConnected; return <article key={platform.id} className="p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{platform.name}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${connectedPlatform ? 'bg-secondary text-foreground' : platform.connectionStatus === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground'}`}>{labelStatus(platform.connectionStatus)}</span>{managedByUnifyPort ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Managed via UnifyPort</span> : null}</div><p className="mt-1 text-sm text-muted-foreground">{isWhatsApp ? 'unifyport · whatsapp' : `${platform.category}${platform.integrationKey ? ` · ${platform.integrationKey}` : ''}`}</p><p className="mt-2 text-xs text-muted-foreground">Last sync: {formatDate(platform.lastSyncedAt)}{platform.lastError ? ` · ${platform.lastError}` : ''}</p></div><div className="flex flex-wrap gap-2">{isWhatsApp && whatsappCustomerConnected ? <><button type="button" onClick={() => void disconnectWhatsApp()} disabled={busyId === 'whatsapp' || !canEdit} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50"><Unplug size={14} />Disconnect</button></> : connectedPlatform && !managedByUnifyPort ? <><button type="button" onClick={() => void sync(platform)} disabled={busy || !can('administer')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50"><RefreshCw size={14} className={platform.connectionStatus === 'syncing' ? 'animate-spin' : ''} />Sync</button><button type="button" onClick={() => void disconnect(platform)} disabled={busy || !can('administer')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50"><Unplug size={14} />Disconnect</button></> : managedByUnifyPort ? <button type="button" onClick={() => navigateApp(routes.app.connections)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"><Link2 size={14} />View UnifyPort</button> : <button type="button" onClick={() => void beginOAuth(platform)} disabled={busy || !canEdit || !platform.integrationKey || !oauthProviders.has(platform.integrationKey.toLowerCase())} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"><Link2 size={14} />Connect</button>}{!managedByUnifyPort && !isWhatsApp && <button type="button" onClick={() => void remove(platform)} disabled={busy || !can('administer')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-destructive disabled:opacity-50"><Trash2 size={14} />Remove</button>}</div></div></article>; })}</div>}</section>}
      {can('administer') && <section className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6"><h2 className="text-lg font-semibold">Add integration</h2><p className="mt-1 text-sm text-muted-foreground">This creates a tenant-scoped integration record. It does not create any provider account or credential.</p><form onSubmit={(event) => void add(event)} className="mt-5 grid gap-3 md:grid-cols-4"><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required placeholder="Integration name" className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary" /><input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} required placeholder="Category" className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary" /><input value={draft.integrationKey} onChange={(event) => setDraft({ ...draft, integrationKey: event.target.value })} placeholder="Provider key (optional)" className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary" /><button disabled={busyId === 'new'} className="h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50">{busyId === 'new' ? 'Adding…' : 'Add integration'}</button></form></section>}
      {whatsappSetupOpen && whatsappSelfServiceReady && <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="whatsapp-setup-title"><div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">UnifyPort WhatsApp</p><h2 id="whatsapp-setup-title" className="mt-2 text-2xl font-semibold">Connect your number</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Lulu never receives your WhatsApp password. UnifyPort creates a private virtual device and gives you a short pairing code.</p></div><button type="button" onClick={() => setWhatsappSetupOpen(false)} className="text-sm text-muted-foreground">Close</button></div>{whatsappConnection?.pendingConnection ? <div className="mt-6 space-y-4"><div className="rounded-xl border border-border bg-secondary p-4"><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Pairing code</p><p className="mt-2 text-3xl font-bold tracking-[.22em]">{typeof whatsappConnection.pendingConnection.authPayload?.verify_code === 'string' ? whatsappConnection.pendingConnection.authPayload.verify_code : 'Waiting…'}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">On your phone: WhatsApp → Linked devices → Link with phone number. Enter the code before it expires.</p></div><p className="text-xs text-muted-foreground">Status: {labelStatus(whatsappConnection.pendingConnection.authStatus)} · Runtime: {labelStatus(whatsappConnection.pendingConnection.runtimeStatus)}</p>{whatsappConnection.pendingConnection.lastError && <p className="text-sm text-destructive">{whatsappConnection.pendingConnection.lastError}</p>}</div> : whatsappCustomerConnected ? <div className="mt-6 rounded-xl border border-border bg-secondary p-4 text-sm">WhatsApp is connected as <strong>{whatsappConnection.customerConnection?.displayName}</strong>.</div> : <div className="mt-6 space-y-4"><label className="block text-sm font-medium">WhatsApp phone number<input value={whatsappPhone} onChange={(event) => setWhatsappPhone(event.target.value)} placeholder="+491701234567" className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3" /></label><label className="block text-sm font-medium">Display name (optional)<input value={whatsappDisplayName} onChange={(event) => setWhatsappDisplayName(event.target.value)} placeholder="Customer Support" className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3" /></label><button type="button" onClick={() => void beginWhatsApp()} disabled={whatsappBusy || !whatsappPhone.trim()} className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">{whatsappBusy ? 'Starting secure pairing…' : 'Start pairing'}</button></div>}</div></div>}
    </main>
  </div>;
}
