import { Gauge, RefreshCw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';

function textValue(value: unknown) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

export function LuluKpiExplorer() {
  const [query, setQuery] = useState('');
  const { items, loading, error, refresh } = useLiveRecords('kpis');

  const visibleItems = useMemo(
    () =>
      items.filter((record) =>
        `${record.name} ${record.description ?? ''} ${record.status} ${record.stage ?? ''} ${textValue(record.data?.source)}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const categories = new Set(
    items.map((record) => record.stage || textValue(record.data?.category)).filter(Boolean),
  ).size;

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">
        Loading live KPIs...
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">
        {error}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[.18em] text-muted-foreground">
              Intelligence / KPI Explorer
            </p>
            <h1 className="mt-2 text-3xl font-bold">KPI Explorer</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Verified KPI definitions from the connected workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">KPIs</p>
            <p className="mt-2 text-2xl font-semibold">{items.length}</p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Categories</p>
            <p className="mt-2 text-2xl font-semibold">{categories}</p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Visible</p>
            <p className="mt-2 text-2xl font-semibold">{visibleItems.length}</p>
          </article>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <label className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2">
              <Search size={15} className="text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search live KPIs"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>

          {items.length === 0 ? (
            <div className="p-10 text-center">
              <Gauge className="mx-auto mb-4 text-muted-foreground" size={30} />
              <h2 className="text-xl font-semibold">No verified KPIs yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Connect and analyze a verified data source before KPIs appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">KPI</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visibleItems.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-3 font-medium">{record.name}</td>
                      <td className="px-4 py-3">{record.status || 'Recorded'}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {record.stage || textValue(record.data?.category) || '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {textValue(record.data?.source) || '—'}
                      </td>
                      <td className="max-w-md px-4 py-3 text-muted-foreground">
                        {record.description || '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(record.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default LuluKpiExplorer;
