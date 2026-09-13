import type { ReactNode } from "react";
import { AlertTriangle, Database, LoaderCircle, RefreshCw } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useLiveRecords } from "../api/useLiveRecords";
import { useLanguage, useTranslation } from "../i18n/GlobalLanguageSwitcher";

type BackendResourceOverviewPageProps = {
  resourceType: string;
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon: ReactNode;
};

function formatDate(value: string | null | undefined, language: string) {
  if (!value) return "—";
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString(language) : "—";
}

/**
 * Read-only fallback for generated resource pages whose legacy controls were
 * never connected to a production mutation API. It renders only canonical
 * workspace records and keeps every unsupported action out of the tab order.
 */
export function BackendResourceOverviewPage({
  resourceType,
  eyebrow,
  title,
  description,
  emptyTitle,
  emptyDescription,
  emptyIcon,
}: BackendResourceOverviewPageProps) {
  const t = useTranslation();
  const language = useLanguage();
  const [searchParams] = useSearchParams();
  const selectedRecordId = searchParams.get("recordId");
  const records = useLiveRecords(resourceType, "limit=100");

  return <main className="min-h-screen min-w-0 bg-[var(--background)] p-5 text-foreground sm:p-8 lg:p-10" aria-busy={records.loading}>
    <div className="mx-auto max-w-6xl">
      <header className="mb-7 flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">{t(eyebrow)}</p>
          <h1 className="mt-2 text-3xl font-bold [overflow-wrap:anywhere]">{t(title)}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{t(description)}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
            <Database aria-hidden="true" size={15} />
            {records.status === "loading" || records.status === "error" ? "—" : records.total.toLocaleString(language)} {t("records")}
          </span>
          <button
            type="button"
            onClick={() => void records.refresh()}
            disabled={records.loading}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw aria-hidden="true" className={records.loading ? "animate-spin" : undefined} size={15} />
            {t("Refresh")}
          </button>
        </div>
      </header>

      {records.status === "stale" ? <div className="mb-5 flex items-start gap-2 rounded-xl border border-chart-1/30 bg-chart-1/5 px-4 py-3 text-sm text-muted-foreground" role="status">
        <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-chart-1" size={16} />
        <span>{t("The latest refresh failed. Only the last successfully loaded records are shown.")}</span>
      </div> : null}

      {records.status === "loading" && records.items.length === 0 ? <section className="grid min-h-[360px] place-items-center rounded-2xl border border-border bg-card p-8" role="status" aria-live="polite">
        <div className="text-center text-sm text-muted-foreground"><LoaderCircle aria-hidden="true" className="mx-auto mb-3 animate-spin" size={25} />{t("Loading verified records…")}</div>
      </section> : records.status === "error" && records.items.length === 0 ? <section className="grid min-h-[360px] place-items-center rounded-2xl border border-chart-5/30 bg-chart-5/5 p-8 text-center" role="alert">
        <div className="max-w-xl"><AlertTriangle aria-hidden="true" className="mx-auto mb-3 text-chart-5" size={28} /><h2 className="text-lg font-semibold">{t("Verified records unavailable")}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{records.error}</p><p className="mt-2 text-xs text-muted-foreground">{t("No metrics or success claims are inferred while the backend state is unavailable.")}</p></div>
      </section> : records.items.length === 0 ? <section className="grid min-h-[360px] place-items-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <div className="max-w-xl"><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">{emptyIcon}</div><h2 className="text-xl font-semibold">{t(emptyTitle)}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{t(emptyDescription)}</p></div>
      </section> : <section className="grid gap-3 md:grid-cols-2" aria-label={t(title)}>
        {records.items.map((record) => <article key={record.id} className={`min-w-0 rounded-2xl border p-5 shadow-sm ${record.id === selectedRecordId ? "border-primary/50 bg-primary/5" : "border-border bg-card"}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {record.id === selectedRecordId ? <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.12em] text-primary">{t("Selected record")}</p> : null}
              <h2 className="font-semibold [overflow-wrap:anywhere]">{record.name}</h2>
            </div>
            <span className="rounded-full border border-border bg-secondary px-2 py-1 text-xs text-muted-foreground">{record.status || t("Status not provided")}</span>
          </div>
          {record.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{record.description}</p> : null}
          <dl className="mt-4 grid gap-3 border-t border-border pt-4 text-xs sm:grid-cols-2">
            {record.stage ? <div><dt className="text-muted-foreground">{t("Stage")}</dt><dd className="mt-1 font-medium [overflow-wrap:anywhere]">{record.stage}</dd></div> : null}
            <div><dt className="text-muted-foreground">{t("Updated")}</dt><dd className="mt-1 font-medium">{formatDate(record.updatedAt, language)}</dd></div>
            {record.valueAmount != null ? <div><dt className="text-muted-foreground">{t("Value")}</dt><dd className="mt-1 font-medium">{record.valueAmount} {record.currency ?? ""}</dd></div> : null}
          </dl>
          {record.tags.length > 0 ? <div className="mt-4 flex flex-wrap gap-1.5">{record.tags.map((tag) => <span key={tag} className="max-w-full rounded-full bg-secondary px-2 py-1 text-[10px] text-muted-foreground [overflow-wrap:anywhere]">{tag}</span>)}</div> : null}
        </article>)}
      </section>}
    </div>
  </main>;
}
