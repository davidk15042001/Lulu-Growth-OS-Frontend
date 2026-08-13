import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { pages, type PageDefinition } from "./pages-manifest";
import { isLuluNavigationMessage, pagePath, routes } from "./routing";
import { ApiError, installApiBroker, requestApi } from "./api/client";
import {
  clearPendingInvitation,
  setPendingInvitation,
  setSelectedWorkspaceId,
} from "./api/session";

function Directory() {
  const [query, setQuery] = useState("");
  const visiblePages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return pages;
    return pages.filter((page) => `${page.name} ${page.generatedName}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <main className="directory">
      <header className="directory__header">
        <div>
          <p className="eyebrow">Lulu AI application routes</p>
          <h1>Lulu AI</h1>
          <p>All {pages.length} pages are connected to the application router.</p>
        </div>
        <label className="search">
          <Search aria-hidden="true" size={17} />
          <span className="sr-only">Search pages</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all pages" />
        </label>
      </header>
      <section className="page-grid" aria-label="All application routes">
        {visiblePages.map((page, index) => (
          <Link className="page-card" key={page.id} to={pagePath(page.slug)}>
            <span className="page-card__number">{String(index + 1).padStart(3, "0")}</span>
            <strong>{page.name}</strong>
            <span>{pagePath(page.slug)}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}

function PageFrame({ page }: { page: PageDefinition }) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.title = page.name;
    setLoaded(false);
  }, [page]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || !isLuluNavigationMessage(event.data)) return;
      navigate(event.data.to, { replace: event.data.replace });
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  return (
    <main className="page-frame" aria-busy={!loaded}>
      {!loaded && <div className="page-frame__loading" role="status">Loading {page.name}…</div>}
      <iframe
        key={page.slug}
        title={page.name}
        src={`/entries/${page.slug}/index.html`}
        onLoad={() => setLoaded(true)}
      />
    </main>
  );
}

function LegacyPageRedirect() {
  const { slug } = useParams();
  const page = pages.find((item) => item.slug === slug);
  return page ? <Navigate replace to={pagePath(page.slug)} /> : <Navigate replace to="/not-found" />;
}

function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The requested Lulu AI route does not exist.</p>
      <Link to={routes.auth.login}>Return to login</Link>
    </main>
  );
}

function InvitationAccept() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Accepting your invitation…");

  useEffect(() => {
    if (!token) {
      navigate("/not-found", { replace: true });
      return;
    }
    let active = true;
    requestApi<{ workspaceId: string }>({ path: `/workspaces/invitations/${encodeURIComponent(token)}/accept`, method: "POST" })
      .then((response) => {
        if (!active) return;
        setSelectedWorkspaceId(response.data.workspaceId);
        clearPendingInvitation();
        navigate(routes.app.dashboard, { replace: true });
      })
      .catch((error) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 401) {
          setPendingInvitation(token);
          navigate(routes.auth.login, { replace: true });
          return;
        }
        setStatus(error instanceof Error ? error.message : "Unable to accept this invitation.");
      });
    return () => { active = false; };
  }, [navigate, token]);

  return <main className="not-found"><p className="eyebrow">Workspace invitation</p><h1>Joining Lulu AI</h1><p>{status}</p></main>;
}

export default function App() {
  useEffect(() => installApiBroker(), []);

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={routes.auth.login} />} />
      <Route path={routes.allPages} element={<Directory />} />
      <Route path="/pages" element={<Navigate replace to={routes.allPages} />} />
      <Route path="/pages/:slug" element={<LegacyPageRedirect />} />
      <Route path="/auth/invitations/:token" element={<InvitationAccept />} />
      {pages.map((page) => (
        <Route key={page.id} path={pagePath(page.slug)} element={<PageFrame page={page} />} />
      ))}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
