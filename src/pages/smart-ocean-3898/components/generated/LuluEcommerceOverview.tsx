import { AlertTriangle, Database, LoaderCircle, RefreshCw, Search, ShoppingBag, Store, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useLiveRecords } from "../../../../api/useLiveRecords";
import { useLanguage, useTranslation } from "../../../../i18n/GlobalLanguageSwitcher";

const PAGE_SIZE = 24;

function formatDate(value: string | null | undefined, language: string) {
  if (!value) return "—";
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString(language) : "—";
}

export function LuluEcommerceOverview() {
  const t = useTranslation();
  const language = useLanguage();
  const [query, setQuery] = useState("");
  const orders = useLiveRecords("ecommerce_orders", `limit=${PAGE_SIZE}`, { includeTotal: true });
  const customers = useLiveRecords("ecommerce_customers", `limit=${PAGE_SIZE}`, { includeTotal: true });
  const stores = useLiveRecords("ecommerce_stores", `limit=${PAGE_SIZE}`, { includeTotal: true });
  const loading = orders.loading || customers.loading || stores.loading;
  const error = orders.error || customers.error || stores.error;
  const refresh = () => void Promise.all([orders.refresh(), customers.refresh(), stores.refresh()]);
  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return orders.items;
    return orders.items.filter((record) => `${record.id} ${record.name} ${record.description ?? ""}`.toLowerCase().includes(normalizedQuery));
  }, [orders.items, query]);

  if (loading && !orders.items.length && !customers.items.length && !stores.items.length) {
    return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-foreground"><section className="w-full max-w-2xl rounded-2xl border border-border bg-card p-10 text-center" role="status" aria-live="polite"><LoaderCircle aria-hidden="true" className="mx-auto mb-4 animate-spin text-muted-foreground" size={28} /><h1 className="text-xl font-semibold">{t("Loading verified commerce data")}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{t("Orders, customers and stores are being read from the connected workspace.")}</p></section></main>;
  }

  if (error && !orders.items.length && !customers.items.length && !stores.items.length) {
    return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-foreground"><section className="w-full max-w-2xl rounded-2xl border border-chart-5/30 bg-card p-10 text-center" role="alert"><AlertTriangle aria-hidden="true" className="mx-auto mb-4 text-chart-5" size={28} /><h1 className="text-xl font-semibold">{t("Commerce overview unavailable")}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{t("Lulu could not verify the current commerce state. No metrics or example records are shown.")}</p><p className="mt-2 text-xs text-muted-foreground">{error}</p><button type="button" onClick={refresh} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><RefreshCw size={15} />{t("Refresh")}</button></section></main>;
  }

  if (!orders.items.length && !customers.items.length && !stores.items.length) {
    return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-foreground"><section className="w-full max-w-2xl rounded-2xl border border-dashed border-border bg-card p-10 text-center"><ShoppingBag aria-hidden="true" className="mx-auto mb-4 text-muted-foreground" size={30} /><h1 className="text-xl font-semibold">{t("Commerce Overview")}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{t("No live commerce data is available yet. Connect a verified store before reviewing orders, customers or revenue.")}</p><p className="mt-4 text-xs text-muted-foreground">{t("Run the global Update button in the navigation after your store is connected.")}</p></section></main>;
  }

  const collections = [
    { label: t("Orders"), count: orders.total, icon: ShoppingBag },
    { label: t("Customers"), count: customers.total, icon: Users },
    { label: t("Stores"), count: stores.total, icon: Store },
  ];

  return <main className="min-h-screen bg-[var(--background)] p-5 text-foreground sm:p-8 lg:p-10" aria-busy={loading}>
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">{t("Website & Commerce / Overview")}</p><h1 className="mt-2 text-3xl font-bold [overflow-wrap:anywhere]">{t("Commerce Overview")}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{t("Verified commerce records from the connected workspace. Revenue, orders, customers and stores appear only when returned by the backend.")}</p></div>
        <button type="button" onClick={refresh} disabled={loading} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-secondary disabled:cursor-wait disabled:opacity-60"><RefreshCw aria-hidden="true" className={loading ? "animate-spin" : undefined} size={15} />{t("Refresh")}</button>
      </header>

      {error ? <div className="mb-6 flex items-start gap-2 rounded-xl border border-chart-1/30 bg-chart-1/5 px-4 py-3 text-sm text-muted-foreground" role="status"><AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-chart-1" size={16} /><span>{t("The latest refresh failed. Only the last successfully loaded records are shown.")}</span></div> : null}

      <section className="mb-7 grid gap-3 md:grid-cols-3" aria-label={t("Commerce Overview")}>
        {collections.map(({ label, count, icon: Icon }) => <article key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">{label}</span><Icon aria-hidden="true" className="text-muted-foreground" size={18} /></div><strong className="mt-3 block text-3xl tracking-tight">{count.toLocaleString(language)}</strong><span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Database aria-hidden="true" size={12} />{t("Verified records")}</span></article>)}
      </section>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold">{t("Recent Orders")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("Orders, customers and stores are being read from the connected workspace.")}</p></div><label className="flex min-h-10 min-w-0 items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 sm:w-80"><Search aria-hidden="true" className="shrink-0 text-muted-foreground" size={15} /><input aria-label={t("Search live commerce records")} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search live commerce records")} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label></div>
        {filteredOrders.length ? <div className="divide-y divide-border">{filteredOrders.map((record) => <article key={record.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><h3 className="font-medium [overflow-wrap:anywhere]">{record.name}</h3>{record.description ? <p className="mt-1 text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{record.description}</p> : null}<div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span>{t("Order ID")}: {record.id}</span><span>{t("Updated")}: {formatDate(record.updatedAt, language)}</span></div></div><span className="w-fit rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground">{record.status || t("Status not provided")}</span></article>)}</div> : <div className="p-10 text-center text-sm text-muted-foreground">{t("No live commerce data is available yet. Connect a verified store before reviewing orders, customers or revenue.")}</div>}
      </section>
    </div>
  </main>;
}
