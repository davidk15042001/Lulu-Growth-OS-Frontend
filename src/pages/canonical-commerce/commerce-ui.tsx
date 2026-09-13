import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { isOfficePanelSurface, routes, withOfficePanelSurface } from "../../routing";

export const fieldClass = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50";
export const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40";
export const secondaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--secondary)] disabled:cursor-not-allowed disabled:opacity-40";

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function formatNumber(value: string | number | null | undefined, maximumFractionDigits = 4) {
  const number = Number(value ?? 0);
  return Number.isFinite(number)
    ? new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(number)
    : String(value ?? "—");
}

export function formatMoney(value: string | number | null | undefined, currency: string) {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return `${currency} ${String(value ?? "—")}`;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${currency} ${formatNumber(amount, 2)}`;
  }
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const tone = normalized === "FULFILLED" || normalized === "DELIVERED" || normalized === "ACTIVE" || normalized === "PAID"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : normalized === "CANCELLED" || normalized === "ARCHIVED"
      ? "border-slate-200 bg-slate-100 text-slate-600"
      : normalized === "DRAFT" || normalized === "INACTIVE"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-indigo-200 bg-indigo-50 text-indigo-800";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${tone}`}>{normalized.replaceAll("_", " ")}</span>;
}

export function Feedback({ error, notice }: { error?: string; notice?: string }) {
  if (!error && !notice) return null;
  return error ? (
    <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
      <AlertTriangle size={17} className="mt-0.5 shrink-0" />
      <span>{error}</span>
    </div>
  ) : (
    <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
      <span>{notice}</span>
    </div>
  );
}

export function Modal({ title, description, children, onClose, width = "max-w-2xl" }: { title: string; description?: string; children: ReactNode; onClose: () => void; width?: string }) {
  return (
    <div className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`my-auto w-full ${width} overflow-hidden rounded-2xl border border-white/60 bg-[var(--card)] shadow-[0_30px_100px_rgba(15,23,42,.28)]`}>
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
            {description ? <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"><X size={18} /></button>
        </header>
        <div className="max-h-[min(76vh,760px)] overflow-y-auto p-5">{children}</div>
      </section>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="grid min-h-72 place-items-center p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--secondary)] text-[var(--muted-foreground)]">{icon}</div>
        <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}

export function StatCard({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{value}</div>
      {detail ? <div className="mt-1 text-xs text-[var(--muted-foreground)]">{detail}</div> : null}
    </div>
  );
}

export function CommerceTabs({ active }: { active: "products" | "orders" | "inventory" }) {
  const tabs = [
    ["products", "Products", routes.app.products],
    ["orders", "Orders", routes.app.orders],
    ["inventory", "Inventory", routes.app.inventory],
  ] as const;
  return <nav className="flex rounded-xl border border-[var(--border)] bg-[var(--card)] p-1" aria-label="Commerce workspace">{tabs.map(([id, label, to]) => <Link key={id} to={isOfficePanelSurface() ? withOfficePanelSurface(to) : to} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${active === id ? "bg-[var(--foreground)] text-[var(--background)]" : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"}`}>{label}</Link>)}</nav>;
}
