import { useState } from 'react';
import { Activity, AlertTriangle, ArrowUpRight, BarChart3, Bot, Check, ChevronDown, Clock3, Download, FileText, Gauge, KanbanSquare, LayoutDashboard, Map, Menu, MoreHorizontal, Search, Settings, Sparkles, Target, TrendingUp, Users, X, Zap } from 'lucide-react';
type Tone = 'neutral' | 'positive' | 'warning' | 'danger' | 'ai';
const navGroups = [{
  label: 'Workspace',
  items: [{
    label: 'Overview',
    icon: LayoutDashboard
  }, {
    label: 'Sales Overview',
    icon: Gauge
  }]
}, {
  label: 'Sales',
  items: [{
    label: 'Leads',
    icon: Users
  }, {
    label: 'Opportunities',
    icon: KanbanSquare
  }, {
    label: 'Pipeline',
    icon: TrendingUp
  }, {
    label: 'Deals',
    icon: Check
  }, {
    label: 'Activities',
    icon: Activity
  }, {
    label: 'Forecast',
    icon: Target
  }, {
    label: 'Territories',
    icon: Map
  }, {
    label: 'Analytics',
    icon: BarChart3
  }]
}, {
  label: 'Enablement',
  items: [{
    label: 'Automation',
    icon: Zap
  }, {
    label: 'Playbooks',
    icon: FileText
  }, {
    label: 'Sequences',
    icon: FileText
  }, {
    label: 'Products & Pricing',
    icon: Target
  }]
}];
const kpis = [['Total Territories', '24', 'Recorded', 'Defined markets and segments'], ['Active Territories', '18', 'Recorded', 'Currently routing records'], ['Unassigned Accounts', '47', 'Calculated', '4% of eligible accounts', 'warning'], ['Unassigned Leads', '83', 'Calculated', '9% of eligible leads', 'warning'], ['Unassigned Opportunities', '31', 'Calculated', '12% of eligible opportunities', 'warning'], ['Overlapping Territories', '3', 'Calculated', 'Needs review', 'danger'], ['Territory Revenue', '€4.2M', 'Recorded', 'Across all territories'], ['Territory Coverage', '81%', 'Calculated', 'Assigned records']];
const territories = [['Germany Enterprise', 'Maria Chen', 'Enterprise Team', 'Germany', '184', '73', '42', '€1.8M', '€620K', 'Active', 'Today'], ['DACH Mid-Market', 'Thomas Bauer', 'EMEA Mid-Market', 'DACH', '122', '54', '28', '€1.1M', '€410K', 'Active', 'Yesterday'], ['Benelux Enterprise', 'Sophie Laurent', 'Enterprise Team', 'Benelux', '96', '41', '19', '€840K', '€310K', 'Active', '2d ago'], ['UK Enterprise', 'James Whitfield', 'Enterprise Team', 'United Kingdom', '143', '67', '38', '€1.5M', '€560K', 'Active', 'Today'], ['France General', 'Isabelle Moreau', 'EMEA Mid-Market', 'France', '88', '39', '16', '€620K', '€230K', 'Draft', '3d ago'], ['Nordics Enterprise', 'Erik Lindqvist', 'Nordics Team', 'Nordics', '71', '28', '14', '€480K', '€175K', 'Active', '1w ago'], ['Germany SMB', 'Priya Patel', 'SMB Team', 'Germany', '260', '118', '51', '€920K', '€290K', 'Overlapping', 'Today'], ['Italy & Iberia', 'Carlos Mendes', 'EMEA Mid-Market', 'Italy/Spain/Portugal', '63', '24', '11', '€390K', '€140K', 'Active', '2d ago']];
const performance = [['Germany Enterprise', '€620K', '€1.8M', '€680K', '€740K', '18', '64%', '12', '€34K'], ['UK Enterprise', '€560K', '€1.5M', '€590K', '€680K', '15', '61%', '10', '€37K'], ['DACH Mid-Market', '€410K', '€1.1M', '€420K', '€490K', '11', '58%', '8', '€37K'], ['Benelux Enterprise', '€310K', '€840K', '€320K', '€370K', '9', '55%', '7', '€34K']];
const ownership = [['Maria Chen', '1', '184', '€1.8M', '€620K', 'Active'], ['Thomas Bauer', '1', '122', '€1.1M', '€410K', 'Active'], ['James Whitfield', '1', '143', '€1.5M', '€560K', 'Active'], ['Sophie Laurent', '1', '96', '€840K', '€310K', 'Active'], ['Priya Patel', '1', '260', '€920K', '€290K', 'Overlap'], ['Carlos Mendes', '1', '63', '€390K', '€140K', 'Active']];
const assigned = [['Beispiel GmbH', 'Germany Enterprise', 'Maria Chen', '€48K', 'Customer', '2h ago'], ['Nordlicht AG', 'DACH Mid-Market', 'Thomas Bauer', '€32K', 'Prospect', '4h ago'], ['Maison Lumière', 'France General', 'Isabelle Moreau', '€27K', 'Lead', 'Yesterday'], ['Kite Systems', 'UK Enterprise', 'James Whitfield', '€84K', 'Customer', 'Yesterday'], ['Brabant Retail', 'Benelux Enterprise', 'Sophie Laurent', '€19K', 'Prospect', '2d ago']];
const history = [['Territory created', 'Germany Enterprise', 'Jordan Davis', 'Jul 1, 2026 · 09:14'], ['Owner changed', 'Germany Enterprise · Previous: Lars Müller → Maria Chen', 'Jordan Davis', 'Jul 3, 2026'], ['Priority changed', 'Germany Enterprise moved from 02 to 01', 'Jordan Davis', 'Jul 5, 2026'], ['Rules changed', 'Germany SMB: Company Size rule updated (>50 → >100)', 'Maria Chen', 'Jul 8, 2026'], ['Records reassigned', '14 accounts moved from Germany Mid-Market to Germany Enterprise', 'System', 'Jul 10, 2026'], ['Territory archived', 'Germany Mid-Market', 'Jordan Davis', 'Jul 12, 2026']];
const conflicts = [['Germany Enterprise ↔ Germany SMB', 'Overlapping rules', '14 affected accounts (enterprise >250 employees)', 'Raise Germany Enterprise priority'], ['DACH Mid-Market ↔ Germany Mid-Market', 'Duplicate territory definition', '8 duplicate accounts', 'Merge or archive Germany Mid-Market'], ['France General', 'Unassigned records', '39 accounts not covered by active territory', 'Activate or expand France General']];
const recordsTabs = ['Accounts', 'Leads', 'Opportunities', 'Deals'];
export const Card = ({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) => <section className={`rounded-xl border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,.035)] ${className}`}>{children}</section>;
export const Badge = ({
  children,
  tone = 'neutral'
}: {
  children: React.ReactNode;
  tone?: Tone;
}) => <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${tone === 'positive' ? 'bg-chart-4/10 text-chart-4' : tone === 'warning' ? 'bg-chart-1/10 text-chart-1' : tone === 'danger' ? 'bg-chart-5/10 text-chart-5' : tone === 'ai' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{children}</span>;
export const StatusBadge = ({
  status
}: {
  status: string;
}) => <Badge tone={status === 'Active' ? 'positive' : status === 'Overlapping' || status === 'Overlap' ? 'warning' : 'neutral'}>{status}</Badge>;
const SectionTitle = ({
  title,
  badge,
  icon: Icon
}: {
  title: string;
  badge?: string;
  icon?: typeof Clock3;
}) => <div className="flex items-center gap-2"><h2 className="text-base font-semibold text-foreground">{title}</h2>{badge && <Badge tone={badge.includes('conflict') ? 'danger' : badge.includes('AI') ? 'ai' : 'neutral'}>{badge}</Badge>}{Icon && <Icon size={17} className="text-chart-5" />}</div>;
export const LuluTerritories = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const [activeTab, setActiveTab] = useState('Accounts');
  const [aiPrompt, setAiPrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  return <div className="min-h-screen bg-[var(--background)] font-sans text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-30 w-[244px] bg-[var(--sidebar)] px-4 py-5 text-foreground transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-8 flex items-center justify-between px-2"><div className="flex items-center gap-2 text-foreground"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-bold text-primary-foreground">L</div><strong className="text-lg tracking-tight">Lulu AI</strong></div><button aria-label="Close navigation" className="lg:hidden" onClick={() => setMobileNav(false)}><X size={18} /></button></div>
      <LuluSectionNavigation activeId="kindly-morning-7115" />
      <div className="absolute inset-x-4 bottom-5 border-t border-border pt-4"><button className="mb-4 flex w-full items-center gap-3 px-2 text-sm text-foreground hover:text-foreground"><Settings size={16} /><span>Settings</span></button><div className="flex items-center gap-3 px-2"><div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">JD</div><div><p className="text-sm font-medium text-foreground">Jordan Davis</p><p className="text-xs text-muted-foreground">Administrator</p></div></div></div>
    </aside>
    <main className="lg:pl-[244px]"><header className="sticky top-0 z-20 border-b border-border bg-[var(--secondary)]/95 px-4 py-4 backdrop-blur md:px-8"><div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4"><button aria-label="Open navigation" className="rounded-lg border border-border bg-card p-2 lg:hidden" onClick={() => setMobileNav(true)}><Menu size={18} /></button><div><div className="mb-1 text-xs text-muted-foreground">Sales <span className="px-1">/</span> Territories</div><h1 className="text-2xl font-bold tracking-[-.04em] text-foreground md:text-3xl">Sales Territories</h1><p className="mt-1 hidden text-sm text-muted-foreground sm:block">Organize sales ownership across markets, regions and customer segments.</p></div><div className="flex items-center gap-2"><button className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary md:flex"><Sparkles size={15} /> Ask Lulu AI</button><button className="hidden rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground sm:block">Import</button><button className="hidden rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground sm:block">Export</button><button aria-label="More actions" className="rounded-lg border border-border bg-card p-2 text-foreground"><MoreHorizontal size={18} /></button><button className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary">Create Territory</button></div></div></header>
      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 md:px-8">
        <div className="flex gap-3 overflow-x-auto pb-1">{kpis.map(([label, value, badge, note, tone]) => <Card key={label} className="min-w-[164px] flex-1 p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{value}</p><div className="mt-2 flex items-center justify-between gap-2"><Badge tone={tone as Tone || 'neutral'}>{badge}</Badge>{label === 'Territory Coverage' && <span className="h-5 w-5 rounded-full border-[3px] border-border border-r-border" />}</div><p className="mt-2 whitespace-nowrap text-[11px] text-muted-foreground">{note}</p></Card>)}</div>
        <Card className="flex flex-col gap-3 p-3 md:flex-row md:items-center"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-muted-foreground" size={17} /><input aria-label="Search territories" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search territories..." className="w-full rounded-lg border border-border py-2 pl-9 pr-3 text-sm outline-none focus:border-border" /></div><div className="flex flex-wrap gap-2">{['Status', 'Owner', 'Team', 'Country', 'Region', 'Market', 'Coverage'].map(filter => <button key={filter} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-card">{filter}<ChevronDown size={13} /></button>)}<button className="px-2 text-xs font-medium text-foreground">Clear Filters</button><button className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground">Save Filter</button></div></Card>
        <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-border p-5"><SectionTitle title="Territories" badge="24" /><div className="flex gap-2"><button className="rounded-lg border border-border p-2 text-foreground" aria-label="Toggle columns"><BarChart3 size={16} /></button><button className="rounded-lg border border-border p-2 text-foreground" aria-label="Export territories"><Download size={16} /></button></div></div><div className="overflow-x-auto"><table className="min-w-[1200px] w-full text-left text-xs"><thead className="border-y border-border bg-card/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Territory', 'Owner', 'Team', 'Market', 'Accounts', 'Leads', 'Opportunities', 'Pipeline', 'Revenue', 'Status', 'Last Updated', ''].map(head => <th key={head} className="whitespace-nowrap px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody>{territories.filter(row => row[0].toLowerCase().includes(searchQuery.toLowerCase())).map(row => <tr key={row[0]} className="border-b border-border hover:bg-card/50">{row.map((cell, i) => <td key={`${row[0]}-${i}`} className={`whitespace-nowrap px-4 py-3 ${i === 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{i === 9 ? <StatusBadge status={cell} /> : cell}</td>)}<td className="px-4"><button aria-label={`Actions for ${row[0]}`}><MoreHorizontal size={17} className="text-muted-foreground" /></button></td></tr>)}</tbody></table></div></Card>
        <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]"><Card className="overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5"><div className="flex items-center gap-2"><SectionTitle title="Territory Performance" badge="Calculated" /><select className="rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground"><option>Current Quarter</option><option>Previous Quarter</option><option>YoY</option></select></div></div><div className="overflow-x-auto"><table className="min-w-[850px] w-full text-left text-xs"><thead className="bg-secondary/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Territory', 'Revenue', 'Pipeline', 'Weighted', 'Forecast', 'Deals Won', 'Win Rate', 'New Customers', 'Avg Deal'].map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody>{performance.map(row => <tr key={row[0]} className="border-b border-border"><td className="px-4 py-3 font-semibold">{row[0]}</td>{row.slice(1).map((v, i) => <td key={`${row[0]}-${i}`} className="whitespace-nowrap px-4 py-3 text-muted-foreground">{v}</td>)}</tr>)}</tbody></table></div><p className="p-4 text-[11px] text-muted-foreground">Performance values are calculated from CRM records. Forecast values are projections.</p></Card>
          <Card className="p-5"><SectionTitle title="Territory Coverage" badge="Calculated" /><div className="flex items-center gap-6 py-6"><div className="grid h-32 w-32 shrink-0 place-items-center rounded-full" style={{
                background: 'conic-gradient(var(--primary) 81%, var(--secondary) 0)'
              }}><div className="grid h-24 w-24 place-items-center rounded-full bg-card text-2xl font-bold">81%</div></div><div className="space-y-3 text-xs">{[['Covered Accounts', '1,240 / 1,287 (96%)'], ['Unassigned Accounts', '47 (4%)'], ['Covered Leads', '834 / 917 (91%)'], ['Unassigned Leads', '83 (9%)'], ['Covered Opportunities', '218 / 249 (88%)'], ['Unassigned Opportunities', '31 (12%)']].map(([label, value]) => <div key={label} className="flex justify-between gap-5"><span className={label.startsWith('Unassigned') ? 'text-chart-1' : 'text-muted-foreground'}>{label}</span><strong className="text-foreground">{value}</strong></div>)}</div></div><p className="mb-4 text-[11px] text-muted-foreground">Coverage rate = assigned records / total eligible records.</p><button className="w-full rounded-lg border border-border py-2 text-sm font-semibold text-foreground hover:bg-secondary">Review Uncovered Records</button></Card></div>
        <div className="grid gap-5 xl:grid-cols-[1fr_1.2fr]"><Card className="p-5"><div className="mb-4 flex items-center justify-between"><SectionTitle title="Territory Conflicts" badge="3 conflicts" icon={AlertTriangle} /></div><div className="space-y-4">{conflicts.map(([name, type, affected, recommendation]) => <div key={name} className="rounded-lg border border-border p-4"><div className="flex items-start justify-between gap-2"><strong className="text-sm">{name}</strong><Badge tone="warning">{type}</Badge></div><p className="mt-2 text-xs text-muted-foreground">{affected}</p><p className="mt-2 text-xs italic text-muted-foreground">Recommended: {recommendation}</p><div className="mt-3 flex gap-2"><button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground">Review</button><button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">Resolve</button></div></div>)}</div></Card><Card className="overflow-hidden"><div className="p-5"><SectionTitle title="Territory Ownership" /></div><div className="overflow-x-auto"><table className="min-w-[620px] w-full text-left text-xs"><thead className="border-y border-border bg-card/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Owner', 'Territories', 'Accounts', 'Pipeline', 'Revenue', 'Status'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>{ownership.map(row => <tr key={row[0]} className="border-b border-border"><td className="px-4 py-3 font-semibold">{row[0]}</td>{row.slice(1).map((v, i) => <td key={`${row[0]}-${i}`} className="whitespace-nowrap px-4 py-3 text-muted-foreground">{i === 4 ? <StatusBadge status={v} /> : v}</td>)}</tr>)}</tbody></table></div><p className="p-4 text-[11px] text-muted-foreground">Ownership transfers require authorization.</p></Card></div>
        <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-border p-5"><SectionTitle title="Assigned Records" /><div className="flex gap-1 rounded-lg bg-secondary p-1">{recordsTabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-md px-3 py-1.5 text-xs font-medium ${activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{tab}</button>)}</div></div><div className="overflow-x-auto"><table className="min-w-[720px] w-full text-left text-xs"><thead className="border-y border-border bg-card/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Name', 'Territory', 'Owner', 'Value', 'Status', 'Last Activity', ''].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>{assigned.map(row => <tr key={row[0]} className="border-b border-border hover:bg-card/50">{row.map((v, i) => <td key={`${row[0]}-${i}`} className={`whitespace-nowrap px-4 py-3 ${i === 0 ? 'font-semibold' : 'text-muted-foreground'}`}>{i === 4 ? <StatusBadge status={v} /> : v}</td>)}<td className="px-4 text-lg text-foreground">→</td></tr>)}</tbody></table></div><p className="p-4 text-[11px] text-muted-foreground">Records open in the originating CRM module. Permissions apply.</p></Card>
        <Card className="p-5"><div className="mb-5 flex items-center gap-2"><SectionTitle title="Territory History" /><Clock3 size={17} className="text-muted-foreground" /></div><div className="space-y-4">{history.map(([event, territory, user, time]) => <div key={event + territory} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-l-2 border-border pl-4 text-xs"><Badge>{event}</Badge><strong>{territory}</strong><span className="text-muted-foreground">{user}</span><time className="text-muted-foreground">{time}</time></div>)}</div></Card>
        <div className="grid gap-5 xl:grid-cols-2"><Card className="border-border bg-gradient-to-br from-secondary/70 to-white p-5"><div className="mb-5 flex items-center gap-2"><Sparkles size={18} className="text-foreground" /><SectionTitle title="AI Territory Insights" badge="AI-generated" /></div><div className="space-y-3">{[['Coverage Gap', 'A significant number of eligible accounts are currently outside an active territory, primarily in France and Southern Europe.', '47 unassigned accounts · 39 in France', 'amber'], ['Territory Overlap', 'Two territory rules overlap for a subset of enterprise accounts in Germany. Records currently match both Germany Enterprise and Germany SMB.', '14 affected accounts · Germany', 'amber'], ['Performance Imbalance', 'Revenue and pipeline are heavily concentrated in Germany Enterprise and UK Enterprise. Other territories may benefit from additional resources or rule refinement.', '2 territories account for 56% of pipeline', 'blue']].map(([title, body, evidence, color]) => <div key={title} className="rounded-lg border border-border bg-secondary p-4"><div className="flex gap-2"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${color === 'blue' ? 'bg-primary' : 'bg-primary'}`} /><div><h3 className="text-xs font-bold">{title}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p><p className="mt-2 text-[10px] font-semibold text-foreground">Supporting evidence · {evidence}</p></div></div></div>)}</div></Card><Card className="border-border bg-gradient-to-br from-secondary to-white p-5"><div className="mb-4 flex items-center gap-2"><Bot size={18} className="text-muted-foreground" /><SectionTitle title="Ask Lulu AI to Design Territories" badge="AI assistant" /></div><textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={4} placeholder="Describe how you want your sales territories structured..." className="w-full resize-none rounded-lg border border-border bg-card p-3 text-sm outline-none focus:border-border" /><div className="mt-3 flex flex-wrap gap-2">{['Create territories for Germany by federal state', 'Split Europe into regional sales territories', 'Create enterprise territories for companies above €100M revenue', 'Find gaps in our current territory structure', 'Recommend a territory structure for our sales team'].map(chip => <button key={chip} onClick={() => setAiPrompt(chip)} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground hover:bg-secondary">{chip}</button>)}</div><button className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary">Send to Lulu AI <ArrowUpRight size={15} /></button><p className="mt-4 flex items-start gap-1 text-[11px] text-muted-foreground"><Check size={13} className="mt-0.5 text-foreground" />AI-generated · Lulu AI does not automatically activate territory changes. Review and confirm before activation.</p></Card></div>
        <div className="h-8" />
      </div>
    </main>
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
