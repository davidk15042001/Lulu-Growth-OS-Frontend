import { useMemo, useState, type ReactNode } from "react";
import { Archive, Check, CircleAlert, LoaderCircle, Plus, RefreshCw, Search, Users, X } from "lucide-react";
import { getFriendlyErrorMessage } from "../api/client";
import { archiveRecord, createRecord, type WorkspaceRecord } from "../api/records";
import { transitionSalesRecord } from "../api/salesPipeline";
import { useLiveRecords } from "../api/useLiveRecords";
import { useLuluApp } from "../api/LuluAppContext";
import { useLuluConfirm } from "./LuluConfirmDialog";
import { useLuluDialog } from "./useLuluDialog";
import { WorkspaceSurfaceShell } from "./WorkspaceSurfaceShell";
import { useLanguage, useTranslation } from "../i18n/GlobalLanguageSwitcher";

const RESOURCE_TYPE = "sales_leads";
const STATES = ["new", "contacted", "qualified", "disqualified", "converted", "lost"] as const;
const NEXT_STATES: Record<string, readonly string[]> = {
  new: ["contacted", "qualified", "disqualified", "lost"],
  contacted: ["qualified", "disqualified", "lost"],
  qualified: ["converted", "lost"],
  disqualified: ["new", "lost"],
  converted: [],
  lost: ["new"],
};

type LeadForm = { name: string; company: string; email: string; source: string; notes: string };
const EMPTY_FORM: LeadForm = { name: "", company: "", email: "", source: "", notes: "" };

function recordText(record: WorkspaceRecord, key: string) {
  const value = record.data?.[key];
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function leadState(record: WorkspaceRecord) {
  const pipeline = record.data?.pipeline;
  if (pipeline && typeof pipeline === "object" && !Array.isArray(pipeline) && typeof (pipeline as { state?: unknown }).state === "string") {
    return String((pipeline as { state: string }).state).toLowerCase();
  }
  const candidate = String(record.stage ?? record.status ?? "new").trim().toLowerCase().replace(/\s+/g, "_");
  return STATES.includes(candidate as typeof STATES[number]) ? candidate : "new";
}

function formatDate(value: string, locale: string) {
  try { return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value)); } catch { return "—"; }
}

function stateTone(state: string) {
  if (["qualified", "converted"].includes(state)) return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300";
  if (["disqualified", "lost"].includes(state)) return "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300";
  if (state === "contacted") return "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300";
  return "border-border bg-secondary text-foreground";
}

function LeadModal({ form, busy, error, onChange, onSave, onClose }: { form: LeadForm; busy: boolean; error: string; onChange: (next: LeadForm) => void; onSave: () => void; onClose: () => void }) {
  const t = useTranslation();
  const dialogRef = useLuluDialog<HTMLDivElement>({ open: true, onClose });
  const inputClass = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div ref={dialogRef} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="sales-lead-modal-title">
      <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">{t("Sales")}</p><h2 id="sales-lead-modal-title" className="mt-2 text-xl font-semibold">{t("New lead")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("Create a durable lead record in this workspace.")}</p></div><button type="button" onClick={onClose} className="rounded-xl border border-border p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground" aria-label={t("Close")}><X size={17} /></button></div>
      {error ? <div className="mt-5 flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert"><CircleAlert size={16} className="mt-0.5 shrink-0" />{error}</div> : null}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium">{t("Lead name")} *</span><input autoFocus required value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} className={inputClass} /></label>
        <label><span className="mb-1.5 block text-xs font-medium">{t("Company")}</span><input value={form.company} onChange={(event) => onChange({ ...form, company: event.target.value })} className={inputClass} /></label>
        <label><span className="mb-1.5 block text-xs font-medium">{t("Email")}</span><input type="email" value={form.email} onChange={(event) => onChange({ ...form, email: event.target.value })} className={inputClass} /></label>
        <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium">{t("Source")}</span><input value={form.source} onChange={(event) => onChange({ ...form, source: event.target.value })} placeholder={t("e.g. website, referral or campaign")} className={inputClass} /></label>
        <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium">{t("Notes")}</span><textarea value={form.notes} onChange={(event) => onChange({ ...form, notes: event.target.value })} placeholder={t("Add a short context for the next sales step.")} className={`${inputClass} min-h-28 resize-y`} /></label>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-secondary">{t("Cancel")}</button><button type="button" onClick={onSave} disabled={busy || !form.name.trim()} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">{busy ? <LoaderCircle size={15} className="animate-spin" /> : <Check size={15} />}{t("Save lead")}</button></div>
    </div>
  </div>;
}

function Metric({ icon, label, value, detail }: { icon: ReactNode; label: string; value: number | string; detail: string }) {
  return <article className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_45px_-32px_rgba(15,23,42,.45)]"><div className="flex items-center justify-between gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</span><span className="text-[11px] font-medium uppercase tracking-[.12em] text-muted-foreground">{label}</span></div><p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></article>;
}

export function SalesLeadsWorkspace() {
  const t = useTranslation();
  const language = useLanguage();
  const { hasCapability } = useLuluApp();
  const confirm = useLuluConfirm();
  const canManage = hasCapability("leads.manage");
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<LeadForm>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [busyRecordId, setBusyRecordId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const queryString = query.trim() ? `search=${encodeURIComponent(query.trim())}&limit=100&sort=updatedAt&order=desc` : "limit=100&sort=updatedAt&order=desc";
  const { items, total, loading, error: loadError, status, refresh } = useLiveRecords(RESOURCE_TYPE, queryString, { includeTotal: true });
  const filtered = useMemo(() => stageFilter === "all" ? items : items.filter((record) => leadState(record) === stageFilter), [items, stageFilter]);
  const counts = useMemo(() => ({ total, qualified: items.filter((record) => ["qualified", "converted"].includes(leadState(record))).length, attention: items.filter((record) => ["new", "contacted"].includes(leadState(record))).length }), [items, total]);

  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2800); };
  const saveLead = async () => {
    if (!canManage || !form.name.trim()) return;
    setBusy(true); setError("");
    try {
      await createRecord(RESOURCE_TYPE, { name: form.name.trim(), status: "active", stage: "new", source: form.source.trim() || "manual", description: form.notes.trim() || null, data: { company: form.company.trim() || null, email: form.email.trim() || null, source: form.source.trim() || null, notes: form.notes.trim() || null } });
      setModalOpen(false); setForm(EMPTY_FORM); showNotice(t("Lead created.")); await refresh();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, t("The lead could not be saved."))); } finally { setBusy(false); }
  };
  const transition = async (record: WorkspaceRecord, targetState: string) => {
    if (!canManage || targetState === leadState(record)) return;
    setBusyRecordId(record.id); setError("");
    try { await transitionSalesRecord(RESOURCE_TYPE, record.id, { targetState, expectedVersion: record.version, reason: "sales_leads_workspace" }); showNotice(t("Lead state updated.")); await refresh(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, t("The lead state could not be updated."))); }
    finally { setBusyRecordId(null); }
  };
  const archive = async (record: WorkspaceRecord) => {
    if (!canManage) return;
    const confirmed = await confirm({ title: t("Archive lead?"), description: t("The lead will leave the active view while its audit history remains available."), confirmLabel: t("Archive"), cancelLabel: t("Cancel"), tone: "danger" });
    if (!confirmed) return;
    setBusyRecordId(record.id); setError("");
    try { await archiveRecord(RESOURCE_TYPE, record.id); showNotice(t("Lead archived.")); await refresh(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, t("The lead could not be archived."))); }
    finally { setBusyRecordId(null); }
  };

  return <WorkspaceSurfaceShell activeSlug="softly-autumn-9038"><main className="page-frame min-h-screen min-w-0 overflow-x-clip bg-background p-4 sm:p-8">
    <div className="mx-auto max-w-[1480px] space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-5"><div className="max-w-3xl"><p className="eyebrow">{t("Sales")}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t("Leads")}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{t("Verified sales-lead records for the current workspace.")}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => void refresh()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-medium transition hover:bg-secondary disabled:opacity-50"><RefreshCw size={15} className={loading ? "animate-spin" : ""} />{t("Refresh")}</button><button type="button" onClick={() => { setError(""); setForm(EMPTY_FORM); setModalOpen(true); }} disabled={!canManage} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-45"><Plus size={16} />{t("Create lead")}</button></div></header>

      {error || loadError ? <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert"><CircleAlert size={17} className="mt-0.5 shrink-0" /><span>{error || loadError}</span></div> : null}
      {notice ? <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-300" role="status"><Check size={17} />{notice}</div> : null}

      <section className="grid gap-3 sm:grid-cols-3"><Metric icon={<Users size={17} />} label={t("Leads")} value={status === "loading" || status === "error" ? "—" : counts.total} detail={t("verified records")} /><Metric icon={<Check size={17} />} label={t("Qualified")} value={status === "loading" || status === "error" ? "—" : counts.qualified} detail={t("qualified or converted")} /><Metric icon={<CircleAlert size={17} />} label={t("Needs attention")} value={status === "loading" || status === "error" ? "—" : counts.attention} detail={t("new or contacted")}/></section>

      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_18px_60px_-45px_rgba(15,23,42,.5)]"><div className="flex flex-wrap items-center gap-3 border-b border-border p-4 sm:p-5"><label className="relative min-w-[220px] flex-1"><Search size={16} className="absolute left-3 top-3 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search leads")} className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" /></label><select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"><option value="all">{t("All stages")}</option>{STATES.map((state) => <option key={state} value={state}>{t(state)}</option>)}</select><span className="text-xs text-muted-foreground">{filtered.length} {t("shown")}</span></div>
        {loading && !items.length ? <div className="grid min-h-[360px] place-items-center p-8 text-center text-sm text-muted-foreground"><div><LoaderCircle size={27} className="mx-auto mb-3 animate-spin text-primary" /><p>{t("Loading verified sales leads…")}</p></div></div> : status === "error" && !items.length ? <div className="grid min-h-[360px] place-items-center p-8 text-center"><div className="max-w-md"><CircleAlert size={30} className="mx-auto text-destructive" /><h2 className="mt-4 text-lg font-semibold">{t("Lead data unavailable")}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{t("No metrics or success claims are inferred while the backend state is unavailable.")}</p></div></div> : !filtered.length ? <div className="grid min-h-[360px] place-items-center p-8 text-center"><div className="max-w-md"><Users size={30} className="mx-auto text-muted-foreground/50" /><h2 className="mt-4 text-lg font-semibold">{query || stageFilter !== "all" ? t("No matching sales leads") : t("No verified sales leads yet")}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{query || stageFilter !== "all" ? t("Try another search or stage filter.") : t("Create a lead or connect an approved sales provider to begin.")}</p></div></div> : <div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-sm"><thead className="border-b border-border bg-secondary/40 text-[11px] uppercase tracking-[.12em] text-muted-foreground"><tr><th className="px-5 py-3">{t("Lead")}</th><th className="px-3 py-3">{t("Company")}</th><th className="px-3 py-3">{t("Contact")}</th><th className="px-3 py-3">{t("Source")}</th><th className="px-3 py-3">{t("Current state")}</th><th className="px-3 py-3">{t("Updated")}</th><th className="px-3 py-3 text-right">{t("Actions")}</th></tr></thead><tbody className="divide-y divide-border">{filtered.map((record) => { const state = leadState(record); const nextStates = NEXT_STATES[state] ?? []; const recordBusy = busyRecordId === record.id; return <tr key={record.id} className="transition hover:bg-secondary/30"><td className="max-w-[250px] px-5 py-4"><strong className="block truncate font-semibold">{record.name}</strong><span className="mt-1 block truncate text-xs text-muted-foreground">{record.description || t("No description provided")}</span></td><td className="max-w-[180px] truncate px-3 py-4 text-muted-foreground">{recordText(record, "company") || "—"}</td><td className="max-w-[220px] truncate px-3 py-4 text-muted-foreground">{recordText(record, "email") || "—"}</td><td className="max-w-[150px] truncate px-3 py-4 text-muted-foreground">{record.source || recordText(record, "source") || "—"}</td><td className="px-3 py-4"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${stateTone(state)}`}>{t(state)}</span>{nextStates.length ? <select value="" disabled={!canManage || recordBusy} onChange={(event) => { if (event.target.value) void transition(record, event.target.value); }} className="mt-2 block max-w-36 rounded-lg border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground outline-none disabled:opacity-50"><option value="">{recordBusy ? t("Updating…") : t("Next step")}</option>{nextStates.map((next) => <option key={next} value={next}>{t(next)}</option>)}</select> : null}</td><td className="whitespace-nowrap px-3 py-4 text-xs text-muted-foreground">{formatDate(record.updatedAt, language)}</td><td className="px-3 py-4 text-right"><button type="button" onClick={() => void archive(record)} disabled={!canManage || recordBusy} className="rounded-xl border border-border p-2 text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40" aria-label={`${t("Archive")} ${record.name}`}><Archive size={15} /></button></td></tr>; })}</tbody></table></div>}
      </section>
    </div>
    {modalOpen && canManage ? <LeadModal form={form} busy={busy} error={error} onChange={setForm} onSave={() => void saveLead()} onClose={() => { if (!busy) setModalOpen(false); }} /> : null}
  </main></WorkspaceSurfaceShell>;
}
