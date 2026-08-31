import { useCallback, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, RefreshCw, Unplug } from "lucide-react";
import { getFriendlyErrorMessage, getTechnicalErrorDetails } from "../../api/client";
import { formatLiveDate } from "../../api/live-panel-ui";
import { workspaceAppApi, type GoogleBusinessState } from "../../api/workspace-app";
import { exitOnboardingToLogin } from "../OnboardingHeader";

export function GoogleBusinessConnectionSetup({ workspaceId }: { workspaceId: string }) {
  const [state, setState] = useState<GoogleBusinessState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [exiting, setExiting] = useState(false);
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

  async function handleExit() {
    if (exiting) return;
    const confirmed = window.confirm("Cancel onboarding and return to the login page?");
    if (!confirmed) return;
    setExiting(true);
    await exitOnboardingToLogin();
  }

  const summaryItems = [
    {
      label: "Connection",
      value: loading ? "Loading..." : state?.connected ? (state.apiReachable ? "Connected" : "Needs review") : "Not connected",
    },
    {
      label: "Accounts",
      value: loading ? "—" : String(state?.summary.accountCount ?? 0),
    },
    {
      label: "Locations",
      value: loading ? "—" : String(state?.summary.locationCount ?? 0),
    },
    {
      label: "Last sync",
      value: loading ? "—" : formatLiveDate(state?.lastSyncedAt),
    },
  ];

  const visibleAccounts = state?.accounts.slice(0, 3) ?? [];
  const visibleLocations = state?.locations.slice(0, 4) ?? [];
  const nextSteps = state?.nextSteps ?? [
    "Connect the correct Google Business account.",
    "Confirm that locations appear after OAuth.",
    "Run one sync to refresh downstream review workflows.",
  ];

  return <main className="min-h-screen bg-[var(--background)] font-['Poppins',sans-serif] text-[var(--foreground)]">
    <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Google Business</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Connect your Business Profile</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
              This page now shows only the connection state, the next required steps, and the first visible accounts and locations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void handleExit()} disabled={exiting || busy || loading} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)]/35 disabled:cursor-not-allowed disabled:opacity-50">{exiting ? "Leaving…" : "Cancel setup"}</button>
            <button type="button" onClick={() => void load()} disabled={loading || busy} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)]/35 disabled:cursor-not-allowed disabled:opacity-50"><RefreshCw size={16} />Refresh</button>
            <button type="button" onClick={() => void sync()} disabled={!state?.connected || busy || loading} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)]/35 disabled:cursor-not-allowed disabled:opacity-50"><ArrowRight size={16} />Sync</button>
            <button type="button" onClick={() => void connect()} disabled={busy || loading} className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{state?.connected ? (state?.reauthRequired ? "Reconnect Google" : "Reconnect OAuth") : "Connect Google"}</button>
            <button type="button" onClick={() => void disconnect()} disabled={!state?.connected || busy || loading} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold text-[var(--destructive)] transition hover:border-[var(--destructive)]/50 disabled:cursor-not-allowed disabled:opacity-50"><Unplug size={16} />Disconnect</button>
          </div>
        </div>

        {(error || notice) && <div role="alert" className={`mt-5 space-y-2 rounded-2xl border px-4 py-3 text-sm leading-6 ${error ? "border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--destructive)]" : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700"}`}>
          <p className="font-medium">{error || notice}</p>
          {technicalDetails && <details><summary className="cursor-pointer text-xs font-semibold">Show technical details</summary><p className="mt-2 break-words font-mono text-[11px] leading-5">{technicalDetails}</p></details>}
        </div>}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => <article key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">{item.label}</p>
            <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">{item.value}</p>
          </article>)}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Next steps</h2>
          <ul className="mt-4 space-y-3">
            {nextSteps.map((step) => <li key={step} className="flex gap-3 text-sm leading-6 text-[var(--muted-foreground)]">
              <CheckCircle2 size={16} className="mt-1 shrink-0 text-[var(--primary)]" />
              <span>{step}</span>
            </li>)}
          </ul>

          <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Provider account</p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{state?.externalAccountId ?? "Not available yet"}</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">{state?.connectionStatus ?? "not_connected"}</p>
          </div>

          {state?.grantedScopes?.length ? <div className="mt-5">
            <p className="text-sm font-semibold text-[var(--foreground)]">Granted scopes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {state.grantedScopes.map((scope) => <span key={scope} className="rounded-full border border-[var(--border)] bg-[var(--background)]/70 px-3 py-1 text-xs text-[var(--muted-foreground)]">{scope}</span>)}
            </div>
          </div> : null}
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Visible in Google</h2>

          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Accounts</p>
            {loading ? <p className="mt-2 text-sm text-[var(--muted-foreground)]">Loading accounts...</p> : !visibleAccounts.length ? <p className="mt-2 text-sm text-[var(--muted-foreground)]">No Business Profile accounts are visible yet.</p> : <div className="mt-3 space-y-3">
              {visibleAccounts.map((account) => <article key={account.id} className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">{account.name}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{account.locationCount} locations</p>
              </article>)}
            </div>}
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Locations</p>
            {loading ? <p className="mt-2 text-sm text-[var(--muted-foreground)]">Loading locations...</p> : !visibleLocations.length ? <p className="mt-2 text-sm text-[var(--muted-foreground)]">No locations returned yet.</p> : <div className="mt-3 space-y-3">
              {visibleLocations.map((location) => <article key={location.id} className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">{location.title}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{location.address || "No address provided"}</p>
              </article>)}
            </div>}
          </div>
        </section>
      </div>
    </section>
  </main>;
}
