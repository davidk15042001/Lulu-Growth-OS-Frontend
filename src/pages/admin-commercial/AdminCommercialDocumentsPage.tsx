import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, FileText, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { getFriendlyErrorMessage, requestApi, requestApiBlob } from '../../api/client';
import { useLuluApp } from '../../api/LuluAppContext';
import { useTranslation } from '../../i18n/GlobalLanguageSwitcher';

type Kind = 'quotes' | 'invoices';
type Row = { id: string; workspaceId: string; workspaceName?: string; quoteNumber?: string; invoiceNumber?: string; status: string; currency: string; creationMode: string; grandTotal?: string | number; amountDue?: string | number; createdAt: string };

export default function AdminCommercialDocumentsPage({ kind, embedded = false }: { kind: Kind; embedded?: boolean }) {
  const { currentUser } = useLuluApp();
  const t = useTranslation();
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: '5000' });
      if (query.trim()) params.set('search', query.trim());
      if (status) params.set('status', status);
      const result = await requestApi<Row[]>({ path: `/admin/${kind}?${params.toString()}` });
      setRows(result.data);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('Commercial documents could not be loaded.')));
    } finally {
      setLoading(false);
    }
  }, [currentUser, kind, query, status]);

  useEffect(() => { void load(); }, [load]);

  const downloadInvoice = async (row: Row) => {
    if (kind !== 'invoices') return;
    try {
      const blob = await requestApiBlob(`/admin/invoices/${encodeURIComponent(row.workspaceId)}/${encodeURIComponent(row.id)}/pdf`);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${row.invoiceNumber || 'invoice'}.pdf`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('The invoice PDF could not be downloaded.')));
    }
  };

  const title = kind === 'quotes' ? t('Quotes') : t('Invoices');
  const statusOptions = useMemo(() => {
    const defaults = kind === 'invoices'
      ? ['DRAFT', 'READY', 'AWAITING_APPROVAL', 'ISSUED', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED', 'VOID', 'REFUNDED']
      : ['DRAFT', 'READY', 'AWAITING_APPROVAL', 'SENT', 'VIEWED', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED', 'SUPERSEDED'];
    return Array.from(new Set([...defaults, ...rows.map((row) => row.status)])).sort();
  }, [kind, rows]);
  const exportCsv = () => {
    if (rows.length === 0) return;
    const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const headers = [t('Document'), t('Workspace'), t('Status'), t('Creation'), t('Amount'), t('Created')];
    const lines = rows.map((row) => [
      kind === 'quotes' ? row.quoteNumber : row.invoiceNumber,
      row.workspaceName || row.workspaceId,
      row.status,
      row.creationMode,
      displayAmount(row),
      new Date(row.createdAt).toISOString(),
    ].map(escape).join(','));
    const csvType = ['text', 'csv'].join('/') + ';charset=utf-8';
    const blob = new Blob([[headers.map(escape).join(','), ...lines].join('\n')], { type: csvType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  // The register is a bookkeeping view: paid invoices have amountDue=0, but
  // the document must continue to show the original total that was issued.
  const displayAmount = (row: Row) => kind === 'quotes'
    ? (row.grandTotal ?? '0')
    : (row.grandTotal ?? row.amountDue ?? '0');
  return <main className={embedded ? 'lulu-admin-commercial space-y-6' : 'lulu-admin-standalone lulu-admin-commercial page-frame min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8'}><div className="mx-auto max-w-7xl space-y-6">
    {!embedded ? <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 text-sm"><a href="/admin" className="shrink-0 rounded-xl px-3 py-2 hover:bg-[var(--secondary)]">{t('Admin overview')}</a><a href="/admin/quotes" className={`shrink-0 rounded-xl px-3 py-2 ${kind === 'quotes' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'hover:bg-[var(--secondary)]'}`}>{t('Quotes')}</a><a href="/admin/invoices" className={`shrink-0 rounded-xl px-3 py-2 ${kind === 'invoices' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'hover:bg-[var(--secondary)]'}`}>{t('Invoices')}</a></nav> : null}
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">{t('Lulu Platform Operations')}</p><h1 className="text-3xl font-semibold tracking-tight">{t('Global')} {title}</h1><p className="mt-1 text-sm text-[var(--muted-foreground)]">{kind === 'invoices' ? t('All customer invoices, sorted by invoice number for bookkeeping.') : t('Workspace context remains visible; access and data come exclusively from the Admin API.')}</p></div><button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--secondary)]"><RefreshCw size={15} className={loading ? 'animate-spin' : ''}/> {t('Refresh')}</button></header>
    {error ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}
    <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]"><div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-3"><Search size={17} className="shrink-0 text-[var(--muted-foreground)]"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('Search document, status or workspace…')} className="w-full bg-transparent text-sm outline-none"/><ShieldCheck size={17} className="shrink-0 text-emerald-600"/></div><div className="flex flex-wrap items-center gap-2"><label className="sr-only" htmlFor="admin-invoice-status">{t('Status')}</label><select id="admin-invoice-status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"><option value="">{t('All statuses')}</option>{statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select><button type="button" onClick={exportCsv} disabled={loading || rows.length === 0} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold hover:bg-[var(--secondary)] disabled:cursor-not-allowed disabled:opacity-50"><Download size={14}/>{t('Export')} CSV</button></div></div>{loading ? <p className="p-8 text-sm text-[var(--muted-foreground)]">{t('Loading…')}</p> : rows.length === 0 ? <div className="grid min-h-56 place-items-center p-8 text-center text-sm text-[var(--muted-foreground)]"><FileText size={30} className="mb-3 opacity-40"/><p>{t('No documents found.')}</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--muted-foreground)]"><tr><th className="px-5 py-3">{t('Document')}</th><th className="px-5 py-3">{t('Workspace')}</th><th className="px-5 py-3">{t('Status')}</th><th className="px-5 py-3">{t('Creation')}</th><th className="px-5 py-3 text-right">{t('Amount')}</th><th className="px-5 py-3">{t('Created')}</th>{kind === 'invoices' ? <th className="px-5 py-3 text-right">{t('PDF')}</th> : null}</tr></thead><tbody className="divide-y divide-[var(--border)]">{rows.map((row) => <tr key={row.id}><td className="px-5 py-4 font-medium">{kind === 'quotes' ? row.quoteNumber : row.invoiceNumber}<span className="mt-1 block text-xs text-[var(--muted-foreground)]">{row.currency}</span></td><td className="px-5 py-4"><span className="block max-w-[260px] truncate">{row.workspaceName || row.workspaceId}</span><span className="mt-1 block text-xs text-[var(--muted-foreground)]">{row.workspaceId}</span></td><td className="px-5 py-4"><span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-xs">{row.status}</span></td><td className="px-5 py-4 text-xs text-[var(--muted-foreground)]">{row.creationMode}</td><td className="px-5 py-4 text-right font-medium">{String(displayAmount(row))}</td><td className="px-5 py-4 text-xs text-[var(--muted-foreground)]">{new Date(row.createdAt).toLocaleString()}</td>{kind === 'invoices' ? <td className="px-5 py-4 text-right"><button type="button" onClick={() => void downloadInvoice(row)} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold hover:bg-[var(--secondary)]"><Download size={14}/>{t('Download')}</button></td> : null}</tr>)}</tbody></table></div>}</section>
  </div></main>;
}
