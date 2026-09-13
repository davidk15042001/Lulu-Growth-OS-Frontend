import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  QrCode,
  Sparkles,
  WalletCards,
} from "lucide-react";
import QRCode from "qrcode";
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
const packages = [1, 1000, 2500, 5000, 9000];
const methods: Array<{ id: ApiPaymentMethod; label: string }> = [
  { id: "card", label: "Bank card" },
  { id: "alipaycn", label: "Alipay" },
  { id: "wechatpay", label: "WeChat Pay" },
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
export function ApiWalletPanel() {
  const { selectedWorkspace, can } = useLuluApp();
  const t = useTranslation();
  const workspaceId = selectedWorkspace?.id ?? null;
  const [overview, setOverview] = useState<ApiWalletOverview | null>(null);
  const [amount, setAmount] = useState(1000);
  const [method, setMethod] = useState<ApiPaymentMethod>("card");
  const [topup, setTopup] = useState<ApiTopup | null>(null);
  const [topupWorkspaceId, setTopupWorkspaceId] = useState<string | null>(null);
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
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
  const currentTopup = topupWorkspaceId === workspaceId ? topup : null;
  const error =
    errorState?.workspaceId === workspaceId ? errorState.message : "";
  const reversalDebt = currentOverview?.wallet.reversalDebtAmount ?? 0;
  const hasReversalDebt = reversalDebt > 0;
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
  useEffect(() => {
    paymentRequest.current += 1;
    setTopup(null);
    setTopupWorkspaceId(null);
    setQr("");
    setPaying(false);
    void load();
    return () => {
      loadRequest.current += 1;
      paymentRequest.current += 1;
    };
  }, [load]);
  useEffect(() => {
    if (!currentTopup?.qrPayload) {
      setQr("");
      return;
    }
    let active = true;
    const targetWorkspaceId = workspaceId;
    void QRCode.toDataURL(currentTopup.qrPayload, { width: 240, margin: 1 })
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
  }, [currentTopup?.id, currentTopup?.status, load, workspaceId]);
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
      }
      setTopup(result);
      setTopupWorkspaceId(targetWorkspaceId);
      if (targetMethod === "card") {
        const checkout = secureCheckoutUrl(result.checkoutUrl);
        if (!checkout) throw new Error("The secure checkout URL is missing.");
        window.location.assign(checkout);
      }
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
  return (
    <section className="mb-6 overflow-hidden rounded-3xl border border-violet-500/20 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,.14),transparent_48%),var(--card)] shadow-sm">
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
              {money.format(reversalDebt)}. New top-ups settle this amount
              first; agents resume automatically only when the balance is fully
              covered and usable credit remains.
            </p>
          </div>
        </div>
      ) : null}
      <div className="grid lg:grid-cols-[.9fr_1.1fr]">
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
          <p className="mt-7 text-xs uppercase tracking-[.15em] text-muted-foreground">
            Available balance
          </p>
          <p className="mt-2 text-4xl font-semibold">
            {displayLoading
              ? "—"
              : money.format(currentOverview?.wallet.availableAmount ?? 0)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {displayLoading
              ? "—"
              : money.format(currentOverview?.wallet.reservedAmount ?? 0)}{" "}
            {t("reserved")}
          </p>
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
        <div className="border-t border-border bg-background/40 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">
            Add AI balance
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {packages.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value)}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold ${amount === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}
              >
                {money.format(value)}
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
                {item.id === "card" ? (
                  <CreditCard size={15} />
                ) : (
                  <QrCode size={15} />
                )}
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
            disabled={!can("administer") || paying}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            {paying ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : (
              <WalletCards size={16} />
            )}
            Pay {money.format(amount)}
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
            <img
              src={qr}
              alt="AI balance payment QR code"
              className="mx-auto mt-4 h-60 w-60 rounded-xl border bg-white p-3"
            />
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
    </section>
  );
}
