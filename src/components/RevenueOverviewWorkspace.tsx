import type { ReactNode } from "react";
import { CircleDollarSign, Database, RefreshCw, Search, ShieldCheck, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import type { WorkspaceRecord } from "../api/records";
import { useLiveRecords } from "../api/useLiveRecords";
import { useLanguage, useTranslation } from "../i18n/GlobalLanguageSwitcher";

type ExactTotals = Map<string, string>;

function normalizeDecimal(value: string | null) {
  const match = value?.trim().match(/^([+-]?)(\d+)(?:\.(\d+))?$/);
  if (!match) return null;
  const [, sign, rawInteger, rawFraction = ""] = match;
  const integer = rawInteger.replace(/^0+(?=\d)/, "") || "0";
  const fraction = rawFraction.replace(/0+$/, "");
  return `${sign === "-" ? "-" : ""}${integer}${fraction ? `.${fraction}` : ""}`;
}

function addExactDecimals(left: string, right: string) {
  const [leftInteger, leftFraction = ""] = left.replace(/^\+/, "").split(".");
  const [rightInteger, rightFraction = ""] = right.replace(/^\+/, "").split(".");
  const scale = Math.max(leftFraction.length, rightFraction.length);
  const multiplier = 10n ** BigInt(scale);
  const toScaledInteger = (integer: string, fraction: string) => {
    const negative = integer.startsWith("-");
    const whole = negative ? integer.slice(1) : integer;
    const value = BigInt(whole) * multiplier + BigInt((fraction + "0".repeat(scale)).slice(0, scale) || "0");
    return negative ? -value : value;
  };
  const total = toScaledInteger(leftInteger, leftFraction) + toScaledInteger(rightInteger, rightFraction);
  const negative = total < 0n;
  const digits = (negative ? -total : total).toString().padStart(scale + 1, "0");
  const whole = scale ? digits.slice(0, -scale) : digits;
  const fraction = scale ? digits.slice(-scale).replace(/0+$/, "") : "";
  return `${negative && total !== 0n ? "-" : ""}${whole}${fraction ? `.${fraction}` : ""}`;
}

function exactTotals(records: WorkspaceRecord[]): ExactTotals {
  const totals: ExactTotals = new Map();
  for (const record of records) {
    const amount = normalizeDecimal(record.valueAmount);
    if (amount == null) continue;
    const currency = record.currency?.trim().toUpperCase() || "";
    totals.set(currency, totals.has(currency) ? addExactDecimals(totals.get(currency)!, amount) : amount);
  }
  return totals;
}

function formatDate(value: string, language: string) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString(language) : "—";
}

function ExactMoney({ totals, emptyLabel }: { totals: ExactTotals; emptyLabel: string }) {
  const entries = [...totals.entries()].sort(([left], [right]) => left.localeCompare(right));
  if (!entries.length) return <strong className="text-2xl font-semibold tracking-[-.04em]">—</strong>;
  return <div className="space-y-1">
    {entries.map(([currency, amount]) => <strong key={currency || "unspecified"} className="block text-xl font-semibold tracking-[-.04em]">{amount} <span className="text-sm font-medium text-muted-foreground">{currency || emptyLabel}</span></strong>)}
  </div>;
}

function MetricCard({ label, detail, icon, children, tone }: { label: string; detail: string; icon: ReactNode; children: ReactNode; tone: string }) {
  const t = useTranslation();
  return <article className="rounded-2xl border border-border bg-card p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,.45)]">
    <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{t(label)}</p><div className="mt-3">{children}</div></div><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${tone}`}>{icon}</span></div>
    <p className="mt-4 text-xs leading-5 text-muted-foreground">{t(detail)}</p>
  </article>;
}

export function RevenueOverviewWorkspace() {
  const t = useTranslation();
  const language = useLanguage();
  const [query, setQuery] = useState("");
  const income = useLiveRecords("finance_income", "limit=50", { includeTotal: true });
  const recurring = useLiveRecords("finance_recurring_revenue", "limit=50", { includeTotal: true });
  const records = useMemo(() => [...income.items, ...recurring.items].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)), [income.items, recurring.items]);
  const incomeTotals = useMemo(() => exactTotals(income.items), [income.items]);
  const recurringTotals = useMemo(() => exactTotals(recurring.items), [recurring.items]);
  const allTotals = useMemo(() => exactTotals(records), [records]);
  const isLoading = income.loading || recurring.loading;
  const error = income.error || recurring.error;
  const visibleRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return records;
    return records.filter((record) => `${record.name} ${record.description ?? ""} ${record.status} ${record.currency ?? ""} ${record.resourceType}`.toLocaleLowerCase().includes(normalizedQuery));
  }, [query, records]);
  const refresh = () => void Promise.all([income.refresh(), recurring.refresh()]);

  if (isLoading && records.length === 0) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><RefreshCw className="animate-spin" size={16} />{t("Loading verified revenue data…")}</span></main>;
  if (error && records.length === 0) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-center"><section className="max-w-md rounded-3xl border border-chart-5/30 bg-card p-8"><CircleDollarSign className="mx-auto text-chart-5" size={30} /><h1 className="mt-4 text-xl font-semibold">{t("Revenue data is unavailable")}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{error}</p><button type="button" onClick={refresh} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background"><RefreshCw size={15} />{t("Try again")}</button></section></main>;
  if (records.length === 0) return <main className="min-h-screen bg-[var(--background)] p-5 text-foreground sm:p-8 lg:p-10"><section className="mx-auto grid min-h-[520px] max-w-4xl place-items-center rounded-[28px] border border-dashed border-border bg-card p-8 text-center shadow-[0_18px_60px_-42px_rgba(15,23,42,.35)]"><div className="max-w-xl"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><TrendingUp size={25} /></span><h1 className="mt-5 text-2xl font-semibold tracking-[-.035em]">{t("Revenue Intelligence")}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{t("No verified income or recurring-revenue records are available for this workspace yet. Connect an approved finance provider before reviewing revenue composition or trends.")}</p></div></section></main>;

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_color-mix(in_srgb,_var(--primary)_10%,_transparent),_transparent_34%),var(--background)] p-4 text-foreground sm:p-7 lg:p-10">
    <div className="mx-auto max-w-7xl">
      <header className="relative mb-6 overflow-hidden rounded-[28px] border border-border/80 bg-card/95 p-5 shadow-[0_18px_60px_-38px_rgba(15,23,42,.38)] backdrop-blur sm:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-muted-foreground"><span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-3 py-1.5"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{t("Finance")}</span><span className="text-border">/</span><span>{t("Revenue Intelligence")}</span></div><div className="flex items-start gap-3"><span className="hidden h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary sm:grid"><TrendingUp size={21} /></span><div><h1 className="text-3xl font-bold tracking-[-.045em] sm:text-4xl">{t("Revenue Intelligence")}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{t("Observed income and recurring-revenue records from the current workspace. No forecast or exchange rate is inferred.")}</p></div></div><div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5"><span className="h-2 w-2 rounded-full bg-chart-4" />{t("Verified workspace data")}</span><span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5"><Database size={13} />{t("Tenant-scoped records")}</span></div></div><button type="button" onClick={refresh} disabled={isLoading} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-wait disabled:opacity-60"><RefreshCw className={isLoading ? "animate-spin" : undefined} size={16} />{t("Refresh verified data")}</button></div>
      </header>

      {error ? <div role="status" className="mb-5 rounded-2xl border border-chart-1/30 bg-chart-1/5 px-4 py-3 text-sm text-muted-foreground">{t("Some revenue data could not be refreshed. The view may show the last verified result.")}</div> : null}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Income records" detail="Canonical income records currently loaded." icon={<CircleDollarSign size={18} />} tone="bg-primary/10 text-primary"><strong className="text-2xl tracking-[-.04em]">{income.total.toLocaleString(language)}</strong></MetricCard><MetricCard label="Recurring revenue records" detail="Canonical recurring-revenue records currently loaded." icon={<RefreshCw size={18} />} tone="bg-sky-500/10 text-sky-700 dark:text-sky-300"><strong className="text-2xl tracking-[-.04em]">{recurring.total.toLocaleString(language)}</strong></MetricCard><MetricCard label="Observed income" detail="Exact totals grouped by source currency." icon={<TrendingUp size={18} />} tone="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"><ExactMoney totals={incomeTotals} emptyLabel={t("Unspecified currency")} /></MetricCard><MetricCard label="Observed recurring revenue" detail="Exact totals grouped by source currency." icon={<ShieldCheck size={18} />} tone="bg-violet-500/10 text-violet-700 dark:text-violet-300"><ExactMoney totals={recurringTotals} emptyLabel={t("Unspecified currency")} /></MetricCard></section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_45px_-32px_rgba(15,23,42,.38)]"><div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-base font-semibold tracking-[-.025em]">{t("Verified revenue records")}</h2><p className="mt-1 text-xs text-muted-foreground">{records.length} {t("records loaded; amounts remain separate by currency")}</p></div><label className="flex min-h-10 items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 sm:w-80"><Search size={15} className="text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search revenue records")} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border bg-secondary/35 text-xs font-semibold uppercase tracking-[.11em] text-muted-foreground"><tr><th className="px-5 py-3">{t("Record")}</th><th className="px-5 py-3">{t("Source")}</th><th className="px-5 py-3">{t("Status")}</th><th className="px-5 py-3 text-right">{t("Amount")}</th><th className="px-5 py-3">{t("Updated")}</th></tr></thead><tbody className="divide-y divide-border">{visibleRecords.map((record) => <tr key={`${record.resourceType}-${record.id}`} className="transition hover:bg-secondary/35"><td className="px-5 py-4"><strong className="block font-medium">{record.name}</strong><small className="mt-1 block max-w-[320px] truncate text-xs text-muted-foreground">{record.description ?? t("No additional detail")}</small></td><td className="px-5 py-4 text-muted-foreground">{record.resourceType}</td><td className="px-5 py-4"><span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium">{record.status || t("Status not provided")}</span></td><td className="px-5 py-4 text-right font-medium">{record.valueAmount ?? "—"} {record.currency ?? ""}</td><td className="px-5 py-4 text-xs text-muted-foreground">{formatDate(record.updatedAt, language)}</td></tr>)}{visibleRecords.length === 0 ? <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">{t("No verified revenue records match this search.")}</td></tr> : null}</tbody></table></div></section>

      <footer className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><ShieldCheck size={14} /><span>{t("Forecasts, customer segments and currency conversion are intentionally hidden until supported by a canonical, verifiable data contract.")}</span><span className="ml-auto">{allTotals.size} {t("source currencies")}</span></footer>
    </div>
  </main>;
}
