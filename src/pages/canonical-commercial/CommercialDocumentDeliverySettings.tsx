import { useEffect, useMemo, useState } from 'react';
import { Check, CircleAlert, FileOutput, LoaderCircle, Pencil, Plus, PlugZap, Settings2, X } from 'lucide-react';
import { getFriendlyErrorMessage } from '../../api/client';
import { commercialDocumentsApi, type CommercialDocumentDeliveryCandidate, type CommercialDocumentDeliveryTarget, type CommercialDocumentDeliveryTargetInput } from '../../api/commercial-documents';
import { composioApi, type ComposioIntegrationTeam } from '../../api/composio';
import { useTranslation } from '../../i18n/GlobalLanguageSwitcher';

type DocumentKind = 'quotes' | 'invoices';

const token = (name: string) => `{{${name}}}`;
const defaultArguments = JSON.stringify({
  title: `${token('document.type')} ${token('document.number')}`,
  document_number: token('document.number'),
  document_type: token('document.type'),
  secure_url: token('document.url'),
  delivery_id: token('delivery.id'),
}, null, 2);

const deliveryTokens = [
  'document.id', 'document.type', 'document.number', 'document.url', 'delivery.id', 'delivery.channel', 'externalDocument.id',
].map((token) => `{{${token}}}`).join(' · ');

function prettyJson(value: Record<string, unknown>) {
  return JSON.stringify(value, null, 2);
}

function parseArguments(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && !Array.isArray(parsed) && typeof parsed === 'object' ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function toolInputFieldSummary(candidate: CommercialDocumentDeliveryCandidate | undefined) {
  const properties = candidate?.inputParameters?.properties;
  return properties && typeof properties === 'object' && !Array.isArray(properties)
    ? Object.keys(properties).slice(0, 10).join(' · ')
    : '';
}

function targetApi(kind: DocumentKind) {
  return kind === 'quotes'
    ? {
      list: commercialDocumentsApi.quoteDeliveryTargets,
      candidates: commercialDocumentsApi.quoteDeliveryTargetCandidates,
      create: commercialDocumentsApi.createQuoteDeliveryTarget,
      update: commercialDocumentsApi.updateQuoteDeliveryTarget,
    }
    : {
      list: commercialDocumentsApi.invoiceDeliveryTargets,
      candidates: commercialDocumentsApi.invoiceDeliveryTargetCandidates,
      create: commercialDocumentsApi.createInvoiceDeliveryTarget,
      update: commercialDocumentsApi.updateInvoiceDeliveryTarget,
    };
}

export function CommercialDocumentDeliverySettings({
  workspaceId, kind, canManage, onClose, onError,
}: {
  workspaceId: string;
  kind: DocumentKind;
  canManage: boolean;
  onClose: () => void;
  onError: (message: string) => void;
}) {
  const t = useTranslation();
  const [targets, setTargets] = useState<CommercialDocumentDeliveryTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CommercialDocumentDeliveryTarget | null | undefined>(undefined);
  const documentLabel = kind === 'quotes' ? t('Quotes') : t('Invoices');

  useEffect(() => {
    let active = true;
    setLoading(true);
    void targetApi(kind).list(workspaceId).then((result) => {
      if (active) setTargets(result.data.items);
    }).catch((cause) => {
      if (active) onError(getFriendlyErrorMessage(cause, t('External delivery settings could not be loaded.')));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [kind, onError, t, workspaceId]);

  function saved(target: CommercialDocumentDeliveryTarget) {
    setTargets((current) => {
      const next = current.some((item) => item.id === target.id)
        ? current.map((item) => item.id === target.id ? target : item)
        : [...current, target];
      return next.sort((left, right) => Number(right.enabled) - Number(left.enabled) || right.updatedAt.localeCompare(left.updatedAt));
    });
    setEditing(undefined);
  }

  return <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_24px_80px_-48px_rgba(0,0,0,.8)]" aria-labelledby="commercial-delivery-title">
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] bg-[linear-gradient(118deg,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_48%)] px-5 py-5 sm:px-6">
      <div className="flex min-w-0 gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--primary)]"><FileOutput size={19} /></span>
        <div><p className="eyebrow">Lulu / Composio</p><h2 id="commercial-delivery-title" className="mt-1 text-lg font-semibold">{t('External delivery')}</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">{t('Lulu keeps the canonical document and secure customer delivery. A selected destination receives a separate, recorded external projection only after Lulu has delivered the document.')}</p></div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {canManage ? <button type="button" onClick={() => setEditing(null)} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-3.5 py-2.5 text-sm font-medium text-[var(--background)]"><Plus size={16}/>{t('Add destination')}</button> : null}
        <button type="button" onClick={onClose} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3.5 py-2.5 text-sm"><X size={16}/>{t('Close')}</button>
      </div>
    </header>
    <div className="p-5 sm:p-6">
      {loading ? <div className="flex min-h-28 items-center gap-3 text-sm text-[var(--muted-foreground)]"><LoaderCircle className="animate-spin" size={18}/>{t('Loading external destinations…')}</div>
        : !targets.length ? <div className="flex min-h-32 items-start gap-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)]/45 p-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--secondary)] text-[var(--muted-foreground)]"><PlugZap size={19}/></span><div><h3 className="font-medium">{t('No external destination selected')}</h3><p className="mt-1 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">{t('Connect an application in Integrations, then select one allowed action and map its fields to the secure Lulu document link. No document is sent externally until this is explicitly configured.')}</p></div></div>
          : <div className="grid gap-3 xl:grid-cols-2">{targets.map((target) => <article key={target.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/45 p-4"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--primary)]"><FileOutput size={17}/></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-medium">{target.targetName}</h3><span className={target.enabled ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-500' : 'rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[11px] font-semibold text-[var(--muted-foreground)]'}>{target.enabled ? t('Active') : t('Paused')}</span></div><p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{target.enabled ? t('New canonical Lulu deliveries are mirrored to this destination with a durable provider result.') : t('This destination is retained as configuration and will not receive new documents.')}</p></div></div>{canManage ? <button type="button" onClick={() => setEditing(target)} className="shrink-0 rounded-lg border border-[var(--border)] p-2 text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)]" aria-label={`${t('Edit')} ${target.targetName}`}><Pencil size={15}/></button> : null}</div><div className="mt-3 border-t border-[var(--border)] pt-3 text-xs text-[var(--muted-foreground)]"><span className="font-medium text-[var(--foreground)]">{t('Configured action')}:</span> <code className="break-all text-[11px]">{target.createToolSlug}</code></div></article>)}</div>}
      <p className="mt-5 text-xs leading-5 text-[var(--muted-foreground)]">{t('Each destination is scoped to this workspace and to')} {documentLabel}. {t('Provider calls fail closed and ambiguous results are retained for review instead of being repeated automatically.')}</p>
    </div>
    {editing !== undefined ? <CommercialDocumentDeliveryDialog workspaceId={workspaceId} kind={kind} target={editing ?? null} onClose={() => setEditing(undefined)} onSaved={saved} onError={onError} /> : null}
  </section>;
}

function CommercialDocumentDeliveryDialog({
  workspaceId, kind, target, onClose, onSaved, onError,
}: {
  workspaceId: string;
  kind: DocumentKind;
  target: CommercialDocumentDeliveryTarget | null;
  onClose: () => void;
  onSaved: (target: CommercialDocumentDeliveryTarget) => void;
  onError: (message: string) => void;
}) {
  const t = useTranslation();
  const [teams, setTeams] = useState<ComposioIntegrationTeam[]>([]);
  const [candidates, setCandidates] = useState<CommercialDocumentDeliveryCandidate[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [targetName, setTargetName] = useState(target?.targetName ?? '');
  const [teamId, setTeamId] = useState(target?.integrationTeamId ?? '');
  const [enabled, setEnabled] = useState(target?.enabled ?? true);
  const [createToolSlug, setCreateToolSlug] = useState(target?.createToolSlug ?? '');
  const [createArguments, setCreateArguments] = useState(target ? prettyJson(target.createArguments) : defaultArguments);
  const [createResultExternalIdPath, setCreateResultExternalIdPath] = useState(target?.createResultExternalIdPath ?? 'id');
  const documentLabel = kind === 'quotes' ? t('Quotes') : t('Invoices');

  useEffect(() => {
    let active = true;
    void composioApi.teams(workspaceId, { limit: 100 }).then((result) => {
      if (active) setTeams(result.data.items.filter((team) => team.status === 'ACTIVE'));
    }).catch((cause) => {
      if (active) setFormError(getFriendlyErrorMessage(cause, t('Connected applications could not be loaded.')));
    }).finally(() => { if (active) setLoadingTeams(false); });
    return () => { active = false; };
  }, [t, workspaceId]);

  useEffect(() => {
    if (!teamId) { setCandidates([]); return; }
    let active = true;
    setLoadingCandidates(true);
    void targetApi(kind).candidates(workspaceId, teamId).then((result) => {
      if (active) setCandidates(result.data.items);
    }).catch((cause) => {
      if (active) setFormError(getFriendlyErrorMessage(cause, t('Actions for this connected application could not be loaded.')));
    }).finally(() => { if (active) setLoadingCandidates(false); });
    return () => { active = false; };
  }, [kind, t, teamId, workspaceId]);

  const selectedTool = useMemo(() => candidates.find((candidate) => candidate.slug === createToolSlug), [candidates, createToolSlug]);
  const parsedArguments = parseArguments(createArguments);
  const canSave = Boolean(targetName.trim() && teamId && createToolSlug && createResultExternalIdPath.trim() && parsedArguments);

  function updateTeam(value: string) {
    setTeamId(value);
    if (value !== target?.integrationTeamId) setCreateToolSlug('');
    setFormError(null);
  }

  async function save() {
    if (!targetName.trim() || !teamId || !createToolSlug || !createResultExternalIdPath.trim()) {
      setFormError(t('Complete the destination and delivery action before saving.'));
      return;
    }
    const mappedArguments = parseArguments(createArguments);
    if (!mappedArguments) {
      setFormError(t('Enter a valid JSON object for the action mapping.'));
      return;
    }
    const body: CommercialDocumentDeliveryTargetInput = {
      targetName: targetName.trim(), integrationTeamId: teamId, enabled, createToolSlug,
      createArguments: mappedArguments, createResultExternalIdPath: createResultExternalIdPath.trim(),
    };
    try {
      setSaving(true); setFormError(null);
      const api = targetApi(kind);
      const result = target ? await api.update(workspaceId, target.id, body) : await api.create(workspaceId, body);
      onSaved(result.data);
    } catch (cause) {
      const message = getFriendlyErrorMessage(cause, t('The external destination could not be saved.'));
      setFormError(message); onError(message);
    } finally { setSaving(false); }
  }

  const selectedHint = [selectedTool?.description, toolInputFieldSummary(selectedTool)].filter((value): value is string => Boolean(value)).join(' · ');
  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/65 px-3 py-6 backdrop-blur-sm sm:px-6" role="presentation"><div className="flex min-h-full items-center justify-center"><section className="w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="commercial-delivery-dialog-title"><header className="flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[linear-gradient(125deg,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_55%)] px-5 py-5 sm:px-6"><div><p className="eyebrow">Lulu / Composio</p><h2 id="commercial-delivery-dialog-title" className="mt-1 text-xl font-semibold">{target ? t('Edit external destination') : t('Add external destination')}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">{t('Map one allowed external action to a secure Lulu')} {documentLabel}. {t('Saving only stores configuration; the action runs only after Lulu has completed its own canonical delivery.')}</p></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]" aria-label={t('Close')}><X size={18}/></button></header>
    <div className="space-y-5 p-5 sm:p-6">{formError ? <div role="alert" className="flex gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-3 text-sm text-rose-300"><CircleAlert className="mt-0.5 shrink-0" size={16}/><span>{formError}</span></div> : null}
      <div className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium">{t('Destination name')}</span><input autoFocus value={targetName} onChange={(event) => setTargetName(event.target.value)} placeholder={t('e.g. Accounting archive')} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25" /></label>
        <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium">{t('Connected application')}</span><select value={teamId} disabled={loadingTeams} onChange={(event) => updateTeam(event.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25"><option className="bg-[var(--card)] text-[var(--foreground)]" value="">{loadingTeams ? t('Loading connected applications…') : t('Choose a connected application')}</option>{teams.map((team) => <option className="bg-[var(--card)] text-[var(--foreground)]" key={team.id} value={team.id}>{team.teamName} · {team.composioToolkit}</option>)}</select></label>
        {!loadingTeams && !teams.length ? <p className="sm:col-span-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)]/45 p-3 text-sm leading-6 text-[var(--muted-foreground)]">{t('No active application is connected yet. Connect one in Integrations, then return here.')}</p> : null}
        {teamId ? <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium">{t('External delivery action')}</span><select value={createToolSlug} disabled={loadingCandidates} onChange={(event) => setCreateToolSlug(event.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25"><option className="bg-[var(--card)] text-[var(--foreground)]" value="">{loadingCandidates ? t('Loading allowed actions…') : t('Choose an action')}</option>{candidates.map((candidate) => <option className="bg-[var(--card)] text-[var(--foreground)]" key={candidate.slug} value={candidate.slug}>{candidate.name} · {candidate.toolkitSlug}</option>)}</select>{selectedHint ? <small className="mt-1.5 block leading-5 text-[var(--muted-foreground)]">{selectedHint}</small> : null}</label> : null}</div>
      {teamId ? <><div className="rounded-xl border border-[var(--border)] bg-[var(--background)]/45 p-4"><h3 className="text-sm font-medium">{t('Action mapping')}</h3><p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{t('Use the connected application’s field names on the left and Lulu values on the right. The secure document URL, type and number are required; unsupported values are rejected by the server.')}</p><code className="mt-3 block overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--muted-foreground)]">{deliveryTokens}</code></div>
        <label><span className="mb-1.5 block text-xs font-medium">{t('Action mapping JSON')}</span><textarea rows={9} spellCheck={false} value={createArguments} onChange={(event) => setCreateArguments(event.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 font-mono text-xs leading-5 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25" /></label>
        <label><span className="mb-1.5 block text-xs font-medium">{t('Provider document ID path')}</span><input value={createResultExternalIdPath} onChange={(event) => setCreateResultExternalIdPath(event.target.value)} placeholder="id" className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25" /><small className="mt-1.5 block leading-5 text-[var(--muted-foreground)]">{t('Enter the result path that identifies the newly created provider resource, for example “id” or “document.id”.')}</small></label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)]/45 p-4"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} className="mt-1 h-4 w-4 accent-[var(--primary)]"/><span><strong className="text-sm">{t('Activate this destination')}</strong><small className="mt-1 block leading-5 text-[var(--muted-foreground)]">{t('When paused, Lulu keeps the configuration but sends no new external document projections.')}</small></span></label></> : null}
    </div><footer className="flex justify-end gap-3 border-t border-[var(--border)] bg-[var(--background)]/35 px-5 py-4 sm:px-6"><button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] px-3.5 py-2.5 text-sm">{t('Cancel')}</button><button type="button" disabled={saving || loadingTeams || loadingCandidates || !canSave} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-3.5 py-2.5 text-sm font-medium text-[var(--background)] disabled:cursor-not-allowed disabled:opacity-45">{saving ? <LoaderCircle className="animate-spin" size={16}/> : <Check size={16}/>} {saving ? t('Saving…') : t('Save destination')}</button></footer></section></div></div>;
}
