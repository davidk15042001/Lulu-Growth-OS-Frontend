import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, Check, CircleAlert, Copy, Link2, LoaderCircle, MapPin, Plus, PlugZap, Search, Settings2, Video, X } from 'lucide-react';
import { calendarApi, type CalendarDeliveryCandidate, type CalendarDeliveryTarget, type CalendarDeliveryTargetInput, type NativeCalendarEvent } from '../../../../api/calendar';
import { composioApi, type ComposioIntegrationTeam } from '../../../../api/composio';
import { listRecords, type WorkspaceRecord } from '../../../../api/records';
import { getFriendlyErrorMessage } from '../../../../api/client';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { useLanguage, useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import { useLuluConfirm } from '../../../../components/LuluConfirmDialog';
import '../../index.css';

function dateLabel(value: string, language: string, options: Intl.DateTimeFormatOptions = {}) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat(language, { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', ...options }).format(date) : value;
}
function dayLabel(value: string, language: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat(language, { weekday: 'long', day: '2-digit', month: 'long' }).format(date) : value;
}
function dayKey(value: string) { const date = new Date(value); return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : value; }
function localDateTimeToIso(value: string) { const date = new Date(value); return Number.isFinite(date.getTime()) ? date.toISOString() : ''; }
function absoluteGuestLink(value: string) {
  try { return new URL(value, window.location.origin).toString(); } catch { return value; }
}

export default function CalendarPortal() {
  const { selectedWorkspace, permissions, loading: appLoading } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? null;
  const t = useTranslation();
  const confirm = useLuluConfirm();
  const language = useLanguage();
  const [events, setEvents] = useState<NativeCalendarEvent[]>([]);
  const [customers, setCustomers] = useState<WorkspaceRecord[]>([]);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [deliveryTargets, setDeliveryTargets] = useState<CalendarDeliveryTarget[]>([]);
  const [deliveryLoading, setDeliveryLoading] = useState(true);
  const [showDeliverySettings, setShowDeliverySettings] = useState(false);

  const loadEvents = useCallback(async () => {
    if (!workspaceId) return;
    const result = await calendarApi.nativeEvents(workspaceId, { ...(query.trim() ? { q: query.trim() } : {}), limit: 300 });
    setEvents(result.data.items);
  }, [workspaceId, query]);
  useEffect(() => {
    if (!workspaceId) { if (!appLoading) setBusy(false); return; }
    let active = true; setBusy(true); setError(null);
    loadEvents().catch((cause) => { if (active) setError(getFriendlyErrorMessage(cause, t('Calendar could not be loaded.'))); }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [workspaceId, appLoading, loadEvents, t]);
  useEffect(() => {
    if (!workspaceId) { setCustomers([]); return; }
    let active = true;
    // Customer records are only needed by the create dialog. Keep them out of
    // the appointment search request so a customer-list failure cannot hide a
    // healthy calendar, and typing in the search box does not refetch them.
    void listRecords('customers', 'limit=100').then((result) => {
      if (active) setCustomers(result.data.items);
    }).catch(() => {
      if (active) setCustomers([]);
    });
    return () => { active = false; };
  }, [workspaceId]);
  useEffect(() => {
    if (!workspaceId) { setDeliveryTargets([]); setDeliveryLoading(false); return; }
    let active = true;
    setDeliveryLoading(true);
    void calendarApi.deliveryTargets(workspaceId).then((result) => {
      if (active) setDeliveryTargets(result.data.items);
    }).catch((cause) => {
      if (active) setError(getFriendlyErrorMessage(cause, t('External calendar destinations could not be loaded.')));
    }).finally(() => {
      if (active) setDeliveryLoading(false);
    });
    return () => { active = false; };
  }, [workspaceId, t]);
  const groupedEvents = useMemo(() => {
    const buckets = new Map<string, NativeCalendarEvent[]>();
    events.forEach((event) => { const key = dayKey(event.startAt); buckets.set(key, [...(buckets.get(key) ?? []), event]); });
    return Array.from(buckets.entries()).map(([key, items]) => ({ key, label: dayLabel(items[0]?.startAt ?? key, language), items }));
  }, [events, language]);
  const hasActiveCalendarDeliveryTarget = deliveryTargets.some((target) => target.enabled);
  async function removeEvent(event: NativeCalendarEvent) {
    if (!workspaceId) return;
    if (!(await confirm({ title: t('Cancel this appointment?'), description: t('Lulu will retain the appointment as cancelled and send the cancellation to every selected external calendar.'), confirmLabel: t('Cancel appointment'), cancelLabel: t('Keep appointment'), tone: 'danger' }))) return;
    setActionBusy(true);
    try { const result = await calendarApi.deleteNativeEvent(workspaceId, event.id); setEvents((current) => current.map((item) => item.id === event.id ? result.data : item)); setNotice(t('Appointment cancelled.')); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, t('The appointment could not be cancelled.'))); }
    finally { setActionBusy(false); }
  }
  async function createGuestLink(event: NativeCalendarEvent) {
    if (!workspaceId) return;
    setActionBusy(true); setError(null);
    try { const result = await calendarApi.createGuestLink(workspaceId, event.id); const link = absoluteGuestLink(result.data.guestJoinPath); setCreatedLink(link); setEvents((current) => current.map((item) => item.id === event.id ? { ...item, guestJoinPath: link } : item)); setNotice(t('Guest link created.')); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, t('The guest link could not be created.'))); }
    finally { setActionBusy(false); }
  }
  if (appLoading || busy) return <main className="calendar-page calendar-page--center" role="status"><LoaderCircle className="spin" /><p>{t('Loading calendar…')}</p></main>;
  if (!workspaceId) return <main className="calendar-page calendar-page--center"><CircleAlert /><h1>{t('No workspace selected')}</h1><p>{t('Select a workspace before opening the calendar.')}</p></main>;
  return <main className="calendar-page">
    <header className="calendar-header calendar-header--modern"><div><p className="calendar-eyebrow">Lulu Intelligence / Calendar</p><h1>{t('Your calendar')}</h1><p>{t('Create meetings in Lulu, invite customers with a secure guest link, and deliver them to selected external calendars when needed.')}</p></div><div className="calendar-header__actions"><button type="button" className="calendar-button calendar-button--secondary" onClick={() => setShowDeliverySettings((current) => !current)}><PlugZap size={17} />{t('Calendar destinations')}</button><button type="button" className="calendar-button" disabled={!permissions.canEdit} onClick={() => setShowCreate(true)}><Plus size={17} />{t('New appointment')}</button></div></header>
    {error && <div className="calendar-alert calendar-alert--error" role="alert"><CircleAlert size={17} /><span>{error}</span><button type="button" onClick={() => setError(null)} aria-label={t('Close')}><X size={15} /></button></div>}
    {notice && <div className="calendar-alert calendar-alert--success" role="status"><Check size={17} /><span>{notice}</span><button type="button" onClick={() => setNotice(null)} aria-label={t('Close')}><X size={15} /></button></div>}
    {createdLink && <section className="calendar-share-card"><div><strong>{t('Guest meeting link ready')}</strong><p>{t('Share this link with your customer. They can join without creating a Lulu account.')}</p></div><div className="calendar-share-card__link"><Link2 size={16} /><span>{createdLink}</span><button type="button" onClick={() => { void navigator.clipboard?.writeText(absoluteGuestLink(createdLink)); setNotice(t('Link copied.')); }} aria-label={t('Copy link')}><Copy size={16} /></button></div><button type="button" className="calendar-share-card__close" onClick={() => setCreatedLink(null)} aria-label={t('Close')}><X size={16} /></button></section>}
    <section className="calendar-kpis calendar-kpis--modern"><article><span>{t('Upcoming appointments')}</span><strong>{events.filter((event) => event.status === 'scheduled' && new Date(event.endAt).getTime() >= Date.now()).length}</strong></article><article><span>{t('This week')}</span><strong>{events.filter((event) => { const at = new Date(event.startAt).getTime(); return at >= Date.now() && at < Date.now() + 7 * 86400000; }).length}</strong></article><article><span>{t('Calendar destinations')}</span><strong>{deliveryLoading ? '—' : deliveryTargets.filter((target) => target.enabled).length}</strong></article></section>
    {showDeliverySettings && <CalendarDeliverySettings workspaceId={workspaceId} canEdit={permissions.canEdit} loading={deliveryLoading} targets={deliveryTargets} onClose={() => setShowDeliverySettings(false)} onSaved={(target) => { setDeliveryTargets((current) => { const index = current.findIndex((item) => item.id === target.id); return index < 0 ? [target, ...current] : current.map((item) => item.id === target.id ? target : item); }); setNotice(target.enabled ? t('Calendar destination saved.') : t('Calendar destination saved as paused.')); }} onError={setError} />}
    <section className="calendar-toolbar"><label className="calendar-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('Search appointments')} /></label></section>
    <section className="calendar-timeline calendar-timeline--native">{!events.length && <div className="calendar-empty-state"><CalendarDays size={30} /><h2>{t('No appointments yet')}</h2><p>{t('Create your first appointment to start a customer meeting.')}</p>{permissions.canEdit && <button type="button" className="calendar-button" onClick={() => setShowCreate(true)}><Plus size={16} />{t('Create appointment')}</button>}</div>}{groupedEvents.map((group) => <article key={group.key} className="calendar-day"><header><h2>{group.label}</h2><span>{group.items.length} {t('appointments')}</span></header><div className="calendar-event-list">{group.items.map((event) => <div key={event.id} className={`calendar-event calendar-event--native status-${event.status}`}><div className="calendar-event__time"><strong>{dateLabel(event.startAt, language, { weekday: undefined })}</strong><span>{dateLabel(event.endAt, language, { weekday: undefined, day: undefined, month: undefined, year: undefined })}</span></div><div className="calendar-event__content"><div><h3>{event.title}</h3>{event.customerName && <p>{t('Customer')}: {event.customerName}</p>}{event.description && <p>{event.description}</p>}</div><div className="calendar-event__meta"><span><Video size={14} />{t('Agora meeting')}</span>{event.location && <span><MapPin size={14} />{event.location}</span>}<span>{event.timezone}</span></div>{event.status === 'scheduled' ? <div className="calendar-event__actions">{event.guestJoinPath ? <button type="button" onClick={() => { void navigator.clipboard?.writeText(event.guestJoinPath!); setCreatedLink(event.guestJoinPath); setNotice(t('Link copied.')); }}><Link2 size={14} />{t('Copy guest link')}</button> : <button type="button" disabled={actionBusy} onClick={() => void createGuestLink(event)}><Link2 size={14} />{t('Create guest link')}</button>}<button type="button" disabled={actionBusy} className="danger" onClick={() => void removeEvent(event)}><X size={14} />{t('Cancel')}</button></div> : <p className="calendar-event__delivery-note">{hasActiveCalendarDeliveryTarget ? t('Cancelled in Lulu and queued for selected external calendars.') : t('Cancelled in Lulu.')}</p>}</div></div>)}</div></article>)}</section>
    {showCreate && <CreateEventDialog workspaceId={workspaceId} customers={customers} busy={actionBusy} onClose={() => setShowCreate(false)} onError={setError} onCreated={(event, link) => { setEvents((current) => [...current, event].sort((a, b) => a.startAt.localeCompare(b.startAt))); setCreatedLink(link); setShowCreate(false); setNotice(t('Appointment created.')); }} />}
  </main>;
}

function CreateEventDialog({ workspaceId, customers, busy, onClose, onError, onCreated }: { workspaceId: string; customers: WorkspaceRecord[]; busy: boolean; onClose: () => void; onError: (value: string) => void; onCreated: (event: NativeCalendarEvent, link: string) => void }) {
  const t = useTranslation();
  const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [startAt, setStartAt] = useState(''); const [duration, setDuration] = useState('30'); const [location, setLocation] = useState(''); const [customerId, setCustomerId] = useState(''); const [saving, setSaving] = useState(false);
  async function submit() {
    const start = localDateTimeToIso(startAt); const startDate = start ? new Date(start) : null; const end = startDate ? new Date(startDate.getTime() + Number(duration) * 60_000).toISOString() : '';
    if (!title.trim() || !start || !end) { onError(t('Enter a title and date/time.')); return; }
    setSaving(true);
    try { const result = await calendarApi.createNativeEvent(workspaceId, { title: title.trim(), ...(description.trim() ? { description: description.trim() } : {}), startAt: start, endAt: end, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, ...(location.trim() ? { location: location.trim() } : {}), ...(customerId ? { customerId } : {}) }); onCreated(result.data, result.data.guestJoinPath); }
    catch (cause) { onError(getFriendlyErrorMessage(cause, t('The appointment could not be created.'))); }
    finally { setSaving(false); }
  }
  return createPortal(<div className="calendar-modal-backdrop"><section className="calendar-dialog calendar-dialog--modern" role="dialog" aria-modal="true" aria-labelledby="calendar-create-title"><header><div><p className="calendar-eyebrow">Lulu / Agora RTC</p><h2 id="calendar-create-title">{t('Create appointment')}</h2><p>{t('Customers join through a secure link without an account.')}</p></div><button type="button" onClick={onClose} aria-label={t('Close')}><X /></button></header><div className="calendar-form-grid"><label className="wide">{t('Customer (optional)')}<select value={customerId} onChange={(event) => setCustomerId(event.target.value)}><option value="">{t('No customer selected')}</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label><label className="wide">{t('Title')}<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t('Product consultation')} /></label><label className="wide">{t('Date and time')}<input type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} /></label><label>{t('Duration')}<select value={duration} onChange={(event) => setDuration(event.target.value)}><option value="15">15 {t('minutes')}</option><option value="30">30 {t('minutes')}</option><option value="60">60 {t('minutes')}</option><option value="120">2 {t('hours')}</option></select></label><label>{t('Location (optional)')}<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder={t('Agora video meeting')} /></label><label className="wide">{t('Description (optional)')}<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} /></label></div><footer><button type="button" className="calendar-button calendar-button--secondary" onClick={onClose}>{t('Cancel')}</button><button type="button" className="calendar-button" disabled={busy || saving} onClick={() => void submit()}>{saving ? <LoaderCircle className="spin" size={16} /> : <Plus size={16} />}{t('Create appointment')}</button></footer></section></div>, document.body);
}

const defaultCreateArguments = JSON.stringify({
  title: '{{event.title}}',
  description: '{{event.description}}',
  start_at: '{{event.startAt}}',
  end_at: '{{event.endAt}}',
  timezone: '{{event.timezone}}',
  location: '{{event.location}}',
}, null, 2);
const defaultUpdateArguments = JSON.stringify({
  event_id: '{{externalEvent.id}}',
  title: '{{event.title}}',
  description: '{{event.description}}',
  start_at: '{{event.startAt}}',
  end_at: '{{event.endAt}}',
  timezone: '{{event.timezone}}',
  location: '{{event.location}}',
}, null, 2);
const defaultCancelArguments = JSON.stringify({ event_id: '{{externalEvent.id}}' }, null, 2);
const deliveryTemplateTokens = ['event.title', 'event.description', 'event.startAt', 'event.endAt', 'event.timezone', 'event.location', 'event.guestJoinUrl', 'externalEvent.id']
  .map((token) => `{{${token}}}`).join(' · ');

type DeliveryOperation = CalendarDeliveryCandidate['operations'][number];
type CalendarDeliveryToken = 'event.title' | 'event.description' | 'event.startAt' | 'event.endAt' | 'event.timezone' | 'event.location' | 'event.guestJoinUrl' | 'externalEvent.id';
type GuidedAssignments = Partial<Record<CalendarDeliveryToken, string>>;

const mappingFields: Array<{ token: CalendarDeliveryToken; label: string; operations: DeliveryOperation[]; required: boolean }> = [
  { token: 'event.title', label: 'Appointment title', operations: ['CREATE', 'UPDATE'], required: true },
  { token: 'event.startAt', label: 'Start time', operations: ['CREATE', 'UPDATE'], required: true },
  { token: 'event.endAt', label: 'End time', operations: ['CREATE', 'UPDATE'], required: true },
  { token: 'event.description', label: 'Description', operations: ['CREATE', 'UPDATE'], required: false },
  { token: 'event.timezone', label: 'Time zone', operations: ['CREATE', 'UPDATE'], required: false },
  { token: 'event.location', label: 'Location', operations: ['CREATE', 'UPDATE'], required: false },
  { token: 'event.guestJoinUrl', label: 'Guest meeting link', operations: ['CREATE', 'UPDATE'], required: false },
  { token: 'externalEvent.id', label: 'External appointment ID', operations: ['UPDATE', 'CANCEL'], required: true },
];

const providerFieldAliases: Record<CalendarDeliveryToken, string[]> = {
  'event.title': ['title', 'summary', 'name', 'subject', 'event_title'],
  'event.description': ['description', 'body', 'notes', 'details'],
  'event.startAt': ['start', 'start_at', 'start_time', 'starts_at', 'start_datetime', 'start_date_time'],
  'event.endAt': ['end', 'end_at', 'end_time', 'ends_at', 'end_datetime', 'end_date_time'],
  'event.timezone': ['timezone', 'time_zone', 'tz'],
  'event.location': ['location', 'place', 'address'],
  'event.guestJoinUrl': ['join_url', 'meeting_url', 'conference_url', 'video_url', 'guest_url'],
  'externalEvent.id': ['event_id', 'calendar_event_id', 'id'],
};

function normalizeProviderField(value: string) {
  return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function inputFieldNames(candidate: CalendarDeliveryCandidate | undefined) {
  const properties = candidate?.inputParameters?.properties;
  if (!properties || typeof properties !== 'object' || Array.isArray(properties)) return [];
  return Object.keys(properties).sort((left, right) => left.localeCompare(right));
}

function preferredProviderField(candidate: CalendarDeliveryCandidate | undefined, token: CalendarDeliveryToken) {
  const aliases = new Set(providerFieldAliases[token].map(normalizeProviderField));
  return inputFieldNames(candidate).find((field) => aliases.has(normalizeProviderField(field))) ?? '';
}

function assignmentsFromArguments(argumentsTemplate: Record<string, unknown> | undefined): GuidedAssignments {
  if (!argumentsTemplate) return {};
  const assignments: GuidedAssignments = {};
  for (const [providerField, value] of Object.entries(argumentsTemplate)) {
    if (typeof value !== 'string') continue;
    const match = /^{{\s*(event\.(?:title|description|startAt|endAt|timezone|location|guestJoinUrl)|externalEvent\.id)\s*}}$/.exec(value);
    if (match) assignments[match[1] as CalendarDeliveryToken] = providerField;
  }
  return assignments;
}

function isGuidedArgumentsTemplate(argumentsTemplate: Record<string, unknown> | undefined) {
  if (!argumentsTemplate) return true;
  return Object.values(argumentsTemplate).every((value) => typeof value === 'string' && /^{{\s*(event\.(?:title|description|startAt|endAt|timezone|location|guestJoinUrl)|externalEvent\.id)\s*}}$/.test(value));
}

function hydrateAssignments(current: GuidedAssignments, candidate: CalendarDeliveryCandidate | undefined, operation: DeliveryOperation) {
  if (!candidate) return current;
  const allowedFields = new Set(inputFieldNames(candidate));
  const next: GuidedAssignments = {};
  for (const field of mappingFields.filter((item) => item.operations.includes(operation))) {
    const existing = current[field.token];
    next[field.token] = existing && allowedFields.has(existing) ? existing : preferredProviderField(candidate, field.token);
  }
  return next;
}

function argumentsFromAssignments(assignments: GuidedAssignments, operation: DeliveryOperation) {
  return Object.fromEntries(mappingFields
    .filter((field) => field.operations.includes(operation) && assignments[field.token])
    .map((field) => [assignments[field.token]!, `{{${field.token}}}`]));
}

function hasCompleteGuidedMapping(assignments: GuidedAssignments, candidate: CalendarDeliveryCandidate | undefined, operation: DeliveryOperation) {
  const allowedFields = new Set(inputFieldNames(candidate));
  return mappingFields
    .filter((field) => field.operations.includes(operation) && field.required)
    .every((field) => Boolean(assignments[field.token]) && allowedFields.has(assignments[field.token]!));
}

function prettyJson(value: Record<string, unknown>) {
  return JSON.stringify(value, null, 2);
}

function deliveryToolLabel(target: CalendarDeliveryTarget) {
  return `${target.createToolSlug} · ${target.updateToolSlug} · ${target.cancelToolSlug}`;
}

function toolInputFieldSummary(candidate: CalendarDeliveryCandidate | undefined) {
  const properties = candidate?.inputParameters?.properties;
  if (!properties || typeof properties !== 'object' || Array.isArray(properties)) return '';
  return Object.keys(properties).slice(0, 12).join(' · ');
}

function CalendarDeliverySettings({ workspaceId, canEdit, loading, targets, onClose, onSaved, onError }: {
  workspaceId: string;
  canEdit: boolean;
  loading: boolean;
  targets: CalendarDeliveryTarget[];
  onClose: () => void;
  onSaved: (target: CalendarDeliveryTarget) => void;
  onError: (value: string) => void;
}) {
  const t = useTranslation();
  const [editing, setEditing] = useState<CalendarDeliveryTarget | null | undefined>(undefined);

  return <section className="calendar-delivery-settings" aria-labelledby="calendar-delivery-title">
    <header className="calendar-delivery-settings__header"><div><p className="calendar-eyebrow">Lulu / Composio</p><h2 id="calendar-delivery-title">{t('Calendar destinations')}</h2><p>{t('Lulu remains the source of truth. Each selected destination receives the same appointment, update, or cancellation with a durable delivery record.')}</p></div><div className="calendar-delivery-settings__actions">{canEdit && <button type="button" className="calendar-button" onClick={() => setEditing(null)}><Plus size={16} />{t('Add destination')}</button>}<button type="button" className="calendar-button calendar-button--secondary" onClick={onClose}>{t('Close')}</button></div></header>
    {loading ? <div className="calendar-delivery-settings__empty"><LoaderCircle className="spin" size={18} />{t('Loading calendar destinations…')}</div> : !targets.length ? <div className="calendar-delivery-settings__empty"><PlugZap size={22} /><div><strong>{t('No external calendar selected')}</strong><p>{t('Connect a calendar application with Composio, then choose the create, update, and cancellation actions for that calendar here.')}</p></div></div> : <div className="calendar-delivery-target-list">{targets.map((target) => <article key={target.id} className="calendar-delivery-target"><div className="calendar-delivery-target__icon"><CalendarDays size={18} /></div><div className="calendar-delivery-target__copy"><div><strong>{target.targetName}</strong><span className={target.enabled ? 'calendar-delivery-status is-active' : 'calendar-delivery-status'}>{target.enabled ? t('Active') : t('Paused')}</span></div><p>{target.enabled ? t('New appointments, changes, and cancellations are delivered to this selected calendar.') : t('This destination is kept as configuration only and will not receive appointments.')}</p><small title={deliveryToolLabel(target)}>{t('Configured actions')}: {target.createToolSlug}, {target.updateToolSlug}, {target.cancelToolSlug}</small></div>{canEdit && <button type="button" className="calendar-button calendar-button--secondary calendar-delivery-target__edit" onClick={() => setEditing(target)}><Settings2 size={15} />{t('Edit')}</button>}</article>)}</div>}
    {editing !== undefined && <CalendarDeliveryTargetDialog workspaceId={workspaceId} target={editing ?? null} onClose={() => setEditing(undefined)} onSaved={(target) => { onSaved(target); setEditing(undefined); }} onError={onError} />}
  </section>;
}

function CalendarDeliveryTargetDialog({ workspaceId, target, onClose, onSaved, onError }: {
  workspaceId: string;
  target: CalendarDeliveryTarget | null;
  onClose: () => void;
  onSaved: (target: CalendarDeliveryTarget) => void;
  onError: (value: string) => void;
}) {
  const t = useTranslation();
  const [teams, setTeams] = useState<ComposioIntegrationTeam[]>([]);
  const [candidates, setCandidates] = useState<CalendarDeliveryCandidate[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [targetName, setTargetName] = useState(target?.targetName ?? '');
  const [teamId, setTeamId] = useState(target?.integrationTeamId ?? '');
  const [enabled, setEnabled] = useState(target?.enabled ?? true);
  const [createToolSlug, setCreateToolSlug] = useState(target?.createToolSlug ?? '');
  const [updateToolSlug, setUpdateToolSlug] = useState(target?.updateToolSlug ?? '');
  const [cancelToolSlug, setCancelToolSlug] = useState(target?.cancelToolSlug ?? '');
  const [createArguments, setCreateArguments] = useState(target ? prettyJson(target.createArguments) : defaultCreateArguments);
  const [updateArguments, setUpdateArguments] = useState(target ? prettyJson(target.updateArguments) : defaultUpdateArguments);
  const [cancelArguments, setCancelArguments] = useState(target ? prettyJson(target.cancelArguments) : defaultCancelArguments);
  const [createResultEventIdPath, setCreateResultEventIdPath] = useState(target?.createResultEventIdPath ?? 'id');
  const [createAssignments, setCreateAssignments] = useState<GuidedAssignments>(() => assignmentsFromArguments(target?.createArguments));
  const [updateAssignments, setUpdateAssignments] = useState<GuidedAssignments>(() => assignmentsFromArguments(target?.updateArguments));
  const [cancelAssignments, setCancelAssignments] = useState<GuidedAssignments>(() => assignmentsFromArguments(target?.cancelArguments));
  const [mappingMode, setMappingMode] = useState<'guided' | 'advanced'>(() => target && ![target.createArguments, target.updateArguments, target.cancelArguments].every(isGuidedArgumentsTemplate) ? 'advanced' : 'guided');

  useEffect(() => {
    let active = true;
    void composioApi.teams(workspaceId, { limit: 100 }).then((result) => {
      if (active) setTeams(result.data.items.filter((team) => team.status === 'ACTIVE'));
    }).catch((cause) => {
      if (active) setFormError(getFriendlyErrorMessage(cause, t('Connected applications could not be loaded.')));
    }).finally(() => { if (active) setLoadingTeams(false); });
    return () => { active = false; };
  }, [workspaceId, t]);

  useEffect(() => {
    if (!teamId) { setCandidates([]); return; }
    let active = true;
    setLoadingCandidates(true);
    void calendarApi.deliveryTargetCandidates(workspaceId, teamId).then((result) => {
      if (active) setCandidates(result.data.items);
    }).catch((cause) => {
      if (active) setFormError(getFriendlyErrorMessage(cause, t('Calendar actions could not be loaded for this application.')));
    }).finally(() => { if (active) setLoadingCandidates(false); });
    return () => { active = false; };
  }, [workspaceId, teamId, t]);

  useEffect(() => {
    if (!candidates.length) return;
    setCreateAssignments((current) => hydrateAssignments(current, candidates.find((candidate) => candidate.slug === createToolSlug), 'CREATE'));
    setUpdateAssignments((current) => hydrateAssignments(current, candidates.find((candidate) => candidate.slug === updateToolSlug), 'UPDATE'));
    setCancelAssignments((current) => hydrateAssignments(current, candidates.find((candidate) => candidate.slug === cancelToolSlug), 'CANCEL'));
  }, [candidates, createToolSlug, updateToolSlug, cancelToolSlug]);

  const toolsFor = (operation: CalendarDeliveryCandidate['operations'][number]) => candidates.filter((candidate) => candidate.operations.includes(operation));
  const selectedTool = (slug: string) => candidates.find((candidate) => candidate.slug === slug);
  const toolHint = (slug: string) => {
    const candidate = selectedTool(slug);
    const parts = [candidate?.description, toolInputFieldSummary(candidate)].filter((value): value is string => Boolean(value));
    return parts.length ? <small>{parts.join(' · ')}</small> : null;
  };
  function updateTeam(value: string) {
    setTeamId(value);
    if (value !== target?.integrationTeamId) {
      setCreateToolSlug(''); setUpdateToolSlug(''); setCancelToolSlug('');
      setCreateAssignments({}); setUpdateAssignments({}); setCancelAssignments({});
      setMappingMode('guided');
    }
    setFormError(null);
  }
  function updateTool(operation: DeliveryOperation, slug: string) {
    const candidate = selectedTool(slug);
    if (operation === 'CREATE') {
      setCreateToolSlug(slug);
      setCreateAssignments((current) => hydrateAssignments(current, candidate, operation));
    } else if (operation === 'UPDATE') {
      setUpdateToolSlug(slug);
      setUpdateAssignments((current) => hydrateAssignments(current, candidate, operation));
    } else {
      setCancelToolSlug(slug);
      setCancelAssignments((current) => hydrateAssignments(current, candidate, operation));
    }
    setFormError(null);
  }
  function parseArguments(value: string) {
    try {
      const parsed: unknown = JSON.parse(value);
      return parsed && !Array.isArray(parsed) && typeof parsed === 'object' ? parsed as Record<string, unknown> : null;
    } catch {
      return null;
    }
  }
  const createCandidate = selectedTool(createToolSlug);
  const updateCandidate = selectedTool(updateToolSlug);
  const cancelCandidate = selectedTool(cancelToolSlug);
  const guidedMappingComplete = hasCompleteGuidedMapping(createAssignments, createCandidate, 'CREATE')
    && hasCompleteGuidedMapping(updateAssignments, updateCandidate, 'UPDATE')
    && hasCompleteGuidedMapping(cancelAssignments, cancelCandidate, 'CANCEL');
  function useAdvancedMapping(next: boolean) {
    if (next) {
      setCreateArguments(prettyJson(argumentsFromAssignments(createAssignments, 'CREATE')));
      setUpdateArguments(prettyJson(argumentsFromAssignments(updateAssignments, 'UPDATE')));
      setCancelArguments(prettyJson(argumentsFromAssignments(cancelAssignments, 'CANCEL')));
      setMappingMode('advanced');
      return;
    }
    const parsedCreate = parseArguments(createArguments);
    const parsedUpdate = parseArguments(updateArguments);
    const parsedCancel = parseArguments(cancelArguments);
    if (!parsedCreate || !parsedUpdate || !parsedCancel || ![parsedCreate, parsedUpdate, parsedCancel].every(isGuidedArgumentsTemplate)) {
      setFormError(t('This custom mapping uses values that cannot be shown in the guided setup. Keep advanced mapping enabled to preserve it.'));
      return;
    }
    setCreateAssignments(assignmentsFromArguments(parsedCreate));
    setUpdateAssignments(assignmentsFromArguments(parsedUpdate));
    setCancelAssignments(assignmentsFromArguments(parsedCancel));
    setMappingMode('guided');
  }
  function GuidedMapping({ operation, candidate, assignments, onChange }: {
    operation: DeliveryOperation;
    candidate: CalendarDeliveryCandidate | undefined;
    assignments: GuidedAssignments;
    onChange: (token: CalendarDeliveryToken, providerField: string) => void;
  }) {
    const providerFields = inputFieldNames(candidate);
    const title = operation === 'CREATE' ? t('Create appointment mapping') : operation === 'UPDATE' ? t('Update appointment mapping') : t('Cancellation mapping');
    const fields = mappingFields.filter((field) => field.operations.includes(operation));
    if (!candidate) return <section className="wide calendar-guided-mapping calendar-guided-mapping--waiting"><strong>{title}</strong><p>{t('Choose an action above to see its provider fields.')}</p></section>;
    if (!providerFields.length) return <section className="wide calendar-guided-mapping calendar-guided-mapping--warning"><strong>{title}</strong><p>{t('This action does not expose editable provider fields. Use advanced mapping only if you know this provider’s contract.')}</p></section>;
    return <section className="wide calendar-guided-mapping" aria-label={title}><header><div><strong>{title}</strong><p>{t('Lulu preselects likely provider fields. Review the required fields before saving.')}</p></div><span>{t('Guided setup')}</span></header><div className="calendar-guided-mapping__fields">{fields.map((field) => {
      const occupied = new Set(Object.entries(assignments).filter(([token, value]) => token !== field.token && Boolean(value)).map(([, value]) => value));
      return <label key={field.token}><span><strong>{t(field.label)}</strong><small>{field.required ? t('Required') : t('Optional')}</small></span><select value={assignments[field.token] ?? ''} onChange={(event) => onChange(field.token, event.target.value)}><option value="">{t('Choose a provider field')}</option>{providerFields.map((providerField) => <option key={providerField} value={providerField} disabled={occupied.has(providerField)}>{providerField}</option>)}</select></label>;
    })}</div></section>;
  }
  const canSave = Boolean(
    targetName.trim()
    && teamId
    && createToolSlug
    && updateToolSlug
    && cancelToolSlug
    && createResultEventIdPath.trim()
    && (mappingMode === 'advanced'
      ? parseArguments(createArguments) && parseArguments(updateArguments) && parseArguments(cancelArguments)
      : guidedMappingComplete),
  );
  async function save() {
    if (!targetName.trim() || !teamId || !createToolSlug || !updateToolSlug || !cancelToolSlug || !createResultEventIdPath.trim()) {
      setFormError(t('Complete every destination and action before saving.'));
      return;
    }
    const parsedCreateArguments = mappingMode === 'advanced' ? parseArguments(createArguments) : argumentsFromAssignments(createAssignments, 'CREATE');
    const parsedUpdateArguments = mappingMode === 'advanced' ? parseArguments(updateArguments) : argumentsFromAssignments(updateAssignments, 'UPDATE');
    const parsedCancelArguments = mappingMode === 'advanced' ? parseArguments(cancelArguments) : argumentsFromAssignments(cancelAssignments, 'CANCEL');
    if (!parsedCreateArguments || !parsedUpdateArguments || !parsedCancelArguments) {
      setFormError(mappingMode === 'advanced' ? t('Enter a valid JSON object for every action mapping.') : t('Map every required appointment value before saving.'));
      return;
    }
    try {
      const body: CalendarDeliveryTargetInput = {
        targetName: targetName.trim(), integrationTeamId: teamId, enabled,
        createToolSlug, createArguments: parsedCreateArguments, createResultEventIdPath: createResultEventIdPath.trim(),
        updateToolSlug, updateArguments: parsedUpdateArguments,
        cancelToolSlug, cancelArguments: parsedCancelArguments,
      };
      setSaving(true); setFormError(null);
      const result = target ? await calendarApi.updateDeliveryTarget(workspaceId, target.id, body) : await calendarApi.createDeliveryTarget(workspaceId, body);
      onSaved(result.data);
    } catch (cause) {
      const message = getFriendlyErrorMessage(cause, t('The calendar destination could not be saved.'));
      setFormError(message);
      onError(message);
    } finally { setSaving(false); }
  }

  return createPortal(<div className="calendar-modal-backdrop">
    <section className="calendar-dialog calendar-dialog--modern calendar-delivery-dialog" role="dialog" aria-modal="true" aria-labelledby="calendar-delivery-dialog-title">
      <header><div><p className="calendar-eyebrow">Lulu / Composio</p><h2 id="calendar-delivery-dialog-title">{target ? t('Edit calendar destination') : t('Add calendar destination')}</h2><p>{t('Choose one connected calendar and map the three safe lifecycle actions. Lulu will keep one canonical appointment and stores delivery evidence for every external calendar.')}</p></div><button type="button" onClick={onClose} aria-label={t('Close')}><X /></button></header>
      {formError && <div className="calendar-alert calendar-alert--error" role="alert"><CircleAlert size={16} /><span>{formError}</span></div>}
      <div className="calendar-form-grid calendar-delivery-dialog__form">
        <label className="wide">{t('Destination name')}<input autoFocus value={targetName} onChange={(event) => setTargetName(event.target.value)} placeholder={t('e.g. Sales calendar')} /></label>
        <label className="wide">{t('Connected calendar application')}<select value={teamId} disabled={loadingTeams} onChange={(event) => updateTeam(event.target.value)}><option value="">{loadingTeams ? t('Loading connected applications…') : t('Choose a connected application')}</option>{teams.map((team) => <option key={team.id} value={team.id}>{team.teamName} · {team.composioToolkit}</option>)}</select></label>
        {!loadingTeams && !teams.length && <p className="wide calendar-delivery-dialog__hint">{t('No active calendar application is connected yet. Connect one in the Integrations area, then return here.')}</p>}
        {teamId && <>
          <label>{t('Create appointment action')}<select value={createToolSlug} disabled={loadingCandidates} onChange={(event) => updateTool('CREATE', event.target.value)}><option value="">{loadingCandidates ? t('Loading actions…') : t('Choose create action')}</option>{toolsFor('CREATE').map((tool) => <option key={tool.slug} value={tool.slug}>{tool.name}</option>)}</select>{toolHint(createToolSlug)}</label>
          <label>{t('Update appointment action')}<select value={updateToolSlug} disabled={loadingCandidates} onChange={(event) => updateTool('UPDATE', event.target.value)}><option value="">{loadingCandidates ? t('Loading actions…') : t('Choose update action')}</option>{toolsFor('UPDATE').map((tool) => <option key={tool.slug} value={tool.slug}>{tool.name}</option>)}</select>{toolHint(updateToolSlug)}</label>
          <label className="wide">{t('Cancel appointment action')}<select value={cancelToolSlug} disabled={loadingCandidates} onChange={(event) => updateTool('CANCEL', event.target.value)}><option value="">{loadingCandidates ? t('Loading actions…') : t('Choose cancellation action')}</option>{toolsFor('CANCEL').map((tool) => <option key={tool.slug} value={tool.slug}>{tool.name}</option>)}</select>{toolHint(cancelToolSlug)}</label>
          <section className="wide calendar-mapping-mode"><div><strong>{mappingMode === 'guided' ? t('Guided setup') : t('Advanced mapping')}</strong><span>{mappingMode === 'guided' ? t('Recommended') : t('Custom')}</span><p>{mappingMode === 'guided' ? t('Choose provider fields instead of writing JSON. Lulu checks the required appointment values before saving.') : t('Use advanced JSON only when this provider needs a custom nested payload. Lulu verifies every template before it is saved.')}</p></div><button type="button" className="calendar-button calendar-button--secondary" onClick={() => useAdvancedMapping(mappingMode !== 'advanced')}>{mappingMode === 'guided' ? t('Switch to advanced JSON') : t('Use guided setup')}</button></section>
          {mappingMode === 'advanced' ? <>
            <div className="wide calendar-delivery-dialog__mapping-guide"><strong>{t('Action mapping')}</strong><p>{t('Match the selected application’s field names to Lulu’s appointment values. These values are resolved only when Lulu delivers a confirmed appointment.')}</p><code>{deliveryTemplateTokens}</code></div>
            <label className="wide">{t('Create mapping')}<textarea rows={8} value={createArguments} spellCheck={false} onChange={(event) => setCreateArguments(event.target.value)} /></label>
            <label className="wide">{t('Provider event ID path')}<input value={createResultEventIdPath} onChange={(event) => setCreateResultEventIdPath(event.target.value)} placeholder="id" /><small>{t('The result path that identifies the event created by the external calendar, for example “id” or “event.id”.')}</small></label>
            <label className="wide">{t('Update mapping')}<textarea rows={8} value={updateArguments} spellCheck={false} onChange={(event) => setUpdateArguments(event.target.value)} /></label>
            <label className="wide">{t('Cancellation mapping')}<textarea rows={5} value={cancelArguments} spellCheck={false} onChange={(event) => setCancelArguments(event.target.value)} /></label>
          </> : <>
            <GuidedMapping operation="CREATE" candidate={createCandidate} assignments={createAssignments} onChange={(token, providerField) => setCreateAssignments((current) => ({ ...current, [token]: providerField }))} />
            <GuidedMapping operation="UPDATE" candidate={updateCandidate} assignments={updateAssignments} onChange={(token, providerField) => setUpdateAssignments((current) => ({ ...current, [token]: providerField }))} />
            <GuidedMapping operation="CANCEL" candidate={cancelCandidate} assignments={cancelAssignments} onChange={(token, providerField) => setCancelAssignments((current) => ({ ...current, [token]: providerField }))} />
          </>}
        </>}
        <label className="wide calendar-delivery-dialog__toggle"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /> <span><strong>{t('Activate this destination')}</strong><small>{t('When disabled, Lulu retains the setup but sends no appointments to this external calendar.')}</small></span></label>
      </div>
      <footer><button type="button" className="calendar-button calendar-button--secondary" onClick={onClose}>{t('Cancel')}</button><button type="button" className="calendar-button" disabled={saving || loadingTeams || loadingCandidates || !canSave} onClick={() => void save()}>{saving ? <LoaderCircle className="spin" size={16} /> : <Check size={16} />}{t('Save destination')}</button></footer>
    </section>
  </div>, document.body);
}
