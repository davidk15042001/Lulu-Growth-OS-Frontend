import type { ReactNode } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Database, LoaderCircle, RefreshCw, Search, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
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

const PAGE_SIZE = 24;

function formatDate(value: string | null | undefined, language: string) {
  if (!value) return "—";
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString(language) : "—";
}

function statusTone(value: string | null | undefined) {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized.includes("error") || normalized.includes("fail") || normalized.includes("block")) return "border-chart-5/25 bg-chart-5/10 text-chart-5";
  if (normalized.includes("complete") || normalized.includes("active") || normalized.includes("success") || normalized.includes("ready")) return "border-chart-4/25 bg-chart-4/10 text-chart-4";
  if (normalized.includes("pending") || normalized.includes("review") || normalized.includes("warning")) return "border-chart-1/25 bg-chart-1/10 text-chart-1";
  return "border-border bg-secondary text-muted-foreground";
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
  const initialSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch.trim());
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const recordsQuery = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
  if (debouncedSearch) recordsQuery.set("search", debouncedSearch);
  const records = useLiveRecords(resourceType, recordsQuery.toString(), { includeTotal: true });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasRecords = records.items.length > 0;
  const isLoaded = records.status === "ready" || records.status === "stale";
  const hasSearch = debouncedSearch.length > 0;

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 240);
    return () => window.clearTimeout(handle);
  }, [search]);

  useEffect(() => {
    setPage(1);
    setTotal(0);
  }, [resourceType]);

  useEffect(() => {
    if (isLoaded) setTotal(records.total);
  }, [isLoaded, records.total]);

  useEffect(() => {
    if (!records.loading && page > totalPages) setPage(totalPages);
  }, [page, records.loading, totalPages]);

  return <main className="min-h-screen min-w-0 bg-[radial-gradient(circle_at_top_right,_color-mix(in_srgb,_var(--primary)_10%,_transparent),_transparent_34%),var(--background)] p-4 text-foreground sm:p-7 lg:p-10" aria-busy={records.loading}>
    <div className="mx-auto max-w-7xl">
      <header className="relative mb-6 overflow-hidden rounded-[28px] border border-border/80 bg-card/95 p-5 shadow-[0_18px_60px_-38px_rgba(15,23,42,.38)] backdrop-blur sm:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex min-w-0 flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t(eyebrow)}
              </span>
              <span className="text-border">/</span>
              <span>{t(title)}</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="hidden h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary sm:grid">
                <Sparkles aria-hidden="true" size={20} />
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl font-bold tracking-[-.045em] [overflow-wrap:anywhere] sm:text-4xl">{t(title)}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{t(description)}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5">
                <span className={`h-2 w-2 rounded-full ${isLoaded ? "bg-chart-4" : "bg-muted-foreground"}`} />
                {isLoaded ? t("Workspace data") : t("Waiting for workspace data")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5">
                <Database aria-hidden="true" size={13} />
                {t("Tenant-scoped records")}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <div className="rounded-2xl border border-border bg-background/70 px-4 py-3 text-right">
              <span className="block text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">{t("Records")}</span>
              <strong className="mt-1 block text-2xl tracking-[-.04em]">{records.status === "loading" || records.status === "error" ? "—" : total.toLocaleString(language)}</strong>
            </div>
            <button
              type="button"
              onClick={() => void records.refresh()}
              disabled={records.loading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw aria-hidden="true" className={records.loading ? "animate-spin" : undefined} size={16} />
              {t("Refresh")}
            </button>
          </div>
        </div>
      </header>

      {records.status === "stale" ? <div className="mb-5 flex items-start gap-3 rounded-2xl border border-chart-1/30 bg-chart-1/5 px-4 py-3 text-sm text-muted-foreground shadow-sm" role="status">
        <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-chart-1" size={17} />
        <span>{t("The latest refresh failed. Only the last successfully loaded records are shown.")}</span>
      </div> : null}

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-background/75 px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 sm:max-w-xl">
          <Search aria-hidden="true" className="shrink-0 text-muted-foreground" size={17} />
          <span className="sr-only">{t("Search")}</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("Search")}
            aria-label={t("Search")}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoComplete="off"
          />
          {search ? <button type="button" onClick={() => setSearch("")} className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground" aria-label={t("Clear search")}>
            <X aria-hidden="true" size={15} />
          </button> : null}
        </label>
        <p className="m-0 text-xs text-muted-foreground" aria-live="polite">
          {isLoaded ? <><strong className="font-semibold text-foreground">{total.toLocaleString(language)}</strong> {t("Records")}</> : t("Waiting for workspace data")}
        </p>
      </div>

      {records.status === "loading" && !hasRecords ? <section className="grid min-h-[380px] place-items-center rounded-[28px] border border-border bg-card p-8 shadow-[0_18px_60px_-42px_rgba(15,23,42,.35)]" role="status" aria-live="polite">
        <div className="text-center text-sm text-muted-foreground"><LoaderCircle aria-hidden="true" className="mx-auto mb-4 animate-spin text-primary" size={28} /><p className="font-medium">{t("Loading verified records…")}</p><p className="mt-1 text-xs">{t("Reading the current workspace state")}</p></div>
      </section> : records.status === "error" && !hasRecords ? <section className="grid min-h-[380px] place-items-center rounded-[28px] border border-chart-5/30 bg-chart-5/5 p-8 text-center shadow-sm" role="alert">
        <div className="max-w-xl"><AlertTriangle aria-hidden="true" className="mx-auto mb-4 text-chart-5" size={30} /><h2 className="text-xl font-semibold">{t("Verified records unavailable")}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{records.error}</p><p className="mt-2 text-xs text-muted-foreground">{t("No metrics or success claims are inferred while the backend state is unavailable.")}</p></div>
      </section> : !hasRecords ? <section className="grid min-h-[380px] place-items-center rounded-[28px] border border-dashed border-border bg-card p-8 text-center shadow-[0_18px_60px_-42px_rgba(15,23,42,.35)]">
        <div className="max-w-xl"><div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">{emptyIcon}</div><h2 className="text-xl font-semibold tracking-[-.02em]">{hasSearch ? t("No matching records found.") : t(emptyTitle)}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{hasSearch ? t("Clear search") : t(emptyDescription)}</p>{hasSearch ? <button type="button" onClick={() => setSearch("")} className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold transition hover:bg-secondary">{t("Clear search")}</button> : null}</div>
      </section> : <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label={t(title)}>
        {records.items.map((record) => <article key={record.id} className={`group min-w-0 rounded-[24px] border p-5 shadow-[0_14px_40px_-30px_rgba(15,23,42,.45)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-30px_rgba(15,23,42,.55)] ${record.id === selectedRecordId ? "border-primary/50 bg-primary/5 ring-2 ring-primary/10" : "border-border bg-card"}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {record.id === selectedRecordId ? <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.14em] text-primary">{t("Selected record")}</p> : null}
              <h2 className="font-semibold tracking-[-.015em] [overflow-wrap:anywhere]">{record.name}</h2>
            </div>
            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusTone(record.status)}`}>{record.status || t("Status not provided")}</span>
          </div>
          {record.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{record.description}</p> : <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("No description provided")}</p>}
          <dl className="mt-5 grid gap-3 border-t border-border pt-4 text-xs sm:grid-cols-2">
            {record.stage ? <div><dt className="text-muted-foreground">{t("Stage")}</dt><dd className="mt-1 font-medium [overflow-wrap:anywhere]">{record.stage}</dd></div> : null}
            <div><dt className="text-muted-foreground">{t("Updated")}</dt><dd className="mt-1 font-medium">{formatDate(record.updatedAt, language)}</dd></div>
            {record.valueAmount != null ? <div><dt className="text-muted-foreground">{t("Value")}</dt><dd className="mt-1 font-medium">{record.valueAmount} {record.currency ?? ""}</dd></div> : null}
          </dl>
          {record.tags.length > 0 ? <div className="mt-4 flex flex-wrap gap-1.5">{record.tags.map((tag) => <span key={tag} className="max-w-full rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-muted-foreground [overflow-wrap:anywhere]">{tag}</span>)}</div> : null}
        </article>)}
      </section>}

      {hasRecords && totalPages > 1 ? <nav className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm" aria-label={t(title)}>
        <span className="text-sm text-muted-foreground">{t("Page")} <strong className="text-foreground">{page}</strong> {t("of")} <strong className="text-foreground">{totalPages}</strong></span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1 || records.loading} className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-border px-3 text-sm font-medium transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50">
            <ChevronLeft aria-hidden="true" size={15} />{t("Previous")}
          </button>
          <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages || records.loading} className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-border px-3 text-sm font-medium transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50">
            {t("Next")}<ChevronRight aria-hidden="true" size={15} />
          </button>
        </div>
      </nav> : null}
    </div>
  </main>;
}
