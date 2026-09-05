import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, LoaderCircle, RotateCcw, Save, Settings2 } from 'lucide-react';
import { workspaceAppApi, type WorkspaceSettings } from '../../../../api/workspace-app';
import { getFriendlyErrorMessage } from '../../../../api/client';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { LuluGlobalNavigation } from '../../../../components/LuluGlobalNavigation';

type SalesForm = Required<NonNullable<WorkspaceSettings['settings']['sales']>>;

const emptyForm: SalesForm = {
  moduleName: '', defaultCurrency: '', defaultTimeZone: '', defaultLanguage: '', defaultDateFormat: '', defaultNumberFormat: '',
  salesModuleEnabled: false, aiSalesAssistanceEnabled: false, salesNotificationsEnabled: false, salesActivityTrackingEnabled: false,
};

const textFields: Array<{ key: keyof Pick<SalesForm, 'moduleName' | 'defaultCurrency' | 'defaultTimeZone' | 'defaultLanguage' | 'defaultDateFormat' | 'defaultNumberFormat'>; label: string; placeholder: string }> = [
  { key: 'moduleName', label: 'Sales module name', placeholder: 'Not configured' },
  { key: 'defaultCurrency', label: 'Default currency', placeholder: 'e.g. CNY' },
  { key: 'defaultTimeZone', label: 'Default time zone', placeholder: 'e.g. Asia/Shanghai' },
  { key: 'defaultLanguage', label: 'Default language', placeholder: 'e.g. Chinese' },
  { key: 'defaultDateFormat', label: 'Default date format', placeholder: 'e.g. YYYY-MM-DD' },
  { key: 'defaultNumberFormat', label: 'Default number format', placeholder: 'e.g. 1,234.56' },
];

const toggleFields: Array<{ key: keyof Pick<SalesForm, 'salesModuleEnabled' | 'aiSalesAssistanceEnabled' | 'salesNotificationsEnabled' | 'salesActivityTrackingEnabled'>; label: string; detail: string }> = [
  { key: 'salesModuleEnabled', label: 'Enable sales module', detail: 'Allow the workspace to use sales functionality.' },
  { key: 'aiSalesAssistanceEnabled', label: 'Enable AI sales assistance', detail: 'Allow supported sales workflows to request AI help.' },
  { key: 'salesNotificationsEnabled', label: 'Enable sales notifications', detail: 'Send sales-related workspace notifications.' },
  { key: 'salesActivityTrackingEnabled', label: 'Enable sales activity tracking', detail: 'Record sales activity where it is configured.' },
];

function formFromSettings(settings: WorkspaceSettings | null): SalesForm {
  return { ...emptyForm, ...settings?.settings.sales };
}

export function SalesSettings() {
  const { selectedWorkspace, can } = useLuluApp();
  const [form, setForm] = useState<SalesForm>(emptyForm);
  const [savedForm, setSavedForm] = useState<SalesForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!selectedWorkspace) {
      setForm(emptyForm); setSavedForm(emptyForm); setLoading(false); return;
    }
    let cancelled = false;
    setLoading(true); setError('');
    void workspaceAppApi.settings(selectedWorkspace.id)
      .then((response) => {
        if (cancelled) return;
        const next = formFromSettings(response.data);
        setForm(next); setSavedForm(next);
      })
      .catch((cause) => !cancelled && setError(getFriendlyErrorMessage(cause, 'Workspace settings could not be loaded.')))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [selectedWorkspace?.id]);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(savedForm), [form, savedForm]);
  const updateText = (key: typeof textFields[number]['key'], value: string) => setForm((current) => ({ ...current, [key]: key === 'defaultCurrency' ? value.toUpperCase() : value }));
  const toggle = (key: typeof toggleFields[number]['key']) => setForm((current) => ({ ...current, [key]: !current[key] }));
  const save = async () => {
    if (!selectedWorkspace || !can('administer') || !dirty) return;
    setSaving(true); setError(''); setNotice('');
    try {
      const response = await workspaceAppApi.updateSettings(selectedWorkspace.id, { sales: form });
      const next = formFromSettings(response.data);
      setForm(next); setSavedForm(next); setNotice('Settings saved.');
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'Settings could not be saved.'));
    } finally { setSaving(false); }
  };

  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-64 lg:border-r lg:border-border lg:bg-card"><LuluGlobalNavigation activeSlug="nicely-land-1864" /></aside>
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:ml-64 lg:px-12 lg:py-12">
      <header className="mb-8 flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Settings</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Configure only the sales defaults your workspace has explicitly chosen. Empty fields are not configured.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setForm(savedForm)} disabled={!dirty || saving} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"><RotateCcw size={15} />Discard</button><button type="button" onClick={() => void save()} disabled={!dirty || saving || !can('administer')} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"><Save size={15} />{saving ? 'Saving…' : 'Save changes'}</button></div></header>
      {!can('administer') && <div className="mb-5 rounded-xl border border-border bg-secondary p-4 text-sm text-muted-foreground">Only workspace administrators can change these settings.</div>}
      {error && <div role="alert" className="mb-5 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><AlertCircle className="shrink-0" size={18} /><span>{error}</span></div>}
      {notice && <div role="status" className="mb-5 flex gap-3 rounded-xl border border-border bg-secondary p-4 text-sm text-foreground"><CheckCircle2 className="shrink-0" size={18} /><span>{notice}</span></div>}
      {loading ? <div className="grid min-h-72 place-items-center rounded-2xl border border-border bg-card text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><LoaderCircle className="animate-spin" size={17} />Loading saved settings…</span></div> : <div className="space-y-5"><section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary"><Settings2 size={18} /></span><div><h2 className="text-lg font-semibold">Sales defaults</h2><p className="mt-1 text-sm text-muted-foreground">These values are workspace-specific and are not populated from examples.</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{textFields.map((field) => <label key={field.key} className="block"><span className="mb-2 block text-xs font-semibold text-muted-foreground">{field.label}</span><input value={form[field.key]} onChange={(event) => updateText(field.key, event.target.value)} disabled={!can('administer')} maxLength={field.key === 'defaultCurrency' ? 3 : undefined} placeholder={field.placeholder} className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60" /></label>)}</div></section><section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><h2 className="text-lg font-semibold">Sales capabilities</h2><p className="mt-1 text-sm text-muted-foreground">All capabilities are off until a workspace administrator explicitly enables them.</p><div className="mt-5 divide-y divide-border">{toggleFields.map((field) => <div key={field.key} className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0"><div><p className="text-sm font-medium">{field.label}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{field.detail}</p></div><button type="button" onClick={() => toggle(field.key)} aria-pressed={form[field.key]} disabled={!can('administer')} className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition ${form[field.key] ? 'bg-primary' : 'bg-secondary'} disabled:cursor-not-allowed disabled:opacity-60`}><span className={`block h-5 w-5 rounded-full bg-card shadow-sm transition-transform ${form[field.key] ? 'translate-x-5' : ''}`} /></button></div>)}</div></section></div>}
    </main>
  </div>;
}
