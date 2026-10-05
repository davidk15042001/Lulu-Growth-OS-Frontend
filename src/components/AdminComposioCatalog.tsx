import { ChevronDown, ChevronUp, Search, ShieldCheck, ShieldOff } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getFriendlyErrorMessage } from "../api/client";
import { composioApi, type AdminComposioTool, type AdminComposioToolkit } from "../api/composio";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";

type ToolMetadata = { total: number; truncated: boolean };

export function AdminComposioCatalog() {
  const t = useTranslation();
  const [items, setItems] = useState<AdminComposioToolkit[]>([]);
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [toolItems, setToolItems] = useState<Record<string, AdminComposioTool[]>>({});
  const [toolSearch, setToolSearch] = useState<Record<string, string>>({});
  const [toolMeta, setToolMeta] = useState<Record<string, ToolMetadata>>({});
  const [toolsLoading, setToolsLoading] = useState<string | null>(null);
  const [toolsError, setToolsError] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async (query: string, pageCursor: string | null) => {
    setLoading(true); setError("");
    try {
      const response = await composioApi.adminCatalog({ search: query, cursor: pageCursor });
      setItems((current) => {
        if (!pageCursor) return response.data.items;
        const known = new Set(current.map((item) => item.slug));
        return [...current, ...response.data.items.filter((item) => !known.has(item.slug))];
      });
      setCursor(response.data.nextCursor);
      setHasMore(Boolean(response.data.nextCursor));
    } catch (cause) {
      if (!pageCursor) setItems([]);
      setError(getFriendlyErrorMessage(cause, t("Der Composio-Katalog konnte nicht geladen werden.")));
    } finally { setLoading(false); }
  }, [t]);

  useEffect(() => { void load("", null); }, [load]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await load(search.trim(), null);
  }

  async function toggle(item: AdminComposioToolkit) {
    if (item.customerRestricted) return;
    setBusySlug(item.slug); setError("");
    try {
      const response = await composioApi.setAdminAvailability(item, !item.customerAvailable);
      setItems((current) => current.map((candidate) => candidate.slug === item.slug ? response.data : candidate));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t("Die Kundenfreigabe konnte nicht geändert werden.")));
    } finally { setBusySlug(null); }
  }

  async function loadTools(item: AdminComposioToolkit, query: string, force = false) {
    const normalizedQuery = query.trim();
    if (!force && !normalizedQuery && toolItems[item.slug]) return;
    setToolsLoading(item.slug); setToolsError("");
    try {
      const response = await composioApi.adminTools(item.slug, normalizedQuery);
      setToolItems((current) => ({ ...current, [item.slug]: response.data.items }));
      setToolMeta((current) => ({ ...current, [item.slug]: { total: response.data.total, truncated: response.data.truncated } }));
    } catch (cause) {
      setToolsError(getFriendlyErrorMessage(cause, t("Die Tools konnten nicht geladen werden.")));
    } finally { setToolsLoading(null); }
  }

  async function toggleTools(item: AdminComposioToolkit) {
    if (expandedSlug === item.slug) { setExpandedSlug(null); return; }
    setExpandedSlug(item.slug); setToolsError("");
    await loadTools(item, toolSearch[item.slug] ?? "");
  }

  return <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">{t("Admin-only catalog")}</p>
        <h2 className="mt-2 text-xl font-semibold">{t("Composio integrations")}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{t("The complete provider catalog is visible here. Customers only see integrations that are available below; WhatsApp, Meta Ads, Google Ads and LinkedIn Ads remain managed by Lulu.")}</p>
      </div>
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold"><ShieldCheck size={14} />{t("Provider governance")}</span>
    </div>
    {error ? <div role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
    <form onSubmit={(event) => void submit(event)} className="mt-5 flex flex-col gap-2 sm:flex-row">
      <label className="sr-only" htmlFor="composio-admin-search">{t("Composio apps search")}</label>
      <input id="composio-admin-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("App oder Toolkit suchen")} className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
      <button type="submit" disabled={loading} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium disabled:opacity-50"><Search size={15} />{t("Suchen")}</button>
    </form>
    {loading && items.length === 0 ? <p className="mt-5 text-sm text-muted-foreground">{t("Katalog wird geladen…")}</p> : items.length === 0 ? <p className="mt-5 text-sm text-muted-foreground">{t("Keine Composio-Apps gefunden.")}</p> : <div className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border">
      {items.map((item) => {
        const expanded = expandedSlug === item.slug;
        const tools = toolItems[item.slug] ?? [];
        const metadata = toolMeta[item.slug];
        const query = toolSearch[item.slug] ?? "";
        return <article key={item.slug} className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong>{item.name}</strong><span className="font-mono text-xs text-muted-foreground">{item.slug}</span>{item.customerRestricted ? <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Lulu managed</span> : null}</div><p className="mt-1 text-xs text-muted-foreground">{item.certificationStatus}{item.publishedAt ? ` · published ${new Date(item.publishedAt).toLocaleDateString()}` : ""}</p></div>
            <div className="flex flex-wrap gap-2"><button type="button" onClick={() => void toggleTools(item)} disabled={toolsLoading === item.slug} aria-expanded={expanded} className="inline-flex w-fit items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium disabled:opacity-50">{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} {expanded ? t("Tools ausblenden") : t("Tools anzeigen")}</button><button type="button" onClick={() => void toggle(item)} disabled={busySlug === item.slug || item.customerRestricted} className={`inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${item.customerAvailable ? "border border-border" : "bg-primary text-primary-foreground"}`}>{item.customerAvailable ? <><ShieldOff size={14} />{t("Für Kunden deaktivieren")}</> : <><ShieldCheck size={14} />{t("Für Kunden veröffentlichen")}</>}</button></div>
          </div>
          {expanded ? <div className="mt-3 rounded-lg border border-border bg-secondary p-3">
            <form onSubmit={(event) => { event.preventDefault(); void loadTools(item, query, true); }} className="flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor={`composio-tools-search-${item.slug}`}>{t("Composio apps search")} {item.name}</label>
              <input id={`composio-tools-search-${item.slug}`} value={query} onChange={(event) => setToolSearch((current) => ({ ...current, [item.slug]: event.target.value }))} placeholder={t("App oder Toolkit suchen")} className="h-9 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
              <button type="submit" disabled={toolsLoading === item.slug} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium disabled:opacity-50"><Search size={14} />{t("Suchen")}</button>
            </form>
            {metadata ? <p className="mt-2 text-xs text-muted-foreground">{metadata.total} {t("Tools")}</p> : null}
            {metadata?.truncated ? <p role="status" className="mt-2 rounded-md border border-amber-300/40 bg-amber-100/60 px-3 py-2 text-xs leading-5 text-amber-900">{t("Die Provider-Antwort enthält mehr als 500 Tools. Es werden die ersten 500 gezeigt; nutze die Suche, um weitere Tools gezielt zu finden.")}</p> : null}
            {toolsLoading === item.slug ? <p className="mt-3 text-sm text-muted-foreground">{t("Tools werden geladen…")}</p> : toolsError ? <p className="mt-3 text-sm text-destructive">{toolsError}</p> : tools.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">{t("Keine Tools verfügbar.")}</p> : <div className="mt-3 grid gap-2">{tools.map((tool) => <div key={tool.slug} className="rounded-md border border-border bg-card p-3"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm">{tool.name}</strong><span className="font-mono text-xs text-muted-foreground">{tool.slug}</span></div>{tool.description ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{tool.description}</p> : null}</div>)}</div>}
          </div> : null}
        </article>;
      })}
    </div>}
    {hasMore ? <button type="button" disabled={loading} onClick={() => void load(search.trim(), cursor)} className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-medium disabled:opacity-50">{t("Weitere Apps laden")}</button> : null}
  </section>;
}
