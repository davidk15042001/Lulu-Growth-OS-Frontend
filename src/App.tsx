import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { pages } from "./pages-manifest";

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
          <p className="eyebrow">MagicPath project 437844461893066814</p>
          <h1>Lulu AI</h1>
          <p>Complete React export with {pages.length} routed pages.</p>
        </div>
        <label className="search">
          <Search aria-hidden="true" size={17} />
          <span className="sr-only">Search pages</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all pages" />
        </label>
      </header>
      <section className="page-grid" aria-label="All exported pages">
        {visiblePages.map((page, index) => (
          <Link className="page-card" key={page.id} to={`/pages/${page.slug}`}>
            <span className="page-card__number">{String(index + 1).padStart(3, "0")}</span>
            <strong>{page.name}</strong>
            <span>{page.generatedName}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}

function PageViewer() {
  const { slug } = useParams();
  const page = pages.find((item) => item.slug === slug);
  if (!page) return <Navigate replace to="/" />;

  return (
    <main className="viewer">
      <header className="viewer__bar">
        <Link to="/" className="viewer__back">← All pages</Link>
        <strong>{page.name}</strong>
        <a href={`/entries/${page.slug}/index.html`} target="_blank" rel="noreferrer">
          Open standalone <ExternalLink aria-hidden="true" size={14} />
        </a>
      </header>
      <iframe title={page.name} src={`/entries/${page.slug}/index.html`} />
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Directory />} />
      <Route path="/pages/:slug" element={<PageViewer />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
