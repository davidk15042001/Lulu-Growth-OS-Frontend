import { useEffect, useMemo, useState } from "react";
import { Banknote, FileCheck2, Landmark, ReceiptText, ShieldCheck } from "lucide-react";
import { commercialDocumentsApi, type Invoice, type Quote } from "../../api/commercial-documents";
import { useLuluApp } from "../../api/LuluAppContext";
import type { WorkspaceRecord } from "../../api/records";
import { useLiveRecords } from "../../api/useLiveRecords";
import { WorkspaceSurfaceShell } from "../../components/WorkspaceSurfaceShell";

export default function FinancePage() {
  const { selectedWorkspace } = useLuluApp();
  const transactions = useLiveRecords("finance_transactions", "limit=20");
  const income = useLiveRecords("finance_income", "limit=20");
  const expenses = useLiveRecords("finance_expenses", "limit=20");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  useEffect(() => {
    if (!selectedWorkspace) return;
    let active = true;
    setDocumentsLoading(true);
    void Promise.allSettled([
      commercialDocumentsApi.listInvoices(selectedWorkspace.id, "limit=20"),
      commercialDocumentsApi.listQuotes(selectedWorkspace.id, "limit=20"),
    ]).then(([invoiceResult, quoteResult]) => {
      if (!active) return;
      if (invoiceResult.status === "fulfilled") setInvoices(invoiceResult.value.data.items);
      if (quoteResult.status === "fulfilled") setQuotes(quoteResult.value.data.items);
      setDocumentsLoading(false);
    });
    return () => { active = false; };
  }, [selectedWorkspace]);

  const recent = useMemo(
    () => [...transactions.items, ...income.items, ...expenses.items]
      .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
      .slice(0, 8),
    [expenses.items, income.items, transactions.items],
  );
  const openInvoices = invoices.filter((invoice) => !/paid|void|cancelled/i.test(invoice.status));
  const outstanding = openInvoices.reduce((sum, invoice) => sum + Number(invoice.amountDue || 0), 0);
  const loading = transactions.loading || income.loading || expenses.loading || documentsLoading;

  return (
    <WorkspaceSurfaceShell activeSlug="finance">
      <main className="page-frame min-h-screen bg-[var(--background)] px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Autonomous finance operations</p>
              <h1 className="text-3xl font-semibold tracking-tight">Finance</h1>
              <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">Lulu maintains the financial workflow, documents activity and keeps every live outcome visible without an operator dashboard.</p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800"><ShieldCheck size={15}/> Automated within financial policy</div>
          </header>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={Landmark} label="Transactions" value={String(transactions.total)} helper="Live financial records" />
            <Metric icon={ReceiptText} label="Open invoices" value={String(openInvoices.length)} helper="Created and tracked by Lulu" />
            <Metric icon={Banknote} label="Outstanding" value={formatAmount(outstanding, openInvoices[0]?.currency || "CNY")} helper="Across open invoices" />
            <Metric icon={FileCheck2} label="Quotes" value={String(quotes.length)} helper="Current commercial documents" />
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
              <div><p className="eyebrow">Ledger activity</p><h2 className="mt-1 text-xl font-semibold">Latest financial outcomes</h2></div>
              {loading && recent.length === 0 ? <Empty text="Loading live finance data…" /> : recent.length === 0 ? <Empty text="Financial activity will appear here as Lulu processes it." /> : (
                <div className="mt-5 divide-y divide-[var(--border)]">
                  {recent.map((record) => <FinanceRow key={`${record.resourceType}:${record.id}`} record={record} />)}
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-3"><div><p className="eyebrow">Documents</p><h2 className="mt-1 text-xl font-semibold">Commercial flow</h2></div><span className="rounded-full bg-[var(--secondary)] px-3 py-1.5 text-xs text-[var(--muted-foreground)]">Autonomous</span></div>
              {invoices.length === 0 && quotes.length === 0 ? <Empty text="Lulu will create and track commercial documents when the business flow requires them." /> : (
                <div className="mt-5 space-y-3">
                  {invoices.slice(0, 4).map((invoice) => <div key={invoice.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/60 p-4"><div className="flex justify-between gap-3"><strong className="text-sm">{invoice.invoiceNumber}</strong><span className="text-xs text-[var(--muted-foreground)]">{invoice.status}</span></div><p className="mt-2 text-sm text-[var(--muted-foreground)]">{formatAmount(Number(invoice.grandTotal || 0), invoice.currency)}</p></div>)}
                  {quotes.slice(0, 3).map((quote) => <div key={quote.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/60 p-4"><div className="flex justify-between gap-3"><strong className="text-sm">{quote.quoteNumber}</strong><span className="text-xs text-[var(--muted-foreground)]">{quote.status}</span></div><p className="mt-2 text-sm text-[var(--muted-foreground)]">Quote · {quote.creationMode}</p></div>)}
                </div>
              )}
            </article>
          </section>
        </div>
      </main>
    </WorkspaceSurfaceShell>
  );
}

function Metric({ icon: Icon, label, value, helper }: { icon: typeof Banknote; label: string; value: string; helper: string }) {
  return <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"><div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><Icon size={16}/>{label}</div><p className="mt-3 text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">{helper}</p></article>;
}

function FinanceRow({ record }: { record: WorkspaceRecord }) {
  return <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"><div><strong className="text-sm">{record.name}</strong><p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">{record.description || record.stage || "Processed by Lulu"}</p></div><div className="shrink-0 text-right"><p className="text-sm font-medium">{record.valueAmount ? `${record.valueAmount} ${record.currency || ""}` : "—"}</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">{record.status || "Recorded"}</p></div></div>;
}

function Empty({ text }: { text: string }) {
  return <p className="mt-5 rounded-xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted-foreground)]">{text}</p>;
}

function formatAmount(value: number, currency: string) {
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value); }
  catch { return `${value.toFixed(2)} ${currency}`; }
}
