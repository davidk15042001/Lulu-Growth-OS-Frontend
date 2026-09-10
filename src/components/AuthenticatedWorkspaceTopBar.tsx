import { useMemo, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLuluApp } from "../api/LuluAppContext";
import { pagePath } from "../routing";
import { availablePages } from "../app/page-registry";
import { LuluWorkspaceRefreshButton } from "./LuluWorkspaceTopBar";
import { LuluUsageControl } from "./LuluUsageControl";

export function AuthenticatedWorkspaceTopBar({
  navigationOpen,
  onToggleNavigation,
  onCloseNavigation,
}: {
  navigationOpen: boolean;
  onToggleNavigation: () => void;
  onCloseNavigation: () => void;
}) {
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

  const closeAndReset = () => {
    setQuery("");
    setOpen(false);
    onCloseNavigation();
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim() || !matches[0]) return;
    navigate(pagePath(matches[0].slug));
    closeAndReset();
  };

  return (
    <div className="lulu-auth-search-wrap" data-lulu-auth-search="true">
      <button
        type="button"
        className="lulu-auth-nav-toggle"
        aria-label={navigationOpen ? "Close navigation" : "Open navigation"}
        aria-controls="lulu-global-navigation"
        aria-expanded={navigationOpen}
        onClick={onToggleNavigation}
      >
        {navigationOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
      </button>
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
        <LuluUsageControl />
      </form>
      {open && matches.length > 0 && query.trim() && (
        <div className="lulu-auth-search-results">
          {matches.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                navigate(pagePath(item.slug));
                closeAndReset();
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
