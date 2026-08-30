import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NativePage } from "../NativePage";
import type { PageDefinition } from "../pages-manifest";
import { pagePath } from "../routing";
import { useLuluApp } from "../api/LuluAppContext";
import { LuluWorkspaceRefreshButton } from "../components/LuluWorkspaceTopBar";
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
  useEffect(() => {
    document.title = page.name;
  }, [page]);

  return (
    <>
      {!isStandalone && <AuthenticatedSearchBar />}
      <main
        className={`page-frame${isStandalone ? " page-frame--auth" : ""}`}
        style={isStandalone ? { height: "auto", minHeight: "100vh", overflow: "visible" } : undefined}
      >
        <NativePage slug={page.slug} />
      </main>
    </>
  );
}
