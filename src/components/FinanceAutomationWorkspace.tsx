import { useEffect, useMemo, useState } from 'react';
import { Archive, CheckCircle2, Clock3, LoaderCircle, Pause, Play, Plus, RefreshCw, Search, ShieldCheck, Sparkles, X, Zap } from 'lucide-react';
import { getFriendlyErrorMessage } from '../api/client';
import { archiveFinanceAutomation, createFinanceAutomation, listFinanceAutomationRuns, listFinanceAutomations, updateFinanceAutomation, validateFinanceAutomation, type FinanceAutomation, type FinanceAutomationRun, type FinanceAutomationStep } from '../api/finance-automations';
import { WorkspaceSurfaceShell } from './WorkspaceSurfaceShell';

const inputClass = 'mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15';

function stepLabel(step: FinanceAutomationStep | undefined) {
  if (!step) return 'Not configured';
  if (step.type === 'execute_job') return String(step.config.job ?? 'Execute job');
  return step.type.replaceAll('_', ' ');
}

function triggerLabel(trigger: FinanceAutomationStep | undefined) {
  if (!trigger) return 'Manual';
  if (trigger.type === 'schedule') {
    const intervalMinutes = Number(trigger.config.intervalMinutes);
    if (Number.isInteger(intervalMinutes) && intervalMinutes > 0) {
      return `Every ${intervalMinutes >= 60 ? `${intervalMinutes / 60}h` : `${intervalMinutes}m`}`;
    }
    return String(trigger.config.label ?? trigger.config.cron ?? 'Scheduled');
  }
  return trigger.type.replaceAll('_', ' ');
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Never';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? '—' : date.toLocaleString();
}

function statusLabel(record: FinanceAutomation) {
  return record.data?.enabled === false || record.status === 'paused' ? 'Paused' : 'Active';
}

export function FinanceAutomationWorkspace() {
  const [records, setRecords] = useState<FinanceAutomation[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState('manual');
  const [scheduleIntervalMinutes, setScheduleIntervalMinutes] = useState('60');
  const [jobText, setJobText] = useState('');
  const [saving, setSaving] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<FinanceAutomation | null>(null);
  const [runDetails, setRunDetails] = useState<Record<string, FinanceAutomationRun[]>>({});
  const [runLoadingId, setRunLoadingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listFinanceAutomations('limit=100&sort=updatedAt&order=desc');
      setRecords(response.data.items);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'Finance automations could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const visibleRecords = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return records.filter((record) => {
      const matchesQuery = !needle || `${record.name} ${record.description ?? ''} ${triggerLabel(record.data?.trigger)} ${record.data?.actions?.map(stepLabel).join(' ')}`.toLocaleLowerCase().includes(needle);
      const status = statusLabel(record).toLocaleLowerCase();
      return matchesQuery && (statusFilter === 'all' || status === statusFilter);
    });
  }, [query, records, statusFilter]);

  const activeCount = records.filter((record) => statusLabel(record) === 'Active').length;
  const pausedCount = records.length - activeCount;
  const runs = records.reduce((sum, record) => sum + Number(record.data?.execution?.runs ?? 0), 0);

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setName('');
    setDescription('');
    setTrigger('manual');
    setScheduleIntervalMinutes('60');
    setJobText('');
  };

  const save = async () => {
    const actions = jobText.split('\n').map((job) => job.trim()).filter(Boolean).slice(0, 10).map((job) => ({ type: 'execute_job', config: { job } }));
    if (!name.trim() || actions.length === 0) {
      setError('Give the automation a name and add at least one action.');
      return;
    }
    const intervalMinutes = Number(scheduleIntervalMinutes);
    if (trigger === 'schedule' && (!Number.isInteger(intervalMinutes) || intervalMinutes < 15 || intervalMinutes > 1_440)) {
      setError('Scheduled automations must run every 15 minutes to 24 hours.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createFinanceAutomation({
        name: name.trim(),
        description: description.trim() || null,
        trigger: { type: trigger, config: trigger === 'schedule' ? { intervalMinutes } : {} },
        actions,
        enabled: true,
      });
      closeModal();
      await load();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'The automation could not be saved.'));
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (record: FinanceAutomation) => {
    const enabled = statusLabel(record) !== 'Active';
    setBusyId(record.id);
    setError(null);
    try {
      const response = await updateFinanceAutomation(record.id, { enabled, expectedVersion: record.version });
      setRecords((current) => current.map((item) => item.id === record.id ? response.data : item));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'The automation state could not be changed.'));
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const validate = async (record: FinanceAutomation) => {
    setBusyId(record.id);
    setError(null);
    try {
      await validateFinanceAutomation(record.id);
      setRecords((current) => current.map((item) => {
        if (item.id !== record.id) return item;
        const execution = item.data.execution ?? { lastRunAt: null, lastStatus: 'never', runs: 0, successfulRuns: 0, failedRuns: 0 };
        return { ...item, data: { ...item.data, execution: { ...execution, lastRunAt: new Date().toISOString(), lastStatus: 'validated', runs: execution.runs + 1, successfulRuns: execution.successfulRuns + 1 } } };
      }));
      if (runDetails[record.id]) {
        const response = await listFinanceAutomationRuns(record.id);
        setRunDetails((current) => ({ ...current, [record.id]: response.data.items }));
      }
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'The automation could not be validated.'));
    } finally {
      setBusyId(null);
    }
  };

  const archive = async () => {
    const record = archiveTarget;
    if (!record) return;
    setArchiveTarget(null);
    setBusyId(record.id);
    setError(null);
    try {
      await archiveFinanceAutomation(record.id);
      setRecords((current) => current.filter((item) => item.id !== record.id));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'The automation could not be archived.'));
    } finally {
      setBusyId(null);
    }
  };

  const toggleRuns = async (record: FinanceAutomation) => {
    if (runDetails[record.id]) {
      setRunDetails((current) => {
        const next = { ...current };
        delete next[record.id];
        return next;
      });
      return;
    }
    setRunLoadingId(record.id);
    setError(null);
    try {
      const response = await listFinanceAutomationRuns(record.id);
      setRunDetails((current) => ({ ...current, [record.id]: response.data.items }));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'Runtime evidence could not be loaded.'));
    } finally {
      setRunLoadingId(null);
    }
  };

  return <WorkspaceSurfaceShell activeSlug="vibrantly-second-9428"><main className="page-frame min-h-screen overflow-x-clip bg-background p-4 text-foreground sm:p-8 lg:p-10">
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col justify-between gap-6 border-b border-border pb-8 lg:flex-row lg:items-end">
        <div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"><Sparkles size={13} /> Canonical finance controls</div><h1 className="text-3xl font-semibold tracking-[-.055em] sm:text-4xl">Financial automation</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Create deterministic finance rules with a visible trigger, bounded actions and an auditable lifecycle. No animation is treated as proof of execution.</p></div>
        <button type="button" onClick={() => setModalOpen(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90"><Plus size={16} /> New automation</button>
      </header>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200"><ShieldCheck size={17} className="mt-0.5 shrink-0" /><div><p className="font-semibold">Live validation</p><p className="mt-1 leading-5 text-amber-800/80 dark:text-amber-200/80">Rules are tenant-scoped and versioned. Validation confirms configuration; it does not pretend that provider or accounting side effects already happened.</p></div></div>
      {error ? <div role="alert" className="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"><span>{error}</span><button type="button" onClick={() => setError(null)} aria-label="Dismiss error"><X size={16} /></button></div> : null}

      <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {([
          { label: 'Automations', value: records.length, Icon: Zap, detail: 'Configured finance rules' },
          { label: 'Active', value: activeCount, Icon: CheckCircle2, detail: 'Eligible for their trigger' },
          { label: 'Paused', value: pausedCount, Icon: Pause, detail: 'Stopped without deleting' },
          { label: 'Recorded runs', value: runs, Icon: Clock3, detail: 'From canonical execution metadata' },
        ] as const).map(({ label, value, Icon, detail }) => <article key={label} className="rounded-2xl border border-border bg-card p-5 shadow-[0_18px_45px_rgba(4,15,32,.05)]"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</p><span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary"><Icon size={17} /></span></div><p className="mt-5 text-3xl font-semibold tracking-[-.05em]">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></article>)}
      </section>

      <section className="mt-7 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_45px_rgba(4,15,32,.05)]">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-base font-semibold tracking-[-.02em]">Your automations</h2><p className="mt-1 text-xs text-muted-foreground">{loading ? 'Loading verified rules…' : `${visibleRecords.length} of ${records.length} rules shown`}</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="flex min-h-10 items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 sm:w-72"><Search size={15} className="text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search automations" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="min-h-10 rounded-xl border border-border bg-secondary/50 px-3 text-sm outline-none focus:border-primary"><option value="all">All states</option><option value="active">Active</option><option value="paused">Paused</option></select><button type="button" onClick={() => void load()} className="grid min-h-10 min-w-10 place-items-center rounded-xl border border-border bg-secondary/50 text-muted-foreground transition hover:text-foreground" aria-label="Refresh automations"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /></button></div></div>
        {loading && records.length === 0 ? <div className="grid min-h-64 place-items-center text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><LoaderCircle size={17} className="animate-spin" /> Loading canonical finance data…</span></div> : null}
        {!loading && visibleRecords.length === 0 ? <div className="grid min-h-72 place-items-center px-6 py-14 text-center"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Zap size={22} /></span><h3 className="mt-5 text-lg font-semibold">{records.length === 0 ? 'No finance automation yet' : 'No rule matches this view'}</h3><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{records.length === 0 ? 'Start with one bounded rule. It will be stored in the workspace and can be paused or validated at any time.' : 'Try a different search or state filter.'}</p>{records.length === 0 ? <button type="button" onClick={() => setModalOpen(true)} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary/70"><Plus size={15} /> Create first rule</button> : null}</div> : null}
        {visibleRecords.length > 0 ? <div className="divide-y divide-border">{visibleRecords.map((record) => { const busy = busyId === record.id; const state = statusLabel(record); const displayedRuns = runDetails[record.id]; return <article key={record.id} className="p-5 transition hover:bg-secondary/20 sm:p-6"><div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-base font-semibold">{record.name}</h3><span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${state === 'Active' ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'}`}>{state}</span><span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">v{record.version}</span></div><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{record.description || 'No description provided.'}</p><div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5"><Clock3 size={13} /> {triggerLabel(record.data?.trigger)}</span><span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5"><Zap size={13} /> {record.data?.actions?.length ?? 0} action{record.data?.actions?.length === 1 ? '' : 's'}</span><span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5"><ShieldCheck size={13} /> {record.data?.execution?.lastStatus === 'validated' ? 'Validated' : 'Not run'}</span></div></div><div className="flex flex-wrap items-center gap-2 xl:justify-end"><div className="mr-2 hidden text-right text-xs text-muted-foreground sm:block"><span className="block">Last run</span><span className="mt-1 block font-medium text-foreground">{formatDate(record.data?.execution?.lastRunAt)}</span></div><button type="button" onClick={() => void toggleRuns(record)} disabled={runLoadingId === record.id} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-semibold transition hover:bg-secondary disabled:opacity-50"><Clock3 size={14} /> {runLoadingId === record.id ? 'Loading…' : displayedRuns ? 'Hide evidence' : 'Run evidence'}</button><button type="button" onClick={() => void validate(record)} disabled={busy} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-semibold transition hover:bg-secondary disabled:opacity-50"><ShieldCheck size={14} /> Validate</button><button type="button" onClick={() => void toggle(record)} disabled={busy} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-semibold transition hover:bg-secondary disabled:opacity-50">{state === 'Active' ? <Pause size={14} /> : <Play size={14} />}{state === 'Active' ? 'Pause' : 'Resume'}</button><button type="button" onClick={() => setArchiveTarget(record)} disabled={busy} className="grid min-h-10 min-w-10 place-items-center rounded-xl border border-border text-muted-foreground transition hover:border-destructive/30 hover:text-destructive disabled:opacity-50" aria-label={`Archive ${record.name}`}><Archive size={14} /></button></div></div>{displayedRuns ? <div className="mt-5 rounded-2xl border border-border bg-secondary/30 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">Runtime evidence</p><p className="mt-1 text-xs text-muted-foreground">Persisted interval runs. Every entry is validation-only; no provider or journal side effect is implied.</p></div><span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">{displayedRuns.length} shown</span></div>{displayedRuns.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No scheduled run has been recorded yet.</p> : <div className="mt-4 grid gap-2">{displayedRuns.map((run) => <div key={run.id} className="flex flex-col gap-2 rounded-xl border border-border bg-background/70 p-3 text-xs sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-foreground">{run.status === 'validated' ? 'Validated' : run.status === 'failed' ? 'Failed' : 'Running'}</p><p className="mt-1 text-muted-foreground">Scheduled {formatDate(run.scheduledFor)} · {run.executionBoundary} · side effects: none</p></div>{run.errorMessage ? <p className="max-w-md text-destructive">{run.errorCode}: {run.errorMessage}</p> : <span className="text-muted-foreground">Recorded {formatDate(run.finishedAt ?? run.startedAt)}</span>}</div>)}</div>}</div> : null}</article>; })}</div> : null}
      </section>
      <p className="mt-5 flex items-center gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck size={14} className="shrink-0 text-primary" />Rules are tenant-scoped and versioned. Validation confirms configuration; it does not pretend that provider or accounting side effects already happened.</p>
    </div>

    {modalOpen ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="new-automation-title"><div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Finance control</p><h2 id="new-automation-title" className="mt-2 text-xl font-semibold">Create automation</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Describe one trigger and the bounded jobs it should prepare. One job per line.</p></div><button type="button" onClick={closeModal} className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground hover:text-foreground" aria-label="Close dialog"><X size={16} /></button></div><label className="mt-6 block text-sm font-medium">Name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} className={inputClass} placeholder="Overdue invoice follow-up" /></label><label className="mt-4 block text-sm font-medium">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} className={`${inputClass} min-h-24 py-3`} placeholder="What should this rule achieve?" /></label><label className="mt-4 block text-sm font-medium">Trigger<select value={trigger} onChange={(event) => setTrigger(event.target.value)} className={inputClass}><option value="manual">Manual / assistant request</option><option value="invoice_overdue">Invoice becomes overdue</option><option value="invoice_created">Invoice is created</option><option value="payment_received">Payment is received</option><option value="schedule">Scheduled trigger</option></select></label>{trigger === 'schedule' ? <label className="mt-4 block text-sm font-medium">Run every 15 minutes–24 hours<input type="number" min="15" max="1440" step="15" value={scheduleIntervalMinutes} onChange={(event) => setScheduleIntervalMinutes(event.target.value)} className={inputClass} /><span className="mt-1 block text-xs font-normal text-muted-foreground">The cadence is stored with the rule so the backend can evaluate it deterministically.</span></label> : null}<label className="mt-4 block text-sm font-medium">Actions<textarea value={jobText} onChange={(event) => setJobText(event.target.value)} className={`${inputClass} min-h-28 py-3`} placeholder={'Review overdue balance\nPrepare a follow-up task'} /></label><div className="mt-7 flex justify-end gap-2"><button type="button" onClick={closeModal} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold">Cancel</button><button type="button" onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{saving ? <LoaderCircle size={15} className="animate-spin" /> : <Plus size={15} />} Save automation</button></div></div></div> : null}
    {archiveTarget ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="archive-automation-title"><div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Finance control</p><h2 id="archive-automation-title" className="mt-2 text-xl font-semibold">Archive</h2><p className="mt-3 text-sm leading-6 text-foreground">{archiveTarget.name}</p></div><button type="button" onClick={() => setArchiveTarget(null)} className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground hover:text-foreground" aria-label="Close dialog"><X size={16} /></button></div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setArchiveTarget(null)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold">Cancel</button><button type="button" onClick={() => void archive()} className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground"><Archive size={15} /> Archive</button></div></div></div> : null}
  </main></WorkspaceSurfaceShell>;
}
