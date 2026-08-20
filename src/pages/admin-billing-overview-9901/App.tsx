import { useEffect, useMemo, useState } from "react";
import { getFriendlyErrorMessage } from "../../api/client";
import { requestApi } from "../../api/client";
import { LogOut, RefreshCw, ShieldCheck } from "lucide-react";

type Plan = "explorer" | "starter" | "ai" | "test";
type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  companyName: string;
  planKey: Plan;
  subscriptionStatus: string;
  startDate: string | null;
  expiryDate: string | null;
  apiCostMinor: string;
  storageCostMinor: string;
  storageBytes: string;
};

type Overview = { month: string; periodStart: string; periodEnd: string; customers: Customer[] };

const money = (minor: string) => `${(Number(minor || 0) / 100).toFixed(2)} CNY`;
const date = (value: string | null) => value ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(new Date(value)) : "—";
const monthNow = () => new Date().toISOString().slice(0, 7);

export default function App() {
  const [month, setMonth] = useState(monthNow());
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const response = await requestApi<Overview>({ path: `/admin/billing-overview?month=${encodeURIComponent(month)}` });
      setOverview(response.data);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "Die Admin-Daten konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [month]);

  const updatePlan = async (customer: Customer, planKey: Plan) => {
    setSavingId(customer.id); setError("");
    try {
      await requestApi({ path: `/admin/workspaces/${customer.id}/plan`, method: "PATCH", body: { planKey } });
      setOverview((current) => current ? { ...current, customers: current.customers.map((item) => item.id === customer.id ? { ...item, planKey } : item) } : current);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "Das Abo-Modell konnte nicht geändert werden.")); }
    finally { setSavingId(""); }
  };

  const rows = useMemo(() => overview?.customers ?? [], [overview]);
  return <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-foreground sm:px-8 lg:px-12">
    <div className="mx-auto max-w-[1500px]">
      <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Private administration</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Customer billing overview</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Interne Übersicht für Kunden, Abos und monatliche Infrastrukturkosten.</p></div>
        <div className="flex items-center gap-2"><label className="text-xs font-medium text-muted-foreground">Zeitraum<input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="ml-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground" /></label><button type="button" onClick={() => void load()} className="mt-5 rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground" aria-label="Aktualisieren"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /></button></div>
      </header>
      <div className="mb-5 flex items-center gap-2 rounded-lg border border-chart-4/30 bg-chart-4/5 px-4 py-3 text-xs text-chart-4"><ShieldCheck size={16} /> Nur Administratoren können diese Seite und die Aboänderungen verwenden.</div>
      {error && <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="overflow-x-auto"><table className="min-w-[1200px] w-full text-left text-sm"><thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">ID</th><th className="px-4 py-3">Vorname Name</th><th className="px-4 py-3">Firmenname</th><th className="px-4 py-3">Abo-Modell</th><th className="px-4 py-3">Startdatum</th><th className="px-4 py-3">Expiry Day</th><th className="px-4 py-3">Monatliche API-Kosten</th><th className="px-4 py-3">Server-Storage-Kosten</th></tr></thead><tbody className="divide-y divide-border">{loading ? <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">Daten werden geladen …</td></tr> : rows.length === 0 ? <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">Keine Kunden für den gewählten Zeitraum.</td></tr> : rows.map((customer) => <tr key={customer.id} className="align-top hover:bg-secondary/20"><td className="px-4 py-4 font-mono text-xs text-muted-foreground">{customer.id}</td><td className="px-4 py-4"><strong>{[customer.firstName, customer.lastName].filter(Boolean).join(" ") || "—"}</strong><span className="mt-1 block text-xs text-muted-foreground">{customer.email}</span></td><td className="px-4 py-4">{customer.companyName}</td><td className="px-4 py-4"><select aria-label={`Abo für ${customer.companyName}`} disabled={savingId === customer.id} value={customer.planKey} onChange={(event) => void updatePlan(customer, event.target.value as Plan)} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"><option value="explorer">Explorer</option><option value="starter">Starter</option><option value="ai">AI</option><option value="test">Test</option></select><span className="mt-1 block text-xs text-muted-foreground">{customer.subscriptionStatus}</span></td><td className="px-4 py-4">{date(customer.startDate)}</td><td className="px-4 py-4">{date(customer.expiryDate)}</td><td className="px-4 py-4 font-medium">{money(customer.apiCostMinor)}<span className="mt-1 block text-xs text-muted-foreground">{overview?.periodStart} – {overview?.periodEnd}</span></td><td className="px-4 py-4 font-medium">{money(customer.storageCostMinor)}<span className="mt-1 block text-xs text-muted-foreground">{overview?.periodStart} – {overview?.periodEnd}</span></td></tr>)}</tbody></table></div></section>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><LogOut size={13} /> Diese interne Seite ist nicht in der normalen Navigation verlinkt.</p>
    </div>
  </main>;
}
