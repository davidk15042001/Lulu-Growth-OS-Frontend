import { useEffect, useState, type ReactNode } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, Headphones, Inbox, MessageSquare, Plus, RefreshCw, Send } from 'lucide-react';
import { useLuluApp } from '../../api/LuluAppContext';
import { requestApi, getFriendlyErrorMessage } from '../../api/client';
import { WorkspaceSurfaceShell } from '../../components/WorkspaceSurfaceShell';
import { useTranslation } from '../../i18n/GlobalLanguageSwitcher';

type Ticket = { id: string; subject: string; status: string; workspaceId: string; workspaceName?: string };
type Detail = { ticket: Ticket; messages: { id: string; authorType: string; body: string; createdAt: string }[] };

export default function SupportPage({ admin = false }: { admin?: boolean }) {
  const { selectedWorkspace, currentUser } = useLuluApp();
  const base = admin ? '/admin/support' : selectedWorkspace ? `/workspaces/${selectedWorkspace.id}/support` : null;
  const inbox = <SupportInbox key={base} base={base} admin={admin} canReply={!admin || Boolean(currentUser?.adminCapabilities?.includes('support.manage'))} />;
  return admin ? inbox : <WorkspaceSurfaceShell activeSlug="support">{inbox}</WorkspaceSurfaceShell>;
}

function Surface({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[22px] border border-[var(--border)] bg-white/90 shadow-[0_18px_45px_rgba(38,45,90,.08)] ${className}`}>{children}</section>;
}

function SupportInbox({ base, admin, canReply }: { base: string | null; admin: boolean; canReply: boolean }) {
  const t = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [offset, setOffset] = useState(0);
  const [messageOffset, setMessageOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!base) { setLoading(false); return; }
    setLoading(true); setError('');
    try { setTickets((await requestApi<{ tickets: Ticket[] }>({ path: `${base}?limit=50&offset=${offset}` })).data.tickets); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, t('Support could not be loaded.'))); }
    finally { setLoading(false); }
  }

  async function open(id: string, page = 0) {
    if (!base) return;
    setDetail(null); setReply(''); setBusy(true);
    try { setDetail((await requestApi<Detail>({ path: `${base}/${id}?limit=100&offset=${page}` })).data); setMessageOffset(page); }
    catch (cause) { setError(getFriendlyErrorMessage(cause)); }
    finally { setBusy(false); }
  }

  useEffect(() => { void load(); }, [base, offset]);

  async function send(create = false, resolve = false) {
    if (!base || busy) return;
    setBusy(true); setError('');
    try {
      const response = await requestApi<{ id: string }>({
        path: create ? base : `${base}/${detail!.ticket.id}/messages`, method: 'POST',
        body: create ? { subject, body } : resolve ? { status: 'resolved' } : { body: reply },
      });
      setSubject(''); setBody(''); setReply('');
      await load(); await open(response.data.id);
    } catch (cause) { setError(getFriendlyErrorMessage(cause)); }
    finally { setBusy(false); }
  }

  const control = 'min-h-12 w-full rounded-xl border border-[var(--input)] bg-white px-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-violet-500/10';
  const secondary = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 text-sm font-semibold transition hover:border-violet-300 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40';
  const primary = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40';

  return <main className={`${admin ? '' : 'page-frame'} min-h-screen bg-transparent p-4 sm:p-6 lg:p-8`}>
    <div className="mx-auto max-w-[1440px] space-y-6">
      <header className="relative isolate overflow-hidden rounded-[26px] border border-[var(--border)] bg-gradient-to-br from-white via-white to-violet-50 p-6 shadow-[0_18px_46px_rgba(38,45,90,.08)] sm:p-8">
        <div className="absolute -bottom-24 -right-16 -z-10 h-64 w-64 rounded-full bg-gradient-to-br from-violet-200/60 to-sky-200/50 blur-2xl" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500 text-white shadow-lg shadow-indigo-500/20"><Headphones size={22} /></span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-violet-600">Lulu Care</p><h1 className="mt-2 text-3xl font-bold tracking-[-.045em] sm:text-4xl">{t('Support')}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">{t('Create a support request and keep the complete conversation in one place.')}</p></div></div><button className={secondary} onClick={() => void load()} disabled={loading}><RefreshCw size={16} className={loading ? 'animate-spin' : ''} />{t('Refresh')}</button></div>
      </header>

      {error ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">{error}</div> : null}

      {!admin ? <Surface className="p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700"><Plus size={18} /></span><div><h2 className="text-lg font-bold">{t('Create ticket')}</h2><p className="text-sm text-[var(--muted-foreground)]">{t('Describe the issue and the Lulu team will reply here.')}</p></div></div><form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); void send(true); }}><label className="grid gap-2 text-sm font-semibold">{t('Subject')}<input required maxLength={200} className={control} value={subject} onChange={(event) => setSubject(event.target.value)} /></label><label className="grid gap-2 text-sm font-semibold">{t('Message')}<textarea required rows={5} maxLength={10000} className={`${control} min-h-32 resize-y py-3`} value={body} onChange={(event) => setBody(event.target.value)} /></label><div className="flex justify-end"><button className={primary} disabled={busy || !base || !subject.trim() || !body.trim()}><Plus size={16} />{t('Create ticket')}</button></div></form></Surface> : null}

      <div className="grid min-h-[480px] gap-5 lg:grid-cols-[minmax(280px,.72fr)_minmax(0,1.5fr)]">
        <Surface className="flex min-w-0 flex-col overflow-hidden"><div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-violet-600">{t('Inbox')}</p><h2 className="mt-1 font-bold">{tickets.length} {t('tickets')}</h2></div><Inbox size={19} className="text-[var(--muted-foreground)]" /></div><div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
          {loading ? <div className="grid min-h-52 place-items-center text-sm text-[var(--muted-foreground)]"><div className="text-center"><RefreshCw className="mx-auto mb-3 animate-spin" size={22} />{t('Loading…')}</div></div> : tickets.length === 0 ? <div className="grid min-h-52 place-items-center p-6 text-center"><div><MessageSquare className="mx-auto text-violet-300" size={32} /><p className="mt-4 font-semibold">{t('No support tickets.')}</p><p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">{t('Your new requests will appear here.')}</p></div></div> : tickets.map((ticket) => <button disabled={busy} key={ticket.id} className={`block w-full rounded-xl border p-4 text-left transition ${detail?.ticket.id === ticket.id ? 'border-violet-300 bg-violet-50 shadow-sm' : 'border-transparent bg-[var(--muted)]/45 hover:border-[var(--border)] hover:bg-white'}`} onClick={() => void open(ticket.id)}><strong className="block break-words text-sm">{ticket.subject}</strong><span className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-violet-700">{t(ticket.status)}</span>{admin ? <small className="mt-2 block truncate text-[var(--muted-foreground)]">{ticket.workspaceName ?? ticket.workspaceId}</small> : null}</button>)}
        </div><div className="flex gap-2 border-t border-[var(--border)] p-3"><button className={`${secondary} flex-1 px-3`} disabled={offset === 0 || busy} onClick={() => setOffset((value) => value - 50)}><ChevronLeft size={15} />{t('Previous')}</button><button className={`${secondary} flex-1 px-3`} disabled={tickets.length < 50 || busy} onClick={() => setOffset((value) => value + 50)}>{t('Next')}<ChevronRight size={15} /></button></div></Surface>

        <Surface className="min-w-0 overflow-hidden">{!detail ? <div className="grid min-h-[478px] place-items-center p-8 text-center"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-sky-100 text-violet-700"><MessageSquare size={24} /></span><h2 className="mt-5 text-lg font-bold">{t('Select a ticket.')}</h2><p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted-foreground)]">{t('Choose a conversation from the inbox to view its history and reply.')}</p></div></div> : <div className="flex min-h-[478px] flex-col"><div className="border-b border-[var(--border)] px-5 py-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-violet-600">{t('Conversation')}</p><h2 className="mt-1 break-words text-xl font-bold">{detail.ticket.subject}</h2>{admin ? <p className="mt-1 text-xs text-[var(--muted-foreground)]">{t('Workspace')}: {detail.ticket.workspaceId}</p> : null}</div><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">{t(detail.ticket.status)}</span></div></div><div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[var(--muted)]/25 p-4 sm:p-5">{detail.messages.map((message) => <article key={message.id} className={`max-w-[88%] rounded-2xl border p-4 shadow-sm ${message.authorType === 'ADMIN' ? 'mr-auto border-violet-100 bg-white' : 'ml-auto border-indigo-200 bg-indigo-50'}`}><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]"><Clock3 size={13} />{message.authorType === 'ADMIN' ? t('Support') : t('Customer')} · {new Date(message.createdAt).toLocaleString()}</div><p className="whitespace-pre-wrap break-words text-sm leading-6">{message.body}</p></article>)}</div>{canReply ? <form className="space-y-3 border-t border-[var(--border)] bg-white p-4 sm:p-5" onSubmit={(event) => { event.preventDefault(); void send(); }}><label className="grid gap-2 text-sm font-semibold">{t('Message')}<textarea required rows={3} maxLength={10000} className={`${control} min-h-24 resize-y py-3`} value={reply} onChange={(event) => setReply(event.target.value)} /></label><div className="flex flex-wrap justify-end gap-2">{admin ? <button type="button" className={secondary} disabled={busy} onClick={() => void send(false, true)}><CheckCircle2 size={16} />{t('Resolve ticket')}</button> : null}<button className={primary} disabled={busy || !reply.trim()}><Send size={16} />{t('Send reply')}</button></div></form> : null}</div>}</Surface>
      </div>
      {detail ? <div className="flex justify-center gap-2"><button className={secondary} disabled={busy || messageOffset === 0} onClick={() => void open(detail.ticket.id, Math.max(0, messageOffset - 100))}>{t('Previous messages')}</button><button className={secondary} disabled={busy || detail.messages.length < 100} onClick={() => void open(detail.ticket.id, messageOffset + 100)}>{t('Next messages')}</button></div> : null}
    </div>
  </main>;
}
