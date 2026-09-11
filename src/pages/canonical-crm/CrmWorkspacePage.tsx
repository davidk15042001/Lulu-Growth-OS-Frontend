import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  Building2,
  CircleAlert,
  ExternalLink,
  FileUp,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useLuluApp } from '../../api/LuluAppContext';
import { getFriendlyErrorMessage } from '../../api/client';
import {
  archiveRecord,
  createRecord,
  ingestRecord,
  requestRecordEnrichment,
  updateRecord,
  type WorkspaceRecord,
} from '../../api/records';
import { useLiveRecords } from '../../api/useLiveRecords';
import { WorkspaceSurfaceShell } from '../../components/WorkspaceSurfaceShell';

type Kind = 'contacts' | 'companies' | 'activities' | 'tasks';
type EnrichmentStatus = 'queued' | 'researching' | 'complete' | 'partial' | 'blocked_funds' | 'failed';
type SocialKey = 'linkedin' | 'instagram' | 'facebook' | 'x' | 'youtube' | 'tiktok';
type CompanyEnrichment = {
  status?: EnrichmentStatus;
  completeness?: number;
  confidence?: 'low' | 'medium' | 'high';
  missingFields?: string[];
  sources?: Array<{ url: string; title?: string; kind?: string }>;
  researchedAt?: string;
  nextAction?: string | null;
  outreach?: { status?: string; channel?: string | null; sentAt?: string | null };
};

const resourceFor: Record<Kind, string> = { contacts: 'crm_contacts', companies: 'crm_companies', activities: 'crm_activities', tasks: 'crm_tasks' };
const labels: Record<Kind, string> = { contacts: 'Kontakte', companies: 'Unternehmen', activities: 'Aktivitäten', tasks: 'Aufgaben' };
const socialKeys: SocialKey[] = ['linkedin', 'instagram', 'facebook', 'x', 'youtube', 'tiktok'];
const emptyForm = {
  name: '', email: '', phone: '', company: '', industry: '', status: 'Active', type: 'Prospect', dueAt: '', priority: 'Medium',
  description: '', websiteUrl: '', country: '', city: '', address: '', linkedin: '', instagram: '', facebook: '', x: '', youtube: '', tiktok: '',
};
const inputClass = 'w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]';

function value(record: WorkspaceRecord, key: string) { return String(record.data?.[key] ?? ''); }
function nullable(value: string) { return value.trim() || null; }
function objectValue(value: unknown) { return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function companyEnrichment(record: WorkspaceRecord) { return objectValue(record.data.enrichment) as CompanyEnrichment; }
function socialProfiles(record: WorkspaceRecord) { return objectValue(record.data.socialProfiles) as Partial<Record<SocialKey, string>>; }
function companyLocation(record: WorkspaceRecord) {
  return [value(record, 'city'), value(record, 'country')].filter(Boolean).join(', ') || value(record, 'company') || 'Standort wird ermittelt';
}
function safeHref(value: string) {
  if (!value) return null;
  try { return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`).toString(); } catch { return null; }
}
function sourceLabel(source: { url: string; title?: string }) {
  if (source.title) return source.title;
  try { return new URL(source.url).hostname; } catch { return source.url; }
}
function initials(name: string) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'CO'; }

const statusCopy: Record<EnrichmentStatus, { label: string; tone: string }> = {
  queued: { label: 'Eingeplant', tone: 'border-sky-200 bg-sky-50 text-sky-700' },
  researching: { label: 'AI recherchiert', tone: 'border-violet-200 bg-violet-50 text-violet-700' },
  complete: { label: 'Vollständig', tone: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  partial: { label: 'Wird ergänzt', tone: 'border-amber-200 bg-amber-50 text-amber-700' },
  blocked_funds: { label: 'AI-Guthaben fehlt', tone: 'border-rose-200 bg-rose-50 text-rose-700' },
  failed: { label: 'Erneuter Versuch nötig', tone: 'border-rose-200 bg-rose-50 text-rose-700' },
};
function enrichmentStatus(record: WorkspaceRecord): EnrichmentStatus {
  const status = companyEnrichment(record).status;
  return status && status in statusCopy ? status : 'queued';
}

function EnrichmentBadge({ record }: { record: WorkspaceRecord }) {
  const status = enrichmentStatus(record);
  const copy = statusCopy[status];
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${copy.tone}`}>
    <Sparkles size={11} className={status === 'researching' ? 'animate-pulse' : ''}/>{copy.label}
  </span>;
}

function CompanyIntelligenceView({
  items,
  filtered,
  loading,
  canWrite,
  busy,
  query,
  setQuery,
  refresh,
  onCreate,
  onImport,
  onEdit,
  onArchive,
  onRetry,
}: {
  items: WorkspaceRecord[];
  filtered: WorkspaceRecord[];
  loading: boolean;
  canWrite: boolean;
  busy: boolean;
  query: string;
  setQuery: (value: string) => void;
  refresh: () => Promise<void>;
  onCreate: () => void;
  onImport: () => void;
  onEdit: (record: WorkspaceRecord) => void;
  onArchive: (record: WorkspaceRecord) => void;
  onRetry: (record: WorkspaceRecord) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    if (!filtered.length) setSelectedId(null);
    else if (!selectedId || !filtered.some((item) => item.id === selectedId)) setSelectedId(filtered[0]!.id);
  }, [filtered, selectedId]);
  const selected = filtered.find((item) => item.id === selectedId) ?? null;
  const activeResearch = items.filter((record) => ['queued', 'researching'].includes(enrichmentStatus(record))).length;
  const average = items.length ? Math.round(items.reduce((sum, record) => sum + (companyEnrichment(record).completeness ?? 0), 0) / items.length) : 0;

  return <div className="mx-auto max-w-[1500px] space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-5">
      <div className="max-w-3xl">
        <p className="eyebrow">Customer Intelligence</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Unternehmen, die Lulu wirklich versteht.</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">Lulu recherchiert jede Firma selbstständig, verifiziert öffentliche Quellen und fragt fehlende Angaben über verbundene Kundenkanäle an.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void refresh()} className="rounded-xl border border-[var(--border)] p-2.5" aria-label="Aktualisieren"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/></button>
        <button type="button" onClick={onImport} disabled={!canWrite} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm disabled:opacity-40"><FileUp size={15}/>Import</button>
        <button type="button" onClick={onCreate} disabled={!canWrite} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-40"><Plus size={16}/>Unternehmen</button>
      </div>
    </header>

    <section className="grid gap-3 sm:grid-cols-3">
      <Metric label="Unternehmen" value={items.length} detail="im Customer Graph" icon={<Building2 size={17}/>}/>
      <Metric label="Datenabdeckung" value={`${average}%`} detail="über alle Profile" icon={<ShieldCheck size={17}/>}/>
      <Metric label="Live-Recherche" value={activeResearch} detail={activeResearch ? 'läuft autonom' : 'alles verarbeitet'} icon={<Sparkles size={17}/>}/>
    </section>

    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(420px,.9fr)_minmax(0,1.35fr)]">
      <div className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center gap-3 border-b border-[var(--border)] p-4">
          <label className="relative min-w-0 flex-1"><Search size={16} className="absolute left-3 top-3 text-[var(--muted-foreground)]"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Unternehmen durchsuchen …" className={`${inputClass} pl-9`}/></label>
          <span className="shrink-0 text-xs text-[var(--muted-foreground)]">{filtered.length} live</span>
        </div>
        {loading ? <div className="grid min-h-80 place-items-center text-sm text-[var(--muted-foreground)]">Customer Graph wird geladen …</div>
          : filtered.length === 0 ? <div className="grid min-h-80 place-items-center p-10 text-center"><div><Building2 size={34} className="mx-auto opacity-30"/><p className="mt-4 font-medium">Noch keine Unternehmen.</p><p className="mt-1 max-w-sm text-sm text-[var(--muted-foreground)]">Ein Name oder eine Website genügt. Lulu baut das vollständige Profil autonom auf.</p></div></div>
            : <div className="max-h-[760px] divide-y divide-[var(--border)] overflow-y-auto">{filtered.map((record) => {
              const enrichment = companyEnrichment(record);
              const website = value(record, 'websiteUrl');
              return <button key={record.id} type="button" onClick={() => setSelectedId(record.id)} className={`group flex w-full min-w-0 items-start gap-3 p-4 text-left transition hover:bg-[var(--secondary)] ${selectedId === record.id ? 'bg-[var(--secondary)]' : ''}`}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-semibold text-white shadow-sm">{initials(record.name)}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex min-w-0 items-center justify-between gap-2"><strong className="truncate text-sm">{record.name}</strong><span className="text-xs font-semibold tabular-nums">{enrichment.completeness ?? 0}%</span></span>
                  <span className="mt-1 block truncate text-xs text-[var(--muted-foreground)]">{value(record, 'industry') || 'Branche wird ermittelt'} · {companyLocation(record)}</span>
                  <span className="mt-3 flex items-center justify-between gap-2"><EnrichmentBadge record={record}/><span className="max-w-[150px] truncate text-[11px] text-[var(--muted-foreground)]">{website || 'Website wird gesucht'}</span></span>
                  <span className="mt-3 block h-1 overflow-hidden rounded-full bg-[var(--border)]"><span className="block h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${enrichment.completeness ?? 0}%` }}/></span>
                </span>
              </button>;
            })}</div>}
      </div>
      <CompanyDetail record={selected} canWrite={canWrite} busy={busy} onEdit={onEdit} onArchive={onArchive} onRetry={onRetry}/>
    </section>
  </div>;
}

function Metric({ label, value, detail, icon }: { label: string; value: string | number; detail: string; icon: React.ReactNode }) {
  return <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_12px_40px_rgba(34,24,76,.04)]"><div className="flex items-center justify-between"><span className="text-xs font-medium uppercase tracking-[.12em] text-[var(--muted-foreground)]">{label}</span><span className="text-violet-500">{icon}</span></div><p className="mt-3 text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">{detail}</p></div>;
}

function CompanyDetail({ record, canWrite, busy, onEdit, onArchive, onRetry }: { record: WorkspaceRecord | null; canWrite: boolean; busy: boolean; onEdit: (record: WorkspaceRecord) => void; onArchive: (record: WorkspaceRecord) => void; onRetry: (record: WorkspaceRecord) => void }) {
  if (!record) return <div className="grid min-h-[520px] place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">Wähle ein Unternehmen aus.</div>;
  const enrichment = companyEnrichment(record);
  const socials = socialProfiles(record);
  const website = safeHref(value(record, 'websiteUrl'));
  const description = record.description || value(record, 'aiDescription');
  const notes = value(record, 'aiNotes');
  const missing = enrichment.missingFields ?? [];
  const status = enrichmentStatus(record);

  return <article className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_18px_70px_rgba(34,24,76,.06)]">
    <div className="border-b border-[var(--border)] bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.13),transparent_36%),radial-gradient(circle_at_top_left,rgba(139,92,246,.14),transparent_38%)] p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 text-base font-semibold text-white shadow-lg shadow-violet-500/15">{initials(record.name)}</span><div className="min-w-0"><EnrichmentBadge record={record}/><h2 className="mt-2 truncate text-2xl font-semibold">{record.name}</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">{value(record, 'industry') || 'Branche wird autonom ermittelt'}</p></div></div>
        <div className="flex gap-1"><button type="button" onClick={() => onEdit(record)} disabled={!canWrite || busy} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5 disabled:opacity-40" aria-label="Korrigieren"><Pencil size={15}/></button><button type="button" onClick={() => onArchive(record)} disabled={!canWrite || busy} className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-rose-600 disabled:opacity-40" aria-label="Archivieren"><Archive size={15}/></button></div>
      </div>
      <div className="mt-6 flex items-center gap-3"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/70"><span className="block h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${enrichment.completeness ?? 0}%` }}/></span><strong className="text-sm tabular-nums">{enrichment.completeness ?? 0}% Datenabdeckung</strong></div>
    </div>

    <div className="space-y-6 p-5 sm:p-7">
      <section className="grid gap-3 sm:grid-cols-2">
        <Fact icon={<Globe2 size={15}/>} label="Website" value={value(record, 'websiteUrl') || 'Wird recherchiert'} href={website}/>
        <Fact icon={<Phone size={15}/>} label="Telefon" value={value(record, 'phone') || 'Wird recherchiert'} href={value(record, 'phone') ? `tel:${value(record, 'phone')}` : null}/>
        <Fact icon={<Mail size={15}/>} label="E-Mail" value={value(record, 'email') || 'Wird recherchiert'} href={value(record, 'email') ? `mailto:${value(record, 'email')}` : null}/>
        <Fact icon={<MapPin size={15}/>} label="Standort" value={companyLocation(record)}/>
      </section>

      <IntelligenceSection title="AI-Unternehmensbeschreibung" icon={<Sparkles size={15}/>}><p>{description || 'Lulu erstellt die Beschreibung, sobald ausreichend verifizierbare Informationen vorliegen.'}</p></IntelligenceSection>
      <IntelligenceSection title="AI-Notizen" icon={<MessageCircle size={15}/>}><p>{notes || 'Noch keine belastbaren Intelligence-Notizen vorhanden.'}</p></IntelligenceSection>

      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[var(--muted-foreground)]">Social-Media-Kanäle</p>
        <div className="mt-3 flex flex-wrap gap-2">{socialKeys.map((key) => {
          const href = safeHref(socials[key] ?? '');
          return href ? <a key={key} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs capitalize hover:bg-[var(--secondary)]">{key}<ExternalLink size={11}/></a> : null;
        })}{!Object.keys(socials).length && <span className="text-sm text-[var(--muted-foreground)]">Lulu sucht nach offiziellen Profilen.</span>}</div>
      </section>

      {missing.length > 0 && <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <div className="flex items-start gap-3"><CircleAlert size={18} className="mt-0.5 shrink-0"/><div><p className="text-sm font-semibold">Fehlende Informationen werden autonom beschafft</p><p className="mt-1 text-xs leading-5">{missing.join(', ')}</p><p className="mt-2 text-xs font-medium">{enrichment.nextAction || 'Lulu setzt die Recherche fort.'}</p>{enrichment.outreach?.status === 'sent' && <p className="mt-1 text-xs">Anfrage über {enrichment.outreach.channel || 'OmniChannel'} versendet.</p>}</div></div>
      </section>}

      {(enrichment.sources?.length ?? 0) > 0 && <section><p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[var(--muted-foreground)]">Verifizierte Quellen</p><div className="mt-3 grid gap-2">{enrichment.sources!.slice(0, 6).map((source, index) => source.url.startsWith('http') ? <a key={`${source.url}-${index}`} href={source.url} target="_blank" rel="noreferrer" className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-2 text-xs hover:bg-[var(--secondary)]"><span className="truncate">{sourceLabel(source)}</span><ExternalLink size={12} className="shrink-0"/></a> : <div key={`${source.url}-${index}`} className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs">Direkte Kundenangabe</div>)}</div></section>}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-5"><p className="text-xs text-[var(--muted-foreground)]">{enrichment.researchedAt ? `Zuletzt autonom geprüft: ${new Date(enrichment.researchedAt).toLocaleString()}` : 'Recherche startet automatisch.'}</p>{['failed', 'partial'].includes(status) && <button type="button" onClick={() => onRetry(record)} disabled={!canWrite || busy} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-medium disabled:opacity-40"><RefreshCw size={13}/>Recherche neu starten</button>}</div>
    </div>
  </article>;
}

function Fact({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string | null }) {
  const content = <><span className="text-violet-500">{icon}</span><span className="min-w-0"><small className="block text-[10px] uppercase tracking-[.1em] text-[var(--muted-foreground)]">{label}</small><strong className="mt-1 block truncate text-xs font-medium">{value}</strong></span></>;
  return href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] p-3 hover:bg-[var(--secondary)]">{content}</a> : <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] p-3">{content}</div>;
}

function IntelligenceSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section><p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-[var(--muted-foreground)]"><span className="text-violet-500">{icon}</span>{title}</p><div className="mt-3 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--secondary)_55%,transparent)] p-4 text-sm leading-6 text-[var(--foreground)]">{children}</div></section>;
}

export default function CrmWorkspacePage({ kind, showEntitySwitcher = true }: { kind: Kind; showEntitySwitcher?: boolean }) {
  const { permissions } = useLuluApp();
  const [viewKind, setViewKind] = useState<Kind>(kind);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<WorkspaceRecord | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const resourceType = resourceFor[viewKind];
  const { items, loading, error: loadError, refresh } = useLiveRecords(resourceType, query ? `search=${encodeURIComponent(query)}&limit=100` : 'limit=100');
  const canWrite = permissions.canEdit;
  const filtered = useMemo(() => query ? items.filter((item) => `${item.name} ${JSON.stringify(item.data)}`.toLowerCase().includes(query.toLowerCase())) : items, [items, query]);

  useEffect(() => { setViewKind(kind); setForm(emptyForm); setError(''); setNotice(''); setModal(false); setEditing(null); setImportOpen(false); }, [kind]);
  useEffect(() => {
    if (viewKind !== 'companies' || !items.some((item) => ['queued', 'researching'].includes(enrichmentStatus(item)))) return;
    const timer = window.setInterval(() => void refresh(), 4_000);
    return () => window.clearInterval(timer);
  }, [items, refresh, viewKind]);

  const openNew = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (record: WorkspaceRecord) => {
    const socials = socialProfiles(record);
    setEditing(record);
    setForm({
      ...emptyForm,
      name: record.name,
      status: record.status,
      email: value(record, 'email'),
      phone: value(record, 'phone'),
      company: value(record, 'company'),
      industry: value(record, 'industry'),
      description: record.description || value(record, 'description'),
      websiteUrl: value(record, 'websiteUrl'),
      country: value(record, 'country'),
      city: value(record, 'city'),
      address: value(record, 'address'),
      linkedin: socials.linkedin ?? '', instagram: socials.instagram ?? '', facebook: socials.facebook ?? '', x: socials.x ?? '', youtube: socials.youtube ?? '', tiktok: socials.tiktok ?? '',
    });
    setModal(true);
  };
  const save = async () => {
    if (!canWrite || !form.name.trim()) { setError('Ein Name oder Titel ist erforderlich.'); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const companySocials = Object.fromEntries(socialKeys.map((key) => [key, nullable(form[key])]).filter((entry) => entry[1]));
      const companyData = viewKind === 'companies' ? {
        ...(editing?.data ?? {}),
        websiteUrl: nullable(form.websiteUrl), email: nullable(form.email), phone: nullable(form.phone), industry: nullable(form.industry),
        country: nullable(form.country), city: nullable(form.city), address: nullable(form.address), socialProfiles: companySocials,
      } : { type: form.type, email: nullable(form.email), phone: nullable(form.phone), company: nullable(form.company), industry: nullable(form.industry), priority: form.priority, description: nullable(form.description) };
      const input = { name: form.name.trim(), status: form.status, dueAt: form.dueAt ? new Date(`${form.dueAt}T12:00:00Z`).toISOString() : null, data: companyData };
      if (editing) await updateRecord(resourceType, editing.id, { ...input, expectedVersion: editing.version });
      else await createRecord(resourceType, input);
      setModal(false); setEditing(null); setForm(emptyForm); setNotice(viewKind === 'companies' ? 'Unternehmen gespeichert. Lulu übernimmt jetzt Recherche und Vervollständigung.' : `${labels[viewKind]} wurden gespeichert.`); await refresh();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'Der Datensatz konnte nicht gespeichert werden.')); } finally { setBusy(false); }
  };
  const importFile = async (file?: File) => {
    if (!file || !canWrite) return; setBusy(true); setError(''); setNotice('');
    try { const data = new FormData(); data.append('name', file.name); data.append('text', ''); data.append('files', file, file.name); await ingestRecord(resourceType, data); setImportOpen(false); setNotice(`${file.name} wurde importiert. Lulu reichert die Unternehmen automatisch an.`); await refresh(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, 'Der Import konnte nicht verarbeitet werden.')); } finally { setBusy(false); }
  };
  const archive = async (record: WorkspaceRecord) => { if (!canWrite || !window.confirm('Datensatz archivieren?')) return; setBusy(true); try { await archiveRecord(resourceType, record.id); await refresh(); } catch (cause) { setError(getFriendlyErrorMessage(cause, 'Der Datensatz konnte nicht archiviert werden.')); } finally { setBusy(false); } };
  const retry = async (record: WorkspaceRecord) => { if (!canWrite) return; setBusy(true); setError(''); try { await requestRecordEnrichment('crm_companies', record.id); setNotice('Die autonome Recherche wurde neu eingeplant.'); await refresh(); } catch (cause) { setError(getFriendlyErrorMessage(cause, 'Die Recherche konnte nicht neu gestartet werden.')); } finally { setBusy(false); } };
  const markDone = async (record: WorkspaceRecord) => { if (!canWrite) return; setBusy(true); try { await updateRecord(resourceType, record.id, { status: 'Completed', expectedVersion: record.version }); await refresh(); } catch (cause) { setError(getFriendlyErrorMessage(cause, 'Der Status konnte nicht aktualisiert werden.')); } finally { setBusy(false); } };
  const activeSlug = kind === 'contacts' || kind === 'companies' ? 'sturdy-month-1562' : kind === 'activities' ? 'cosmic-pool-1616' : 'deeply-noon-9539';
  const title = labels[viewKind];

  return <WorkspaceSurfaceShell activeSlug={activeSlug}><main className="page-frame min-h-screen min-w-0 overflow-x-clip bg-[var(--background)] p-4 sm:p-8">
    {viewKind === 'companies' ? <>
      {(error || loadError) && <div role="alert" className="mx-auto mb-4 max-w-[1500px] rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error || loadError}</div>}
      {notice && <div className="mx-auto mb-4 max-w-[1500px] rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
      <CompanyIntelligenceView items={items} filtered={filtered} loading={loading} canWrite={canWrite} busy={busy} query={query} setQuery={setQuery} refresh={refresh} onCreate={openNew} onImport={() => setImportOpen(true)} onEdit={openEdit} onArchive={(record) => void archive(record)} onRetry={(record) => void retry(record)}/>
    </> : <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Lulu CRM</p><h1 className="text-3xl font-semibold">{title}</h1><p className="mt-2 text-sm text-[var(--muted-foreground)]">Live-Daten aus deinem Workspace – ohne Demo-Einträge.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => void refresh()} className="rounded-xl border border-[var(--border)] p-2.5" aria-label="Aktualisieren"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/></button><button type="button" onClick={() => setImportOpen(true)} disabled={!canWrite} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm disabled:opacity-40"><FileUp size={15}/>Import</button><button type="button" onClick={openNew} disabled={!canWrite} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-40"><Plus size={16}/>Neu</button></div></header>
      {showEntitySwitcher && (kind === 'contacts' || kind === 'companies') && <div className="flex gap-2 border-b border-[var(--border)] pb-2"><button type="button" onClick={() => setViewKind('contacts')} className={`rounded-lg px-3 py-2 text-sm ${viewKind === 'contacts' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'border border-[var(--border)]'}`}>Kontakte</button><button type="button" onClick={() => setViewKind('companies')} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">Unternehmen</button></div>}
      {(error || loadError) && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error || loadError}</div>}{notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)]"><div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] p-4"><label className="relative min-w-[240px] flex-1"><Search size={16} className="absolute left-3 top-3 text-[var(--muted-foreground)]"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`${title} durchsuchen …`} className={`${inputClass} pl-9`}/></label><span className="text-xs text-[var(--muted-foreground)]">{filtered.length} live</span></div>{loading ? <div className="p-12 text-center text-sm text-[var(--muted-foreground)]">Wird geladen …</div> : filtered.length === 0 ? <div className="p-16 text-center text-sm text-[var(--muted-foreground)]"><p>Noch keine {title.toLowerCase()}.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)]"><tr><th className="px-4 py-3">Name/Titel</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Details</th><th className="px-3 py-3">Erstellt</th><th className="px-3 py-3 text-right">Aktionen</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{filtered.map((record) => <tr key={record.id}><td className="px-4 py-3 font-medium">{record.name}</td><td className="px-3 py-3"><span className="rounded-full bg-[var(--secondary)] px-2.5 py-1 text-xs">{record.status}</span></td><td className="max-w-[300px] truncate px-3 py-3 text-xs text-[var(--muted-foreground)]">{viewKind === 'contacts' ? `${value(record, 'email')} · ${value(record, 'phone')}` : `${value(record, 'priority')} · ${record.description || value(record, 'description') || '—'}`}</td><td className="px-3 py-3 text-xs text-[var(--muted-foreground)]">{new Date(record.createdAt).toLocaleDateString()}</td><td className="px-3 py-3 text-right"><div className="flex justify-end gap-1"><button type="button" onClick={() => void archive(record)} disabled={!canWrite || busy} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-40" aria-label="Archivieren"><Archive size={15}/></button>{(viewKind === 'tasks' || viewKind === 'activities') && record.status !== 'Completed' && <button type="button" onClick={() => void markDone(record)} disabled={!canWrite || busy} className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs disabled:opacity-40">Erledigt</button>}</div></td></tr>)}</tbody></table></div>}</section>
    </div>}

    {modal && <Modal title={editing ? 'Unternehmen korrigieren' : `Neue ${title}`} onClose={() => { setModal(false); setEditing(null); }}><div className="grid gap-4 sm:grid-cols-2">
      <label><span className="mb-1 block text-xs">Name *</span><input autoFocus value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass}/></label>
      <label><span className="mb-1 block text-xs">Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className={inputClass}><option>Active</option><option>Prospect</option><option>Customer</option><option>Partner</option><option>Inactive</option><option>Open</option><option>Scheduled</option><option>Completed</option></select></label>
      {viewKind === 'contacts' && <><label><span className="mb-1 block text-xs">E-Mail</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass}/></label><label><span className="mb-1 block text-xs">Telefon</span><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={inputClass}/></label><label><span className="mb-1 block text-xs">Unternehmen</span><input value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} className={inputClass}/></label></>}
      {viewKind === 'companies' && <>
        <label className="sm:col-span-2"><span className="mb-1 block text-xs">Website</span><input type="url" placeholder="https://…" value={form.websiteUrl} onChange={(event) => setForm({ ...form, websiteUrl: event.target.value })} className={inputClass}/></label>
        <label><span className="mb-1 block text-xs">E-Mail</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass}/></label><label><span className="mb-1 block text-xs">Telefon</span><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={inputClass}/></label>
        <label><span className="mb-1 block text-xs">Branche</span><input value={form.industry} onChange={(event) => setForm({ ...form, industry: event.target.value })} className={inputClass}/></label><label><span className="mb-1 block text-xs">Land</span><input value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} className={inputClass}/></label>
        <label><span className="mb-1 block text-xs">Ort</span><input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className={inputClass}/></label><label><span className="mb-1 block text-xs">Adresse</span><input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className={inputClass}/></label>
        <div className="sm:col-span-2"><p className="mb-2 text-xs font-medium">Social-Media-Kanäle</p><div className="grid gap-3 sm:grid-cols-2">{socialKeys.map((key) => <label key={key}><span className="mb-1 block text-[11px] capitalize text-[var(--muted-foreground)]">{key}</span><input type="url" placeholder="https://…" value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className={inputClass}/></label>)}</div></div>
        <div className="sm:col-span-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-xs leading-5 text-violet-900"><Sparkles size={14} className="mr-2 inline"/>Beschreibung und Notizen erstellt Lulu autonom aus belegbaren Quellen. Fehlende Felder werden recherchiert oder direkt beim Unternehmen angefragt.</div>
      </>}
      {(viewKind === 'tasks' || viewKind === 'activities') && <><label><span className="mb-1 block text-xs">Fällig am</span><input type="date" value={form.dueAt} onChange={(event) => setForm({ ...form, dueAt: event.target.value })} className={inputClass}/></label><label><span className="mb-1 block text-xs">Priorität</span><select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} className={inputClass}><option>High</option><option>Medium</option><option>Low</option></select></label></>}
      {viewKind !== 'companies' && <label className="sm:col-span-2"><span className="mb-1 block text-xs">Notiz/Beschreibung</span><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={`${inputClass} min-h-24`}/></label>}
    </div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => { setModal(false); setEditing(null); }} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm">Abbrechen</button><button type="button" onClick={() => void save()} disabled={busy} className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] disabled:opacity-40">{editing ? 'Speichern & neu anreichern' : 'Speichern'}</button></div></Modal>}
    {importOpen && <Modal title={`Import ${title}`} onClose={() => setImportOpen(false)}><p className="text-sm text-[var(--muted-foreground)]">CSV, PDF oder Excel-Datei auswählen. Lulu verarbeitet und vervollständigt die Einträge autonom.</p><input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.pdf,.txt" onChange={(event) => void importFile(event.target.files?.[0])} className="mt-4 block w-full text-sm"/><div className="mt-5 flex justify-end"><button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] disabled:opacity-40"><FileUp size={15}/>Datei auswählen</button></div></Modal>}
  </main></WorkspaceSurfaceShell>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><button type="button" onClick={onClose} aria-label="Schließen"><X size={18}/></button></div>{children}</div></div>;
}
