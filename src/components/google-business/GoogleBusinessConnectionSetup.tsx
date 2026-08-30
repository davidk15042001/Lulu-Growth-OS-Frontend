import { useCallback, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Globe2, MapPin, RefreshCw, ShieldCheck, Unplug } from "lucide-react";
import { getFriendlyErrorMessage, getTechnicalErrorDetails } from "../../api/client";
import { formatLiveDate } from "../../api/live-panel-ui";
import { workspaceAppApi, type GoogleBusinessState } from "../../api/workspace-app";

export function GoogleBusinessConnectionSetup({ workspaceId }: { workspaceId: string }) {
  const [state, setState] = useState<GoogleBusinessState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [technicalDetails, setTechnicalDetails] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setState((await workspaceAppApi.googleBusiness(workspaceId)).data);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not load the Google Business connection state."));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "google-business") {
      setNotice("Google Business connected successfully.");
    }
    const oauthError = params.get("oauthError");
    if (oauthError) {
      setError(oauthError);
      setTechnicalDetails([params.get("oauthCode"), params.get("oauthRequestId")].filter(Boolean).join(" · "));
    }
    void load();
  }, [load]);

  async function connect() {
    setBusy(true);
    setError("");
    setTechnicalDetails("");
    try {
      const response = await workspaceAppApi.connectGoogleBusiness(workspaceId, {
        returnTo: `${window.location.pathname}${window.location.search}`,
      });
      window.location.assign(response.data.authorizationUrl);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not start the Google Business connection."));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
      setBusy(false);
    }
  }

  async function disconnect() {
    if (!window.confirm("Disconnect Google Business from this workspace?")) return;
    setBusy(true);
    setError("");
    setTechnicalDetails("");
    try {
      await workspaceAppApi.disconnectGoogleBusiness(workspaceId);
      setNotice("Google Business disconnected.");
      await load();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not disconnect Google Business."));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
      setBusy(false);
    }
  }

  async function sync() {
    setBusy(true);
    setError("");
    setTechnicalDetails("");
    try {
      const response = await workspaceAppApi.syncGoogleBusiness(workspaceId);
      setNotice(`Google Business sync queued (${response.data.jobId}).`);
      await load();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not queue the Google Business sync."));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
      setBusy(false);
    }
  }

  return <main className="min-h-screen bg-[var(--background)] font-['Poppins',sans-serif] text-[var(--foreground)]">
    <section className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
      <p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--muted-foreground)]">Google Business / Connection Setup</p>
      <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">Google Business Connection Setup</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">Connect the Google account that manages your Business Profile so Lulu can discover accounts, locations, reviews, and owner-reply workflows directly from the backend.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void load()} disabled={loading || busy} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)]/35 disabled:cursor-not-allowed disabled:opacity-50"><RefreshCw size={16} />Refresh</button>
          <button type="button" onClick={() => void sync()} disabled={!state?.connected || busy || loading} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)]/35 disabled:cursor-not-allowed disabled:opacity-50"><ArrowRight size={16} />Sync</button>
          <button type="button" onClick={() => void connect()} disabled={busy || loading} className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{state?.connected ? (state?.reauthRequired ? "Reconnect Google" : "Reconnect OAuth") : "Connect Google"}</button>
          <button type="button" onClick={() => void disconnect()} disabled={!state?.connected || busy || loading} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-semibold text-[var(--destructive)] transition hover:border-[var(--destructive)]/50 disabled:cursor-not-allowed disabled:opacity-50"><Unplug size={16} />Disconnect</button>
        </div>
      </div>

      {(error || notice) && <div role="alert" className={`mt-6 space-y-2 rounded-2xl border px-4 py-3 text-sm leading-6 ${error ? "border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--destructive)]" : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700"}`}>
        <p className="font-medium">{error || notice}</p>
        {technicalDetails && <details><summary className="cursor-pointer text-xs font-semibold">Show technical details</summary><p className="mt-2 break-words font-mono text-[11px] leading-5">{technicalDetails}</p></details>}
      </div>}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Connection", value: loading ? "Loading…" : state?.connected ? (state.apiReachable ? "Connected" : "Needs review") : "Not connected", icon: CheckCircle2 },
          { label: "Accounts", value: loading ? "—" : String(state?.summary.accountCount ?? 0), icon: Globe2 },
          { label: "Locations", value: loading ? "—" : String(state?.summary.locationCount ?? 0), icon: MapPin },
          { label: "Last Sync", value: loading ? "—" : formatLiveDate(state?.lastSyncedAt), icon: ShieldCheck },
        ].map((item) => <article key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3"><p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">{item.label}</p><item.icon size={18} className="text-[var(--foreground)]" /></div>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{item.value}</p>
        </article>)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Workspace connection</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Platform</p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{state?.platformName ?? "Google Business"}</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">{state?.category ?? "digital-appearance"}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Provider account</p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{state?.externalAccountId ?? "Not available yet"}</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">{state?.connectionStatus ?? "not_connected"}</p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/35 p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">What Lulu checks</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted-foreground)]">
              {(state?.nextSteps ?? [
                "Connect the correct Google Business account.",
                "Verify that locations are visible after OAuth.",
                "Run a sync to refresh downstream review workflows.",
              ]).map((step) => <li key={step} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--foreground)]/50" /><span>{step}</span></li>)}
            </ul>
          </div>
          {state?.grantedScopes?.length ? <div className="mt-5">
            <p className="text-sm font-semibold text-[var(--foreground)]">Granted scopes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {state.grantedScopes.map((scope) => <span key={scope} className="rounded-full border border-[var(--border)] bg-[var(--secondary)]/35 px-3 py-1 text-xs text-[var(--muted-foreground)]">{scope}</span>)}
            </div>
          </div> : null}
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Business Profile visibility</h2>
          {loading ? <p className="mt-4 text-sm text-[var(--muted-foreground)]">Loading Google Business accounts and locations…</p> : !state?.accounts.length ? <p className="mt-4 text-sm text-[var(--muted-foreground)]">No Business Profile accounts are visible yet. Connect or reconnect the correct Google account first.</p> : <div className="mt-4 space-y-3">
            {state.accounts.map((account) => <article key={account.id} className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/35 p-4">
              <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-[var(--foreground)]">{account.name}</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">{account.type ?? "Google Business account"}</p></div><span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted-foreground)]">{account.locationCount} locations</span></div>
            </article>)}
          </div>}
        </section>
      </div>

      <section className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Locations</h2>
        {loading ? <p className="mt-4 text-sm text-[var(--muted-foreground)]">Loading locations…</p> : !state?.locations.length ? <p className="mt-4 text-sm text-[var(--muted-foreground)]">No locations returned yet.</p> : <div className="mt-4 grid gap-3 md:grid-cols-2">
          {state.locations.map((location) => <article key={location.id} className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/35 p-4">
            <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-[var(--foreground)]">{location.title}</p><p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{location.address || "No address provided"}</p></div><span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted-foreground)]">{location.storeCode ?? "No store code"}</span></div>
            <p className="mt-3 text-xs text-[var(--muted-foreground)]">{location.websiteUrl ?? "No website URL attached"}</p>
          </article>)}
        </div>}
      </section>
    </section>
  </main>;
}
