import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  DollarSign,
  LoaderCircle,
  QrCode,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import QRCode from "qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  adSpendApi,
  type AdSpendOverview,
  type AdSpendPaymentMethod,
  type AdSpendTopup,
} from "../api/adspend";
import { getFriendlyErrorMessage } from "../api/client";
import { useLuluApp } from "../api/LuluAppContext";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";

const packages = [1, 10_000, 25_000, 50_000, 90_000];
const methods: Array<{ id: AdSpendPaymentMethod; label: string; detail: string }> = [
  { id: "card", label: "Bank card", detail: "Secure hosted checkout" },
  { id: "alipaycn", label: "Alipay", detail: "Scan a secure QR code" },
  { id: "wechatpay", label: "WeChat Pay", detail: "Scan a secure QR code" },
];
const money = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "CNY",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 2,
});

function secureCheckoutUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function AdSpendWalletPanel() {
  const { selectedWorkspace, can } = useLuluApp();
  const t = useTranslation();
  const workspaceId = selectedWorkspace?.id ?? null;
  const [overview, setOverview] = useState<AdSpendOverview | null>(null);
  const [amount, setAmount] = useState(10_000);
  const [method, setMethod] = useState<AdSpendPaymentMethod>("card");
  const [topup, setTopup] = useState<AdSpendTopup | null>(null);
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const loadRequest = useRef(0);
  const actionRequest = useRef(0);
  const workspaceRef = useRef(workspaceId);
  workspaceRef.current = workspaceId;

  const load = useCallback(async () => {
    const request = ++loadRequest.current;
    const targetWorkspaceId = workspaceId;
    setLoading(true);
    setError("");
    setOverview(null);
    if (!targetWorkspaceId) {
      setLoading(false);
      return;
    }
    try {
      const result = (await adSpendApi.overview(targetWorkspaceId)).data;
      if (request !== loadRequest.current || workspaceRef.current !== targetWorkspaceId) return;
      if (result.wallet.workspaceId !== targetWorkspaceId) {
        throw new Error("The advertising wallet response did not match the current workspace.");
      }
      setOverview(result);
    } catch (cause) {
      if (request === loadRequest.current && workspaceRef.current === targetWorkspaceId) {
        setError(getFriendlyErrorMessage(cause, t("The advertising wallet could not be loaded.")));
      }
    } finally {
      if (request === loadRequest.current && workspaceRef.current === targetWorkspaceId) setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    actionRequest.current += 1;
    setTopup(null);
    setQr("");
    setPaying(false);
    void load();
    return () => {
      loadRequest.current += 1;
      actionRequest.current += 1;
    };
  }, [load]);

  useEffect(() => {
    if (!topup?.qrPayload) {
      setQr("");
      return;
    }
    let active = true;
    const targetWorkspaceId = workspaceId;
    void QRCode.toDataURL(topup.qrPayload, { width: 240, margin: 1, errorCorrectionLevel: "M" })
      .then((value) => {
        if (active && workspaceRef.current === targetWorkspaceId) setQr(value);
      })
      .catch(() => {
        if (active && workspaceRef.current === targetWorkspaceId) setError(t("The advertising payment QR code could not be rendered."));
      });
    return () => {
      active = false;
    };
  }, [topup?.qrPayload, workspaceId]);

  useEffect(() => {
    if (!workspaceId || !topup || !["PENDING_PAYMENT", "REQUIRES_CUSTOMER_ACTION"].includes(topup.status)) return;
    let active = true;
    let polling = false;
    const targetWorkspaceId = workspaceId;
    const topupId = topup.id;
    const timer = window.setInterval(async () => {
      if (polling) return;
      polling = true;
      try {
        const updated = (await adSpendApi.syncTopup(targetWorkspaceId, topupId)).data;
        if (!active || workspaceRef.current !== targetWorkspaceId || updated.workspaceId !== targetWorkspaceId) return;
        setTopup(updated);
        if (updated.status === "SUCCEEDED") await load();
      } catch {
        // The webhook remains authoritative; the next poll retries quietly.
      } finally {
        polling = false;
      }
    }, 3_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [load, topup?.id, topup?.status, workspaceId]);

  const fee = Math.round(amount * 0.04 * 100) / 100;
  const total = Math.round((amount + fee) * 100) / 100;
  const wallet = overview?.wallet;
  const ready = Boolean(wallet?.adsEnabled && wallet.availableAmount > 0 && wallet.reversalDebtAmount === 0);

  async function pay() {
    if (!workspaceId || !can("administer") || paying || amount < 1) return;
    const request = ++actionRequest.current;
    const targetWorkspaceId = workspaceId;
    const targetMethod = method;
    setPaying(true);
    setError("");
    try {
      const result = (await adSpendApi.createTopup(targetWorkspaceId, {
        amount,
        paymentMethod: targetMethod,
        returnUrl: `${window.location.origin}${window.location.pathname}?adspend=return`,
      })).data.topup;
      if (request !== actionRequest.current || workspaceRef.current !== targetWorkspaceId) return;
      setTopup(result);
      if (targetMethod === "card") {
        const checkout = secureCheckoutUrl(result.checkoutUrl);
        if (!checkout) throw new Error("The secure advertising checkout URL is missing.");
        window.location.assign(checkout);
      } else if (result.status === "SUCCEEDED") {
        await load();
      }
    } catch (cause) {
      if (request === actionRequest.current && workspaceRef.current === targetWorkspaceId) {
        setError(getFriendlyErrorMessage(cause, t("The advertising budget payment could not be created.")));
      }
    } finally {
      if (request === actionRequest.current && workspaceRef.current === targetWorkspaceId) setPaying(false);
    }
  }

  return (
    <section className="mb-6 overflow-hidden rounded-3xl border border-sky-500/20 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,.14),transparent_48%),var(--card)] shadow-sm">
      <div className="grid lg:grid-cols-[.9fr_1.1fr]">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-sky-700"><DollarSign size={18} /><p className="text-xs font-semibold uppercase tracking-[.18em]">{t("Prepaid advertising")}</p></div>
          <h2 className="mt-3 text-2xl font-semibold">{t("Ads budget wallet")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("Advertising has its own prepaid balance. It is completely separate from AI/API funds and Cloudflare R2 storage.")}</p>
          <p className="mt-7 text-xs uppercase tracking-[.15em] text-muted-foreground">{t("Available budget")}</p>
          <p className="mt-2 text-4xl font-semibold">{loading ? "—" : money.format(wallet?.availableAmount ?? 0)}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl border border-border bg-background/50 p-3"><span className="text-muted-foreground">{t("reserved")}</span><strong className="mt-1 block text-sm">{money.format(wallet?.reservedAmount ?? 0)}</strong></div>
            <div className="rounded-xl border border-border bg-background/50 p-3"><span className="text-muted-foreground">{t("Spent")}</span><strong className="mt-1 block text-sm">{money.format(wallet?.spentAmount ?? 0)}</strong></div>
            <div className="rounded-xl border border-border bg-background/50 p-3"><span className="text-muted-foreground">{t("Funded")}</span><strong className="mt-1 block text-sm">{money.format(wallet?.totalFundedAmount ?? 0)}</strong></div>
          </div>
          <span className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${ready ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}`}><span className={`h-2 w-2 rounded-full ${ready ? "bg-emerald-500" : "bg-amber-500"}`} />{ready ? t("Paid execution can run") : t("Waiting for confirmed ad funds")}</span>
          <div className="mt-5 flex items-start gap-2 rounded-xl bg-secondary p-3 text-xs leading-5 text-muted-foreground"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-foreground" />{t("Lulu can optimize campaigns autonomously, but it can never spend beyond the prepaid wallet and the customer-authorized campaign limit.")}</div>
        </div>
        <div className="border-t border-border bg-background/40 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">{t("Add advertising budget")}</p>
          <p className="mt-2 text-sm text-muted-foreground">The selected amount is credited to ads. A 4% Lulu service fee is charged on top.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">{packages.map((value) => <button key={value} type="button" onClick={() => setAmount(value)} className={`rounded-xl border px-3 py-3 text-sm font-semibold ${amount === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}>{money.format(value)}</button>)}</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">{methods.map((item) => <button key={item.id} type="button" onClick={() => setMethod(item.id)} className={`rounded-xl border p-3 text-left text-sm ${method === item.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:bg-secondary"}`}>{item.id === "card" ? <CreditCard size={15} /> : <QrCode size={15} />}<span className="mt-1 block font-semibold">{item.label}</span><span className="mt-1 block text-[11px] text-muted-foreground">{item.detail}</span></button>)}</div>
          <dl className="mt-4 space-y-2 rounded-xl border border-border bg-card p-4 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">{t("Ad budget credited")}</dt><dd>{money.format(amount)}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">{t("Lulu fee (4%)")}</dt><dd>{money.format(fee)}</dd></div><div className="flex justify-between border-t border-border pt-2 font-semibold"><dt>{t("Total charged")}</dt><dd>{money.format(total)}</dd></div></dl>
          {error && <p className="mt-3 flex items-start gap-2 text-sm text-destructive"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{error}</p>}
          <button type="button" onClick={() => void pay()} disabled={!can("administer") || paying || loading} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">{paying ? <LoaderCircle className="animate-spin" size={16} /> : method === "card" ? <WalletCards size={16} /> : <QrCode size={16} />}{paying ? "Creating payment…" : `Pay ${money.format(total)}`}</button>
          {!can("administer") && <p className="mt-2 text-xs text-muted-foreground">{t("Only workspace owners and administrators can add advertising budget.")}</p>}
        </div>
      </div>
      {topup?.qrPayload && <div className="border-t border-border p-6 text-center"><h3 className="font-semibold">Scan with {topup.paymentMethod === "alipaycn" ? "Alipay" : "WeChat Pay"}</h3>{qr && <img src={qr} alt={t("Advertising budget payment QR code")} className="mx-auto mt-4 h-60 w-60 rounded-xl border bg-white p-3" />}<p className="mt-3 text-sm text-muted-foreground">{topup.status === "SUCCEEDED" ? <span className="inline-flex items-center gap-2 text-emerald-700"><CheckCircle2 size={16} />{t("Advertising budget credited.")}</span> : t("Waiting for confirmed payment…")}</p></div>}
    </section>
  );
}
