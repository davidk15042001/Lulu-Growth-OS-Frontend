import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  Building2,
  CircleAlert,
  CircleCheck,
  Database,
  Gauge,
  Globe2,
  Landmark,
  Megaphone,
  Network,
  RefreshCw,
  Target,
  UsersRound,
} from "lucide-react";
import type { WorkspaceBootstrap } from "../api/types";
import { useLuluApp } from "../api/LuluAppContext";
import { workspaceApi } from "../api/workspaces";
import { listLuluAgentContracts } from "../config/lulu-agent-registry";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";
import { navigateApp, pagePath, routes } from "../routing";
import { QualityOverviewPanel } from "./QualityOverviewPanel";

function currentLocale() {
  return typeof document !== "undefined" && document.documentElement.lang ? document.documentElement.lang : "en";
}

const number = (value: number | null | undefined) => value == null ? "-" : new Intl.NumberFormat(currentLocale()).format(value);
const labelize = (value: string) => value.replace(/[_-]+/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());

function interpolate(template: string, values: Array<string | number>) {
  return values.reduce<string>((result, value, index) => result.replace(`{{${index}}}`, String(value)), template);
}

function timeAgo(value: string) {
  const relative = new Intl.RelativeTimeFormat(currentLocale(), { numeric: "auto" });
  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 0) return relative.format(0, "second");
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return relative.format(0, "second");
  if (minutes < 60) return relative.format(-minutes, "minute");
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return relative.format(-hours, "hour");
  return relative.format(-Math.floor(hours / 24), "day");
}

function EmptyState({ children }: { children: string }) {
  return <div className="lulu-command-empty">{children}</div>;
}

type WorkstreamProps = {
  eyebrow: string;
  title: string;
  detail: string;
  icon: typeof Globe2;
  onOpen: () => void;
};

function Workstream({ eyebrow, title, detail, icon: Icon, onOpen }: WorkstreamProps) {
  return <button type="button" className="lulu-command-workstream" onClick={onOpen}>
    <span className="lulu-command-workstream__icon"><Icon aria-hidden="true" size={18} /></span>
    <span className="lulu-command-workstream__copy">
      <span className="lulu-command-eyebrow">{eyebrow}</span>
      <strong>{title}</strong>
      <small>{detail}</small>
    </span>
    <ArrowUpRight aria-hidden="true" size={18} />
  </button>;
}

export function LiveExecutiveDashboard() {
  const t = useTranslation();
  const { selectedWorkspace, currentUser, bootstrap: appBootstrap, loading: contextLoading } = useLuluApp();
  const [bootstrap, setBootstrap] = useState<WorkspaceBootstrap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!selectedWorkspace) {
      setBootstrap(null);
      setLoading(false);
      return;
    }

    if (contextLoading) return;
    setLoading(true);
    setError("");
    try {
      setBootstrap(appBootstrap?.workspace.id === selectedWorkspace.id
        ? appBootstrap
        : (await workspaceApi.bootstrap(selectedWorkspace.id)).data);
    } catch {
      setError(t("Live workspace data could not be loaded. Refresh the workspace to try again."));
    } finally {
      setLoading(false);
    }
  }, [appBootstrap, contextLoading, selectedWorkspace, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const recordCount = bootstrap?.records.total ?? 0;
  const metricCount = bootstrap?.metrics.length ?? 0;
  const integrationCount = Object.values(bootstrap?.integrations ?? {}).reduce((sum, value) => sum + value, 0);
  const recent = bootstrap?.recentActivity ?? [];
  const healthMetrics = (bootstrap?.metrics ?? []).slice(0, 4);
  const domainEntries = Object.entries(bootstrap?.records.byDomain ?? {}).sort(([, left], [, right]) => right - left);
  const agentCount = useMemo(() => listLuluAgentContracts().length, []);
  const userName = currentUser?.firstName || currentUser?.email?.split("@")[0] || "";
  const isLoading = contextLoading || loading;
  const status = isLoading ? t("Synchronizing") : error ? t("Needs attention") : t("Live workspace");
  const leadActivity = recent[0];
  const operatingBrief = error
    ? t("The latest workspace snapshot could not be verified. Review connections before acting on the operating picture.")
    : recordCount === 0 && metricCount === 0
      ? t("Connect a source or add your first business record to give Lulu a verified operating picture.")
      : leadActivity
        ? interpolate(t("The most recent confirmed activity is {{0}} in {{1}}."), [t(labelize(leadActivity.action)), t(labelize(leadActivity.entityType))])
        : interpolate(t("Lulu has {{0}} verified records and {{1}} tracked metrics ready for review."), [number(recordCount), number(metricCount)]);

  return (
    <main className="lulu-command-center">
      <div className="lulu-command-center__frame">
        <header className="lulu-command-hero">
          <div>
            <p className="lulu-command-eyebrow">{t("Executive control layer")}</p>
            <h1>{t("Run the company from one operating picture.")}</h1>
            <p className="lulu-command-hero__description">
              {t("Welcome back,")} {userName}{t(". Lulu connects verified signals, specialist agents, approvals and growth work without hiding the evidence behind a chat window.")}
            </p>
          </div>
          <div className="lulu-command-hero__actions">
            <button type="button" className="lulu-command-button lulu-command-button--primary" onClick={() => navigateApp(routes.app.growth)}>
              <Target aria-hidden="true" size={17} /> {t("Open growth engine")}
            </button>
            <button type="button" className="lulu-command-button" onClick={() => navigateApp(pagePath("calmly-park-3313"))}>
              <UsersRound aria-hidden="true" size={17} /> {t("Agent workforce")}
            </button>
          </div>
        </header>

        <section className={`lulu-command-status is-${error ? "attention" : isLoading ? "loading" : "live"}`} aria-live="polite">
          <span className="lulu-command-status__signal" aria-hidden="true" />
          <div>
            <strong>{status}</strong>
            <span>{isLoading ? t("Loading the latest workspace state.") : error || t("All visible figures are derived from the current workspace snapshot.")}</span>
          </div>
          <button type="button" className="lulu-command-icon-button" title={t("Refresh workspace data")} aria-label={t("Refresh workspace data")} onClick={() => void load()} disabled={loading}>
            <RefreshCw aria-hidden="true" size={17} className={loading ? "animate-spin" : undefined} />
          </button>
        </section>

        {selectedWorkspace && <QualityOverviewPanel workspaceId={selectedWorkspace.id} />}

        <section className="lulu-command-overview" aria-label={t("Company operating overview")}>
          <article className="lulu-command-brief">
            <div className="lulu-command-panel-heading">
              <span className="lulu-command-panel-icon"><BrainCircuit aria-hidden="true" size={20} /></span>
              <div>
                <p className="lulu-command-eyebrow">{t("Company brief")}</p>
                <h2>{t("What needs an operator's attention")}</h2>
              </div>
            </div>
            <p className="lulu-command-brief__copy">{operatingBrief}</p>
            <div className="lulu-command-brief__footer">
              <span><CircleCheck aria-hidden="true" size={15} /> {t("Evidence-backed workspace state")}</span>
              {leadActivity && <span>{timeAgo(leadActivity.createdAt)}</span>}
            </div>
          </article>

          <article className="lulu-command-workforce">
            <div className="lulu-command-panel-heading">
              <span className="lulu-command-panel-icon"><Network aria-hidden="true" size={20} /></span>
              <div>
                <p className="lulu-command-eyebrow">{t("Digital workforce")}</p>
                <h2>{t("Specialist agent roster")}</h2>
              </div>
            </div>
            <strong className="lulu-command-workforce__count">{number(agentCount)}</strong>
            <p>{t("Registered specialist agents across marketing, CRM, revenue, finance, web and operations.")}</p>
            <button type="button" className="lulu-command-text-button" onClick={() => navigateApp(pagePath("calmly-park-3313"))}>{t("Inspect workforce")} <ArrowUpRight aria-hidden="true" size={16} /></button>
          </article>
        </section>

        <section className="lulu-command-metrics" aria-label={t("Verified workspace signals")}>
          <article><Database aria-hidden="true" size={18} /><span>{t("Verified records")}</span><strong>{number(recordCount)}</strong></article>
          <article><Gauge aria-hidden="true" size={18} /><span>{t("Tracked metrics")}</span><strong>{number(metricCount)}</strong></article>
          <article><Network aria-hidden="true" size={18} /><span>{t("Connected systems")}</span><strong>{number(integrationCount)}</strong></article>
          <article><UsersRound aria-hidden="true" size={18} /><span>{t("Workspace members")}</span><strong>{number(bootstrap?.members.total)}</strong></article>
        </section>

        <section className="lulu-command-section">
          <div className="lulu-command-section__heading">
            <div><p className="lulu-command-eyebrow">{t("Operating domains")}</p><h2>{t("Move from signal to work")}</h2></div>
            <p>{t("Every area opens its existing, permission-scoped workspace.")}</p>
          </div>
          <div className="lulu-command-workstreams">
            <Workstream eyebrow={t("Acquire")} title={t("Growth engine")} detail={t("Campaigns, content, organic growth and paid acquisition.")} icon={Megaphone} onOpen={() => navigateApp(routes.app.growth)} />
            <Workstream eyebrow={t("Own")} title={t("Website and commerce")} detail={t("Site, SEO, storefront and conversion surface.")} icon={Globe2} onOpen={() => navigateApp(routes.app.onlinePresence)} />
            <Workstream eyebrow={t("Remember")} title={t("Company Brain")} detail={t("Shared knowledge, decisions and operating context.")} icon={BrainCircuit} onOpen={() => navigateApp(routes.app.knowledgeBase)} />
            <Workstream eyebrow={t("Control")} title={t("Finance and risk")} detail={t("Cash, approvals, financial records and controls.")} icon={Landmark} onOpen={() => navigateApp(routes.app.finance)} />
          </div>
        </section>

        <div className="lulu-command-data-grid">
          <section className="lulu-command-section lulu-command-section--data">
            <div className="lulu-command-section__heading">
              <div><p className="lulu-command-eyebrow">{t("Live measurement")}</p><h2>{t("Business health")}</h2></div>
              <Gauge aria-hidden="true" size={20} />
            </div>
            {healthMetrics.length === 0 ? <EmptyState>{t("No verified health metrics are configured yet.")}</EmptyState> : (
              <div className="lulu-command-health-grid">
                {healthMetrics.map((metric) => <article key={metric.id}><span>{metric.name}</span><strong>{metric.value ?? "-"}<small>{metric.unit}</small></strong><em>{labelize(metric.domain)}</em></article>)}
              </div>
            )}
          </section>

          <section className="lulu-command-section lulu-command-section--data">
            <div className="lulu-command-section__heading">
              <div><p className="lulu-command-eyebrow">{t("Data coverage")}</p><h2>{t("Operating footprint")}</h2></div>
              <Building2 aria-hidden="true" size={20} />
            </div>
            {domainEntries.length === 0 ? <EmptyState>{t("No business domains have reported records yet.")}</EmptyState> : (
              <div className="lulu-command-domain-list">
                {domainEntries.slice(0, 5).map(([domain, count]) => <div key={domain}><span>{labelize(domain)}</span><span className="lulu-command-domain-list__bar"><i style={{ width: `${recordCount > 0 ? Math.min(100, (count / recordCount) * 100) : 0}%` }} /></span><strong>{number(count)}</strong></div>)}
              </div>
            )}
          </section>
        </div>

        <section className="lulu-command-section lulu-command-section--activity">
          <div className="lulu-command-section__heading">
            <div><p className="lulu-command-eyebrow">{t("Evidence trail")}</p><h2>{t("Recent workspace activity")}</h2></div>
            <Activity aria-hidden="true" size={20} />
          </div>
          {recent.length === 0 ? <EmptyState>{t("No recent workspace activity has been recorded.")}</EmptyState> : (
            <div className="lulu-command-activity-list">
              {recent.slice(0, 6).map((item) => <div key={item.id}><span className="lulu-command-activity-list__icon"><Activity aria-hidden="true" size={15} /></span><p><strong>{labelize(item.action)}</strong><span>{labelize(item.entityType)}</span></p><time dateTime={item.createdAt}>{timeAgo(item.createdAt)}</time></div>)}
            </div>
          )}
        </section>

        {error && <div className="lulu-command-error" role="alert"><CircleAlert aria-hidden="true" size={18} /> {error}</div>}
      </div>
    </main>
  );
}
