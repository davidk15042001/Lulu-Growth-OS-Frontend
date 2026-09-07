import { useCallback, useEffect, useState, type FormEvent } from "react";
import { onboardingApi, type Platform } from "../onboarding";
import { getFriendlyErrorMessage } from "../client";
import { workspaceAppApi } from "../workspace-app";
import { providerControlApi, type ProviderConnection } from "../providers";
import { LiveEmpty, LiveError, LivePanelShell, LiveSection, formatLiveDate } from "../live-panel-ui";

export function IntegrationsPanel({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [providerConnections, setProviderConnections] = useState<ProviderConnection[]>([]);
  const [draft, setDraft] = useState({ name: "", category: "other", integrationKey: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setBusy(true); setError("");
    try {
      const [legacy, controlPlane] = await Promise.all([
        onboardingApi.platforms(workspaceId),
        providerControlApi.connections(workspaceId),
      ]);
      setPlatforms(legacy.data.items);
      setProviderConnections(controlPlane.data.connections);
    }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not load your integrations. Please try again.")); }
    finally { setBusy(false); }
  }, [workspaceId]);
  useEffect(() => { void load(); }, [load]);

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
    <LiveSection title="Provider Control Plane" action={<span className="lulu-live-message">Provider state is backend-controlled. Secrets never leave the server.</span>}>
      {providerConnections.length === 0 ? <LiveEmpty>No canonical provider connections are available for this workspace.</LiveEmpty> : providerConnections.map((connection) => <article className="lulu-live-row" key={connection.id}>
        <div className="lulu-live-row-top"><div><strong>{connection.displayName}</strong><span>{connection.providerKey} · {connection.scopeType}</span></div><span className={`lulu-live-badge ${connection.healthStatus === "HEALTHY" ? "good" : ""}`}>{connection.status} · {connection.healthStatus}</span></div>
        <small>{connection.mode} · {connection.authorizationState}{connection.externalAccountId ? ` · account ${connection.externalAccountId}` : ""}{connection.healthReason ? ` · ${connection.healthReason}` : ""}</small>
        {connection.capabilities.length > 0 && <div className="lulu-live-message" style={{ marginTop: 8 }}>Capabilities: {connection.capabilities.map((capability) => `${capability.capabilityKey} (${capability.status})`).join(", ")}</div>}
        {connection.accounts.length > 0 && <div className="lulu-live-message" style={{ marginTop: 4 }}>Accounts: {connection.accounts.map((account) => account.name || account.externalAccountId).join(", ")}</div>}
        <div className="lulu-live-actions" style={{ marginTop: 8 }}>
          <select aria-label={`Mode for ${connection.displayName}`} value={connection.mode} disabled={busy || connection.scopeType !== "WORKSPACE"} onChange={(event) => void updateProviderMode(connection, event.target.value as ProviderConnection["mode"])}><option value="CUSTOMER_OWNED">Customer owned</option><option value="LULU_MANAGED">Lulu managed</option><option value="PARTNER_MANAGED">Partner managed</option><option value="HYBRID">Hybrid</option></select>
          <button className="lulu-live-button" disabled={busy || connection.scopeType !== "WORKSPACE"} onClick={() => void verifyProvider(connection.id)}>Verify</button>
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
