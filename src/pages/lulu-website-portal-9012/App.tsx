import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { getSelectedWorkspaceId } from "../../api/session";
import { websitesApi, type WebsiteGenerationJob, type WebsiteSite, type WebsiteProviderContent, type WordPressContent, type WordPressContentItem } from "../../api/websites";
import { onboardingApi, type Platform } from "../../api/onboarding";
import { getFriendlyErrorMessage, getTechnicalErrorDetails } from "../../api/client";
import {
  ArrowRight,
  FileEdit,
  Globe2,
  Image,
  LayoutDashboard,
  PenLine,
  Plus,
  RefreshCw,
  Search,
  Settings,
} from "lucide-react";
import { pageLinkProps } from "../../routing";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";

type Provider = "wordpress" | "webflow";

function ViewportPortal({ children }: { children: ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(<div className="lulu-viewport-portal">{children}</div>, document.body);
}

function platformMatchesProvider(platform: Platform, provider: Provider) {
  const key = (platform.integrationKey ?? "").toLowerCase();
  const name = platform.name.toLowerCase();
  return key.includes(provider) || (provider === "wordpress" ? name.includes("wordpress") || name.includes("jetpack") : name.includes("webflow"));
}

function platformIsConnected(platform: Platform) {
  const status = platform.connectionStatus.toLowerCase();
  return ["connected", "active", "enabled", "authorized", "connected_with_warning"].includes(status);
}

const providerOptions: Array<{ id: Provider; label: string; description: string }> = [
  { id: "wordpress", label: "WordPress / Jetpack", description: "Seiten, Beiträge und Medien" },
  { id: "webflow", label: "Webflow", description: "Seiten, CMS und Assets" },
];

const providerContent: Record<Provider, {
  label: string;
  shortLabel: string;
  description: string;
  connectDescription: string;
  metrics: Array<{ label: string; value: string; hint: string; icon: typeof LayoutDashboard }>;
  actions: Array<{ title: string; description: string; icon: typeof Plus }>;
}> = {
  wordpress: {
    label: "WordPress / Jetpack",
    shortLabel: "WordPress",
    description: "Verwalte deine WordPress.com- oder Jetpack-Website mit Lulu AI — von der ersten Idee bis zur bestätigten Veröffentlichung.",
    connectDescription: "Verbinde WordPress.com oder Jetpack, um Seiten, Beiträge und Medien zu verwalten.",
    metrics: [
      { label: "Seiten", value: "0", hint: "Wird nach der Verbindung geladen", icon: LayoutDashboard },
      { label: "Beiträge", value: "0", hint: "Wird nach der Verbindung geladen", icon: PenLine },
      { label: "Medien", value: "0", hint: "Wird nach der Verbindung geladen", icon: Image },
      { label: "Entwürfe", value: "0", hint: "Wird nach der Verbindung geladen", icon: FileEdit },
    ],
    actions: [
      { title: "Neue Seite erstellen", description: "Lulu erstellt eine Seitenstruktur und einen ersten Textentwurf.", icon: Plus },
      { title: "Website analysieren", description: "Prüfe Inhalte, Struktur und Conversion-Potenziale deiner Website.", icon: Search },
      { title: "Medien organisieren", description: "Ordne Bilder und Dateien deinen Website-Inhalten zu.", icon: Image },
    ],
  },
  webflow: {
    label: "Webflow",
    shortLabel: "Webflow",
    description: "Verwalte deine Webflow-Website mit Lulu AI — von Seiten und CMS-Inhalten bis zur kontrollierten Veröffentlichung.",
    connectDescription: "Verbinde Webflow, um Seiten, CMS-Collections und Assets zu verwalten.",
    metrics: [
      { label: "Seiten", value: "0", hint: "Wird nach der Verbindung geladen", icon: LayoutDashboard },
      { label: "CMS-Inhalte", value: "0", hint: "Wird nach der Verbindung geladen", icon: PenLine },
      { label: "Assets", value: "0", hint: "Wird nach der Verbindung geladen", icon: Image },
      { label: "Entwürfe", value: "0", hint: "Wird nach der Verbindung geladen", icon: FileEdit },
    ],
    actions: [
      { title: "Neue Webflow-Seite planen", description: "Lulu erstellt eine Seitenstruktur für deine Webflow-Website.", icon: Plus },
      { title: "Webflow analysieren", description: "Prüfe Seitenstruktur, CMS-Inhalte und Conversion-Potenziale.", icon: Search },
      { title: "Assets organisieren", description: "Ordne Webflow-Assets und bereite sie für Inhalte vor.", icon: Image },
    ],
  },
};

function wordpressItemTitle(item: WordPressContentItem) {
  return typeof item.title === "string" ? item.title : item.title?.rendered ?? item.slug ?? "Unbenannter Inhalt";
}

function wordpressItemUrl(item: WordPressContentItem) {
  return item.URL ?? item.url ?? item.link ?? "";
}

function wordpressDate(item: WordPressContentItem) {
  const value = item.modified ?? item.date;
  if (!value) return "—";
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(new Date(value));
}

function WordPressList({ title, items, loading }: { title: string; items: WordPressContentItem[]; loading: boolean }) {
  return <section className="rounded-2xl border border-[#dcdcde] bg-white shadow-sm">
    <div className="flex items-center justify-between border-b border-[#dcdcde] px-5 py-4"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#646970]">WordPress</p><h2 className="mt-1 text-xl font-semibold text-[#1d2327]">{title}</h2></div><span className="rounded-full bg-[#f0f0f1] px-3 py-1 text-xs font-medium text-[#50575e]">{loading ? "Wird geladen…" : `${items.length} Einträge`}</span></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-[#f6f7f7] text-xs uppercase tracking-[0.1em] text-[#646970]"><tr><th className="px-5 py-3 font-semibold">Titel</th><th className="px-5 py-3 font-semibold">Slug</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Geändert</th><th className="px-5 py-3 font-semibold">Link</th></tr></thead><tbody className="divide-y divide-[#dcdcde]">{items.map((item, index) => { const url = wordpressItemUrl(item); return <tr key={String(item.ID ?? item.id ?? item.slug ?? index)} className="hover:bg-[#f6f7f7]"><td className="px-5 py-4"><div className="font-semibold text-[#2271b1]">{wordpressItemTitle(item)}</div><div className="mt-1 text-xs text-[#646970]">ID {String(item.ID ?? item.id ?? "—")}</div></td><td className="px-5 py-4 text-[#50575e]">/{item.slug ?? "—"}</td><td className="px-5 py-4"><span className="rounded-full bg-[#e7f7ed] px-2.5 py-1 text-xs font-medium text-[#176b37]">{item.status ?? "publish"}</span></td><td className="px-5 py-4 text-[#50575e]">{wordpressDate(item)}</td><td className="px-5 py-4">{url ? <a href={url} target="_blank" rel="noreferrer" className="font-medium text-[#2271b1] hover:underline">Ansehen</a> : <span className="text-[#646970]">—</span>}</td></tr>; })}</tbody></table>{!loading && items.length === 0 && <div className="px-5 py-10 text-center text-sm text-[#646970]">Noch keine WordPress-Inhalte gefunden.</div>}</div>
  </section>;
}

function WordPressMediaGrid({ items, loading }: { items: WordPressContentItem[]; loading: boolean }) {
  return <section className="rounded-2xl border border-[#dcdcde] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#646970]">WordPress</p><h2 className="mt-1 text-xl font-semibold text-[#1d2327]">Medienbibliothek</h2></div><span className="rounded-full bg-[#f0f0f1] px-3 py-1 text-xs font-medium text-[#50575e]">{loading ? "Wird geladen…" : `${items.length} Medien`}</span></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((item, index) => { const image = item.thumbnail ?? item.featured_image ?? wordpressItemUrl(item); return <article key={String(item.ID ?? item.id ?? index)} className="overflow-hidden rounded-xl border border-[#dcdcde] bg-[#f6f7f7]">{image ? <img src={image} alt={wordpressItemTitle(item)} className="aspect-[4/3] w-full object-cover" /> : <div className="grid aspect-[4/3] place-items-center text-xs text-[#646970]">Keine Vorschau</div>}<div className="p-3"><h3 className="truncate text-sm font-semibold text-[#1d2327]">{wordpressItemTitle(item)}</h3><p className="mt-1 text-xs text-[#646970]">{item.mime_type ?? "Medienobjekt"}</p></div></article>; })}</div>{!loading && items.length === 0 && <div className="py-10 text-center text-sm text-[#646970]">Noch keine Medien vorhanden.</div>}</section>;
}

function providerArray(value: unknown, key: string) {
  if (Array.isArray(value)) return value as Array<Record<string, unknown>>;
  if (value && typeof value === "object" && Array.isArray((value as Record<string, unknown>)[key])) return (value as Record<string, unknown>)[key] as Array<Record<string, unknown>>;
  return [];
}

function WebflowDashboard({ content, loading }: { content: WebsiteProviderContent | null; loading: boolean }) {
  const sites = providerArray(content?.sites, "sites");
  const collections = providerArray(content?.collections, "collections");
  const domains = providerArray(content?.customDomains, "customDomains");
  return <section className="space-y-5"><div className="rounded-2xl border border-[#dcdcde] bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#646970]">Webflow</p><h2 className="mt-1 text-xl font-semibold text-[#1d2327]">Webflow-Website verwalten</h2><p className="mt-2 text-sm text-[#50575e]">Verwalte deine Webflow-Site, CMS-Collections und veröffentlichte Domains.</p></div><span className="rounded-full bg-[#e7f7ed] px-3 py-1 text-xs font-medium text-[#176b37]">{loading ? "Wird geladen…" : "Verbunden"}</span></div><div className="mt-5 grid gap-3 md:grid-cols-3"><div className="rounded-xl border border-[#dcdcde] bg-[#f6f7f7] p-4"><p className="text-xs uppercase tracking-[0.1em] text-[#646970]">Site</p><p className="mt-2 text-sm font-semibold text-[#1d2327]">{content?.site.name ?? "Nicht verbunden"}</p><p className="mt-1 truncate text-xs text-[#646970]">{content?.site.externalSiteUrl ?? "Keine Vorschau-URL"}</p></div><div className="rounded-xl border border-[#dcdcde] bg-[#f6f7f7] p-4"><p className="text-xs uppercase tracking-[0.1em] text-[#646970]">Collections</p><p className="mt-2 text-2xl font-semibold text-[#1d2327]">{collections.length}</p><p className="mt-1 text-xs text-[#646970]">CMS-Strukturen im Webflow-Projekt</p></div><div className="rounded-xl border border-[#dcdcde] bg-[#f6f7f7] p-4"><p className="text-xs uppercase tracking-[0.1em] text-[#646970]">Custom Domains</p><p className="mt-2 text-2xl font-semibold text-[#1d2327]">{domains.length}</p><p className="mt-1 text-xs text-[#646970]">Provider-Domains</p></div></div></div><div className="grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-[#dcdcde] bg-white shadow-sm"><div className="border-b border-[#dcdcde] px-5 py-4"><h3 className="font-semibold text-[#1d2327]">Webflow-Sites</h3></div><div className="divide-y divide-[#dcdcde]">{sites.map((site, index) => <div key={String(site.id ?? site._id ?? index)} className="flex items-center justify-between gap-4 px-5 py-4"><div><p className="text-sm font-semibold text-[#2271b1]">{String(site.displayName ?? site.name ?? "Webflow-Site")}</p><p className="mt-1 text-xs text-[#646970]">{String(site.previewUrl ?? site.shortName ?? "Keine Vorschau")}</p></div><span className="text-xs text-[#50575e]">{String(site.lastPublished ?? site.createdOn ?? "Verbunden")}</span></div>)}{!loading && sites.length === 0 && <p className="px-5 py-8 text-sm text-[#646970]">Keine Webflow-Sites gefunden.</p>}</div></div><div className="rounded-2xl border border-[#dcdcde] bg-white shadow-sm"><div className="border-b border-[#dcdcde] px-5 py-4"><h3 className="font-semibold text-[#1d2327]">CMS-Collections</h3></div><div className="divide-y divide-[#dcdcde]">{collections.map((collection, index) => <div key={String(collection.id ?? collection._id ?? index)} className="px-5 py-4"><p className="text-sm font-semibold text-[#2271b1]">{String(collection.displayName ?? collection.name ?? "Unbenannte Collection")}</p><p className="mt-1 text-xs text-[#646970]">{String(collection.slug ?? collection.id ?? "Keine Collection-ID")}</p></div>)}{!loading && collections.length === 0 && <p className="px-5 py-8 text-sm text-[#646970]">Keine CMS-Collections gefunden.</p>}</div></div></div></section>;
}

function DomainsDashboard({ site }: { site: WebsiteSite | null }) {
  return <section className="rounded-2xl border border-[#dcdcde] bg-white shadow-sm"><div className="flex items-center justify-between border-b border-[#dcdcde] px-5 py-4"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#646970]">Website</p><h2 className="mt-1 text-xl font-semibold text-[#1d2327]">Domains verwalten</h2></div><span className="rounded-full bg-[#f0f0f1] px-3 py-1 text-xs font-medium text-[#50575e]">{site?.domains.length ?? 0} Domains</span></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-[#f6f7f7] text-xs uppercase tracking-[0.1em] text-[#646970]"><tr><th className="px-5 py-3 font-semibold">Domain</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Methode</th><th className="px-5 py-3 font-semibold">Verifiziert am</th></tr></thead><tbody className="divide-y divide-[#dcdcde]">{(site?.domains ?? []).map((domain) => <tr key={domain.id} className="hover:bg-[#f6f7f7]"><td className="px-5 py-4 font-semibold text-[#2271b1]">{domain.hostname}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${domain.status === "verified" ? "bg-[#e7f7ed] text-[#176b37]" : "bg-[#fff8e5] text-[#8a6116]"}`}>{domain.status === "verified" ? "Verifiziert" : domain.status}</span></td><td className="px-5 py-4 text-[#50575e]">{domain.verificationMethod === "dns_txt" ? "DNS-TXT" : "DNS-CNAME"}</td><td className="px-5 py-4 text-[#50575e]">{domain.verifiedAt ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(new Date(domain.verifiedAt)) : "Ausstehend"}</td></tr>)}</tbody></table>{(site?.domains ?? []).length === 0 && <div className="px-5 py-10 text-center text-sm text-[#646970]">Noch keine Domain verbunden.</div>}</div></section>;
}

function WebsiteSettingsDashboard({ site }: { site: WebsiteSite | null }) {
  const entries = Object.entries(site?.settings ?? {});
  return <section className="rounded-2xl border border-[#dcdcde] bg-white shadow-sm"><div className="border-b border-[#dcdcde] px-5 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#646970]">Website</p><h2 className="mt-1 text-xl font-semibold text-[#1d2327]">Website-Einstellungen</h2><p className="mt-2 text-sm text-[#50575e]">Provider, Veröffentlichungsregeln und Inhaltspräferenzen deiner Website.</p></div><div className="grid gap-4 p-5 md:grid-cols-3"><div className="rounded-xl border border-[#dcdcde] bg-[#f6f7f7] p-4"><p className="text-xs uppercase tracking-[0.1em] text-[#646970]">Provider</p><p className="mt-2 text-sm font-semibold text-[#1d2327]">{site?.provider === "wordpress" ? "WordPress / Jetpack" : site?.provider === "webflow" ? "Webflow" : "Nicht verbunden"}</p></div><div className="rounded-xl border border-[#dcdcde] bg-[#f6f7f7] p-4"><p className="text-xs uppercase tracking-[0.1em] text-[#646970]">Verbindungsmodus</p><p className="mt-2 text-sm font-semibold text-[#1d2327]">{site?.ownershipMode === "connected" ? "Verbundener Provider" : "Lulu Managed"}</p></div><div className="rounded-xl border border-[#dcdcde] bg-[#f6f7f7] p-4"><p className="text-xs uppercase tracking-[0.1em] text-[#646970]">Status</p><p className="mt-2 text-sm font-semibold text-[#1d2327]">{site?.status ?? "Nicht verbunden"}</p></div></div><div className="border-t border-[#dcdcde] px-5 py-4"><h3 className="font-semibold text-[#1d2327]">Gespeicherte Einstellungen</h3>{entries.length ? <div className="mt-3 divide-y divide-[#dcdcde]">{entries.map(([key, value]) => <div key={key} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"><span className="font-medium text-[#50575e]">{key}</span><span className="text-[#1d2327]">{typeof value === "object" ? JSON.stringify(value) : String(value)}</span></div>)}</div> : <p className="mt-3 text-sm text-[#646970]">Noch keine individuellen Einstellungen gespeichert.</p>}</div></section>;
}

const sectionContent: Record<string, { eyebrow: string; title: string; description: string; cards: Array<{ title: string; text: string }> }> = {
  "wordpress-jetpack-9013": { eyebrow: "WordPress / Jetpack", title: "WordPress-Website verwalten", description: "Verwalte Verbindung, Seiten, Veröffentlichung und den Status deiner WordPress-Website.", cards: [{ title: "Verbindung", text: "Prüfe die verbundene WordPress-Website und starte einen kontrollierten Generierungs- oder Aktualisierungslauf." }, { title: "Website generieren", text: "Erstelle eine kundenabhängige Seitenstruktur und veröffentliche sie erst nach erfolgreicher Prüfung." }, { title: "Veröffentlichung", text: "Kontrolliere veröffentlichte Seiten, URLs und den bestätigten Status direkt über den Provider." }] },
  "webflow-9014": { eyebrow: "Webflow", title: "Webflow-Website verwalten", description: "Verwalte Seiten, CMS-Inhalte und kontrollierte Veröffentlichungen deiner Webflow-Website.", cards: [{ title: "Site-Verbindung", text: "Prüfe die verbundene Webflow-Site und ihre verfügbaren CMS-Collections." }, { title: "CMS-Inhalte", text: "Plane und aktualisiere strukturierte Inhalte für deine Webflow-Collection." }, { title: "Veröffentlichung", text: "Veröffentliche Änderungen erst nach einer bestätigten Provider-Antwort." }] },
  "pages-cms-9015": { eyebrow: "Pages & CMS", title: "Seiten und CMS verwalten", description: "Strukturiere deine Website-Seiten und CMS-Inhalte zentral in Lulu AI.", cards: [{ title: "Seitenstruktur", text: "Ordne Startseite, Unterseiten und Inhalte in einer nachvollziehbaren Hierarchie." }, { title: "Content-Status", text: "Unterscheide Entwürfe, veröffentlichte Inhalte und ausstehende Änderungen." }, { title: "Qualitätsprüfung", text: "Prüfe Inhalte auf fehlende Daten, Platzhalter und unvollständige Abschnitte." }] },
  "posts-9016": { eyebrow: "Posts", title: "Beiträge verwalten", description: "Bereite Beiträge, redaktionelle Inhalte und geplante Veröffentlichungen vor.", cards: [{ title: "Redaktionsplan", text: "Plane Beiträge passend zu Zielgruppe, Positionierung und analysierten Themen." }, { title: "Entwürfe", text: "Halte neue Inhalte zunächst als Entwurf fest und veröffentliche sie bewusst." }, { title: "Performance", text: "Verbinde spätere Analysen mit Themen, Suchsignalen und Conversion-Zielen." }] },
  "media-assets-9017": { eyebrow: "Media & Assets", title: "Medien und Assets verwalten", description: "Ordne Bilder, Dateien und Inhalts-Assets deinen Website-Seiten zu.", cards: [{ title: "Medienbibliothek", text: "Behalte den Überblick über vorhandene und geplante Medienressourcen." }, { title: "Alt-Texte", text: "Bereite zugängliche und suchmaschinenfreundliche Beschreibungen vor." }, { title: "Seitenzuordnung", text: "Ordne Assets den passenden Seiten und Inhaltssektionen zu." }] },
  "domains-9018": { eyebrow: "Domains", title: "Domains verwalten", description: "Prüfe verbundene Domains und den Verifizierungsstatus deiner Website.", cards: [{ title: "Domainstatus", text: "Zeige verbundene Hostnames und ihren aktuellen Verifizierungsstatus." }, { title: "Verifizierung", text: "Starte eine erneute Prüfung, wenn DNS- oder Providerdaten geändert wurden." }, { title: "Sicherheit", text: "Veröffentliche keine Domain als aktiv, solange der Provider sie nicht bestätigt hat." }] },
  "settings-9019": { eyebrow: "Website Settings", title: "Website-Einstellungen", description: "Konfiguriere Website-Standort, Veröffentlichungsregeln und Inhaltspräferenzen.", cards: [{ title: "Veröffentlichungsregeln", text: "Lege fest, wann Lulu Inhalte als Entwurf oder veröffentlicht übertragen darf." }, { title: "Inhaltspräferenzen", text: "Steuere Sprache, Tonalität und die Verwendung verifizierter Workspace-Daten." }, { title: "Sicherheit und Kontrolle", text: "Behalte Provider-Verbindungen, Bestätigungen und Fehlerzustände im Blick." }] },
};

export default function App() {
  const [sectionParam, setSectionParam] = useState(() => new URLSearchParams(window.location.search).get("section") ?? "");
  const sectionLabels: Record<string, string> = {
    "wordpress-jetpack-9013": "WordPress / Jetpack",
    "webflow-9014": "Webflow",
    "pages-cms-9015": "Pages & CMS",
    "posts-9016": "Posts",
    "media-assets-9017": "Media & Assets",
    "domains-9018": "Domains",
    "settings-9019": "Website Settings",
  };
  const initialProvider: Provider = sectionParam.startsWith("webflow") ? "webflow" : "wordpress";
  const [activeSection, setActiveSection] = useState(sectionLabels[sectionParam] ?? "Übersicht");
  const [provider, setProvider] = useState<Provider>(initialProvider);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sites, setSites] = useState<WebsiteSite[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedDomainId, setSelectedDomainId] = useState("");
  const [connectionBusy, setConnectionBusy] = useState<Provider | null>(null);
  const [generationJob, setGenerationJob] = useState<{ siteId: string; job: WebsiteGenerationJob; provider: Provider } | null>(null);
  const [generationStarting, setGenerationStarting] = useState<Provider | null>(null);
  const [generationFailure, setGenerationFailure] = useState<{ provider: Provider; message: string } | null>(null);
  const [wordpressContent, setWordpressContent] = useState<WordPressContent | null>(null);
  const [providerData, setProviderData] = useState<WebsiteProviderContent | null>(null);
  const [wordpressContentLoading, setWordpressContentLoading] = useState(false);
  const [error, setError] = useState("");
  const [oauthHelpVisible, setOauthHelpVisible] = useState(false);
  const autoStartedRef = useRef("");
  const oauthReturnRef = useRef<Provider | null>(null);
  const workspaceId = getSelectedWorkspaceId();
  const content = useMemo(() => providerContent[provider], [provider]);
  const selectedSite = sites.find((site) => site.id === selectedSiteId) ?? sites.find((site) => site.provider === provider);
  const connectedPlatform = platforms.find((platform) => platformMatchesProvider(platform, provider));
  const providerConnected = Boolean(connectedPlatform && platformIsConnected(connectedPlatform));
  const providerAuthorized = Boolean(connectedPlatform && ["pending", "connected", "active", "enabled", "authorized", "connected_with_warning"].includes(connectedPlatform.connectionStatus.toLowerCase()));
  const connected = Boolean(selectedSite && providerConnected && selectedSite.status === "published");
  const t = useTranslation();
  const selectedDomain = selectedSite?.domains.find((domain) => domain.id === selectedDomainId) ?? selectedSite?.domains[0] ?? null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("oauthError");
    const oauthCode = params.get("oauthCode");
    const connectedProvider = params.get("connected");
    const oauthRequestId = params.get("oauthRequestId");
    if (!oauthError && !oauthCode && !connectedProvider) return;
    if (oauthError) {
      const providerLabel = provider === "wordpress" ? "WordPress.com" : "Webflow";
      setError(`${providerLabel}-Verbindung: ${oauthError}${oauthRequestId ? ` (Request-ID: ${oauthRequestId})` : ""}`);
      setOauthHelpVisible(provider === "wordpress");
      setGenerationStarting(null);
      setGenerationJob(null);
      setGenerationFailure({ provider, message: `${provider === "wordpress" ? "WordPress.com" : "Webflow"}-Verbindung fehlgeschlagen: ${oauthError}` });
    } else if (oauthCode || connectedProvider) {
      const returnedProvider: Provider = connectedProvider === "webflow" || provider === "webflow" ? "webflow" : "wordpress";
      oauthReturnRef.current = returnedProvider;
      autoStartedRef.current = "";
      setGenerationJob(null);
      setGenerationFailure(null);
      setGenerationStarting(returnedProvider);
    }
    const cleanUrl = `${window.location.pathname}${window.location.search.replace(/([?&])(oauthCode|oauthError|oauthRequestId|connected)=[^&]*/g, "").replace(/[?&]$/, "")}${window.location.hash}`;
    window.history.replaceState({}, "", cleanUrl);
  }, [provider]);

  useEffect(() => {
    const syncSectionFromUrl = () => {
      const nextSection = new URLSearchParams(window.location.search).get("section") ?? "";
      const nextProvider: Provider = nextSection.startsWith("webflow") ? "webflow" : "wordpress";
      setSectionParam(nextSection);
      setActiveSection(sectionLabels[nextSection] ?? "Übersicht");
      if (nextSection.startsWith("webflow") || nextSection.startsWith("wordpress")) setProvider(nextProvider);
    };
    syncSectionFromUrl();
    window.addEventListener("popstate", syncSectionFromUrl);
    window.addEventListener("lulu:navigate", syncSectionFromUrl);
    // Also listen for standard popstate events from the parent router
    window.parent.addEventListener("popstate", syncSectionFromUrl);
    return () => {
      window.removeEventListener("popstate", syncSectionFromUrl);
      window.removeEventListener("lulu:navigate", syncSectionFromUrl);
      window.parent.removeEventListener("popstate", syncSectionFromUrl);
    };
  }, []);

  useEffect(() => {
    if (!workspaceId) return;
    Promise.all([websitesApi.list(workspaceId), onboardingApi.platforms(workspaceId)]).then(([websiteResponse, platformResponse]) => {
      setSites(websiteResponse.data.items);
      setPlatforms(platformResponse.data.items);
      setSelectedSiteId(websiteResponse.data.items.find((site) => site.provider === provider)?.id ?? websiteResponse.data.items[0]?.id ?? "");
    }).catch((requestError) => setError(getFriendlyErrorMessage(requestError, "Die Websites und Verbindungen konnten nicht geladen werden.")));
  }, [workspaceId, provider]);

  useEffect(() => {
    if (!workspaceId || provider !== "wordpress" || !selectedSiteId) {
      setWordpressContent(null);
      return;
    }
    const selected = sites.find((site) => site.id === selectedSiteId);
    if (!selected?.externalSiteId) {
      setWordpressContent(null);
      return;
    }
    let cancelled = false;
    setWordpressContentLoading(true);
    websitesApi.providerContent(workspaceId, selected.id)
      .then((response) => { if (!cancelled) { setProviderData(response.data); if (response.data.provider === "wordpress") setWordpressContent({ site: { id: response.data.site.id, name: response.data.site.name, url: response.data.site.externalSiteUrl, status: response.data.site.status }, pages: response.data.pages ?? [], posts: response.data.posts ?? [], media: response.data.media ?? [] }); else setWordpressContent(null); } })
      .catch((requestError) => { if (!cancelled) setError(getFriendlyErrorMessage(requestError, "WordPress-Inhalte konnten nicht geladen werden.")); })
      .finally(() => { if (!cancelled) setWordpressContentLoading(false); });
    return () => { cancelled = true; };
  }, [workspaceId, provider, selectedSiteId, sites]);

  const startAutomaticGeneration = async (nextProvider: Provider) => {
    if (!workspaceId) return;
    setError("");
    setGenerationFailure(null);
    setGenerationStarting(nextProvider);
    try {
      const response = await websitesApi.startAutomaticGeneration(workspaceId, nextProvider, document.documentElement.lang || undefined, selectedSiteId || undefined);
      setSites((current) => current.some((site) => site.id === response.data.site.id) ? current.map((site) => site.id === response.data.site.id ? response.data.site : site) : [response.data.site, ...current]);
      setSelectedSiteId(response.data.site.id);
      setGenerationStarting(null);
      setGenerationJob({ siteId: response.data.site.id, job: response.data.job, provider: nextProvider });
    } catch (requestError) {
      const friendly = getFriendlyErrorMessage(requestError, nextProvider === "wordpress" ? "WordPress ist verbunden, aber es wurde noch keine WordPress-Website gefunden." : "Webflow ist verbunden, aber es wurde noch keine CMS-Collection gefunden.");
      const details = requestError instanceof Error && "status" in requestError ? getTechnicalErrorDetails(requestError) : "";
      const message = details && details !== "Code: UNKNOWN_ERROR" ? `${friendly} — ${details}` : friendly;
      setGenerationStarting(null);
      setGenerationFailure({ provider: nextProvider, message });
      setError(message);
      void refresh();
    }
  };

  useEffect(() => {
    const oauthReturn = oauthReturnRef.current === provider;
    if (!workspaceId || !providerAuthorized || !oauthReturn) return;
    const key = `${workspaceId}:${provider}`;
    if (!oauthReturn && autoStartedRef.current === key) return;
    autoStartedRef.current = key;
    oauthReturnRef.current = null;
    void startAutomaticGeneration(provider);
  }, [workspaceId, providerAuthorized, sites, provider]);

  useEffect(() => {
    if (!workspaceId || !generationJob || ["published", "failed", "cancelled"].includes(generationJob.job.status)) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const response = await websitesApi.getGenerationJob(workspaceId, generationJob.siteId, generationJob.job.id);
        if (cancelled) return;
        setGenerationJob((current) => current ? { ...current, job: response.data } : current);
        if (!["published", "failed", "cancelled"].includes(response.data.status)) window.setTimeout(poll, 2000);
        else if (response.data.status === "failed") {
          const message = response.data.errorMessage ?? "Die Website konnte nicht automatisch generiert werden.";
          const failedProvider = generationJob.provider;
          setGenerationFailure({ provider: failedProvider, message });
          setError(message);
          setGenerationJob(null);
          void refresh();
        }
        else if (response.data.status === "published") void refresh();
      } catch (requestError) {
        if (cancelled) return;
        const code = typeof requestError === "object" && requestError !== null && "code" in requestError
          ? String((requestError as { code?: unknown }).code ?? "")
          : "";
        if (["API_TIMEOUT", "NETWORK_ERROR", "SESSION_REFRESH_UNAVAILABLE"].includes(code)) {
          window.setTimeout(poll, 5000);
          return;
        }
        const message = getFriendlyErrorMessage(requestError, "Die Website-Generierung ist fehlgeschlagen. Die Verbindung wurde zurückgesetzt.");
        const failedProvider = generationJob.provider;
        setGenerationJob(null);
        setGenerationFailure({ provider: failedProvider, message });
        setError(message);
      }
    };
    void poll();
    return () => { cancelled = true; };
  }, [workspaceId, generationJob?.siteId, generationJob?.job.id, generationJob?.job.status]);

  const refresh = async () => {
    setIsRefreshing(true);
    setError("");
    if (!workspaceId) {
      setIsRefreshing(false);
      setError("Für diese Aktion ist kein Workspace ausgewählt.");
      return;
    }
    try {
      const [websiteResult, platformResult] = await Promise.allSettled([
        websitesApi.list(workspaceId),
        onboardingApi.platforms(workspaceId),
      ]);
      const errors: unknown[] = [];
      if (websiteResult.status === "fulfilled") setSites(websiteResult.value.data.items);
      else errors.push(websiteResult.reason);
      if (platformResult.status === "fulfilled") setPlatforms(platformResult.value.data.items);
      else errors.push(platformResult.reason);
      if (errors.length > 0) {
        setError(getFriendlyErrorMessage(errors[0], "Die Websites und Verbindungen konnten nicht geladen werden."));
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const connectProvider = async (nextProvider: Provider) => {
    if (!workspaceId) { setError("Für diese Aktion ist kein Workspace ausgewählt."); return; }
    setConnectionBusy(nextProvider);
    setError("");
    try {
      const response = await onboardingApi.startOAuth(workspaceId, nextProvider, undefined, `/app/website?section=${nextProvider === "webflow" ? "webflow-9014" : "wordpress-jetpack-9013"}`);
      window.location.assign(response.data.authorizationUrl);
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError, `${nextProvider === "webflow" ? "Webflow" : "WordPress"} konnte nicht verbunden werden.`));
      setConnectionBusy(null);
    }
  };

  const disconnectProvider = async (nextProvider: Provider) => {
    if (!workspaceId) return;
    const platform = platforms.find((item) => platformMatchesProvider(item, nextProvider));
    if (!platform) return;
    setConnectionBusy(nextProvider);
    setError("");
    try {
      await onboardingApi.deletePlatform(workspaceId, platform.id);
      setPlatforms((current) => current.filter((item) => item.id !== platform.id));
      setSites((current) => current.filter((site) => site.provider !== nextProvider));
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError, `${nextProvider === "webflow" ? "Webflow" : "WordPress"} konnte nicht getrennt werden.`));
    } finally {
      setConnectionBusy(null);
    }
  };


  const changeProvider = (nextProvider: Provider) => {
    setProvider(nextProvider);
    setActiveSection(nextProvider === "webflow" ? "Webflow" : "WordPress / Jetpack");
  };

  const generationStatus = generationJob?.job.status;
  const generationLabel = generationStatus === "published" ? "Website veröffentlicht" : generationStatus === "failed" ? "Generierung fehlgeschlagen" : generationStatus === "publishing" ? "Website wird veröffentlicht" : generationStatus === "preview" ? "Website wird vorbereitet" : "Website wird generiert";
  const generationDetail = generationStatus === "planning" ? "Lulu analysiert die Unternehmensdaten und erstellt die Seitenstruktur." : generationStatus === "preview" ? "Die Inhalte, SEO-Metadaten und Seiten werden für den verbundenen Anbieter vorbereitet." : generationStatus === "publishing" ? "Die generierten Seiten werden jetzt im verbundenen CMS angelegt." : generationStatus === "published" ? "Die Website wurde erfolgreich im verbundenen CMS erstellt." : generationStatus === "failed" ? (generationJob?.job.errorMessage ?? "Bitte prüfe die Verbindung und versuche es erneut.") : "Lulu führt die automatische Website-Erstellung im Hintergrund aus.";

  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground">
      {(error || connectionBusy) && <div role={error ? "alert" : "status"} className="fixed left-1/2 top-4 z-[70] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-2xl" aria-live="polite">{error || `${connectionBusy === "wordpress" ? "WordPress / Jetpack" : "Webflow"} wird verbunden…`}</div>}
      {generationJob && <ViewportPortal><div className="fixed inset-0 z-[1000] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="website-generation-title" style={{ color: "#111827" }} className="my-0 max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 text-[#111827] shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-7"><div className="flex items-start gap-4"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${generationStatus === "failed" ? "bg-destructive/10 text-destructive" : generationStatus === "published" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"}`}>{generationStatus === "failed" || generationStatus === "published" ? <Globe2 size={22} /> : <RefreshCw size={22} className="animate-spin" />}</div><div className="min-w-0"><h2 id="website-generation-title" className="text-lg font-semibold text-[#111827]">{generationLabel}</h2><p className="mt-2 text-sm leading-6 text-[#4b5563]">{generationDetail}</p></div></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary"><div className={`h-full rounded-full transition-all duration-500 ${generationStatus === "failed" ? "w-full bg-destructive" : generationStatus === "published" ? "w-full bg-emerald-500" : generationStatus === "publishing" ? "w-4/5 bg-primary" : generationStatus === "preview" ? "w-3/5 bg-primary" : generationStatus === "planning" ? "w-2/5 bg-primary" : "w-1/5 bg-primary"}`} /></div><div className="mt-5 flex items-center justify-between gap-3 text-xs text-[#4b5563]"><span>{generationJob.provider === "wordpress" ? "WordPress / Jetpack" : "Webflow"}</span><span className="capitalize">{generationStatus}</span></div>{["published", "failed", "cancelled"].includes(generationStatus ?? "") && <button type="button" onClick={() => setGenerationJob(null)} className="mt-6 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-secondary">Schließen</button>}</div></div></ViewportPortal>}
      {generationStarting && !generationJob && <ViewportPortal><div className="fixed inset-0 z-[1000] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="website-generation-start-title" style={{ color: "#111827" }} className="my-0 max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 text-[#111827] shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-7"><div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><RefreshCw size={22} className="animate-spin" /></div><div><h2 id="website-generation-start-title" className="text-lg font-semibold text-[#111827]">Website wird generiert</h2><p className="mt-2 text-sm leading-6 text-[#4b5563]">Die Verbindung wurde bestätigt. Lulu analysiert jetzt deine Unternehmensdaten und erstellt die Website.</p><p className="mt-3 text-xs text-[#4b5563]">{generationStarting === "wordpress" ? "WordPress / Jetpack" : "Webflow"}</p></div></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full w-1/4 animate-pulse rounded-full bg-primary" /></div></div></div></ViewportPortal>}
      {generationFailure && !generationJob && !generationStarting && <ViewportPortal><div className="fixed inset-0 z-[1000] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-sm"><div role="alertdialog" aria-modal="true" style={{ color: "#111827" }} className="my-0 max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-destructive/30 bg-card p-6 text-[#111827] shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-7"><h2 className="text-lg font-semibold text-destructive">Generierung fehlgeschlagen</h2><p className="mt-3 break-words text-sm leading-6 text-[#4b5563]">{generationFailure.message}</p><div className="mt-6 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => { const failedProvider = generationFailure.provider; setGenerationFailure(null); void startAutomaticGeneration(failedProvider); }} className="rounded-lg bg-[#111827] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black">Erneut versuchen</button><button type="button" onClick={() => setGenerationFailure(null)} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-secondary">Schließen</button></div></div></div></ViewportPortal>}

      <main data-lulu-scroll-container className="min-h-screen min-w-0 overflow-x-hidden">
        <div className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8 sm:py-8">
          <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="flex items-start gap-3"><div><p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Lulu AI / Website</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">{sectionContent[sectionParam]?.title ?? "Website"}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#4b5563]">{sectionContent[sectionParam]?.description ?? content.description}</p></div></div>
            <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => void refresh()} disabled={isRefreshing} aria-busy={isRefreshing} className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground transition hover:border-primary/40 disabled:cursor-wait disabled:opacity-60"><RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} /> {isRefreshing ? "Wird aktualisiert…" : "Aktualisieren"}</button><button type="button" className="flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground shadow-lg shadow-black/10"><Plus size={15} /> Neue Seite</button></div>
          </header>

          {provider === "wordpress" && sectionParam === "wordpress-jetpack-9013" && <section className="mb-6 rounded-2xl border border-[#dcdcde] bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#646970]">{t("WordPress")}</p><h2 className="mt-1 text-xl font-semibold text-[#1d2327]">{t("Website generation")}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#50575e]">{t("Choose the connected website and domain, then generate or update the website.")}</p></div><div className="flex flex-wrap gap-2">{!providerAuthorized && <button type="button" disabled={connectionBusy === "wordpress"} onClick={() => void connectProvider("wordpress")} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#2271b1] px-4 text-sm font-semibold text-[#2271b1] transition hover:bg-[#eaf3f8] disabled:cursor-wait disabled:opacity-50"><Globe2 size={15} />{connectionBusy === "wordpress" ? t("Connecting…") : t("Connect")}</button>}<button type="button" disabled={!selectedSite || !providerAuthorized || generationStarting === "wordpress" || Boolean(generationJob)} onClick={() => void startAutomaticGeneration("wordpress")} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2271b1] px-4 text-sm font-semibold text-white transition hover:bg-[#135e96] disabled:cursor-not-allowed disabled:opacity-50"><RefreshCw size={15} className={generationStarting === "wordpress" ? "animate-spin" : ""} />{generationStarting === "wordpress" ? t("Generating…") : generationJob?.provider === "wordpress" ? t("Generation in progress…") : t("Generate website")}</button></div></div><div className="mt-5 grid gap-3 md:grid-cols-2"><label className="flex flex-col gap-1.5 text-xs font-semibold text-[#50575e]"><span>{t("Website")}</span><select value={selectedSiteId} onChange={(event) => { setSelectedSiteId(event.target.value); setSelectedDomainId(""); }} className="h-10 rounded-lg border border-[#dcdcde] bg-white px-3 text-sm font-normal text-[#1d2327] outline-none focus:border-[#2271b1]"><option value="">{t("Select website")}</option>{sites.filter((site) => site.provider === "wordpress").map((site) => <option key={site.id} value={site.id}>{site.name}{site.externalSiteUrl ? ` — ${site.externalSiteUrl}` : ""}</option>)}</select></label><label className="flex flex-col gap-1.5 text-xs font-semibold text-[#50575e]"><span>{t("Domain")}</span><select value={selectedDomain?.id ?? ""} onChange={(event) => setSelectedDomainId(event.target.value)} disabled={!selectedSite || selectedSite.domains.length === 0} className="h-10 rounded-lg border border-[#dcdcde] bg-white px-3 text-sm font-normal text-[#1d2327] outline-none focus:border-[#2271b1] disabled:cursor-not-allowed disabled:bg-[#f6f7f7]"><option value="">{selectedSite?.domains.length ? t("Select domain") : t("No domain available")}</option>{(selectedSite?.domains ?? []).map((domain) => <option key={domain.id} value={domain.id}>{domain.hostname} — {domain.status === "verified" ? t("Verified") : t("Pending verification")}</option>)}</select></label></div>{error && <p role="alert" className="mt-4 break-words text-sm text-red-700">{error}</p>}</section>}

          {!sectionParam && <section className="mb-6 rounded-xl border border-border bg-card p-5 sm:p-6"><div className="flex flex-col gap-2"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Integrationen</p><h2 className="text-lg font-semibold tracking-tight text-foreground">Plattformen später verbinden</h2><p className="max-w-2xl text-sm leading-6 text-[#4b5563]">WordPress/Jetpack und Webflow können jederzeit nach dem Onboarding hinzugefügt, erneut verbunden oder getrennt werden.</p></div><div className="mt-5 grid gap-3 md:grid-cols-2">{providerOptions.map((option) => { const platform = platforms.find((item) => platformMatchesProvider(item, option.id)); const publishedSite = sites.find((site) => site.provider === option.id && site.status === "published"); const isConnected = Boolean(platform && platformIsConnected(platform) && publishedSite); const isBusy = connectionBusy === option.id; return <article key={option.id} className="flex min-w-0 flex-col justify-between gap-4 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center"><div className="flex min-w-0 items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground"><Globe2 size={18} /></span><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-foreground">{option.label}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{isConnected ? `Verbunden${platform?.settings?.accountName ? ` · ${String(platform.settings.accountName)}` : ""}` : platform && ["pending", "error"].includes(platform.connectionStatus.toLowerCase()) ? "Setting up…" : "Noch nicht verbunden"}</p>{platform?.lastError && <p className="mt-1 break-words text-xs text-destructive">{platform.lastError}</p>}</div></div><div className="flex shrink-0 flex-wrap gap-2"><button type="button" disabled={isBusy} onClick={() => isConnected ? void disconnectProvider(option.id) : void connectProvider(option.id)} className={`inline-flex h-9 items-center justify-center rounded-lg px-3 text-xs font-medium transition disabled:cursor-wait disabled:opacity-60 ${isConnected ? "border border-border text-foreground hover:bg-secondary" : "bg-primary text-primary-foreground hover:opacity-90"}`}>{isBusy ? "Bitte warten…" : isConnected ? "Trennen" : "Verbinden"}</button></div>{option.id === "wordpress" && !isConnected && <div className="mt-3 rounded-lg border border-border bg-background/70 p-3 text-xs leading-5 text-muted-foreground"><p>Wenn WordPress.com die Google-Anmeldung nicht initialisieren kann, melde dich dort direkt mit deiner WordPress-E-Mail oder deinem Benutzernamen und Passwort an. Lulu erhält den OAuth-Code erst nach erfolgreicher Anmeldung.</p><div className="mt-2 flex flex-wrap gap-2"><button type="button" className="rounded-md border border-border px-2.5 py-1.5 font-medium text-[#111827] transition hover:bg-secondary" onClick={() => { setOauthHelpVisible(true); void connectProvider("wordpress"); }}>WordPress-Verbindung neu starten</button>{oauthHelpVisible && <span className="self-center">Der neue Start erzeugt einen frischen OAuth-State.</span>}</div></div>}</article>; })}</div>{error && <p role="alert" className="mt-4 break-words text-sm text-destructive">{error}</p>}</section>}

          {!sectionParam && <section className="mb-6 rounded-xl border border-border bg-card px-5 py-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-muted-foreground"><Globe2 size={19} /></span><div><p className="text-sm font-semibold text-foreground">Website-Provider</p><p className="mt-1 text-xs text-[#4b5563]">Wähle die Plattform, die du mit Lulu verwalten möchtest.</p></div></div><label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-muted-foreground sm:min-w-[300px]"><span className="sr-only">Website-Provider auswählen</span><select value={provider} onChange={(event) => changeProvider(event.target.value as Provider)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary/50"><option value="wordpress">WordPress / Jetpack</option><option value="webflow">Webflow</option></select></label></div><div className="mt-4 flex flex-wrap gap-2">{providerOptions.map((option) => <button key={option.id} type="button" onClick={() => changeProvider(option.id)} className={`rounded-lg border px-3 py-2 text-left transition ${provider === option.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/40"}`}><span className="block text-xs font-semibold">{option.label}</span><span className={`mt-0.5 block text-[11px] ${provider === option.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{option.description}</span></button>)}</div></section>}

          {!sectionParam && <section className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-muted-foreground"><Globe2 size={19} /></span><div><p className="text-sm font-semibold text-foreground">{content.shortLabel}-Verwaltung aktiviert</p><p className="mt-1 text-xs text-[#4b5563]">{connected ? `${sites.filter((site) => site.provider === provider).length} Website-Verbindung(en) im Workspace` : `${content.shortLabel} ist aktiviert. ${content.connectDescription}`}</p></div></div><a {...pageLinkProps("fresh-tide-9404")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-secondary">Zu Existing Platforms <ArrowRight size={14} /></a></section>}

          {!sectionParam && <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{content.metrics.map((metric) => <article key={metric.label} className="rounded-xl border border-border bg-card p-4"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{metric.label}</span><metric.icon size={16} className="text-muted-foreground" /></div><strong className="text-2xl font-semibold tracking-tight text-foreground">{metric.label === "Seiten" ? String(selectedSite ? 1 : 0) : metric.value}</strong><p className="mt-1 text-xs text-[#4b5563]">{metric.hint}</p></article>)}</div>}

          {provider === "wordpress" && sectionParam === "wordpress-jetpack-9013" && <div className="space-y-5"><WordPressList title="Seiten" items={wordpressContent?.pages ?? []} loading={wordpressContentLoading} /><WordPressList title="Beiträge" items={wordpressContent?.posts ?? []} loading={wordpressContentLoading} /></div>}
          {provider === "wordpress" && sectionParam === "pages-cms-9015" && <WordPressList title="Seiten und CMS" items={wordpressContent?.pages ?? []} loading={wordpressContentLoading} />}
          {provider === "wordpress" && sectionParam === "posts-9016" && <WordPressList title="Beiträge" items={wordpressContent?.posts ?? []} loading={wordpressContentLoading} />}
          {provider === "wordpress" && sectionParam === "media-assets-9017" && <WordPressMediaGrid items={wordpressContent?.media ?? []} loading={wordpressContentLoading} />}
          {provider === "webflow" && sectionParam === "webflow-9014" && <WebflowDashboard content={providerData} loading={wordpressContentLoading} />}
          {sectionParam === "domains-9018" && <DomainsDashboard site={selectedSite ?? null} />}
          {sectionParam === "settings-9019" && <WebsiteSettingsDashboard site={selectedSite ?? null} />}
          {!(provider === "wordpress" && ["wordpress-jetpack-9013", "pages-cms-9015", "posts-9016", "media-assets-9017"].includes(sectionParam)) && !(provider === "webflow" && sectionParam === "webflow-9014") && !["domains-9018", "settings-9019"].includes(sectionParam) && (() => { const section = sectionContent[sectionParam]; const cards = section?.cards ?? content.actions.map((action) => ({ title: action.title, text: action.description })); return <section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{section?.eyebrow ?? "Website"}</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{section?.title ?? `${activeSection} · ${content.shortLabel}`}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#4b5563]">{section?.description ?? "Wähle einen Website-Unterbereich aus der globalen Navigation."}</p></div><button type="button" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary" aria-label="Website-Einstellungen"><Settings size={17} /></button></div><div className="mb-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Bereich</p><p className="mt-2 text-sm font-semibold text-foreground">{section?.eyebrow ?? content.shortLabel}</p></div><div className="rounded-xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Status</p><p className="mt-2 text-sm font-semibold text-foreground">{selectedSite?.status === "published" ? "Veröffentlicht" : selectedSite ? "Verbunden" : "Nicht verbunden"}</p></div><div className="rounded-xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Nächster Schritt</p><p className="mt-2 text-sm font-semibold text-foreground">{sectionParam.startsWith("wordpress") || sectionParam.startsWith("webflow") ? "Verbindung prüfen" : "Bereich konfigurieren"}</p></div></div><div className="grid gap-3 md:grid-cols-3">{cards.map((card) => <article key={card.title} className="group rounded-xl border border-border bg-background p-4 text-left transition hover:-translate-y-px hover:border-primary/40"><div className="mb-5 flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground group-hover:text-foreground"><ArrowRight size={17} /></span><ArrowRight size={16} className="text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" /></div><h3 className="text-sm font-semibold text-foreground">{card.title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{card.text}</p></article>)}</div></section>; })()}
        </div>
      </main>
    </div>
  );
}
