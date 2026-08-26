import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { GlobalLanguageSwitcher } from "../i18n/GlobalLanguageSwitcher";
import { pagePath } from "../routing";
import { availablePages } from "./page-registry";

export function Directory() {
  const [query, setQuery] = useState("");
  const visiblePages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return availablePages;
    return availablePages.filter((page) =>
      `${page.name} ${page.generatedName}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <>
      <main className="directory">
        <header className="directory__header">
          <div>
            <p className="eyebrow">Lulu AI application routes</p>
            <h1>Lulu AI</h1>
            <p>All {availablePages.length} pages are connected to the application router.</p>
          </div>
          <label className="search">
            <Search aria-hidden="true" size={17} />
            <span className="sr-only">Search pages</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search all pages"
            />
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
      <GlobalLanguageSwitcher />
    </>
  );
}
