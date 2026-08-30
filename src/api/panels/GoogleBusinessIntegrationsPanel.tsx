import { useCallback, useEffect, useState } from "react";
import { getFriendlyErrorMessage } from "../client";
import { LiveEmpty, LiveError, LivePanelShell, LiveSection, formatLiveDate } from "../live-panel-ui";
import { workspaceAppApi, type GoogleBusinessState } from "../workspace-app";

export function GoogleBusinessIntegrationsPanel({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const [state, setState] = useState<GoogleBusinessState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      setState((await workspaceAppApi.googleBusiness(workspaceId)).data);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not load the Google Business integration state."));
    } finally {
      setBusy(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function connect() {
    setBusy(true);
    setError("");
    try {
      const response = await workspaceAppApi.connectGoogleBusiness(workspaceId, {
        returnTo: `${window.location.pathname}${window.location.search}`,
      });
      window.location.assign(response.data.authorizationUrl);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not start the Google Business connection."));
      setBusy(false);
    }
  }

  async function disconnect() {
    if (!window.confirm("Disconnect Google Business from this workspace?")) return;
    setBusy(true);
    setError("");
    try {
      await workspaceAppApi.disconnectGoogleBusiness(workspaceId);
      setNotice("Google Business disconnected.");
      await load();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not disconnect Google Business."));
      setBusy(false);
    }
  }

  async function sync() {
    setBusy(true);
    setError("");
    try {
      const response = await workspaceAppApi.syncGoogleBusiness(workspaceId);
      setNotice(`Sync job ${response.data.jobId} queued.`);
      await load();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not start the Google Business sync."));
      setBusy(false);
    }
  }

  const accounts = state?.accounts ?? [];
  const locations = state?.locations ?? [];

  return <LivePanelShell title="Google Business Integrations" subtitle="Connection, sync and account visibility" onClose={onClose}>
    <LiveError message={error || notice} />
    <LiveSection title="Connection" action={<button className="lulu-live-button" onClick={() => void load()} disabled={busy}>Refresh</button>}>
      {!state ? <LiveEmpty>Loading Google Business…</LiveEmpty> : <article className="lulu-live-row">
        <div className="lulu-live-row-top">
          <div>
            <strong>{state.platformName}</strong>
            <span>{state.category} · {state.connectionStatus}</span>
          </div>
          <span className={`lulu-live-badge ${state.connected && state.apiReachable ? "good" : ""}`}>{state.connected ? (state.apiReachable ? "connected" : "needs review") : "not connected"}</span>
        </div>
        <small>Last sync: {formatLiveDate(state.lastSyncedAt)}{state.lastError ? ` · ${state.lastError}` : ""}</small>
        <div className="lulu-live-actions" style={{ marginTop: 8 }}>
          <button className="lulu-live-button primary" disabled={busy} onClick={() => void connect()}>{state.connected ? (state.reauthRequired ? "Reconnect" : "Reconnect OAuth") : "Connect Google"}</button>
          <button className="lulu-live-button" disabled={busy || !state.connected} onClick={() => void sync()}>Sync</button>
          <button className="lulu-live-button danger" disabled={busy || !state.connected} onClick={() => void disconnect()}>Disconnect</button>
        </div>
      </article>}
    </LiveSection>
    <LiveSection title="Visibility">
      {!state ? <LiveEmpty>Loading visibility…</LiveEmpty> : <div className="lulu-live-kpis">
        <div className="lulu-live-kpi"><span>Accounts</span><strong>{state.summary.accountCount}</strong></div>
        <div className="lulu-live-kpi"><span>Locations</span><strong>{state.summary.locationCount}</strong></div>
      </div>}
    </LiveSection>
    <LiveSection title={`${accounts.length} accounts`}>
      {accounts.length === 0 ? <LiveEmpty>No Google Business accounts visible yet.</LiveEmpty> : accounts.map((account) => <article className="lulu-live-row" key={account.id}>
        <div className="lulu-live-row-top"><div><strong>{account.name}</strong><span>{account.type ?? "account"}</span></div><span className="lulu-live-badge">{account.locationCount} locations</span></div>
        <small>{account.id}</small>
      </article>)}
    </LiveSection>
    <LiveSection title={`${locations.length} locations`}>
      {locations.length === 0 ? <LiveEmpty>No Business Profile locations returned yet.</LiveEmpty> : locations.map((location) => <article className="lulu-live-row" key={location.id}>
        <div className="lulu-live-row-top"><div><strong>{location.title}</strong><span>{location.address || "No address provided"}</span></div><span className="lulu-live-badge">{location.storeCode ?? "no store code"}</span></div>
        <small>{location.websiteUrl ?? "No website URL"}</small>
      </article>)}
    </LiveSection>
    <LiveSection title="Next steps">
      {!state || state.nextSteps.length === 0 ? <LiveEmpty>No follow-up steps available.</LiveEmpty> : <div className="lulu-live-form">
        {state.nextSteps.map((step) => <div key={step} className="lulu-live-message">{step}</div>)}
      </div>}
    </LiveSection>
  </LivePanelShell>;
}
