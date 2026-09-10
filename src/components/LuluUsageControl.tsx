import { Database, ExternalLink, Film, LoaderCircle, RefreshCw, X, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLuluApp } from "../api/LuluAppContext";
import { getFriendlyErrorMessage } from "../api/client";
import { workspaceAppApi, type BillingState } from "../api/workspace-app";
import { useLanguage, useTranslation } from "../i18n/GlobalLanguageSwitcher";
import { navigateApp } from "../routing";

function formatMoney(value: number, currency: string, language: string) {
  const locale = language === "de" ? "de-DE" : language === "zh-CN" ? "zh-CN" : "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

function formatInteger(value: number, language: string) {
  const locale = language === "de" ? "de-DE" : language === "zh-CN" ? "zh-CN" : "en-US";
  return new Intl.NumberFormat(locale).format(value);
}

function mediaModelLabel(model: string) {
  const labels: Record<string, string> = {
    "kling/v3-turbo-image-to-video": "Kling 3.0 Turbo",
    veo3: "Veo 3.1",
    "flux-2/pro-image-to-image": "FLUX 2 Pro",
    "flux-2/pro-text-to-image": "FLUX 2 Pro",
    "seedream/5-pro-image-to-image": "Seedream 5 Pro",
    "seedream/5-pro-text-to-image": "Seedream 5 Pro",
    "topaz/image-upscale": "Topaz Image",
    "topaz/video-upscale": "Topaz Video",
    "gemini-3-pro": "Gemini 3 Pro",
  };
  return labels[model] ?? model;
}

function mediaOperationLabel(operation: string, t: (key: string) => string) {
  const labels: Record<string, string> = {
    image_generation: "Image generation",
    video_generation: "Video generation",
    image_upscale: "Image finishing",
    video_upscale: "Video finishing",
    image_quality_gate: "Image quality check",
    video_quality_gate: "Video quality check",
    premium_media: "Premium media",
  };
  return t(labels[operation] ?? "Premium media");
}

export function LuluUsageControl() {
  const { selectedWorkspace } = useLuluApp();
  const t = useTranslation();
  const language = useLanguage();
  const [open, setOpen] = useState(false);
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payg = billing?.payg ?? null;
  const apiWallet = billing?.apiWallet ?? { availableAmount:0,spentAmount:0,totalFundedAmount:0,currency:'CNY' as const,packages:[1000,2500,5000,9000],enabled:false };
  const storagePricing = billing?.storagePricing ?? {storagePerGbMonthUsd:.2165,classAPerMillionOperationsUsd:4.95,classBPerMillionOperationsUsd:.396};
  const total = payg ? payg.serverCost : null;
  const mediaUsage = useMemo(() => payg?.usageBreakdown?.filter((entry) => entry.provider === "kie.ai") ?? [], [payg]);
  const mediaCost = useMemo(() => mediaUsage.reduce((sum, entry) => sum + entry.customerCost, 0), [mediaUsage]);
  const mediaCredits = useMemo(() => mediaUsage.reduce((sum, entry) => sum + entry.kieCredits, 0), [mediaUsage]);
  const textApiCost = payg ? Math.max(0, payg.apiCost - mediaCost) : 0;
  const pricing = payg?.pricing ?? {
    inputPerMillionUsd: 5,
    outputPerMillionUsd: 10,
    premiumMediaPerKieCreditUsd: 0.01,
    serverProviderCostMultiplier: 2,
  };

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
                    <div><span>{t("Prepaid AI balance")}</span><strong>{formatMoney(apiWallet.availableAmount, "CNY", language)}</strong></div>
                    <p>{formatInteger(payg.inputTokens, language)} {t("input tokens")} · {formatInteger(payg.outputTokens, language)} {t("output tokens")} · {formatInteger(payg.apiEvents, language)} {t("API calls")}</p>
                    <small>{apiWallet.enabled?t("AI and premium media can execute automatically."):t("AI execution waits for confirmed wallet funds.")}</small>
                  </article>
                  <article className="lulu-usage-metric">
                    <div className="lulu-usage-metric__icon"><Database aria-hidden="true" size={18} /></div>
                    <div><span>{t("Cloudflare R2 storage")}</span><strong>{formatMoney(payg.serverCost, "USD", language)}</strong></div>
                    <p>{formatInteger(payg.serverDays, language)} {t("metered days")} · {t("weekly charge")}</p>
                    <small>{t("Only R2 storage and operations are billed pay as you go. No free tier is deducted.")}</small>
                  </article>
                </div>

                <section className="lulu-usage-prices" aria-labelledby="lulu-usage-prices-title">
                  <div className="lulu-usage-prices__header">
                    <div><span>{t("Transparent rates")}</span><h3 id="lulu-usage-prices-title">{t("Prices & costs")}</h3></div>
                    <small>{t("Only recorded usage is charged")}</small>
                  </div>
                  <div className="lulu-usage-prices__grid">
                    <div><span>{t("AI usage · prepaid")}</span><strong>{formatMoney(apiWallet.spentAmount, "CNY", language)}</strong><small>{formatMoney(textApiCost, "USD", language)} {t("recorded this period")} · {formatMoney(pricing.inputPerMillionUsd, "USD", language)} / 1M {t("input tokens")} · {formatMoney(pricing.outputPerMillionUsd, "USD", language)} / 1M {t("output tokens")}</small></div>
                    <div><span>{t("Premium media")}</span><strong>{formatMoney(mediaCost, "USD", language)}</strong><small>{formatInteger(mediaCredits, language)} {t("Kie credits")} · {formatMoney(pricing.premiumMediaPerKieCreditUsd, "USD", language)} {t("per Kie credit")}</small></div>
                    <div><span>{t("R2 storage")}</span><strong>{formatMoney(payg.serverCost, "USD", language)}</strong><small>{formatMoney(storagePricing.storagePerGbMonthUsd,"USD",language)} / GB-month · {formatMoney(storagePricing.classAPerMillionOperationsUsd,"USD",language)} / 1M Class A · {formatMoney(storagePricing.classBPerMillionOperationsUsd,"USD",language)} / 1M Class B</small></div>
                  </div>
                  {mediaUsage.length > 0 && <div className="lulu-usage-media-breakdown">
                    <div className="lulu-usage-media-breakdown__title"><Film aria-hidden="true" size={15} />{t("Premium media cost breakdown")}</div>
                    {mediaUsage.map((entry) => <div className="lulu-usage-media-row" key={`${entry.model}:${entry.operation}`}>
                      <div><strong>{mediaModelLabel(entry.model)}</strong><span>{mediaOperationLabel(entry.operation, t)} · {formatInteger(entry.events, language)} {t("operations")} · {formatInteger(entry.kieCredits, language)} {t("Kie credits")}</span></div>
                      <strong>{formatMoney(entry.customerCost, "USD", language)}</strong>
                    </div>)}
                  </div>}
                </section>

                <div className="lulu-usage-total"><span>{t("Current storage PAYG total")}</span><strong>{formatMoney(payg.estimatedTotal, "USD", language)}</strong></div>

                <div className="lulu-usage-payment">
                  <div>
                    <h3>{t("Fund AI execution")}</h3>
                    <p>{t("Choose 1,000, 2,500, 5,000 or 9,000 RMB. Card, Alipay and WeChat Pay are supported.")}</p>
                  </div>
                  <button type="button" onClick={() => navigateApp('/app/pure-minute-5446')}>
                    {t("Open AI wallet")}{<ExternalLink aria-hidden="true" size={15} />}
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
