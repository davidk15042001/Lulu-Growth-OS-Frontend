import { useCallback, useEffect, useState, type FormEvent } from "react";
import { onboardingApi, type Platform } from "../onboarding";
import { getFriendlyErrorMessage } from "../client";
import { workspaceAppApi } from "../workspace-app";
import { LiveEmpty, LiveError, LivePanelShell, LiveSection, formatLiveDate } from "../live-panel-ui";

export function IntegrationsPanel({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [draft, setDraft] = useState({ name: "", category: "other", integrationKey: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setBusy(true); setError("");
    try { setPlatforms((await onboardingApi.platforms(workspaceId)).data.items); }
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

  return <LivePanelShell title="Live integrations" subtitle="Connections and synchronization jobs" onClose={onClose}>
    <LiveError message={error} />
    <LiveSection title={`${platforms.length} connections`} action={<button className="lulu-live-button" onClick={() => void load()} disabled={busy}>Refresh</button>}>
      {platforms.length === 0 ? <LiveEmpty>No integrations configured.</LiveEmpty> : platforms.map((platform) => <article className="lulu-live-row" key={platform.id}>
        <div className="lulu-live-row-top"><div><strong>{platform.name}</strong><span>{platform.category}{platform.integrationKey ? ` · ${platform.integrationKey}` : ""}</span></div><span className={`lulu-live-badge ${platform.connectionStatus === "connected" ? "good" : ""}`}>{platform.connectionStatus}</span></div>
        <small>Last sync: {formatLiveDate(platform.lastSyncedAt)}{platform.lastError ? ` · ${platform.lastError}` : ""}</small>
        <div className="lulu-live-actions" style={{ marginTop: 8 }}>
          <select aria-label={`Status for ${platform.name}`} value={platform.connectionStatus} onChange={(event) => void updateStatus(platform, event.target.value)}><option value="not_connected">Not connected</option><option value="disconnected">Disconnected</option><option value="pending">Pending</option><option value="connected">Connected</option><option value="syncing">Syncing</option><option value="error">Error</option></select>
          <button className="lulu-live-button" disabled={busy} onClick={async () => { setBusy(true); try { const result = await workspaceAppApi.syncIntegration(workspaceId, platform.id); window.alert(`Sync job ${result.data.jobId} created (${result.data.status}).`); await load(); } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not start the sync. Please try again.")); setBusy(false); } }}>Sync</button>
          <button className="lulu-live-button danger" disabled={busy} onClick={async () => { if (!window.confirm(`Delete ${platform.name}?`)) return; await onboardingApi.deletePlatform(workspaceId, platform.id); await load(); }}>Delete</button>
        </div>
      </article>)}
    </LiveSection>
    <LiveSection title="Add integration"><form className="lulu-live-form" onSubmit={create}><label>Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label><div className="lulu-live-grid"><label>Category<input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} required /></label><label>Integration key<input value={draft.integrationKey} onChange={(event) => setDraft({ ...draft, integrationKey: event.target.value })} placeholder="e.g. google_ads" /></label></div><button className="lulu-live-button primary" disabled={busy}>Add integration</button></form></LiveSection>
  </LivePanelShell>;
}
