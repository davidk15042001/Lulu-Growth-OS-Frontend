import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, CircleAlert, Link2, LoaderCircle, Pencil, Plus, X } from 'lucide-react';
import { getFriendlyErrorMessage } from '../../api/client';
import { crmApi, type CrmDeliveryCandidate, type CrmDeliveryProjection, type CrmDeliveryResourceType, type CrmDeliveryTarget, type CrmDeliveryTargetInput } from '../../api/crm';
import { composioApi, type ComposioIntegrationTeam } from '../../api/composio';
import { useLuluDialog } from '../../components/useLuluDialog';

const resourceOptions: Array<{ value: CrmDeliveryResourceType; label: string }> = [
  { value: 'crm_companies', label: 'Unternehmen' },
  { value: 'crm_contacts', label: 'Kontakte' },
  { value: 'crm_leads', label: 'CRM-Leads' },
  { value: 'crm_deals', label: 'CRM-Deals' },
  { value: 'crm_tasks', label: 'CRM-Aufgaben' },
  { value: 'sales_leads', label: 'Sales-Leads' },
  { value: 'sales_opportunities', label: 'Sales-Chancen' },
  { value: 'sales_tasks', label: 'Sales-Aufgaben' },
];

const tokenHints = [
  '{{record.id}}', '{{record.name}}', '{{record.status}}', '{{record.description}}',
  '{{record.data.email}}', '{{record.data.phone}}', '{{record.data.company}}',
  '{{record.valueAmount}}', '{{record.currency}}', '{{record.dueAt}}', '{{externalRecord.id}}',
].join(' · ');

const defaultCreateArguments = JSON.stringify({
  name: '{{record.name}}',
  description: '{{record.description}}',
  status: '{{record.status}}',
  source_id: '{{record.id}}',
  email: '{{record.data.email}}',
}, null, 2);
const defaultUpdateArguments = JSON.stringify({
  id: '{{externalRecord.id}}',
  name: '{{record.name}}',
  description: '{{record.description}}',
  status: '{{record.status}}',
  source_id: '{{record.id}}',
}, null, 2);
const defaultCancelArguments = JSON.stringify({ id: '{{externalRecord.id}}' }, null, 2);

function prettyJson(value: Record<string, unknown> | undefined, fallback: string) {
  return value ? JSON.stringify(value, null, 2) : fallback;
}

function parseArguments(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function resourceLabel(resourceType: CrmDeliveryResourceType) {
  return resourceOptions.find((option) => option.value === resourceType)?.label ?? resourceType;
}

function toolLabel(candidate: CrmDeliveryCandidate | undefined, slug: string) {
  return candidate ? `${candidate.name} · ${candidate.toolkitSlug}` : slug;
}

function deliveryStatusLabel(status: CrmDeliveryProjection['status']) {
  return ({ PENDING: 'Ausstehend', SYNCED: 'Synchronisiert', CANCELLED: 'Storniert', FAILED: 'Fehlgeschlagen', AMBIGUOUS: 'Klärung erforderlich' } as const)[status];
}

function deliveryStatusClass(status: CrmDeliveryProjection['status']) {
  if (status === 'SYNCED' || status === 'CANCELLED') return 'bg-emerald-500/15 text-emerald-600';
  if (status === 'AMBIGUOUS') return 'bg-amber-500/15 text-amber-700';
  if (status === 'FAILED') return 'bg-rose-500/15 text-rose-700';
  return 'bg-sky-500/15 text-sky-700';
}

export function CrmExternalDeliverySettings({
  workspaceId, canManage, onError,
}: {
  workspaceId: string;
  canManage: boolean;
  onError: (message: string) => void;
}) {
  const [resourceType, setResourceType] = useState<CrmDeliveryResourceType>('crm_companies');
  const [targets, setTargets] = useState<CrmDeliveryTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [projections, setProjections] = useState<CrmDeliveryProjection[]>([]);
  const [loadingProjections, setLoadingProjections] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState<CrmDeliveryTarget | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void crmApi.deliveryTargets(workspaceId, resourceType).then((result) => {
      if (active) setTargets(result.data.items);
    }).catch((cause) => {
      if (active) onError(getFriendlyErrorMessage(cause, 'Die Composio-Ziele konnten nicht geladen werden.'));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [onError, resourceType, workspaceId]);

  useEffect(() => {
    if (!expanded) return;
    let active = true;
    setLoadingProjections(true);
    void crmApi.deliveryProjections(workspaceId, { resourceType, limit: 20 }).then((result) => {
      if (active) setProjections(result.data.items);
    }).catch((cause) => {
      if (active) onError(getFriendlyErrorMessage(cause, 'Der Zustellstatus konnte nicht geladen werden.'));
    }).finally(() => {
      if (active) setLoadingProjections(false);
    });
    return () => { active = false; };
  }, [expanded, onError, resourceType, workspaceId]);

  function saved(target: CrmDeliveryTarget) {
    setTargets((current) => {
      const next = current.some((item) => item.id === target.id)
        ? current.map((item) => item.id === target.id ? target : item)
        : [...current, target];
      return next.sort((left, right) => Number(right.enabled) - Number(left.enabled) || right.updatedAt.localeCompare(left.updatedAt));
    });
    setEditing(undefined);
  }

  return <section className="mx-auto mt-6 max-w-[1500px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_20px_70px_-50px_rgba(0,0,0,.8)]" aria-labelledby="crm-external-delivery-title">
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] bg-[linear-gradient(118deg,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_50%)] px-5 py-5 sm:px-6">
      <div className="flex min-w-0 gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--primary)]"><Link2 size={19}/></span>
        <div><p className="eyebrow">Lulu / Composio</p><h2 id="crm-external-delivery-title" className="mt-1 text-lg font-semibold">CRM-Ziele und externe Projektionen</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">Der Lulu-Datensatz bleibt maßgeblich. Nur ausdrücklich konfigurierte Composio-Aktionen erhalten eine getrennte, auditierbare Projektion in diesem Workspace.</p></div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {canManage ? <button type="button" onClick={() => { setExpanded(true); setEditing(null); }} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-3.5 py-2.5 text-sm font-medium text-[var(--background)]"><Plus size={16}/>Ziel hinzufügen</button> : null}
        <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3.5 py-2.5 text-sm"><span>{expanded ? 'Ausblenden' : 'Konfigurieren'}</span><ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`}/></button>
      </div>
    </header>
    {expanded ? <div className="space-y-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-end gap-3"><label className="min-w-[230px] flex-1"><span className="mb-1.5 block text-xs font-medium">Datensatztyp</span><select value={resourceType} onChange={(event) => setResourceType(event.target.value as CrmDeliveryResourceType)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25">{resourceOptions.map((option) => <option className="bg-[var(--card)] text-[var(--foreground)]" key={option.value} value={option.value}>{option.label}</option>)}</select></label><p className="max-w-xl text-xs leading-5 text-[var(--muted-foreground)]">Neue und geänderte Datensätze dieses Typs werden erst nach einer gespeicherten Zielkonfiguration über die ausgewählten Tools projiziert.</p></div>
      {loading ? <div className="flex min-h-24 items-center gap-3 text-sm text-[var(--muted-foreground)]"><LoaderCircle size={17} className="animate-spin"/>Ziele werden geladen …</div>
        : !targets.length ? <div className="flex min-h-28 items-start gap-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)]/45 p-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--secondary)] text-[var(--muted-foreground)]"><Link2 size={18}/></span><div><h3 className="font-medium">Noch kein externes Ziel für {resourceLabel(resourceType)}</h3><p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">Verbinde zuerst eine Anwendung unter Integrationen. Danach werden ausschließlich die für das gewählte Composio-Team verfügbaren Aktionen angeboten.</p></div></div>
          : <div className="grid gap-3 xl:grid-cols-2">{targets.map((target) => <article key={target.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/45 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-medium">{target.targetName}</h3><span className={target.enabled ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600' : 'rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[11px] font-semibold text-[var(--muted-foreground)]'}>{target.enabled ? 'Aktiv' : 'Pausiert'}</span></div><p className="mt-1 text-xs text-[var(--muted-foreground)]">{resourceLabel(target.resourceType)} · Create, Update und Cancel über das ausgewählte Team</p></div>{canManage ? <button type="button" onClick={() => setEditing(target)} className="shrink-0 rounded-lg border border-[var(--border)] p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]" aria-label={`${target.targetName} bearbeiten`}><Pencil size={15}/></button> : null}</div><div className="mt-3 grid gap-2 border-t border-[var(--border)] pt-3 text-xs text-[var(--muted-foreground)] sm:grid-cols-3"><span><strong className="block text-[var(--foreground)]">Create</strong><code className="break-all text-[10px]">{target.createToolSlug}</code></span><span><strong className="block text-[var(--foreground)]">Update</strong><code className="break-all text-[10px]">{target.updateToolSlug}</code></span><span><strong className="block text-[var(--foreground)]">Cancel</strong><code className="break-all text-[10px]">{target.cancelToolSlug}</code></span></div></article>)}</div>}
      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]/45" aria-labelledby="crm-delivery-status-title">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-5"><div><h3 id="crm-delivery-status-title" className="text-sm font-semibold">Letzte Zustellungen</h3><p className="mt-1 text-xs text-[var(--muted-foreground)]">Nur gespeicherte Provider-Ergebnisse werden angezeigt. Ein laufender UI-Zustand gilt nicht als Beleg.</p></div><span className="text-xs text-[var(--muted-foreground)]">{projections.length} Einträge</span></header>
        {loadingProjections ? <div className="flex min-h-20 items-center gap-3 px-4 text-sm text-[var(--muted-foreground)] sm:px-5"><LoaderCircle size={16} className="animate-spin"/>Zustellstatus wird geladen …</div>
          : !projections.length ? <div className="px-4 py-6 text-sm text-[var(--muted-foreground)] sm:px-5">Für {resourceLabel(resourceType)} wurden noch keine externen Zustellungen protokolliert.</div>
            : <div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-xs"><thead className="border-b border-[var(--border)] text-[10px] uppercase tracking-[.14em] text-[var(--muted-foreground)]"><tr><th className="px-4 py-3 sm:px-5">Datensatz</th><th className="px-3 py-3">Ziel</th><th className="px-3 py-3">Vorgang</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Aktualisiert</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{projections.map((projection) => <tr key={projection.id}><td className="px-4 py-3 font-medium sm:px-5">{projection.recordName}</td><td className="px-3 py-3 text-[var(--muted-foreground)]">{projection.targetName}</td><td className="px-3 py-3 text-[var(--muted-foreground)]">{projection.lastOperation}</td><td className="px-3 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${deliveryStatusClass(projection.status)}`}>{deliveryStatusLabel(projection.status)}</span>{projection.lastErrorCode ? <span className="mt-1 block text-[10px] text-[var(--muted-foreground)]">{projection.lastErrorCode}</span> : null}</td><td className="px-3 py-3 text-[var(--muted-foreground)]">{new Date(projection.updatedAt).toLocaleString()}</td></tr>)}</tbody></table></div>}
      </section>
      <p className="text-xs leading-5 text-[var(--muted-foreground)]">Provider-Antworten, fehlgeschlagene Zustellungen und unklare Ergebnisse werden separat gespeichert. Eine Animation oder ein UI-Status behauptet keine erfolgreiche externe Synchronisierung.</p>
    </div> : null}
    {editing !== undefined ? <CrmExternalDeliveryDialog workspaceId={workspaceId} resourceType={resourceType} target={editing ?? null} onClose={() => setEditing(undefined)} onSaved={saved} onError={onError}/> : null}
  </section>;
}

function CrmExternalDeliveryDialog({
  workspaceId, resourceType, target, onClose, onSaved, onError,
}: {
  workspaceId: string;
  resourceType: CrmDeliveryResourceType;
  target: CrmDeliveryTarget | null;
  onClose: () => void;
  onSaved: (target: CrmDeliveryTarget) => void;
  onError: (message: string) => void;
}) {
  const [teams, setTeams] = useState<ComposioIntegrationTeam[]>([]);
  const [candidates, setCandidates] = useState<CrmDeliveryCandidate[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [targetName, setTargetName] = useState(target?.targetName ?? `${resourceLabel(resourceType)} extern spiegeln`);
  const [selectedResourceType, setSelectedResourceType] = useState<CrmDeliveryResourceType>(target?.resourceType ?? resourceType);
  const [teamId, setTeamId] = useState(target?.integrationTeamId ?? '');
  const [enabled, setEnabled] = useState(target?.enabled ?? true);
  const [createToolSlug, setCreateToolSlug] = useState(target?.createToolSlug ?? '');
  const [updateToolSlug, setUpdateToolSlug] = useState(target?.updateToolSlug ?? '');
  const [cancelToolSlug, setCancelToolSlug] = useState(target?.cancelToolSlug ?? '');
  const [createArguments, setCreateArguments] = useState(prettyJson(target?.createArguments, defaultCreateArguments));
  const [updateArguments, setUpdateArguments] = useState(prettyJson(target?.updateArguments, defaultUpdateArguments));
  const [cancelArguments, setCancelArguments] = useState(prettyJson(target?.cancelArguments, defaultCancelArguments));
  const [createResultExternalIdPath, setCreateResultExternalIdPath] = useState(target?.createResultExternalIdPath ?? 'id');
  const dialogRef = useLuluDialog({ open: true, onClose });

  useEffect(() => {
    let active = true;
    void composioApi.teams(workspaceId, { limit: 100 }).then((result) => {
      if (active) setTeams(result.data.items.filter((team) => team.status === 'ACTIVE'));
    }).catch((cause) => {
      if (active) setFormError(getFriendlyErrorMessage(cause, 'Verbundene Anwendungen konnten nicht geladen werden.'));
    }).finally(() => { if (active) setLoadingTeams(false); });
    return () => { active = false; };
  }, [workspaceId]);

  useEffect(() => {
    if (!teamId) { setCandidates([]); return; }
    let active = true;
    setLoadingCandidates(true);
    void crmApi.deliveryTargetCandidates(workspaceId, teamId).then((result) => {
      if (active) setCandidates(result.data.items);
    }).catch((cause) => {
      if (active) setFormError(getFriendlyErrorMessage(cause, 'Aktionen für diese Anwendung konnten nicht geladen werden.'));
    }).finally(() => { if (active) setLoadingCandidates(false); });
    return () => { active = false; };
  }, [teamId, workspaceId]);

  const parsedCreate = parseArguments(createArguments);
  const parsedUpdate = parseArguments(updateArguments);
  const parsedCancel = parseArguments(cancelArguments);
  const canSave = Boolean(targetName.trim() && selectedResourceType && teamId && createToolSlug && updateToolSlug && cancelToolSlug && createResultExternalIdPath.trim() && parsedCreate && parsedUpdate && parsedCancel);
  const bySlug = useMemo(() => new Map(candidates.map((candidate) => [candidate.slug, candidate])), [candidates]);

  function updateTeam(value: string) {
    setTeamId(value);
    if (value !== target?.integrationTeamId) {
      setCreateToolSlug(''); setUpdateToolSlug(''); setCancelToolSlug('');
    }
    setFormError(null);
  }

  async function save() {
    const create = parseArguments(createArguments);
    const update = parseArguments(updateArguments);
    const cancel = parseArguments(cancelArguments);
    if (!targetName.trim() || !teamId || !createToolSlug || !updateToolSlug || !cancelToolSlug || !createResultExternalIdPath.trim()) {
      setFormError('Bitte Ziel, Anwendung und alle drei Aktionen vollständig auswählen.'); return;
    }
    if (!create || !update || !cancel) {
      setFormError('Bitte in allen drei Mapping-Feldern ein gültiges JSON-Objekt hinterlegen.'); return;
    }
    const body: CrmDeliveryTargetInput = {
      resourceType: selectedResourceType, integrationTeamId: teamId, targetName: targetName.trim(), enabled,
      createToolSlug, createArguments: create, createResultExternalIdPath: createResultExternalIdPath.trim(),
      updateToolSlug, updateArguments: update, cancelToolSlug, cancelArguments: cancel,
    };
    try {
      setSaving(true); setFormError(null);
      const result = target ? await crmApi.updateDeliveryTarget(workspaceId, target.id, body) : await crmApi.createDeliveryTarget(workspaceId, body);
      onSaved(result.data);
    } catch (cause) {
      const message = getFriendlyErrorMessage(cause, 'Das CRM-Ziel konnte nicht gespeichert werden.');
      setFormError(message); onError(message);
    } finally { setSaving(false); }
  }

  const selectClass = 'w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25';
  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/65 px-3 py-6 backdrop-blur-sm sm:px-6" role="presentation"><div className="flex min-h-full items-center justify-center"><section ref={dialogRef} className="w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="crm-delivery-dialog-title">
    <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[linear-gradient(125deg,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_55%)] px-5 py-5 sm:px-6"><div><p className="eyebrow">Lulu / Composio</p><h2 id="crm-delivery-dialog-title" className="mt-1 text-xl font-semibold">{target ? 'CRM-Ziel bearbeiten' : 'CRM-Ziel hinzufügen'}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">Lulu speichert den kanonischen Datensatz zuerst. Diese Konfiguration legt fest, welche externen Aktionen danach für Create, Update und Cancel verwendet werden.</p></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]" aria-label="Schließen"><X size={18}/></button></header>
    <div className="space-y-5 p-5 sm:p-6">{formError ? <div role="alert" className="flex gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-3 text-sm text-rose-300"><CircleAlert className="mt-0.5 shrink-0" size={16}/><span>{formError}</span></div> : null}
      <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-medium">Zielname</span><input autoFocus value={targetName} onChange={(event) => setTargetName(event.target.value)} className={selectClass}/></label><label><span className="mb-1.5 block text-xs font-medium">Datensatztyp</span><select value={selectedResourceType} onChange={(event) => setSelectedResourceType(event.target.value as CrmDeliveryResourceType)} className={selectClass}>{resourceOptions.map((option) => <option className="bg-[var(--card)] text-[var(--foreground)]" key={option.value} value={option.value}>{option.label}</option>)}</select></label><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium">Verbundene Anwendung / Composio-Team</span><select value={teamId} disabled={loadingTeams} onChange={(event) => updateTeam(event.target.value)} className={selectClass}><option className="bg-[var(--card)] text-[var(--foreground)]" value="">{loadingTeams ? 'Verbundene Anwendungen werden geladen …' : 'Anwendung auswählen'}</option>{teams.map((team) => <option className="bg-[var(--card)] text-[var(--foreground)]" key={team.id} value={team.id}>{team.teamName} · {team.composioToolkit}</option>)}</select>{!loadingTeams && !teams.length ? <small className="mt-1.5 block text-[var(--muted-foreground)]">Noch keine aktive Anwendung verbunden. Öffne Integrationen und verbinde zuerst eine Anwendung.</small> : null}</label></div>
      {teamId ? <><div className="grid gap-4 sm:grid-cols-3">{([['Create', createToolSlug, setCreateToolSlug], ['Update', updateToolSlug, setUpdateToolSlug], ['Cancel', cancelToolSlug, setCancelToolSlug]] as const).map(([label, selected, setter]) => <label key={label}><span className="mb-1.5 block text-xs font-medium">{label}-Aktion</span><select value={selected} disabled={loadingCandidates} onChange={(event) => setter(event.target.value)} className={selectClass}><option className="bg-[var(--card)] text-[var(--foreground)]" value="">{loadingCandidates ? 'Aktionen werden geladen …' : `${label}-Aktion auswählen`}</option>{candidates.map((candidate) => <option className="bg-[var(--card)] text-[var(--foreground)]" key={`${label}-${candidate.slug}`} value={candidate.slug}>{candidate.name} · {candidate.toolkitSlug}</option>)}</select><small className="mt-1.5 block truncate text-[10px] text-[var(--muted-foreground)]">{selected ? toolLabel(bySlug.get(selected), selected) : 'Noch nicht ausgewählt'}</small></label>)}</div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)]/45 p-4"><h3 className="text-sm font-medium">Sichere Mapping-Tokens</h3><p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">Links stehen die Feldnamen der gewählten Anwendung, rechts Lulu-Werte. Der Server akzeptiert nur bekannte, tenant-sichere Tokens.</p><code className="mt-3 block overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[11px] text-[var(--muted-foreground)]">{tokenHints}</code></div>
        <div className="grid gap-4 lg:grid-cols-3"><label><span className="mb-1.5 block text-xs font-medium">Create-Mapping JSON</span><textarea rows={9} spellCheck={false} value={createArguments} onChange={(event) => setCreateArguments(event.target.value)} className={`${selectClass} min-h-48 font-mono text-[11px] leading-5`}/><small className="mt-1.5 block text-[11px] text-[var(--muted-foreground)]">Muss {'{{record.name}}'} enthalten.</small></label><label><span className="mb-1.5 block text-xs font-medium">Update-Mapping JSON</span><textarea rows={9} spellCheck={false} value={updateArguments} onChange={(event) => setUpdateArguments(event.target.value)} className={`${selectClass} min-h-48 font-mono text-[11px] leading-5`}/><small className="mt-1.5 block text-[11px] text-[var(--muted-foreground)]">Muss {'{{externalRecord.id}}'} enthalten.</small></label><label><span className="mb-1.5 block text-xs font-medium">Cancel-Mapping JSON</span><textarea rows={9} spellCheck={false} value={cancelArguments} onChange={(event) => setCancelArguments(event.target.value)} className={`${selectClass} min-h-48 font-mono text-[11px] leading-5`}/><small className="mt-1.5 block text-[var(--muted-foreground)]">Muss {'{{externalRecord.id}}'} enthalten.</small></label></div>
        <label className="block"><span className="mb-1.5 block text-xs font-medium">Pfad zur externen ID aus der Create-Antwort</span><input value={createResultExternalIdPath} onChange={(event) => setCreateResultExternalIdPath(event.target.value)} placeholder="id oder data.id" className={selectClass}/><small className="mt-1.5 block text-[11px] leading-5 text-[var(--muted-foreground)]">Diese ID verbindet spätere Updates und Stornierungen mit demselben externen Datensatz.</small></label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)]/45 p-4"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} className="mt-1 h-4 w-4 accent-[var(--primary)]"/><span><strong className="text-sm">Ziel aktivieren</strong><small className="mt-1 block text-[var(--muted-foreground)]">Bei einer Pause bleibt die Konfiguration erhalten; neue Projektionen werden nicht gestartet.</small></span></label></> : null}
    </div><footer className="flex justify-end gap-3 border-t border-[var(--border)] bg-[var(--background)]/35 px-5 py-4 sm:px-6"><button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] px-3.5 py-2.5 text-sm">Abbrechen</button><button type="button" disabled={saving || loadingTeams || loadingCandidates || !canSave} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-3.5 py-2.5 text-sm font-medium text-[var(--background)] disabled:cursor-not-allowed disabled:opacity-45">{saving ? <LoaderCircle className="animate-spin" size={16}/> : <Check size={16}/>} {saving ? 'Speichern …' : 'Ziel speichern'}</button></footer>
  </section></div></div>;
}
