import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, BadgeCheck, Megaphone, Rocket, Sparkles } from "lucide-react";
import { adSpendApi, type AdSpendOverview } from "../../api/adspend";
import { useLuluApp } from "../../api/LuluAppContext";
import { useLiveRecords } from "../../api/useLiveRecords";
import type { WorkspaceRecord } from "../../api/records";
import { WorkspaceSurfaceShell } from "../../components/WorkspaceSurfaceShell";
import { navigateApp, routes } from "../../routing";

function newest(records: WorkspaceRecord[]) {
  return records.slice().sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
}

export default function GrowthPage() {
  const { selectedWorkspace } = useLuluApp();
  const campaigns = useLiveRecords("marketing_campaigns", "limit=20");
  const content = useLiveRecords("marketing_content", "limit=20");
  const ads = useLiveRecords("ad_campaigns", "limit=20");
  const attribution = useLiveRecords("ad_attributions", "limit=20");
  const [adSpend, setAdSpend] = useState<AdSpendOverview | null>(null);

  useEffect(() => {
    if (!selectedWorkspace) return;
    let active = true;
    void adSpendApi.overview(selectedWorkspace.id).then((response) => {
      if (active) setAdSpend(response.data);
    }).catch(() => {
      if (active) setAdSpend(null);
    });
    return () => { active = false; };
  }, [selectedWorkspace]);

  const recent = useMemo(
    () => newest([...campaigns.items, ...content.items, ...ads.items, ...attribution.items]).slice(0, 8),
    [ads.items, attribution.items, campaigns.items, content.items],
  );
  const loading = campaigns.loading || content.loading || ads.loading || attribution.loading;
  const error = campaigns.error || content.error || ads.error || attribution.error;
  const activeCampaigns = [...campaigns.items, ...ads.items].filter((item) => !/completed|closed|archived|stopped/i.test(item.status)).length;
  const wallet = adSpend?.wallet;

  return (
    <WorkspaceSurfaceShell activeSlug="growth">
      <main className="page-frame min-h-screen bg-[var(--background)] px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Autonomous growth</p>
              <h1 className="text-3xl font-semibold tracking-tight">Growth</h1>
              <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">
                Lulu researches, creates, publishes, distributes and optimizes every organic and paid growth loop continuously.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
              <BadgeCheck size={15} /> Autonomous execution active
            </div>
          </header>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={Rocket} label="Active campaigns" value={String(activeCampaigns)} helper="Organic and paid" />
            <Metric icon={Sparkles} label="Content assets" value={String(content.total)} helper="Created from live brand signals" />
            <Metric icon={Activity} label="Measured outcomes" value={String(attribution.total)} helper="Continuously attributed" />
            <Metric
              icon={Megaphone}
              label="Advertising funds"
              value={new Intl.NumberFormat("en-US", { style: "currency", currency: "CNY", maximumFractionDigits: 2 }).format(wallet?.availableAmount ?? 0)}
              helper={wallet?.adsEnabled ? "Campaigns may launch automatically" : "Add funds to enable paid execution"}
            />
          </section>

          {!wallet?.adsEnabled && (
            <section className="flex flex-col gap-4 rounded-2xl border border-violet-300/50 bg-gradient-to-r from-violet-500/10 to-cyan-400/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">Paid growth is ready</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">Lulu starts campaigns as soon as prepaid advertising funds are confirmed. No campaign approval is required.</p>
              </div>
              <button type="button" onClick={() => navigateApp(routes.app.adSpend)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)]">
                Add advertising funds <ArrowUpRight size={15} />
              </button>
            </section>
          )}

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div><p className="eyebrow">Live outcomes</p><h2 className="mt-1 text-xl font-semibold">What Lulu is growing now</h2></div>
              <span className="rounded-full bg-[var(--secondary)] px-3 py-1.5 text-xs text-[var(--muted-foreground)]">No approval queue</span>
            </div>
            {loading && recent.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted-foreground)]">Loading live growth outcomes…</p>
            ) : error ? (
              <p className="mt-6 rounded-xl border border-dashed border-rose-300 p-6 text-sm text-rose-700">{error}</p>
            ) : recent.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted-foreground)]">Lulu is preparing the first growth cycle from your brand and knowledge signals.</p>
            ) : (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {recent.map((record) => (
                  <article key={`${record.resourceType}:${record.id}`} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/60 p-4">
                    <div className="flex items-start justify-between gap-3"><strong className="text-sm">{record.name}</strong><span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-[11px] text-[var(--muted-foreground)]">{record.status || "Active"}</span></div>
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--muted-foreground)]">{record.description || "Lulu is executing and measuring this growth action."}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </WorkspaceSurfaceShell>
  );
}

function Metric({ icon: Icon, label, value, helper }: { icon: typeof Activity; label: string; value: string; helper: string }) {
  return <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"><div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><Icon size={16}/>{label}</div><p className="mt-3 text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">{helper}</p></article>;
}
