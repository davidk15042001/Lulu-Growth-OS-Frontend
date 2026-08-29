import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Activity, AlertTriangle, BarChart3, Bot, Check, ChevronDown, Download, Globe2, LayoutDashboard, Menu, MoreHorizontal, Plus, RefreshCw, Search, Send, Settings, Shield, Sparkles, Target, TrendingUp, Users, X, Zap } from 'lucide-react';
import { getFriendlyErrorMessage } from '../../../../api/client';
import { onboardingApi } from '../../../../api/onboarding';
import { getSelectedWorkspaceId } from '../../../../api/session';
import { useLiveRecords } from '../../../../api/useLiveRecords';
const nav = [{
  g: 'WORKSPACE',
  i: [['Dashboard', LayoutDashboard], ['Company Profile', Users]]
}, {
  g: 'MARKETING',
  i: [['Strategy', Target], ['Campaigns', BarChart3], ['Keywords', Search], ['Content', Zap], ['Audiences', Users], ['Analytics', Activity], ['Competitors', Globe2], ['SEO', Activity], ['GEO', Globe2], ['AEO', Zap]]
}, {
  g: 'AI',
  i: [['AI Assistant', Bot], ['AI Agents', Sparkles], ['AI Insights', Activity]]
}, {
  g: 'CRM',
  i: [['Contacts', Users], ['Companies', Users], ['Leads', Target], ['Deals', BarChart3]]
}, {
  g: 'SETTINGS',
  i: [['Settings', Settings]]
}];
const competitors: Array<Record<string, any>> = [];
const kpis: any[][] = [];
const movements: string[] = [];
const insights = ['HubSpot gaining visibility in DACH enterprise segment — your core strategic market.', 'Salesforce AI product messaging overlaps your primary positioning.', 'Your strongest differentiation is a unified AI operating system; competitors focus on point solutions.', 'AI business intelligence has limited competitor content coverage — a content acquisition opportunity.'];
const actions = ['Strengthen enterprise positioning to create distance from HubSpot SMB focus.', 'Develop content for the AI business intelligence topic cluster.', 'Review growing Salesforce AI feature overlap and assess strategic response.', 'Increase GEO and AEO coverage for queries where competitors are more visible.'];
type CompetitorRow = {
  n: string;
  l: string;
  c: string;
  type: string;
  market: string;
  pos: string;
  growth: string;
  vis: string;
  pri: string;
  intel: string;
  when: string;
};
const Pill = ({
  children,
  tone = 'gray'
}: {
  children: ReactNode;
  tone?: string;
}) => <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${tone === 'amber' ? 'bg-chart-1/10 text-[var(--chart-1)]' : tone === 'green' ? 'bg-chart-4/10 text-chart-4' : tone === 'red' ? 'bg-chart-5/10 text-chart-5' : tone === 'purple' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{children}</span>;
export const LuluCompetitors = () => {
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('List');
  const [landscapeMetric, setLandscapeMetric] = useState('market-position');
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [autoTriggered, setAutoTriggered] = useState(false);
  const workspaceId = getSelectedWorkspaceId();
  const { items: competitorRecords, loading: competitorsLoading, error: competitorsError, refresh } = useLiveRecords('marketing_competitors');
  const landscapeMetricOptions = [{
    value: 'market-position',
    label: 'Market Position'
  }, {
    value: 'search-visibility',
    label: 'Search Visibility'
  }, {
    value: 'strategic-strength',
    label: 'Strategic Strength'
  }];
  const selectedLandscapeMetric = landscapeMetricOptions.find(option => option.value === landscapeMetric)?.label ?? 'Market Position';
  const getCompetitorField = (record: typeof competitorRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const metricColumnLabel = landscapeMetric === 'market-position' ? 'Competitive Position' : landscapeMetric === 'search-visibility' ? 'Visibility' : 'Priority';
  const normalizeRank = (value: string, weights: Record<string, number>) => weights[value.trim().toLowerCase()] ?? 0;
  const sortCompetitorsByLandscapeMetric = (left: CompetitorRow, right: CompetitorRow) => {
    if (landscapeMetric === 'search-visibility') {
      return normalizeRank(right.vis, {
        dominant: 5,
        very_high: 4,
        high: 3,
        medium: 2,
        low: 1
      }) - normalizeRank(left.vis, {
        dominant: 5,
        very_high: 4,
        high: 3,
        medium: 2,
        low: 1
      }) || left.n.localeCompare(right.n);
    }
    if (landscapeMetric === 'strategic-strength') {
      return normalizeRank(right.pri, {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1
      }) - normalizeRank(left.pri, {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1
      }) || left.n.localeCompare(right.n);
    }
    return normalizeRank(right.pos, {
      stronger: 3,
      parity: 2,
      equal: 2,
      weaker: 1
    }) - normalizeRank(left.pos, {
      stronger: 3,
      parity: 2,
      equal: 2,
      weaker: 1
    }) || left.n.localeCompare(right.n);
  };
  const liveCompetitors: CompetitorRow[] = competitorRecords.map(record => ({ n: getCompetitorField(record, 'name') || 'Competitor', l: (getCompetitorField(record, 'name') || 'C').slice(0, 1).toUpperCase(), c: 'var(--foreground)', type: getCompetitorField(record, 'type') || 'Unknown', market: getCompetitorField(record, 'market') || '—', pos: getCompetitorField(record, 'position') || 'Unknown', growth: getCompetitorField(record, 'growth') || '—', vis: getCompetitorField(record, 'visibility') || '—', pri: getCompetitorField(record, 'priority') || '—', intel: getCompetitorField(record, 'intelligence') || '—', when: getCompetitorField(record, 'updated') || record.updatedAt || '—' }));
  const visibleCompetitors = competitorsLoading ? [] : liveCompetitors;
  const filtered = visibleCompetitors.filter(x => x.n.toLowerCase().includes(query.toLowerCase()));
  const metricSortedCompetitors = [...filtered].sort(sortCompetitorsByLandscapeMetric);
  const discoverCompetitors = useCallback(async (automatic = false) => {
    if (!workspaceId) {
      setActionError('Es ist aktuell kein Workspace ausgewählt.');
      return;
    }
    setActionBusy(true);
    setActionError(null);
    if (!automatic) setActionMessage(null);
    try {
      await onboardingApi.discoverCompetitors(workspaceId);
      await refresh();
      setActionMessage(automatic ? 'Die 10 größten Wettbewerber wurden automatisch ermittelt.' : 'Die 10 größten Wettbewerber wurden aktualisiert.');
    } catch (cause) {
      setActionError(getFriendlyErrorMessage(cause, 'Die Wettbewerber konnten nicht automatisch ermittelt werden.'));
    } finally {
      setActionBusy(false);
    }
  }, [refresh, workspaceId]);
  useEffect(() => {
    if (!workspaceId || competitorsLoading || competitorsError || visibleCompetitors.length > 0 || autoTriggered) return;
    setAutoTriggered(true);
    void discoverCompetitors(true);
  }, [autoTriggered, competitorsError, competitorsLoading, discoverCompetitors, visibleCompetitors.length, workspaceId]);
  return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]" style={{
    fontFamily: 'Poppins'
  }}>
<aside className={`${mobile ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-30 w-[220px] flex-col bg-[var(--sidebar)] px-3 py-5 lg:flex`}><div className="mb-7 flex items-center gap-2 px-2"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)] font-bold text-primary-foreground">L</span><strong className="text-foreground">Lulu AI</strong></div><LuluSectionNavigation activeId="smartly-shore-1468" /><div className="flex items-center gap-2 border-t border-[var(--muted-foreground)] pt-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs text-foreground">DM</span><span className="text-xs text-foreground">Workspace owner</span><MoreHorizontal size={15} className="ml-auto text-muted-foreground" /></div></aside>
<main className="lg:ml-[220px]"><header className="flex h-14 items-center justify-between bg-[var(--sidebar)] px-4 text-foreground sm:px-7"><div className="flex items-center gap-3"><button className="lg:hidden" onClick={() => setMobile(true)} aria-label="Open navigation"><Menu size={19} /></button><span className="text-xs text-muted-foreground">Marketing</span><span className="text-muted-foreground">/</span><span className="text-xs">Competitors</span></div><div className="flex items-center gap-2"><button onClick={() => void refresh()} className="hidden text-xs text-foreground sm:block"><RefreshCw size={14} className="mr-1 inline" />Refresh</button><button className="hidden text-xs text-foreground md:block"><Download size={14} className="mr-1 inline" />Export</button><button onClick={() => void discoverCompetitors()} disabled={actionBusy} className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)] disabled:opacity-60"><Sparkles size={13} className="mr-1 inline" />{actionBusy ? 'Analysiere...' : 'Top 10 aktualisieren'}</button></div></header>
<div className="px-4 py-6 sm:px-8">{competitorsError && <div role="alert" className="mb-5 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Competitor data could not be loaded. Check marketing competitor records and try again.</div>}{actionError && <div role="alert" className="mb-5 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">{actionError}</div>}{actionMessage && <div className="mb-5 rounded-lg border border-chart-4/30 bg-chart-4/10 px-4 py-3 text-sm text-chart-4">{actionMessage}</div>}{!competitorsLoading && !competitorsError && visibleCompetitors.length === 0 && <div className="mb-5 rounded-xl border border-dashed border-[var(--border)] bg-card px-4 py-4 text-sm text-muted-foreground">Lulu AI ermittelt hier automatisch die 10 größten Wettbewerber auf Basis deines Workspace-Profils. Eigene Wettbewerber müssen nicht manuell hinzugefügt werden.</div>}<div className="flex flex-wrap items-end justify-between gap-4"><div><Pill tone="green">Active</Pill><h1 className="mt-2 text-3xl font-bold tracking-tight">Competitors</h1><p className="mt-1 text-sm text-[var(--muted-foreground)]">Die 10 größten Wettbewerber werden automatisch aus deinem Geschäftsprofil und Markt-Kontext ermittelt.</p></div><button onClick={() => void discoverCompetitors()} disabled={actionBusy} className="rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">{actionBusy ? 'Analysiere...' : 'Top 10 automatisch ermitteln'}</button></div>
<section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">{kpis.map(([title, value, sub, icon]) => <article key={title} className="rounded-xl border border-[var(--border)] bg-card p-4"><div className="flex justify-between text-xs text-muted-foreground"><span>{title}</span><span className="text-[var(--foreground)]">{icon === 'TrendingUp' ? <TrendingUp size={15} /> : icon === 'AlertTriangle' ? <AlertTriangle size={15} /> : icon === 'Sparkles' ? <Sparkles size={15} /> : icon === 'RefreshCw' ? <RefreshCw size={15} /> : icon === 'Target' ? <Target size={15} /> : <Users size={15} />}</span></div><strong className="mt-2 block text-2xl">{value}</strong><p className="mt-1 text-[11px] text-muted-foreground">{sub}</p></article>)}</section>
<div className="mt-6 flex flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-card p-3"><div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-[var(--border)] px-3"><Search size={15} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search competitors, markets, industries" className="w-full py-2 text-xs outline-none" /></div>{['Competitor Type', 'Market', 'Status', 'Competitive Position', 'Growth', 'Intelligence Availability', 'Strategic Priority'].map(x => <button key={x} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs">{x}<ChevronDown size={12} className="ml-2 inline" /></button>)}<button className="px-2 text-xs text-[var(--foreground)]">Clear Filters</button></div>
<section className="mt-6 rounded-xl border border-[var(--border)] bg-card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Competitive Landscape</h2><p className="mt-1 text-xs text-muted-foreground">Market visibility and strategic strength</p></div><label className="relative inline-flex items-center"><select value={landscapeMetric} onChange={e => setLandscapeMetric(e.target.value)} aria-label="Competitive landscape metric" className="appearance-none rounded-lg border border-[var(--border)] bg-card px-3 py-2 pr-8 text-xs text-foreground">{landscapeMetricOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown size={12} className="pointer-events-none absolute right-3 text-muted-foreground" /></label></div><svg viewBox="0 0 900 380" className="mt-4 h-[380px] w-full" role="img" aria-label={`Competitive landscape bubble chart for ${selectedLandscapeMetric}`}><path d="M75 20V330H850" fill="none" stroke="var(--border)" /><path d="M75 95H850M75 170H850M75 245H850" stroke="var(--border)" strokeDasharray="5 5" /><text x="410" y="365" fill="var(--muted-foreground)" fontSize="12">Market Visibility · Low → High</text><text transform="rotate(-90 18 190)" x="18" y="190" fill="var(--muted-foreground)" fontSize="12">Strategic Strength · Weak → Strong</text><circle cx="650" cy="190" r="48" fill="var(--chart-1)" fillOpacity=".85" stroke="var(--chart-1)" strokeWidth="8" strokeOpacity=".18" /><circle cx="735" cy="70" r="42" fill="var(--chart-5)" /><circle cx="800" cy="95" r="36" fill="var(--chart-5)" /><circle cx="700" cy="145" r="28" fill="var(--chart-1)" /><circle cx="560" cy="165" r="25" fill="var(--chart-3)" /><circle cx="220" cy="145" r="18" fill="var(--border)" /><circle cx="460" cy="265" r="21" fill="var(--border)" /><circle cx="300" cy="275" r="24" fill="var(--chart-2)" /><g textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--muted-foreground)"><text x="650" y="195">Lulu AI</text><text x="735" y="75">HubSpot</text><text x="800" y="100">Salesforce</text><text x="700" y="150">Pipedrive</text><text x="560" y="170">Monday</text><text x="220" y="150">Zoho</text><text x="460" y="270">Freshworks</text><text x="300" y="280">Notion</text></g></svg><div className="flex flex-wrap gap-5 border-t pt-3 text-xs"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--primary)] text-primary-foreground" />Your Business</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-destructive" />Direct</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Indirect</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Emerging</span><span className="text-muted-foreground">{selectedLandscapeMetric} is AI Inferred · updated 1 hour ago <Pill tone="purple">AI Inferred</Pill></span></div></section>
<section className="mt-6 rounded-xl border border-[var(--border)] bg-card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Top 10 Competitors <Pill>{visibleCompetitors.length}</Pill></h2><p className="mt-1 text-xs text-muted-foreground">Sorted by {selectedLandscapeMetric} and highlighted in the table.</p></div><div className="flex gap-1">{['List', 'Grid', 'Comparison', 'Intelligence'].map(x => <button key={x} onClick={() => setView(x)} className={`border-b-2 px-3 py-2 text-xs ${view === x ? 'border-[var(--border)] font-semibold' : 'border-transparent text-foreground'}`}>{x}</button>)}</div></div>{view === 'List' ? <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[980px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase text-muted-foreground"><tr>{['Competitor', 'Type', 'Market', 'Competitive Position', 'Growth', 'Visibility', 'Priority', 'Intelligence', 'Updated', 'Actions'].map(h => <th key={h} className={`px-3 py-3 ${h === metricColumnLabel ? 'text-foreground' : ''}`}>{h}</th>)}</tr></thead><tbody>{metricSortedCompetitors.map(x => <tr key={x.n} className="border-t border-border"><td className="px-3 py-3"><span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-foreground" style={{
                      background: x.c
                    }}>{x.l}</span><b>{x.n}</b></td><td><Pill tone={x.type === 'Direct' ? 'red' : 'gray'}>{x.type}</Pill></td><td>{x.market}</td><td className={landscapeMetric === 'market-position' ? 'bg-secondary/40' : undefined}><Pill tone={x.pos === 'Stronger' ? 'red' : x.pos === 'Weaker' ? 'green' : 'amber'}>{x.pos}</Pill></td><td className={x.growth.startsWith('-') ? 'text-chart-5' : 'text-chart-4'}>{x.growth}</td><td className={landscapeMetric === 'search-visibility' ? 'bg-secondary/40 font-semibold' : undefined}>{x.vis}</td><td className={landscapeMetric === 'strategic-strength' ? 'bg-secondary/40' : undefined}><Pill tone={x.pri === 'Critical' ? 'red' : 'amber'}>{x.pri}</Pill></td><td><Pill tone={x.intel === 'Full' ? 'green' : x.intel === 'Partial' ? 'amber' : 'gray'}>{x.intel}</Pill></td><td>{x.when}</td><td className="whitespace-nowrap text-[var(--foreground)]">Open · Compare</td></tr>)}</tbody></table></div> : <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{metricSortedCompetitors.slice(0, 4).map(x => <article key={x.n} className="rounded-xl border p-4"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full font-bold text-foreground" style={{
                background: x.c
              }}>{x.l}</span><Pill tone="red">{x.type}</Pill><h3 className="mt-3 font-bold">{x.n}</h3><p className="text-xs text-muted-foreground">{x.n.toLowerCase()}.com · {x.market}</p><div className="mt-4 flex flex-wrap gap-1"><Pill tone="amber">{x.pos}</Pill><Pill tone="green">{x.growth}</Pill><Pill>{x.intel} Intelligence</Pill></div><div className="mt-5 border-t pt-3 text-xs text-[var(--foreground)]">Open · Compare</div></article>)}</div>}</section>
<article className="mt-6 rounded-xl bg-[var(--card)] p-6 text-foreground"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-xl font-bold text-primary-foreground">H</span><div><h2 className="text-xl font-bold">HubSpot</h2><p className="text-xs text-muted-foreground">hubspot.com · CRM and inbound marketing</p></div></div><div className="flex flex-wrap gap-2"><Pill tone="green">Active</Pill><Pill tone="red">Critical Priority</Pill><Pill tone="green">Full Intelligence</Pill><button className="rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground">Ask Lulu AI</button></div></div><div className="mt-5 flex flex-wrap gap-4 border-b border-border pb-3 text-xs text-muted-foreground">{['Overview', 'Position', 'Marketing', 'Content', 'SEO', 'GEO', 'AEO', 'Advertising', 'Audiences', 'Movements'].map((x, i) => <button key={x} className={i === 0 ? 'border-b-2 border-[var(--border)] pb-3 text-[var(--foreground)]' : ''}>{x}</button>)}</div><div className="mt-5 grid gap-4 xl:grid-cols-2"><div className="rounded-xl bg-card p-5 text-[var(--foreground)]"><h3 className="font-bold">Company overview</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">HubSpot is a leading CRM and inbound marketing platform serving SMB to mid-market teams.</p><p className="mt-4 text-xs font-semibold">Products</p><div className="mt-2 flex flex-wrap gap-2">{['CRM', 'Marketing Hub', 'Sales Hub', 'Service Hub'].map(x => <Pill key={x}>{x}</Pill>)}</div><p className="mt-4 text-xs text-muted-foreground">Company information <Pill tone="green">Observed</Pill> · updated Today</p></div><div className="rounded-xl bg-[var(--secondary)] p-5"><h3 className="font-bold"><Sparkles className="mr-2 inline text-[var(--foreground)]" size={16} />AI Competitive Insights <Pill tone="amber">AI-generated</Pill></h3>{insights.slice(0, 3).map((x, i) => <p key={x} className={`mt-4 border-l-2 ${i === 2 ? 'border-border' : 'border-chart-5'} pl-3 text-sm text-foreground`}>{x}</p>)}</div></div></article>
<section className="mt-6 grid gap-4 xl:grid-cols-2"><article className="rounded-xl border bg-card p-5"><h2 className="font-bold">Competitive Position: Your Business vs HubSpot</h2>{['Market Presence', 'Search Visibility', 'Content Presence', 'AI Visibility', 'Marketing Activity', 'Audience Reach'].map((x, i) => <div key={x} className="mt-4"><div className="flex justify-between text-xs"><span>{x}</span><Pill tone={i === 3 ? 'purple' : 'green'}>{i === 3 ? 'AI Inferred' : 'Observed'}</Pill></div><div className="mt-2 flex h-2 gap-1"><span className="ml-auto block rounded bg-[var(--primary)] text-primary-foreground" style={{
                  width: `${30 + i * 4}%`
                }} /><span className="block rounded bg-destructive" style={{
                  width: `${22 + (5 - i) * 5}%`
                }} /></div></div>)}</article><article className="rounded-xl border bg-card p-5"><h2 className="font-bold">Competitive Scorecard</h2>{['Market Presence', 'Search Visibility', 'Content Presence', 'AI Visibility', 'Marketing Activity', 'Audience Reach', 'Revenue', 'Advertising Spend'].map(x => <div key={x} className="flex items-center justify-between border-b py-3 text-xs"><span>{x}</span><span className="font-semibold">{x === 'Revenue' || x === 'Advertising Spend' ? <span className="text-muted-foreground">Not Available</span> : <><span className="text-foreground">Your 7</span> · <span className="text-chart-5">HubSpot 8</span> · <b className="text-chart-5">-1</b></>}</span></div>)}<p className="mt-3 text-[11px] text-muted-foreground">Scores marked Not Available cannot be reliably calculated from current data.</p></article></section>
<section className="mt-6 rounded-xl border bg-card p-5"><h2 className="text-lg font-bold">Market Positioning Comparison</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><div className="border-l-2 border-[var(--border)] p-4"><Pill tone="amber">Your Business</Pill><h3 className="mt-3 font-bold">The AI Business Operating System for enterprise growth.</h3><p className="mt-2 text-xs text-muted-foreground">Target: Enterprise businesses</p><ul className="mt-4 space-y-2 text-sm"><li>AI-native platform</li><li>End-to-end automation</li><li>Unified business intelligence</li></ul></div><div className="border-l-2 border-border p-4"><Pill>HubSpot</Pill><h3 className="mt-3 font-bold">The easy-to-use CRM for growing businesses.</h3><p className="mt-2 text-xs text-muted-foreground">Target: SMB to mid-market</p><ul className="mt-4 space-y-2 text-sm"><li>Ease of use</li><li>All-in-one marketing suite</li><li>Large partner ecosystem</li></ul></div></div><div className="mt-4 rounded-xl bg-[var(--secondary)] p-5 text-foreground"><h3 className="font-bold"><Sparkles className="mr-2 inline text-[var(--foreground)]" size={16} />AI Positioning Analysis <Pill tone="amber">AI-generated</Pill></h3><div className="mt-4 grid gap-4 md:grid-cols-3">{['Positioning Overlap · CRM automation overlap, with an AI-native advantage.', 'Differentiation Opportunity · Enterprise AI OS is not replicated by HubSpot.', 'Messaging Gap · Enterprise vs SMB awareness gap.'].map((x, i) => <p key={x} className={`border-l-2 ${i === 1 ? 'border-border' : i === 2 ? 'border-border' : 'border-[var(--border)]'} pl-3 text-xs text-foreground`}>{x}</p>)}</div></div></section>
<div className="mt-6 grid gap-4 xl:grid-cols-2"><section className="rounded-xl border bg-card p-5"><h2 className="font-bold">Marketing Strategy Comparison</h2>{[['Target Audiences', 'Enterprise Growth SME', 'SMB Mid-market RevOps'], ['Primary Channels', 'Organic Search · GEO · AEO', 'Content · Inbound · Paid · Partner'], ['Content Strategy', 'AI insights · business intelligence', 'Education · tutorials · case studies'], ['Search Strategy', 'SEO plus GEO/AEO focus', 'Heavy SEO · paid search'], ['Market Focus', 'DACH Enterprise', 'Global SMB-focused']].map(r => <div key={r[0]} className="grid grid-cols-3 border-b py-3 text-xs"><b>{r[0]}</b><span>{r[1]}</span><span className="text-muted-foreground">{r[2]}</span></div>)}<div className="mt-4 rounded-lg bg-[var(--secondary)] p-4 text-xs text-foreground"><Sparkles size={14} className="mr-2 inline text-[var(--foreground)]" />HubSpot invests significantly more in content volume. Your stronger AI search focus is defensible. <Pill tone="amber">Confidence High</Pill></div></section><section className="rounded-xl border bg-card p-5"><h2 className="font-bold">Products and Services Comparison</h2>{[['AI Business OS', '✓', '—'], ['CRM', '✓', '✓'], ['Marketing Automation', '✓', '✓'], ['AI Business Intelligence', '✓', '~'], ['Workflow Automation', '✓', '~'], ['Content Management', '~', '✓']].map(r => <div key={r[0]} className="grid grid-cols-3 border-b py-3 text-xs"><span>{r[0]}</span><b className="text-foreground">{r[1]}</b><b className={r[2] === '✓' ? 'text-foreground' : 'text-foreground'}>{r[2]}</b></div>)}<p className="mt-3 text-[11px] text-muted-foreground">Comparison based on publicly available information, AI Inferred where marked.</p></section></div>
<section className="mt-6 rounded-xl border-t-2 border-[var(--border)] bg-card p-5"><h2 className="font-bold">Advertising Intelligence <Pill tone="amber">Limited Data</Pill></h2><p className="mt-3 rounded-lg bg-secondary p-3 text-xs text-[var(--foreground)]">Advertising intelligence is based on publicly observable signals only. Lulu AI does not access private advertising accounts or confidential competitor data.</p><div className="mt-4 grid gap-3 md:grid-cols-4">{[['Advertising Activity', 'Active', 'Observed'], ['Active Channels', 'Google Ads · LinkedIn Ads · Meta Ads', 'Observed'], ['Creative Themes', 'Product workspaces · customer success · free trial', 'AI Inferred'], ['Landing Page Focus', 'Free trial signups · product tours', 'Observed']].map(x => <div key={x[0]} className="rounded-lg border p-3 text-xs"><p className="text-muted-foreground">{x[0]}</p><b className="mt-2 block">{x[1]}</b><Pill tone={x[2] === 'AI Inferred' ? 'purple' : 'green'}>{x[2]}</Pill></div>)}</div></section>
<section className="mt-6 grid gap-4 xl:grid-cols-2"><article className="rounded-xl bg-[var(--card)] p-5 text-foreground"><h2 className="font-bold"><Sparkles className="mr-2 inline text-[var(--chart-1)]" />Competitive Opportunities <Pill tone="amber">AI-generated · 18</Pill></h2>{['HubSpot weak enterprise AI positioning', 'AI business intelligence topic cluster gap', 'Pipedrive declining DACH visibility', 'GEO coverage gap in AI queries'].map((x, i) => <div key={x} className="mt-4 flex gap-3 border-b border-border pb-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--chart-1)] text-xs text-[var(--foreground)]">{88 - i * 6}</span><div><p className="text-sm">{x}</p><Pill tone={i === 2 ? 'green' : 'amber'}>{i === 2 ? 'Medium' : 'High'} impact</Pill><button className="ml-2 text-xs text-[var(--foreground)]">Create Task</button></div></div>)}</article><article className="rounded-xl border bg-card p-5"><h2 className="font-bold">Competitive Risks <Pill tone="red">7</Pill></h2>{['Salesforce AI features overlapping core Lulu AI positioning', 'HubSpot gaining search share on commercial keywords', 'Monday.com rapid growth creates indirect pressure', 'New competitor DACH market signals'].map((x, i) => <div key={x} className="mt-4 border-b pb-3"><Pill tone={i === 0 ? 'red' : i === 3 ? 'gray' : 'amber'}>{i === 0 ? 'Critical' : i === 3 ? 'Medium' : 'High'}</Pill><p className="mt-2 text-sm">{x}</p><button className="mt-2 text-xs text-[var(--chart-1)]">View Risk · Create Task</button></div>)}</article></section>
<section className="mt-6 rounded-xl bg-[var(--card)] p-5 text-foreground"><div className="flex flex-wrap justify-between gap-3"><h2 className="text-lg font-bold"><Sparkles className="mr-2 inline text-[var(--chart-1)]" />Lulu AI Competitive Insights <Pill tone="amber">AI-generated</Pill></h2><span className="text-xs text-muted-foreground">Analyzed 2 hours ago</span></div><div className="mt-5 grid gap-3 md:grid-cols-2">{insights.map((x, i) => <article key={x} className={`rounded-lg border-l-4 ${i < 2 ? 'border-chart-5' : 'border-border'} bg-[var(--background)] p-4`}><p className="text-sm text-foreground">{x}</p><div className="mt-3 flex gap-2"><Pill tone={i === 1 ? 'red' : 'green'}>Impact {i === 1 ? 'Critical' : 'High'}</Pill><Pill tone="amber">Confidence High</Pill></div></article>)}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground"><span>Sources: Website · SEO Data · GEO Monitoring · Content Analysis</span><button className="rounded-lg bg-[var(--primary)] px-4 py-2 font-semibold text-primary-foreground">Run Full Competitive Analysis</button></div></section>
<section className="mt-6 rounded-xl border bg-card p-5"><h2 className="text-lg font-bold"><Sparkles className="mr-2 inline text-[var(--foreground)]" />Lulu AI Recommendations</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{actions.map((x, i) => <article key={x} className="border-l-4 border-[var(--border)] p-4"><Pill tone={i === 0 ? 'red' : 'amber'}>{i === 0 ? 'Critical' : 'High'}</Pill><h3 className="mt-2 text-sm font-bold">{x}</h3><p className="mt-2 text-xs text-muted-foreground">Lulu AI found a material opportunity based on connected competitive intelligence.</p><button className="mt-4 rounded border px-3 py-2 text-xs">Review</button><button className="ml-2 rounded bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground">{i === 1 ? 'Create Content' : 'Create Task'}</button></article>)}</div><p className="mt-4 text-xs text-muted-foreground">Recommendations require your review and confirmation. No campaigns, budgets or strategic settings are changed automatically.</p></section>
<section className="mt-6 rounded-xl border bg-card p-5"><h2 className="font-bold">Competitor Movements <Pill tone="amber">AI Detected</Pill> <Pill>12</Pill></h2>{movements.map((x, i) => <div key={x} className="flex flex-wrap items-center gap-3 border-b py-3 text-xs"><Activity size={15} className="text-[var(--foreground)]" /><span className="min-w-[260px] flex-1">{x}</span><span className="text-muted-foreground">{i + 2}d ago</span><Pill tone={i === 1 || i === 2 || i === 3 ? 'red' : 'amber'}>{i === 1 ? 'High' : 'Medium'} impact</Pill><Pill tone={i === 0 || i === 2 ? 'amber' : 'green'}>{i === 0 || i === 2 ? 'AI Detected' : 'Observed'}</Pill><button className="text-[var(--foreground)]">View</button></div>)}</section>
<section className="mt-6 rounded-xl border bg-card p-5"><div className="flex justify-between"><h2 className="font-bold">Competitive Trends</h2><div className="flex gap-1">{['30D', '90D', '6M', '12M'].map(x => <button key={x} className="rounded px-3 py-1 text-xs hover:bg-secondary">{x}</button>)}</div></div><svg viewBox="0 0 900 160" className="mt-4 w-full" role="img" aria-label="Competitive trends line chart"><path d="M45 15V125H875" fill="none" stroke="var(--border)" /><path d="M45 45H875M45 75H875M45 105H875" stroke="var(--border)" strokeDasharray="4 4" /><path d="M45 112 C180 100 250 80 360 90 S590 48 875 30" fill="none" stroke="var(--foreground)" strokeWidth="3" /><path d="M45 100 C180 90 300 65 440 70 S650 38 875 45" fill="none" stroke="var(--foreground)" strokeDasharray="7 5" strokeWidth="2" /><path d="M45 118 C200 120 320 110 460 96 S700 75 875 70" fill="none" stroke="var(--foreground)" strokeDasharray="7 5" strokeWidth="2" /></svg><p className="text-xs text-muted-foreground">Trend data is AI Inferred from available market signals. <Pill tone="purple">AI Inferred</Pill></p></section>
<section className="mt-6 rounded-xl border bg-card p-5"><h2 className="font-bold">Automatic Competitor Discovery <Pill tone="amber">AI-generated</Pill></h2><p className="mt-2 text-sm text-muted-foreground">Lulu AI ermittelt automatisch die 10 größten Wettbewerber aus Branche, ICP, Angebot und Marktpositionierung deines Workspace.</p><div className="mt-4 rounded-xl bg-secondary p-4 text-sm text-foreground">Manuelles Hinzufügen ist hier deaktiviert. Wenn sich dein Markt oder dein Profil ändert, kannst du die Liste jederzeit neu berechnen lassen.</div><button onClick={() => void discoverCompetitors()} disabled={actionBusy} className="mt-4 rounded-lg border px-3 py-2 text-xs disabled:opacity-60">{actionBusy ? 'Analysiere...' : 'Top 10 neu berechnen'}</button><p className="mt-3 text-[11px] text-muted-foreground">Die Vorschläge basieren auf deinem gespeicherten Workspace-Kontext und werden als Live-Wettbewerberdaten übernommen.</p></section>
<section className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-6">{[['No Competitors Yet', 'Top 10 automatisch ermitteln'], ['No Competitors Found', 'Clear Filters'], ['Competitive Intelligence Is Limited', 'Top 10 aktualisieren'], ['Loading State', ''], ['Competitor Intelligence Could Not Be Loaded', 'Try Again'], ['Competitive Intelligence Restricted', '']].map(x => <article key={x[0]} className="rounded-xl border border-dashed bg-card p-4"><Shield size={17} className="text-[var(--foreground)]" /><h3 className="mt-3 text-sm font-bold">{x[0]}</h3><p className="mt-2 text-xs text-muted-foreground">{x[0].includes('Restricted') ? 'No data exposed beyond this message.' : 'Workspace state preview.'}</p>{x[1] && <button onClick={x[1].includes('Clear') ? undefined : () => void discoverCompetitors()} className="mt-4 rounded bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground">{x[1]}</button>}</article>)}</section>
</div></main>
</div>;
};

/* Lulu dropdown navigation — intentionally isolated from page content. */
const luluDropdownNavigation = [{
  "label": "Dashboard",
  "pages": [{
    "id": "fancily-leaf-1766",
    "label": "Executive Dashboard"
  }]
}, {
  "label": "AI",
  "pages": [{
    "id": "fresh-moon-5374",
    "label": "Assistant"
  }, {
    "id": "radiant-dusk-9079",
    "label": "Agents"
  }, {
    "id": "calmly-park-3313",
    "label": "Agent Marketplace"
  }, {
    "id": "rich-field-1880",
    "label": "Knowledge"
  }, {
    "id": "wondrously-second-5656",
    "label": "Actions"
  }, {
    "id": "sunny-moon-6307",
    "label": "Conversations"
  }, {
    "id": "sparkling-cave-8456",
    "label": "Activity"
  }]
}, {
  "label": "CRM",
  "pages": [{
    "id": "bright-meadow-7537",
    "label": "Overview"
  }, {
    "id": "sturdy-month-1562",
    "label": "Contacts"
  }, {
    "id": "kindly-pool-8785",
    "label": "Companies"
  }, {
    "id": "swift-hour-7844",
    "label": "Leads"
  }, {
    "id": "smartly-shade-4619",
    "label": "Deals"
  }, {
    "id": "calmly-cloud-9988",
    "label": "Pipeline"
  }, {
    "id": "cosmic-pool-1616",
    "label": "Activities"
  }, {
    "id": "deeply-noon-9539",
    "label": "Tasks"
  }, {
    "id": "sunnily-gulf-7520",
    "label": "Customer Segments"
  }, {
    "id": "gracefully-storm-2649",
    "label": "Customer Intelligence"
  }]
}, {
  "label": "Marketing",
  "pages": [{
    "id": "dreamily-soil-9290",
    "label": "Campaigns"
  }, {
    "id": "wondrous-cloud-1355",
    "label": "Content"
  }, {
    "id": "sparklingly-home-7386",
    "label": "Strategy"
  }, {
    "id": "gently-shade-2476",
    "label": "Campaigns"
  }, {
    "id": "kind-time-4492",
    "label": "Keywords"
  }, {
    "id": "smartly-shore-1468",
    "label": "Competitors"
  }, {
    "id": "breezily-wood-5980",
    "label": "Audiences"
  }, {
    "id": "breezy-shore-6734",
    "label": "Analytics"
  }]
}, {
  "label": "Advertising",
  "pages": [{
    "id": "finely-garden-9221",
    "label": "Overview"
  }, {
    "id": "friendly-path-8200",
    "label": "Analytics"
  }, {
    "id": "wise-brook-1762",
    "label": "Campaigns"
  }, {
    "id": "softly-second-7684",
    "label": "Audiences"
  }, {
    "id": "happily-storm-2690",
    "label": "Creatives"
  }, {
    "id": "sunny-minute-1092",
    "label": "Budgets"
  }, {
    "id": "zesty-grass-9196",
    "label": "AI Optimization"
  }, {
    "id": "nicely-shade-2637",
    "label": "Tracking & Attribution"
  }, {
    "id": "nice-moon-2056",
    "label": "AI Campaign & Ad Builder"
  }, {
    "id": "sunnily-peak-7188",
    "label": "Publishing & Approval Center"
  }, {
    "id": "solid-sand-5563",
    "label": "AI Experiments & A/B Testing"
  }, {
    "id": "sunny-summer-2293",
    "label": "Ad Accounts & Platform Management"
  }]
}, {
  "label": "Intelligence",
  "pages": [{
    "id": "serene-cloud-7079",
    "label": "Intelligence Overview"
  }, {
    "id": "tender-water-4095",
    "label": "Executive Overview"
  }, {
    "id": "swiftly-cliff-4166",
    "label": "Business Health"
  }, {
    "id": "sharp-current-9677",
    "label": "Growth"
  }, {
    "id": "proudly-river-8017",
    "label": "Revenue"
  }, {
    "id": "dreamily-shade-6192",
    "label": "Customers"
  }, {
    "id": "nicely-hour-4035",
    "label": "Sales"
  }, {
    "id": "eagerly-winter-3152",
    "label": "Marketing"
  }, {
    "id": "sharply-wood-4560",
    "label": "Advertising Intelligence"
  }, {
    "id": "bold-ocean-5847",
    "label": "Ecommerce Intelligence"
  }, {
    "id": "cozily-path-5612",
    "label": "Finance Intelligence"
  }, {
    "id": "gently-light-6089",
    "label": "Operations Intelligence"
  }, {
    "id": "cool-town-1727",
    "label": "Products Intelligence"
  }, {
    "id": "swift-pool-5077",
    "label": "KPI Explorer"
  }, {
    "id": "friendly-ground-4157",
    "label": "Reports"
  }, {
    "id": "brave-stream-5322",
    "label": "Comparisons"
  }, {
    "id": "sparkling-time-5280",
    "label": "Comparisons"
  }, {
    "id": "wispy-current-7490",
    "label": "Forecasts"
  }, {
    "id": "kindly-year-8981",
    "label": "Benchmarks"
  }, {
    "id": "serenely-creek-1765",
    "label": "Trends"
  }, {
    "id": "sparklingly-light-7230",
    "label": "Anomalies"
  }, {
    "id": "clever-soil-5964",
    "label": "Attribution"
  }, {
    "id": "serenely-week-1771",
    "label": "AI Insights"
  }, {
    "id": "daring-home-4179",
    "label": "AI Recommendations"
  }, {
    "id": "wispy-leaf-3778",
    "label": "AI Tasks"
  }, {
    "id": "happily-brook-7061",
    "label": "Opportunities"
  }, {
    "id": "radiant-cave-9340",
    "label": "Decisions"
  }, {
    "id": "boldly-time-5189",
    "label": "Risk Center"
  }, {
    "id": "proud-rain-4772",
    "label": "Activity Timeline"
  }]
}, {
  "label": "Ecommerce",
  "pages": [{
    "id": "smart-ocean-3898",
    "label": "Overview"
  }, {
    "id": "nice-year-6253",
    "label": "Stores"
  }, {
    "id": "nicely-ocean-1051",
    "label": "Products"
  }, {
    "id": "richly-forest-5832",
    "label": "Categories"
  }, {
    "id": "mightily-shore-7108",
    "label": "Orders"
  }, {
    "id": "fancy-ground-8040",
    "label": "Customers"
  }, {
    "id": "serenely-sand-9226",
    "label": "Carts"
  }, {
    "id": "smart-village-1099",
    "label": "Inventory"
  }, {
    "id": "dreamy-shade-5445",
    "label": "Returns & Refunds"
  }, {
    "id": "daring-brook-9034",
    "label": "Reviews"
  }, {
    "id": "sharply-sky-4161",
    "label": "Discounts & Promotions"
  }, {
    "id": "wildly-time-4260",
    "label": "Carts & Abandoned Carts"
  }, {
    "id": "quietly-moon-4186",
    "label": "Shipping"
  }, {
    "id": "merry-castle-3260",
    "label": "Payments"
  }, {
    "id": "merry-cliff-8846",
    "label": "Coupons"
  }, {
    "id": "safely-dawn-7731",
    "label": "Subscriptions"
  }, {
    "id": "purely-dusk-2409",
    "label": "Shipping & Fulfillment"
  }, {
    "id": "soft-hill-4757",
    "label": "Taxes"
  }, {
    "id": "safely-air-9334",
    "label": "Collections"
  }, {
    "id": "merry-land-6169",
    "label": "Store Performance"
  }]
}, {
  "label": "Finance",
  "pages": [{
    "id": "quietly-stone-4158",
    "label": "Overview"
  }, {
    "id": "breezy-soil-2475",
    "label": "Invoices"
  }, {
    "id": "tender-creek-3139",
    "label": "Offers & Quotes"
  }, {
    "id": "cool-rain-6499",
    "label": "Income"
  }, {
    "id": "richly-land-8084",
    "label": "Transactions"
  }, {
    "id": "calm-tide-3752",
    "label": "Payments"
  }, {
    "id": "zesty-earth-3938",
    "label": "Expenses"
  }, {
    "id": "bravely-bay-4544",
    "label": "Customers"
  }, {
    "id": "eager-minute-1586",
    "label": "Vendors"
  }, {
    "id": "fair-bridge-8618",
    "label": "Accounts"
  }, {
    "id": "soft-town-3284",
    "label": "Cash Flow"
  }, {
    "id": "wisely-gate-3183",
    "label": "Budgets"
  }, {
    "id": "sharp-morning-7310",
    "label": "Financial Planning"
  }, {
    "id": "sparklingly-city-3338",
    "label": "Reconciliation"
  }, {
    "id": "radiant-hour-5376",
    "label": "Recurring Revenue"
  }, {
    "id": "lucky-park-8649",
    "label": "Payouts"
  }, {
    "id": "vibrantly-second-9428",
    "label": "Financial Automation"
  }, {
    "id": "sturdy-week-3372",
    "label": "Taxes"
  }, {
    "id": "boldly-field-4971",
    "label": "Finance Settings"
  }]
}, {
  "label": "Sales",
  "pages": [{
    "id": "fine-park-8079",
    "label": "Overview"
  }, {
    "id": "softly-autumn-9038",
    "label": "Leads"
  }, {
    "id": "wildly-sun-6424",
    "label": "Opportunities"
  }, {
    "id": "deeply-month-1392",
    "label": "Deals"
  }, {
    "id": "sweet-evening-7753",
    "label": "Pipeline"
  }, {
    "id": "warmly-road-3804",
    "label": "Activities"
  }, {
    "id": "wondrously-gate-2200",
    "label": "Tasks"
  }, {
    "id": "sharp-cliff-6925",
    "label": "Customer Segments"
  }, {
    "id": "lovingly-shore-4782",
    "label": "Forecast"
  }, {
    "id": "rich-moon-9195",
    "label": "Reports"
  }, {
    "id": "lively-house-6788",
    "label": "Commissions"
  }, {
    "id": "gentle-cliff-7133",
    "label": "Goals"
  }, {
    "id": "kindly-morning-7115",
    "label": "Territories"
  }, {
    "id": "friendly-tower-1528",
    "label": "Lead Assignment"
  }]
}, {
  "label": "Website",
  "pages": [{
    "id": "lulu-website-portal-9012",
    "label": "Website"
  }, {
    "id": "website-wordpress-jetpack-9013",
    "label": "WordPress / Jetpack"
  }, {
    "id": "website-webflow-9014",
    "label": "Webflow"
  }, {
    "id": "website-pages-cms-9015",
    "label": "Pages & CMS"
  }, {
    "id": "website-posts-9016",
    "label": "Posts"
  }, {
    "id": "website-media-assets-9017",
    "label": "Media & Assets"
  }, {
    "id": "website-domains-9018",
    "label": "Domains"
  }, {
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
  }, {
    "id": "website-settings-9019",
    "label": "Website Settings"
  }]
}, {
  "label": "Settings",
  "pages": [{
    "id": "nicely-land-1864",
    "label": "Settings"
  }, {
    "id": "glad-coast-1428",
    "label": "Integrations"
  }, {
    "id": "pure-minute-5446",
    "label": "Billing"
  }]
}] as const;
function LuluSectionNavigation({
  activeId
}: {
  activeId: string;
}) {
  return <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Lulu AI sections">
    {luluDropdownNavigation.map(section => {
      const isActiveSection = section.pages.some(page => page.id === activeId);
      return <details key={section.label} open={isActiveSection} className="group rounded-lg">
        <summary className={`flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm transition [&::-webkit-details-marker]:hidden ${isActiveSection ? 'bg-secondary/15 font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
          <span data-lulu-section-soon={section.label !== "Website" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
          <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2 pb-1">
          {section.pages.map(page => {
            const isActivePage = page.id === activeId;
            return <a key={page.id} {...pageLinkProps(page.id)} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
              {!pageLinkProps(page.id)["data-lulu-soon"] ? null : null}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
import { pageLinkProps } from '../../../../routing';
