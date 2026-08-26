import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NativePage } from "../NativePage";
import type { PageDefinition } from "../pages-manifest";
import { pagePath } from "../routing";
import { conversationApi } from "../api/conversations";
import { usageApi, type WorkspaceCredits } from "../api/usage";
import { useLuluApp } from "../api/LuluAppContext";
import { LuluWorkspaceRefreshButton } from "../components/LuluWorkspaceTopBar";
import { availablePages } from "./page-registry";

function AuthenticatedSearchBar() {
  const navigate = useNavigate();
  const { currentUser, selectedWorkspace } = useLuluApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [credits, setCredits] = useState<WorkspaceCredits | null>(null);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return availablePages
      .filter((item) => `${item.name} ${item.generatedName}`.toLowerCase().includes(normalized))
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedWorkspace) {
      setCredits(null);
      return () => {
        cancelled = true;
      };
    }
    usageApi.credits(selectedWorkspace.id)
      .then((response) => {
        if (!cancelled) setCredits(response.data);
      })
      .catch(() => {
        if (!cancelled) setCredits(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedWorkspace]);

  if (!currentUser || !selectedWorkspace) return null;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = query.trim();
    if (!text || busy) return;
    const target = matches[0];
    if (target) {
      navigate(pagePath(target.slug));
      setQuery("");
      setAnswer(null);
      setOpen(false);
      return;
    }
    setBusy(true);
    setOpen(true);
    setAnswer(null);
    try {
      const conversation = await conversationApi.create(selectedWorkspace.id, text.slice(0, 120));
      const response = await conversationApi.respond(selectedWorkspace.id, conversation.data.id, text);
      setAnswer(response.data.assistantMessage.content);
    } catch {
      setAnswer("Die Anfrage konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.");
    } finally {
      setBusy(false);
    }
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
      {credits && (
        <div className="lulu-auth-credits" title="Credits" aria-label="Credits">
          <span className="lulu-auth-credits-label">Credits</span>
          <strong>{credits.creditsUsed.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
        </div>
      )}
      {open && query.trim() && (
        <div className="lulu-auth-search-results">
          {matches.length ? (
            matches.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  navigate(pagePath(item.slug));
                  setQuery("");
                  setAnswer(null);
                  setOpen(false);
                }}
              >
                <strong>{item.name}</strong>
              </button>
            ))
          ) : busy ? (
            <p>Working on your Lulu AI request…</p>
          ) : answer ? (
            <p className="lulu-auth-search-answer">{answer}</p>
          ) : (
            <p>Ask Lulu AI about your workspace or type a page name.</p>
          )}
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
