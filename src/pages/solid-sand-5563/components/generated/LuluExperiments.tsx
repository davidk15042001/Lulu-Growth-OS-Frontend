import { useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, Beaker, Brain, Check, ChevronDown, CircleHelp, Clock3, Download, Eye, FlaskConical, Gauge, Info, LayoutDashboard, Lightbulb, Menu, Pause, Play, Plus, RefreshCw, Send, Settings2, ShieldCheck, Sparkles, Target, Trash2, TrendingUp, Users, X, Zap } from 'lucide-react';
type Platform = 'Google' | 'Meta' | 'LinkedIn' | 'TikTok';
type Opportunity = {
  id: string;
  impact: string;
  title: string;
  hypothesis?: string;
  platform: Platform;
  campaign?: string;
  metric: string;
  confidence: string;
  source?: string;
};
type HistoryRow = {
  id: string;
  name: string;
  platform: Platform;
  type: string;
  result: string;
  metric: string;
  created: string;
  completed: string;
  owner: string;
};
const opportunities: Opportunity[] = [{
  id: 'benefit',
  impact: 'High',
  title: 'Test Benefit-Focused vs. Feature-Focused Messaging',
  hypothesis: 'If we use benefit-focused headlines on Google Search, conversion rate will increase because users searching for solutions respond better to outcome language.',
  platform: 'Google',
  campaign: 'Q1 Lead Gen — DACH',
  metric: 'Conversion Rate',
  confidence: '84%',
  source: 'Observed: CTR strong but conversion below benchmark. AI Inferred.'
}, {
  id: 'lookalike',
  impact: 'Medium',
  title: 'CRM Lookalike vs. Interest-Based Audience',
  hypothesis: 'If we serve ads to a 1% CRM lookalike instead of interest-based targeting, CPL will decrease because the audience has stronger purchase signal.',
  platform: 'Meta',
  campaign: 'DACH Retargeting',
  metric: 'CPL',
  confidence: '71%',
  source: 'Observed: Lookalike untested. CRM data available. AI Inferred.'
}, {
  id: 'video',
  impact: 'Medium',
  title: 'Video vs. Static Creative — TikTok',
  hypothesis: 'If we replace static image ads with short-form video on TikTok, CTR will increase because native video format has higher engagement on the platform.',
  platform: 'TikTok',
  campaign: 'Brand Awareness Q2',
  metric: 'CTR',
  confidence: '66%'
}, {
  id: 'linkedin',
  impact: 'Low',
  title: 'LinkedIn CTA: “Learn More” vs. “Get a Free Audit”',
  platform: 'LinkedIn',
  metric: 'Click Rate',
  confidence: '59%'
}];
const history: HistoryRow[] = [{
  id: 'h1',
  name: 'Static vs Carousel — DACH',
  platform: 'Meta',
  type: 'Creative',
  result: 'Variant Winner',
  metric: 'ROAS +28.6%',
  created: 'Dec 15',
  completed: 'Jan 5',
  owner: 'Sarah M.'
}, {
  id: 'h2',
  name: 'Broad vs. Retargeting — Google',
  platform: 'Google',
  type: 'Audience',
  result: 'Control Winner',
  metric: 'CPL −8%',
  created: 'Nov 28',
  completed: 'Dec 20',
  owner: 'Lulu AI'
}, {
  id: 'h3',
  name: 'Price vs. Benefit Headline',
  platform: 'Google',
  type: 'Messaging',
  result: 'Inconclusive',
  metric: 'Conversion Rate',
  created: 'Nov 10',
  completed: 'Dec 1',
  owner: 'Tom K.'
}, {
  id: 'h4',
  name: 'LinkedIn CTA Test',
  platform: 'LinkedIn',
  type: 'Creative',
  result: 'Variant Winner',
  metric: 'CTR +18%',
  created: 'Oct 22',
  completed: 'Nov 12',
  owner: 'Sarah M.'
}, {
  id: 'h5',
  name: 'Budget Scaling — Meta',
  platform: 'Meta',
  type: 'Budget',
  result: 'No Clear Winner',
  metric: 'ROAS',
  created: 'Oct 5',
  completed: 'Oct 26',
  owner: 'Lulu AI'
}];
function PlatformBadge({
  platform
}: {
  platform: Platform;
}) {
  const letters: Record<Platform, string> = {
    Google: 'G',
    Meta: 'M',
    LinkedIn: 'In',
    TikTok: 'T'
  };
  const tones: Record<Platform, string> = {
    Google: 'bg-primary',
    Meta: 'bg-primary',
    LinkedIn: 'bg-primary',
    TikTok: 'bg-primary'
  };
  return <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[10px] font-bold text-foreground ${tones[platform]}`} aria-label={`${platform} Ads`}>{letters[platform]}</span>;
}
function AiBadge({
  children
}: {
  children: string;
}) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-border/30 bg-gradient-to-r from-secondary/25 to-secondary/20 px-2 py-1 text-[10px] font-semibold text-foreground"><Sparkles size={11} /><span>{children}</span></span>;
}
function StatusChip({
  children,
  tone = 'green',
  icon
}: {
  children: string;
  tone?: 'green' | 'gray' | 'amber' | 'violet' | 'blue';
  icon?: React.ReactNode;
}) {
  const tones = {
    green: 'border-border/25 bg-secondary/10 text-foreground',
    gray: 'border-border bg-secondary text-muted-foreground',
    amber: 'border-border/30 bg-secondary/10 text-foreground',
    violet: 'border-border/30 bg-secondary/10 text-foreground',
    blue: 'border-border/30 bg-secondary/10 text-foreground'
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-medium ${tones[tone]}`}>{icon ?? <span className="h-1.5 w-1.5 rounded-full bg-current" />}<span>{children}</span></span>;
}
export function LuluExperiments() {
  const [showApply, setShowApply] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [sent, setSent] = useState(false);
  const stats = [['Active', '2', 'Running now', 'violet'], ['Planned', '3', 'Scheduled', 'blue'], ['Completed', '11', 'All time', 'green'], ['Winning', '7', 'Clear winner found', 'green'], ['Inconclusive', '3', 'Insufficient data', 'gray'], ['AI Recommendations', '4', 'New opportunities', 'violet']];
  return <main className="min-h-screen bg-[var(--background)] text-[var(--primary-foreground)] selection:bg-secondary/30">
  <aside className="fixed inset-y-0 left-0 z-20 hidden w-16 flex-col items-center border-r border-border bg-[var(--sidebar)] py-4 md:flex"><div className="mb-8 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary text-lg font-black text-primary-foreground">L</div><LuluSectionNavigation activeId="solid-sand-5563" /><button className="text-foreground" aria-label="Settings"><Settings2 size={19} /></button></aside>
  <div className="md:pl-16"><header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4 lg:px-8"><div><div className="mb-2 flex items-center gap-2 text-[11px] text-muted-foreground"><span>Advertising</span><span>/</span><span className="text-foreground">Experiments</span></div><div className="flex items-center gap-3"><Beaker className="text-foreground" size={23} /><h1 className="text-[22px] font-semibold tracking-tight">AI Experiments</h1></div><p className="mt-1 max-w-2xl text-[13px] text-muted-foreground">Design controlled advertising experiments, measure what works and turn campaign data into better decisions.</p></div><div className="flex flex-wrap items-center gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary"><Plus size={15} />Create Experiment</button><button className="inline-flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary/10"><Sparkles size={14} />Ask Lulu AI</button><button className="rounded-lg border border-border p-2 text-foreground hover:bg-secondary" aria-label="Refresh"><RefreshCw size={15} /></button><button className="rounded-lg border border-border p-2 text-foreground hover:bg-secondary" aria-label="Export"><Download size={15} /></button></div></header>
  <div className="px-5 py-5 lg:px-8"><section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{stats.map(([label, value, caption, tone]) => <article key={label} className={`rounded-xl border border-border border-l-2 ${tone === 'violet' ? 'border-l-border' : tone === 'blue' ? 'border-l-border' : tone === 'green' ? 'border-l-chart-4' : 'border-l-border'} bg-[var(--card)] px-4 py-3`}><p className="text-[11px] text-muted-foreground">{label}</p><div className="mt-1 flex items-center gap-2"><strong className="text-xl font-semibold">{value}</strong>{label === 'AI Recommendations' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary text-primary-foreground" />}</div><p className="mt-1 text-[10px] text-muted-foreground">{caption}</p></article>)}</section>
   <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"><div className="min-w-0 space-y-6">
    <section><div className="mb-3 flex items-end justify-between"><div><h2 className="flex items-center gap-2 text-[15px] font-semibold"><Sparkles size={16} className="text-foreground" />Lulu AI Experiment Opportunities <span className="text-muted-foreground">(4)</span></h2><p className="mt-1 text-[11px] text-muted-foreground">Based on your active campaign data · Updated 6 min ago</p></div></div><div className="grid gap-3 md:grid-cols-2">{opportunities.map(op => <article key={op.id} className={`rounded-xl border border-border border-t-2 ${op.impact === 'High' ? 'border-t-border' : op.impact === 'Medium' ? 'border-t-border' : 'border-t-border'} bg-[var(--card)] p-4 transition hover:bg-[var(--card)]`}><div className="flex items-center justify-between"><AiBadge>{op.impact === 'High' ? 'AI Recommended' : 'AI Observation'}</AiBadge><span className={`text-[10px] font-semibold ${op.impact === 'High' ? 'text-foreground' : op.impact === 'Medium' ? 'text-foreground' : 'text-muted-foreground'}`}>{op.impact} impact</span></div><h3 className="mt-3 text-[14px] font-semibold leading-snug">{op.title}</h3>{op.hypothesis && <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">{op.hypothesis}</p>}<div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground"><PlatformBadge platform={op.platform} /><span>{op.platform} Ads</span>{op.campaign && <><span className="text-foreground">·</span><span>{op.campaign}</span></>}</div><div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground"><span>Metric <b className="text-foreground">{op.metric}</b></span><span>Confidence <b className="text-foreground">{op.confidence}</b></span></div>{op.source && <p className="mt-3 text-[10px] text-muted-foreground">{op.source}</p>}<div className="mt-3 flex gap-2"><button className="rounded-md bg-primary px-2.5 py-1.5 text-[10px] font-semibold hover:bg-primary text-primary-foreground">Create Experiment</button><button className="rounded-md border border-border px-2.5 py-1.5 text-[10px] text-foreground hover:bg-secondary">Review</button><button className="p-1.5 text-foreground hover:text-foreground" aria-label="Dismiss"><X size={13} /></button></div></article>)}</div></section>
    <section className="rounded-xl border border-dashed border-border/50 bg-secondary/[0.04] p-5"><h2 className="text-[16px] font-semibold">What would you like to test?</h2><p className="mt-1 text-[12px] text-muted-foreground">Describe what you want to learn. Lulu AI will design the experiment.</p><textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe what you want to learn... e.g. Test whether a price-focused message improves conversions." className="mt-4 h-20 w-full resize-none rounded-lg border border-border bg-[var(--secondary)] p-3 text-xs text-muted-foreground outline-none placeholder:text-muted-foreground focus:border-border/60" /><div className="mt-3 flex flex-wrap gap-2">{['Better messaging angle', 'Broader vs. targeted audience', 'Video vs. static', 'Budget scaling'].map(chip => <button key={chip} onClick={() => setPrompt(chip)} className="rounded-full border border-border px-2.5 py-1 text-[10px] text-foreground hover:border-border/40 hover:text-foreground">{chip}</button>)}</div><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold hover:bg-primary text-primary-foreground" onClick={() => setSent(true)}><Sparkles size={14} />{sent ? 'Experiment brief generated' : 'Build Experiment with AI'}</button></section>
    <section><div className="mb-3 flex items-center justify-between"><h2 className="text-[15px] font-semibold">Active Experiments <span className="text-muted-foreground">(2)</span></h2><span className="text-[10px] text-muted-foreground">All data labeled Observed</span></div><article className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex flex-wrap items-center gap-2"><StatusChip icon={<Play size={11} fill="currentColor" />}>Running</StatusChip><PlatformBadge platform="Google" /><span className="text-[10px] text-muted-foreground">Google Ads · Creative Experiment · Day 8 of 14</span></div><div className="mt-4 flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-[17px] font-semibold">Benefit Messaging vs. Feature Messaging — Google Search</h3><p className="mt-1 text-[11px] text-muted-foreground">Q1 Lead Gen — DACH · Started Jan 6, 2025 · Ends Jan 20, 2025</p></div><p className="text-right text-[10px] text-muted-foreground">Owner <span className="text-foreground">Sarah M.</span><br />Approved by <span className="text-foreground">Tom K.</span></p></div><div className="mt-4 rounded-lg border-l-2 border-border bg-secondary/[0.07] p-3"><AiBadge>AI Generated</AiBadge><p className="mt-2 text-[12px] leading-relaxed text-foreground">If we use benefit-focused headlines (“Grow your business with AI”) instead of feature-focused headlines (“AI-powered automation tools”), conversion rate will increase because decision-makers respond to business outcomes more than product capabilities.</p></div><div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-lg border border-border bg-[var(--secondary)] p-4"><p className="text-[11px] font-semibold text-foreground">Control <span className="font-normal text-muted-foreground">— 50% traffic</span></p><p className="mt-3 text-[10px] text-muted-foreground">Creative: Feature-focused headline</p><p className="mt-2 rounded border-l-2 border-transparent bg-secondary p-2 text-sm font-semibold">AI-Powered Business Automation</p><p className="mt-2 border-l-2 border-transparent pl-2 text-[11px] text-muted-foreground">Automate workflows with machine learning</p><p className="mt-2 inline-block rounded bg-secondary px-2 py-1 text-[10px] text-foreground">Learn More</p></div><div className="rounded-lg border border-border/30 bg-secondary/[0.06] p-4"><p className="text-[11px] font-semibold text-foreground">Variant B <span className="font-normal text-foreground/60">— 50% traffic</span></p><p className="mt-3 text-[10px] text-muted-foreground">Creative: Benefit-focused headline</p><p className="mt-2 rounded border-l-2 border-border bg-secondary/10 p-2 text-sm font-semibold text-foreground">Grow Revenue Faster with Lulu AI</p><p className="mt-2 border-l-2 border-border pl-2 text-[11px] text-foreground">Turn business data into decisions that drive growth</p><p className="mt-2 inline-block rounded bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">Get Free Audit</p></div></div>
     <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">{[['Impressions', '14,280', '14,105', '−0.6%', 'neutral'], ['Clicks', '428', '517', '+20.8% ↑', 'good'], ['CTR', '3.0%', '3.7%', '+23% ↑', 'good'], ['Conversions', '31', '38', '+22.6% ↑', 'good'], ['Conversion Rate', '7.2%', '7.4%', '+2.7%', 'neutral'], ['CPL', '€44.8', '€39.2', '−12.5% ↓', 'good']].map(([name, control, variant, diff, tone]) => <div key={name} className="rounded-lg border border-border bg-[var(--secondary)] p-3"><p className="text-[10px] text-muted-foreground">{name}</p><div className="mt-2 flex justify-between text-[11px]"><span><b className="text-foreground">{control}</b><small className="ml-1 text-muted-foreground">C</small></span><span><b className="text-foreground">{variant}</b><small className="ml-1 text-muted-foreground">V</small></span></div><p className={`mt-2 text-[10px] ${tone === 'good' ? 'text-foreground' : 'text-muted-foreground'}`}>{diff}</p><p className="mt-1 text-[9px] text-muted-foreground">Observed</p></div>)}</div>
     <div className="mt-4 rounded-lg border border-border bg-[var(--secondary)] p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">Conversions/day</span><span className="text-[9px] text-muted-foreground">Jan 6 · 8 · 10 · 12 · 14</span></div><svg viewBox="0 0 700 75" className="mt-2 h-16 w-full" role="img" aria-label="Control gray line and Variant B violet line conversion trend"><path d="M0 58 L90 54 L180 52 L270 48 L360 45 L450 43 L540 40 L630 38 L700 35" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" /><path d="M0 60 L90 57 L180 55 L270 50 L360 43 L450 38 L540 29 L630 22 L700 14" fill="none" stroke="var(--foreground)" strokeWidth="2.5" /></svg><div className="flex justify-end gap-3 text-[9px] text-muted-foreground"><span><i className="mr-1 inline-block h-1.5 w-3 bg-secondary" />Control</span><span className="text-foreground"><i className="mr-1 inline-block h-1.5 w-3 bg-primary text-primary-foreground" />Variant B</span></div></div>
     <div className="mt-3 rounded-lg border border-border/30 bg-secondary/[0.06] p-3"><AiBadge>AI Observation</AiBadge><p className="mt-2 text-[12px] leading-relaxed text-foreground">Variant B is currently producing a 22.6% higher conversion volume and 12.5% lower CPL than Control. However, the experiment has only accumulated 69 total conversions across both variants. Lulu AI recommends allowing the experiment to run its full 14 days before drawing conclusions. Early directional results favor Variant B but are not yet sufficient for a reliable determination.</p><p className="mt-2 text-[10px] text-muted-foreground">Google Ads (Observed) · Updated 4 min ago</p></div><div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/25 bg-secondary/[0.04] p-3"><div className="flex items-center gap-2"><StatusChip tone="amber" icon={<AlertTriangle size={11} />}>Potential Confounding Factor</StatusChip><span className="text-[10px] text-muted-foreground">Budget increased by €500 Jan 9; monitor spend parity.</span></div><button className="text-[10px] text-foreground underline">Review</button></div><div className="mt-3 space-y-2 text-[10px] text-muted-foreground"><p><Info size={12} className="mr-2 inline text-foreground" />Variant B CTR significantly higher — Directional signal only. Not conclusive yet. <span className="text-muted-foreground">Jan 10</span></p><p><AlertTriangle size={12} className="mr-2 inline text-foreground" />Spend imbalance detected: Control €692, Variant €618. Monitor parity. <span className="text-muted-foreground">Jan 10</span></p></div><div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-3 text-[10px] text-muted-foreground"><span className="text-chart-4"><Check size={12} className="mr-1 inline" />Google Ads Conversion Tag · Active</span><span className="text-chart-4"><Check size={12} className="mr-1 inline" />Google Analytics 4 · Active</span><span className="text-chart-4"><Check size={12} className="mr-1 inline" />Attribution · 30-day click</span></div><div className="mt-4 flex flex-wrap gap-2"><button className="rounded-md border border-border px-3 py-2 text-[10px] text-foreground hover:bg-secondary"><Pause size={12} className="mr-1 inline" />Pause Experiment</button><button className="rounded-md border border-border px-3 py-2 text-[10px] text-foreground">View Full Detail <ArrowRight size={12} className="ml-1 inline" /></button><button className="rounded-md border border-border/30 px-3 py-2 text-[10px] text-foreground">Ask Lulu AI about this</button></div>
    </article><article className="mt-3 rounded-xl border border-border bg-[var(--card)] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap items-center gap-2"><StatusChip icon={<Play size={11} fill="currentColor" />}>Running</StatusChip><PlatformBadge platform="Meta" /><span className="text-[10px] text-muted-foreground">Meta Ads · Audience Experiment · Day 4 of 21</span></div><button className="text-foreground"><ChevronDown size={17} /></button></div><h3 className="mt-3 text-[14px] font-semibold">CRM Lookalike 1% vs. Interest Targeting — Meta Leads</h3><p className="mt-1 text-[11px] text-muted-foreground">CRM lookalike will produce lower CPL than interest-based targeting.</p><div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground">Control CPL <b>€58.4</b> · Variant CPL <b>€61.2</b> · <span className="text-muted-foreground">+4.8% · Insufficient data</span></div><div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-muted-foreground">Too early to observe meaningful differences. Only 4 days collected. <AiBadge>AI Observation</AiBadge></span><div className="flex gap-2"><button className="text-[10px] text-foreground">View</button><button className="text-[10px] text-foreground">Pause</button><button className="text-[10px] text-foreground">Ask Lulu AI</button></div></div></article></section>
    <section><div className="mb-3 flex items-center justify-between"><h2 className="text-[15px] font-semibold">Recently Completed</h2><button className="text-[10px] text-foreground">View All History →</button></div><article className="rounded-xl border border-border border-t-2 bg-[var(--card)] p-5"><div className="flex flex-wrap items-center gap-2"><StatusChip tone="green" icon={<Check size={11} />}>Completed — Variant Winner</StatusChip><PlatformBadge platform="Meta" /><span className="text-[10px] text-muted-foreground">Meta Ads · Creative Experiment · Completed Jan 5, 2025</span></div><h3 className="mt-4 text-[17px] font-semibold">Static Image vs. Carousel — DACH Retargeting</h3><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[520px] text-left text-[11px]"><thead className="text-muted-foreground"><tr><th className="pb-2 font-normal">Metric</th><th className="pb-2 font-normal">Control (Static)</th><th className="pb-2 font-normal">Variant (Carousel)</th><th className="pb-2 font-normal">Difference</th></tr></thead><tbody className="text-foreground">{[['Conversions', '84', '117', '+39.3% ↑'], ['ROAS', '2.8', '3.6', '+28.6% ↑'], ['CPL', '€52', '€39', '−25% ↓'], ['CTR', '1.8%', '2.9%', '+61% ↑']].map(row => <tr key={row[0]} className="border-t border-border"><td className="py-2">{row[0]} <small className="ml-1 text-muted-foreground">Observed</small></td><td>{row[1]}</td><td className="text-chart-4">{row[2]}</td><td className="text-chart-4">{row[3]}</td></tr>)}</tbody></table></div><div className="mt-4 rounded-lg border-l-2 border-border bg-secondary/[0.06] p-4"><div className="flex flex-wrap gap-2"><AiBadge>AI Conclusion</AiBadge><AiBadge>AI Generated</AiBadge></div><div className="mt-3 space-y-2 text-[11px] leading-relaxed text-foreground"><p><strong className="text-foreground">What Happened:</strong> Carousel creative generated significantly more conversions and better ROAS than static image across the DACH retargeting audience over 21 days.</p><p><strong className="text-foreground">What We Learned:</strong> The DACH retargeting audience responds more strongly to multi-image carousel formats, likely because they allow multiple product angles per ad unit.</p><p><strong className="text-foreground">Business Impact:</strong> Projected annual CPL reduction of ~€156,000 at current scale. <span className="text-muted-foreground">Estimated.</span></p><p><strong className="text-foreground">Recommended Next Step:</strong> Apply carousel format to all Meta retargeting ad sets, then test carousel headline variants.</p></div></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => setShowApply(!showApply)} className="rounded-md bg-primary px-3 py-2 text-[10px] font-semibold hover:bg-primary text-primary-foreground">Apply Winning Variant →</button><button className="rounded-md border border-border px-3 py-2 text-[10px] text-foreground">Create Follow-Up Experiment</button><button className="rounded-md border border-border px-3 py-2 text-[10px] text-foreground">View Learning →</button></div>{showApply && <div className="mt-4 rounded-lg border border-border/30 bg-secondary/[0.05] p-4"><div className="flex items-center justify-between"><h4 className="text-sm font-semibold">Apply Winning Variant?</h4><button onClick={() => setShowApply(false)} className="text-foreground"><X size={15} /></button></div><p className="mt-2 text-[11px] text-muted-foreground">Changes that will be applied:</p><ul className="mt-2 space-y-1 text-[11px] text-foreground"><li>Creative Format: Static Image → Carousel <AiBadge>AI Change</AiBadge></li><li>Budget: No change</li><li>Audience: No change</li><li>Targeting: No change</li></ul><p className="mt-3 text-[10px] text-muted-foreground">This change will be submitted to the Publishing & Approval Center before being applied to the live campaign.</p><div className="mt-3 flex gap-2"><button onClick={() => setShowApply(false)} className="rounded-md border border-border px-3 py-2 text-[10px] text-foreground">Cancel</button><button className="rounded-md bg-primary px-3 py-2 text-[10px] font-semibold text-primary-foreground">Submit for Approval →</button></div></div>}</article></section>
    <section><div className="mb-3 flex items-center justify-between"><h2 className="text-[15px] font-semibold">Experiment History</h2><div className="flex gap-1 overflow-x-auto">{['Platform', 'Type', 'Status', 'Result', 'Date'].map(filter => <button key={filter} className="flex items-center gap-1 whitespace-nowrap rounded-md border border-border px-2 py-1.5 text-[10px] text-foreground">{filter}<ChevronDown size={11} /></button>)}</div></div><div className="overflow-x-auto rounded-xl border border-border bg-[var(--secondary)]"><table className="w-full min-w-[850px] text-left text-[10px]"><thead className="border-b border-border text-muted-foreground"><tr>{['Experiment', 'Platform', 'Type', 'Status', 'Result', 'Primary Metric', 'Created', 'Completed', 'Owner', ''].map(col => <th key={col} className="px-3 py-3 font-normal">{col}</th>)}</tr></thead><tbody>{history.map(row => <tr key={row.id} className="group border-b border-border text-foreground hover:bg-secondary"><td className="px-3 py-3 font-medium">{row.name}</td><td className="px-3"><PlatformBadge platform={row.platform} /></td><td className="px-3 text-muted-foreground">{row.type}</td><td className="px-3"><StatusChip tone="green" icon={<Check size={10} />}>Completed</StatusChip></td><td className="px-3 text-chart-4">{row.result}</td><td className="px-3">{row.metric}</td><td className="px-3 text-muted-foreground">{row.created}</td><td className="px-3 text-muted-foreground">{row.completed}</td><td className="px-3">{row.owner}</td><td className="px-3"><button className="opacity-0 group-hover:opacity-100 text-foreground">View →</button></td></tr>)}</tbody></table></div></section>
    <section><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-[15px] font-semibold"><Brain size={16} className="text-foreground" />Advertising Experiment Learnings</h2><button className="text-[10px] text-foreground">View All →</button></div><div className="grid gap-3 md:grid-cols-3">{[['Carousel > Static for DACH retargeting', 'Meta Ads', 'ROAS +29%', 'Jan 5, 2025'], ['Retargeting beats broad for CPL on Google', 'Google Ads', 'CPL −8%', 'Dec 20'], ['LinkedIn “Get Free Audit” CTA outperforms “Learn More”', 'LinkedIn', 'CTR +18%', 'Nov 12']].map(item => <article key={item[0]} className="rounded-xl border border-border bg-[var(--card)] p-4"><AiBadge>AI Memory</AiBadge><h3 className="mt-3 text-[12px] font-semibold">{item[0]}</h3><p className="mt-2 text-[10px] text-muted-foreground">{item[1]} · {item[3]}</p><p className="mt-2 text-[12px] font-semibold text-foreground">{item[2]}</p></article>)}</div><p className="mt-3 text-[10px] text-muted-foreground">Learnings are available to Lulu AI for future campaign and experiment recommendations. AI Inferred from experiment data.</p></section>
   </div><aside className="space-y-6"><section className="rounded-xl border border-border/25 bg-[var(--card)] p-4"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-[15px] font-semibold"><Sparkles size={16} className="text-foreground" />Ask Lulu AI</h2><span className="text-[10px] text-muted-foreground">Context loaded</span></div><div className="mt-4 rounded-lg bg-secondary p-3 text-[11px] leading-relaxed text-muted-foreground"><p className="mb-3 text-foreground">Is the Google messaging experiment ready to conclude?</p><div className="rounded-lg border border-border/20 bg-secondary/10 p-3 text-foreground">Not yet. The experiment has collected 69 total conversions across both variants in 8 days. Variant B shows encouraging directional results (+22.6% conversions, −12.5% CPL), but Lulu AI recommends allowing the full 14-day window before concluding. The spend imbalance detected on Jan 9 should also be reviewed. Lulu AI will flag when sufficient data has accumulated.</div><p className="mt-2 text-[9px] text-muted-foreground">AI Inferred · Google Ads data · Updated 4 min ago</p></div><div className="mt-3 flex flex-wrap gap-1.5">{['Do we have enough data yet?', 'Why is Variant B winning?', 'What should we test next?', 'Should we pause the experiment?', 'What did we learn from the carousel test?'].map(q => <button key={q} className="rounded-full border border-border px-2 py-1 text-[10px] text-foreground hover:border-border/40">{q}</button>)}</div><div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-[var(--secondary)] p-2"><input className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-muted-foreground" placeholder="Ask about this experiment..." /><button className="text-foreground" aria-label="Send"><Send size={14} /></button></div></section>
   <section className="rounded-xl border border-border bg-[var(--card)] p-4"><div className="flex items-center justify-between"><h2 className="text-[15px] font-semibold">AI Experiment Brief — Draft</h2><AiBadge>AI Generated</AiBadge></div><div className="mt-4 space-y-3">{[['Experiment Name', 'Benefit Messaging vs. Feature Messaging'], ['Hypothesis', 'If we change headlines to benefit language…'], ['Control', 'Current Google Search headlines'], ['Variant', 'Benefit-focused headline variants (3)'], ['Primary Metric', 'Conversion Rate · AI Recommended'], ['Secondary', 'CPL, CTR, ROAS'], ['Platform', 'Google Ads'], ['Campaign', 'Q1 Lead Gen — DACH'], ['Budget', '€1,200 total · €600 each'], ['Duration', '14 days · AI Recommended'], ['Traffic Split', '50/50'], ['Success Criteria', 'Meaningfully higher conversion rate with similar CPL']].map(field => <div key={field[0]} className="flex justify-between gap-3 border-b border-border pb-2 text-[10px]"><span className="text-muted-foreground">{field[0]}</span><span className="max-w-[185px] text-right text-foreground">{field[1]}</span></div>)}</div><div className="mt-4 rounded-lg bg-secondary/[0.06] p-3"><div className="flex items-center justify-between"><span className="text-[11px] font-semibold">Tracking Readiness</span><StatusChip tone="green" icon={<Check size={10} />}>8/10 Ready</StatusChip></div><p className="mt-2 text-[10px] text-foreground">✓ Google Ads Conversion Tag · Ready<br />✓ Google Analytics 4 · Ready<br />✓ Attribution · Ready</p><p className="mt-2 text-[10px] text-chart-1">1 warning: Campaign budget change may affect spend parity.</p></div><div className="mt-3 flex gap-2"><button className="flex-1 rounded-md border border-border py-2 text-[10px] text-foreground">Save Draft</button><button className="flex-1 rounded-md bg-primary py-2 text-[10px] font-semibold text-primary-foreground">Request Approval →</button></div></section>
   <section className="rounded-xl border border-border bg-[var(--card)] p-4"><h2 className="text-[15px] font-semibold">Experiment Activity</h2><div className="mt-4 space-y-4">{[['AI', 'Variant B spend imbalance flagged', 'Lulu AI · 4 min ago'], ['✓', '“Static vs. Carousel” winning variant applied', 'Sarah M. · 1 hr ago'], ['AI', 'Experiment conclusion generated', 'Lulu AI · 2 hr ago'], ['●', 'Google messaging experiment reached Day 8', 'Platform · Today'], ['✓', 'CRM Lookalike experiment launched', 'Tom K. · Jan 7']].map(event => <div key={event[1]} className="flex gap-3 text-[10px]"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-foreground">{event[0]}</span><div><p className="text-foreground">{event[1]}</p><p className="mt-1 text-muted-foreground">{event[2]}</p></div></div>)}</div></section>
   <section className="rounded-xl border border-border bg-[var(--card)] p-4"><h2 className="flex items-center gap-2 text-[15px] font-semibold"><ShieldCheck size={16} className="text-foreground" />Experiment Governance</h2><dl className="mt-4 space-y-3 text-[10px]"><div><dt className="text-muted-foreground">Approval required for</dt><dd className="mt-1 text-foreground">Experiment launch · Applying variants · Budget allocation</dd></div><div><dt className="text-muted-foreground">Current policy</dt><dd className="mt-1 text-foreground">Recommend Changes</dd></div><div><dt className="text-muted-foreground">Max auto-apply</dt><dd className="mt-1 text-foreground">Non-financial creative swaps only (if pre-approved)</dd></div></dl><p className="mt-4 border-t border-border pt-3 text-[10px] leading-relaxed text-muted-foreground">All experiment launches and variant applications require explicit approval per organization policy.</p></section>
   <section className="rounded-xl border border-border bg-[var(--card)] p-4"><h2 className="text-[15px] font-semibold">Pattern states</h2><div className="mt-3 space-y-2 text-[10px]"><div className="rounded-lg border border-border p-3 text-muted-foreground">No Data · Awaiting platform sync</div><div className="h-7 animate-pulse rounded bg-secondary" /><div className="rounded-lg border border-chart-5/20 p-3 text-chart-5">Error · Google Ads connection needs review</div></div></section>
  </aside></div></div></div></main>;
}

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
          <span data-lulu-section-soon={section.label !== "Website" ? "true" : undefined}>{section.label}</span>
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
