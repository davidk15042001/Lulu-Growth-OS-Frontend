import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { onboardingApi, type Platform } from "../onboarding";
import { getFriendlyErrorMessage } from "../client";
import { composioApi, type ComposioTool, type ComposioToolkit } from "../composio";
import { workspaceAppApi } from "../workspace-app";
import { providerControlApi, type ProviderConnection, type ProviderContractCheck, type ProviderLaunchReadiness } from "../providers";
import { LiveEmpty, LiveError, LivePanelShell, LiveSection, formatLiveDate } from "../live-panel-ui";

type ComposioToolState = {
  items: ComposioTool[];
  loading: boolean;
  error: string;
  truncated: boolean;
};

export function IntegrationsPanel({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [providerConnections, setProviderConnections] = useState<ProviderConnection[]>([]);
  const [contractChecks, setContractChecks] = useState<Record<string, ProviderContractCheck | undefined>>({});
  const [launchReadiness, setLaunchReadiness] = useState<ProviderLaunchReadiness | null>(null);
  const [composioToolkits, setComposioToolkits] = useState<ComposioToolkit[]>([]);
  const [composioLoading, setComposioLoading] = useState(false);
  const [composioError, setComposioError] = useState("");
  const [composioSearch, setComposioSearch] = useState("");
  const [composioToolkitCursor, setComposioToolkitCursor] = useState<string | null>(null);
  const [composioToolkitHasMore, setComposioToolkitHasMore] = useState(false);
  const [expandedComposioToolkit, setExpandedComposioToolkit] = useState<string | null>(null);
  const [composioTools, setComposioTools] = useState<Record<string, ComposioToolState>>({});
  const [composioConnectUrl, setComposioConnectUrl] = useState("");
  const [draft, setDraft] = useState({ name: "", category: "other", integrationKey: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setBusy(true); setError("");
    try {
      const [legacy, controlPlane, readiness] = await Promise.all([
        onboardingApi.platforms(workspaceId),
        providerControlApi.connections(workspaceId),
        providerControlApi.launchReadiness(workspaceId),
      ]);
      setPlatforms(legacy.data.items);
      setProviderConnections(controlPlane.data.connections);
      setLaunchReadiness(readiness.data);
      const histories = await Promise.all(controlPlane.data.connections.map(async (connection) => {
        try { return [connection.id, (await providerControlApi.contractChecks(workspaceId, connection.id, 1)).data.checks[0]] as const; }
        catch { return [connection.id, undefined] as const; }
      }));
      setContractChecks(Object.fromEntries(histories));
    }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not load your integrations. Please try again.")); }
    finally { setBusy(false); }
  }, [workspaceId]);

  const loadComposio = useCallback(async (search: string, cursor: string | null) => {
    setComposioLoading(true); setComposioError("");
    try {
      const response = await composioApi.toolkits(workspaceId, { search, cursor });
      setComposioToolkits((current) => {
        if (!cursor) return response.data.items;
        const known = new Set(current.map((toolkit) => toolkit.slug));
        return [...current, ...response.data.items.filter((toolkit) => !known.has(toolkit.slug))];
      });
      setComposioToolkitCursor(response.data.nextCursor);
      setComposioToolkitHasMore(Boolean(response.data.nextCursor));
      if (!cursor) {
        setExpandedComposioToolkit(null);
        setComposioTools({});
      }
    } catch (cause) {
      if (!cursor) setComposioToolkits([]);
      setComposioError(getFriendlyErrorMessage(cause, "Composio apps could not be loaded."));
    } finally { setComposioLoading(false); }
  }, [workspaceId]);

  useEffect(() => { void load(); void loadComposio("", null); }, [load, loadComposio]);

  async function searchComposio(event: FormEvent) {
    event.preventDefault();
    await loadComposio(composioSearch.trim(), null);
  }

  async function toggleComposioToolkit(toolkit: ComposioToolkit) {
    if (expandedComposioToolkit === toolkit.slug) {
      setExpandedComposioToolkit(null);
      return;
    }
    setExpandedComposioToolkit(toolkit.slug);
    if (composioTools[toolkit.slug]) return;
    setComposioTools((current) => ({
      ...current,
      [toolkit.slug]: { items: [], loading: true, error: "", truncated: false },
    }));
    try {
      const response = await composioApi.tools(workspaceId, toolkit.slug);
      setComposioTools((current) => ({
        ...current,
        [toolkit.slug]: { items: response.data.items, loading: false, error: "", truncated: response.data.truncated },
      }));
    } catch (cause) {
      setComposioTools((current) => ({
        ...current,
        [toolkit.slug]: { items: [], loading: false, error: getFriendlyErrorMessage(cause, "The tools for this app could not be loaded."), truncated: false },
      }));
    }
  }

  async function create(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await onboardingApi.createPlatform(workspaceId, { name: draft.name.trim(), category: draft.category.trim(), integrationKey: draft.integrationKey.trim() || null, connectionStatus: "disconnected" });
      setDraft({ name: "", category: "other", integrationKey: "" }); await load();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not add this integration. Please try again.")); setBusy(false); }
  }

  async function updateStatus(platform: Platform, connectionStatus: string) {
    setBusy(true); setError("");
    try { await onboardingApi.updatePlatform(workspaceId, platform.id, { connectionStatus }); await load(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not change this integration. Please try again.")); setBusy(false); }
  }

  async function verifyProvider(connectionId: string) {
    setBusy(true); setError("");
    try { await providerControlApi.verify(workspaceId, connectionId); await load(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not verify this provider connection.")); setBusy(false); }
  }

  async function contractCheck(connectionId: string) {
    setBusy(true); setError("");
    try {
      const result = await providerControlApi.contractCheck(workspaceId, connectionId);
      setContractChecks((current) => ({ ...current, [connectionId]: result.data }));
      await load();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "The provider contract check could not be completed.")); setBusy(false); }
  }

  async function updateProviderMode(connection: ProviderConnection, mode: ProviderConnection["mode"]) {
    setBusy(true); setError("");
    try { await providerControlApi.changeMode(workspaceId, connection.id, mode); await load(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not update the provider mode.")); setBusy(false); }
  }

  async function syncProvider(connectionId: string) {
    setBusy(true); setError("");
    try { await providerControlApi.sync(workspaceId, connectionId); await load(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not queue the provider sync.")); setBusy(false); }
  }

  async function disconnectProvider(connectionId: string, displayName: string) {
    if (!window.confirm(`Disconnect ${displayName}? Existing records remain available, but provider operations stop.`)) return;
    setBusy(true); setError("");
    try { await providerControlApi.disconnect(workspaceId, connectionId); await load(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not disconnect this provider.")); setBusy(false); }
  }

  async function connect(platform: Platform) {
    const provider = platform.integrationKey?.trim();
    if (!provider) { setError("CONNECT_PROVIDER_MISSING: Add the provider integration key before connecting this integration."); return; }
    setBusy(true); setError("");
    try {
      const response = await onboardingApi.startOAuth(workspaceId, provider);
      if (!response.data.authorizationUrl) throw new Error("CONNECT_AUTHORIZATION_URL_MISSING: The provider did not return an authorization URL.");
      window.location.assign(response.data.authorizationUrl);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not start the provider connection. Check the integration key and provider configuration.")); setBusy(false); }
  }

  async function authorizeComposioToolkit(toolkit: ComposioToolkit) {
    setBusy(true); setError(""); setComposioConnectUrl("");
    try {
      const response = await composioApi.authorize(workspaceId, toolkit.slug);
      setComposioConnectUrl(response.data.redirectUrl);
      const opened = window.open(response.data.redirectUrl, "_blank", "noopener,noreferrer");
      if (!opened) setError("The connection page was blocked by the browser. Use the link shown below to continue.");
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not start this Composio connection.")); }
    finally { setBusy(false); }
  }

  async function disconnect(platform: Platform) {
    if (!window.confirm(`Disconnect ${platform.name}? Existing records will remain available, but synchronization will stop.`)) return;
    await updateStatus(platform, "disconnected");
  }

  async function remove(platform: Platform) {
    if (!window.confirm(`Remove ${platform.name} from this workspace?`)) return;
    setBusy(true); setError("");
    try { await onboardingApi.deletePlatform(workspaceId, platform.id); await load(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not remove this integration. No data was deleted.")); setBusy(false); }
  }

  return <LivePanelShell title="Live integrations" subtitle="Connections and synchronization jobs" onClose={onClose}>
    <LiveError message={error} />
    <LiveSection title={`Composio catalog${composioToolkitHasMore ? " · more available" : ""}`} action={<span className="lulu-live-message">Tool calls are deducted automatically from the AI wallet. Platform admins with billing.bypass are exempt.</span>}>
      <p className="lulu-live-message">Browse every available toolkit and expand an app to see its individual actions. Connected credentials stay with Composio.</p>
      {composioError ? <div className="lulu-live-error">{composioError}</div> : null}
      {composioConnectUrl ? <p className="lulu-live-message">Connection started. <a href={composioConnectUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "underline", fontWeight: 700 }}>Open the Composio connection page</a>, then refresh this panel.</p> : null}
      <form className="lulu-live-form" onSubmit={(event) => void searchComposio(event)}>
        <label><span>Search Composio apps</span><input value={composioSearch} onChange={(event) => setComposioSearch(event.target.value)} placeholder="Search by app name or toolkit" /></label>
        <button className="lulu-live-button" type="submit" disabled={composioLoading}><Search size={15} />Search</button>
      </form>
      {composioLoading && composioToolkits.length === 0 ? <LiveEmpty>Loading Composio apps…</LiveEmpty> : composioToolkits.length === 0 ? <LiveEmpty>No Composio apps match this search.</LiveEmpty> : composioToolkits.map((toolkit) => {
        const expanded = expandedComposioToolkit === toolkit.slug;
        const toolState = composioTools[toolkit.slug];
        return <article className="lulu-live-row" key={toolkit.slug}>
          <div className="lulu-live-row-top"><div><strong>{toolkit.name}</strong><span>{toolkit.slug}{toolState ? ` · ${toolState.items.length}${toolState.truncated ? "+" : ""} tools` : " · tools available"}</span></div><span className={`lulu-live-badge ${toolkit.connected ? "good" : ""}`}>{toolkit.isNoAuth ? "No sign-in required" : toolkit.connected ? "Connected" : toolkit.connectionStatus ?? "Not connected"}</span></div>
          <div className="lulu-live-actions" style={{ marginTop: 8 }}>
            <button className="lulu-live-button" type="button" aria-expanded={expanded} onClick={() => void toggleComposioToolkit(toolkit)}>{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}{expanded ? "Hide tools" : "Show tools"}</button>
            <button className="lulu-live-button primary" disabled={busy || toolkit.isNoAuth || toolkit.connected} onClick={() => void authorizeComposioToolkit(toolkit)}>{toolkit.connected ? "Connected" : toolkit.isNoAuth ? "Available" : "Connect"}</button>
          </div>
          {expanded && <div style={{ marginTop: 12, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            {toolState?.loading ? <LiveEmpty>Loading tools…</LiveEmpty> : toolState?.error ? <div className="lulu-live-error">{toolState.error}</div> : toolState?.items.length ? <div style={{ display: "grid", gap: 8 }}>
              {toolState.items.map((tool) => <div key={tool.slug} className="lulu-live-message" style={{ border: "1px solid var(--border)", padding: "8px 10px" }}><strong>{tool.name}</strong><span style={{ display: "block", fontSize: 11, opacity: .72 }}>{tool.slug}</span>{tool.description ? <span style={{ display: "block", marginTop: 4 }}>{tool.description}</span> : null}</div>)}
              {toolState.truncated ? <small>The provider returned more tools than this page can display. Search within Composio to narrow the catalog.</small> : null}
            </div> : <LiveEmpty>No tools are available for this app.</LiveEmpty>}
          </div>}
        </article>;
      })}
      {composioToolkitHasMore ? <button className="lulu-live-button" type="button" disabled={composioLoading} onClick={() => void loadComposio(composioSearch.trim(), composioToolkitCursor)}>Load more apps</button> : null}
    </LiveSection>
    {launchReadiness && <LiveSection title="Production readiness" action={<span className="lulu-live-message">Autonomous work is allowed only when every provider gate is ready.</span>}>
      <div className="lulu-live-message">{launchReadiness.overallReady ? "All provider connections are ready for autonomous execution." : `${launchReadiness.readyCount} of ${launchReadiness.totalConnections} provider connections are ready.`}</div>
      {launchReadiness.connections.filter((connection) => !connection.ready).map((connection) => <article className="lulu-live-row" key={`readiness-${connection.connectionId}`}>
        <div className="lulu-live-row-top"><div><strong>{connection.displayName}</strong><span>{connection.providerKey}</span></div><span className="lulu-live-badge">{connection.status}</span></div>
        <small>{connection.blockers.map((blocker) => blocker.message).join(" ")}</small>
      </article>)}
    </LiveSection>}
    <LiveSection title="Provider Control Plane" action={<span className="lulu-live-message">Provider state is backend-controlled. Secrets never leave the server.</span>}>
      {providerConnections.length === 0 ? <LiveEmpty>No canonical provider connections are available for this workspace.</LiveEmpty> : providerConnections.map((connection) => <article className="lulu-live-row" key={connection.id}>
        <div className="lulu-live-row-top"><div><strong>{connection.displayName}</strong><span>{connection.providerKey} · {connection.scopeType}</span></div><span className={`lulu-live-badge ${connection.healthStatus === "HEALTHY" ? "good" : ""}`}>{connection.status} · {connection.healthStatus}</span></div>
        <small>{connection.mode} · {connection.authorizationState}{connection.externalAccountId ? ` · account ${connection.externalAccountId}` : ""}{connection.healthReason ? ` · ${connection.healthReason}` : ""}</small>
        {connection.capabilities.length > 0 && <div className="lulu-live-message" style={{ marginTop: 8 }}>Capabilities: {connection.capabilities.map((capability) => `${capability.capabilityKey} (${capability.status})`).join(", ")}</div>}
        {connection.accounts.length > 0 && <div className="lulu-live-message" style={{ marginTop: 4 }}>Accounts: {connection.accounts.map((account) => account.name || account.externalAccountId).join(", ")}</div>}
        {contractChecks[connection.id] ? <div className="lulu-live-message" style={{ marginTop: 8 }}>Readiness check: <strong>{contractChecks[connection.id]?.status}</strong>{contractChecks[connection.id]?.errorMessage ? ` · ${contractChecks[connection.id]?.errorMessage}` : ""}</div> : null}
        {launchReadiness?.connections.find((item) => item.connectionId === connection.id) && <div className="lulu-live-message" style={{ marginTop: 4 }}>Production gate: <strong>{launchReadiness.connections.find((item) => item.connectionId === connection.id)?.status}</strong></div>}
        <div className="lulu-live-actions" style={{ marginTop: 8 }}>
          <select aria-label={`Mode for ${connection.displayName}`} value={connection.mode} disabled={busy || connection.scopeType !== "WORKSPACE"} onChange={(event) => void updateProviderMode(connection, event.target.value as ProviderConnection["mode"])}><option value="CUSTOMER_OWNED">Customer owned</option><option value="LULU_MANAGED">Lulu managed</option><option value="PARTNER_MANAGED">Partner managed</option><option value="HYBRID">Hybrid</option></select>
          <button className="lulu-live-button" disabled={busy || connection.scopeType !== "WORKSPACE"} onClick={() => void verifyProvider(connection.id)}>Verify</button>
          <button className="lulu-live-button" disabled={busy || connection.scopeType !== "WORKSPACE"} onClick={() => void contractCheck(connection.id)}>Readiness check</button>
          <button className="lulu-live-button" disabled={busy || connection.scopeType !== "WORKSPACE" || connection.status === "DISCONNECTED"} onClick={() => void syncProvider(connection.id)}>Sync</button>
          <button className="lulu-live-button danger" disabled={busy || connection.scopeType !== "WORKSPACE" || connection.status === "DISCONNECTED"} onClick={() => void disconnectProvider(connection.id, connection.displayName)}>Disconnect</button>
        </div>
      </article>)}
    </LiveSection>
    <LiveSection title={`${platforms.length} connections`} action={<span className="lulu-live-message">Use Update in the navigation bar.</span>}>
      {platforms.length === 0 ? <LiveEmpty>No integrations configured.</LiveEmpty> : platforms.map((platform) => <article className="lulu-live-row" key={platform.id}>
        <div className="lulu-live-row-top"><div><strong>{platform.name}</strong><span>{platform.category}{platform.integrationKey ? ` · ${platform.integrationKey}` : ""}</span></div><span className={`lulu-live-badge ${platform.connectionStatus === "connected" ? "good" : ""}`}>{platform.connectionStatus}</span></div>
        <small>Last sync: {formatLiveDate(platform.lastSyncedAt)}{platform.lastError ? ` · ${platform.lastError}` : ""}</small>
        <div className="lulu-live-actions" style={{ marginTop: 8 }}>
          <select aria-label={`Status for ${platform.name}`} value={platform.connectionStatus} onChange={(event) => void updateStatus(platform, event.target.value)}><option value="not_connected">Not connected</option><option value="disconnected">Disconnected</option><option value="pending">Pending</option><option value="connected">Connected</option><option value="syncing">Syncing</option><option value="error">Error</option></select>
          {platform.connectionStatus !== "connected" && <button className="lulu-live-button primary" disabled={busy} onClick={() => void connect(platform)}>Connect</button>}
          {platform.connectionStatus === "connected" && <button className="lulu-live-button" disabled={busy} onClick={() => void disconnect(platform)}>Disconnect</button>}
          <button className="lulu-live-button" disabled={busy} onClick={async () => { setBusy(true); setError(""); try { const result = await workspaceAppApi.syncIntegration(workspaceId, platform.id); window.alert(`Sync job ${result.data.jobId} created (${result.data.status}).`); await load(); } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not start the sync. Check that the provider is connected and available.")); setBusy(false); } }}>Sync</button>
          <button className="lulu-live-button danger" disabled={busy} onClick={() => void remove(platform)}>Remove</button>
        </div>
      </article>)}
    </LiveSection>
    <LiveSection title="Add integration"><form className="lulu-live-form" onSubmit={create}><label>Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label><div className="lulu-live-grid"><label>Category<input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} required /></label><label>Integration key<input value={draft.integrationKey} onChange={(event) => setDraft({ ...draft, integrationKey: event.target.value })} placeholder="e.g. google_ads" /></label></div><button className="lulu-live-button primary" disabled={busy}>Add integration</button></form></LiveSection>
  </LivePanelShell>;
}
