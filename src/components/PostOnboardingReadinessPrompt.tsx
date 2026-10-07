import { Check, Globe2, LoaderCircle, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getFriendlyErrorMessage } from '../api/client';
import { postOnboardingReadinessApi, type PostOnboardingReadiness } from '../api/workspaces';
import { useLuluApp } from '../api/LuluAppContext';
import { useTranslation } from '../i18n/GlobalLanguageSwitcher';
import { useLuluDialog } from './useLuluDialog';

export function PostOnboardingReadinessPrompt({ workspaceId }: { workspaceId: string }) {
  const { selectedWorkspace, capabilities, can, refresh } = useLuluApp();
  const t = useTranslation();
  const [readiness, setReadiness] = useState<PostOnboardingReadiness | null>(null);
  const [markets, setMarkets] = useState<string[]>([]);
  const [audience, setAudience] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedWorkspace?.onboardingCompletedAt || selectedWorkspace.id !== workspaceId) return;
    // Customer-funded workspaces must reach the AI funding screen first. The
    // readiness dialog is post-activation context, never a competing gate.
    if (capabilities.aiBudgetRequired && !capabilities.aiBudgetFunded) return;
    const controller = new AbortController();
    void postOnboardingReadinessApi.get(workspaceId, controller.signal).then((response) => {
      const value = response.data;
      setReadiness(value);
      setMarkets(value.targetMarkets.length ? value.targetMarkets : value.suggestedTargetMarkets.map((item) => item.code));
      setAudience(value.targetAudience ?? '');
      setOpen(value.missingFields.length > 0);
    }).catch(() => undefined);
    return () => controller.abort();
  }, [capabilities.aiBudgetFunded, capabilities.aiBudgetRequired, selectedWorkspace?.id, selectedWorkspace?.onboardingCompletedAt, workspaceId]);

  const needsMarkets = readiness?.missingFields.includes('targetMarkets') ?? false;
  const needsAudience = readiness?.missingFields.includes('targetAudience') ?? false;
  const selectedLabels = useMemo(() => new Set(markets), [markets]);
  const dialogRef = useLuluDialog({ open, onClose: () => setOpen(false) });

  if (!open || !readiness || !selectedWorkspace || !can('administer')) return null;
  if (capabilities.aiBudgetRequired && !capabilities.aiBudgetFunded) return null;

  function toggleMarket(code: string) {
    setMarkets((current) => current.includes(code) ? current.filter((item) => item !== code) : [...current, code]);
  }

  async function save() {
    if (markets.length === 0) {
      setError(t('Select at least one target market.'));
      return;
    }
    setSaving(true);
    setError('');
    try {
      await postOnboardingReadinessApi.save(workspaceId, { targetMarkets: markets, targetAudience: audience.trim() || null });
      setOpen(false);
      await refresh();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('The readiness settings could not be saved.')));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 p-4" role="presentation">
      <section
        ref={dialogRef}
        aria-labelledby="post-onboarding-readiness-title"
        aria-modal="true"
        className="max-h-[min(760px,calc(100vh-32px))] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary"><Sparkles size={18} /><span className="text-xs font-semibold uppercase tracking-[.16em]">{t('Workspace activation')}</span></div>
            <h2 id="post-onboarding-readiness-title" className="mt-3 text-2xl font-semibold">{t('Set the starting point for your agents')}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('Lulu has inferred the business context from your setup. Confirm the markets and add anything essential about your ideal audience before the agents begin.')}</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label={t('Close')} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"><X size={18} /></button>
        </div>

        {needsMarkets ? (
          <div className="mt-7">
            <div className="flex items-center gap-2"><Globe2 size={17} /><h3 className="font-semibold">{t('Target markets')}</h3></div>
            <p className="mt-1 text-sm text-muted-foreground">{t('These markets are preselected as the recommended launch scope. Adjust them before continuing.')}</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {readiness.suggestedTargetMarkets.map((market) => {
                const active = selectedLabels.has(market.code);
                return <button key={market.code} type="button" aria-pressed={active} onClick={() => toggleMarket(market.code)} className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition ${active ? 'border-primary bg-primary/10' : 'border-border bg-background hover:bg-secondary'}`}>
                  <span className={`grid h-5 w-5 place-items-center rounded-md border ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'}`}>{active ? <Check size={14} /> : null}</span><span>{market.label}</span>
                </button>;
              })}
            </div>
          </div>
        ) : null}

        {needsAudience ? (
          <label className="mt-7 block">
            <span className="font-semibold">{t('Ideal target audience')}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{t('Add one short description. Lulu will expand it into segments, personas and campaign hypotheses.')}</span>
            <textarea value={audience} onChange={(event) => setAudience(event.target.value)} maxLength={2000} rows={4} className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder={t('For example: B2B decision-makers at growing companies who need...')} />
          </label>
        ) : null}

        {error ? <p className="mt-4 text-sm text-destructive" role="alert">{error}</p> : null}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => setOpen(false)} disabled={saving} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary disabled:opacity-50">{t('Later')}</button>
          <button type="button" onClick={() => void save()} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{saving ? <LoaderCircle className="animate-spin" size={16} /> : <Check size={16} />}{t('Save and continue')}</button>
        </div>
      </section>
    </div>
  );
}
