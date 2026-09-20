import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getFriendlyErrorMessage } from "../api/client";
import { composioApi, type ComposioTool, type ComposioToolkit } from "../api/composio";
import { LiveEmpty, LiveSection } from "../api/live-panel-ui";

type ComposioToolState = {
  items: ComposioTool[];
  loading: boolean;
  error: string;
  truncated: boolean;
};

export function ComposioCatalog({ workspaceId }: { workspaceId: string }) {
  const [toolkits, setToolkits] = useState<ComposioToolkit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [expandedToolkit, setExpandedToolkit] = useState<string | null>(null);
  const [tools, setTools] = useState<Record<string, ComposioToolState>>({});
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
      if (!pageCursor) {
        setExpandedToolkit(null);
        setTools({});
      }
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

  async function toggleToolkit(toolkit: ComposioToolkit) {
    if (expandedToolkit === toolkit.slug) {
      setExpandedToolkit(null);
      return;
    }
    setExpandedToolkit(toolkit.slug);
    if (tools[toolkit.slug]) return;
    setTools((current) => ({ ...current, [toolkit.slug]: { items: [], loading: true, error: "", truncated: false } }));
    try {
      const response = await composioApi.tools(workspaceId, toolkit.slug);
      setTools((current) => ({
        ...current,
        [toolkit.slug]: { items: response.data.items, loading: false, error: "", truncated: response.data.truncated },
      }));
    } catch (cause) {
      setTools((current) => ({
        ...current,
        [toolkit.slug]: { items: [], loading: false, error: getFriendlyErrorMessage(cause, "The tools for this app could not be loaded."), truncated: false },
      }));
    }
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

  return <LiveSection title={`Composio catalog${hasMore ? " · more available" : ""}`} action={<span className="lulu-live-message">Tool calls are deducted automatically from the AI wallet. Platform admins with billing.bypass are exempt.</span>}>
    <p className="lulu-live-message">Browse every available toolkit and expand an app to see its individual actions. Connected credentials stay with Composio.</p>
    {error ? <div className="lulu-live-error">{error}</div> : null}
    {connectUrl ? <p className="lulu-live-message">Connection started. <a href={connectUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "underline", fontWeight: 700 }}>Open the Composio connection page</a>, then refresh this panel.</p> : null}
    <form className="lulu-live-form" onSubmit={(event) => void submitSearch(event)}>
      <label><span>Search Composio apps</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by app name or toolkit" /></label>
      <button className="lulu-live-button" type="submit" disabled={loading}><Search size={15} />Search</button>
    </form>
    {loading && toolkits.length === 0 ? <LiveEmpty>Loading Composio apps…</LiveEmpty> : toolkits.length === 0 ? <LiveEmpty>No Composio apps match this search.</LiveEmpty> : toolkits.map((toolkit) => {
      const expanded = expandedToolkit === toolkit.slug;
      const state = tools[toolkit.slug];
      return <article className="lulu-live-row" key={toolkit.slug}>
        <div className="lulu-live-row-top"><div><strong>{toolkit.name}</strong><span>{toolkit.slug}{state ? ` · ${state.items.length}${state.truncated ? "+" : ""} tools` : " · tools available"}</span></div><span className={`lulu-live-badge ${toolkit.connected ? "good" : ""}`}>{toolkit.isNoAuth ? "No sign-in required" : toolkit.connected ? "Connected" : toolkit.connectionStatus ?? "Not connected"}</span></div>
        <div className="lulu-live-actions" style={{ marginTop: 8 }}>
          <button className="lulu-live-button" type="button" aria-expanded={expanded} onClick={() => void toggleToolkit(toolkit)}>{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}{expanded ? "Hide tools" : "Show tools"}</button>
          <button className="lulu-live-button primary" disabled={busyToolkit !== null || toolkit.isNoAuth || toolkit.connected} onClick={() => void connect(toolkit)}>{toolkit.connected ? "Connected" : toolkit.isNoAuth ? "Available" : "Connect"}</button>
        </div>
        {expanded && <div style={{ marginTop: 12, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          {state?.loading ? <LiveEmpty>Loading tools…</LiveEmpty> : state?.error ? <div className="lulu-live-error">{state.error}</div> : state?.items.length ? <div style={{ display: "grid", gap: 8 }}>
            {state.items.map((tool) => <div key={tool.slug} className="lulu-live-message" style={{ border: "1px solid var(--border)", padding: "8px 10px" }}><strong>{tool.name}</strong><span style={{ display: "block", fontSize: 11, opacity: .72 }}>{tool.slug}</span>{tool.description ? <span style={{ display: "block", marginTop: 4 }}>{tool.description}</span> : null}</div>)}
            {state.truncated ? <small>The provider returned more tools than this page can display. Search within Composio to narrow the catalog.</small> : null}
          </div> : <LiveEmpty>No tools are available for this app.</LiveEmpty>}
        </div>}
      </article>;
    })}
    {hasMore ? <button className="lulu-live-button" type="button" disabled={loading} onClick={() => void loadToolkits(search.trim(), cursor)}>Load more apps</button> : null}
  </LiveSection>;
}
