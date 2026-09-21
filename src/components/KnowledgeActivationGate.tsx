import { ArrowRight, CheckCircle2, ClipboardCheck, FileSearch, FileText, ImageIcon, LoaderCircle, Sparkles, Trash2, UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFriendlyErrorMessage } from '../api/client';
import { useLuluApp } from '../api/LuluAppContext';
import { onboardingApi, type CatalogImport, type CatalogImportVariant, type OnboardingDocument } from '../api/onboarding';
import { useTranslation } from '../i18n/GlobalLanguageSwitcher';
import { navigateApp, routes } from '../routing';
import { exitOnboardingToLogin } from './OnboardingHeader';

function catalogImportStorageKey(workspaceId: string) {
  return `lulu.catalog-import.${workspaceId}`;
}

function variantFacts(variant: CatalogImportVariant) {
  const facts: string[] = [];
  if (variant.price !== null && variant.price !== undefined) facts.push(`${variant.price} ${variant.currency ?? ''}`.trim());
  if (variant.barcode) facts.push(`GTIN ${variant.barcode}`);
  if (variant.weight !== null && variant.weight !== undefined) facts.push(`${variant.weight} ${variant.weightUnit ?? ''}`.trim());
  if (variant.dimensionLength !== null && variant.dimensionLength !== undefined) {
    facts.push([variant.dimensionLength, variant.dimensionWidth, variant.dimensionHeight].filter((value) => value !== null && value !== undefined).join(' × ') + (variant.dimensionUnit ? ` ${variant.dimensionUnit}` : ''));
  }
  if (variant.moqQuantity !== null && variant.moqQuantity !== undefined) facts.push(`MOQ ${variant.moqQuantity}${variant.moqUnit ? ` ${variant.moqUnit}` : ''}`);
  if (variant.leadTimeMinDays !== null && variant.leadTimeMinDays !== undefined) facts.push(`Lead time ${variant.leadTimeMinDays}${variant.leadTimeMaxDays ? `-${variant.leadTimeMaxDays}` : ''} d`);
  return facts;
}

export function KnowledgeActivationGate() {
  const { selectedWorkspace, refresh } = useLuluApp();
  const t = useTranslation();
  const workspaceId = selectedWorkspace?.id ?? null;
  const [text, setText] = useState('');
  const [documents, setDocuments] = useState<OnboardingDocument[]>([]);
  const [referenceDocumentIds, setReferenceDocumentIds] = useState<string[]>([]);
  const [activationId, setActivationId] = useState<string | null>(null);
  const [catalogImport, setCatalogImport] = useState<CatalogImport | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }
    setActivationId(sessionStorage.getItem(catalogImportStorageKey(workspaceId)));
    void onboardingApi.documents(workspaceId)
      .then((result) => setDocuments(result.data.items))
      .catch((cause) => setError(getFriendlyErrorMessage(cause, t('Dokumente konnten nicht geladen werden.'))))
      .finally(() => setLoading(false));
  }, [t, workspaceId]);

  useEffect(() => {
    if (!workspaceId || !activationId) return;
    let cancelled = false;
    let interval: number | undefined;
    const load = async () => {
      try {
        const response = await onboardingApi.catalogImport(workspaceId, activationId);
        if (cancelled) return;
        setCatalogImport(response.data);
        setProcessing(response.data.status === 'PROCESSING');
        if (response.data.status === 'FAILED') {
          setError(response.data.errorMessage || t('Der Katalogimport konnte nicht abgeschlossen werden.'));
          if (interval !== undefined) window.clearInterval(interval);
        }
        if (response.data.status === 'REVIEW_REQUIRED' || response.data.status === 'COMPLETED') {
          if (interval !== undefined) window.clearInterval(interval);
        }
      } catch (cause) {
        if (!cancelled) setError(getFriendlyErrorMessage(cause, t('Der Status des Katalogimports konnte nicht geladen werden.')));
      }
    };
    void load();
    interval = window.setInterval(() => void load(), 2_500);
    return () => { cancelled = true; if (interval !== undefined) window.clearInterval(interval); };
  }, [activationId, t, workspaceId]);

  async function upload(file: File | undefined) {
    if (!file || !workspaceId || uploading || documents.length >= 10 || activationId) return;
    setUploading(true);
    setError('');
    try {
      const response = await onboardingApi.uploadDocument(workspaceId, file);
      setDocuments((current) => [...current, response.data]);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('Das Dokument konnte nicht hochgeladen werden.')));
    } finally {
      setUploading(false);
    }
  }

  async function remove(document: OnboardingDocument) {
    if (!workspaceId || activationId) return;
    setError('');
    try {
      await onboardingApi.deleteDocument(workspaceId, document.id);
      setDocuments((current) => current.filter((item) => item.id !== document.id));
      setReferenceDocumentIds((current) => current.filter((id) => id !== document.id));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('Das Dokument konnte nicht entfernt werden.')));
    }
  }

  function toggleReference(documentId: string) {
    setReferenceDocumentIds((current) => current.includes(documentId)
      ? current.filter((id) => id !== documentId)
      : [...current, documentId].slice(0, 4));
  }

  async function exit() {
    if (exiting || processing || confirming) return;
    if (!window.confirm(t('Onboarding abbrechen und zur Login-Seite zurueckkehren?'))) return;
    setExiting(true);
    await exitOnboardingToLogin();
  }

  async function activate() {
    if (!workspaceId || processing || activationId || (!text.trim() && documents.length === 0)) return;
    setProcessing(true);
    setError('');
    try {
      const response = await onboardingApi.activateKnowledge(workspaceId, {
        text: text.trim(), documentIds: documents.map((item) => item.id), referenceDocumentIds,
      });
      const nextActivationId = response.data.activationId;
      if (!nextActivationId) throw new Error('The catalog import did not return an activation ID.');
      sessionStorage.setItem(catalogImportStorageKey(workspaceId), nextActivationId);
      setActivationId(nextActivationId);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('Lulu konnte die Kataloganalyse nicht starten.')));
      setProcessing(false);
    }
  }

  async function confirmCatalog() {
    if (!workspaceId || !activationId || confirming || catalogImport?.status !== 'REVIEW_REQUIRED') return;
    setConfirming(true);
    setError('');
    try {
      await onboardingApi.confirmCatalogImport(workspaceId, activationId);
      sessionStorage.removeItem(catalogImportStorageKey(workspaceId));
      await refresh();
      navigateApp(routes.app.dashboard, { replace: true });
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('Der überprüfte Katalog konnte nicht aktiviert werden.')));
      setConfirming(false);
    }
  }

  function restartFailedImport() {
    if (!workspaceId || catalogImport?.status !== 'FAILED') return;
    sessionStorage.removeItem(catalogImportStorageKey(workspaceId));
    setActivationId(null);
    setCatalogImport(null);
    setProcessing(false);
    setError('');
  }

  const isLocked = Boolean(activationId && catalogImport?.status !== 'FAILED');
  const items = catalogImport?.classification.items ?? [];
  const products = items.filter((item) => item.kind === 'product');
  const evidenceCount = catalogImport?.classification.catalogImport?.evidence?.length ?? 0;

  return <div className="lulu-knowledge-activation">
    <header className="lulu-knowledge-activation__topbar">
      <a href="/" className="lulu-knowledge-activation__brand" aria-label={t('Lulu home')}><img src="/branding/lulu-agentic-logo.svg" alt="Lulu" draggable={false} /></a>
      <div className="lulu-knowledge-activation__progress" aria-label="Setup progress"><span>Company setup</span><strong>Step 4 of 4</strong><ol>{[1, 2, 3, 4].map((step) => <li key={step} className="is-complete"><span className="sr-only">Step {step}</span></li>)}</ol></div>
      <button type="button" onClick={() => void exit()} disabled={exiting || processing || confirming} className="lulu-knowledge-activation__exit">{exiting ? t('Verlasse Onboarding...') : t('Onboarding abbrechen')}</button>
    </header>
    <section className="lulu-knowledge-activation__hero"><p>{t('Activation gate · final step')}</p><h1>{t('Lulu mit Unternehmenswissen aktivieren')}</h1><span>{t('Produktkataloge, PDFs und Bilder werden erst quellenbasiert analysiert. Du prüfst die erkannten Produkte und Varianten, bevor Lulu sie als Entwürfe anlegt.')}</span></section>
    {error ? <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div> : null}

    {catalogImport?.status === 'FAILED' ? <section className="mt-5 flex flex-col gap-4 border border-destructive/25 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">{t('Katalogimport fehlgeschlagen')}</h2><p className="mt-1 text-sm text-muted-foreground">{catalogImport.errorMessage || t('Der Katalogimport konnte nicht abgeschlossen werden.')}</p></div><button type="button" onClick={restartFailedImport} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-secondary">{t('Import neu starten')}</button></section> : null}

    {catalogImport?.status === 'REVIEW_REQUIRED' ? <section className="mt-5 border border-emerald-500/25 bg-emerald-500/5 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex gap-3"><ClipboardCheck className="mt-0.5 shrink-0 text-emerald-600" size={22} /><div><h2 className="font-semibold">{t('Katalog zur Prüfung bereit')}</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{catalogImport.classification.summary || t('Lulu hat einen Katalogentwurf aus deinen Quellen erstellt.')}</p></div></div><span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700"><FileSearch size={14} /> {evidenceCount} {t('Quellenbelege')}</span></div>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">{products.length === 0 ? <p className="border border-border bg-background p-4 text-sm text-muted-foreground">Keine bestätigbaren Produkte erkannt. Du kannst die Informationen ergänzen und den Import erneut starten.</p> : products.map((product) => <article key={`${product.kind}:${product.name}`} className="border border-border bg-background p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-medium">{product.name}</h3>{product.description ? <p className="mt-1 text-sm text-muted-foreground">{product.description}</p> : null}</div><span className="shrink-0 text-xs text-muted-foreground">{product.variants.length} Varianten</span></div>{product.variants.length ? <ul className="mt-3 space-y-2 border-t border-border pt-3">{product.variants.slice(0, 12).map((variant) => <li key={`${variant.sku ?? ''}:${variant.name}`} className="text-sm"><div className="flex flex-wrap justify-between gap-x-3 gap-y-1"><span>{variant.name}</span>{variant.sku ? <span className="font-mono text-xs text-muted-foreground">{variant.sku}</span> : null}</div>{variant.attributes.length ? <p className="mt-1 text-xs text-muted-foreground">{variant.attributes.map((attribute) => `${attribute.name}: ${attribute.value}${attribute.unit ? ` ${attribute.unit}` : ''}`).join(' · ')}</p> : null}{variantFacts(variant).length ? <p className="mt-1 text-xs text-muted-foreground">{variantFacts(variant).join(' · ')}</p> : null}{variant.description ? <p className="mt-1 text-xs text-muted-foreground">{variant.description}</p> : null}</li>)}</ul> : null}{product.imageEvidenceIds?.length ? <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><ImageIcon size={13} /> {product.imageEvidenceIds.length} zugeordnete Produktbilder</p> : null}</article>)}</div>
      <div className="mt-5 flex flex-col gap-3 border-t border-emerald-500/20 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">{t('Beim Bestätigen erstellt Lulu ausschließlich DRAFT-Produkte und -Varianten. Veröffentlichungen bleiben separat kontrolliert.')}</p><button type="button" onClick={() => void confirmCatalog()} disabled={confirming} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40">{confirming ? <LoaderCircle className="animate-spin" size={17} /> : <CheckCircle2 size={17} />}{confirming ? t('Aktiviere Katalog...') : t('Katalog bestätigen')}</button></div>
    </section> : null}

    {processing ? <section className="mt-5 flex items-center gap-3 border border-primary/20 bg-primary/5 p-5 text-sm"><LoaderCircle className="animate-spin text-primary" size={20} /><div><strong className="block">{t('Lulu analysiert den Katalog')}</strong><span className="text-muted-foreground">{t('Text, Tabellen, gescannte Seiten und Produktbilder werden mit ihren Quellen abgeglichen.')}</span></div></section> : null}

    {!isLocked ? <><section className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_.95fr]"><div className="rounded-lg border border-border bg-card p-5 sm:p-6"><div className="flex items-center gap-3"><Sparkles size={20} /><div><h2 className="font-semibold">Unternehmenswissen</h2><p className="text-sm text-muted-foreground">Informationen können in jeder Struktur und Sprache eingefügt werden.</p></div></div><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Produkte, Services, Positionierung, Prozesse, FAQs, Markenstory, Kundeninformationen..." className="mt-5 min-h-72 w-full resize-y rounded-lg border border-border bg-background p-4 text-sm leading-6 outline-none focus:ring-2 focus:ring-primary" maxLength={50_000} /><p className="mt-2 text-right text-xs text-muted-foreground">{text.length.toLocaleString()} / 50,000</p></div>
      <div className="rounded-lg border border-border bg-card p-5 sm:p-6"><div className="flex items-center gap-3"><FileText size={20} /><div><h2 className="font-semibold">Katalog und Dokumente</h2><p className="text-sm text-muted-foreground">PDF, Text, CSV, Office-Dateien oder Bilder · max. 5 MB · bis zu 10 Dateien</p></div></div><label className={`mt-5 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background/50 px-4 py-8 text-center ${documents.length >= 10 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-secondary'}`}><input type="file" className="sr-only" disabled={uploading || documents.length >= 10} onChange={(event) => { void upload(event.target.files?.[0]); event.currentTarget.value = ''; }} /><UploadCloud size={24} /><span className="mt-3 text-sm font-semibold">{uploading ? 'Lädt hoch...' : documents.length >= 10 ? 'Dokumentlimit erreicht' : 'Dokument auswählen'}</span></label><div className="mt-4 space-y-2">{loading ? <p className="text-sm text-muted-foreground">Dokumente werden geladen...</p> : documents.length === 0 ? <p className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground">Noch keine Dokumente hinzugefügt.</p> : documents.map((document) => { const canReference = ['image/jpeg', 'image/png', 'image/webp'].includes(document.mimeType); const isReference = referenceDocumentIds.includes(document.id); return <div key={document.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{document.fileName}</p><p className="text-xs text-muted-foreground">{Math.ceil(document.sizeBytes / 1024).toLocaleString()} KB</p>{canReference ? <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={isReference} onChange={() => toggleReference(document.id)} /><ImageIcon size={13} /><span>Als Produktbild-Referenz verwenden</span></label> : null}</div><button type="button" onClick={() => void remove(document)} className="rounded-lg p-2 hover:bg-secondary" aria-label={`${document.fileName} entfernen`}><Trash2 size={15} /></button></div>; })}</div></div></section>
      <section className="mt-5 border border-primary/20 bg-primary/5 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={20} /><div><h2 className="font-semibold">Quellengestützter Katalogimport</h2><p className="mt-1 text-sm text-muted-foreground">PDF-Seiten, Tabellen und Produktbilder bleiben als Beleg erhalten. Lulu legt erst nach deiner Prüfung Entwürfe an.</p></div></div><button type="button" onClick={() => void activate()} disabled={processing || (!text.trim() && documents.length === 0)} className="mt-5 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40 sm:mt-0 sm:w-auto"><ArrowRight size={17} />Katalog analysieren</button></section></> : null}
  </div>;
}
