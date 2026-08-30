import { useMemo, useState } from 'react';
import { ArrowRight, RefreshCw, Search, Target } from 'lucide-react';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { WorkspaceIntelligencePanel } from '../../../../components/WorkspaceIntelligencePanel';
import { pageLinkProps } from '../../../../routing';

const advertisingQuickLinks = [
  { id: 'wise-brook-1762', title: 'Campaigns', detail: 'Open campaign records and approvals.' },
  { id: 'friendly-path-8200', title: 'Analytics', detail: 'Review performance and delivery.' },
  { id: 'softly-second-7684', title: 'Audiences', detail: 'Inspect targeting and audience ideas.' },
  { id: 'happily-storm-2690', title: 'Creatives', detail: 'Check assets and creative testing.' },
  { id: 'sunny-minute-1092', title: 'Budgets', detail: 'See pacing and budget constraints.' },
  { id: 'zesty-grass-9196', title: 'AI Optimization', detail: 'Open optimization suggestions.' },
];

function moneyTotal(values: Array<string | null | undefined>) {
  const total = values.reduce((sum, item) => sum + Number(item || 0), 0);
  if (!total) return '—';
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(total);
}

export function AdvertisingWorkspace() {
  const { selectedWorkspace } = useLuluApp();
  const [query, setQuery] = useState('');
  const campaigns = useLiveRecords('advertising_campaigns');
  const workspaceId = selectedWorkspace?.id ?? null;

  const filteredCampaigns = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return campaigns.items;
    return campaigns.items.filter((record) =>
      `${record.name} ${record.description ?? ''} ${record.status} ${record.stage ?? ''} ${record.tags.join(' ')}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [campaigns.items, query]);

  const activeCampaigns = useMemo(
    () => campaigns.items.filter((record) => /active|running|live/i.test(record.status || '')),
    [campaigns.items],
  );
  const reviewCampaigns = useMemo(
    () => campaigns.items.filter((record) => /paused|error|draft|review/i.test(`${record.status} ${record.stage ?? ''}`)),
    [campaigns.items],
  );

  if (campaigns.loading && campaigns.items.length === 0) {
    return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live advertising data…</main>;
  }

  if (campaigns.error && campaigns.items.length === 0) {
    return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{campaigns.error}</main>;
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-foreground">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Advertising</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">Advertising Overview</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              This workspace should stay centered on live campaign status, budget exposure and the items that need approval or optimization.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void campaigns.refresh()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-secondary"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </header>

        <WorkspaceIntelligencePanel workspaceId={workspaceId} />

        <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Campaigns</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{campaigns.total}</p>
            <p className="mt-1 text-xs text-muted-foreground">Tracked advertising records</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{activeCampaigns.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Campaigns currently marked live</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Needs review</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{reviewCampaigns.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Draft, paused or flagged records</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Tracked spend</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{moneyTotal(campaigns.items.map((record) => record.valueAmount))}</p>
            <p className="mt-1 text-xs text-muted-foreground">Summed from current live records</p>
          </article>
        </section>

        <section className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Quick access</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Open an advertising workspace</h2>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground">
              <Search size={15} className="text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search campaign records"
                className="w-full min-w-0 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {advertisingQuickLinks.map((item) => (
              <a
                key={item.id}
                {...pageLinkProps(item.id)}
                className="rounded-xl border border-border bg-background/50 p-4 transition hover:border-border hover:bg-background"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm text-foreground">{item.title}</strong>
                  <ArrowRight size={15} className="text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
              </a>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Live campaigns</h2>
            </div>
            {filteredCampaigns.length === 0 ? (
              <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                No campaign records match the current search.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    <tr>
                      <th className="pb-3 font-medium">Campaign</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Stage</th>
                      <th className="pb-3 font-medium">Value</th>
                      <th className="pb-3 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredCampaigns.slice(0, 12).map((record) => (
                      <tr key={record.id}>
                        <td className="py-3">
                          <div className="font-medium text-foreground">{record.name}</div>
                          <div className="text-xs text-muted-foreground">{record.description ?? 'No additional detail'}</div>
                        </td>
                        <td className="py-3 text-foreground">{record.status}</td>
                        <td className="py-3 text-muted-foreground">{record.stage ?? '—'}</td>
                        <td className="py-3 text-foreground">{record.valueAmount ?? '—'} {record.currency ?? ''}</td>
                        <td className="py-3 text-muted-foreground">{new Date(record.updatedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="grid gap-6">
            <section className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Needs attention</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Review queue</h2>
              <div className="mt-4 space-y-3">
                {reviewCampaigns.slice(0, 5).map((record) => (
                  <article key={record.id} className="rounded-lg border border-border bg-background/50 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-foreground">{record.name}</strong>
                      <span className="text-xs text-muted-foreground">{record.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{record.description ?? record.stage ?? 'No additional detail'}</p>
                  </article>
                ))}
                {reviewCampaigns.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                    No advertising records are currently flagged for review.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Latest activity</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Recent updates</h2>
              <div className="mt-4 space-y-3">
                {campaigns.items
                  .slice()
                  .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
                  .slice(0, 5)
                  .map((record) => (
                    <article key={record.id} className="rounded-lg border border-border bg-background/50 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <strong className="text-sm text-foreground">{record.name}</strong>
                        <span className="text-xs text-muted-foreground">{new Date(record.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{record.status}{record.stage ? ` · ${record.stage}` : ''}</p>
                    </article>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
