import { AlertTriangle, Brain, Database, RefreshCw, ShieldCheck } from "lucide-react";
import { useLiveRecords } from "../../../../api/useLiveRecords";
import { useLanguage, useTranslation } from "../../../../i18n/GlobalLanguageSwitcher";

type InsightTone = "green" | "amber" | "red" | "blue" | "purple" | "slate";

const toneClass: Record<InsightTone, string> = {
  green: "border-chart-4/30 bg-chart-4/10 text-chart-4",
  amber: "border-chart-1/30 bg-chart-1/10 text-chart-1",
  red: "border-chart-5/30 bg-chart-5/10 text-chart-5",
  blue: "border-chart-3/30 bg-chart-3/10 text-chart-3",
  purple: "border-chart-2/30 bg-chart-2/10 text-chart-2",
  slate: "border-border bg-secondary text-muted-foreground",
};

const validTones = new Set<InsightTone>(["green", "amber", "red", "blue", "purple", "slate"]);

function formatDate(value: string | null | undefined, language: string) {
  if (!value) return "—";
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString(language) : "—";
}

export const LuluIntelligenceOverview = () => {
  const t = useTranslation();
  const language = useLanguage();
  const records = useLiveRecords("ai_insights", "limit=100");

  const getField = (record: (typeof records.items)[number], key: string) => {
    const value = (record as unknown as Record<string, unknown>)[key] ?? record.data?.[key];
    return value == null ? "" : String(value).trim();
  };

  const insights = records.items.map((record) => {
    const rawTone = getField(record, "tone").toLowerCase() as InsightTone;
    const rawConfidence = getField(record, "confidence");
    const parsedConfidence = rawConfidence === "" ? null : Number(rawConfidence);
    const source = getField(record, "source");
    return {
      id: record.id,
      title: getField(record, "title") || getField(record, "name") || record.name || t("Intelligence signal"),
      description: getField(record, "description") || record.description,
      impact: getField(record, "impact"),
      confidence: parsedConfidence != null && Number.isFinite(parsedConfidence)
        ? Math.min(100, Math.max(0, parsedConfidence))
        : null,
      occurredAt: getField(record, "time") || record.updatedAt,
      sources: source ? source.split(",").map((item) => item.trim()).filter(Boolean) : [],
      tone: validTones.has(rawTone) ? rawTone : "slate" as InsightTone,
    };
  });

  const header = <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-[.18em] text-muted-foreground">{t("Intelligence / Overview")}</p>
      <h1 className="mt-2 text-3xl font-bold [overflow-wrap:anywhere]">{t("Intelligence Overview")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        {t("Verified intelligence records from the connected workspace. Scores, changes and recommendations appear only when returned by the backend.")}
      </p>
    </div>
    <button
      type="button"
      onClick={() => void records.refresh()}
      disabled={records.loading}
      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary disabled:cursor-wait disabled:opacity-60"
    >
      <RefreshCw aria-hidden="true" className={records.loading ? "animate-spin" : undefined} size={15} />
      {t("Refresh")}
    </button>
  </header>;

  if (records.status === "loading" && insights.length === 0) {
    return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10">
      <div className="mx-auto max-w-6xl">
        {header}
        <section className="rounded-2xl border border-border bg-card p-10 text-center" role="status" aria-live="polite">
          <RefreshCw aria-hidden="true" className="mx-auto mb-4 animate-spin text-muted-foreground" size={28} />
          <h2 className="text-lg font-semibold">{t("Loading verified intelligence…")}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{t("Lulu is requesting current intelligence records from the workspace backend.")}</p>
        </section>
      </div>
    </main>;
  }

  if (records.status === "error" && insights.length === 0) {
    return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10">
      <div className="mx-auto max-w-6xl">
        {header}
        <section className="rounded-2xl border border-chart-5/30 bg-chart-5/5 p-8 text-center" role="alert">
          <AlertTriangle aria-hidden="true" className="mx-auto mb-4 text-chart-5" size={30} />
          <h2 className="text-xl font-semibold">{t("Intelligence data unavailable")}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{records.error}</p>
          <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground">{t("No score, trend or recommendation is shown while the backend state is unavailable.")}</p>
        </section>
      </div>
    </main>;
  }

  return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10">
    <div className="mx-auto max-w-6xl">
      {header}

      {records.status === "stale" ? <div className="mb-5 flex items-start gap-2 rounded-lg border border-chart-1/30 bg-chart-1/5 px-4 py-3 text-sm text-muted-foreground" role="status">
        <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-chart-1" size={16} />
        <span>{t("The latest refresh failed. Only the last successfully loaded intelligence records are shown.")}</span>
      </div> : null}

      {insights.length === 0 ? <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <Brain aria-hidden="true" className="mx-auto mb-4 text-muted-foreground" size={30} />
        <h2 className="text-xl font-semibold">{t("No verified intelligence insights yet")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          {t("Insights will appear after connected workspace data has been analyzed. No health score, trend or recommendation is inferred without a verified record.")}
        </p>
      </section> : <>
        <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3" aria-label={t("Verified intelligence summary")}>
          <span className="inline-flex items-center gap-2 text-sm font-medium"><ShieldCheck aria-hidden="true" size={16} />{t("Backend-derived records")}</span>
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><Database aria-hidden="true" size={15} />{records.total.toLocaleString(language)} {t("records")}</span>
        </section>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label={t("Verified intelligence insights")}>
          {insights.map((item) => <article key={item.id} className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              {item.impact ? <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${toneClass[item.tone]}`}>{item.impact}</span> : <span className="text-xs text-muted-foreground">{t("Impact not provided")}</span>}
              <time className="text-xs text-muted-foreground" dateTime={item.occurredAt || undefined}>{formatDate(item.occurredAt, language)}</time>
            </div>
            <h2 className="mt-4 text-lg font-semibold [overflow-wrap:anywhere]">{item.title}</h2>
            {item.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{item.description}</p> : null}
            <p className="mt-3 text-sm text-muted-foreground">{t("Confidence")}: {item.confidence == null ? t("not provided") : `${item.confidence}%`}</p>
            <p className="mt-2 text-xs text-muted-foreground [overflow-wrap:anywhere]">{t("Sources")}: {item.sources.length > 0 ? item.sources.join(", ") : t("No source metadata")}</p>
          </article>)}
        </section>
      </>}
    </div>
  </main>;
};
