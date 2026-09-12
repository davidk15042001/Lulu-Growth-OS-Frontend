import { Bot, Database, ExternalLink, LoaderCircle, Megaphone, RefreshCw, WalletCards, X } from "lucide-react";
import { useEffect, useState } from "react";
import { adSpendApi, type AdSpendOverview } from "../api/adspend";
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
  const t = useTranslation();
  const language = useLanguage();
  const [open, setOpen] = useState(false);
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [advertising, setAdvertising] = useState<AdSpendOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!selectedWorkspace) return;
    setLoading(true);
    setError(null);
    const [billingResult, advertisingResult] = await Promise.allSettled([
      workspaceAppApi.billing(selectedWorkspace.id),
      adSpendApi.overview(selectedWorkspace.id),
    ]);
    if (billingResult.status === "fulfilled") setBilling(billingResult.value.data);
    if (advertisingResult.status === "fulfilled") setAdvertising(advertisingResult.value.data);
    if (billingResult.status === "rejected" && advertisingResult.status === "rejected") {
      setError(getFriendlyErrorMessage(billingResult.reason, t("Could not load funds.")));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!open) return;
    void load();
    // Loading is intentionally triggered only when the panel opens or the workspace changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedWorkspace?.id]);

  if (!selectedWorkspace) return null;

  const apiWallet = billing?.apiWallet;
  const payg = billing?.payg;
  const adWallet = advertising?.wallet;

  return (
    <>
      <button
        type="button"
        className="lulu-auth-usage"
        onClick={() => setOpen(true)}
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

            {loading && !billing && !advertising ? (
              <div className="lulu-usage-state"><LoaderCircle aria-hidden="true" size={18} className="animate-spin" />{t("Loading funds…")}</div>
            ) : error ? (
              <div className="lulu-usage-error" role="alert">{error}</div>
            ) : (
              <div className="lulu-usage-dialog__body">
                <div className="lulu-usage-metrics">
                  <article className="lulu-usage-metric lulu-usage-metric--api">
                    <div className="lulu-usage-metric__icon"><Bot aria-hidden="true" size={18} /></div>
                    <div><span>{t("AI execution")}</span><strong>{formatMoney(apiWallet?.availableAmount ?? 0, "CNY", language)}</strong></div>
                    <p>{formatMoney(apiWallet?.spentAmount ?? 0, "CNY", language)} {t("used")}</p>
                    <small>{apiWallet?.enabled ? t("Lulu can execute AI and premium-media work automatically.") : t("Add AI funds to start autonomous execution.")}</small>
                  </article>

                  <article className="lulu-usage-metric">
                    <div className="lulu-usage-metric__icon"><Megaphone aria-hidden="true" size={18} /></div>
                    <div><span>{t("Advertising")}</span><strong>{formatMoney(adWallet?.availableAmount ?? 0, "CNY", language)}</strong></div>
                    <p>{formatMoney(adWallet?.reservedAmount ?? 0, "CNY", language)} {t("reserved")} · {formatMoney(adWallet?.spentAmount ?? 0, "CNY", language)} {t("spent")}</p>
                    <small>{adWallet?.adsEnabled ? t("Paid campaigns can launch and optimize automatically.") : t("Campaigns start automatically once advertising funds are available.")}</small>
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
                    <p>{t("Lulu launches paid campaigns automatically after the top-up is confirmed.")}</p>
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
