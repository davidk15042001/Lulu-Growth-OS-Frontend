import { useEffect, useRef, useState } from "react";
import { ArrowRight, FileText, ShieldCheck, Sparkles, Trash2, UploadCloud, X } from "lucide-react";
import { navigateApp, routes } from "../../../../routing";
import { getFriendlyErrorMessage, requestApi } from "../../../../api/client";
import { getSelectedWorkspaceId } from "../../../../api/session";

type UploadItem = {
  id: string;
  file: File;
  url: string;
  kind: "image" | "document";
};

const setupSteps = [
  "Company Information",
  "Business Description",
  "Products & Services",
  "Existing Platforms",
  "Integrations",
  "AI Preferences",
  "Setup Complete",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ACCEPTED_FILES = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv";

function isImage(file: File) {
  return file.type.startsWith("image/");
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(name: string) {
  return name.split(".").pop()?.toUpperCase() || "FILE";
}

export const BusinessDescription = () => {
  const [businessDescription, setBusinessDescription] = useState("");
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [activeUpload, setActiveUpload] = useState<UploadItem | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");
  const uploadsRef = useRef<UploadItem[]>([]);

  useEffect(() => {
    uploadsRef.current = uploads;
  }, [uploads]);

  useEffect(() => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    requestApi<{ workspace: { businessDescription: string | null } }>({ path: `/workspaces/${workspaceId}/onboarding` })
      .then((response) => setBusinessDescription(response.data.workspace.businessDescription ?? ""))
      .catch(() => undefined);
  }, []);

  useEffect(() => () => {
    uploadsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
  }, []);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    setFileError("");
    const nextFiles: UploadItem[] = [];
    Array.from(fileList).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`${file.name} ist größer als 25 MB und wurde nicht hinzugefügt.`);
        return;
      }
      nextFiles.push({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
        kind: isImage(file) ? "image" : "document",
      });
    });
    if (nextFiles.length) setUploads((current) => [...current, ...nextFiles]);
  }

  function removeUpload(id: string) {
    setUploads((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) URL.revokeObjectURL(item.url);
      if (activeUpload?.id === id) setActiveUpload(null);
      return current.filter((entry) => entry.id !== id);
    });
  }

  async function saveAndContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId || !businessDescription.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      await requestApi({
        path: `/workspaces/${workspaceId}/onboarding/business-description`,
        method: "PATCH",
        body: { businessDescription: businessDescription.trim() },
      });
      setSaved(true);
      navigateApp(routes.onboarding.productsServices);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Die Firmenbeschreibung konnte nicht gespeichert werden. Bitte versuche es erneut."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:grid-cols-2">
      <section className="flex items-start justify-center px-6 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] font-bold text-[var(--primary-foreground)]">L</span>
            <b className="text-xl text-[var(--foreground)]">Lulu AI</b>
          </div>

          <nav aria-label="Setup progress" className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">Company setup</p>
              <p className="text-xs font-medium text-[var(--foreground)]">Step 2 of 7</p>
            </div>
            <ol className="grid grid-cols-7 gap-1.5">
              {setupSteps.map((step, index) => (
                <li key={step} className="min-w-0"><span className={`block h-1.5 rounded-full ${index <= 1 ? "bg-[var(--primary)]" : "bg-[var(--secondary)]"}`} title={step} /><span className="sr-only">{step}</span></li>
              ))}
            </ol>
          </nav>

          <p className="mt-10 text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">02 / 07 · Company profile</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">Tell Lulu what makes your business matter.</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--muted-foreground)]">Beschreibe dein Unternehmen in deinen eigenen Worten. Diese Informationen helfen Lulu, dein Unternehmen besser zu verstehen.</p>

          <form className="mt-8 space-y-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)]" onSubmit={saveAndContinue}>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]" htmlFor="business-description">
              <span className="text-[var(--foreground)]">Über dein Unternehmen</span>
              <textarea id="business-description" value={businessDescription} onChange={(event) => { setBusinessDescription(event.target.value); setSaved(false); }} maxLength={2000} placeholder="Was macht dein Unternehmen, für wen ist es da und welches Problem löst ihr?" className="mt-2 min-h-48 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20" />
              <span className="mt-2 block text-right text-xs text-[var(--muted-foreground)]">{businessDescription.length}/2000</span>
            </label>

            <section className="space-y-3" aria-labelledby="business-files-title">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 id="business-files-title" className="text-sm font-semibold text-[var(--foreground)]">Bilder und Dokumente</h2>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">Lade Unterlagen hoch, die Lulu über dein Unternehmen informieren sollen.</p>
                </div>
                <span className="shrink-0 text-xs text-[var(--muted-foreground)]">Max. 25 MB</span>
              </div>

              <label htmlFor="business-file-upload" className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--secondary)] px-5 py-8 text-center transition hover:border-[var(--ring)] hover:bg-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--ring)]/20">
                <UploadCloud size={24} className="text-[var(--accent-foreground)]" aria-hidden="true" />
                <span className="mt-3 text-sm font-semibold text-[var(--foreground)]">Dateien auswählen</span>
                <span className="mt-1 text-xs text-[var(--muted-foreground)]">Bilder, PDF-, Word-, Excel-, PowerPoint-, TXT- oder CSV-Dateien</span>
                <input id="business-file-upload" type="file" multiple accept={ACCEPTED_FILES} className="sr-only" onChange={(event) => { addFiles(event.target.files); event.currentTarget.value = ""; }} />
              </label>
              {fileError && <p className="text-xs text-[var(--destructive)]" role="alert">{fileError}</p>}

              {uploads.length > 0 && (
                <ul className="grid gap-2 sm:grid-cols-2" aria-label="Hochgeladene Dateien">
                  {uploads.map((item) => (
                    <li key={item.id} className="group flex min-w-0 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3">
                      <button type="button" className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md border border-[var(--border)] bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" onClick={() => setActiveUpload(item)} aria-label={`${item.file.name} öffnen`}>
                        {item.kind === "image" ? <img src={item.url} alt="" className="h-full w-full object-cover" /> : <FileText size={20} className="text-[var(--accent-foreground)]" />}
                      </button>
                      <button type="button" className="min-w-0 flex-1 text-left focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" onClick={() => setActiveUpload(item)}>
                        <span className="block truncate text-sm font-medium text-[var(--foreground)]">{item.file.name}</span>
                        <span className="mt-1 block text-xs text-[var(--muted-foreground)]">{getFileExtension(item.file.name)} · {formatFileSize(item.file.size)}</span>
                      </button>
                      <button type="button" onClick={() => removeUpload(item.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] hover:text-[var(--destructive)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" aria-label={`${item.file.name} löschen`}><Trash2 size={16} /></button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <button type="submit" disabled={loading || !businessDescription.trim()} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"><span>{loading ? "Speichern…" : saved ? "Gespeichert" : "Speichern und weiter"}</span><ArrowRight size={16} /></button>
            <p className="flex items-center gap-2 text-sm text-[var(--foreground)]"><ShieldCheck size={15} /><span>Deine Angaben bleiben in deinem sicheren Workspace.</span></p>
            {error && <p role="alert" className="text-sm text-[var(--destructive)]">{error}</p>}
          </form>
        </div>
      </section>

      <aside className="hidden border-l border-[var(--border)] bg-[var(--sidebar)] p-12 text-[var(--foreground)] lg:flex lg:flex-col lg:justify-between">
        <Sparkles size={42} className="text-[var(--foreground)]" />
        <div><p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">Business Description</p><h2 className="mt-3 max-w-lg text-5xl font-semibold leading-tight tracking-[-0.045em] text-[var(--foreground)]">A sharper company story creates sharper AI recommendations.</h2><p className="mt-5 max-w-md text-lg leading-8 text-[var(--muted-foreground)]">Lulu nutzt deine Beschreibung und deine Unterlagen, um dein Unternehmen besser zu verstehen und passendere Empfehlungen zu erstellen.</p></div>
        <p className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]"><ShieldCheck size={18} /><span>Business context stays inside your secure workspace</span></p>
      </aside>

      {activeUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="file-preview-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveUpload(null); }}>
          <div className="flex h-[min(88vh,780px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
            <header className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3 sm:px-5"><div className="min-w-0"><h2 id="file-preview-title" className="truncate text-sm font-semibold text-[var(--foreground)]">{activeUpload.file.name}</h2><p className="text-xs text-[var(--muted-foreground)]">{getFileExtension(activeUpload.file.name)} · {formatFileSize(activeUpload.file.size)}</p></div><button type="button" onClick={() => setActiveUpload(null)} className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" aria-label="Vorschau schließen"><X size={18} /></button></header>
            <iframe title={`Vorschau von ${activeUpload.file.name}`} src={activeUpload.url} className="min-h-0 flex-1 bg-white" />
          </div>
        </div>
      )}
    </main>
  );
};
