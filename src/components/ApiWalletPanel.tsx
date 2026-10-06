import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  QrCode,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  apiWalletApi,
  type ApiPaymentMethod,
  type ApiTopup,
  type ApiWalletOverview,
} from "../api/api-wallet";
import { getFriendlyErrorMessage } from "../api/client";
import { useLuluApp } from "../api/LuluAppContext";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";
import { currentIntlLocale } from "../i18n/languages";
import { createPaymentQrDataUrl } from "../utils/paymentQr";
import { formatDecimalMoney, isPositiveDecimal } from "../utils/decimal-money";
import { navigateApp, routes } from "../routing";
const packages = ["500.00", "1000.00"];
const methods: Array<{ id: ApiPaymentMethod; label: string }> = [
  { id: "alipaycn", label: "Alipay" },
  { id: "wechatpay", label: "WeChat Pay" },
];
function formatMoney(value: string) {
  return formatDecimalMoney(value, "CNY", currentIntlLocale());
}
export function ApiWalletPanel() {
  const { selectedWorkspace, can, refresh } = useLuluApp();
  const t = useTranslation();
  const workspaceId = selectedWorkspace?.id ?? null;
  const [overview, setOverview] = useState<ApiWalletOverview | null>(null);
  const [amount, setAmount] = useState("1000.00");
  const [method, setMethod] = useState<ApiPaymentMethod>("alipaycn");
  const [topup, setTopup] = useState<ApiTopup | null>(null);
  const [topupWorkspaceId, setTopupWorkspaceId] = useState<string | null>(null);
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [generationOpening, setGenerationOpening] = useState(false);
  const [generationOpen, setGenerationOpen] = useState(false);
  const [errorState, setErrorState] = useState<{
    workspaceId: string;
    message: string;
  } | null>(null);
  const loadRequest = useRef(0);
  const paymentRequest = useRef(0);
  const workspaceRef = useRef(workspaceId);
  workspaceRef.current = workspaceId;
  const currentOverview =
    overview?.wallet.workspaceId === workspaceId ? overview : null;
  const availablePackages = currentOverview?.packages?.length ? currentOverview.packages : packages;
  const currentTopup = topupWorkspaceId === workspaceId ? topup : null;
  const generationStorageKey = workspaceId ? `lulu.ai-generation-popup.${workspaceId}` : null;
  const error =
    errorState?.workspaceId === workspaceId ? errorState.message : "";
  const reversalDebt = currentOverview?.wallet.reversalDebtAmount ?? "0.000000";
  const hasReversalDebt = isPositiveDecimal(reversalDebt);
  const aiReady = Boolean(
    currentOverview?.wallet.aiEnabled && !hasReversalDebt,
  );
  const displayLoading =
    loading || Boolean(workspaceId && !currentOverview && !error);
  const load = useCallback(async () => {
    const request = ++loadRequest.current;
    const targetWorkspaceId = workspaceId;
    setLoading(true);
    setOverview(null);
    setErrorState(null);
    if (!targetWorkspaceId) {
      setLoading(false);
      return null;
    }
    try {
      const result = (await apiWalletApi.overview(targetWorkspaceId)).data;
      if (
        request !== loadRequest.current ||
        workspaceRef.current !== targetWorkspaceId
      )
        return null;
      if (result.wallet.workspaceId !== targetWorkspaceId)
        throw new Error(
          "The AI wallet response did not match the current workspace.",
        );
      setOverview(result);
      return result;
    } catch (cause) {
      if (
        request === loadRequest.current &&
        workspaceRef.current === targetWorkspaceId
      )
        setErrorState({
          workspaceId: targetWorkspaceId,
          message: getFriendlyErrorMessage(
            cause,
            "The AI wallet could not be loaded.",
          ),
        });
      return null;
    } finally {
      if (
        request === loadRequest.current &&
        workspaceRef.current === targetWorkspaceId
      )
        setLoading(false);
    }
  }, [workspaceId]);
  const showGenerationStarted = useCallback(async () => {
    if (!workspaceId) return;
    setGenerationOpening(true);
    try {
      // Refresh the authoritative workspace capability before exposing the
      // platform button. Otherwise a fast click can race the route guard and
      // send the newly funded customer back to the funding page once more.
      await refresh();
      if (workspaceRef.current !== workspaceId) return;
      if (generationStorageKey) window.sessionStorage.removeItem(generationStorageKey);
      setGenerationOpen(true);
    } finally {
      if (workspaceRef.current === workspaceId) setGenerationOpening(false);
    }
  }, [generationStorageKey, refresh, workspaceId]);
  useEffect(() => {
    paymentRequest.current += 1;
    setTopup(null);
    setTopupWorkspaceId(null);
    setQr("");
    setPaying(false);
    setGenerationOpening(false);
    setGenerationOpen(false);
    void load();
    return () => {
      loadRequest.current += 1;
      paymentRequest.current += 1;
    };
  }, [load]);
  useEffect(() => {
    if (!currentOverview?.wallet.aiEnabled || !generationStorageKey) return;
    if (window.sessionStorage.getItem(generationStorageKey) !== "pending") return;
    void showGenerationStarted();
  }, [currentOverview?.wallet.aiEnabled, generationStorageKey, showGenerationStarted]);
  useEffect(() => {
    if (availablePackages.includes(amount)) return;
    const nextAmount = availablePackages[availablePackages.length - 1];
    setAmount(nextAmount);
  }, [amount, availablePackages]);
  useEffect(() => {
    if (!currentTopup?.qrPayload) {
      setQr("");
      return;
    }
    let active = true;
    const targetWorkspaceId = workspaceId;
    void createPaymentQrDataUrl(currentTopup.qrPayload)
      .then((value) => {
        if (active && workspaceRef.current === targetWorkspaceId) setQr(value);
      })
      .catch(() => {
        if (
          active &&
          targetWorkspaceId &&
          workspaceRef.current === targetWorkspaceId
        )
          setErrorState({
            workspaceId: targetWorkspaceId,
            message: "The payment QR code could not be rendered.",
          });
      });
    return () => {
      active = false;
    };
  }, [currentTopup?.qrPayload, workspaceId]);
  useEffect(() => {
    if (
      !workspaceId ||
      !currentTopup ||
      !["PENDING_PAYMENT", "REQUIRES_CUSTOMER_ACTION"].includes(
        currentTopup.status,
      )
    )
      return;
    let active = true;
    let polling = false;
    const targetWorkspaceId = workspaceId;
    const topupId = currentTopup.id;
    const timer = window.setInterval(async () => {
      if (polling) return;
      polling = true;
      try {
        const current = (
          await apiWalletApi.syncTopup(targetWorkspaceId, topupId)
        ).data;
        if (!active || workspaceRef.current !== targetWorkspaceId) return;
        if (current.status === "SUCCEEDED") {
          await load();
          if (!active || workspaceRef.current !== targetWorkspaceId) return;
          await showGenerationStarted();
        }
        setTopup(current);
        setTopupWorkspaceId(targetWorkspaceId);
      } catch {
        /* webhook stays authoritative */
      } finally {
        polling = false;
      }
    }, 3000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [currentTopup?.id, currentTopup?.status, load, showGenerationStarted, workspaceId]);
  async function pay() {
    if (!workspaceId || paying) return;
    const request = ++paymentRequest.current;
    const targetWorkspaceId = workspaceId;
    const targetMethod = method;
    setPaying(true);
    setErrorState(null);
    try {
      const result = (
        await apiWalletApi.createTopup(targetWorkspaceId, {
          amount,
          paymentMethod: targetMethod,
          returnUrl: `${window.location.origin}${window.location.pathname}?api-wallet=return`,
        })
      ).data.topup;
      if (
        request !== paymentRequest.current ||
        workspaceRef.current !== targetWorkspaceId
      )
        return;
      if (result.status === "SUCCEEDED") {
        await load();
        if (
          request !== paymentRequest.current ||
          workspaceRef.current !== targetWorkspaceId
        )
          return;
        await showGenerationStarted();
      }
      setTopup(result);
      setTopupWorkspaceId(targetWorkspaceId);
    } catch (cause) {
      if (
        request === paymentRequest.current &&
        workspaceRef.current === targetWorkspaceId
      )
        setErrorState({
          workspaceId: targetWorkspaceId,
          message: getFriendlyErrorMessage(
            cause,
            "The AI balance payment could not be created.",
          ),
        });
    } finally {
      if (
        request === paymentRequest.current &&
        workspaceRef.current === targetWorkspaceId
      )
        setPaying(false);
    }
  }
  const paymentResult = hasReversalDebt
    ? t("Payment confirmed and applied to the outstanding balance.")
    : aiReady
      ? t("Balance credited. Agents can execute.")
      : currentOverview
        ? t("Payment confirmed. No usable AI balance remains.")
        : t(
            "Payment confirmed. Refresh to verify the current AI wallet state.",
          );
  const paymentResultTone = aiReady ? "text-emerald-700" : "text-amber-700";
  const wallet = currentOverview?.wallet;
  const topups = currentOverview?.topups ?? [];
  const statusLabel = (status: string) => {
    if (status === "SUCCEEDED") return t("Confirmed");
    if (["PENDING_PAYMENT", "REQUIRES_CUSTOMER_ACTION"].includes(status)) return t("Pending");
    if (["FAILED", "CANCELLED", "REVERSED"].includes(status)) return t("Not completed");
    return status.replaceAll("_", " ");
  };
  const methodLabel = (value: ApiTopup["paymentMethod"]) => value === "legacy" ? t("Legacy payment") : methods.find((item) => item.id === value)?.label ?? value;
  const formatDate = (value: string | null) => {
    if (!value) return "—";
    try { return new Intl.DateTimeFormat(currentIntlLocale(), { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
    catch { return value; }
  };
  return (
    <section className="overflow-hidden rounded-3xl border border-violet-500/20 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,.14),transparent_48%),var(--card)] shadow-sm">
      {hasReversalDebt ? (
        <div
          className="flex items-start gap-3 border-b border-amber-500/30 bg-amber-500/10 p-4 text-amber-950 dark:text-amber-100"
          role="alert"
        >
          <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={19} />
          <div>
            <p className="text-sm font-semibold">
              AI execution is paused after a payment reversal
            </p>
            <p className="mt-1 text-xs leading-5">
              Outstanding chargeback or refund balance:{" "}
              {formatMoney(reversalDebt)}. New top-ups settle this amount
              first; agents resume automatically only when the balance is fully
              covered and usable credit remains.
            </p>
          </div>
        </div>
      ) : null}
      <div className="grid 2xl:grid-cols-[.9fr_1.1fr]">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-violet-700">
            <Sparkles size={18} />
            <p className="text-xs font-semibold uppercase tracking-[.18em]">
              Prepaid AI execution
            </p>
          </div>
          <h2 className="mt-3 text-2xl font-semibold">AI wallet</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            AI, agents and premium media execute only against confirmed balance.
            There is no API PAYG invoice.
          </p>
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{t("Available now")}</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-700">{displayLoading ? "—" : formatMoney(wallet?.availableAmount ?? "0.000000")}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("Ready to use for new AI work")}</p>
            </div>
            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{t("Reserved for payment")}</p>
              <p className="mt-2 text-2xl font-semibold text-sky-700">{displayLoading ? "—" : formatMoney(wallet?.paymentReservedAmount ?? "0.000000")}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("Paid deposits awaiting Airwallex confirmation")}</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{t("Reserved for AI work")}</p>
              <p className="mt-2 text-2xl font-semibold text-amber-700">{displayLoading ? "—" : formatMoney(wallet?.reservedAmount ?? "0.000000")}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("Held for work in progress")}</p>
            </div>
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{t("Actually spent")}</p>
              <p className="mt-2 text-2xl font-semibold text-violet-700">{displayLoading ? "—" : formatMoney(wallet?.spentAmount ?? "0.000000")}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("Settled provider costs")}</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">{t("Available funds can be used immediately. Payment reserves are not spendable until Airwallex confirms the payment. AI work reserves are held for active work. Actually spent is the confirmed provider cost.")}</p>
          <span
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${aiReady ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${aiReady ? "bg-emerald-500" : "bg-amber-500"}`}
            />
            {hasReversalDebt
              ? "Payment reversal balance due"
              : aiReady
                ? "Agentic execution active"
                : "Waiting for AI funds"}
          </span>
        </div>
        <div className="border-t border-border bg-background/40 p-6 sm:p-8 2xl:border-l 2xl:border-t-0">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">
            Add AI balance
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {availablePackages.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value)}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold ${amount === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}
              >
                {formatMoney(value)}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {methods.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMethod(item.id)}
                className={`rounded-xl border p-3 text-left text-sm ${method === item.id ? "border-primary bg-primary/5" : "border-border bg-card"}`}
              >
                <QrCode size={15} />
                <span className="mt-1 block font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
          {error ? (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          ) : null}
          <button
            type="button"
            onClick={() => void pay()}
            disabled={!can("administer") || paying || generationOpening}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            {paying || generationOpening ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : (
              <WalletCards size={16} />
            )}
            {generationOpening ? t("Activating Lulu…") : `Pay ${formatMoney(amount)}`}
          </button>
        </div>
      </div>
      {currentTopup?.qrPayload ? (
        <div className="border-t border-border p-6 text-center">
          <h3 className="font-semibold">
            Scan with{" "}
            {currentTopup.paymentMethod === "alipaycn"
              ? "Alipay"
              : "WeChat Pay"}
          </h3>
          {qr ? (
            <div className="mx-auto mt-4 w-fit max-w-full rounded-xl border bg-white p-4"><img src={qr} alt="AI balance payment QR code" className="block h-auto w-[280px] max-w-full" /></div>
          ) : null}
          <p className="mt-3 text-sm text-muted-foreground">
            {currentTopup.status === "SUCCEEDED" ? (
              <span
                className={`inline-flex items-center gap-2 ${paymentResultTone}`}
              >
                {aiReady ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertTriangle size={16} />
                )}{" "}
                {paymentResult}
              </span>
            ) : (
              "Waiting for confirmed payment…"
            )}
          </p>
        </div>
      ) : null}
      {generationOpen ? (
        <div className="fixed inset-0 z-[130] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="ai-generation-started-title" className="w-full max-w-lg rounded-2xl border border-border bg-card p-7 text-foreground shadow-2xl">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/10 text-violet-700"><Sparkles size={23} /></div>
            <h2 id="ai-generation-started-title" className="mt-5 text-2xl font-semibold">{t("Budget confirmed — Lulu is getting to work")}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("Your Knowledge Base, initial business analysis and the required operating data are now being generated in the background. The rest of the platform is unlocked.")}</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setGenerationOpen(false)} className="rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:bg-secondary">{t("Stay on billing")}</button>
              <button type="button" onClick={() => navigateApp(routes.app.dashboard, { replace: true })} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">{t("Open platform")}</button>
            </div>
          </section>
        </div>
      ) : null}
      {topups.length ? (
        <div className="border-t border-border p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">{t("Payment history")}</p>
              <h3 className="mt-1 text-lg font-semibold">{t("Airwallex payment receipts")}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{t("Use the payment ID to find the transaction in Airwallex.")}</p>
          </div>
          <div className="mt-4 space-y-3">
            {topups.slice(0, 8).map((item) => {
              const providerId = item.providerPaymentIntentId ?? item.providerInvoiceId ?? item.merchantOrderId ?? null;
              return (
                <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{formatMoney(item.amount)}</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "SUCCEEDED" ? "bg-emerald-500/10 text-emerald-700" : item.status === "FAILED" || item.status === "REVERSED" ? "bg-red-500/10 text-red-700" : "bg-amber-500/10 text-amber-700"}`}>{statusLabel(item.status)}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{methodLabel(item.paymentMethod)} · {formatDate(item.paidAt ?? item.createdAt)}</p>
                    {providerId ? <p className="mt-2 break-all font-mono text-[11px] text-muted-foreground">{t("Payment ID")}: {providerId}</p> : null}
                  </div>
                  <div className="shrink-0 text-left text-xs sm:text-right">
                    {item.status === "SUCCEEDED" ? <p className="font-semibold text-emerald-700">{t("Confirmed by Airwallex")}</p> : <p className="text-muted-foreground">{t("Waiting for Airwallex confirmation")}</p>}
                    {item.creditedAt ? <p className="mt-1 text-muted-foreground">{t("Credited")}: {formatDate(item.creditedAt)}</p> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
