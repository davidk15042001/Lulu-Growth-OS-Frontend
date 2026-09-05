import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, CreditCard, Database, FileText, LoaderCircle, Receipt, RefreshCw, Server, Sparkles, WalletCards } from 'lucide-react';
import { getFriendlyErrorMessage } from '../../../../api/client';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { workspaceAppApi, type BillingState } from '../../../../api/workspace-app';
import { LuluGlobalNavigation } from '../../../../components/LuluGlobalNavigation';

const tabs = [
  { id: 'ai-usage', label: 'AI Usage' },
  { id: 'payments', label: 'Payments' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'subscription', label: 'Subscription' },
] as const;

type BillingTab = typeof tabs[number]['id'];

function money(value: number, currency = 'USD') {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
}

function date(value: string | null) {
  return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Not available';
}

function Status({ children }: { children: string }) {
  return <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">{children.replaceAll('_', ' ')}</span>;
}

function Empty({ title, detail }: { title: string; detail: string }) {
  return <section className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-border bg-card p-8 text-center"><div><Database className="mx-auto text-muted-foreground" size={32} /><h2 className="mt-4 text-lg font-semibold">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{detail}</p></div></section>;
}

export function LuluBilling() {
  const { selectedWorkspace, can } = useLuluApp();
  const [activeTab, setActiveTab] = useState<BillingTab>('ai-usage');
  const [state, setState] = useState<BillingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!selectedWorkspace) { setState(null); setLoading(false); return; }
    setLoading(true); setError('');
    try { setState((await workspaceAppApi.billing(selectedWorkspace.id)).data); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, 'Billing information could not be loaded.')); }
    finally { setLoading(false); }
  }, [selectedWorkspace]);

  useEffect(() => { void load(); }, [load]);
  const payg = state?.payg ?? null;
  const subscription = state?.subscription ?? null;
  const paidInvoices = useMemo(() => payg?.invoices ?? [], [payg]);

  const payApiUsage = async () => {
    if (!selectedWorkspace || !payg || !can('administer')) return;
    setPaying(true); setError('');
    try {
      const checkout = await workspaceAppApi.createPaygApiUsageCheckout(selectedWorkspace.id);
      if (checkout.data.paymentUrl) { window.location.assign(checkout.data.paymentUrl); return; }
      await load();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'API usage payment could not be created.')); }
    finally { setPaying(false); }
  };

  const topLabel = payg?.aiAccessBlocked ? 'AI access is paused until the outstanding usage charge is paid.' : 'Usage and billing data are calculated only from your workspace records.';
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-64 lg:border-r lg:border-border lg:bg-card"><LuluGlobalNavigation activeSlug="pure-minute-5446" /></aside>
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:ml-64 lg:px-12 lg:py-12">
      <header className="mb-8 flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Workspace settings</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Billing</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{topLabel}</p></div><button type="button" onClick={() => void load()} disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium disabled:opacity-50"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} />Refresh</button></header>
      {error && <div role="alert" className="mb-5 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><AlertCircle size={18} className="shrink-0" /><span>{error}</span></div>}
      {payg?.aiAccessBlocked && <div role="alert" className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm"><span>{payg.blockReason ? `${payg.blockReason.replaceAll('_', ' ')}.` : 'AI access is blocked.'}</span>{payg.paymentLink && <a href={payg.paymentLink} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Pay outstanding usage</a>}</div>}
      <nav aria-label="Billing sections" className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1">{tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium ${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>{tab.label}</button>)}</nav>
      {loading ? <div className="grid min-h-72 place-items-center rounded-2xl border border-border bg-card text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><LoaderCircle size={17} className="animate-spin" />Loading billing data…</span></div> : activeTab === 'ai-usage' ? !payg ? <Empty title="No pay-as-you-go usage configured" detail="AI and server usage will appear here after pay-as-you-go billing is enabled for this workspace." /> : <div className="space-y-5"><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><article className="rounded-2xl border border-border bg-card p-5"><Sparkles size={18} /><p className="mt-5 text-xs text-muted-foreground">AI API cost</p><p className="mt-2 text-2xl font-semibold">{money(payg.apiCost, payg.currency)}</p></article><article className="rounded-2xl border border-border bg-card p-5"><Server size={18} /><p className="mt-5 text-xs text-muted-foreground">Server cost</p><p className="mt-2 text-2xl font-semibold">{money(payg.serverCost, payg.currency)}</p></article><article className="rounded-2xl border border-border bg-card p-5"><WalletCards size={18} /><p className="mt-5 text-xs text-muted-foreground">Current estimate</p><p className="mt-2 text-2xl font-semibold">{money(payg.estimatedTotal, payg.currency)}</p></article><article className="rounded-2xl border border-border bg-card p-5"><Receipt size={18} /><p className="mt-5 text-xs text-muted-foreground">Next billing date</p><p className="mt-2 text-lg font-semibold">{date(payg.nextInvoiceAt)}</p></article></section><section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-lg font-semibold">Current usage period</h2><p className="mt-1 text-sm text-muted-foreground">{date(payg.periodStart)} – {date(payg.periodEnd)} · billed every {payg.intervalDays} days</p></div>{can('administer') && <button type="button" onClick={() => void payApiUsage()} disabled={paying} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{paying ? 'Preparing payment…' : 'Pay API usage now'}</button>}</div><dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div><dt className="text-xs text-muted-foreground">Input tokens</dt><dd className="mt-1 text-lg font-semibold">{payg.inputTokens.toLocaleString()}</dd></div><div><dt className="text-xs text-muted-foreground">Output tokens</dt><dd className="mt-1 text-lg font-semibold">{payg.outputTokens.toLocaleString()}</dd></div><div><dt className="text-xs text-muted-foreground">API events</dt><dd className="mt-1 text-lg font-semibold">{payg.apiEvents.toLocaleString()}</dd></div><div><dt className="text-xs text-muted-foreground">Server usage days</dt><dd className="mt-1 text-lg font-semibold">{payg.serverDays.toLocaleString()}</dd></div></dl></section></div> : activeTab === 'payments' ? !payg ? <Empty title="No payment configuration" detail="Available payment methods and pay-as-you-go collection status appear here when billing is configured." /> : <section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><h2 className="text-lg font-semibold">Payment methods and collection</h2><p className="mt-1 text-sm text-muted-foreground">Collection method: {payg.collectionMethod.replaceAll('_', ' ')}</p><div className="mt-5 flex flex-wrap gap-2">{payg.paymentMethods.length ? payg.paymentMethods.map((method) => <Status key={method}>{method}</Status>) : <span className="text-sm text-muted-foreground">No payment method is currently available.</span>}</div>{can('administer') && <button type="button" onClick={() => void payApiUsage()} disabled={paying} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"><CreditCard size={15} />{paying ? 'Preparing payment…' : 'Pay API usage now'}</button>}</section> : activeTab === 'invoices' ? paidInvoices.length === 0 ? <Empty title="No billing invoices yet" detail="Invoices are added here only after a billing period is processed. No sample invoices are shown." /> : <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="border-b border-border p-5"><h2 className="text-lg font-semibold">Billing invoices</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">Period</th><th className="px-5 py-3">API</th><th className="px-5 py-3">Server</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Invoice</th></tr></thead><tbody className="divide-y divide-border">{paidInvoices.map((invoice) => <tr key={invoice.id}><td className="px-5 py-4 text-muted-foreground">{date(invoice.periodStart)} – {date(invoice.periodEnd)}</td><td className="px-5 py-4">{money(invoice.apiCost, invoice.currency)}</td><td className="px-5 py-4">{money(invoice.serverCost, invoice.currency)}</td><td className="px-5 py-4 font-medium">{money(invoice.totalCost, invoice.currency)}</td><td className="px-5 py-4"><Status>{invoice.status}</Status></td><td className="px-5 py-4">{invoice.hostedInvoiceUrl ? <a className="text-primary underline" href={invoice.hostedInvoiceUrl}>Open</a> : invoice.invoicePdfUrl ? <a className="text-primary underline" href={invoice.invoicePdfUrl}>PDF</a> : <span className="text-muted-foreground">Not available</span>}</td></tr>)}</tbody></table></div></section> : !subscription ? <Empty title="No subscription configured" detail="Your subscription status will be shown after a plan has been activated for this workspace." /> : <section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Current subscription</p><h2 className="mt-2 text-3xl font-semibold">{subscription.planKey}</h2><p className="mt-2"><Status>{subscription.status}</Status></p></div><CheckCircle2 size={24} className="text-foreground" /></div><dl className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><div><dt className="text-xs text-muted-foreground">Seats</dt><dd className="mt-1 text-lg font-semibold">{subscription.seats}</dd></div><div><dt className="text-xs text-muted-foreground">Current period starts</dt><dd className="mt-1 text-sm font-medium">{date(subscription.currentPeriodStartsAt)}</dd></div><div><dt className="text-xs text-muted-foreground">Current period ends</dt><dd className="mt-1 text-sm font-medium">{date(subscription.currentPeriodEndsAt)}</dd></div><div><dt className="text-xs text-muted-foreground">Trial ends</dt><dd className="mt-1 text-sm font-medium">{date(subscription.trialEndsAt)}</dd></div><div><dt className="text-xs text-muted-foreground">Cancellation</dt><dd className="mt-1 text-sm font-medium">{subscription.cancelAtPeriodEnd ? 'Scheduled at period end' : 'Not scheduled'}</dd></div><div><dt className="text-xs text-muted-foreground">Provider</dt><dd className="mt-1 text-sm font-medium">{subscription.provider}</dd></div></dl></section>}
    </main>
  </div>;
}
