import { useMemo, useState } from 'react';
import { ArrowRight, RefreshCw, Search, Users } from 'lucide-react';
import type { WorkspaceRecord } from '../../../../api/records';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { WorkspaceIntelligencePanel } from '../../../../components/WorkspaceIntelligencePanel';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { pageLinkProps } from '../../../../routing';

type CrmRow = {
  id: string;
  label: string;
  type: string;
  status: string;
  detail: string;
  amount?: string | null;
  updatedAt: string;
};

const crmQuickLinks = [
  { id: 'sturdy-month-1562', title: 'Contacts', detail: 'Review people and account owners.' },
  { id: 'swift-hour-7844', title: 'Leads', detail: 'Check inbound pipeline and qualification.' },
  { id: 'smartly-shade-4619', title: 'Deals', detail: 'Open deal stages and pipeline value.' },
  { id: 'deeply-noon-9539', title: 'Tasks', detail: 'See pending follow-ups and due work.' },
  { id: 'sunnily-gulf-7520', title: 'Segments', detail: 'Open customer groups and targeting.' },
  { id: 'gracefully-storm-2649', title: 'Customer Intelligence', detail: 'Inspect AI-backed account signals.' },
];

function cardMetric(label: string, value: string, detail: string) {
  return (
    <article key={label} className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </article>
  );
}

function toCrmRows(resourceType: string, items: WorkspaceRecord[]): CrmRow[] {
  return items.map((record) => ({
    id: record.id,
    label: record.name,
    type: resourceType,
    status: record.status || 'unknown',
    detail: record.description ?? record.stage ?? 'No additional detail',
    amount: record.valueAmount,
    updatedAt: record.updatedAt,
  }));
}

export function LuluCrmPage() {
  const { selectedWorkspace } = useLuluApp();
  const [query, setQuery] = useState('');
  const contacts = useLiveRecords('crm_contacts');
  const leads = useLiveRecords('crm_leads');
  const deals = useLiveRecords('crm_deals');
  const tasks = useLiveRecords('crm_tasks');

  const loading = contacts.loading || leads.loading || deals.loading || tasks.loading;
  const error = contacts.error || leads.error || deals.error || tasks.error;
  const workspaceId = selectedWorkspace?.id ?? null;

  const openDeals = useMemo(
    () => deals.items.filter((record) => !/won|lost|closed/i.test(record.status || '')),
    [deals.items],
  );
  const priorityTasks = useMemo(
    () => tasks.items.filter((record) => /overdue|due|open|pending/i.test(`${record.status} ${record.stage ?? ''}`)),
    [tasks.items],
  );
  const rows = useMemo(() => {
    const merged = [
      ...toCrmRows('Contact', contacts.items),
      ...toCrmRows('Lead', leads.items),
      ...toCrmRows('Deal', deals.items),
      ...toCrmRows('Task', tasks.items),
    ];
    const normalized = query.trim().toLowerCase();
    const filtered = !normalized
      ? merged
      : merged.filter((row) => `${row.label} ${row.type} ${row.status} ${row.detail}`.toLowerCase().includes(normalized));
    return filtered.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
  }, [contacts.items, deals.items, leads.items, query, tasks.items]);

  const refreshAll = async () => {
    await Promise.all([contacts.refresh(), leads.refresh(), deals.refresh(), tasks.refresh()]);
  };

  if (loading && rows.length === 0) {
    return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live CRM data…</main>;
  }

  if (error && rows.length === 0) {
    return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{error}</main>;
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-foreground">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">CRM</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">CRM Overview</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Keep the CRM workspace focused on pipeline health, open follow-ups and the records that need attention now.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refreshAll()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-secondary"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </header>

        <WorkspaceIntelligencePanel workspaceId={workspaceId} />

        <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cardMetric('Contacts', String(contacts.total), 'Tracked contact records')}
          {cardMetric('Leads', String(leads.total), 'Current lead records')}
          {cardMetric('Open deals', String(openDeals.length), 'Deals not won or closed')}
          {cardMetric('Needs follow-up', String(priorityTasks.length), 'Tasks marked open, due or overdue')}
        </section>

        <section className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Quick access</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Open a CRM workspace</h2>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground">
              <Search size={15} className="text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search live CRM records"
                className="w-full min-w-0 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {crmQuickLinks.map((item) => (
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
              <Users size={16} className="text-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Live CRM records</h2>
            </div>
            {rows.length === 0 ? (
              <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                No CRM records match the current view yet.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    <tr>
                      <th className="pb-3 font-medium">Record</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Detail</th>
                      <th className="pb-3 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.slice(0, 12).map((row) => (
                      <tr key={row.id}>
                        <td className="py-3 font-medium text-foreground">{row.label}</td>
                        <td className="py-3 text-muted-foreground">{row.type}</td>
                        <td className="py-3 text-foreground">{row.status}</td>
                        <td className="py-3 text-muted-foreground">{row.detail}</td>
                        <td className="py-3 text-muted-foreground">{new Date(row.updatedAt).toLocaleString()}</td>
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
              <h2 className="mt-1 text-lg font-semibold text-foreground">Priority queue</h2>
              <div className="mt-4 space-y-3">
                {priorityTasks.slice(0, 5).map((record) => (
                  <article key={record.id} className="rounded-lg border border-border bg-background/50 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-foreground">{record.name}</strong>
                      <span className="text-xs text-muted-foreground">{record.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{record.description ?? record.stage ?? 'No additional detail'}</p>
                  </article>
                ))}
                {priorityTasks.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                    No urgent CRM tasks are marked yet.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Pipeline</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Open deals</h2>
              <div className="mt-4 space-y-3">
                {openDeals.slice(0, 5).map((record) => (
                  <article key={record.id} className="rounded-lg border border-border bg-background/50 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-foreground">{record.name}</strong>
                      <span className="text-xs text-muted-foreground">{record.valueAmount ?? '—'} {record.currency ?? ''}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{record.stage ?? record.status}</p>
                  </article>
                ))}
                {openDeals.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                    No open deals are currently in the live CRM records.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
