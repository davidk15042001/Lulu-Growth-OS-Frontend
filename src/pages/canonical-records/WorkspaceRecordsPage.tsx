import { useRef, useState } from 'react';
import { Archive, Download, FileUp, Plus, RefreshCw, Search, X } from 'lucide-react';
import { useLuluApp } from '../../api/LuluAppContext';
import { getFriendlyErrorMessage } from '../../api/client';
import { archiveRecord, createRecord, ingestRecord, type WorkspaceRecord } from '../../api/records';
import { useLiveRecords } from '../../api/useLiveRecords';
import { WorkspaceSurfaceShell } from '../../components/WorkspaceSurfaceShell';

type Props = { resourceType: string; title: string; activeSlug: string; description?: string };
const inputClass = 'w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]';
function dataValue(record: WorkspaceRecord, key: string) { return String(record.data?.[key] ?? ''); }
function csvEscape(input: unknown) { const value = String(input ?? ''); return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value; }

export default function WorkspaceRecordsPage({ resourceType, title, activeSlug, description }: Props) {
  const { permissions } = useLuluApp();
  const canWrite = permissions.canEdit;
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { items, loading, error: loadError, refresh } = useLiveRecords(resourceType, query ? `search=${encodeURIComponent(query)}&limit=100` : 'limit=100');
  const rows = query ? items.filter((record) => `${record.name} ${record.description ?? ''} ${JSON.stringify(record.data)}`.toLowerCase().includes(query.toLowerCase())) : items;

  const save = async () => {
    if (!canWrite || !name.trim()) { setError('Ein Name ist erforderlich.'); return; }
    setBusy(true); setError(''); setMessage('');
    try {
      await createRecord(resourceType, { name: name.trim(), description: details.trim() || null, status: 'Active', data: { description: details.trim() || null } });
      setModal(false); setName(''); setDetails(''); setMessage(`${title} wurde gespeichert.`); await refresh();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'Der Datensatz konnte nicht gespeichert werden.')); }
    finally { setBusy(false); }
  };
  const importFile = async (file?: File) => {
    if (!file || !canWrite) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const form = new FormData(); form.append('name', file.name); form.append('text', ''); form.append('files', file, file.name);
      await ingestRecord(resourceType, form); setImportOpen(false); setMessage(`${file.name} wurde importiert.`); await refresh();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'Der Import konnte nicht verarbeitet werden.')); }
    finally { setBusy(false); }
  };
  const exportCsv = () => {
    const values = [['name', 'status', 'description', 'createdAt', 'updatedAt'], ...rows.map((record) => [record.name, record.status, record.description ?? dataValue(record, 'description'), record.createdAt, record.updatedAt])];
    const blob = new Blob([values.map((row) => row.map(csvEscape).join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `lulu-${resourceType}.csv`; anchor.click(); URL.revokeObjectURL(url);
  };
  const archive = async (record: WorkspaceRecord) => {
    if (!canWrite || !window.confirm('Datensatz archivieren?')) return;
    setBusy(true); setError('');
    try { await archiveRecord(resourceType, record.id); await refresh(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, 'Der Datensatz konnte nicht archiviert werden.')); }
    finally { setBusy(false); }
  };

  return <WorkspaceSurfaceShell activeSlug={activeSlug}><main className="page-frame min-h-screen bg-[var(--background)] p-4 sm:p-8"><div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Lulu Workspace</p><h1 className="text-3xl font-semibold">{title}</h1><p className="mt-2 text-sm text-[var(--muted-foreground)]">{description ?? `Live-Daten aus deinem Workspace – ohne Demo-Einträge.`}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => void refresh()} disabled={loading} className="rounded-xl border border-[var(--border)] p-2.5 disabled:opacity-50" aria-label="Aktualisieren"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/></button><button type="button" onClick={exportCsv} disabled={!rows.length} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm disabled:opacity-40"><Download size={15}/>Export</button><button type="button" onClick={() => setImportOpen(true)} disabled={!canWrite} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm disabled:opacity-40"><FileUp size={15}/>Import</button><button type="button" onClick={() => setModal(true)} disabled={!canWrite} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-40"><Plus size={16}/>Neu</button></div></header>
    {(error || loadError) && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error || loadError}</div>}{message && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>}
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)]"><div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] p-4"><label className="relative min-w-[240px] flex-1"><Search size={16} className="absolute left-3 top-3 text-[var(--muted-foreground)]"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`${title} durchsuchen …`} className={`${inputClass} pl-9`}/></label><span className="text-xs text-[var(--muted-foreground)]">{rows.length} live</span></div>{loading ? <div className="p-12 text-center text-sm text-[var(--muted-foreground)]">Wird geladen …</div> : rows.length === 0 ? <div className="p-16 text-center text-sm text-[var(--muted-foreground)]"><p>Noch keine {title.toLowerCase()}.</p><p className="mt-1">Lege den ersten Datensatz an oder importiere eine CSV/Excel-Datei.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)]"><tr><th className="px-4 py-3">Name</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Beschreibung</th><th className="px-3 py-3">Aktualisiert</th><th className="px-3 py-3 text-right">Aktionen</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{rows.map((record) => <tr key={record.id}><td className="px-4 py-3 font-medium">{record.name}</td><td className="px-3 py-3"><span className="rounded-full bg-[var(--secondary)] px-2.5 py-1 text-xs">{record.status}</span></td><td className="max-w-[420px] truncate px-3 py-3 text-xs text-[var(--muted-foreground)]">{(record.description ?? dataValue(record, 'description')) || '—'}</td><td className="px-3 py-3 text-xs text-[var(--muted-foreground)]">{new Date(record.updatedAt).toLocaleString()}</td><td className="px-3 py-3 text-right"><button type="button" onClick={() => void archive(record)} disabled={!canWrite || busy} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-40" aria-label="Archivieren"><Archive size={15}/></button></td></tr>)}</tbody></table></div>}</section>
  </div></main>{modal && <Modal title={`Neue ${title}`} onClose={() => setModal(false)}><label className="block"><span className="mb-1 block text-xs">Name *</span><input autoFocus value={name} onChange={(event) => setName(event.target.value)} className={inputClass}/></label><label className="mt-4 block"><span className="mb-1 block text-xs">Beschreibung</span><textarea value={details} onChange={(event) => setDetails(event.target.value)} className={`${inputClass} min-h-28`}/></label><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(false)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm">Abbrechen</button><button type="button" onClick={() => void save()} disabled={busy} className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] disabled:opacity-40">Speichern</button></div></Modal>}{importOpen && <Modal title={`Import ${title}`} onClose={() => setImportOpen(false)}><p className="text-sm text-[var(--muted-foreground)]">CSV, PDF oder Excel-Datei auswählen. Die Datei wird Workspace-sicher verarbeitet.</p><input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.pdf,.txt" onChange={(event) => void importFile(event.target.files?.[0])} className="mt-4 block w-full text-sm"/><div className="mt-5 flex justify-end"><button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] disabled:opacity-40"><FileUp size={15}/>Datei auswählen</button></div></Modal>}</WorkspaceSurfaceShell>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true"><div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><button type="button" onClick={onClose} aria-label="Schließen"><X size={18}/></button></div><div className="mt-5">{children}</div></div></div>; }
