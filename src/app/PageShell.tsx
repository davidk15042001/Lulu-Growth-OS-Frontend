import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NativePage } from "../NativePage";
import type { PageDefinition } from "../pages-manifest";
import { pagePath } from "../routing";
import { useLuluApp } from "../api/LuluAppContext";
import { LuluWorkspaceRefreshButton } from "../components/LuluWorkspaceTopBar";
import { subscribeWorkspaceRefresh } from "../components/workspace-refresh-events";
import { availablePages } from "./page-registry";

function AuthenticatedSearchBar() {
  const navigate = useNavigate();
  const { currentUser, selectedWorkspace } = useLuluApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return availablePages
      .filter((item) => `${item.name} ${item.generatedName}`.toLowerCase().includes(normalized))
      .slice(0, 6);
  }, [query]);

  if (!currentUser || !selectedWorkspace) return null;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = query.trim();
    if (!text) return;
    const target = matches[0];
    if (!target) return;
    navigate(pagePath(target.slug));
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="lulu-auth-search-wrap" data-lulu-auth-search="true">
      <div className="lulu-auth-logo" data-lulu-no-translate="true" translate="no">
        <img src="/branding/lulu-intelligence-logo.png" alt="Lulu AI" draggable={false} />
      </div>
      <form className="lulu-auth-search" role="search" onSubmit={submit}>
        <label className="sr-only" htmlFor="lulu-global-search">Search Lulu AI</label>
        <input
          id="lulu-global-search"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          placeholder="Search Lulu AI"
          autoComplete="off"
        />
        <button type="submit" aria-label="Search" title="Search" className="lulu-auth-search-button">
          <Search aria-hidden="true" size={17} />
        </button>
        <LuluWorkspaceRefreshButton />
      </form>
      {open && matches.length > 0 && query.trim() && (
        <div className="lulu-auth-search-results">
          {matches.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                navigate(pagePath(item.slug));
                setQuery("");
                setOpen(false);
              }}
            >
              <strong>{item.name}</strong>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PageFrame({
  page,
  isStandalone,
}: {
  page: PageDefinition;
  isStandalone: boolean;
}) {
  const { selectedWorkspace } = useLuluApp();
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    document.title = page.name;
  }, [page]);

  useEffect(() => {
    if (!selectedWorkspace?.id) return;
    return subscribeWorkspaceRefresh(selectedWorkspace.id, () => {
      // #region debug-point C:page-shell-refresh-event
      fetch("http://127.0.0.1:7777/event", { method: "POST", body: JSON.stringify({ sessionId: "update-button-broken", runId: "pre-fix", hypothesisId: "C", location: "src/app/PageShell.tsx:workspace-refresh", msg: "[DEBUG] Page shell received workspace refresh event", data: { workspaceId: selectedWorkspace.id, pageSlug: page.slug }, ts: Date.now() }) }).catch(() => {});
      // #endregion
      setRefreshVersion((current) => current + 1);
    });
  }, [selectedWorkspace?.id]);

  return (
    <>
      {!isStandalone && <AuthenticatedSearchBar />}
      <main
        className={`page-frame${isStandalone ? " page-frame--auth" : ""}`}
        style={isStandalone ? { height: "auto", minHeight: "100vh", overflow: "visible" } : undefined}
      >
        <NativePage key={`${page.slug}:${refreshVersion}`} slug={page.slug} />
      </main>
    </>
  );
}
