import { DollarSign, RefreshCw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';

function textValue(value: unknown) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

export function LuluBudgets() {
  const [query, setQuery] = useState('');
  const { items, loading, error, refresh } = useLiveRecords('ad_budgets');

  const visibleItems = useMemo(
    () =>
      items.filter((record) =>
        `${record.name} ${record.description ?? ''} ${record.status} ${textValue(record.data?.platform)} ${textValue(record.data?.budget)}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const trackedPlatforms = new Set(
    items.map((record) => textValue(record.data?.platform)).filter(Boolean),
  ).size;

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">
        Loading live budgets...
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
              Advertising / Budgets
            </p>
            <h1 className="mt-2 text-3xl font-bold">Budgets</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Verified budget records from the connected workspace.
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
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Budget records</p>
            <p className="mt-2 text-2xl font-semibold">{items.length}</p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Platforms</p>
            <p className="mt-2 text-2xl font-semibold">{trackedPlatforms}</p>
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
                placeholder="Search live budget records"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>

          {items.length === 0 ? (
            <div className="p-10 text-center">
              <DollarSign className="mx-auto mb-4 text-muted-foreground" size={30} />
              <h2 className="text-xl font-semibold">No live advertising budgets yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Connect a verified advertising platform before budget records appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Budget</th>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Budget value</th>
                    <th className="px-4 py-3">Spend</th>
                    <th className="px-4 py-3">Utilization</th>
                    <th className="px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visibleItems.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-3 font-medium">{record.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {textValue(record.data?.platform) || '—'}
                      </td>
                      <td className="px-4 py-3">{record.status || 'Recorded'}</td>
                      <td className="px-4 py-3">
                        {textValue(record.data?.budget) || textValue(record.valueAmount) || '—'}{' '}
                        {record.currency ?? ''}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {textValue(record.data?.spend) || '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {textValue(record.data?.utilization) || '—'}
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

export default LuluBudgets;
