import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Loader2, Sparkles, Upload, X, XCircle } from "lucide-react";
import { getFriendlyErrorMessage } from "../../api/client";
import { websitesApi, type ManagedWebsiteAsset, type WebsiteAssetEdit, type WebsiteSite } from "../../api/websites";

const outputWidth = 1400;
const outputHeight = 900;

function cropImage(file: File, zoom: number) {
  return new Promise<Blob>((resolve, reject) => {
    const image = new window.Image();
    const sourceUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(sourceUrl);
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const context = canvas.getContext("2d");
      if (!context) return reject(new Error("Canvas is not available"));
      const baseScale = Math.max(outputWidth / image.naturalWidth, outputHeight / image.naturalHeight);
      const scale = baseScale * zoom;
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, outputWidth, outputHeight);
      context.drawImage(image, (outputWidth - drawWidth) / 2, (outputHeight - drawHeight) / 2, drawWidth, drawHeight);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The image crop could not be created")), "image/jpeg", 0.92);
    };
    image.onerror = () => { URL.revokeObjectURL(sourceUrl); reject(new Error("The image could not be read")); };
    image.src = sourceUrl;
  });
}

const terminalEditStatuses = new Set<WebsiteAssetEdit["status"]>(["COMPLETED", "FAILED", "CANCELLED"]);

export function WebsiteAssetPanel({ workspaceId, site }: { workspaceId: string; site: WebsiteSite }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<ManagedWebsiteAsset[]>([]);
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [placement, setPlacement] = useState<ManagedWebsiteAsset["placement"]>("website");
  const [zoom, setZoom] = useState(1);
  const [busy, setBusy] = useState<"load" | "upload" | null>(null);
  const [error, setError] = useState("");
  const [activeAsset, setActiveAsset] = useState<ManagedWebsiteAsset | null>(null);
  const [prompt, setPrompt] = useState("");
  const [editJob, setEditJob] = useState<WebsiteAssetEdit | null>(null);
  const [editBusy, setEditBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy("load");
    setError("");
    try {
      const items = (await websitesApi.listAssets(workspaceId, site.id)).data.items;
      setAssets(items);
      const loadedUrls: Record<string, string> = {};
      await Promise.all(items.map(async (asset) => {
        try {
          loadedUrls[asset.id] = URL.createObjectURL(await websitesApi.getAssetBlob(workspaceId, site.id, asset.id));
        } catch {
          // Keep the card visible with its filename if a single asset is no longer available.
        }
      }));
      setAssetUrls((current) => {
        Object.values(current).forEach((url) => URL.revokeObjectURL(url));
        return loadedUrls;
      });
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Die Medien konnten nicht geladen werden."));
    } finally {
      setBusy(null);
    }
  }, [workspaceId, site.id]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => () => { Object.values(assetUrls).forEach((url) => URL.revokeObjectURL(url)); }, [assetUrls]);

  useEffect(() => {
    if (!editJob || terminalEditStatuses.has(editJob.status)) return undefined;
    const timer = window.setTimeout(async () => {
      try {
        const next = (await websitesApi.getAssetEdit(workspaceId, site.id, editJob.id)).data;
        setEditJob(next);
        if (next.status === "COMPLETED") {
          await load();
          setActiveAsset(null);
          setPrompt("");
        }
      } catch (cause) {
        setError(getFriendlyErrorMessage(cause, "Der Bildstatus konnte nicht geladen werden."));
      }
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [editJob, load, site.id, workspaceId]);

  const choose = (next: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!next) { setFile(null); setPreviewUrl(""); return; }
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
    setAltText(next.name.replace(/\.[^.]+$/, ""));
    setError("");
  };

  const upload = async () => {
    if (!file) return;
    setBusy("upload");
    setError("");
    try {
      const cropped = await cropImage(file, zoom);
      const form = new FormData();
      form.append("file", new File([cropped], "lulu-cropped.jpg", { type: "image/jpeg" }));
      form.append("altText", altText);
      form.append("placement", placement);
      form.append("crop", JSON.stringify({ zoom, outputWidth, outputHeight, sourceName: file.name }));
      await websitesApi.uploadAsset(workspaceId, site.id, form);
      await load();
      choose(null);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Das Bild konnte nicht gespeichert werden."));
    } finally {
      setBusy(null);
    }
  };

  const openEditor = (asset: ManagedWebsiteAsset) => {
    setActiveAsset(asset);
    setPrompt("");
    setEditJob(null);
    setError("");
  };

  const closeEditor = () => {
    if (editBusy || (editJob && !terminalEditStatuses.has(editJob.status))) return;
    setActiveAsset(null);
    setPrompt("");
    setEditJob(null);
  };

  const startEdit = async () => {
    if (!activeAsset || prompt.trim().length < 3) return;
    setEditBusy(true);
    setError("");
    try {
      setEditJob((await websitesApi.editAsset(workspaceId, site.id, activeAsset.id, prompt.trim())).data);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Das Bild konnte nicht bearbeitet werden."));
    } finally {
      setEditBusy(false);
    }
  };

  return <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Website-Medien</p>
        <h2 className="mt-2 text-2xl font-semibold">Bilder hochladen und zuschneiden</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Lulu speichert den fertigen Zuschnitt direkt im verwalteten Website-Projekt. Klicke ein Bild an, um es mit einem Prompt zu bearbeiten.</p>
      </div>
      <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary"><Upload size={15} /> Bild auswählen</button>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => choose(event.target.files?.[0] ?? null)} />
    </div>
    {error ? <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"><XCircle size={16} className="mt-0.5 shrink-0" />{error}</div> : null}
    {file ? <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="overflow-hidden rounded-2xl border border-border bg-secondary p-3"><div className="relative aspect-[14/9] overflow-hidden rounded-xl bg-slate-950"><img src={previewUrl} alt="Vorschau des Zuschnitts" className="h-full w-full object-cover" style={{ transform: `scale(${zoom})` }} /></div><label className="mt-4 block text-sm font-medium">Zoom <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mt-2 w-full" /></label><p className="mt-2 text-xs text-muted-foreground">Der Ausschnitt wird mittig als 14:9-Websitebild gespeichert.</p></div><div className="space-y-4"><label className="block text-sm font-medium">Alternativtext<input value={altText} onChange={(event) => setAltText(event.target.value)} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3" /></label><label className="block text-sm font-medium">Verwendung<select value={placement} onChange={(event) => setPlacement(event.target.value as ManagedWebsiteAsset["placement"])} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3"><option value="website">Website</option><option value="hero">Hero-Bereich</option><option value="gallery">Galerie</option><option value="product">Produkt</option><option value="logo">Logo</option></select></label><div className="flex gap-2"><button type="button" onClick={() => void upload()} disabled={busy === "upload"} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy === "upload" ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Zuschnitt speichern</button><button type="button" onClick={() => choose(null)} className="rounded-xl border border-border px-3 text-sm">Abbrechen</button></div></div></div> : null}
    <div className="mt-7">
      <div className="flex items-center justify-between"><h3 className="font-semibold">Gespeicherte Bilder</h3>{busy === "load" ? <Loader2 size={16} className="animate-spin text-muted-foreground" /> : null}</div>
      {assets.length ? <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{assets.map((asset) => <article key={asset.id} className="overflow-hidden rounded-xl border border-border bg-background"><button type="button" onClick={() => openEditor(asset)} className="group block w-full text-left" aria-label={`Bild ${asset.altText || asset.fileName} bearbeiten`}><div className="relative aspect-[14/9] overflow-hidden bg-secondary">{assetUrls[asset.id] ? <img src={assetUrls[asset.id]} alt={asset.altText || asset.fileName} className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Bild wird geladen …</div>}<span className="absolute inset-x-2 bottom-2 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950/80 px-2 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"><Sparkles size={13} /> Mit Prompt bearbeiten</span></div><div className="p-3 text-xs"><p className="font-semibold">{asset.altText || asset.fileName}</p><p className="mt-1 text-muted-foreground">{asset.placement} · {Math.round(asset.sizeBytes / 1024)} KB</p></div></button></article>)}</div> : <div className="mt-3 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground"><Image size={22} className="mx-auto mb-2" />Noch keine eigenen Website-Bilder gespeichert.</div>}
    </div>

    {activeAsset ? <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}><div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-card p-5 shadow-2xl sm:rounded-3xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="website-asset-edit-title"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Bild bearbeiten</p><h2 id="website-asset-edit-title" className="mt-1 text-xl font-semibold">Änderung beschreiben</h2><p className="mt-1 text-sm text-muted-foreground">Lulu erstellt eine neue Version. Das Original bleibt erhalten.</p></div><button type="button" onClick={closeEditor} disabled={editBusy || Boolean(editJob && !terminalEditStatuses.has(editJob.status))} className="rounded-xl p-2 hover:bg-secondary disabled:opacity-40" aria-label="Bildeditor schließen"><X size={20} /></button></div><div className="mt-5 grid gap-5 sm:grid-cols-[220px_minmax(0,1fr)]"><div className="overflow-hidden rounded-2xl border border-border bg-secondary">{assetUrls[activeAsset.id] ? <img src={assetUrls[activeAsset.id]} alt={activeAsset.altText || activeAsset.fileName} className="aspect-[14/9] h-full w-full object-cover" /> : <div className="flex aspect-[14/9] items-center justify-center text-xs text-muted-foreground">Bild wird geladen …</div>}</div><div><label htmlFor="website-asset-edit-prompt" className="text-sm font-semibold">Was soll geändert werden?</label><textarea id="website-asset-edit-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} disabled={editBusy || Boolean(editJob && !terminalEditStatuses.has(editJob.status))} placeholder="Zum Beispiel: Helleres Tageslicht, gleiche Perspektive, keine Personen hinzufügen." className="mt-2 min-h-32 w-full resize-y rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary" /><p className="mt-2 text-xs text-muted-foreground">Beschreibe Motiv, Stil, Farben und was unverändert bleiben soll.</p></div></div>{editJob ? <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${editJob.status === "FAILED" ? "border-rose-200 bg-rose-50 text-rose-800" : editJob.status === "COMPLETED" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-border bg-secondary text-foreground"}`}><div className="flex items-center gap-2 font-semibold">{!terminalEditStatuses.has(editJob.status) ? <Loader2 size={15} className="animate-spin" /> : null}{editJob.status === "COMPLETED" ? "Neue Bildversion gespeichert." : editJob.status === "FAILED" ? "Bildbearbeitung fehlgeschlagen." : `Bildbearbeitung: ${editJob.status.toLowerCase()}`}</div>{editJob.errorMessage ? <p className="mt-1">{editJob.errorMessage}</p> : null}</div> : null}<div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={closeEditor} disabled={editBusy || Boolean(editJob && !terminalEditStatuses.has(editJob.status))} className="h-10 rounded-xl border border-border px-4 text-sm font-semibold disabled:opacity-40">Schließen</button><button type="button" onClick={() => void startEdit()} disabled={editBusy || prompt.trim().length < 3 || Boolean(editJob && !terminalEditStatuses.has(editJob.status))} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{editBusy ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} Bild bearbeiten</button></div></div></div> : null}
  </section>;
}
