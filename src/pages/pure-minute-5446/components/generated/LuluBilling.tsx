import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, CreditCard, Database, Landmark, LoaderCircle, QrCode, Receipt, RefreshCw, Server, ShieldCheck, Sparkles, WalletCards } from 'lucide-react';
import QRCode from 'qrcode';
import { getFriendlyErrorMessage } from '../../../../api/client';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { workspaceAppApi, type BillingState } from '../../../../api/workspace-app';
import { LuluGlobalNavigation } from '../../../../components/LuluGlobalNavigation';

const tabs = [
  { id: 'payments', label: 'Payments' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'subscription', label: 'Subscription' },
] as const;

type BillingTab = typeof tabs[number]['id'] | 'ai-usage';
type PaygPaymentMethod = 'card' | 'wechatpay' | 'alipaycn';

const paymentMethodDetails: Record<PaygPaymentMethod, { label: string; detail: string; icon: typeof CreditCard; automatic: boolean }> = {
  card: { label: 'Bank card', detail: 'Save a card securely with Airwallex for automatic weekly collection.', icon: CreditCard, automatic: true },
  wechatpay: { label: 'WeChat Pay', detail: 'Generate a one-time QR code whenever you choose to settle API usage.', icon: QrCode, automatic: false },
  alipaycn: { label: 'Alipay', detail: 'Generate a one-time QR code whenever you choose to settle API usage.', icon: Landmark, automatic: false },
};

type QrPayment = {
  paymentId: string;
  paymentMethod: Exclude<PaygPaymentMethod, 'card'>;
  amount: number;
  currency: 'USD';
  status: 'requires_customer_action' | 'pending' | 'succeeded' | 'cancelled' | 'failed' | 'expired';
  qrPayload: string | null;
  paymentUrl: string | null;
  expiresAt: string | null;
  paidAt: string | null;
};

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

function PaygPaymentMethodSetup({
  configuration,
  canAdminister,
  busy,
  onConfigure,
  onSync,
}: {
  configuration: BillingState['paygConfiguration'];
  canAdminister: boolean;
  busy: boolean;
  onConfigure: (method: PaygPaymentMethod) => void;
  onSync: (setupId: string) => void;
}) {
  const methods = (['card', 'wechatpay', 'alipaycn'] as const).filter((method) => configuration.availablePaymentMethods.includes(method));
  const selected = configuration.selectedPaymentMethod;
  const pendingSetup = configuration.latestSetup?.status === 'PENDING' ? configuration.latestSetup : null;
  const selectedDetail = selected ? paymentMethodDetails[selected] : null;
  return <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
    <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div><div className="flex items-center gap-2"><WalletCards size={19} /><h2 className="text-lg font-semibold">Pay-as-you-go payment method</h2></div><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Choose how Lulu settles weekly API and server usage. Lulu never receives or stores card, WeChat, or Alipay credentials.</p></div>
      {configuration.status === 'active' && selectedDetail && <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700"><CheckCircle2 size={14} />{selectedDetail.automatic ? `${selectedDetail.label} configured` : `${selectedDetail.label} selected`}</span>}
      {configuration.status === 'pending' && <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700"><LoaderCircle size={14} className="animate-spin" />Card setup pending</span>}
    </div>
    {methods.length === 0 ? <p className="py-6 text-sm text-muted-foreground">No PAYG payment method is enabled for this billing account. Please contact Lulu support.</p> : <div className="mt-5 grid gap-3 lg:grid-cols-3">{methods.map((method) => {
      const option = paymentMethodDetails[method];
      const Icon = option.icon;
      const isSelected = selected === method;
      const hasPendingCardSetup = method === 'card' && pendingSetup;
      const label = hasPendingCardSetup ? 'Check card setup' : isSelected && configuration.status === 'active' ? option.automatic ? 'Configured' : 'Selected' : method === 'card' ? 'Set up bank card' : `Use ${option.label}`;
      return <article key={method} className={`rounded-xl border p-4 ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}>
        <Icon size={19} /><h3 className="mt-4 font-semibold">{option.label}</h3><p className="mt-1 min-h-10 text-sm leading-5 text-muted-foreground">{option.detail}</p>
        <p className="mt-3 text-xs font-medium text-muted-foreground">{option.automatic ? 'Automatic weekly collection' : 'Manual QR payment'}</p>
        {canAdminister ? <button type="button" disabled={busy || (isSelected && configuration.status === 'active')} onClick={() => hasPendingCardSetup ? onSync(pendingSetup.id) : onConfigure(method)} className="mt-4 w-full rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Saving…' : label}</button> : <p className="mt-4 text-xs text-muted-foreground">A workspace administrator can configure payment.</p>}
      </article>;
    })}</div>}
    {configuration.status === 'pending' && pendingSetup && <p className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-foreground">Complete the secure Airwallex card setup, then return here. Lulu verifies the saved payment source before automatic collection is enabled.</p>}
    {configuration.status === 'active' && selectedDetail && <p className="mt-5 flex items-start gap-2 rounded-lg bg-secondary p-3 text-sm text-muted-foreground"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-foreground" />{configuration.automaticCollection ? 'Your card is tokenized by Airwallex and used only for weekly Lulu usage invoices.' : `${selectedDetail.label} creates a new, short-lived QR code for each manual payment. Lulu never stores your wallet credentials.`}</p>}
  </section>;
}

export function LuluBilling() {
  const { selectedWorkspace, can } = useLuluApp();
  const [activeTab, setActiveTab] = useState<BillingTab>('payments');
  const [state, setState] = useState<BillingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [qrPayment, setQrPayment] = useState<QrPayment | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const autoSyncedSetup = useRef<string | null>(null);

  const load = useCallback(async () => {
    if (!selectedWorkspace) { setState(null); setLoading(false); return; }
    setLoading(true); setError('');
    try { setState((await workspaceAppApi.billing(selectedWorkspace.id)).data); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, 'Billing information could not be loaded.')); }
    finally { setLoading(false); }
  }, [selectedWorkspace]);

  useEffect(() => { void load(); }, [load]);
  const payg = state?.payg ?? null;
  const paymentConfiguration = state?.paygConfiguration ?? { availablePaymentMethods: [], selectedPaymentMethod: null, status: 'not_configured' as const, automaticCollection: false, paymentSourceConfigured: false, latestSetup: null };
  const subscription = state?.subscription ?? null;
  const paidInvoices = useMemo(() => payg?.invoices ?? [], [payg]);

  const syncCardSetup = useCallback(async (setupId: string, automatic = false) => {
    if (!selectedWorkspace || !can('administer')) return;
    if (automatic) autoSyncedSetup.current = setupId;
    setConfiguring(true); setError('');
    try {
      const result = await workspaceAppApi.syncPaygPaymentMethodSetup(selectedWorkspace.id, setupId);
      if (result.data.status === 'active') setNotice('Your bank card is configured for automatic weekly usage billing.');
      else if (!automatic) setNotice('The card setup is still pending. Complete the secure Airwallex page, then check again.');
      await load();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'Card payment setup could not be verified.')); }
    finally { setConfiguring(false); }
  }, [can, load, selectedWorkspace]);

  useEffect(() => {
    const setup = paymentConfiguration.latestSetup;
    if (setup?.status === 'PENDING' && autoSyncedSetup.current !== setup.id) void syncCardSetup(setup.id, true);
  }, [paymentConfiguration.latestSetup, syncCardSetup]);

  const configurePaymentMethod = async (paymentMethod: PaygPaymentMethod) => {
    if (!selectedWorkspace || !can('administer')) return;
    setConfiguring(true); setError(''); setNotice('');
    try {
      const returnUrl = `${window.location.origin}${window.location.pathname}`;
      const response = await workspaceAppApi.configurePaygPaymentMethod(selectedWorkspace.id, paymentMethod === 'card'
        ? { paymentMethod, successUrl: returnUrl, backUrl: returnUrl }
        : { paymentMethod });
      if (response.data.mode === 'card_setup') { window.location.assign(response.data.checkoutUrl); return; }
      setNotice(`${paymentMethodDetails[paymentMethod].label} was selected. Generate a QR code whenever you want to settle your API usage.`);
      await load();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'Payment method could not be configured.')); }
    finally { setConfiguring(false); }
  };

  const renderQr = useCallback(async (payment: QrPayment) => {
    if (!payment.qrPayload || payment.status === 'succeeded') { setQrImage(null); return; }
    setQrImage(await QRCode.toDataURL(payment.qrPayload, {
      errorCorrectionLevel: 'M', margin: 1, width: 320,
      color: { dark: '#101828', light: '#ffffff' },
    }));
  }, []);

  const prepareQrPayment = useCallback(async (paymentMethod: Exclude<PaygPaymentMethod, 'card'>, periodId?: string) => {
    if (!selectedWorkspace || !can('administer')) return;
    setPaying(true); setError(''); setNotice('');
    try {
      const response = await workspaceAppApi.createPaygQrPayment(selectedWorkspace.id, {
        paymentMethod,
        returnUrl: `${window.location.origin}${window.location.pathname}`,
        ...(periodId ? { periodId } : {}),
      });
      const payment = response.data;
      setQrPayment(payment);
      await renderQr(payment);
      setNotice(`Scan the ${paymentMethodDetails[paymentMethod].label} QR code to pay ${money(payment.amount, payment.currency)}.`);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'The QR payment could not be created.')); }
    finally { setPaying(false); }
  }, [can, renderQr, selectedWorkspace]);

  const syncQrPayment = useCallback(async () => {
    if (!selectedWorkspace || !qrPayment) return;
    try {
      const response = await workspaceAppApi.syncPaygQrPayment(selectedWorkspace.id, qrPayment.paymentId);
      const payment = response.data;
      setQrPayment(payment);
      await renderQr(payment);
      if (payment.status === 'succeeded') {
        setNotice(`${paymentMethodDetails[payment.paymentMethod].label} payment confirmed. Your API usage has been settled.`);
        await load();
      }
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'The QR payment status could not be updated.')); }
  }, [load, qrPayment, renderQr, selectedWorkspace]);

  useEffect(() => {
    if (!qrPayment || !['requires_customer_action', 'pending'].includes(qrPayment.status)) return;
    const timer = window.setInterval(() => { void syncQrPayment(); }, 5_000);
    return () => window.clearInterval(timer);
  }, [qrPayment, syncQrPayment]);

  const payApiUsage = async () => {
    if (!selectedWorkspace || !payg || !can('administer') || paymentConfiguration.status !== 'active') return;
    const selectedMethod = paymentConfiguration.selectedPaymentMethod;
    if (selectedMethod === 'wechatpay' || selectedMethod === 'alipaycn') {
      await prepareQrPayment(selectedMethod);
      return;
    }
    setPaying(true); setError('');
    try {
      const checkout = await workspaceAppApi.createPaygApiUsageCheckout(selectedWorkspace.id);
      if (checkout.data.paymentUrl) { window.location.assign(checkout.data.paymentUrl); return; }
      await load();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'API usage payment could not be created.')); }
    finally { setPaying(false); }
  };

  const topLabel = payg?.aiAccessBlocked ? 'AI access is paused until the outstanding usage charge is paid.' : 'Usage and billing data are calculated only from your workspace records.';
  const paymentSetup = <PaygPaymentMethodSetup configuration={paymentConfiguration} canAdminister={can('administer')} busy={configuring} onConfigure={(method) => void configurePaymentMethod(method)} onSync={(setupId) => void syncCardSetup(setupId)} />;
  const qrPaymentPanel = qrPayment && <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6" aria-live="polite">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2"><QrCode size={19} /><h2 className="text-lg font-semibold">{paymentMethodDetails[qrPayment.paymentMethod].label} QR payment</h2></div><p className="mt-2 text-sm text-muted-foreground">Amount due: <span className="font-semibold text-foreground">{money(qrPayment.amount, qrPayment.currency)}</span></p></div><button type="button" onClick={() => { setQrPayment(null); setQrImage(null); }} className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium">Close</button></div>
    {qrPayment.status === 'succeeded' ? <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-500/10 p-4 text-sm text-foreground"><CheckCircle2 className="text-emerald-700" size={20} />Payment confirmed {qrPayment.paidAt ? `on ${date(qrPayment.paidAt)}.` : '.'}</div> : qrPayment.status === 'expired' ? <div className="mt-6 rounded-xl bg-amber-500/10 p-4 text-sm text-foreground">This QR code has expired. Create a new QR payment to continue.</div> : qrPayment.status === 'failed' || qrPayment.status === 'cancelled' ? <div className="mt-6 rounded-xl bg-destructive/10 p-4 text-sm text-foreground">This payment was not completed. Create a new QR payment to try again.</div> : <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-center"><div><p className="text-sm leading-6 text-muted-foreground">Open {paymentMethodDetails[qrPayment.paymentMethod].label} on your phone and scan this code. Lulu checks Airwallex for confirmation automatically; do not close this page until payment is confirmed.</p>{qrPayment.expiresAt && <p className="mt-3 text-xs font-medium text-muted-foreground">Valid until {date(qrPayment.expiresAt)}.</p>}<div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void syncQrPayment()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><RefreshCw size={15} />Check payment status</button>{qrPayment.paymentUrl && <a href={qrPayment.paymentUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold">Open secure payment page</a>}</div></div><div className="mx-auto w-full max-w-80 rounded-2xl bg-white p-4 shadow-sm">{qrImage ? <img src={qrImage} alt={`Scan to pay with ${paymentMethodDetails[qrPayment.paymentMethod].label}`} className="aspect-square w-full" /> : <div className="grid aspect-square place-items-center text-center text-sm text-slate-600"><LoaderCircle className="animate-spin" size={22} />Preparing secure QR code…</div>}</div></div>}
  </section>;
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-64 lg:border-r lg:border-border lg:bg-card"><LuluGlobalNavigation activeSlug="pure-minute-5446" /></aside>
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:ml-64 lg:px-12 lg:py-12">
      <header className="mb-8 flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Workspace settings</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Billing</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{topLabel}</p></div><button type="button" onClick={() => void load()} disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium disabled:opacity-50"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} />Refresh</button></header>
      {error && <div role="alert" className="mb-5 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><AlertCircle size={18} className="shrink-0" /><span>{error}</span></div>}
      {notice && <div role="status" className="mb-5 flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-foreground"><CheckCircle2 size={18} className="shrink-0 text-emerald-700" /><span>{notice}</span></div>}
      {payg?.aiAccessBlocked && <div role="alert" className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm"><span>{payg.blockReason ? `${payg.blockReason.replaceAll('_', ' ')}.` : 'AI access is blocked.'}</span>{(paymentConfiguration.selectedPaymentMethod === 'wechatpay' || paymentConfiguration.selectedPaymentMethod === 'alipaycn') && payg.blockedPeriodId ? <button type="button" onClick={() => void prepareQrPayment(paymentConfiguration.selectedPaymentMethod, payg.blockedPeriodId)} disabled={paying} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">Show payment QR</button> : payg.paymentLink ? <a href={payg.paymentLink} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Pay outstanding usage</a> : null}</div>}
      <nav aria-label="Billing sections" className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1">{tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium ${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>{tab.label}</button>)}</nav>
      {loading ? <div className="grid min-h-72 place-items-center rounded-2xl border border-border bg-card text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><LoaderCircle size={17} className="animate-spin" />Loading billing data…</span></div> : activeTab === 'ai-usage' ? <div className="space-y-5">{paymentSetup}{!payg ? <Empty title="Configure pay-as-you-go to view usage" detail="Choose a payment method first. AI and server usage are shown here only from this workspace after use is recorded." /> : <><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><article className="rounded-2xl border border-border bg-card p-5"><Sparkles size={18} /><p className="mt-5 text-xs text-muted-foreground">AI API cost</p><p className="mt-2 text-2xl font-semibold">{money(payg.apiCost, payg.currency)}</p></article><article className="rounded-2xl border border-border bg-card p-5"><Server size={18} /><p className="mt-5 text-xs text-muted-foreground">Server cost</p><p className="mt-2 text-2xl font-semibold">{money(payg.serverCost, payg.currency)}</p></article><article className="rounded-2xl border border-border bg-card p-5"><WalletCards size={18} /><p className="mt-5 text-xs text-muted-foreground">Current estimate</p><p className="mt-2 text-2xl font-semibold">{money(payg.estimatedTotal, payg.currency)}</p></article><article className="rounded-2xl border border-border bg-card p-5"><Receipt size={18} /><p className="mt-5 text-xs text-muted-foreground">Next billing date</p><p className="mt-2 text-lg font-semibold">{date(payg.nextInvoiceAt)}</p></article></section></>}</div> : activeTab === 'payments' ? <div className="space-y-5">{paymentSetup}{qrPaymentPanel}{payg && <section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><h2 className="text-lg font-semibold">Collection status</h2><p className="mt-1 text-sm text-muted-foreground">Collection method: {payg.collectionMethod.replaceAll('_', ' ')}</p>{can('administer') && paymentConfiguration.status === 'active' && <button type="button" onClick={() => void payApiUsage()} disabled={paying} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"><CreditCard size={15} />{paying ? 'Preparing payment…' : paymentConfiguration.selectedPaymentMethod === 'wechatpay' ? 'Show WeChat Pay QR' : paymentConfiguration.selectedPaymentMethod === 'alipaycn' ? 'Show Alipay QR' : 'Pay API usage now'}</button>}</section>}</div> : activeTab === 'invoices' ? paidInvoices.length === 0 ? <Empty title="No billing invoices yet" detail="Invoices are added here only after a billing period is processed. No sample invoices are shown." /> : <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="border-b border-border p-5"><h2 className="text-lg font-semibold">Billing invoices</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">Period</th><th className="px-5 py-3">API</th><th className="px-5 py-3">Server</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Invoice</th></tr></thead><tbody className="divide-y divide-border">{paidInvoices.map((invoice) => <tr key={invoice.id}><td className="px-5 py-4 text-muted-foreground">{date(invoice.periodStart)} – {date(invoice.periodEnd)}</td><td className="px-5 py-4">{money(invoice.apiCost, invoice.currency)}</td><td className="px-5 py-4">{money(invoice.serverCost, invoice.currency)}</td><td className="px-5 py-4 font-medium">{money(invoice.totalCost, invoice.currency)}</td><td className="px-5 py-4"><Status>{invoice.status}</Status></td><td className="px-5 py-4">{invoice.hostedInvoiceUrl ? <a className="text-primary underline" href={invoice.hostedInvoiceUrl}>Open</a> : invoice.invoicePdfUrl ? <a className="text-primary underline" href={invoice.invoicePdfUrl}>PDF</a> : <span className="text-muted-foreground">Not available</span>}</td></tr>)}</tbody></table></div></section> : !subscription ? <Empty title="No subscription configured" detail="Your subscription status will be shown after a plan has been activated for this workspace." /> : <section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Current subscription</p><h2 className="mt-2 text-3xl font-semibold">{subscription.planKey}</h2><p className="mt-2"><Status>{subscription.status}</Status></p></div><CheckCircle2 size={24} className="text-foreground" /></div><dl className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><div><dt className="text-xs text-muted-foreground">Seats</dt><dd className="mt-1 text-lg font-semibold">{subscription.seats}</dd></div><div><dt className="text-xs text-muted-foreground">Current period starts</dt><dd className="mt-1 text-sm font-medium">{date(subscription.currentPeriodStartsAt)}</dd></div><div><dt className="text-xs text-muted-foreground">Current period ends</dt><dd className="mt-1 text-sm font-medium">{date(subscription.currentPeriodEndsAt)}</dd></div><div><dt className="text-xs text-muted-foreground">Trial ends</dt><dd className="mt-1 text-sm font-medium">{date(subscription.trialEndsAt)}</dd></div><div><dt className="text-xs text-muted-foreground">Cancellation</dt><dd className="mt-1 text-sm font-medium">{subscription.cancelAtPeriodEnd ? 'Scheduled at period end' : 'Not scheduled'}</dd></div><div><dt className="text-xs text-muted-foreground">Provider</dt><dd className="mt-1 text-sm font-medium">{subscription.provider}</dd></div></dl></section>}
    </main>
  </div>;
}
