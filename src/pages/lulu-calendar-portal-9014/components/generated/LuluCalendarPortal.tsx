import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, CircleAlert, Copy, Link2, LoaderCircle, MapPin, Plus, Search, Trash2, Video, X } from 'lucide-react';
import { calendarApi, type NativeCalendarEvent } from '../../../../api/calendar';
import { listRecords, type WorkspaceRecord } from '../../../../api/records';
import { getFriendlyErrorMessage } from '../../../../api/client';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { useLanguage, useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
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

  const loadEvents = useCallback(async () => {
    if (!workspaceId) return;
    const [result, customerResult] = await Promise.all([
      calendarApi.nativeEvents(workspaceId, { ...(query.trim() ? { q: query.trim() } : {}), limit: 300 }),
      // The records API caps a single page at 100 items.  Requesting 200
      // previously returned 422 and caused Promise.all to hide the otherwise
      // healthy calendar response behind a misleading calendar error.
      listRecords('customers', 'limit=100'),
    ]);
    setEvents(result.data.items);
    setCustomers(customerResult.data.items);
  }, [workspaceId, query]);
  useEffect(() => {
    if (!workspaceId) { if (!appLoading) setBusy(false); return; }
    let active = true; setBusy(true); setError(null);
    loadEvents().catch((cause) => { if (active) setError(getFriendlyErrorMessage(cause, t('Calendar could not be loaded.'))); }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [workspaceId, appLoading, loadEvents, t]);
  const groupedEvents = useMemo(() => {
    const buckets = new Map<string, NativeCalendarEvent[]>();
    events.forEach((event) => { const key = dayKey(event.startAt); buckets.set(key, [...(buckets.get(key) ?? []), event]); });
    return Array.from(buckets.entries()).map(([key, items]) => ({ key, label: dayLabel(items[0]?.startAt ?? key, language), items }));
  }, [events, language]);
  async function removeEvent(event: NativeCalendarEvent) {
    if (!workspaceId || !window.confirm(t('Delete this appointment?'))) return;
    setActionBusy(true);
    try { await calendarApi.deleteNativeEvent(workspaceId, event.id); setEvents((current) => current.filter((item) => item.id !== event.id)); setNotice(t('Appointment deleted.')); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, t('The appointment could not be deleted.'))); }
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
    <header className="calendar-header calendar-header--modern"><div><p className="calendar-eyebrow">Lulu Intelligence / Calendar</p><h1>{t('Your calendar')}</h1><p>{t('Create meetings in Lulu and invite customers with a secure guest link. No external calendar account is required.')}</p></div><div className="calendar-header__actions"><button type="button" className="calendar-button" disabled={!permissions.canEdit} onClick={() => setShowCreate(true)}><Plus size={17} />{t('New appointment')}</button></div></header>
    {error && <div className="calendar-alert calendar-alert--error" role="alert"><CircleAlert size={17} /><span>{error}</span><button type="button" onClick={() => setError(null)} aria-label={t('Close')}><X size={15} /></button></div>}
    {notice && <div className="calendar-alert calendar-alert--success" role="status"><Check size={17} /><span>{notice}</span><button type="button" onClick={() => setNotice(null)} aria-label={t('Close')}><X size={15} /></button></div>}
    {createdLink && <section className="calendar-share-card"><div><strong>{t('Guest meeting link ready')}</strong><p>{t('Share this link with your customer. They can join without creating a Lulu account.')}</p></div><div className="calendar-share-card__link"><Link2 size={16} /><span>{createdLink}</span><button type="button" onClick={() => { void navigator.clipboard?.writeText(absoluteGuestLink(createdLink)); setNotice(t('Link copied.')); }} aria-label={t('Copy link')}><Copy size={16} /></button></div><button type="button" className="calendar-share-card__close" onClick={() => setCreatedLink(null)} aria-label={t('Close')}><X size={16} /></button></section>}
    <section className="calendar-kpis calendar-kpis--modern"><article><span>{t('Upcoming appointments')}</span><strong>{events.filter((event) => event.status === 'scheduled' && new Date(event.endAt).getTime() >= Date.now()).length}</strong></article><article><span>{t('This week')}</span><strong>{events.filter((event) => { const at = new Date(event.startAt).getTime(); return at >= Date.now() && at < Date.now() + 7 * 86400000; }).length}</strong></article><article><span>{t('Meeting access')}</span><strong>{t('Guest links')}</strong></article></section>
    <section className="calendar-toolbar"><label className="calendar-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('Search appointments')} /></label></section>
    <section className="calendar-timeline calendar-timeline--native">{!events.length && <div className="calendar-empty-state"><CalendarDays size={30} /><h2>{t('No appointments yet')}</h2><p>{t('Create your first appointment to start a customer meeting.')}</p>{permissions.canEdit && <button type="button" className="calendar-button" onClick={() => setShowCreate(true)}><Plus size={16} />{t('Create appointment')}</button>}</div>}{groupedEvents.map((group) => <article key={group.key} className="calendar-day"><header><h2>{group.label}</h2><span>{group.items.length} {t('appointments')}</span></header><div className="calendar-event-list">{group.items.map((event) => <div key={event.id} className={`calendar-event calendar-event--native status-${event.status}`}><div className="calendar-event__time"><strong>{dateLabel(event.startAt, language, { weekday: undefined })}</strong><span>{dateLabel(event.endAt, language, { weekday: undefined, day: undefined, month: undefined, year: undefined })}</span></div><div className="calendar-event__content"><div><h3>{event.title}</h3>{event.customerName && <p>{t('Customer')}: {event.customerName}</p>}{event.description && <p>{event.description}</p>}</div><div className="calendar-event__meta"><span><Video size={14} />{t('Agora meeting')}</span>{event.location && <span><MapPin size={14} />{event.location}</span>}<span>{event.timezone}</span></div><div className="calendar-event__actions">{event.guestJoinPath ? <button type="button" onClick={() => { void navigator.clipboard?.writeText(event.guestJoinPath!); setCreatedLink(event.guestJoinPath); setNotice(t('Link copied.')); }}><Link2 size={14} />{t('Copy guest link')}</button> : <button type="button" disabled={actionBusy} onClick={() => void createGuestLink(event)}><Link2 size={14} />{t('Create guest link')}</button>}<button type="button" disabled={actionBusy} className="danger" onClick={() => void removeEvent(event)}><Trash2 size={14} />{t('Delete')}</button></div></div></div>)}</div></article>)}</section>
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
  return <div className="calendar-modal-backdrop"><section className="calendar-dialog calendar-dialog--modern" role="dialog" aria-modal="true" aria-labelledby="calendar-create-title"><header><div><p className="calendar-eyebrow">Lulu / Agora RTC</p><h2 id="calendar-create-title">{t('Create appointment')}</h2><p>{t('Customers join through a secure link without an account.')}</p></div><button type="button" onClick={onClose} aria-label={t('Close')}><X /></button></header><div className="calendar-form-grid"><label className="wide">{t('Customer (optional)')}<select value={customerId} onChange={(event) => setCustomerId(event.target.value)}><option value="">{t('No customer selected')}</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label><label className="wide">{t('Title')}<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t('Product consultation')} /></label><label className="wide">{t('Date and time')}<input type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} /></label><label>{t('Duration')}<select value={duration} onChange={(event) => setDuration(event.target.value)}><option value="15">15 {t('minutes')}</option><option value="30">30 {t('minutes')}</option><option value="60">60 {t('minutes')}</option><option value="120">2 {t('hours')}</option></select></label><label>{t('Location (optional)')}<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder={t('Agora video meeting')} /></label><label className="wide">{t('Description (optional)')}<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} /></label></div><footer><button type="button" className="calendar-button calendar-button--secondary" onClick={onClose}>{t('Cancel')}</button><button type="button" className="calendar-button" disabled={busy || saving} onClick={() => void submit()}>{saving ? <LoaderCircle className="spin" size={16} /> : <Plus size={16} />}{t('Create appointment')}</button></footer></section></div>;
}
