import { AlertTriangle, Ban, CalendarClock, CheckCircle2, CreditCard, DollarSign, KeyRound, Loader2, QrCode, RefreshCw, Search, ShieldCheck, Sparkles, WalletCards } from 'lucide-react';
import QRCode from 'qrcode';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { adSpendApi, type AdBudgetAuthorization, type AdSpendOverview, type AdSpendPaymentMethod, type AdSpendTopup } from '../../../../api/adspend';
import { getFriendlyErrorMessage } from '../../../../api/client';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';

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
const adSpendPackages=[1,10_000,25_000,50_000,90_000] as const;
function secureCheckoutUrl(value:string|null){if(!value)return null;try{const url=new URL(value);return url.protocol==='https:'?url.toString():null;}catch{return null;}}
function defaultAuthorizationEnd(){const value=new Date();value.setUTCDate(value.getUTCDate()+30);return value.toISOString().slice(0,10);}

export function LuluBudgets() {
  const { selectedWorkspace, permissions } = useLuluApp();
  const t = useTranslation();
  const workspaceId = selectedWorkspace?.id ?? null;
  const [query, setQuery] = useState('');
  const [loadedOverview, setLoadedOverview] = useState<AdSpendOverview | null>(null);
  const [loadedAuthorizations, setLoadedAuthorizations] = useState<AdBudgetAuthorization[]>([]);
  const [amount, setAmount] = useState('10000');
  const [paymentMethod, setPaymentMethod] = useState<AdSpendPaymentMethod>('card');
  const [activeTopup, setActiveTopup] = useState<AdSpendTopup | null>(null);
  const [qrImage, setQrImage] = useState('');
  const [walletLoading, setWalletLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentErrorState, setPaymentErrorState] = useState<{ workspaceId: string; message: string } | null>(null);
  const [authorizationForm, setAuthorizationForm] = useState({ accountId: '', campaignId: '', amount: '10000', endsOn: defaultAuthorizationEnd(), reason: '' });
  const [authorizationSaving, setAuthorizationSaving] = useState(false);
  const walletRequest = useRef(0);
  const actionRequest = useRef(0);
  const workspaceRef = useRef(workspaceId);
  workspaceRef.current = workspaceId;
  const overview = loadedOverview?.wallet.workspaceId === workspaceId ? loadedOverview : null;
  const authorizations = loadedAuthorizations.filter((authorization) => authorization.workspaceId === workspaceId);
  const currentTopup = activeTopup?.workspaceId === workspaceId ? activeTopup : null;
  const paymentError = paymentErrorState?.workspaceId === workspaceId ? paymentErrorState.message : '';
  const { items, loading, error, refresh } = useLiveRecords('ad_budgets');

  const loadWallet = useCallback(async () => {
    const request = ++walletRequest.current;
    const targetWorkspaceId = workspaceId;
    setWalletLoading(true);
    setLoadedOverview(null);
    setLoadedAuthorizations([]);
    setPaymentErrorState(null);
    if (!targetWorkspaceId) { setWalletLoading(false); return null; }
    try {
      const [walletResult, authorizationResult] = await Promise.all([
        adSpendApi.overview(targetWorkspaceId),
        adSpendApi.listBudgetAuthorizations(targetWorkspaceId),
      ]);
      if (request !== walletRequest.current || workspaceRef.current !== targetWorkspaceId) return null;
      if (walletResult.data.wallet.workspaceId !== targetWorkspaceId || authorizationResult.data.some((authorization) => authorization.workspaceId !== targetWorkspaceId)) {
        throw new Error('The advertising wallet response did not match the current workspace.');
      }
      setLoadedOverview(walletResult.data);
      setLoadedAuthorizations(authorizationResult.data);
      setPaymentErrorState(null);
      return walletResult.data;
    } catch (cause) {
      if (request === walletRequest.current && workspaceRef.current === targetWorkspaceId) {
        setPaymentErrorState({ workspaceId: targetWorkspaceId, message: getFriendlyErrorMessage(cause, 'The advertising wallet could not be loaded.') });
      }
      return null;
    } finally { if (request === walletRequest.current && workspaceRef.current === targetWorkspaceId) setWalletLoading(false); }
  }, [workspaceId]);

  useEffect(() => {
    actionRequest.current += 1;
    setActiveTopup(null);
    setQrImage('');
    setPaying(false);
    setAuthorizationSaving(false);
    void loadWallet();
    return () => { walletRequest.current += 1; actionRequest.current += 1; };
  }, [loadWallet]);

  useEffect(() => {
    if (!currentTopup?.qrPayload) { setQrImage(''); return; }
    let active = true;
    const targetWorkspaceId = workspaceId;
    void QRCode.toDataURL(currentTopup.qrPayload, { width: 260, margin: 1, errorCorrectionLevel: 'M' })
      .then((value) => { if (active && workspaceRef.current === targetWorkspaceId) setQrImage(value); })
      .catch(() => { if (active && targetWorkspaceId && workspaceRef.current === targetWorkspaceId) setPaymentErrorState({ workspaceId: targetWorkspaceId, message: 'The payment QR code could not be rendered.' }); });
    return () => { active = false; };
  }, [currentTopup?.qrPayload, workspaceId]);

  useEffect(() => {
    if (!workspaceId || !currentTopup || !['PENDING_PAYMENT', 'REQUIRES_CUSTOMER_ACTION'].includes(currentTopup.status)) return;
    let active = true;
    let polling = false;
    const targetWorkspaceId = workspaceId;
    const topupId = currentTopup.id;
    const poll = window.setInterval(async () => {
      if (polling) return;
      polling = true;
      try {
        const updated = (await adSpendApi.syncTopup(targetWorkspaceId, topupId)).data;
        if (!active || workspaceRef.current !== targetWorkspaceId || updated.workspaceId !== targetWorkspaceId) return;
        if (updated.status === 'SUCCEEDED') {
          await loadWallet();
          if (!active || workspaceRef.current !== targetWorkspaceId) return;
        }
        setActiveTopup(updated);
      } catch { /* Webhook remains authoritative; polling retries quietly. */ }
      finally { polling = false; }
    }, 3_000);
    return () => { active = false; window.clearInterval(poll); };
  }, [currentTopup?.id, currentTopup?.status, loadWallet, workspaceId]);

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
  const now = Date.now();
  const activeAuthorizations = authorizations.filter((authorization) => {
    const startsAt = Date.parse(authorization.startsAt);
    const endsAt = Date.parse(authorization.endsAt);
    return authorization.status === 'ACTIVE'
      && authorization.currency === overview?.wallet.currency
      && authorization.remainingAmount > 0
      && Number.isFinite(startsAt)
      && Number.isFinite(endsAt)
      && startsAt <= now
      && endsAt > now;
  });
  const reversalDebt = overview?.wallet.reversalDebtAmount ?? 0;
  const hasReversalDebt = reversalDebt > 0;
  const advertisingReady = Boolean(!hasReversalDebt && overview?.wallet.adsEnabled && activeAuthorizations.length > 0);
  const paymentResult = !overview
    ? t('Payment confirmed. Refresh to verify the current advertising wallet state.')
    : hasReversalDebt
      ? t('Payment confirmed and applied to the outstanding balance.')
      : advertisingReady
        ? t('Payment confirmed. Funds are available and authorized paid execution is active.')
        : overview.wallet.adsEnabled
          ? t('Payment confirmed. Funds are available; paid execution is waiting for a campaign budget authorization.')
          : t('Payment confirmed. No usable advertising balance remains.');

  async function topUp() {
    if (!workspaceId || normalizedAmount < 1 || paying) return;
    const request = ++actionRequest.current;
    const targetWorkspaceId = workspaceId;
    const targetPaymentMethod = paymentMethod;
    setPaying(true); setPaymentErrorState(null);
    try {
      const response = await adSpendApi.createTopup(targetWorkspaceId, {
        amount: normalizedAmount,
        paymentMethod: targetPaymentMethod,
        returnUrl: `${window.location.origin}${window.location.pathname}?adspend=return`,
      });
      const topup = response.data.topup;
      if (request !== actionRequest.current || workspaceRef.current !== targetWorkspaceId) return;
      if (topup.workspaceId !== targetWorkspaceId) throw new Error('The advertising payment response did not match the current workspace.');
      if (topup.status === 'SUCCEEDED') {
        await loadWallet();
        if (request !== actionRequest.current || workspaceRef.current !== targetWorkspaceId) return;
      }
      setActiveTopup(topup);
      if (targetPaymentMethod === 'card') {
        const checkout=secureCheckoutUrl(topup.checkoutUrl);
        if(!checkout)throw new Error('The secure checkout URL is missing.');
        window.location.assign(checkout);
      }
    } catch (cause) {
      if (request === actionRequest.current && workspaceRef.current === targetWorkspaceId) setPaymentErrorState({ workspaceId: targetWorkspaceId, message: getFriendlyErrorMessage(cause, 'The ad spend payment could not be created.') });
    } finally { if (request === actionRequest.current && workspaceRef.current === targetWorkspaceId) setPaying(false); }
  }

  async function authorizeCampaign() {
    if (!workspaceId || authorizationSaving || !permissions.canAdminister) return;
    const authorizedAmount = Number(authorizationForm.amount);
    const endsAt = new Date(`${authorizationForm.endsOn}T23:59:59.999Z`);
    if (!authorizationForm.accountId.trim() || !authorizationForm.campaignId.trim() || !Number.isFinite(authorizedAmount) || authorizedAmount <= 0 || Number.isNaN(endsAt.getTime())) {
      setPaymentErrorState({ workspaceId, message: 'Enter the Google Ads account, campaign, amount and authorization end date.' });
      return;
    }
    const request = ++actionRequest.current;
    const targetWorkspaceId = workspaceId;
    setAuthorizationSaving(true); setPaymentErrorState(null);
    try {
      const created = await adSpendApi.createBudgetAuthorization(targetWorkspaceId, {
        provider: 'google-ads',
        accountId: authorizationForm.accountId.trim().replace(/-/g, ''),
        campaignId: authorizationForm.campaignId.trim(),
        currency: 'CNY',
        amount: authorizedAmount,
        startsAt: new Date().toISOString(),
        endsAt: endsAt.toISOString(),
        idempotencyKey: crypto.randomUUID(),
        ...(authorizationForm.reason.trim() ? { reason: authorizationForm.reason.trim() } : {}),
      });
      if (request !== actionRequest.current || workspaceRef.current !== targetWorkspaceId) return;
      if (created.data.workspaceId !== targetWorkspaceId) throw new Error('The campaign authorization response did not match the current workspace.');
      setAuthorizationForm((current) => ({ ...current, campaignId: '', reason: '' }));
      await loadWallet();
    } catch (cause) {
      if (request === actionRequest.current && workspaceRef.current === targetWorkspaceId) setPaymentErrorState({ workspaceId: targetWorkspaceId, message: getFriendlyErrorMessage(cause, 'The campaign budget authorization could not be saved.') });
    } finally { if (request === actionRequest.current && workspaceRef.current === targetWorkspaceId) setAuthorizationSaving(false); }
  }

  async function revokeAuthorization(authorizationId: string) {
    if (!workspaceId || authorizationSaving || !permissions.canAdminister) return;
    const request = ++actionRequest.current;
    const targetWorkspaceId = workspaceId;
    setAuthorizationSaving(true); setPaymentErrorState(null);
    try {
      const revoked = await adSpendApi.revokeBudgetAuthorization(targetWorkspaceId, authorizationId, 'Revoked by workspace administrator');
      if (request !== actionRequest.current || workspaceRef.current !== targetWorkspaceId) return;
      if (revoked.data.workspaceId !== targetWorkspaceId) throw new Error('The campaign authorization response did not match the current workspace.');
      await loadWallet();
    } catch (cause) {
      if (request === actionRequest.current && workspaceRef.current === targetWorkspaceId) setPaymentErrorState({ workspaceId: targetWorkspaceId, message: getFriendlyErrorMessage(cause, 'The campaign budget authorization could not be revoked.') });
    } finally { if (request === actionRequest.current && workspaceRef.current === targetWorkspaceId) setAuthorizationSaving(false); }
  }

  if (loading || walletLoading || Boolean(workspaceId && !overview && !paymentError)) {
    return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground"><Loader2 className="animate-spin" size={22} />Loading advertising wallet…</main>;
  }

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-xs uppercase tracking-[.18em] text-muted-foreground">Advertising / Autonomous execution</p><h1 className="mt-2 text-3xl font-bold">Fund the wallet. Authorize the campaign. Lulu executes.</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Wallet funds and campaign authority are separate. Lulu can optimize autonomously, but it can never create or increase a campaign budget beyond the exact scope you authorize.</p></div>
          <button type="button" onClick={() => void Promise.all([refresh(), loadWallet()])} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"><RefreshCw size={15} />Refresh</button>
        </header>

        {(error || paymentError) && <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{paymentError || error}</div>}
        {hasReversalDebt && <div className="flex items-start gap-3 rounded-2xl border border-amber-500/35 bg-amber-500/10 px-4 py-4 text-amber-950 dark:text-amber-100" role="alert"><AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={20} /><div><p className="text-sm font-semibold">Paid advertising is paused after a payment reversal</p><p className="mt-1 text-xs leading-5">Outstanding chargeback or refund balance: {money.format(reversalDebt)}. New top-ups and released reservations settle this balance first; existing reservations remain traceable and no new campaign spend can begin until it reaches zero.</p></div></div>}

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid lg:grid-cols-[1.1fr_.9fr]">
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Available ad spend</p><p className="mt-3 text-4xl font-bold tracking-tight">{money.format(overview?.wallet.availableAmount ?? 0)}</p></div><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${advertisingReady ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}><span className={`h-2 w-2 rounded-full ${advertisingReady ? 'bg-emerald-500' : 'bg-amber-500'}`} />{advertisingReady ? 'Authorized execution active' : hasReversalDebt ? 'Payment reversal balance due' : overview?.wallet.adsEnabled ? 'Campaign authority required' : 'Waiting for funds'}</span></div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <article className="rounded-2xl border border-border bg-background/60 p-4"><WalletCards size={18} className="text-muted-foreground" /><p className="mt-3 text-xs text-muted-foreground">Lifetime funded</p><p className="mt-1 font-semibold">{money.format(overview?.wallet.totalFundedAmount ?? 0)}</p></article>
                <article className="rounded-2xl border border-border bg-background/60 p-4"><Sparkles size={18} className="text-muted-foreground" /><p className="mt-3 text-xs text-muted-foreground">Reserved by agents</p><p className="mt-1 font-semibold">{money.format(overview?.wallet.reservedAmount ?? 0)}</p></article>
                <article className="rounded-2xl border border-border bg-background/60 p-4"><DollarSign size={18} className="text-muted-foreground" /><p className="mt-3 text-xs text-muted-foreground">Media spend</p><p className="mt-1 font-semibold">{money.format(overview?.wallet.spentAmount ?? 0)}</p></article>
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-emerald-600" /><div><p className="text-sm font-semibold">Budget is the hard control boundary</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Every paid launch must match an active authorization for the exact provider, account, campaign, currency, period and maximum amount. All other routine execution remains hands-off.</p></div></div>
            </div>

            <div className="border-t border-border bg-background/40 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Add advertising budget</p>
              <label className="mt-5 block text-sm font-medium">Amount credited to ads</label>
              <div className="mt-2 grid grid-cols-2 gap-2">{adSpendPackages.map(value=><button key={value} type="button" onClick={()=>setAmount(String(value))} className={`rounded-xl border px-3 py-3 text-sm font-semibold ${normalizedAmount===value?'border-primary bg-primary text-primary-foreground':'border-border bg-card hover:bg-secondary'}`}>{money.format(value)}</button>)}</div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">{paymentMethods.map((method) => <button key={method.id} type="button" onClick={() => setPaymentMethod(method.id)} className={`rounded-xl border p-3 text-left transition ${paymentMethod === method.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:bg-secondary'}`}><span className="flex items-center gap-2 text-sm font-semibold">{method.id === 'card' ? <CreditCard size={15} /> : <QrCode size={15} />}{method.label}</span><span className="mt-1 block text-[11px] text-muted-foreground">{method.detail}</span></button>)}</div>
              <dl className="mt-5 space-y-2 rounded-xl border border-border bg-card p-4 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Ad spend</dt><dd>{money.format(normalizedAmount)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Lulu fee (4%)</dt><dd>{money.format(feeAmount)}</dd></div><div className="flex justify-between border-t border-border pt-2 font-semibold"><dt>Total charged</dt><dd>{money.format(totalAmount)}</dd></div></dl>
              <button type="button" onClick={() => void topUp()} disabled={!permissions.canAdminister || normalizedAmount < 1 || paying} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{paying ? <Loader2 className="animate-spin" size={16} /> : paymentMethod === 'card' ? <CreditCard size={16} /> : <QrCode size={16} />}{paying ? 'Creating payment…' : `Pay ${money.format(totalAmount)}`}</button>
              {!permissions.canAdminister && <p className="mt-2 text-xs text-muted-foreground">Only workspace owners and administrators can authorize new budget.</p>}
            </div>
          </div>
        </section>

        {currentTopup?.qrPayload && <section className="rounded-3xl border border-border bg-card p-6 text-center sm:p-8"><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Secure payment</p><h2 className="mt-2 text-xl font-semibold">Scan with {currentTopup.paymentMethod === 'alipaycn' ? 'Alipay' : 'WeChat Pay'}</h2>{qrImage && <img src={qrImage} alt="Payment QR code" className="mx-auto mt-5 h-[260px] w-[260px] rounded-2xl border border-border bg-white p-3" />}<p className={`mt-4 text-sm ${advertisingReady ? 'text-emerald-600' : 'text-muted-foreground'}`}>{currentTopup.status === 'SUCCEEDED' ? paymentResult : 'Waiting securely for payment confirmation…'}</p>{currentTopup.status === 'SUCCEEDED' && (advertisingReady ? <CheckCircle2 className="mx-auto mt-3 text-emerald-500" size={28} /> : <AlertTriangle className="mx-auto mt-3 text-amber-500" size={28} />)}</section>}

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-6 sm:p-8"><div className="flex items-start gap-3"><KeyRound className="mt-1 shrink-0 text-primary" size={21} /><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Customer budget authority</p><h2 className="mt-2 text-xl font-semibold">Authorize an exact Google Ads campaign</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">This is the only decision Lulu will not make for you. The authorization is scoped and enforced server-side; a wallet balance alone can never launch or increase a campaign.</p></div></div></div>
          <div className="grid lg:grid-cols-[.9fr_1.1fr]">
            <div className="space-y-4 border-b border-border bg-background/40 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">Google Ads customer ID<input value={authorizationForm.accountId} onChange={(event)=>setAuthorizationForm((current)=>({...current,accountId:event.target.value}))} placeholder="1234567890" className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
                <label className="text-sm font-medium">Campaign ID<input value={authorizationForm.campaignId} onChange={(event)=>setAuthorizationForm((current)=>({...current,campaignId:event.target.value}))} placeholder="987654321" className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
                <label className="text-sm font-medium">Maximum amount (CNY)<input type="number" min="1" step="0.01" value={authorizationForm.amount} onChange={(event)=>setAuthorizationForm((current)=>({...current,amount:event.target.value}))} className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
                <label className="text-sm font-medium">Valid through<input type="date" value={authorizationForm.endsOn} onChange={(event)=>setAuthorizationForm((current)=>({...current,endsOn:event.target.value}))} className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
              </div>
              <label className="block text-sm font-medium">Reason or campaign context <span className="font-normal text-muted-foreground">(optional)</span><textarea value={authorizationForm.reason} onChange={(event)=>setAuthorizationForm((current)=>({...current,reason:event.target.value}))} maxLength={2000} rows={3} placeholder="Launch scope, market or business objective" className="mt-2 w-full resize-y rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
              <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"><CalendarClock className="mt-0.5 shrink-0" size={15} />Only CNY Google Ads accounts are enabled until a verified foreign-exchange layer is connected. Unsupported account currencies fail closed before any funds are reserved.</p>
              <button type="button" onClick={()=>void authorizeCampaign()} disabled={!permissions.canAdminister||authorizationSaving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{authorizationSaving?<Loader2 className="animate-spin" size={16}/>:<ShieldCheck size={16}/>}Authorize campaign budget</button>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Campaign authorizations</p><p className="mt-1 text-xs text-muted-foreground">{activeAuthorizations.length} active with remaining authority</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{authorizations.length} total</span></div>
              {authorizations.length===0?<div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center"><KeyRound className="mx-auto text-muted-foreground" size={25}/><p className="mt-3 text-sm font-semibold">No campaign is authorized</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Paid execution remains paused even when the wallet contains funds.</p></div>:<div className="mt-5 space-y-3">{authorizations.map((authorization)=><article key={authorization.id} className="rounded-2xl border border-border bg-background/40 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">Campaign {authorization.campaignId}</p><p className="mt-1 truncate text-xs text-muted-foreground">Account {authorization.accountId} · {authorization.provider}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${authorization.status==='ACTIVE'?'bg-emerald-500/10 text-emerald-600':'bg-secondary text-muted-foreground'}`}>{authorization.status}</span></div><div className="mt-4 grid grid-cols-3 gap-3 text-xs"><div><span className="block text-muted-foreground">Authorized</span><strong className="mt-1 block">{money.format(authorization.authorizedAmount)}</strong></div><div><span className="block text-muted-foreground">Remaining</span><strong className="mt-1 block">{money.format(authorization.remainingAmount)}</strong></div><div><span className="block text-muted-foreground">Ends</span><strong className="mt-1 block">{new Date(authorization.endsAt).toLocaleDateString()}</strong></div></div>{authorization.status==='ACTIVE'&&<button type="button" onClick={()=>void revokeAuthorization(authorization.id)} disabled={!permissions.canAdminister||authorizationSaving||authorization.reservedAmount>0} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-destructive disabled:opacity-40"><Ban size={14}/>Revoke authorization</button>}</article>)}</div>}
            </div>
          </div>
        </section>

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
