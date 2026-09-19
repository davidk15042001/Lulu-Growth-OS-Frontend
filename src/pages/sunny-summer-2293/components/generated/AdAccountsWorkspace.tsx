import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, ExternalLink, Link2, LoaderCircle, RefreshCw, ShieldCheck, WalletCards, XCircle } from 'lucide-react';
import { getFriendlyErrorMessage } from '../../../../api/client';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { onboardingApi } from '../../../../api/onboarding';
import { providerControlApi, type ProviderCatalogEntry, type ProviderConnection, type ProviderLaunchReadiness } from '../../../../api/providers';
import { LuluGlobalNavigation } from '../../../../components/LuluGlobalNavigation';

type AdvertisingProvider = {
  key: string;
  label: string;
  oauthProvider: string | null;
  description: string;
};

const advertisingProviders: AdvertisingProvider[] = [
  {
    key: 'meta',
    label: 'Meta Ads',
    oauthProvider: 'meta',
    description: 'Facebook and Instagram ad account verification, campaign read access, spend insight and guarded publishing readiness.',
  },
  {
    key: 'google_ads',
    label: 'Google Ads',
    oauthProvider: 'google',
    description: 'Google campaign and spend data for cross-channel planning once the customer account is connected.',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn Ads',
    oauthProvider: 'linkedin',
    description: 'B2B campaign visibility and readiness checks for LinkedIn Campaign Manager.',
  },
  {
    key: 'tiktok_ads',
    label: 'TikTok Ads',
    oauthProvider: 'tiktok_ads',
    description: 'TikTok campaign visibility when the workspace grants the required advertiser permissions.',
  },
];

function statusClass(status?: string | null) {
  if (!status) return 'border-border bg-secondary text-muted-foreground';
  if (['READY', 'CONNECTED', 'AVAILABLE', 'HEALTHY', 'AUTHORIZED', 'PASSED'].includes(status)) return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
  if (['PENDING', 'UNCONFIRMED', 'PROVIDER_REVIEW', 'PARTIAL', 'RUNNING'].includes(status)) return 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300';
  return 'border-destructive/20 bg-destructive/10 text-destructive';
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function StatusBadge({ status }: { status?: string | null }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(status)}`}>{(status ?? 'Not connected').replaceAll('_', ' ')}</span>;
}

function findReadiness(readiness: ProviderLaunchReadiness | null, providerKey: string) {
  return readiness?.connections.find((connection) => connection.providerKey === providerKey) ?? null;
}

function findCatalog(catalog: ProviderCatalogEntry[], providerKey: string) {
  return catalog.find((entry) => entry.providerKey === providerKey) ?? null;
}

function providerConnections(connections: ProviderConnection[], providerKey: string) {
  return connections.filter((connection) => connection.providerKey === providerKey);
}

export function AdAccountsWorkspace() {
  const { selectedWorkspace, can, permissions } = useLuluApp();
  const canEdit = can('edit');
  const [catalog, setCatalog] = useState<ProviderCatalogEntry[]>([]);
  const [connections, setConnections] = useState<ProviderConnection[]>([]);
  const [readiness, setReadiness] = useState<ProviderLaunchReadiness | null>(null);
  const [selfServiceProviders, setSelfServiceProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const workspaceId = selectedWorkspace?.id ?? null;

  const load = useCallback(async () => {
    if (!workspaceId) {
      setCatalog([]);
      setConnections([]);
      setReadiness(null);
      setSelfServiceProviders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [catalogResult, connectionsResult, readinessResult, selfServiceResult] = await Promise.all([
        providerControlApi.catalog(workspaceId),
        providerControlApi.connections(workspaceId),
        providerControlApi.launchReadiness(workspaceId),
        onboardingApi.oauthSelfServicePermissions(workspaceId).catch(() => ({ data: { providers: [] } })),
      ]);
      setCatalog(catalogResult.data.providers);
      setConnections(connectionsResult.data.connections);
      setReadiness(readinessResult.data);
      setSelfServiceProviders(selfServiceResult.data.providers);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'Advertising provider status could not be loaded.'));
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const summary = useMemo(() => {
    const adConnections = connections.filter((connection) => advertisingProviders.some((provider) => provider.key === connection.providerKey));
    const connected = adConnections.filter((connection) => connection.status === 'CONNECTED').length;
    const availableCapabilities = adConnections.flatMap((connection) => connection.capabilities).filter((capability) => capability.status === 'AVAILABLE').length;
    const blocked = readiness?.connections.filter((connection) => advertisingProviders.some((provider) => provider.key === connection.providerKey) && !connection.ready).length ?? 0;
    return { total: adConnections.length, connected, availableCapabilities, blocked };
  }, [connections, readiness]);

  async function connect(provider: AdvertisingProvider) {
    if (!workspaceId || !provider.oauthProvider || busy) return;
    setBusy(`connect:${provider.key}`);
    setError('');
    try {
      const response = await onboardingApi.startOAuth(workspaceId, provider.oauthProvider, undefined, `${window.location.pathname}${window.location.search}`);
      window.location.assign(response.data.authorizationUrl);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, `${provider.label} authorization could not be started.`));
      setBusy(null);
    }
  }

  async function verify(connection: ProviderConnection) {
    if (!workspaceId || busy) return;
    setBusy(`verify:${connection.id}`);
    setError('');
    try {
      await providerControlApi.verify(workspaceId, connection.id);
      await load();
      setNotice(`${connection.displayName} verified.`);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, `${connection.displayName} could not be verified.`));
    } finally {
      setBusy(null);
    }
  }

  async function runContractCheck(connection: ProviderConnection) {
    if (!workspaceId || busy) return;
    setBusy(`contract:${connection.id}`);
    setError('');
    try {
      await providerControlApi.contractCheck(workspaceId, connection.id);
      await load();
      setNotice(`${connection.displayName} readiness check completed.`);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, `${connection.displayName} readiness check could not be completed.`));
    } finally {
      setBusy(null);
    }
  }

  async function sync(connection: ProviderConnection) {
    if (!workspaceId || busy) return;
    setBusy(`sync:${connection.id}`);
    setError('');
    try {
      await providerControlApi.sync(workspaceId, connection.id);
      await load();
      setNotice(`${connection.displayName} sync queued.`);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, `${connection.displayName} sync could not be started.`));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-64 lg:border-r lg:border-border lg:bg-card">
        <LuluGlobalNavigation activeSlug="sunny-summer-2293" />
      </aside>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:ml-64 lg:px-12 lg:py-12">
        <header className="mb-8 flex flex-col gap-5 border-b border-border pb-7 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Advertising / Control Plane</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-.02em]">Ad Accounts & Platform Management</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Connect Meta Ads and other advertising platforms, verify account access, run readiness checks and keep campaign mutations blocked until the backend confirms they are allowed.
            </p>
          </div>
          <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium disabled:opacity-50">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </header>

        {!workspaceId ? <section className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">Select a workspace before managing advertising connections.</section> : null}
        {error ? <div role="alert" className="mb-5 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><AlertTriangle size={18} className="shrink-0" /><span>{error}</span></div> : null}
        {notice ? <div role="status" className="mb-5 flex gap-3 rounded-xl border border-border bg-secondary p-4 text-sm"><CheckCircle2 size={18} className="shrink-0" /><span>{notice}</span></div> : null}

        <section className="mb-6 grid gap-3 md:grid-cols-4">
          <article className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Advertising connections</p>
            <p className="mt-2 text-3xl font-semibold">{summary.total}</p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Connected</p>
            <p className="mt-2 text-3xl font-semibold">{summary.connected}</p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Available capabilities</p>
            <p className="mt-2 text-3xl font-semibold">{summary.availableCapabilities}</p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">Readiness blockers</p>
            <p className="mt-2 text-3xl font-semibold">{summary.blocked}</p>
          </article>
        </section>

        {loading ? (
          <div className="grid min-h-72 place-items-center rounded-2xl border border-border bg-card text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><LoaderCircle size={17} className="animate-spin" /> Loading advertising providers...</span>
          </div>
        ) : (
          <div className="grid gap-5">
            {advertisingProviders.map((provider) => {
              const providerCatalog = findCatalog(catalog, provider.key);
              const readinessState = findReadiness(readiness, provider.key);
              const providerItems = providerConnections(connections, provider.key);
              const selfService = provider.oauthProvider ? selfServiceProviders.includes(provider.oauthProvider) || selfServiceProviders.includes(provider.key) : false;
              return (
                <section key={provider.key} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary"><BarChart3 size={17} /></span>
                        <h2 className="text-xl font-semibold">{provider.label}</h2>
                        <StatusBadge status={readinessState?.status ?? providerItems[0]?.status} />
                        {provider.key === 'meta' ? <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">Mutations require review</span> : null}
                      </div>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{provider.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Catalog: {providerCatalog?.implementationStatus ?? 'Not listed'} - Default mode: {providerCatalog?.defaultMode ?? 'Unknown'} - OAuth self service: {selfService ? 'enabled' : 'not enabled or not reported'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void connect(provider)}
                        disabled={!workspaceId || !canEdit || !provider.oauthProvider || busy !== null}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                      >
                        <ExternalLink size={14} /> {busy === `connect:${provider.key}` ? 'Opening...' : providerItems.length ? 'Reconnect' : 'Connect'}
                      </button>
                      <button type="button" onClick={() => void load()} disabled={busy !== null} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50">
                        <RefreshCw size={14} /> Reload
                      </button>
                    </div>
                  </div>

                  {readinessState?.blockers.length ? (
                    <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <p className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300"><AlertTriangle size={15} /> Readiness blockers</p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {readinessState.blockers.map((blocker) => <li key={`${provider.key}-${blocker.code}`}>{blocker.code}: {blocker.message}</li>)}
                      </ul>
                    </div>
                  ) : providerItems.length ? (
                    <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:text-emerald-300">
                      Backend readiness currently has no blockers for this provider.
                    </div>
                  ) : null}

                  {providerItems.length === 0 ? (
                    <div className="mt-5 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                      No {provider.label} provider connection exists for this workspace yet.
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {providerItems.map((connection) => (
                        <article key={connection.id} className="rounded-xl border border-border bg-background/45 p-4">
                          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold">{connection.displayName}</h3>
                                <StatusBadge status={connection.status} />
                                <StatusBadge status={connection.authorizationState} />
                                <StatusBadge status={connection.healthStatus} />
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">
                                Mode: {connection.mode} - Account: {connection.externalAccountId ?? 'Not set'} - Last verified: {formatDate(connection.lastVerifiedAt)}
                              </p>
                              {connection.healthReason ? <p className="mt-2 text-sm text-muted-foreground">{connection.healthReason}</p> : null}
                              {connection.lastError ? <p className="mt-2 text-sm text-destructive">{connection.lastError}</p> : null}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={() => void verify(connection)} disabled={!canEdit || busy !== null} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50">
                                <ShieldCheck size={14} /> {busy === `verify:${connection.id}` ? 'Checking...' : 'Verify'}
                              </button>
                              <button type="button" onClick={() => void runContractCheck(connection)} disabled={!canEdit || busy !== null} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50">
                                <CheckCircle2 size={14} /> {busy === `contract:${connection.id}` ? 'Running...' : 'Readiness check'}
                              </button>
                              <button type="button" onClick={() => void sync(connection)} disabled={!canEdit || busy !== null} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50">
                                <RefreshCw size={14} className={busy === `sync:${connection.id}` ? 'animate-spin' : undefined} /> Sync
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3 lg:grid-cols-2">
                            <div className="rounded-lg border border-border bg-card p-4">
                              <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><WalletCards size={15} /> Discovered ad accounts</p>
                              {connection.accounts.length === 0 ? <p className="text-sm text-muted-foreground">No accounts discovered yet. Run Verify or Sync after OAuth is complete.</p> : (
                                <div className="space-y-3">
                                  {connection.accounts.map((account) => (
                                    <div key={account.id} className="rounded-lg border border-border bg-background/60 p-3 text-sm">
                                      <div className="flex flex-wrap items-center justify-between gap-2">
                                        <strong>{account.name ?? account.externalAccountId}</strong>
                                        <StatusBadge status={account.status} />
                                      </div>
                                      <p className="mt-1 text-xs text-muted-foreground">{account.externalAccountId} - {account.currency ?? 'Currency unknown'} - Synced: {formatDate(account.lastSyncedAt)}</p>
                                      {account.assets.length ? <p className="mt-2 text-xs text-muted-foreground">Assets: {account.assets.map((asset) => asset.displayName ?? asset.assetType).join(', ')}</p> : null}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="rounded-lg border border-border bg-card p-4">
                              <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Link2 size={15} /> Capabilities</p>
                              {connection.capabilities.length === 0 ? <p className="text-sm text-muted-foreground">No capability result has been recorded yet.</p> : (
                                <div className="space-y-2">
                                  {connection.capabilities.map((capability) => (
                                    <div key={capability.id} className="flex flex-col gap-1 rounded-lg border border-border bg-background/60 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                                      <span>{capability.capabilityKey}</span>
                                      <StatusBadge status={capability.status} />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {connection.providerKey === 'meta' ? (
                                <div className="mt-3 flex gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300">
                                  <XCircle size={15} className="mt-0.5 shrink-0" />
                                  <p>Meta campaign creation, budget changes and publishing stay blocked unless the control plane returns the capability as available.</p>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {permissions.status !== 'ready' ? (
          <p className="mt-5 rounded-xl border border-border bg-secondary p-4 text-sm text-muted-foreground">Workspace permissions are still loading or unavailable. Mutating actions stay disabled until permissions are known.</p>
        ) : null}
      </main>
    </div>
  );
}
