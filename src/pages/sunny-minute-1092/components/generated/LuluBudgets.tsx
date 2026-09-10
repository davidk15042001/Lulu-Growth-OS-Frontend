import { CheckCircle2, CreditCard, DollarSign, Loader2, QrCode, RefreshCw, Search, ShieldCheck, Sparkles, WalletCards } from 'lucide-react';
import QRCode from 'qrcode';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { adSpendApi, type AdSpendOverview, type AdSpendPaymentMethod, type AdSpendTopup } from '../../../../api/adspend';
import { getFriendlyErrorMessage } from '../../../../api/client';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { useLiveRecords } from '../../../../api/useLiveRecords';

function textValue(value: unknown) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

const money = new Intl.NumberFormat('en', { style: 'currency', currency: 'CNY', currencyDisplay: 'narrowSymbol' });
const paymentMethods: Array<{ id: AdSpendPaymentMethod; label: string; detail: string }> = [
  { id: 'card', label: 'Bank card', detail: 'Secure hosted checkout' },
  { id: 'alipaycn', label: 'Alipay', detail: 'Scan QR code' },
  { id: 'wechatpay', label: 'WeChat Pay', detail: 'Scan QR code' },
];

export function LuluBudgets() {
  const { selectedWorkspace, permissions } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? null;
  const [query, setQuery] = useState('');
  const [overview, setOverview] = useState<AdSpendOverview | null>(null);
  const [amount, setAmount] = useState('100');
  const [paymentMethod, setPaymentMethod] = useState<AdSpendPaymentMethod>('card');
  const [activeTopup, setActiveTopup] = useState<AdSpendTopup | null>(null);
  const [qrImage, setQrImage] = useState('');
  const [walletLoading, setWalletLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const { items, loading, error, refresh } = useLiveRecords('ad_budgets');

  const loadWallet = useCallback(async () => {
    if (!workspaceId) { setOverview(null); setWalletLoading(false); return; }
    setWalletLoading(true);
    try {
      setOverview((await adSpendApi.overview(workspaceId)).data);
      setPaymentError('');
    } catch (cause) {
      setPaymentError(getFriendlyErrorMessage(cause, 'The advertising wallet could not be loaded.'));
    } finally { setWalletLoading(false); }
  }, [workspaceId]);

  useEffect(() => { void loadWallet(); }, [loadWallet]);

  useEffect(() => {
    if (!activeTopup?.qrPayload) { setQrImage(''); return; }
    void QRCode.toDataURL(activeTopup.qrPayload, { width: 260, margin: 1, errorCorrectionLevel: 'M' })
      .then(setQrImage)
      .catch(() => setPaymentError('The payment QR code could not be rendered.'));
  }, [activeTopup?.qrPayload]);

  useEffect(() => {
    if (!workspaceId || !activeTopup || !['PENDING_PAYMENT', 'REQUIRES_CUSTOMER_ACTION'].includes(activeTopup.status)) return;
    const topupId = activeTopup.id;
    const poll = window.setInterval(async () => {
      try {
        const updated = (await adSpendApi.syncTopup(workspaceId, topupId)).data;
        setActiveTopup(updated);
        if (updated.status === 'SUCCEEDED') await loadWallet();
      } catch { /* Webhook remains authoritative; polling retries quietly. */ }
    }, 3_000);
    return () => window.clearInterval(poll);
  }, [activeTopup?.id, activeTopup?.status, loadWallet, workspaceId]);

  const netAmount = Number(amount);
  const normalizedAmount = Number.isFinite(netAmount) && netAmount > 0 ? Math.round(netAmount * 100) / 100 : 0;
  const feeAmount = Math.round(normalizedAmount * 4) / 100;
  const totalAmount = Math.round((normalizedAmount + feeAmount) * 100) / 100;

  const visibleItems = useMemo(
    () => items.filter((record) =>
      `${record.name} ${record.description ?? ''} ${record.status} ${textValue(record.data?.platform)} ${textValue(record.data?.budget)}`
        .toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );
  const trackedPlatforms = new Set(items.map((record) => textValue(record.data?.platform)).filter(Boolean)).size;

  async function topUp() {
    if (!workspaceId || normalizedAmount < 1 || paying) return;
    setPaying(true); setPaymentError('');
    try {
      const response = await adSpendApi.createTopup(workspaceId, {
        amount: normalizedAmount,
        paymentMethod,
        returnUrl: `${window.location.origin}${window.location.pathname}?adspend=return`,
      });
      const topup = response.data.topup;
      setActiveTopup(topup);
      if (paymentMethod === 'card' && topup.checkoutUrl) window.location.assign(topup.checkoutUrl);
    } catch (cause) {
      setPaymentError(getFriendlyErrorMessage(cause, 'The ad spend payment could not be created.'));
    } finally { setPaying(false); }
  }

  if (loading || walletLoading) {
    return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground"><Loader2 className="animate-spin" size={22} />Loading advertising wallet…</main>;
  }

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-xs uppercase tracking-[.18em] text-muted-foreground">Advertising / Autonomous budget</p><h1 className="mt-2 text-3xl font-bold">Fund once. Lulu scales automatically.</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Your payment is the budget authorization. Lulu starts, allocates and optimizes paid campaigns automatically within the prepaid balance.</p></div>
          <button type="button" onClick={() => void Promise.all([refresh(), loadWallet()])} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"><RefreshCw size={15} />Refresh</button>
        </header>

        {(error || paymentError) && <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{paymentError || error}</div>}

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid lg:grid-cols-[1.1fr_.9fr]">
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Available ad spend</p><p className="mt-3 text-4xl font-bold tracking-tight">{money.format(overview?.wallet.availableAmount ?? 0)}</p></div><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${overview?.wallet.adsEnabled ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}><span className={`h-2 w-2 rounded-full ${overview?.wallet.adsEnabled ? 'bg-emerald-500' : 'bg-amber-500'}`} />{overview?.wallet.adsEnabled ? 'Autopilot active' : 'Waiting for funds'}</span></div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <article className="rounded-2xl border border-border bg-background/60 p-4"><WalletCards size={18} className="text-muted-foreground" /><p className="mt-3 text-xs text-muted-foreground">Lifetime funded</p><p className="mt-1 font-semibold">{money.format(overview?.wallet.totalFundedAmount ?? 0)}</p></article>
                <article className="rounded-2xl border border-border bg-background/60 p-4"><Sparkles size={18} className="text-muted-foreground" /><p className="mt-3 text-xs text-muted-foreground">Reserved by agents</p><p className="mt-1 font-semibold">{money.format(overview?.wallet.reservedAmount ?? 0)}</p></article>
                <article className="rounded-2xl border border-border bg-background/60 p-4"><DollarSign size={18} className="text-muted-foreground" /><p className="mt-3 text-xs text-muted-foreground">Media spend</p><p className="mt-1 font-semibold">{money.format(overview?.wallet.spentAmount ?? 0)}</p></article>
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-emerald-600" /><div><p className="text-sm font-semibold">One clear control boundary</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Agents never spend more than the funded wallet. Content, communication, optimization and campaign decisions need no further approval.</p></div></div>
            </div>

            <div className="border-t border-border bg-background/40 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Add advertising budget</p>
              <label className="mt-5 block text-sm font-medium">Amount credited to ads</label>
              <div className="mt-2 flex items-center rounded-xl border border-border bg-card px-4"><span className="text-muted-foreground">¥</span><input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className="w-full bg-transparent px-3 py-3 text-lg font-semibold outline-none" aria-label="Ad spend amount in RMB" /></div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">{paymentMethods.map((method) => <button key={method.id} type="button" onClick={() => setPaymentMethod(method.id)} className={`rounded-xl border p-3 text-left transition ${paymentMethod === method.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:bg-secondary'}`}><span className="flex items-center gap-2 text-sm font-semibold">{method.id === 'card' ? <CreditCard size={15} /> : <QrCode size={15} />}{method.label}</span><span className="mt-1 block text-[11px] text-muted-foreground">{method.detail}</span></button>)}</div>
              <dl className="mt-5 space-y-2 rounded-xl border border-border bg-card p-4 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Ad spend</dt><dd>{money.format(normalizedAmount)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Lulu fee (4%)</dt><dd>{money.format(feeAmount)}</dd></div><div className="flex justify-between border-t border-border pt-2 font-semibold"><dt>Total charged</dt><dd>{money.format(totalAmount)}</dd></div></dl>
              <button type="button" onClick={() => void topUp()} disabled={!permissions.canAdminister || normalizedAmount < 1 || paying} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{paying ? <Loader2 className="animate-spin" size={16} /> : paymentMethod === 'card' ? <CreditCard size={16} /> : <QrCode size={16} />}{paying ? 'Creating payment…' : `Pay ${money.format(totalAmount)}`}</button>
              {!permissions.canAdminister && <p className="mt-2 text-xs text-muted-foreground">Only workspace owners and administrators can authorize new budget.</p>}
            </div>
          </div>
        </section>

        {activeTopup?.qrPayload && <section className="rounded-3xl border border-border bg-card p-6 text-center sm:p-8"><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Secure payment</p><h2 className="mt-2 text-xl font-semibold">Scan with {activeTopup.paymentMethod === 'alipaycn' ? 'Alipay' : 'WeChat Pay'}</h2>{qrImage && <img src={qrImage} alt="Payment QR code" className="mx-auto mt-5 h-[260px] w-[260px] rounded-2xl border border-border bg-white p-3" />}<p className="mt-4 text-sm text-muted-foreground">{activeTopup.status === 'SUCCEEDED' ? 'Payment confirmed. Lulu has started the advertising agents.' : 'Waiting securely for payment confirmation…'}</p>{activeTopup.status === 'SUCCEEDED' && <CheckCircle2 className="mx-auto mt-3 text-emerald-500" size={28} />}</section>}

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Budget records</p><p className="mt-2 text-2xl font-semibold">{items.length}</p></article>
          <article className="rounded-2xl border border-border bg-card p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Platforms</p><p className="mt-2 text-2xl font-semibold">{trackedPlatforms}</p></article>
          <article className="rounded-2xl border border-border bg-card p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Successful top-ups</p><p className="mt-2 text-2xl font-semibold">{overview?.topups.filter((topup) => topup.status === 'SUCCEEDED').length ?? 0}</p></article>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-4"><label className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2"><Search size={15} className="text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search live budget records" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label></div>
          {items.length === 0 ? <div className="p-10 text-center"><DollarSign className="mx-auto mb-4 text-muted-foreground" size={30} /><h2 className="text-xl font-semibold">No campaign budgets yet</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Once funded, Lulu creates and optimizes campaign allocations automatically across connected advertising platforms.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Budget</th><th className="px-4 py-3">Platform</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Budget value</th><th className="px-4 py-3">Spend</th><th className="px-4 py-3">Utilization</th><th className="px-4 py-3">Updated</th></tr></thead><tbody className="divide-y divide-border">{visibleItems.map((record) => <tr key={record.id}><td className="px-4 py-3 font-medium">{record.name}</td><td className="px-4 py-3 text-muted-foreground">{textValue(record.data?.platform) || '—'}</td><td className="px-4 py-3">{record.status || 'Recorded'}</td><td className="px-4 py-3">{textValue(record.data?.budget) || textValue(record.valueAmount) || '—'} {record.currency ?? ''}</td><td className="px-4 py-3 text-muted-foreground">{textValue(record.data?.spend) || '—'}</td><td className="px-4 py-3 text-muted-foreground">{textValue(record.data?.utilization) || '—'}</td><td className="px-4 py-3 text-muted-foreground">{new Date(record.updatedAt).toLocaleString()}</td></tr>)}</tbody></table></div>}
        </section>
      </div>
    </main>
  );
}

export default LuluBudgets;
