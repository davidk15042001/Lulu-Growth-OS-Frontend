import { useEffect, useMemo, useState } from "react";
import { clearSelectedWorkspaceId, getSelectedWorkspaceId } from "../../api/session";
import { websitesApi, type WebsiteSite } from "../../api/websites";
import { authApi } from "../../api/auth";
import { getFriendlyErrorMessage } from "../../api/client";
import {
  ArrowRight,
  FileEdit,
  Globe2,
  Image,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  PenLine,
  Plus,
  RefreshCw,
  Search,
  Settings,
  X,
} from "lucide-react";
import { pageLinkProps } from "../../routing";
import { LuluSectionNavigation } from "../fancily-leaf-1766/components/generated/LuluExecutiveDashboard";

type Provider = "wordpress" | "webflow";

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

export default function App() {
  const [mobileNav, setMobileNav] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Übersicht");
  const [provider, setProvider] = useState<Provider>("wordpress");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sites, setSites] = useState<WebsiteSite[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [error, setError] = useState("");
  const workspaceId = getSelectedWorkspaceId();
  const content = useMemo(() => providerContent[provider], [provider]);
  const selectedSite = sites.find((site) => site.id === selectedSiteId) ?? sites.find((site) => site.provider === provider);
  const connected = Boolean(selectedSite);

  useEffect(() => {
    if (!workspaceId) return;
    websitesApi.list(workspaceId).then((response) => {
      setSites(response.data.items);
      setSelectedSiteId(response.data.items.find((site) => site.provider === provider)?.id ?? response.data.items[0]?.id ?? "");
    }).catch((requestError) => setError(getFriendlyErrorMessage(requestError, "Die Websites konnten nicht geladen werden.")));
  }, [workspaceId, provider]);

  const refresh = () => {
    setIsRefreshing(true);
    setError("");
    if (workspaceId) websitesApi.list(workspaceId).then((response) => setSites(response.data.items)).catch((requestError) => setError(getFriendlyErrorMessage(requestError, "Die Websites konnten nicht geladen werden."))).finally(() => setIsRefreshing(false));
    else window.setTimeout(() => setIsRefreshing(false), 800);
  };

  const logout = async () => {
    setAccountMenuOpen(false);
    try { await authApi.logout(); } catch { /* The local session is cleared even if the server is unreachable. */ }
    clearSelectedWorkspaceId();
    window.location.assign("/auth/login");
  };

  const changeProvider = (nextProvider: Provider) => {
    setProvider(nextProvider);
    setActiveSection("Übersicht");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
      <aside className={`${mobileNav ? "flex" : "hidden"} fixed inset-y-0 left-0 z-30 h-dvh min-h-0 w-64 flex-col border-r border-border bg-[var(--sidebar)] p-4 lg:flex`}>
        <div className="mb-8 flex items-center gap-3 px-2 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-black/20">L</div>
          <div><strong className="text-base tracking-tight text-foreground">Lulu AI</strong><p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Growth workspace</p></div>
          <button className="ml-auto rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden" aria-label="Navigation schließen" onClick={() => setMobileNav(false)}><X size={17} /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <LuluSectionNavigation activeId="lulu-website-portal-9012" />
        </div>
        <div className="sticky bottom-0 z-10 relative mt-4 shrink-0 border-t border-border bg-[var(--sidebar)] pt-4">
          <div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-card text-xs font-semibold text-foreground">LU</div><div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">Workspace account</p><p className="text-xs text-muted-foreground">Workspace member</p></div><button type="button" className="ml-auto rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground" aria-label="Account-Menü öffnen" aria-expanded={accountMenuOpen} onClick={() => setAccountMenuOpen((open) => !open)}><MoreHorizontal size={16} /></button></div>
          {accountMenuOpen && <div className="absolute bottom-12 right-0 z-40 w-44 rounded-lg border border-border bg-card p-1 shadow-xl"><button type="button" onClick={() => void logout()} className="w-full rounded-md px-3 py-2 text-left text-xs font-medium text-foreground transition hover:bg-secondary">Abmelden</button></div>}
        </div>
      </aside>
      {mobileNav && <button aria-label="Navigation schließen" className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setMobileNav(false)} />}

      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8 sm:py-8">
          <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="flex items-start gap-3"><button className="mt-1 rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden" aria-label="Navigation öffnen" onClick={() => setMobileNav(true)}><Menu size={20} /></button><div><p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Lulu AI / Website</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">Website</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{content.description}</p></div></div>
            <div className="flex flex-wrap items-center gap-2"><button onClick={refresh} className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground transition hover:border-primary/40"><RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} /> Aktualisieren</button><button type="button" className="flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground shadow-lg shadow-black/10"><Plus size={15} /> Neue Seite</button></div>
          </header>

          <section className="mb-6 rounded-xl border border-border bg-card px-5 py-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-muted-foreground"><Globe2 size={19} /></span><div><p className="text-sm font-semibold text-foreground">Website-Provider</p><p className="mt-1 text-xs text-muted-foreground">Wähle die Plattform, die du mit Lulu verwalten möchtest.</p></div></div><label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-muted-foreground sm:min-w-[300px]"><span className="sr-only">Website-Provider auswählen</span><select value={provider} onChange={(event) => changeProvider(event.target.value as Provider)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary/50"><option value="wordpress">WordPress / Jetpack</option><option value="webflow">Webflow</option></select></label></div><div className="mt-4 flex flex-wrap gap-2">{providerOptions.map((option) => <button key={option.id} type="button" onClick={() => changeProvider(option.id)} className={`rounded-lg border px-3 py-2 text-left transition ${provider === option.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/40"}`}><span className="block text-xs font-semibold">{option.label}</span><span className={`mt-0.5 block text-[11px] ${provider === option.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{option.description}</span></button>)}</div></section>

          <section className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-muted-foreground"><Globe2 size={19} /></span><div><p className="text-sm font-semibold text-foreground">{content.shortLabel}-Verwaltung aktiviert</p><p className="mt-1 text-xs text-muted-foreground">{connected ? `${sites.filter((site) => site.provider === provider).length} Website-Verbindung(en) im Workspace` : `${content.shortLabel} ist aktiviert. ${content.connectDescription}`}</p></div></div><a {...pageLinkProps("fresh-tide-9404")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-secondary">Zu Existing Platforms <ArrowRight size={14} /></a></section>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{content.metrics.map((metric) => <article key={metric.label} className="rounded-xl border border-border bg-card p-4"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{metric.label}</span><metric.icon size={16} className="text-muted-foreground" /></div><strong className="text-2xl font-semibold tracking-tight text-foreground">{metric.label === "Seiten" ? String(selectedSite ? 1 : 0) : metric.value}</strong><p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p></article>)}</div>


          <section><div className="mb-3 flex items-end justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Arbeitsbereich</p><h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{activeSection} · {content.shortLabel}</h2></div><button type="button" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary" aria-label="Website-Einstellungen"><Settings size={17} /></button></div><div className="grid gap-3 md:grid-cols-3">{content.actions.map((action) => <button key={action.title} type="button" className="group rounded-xl border border-border bg-card p-4 text-left transition hover:-translate-y-px hover:border-primary/40"><div className="mb-5 flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground group-hover:text-foreground"><action.icon size={17} /></span><ArrowRight size={16} className="text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" /></div><h3 className="text-sm font-semibold text-foreground">{action.title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{action.description}</p></button>)}</div></section>
        </div>
      </main>
    </div>
  );
}
