import { Bot, Database, ExternalLink, LoaderCircle, Megaphone, RefreshCw, WalletCards, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { adSpendApi, type AdBudgetAuthorization, type AdSpendOverview } from "../api/adspend";
import { useLuluApp } from "../api/LuluAppContext";
import { getFriendlyErrorMessage } from "../api/client";
import { workspaceAppApi, type BillingState } from "../api/workspace-app";
import { useLanguage, useTranslation } from "../i18n/GlobalLanguageSwitcher";
import { navigateApp, routes } from "../routing";

function formatMoney(value: number, currency: string, language: string) {
  const locale = language === "de" ? "de-DE" : language === "zh-CN" ? "zh-CN" : "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

function formatInteger(value: number, language: string) {
  const locale = language === "de" ? "de-DE" : language === "zh-CN" ? "zh-CN" : "en-US";
  return new Intl.NumberFormat(locale).format(value);
}

export function LuluUsageControl() {
  const { selectedWorkspace } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? null;
  const t = useTranslation();
  const language = useLanguage();
  const [open, setOpen] = useState(false);
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [advertising, setAdvertising] = useState<AdSpendOverview | null>(null);
  const [authorizations, setAuthorizations] = useState<AdBudgetAuthorization[]>([]);
  const [loadedWorkspaceId, setLoadedWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState<{ workspaceId: string; message: string } | null>(null);
  const loadRequest = useRef(0);
  const workspaceRef = useRef(workspaceId);
  workspaceRef.current = workspaceId;

  const load = useCallback(async () => {
    const request = ++loadRequest.current;
    const targetWorkspaceId = workspaceId;
    setLoading(true);
    setBilling(null);
    setAdvertising(null);
    setAuthorizations([]);
    setLoadedWorkspaceId(null);
    setErrorState(null);
    if (!targetWorkspaceId) { setLoading(false); return; }
    try {
      const [billingResult, advertisingResult, authorizationResult] = await Promise.allSettled([
        workspaceAppApi.billing(targetWorkspaceId),
        adSpendApi.overview(targetWorkspaceId),
        adSpendApi.listBudgetAuthorizations(targetWorkspaceId),
      ]);
      if (request !== loadRequest.current || workspaceRef.current !== targetWorkspaceId) return;
      if (billingResult.status === "rejected") throw billingResult.reason;
      if (advertisingResult.status === "rejected") throw advertisingResult.reason;
      if (authorizationResult.status === "rejected") throw authorizationResult.reason;
      if (advertisingResult.value.data.wallet.workspaceId !== targetWorkspaceId || authorizationResult.value.data.some((authorization) => authorization.workspaceId !== targetWorkspaceId)) {
        throw new Error("The funds response did not match the current workspace.");
      }
      setBilling(billingResult.value.data);
      setAdvertising(advertisingResult.value.data);
      setAuthorizations(authorizationResult.value.data);
      setLoadedWorkspaceId(targetWorkspaceId);
    } catch (cause) {
      if (request === loadRequest.current && workspaceRef.current === targetWorkspaceId) {
        setBilling(null);
        setAdvertising(null);
        setAuthorizations([]);
        setLoadedWorkspaceId(null);
        setErrorState({ workspaceId: targetWorkspaceId, message: getFriendlyErrorMessage(cause, t("Could not load funds.")) });
      }
    } finally {
      if (request === loadRequest.current && workspaceRef.current === targetWorkspaceId) setLoading(false);
    }
  }, [t, workspaceId]);

  useEffect(() => {
    if (!open) {
      loadRequest.current += 1;
      setBilling(null);
      setAdvertising(null);
      setAuthorizations([]);
      setLoadedWorkspaceId(null);
      setErrorState(null);
      setLoading(false);
      return;
    }
    void load();
    return () => { loadRequest.current += 1; };
  }, [load, open]);

  if (!selectedWorkspace) return null;

  const hasCurrentSnapshot = loadedWorkspaceId === workspaceId;
  const currentError = errorState?.workspaceId === workspaceId ? errorState.message : null;
  const showLoading = loading || (!hasCurrentSnapshot && !currentError);
  const apiWallet = hasCurrentSnapshot ? billing?.apiWallet : undefined;
  const payg = hasCurrentSnapshot ? billing?.payg : undefined;
  const adWallet = hasCurrentSnapshot ? advertising?.wallet : undefined;
  const now = Date.now();
  const activeAuthorization = hasCurrentSnapshot && authorizations.some((authorization) => {
    const startsAt = Date.parse(authorization.startsAt);
    const endsAt = Date.parse(authorization.endsAt);
    return authorization.workspaceId === workspaceId
      && authorization.status === "ACTIVE"
      && authorization.currency === adWallet?.currency
      && authorization.remainingAmount > 0
      && Number.isFinite(startsAt)
      && Number.isFinite(endsAt)
      && startsAt <= now
      && endsAt > now;
  });
  const hasApiReversalDebt = (apiWallet?.reversalDebtAmount ?? 0) > 0;
  const hasAdvertisingReversalDebt = (adWallet?.reversalDebtAmount ?? 0) > 0;
  const advertisingReady = Boolean(!hasAdvertisingReversalDebt && adWallet?.adsEnabled && activeAuthorization);
  const apiStatus = hasApiReversalDebt
    ? t("AI execution is paused until the outstanding payment reversal balance is covered.")
    : apiWallet?.enabled
      ? t("Lulu can execute AI and premium-media work automatically.")
      : t("Add AI funds to start autonomous execution.");
  const advertisingStatus = hasAdvertisingReversalDebt
    ? t("Paid advertising is paused until the outstanding payment reversal balance is covered.")
    : advertisingReady
      ? t("Paid campaigns can launch and optimize automatically within the active authorization.")
      : adWallet?.adsEnabled
        ? t("Advertising funds are available; a campaign budget authorization is still required.")
        : t("Add advertising funds before paid campaigns can start.");

  return (
    <>
      <button
        type="button"
        className="lulu-auth-usage"
        onClick={() => { setLoading(true); setOpen(true); }}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={t("Funds")}
      >
        <WalletCards aria-hidden="true" size={17} />
        <span>{t("Funds")}</span>
      </button>

      {open && (
        <div className="lulu-usage-overlay" role="presentation" onMouseDown={() => setOpen(false)}>
          <section
            className="lulu-usage-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lulu-funds-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="lulu-usage-dialog__header">
              <div>
                <p>{t("Autonomous execution capacity")}</p>
                <h2 id="lulu-funds-title">{t("Funds")}</h2>
              </div>
              <div className="lulu-usage-dialog__header-actions">
                <button type="button" className="lulu-usage-icon-button" onClick={() => void load()} disabled={loading} aria-label={t("Refresh funds")}>
                  <RefreshCw aria-hidden="true" size={16} className={loading ? "animate-spin" : undefined} />
                </button>
                <button type="button" className="lulu-usage-icon-button" onClick={() => setOpen(false)} aria-label={t("Close")}>
                  <X aria-hidden="true" size={17} />
                </button>
              </div>
            </header>

            {showLoading ? (
              <div className="lulu-usage-state"><LoaderCircle aria-hidden="true" size={18} className="animate-spin" />{t("Loading funds…")}</div>
            ) : currentError ? (
              <div className="lulu-usage-error" role="alert">{currentError}</div>
            ) : (
              <div className="lulu-usage-dialog__body">
                <div className="lulu-usage-metrics">
                  <article className="lulu-usage-metric lulu-usage-metric--api">
                    <div className="lulu-usage-metric__icon"><Bot aria-hidden="true" size={18} /></div>
                    <div><span>{t("AI execution")} · {t("Available now")}</span><strong>{formatMoney(apiWallet?.availableAmount ?? 0, "CNY", language)}</strong></div>
                    <p>{t("Reserved for payment")}: {formatMoney(apiWallet?.paymentReservedAmount ?? 0, "CNY", language)} · {t("AI work")}: {formatMoney(apiWallet?.reservedAmount ?? 0, "CNY", language)} · {t("Actually spent")}: {formatMoney(apiWallet?.spentAmount ?? 0, "CNY", language)}</p>
                    <small>{apiStatus}</small>
                  </article>

                  <article className="lulu-usage-metric">
                    <div className="lulu-usage-metric__icon"><Megaphone aria-hidden="true" size={18} /></div>
                    <div><span>{t("Advertising")} · {t("Available now")}</span><strong>{formatMoney(adWallet?.availableAmount ?? 0, "CNY", language)}</strong></div>
                    <p>{t("Reserved for payment")}: {formatMoney(adWallet?.paymentReservedAmount ?? 0, "CNY", language)} · {t("Campaigns")}: {formatMoney(adWallet?.reservedAmount ?? 0, "CNY", language)} · {t("Actually spent")}: {formatMoney(adWallet?.spentAmount ?? 0, "CNY", language)}</p>
                    <small>{advertisingStatus}</small>
                  </article>

                  <article className="lulu-usage-metric">
                    <div className="lulu-usage-metric__icon"><Database aria-hidden="true" size={18} /></div>
                    <div><span>{t("Storage")}</span><strong>{formatMoney(payg?.estimatedTotal ?? 0, "USD", language)}</strong></div>
                    <p>{formatInteger(payg?.serverDays ?? 0, language)} {t("metered days this period")}</p>
                    <small>{t("Storage remains pay as you go and is collected separately.")}</small>
                  </article>
                </div>

                <div className="lulu-usage-payment">
                  <div>
                    <h3>{t("Fund AI execution")}</h3>
                    <p>{t("Prepaid AI capacity for decisions, communication and premium media.")}</p>
                  </div>
                  <button type="button" onClick={() => { setOpen(false); navigateApp(routes.app.funds); }}>
                    {t("Add AI funds")}<ExternalLink aria-hidden="true" size={15} />
                  </button>
                </div>

                <div className="lulu-usage-payment">
                  <div>
                    <h3>{t("Fund advertising")}</h3>
                    <p>{t("Funds become usable after payment confirmation; paid execution also requires an active campaign budget authorization.")}</p>
                  </div>
                  <button type="button" onClick={() => { setOpen(false); navigateApp(routes.app.adSpend); }}>
                    {t("Add ad funds")}<ExternalLink aria-hidden="true" size={15} />
                  </button>
                </div>

                <p className="lulu-usage-security-note">{t("Card, Alipay and WeChat Pay are supported. Budget is the only customer authorization required for execution.")}</p>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
