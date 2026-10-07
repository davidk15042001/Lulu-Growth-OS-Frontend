import { useMemo, useState, type ReactNode } from "react";
import { Archive, BriefcaseBusiness, CalendarClock, Check, CircleAlert, ClipboardCheck, DollarSign, LoaderCircle, Plus, RefreshCw, Search, UserRound, X } from "lucide-react";
import { getFriendlyErrorMessage } from "../api/client";
import { archiveRecord, createRecord, type WorkspaceRecord } from "../api/records";
import { transitionSalesRecord } from "../api/salesPipeline";
import { useLiveRecords } from "../api/useLiveRecords";
import { useLuluApp } from "../api/LuluAppContext";
import { useLuluConfirm } from "./LuluConfirmDialog";
import { useLuluDialog } from "./useLuluDialog";
import { WorkspaceSurfaceShell } from "./WorkspaceSurfaceShell";
import { useLanguage, useTranslation } from "../i18n/GlobalLanguageSwitcher";

type PipelineMode = "opportunity" | "task";
type OpportunityState = "open" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
type TaskState = "open" | "in_progress" | "completed" | "cancelled";

const STATES: Record<PipelineMode, readonly string[]> = {
  opportunity: ["open", "qualified", "proposal", "negotiation", "won", "lost"],
  task: ["open", "in_progress", "completed", "cancelled"],
};

const NEXT_STATES: Record<PipelineMode, Record<string, readonly string[]>> = {
  opportunity: {
    open: ["qualified", "lost"],
    qualified: ["proposal", "lost"],
    proposal: ["negotiation", "won", "lost"],
    negotiation: ["won", "lost"],
    won: [],
    lost: ["open"],
  },
  task: {
    open: ["in_progress", "cancelled", "completed"],
    in_progress: ["completed", "cancelled"],
    completed: [],
    cancelled: ["open"],
  },
};

type PipelineForm = {
  name: string;
  context: string;
  amount: string;
  currency: string;
  dueAt: string;
  assignee: string;
  notes: string;
};

const EMPTY_FORM: PipelineForm = { name: "", context: "", amount: "", currency: "EUR", dueAt: "", assignee: "", notes: "" };

const CONFIG: Record<PipelineMode, {
  resourceType: string;
  activeSlug: string;
  eyebrow: string;
  title: string;
  description: string;
  capability: string;
  createLabel: string;
  icon: typeof BriefcaseBusiness;
}> = {
  opportunity: {
    resourceType: "sales_deals",
    activeSlug: "deeply-month-1392",
    eyebrow: "Sales",
    title: "Sales opportunities",
    description: "Verified opportunity records and their governed pipeline state for the current workspace.",
    capability: "opportunities.manage",
    createLabel: "Create opportunity",
    icon: BriefcaseBusiness,
  },
  task: {
    resourceType: "sales_tasks",
    activeSlug: "wondrously-gate-2200",
    eyebrow: "Sales",
    title: "Sales tasks",
    description: "Durable next steps for the sales pipeline, with explicit ownership and due dates.",
    capability: "crm.manage",
    createLabel: "Create task",
    icon: ClipboardCheck,
  },
};

function recordText(record: WorkspaceRecord, key: string) {
  const value = record.data?.[key];
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function stateFor(mode: PipelineMode, record: WorkspaceRecord) {
  const pipeline = record.data?.pipeline;
  if (pipeline && typeof pipeline === "object" && !Array.isArray(pipeline) && typeof (pipeline as { state?: unknown }).state === "string") {
    const state = String((pipeline as { state: string }).state).toLowerCase();
    if (STATES[mode].includes(state)) return state;
  }
  const candidate = String(record.stage ?? record.status ?? STATES[mode][0]).trim().toLowerCase().replace(/\s+/g, "_");
  return STATES[mode].includes(candidate) ? candidate : STATES[mode][0];
}

function stateTone(state: string) {
  if (["won", "completed"].includes(state)) return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300";
  if (["lost", "cancelled"].includes(state)) return "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300";
  if (["qualified", "proposal", "negotiation", "in_progress"].includes(state)) return "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300";
  return "border-border bg-secondary text-foreground";
}

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return "—";
  try { return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value)); } catch { return "—"; }
}

function formatAmount(value: string | null, currency: string | null, locale: string) {
  if (!value) return "—";
  // Keep the canonical decimal string intact. Formatting money through a
  // JavaScript number could round large or high-precision values in the UI.
  void locale;
  return `${value} ${currency || "EUR"}`;
}

function PipelineModal({ mode, form, busy, error, onChange, onSave, onClose }: { mode: PipelineMode; form: PipelineForm; busy: boolean; error: string; onChange: (next: PipelineForm) => void; onSave: () => void; onClose: () => void }) {
  const t = useTranslation();
  const config = CONFIG[mode];
  const dialogRef = useLuluDialog<HTMLDivElement>({ open: true, onClose });
  const inputClass = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
  const isTask = mode === "task";
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div ref={dialogRef} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="sales-pipeline-modal-title">
      <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">{t(config.eyebrow)}</p><h2 id="sales-pipeline-modal-title" className="mt-2 text-xl font-semibold">{t(config.createLabel)}</h2><p className="mt-1 text-sm text-muted-foreground">{t(isTask ? "Create a durable sales task in this workspace." : "Create a durable opportunity record in this workspace.")}</p></div><button type="button" onClick={onClose} className="rounded-xl border border-border p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground" aria-label={t("Close")}><X size={17} /></button></div>
      {error ? <div className="mt-5 flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert"><CircleAlert size={16} className="mt-0.5 shrink-0" />{error}</div> : null}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium">{t(isTask ? "Task name" : "Opportunity name")} *</span><input autoFocus required value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} className={inputClass} /></label>
        <label><span className="mb-1.5 block text-xs font-medium">{t(isTask ? "Related company or deal" : "Company")}</span><input value={form.context} onChange={(event) => onChange({ ...form, context: event.target.value })} className={inputClass} /></label>
        {isTask ? <label><span className="mb-1.5 block text-xs font-medium">{t("Assignee")}</span><input value={form.assignee} onChange={(event) => onChange({ ...form, assignee: event.target.value })} className={inputClass} /></label> : <><label><span className="mb-1.5 block text-xs font-medium">{t("Potential value")}</span><div className="flex gap-2"><input inputMode="decimal" value={form.amount} onChange={(event) => onChange({ ...form, amount: event.target.value })} className={`${inputClass} min-w-0 flex-1`} placeholder="0.00" /><input value={form.currency} onChange={(event) => onChange({ ...form, currency: event.target.value.toUpperCase().slice(0, 3) })} className={`${inputClass} w-20`} aria-label={t("Currency")} /></div></label></>}
        <label><span className="mb-1.5 block text-xs font-medium">{t("Due date")}</span><input type="date" value={form.dueAt} onChange={(event) => onChange({ ...form, dueAt: event.target.value })} className={inputClass} /></label>
        <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium">{t("Notes")}</span><textarea value={form.notes} onChange={(event) => onChange({ ...form, notes: event.target.value })} placeholder={t(isTask ? "Add the context needed to complete this task." : "Add context for the next opportunity step.")} className={`${inputClass} min-h-28 resize-y`} /></label>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-secondary">{t("Cancel")}</button><button type="button" onClick={onSave} disabled={busy || !form.name.trim()} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">{busy ? <LoaderCircle size={15} className="animate-spin" /> : <Check size={15} />}{t(isTask ? "Save task" : "Save opportunity")}</button></div>
    </div>
  </div>;
}

function Metric({ icon, label, value, detail }: { icon: ReactNode; label: string; value: number | string; detail: string }) {
  return <article className="rounded-2xl border border-border bg-card p-4 shadow-[0_16px_45px_-32px_rgba(15,23,42,.45)]"><div className="flex items-center justify-between gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</span><span className="text-[11px] font-medium uppercase tracking-[.12em] text-muted-foreground">{label}</span></div><p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></article>;
}

export function SalesPipelineWorkspace({ mode }: { mode: PipelineMode }) {
  const t = useTranslation();
  const language = useLanguage();
  const config = CONFIG[mode];
  const isTask = mode === "task";
  const Icon = config.icon;
  const { hasCapability } = useLuluApp();
  const confirm = useLuluConfirm();
  const canManage = hasCapability(config.capability);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<PipelineForm>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [busyRecordId, setBusyRecordId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const queryString = query.trim() ? `search=${encodeURIComponent(query.trim())}&limit=100&sort=updatedAt&order=desc` : "limit=100&sort=updatedAt&order=desc";
  const { items, total, loading, error: loadError, status, refresh } = useLiveRecords(config.resourceType, queryString, { includeTotal: true });
  const filtered = useMemo(() => stateFilter === "all" ? items : items.filter((record) => stateFor(mode, record) === stateFilter), [items, mode, stateFilter]);
  const counts = useMemo(() => {
    const terminal = isTask ? ["completed", "cancelled"] : ["won", "lost"];
    return { total, active: items.filter((record) => !terminal.includes(stateFor(mode, record))).length, attention: isTask ? items.filter((record) => ["open", "in_progress"].includes(stateFor(mode, record))).length : items.filter((record) => ["qualified", "proposal", "negotiation"].includes(stateFor(mode, record))).length };
  }, [isTask, items, mode, total]);

  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2800); };
  const saveRecord = async () => {
    if (!canManage || !form.name.trim()) return;
    setBusy(true); setError("");
    try {
      const initialState = isTask ? "open" : "open";
      await createRecord(config.resourceType, {
        name: form.name.trim(),
        status: "active",
        stage: initialState,
        dueAt: form.dueAt ? `${form.dueAt}T23:59:59.000Z` : null,
        valueAmount: !isTask && form.amount.trim() ? form.amount.trim() : null,
        currency: !isTask && form.amount.trim() ? (form.currency.trim() || "EUR") : null,
        description: form.notes.trim() || null,
        source: "manual",
        data: { company: !isTask ? form.context.trim() || null : null, related: isTask ? form.context.trim() || null : null, assignee: isTask ? form.assignee.trim() || null : null, notes: form.notes.trim() || null },
      });
      setModalOpen(false); setForm(EMPTY_FORM); showNotice(t(isTask ? "Task created." : "Opportunity created.")); await refresh();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, t(isTask ? "The task could not be saved." : "The opportunity could not be saved."))); } finally { setBusy(false); }
  };
  const transition = async (record: WorkspaceRecord, targetState: string) => {
    if (!canManage || targetState === stateFor(mode, record)) return;
    setBusyRecordId(record.id); setError("");
    try { await transitionSalesRecord(config.resourceType, record.id, { targetState, expectedVersion: record.version, reason: `${config.resourceType}_workspace` }); showNotice(t(isTask ? "Task state updated." : "Opportunity state updated.")); await refresh(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, t(isTask ? "The task state could not be updated." : "The opportunity state could not be updated."))); }
    finally { setBusyRecordId(null); }
  };
  const archive = async (record: WorkspaceRecord) => {
    if (!canManage) return;
    const confirmed = await confirm({ title: t(isTask ? "Archive task?" : "Archive opportunity?"), description: t("The record will leave the active view while its audit history remains available."), confirmLabel: t("Archive"), cancelLabel: t("Cancel"), tone: "danger" });
    if (!confirmed) return;
    setBusyRecordId(record.id); setError("");
    try { await archiveRecord(config.resourceType, record.id); showNotice(t(isTask ? "Task archived." : "Opportunity archived.")); await refresh(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, t(isTask ? "The task could not be archived." : "The opportunity could not be archived."))); }
    finally { setBusyRecordId(null); }
  };

  return <WorkspaceSurfaceShell activeSlug={config.activeSlug}><main className="page-frame min-h-screen min-w-0 overflow-x-clip bg-background p-4 sm:p-8">
    <div className="mx-auto max-w-[1480px] space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-5"><div className="max-w-3xl"><p className="eyebrow">{t(config.eyebrow)}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t(config.title)}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{t(config.description)}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => void refresh()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-medium transition hover:bg-secondary disabled:opacity-50"><RefreshCw size={15} className={loading ? "animate-spin" : ""} />{t("Refresh")}</button><button type="button" onClick={() => { setError(""); setForm(EMPTY_FORM); setModalOpen(true); }} disabled={!canManage} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-45"><Plus size={16} />{t(config.createLabel)}</button></div></header>
      {error || loadError ? <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert"><CircleAlert size={17} className="mt-0.5 shrink-0" /><span>{error || loadError}</span></div> : null}
      {notice ? <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/25 dark:text-emerald-300" role="status"><Check size={17} />{notice}</div> : null}
      <section className="grid gap-3 sm:grid-cols-3"><Metric icon={<Icon size={17} />} label={t(isTask ? "Tasks" : "Opportunities")} value={status === "loading" || status === "error" ? "—" : counts.total} detail={t("verified records")} /><Metric icon={<Check size={17} />} label={t("Active")} value={status === "loading" || status === "error" ? "—" : counts.active} detail={t(isTask ? "open or in progress" : "not yet closed")} /><Metric icon={<CircleAlert size={17} />} label={t("Needs attention")} value={status === "loading" || status === "error" ? "—" : counts.attention} detail={t(isTask ? "open or in progress" : "qualified or in negotiation")} /></section>
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_18px_60px_-45px_rgba(15,23,42,.5)]"><div className="flex flex-wrap items-center gap-3 border-b border-border p-4 sm:p-5"><label className="relative min-w-[220px] flex-1"><Search size={16} className="absolute left-3 top-3 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t(isTask ? "Search sales tasks" : "Search opportunities")} className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" /></label><select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"><option value="all">{t("All states")}</option>{STATES[mode].map((state) => <option key={state} value={state}>{t(state)}</option>)}</select><span className="text-xs text-muted-foreground">{filtered.length} {t("shown")}</span></div>
        {loading && !items.length ? <div className="grid min-h-[360px] place-items-center p-8 text-center text-sm text-muted-foreground"><div><LoaderCircle size={27} className="mx-auto mb-3 animate-spin text-primary" /><p>{t(isTask ? "Loading verified sales tasks…" : "Loading verified opportunities…")}</p></div></div> : status === "error" && !items.length ? <div className="grid min-h-[360px] place-items-center p-8 text-center"><div className="max-w-md"><CircleAlert size={30} className="mx-auto text-destructive" /><h2 className="mt-4 text-lg font-semibold">{t(isTask ? "Task data unavailable" : "Opportunity data unavailable")}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{t("No metrics or success claims are inferred while the backend state is unavailable.")}</p></div></div> : !filtered.length ? <div className="grid min-h-[360px] place-items-center p-8 text-center"><div className="max-w-md"><Icon size={30} className="mx-auto text-muted-foreground/50" /><h2 className="mt-4 text-lg font-semibold">{t(query || stateFilter !== "all" ? "No matching pipeline records" : isTask ? "No verified sales tasks yet" : "No verified opportunities yet")}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{t(query || stateFilter !== "all" ? "Try another search or state filter." : isTask ? "Create a task or connect an approved sales provider to begin." : "Create an opportunity or connect an approved sales provider to begin.")}</p></div></div> : <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead className="border-b border-border bg-secondary/40 text-[11px] uppercase tracking-[.12em] text-muted-foreground"><tr><th className="px-5 py-3">{t(isTask ? "Task" : "Opportunity")}</th><th className="px-3 py-3">{t(isTask ? "Related context" : "Company")}</th><th className="px-3 py-3">{t(isTask ? "Assignee" : "Potential value")}</th><th className="px-3 py-3">{t(isTask ? "Due date" : "Next date")}</th><th className="px-3 py-3">{t("Current state")}</th><th className="px-3 py-3">{t("Updated")}</th><th className="px-3 py-3 text-right">{t("Actions")}</th></tr></thead><tbody className="divide-y divide-border">{filtered.map((record) => { const state = stateFor(mode, record); const nextStates = NEXT_STATES[mode][state] ?? []; const recordBusy = busyRecordId === record.id; return <tr key={record.id} className="transition hover:bg-secondary/30"><td className="max-w-[260px] px-5 py-4"><strong className="block truncate font-semibold">{record.name}</strong><span className="mt-1 block truncate text-xs text-muted-foreground">{record.description || t("No description provided")}</span></td><td className="max-w-[200px] truncate px-3 py-4 text-muted-foreground">{recordText(record, isTask ? "related" : "company") || "—"}</td><td className="whitespace-nowrap px-3 py-4 text-muted-foreground">{isTask ? <span className="inline-flex items-center gap-1.5"><UserRound size={14} />{recordText(record, "assignee") || "—"}</span> : <span className="inline-flex items-center gap-1.5"><DollarSign size={14} />{formatAmount(record.valueAmount, record.currency, language)}</span>}</td><td className="whitespace-nowrap px-3 py-4 text-muted-foreground"><span className="inline-flex items-center gap-1.5"><CalendarClock size={14} />{formatDate(record.dueAt, language)}</span></td><td className="px-3 py-4"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${stateTone(state)}`}>{t(state)}</span>{nextStates.length ? <select value="" disabled={!canManage || recordBusy} onChange={(event) => { if (event.target.value) void transition(record, event.target.value); }} className="mt-2 block max-w-36 rounded-lg border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground outline-none disabled:opacity-50"><option value="">{recordBusy ? t("Updating…") : t("Next step")}</option>{nextStates.map((next) => <option key={next} value={next}>{t(next)}</option>)}</select> : null}</td><td className="whitespace-nowrap px-3 py-4 text-xs text-muted-foreground">{formatDate(record.updatedAt, language)}</td><td className="px-3 py-4 text-right"><button type="button" onClick={() => void archive(record)} disabled={!canManage || recordBusy} className="rounded-xl border border-border p-2 text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40" aria-label={`${t("Archive")} ${record.name}`}><Archive size={15} /></button></td></tr>; })}</tbody></table></div>}
      </section>
    </div>
    {modalOpen && canManage ? <PipelineModal mode={mode} form={form} busy={busy} error={error} onChange={setForm} onSave={() => void saveRecord()} onClose={() => { if (!busy) setModalOpen(false); }} /> : null}
  </main></WorkspaceSurfaceShell>;
}
