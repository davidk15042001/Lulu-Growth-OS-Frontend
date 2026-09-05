import { CreditCard, Database, ExternalLink, LoaderCircle, RefreshCw, Server, X, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLuluApp } from "../api/LuluAppContext";
import { getFriendlyErrorMessage } from "../api/client";
import { workspaceAppApi, type BillingState } from "../api/workspace-app";
import { useLanguage, useTranslation } from "../i18n/GlobalLanguageSwitcher";

function safeHostedUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function formatMoney(value: number, currency: "USD", language: string) {
  const locale = language === "de" ? "de-DE" : language === "zh-CN" ? "zh-CN" : "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

function formatInteger(value: number, language: string) {
  const locale = language === "de" ? "de-DE" : language === "zh-CN" ? "zh-CN" : "en-US";
  return new Intl.NumberFormat(locale).format(value);
}

function paymentMethodLabel(method: string, t: (key: string) => string) {
  if (method === "alipaycn") return t("Alipay");
  if (method === "wechatpay") return t("WeChat Pay");
  return t("Card");
}

export function LuluUsageControl() {
  const { selectedWorkspace } = useLuluApp();
  const t = useTranslation();
  const language = useLanguage();
  const [open, setOpen] = useState(false);
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payg = billing?.payg ?? null;
  const total = payg ? payg.apiCost + payg.serverCost : null;
  const pendingApiPayment = useMemo(
    () => payg?.invoices.find((invoice) => invoice.billingMode === "api_pay_now" && ["processing", "payment_due", "payment_failed"].includes(invoice.status)) ?? null,
    [payg],
  );

  const load = async () => {
    if (!selectedWorkspace) return;
    setLoading(true);
    setError(null);
    try {
      const response = await workspaceAppApi.billing(selectedWorkspace.id);
      setBilling(response.data);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t("Could not load usage.")));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    void load();
  // Loading is intentionally triggered when the panel opens or the active workspace changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedWorkspace?.id]);

  const payApiUsageNow = async () => {
    if (!selectedWorkspace || !payg || paying || payg.apiCost <= 0) return;
    setPaying(true);
    setError(null);
    try {
      const response = await workspaceAppApi.createPaygApiUsageCheckout(selectedWorkspace.id);
      const paymentUrl = safeHostedUrl(response.data.paymentUrl);
      await load();
      if (!paymentUrl) {
        setError(t("A payment is already being prepared. Refresh usage in a moment to open it."));
        return;
      }
      window.location.assign(paymentUrl);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t("Could not start the secure API payment.")));
    } finally {
      setPaying(false);
    }
  };

  if (!selectedWorkspace) return null;

  return (
    <>
      <button
        type="button"
        className="lulu-auth-usage"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={t("Usage")}
      >
        <Database aria-hidden="true" size={17} />
        <span>{t("Usage")}</span>
        {total !== null && <strong>{formatMoney(total, "USD", language)}</strong>}
      </button>

      {open && (
        <div className="lulu-usage-overlay" role="presentation" onMouseDown={() => setOpen(false)}>
          <section
            className="lulu-usage-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lulu-usage-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="lulu-usage-dialog__header">
              <div>
                <p>{t("Live workspace usage")}</p>
                <h2 id="lulu-usage-title">{t("Usage")}</h2>
              </div>
              <div className="lulu-usage-dialog__header-actions">
                <button type="button" className="lulu-usage-icon-button" onClick={() => void load()} disabled={loading} aria-label={t("Refresh usage")} title={t("Refresh usage")}>
                  <RefreshCw aria-hidden="true" size={16} className={loading ? "animate-spin" : undefined} />
                </button>
                <button type="button" className="lulu-usage-icon-button" onClick={() => setOpen(false)} aria-label={t("Close")}>
                  <X aria-hidden="true" size={17} />
                </button>
              </div>
            </header>

            {loading && !billing ? <div className="lulu-usage-state"><LoaderCircle aria-hidden="true" size={18} className="animate-spin" />{t("Loading usage…")}</div> : error ? <div className="lulu-usage-error" role="alert">{error}</div> : !payg ? <div className="lulu-usage-state">{t("Usage billing is not active for this workspace yet.")}</div> : (
              <div className="lulu-usage-dialog__body">
                <div className="lulu-usage-period">
                  <span>{t("Current billing period")}</span>
                  <strong>{new Intl.DateTimeFormat(language === "de" ? "de-DE" : language === "zh-CN" ? "zh-CN" : "en-US", { day: "numeric", month: "short" }).format(new Date(payg.periodStart))} – {new Intl.DateTimeFormat(language === "de" ? "de-DE" : language === "zh-CN" ? "zh-CN" : "en-US", { day: "numeric", month: "short", year: "numeric" }).format(new Date(payg.periodEnd))}</strong>
                </div>

                <div className="lulu-usage-metrics">
                  <article className="lulu-usage-metric lulu-usage-metric--api">
                    <div className="lulu-usage-metric__icon"><Zap aria-hidden="true" size={18} /></div>
                    <div><span>{t("API usage")}</span><strong>{formatMoney(payg.apiCost, "USD", language)}</strong></div>
                    <p>{formatInteger(payg.inputTokens, language)} {t("input tokens")} · {formatInteger(payg.outputTokens, language)} {t("output tokens")} · {formatInteger(payg.apiEvents, language)} {t("API calls")}</p>
                    <small>{t("Pay API usage now to reset this API counter. New usage starts a new API balance.")}</small>
                  </article>
                  <article className="lulu-usage-metric">
                    <div className="lulu-usage-metric__icon"><Server aria-hidden="true" size={18} /></div>
                    <div><span>{t("Server & storage")}</span><strong>{formatMoney(payg.serverCost, "USD", language)}</strong></div>
                    <p>{formatInteger(payg.serverDays, language)} {t("allocated days")} · {t("weekly charge")}</p>
                    <small>{t("Server and storage usage stays in the current weekly billing period when API usage is paid.")}</small>
                  </article>
                </div>

                <div className="lulu-usage-total"><span>{t("Current usage total")}</span><strong>{formatMoney(payg.estimatedTotal, "USD", language)}</strong></div>

                {pendingApiPayment && <div className="lulu-usage-pending"><CreditCard aria-hidden="true" size={16} /><span>{t("An API payment is awaiting confirmation.")} {formatMoney(pendingApiPayment.apiCost, "USD", language)}</span>{safeHostedUrl(pendingApiPayment.hostedInvoiceUrl) && <a href={safeHostedUrl(pendingApiPayment.hostedInvoiceUrl)!} target="_blank" rel="noreferrer">{t("Open secure checkout")}<ExternalLink aria-hidden="true" size={13} /></a>}</div>}

                <div className="lulu-usage-payment">
                  <div>
                    <h3>{t("Pay API usage now")}</h3>
                    <p>{t("Only API usage is settled now. Server and storage remain on the weekly invoice.")}</p>
                    <div className="lulu-usage-payment__methods" aria-label={t("Available payment methods")}>
                      {payg.paymentMethods.map((method) => <span key={method}>{paymentMethodLabel(method, t)}</span>)}
                    </div>
                  </div>
                  <button type="button" onClick={() => void payApiUsageNow()} disabled={paying || payg.apiCost <= 0 || Boolean(pendingApiPayment)}>
                    {paying ? <><LoaderCircle aria-hidden="true" size={16} className="animate-spin" />{t("Opening secure checkout…")}</> : <>{t("Pay API usage")}{<ExternalLink aria-hidden="true" size={15} />}</>}
                  </button>
                </div>
                <p className="lulu-usage-security-note">{t("Payment details are handled securely by Airwallex. Available methods depend on your merchant setup, currency and region.")}</p>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
