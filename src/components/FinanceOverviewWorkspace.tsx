import { useMemo, useState } from "react";
import { CircleDollarSign, Landmark, ReceiptText, RefreshCw, Search, TrendingDown, TrendingUp, WalletCards } from "lucide-react";
import { type WorkspaceRecord } from "../api/records";
import { useLiveRecords } from "../api/useLiveRecords";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";

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

function differenceExactTotals(left: ExactTotals, right: ExactTotals): ExactTotals {
  const result: ExactTotals = new Map(left);
  for (const [currency, amount] of right) {
    result.set(currency, result.has(currency) ? addExactDecimals(result.get(currency)!, `-${amount.replace(/^-/, "")}`) : `-${amount.replace(/^-/, "")}`);
  }
  return result;
}

function ExactMoney({ totals, emptyLabel }: { totals: ExactTotals; emptyLabel: string }) {
  const t = useTranslation();
  const entries = [...totals.entries()].sort(([left], [right]) => left.localeCompare(right));
  if (!entries.length) return <strong className="text-2xl font-semibold tracking-[-.045em] text-foreground">—</strong>;
  return <div className="space-y-1.5" aria-label={t("Exact totals by currency")}>
    {entries.map(([currency, amount]) => <strong key={currency || "unspecified"} className="block text-xl font-semibold tracking-[-.045em] text-foreground">{amount} <span className="text-sm font-medium text-muted-foreground">{currency || emptyLabel}</span></strong>)}
  </div>;
}

function MetricCard({ label, detail, totals, icon, accent }: { label: string; detail: string; totals: ExactTotals; icon: React.ReactNode; accent: string }) {
  const t = useTranslation();
  return <article className="rounded-2xl border border-border bg-card p-4 shadow-[0_18px_45px_rgba(4,15,32,.06)]">
    <div className="flex items-start justify-between gap-4">
      <div><p className="text-xs font-semibold text-muted-foreground">{t(label)}</p><div className="mt-3"><ExactMoney totals={totals} emptyLabel={t("Unspecified currency")} /></div></div>
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${accent}`}>{icon}</span>
    </div>
    <p className="mt-3 text-xs leading-5 text-muted-foreground">{t(detail)}</p>
  </article>;
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  const locale = typeof document !== "undefined" ? document.documentElement.lang || "en-US" : "en-US";
  return Number.isNaN(date.valueOf()) ? "—" : date.toLocaleString(locale);
}

function FinanceSurface({ embedded, className, children }: { embedded: boolean; className: string; children: React.ReactNode }) {
  const Tag = embedded ? "section" : "main";
  return <Tag className={className}>{children}</Tag>;
}

function FinanceOverviewContent({ embedded }: { embedded: boolean }) {
  const t = useTranslation();
  const accounts = useLiveRecords("finance_accounts");
  const expenses = useLiveRecords("finance_expenses");
  const invoices = useLiveRecords("finance_invoices");
  const [query, setQuery] = useState("");
  const isLoading = accounts.loading || expenses.loading || invoices.loading;
  const error = accounts.error || expenses.error || invoices.error;
  const records = useMemo(() => [...invoices.items, ...expenses.items, ...accounts.items], [accounts.items, expenses.items, invoices.items]);
  const invoiceTotals = useMemo(() => exactTotals(invoices.items), [invoices.items]);
  const expenseTotals = useMemo(() => exactTotals(expenses.items), [expenses.items]);
  const accountTotals = useMemo(() => exactTotals(accounts.items), [accounts.items]);
  const netTotals = useMemo(() => differenceExactTotals(invoiceTotals, expenseTotals), [expenseTotals, invoiceTotals]);
  const visibleRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return records;
    return records.filter((record) => `${record.name} ${record.description ?? ""} ${record.status} ${record.currency ?? ""}`.toLocaleLowerCase().includes(normalizedQuery));
  }, [query, records]);
  const refresh = () => void Promise.all([accounts.refresh(), expenses.refresh(), invoices.refresh()]);

  if (isLoading && records.length === 0) return <FinanceSurface embedded={embedded} className={embedded ? "grid min-h-56 place-items-center rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground" : "grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground"}><span className="inline-flex items-center"><RefreshCw className="mr-2 animate-spin" size={16} />{t("Loading verified finance data…")}</span></FinanceSurface>;
  if (error && records.length === 0) return <FinanceSurface embedded={embedded} className={embedded ? "rounded-3xl border border-destructive/30 bg-card p-7" : "grid min-h-screen place-items-center bg-[var(--background)] p-6"}><section className="mx-auto max-w-md text-center"><CircleDollarSign className="mx-auto mb-4 text-destructive" size={28} /><h2 className="text-lg font-semibold text-foreground">{t("Finance data is unavailable")}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{error}</p><button type="button" onClick={refresh} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><RefreshCw size={15} />{t("Try again")}</button></section></FinanceSurface>;
  if (records.length === 0) return <FinanceSurface embedded={embedded} className={embedded ? "rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-foreground shadow-[0_20px_50px_rgba(4,15,32,.06)]" : "min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"}><section className="mx-auto grid max-w-3xl place-items-center text-center"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-muted-foreground"><CircleDollarSign size={23} /></span><h2 className="mt-5 text-2xl font-semibold tracking-[-.04em]">{t("Finance Overview")}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{t("No verified finance data is available yet. Connect a finance platform or add records before reviewing financial metrics.")}</p></section></FinanceSurface>;

  return <FinanceSurface embedded={embedded} className={embedded ? "text-foreground" : "min-h-screen bg-[var(--background)] p-5 text-foreground sm:p-8 lg:p-10"}><div className="mx-auto max-w-7xl">
    {!embedded ? <header className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">{t("Finance control")}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.055em] sm:text-4xl">{t("Finance Overview")}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{t("Verified financial records from the connected workspace. Amounts remain exact and are never converted or mixed across currencies.")}</p></div><button type="button" onClick={refresh} disabled={isLoading} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-secondary disabled:cursor-wait disabled:opacity-70"><RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />{t("Refresh verified data")}</button></header> : <div className="mb-4 flex justify-end"><button type="button" onClick={refresh} disabled={isLoading} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-secondary disabled:cursor-wait disabled:opacity-70"><RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />{t("Refresh verified data")}</button></div>}
    {error ? <div className="mb-5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">{t("Some finance data could not be refreshed. The view may show the last verified result.")}</div> : null}
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Invoice value" detail="Exact totals from canonical invoice records." totals={invoiceTotals} icon={<ReceiptText size={17} />} accent="bg-primary/10 text-primary" /><MetricCard label="Expense value" detail="Exact totals from canonical expense records." totals={expenseTotals} icon={<TrendingDown size={17} />} accent="bg-amber-500/10 text-amber-700 dark:text-amber-300" /><MetricCard label="Net from records" detail="Invoice value less expense value, kept separate by currency." totals={netTotals} icon={<TrendingUp size={17} />} accent="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" /><MetricCard label="Account balances" detail="Reported balances from connected finance accounts." totals={accountTotals} icon={<Landmark size={17} />} accent="bg-sky-500/10 text-sky-700 dark:text-sky-300" /></section>
    <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_45px_rgba(4,15,32,.05)]"><div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-base font-semibold tracking-[-.025em]">{t("Financial records")}</h2><p className="mt-1 text-xs text-muted-foreground">{records.length} {t("verified records in this workspace")}</p></div><label className="flex min-h-10 items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 sm:w-80"><Search size={15} className="text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search verified finance records")} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border bg-secondary/35 text-xs font-semibold uppercase tracking-[.11em] text-muted-foreground"><tr><th className="px-5 py-3">{t("Record")}</th><th className="px-5 py-3">{t("Type")}</th><th className="px-5 py-3">{t("Status")}</th><th className="px-5 py-3 text-right">{t("Amount")}</th><th className="px-5 py-3">{t("Updated")}</th></tr></thead><tbody className="divide-y divide-border">{visibleRecords.map((record) => <tr key={`${record.resourceType}-${record.id}`} className="transition hover:bg-secondary/35"><td className="px-5 py-4"><strong className="block font-medium text-foreground">{record.name}</strong><small className="mt-1 block max-w-[300px] truncate text-xs text-muted-foreground">{record.description ?? t("No additional detail")}</small></td><td className="px-5 py-4 text-muted-foreground">{record.resourceType}</td><td className="px-5 py-4"><span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">{record.status}</span></td><td className="px-5 py-4 text-right font-medium text-foreground">{record.valueAmount ?? "—"} {record.currency ?? ""}</td><td className="px-5 py-4 text-xs text-muted-foreground">{formatUpdatedAt(record.updatedAt)}</td></tr>)}{visibleRecords.length === 0 ? <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">{t("No verified finance records match this search.")}</td></tr> : null}</tbody></table></div></section>
    <footer className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><WalletCards size={14} /><span>{t("Amounts are grouped by their source currency. Lulu never infers an exchange rate.")}</span></footer>
  </div></FinanceSurface>;
}

export function FinanceOverviewWorkspace() {
  return <FinanceOverviewContent embedded={false} />;
}

export function FinanceOverviewPanel() {
  return <FinanceOverviewContent embedded />;
}
