import { useEffect, useRef, useState } from "react";
import { Image, Loader2, Upload, XCircle } from "lucide-react";
import { getFriendlyErrorMessage } from "../../api/client";
import { websitesApi, type ManagedWebsiteAsset, type WebsiteSite } from "../../api/websites";

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

export function WebsiteAssetPanel({ workspaceId, site }: { workspaceId: string; site: WebsiteSite }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<ManagedWebsiteAsset[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [placement, setPlacement] = useState<ManagedWebsiteAsset["placement"]>("website");
  const [zoom, setZoom] = useState(1);
  const [busy, setBusy] = useState<"load" | "upload" | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setBusy("load"); setError("");
    try { setAssets((await websitesApi.listAssets(workspaceId, site.id)).data.items); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "Die Medien konnten nicht geladen werden.")); }
    finally { setBusy(null); }
  };
  useEffect(() => { void load(); }, [workspaceId, site.id]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const choose = (next: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!next) { setFile(null); setPreviewUrl(""); return; }
    setFile(next); setPreviewUrl(URL.createObjectURL(next)); setAltText(next.name.replace(/\.[^.]+$/, "")); setError("");
  };
  const upload = async () => {
    if (!file) return;
    setBusy("upload"); setError("");
    try {
      const cropped = await cropImage(file, zoom);
      const form = new FormData();
      form.append("file", new File([cropped], "lulu-cropped.jpg", { type: "image/jpeg" }));
      form.append("altText", altText);
      form.append("placement", placement);
      form.append("crop", JSON.stringify({ zoom, outputWidth, outputHeight, sourceName: file.name }));
      const result = await websitesApi.uploadAsset(workspaceId, site.id, form);
      setAssets((current) => [result.data, ...current]); choose(null);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "Das Bild konnte nicht gespeichert werden.")); }
    finally { setBusy(null); }
  };

  return <section className="rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Website-Medien</p><h2 className="mt-2 text-2xl font-semibold">Bilder hochladen und zuschneiden</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Lulu speichert den fertigen Zuschnitt direkt im verwalteten Website-Projekt. Bezahlen oder einen externen Anbieter brauchst du dafür nicht.</p></div><button type="button" onClick={() => inputRef.current?.click()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary"><Upload size={15} /> Bild auswählen</button><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => choose(event.target.files?.[0] ?? null)} /></div>
    {error ? <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"><XCircle size={16} className="mt-0.5 shrink-0" />{error}</div> : null}
    {file ? <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="overflow-hidden rounded-2xl border border-border bg-secondary p-3"><div className="relative aspect-[14/9] overflow-hidden rounded-xl bg-slate-950"><img src={previewUrl} alt="Vorschau des Zuschnitts" className="h-full w-full object-cover" style={{ transform: `scale(${zoom})` }} /></div><label className="mt-4 block text-sm font-medium">Zoom <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mt-2 w-full" /></label><p className="mt-2 text-xs text-muted-foreground">Der Ausschnitt wird mittig als 14:9-Websitebild gespeichert.</p></div><div className="space-y-4"><label className="block text-sm font-medium">Alternativtext<input value={altText} onChange={(event) => setAltText(event.target.value)} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3" /></label><label className="block text-sm font-medium">Verwendung<select value={placement} onChange={(event) => setPlacement(event.target.value as ManagedWebsiteAsset["placement"])} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3"><option value="website">Website</option><option value="hero">Hero-Bereich</option><option value="gallery">Galerie</option><option value="product">Produkt</option><option value="logo">Logo</option></select></label><div className="flex gap-2"><button type="button" onClick={() => void upload()} disabled={busy === "upload"} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy === "upload" ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Zuschnitt speichern</button><button type="button" onClick={() => choose(null)} className="rounded-xl border border-border px-3 text-sm">Abbrechen</button></div></div></div> : null}
    <div className="mt-7"><div className="flex items-center justify-between"><h3 className="font-semibold">Gespeicherte Bilder</h3>{busy === "load" ? <Loader2 size={16} className="animate-spin text-muted-foreground" /> : null}</div>{assets.length ? <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{assets.map((asset) => <article key={asset.id} className="overflow-hidden rounded-xl border border-border"><img src={asset.publicUrl} alt={asset.altText || asset.fileName} className="aspect-[14/9] w-full object-cover" /><div className="p-3 text-xs"><p className="font-semibold">{asset.altText || asset.fileName}</p><p className="mt-1 text-muted-foreground">{asset.placement} · {Math.round(asset.sizeBytes / 1024)} KB</p></div></article>)}</div> : <div className="mt-3 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground"><Image size={22} className="mx-auto mb-2" />Noch keine eigenen Website-Bilder gespeichert.</div>}</div>
  </section>;
}
