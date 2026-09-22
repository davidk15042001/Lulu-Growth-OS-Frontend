import { Link2, Search } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getFriendlyErrorMessage } from "../api/client";
import { composioApi, type ComposioToolkit } from "../api/composio";
import { LiveEmpty, LiveSection } from "../api/live-panel-ui";

export function ComposioCatalog({ workspaceId, canConnect = true }: { workspaceId: string; canConnect?: boolean }) {
  const [toolkits, setToolkits] = useState<ComposioToolkit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [connectUrl, setConnectUrl] = useState("");
  const [busyToolkit, setBusyToolkit] = useState<string | null>(null);

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

  async function submitSearch(event: FormEvent) {
    event.preventDefault();
    await loadToolkits(search.trim(), null);
  }

  async function connect(toolkit: ComposioToolkit) {
    setBusyToolkit(toolkit.slug); setError(""); setConnectUrl("");
    try {
      const response = await composioApi.authorize(workspaceId, toolkit.slug);
      setConnectUrl(response.data.redirectUrl);
      const opened = window.open(response.data.redirectUrl, "_blank", "noopener,noreferrer");
      if (!opened) setError("The connection page was blocked by the browser. Use the link shown below to continue.");
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not start this Composio connection."));
    } finally { setBusyToolkit(null); }
  }

  return <LiveSection title={`Available integrations${hasMore ? " · more available" : ""}`} action={<span className="lulu-live-message">Tool calls are deducted automatically from the AI wallet. Platform admins with billing.bypass are exempt.</span>}>
    <p className="lulu-live-message">Connect an approved app for this workspace. Technical tool details and provider credentials stay protected by Lulu.</p>
    {!canConnect ? <p className="lulu-live-message">You can view available apps, but your workspace role does not allow new connections.</p> : null}
    {error ? <div className="lulu-live-error">{error}</div> : null}
    {connectUrl ? <p className="lulu-live-message">Connection started. <a href={connectUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "underline", fontWeight: 700 }}>Open the Composio connection page</a>, then refresh this panel.</p> : null}
    <form className="lulu-live-form" onSubmit={(event) => void submitSearch(event)}>
      <label><span>Search Composio apps</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by app name or toolkit" /></label>
      <button className="lulu-live-button" type="submit" disabled={loading}><Search size={15} />Search</button>
    </form>
    {loading && toolkits.length === 0 ? <LiveEmpty>Loading available integrations…</LiveEmpty> : toolkits.length === 0 ? <LiveEmpty>No approved integrations match this search.</LiveEmpty> : toolkits.map((toolkit) => <article className="lulu-live-row" key={toolkit.slug}>
      <div className="lulu-live-row-top"><div><strong>{toolkit.name}</strong><span>{toolkit.isNoAuth ? "No sign-in required" : "Secure account connection"}</span></div><span className={`lulu-live-badge ${toolkit.connected ? "good" : ""}`}>{toolkit.isNoAuth ? "Available" : toolkit.connected ? "Connected" : toolkit.connectionStatus ?? "Not connected"}</span></div>
      <div className="lulu-live-actions" style={{ marginTop: 8 }}><button className="lulu-live-button primary" disabled={!canConnect || busyToolkit !== null || toolkit.isNoAuth || toolkit.connected} onClick={() => void connect(toolkit)}><Link2 size={15} />{toolkit.connected ? "Connected" : toolkit.isNoAuth ? "Available" : !canConnect ? "View only" : "Connect"}</button></div>
    </article>)}
    {hasMore ? <button className="lulu-live-button" type="button" disabled={loading} onClick={() => void loadToolkits(search.trim(), cursor)}>Load more apps</button> : null}
  </LiveSection>;
}
