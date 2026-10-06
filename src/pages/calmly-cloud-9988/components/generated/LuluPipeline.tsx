import { AlertTriangle, ChevronRight, LoaderCircle, RefreshCw, Search, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLiveRecords } from "../../../../api/useLiveRecords";
import { useLanguage, useTranslation } from "../../../../i18n/GlobalLanguageSwitcher";

const PAGE_SIZE = 48;

function field(record: { data?: Record<string, unknown> | null }, key: string) {
  return record.data?.[key] == null ? "" : String(record.data[key]);
}

function formatDate(value: string | null | undefined, language: string) {
  if (!value) return "—";
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString(language) : "—";
}

export function LuluPipeline() {
  const t = useTranslation();
  const language = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const stages = useLiveRecords("crm_pipeline_stages", `limit=${PAGE_SIZE}`);
  const deals = useLiveRecords("sales_deals", `limit=${PAGE_SIZE}`);
  const loading = stages.loading || deals.loading;
  const error = stages.error || deals.error;
  const refresh = () => void Promise.all([stages.refresh(), deals.refresh()]);

  const stageNames = useMemo(() => {
    const configured = stages.items.map((record, index) => record.name || field(record, "stageName") || `${t("Stage")} ${index + 1}`);
    const inferred = deals.items.map((record) => field(record, "stage") || field(record, "stageName")).filter(Boolean);
    return [...new Set([...configured, ...inferred])];
  }, [deals.items, stages.items, t]);

  const visibleDeals = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return deals.items;
    return deals.items.filter((record) => `${record.id} ${record.name} ${record.description ?? ""} ${field(record, "company")}`.toLowerCase().includes(normalizedQuery));
  }, [deals.items, query]);

  const selectedDeal = selectedDealId ? deals.items.find((record) => record.id === selectedDealId) ?? null : null;
  const stageRecords = stageNames.map((name) => ({
    name,
    deals: visibleDeals.filter((record) => (field(record, "stage") || field(record, "stageName") || "") === name),
  }));
  const unassignedDeals = visibleDeals.filter((record) => !field(record, "stage") && !field(record, "stageName"));

  if (loading && !stages.items.length && !deals.items.length) {
    return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-foreground"><section className="w-full max-w-2xl rounded-2xl border border-border bg-card p-10 text-center" role="status" aria-live="polite"><LoaderCircle aria-hidden="true" className="mx-auto mb-4 animate-spin text-muted-foreground" size={28} /><h1 className="text-xl font-semibold">{t("Live data required")}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{t("Live pipeline insights will appear when connected stages and deal activity are available.")}</p></section></main>;
  }

  if (error && !stages.items.length && !deals.items.length) {
    return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-foreground"><section className="w-full max-w-2xl rounded-2xl border border-chart-5/30 bg-card p-10 text-center" role="alert"><AlertTriangle aria-hidden="true" className="mx-auto mb-4 text-chart-5" size={28} /><h1 className="text-xl font-semibold">{t("Live data unavailable")}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{t("Live pipeline insights will appear when connected stages and deal activity are available.")}</p><p className="mt-2 text-xs text-muted-foreground">{error}</p><button type="button" onClick={refresh} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><RefreshCw size={15} />{t("Refresh")}</button></section></main>;
  }

  return <main className="min-h-screen bg-[var(--background)] p-5 text-foreground sm:p-8 lg:p-10">
    <div className="mx-auto max-w-[1500px]">
      <header className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div className="min-w-0"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-primary"><Sparkles aria-hidden="true" size={14} />{t("AI-POWERED REVENUE OPERATIONS")}</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{t("Pipeline")}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{t("Visualize, manage and optimize your sales pipeline from first qualification to closed revenue.")}</p></div><button type="button" onClick={refresh} disabled={loading} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-secondary disabled:cursor-wait disabled:opacity-60"><RefreshCw aria-hidden="true" className={loading ? "animate-spin" : undefined} size={15} />{t("Refresh")}</button></header>

      {error ? <div className="mb-6 flex items-start gap-2 rounded-xl border border-chart-1/30 bg-chart-1/5 px-4 py-3 text-sm text-muted-foreground" role="status"><AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-chart-1" size={16} /><span>{t("Live data unavailable")}. {t("Live pipeline insights will appear when connected stages and deal activity are available.")}</span></div> : null}

      <section className="mb-7 grid gap-3 sm:grid-cols-2" aria-label={t("Pipeline")}><article className="rounded-2xl border border-border bg-card p-5 shadow-sm"><p className="text-sm text-muted-foreground">{t("Open Deals")}</p><strong className="mt-3 block text-3xl tracking-tight">{deals.total.toLocaleString(language)}</strong><span className="mt-1 block text-xs text-muted-foreground">{t("Live records")}</span></article><article className="rounded-2xl border border-border bg-card p-5 shadow-sm"><p className="text-sm text-muted-foreground">{t("Stages")}</p><strong className="mt-3 block text-3xl tracking-tight">{stageNames.length.toLocaleString(language)}</strong><span className="mt-1 block text-xs text-muted-foreground">{t("Live records")}</span></article></section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"><div className="mb-5 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold">{t("Sales pipeline")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("Live pipeline insights will appear when connected stages and deal activity are available.")}</p></div><label className="flex min-h-10 min-w-0 items-center gap-2 rounded-lg border border-border bg-secondary px-3 sm:w-80"><Search aria-hidden="true" className="shrink-0 text-muted-foreground" size={15} /><input aria-label={t("Search pipeline...")} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search pipeline...")} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label></div>
        {stageRecords.length || unassignedDeals.length ? <div className="flex gap-4 overflow-x-auto pb-2">{stageRecords.map((stage) => <section key={stage.name} className="min-w-[270px] flex-1 rounded-xl border border-border bg-secondary/50 p-3"><header className="mb-3 flex items-start justify-between gap-3"><div><h3 className="text-sm font-semibold">{stage.name}</h3><p className="mt-1 text-xs text-muted-foreground">{stage.deals.length.toLocaleString(language)} {t("Live records")}</p></div><ChevronRight aria-hidden="true" className="mt-0.5 text-muted-foreground" size={16} /></header><div className="space-y-2">{stage.deals.map((record) => <DealCard key={record.id} record={record} language={language} t={t} onSelect={setSelectedDealId} />)}</div></section>)}{unassignedDeals.length ? <section className="min-w-[270px] flex-1 rounded-xl border border-dashed border-border bg-secondary/30 p-3"><header className="mb-3"><h3 className="text-sm font-semibold">{t("Live data required")}</h3><p className="mt-1 text-xs text-muted-foreground">{unassignedDeals.length.toLocaleString(language)} {t("Live records")}</p></header><div className="space-y-2">{unassignedDeals.map((record) => <DealCard key={record.id} record={record} language={language} t={t} onSelect={setSelectedDealId} />)}</div></section> : null}</div> : <div className="grid min-h-[320px] place-items-center rounded-xl border border-dashed border-border p-8 text-center"><div><Sparkles aria-hidden="true" className="mx-auto text-muted-foreground" size={28} /><p className="mt-4 text-sm text-muted-foreground">{t("Live pipeline insights will appear when connected stages and deal activity are available.")}</p></div></div>}
      </section>
    </div>

    {selectedDeal ? <aside className="fixed inset-y-0 right-0 z-50 flex w-[min(420px,100vw)] flex-col border-l border-border bg-card p-6 shadow-2xl" aria-label={t("Deal Preview")}><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">{t("Deal Preview")}</p><h2 className="mt-2 text-xl font-semibold [overflow-wrap:anywhere]">{selectedDeal.name}</h2></div><button type="button" onClick={() => setSelectedDealId(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label={t("Cancel")}><X size={18} /></button></div><dl className="mt-8 space-y-5 text-sm"><Detail label={t("Value")} value={selectedDeal.valueAmount ? `${selectedDeal.valueAmount} ${selectedDeal.currency ?? ""}`.trim() : "—"} /><Detail label={t("Company")} value={field(selectedDeal, "company") || "—"} /><Detail label={t("Contact")} value={field(selectedDeal, "contact") || "—"} /><Detail label={t("Owner")} value={field(selectedDeal, "owner") || "—"} /><Detail label={t("Stage")} value={field(selectedDeal, "stage") || field(selectedDeal, "stageName") || "—"} /><Detail label={t("Updated")} value={formatDate(selectedDeal.updatedAt, language)} /></dl>{selectedDeal.description ? <p className="mt-6 rounded-xl border border-border bg-secondary p-4 text-sm leading-6 text-muted-foreground">{selectedDeal.description}</p> : null}</aside> : null}
  </main>;
}

function DealCard({ record, language, t, onSelect }: { record: { id: string; name: string; description?: string | null; status?: string | null; valueAmount?: string | null; currency?: string | null; updatedAt?: string | null; data?: Record<string, unknown> | null }; language: string; t: (value: string) => string; onSelect: (id: string) => void }) {
  return <button type="button" onClick={() => onSelect(record.id)} className="w-full rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary/40 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/40"><div className="flex items-start justify-between gap-3"><h4 className="min-w-0 font-medium [overflow-wrap:anywhere]">{record.name}</h4><span className="shrink-0 rounded-full border border-border bg-secondary px-2 py-1 text-[10px] text-muted-foreground">{record.status || t("Live records")}</span></div><p className="mt-3 text-sm font-semibold">{record.valueAmount ? `${record.valueAmount} ${record.currency ?? ""}`.trim() : "—"}</p><div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground"><span>{t("Updated")}: {formatDate(record.updatedAt, language)}</span><span>{record.id}</span></div></button>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-border pb-4 last:border-0"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>;
}
