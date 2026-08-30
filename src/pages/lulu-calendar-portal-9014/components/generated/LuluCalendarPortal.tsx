import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, CircleAlert, ExternalLink, Link2, LoaderCircle, RefreshCw, Search, Settings, Trash2, X } from 'lucide-react';
import { calendarApi, type CalendarAccount, type CalendarEvent, type CalendarProvider, type CalendarSyncJob } from '../../../../api/calendar';
import { ApiError, getFriendlyErrorMessage } from '../../../../api/client';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { useLanguage, useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import '../../index.css';

type Section = 'overview' | 'settings';
type TokenModalState = { provider: 'calendly' | 'calcom' } | null;

function sectionFromUrl(): Section {
  const value = new URLSearchParams(window.location.search).get('section');
  return value === 'settings' ? 'settings' : 'overview';
}

function providerLabel(provider: CalendarProvider) {
  switch (provider) {
    case 'google': return 'Google Calendar';
    case 'microsoft': return 'Microsoft 365 / Outlook';
    case 'calendly': return 'Calendly';
    case 'calcom': return 'Cal.com';
  }
}

function statusLabel(status: string) {
  if (status === 'reauth_required') return 'Reconnect required';
  if (status === 'syncing') return 'Synchronizing';
  if (status === 'connected') return 'Connected';
  if (status === 'error') return 'Needs attention';
  return status;
}

function dateLabel(value: string, language: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat(language, { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date)
    : value;
}

function dayLabel(value: string, language: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat(language, { weekday: 'long', day: '2-digit', month: 'long' }).format(date)
    : value;
}

function dayKey(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : value;
}

function eventSources(event: CalendarEvent): NonNullable<CalendarEvent['sources']> {
  return event.sources?.length ? event.sources : [{
    accountId: event.accountId,
    provider: event.provider,
    sourceName: event.sourceName,
    accountEmail: event.accountEmail,
    accountDisplayName: event.accountDisplayName,
  }];
}

export default function CalendarPortal() {
  const { selectedWorkspace, permissions, loading: appLoading } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? null;
  const t = useTranslation();
  const language = useLanguage();
  const section = sectionFromUrl();
  const [accounts, setAccounts] = useState<CalendarAccount[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [summary, setSummary] = useState<{ connectedAccounts: number; syncedAccounts: number; upcomingEvents: number; providers: CalendarProvider[] } | null>(null);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [syncJobs, setSyncJobs] = useState<Record<string, CalendarSyncJob>>({});
  const [tokenModal, setTokenModal] = useState<TokenModalState>(null);

  const loadOverview = useCallback(async () => {
    if (!workspaceId) return;
    const result = await calendarApi.overview(workspaceId, {
      ...(query.trim() ? { q: query.trim() } : {}),
      limit: 300,
    });
    setAccounts(result.data.accounts);
    setEvents(result.data.events);
    setSummary(result.data.summary);
  }, [workspaceId, query]);

  useEffect(() => {
    if (!workspaceId) { if (!appLoading) setBusy(false); return; }
    let active = true;
    setBusy(true);
    setError(null);
    loadOverview()
      .catch((cause) => { if (active) setError(getFriendlyErrorMessage(cause, 'Calendar workspace could not be loaded.')); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [workspaceId, appLoading, loadOverview]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('calendarConnection') === 'error') {
      const code = params.get('code') || 'CALENDAR_OAUTH_CALLBACK_FAILED';
      setError(getFriendlyErrorMessage(new ApiError(400, code, 'Calendar connection could not be completed'), 'Calendar connection could not be completed.'));
      return;
    }
    if (params.get('calendarConnection') !== 'success' || !workspaceId || !accounts.length) return;
    const connectedId = params.get('accountId') || accounts[0]?.id;
    if (!connectedId || sessionStorage.getItem(`lulu.calendar.oauth-synced.${connectedId}`)) return;
    sessionStorage.setItem(`lulu.calendar.oauth-synced.${connectedId}`, '1');
    void syncAccount(connectedId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, accounts]);

  useEffect(() => {
    const running = Object.values(syncJobs).filter((job) => job.status === 'queued' || job.status === 'running');
    if (!workspaceId || !running.length) return;
    const timer = window.setInterval(() => {
      void Promise.all(running.map(async (job) => {
        const result = await calendarApi.syncJob(workspaceId, job.accountId, job.id);
        setSyncJobs((value) => ({ ...value, [job.accountId]: result.data }));
        if (result.data.status === 'succeeded') {
          await loadOverview();
          setNotice('Calendar synchronized.');
        }
        if (result.data.status === 'failed') setError(result.data.errorMessage || 'Synchronization failed.');
      }));
    }, 1800);
    return () => window.clearInterval(timer);
  }, [workspaceId, syncJobs, loadOverview]);

  async function syncAccount(id: string) {
    if (!workspaceId) return;
    setError(null);
    try {
      const result = await calendarApi.startSync(workspaceId, id);
      setSyncJobs((value) => ({ ...value, [id]: result.data }));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'Synchronization failed.'));
    }
  }

  async function syncAllAccounts() {
    if (!workspaceId) return;
    const syncableAccounts = accounts.filter((account) => account.status !== 'reauth_required');
    if (!syncableAccounts.length) return;
    setError(null);
    const results = await Promise.allSettled(syncableAccounts.map((account) => calendarApi.startSync(workspaceId, account.id)));
    const queuedJobs = results.flatMap((result) => result.status === 'fulfilled' ? [result.value.data] : []);
    setSyncJobs((value) => ({ ...value, ...Object.fromEntries(queuedJobs.map((job) => [job.accountId, job])) }));
    if (queuedJobs.length) setNotice(`${queuedJobs.length} calendar ${queuedJobs.length === 1 ? 'source' : 'sources'} queued for synchronization.`);
    const failed = results.find((result) => result.status === 'rejected');
    if (failed?.status === 'rejected') setError(getFriendlyErrorMessage(failed.reason, 'Some calendar sources could not be synchronized.'));
  }

  async function connectOAuth(provider: 'google' | 'microsoft') {
    if (!workspaceId) return;
    setActionBusy(true);
    setError(null);
    try {
      const result = await calendarApi.startOAuth(workspaceId, provider, '/app/calendar?section=settings');
      window.location.assign(result.data.authorizationUrl);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'Calendar connection could not be started.'));
      setActionBusy(false);
    }
  }

  const groupedEvents = useMemo(() => {
    const buckets = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const key = dayKey(event.startAt);
      buckets.set(key, [...(buckets.get(key) ?? []), event]);
    });
    return Array.from(buckets.entries()).map(([key, items]) => ({ key, label: dayLabel(items[0]?.startAt ?? key, language), items }));
  }, [events, language]);

  const syncableAccounts = accounts.filter((account) => account.status !== 'reauth_required');
  const synchronizing = syncableAccounts.some((account) => ['queued', 'running'].includes(syncJobs[account.id]?.status ?? ''));

  if (appLoading || busy && !summary) return <main className="calendar-page calendar-page--center" role="status"><LoaderCircle className="spin" /><p>{t('Loading calendar workspace…')}</p></main>;
  if (!workspaceId) return <main className="calendar-page calendar-page--center"><CircleAlert /><h1>{t('No workspace selected')}</h1><p>{t('Select a workspace before opening the calendar.')}</p></main>;

  return <main className="calendar-page">
    <header className="calendar-header">
      <div>
        <p className="calendar-eyebrow">Lulu AI / Calendar</p>
        <h1>Calendar workspace</h1>
        <p>Sync meetings and bookings from Google, Microsoft, Calendly and Cal.com into one timeline.</p>
      </div>
      <div className="calendar-header__actions">
        <nav className="calendar-tabs" aria-label="Calendar sections">
          <a href="/app/calendar" className={section === 'overview' ? 'is-active' : undefined}>Overview</a>
          <a href="/app/calendar?section=settings" className={section === 'settings' ? 'is-active' : undefined}>Settings</a>
        </nav>
        <button type="button" className="calendar-button calendar-button--secondary" disabled={!permissions.canEdit || synchronizing || !syncableAccounts.length} onClick={() => void syncAllAccounts()}><RefreshCw size={16} className={synchronizing ? 'spin' : ''} />{synchronizing ? 'Synchronizing calendars…' : 'Sync all calendars'}</button>
        {permissions.canEdit && <a className="calendar-button" href="/app/calendar?section=settings"><Link2 size={16} />Connections</a>}
      </div>
    </header>

    {error && <div className="calendar-alert calendar-alert--error" role="alert"><CircleAlert size={17} /><span>{error}</span><button type="button" onClick={() => setError(null)} aria-label={t('Close')}><X size={15} /></button></div>}
    {notice && <div className="calendar-alert calendar-alert--success" role="status"><Check size={17} /><span>{notice}</span><button type="button" onClick={() => setNotice(null)} aria-label={t('Close')}><X size={15} /></button></div>}

    {!accounts.length ? <EmptyState canEdit={permissions.canEdit} busy={actionBusy} onGoogle={() => void connectOAuth('google')} onMicrosoft={() => void connectOAuth('microsoft')} onCalendly={() => setTokenModal({ provider: 'calendly' })} onCalcom={() => setTokenModal({ provider: 'calcom' })} /> : section === 'settings'
      ? <SettingsView accounts={accounts} jobs={syncJobs} canEdit={permissions.canEdit} onGoogle={() => void connectOAuth('google')} onMicrosoft={() => void connectOAuth('microsoft')} onCalendly={() => setTokenModal({ provider: 'calendly' })} onCalcom={() => setTokenModal({ provider: 'calcom' })} onSync={(id) => void syncAccount(id)} onDisconnect={async (id) => { if (!workspaceId || !window.confirm('Disconnect this calendar account?')) return; await calendarApi.disconnect(workspaceId, id); await loadOverview(); }} language={language} />
      : <OverviewView accounts={accounts} events={events} groupedEvents={groupedEvents} summary={summary} query={query} onQuery={setQuery} language={language} />}

    {tokenModal && <TokenModal workspaceId={workspaceId} provider={tokenModal.provider} busy={actionBusy} setBusy={setActionBusy} onClose={() => setTokenModal(null)} onConnected={async () => { setTokenModal(null); await loadOverview(); setNotice(`${providerLabel(tokenModal.provider)} connected.`); }} onError={setError} />}
  </main>;
}

function EmptyState({ canEdit, busy, onGoogle, onMicrosoft, onCalendly, onCalcom }: { canEdit: boolean; busy: boolean; onGoogle: () => void; onMicrosoft: () => void; onCalendly: () => void; onCalcom: () => void }) {
  return <section className="calendar-empty"><div className="calendar-empty__icon"><CalendarDays size={30} /></div><h2>Connect your first calendar</h2><p>Pull availability, meetings and bookings into a single workspace view.</p><div className="calendar-provider-grid"><button disabled={!canEdit || busy} onClick={onGoogle}><strong>Google Calendar</strong><span>OAuth connection</span></button><button disabled={!canEdit || busy} onClick={onMicrosoft}><strong>Microsoft 365</strong><span>OAuth connection</span></button><button disabled={!canEdit || busy} onClick={onCalendly}><strong>Calendly</strong><span>API token connection</span></button><button disabled={!canEdit || busy} onClick={onCalcom}><strong>Cal.com</strong><span>API key connection</span></button></div>{!canEdit && <small>A workspace editor must connect calendar providers.</small>}</section>;
}

function OverviewView({ accounts, events, groupedEvents, summary, query, onQuery, language }: { accounts: CalendarAccount[]; events: CalendarEvent[]; groupedEvents: Array<{ key: string; label: string; items: CalendarEvent[] }>; summary: { connectedAccounts: number; syncedAccounts: number; upcomingEvents: number; providers: CalendarProvider[] } | null; query: string; onQuery: (value: string) => void; language: string }) {
  return <>
    <section className="calendar-unified-banner">
      <div><CalendarDays size={22} /><div><strong>Lulu calendar</strong><span>All connected calendars are combined automatically in this timeline.</span></div></div>
      <div className="calendar-source-list">{accounts.map((account) => <span key={account.id}>{providerLabel(account.provider)} · {account.displayName || account.emailAddress || 'Calendar'}</span>)}</div>
    </section>
    <section className="calendar-kpis">
      <article><span>Connected accounts</span><strong>{summary?.connectedAccounts ?? accounts.length}</strong></article>
      <article><span>Synced accounts</span><strong>{summary?.syncedAccounts ?? 0}</strong></article>
      <article><span>Upcoming 7 days</span><strong>{summary?.upcomingEvents ?? 0}</strong></article>
      <article><span>Providers</span><strong>{summary?.providers.join(', ') || '—'}</strong></article>
    </section>
    <section className="calendar-toolbar">
      <label className="calendar-search"><Search size={16} /><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search meetings, event types or descriptions" /></label>
    </section>
    <section className="calendar-timeline">
      {!events.length && <div className="calendar-empty-state"><CalendarDays size={28} /><h2>No synced calendar items yet</h2><p>Connect an account and run a sync to populate your timeline.</p></div>}
      {groupedEvents.map((group) => <article key={group.key} className="calendar-day"><header><h2>{group.label}</h2><span>{group.items.length} events</span></header><div className="calendar-event-list">{group.items.map((event) => { const sources = eventSources(event); return <div key={event.id} className="calendar-event"><div className="calendar-event__time"><strong>{dateLabel(event.startAt, language)}</strong><div className="calendar-event__sources">{sources.map((source) => <span key={source.accountId}>{providerLabel(source.provider)}</span>)}</div></div><div className="calendar-event__content"><div><h3>{event.title}</h3><p>{sources.map((source) => source.sourceName || source.accountDisplayName || source.accountEmail || providerLabel(source.provider)).join(' · ')}</p></div><div className="calendar-event__meta"><span>{event.location || event.timezone || 'No location'}</span><span>{event.attendeeCount ? `${event.attendeeCount} attendees` : 'No attendees synced'}</span><span>{event.status}</span>{sources.length > 1 && <span>Combined from {sources.length} calendars</span>}</div>{event.description && <small>{event.description}</small>}{event.meetingUrl && <a href={event.meetingUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} />Open meeting link</a>}</div></div>; })}</div></article>)}
    </section>
  </>;
}

function SettingsView({ accounts, jobs, canEdit, onGoogle, onMicrosoft, onCalendly, onCalcom, onSync, onDisconnect, language }: { accounts: CalendarAccount[]; jobs: Record<string, CalendarSyncJob>; canEdit: boolean; onGoogle: () => void; onMicrosoft: () => void; onCalendly: () => void; onCalcom: () => void; onSync: (id: string) => void; onDisconnect: (id: string) => void; language: string }) {
  return <section className="calendar-settings">
    <div className="calendar-settings__header">
      <div><h2>Calendar connections</h2><p>Manage OAuth and API-token based calendar sources.</p></div>
      <div className="calendar-connect-buttons"><button disabled={!canEdit} onClick={onGoogle}>+ Google</button><button disabled={!canEdit} onClick={onMicrosoft}>+ Microsoft</button><button disabled={!canEdit} onClick={onCalendly}>+ Calendly</button><button disabled={!canEdit} onClick={onCalcom}>+ Cal.com</button></div>
    </div>
    <div className="calendar-account-list">{accounts.map((account) => { const job = jobs[account.id]; const syncing = job?.status === 'queued' || job?.status === 'running'; return <article key={account.id}><div><strong>{account.displayName || account.emailAddress || providerLabel(account.provider)}</strong><p>{providerLabel(account.provider)}{account.emailAddress ? ` · ${account.emailAddress}` : ''}</p><small>{account.lastSyncAt ? `Last synchronized: ${dateLabel(account.lastSyncAt, language)}` : 'Not synchronized yet'} · <b className={`status-${account.status}`}>{statusLabel(account.status)}</b></small>{account.lastErrorMessage && <em>{account.lastErrorMessage}</em>}</div><div><button disabled={!canEdit || syncing} onClick={() => onSync(account.id)}><RefreshCw className={syncing ? 'spin' : ''} size={16} />Sync</button><button disabled={!canEdit} className="danger" onClick={() => onDisconnect(account.id)}><Trash2 size={16} />Disconnect</button></div></article>; })}</div>
    <div className="calendar-note"><Settings size={20} /><div><strong>Connection model</strong><p>Google and Microsoft use OAuth. Calendly and Cal.com use personal API tokens so you can start syncing without waiting for extra OAuth app setup.</p></div></div>
  </section>;
}

function TokenModal({ workspaceId, provider, busy, setBusy, onClose, onConnected, onError }: { workspaceId: string; provider: 'calendly' | 'calcom'; busy: boolean; setBusy: (value: boolean) => void; onClose: () => void; onConnected: () => void; onError: (value: string) => void }) {
  const [apiKey, setApiKey] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [baseUrl, setBaseUrl] = useState(provider === 'calcom' ? 'https://api.cal.com' : '');
  const title = provider === 'calendly' ? 'Connect Calendly' : 'Connect Cal.com';
  const helper = provider === 'calendly' ? 'Paste a Calendly personal access token.' : 'Paste a Cal.com API key. Keep the default base URL unless you run a self-hosted instance.';
  return <div className="calendar-modal-backdrop"><section className="calendar-dialog" role="dialog" aria-modal="true"><header><div><h2>{title}</h2><p>{helper}</p></div><button onClick={onClose}><X /></button></header><div className="calendar-form-grid"><label className="wide">Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder={providerLabel(provider)} /></label><label className="wide">API key / token<input type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="Paste token" /></label>{provider === 'calcom' && <label className="wide">Base URL<input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} placeholder="https://api.cal.com" /></label>}</div><footer><button className="calendar-button calendar-button--secondary" onClick={onClose}>Cancel</button><button className="calendar-button" disabled={busy || !apiKey.trim()} onClick={async () => { setBusy(true); try { await calendarApi.connectToken(workspaceId, { provider, apiKey: apiKey.trim(), ...(displayName.trim() ? { displayName: displayName.trim() } : {}), ...(provider === 'calcom' && baseUrl.trim() ? { baseUrl: baseUrl.trim() } : {}) }); onConnected(); } catch (cause) { onError(getFriendlyErrorMessage(cause, 'Calendar account could not be connected.')); } finally { setBusy(false); } }}>{busy ? <LoaderCircle className="spin" size={16} /> : <Link2 size={16} />}Verify & connect</button></footer></section></div>;
}
