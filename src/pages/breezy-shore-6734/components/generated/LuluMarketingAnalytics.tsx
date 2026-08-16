import { useState } from 'react';
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
const kpis: Kpi[] = [{
  label: 'Marketing Revenue',
  value: '€842,400',
  delta: '+18.2%',
  tone: 'green'
}, {
  label: 'Marketing Spend',
  value: '€124,800',
  delta: '+4.1%',
  tone: 'gray'
}, {
  label: 'ROAS',
  value: '6.75',
  delta: '+13.4%',
  tone: 'amber'
}, {
  label: 'CAC',
  value: '€48.20',
  delta: '-8.2%',
  tone: 'gray'
}, {
  label: 'Leads',
  value: '3,842',
  delta: '+22.1%',
  tone: 'blue'
}, {
  label: 'Customers',
  value: '1,284',
  delta: '+16.8%',
  tone: 'gray'
}, {
  label: 'Conv. Rate',
  value: '4.8%',
  delta: '+0.6pp',
  tone: 'amber'
}, {
  label: 'Marketing ROI',
  value: '574%',
  delta: '+68pp',
  tone: 'green'
}];
const channels: Channel[] = [{
  name: 'Google Ads',
  spend: '€52,400',
  revenue: '€384,200',
  roas: '7.33',
  cac: '€44.20',
  conv: '5.2%',
  trend: 'up',
  status: 'Active'
}, {
  name: 'Meta Ads',
  spend: '€28,600',
  revenue: '€142,800',
  roas: '4.99',
  cac: '€68.40',
  conv: '3.1%',
  trend: 'down',
  status: 'Review'
}, {
  name: 'Email',
  spend: '€4,200',
  revenue: '€168,400',
  roas: '40.1',
  cac: '€18.20',
  conv: '8.4%',
  trend: 'up',
  status: 'Active'
}, {
  name: 'Organic Search',
  spend: '€0',
  revenue: '€94,200',
  roas: '—',
  cac: '€0',
  conv: '6.2%',
  trend: 'up',
  status: 'Active'
}, {
  name: 'LinkedIn',
  spend: '€18,400',
  revenue: '€48,200',
  roas: '2.62',
  cac: '€84.20',
  conv: '2.1%',
  trend: 'flat',
  status: 'Stable'
}, {
  name: 'Referral',
  spend: '€0',
  revenue: '€24,800',
  roas: '—',
  cac: '€0',
  conv: '3.8%',
  trend: 'up',
  status: 'Active'
}];
const campaigns = [['Summer Growth Campaign', 'Google', '9.2', '€184,200'], ['Email Re-engagement', 'Email', '42.1', '€84,400'], ['Brand Awareness Q1', 'Meta', '3.8', '€68,200'], ['Product Launch Feb', 'Multi', '6.4', '€142,800'], ['LinkedIn B2B', 'LinkedIn', '2.6', '€48,200']];
const audiences = [['High-Value Customers', '12,840', '11.4%', '€44'], ['Engaged Subscribers', '38,420', '8.4%', '€18'], ['High-Intent Visitors', '9,210', '4.2%', '€62'], ['New Leads', '2,840', '1.2%', '€94']];
const revenueBars = [['Google Ads', 100, '€384K'], ['Email', 44, '€168K'], ['Organic', 25, '€94K'], ['Meta Ads', 37, '€143K'], ['LinkedIn', 13, '€48K'], ['Referral', 7, '€25K']];
const trends = [['Paid search revenue increased significantly (+18.2%) over 30 days', 'High Impact', 'green'], ['Meta Ads conversion rate declined (-31%) in last 48h', 'High Impact', 'red'], ['Email ROAS improved to 40x (+12%)', 'Medium Impact', 'green'], ['Customer acquisition cost declining overall (-8.2%)', 'Medium Impact', 'green']];
const insights = ['Paid search generated 45.6% of attributed marketing revenue with above-average ROAS', 'Email channel shows strongest conversion efficiency at 40x ROAS and lowest CAC', 'A high-engagement audience shows conversion rate 3.2x business average', 'Marketing spend is growing slower than attributed revenue indicating improving efficiency'];
const geo = [['🇩🇪', 'Germany', '€428K', '5.2%', '€42', 'up'], ['🇦🇹', 'Austria', '€184K', '4.8%', '€48', 'up'], ['🇨🇭', 'Switzerland', '€142K', '6.1%', '€38', 'flat'], ['🇬🇧', 'UK', '€48K', '3.2%', '€68', 'flat'], ['🇳🇱', 'Netherlands', '€24K', '2.8%', '€82', 'down']];
const efficiency = [['ROAS', '6.75', '+13.4%'], ['CAC', '€48.20', '-8.2%'], ['Cost/Lead', '€32.50', '-4.8%'], ['Cost/Conv', '€97.20', '-6.1%']];
const actions = ['Investigate Meta Ads performance decline', 'Reallocate budget toward Email channel', 'Expand Google Ads coverage for high-value audience'];
const health = [['Google Ads', 92, 'green'], ['Email', 96, 'green'], ['Meta', 48, 'amber'], ['LinkedIn', 62, 'amber'], ['Organic', 84, 'green']];
const campaignSpendRevenue = [{
  label: 'Jan W1',
  spend: 22,
  revenue: 35,
  spendLabel: '€12K',
  revenueLabel: '€31K'
}, {
  label: 'Jan W2',
  spend: 31,
  revenue: 58,
  spendLabel: '€18K',
  revenueLabel: '€48K'
}, {
  label: 'Jan W3',
  spend: 35,
  revenue: 66,
  spendLabel: '€21K',
  revenueLabel: '€57K'
}, {
  label: 'Jan W4',
  spend: 39,
  revenue: 75,
  spendLabel: '€24K',
  revenueLabel: '€64K'
}, {
  label: 'Feb W1',
  spend: 42,
  revenue: 82,
  spendLabel: '€27K',
  revenueLabel: '€72K'
}, {
  label: 'Feb W2',
  spend: 46,
  revenue: 90,
  spendLabel: '€30K',
  revenueLabel: '€78K'
}, {
  label: 'Feb W3',
  spend: 48,
  revenue: 96,
  spendLabel: '€32K',
  revenueLabel: '€84K'
}, {
  label: 'Feb W4',
  spend: 44,
  revenue: 88,
  spendLabel: '€28K',
  revenueLabel: '€72K'
}];
const campaignAudienceBreakdown = [{
  name: 'High-Value Customers',
  percent: 38,
  color: 'var(--foreground)',
  spend: '38% spend',
  conversion: '14.2% conv',
  revenue: '€148,200'
}, {
  name: 'Engaged Subscribers',
  percent: 28,
  color: 'var(--foreground)',
  spend: '28% spend',
  conversion: '9.8% conv',
  revenue: '€94,800'
}, {
  name: 'High-Intent Visitors',
  percent: 22,
  color: 'var(--foreground)',
  spend: '22% spend',
  conversion: '6.4% conv',
  revenue: '€84,200'
}, {
  name: 'Other',
  percent: 12,
  color: 'var(--muted-foreground)',
  spend: '12% spend',
  conversion: '2.1% conv',
  revenue: '€57,000'
}];
const campaignChannelSplit = [{
  name: 'Google Search',
  percent: 68,
  spend: '€84,800',
  revenue: '€284,200',
  roas: '9.8x',
  tone: 'green'
}, {
  name: 'Google Display',
  percent: 32,
  spend: '€40,000',
  revenue: '€100,000',
  roas: '2.5x',
  tone: 'amber'
}];
const campaignFunnel = [{
  stage: 'Impressions',
  value: '1,840,000',
  rate: '',
  width: 100
}, {
  stage: 'Clicks',
  value: '28,400',
  rate: '1.54% CTR',
  width: 70
}, {
  stage: 'Visitors',
  value: '24,200',
  rate: '85.2%',
  width: 55
}, {
  stage: 'Leads',
  value: '2,480',
  rate: '10.2%',
  width: 32
}, {
  stage: 'Conversions',
  value: '1,284',
  rate: '51.8%',
  width: 18
}];
const campaignInsights = [{
  text: 'High-Value Customers segment is generating 3.8x the ROAS of the Other segment — increasing budget allocation to this audience could significantly improve campaign efficiency.',
  confidence: 'High',
  impact: 'Revenue',
  source: 'Audience cohort · Conversion path'
}, {
  text: 'Google Search significantly outperforms Display with 9.8x vs 2.5x ROAS. Display spend could be reallocated without proportional revenue loss.',
  confidence: 'High',
  impact: 'Efficiency',
  source: 'Channel attribution · Spend pacing'
}, {
  text: 'Conversion rate peaks mid-week (Tuesday–Thursday). Dayparting optimization could improve average CPA by an estimated 12–18%.',
  confidence: 'Medium',
  impact: 'CAC',
  source: 'Hourly conversion data · Bid history'
}, {
  text: 'Campaign trajectory is positive. At current performance, projected end-of-campaign revenue is €428,000–€462,000, exceeding initial target by 14–22%.',
  confidence: 'Medium',
  impact: 'Forecast',
  source: 'Pacing model · Revenue forecast'
}];
const campaignRecommendedActions = [{
  priority: 'High',
  border: 'border-l-[var(--border)]',
  priorityClass: 'bg-[var(--secondary)] text-[var(--foreground)]',
  title: 'Reallocate budget from Display to Search',
  description: 'Google Search generates 3.9x higher ROAS. Shifting 20% of Display budget to Search could increase attributed revenue by an estimated €18,000–€24,000.',
  impact: 'High',
  time: 'Immediate',
  secondary: 'Open Campaign'
}, {
  priority: 'Medium',
  border: 'border-l-[var(--border)]',
  priorityClass: 'bg-secondary text-[var(--foreground)]',
  title: 'Increase High-Value Customer audience allocation',
  description: 'This audience converts at 14.2% vs campaign average 4.8%. Increasing bid adjustments could improve overall campaign efficiency.',
  impact: 'Medium',
  time: '1–2 days',
  secondary: 'View Audience'
}, {
  priority: 'Medium',
  border: 'border-l-[var(--border)]',
  priorityClass: 'bg-secondary text-[var(--foreground)]',
  title: 'Implement dayparting optimization',
  description: 'Performance data shows Tuesday–Thursday peak conversion windows. Scheduling ads during peak periods may reduce CPA by 12–18%.',
  impact: 'Medium',
  time: '1 day',
  secondary: 'Analyze'
}];
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
    <article className="mb-4 rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] px-4 py-4 text-foreground sm:px-6"><div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"><div className="min-w-0"><h2 id="campaign-detail-heading" className="text-[18px] font-bold leading-tight text-foreground">Summer Growth Campaign</h2><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-secondary/15 px-2 py-1 text-[11px] font-medium text-[var(--foreground)]">Google Ads</span><span className="rounded-full bg-[var(--muted)] px-2 py-1 text-[11px] font-medium text-[var(--foreground)]">Display</span></div><div className="mt-3 flex flex-wrap items-center gap-2"><span className="rounded-full bg-chart-4/15 px-2 py-1 text-[11px] font-semibold text-[var(--chart-4)]">Active</span><span className="text-[12px] text-[var(--muted-foreground)]">Running since Jan 4</span><span className="text-[12px] text-[var(--muted-foreground)]">•</span><span className="text-[12px] text-[var(--muted-foreground)]">Ends Mar 31</span></div></div><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="grid grid-cols-2 overflow-hidden rounded-lg border border-[var(--muted-foreground)] sm:grid-cols-4 sm:border-0"><div className="border-b border-r border-[var(--muted-foreground)] p-3 sm:border-b-0"><strong className="block text-[24px] font-bold leading-none text-[var(--foreground)]">€124,800</strong><span className="mt-1 block text-[11px] text-[var(--muted-foreground)]">Total Spend</span></div><div className="border-b border-[var(--muted-foreground)] p-3 sm:border-b-0 sm:border-r"><strong className="block text-[24px] font-bold leading-none text-[var(--foreground)]">€384,200</strong><span className="mt-1 block text-[11px] text-[var(--muted-foreground)]">Revenue</span></div><div className="border-r border-[var(--muted-foreground)] p-3"><strong className="block text-[24px] font-bold leading-none text-[var(--foreground)]">9.2x</strong><span className="mt-1 block text-[11px] text-[var(--muted-foreground)]">ROAS</span></div><div className="p-3"><strong className="block text-[22px] font-semibold leading-none text-foreground">1,284</strong><span className="mt-1 block text-[11px] text-[var(--muted-foreground)]">Conversions</span></div></div><button className="inline-flex items-center justify-center rounded-md border border-[var(--border)] px-3 py-2 text-[13px] font-semibold text-[var(--foreground)]"><Sparkles size={13} className="mr-1" /><span>Run AI Analysis</span></button></div></div></article>
    <div className="mb-4 grid gap-4 xl:grid-cols-[55fr_42fr]"><article className="rounded-xl border border-[var(--border)] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-[14px] font-semibold">Spend vs Revenue</h3><div className="flex gap-1 text-[11px]"><button className="rounded bg-[var(--secondary)] px-2 py-1 font-semibold text-[var(--foreground)]">30D</button><button className="rounded px-2 py-1 text-[var(--muted-foreground)] hover:bg-[var(--card)]">90D</button><button className="rounded px-2 py-1 text-[var(--muted-foreground)] hover:bg-[var(--card)]">All</button></div></div><div className="mt-3 h-[160px] w-full"><svg viewBox="0 0 560 170" className="h-full w-full" role="img" aria-label="Grouped weekly bar chart comparing campaign spend and revenue"><path d="M44 18H548M44 54H548M44 90H548M44 126H548" stroke="var(--border)" /><g fill="var(--muted-foreground)" fontSize="10"><text x="6" y="130">0</text><text x="2" y="94">20K</text><text x="2" y="58">35K</text><text x="2" y="22">50K</text></g>{campaignSpendRevenue.map((bar, index) => <g key={bar.label}><rect x={58 + index * 61} y={126 - bar.spend} width="20" height={bar.spend} rx="4" fill="var(--chart-1)" /><rect x={82 + index * 61} y={126 - bar.revenue} width="20" height={bar.revenue} rx="4" fill="var(--chart-4)" /><text x={58 + index * 61} y="152" fill="var(--muted-foreground)" fontSize="10">{bar.label}</text></g>)}</svg></div><div className="mt-2 flex gap-4 text-[11px] text-[var(--muted-foreground)]"><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-[var(--primary)] text-primary-foreground" />Spend</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-[var(--primary)] text-primary-foreground" />Revenue</span></div><div className="mt-4 grid gap-3 border-t border-[var(--border)] pt-3 text-[13px] sm:grid-cols-3 sm:divide-x sm:divide-[var(--foreground)]"><p><span className="text-[var(--muted-foreground)]">Total Spend </span><strong>€124,800</strong></p><p className="sm:pl-3"><span className="text-[var(--muted-foreground)]">Total Revenue </span><strong>€384,200</strong></p><p className="sm:pl-3"><span className="text-[var(--muted-foreground)]">Net Return </span><strong className="text-[var(--foreground)]">€259,400</strong></p></div></article><article className="rounded-xl border border-[var(--border)] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-[14px] font-semibold">Daily Performance</h3><div className="flex flex-wrap gap-1 text-[11px]"><button className="rounded px-2 py-1 text-[var(--muted-foreground)] hover:bg-[var(--card)]">Impressions</button><button className="rounded px-2 py-1 text-[var(--muted-foreground)] hover:bg-[var(--card)]">Clicks</button><button className="rounded bg-[var(--secondary)] px-2 py-1 font-semibold text-[var(--foreground)]">Conv</button><button className="rounded px-2 py-1 text-[var(--muted-foreground)] hover:bg-[var(--card)]">ROAS</button></div></div><div className="mt-3 h-[160px] w-full"><svg viewBox="0 0 480 170" className="h-full w-full" role="img" aria-label="Daily conversion trend rising from 28 to 68 conversions"><path d="M34 18H468M34 54H468M34 90H468M34 126H468" stroke="var(--border)" /><path d="M34 118 C60 105 78 116 104 98 S150 102 176 82 S220 88 246 70 S290 74 316 58 S352 68 384 40 S430 62 468 32 L468 126 L34 126Z" fill="var(--chart-1)" fillOpacity=".08" /><path d="M34 118 C60 105 78 116 104 98 S150 102 176 82 S220 88 246 70 S290 74 316 58 S352 68 384 40 S430 62 468 32" fill="none" stroke="var(--chart-1)" strokeWidth="3" /><circle cx="384" cy="40" r="4" fill="var(--chart-1)" /><rect x="315" y="10" width="118" height="42" rx="8" fill="var(--muted-foreground)" /><text x="326" y="25" fill="var(--border)" fontSize="10">Feb 12</text><text x="326" y="38" fill="var(--chart-1)" fontSize="10">68 conversions</text><text x="326" y="49" fill="var(--border)" fontSize="9">ROAS 11.2x</text><g fill="var(--muted-foreground)" fontSize="10"><text x="5" y="130">0</text><text x="0" y="94">40</text><text x="0" y="22">80</text><text x="34" y="154">Jan 15</text><text x="110" y="154">Jan 21</text><text x="188" y="154">Jan 27</text><text x="264" y="154">Feb 02</text><text x="342" y="154">Feb 08</text><text x="420" y="154">Feb 14</text></g></svg></div><div className="mt-4 grid gap-2 border-t border-[var(--border)] pt-3 text-[12px] text-[var(--muted-foreground)] sm:grid-cols-3"><p><strong className="text-[var(--foreground)]">7-day avg</strong> 44 conv/day</p><p><strong className="text-[var(--foreground)]">Peak day</strong> Feb 12 (68 conv)</p><p><strong className="text-[var(--foreground)]">Trend</strong> <span className="text-[var(--chart-4)]">+18% vs prev period</span></p></div></article></div>
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
  const [mobileNav, setMobileNav] = useState(false);
  const [metric, setMetric] = useState('Revenue');
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  };
  return <div className="min-h-screen bg-card font-sans text-[var(--foreground)]">
    <aside className={`${mobileNav ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-30 w-[220px] flex-col bg-[var(--sidebar)] px-3 py-5 lg:flex`}>
      <div className="mb-8 flex items-center gap-2 px-2"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)] text-sm font-bold text-primary-foreground">L</span><strong className="text-[16px] text-foreground">Lulu AI</strong></div>
      <LuluSectionNavigation activeId="breezy-shore-6734" />
      <div className="flex items-center gap-2 border-t border-[var(--muted-foreground)] pt-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-semibold text-foreground">DM</span><div><p className="text-xs font-medium text-foreground">David M</p><p className="text-[11px] text-[var(--muted-foreground)]">Growth operator</p></div><MoreHorizontal size={15} className="ml-auto text-[var(--muted-foreground)]" /></div>
    </aside>
    {mobileNav && <button aria-label="Close navigation" className="fixed inset-0 z-20 bg-primary/40 lg:hidden" onClick={() => setMobileNav(false)} />}
    <main className="lg:ml-[220px]"><header className="flex h-14 items-center justify-between border-b border-[var(--muted-foreground)] bg-[var(--sidebar)] px-4 text-foreground sm:px-7"><div className="flex items-center gap-3"><button className="lg:hidden" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={18} /></button><span className="text-[13px] text-[var(--muted-foreground)]">Marketing</span><span className="text-[var(--muted-foreground)]">/</span><span className="text-[13px]">Marketing Analytics</span></div><div className="flex items-center gap-1 sm:gap-2"><button onClick={refresh} aria-label="Refresh" className="rounded p-2 text-[var(--primary-foreground)] hover:bg-[var(--primary)]"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /></button><button className="hidden px-2 text-[13px] text-[var(--foreground)] sm:block"><Download size={14} className="mr-1 inline" />Export</button><button className="hidden px-2 text-[13px] text-[var(--foreground)] md:block"><Filter size={14} className="mr-1 inline" />Filters</button><button className="hidden px-2 text-[13px] text-[var(--foreground)] xl:block">Compare</button><button className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-[13px] text-[var(--foreground)]">Last 30 Days <ChevronDown size={13} className="ml-1 inline" /></button><button className="hidden rounded-md bg-[var(--primary)] px-3 py-2 text-[13px] font-semibold text-[var(--primary-foreground)] sm:block"><Sparkles size={13} className="mr-1 inline" />Ask Lulu AI</button><Bell size={17} className="ml-1 text-[var(--muted-foreground)]" /><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-semibold">DM</span></div></header>
      <div className="px-4 py-6 sm:px-8"><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold tracking-tight">Marketing Analytics</h1><p className="mt-1 text-sm text-[var(--muted-foreground)]">Understand marketing performance, efficiency and business impact across your connected channels.</p></div><div className="text-right text-xs text-[var(--muted-foreground)]">Last 30 Days <span className="ml-2 rounded-full bg-chart-4/10 px-2 py-1 text-[var(--chart-4)]">vs Previous Period&nbsp; +12.4%</span></div></div>
        <section className="grid grid-cols-2 divide-x divide-[var(--background)] overflow-hidden rounded-xl border border-[var(--border)] md:grid-cols-4 xl:grid-cols-8">{kpis.map(kpi => <article key={kpi.label} className="min-w-0 px-3 py-3"><p className="truncate text-[11px] uppercase tracking-[.05em] text-[var(--muted-foreground)]">{kpi.label}</p><strong className={`mt-2 block text-[25px] leading-none ${toneClass[kpi.tone]}`}>{kpi.value}</strong><span className="mt-2 inline-block rounded-full bg-chart-4/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--chart-4)]">{kpi.delta} vs prev</span></article>)}</section>
        <div className="my-4 flex items-center gap-2 rounded-lg border border-border bg-[var(--secondary)] px-4 py-2 text-xs"><CircleAlert size={15} className="text-[var(--foreground)]" /><span><strong>AI Detected:</strong> Conversion rate on Meta Ads dropped 31% in last 48 hours.</span><button className="ml-auto font-medium text-[var(--foreground)]">Review</button></div>
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]"><div className="min-w-0 space-y-4">
          <section className="rounded-xl border border-[var(--border)] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-semibold">Marketing Performance</h2><div className="flex flex-wrap gap-1">{['Revenue', 'Spend', 'Leads', 'Customers', 'Conv Rate', 'ROAS', 'CAC'].map(x => <button key={x} onClick={() => setMetric(x)} className={`rounded px-2 py-1 text-[11px] ${metric === x ? 'bg-[var(--secondary)] font-semibold text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--card)]'}`}>{x}</button>)}</div><div className="flex gap-2 text-[11px] text-[var(--muted-foreground)]">{['7D', '30D', '90D', '6M', 'YTD'].map(x => <button key={x} className={x === '30D' ? 'font-semibold text-[var(--foreground)]' : ''}>{x}</button>)}</div></div><div className="mt-3 h-[180px] w-full"><svg viewBox="0 0 900 180" className="h-full w-full" role="img" aria-label="Marketing revenue trend rising from 24 thousand to 38 thousand euros"><path d="M40 150H875M40 105H875M40 60H875M40 15H875" stroke="var(--border)" /><path d="M40 140 C105 132 120 125 170 132 S250 112 300 118 S370 88 420 98 S480 75 530 80 S600 65 645 68 S700 38 745 48 S805 20 875 28 L875 150 L40 150Z" fill="var(--chart-1)" fillOpacity=".12" /><path d="M40 140 C105 132 120 125 170 132 S250 112 300 118 S370 88 420 98 S480 75 530 80 S600 65 645 68 S700 38 745 48 S805 20 875 28" fill="none" stroke="var(--chart-1)" strokeWidth="3" /><path d="M40 150 C140 145 190 142 270 138 S400 130 500 126 S650 115 875 105" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="5 5" /><circle cx="805" cy="20" r="4" fill="var(--chart-4)" /><g fill="var(--muted-foreground)" fontSize="11"><text x="0" y="154">€20K</text><text x="0" y="109">€28K</text><text x="0" y="64">€36K</text><text x="780" y="15">€38,420</text><text x="40" y="174">Jan 01</text><text x="150" y="174">Jan 05</text><text x="270" y="174">Jan 10</text><text x="390" y="174">Jan 15</text><text x="510" y="174">Jan 20</text><text x="630" y="174">Jan 25</text><text x="750" y="174">Jan 28</text><text x="830" y="174">Jan 30</text></g></svg></div><div className="flex justify-end gap-4 text-[11px] text-[var(--muted-foreground)]"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--primary)] text-primary-foreground" />Last 30 Days</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--muted)]" />Previous Period</span></div></section>
          <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]"><section className="overflow-hidden rounded-xl border border-[var(--border)] p-4"><div className="mb-3 flex justify-between"><h2 className="text-sm font-semibold">Channel Performance</h2><button className="text-xs text-[var(--foreground)]">View All</button></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-[11px]"><thead className="text-[10px] uppercase tracking-[.05em] text-[var(--muted-foreground)]"><tr>{['Channel', 'Spend', 'Revenue', 'ROAS', 'CAC', 'Conv', 'Trend', 'Status', ''].map(h => <th key={h} className="pb-2 font-medium">{h}</th>)}</tr></thead><tbody>{channels.map(c => <tr key={c.name} className="h-9 border-t border-[var(--border)] hover:bg-[var(--card)]"><td className="font-semibold">{c.name}</td><td>{c.spend}</td><td>{c.revenue}</td><td className="font-semibold">{c.roas}</td><td>{c.cac}</td><td>{c.conv}</td><td className={c.trend === 'down' ? 'text-[var(--chart-5)]' : c.trend === 'up' ? 'text-[var(--chart-4)]' : 'text-[var(--muted-foreground)]'}>{c.trend === 'up' ? '↗︎▁▃▅' : c.trend === 'down' ? '↘︎▅▃▁' : '— — —'}</td><td><span className={`rounded-full px-1.5 py-1 text-[10px] ${c.status === 'Review' ? 'bg-secondary text-[var(--chart-1)]' : c.status === 'Stable' ? 'bg-secondary text-[var(--muted-foreground)]' : 'bg-chart-4/10 text-[var(--chart-4)]'}`}>{c.status}</span></td><td><ArrowRight size={13} className="text-[var(--muted-foreground)]" /></td></tr>)}</tbody></table></div></section><section className="rounded-xl border border-[var(--border)] p-4"><div className="mb-3 flex justify-between"><h2 className="text-sm font-semibold">Top Campaigns</h2><button className="text-xs text-[var(--foreground)]">View All</button></div>{campaigns.map((c, i) => <div key={c[0]} className="flex h-10 items-center gap-2 border-t border-[var(--border)] text-[12px]"><strong className="w-4 text-[var(--foreground)]">{i + 1}</strong><div className="min-w-0 flex-1"><p className="truncate font-semibold">{c[0]}</p><span className="text-[10px] text-[var(--muted-foreground)]">{c[1]}</span></div><strong>{c[2]}x</strong><span className="w-16 text-right text-[11px] text-[var(--muted-foreground)]">{c[3]}</span></div>)}<div className="mt-4 rounded-xl border-l-4 border-[var(--chart-5)] bg-[var(--card)] p-3"><h3 className="text-[13px] font-semibold text-[var(--chart-5)]">Campaigns Requiring Attention</h3>{[['Meta Ads CTR drop -31%', 'High'], ['LinkedIn CAC increased +22%', 'Medium']].map(x => <div key={x[0]} className="mt-2 flex items-center gap-2 text-[11px]"><span className="flex-1">{x[0]}</span><span className="text-[var(--chart-1)]">{x[1]}</span><button className="text-[var(--foreground)]">View</button></div>)}</div></section></div>
          <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]"><section className="rounded-xl border border-[var(--border)] p-4"><h2 className="text-sm font-semibold">Marketing Funnel</h2><div className="mt-3 space-y-2">{[['Reach', '2,840,000', ''], ['Impressions', '2,840,000', '—'], ['Clicks', '48,200', '1.7% CTR'], ['Visitors', '42,400', '87.9%'], ['Leads', '3,842', '9.1%'], ['Qual. Leads', '1,840', '47.9%'], ['Customers', '1,284', '69.8%'], ['Revenue', '€842,400', '€656/customer']].map((x, i) => <div key={x[0]} className="flex items-center gap-2"><span className="w-20 text-[12px] font-medium">{x[0]}</span><span className="h-6 flex-1 rounded-sm bg-[var(--primary)] text-primary-foreground" style={{
                      width: `${100 - i * 8}%`
                    }}><span className="block h-full rounded-sm bg-[var(--primary)] opacity-80 text-primary-foreground" style={{
                        width: `${100 - i * 7}%`
                      }} /></span><strong className="w-20 text-right text-[12px]">{x[1]}</strong><span className="w-16 text-right text-[10px] text-[var(--foreground)]">{x[2]}</span></div>)}</div></section><section className="rounded-xl border border-[var(--border)] p-4"><h2 className="text-sm font-semibold">Audience Performance</h2>{audiences.map(a => <div key={a[0]} className="flex h-12 items-center gap-2 border-b border-[var(--border)] last:border-0"><span className="h-2 w-2 rounded-full bg-[var(--primary)] text-primary-foreground" /><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold">{a[0]}</p><span className="text-[11px] text-[var(--muted-foreground)]">{a[1]} members</span></div><span className="text-[11px] text-[var(--foreground)]">{a[2]} conv</span><span className="w-12 text-right text-[10px] text-[var(--muted-foreground)]">{a[3]} CAC</span></div>)}</section></div>
          <div className="grid gap-4 lg:grid-cols-3"><section className="rounded-xl border border-[var(--border)] p-4"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Marketing Revenue</h2><span className="rounded bg-secondary px-1.5 py-1 text-[10px] text-[var(--foreground)]">Attribution: Last Touch</span></div>{revenueBars.map(x => <div key={x[0]} className="mt-3 flex items-center gap-2 text-[11px]"><span className="w-16">{x[0]}</span><span className="h-2 flex-1 rounded-full bg-[var(--secondary)]"><span className="block h-full rounded-full bg-[var(--primary)] text-primary-foreground" style={{
                      width: `${x[1]}%`
                    }} /></span><strong className="w-12 text-right">{x[2]}</strong></div>)}<div className="mt-4 border-t pt-3 text-right text-sm font-bold">€862K</div></section><section className="rounded-xl border border-[var(--border)] p-4"><h2 className="text-sm font-semibold">Marketing Spend</h2><div className="flex items-center gap-4 py-4"><svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90"><circle cx="50" cy="50" r="35" fill="none" stroke="var(--chart-1)" strokeWidth="14" strokeDasharray="92 220" /><circle cx="50" cy="50" r="35" fill="none" stroke="var(--chart-3)" strokeWidth="14" strokeDasharray="50 220" strokeDashoffset="-92" /><circle cx="50" cy="50" r="35" fill="none" stroke="var(--chart-2)" strokeWidth="14" strokeDasharray="33 220" strokeDashoffset="-142" /><circle cx="50" cy="50" r="35" fill="none" stroke="var(--chart-4)" strokeWidth="14" strokeDasharray="7 220" strokeDashoffset="-175" /></svg><strong className="text-xl">€124,800</strong></div><p className="text-[11px] text-[var(--muted-foreground)]">Google 42% · Meta 23% · LinkedIn 15% · Email 3% · Other 17%</p></section><section className="rounded-xl border border-[var(--border)] p-4"><h2 className="text-sm font-semibold">Marketing Efficiency</h2>{efficiency.map(x => <div key={x[0]} className="flex items-center justify-between border-b border-[var(--border)] py-3 text-xs"><span className="text-[var(--muted-foreground)]">{x[0]}</span><strong>{x[1]}</strong><span className="rounded-full bg-secondary px-1.5 py-1 text-[10px] text-[var(--foreground)]">{x[2]}</span></div>)}<p className="mt-3 text-[11px] text-[var(--muted-foreground)]">vs Previous Period · <span className="text-[var(--foreground)]">All metrics improving</span></p></section></div>
          <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]"><section className="rounded-xl border border-[var(--border)] p-4"><div className="mb-3 flex justify-between"><h2 className="text-sm font-semibold">Geographic Performance</h2><button className="text-xs text-[var(--foreground)]">Table View</button></div><div className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr] text-[11px]"><div className="contents text-[10px] uppercase text-[var(--muted-foreground)]"><span>Country</span><span>Revenue</span><span>Conv%</span><span>CAC</span><span>Trend</span></div>{geo.map(g => <div key={g[1]} className="col-span-5 grid grid-cols-subgrid items-center border-t border-[var(--border)] py-2"><span>{g[0]} <strong>{g[1]}</strong></span><span>{g[2]}</span><span>{g[3]}</span><span>{g[4]}</span><span className={g[5] === 'down' ? 'text-[var(--chart-5)]' : g[5] === 'up' ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]'}>{g[5] === 'up' ? '↗ Up' : g[5] === 'down' ? '↘ Down' : '— Stable'}</span></div>)}</div></section><section className="rounded-xl border border-[var(--border)] p-4"><h2 className="text-sm font-semibold">Device Performance</h2>{[['Desktop', 62, '5.4%', '€42', 'green'], ['Mobile', 31, '3.8%', '€58', 'amber'], ['Tablet', 7, '2.1%', '€84', 'gray']].map(d => <div key={d[0]} className="mt-4"><div className="flex justify-between text-xs"><strong>{d[0]}</strong><span>{d[1]}% sessions · {d[2]} conv · {d[3]} CAC</span></div><span className="mt-1 block h-2 rounded-full bg-[var(--secondary)]"><span className={`block h-full rounded-full ${d[4] === 'green' ? 'bg-[var(--chart-4)]' : d[4] === 'amber' ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'}`} style={{
                      width: `${d[1]}%`
                    }} /></span></div>)}</section></div>
          <section className="rounded-xl border border-[var(--border)] p-4"><div className="flex items-center gap-2"><h2 className="text-sm font-semibold">Marketing Trends</h2><span className="rounded bg-secondary px-1.5 py-1 text-[10px] uppercase text-[var(--foreground)]">AI Detected</span></div><div className="mt-3 grid gap-3 sm:grid-cols-2">{trends.map(t => <div key={t[0]} className="flex gap-2 rounded-lg bg-[var(--card)] p-3"><span className={t[2] === 'red' ? 'text-[var(--chart-5)]' : 'text-[var(--foreground)]'}>{t[2] === 'red' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}</span><div className="flex-1"><p className="text-[13px] font-semibold">{t[0]}</p><span className="text-[11px] text-[var(--muted-foreground)]">Last 30 days · </span><span className={`text-[10px] ${t[2] === 'red' ? 'text-[var(--chart-5)]' : 'text-[var(--foreground)]'}`}>{t[1]}</span></div></div>)}</div></section>
          <section className="rounded-xl bg-[var(--card)] px-5 py-5 text-foreground"><div className="flex items-center gap-2"><h2 className="text-base font-semibold">Lulu AI Marketing Insights</h2><span className="rounded bg-[var(--primary)]/15 px-1.5 py-1 text-[10px] text-[var(--foreground)]">AI-generated</span><span className="ml-auto text-[11px] text-[var(--muted-foreground)]">Last analyzed 2h ago</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{insights.map((x, i) => <div key={x} className="rounded-lg bg-[var(--secondary)] p-3"><p className="text-xs leading-5">{x}</p><div className="mt-2 flex justify-between text-[10px]"><span className="text-[var(--foreground)]">✦ Confidence: {i === 2 ? 'Medium' : 'High'}</span><span className="text-[var(--muted-foreground)]">Data sources · 2h ago</span></div></div>)}</div></section>
          <div className="grid gap-4 lg:grid-cols-3">{[['OPPORTUNITIES', 'amber', ['Email has highest ROAS but lowest spend allocation — Score 94', 'High-value audience underrepresented in Google Ads — Score 88', 'Organic traffic growing but content coverage limited — Score 76']], ['RISKS', 'red', ['Meta Ads CTR declining sharply — High severity', 'LinkedIn CAC increased 22% — Medium severity', 'Channel dependency: 45% revenue from one channel — Medium severity']], ['RECOMMENDED ACTIONS', 'green', actions]].map(x => <section key={String(x[0])} className={`rounded-xl border border-[var(--border)] border-l-4 ${x[1] === 'amber' ? 'border-l-[var(--border)]' : x[1] === 'red' ? 'border-l-[var(--chart-5)]' : 'border-l-[var(--border)]'} p-4`}><h2 className="text-[13px] font-semibold">{x[0]}</h2>{(x[2] as string[]).map((item, i) => <div key={item} className="mt-3 flex items-start gap-2 text-xs"><span className={x[1] === 'red' ? 'text-[var(--chart-5)]' : 'text-[var(--foreground)]'}>{x[0] === 'RECOMMENDED ACTIONS' ? `${i + 1}.` : '✦'}</span><span className="flex-1">{item}</span><button className="shrink-0 text-[10px] text-[var(--foreground)]">{x[0] === 'RECOMMENDED ACTIONS' ? i === 0 ? 'Review' : i === 1 ? 'Create Task' : 'Open Campaign' : 'View'}</button></div>)}</section>)}</div>
        </div>
        <aside className="rounded-xl bg-[var(--sidebar)] p-4 text-foreground xl:sticky xl:top-4"><div className="flex items-center justify-between"><h2 className="text-[13px] font-semibold">AI Context</h2><button aria-label="Refresh AI context" onClick={refresh}><RefreshCw size={14} className="text-[var(--muted-foreground)]" /></button></div><div className="mt-5 space-y-5"><section><p className="mb-2 text-[10px] uppercase tracking-[.08em] text-[var(--foreground)]">Performance Summary</p><p className="text-xs leading-5 text-[var(--foreground)]">Marketing health is strong, with revenue growing faster than spend. Paid search and email are leading efficiency gains.</p></section><section><p className="mb-2 text-[10px] uppercase tracking-[.08em] text-[var(--foreground)]">AI Insights</p>{['Email efficiency creates budget expansion opportunity', 'Paid search is the strongest revenue engine', 'Audience quality is improving across channels'].map(x => <p key={x} className="mb-2 flex gap-2 text-xs"><Sparkles size={13} className="shrink-0 text-[var(--foreground)]" />{x}<small className="text-[var(--muted-foreground)]">2h</small></p>)}</section><section><p className="mb-2 text-[10px] uppercase tracking-[.08em] text-[var(--chart-5)]">Anomalies</p>{['Meta Ads CTR drop 31%', 'LinkedIn CAC +22%'].map(x => <p key={x} className="mb-2 text-xs text-[var(--foreground)]"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--destructive)]" />{x} <small className="text-[var(--muted-foreground)]">2h ago</small></p>)}</section><section><p className="mb-2 text-[10px] uppercase tracking-[.08em] text-[var(--foreground)]">Top Opportunities</p>{['Reallocate spend toward Email', 'Expand high-value search audience', 'Refresh Meta creative set'].map((x, i) => <p key={x} className="mb-2 text-xs"><strong className="mr-2 text-[var(--foreground)]">0{i + 1}</strong>{x}</p>)}</section><section><p className="mb-3 text-[10px] uppercase tracking-[.08em] text-[var(--muted-foreground)]">Channel Health</p>{health.map(h => <div key={h[0]} className="mb-2 flex items-center gap-2 text-[11px] text-[var(--foreground)]"><span className="w-20">{h[0]}</span><span className="h-1.5 flex-1 rounded-full bg-[var(--background)]"><span className={`block h-full rounded-full ${h[2] === 'green' ? 'bg-[var(--chart-4)]' : 'bg-[var(--primary)]'}`} style={{
                      width: `${h[1]}%`
                    }} /></span><span className="w-7 text-right text-[var(--muted-foreground)]">{h[1]}%</span></div>)}</section><section><p className="mb-2 text-[10px] uppercase tracking-[.08em] text-[var(--muted-foreground)]">Attribution Note</p><div className="rounded-lg bg-[var(--secondary)] p-2"><p className="text-[11px]">Attribution Model: Last Touch</p><button className="mt-2 text-[11px] text-[var(--foreground)]">Change</button></div></section></div><p className="mt-6 text-[11px] text-[var(--muted-foreground)]">Last refresh: 14 minutes ago</p></aside></div>
        <CampaignDetailWorkspace />
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
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
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
  }, {
    "id": "nicely-land-1864",
    "label": "Settings"
  }]
}, {
  "label": "Website",
  "pages": [{
    "id": "lulu-website-portal-9012",
    "label": "Website"
  }]
}, {
  "label": "Integrations",
  "pages": [{
    "id": "glad-coast-1428",
    "label": "Integrations"
  }]
}, {
  "label": "Billing",
  "pages": [{
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
          <span>{section.label}</span>
          <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2 pb-1">
          {section.pages.map(page => {
            const isActivePage = page.id === activeId;
            return <a key={page.id} {...pageLinkProps(page.id)} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
import { pageLinkProps } from '../../../../routing';
