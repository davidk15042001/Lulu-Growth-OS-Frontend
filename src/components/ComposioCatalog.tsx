import { ChevronDown, ChevronUp, Link2, LoaderCircle, Search, Wrench } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { getFriendlyErrorMessage } from "../api/client";
import { composioApi, type ComposioIntegrationTeam, type ComposioTool, type ComposioToolkit } from "../api/composio";
import { LiveEmpty, LiveSection } from "../api/live-panel-ui";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";

type PendingConnection = { toolkit: string; connectionId: string; startedAt: string };
type TeamToolsState = { status: "loading" | "ready" | "error"; items: ComposioTool[]; total: number; truncated: boolean; error?: string };

function teamStatusLabel(status: string, t: (key: string) => string) {
  const labels: Record<string, string> = {
    CONNECTING: "Connection in progress",
    PROVISIONING: "Finalizing connection",
    ACTIVE: "Ready to use",
    CONNECTED: "Connected, verification pending",
    REAUTH_REQUIRED: "Reconnect required",
    DEGRADED: "Needs attention",
    DISCONNECTED: "Disconnected",
    SUSPENDED: "Paused",
    ARCHIVED: "Archived",
    NOT_CONNECTED: "Not connected",
  };
  return t(labels[status] ?? status);
}

function teamStatusDescription(status: string, t: (key: string) => string) {
  const descriptions: Record<string, string> = {
    CONNECTING: "The provider authorization window is still open.",
    PROVISIONING: "Lulu is checking the provider result before enabling this integration.",
    ACTIVE: "This workspace-scoped integration is ready for bounded work.",
    CONNECTED: "The account is connected, but final readiness has not been confirmed yet.",
    REAUTH_REQUIRED: "The provider needs a fresh authorization before work can continue.",
    DEGRADED: "The integration is connected but needs attention before reliable use.",
    DISCONNECTED: "No active workspace connection is available. You can reconnect it.",
    SUSPENDED: "External tool execution is paused until you resume this team.",
  };
  return t(descriptions[status] ?? "The integration status is being reconciled.");
}

const teamStatusPriority: Record<string, number> = {
  ACTIVE: 0,
  CONNECTED: 1,
  PROVISIONING: 2,
  CONNECTING: 3,
  DEGRADED: 4,
  REAUTH_REQUIRED: 5,
  SUSPENDED: 6,
  DISCONNECTED: 7,
  ARCHIVED: 8,
  NOT_CONNECTED: 9,
};

function isSuspendableTeamStatus(status: string) {
  return ["ACTIVE", "CONNECTED", "PROVISIONING", "CONNECTING", "DEGRADED"].includes(status);
}

type ComposioCatalogProps = {
  workspaceId: string;
  canConnect?: boolean;
  canManageTeams?: boolean;
};

export function ComposioCatalog({ workspaceId, canConnect = false, canManageTeams = false }: ComposioCatalogProps) {
  const t = useTranslation();
  const [toolkits, setToolkits] = useState<ComposioToolkit[]>([]);
  const [teams, setTeams] = useState<ComposioIntegrationTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [connectUrl, setConnectUrl] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingConnection, setPendingConnection] = useState<PendingConnection | null>(null);
  const [busyToolkit, setBusyToolkit] = useState<string | null>(null);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [teamTools, setTeamTools] = useState<Record<string, TeamToolsState>>({});
  const pendingPopupRef = useRef<{ pending: PendingConnection; pollTimer: number; timeoutTimer: number } | null>(null);
  const settlingConnectionRef = useRef<string | null>(null);

  function toolkitStatus(toolkit: ComposioToolkit) {
    if (toolkit.isNoAuth) return t("Available");
    if (toolkit.connected) return t("Connected");
    const status = (toolkit.connectionStatus ?? "").toUpperCase();
    if (["INITIATED", "INITIALIZING", "CONNECTING", "PENDING", "PROVISIONING"].includes(status)) return t("Connection in progress");
    if (["FAILED", "INACTIVE", "EXPIRED", "REVOKED", "CANCELED", "CANCELLED"].includes(status)) return t("Ready to retry");
    return t("Not connected");
  }

  const loadTeams = useCallback(async () => {
    try {
      const items = (await composioApi.teams(workspaceId, { limit: 100 })).data.items;
      setTeams([...items].sort((left, right) => (teamStatusPriority[left.status] ?? 99) - (teamStatusPriority[right.status] ?? 99)));
    }
    catch { setTeams([]); }
  }, [workspaceId]);

  const loadToolkits = useCallback(async (query: string, pageCursor: string | null) => {
    setLoading(true); setError("");
    try {
      const response = await composioApi.toolkits(workspaceId, { search: query, cursor: pageCursor });
      setToolkits((current) => {
        if (!pageCursor) return response.data.items;
        const known = new Set(current.map((toolkit) => toolkit.slug));
        return [...current, ...response.data.items.filter((toolkit) => !known.has(toolkit.slug))];
      });
      setCursor(response.data.nextCursor);
      setHasMore(Boolean(response.data.nextCursor));
    } catch (cause) {
      if (!pageCursor) setToolkits([]);
      setError(getFriendlyErrorMessage(cause, "Composio apps could not be loaded."));
    } finally { setLoading(false); }
  }, [workspaceId]);

  useEffect(() => { void loadToolkits("", null); }, [loadToolkits]);
  useEffect(() => { void loadTeams(); }, [loadTeams]);
  useEffect(() => { setExpandedTeamId(null); setTeamTools({}); }, [workspaceId]);

  async function toggleTeamTools(team: ComposioIntegrationTeam) {
    if (expandedTeamId === team.id) {
      setExpandedTeamId(null);
      return;
    }
    setExpandedTeamId(team.id);
    const existing = teamTools[team.id];
    if (existing?.status === "ready" || existing?.status === "loading") return;
    setTeamTools((current) => ({ ...current, [team.id]: { status: "loading", items: [], total: 0, truncated: false } }));
    try {
      const response = await composioApi.tools(workspaceId, team.composioToolkit);
      setTeamTools((current) => ({
        ...current,
        [team.id]: {
          status: "ready",
          items: response.data.items.slice(0, 16),
          total: response.data.total,
          truncated: response.data.truncated || response.data.items.length > 16,
        },
      }));
    } catch (cause) {
      setTeamTools((current) => ({ ...current, [team.id]: { status: "error", items: [], total: 0, truncated: false, error: getFriendlyErrorMessage(cause, "Available Composio tools could not be loaded.") } }));
    }
  }

  async function submitSearch(event: FormEvent) {
    event.preventDefault();
    await loadToolkits(search.trim(), null);
  }

  async function connect(toolkit: ComposioToolkit) {
    setBusyToolkit(toolkit.slug); setError(""); setNotice(""); setConnectUrl("");
    try {
      const response = await composioApi.authorize(workspaceId, toolkit.slug);
      setConnectUrl(response.data.redirectUrl);
      // `noopener` deliberately makes window.open return no handle. The inline
      // link is the reliable fallback when a browser blocks an async popup.
      window.open(response.data.redirectUrl, "_blank", "noopener,noreferrer");
      const pending: PendingConnection = { toolkit: toolkit.slug, connectionId: response.data.connectedAccountId, startedAt: new Date().toISOString() };
      const pollTimer = window.setInterval(async () => {
        try {
          const [toolkitResponse, teamsResponse] = await Promise.all([
            composioApi.toolkits(workspaceId, { search: toolkit.slug }),
            composioApi.teams(workspaceId, { limit: 100 }),
          ]);
          const currentToolkit = toolkitResponse.data.items.find((item) => item.slug === toolkit.slug);
          const currentTeam = teamsResponse.data.items.find((item) => item.composioToolkit === toolkit.slug && item.composioConnectionId === pending.connectionId);
          if (currentToolkit?.connected || currentTeam?.status === "ACTIVE") void settleAuthorization(pending, false);
        } catch {
          // The popup remains the source of truth while the provider is working.
        }
      }, 2_000);
      const timeoutTimer = window.setTimeout(() => void settleAuthorization(pending, true), 10 * 60 * 1_000);
      pendingPopupRef.current = { pending, pollTimer, timeoutTimer };
      setPendingConnection(pending);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not start this Composio connection."));
    } finally { setBusyToolkit(null); }
  }

  const settleAuthorization = useCallback(async (pending: PendingConnection, closed: boolean) => {
    if (settlingConnectionRef.current === pending.connectionId) return;
    settlingConnectionRef.current = pending.connectionId;
    const active = pendingPopupRef.current;
    if (active && active.pending.connectionId === pending.connectionId) {
      window.clearInterval(active.pollTimer);
      window.clearTimeout(active.timeoutTimer);
      pendingPopupRef.current = null;
    }
    setPendingConnection(null);
    try {
      const result = await composioApi.cancelAuthorization(workspaceId, pending.toolkit, pending.connectionId);
      setConnectUrl("");
      await Promise.all([loadToolkits(search.trim(), null), loadTeams()]);
      if (result.data.status === "ACTIVE") {
        setNotice("Connection completed and is ready for use.");
      } else if (closed || result.data.canceled) {
        setNotice("Connection canceled and cleaned up. No active workspace connection was created.");
      }
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "The connection could not be closed cleanly. Refresh the integrations list to reconcile its status."));
    } finally {
      settlingConnectionRef.current = null;
    }
  }, [loadTeams, loadToolkits, search, workspaceId]);

  useEffect(() => () => {
    const pending = pendingPopupRef.current;
    if (pending) {
      window.clearInterval(pending.pollTimer);
      window.clearTimeout(pending.timeoutTimer);
    }
  }, []);

  return <div className="lulu-composio-catalog">
    {teams.length > 0 && <LiveSection title={t("Integration teams")} action={<span className="lulu-live-message">{t("Every team is workspace-scoped and can be paused before external tool execution.")}</span>}>
      {teams.map((team) => {
        const tools = teamTools[team.id];
        const expanded = expandedTeamId === team.id;
        return <article className="lulu-live-row" key={team.id}>
          <div className="lulu-live-row-top"><div><strong>{team.teamName}</strong><span>{team.composioToolkit} · {team.mission}</span></div><span className={`lulu-live-badge ${team.status === "ACTIVE" ? "good" : ""}`}>{teamStatusLabel(team.status, t)}</span></div>
          <small>{teamStatusDescription(team.status, t)}{team.lastProviderStatus ? ` · provider ${team.lastProviderStatus}` : ""}</small>
          <div className="lulu-live-actions" style={{ marginTop: 8 }}>
            <button className="lulu-live-button" type="button" disabled={tools?.status === "loading"} onClick={() => void toggleTeamTools(team)}><Wrench size={14} />{expanded ? <><ChevronUp size={14} />{t("Hide available tools")}</> : <><ChevronDown size={14} />{t("Inspect available tools")}</>}</button>
            {canManageTeams && (team.status === "SUSPENDED" || isSuspendableTeamStatus(team.status)) ? team.status === "SUSPENDED" ? <button className="lulu-live-button" type="button" onClick={async () => { await composioApi.resumeTeam(workspaceId, team.id); await loadTeams(); }}>{t("Resume")}</button> : <button className="lulu-live-button danger" type="button" onClick={async () => { await composioApi.suspendTeam(workspaceId, team.id); await loadTeams(); }}>{t("Suspend")}</button> : null}
          </div>
          {!canManageTeams ? <p className="lulu-live-message" style={{ marginTop: 8 }}>{t("Your workspace role can view this team, but cannot pause or resume external execution.")}</p> : null}
          {expanded ? <div className="lulu-composio-tool-inspector" style={{ marginTop: 12, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            <div className="lulu-live-row-top"><div><strong>{t("Verified tool surface")}</strong><span>{team.allowedCapabilities.length ? team.allowedCapabilities.join(" · ") : t("No additional capabilities are declared")}</span></div><span className="lulu-live-badge">{tools?.status === "ready" ? `${tools.total} ${t("tools")}` : t("Loading")}</span></div>
            {tools?.status === "loading" ? <p className="lulu-live-message" role="status"><LoaderCircle size={14} className="animate-spin" /> {t("Loading available tools…")}</p> : null}
            {tools?.status === "error" ? <p className="lulu-live-error" role="alert">{tools.error}</p> : null}
            {tools?.status === "ready" ? <>{tools.items.length ? <div className="lulu-composio-tool-list" style={{ display: "grid", gap: 8, marginTop: 10 }}>{tools.items.map((tool) => <div key={tool.slug} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "8px 10px" }}><strong style={{ display: "block", fontSize: 12 }}>{tool.name}</strong><span style={{ display: "block", marginTop: 2, fontSize: 11, color: "var(--muted-foreground)" }}>{tool.slug}</span>{tool.description ? <small style={{ display: "block", marginTop: 4 }}>{tool.description}</small> : null}</div>)}</div> : <p className="lulu-live-message">{t("No verified tools are available for this integration.")}</p>}{tools.truncated ? <p className="lulu-live-message" style={{ marginTop: 8 }}>{t("Only the first tools are shown here; execution remains restricted to the selected integration team.")}</p> : null}</> : null}
          </div> : null}
        </article>;
      })}
    </LiveSection>}
    <LiveSection title={t("Available integrations")} action={<span className="lulu-live-message">{t("Tool calls are deducted automatically from the AI wallet. Platform admins with billing.bypass are exempt.")}</span>}>
    <p className="lulu-live-message">{t("Connect an approved app for this workspace. Technical tool details and provider credentials stay protected by Lulu.")}</p>
    {!canConnect ? <p className="lulu-live-message">{t("You can view available apps, but your workspace role does not allow new connections.")}</p> : null}
    {error ? <div className="lulu-live-error">{error}</div> : null}
    {notice ? <p className="lulu-live-message lulu-live-message--success">{notice}</p> : null}
    {connectUrl ? <p className="lulu-live-message">{t("Connection in progress.")} <a href={connectUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "underline", fontWeight: 700 }}>{t("Open the Composio connection page")}</a>{t(", then finish or cancel it there.")}{pendingConnection && canConnect ? <button className="lulu-live-button" type="button" onClick={() => void settleAuthorization(pendingConnection, false)} style={{ marginLeft: 8 }}>{t("Cancel and clean up")}</button> : null}</p> : null}
    <form className="lulu-live-form lulu-live-search-form" onSubmit={(event) => void submitSearch(event)}>
      <label><span>{t("Search Composio apps")}</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("Search by app name or toolkit")} /></label>
      <button className="lulu-live-button" type="submit" disabled={loading}><Search size={15} />{t("Search")}</button>
    </form>
    {loading && toolkits.length === 0 ? <LiveEmpty>{t("Loading available integrations…")}</LiveEmpty> : toolkits.length === 0 ? <LiveEmpty>{t("No approved integrations match this search.")}</LiveEmpty> : toolkits.map((toolkit) => <article className="lulu-live-row" key={toolkit.slug}>
      <div className="lulu-live-row-top"><div><strong>{toolkit.name}</strong><span>{toolkit.isNoAuth ? t("No sign-in required") : t("Secure account connection")}</span></div><span className={`lulu-live-badge ${toolkit.connected ? "good" : ""}`}>{toolkitStatus(toolkit)}</span></div>
      <div className="lulu-live-actions" style={{ marginTop: 8 }}><button className="lulu-live-button primary" disabled={!canConnect || busyToolkit !== null || toolkit.isNoAuth || toolkit.connected} onClick={() => void connect(toolkit)}><Link2 size={15} />{toolkit.connected ? t("Connected") : toolkit.isNoAuth ? t("Available") : !canConnect ? t("View only") : t("Connect")}</button></div>
    </article>)}
    {hasMore ? <button className="lulu-live-button" type="button" disabled={loading} onClick={() => void loadToolkits(search.trim(), cursor)}>{t("Load more apps")}</button> : null}
    </LiveSection>
  </div>;
}
