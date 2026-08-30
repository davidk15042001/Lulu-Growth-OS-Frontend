import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Bell, Bot, ChevronDown, CircleAlert, Download, Filter, Gauge, LayoutDashboard, Menu, MoreHorizontal, RefreshCw, Sparkles, Target, Users, X } from 'lucide-react';
type Tone = 'green' | 'amber' | 'red' | 'blue' | 'gray';
type Kpi = {
  label: string;
  value: string;
  delta: string;
  tone: Tone;
};
type Channel = {
  name: string;
  spend: string;
  revenue: string;
  roas: string;
  cac: string;
  conv: string;
  trend: 'up' | 'down' | 'flat';
  status: string;
};
const navGroups = [{
  label: 'WORKSPACE',
  items: ['Dashboard', 'Company Profile']
}, {
  label: 'MARKETING',
  items: ['Campaigns', 'Content', 'Audiences', 'SEO', 'GEO', 'AEO', 'Marketing Analytics']
}, {
  label: 'AI',
  items: ['AI Assistant', 'AI Agents', 'AI Insights']
}, {
  label: 'CRM',
  items: ['Contacts', 'Companies', 'Leads']
}, {
  label: 'SETTINGS',
  items: ['Integrations', 'Team']
}];
const kpis: Kpi[] = [];
const channels: Channel[] = [];
const campaigns = [['Summer Growth Campaign', 'Google', '9.2', '—'], ['Email Re-engagement', 'Email', '42.1', '—'], ['Brand Awareness Q1', 'Meta', '3.8', '—'], ['Product Launch Feb', 'Multi', '6.4', '—'], ['LinkedIn B2B', 'LinkedIn', '2.6', '—']];
const audiences: any[][] = [];
const revenueBars = [['Google Ads', 100, '—'], ['Email', 44, '—'], ['Organic', 25, '—'], ['Meta Ads', 37, '—'], ['LinkedIn', 13, '—'], ['Referral', 7, '—']];
const trends: any[][] = [];
const insights = ['Paid search generated 45.6% of attributed marketing revenue with above-average ROAS', 'Email channel shows strongest conversion efficiency at 40x ROAS and lowest CAC', 'A high-engagement audience shows conversion rate 3.2x business average', 'Marketing spend is growing slower than attributed revenue indicating improving efficiency'];
const geo = [['🇩🇪', 'Germany', '—', '5.2%', '—', 'up'], ['🇦🇹', 'Austria', '—', '4.8%', '—', 'up'], ['🇨🇭', 'Switzerland', '—', '6.1%', '—', 'flat'], ['🇬🇧', 'UK', '—', '3.2%', '—', 'flat'], ['🇳🇱', 'Netherlands', '—', '2.8%', '—', 'down']];
const efficiency = [['ROAS', '6.75', '+13.4%'], ['CAC', '—', '-8.2%'], ['Cost/Lead', '—', '-4.8%'], ['Cost/Conv', '—', '-6.1%']];
const actions = ['Investigate Meta Ads performance decline', 'Reallocate budget toward Email channel', 'Expand Google Ads coverage for high-value audience'];
const health: any[][] = [];
const campaignSpendRevenue: Array<Record<string, any>> = [];
const campaignAudienceBreakdown: Array<Record<string, any>> = [];
const campaignChannelSplit: Array<Record<string, any>> = [];
const campaignFunnel: Array<Record<string, any>> = [];
const campaignInsights: Array<Record<string, any>> = [];
const campaignRecommendedActions: Array<Record<string, any>> = [];
const toneClass: Record<Tone, string> = {
  green: 'text-[var(--foreground)]',
  amber: 'text-[var(--foreground)]',
  red: 'text-[var(--chart-5)]',
  blue: 'text-[var(--foreground)]',
  gray: 'text-[var(--foreground)]'
};
const CampaignDetailWorkspace = () => {
  return <section className="mt-8 border-t border-[var(--border)] pt-4" aria-labelledby="campaign-detail-heading">
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-[12px] text-[var(--muted-foreground)]"><ArrowLeft size={14} /><span>Campaigns / Summer Growth Campaign</span></div><div className="flex flex-wrap items-center gap-2"><button className="rounded-md px-2.5 py-1.5 text-[13px] text-[var(--muted-foreground)] hover:bg-[var(--card)]">Edit Campaign</button><button className="rounded-md px-2.5 py-1.5 text-[13px] text-[var(--muted-foreground)] hover:bg-[var(--card)]">Duplicate</button><button className="rounded-md px-2.5 py-1.5 text-[13px] text-[var(--muted-foreground)] hover:bg-[var(--card)]">Archive</button><button className="rounded-md bg-[var(--primary)] px-3 py-2 text-[13px] font-semibold text-[var(--primary-foreground)]"><Sparkles size={13} className="mr-1 inline" /><span>Ask Lulu AI</span></button></div></div>
    <article className="mb-4 rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] px-4 py-4 text-foreground sm:px-6"><div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"><div className="min-w-0"><h2 id="campaign-detail-heading" className="text-[18px] font-bold leading-tight text-foreground">Summer Growth Campaign</h2><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-secondary/15 px-2 py-1 text-[11px] font-medium text-[var(--foreground)]">Google Ads</span><span className="rounded-full bg-[var(--muted)] px-2 py-1 text-[11px] font-medium text-[var(--foreground)]">Display</span></div><div className="mt-3 flex flex-wrap items-center gap-2"><span className="rounded-full bg-chart-4/15 px-2 py-1 text-[11px] font-semibold text-[var(--chart-4)]">Active</span><span className="text-[12px] text-[var(--muted-foreground)]">Running since Not available</span><span className="text-[12px] text-[var(--muted-foreground)]">•</span><span className="text-[12px] text-[var(--muted-foreground)]">Ends Not available</span></div></div><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="grid grid-cols-2 overflow-hidden rounded-lg border border-[var(--muted-foreground)] sm:grid-cols-4 sm:border-0"><div className="border-b border-r border-[var(--muted-foreground)] p-3 sm:border-b-0"><strong className="block text-[24px] font-bold leading-none text-[var(--foreground)]">—</strong><span className="mt-1 block text-[11px] text-[var(--muted-foreground)]">Total Spend</span></div><div className="border-b border-[var(--muted-foreground)] p-3 sm:border-b-0 sm:border-r"><strong className="block text-[24px] font-bold leading-none text-[var(--foreground)]">—</strong><span className="mt-1 block text-[11px] text-[var(--muted-foreground)]">Revenue</span></div><div className="border-r border-[var(--muted-foreground)] p-3"><strong className="block text-[24px] font-bold leading-none text-[var(--foreground)]">9.2x</strong><span className="mt-1 block text-[11px] text-[var(--muted-foreground)]">ROAS</span></div><div className="p-3"><strong className="block text-[22px] font-semibold leading-none text-foreground">1,284</strong><span className="mt-1 block text-[11px] text-[var(--muted-foreground)]">Conversions</span></div></div><button className="inline-flex items-center justify-center rounded-md border border-[var(--border)] px-3 py-2 text-[13px] font-semibold text-[var(--foreground)]"><Sparkles size={13} className="mr-1" /><span>Run AI Analysis</span></button></div></div></article>
    <div className="mb-4 grid gap-4 xl:grid-cols-[55fr_42fr]"><article className="rounded-xl border border-[var(--border)] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-[14px] font-semibold">Spend vs Revenue</h3><div className="flex gap-1 text-[11px]"><button className="rounded bg-[var(--secondary)] px-2 py-1 font-semibold text-[var(--foreground)]">30D</button><button className="rounded px-2 py-1 text-[var(--muted-foreground)] hover:bg-[var(--card)]">90D</button><button className="rounded px-2 py-1 text-[var(--muted-foreground)] hover:bg-[var(--card)]">All</button></div></div><div className="mt-3 h-[160px] w-full"><svg viewBox="0 0 560 170" className="h-full w-full" role="img" aria-label="Grouped weekly bar chart comparing campaign spend and revenue"><path d="M44 18H548M44 54H548M44 90H548M44 126H548" stroke="var(--border)" /><g fill="var(--muted-foreground)" fontSize="10"><text x="6" y="130">0</text><text x="2" y="94">20K</text><text x="2" y="58">35K</text><text x="2" y="22">50K</text></g>{campaignSpendRevenue.map((bar, index) => <g key={bar.label}><rect x={58 + index * 61} y={126 - bar.spend} width="20" height={bar.spend} rx="4" fill="var(--chart-1)" /><rect x={82 + index * 61} y={126 - bar.revenue} width="20" height={bar.revenue} rx="4" fill="var(--chart-4)" /><text x={58 + index * 61} y="152" fill="var(--muted-foreground)" fontSize="10">{bar.label}</text></g>)}</svg></div><div className="mt-2 flex gap-4 text-[11px] text-[var(--muted-foreground)]"><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-[var(--primary)] text-primary-foreground" />Spend</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-[var(--primary)] text-primary-foreground" />Revenue</span></div><div className="mt-4 grid gap-3 border-t border-[var(--border)] pt-3 text-[13px] sm:grid-cols-3 sm:divide-x sm:divide-[var(--foreground)]"><p><span className="text-[var(--muted-foreground)]">Total Spend </span><strong>—</strong></p><p className="sm:pl-3"><span className="text-[var(--muted-foreground)]">Total Revenue </span><strong>—</strong></p><p className="sm:pl-3"><span className="text-[var(--muted-foreground)]">Net Return </span><strong className="text-[var(--foreground)]">—</strong></p></div></article><article className="rounded-xl border border-[var(--border)] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-[14px] font-semibold">Daily Performance</h3><div className="flex flex-wrap gap-1 text-[11px]"><button className="rounded px-2 py-1 text-[var(--muted-foreground)] hover:bg-[var(--card)]">Impressions</button><button className="rounded px-2 py-1 text-[var(--muted-foreground)] hover:bg-[var(--card)]">Clicks</button><button className="rounded bg-[var(--secondary)] px-2 py-1 font-semibold text-[var(--foreground)]">Conv</button><button className="rounded px-2 py-1 text-[var(--muted-foreground)] hover:bg-[var(--card)]">ROAS</button></div></div><div className="mt-3 h-[160px] w-full"><svg viewBox="0 0 480 170" className="h-full w-full" role="img" aria-label="Daily conversion trend rising from 28 to 68 conversions"><path d="M34 18H468M34 54H468M34 90H468M34 126H468" stroke="var(--border)" /><path d="M34 118 C60 105 78 116 104 98 S150 102 176 82 S220 88 246 70 S290 74 316 58 S352 68 384 40 S430 62 468 32 L468 126 L34 126Z" fill="var(--chart-1)" fillOpacity=".08" /><path d="M34 118 C60 105 78 116 104 98 S150 102 176 82 S220 88 246 70 S290 74 316 58 S352 68 384 40 S430 62 468 32" fill="none" stroke="var(--chart-1)" strokeWidth="3" /><circle cx="384" cy="40" r="4" fill="var(--chart-1)" /><rect x="315" y="10" width="118" height="42" rx="8" fill="var(--muted-foreground)" /><text x="326" y="25" fill="var(--border)" fontSize="10">Not available</text><text x="326" y="38" fill="var(--chart-1)" fontSize="10">68 conversions</text><text x="326" y="49" fill="var(--border)" fontSize="9">ROAS 11.2x</text><g fill="var(--muted-foreground)" fontSize="10"><text x="5" y="130">0</text><text x="0" y="94">40</text><text x="0" y="22">80</text><text x="34" y="154">Not available</text><text x="110" y="154">Not available</text><text x="188" y="154">Not available</text><text x="264" y="154">Not available</text><text x="342" y="154">Not available</text><text x="420" y="154">Not available</text></g></svg></div><div className="mt-4 grid gap-2 border-t border-[var(--border)] pt-3 text-[12px] text-[var(--muted-foreground)] sm:grid-cols-3"><p><strong className="text-[var(--foreground)]">7-day avg</strong> 44 conv/day</p><p><strong className="text-[var(--foreground)]">Peak day</strong> Not available (68 conv)</p><p><strong className="text-[var(--foreground)]">Trend</strong> <span className="text-[var(--chart-4)]">— vs prev period</span></p></div></article></div>
    <div className="mb-4 grid gap-4 xl:grid-cols-2"><article className="rounded-xl border border-[var(--border)] p-4"><h3 className="text-[14px] font-semibold">Audience Breakdown</h3><div className="mb-12 mt-4 flex h-6 overflow-hidden rounded-full bg-[var(--secondary)]">{campaignAudienceBreakdown.map(segment => <span key={segment.name} className="flex items-center justify-center text-[10px] font-semibold text-foreground" style={{
            backgroundColor: segment.color,
            width: `${segment.percent}%`
          }}>{segment.percent}%</span>)}</div><div>{campaignAudienceBreakdown.map(segment => <div key={segment.name} className="flex h-9 items-center gap-2 border-b border-[var(--border)] last:border-0"><span className="h-2.5 w-2.5 rounded-full" style={{
              backgroundColor: segment.color
            }} /><span className="min-w-0 flex-1 truncate text-[13px] font-medium">{segment.name}</span><span className="text-[12px] text-[var(--muted-foreground)]">{segment.spend}</span><span className="text-[12px] font-semibold text-[var(--foreground)]">{segment.conversion}</span><strong className="w-20 text-right text-[12px]">{segment.revenue}</strong></div>)}</div><div className="mt-4 inline-flex items-center rounded-full bg-[var(--secondary)] px-2.5 py-1 text-[11px] text-[var(--foreground)]"><Sparkles size={12} className="mr-1" /><span>High-Value Customers generating 3.2x avg ROAS</span></div></article><article className="rounded-xl border border-[var(--border)] p-4"><h3 className="mb-3 text-[14px] font-semibold">Channel Split</h3>{campaignChannelSplit.map(channel => <div key={channel.name} className="mb-3"><div className="flex flex-wrap items-center gap-3"><Target size={16} className="text-[var(--muted-foreground)]" /><strong className="min-w-[120px] text-[13px] font-medium">{channel.name}</strong><span className="text-[12px] text-[var(--muted-foreground)]">Spend {channel.spend}</span><span className="text-[12px] text-[var(--muted-foreground)]">Revenue {channel.revenue}</span><span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${channel.tone === 'green' ? 'bg-chart-4/10 text-[var(--chart-4)]' : 'bg-secondary text-[var(--chart-1)]'}`}>ROAS {channel.roas}</span></div><span className="mt-2 block h-2 rounded-full bg-[var(--secondary)]"><span className="block h-full rounded-full bg-[var(--primary)] text-primary-foreground" style={{
              width: `${channel.percent}%`
            }} /></span><span className="mt-1 block text-right text-[11px] text-[var(--muted-foreground)]">{channel.percent}%</span></div>)}<div className="mb-3 mt-3 border-t border-[var(--border)]" /><div><h4 className="mb-2 text-[13px] font-semibold">Campaign Funnel</h4>{campaignFunnel.map(stage => <div key={stage.stage} className="mb-2"><div className="mb-1 flex items-center gap-2 text-[12px]"><span className="w-24">{stage.stage}</span><strong>{stage.value}</strong>{stage.rate && <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[11px] text-[var(--foreground)]">{stage.rate}</span>}</div><span className="block h-2.5 rounded-full bg-[var(--primary)] text-primary-foreground"><span className="block h-full rounded-full bg-[var(--primary)] text-primary-foreground" style={{
                width: `${stage.width}%`
              }} /></span></div>)}</div></article></div>
    <article className="mb-4 rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] px-4 py-5 text-foreground sm:px-6"><div className="flex flex-wrap items-center gap-2"><Sparkles size={16} className="text-[var(--foreground)]" /><h3 className="text-[15px] font-semibold text-foreground">Lulu AI Campaign Insights</h3><span className="rounded bg-[var(--primary)]/15 px-1.5 py-1 text-[10px] text-[var(--foreground)]">AI-generated</span><span className="ml-auto text-[12px] text-[var(--muted-foreground)]">Analyzed 1h ago</span></div><div className="mt-4 grid gap-3 md:grid-cols-2">{campaignInsights.map(insight => <div key={insight.impact} className="rounded-lg bg-[var(--secondary)] p-3"><p className="text-[12px] leading-5 text-[var(--foreground)]">{insight.text}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-[var(--primary)]/15 px-2 py-1 text-[10px] text-[var(--foreground)]">Confidence: {insight.confidence}</span><span className="rounded-full bg-[var(--muted)] px-2 py-1 text-[10px] text-[var(--foreground)]">Impact: {insight.impact}</span></div><div className="mt-3 flex justify-between gap-2 text-[11px] text-[var(--muted-foreground)]"><span>Supporting data: {insight.source}</span><span>Data source · 1h ago</span></div></div>)}</div></article>
    <article className="mb-4 rounded-xl border border-[var(--border)] p-4"><div className="mb-3 flex items-center gap-2"><h3 className="text-[14px] font-semibold">Recommended Actions</h3><span className="rounded bg-secondary px-1.5 py-1 text-[10px] text-[var(--foreground)]">Lulu AI</span></div><div className="grid gap-3 lg:grid-cols-3">{campaignRecommendedActions.map(action => <div key={action.title} className={`rounded-lg border-l-[3px] ${action.border} bg-[var(--card)] p-3`}><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${action.priorityClass}`}>{action.priority}</span><h4 className="mt-3 text-[13px] font-semibold">{action.title}</h4><p className="mt-2 text-[12px] leading-5 text-[var(--muted-foreground)]">{action.description}</p><div className="mt-3 flex flex-wrap gap-2 text-[11px]"><span className="rounded-full bg-card px-2 py-1 text-[var(--foreground)]">Impact: {action.impact}</span><span className="rounded-full bg-card px-2 py-1 text-[var(--muted-foreground)]">Est. Time: {action.time}</span></div><div className="mt-3 flex flex-wrap gap-2"><button className="rounded bg-[var(--primary)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--primary-foreground)]">Create Task</button><button className="rounded px-2.5 py-1.5 text-[11px] text-[var(--foreground)] hover:bg-[var(--secondary)]">{action.secondary}</button></div></div>)}</div></article>
  </section>;
};
export const LuluMarketingAnalytics = () => {
  const { items, loading, error } = useLiveRecords('marketing_campaigns');
  return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans"><aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-[var(--sidebar)] p-4 lg:flex"><div className="mb-5 flex items-center gap-3 px-2 py-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</div><span className="font-semibold text-foreground">Lulu AI</span></div><LuluSectionNavigation activeId="breezy-shore-6734" /></aside><main className="px-5 py-7 sm:px-8 lg:ml-60 lg:px-12"><header><nav className="text-xs text-[var(--muted-foreground)]">Marketing <span className="mx-2">/</span> Marketing Analytics</nav><div className="mt-4 flex flex-wrap items-start justify-between gap-6"><div><h1 className="text-[28px] font-bold tracking-[-.03em]">Marketing Analytics</h1><p className="mt-1 max-w-2xl text-[15px] text-[var(--muted-foreground)]">Live marketing performance from connected workspace sources.</p></div><button className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground"><Sparkles size={13} className="mr-1 inline" /> Ask Lulu AI</button></div></header><section className="mt-10 flex min-h-[520px] items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-card p-10 text-center"><div><Target className="mx-auto text-[var(--muted-foreground)]" size={32} />{loading ? <h2 className="mt-4 text-xl font-semibold">Loading live marketing data…</h2> : error ? <h2 className="mt-4 text-xl font-semibold">Marketing data could not be loaded</h2> : <h2 className="mt-4 text-xl font-semibold">No marketing data available yet</h2>}<p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">{items.length ? `${items.length} live records are available.` : 'Connect marketing platforms to populate campaigns, channels, audiences and performance analysis. No example metrics are displayed.'}</p></div></section></main></div>;
};
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
  "label": "Website & Commerce",
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
    "id": "daring-brook-9034",
    "label": "Reviews"
  }, {
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
          <span data-lulu-section-soon={section.label !== "Website & Commerce" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
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
