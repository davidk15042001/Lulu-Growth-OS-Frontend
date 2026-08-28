import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, FileText, ShieldCheck, Trash2, UploadCloud, X } from "lucide-react";
import { navigateApp, routes } from "../../../../routing";
import { getFriendlyErrorMessage, getTechnicalErrorDetails, requestApi, requestApiBlob } from "../../../../api/client";
import { getSelectedWorkspaceId } from "../../../../api/session";
import { OnboardingHeader } from "../../../../components/OnboardingHeader";
import type { Workspace } from "../../../../api/types";

type DocumentRecord = {
  id: string;
  workspaceId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

type UploadItem = DocumentRecord & {
  url: string;
  kind: "image" | "document";
  contentAvailable: boolean;
};

const MAX_FILE_SIZE = 5000 * 1024;
const ACCEPTED_FILES = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv";

function isImage(mimeType: string) {
  return mimeType.startsWith("image/");
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(name: string) {
  return name.split(".").pop()?.toUpperCase() || "FILE";
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function joinList(values: string[] | null | undefined) {
  return (values ?? []).join(", ");
}

type BusinessProfileForm = {
  businessDescription: string;
  valueProposition: string;
  targetMarket: string;
  shortBrandDescription: string;
  positioningTags: string;
  legalForm: string;
  foundingYear: string;
  employeeCount: string;
  annualRevenueRange: string;
  businessModelType: string;
  companyStage: string;
  salesModel: string;
  salesCycleDays: string;
  primaryIcp: string;
  usp: string;
  mission: string;
  vision: string;
  primaryChallenges: string;
  languages: string;
  regulatedIndustries: string;
};

const emptyProfile: BusinessProfileForm = {
  businessDescription: "",
  valueProposition: "",
  targetMarket: "",
  shortBrandDescription: "",
  positioningTags: "",
  legalForm: "",
  foundingYear: "",
  employeeCount: "",
  annualRevenueRange: "",
  businessModelType: "",
  companyStage: "",
  salesModel: "",
  salesCycleDays: "",
  primaryIcp: "",
  usp: "",
  mission: "",
  vision: "",
  primaryChallenges: "",
  languages: "",
  regulatedIndustries: "",
};

export const BusinessDescription = () => {
  const [profile, setProfile] = useState<BusinessProfileForm>(emptyProfile);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [activeUpload, setActiveUpload] = useState<UploadItem | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");
  const [technicalError, setTechnicalError] = useState("");
  const [reuploadRequired, setReuploadRequired] = useState(false);
  const uploadsRef = useRef<UploadItem[]>([]);

  useEffect(() => {
    uploadsRef.current = uploads;
  }, [uploads]);

  useEffect(() => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) {
      setLoadingDocuments(false);
      return;
    }
    const load = async () => {
      try {
        const [workspaceResponse, documentsResponse] = await Promise.all([
          requestApi<{ workspace: Workspace }>({ path: `/workspaces/${workspaceId}/onboarding` }),
          requestApi<{ items: DocumentRecord[] }>({ path: `/workspaces/${workspaceId}/onboarding/documents` }),
        ]);
        const workspace = workspaceResponse.data.workspace;
        setProfile({
          businessDescription: workspace.businessDescription ?? "",
          valueProposition: workspace.valueProposition ?? "",
          targetMarket: workspace.targetMarket ?? "",
          shortBrandDescription: workspace.shortBrandDescription ?? "",
          positioningTags: joinList(workspace.positioningTags),
          legalForm: workspace.legalForm ?? "",
          foundingYear: workspace.foundingYear ? String(workspace.foundingYear) : "",
          employeeCount: workspace.employeeCount ? String(workspace.employeeCount) : "",
          annualRevenueRange: workspace.annualRevenueRange ?? "",
          businessModelType: workspace.businessModelType ?? "",
          companyStage: workspace.companyStage ?? "",
          salesModel: workspace.salesModel ?? "",
          salesCycleDays: workspace.salesCycleDays ? String(workspace.salesCycleDays) : "",
          primaryIcp: workspace.primaryIcp ?? "",
          usp: workspace.usp ?? "",
          mission: workspace.mission ?? "",
          vision: workspace.vision ?? "",
          primaryChallenges: joinList(workspace.primaryChallenges),
          languages: joinList(workspace.languages),
          regulatedIndustries: joinList(workspace.regulatedIndustries),
        });
        setReuploadRequired(workspace.onboardingFileReuploadRequired);
        const loaded = await Promise.all(documentsResponse.data.items.map(async (document) => {
          try {
            const blob = await requestApiBlob(`/workspaces/${workspaceId}/onboarding/documents/${document.id}/content`);
            return { ...document, url: URL.createObjectURL(blob), kind: isImage(document.mimeType) ? "image" as const : "document" as const, contentAvailable: true };
          } catch {
            return { ...document, url: "", kind: isImage(document.mimeType) ? "image" as const : "document" as const, contentAvailable: false };
          }
        }));
        setUploads(loaded);
        if (loaded.some((item) => !item.contentAvailable)) setFileError("Einige Dateien sind gespeichert, aber ihre Vorschau ist momentan nicht verfügbar. Die Dateien bleiben erhalten.");
      } catch (cause) {
        setError(getFriendlyErrorMessage(cause, "Die gespeicherten Dokumente konnten nicht geladen werden."));
        setTechnicalError(getTechnicalErrorDetails(cause));
      } finally {
        setLoadingDocuments(false);
      }
    };
    void load();
  }, []);

  useEffect(() => () => {
    uploadsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
  }, []);

  async function addFiles(fileList: FileList | null) {
    if (!fileList || uploading) return;
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    setFileError("");
    setTechnicalError("");
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(fileList)) {
        if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
          setFileError(file.size > MAX_FILE_SIZE ? "Dateigröße ist zu groß." : `${file.name} ist leer und wurde nicht hinzugefügt.`);
          continue;
        }
        const formData = new FormData();
        formData.append("file", file, file.name);
        const response = await requestApi<DocumentRecord>({ path: `/workspaces/${workspaceId}/onboarding/documents`, method: "POST", body: formData });
        const document = response.data;
        const url = URL.createObjectURL(file);
        setUploads((current) => [{ ...document, url, kind: isImage(document.mimeType) ? "image" : "document", contentAvailable: true }, ...current]);
      }
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Die Datei konnte nicht hochgeladen werden."));
      setTechnicalError(getTechnicalErrorDetails(cause));
    } finally {
      setUploading(false);
    }
  }

  async function removeUpload(item: UploadItem) {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    setError("");
    setTechnicalError("");
    try {
      await requestApi({ path: `/workspaces/${workspaceId}/onboarding/documents/${item.id}`, method: "DELETE" });
      URL.revokeObjectURL(item.url);
      setUploads((current) => current.filter((entry) => entry.id !== item.id));
      if (activeUpload?.id === item.id) setActiveUpload(null);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Das Dokument konnte nicht gelöscht werden."));
      setTechnicalError(getTechnicalErrorDetails(cause));
    }
  }

  async function saveAndContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const workspaceId = getSelectedWorkspaceId();
    const hasRequiredInput = reuploadRequired
      ? uploads.length > 0
      : Boolean(profile.businessDescription.trim()) || uploads.length > 0;
    if (!workspaceId || !hasRequiredInput || loading || loadingDocuments) return;
    setLoading(true);
    setError("");
    setTechnicalError("");
    try {
      await requestApi({
        path: `/workspaces/${workspaceId}/onboarding/business-description`,
        method: "PATCH",
        body: {
          businessDescription: profile.businessDescription.trim() || null,
          valueProposition: profile.valueProposition.trim() || null,
          targetMarket: profile.targetMarket.trim() || null,
          shortBrandDescription: profile.shortBrandDescription.trim() || null,
          positioningTags: splitList(profile.positioningTags),
          legalForm: profile.legalForm.trim() || null,
          foundingYear: profile.foundingYear.trim() ? Number(profile.foundingYear) : null,
          employeeCount: profile.employeeCount.trim() ? Number(profile.employeeCount) : null,
          annualRevenueRange: profile.annualRevenueRange.trim() || null,
          businessModelType: profile.businessModelType.trim() || null,
          companyStage: profile.companyStage.trim() || null,
          salesModel: profile.salesModel.trim() || null,
          salesCycleDays: profile.salesCycleDays.trim() ? Number(profile.salesCycleDays) : null,
          primaryIcp: profile.primaryIcp.trim() || null,
          usp: profile.usp.trim() || null,
          mission: profile.mission.trim() || null,
          vision: profile.vision.trim() || null,
          primaryChallenges: splitList(profile.primaryChallenges),
          languages: splitList(profile.languages),
          regulatedIndustries: splitList(profile.regulatedIndustries),
        },
      });
      setSaved(true);
      navigateApp(routes.onboarding.existingPlatforms);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Die Firmenbeschreibung konnte nicht gespeichert werden. Bitte versuche es erneut."));
      setTechnicalError(getTechnicalErrorDetails(cause));
    } finally {
      setLoading(false);
    }
  }

  const canContinue = reuploadRequired
    ? uploads.length > 0
    : Boolean(profile.businessDescription.trim()) || uploads.length > 0;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="flex items-start justify-center px-6 py-8 sm:px-8 lg:px-12"><div className="w-full max-w-xl">
        <OnboardingHeader step={2} />
        <p className="mt-10 text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">02 / 04 · Company profile</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">Tell Lulu what makes your business matter.</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--muted-foreground)]">Beschreibe dein Unternehmen in deinen eigenen Worten. Diese Informationen helfen Lulu, dein Unternehmen besser zu verstehen.</p>
        <form className="mt-8 space-y-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)]" onSubmit={saveAndContinue}>
          {reuploadRequired && <div className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-4 py-3 text-sm leading-6 text-[var(--destructive)]" role="alert"><strong className="block">Onboarding files expired</strong><span>Your previous onboarding files were deleted after five days without completed payment. Upload at least one file again before continuing.</span></div>}
          <label className="block text-sm font-medium text-[var(--muted-foreground)]" htmlFor="business-description"><span className="text-[var(--foreground)]">Über dein Unternehmen</span><textarea id="business-description" value={profile.businessDescription} onChange={(event) => { setProfile((current) => ({ ...current, businessDescription: event.target.value })); setSaved(false); }} maxLength={2000} placeholder="Was macht dein Unternehmen, für wen ist es da und welches Problem löst ihr?" className="mt-2 min-h-48 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /><span className="mt-2 block text-right text-xs text-[var(--muted-foreground)]">{profile.businessDescription.length}/2000</span></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Value Proposition</span><textarea value={profile.valueProposition} onChange={(event) => { setProfile((current) => ({ ...current, valueProposition: event.target.value })); setSaved(false); }} maxLength={2500} placeholder="Warum ist euer Angebot wertvoll?" className="mt-2 min-h-28 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Zielmarkt</span><textarea value={profile.targetMarket} onChange={(event) => { setProfile((current) => ({ ...current, targetMarket: event.target.value })); setSaved(false); }} maxLength={2000} placeholder="Welche Märkte, Regionen oder Kundentypen adressiert ihr?" className="mt-2 min-h-28 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Kurzbeschreibung Marke</span><input value={profile.shortBrandDescription} onChange={(event) => { setProfile((current) => ({ ...current, shortBrandDescription: event.target.value })); setSaved(false); }} maxLength={500} placeholder="1 Satz, der eure Marke beschreibt" className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Positioning Tags</span><input value={profile.positioningTags} onChange={(event) => { setProfile((current) => ({ ...current, positioningTags: event.target.value })); setSaved(false); }} placeholder="z. B. AI, B2B SaaS, DACH, Premium" className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Rechtsform</span><input value={profile.legalForm} onChange={(event) => { setProfile((current) => ({ ...current, legalForm: event.target.value })); setSaved(false); }} placeholder="z. B. GmbH" className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Gründungsjahr</span><input type="number" value={profile.foundingYear} onChange={(event) => { setProfile((current) => ({ ...current, foundingYear: event.target.value })); setSaved(false); }} placeholder="2020" className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Mitarbeiteranzahl</span><input type="number" value={profile.employeeCount} onChange={(event) => { setProfile((current) => ({ ...current, employeeCount: event.target.value })); setSaved(false); }} placeholder="25" className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Umsatzspanne</span><input value={profile.annualRevenueRange} onChange={(event) => { setProfile((current) => ({ ...current, annualRevenueRange: event.target.value })); setSaved(false); }} placeholder="z. B. 1-5 Mio. EUR" className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Geschäftsmodell</span><input value={profile.businessModelType} onChange={(event) => { setProfile((current) => ({ ...current, businessModelType: event.target.value })); setSaved(false); }} placeholder="z. B. SaaS, Agentur, E-Commerce" className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Unternehmensphase</span><input value={profile.companyStage} onChange={(event) => { setProfile((current) => ({ ...current, companyStage: event.target.value })); setSaved(false); }} placeholder="z. B. Early, Growth, Scale" className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Sales Model</span><input value={profile.salesModel} onChange={(event) => { setProfile((current) => ({ ...current, salesModel: event.target.value })); setSaved(false); }} placeholder="z. B. inbound, outbound, partner-led" className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Sales Cycle in Tagen</span><input type="number" value={profile.salesCycleDays} onChange={(event) => { setProfile((current) => ({ ...current, salesCycleDays: event.target.value })); setSaved(false); }} placeholder="30" className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
          </div>
          <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Primary ICP</span><textarea value={profile.primaryIcp} onChange={(event) => { setProfile((current) => ({ ...current, primaryIcp: event.target.value })); setSaved(false); }} maxLength={2000} placeholder="Beschreibe euer ideales Kundenprofil." className="mt-2 min-h-28 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">USP / Differenzierung</span><textarea value={profile.usp} onChange={(event) => { setProfile((current) => ({ ...current, usp: event.target.value })); setSaved(false); }} maxLength={2000} placeholder="Was unterscheidet euch?" className="mt-2 min-h-28 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Primäre Herausforderungen</span><textarea value={profile.primaryChallenges} onChange={(event) => { setProfile((current) => ({ ...current, primaryChallenges: event.target.value })); setSaved(false); }} maxLength={2000} placeholder="Kommagetrennt, z. B. Leadqualität, Conversion, Retention" className="mt-2 min-h-28 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Mission</span><textarea value={profile.mission} onChange={(event) => { setProfile((current) => ({ ...current, mission: event.target.value })); setSaved(false); }} maxLength={2000} placeholder="Wofür existiert euer Unternehmen?" className="mt-2 min-h-28 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Vision</span><textarea value={profile.vision} onChange={(event) => { setProfile((current) => ({ ...current, vision: event.target.value })); setSaved(false); }} maxLength={2000} placeholder="Welchen Zielzustand wollt ihr schaffen?" className="mt-2 min-h-28 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Sprachen</span><input value={profile.languages} onChange={(event) => { setProfile((current) => ({ ...current, languages: event.target.value })); setSaved(false); }} placeholder="Kommagetrennt, z. B. de, en" className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span className="text-[var(--foreground)]">Regulierte Bereiche</span><input value={profile.regulatedIndustries} onChange={(event) => { setProfile((current) => ({ ...current, regulatedIndustries: event.target.value })); setSaved(false); }} placeholder="Kommagetrennt, z. B. Fintech, Healthcare" className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" /></label>
          </div>
          <section className="space-y-3" aria-labelledby="business-files-title"><div className="flex items-end justify-between gap-3"><div><h2 id="business-files-title" className="text-sm font-semibold text-[var(--foreground)]">Bilder und Dokumente</h2><p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">Lade Unterlagen hoch, die Lulu über dein Unternehmen informieren sollen.</p></div><span className="shrink-0 text-xs text-[var(--muted-foreground)]">Max. 5.000 KB</span></div>
            <label htmlFor="business-file-upload" className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--secondary)] px-5 py-8 text-center transition hover:border-[var(--ring)] hover:bg-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--ring)]/20"><UploadCloud size={24} className="text-[var(--accent-foreground)]" aria-hidden="true" /><span className="mt-3 text-sm font-semibold text-[var(--foreground)]">{uploading ? "Wird hochgeladen…" : "Dateien auswählen"}</span><span className="mt-1 text-xs text-[var(--muted-foreground)]">Bilder, PDF-, Word-, Excel-, PowerPoint-, TXT- oder CSV-Dateien{reuploadRequired ? " · At least one file is required" : ""}</span><input id="business-file-upload" type="file" multiple accept={ACCEPTED_FILES} className="sr-only" disabled={uploading} onChange={(event) => { void addFiles(event.target.files); event.currentTarget.value = ""; }} /></label>
            {fileError && <p className="text-xs text-[var(--destructive)]" role="alert">{fileError}</p>}
            {loadingDocuments && <p className="text-xs text-[var(--muted-foreground)]">Gespeicherte Dokumente werden geladen…</p>}
            {uploads.length > 0 && <ul className="grid gap-2 sm:grid-cols-2" aria-label="Hochgeladene Dateien">{uploads.map((item) => <li key={item.id} className="group flex min-w-0 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3"><button type="button" className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" onClick={() => item.contentAvailable && setActiveUpload(item)} aria-label={`${item.fileName} öffnen${item.contentAvailable ? "" : " (Vorschau nicht verfügbar)"}`} disabled={!item.contentAvailable}>{item.kind === "image" ? <img src={item.url} alt="" className="h-full w-full object-cover" /> : <FileText size={20} className="text-[var(--accent-foreground)]" />}</button><button type="button" className="min-w-0 flex-1 text-left focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" onClick={() => item.contentAvailable && setActiveUpload(item)}><span className="block truncate text-sm font-medium text-[var(--foreground)]">{item.fileName}</span><span className="mt-1 block text-xs text-[var(--muted-foreground)]">{getFileExtension(item.fileName)} · {formatFileSize(item.sizeBytes)}{!item.contentAvailable ? " · Vorschau nicht verfügbar" : ""}</span></button><button type="button" onClick={() => void removeUpload(item)} className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] hover:text-[var(--destructive)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" aria-label={`${item.fileName} löschen`}><Trash2 size={16} /></button></li>)}</ul>}
          </section>
          <button type="submit" disabled={loading || loadingDocuments || !canContinue} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"><span>{loading ? "Speichern…" : saved ? "Gespeichert" : "Speichern und weiter"}</span><ArrowRight size={16} /></button><p className="flex items-center gap-2 text-sm text-[var(--foreground)]"><ShieldCheck size={15} /><span>Deine Angaben bleiben in deinem sicheren Workspace.</span></p>{error && <div role="alert" className="space-y-2 text-sm text-[var(--destructive)]"><p>{error}</p>{technicalError && <details className="rounded-md border border-[var(--border)] bg-[var(--secondary)] p-2 text-xs text-[var(--muted-foreground)]"><summary className="cursor-pointer font-medium text-[var(--foreground)]">Technische Details anzeigen</summary><p className="mt-2 break-words leading-5">{technicalError}</p></details>}</div>}
        </form>
      </div></section>

      {activeUpload && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="file-preview-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveUpload(null); }}><div className="flex h-[min(88vh,780px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl"><header className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3 sm:px-5"><div className="min-w-0"><h2 id="file-preview-title" className="truncate text-sm font-semibold text-[var(--foreground)]">{activeUpload.fileName}</h2><p className="text-xs text-[var(--muted-foreground)]">{getFileExtension(activeUpload.fileName)} · {formatFileSize(activeUpload.sizeBytes)}</p></div><button type="button" onClick={() => setActiveUpload(null)} className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" aria-label="Vorschau schließen"><X size={18} /></button></header><iframe title={`Vorschau von ${activeUpload.fileName}`} src={activeUpload.url} className="min-h-0 flex-1 bg-white" /></div></div>}
    </main>
  );
};
