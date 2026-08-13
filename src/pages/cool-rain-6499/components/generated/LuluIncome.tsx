import { useMemo, useState } from 'react';
import { Activity, AlertCircle, ArrowDownRight, ArrowUpRight, BarChart3, Brain, Check, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, Clock3, Download, FileText, Filter, HelpCircle, Import, MoreHorizontal, Search, Send, Settings, Sparkles, Tag, Trash2, Upload, Users, Wallet, X, Zap } from 'lucide-react';
type Status = 'Received' | 'Pending' | 'Outstanding' | 'Recorded' | 'Cancelled';
interface IncomeRow {
  id: string;
  date: string;
  customer: string;
  category: string;
  amount: string;
  currency: string;
  status: Status;
  account: string;
  channel: string;
  source: string;
  created: string;
}
const navItems = ['Dashboard', 'AI Assistant', 'AI Agents', 'CRM', 'Marketing', 'Advertising'];
const financeItems = ['Overview', 'Invoices', 'Offers & Quotes', 'Payments', 'Income', 'Expenses', 'Transactions', 'Accounts', 'Cash Flow', 'Recurring Revenue', 'Reports'];
const incomeRows: IncomeRow[] = [{
  id: 'INC-2026-00124',
  date: '10 Aug 2026',
  customer: 'Acme GmbH',
  category: 'Software Services',
  amount: '€4,850.00',
  currency: 'EUR',
  status: 'Received',
  account: 'Business Account',
  channel: 'Direct Sales',
  source: 'Invoice',
  created: '10 Aug 2026'
}, {
  id: 'INC-2026-00123',
  date: '09 Aug 2026',
  customer: 'TechCorp Ltd',
  category: 'Consulting',
  amount: '€12,500.00',
  currency: 'EUR',
  status: 'Received',
  account: 'Business Account',
  channel: 'Direct Sales',
  source: 'Manual',
  created: '09 Aug 2026'
}, {
  id: 'INC-2026-00122',
  date: '08 Aug 2026',
  customer: 'Global Shop',
  category: 'Subscriptions',
  amount: '€890.00',
  currency: 'USD',
  status: 'Pending',
  account: 'USD Account',
  channel: 'Subscription',
  source: 'Payment Provider',
  created: '08 Aug 2026'
}, {
  id: 'INC-2026-00121',
  date: '07 Aug 2026',
  customer: 'Marketplace Co',
  category: 'Marketplace Sales',
  amount: '€3,200.00',
  currency: 'EUR',
  status: 'Received',
  account: 'Business Account',
  channel: 'Marketplace',
  source: 'Automation',
  created: '07 Aug 2026'
}, {
  id: 'INC-2026-00120',
  date: '06 Aug 2026',
  customer: 'StartupXYZ',
  category: 'Services',
  amount: '€6,750.00',
  currency: 'EUR',
  status: 'Outstanding',
  account: 'Business Account',
  channel: 'Services',
  source: 'Invoice',
  created: '06 Aug 2026'
}, {
  id: 'INC-2026-00119',
  date: '05 Aug 2026',
  customer: 'RetailMax',
  category: 'Product Sales',
  amount: '€1,450.00',
  currency: 'EUR',
  status: 'Received',
  account: 'Business Account',
  channel: 'Ecommerce',
  source: 'Ecommerce',
  created: '05 Aug 2026'
}, {
  id: 'INC-2026-00118',
  date: '04 Aug 2026',
  customer: 'Alpha Partners',
  category: 'Commissions',
  amount: '€2,100.00',
  currency: 'EUR',
  status: 'Recorded',
  account: 'Business Account',
  channel: 'Direct Sales',
  source: 'AI-assisted',
  created: '04 Aug 2026'
}, {
  id: 'INC-2026-00117',
  date: '03 Aug 2026',
  customer: 'Beta Systems',
  category: 'Licensing',
  amount: '€5,600.00',
  currency: 'EUR',
  status: 'Cancelled',
  account: 'Business Account',
  channel: 'Direct Sales',
  source: 'Invoice',
  created: '03 Aug 2026'
}];
const sourceData = [['Direct Sales', '€98,400', '34.6%', '+18.2%', '44'], ['Services', '€76,300', '26.8%', '+9.6%', '31'], ['Subscriptions', '€56,100', '19.7%', '+14.1%', '28'], ['Ecommerce', '€32,450', '11.4%', '+5.4%', '13'], ['Marketplace', '€21,400', '7.5%', '-8.2%', '8']];
const categoryData = [['Software Services', '€62k', '21.8%', '+16.4%', '18'], ['Consulting', '€48k', '16.9%', '+11.1%', '14'], ['Subscriptions', '€42k', '14.8%', '+14.1%', '28'], ['Product Sales', '€38k', '13.4%', '+4.8%', '22'], ['Licensing', '€32k', '11.3%', '+8.9%', '9'], ['Other', '€22k', '7.7%', '+2.1%', '33']];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const customerData = [['TechCorp Ltd', '€42k', '9', '€4,667', 'Yes', '+18.4%', '09 Aug'], ['Acme GmbH', '€38k', '14', '€2,714', 'Yes', '+12.1%', '10 Aug'], ['Global Shop', '€28k', '22', '€1,273', 'Yes', '+9.8%', '08 Aug'], ['StartupXYZ', '€24k', '5', '€4,800', 'No', '+4.2%', '06 Aug'], ['Alpha Partners', '€19k', '8', '€2,375', 'No', '+16.0%', '04 Aug']];
const products = [['Managed Cloud Services', '€54.2k', '€6,775', '+22.4%', '19.0%'], ['Advisory Retainer', '€41.8k', '€5,225', '+14.8%', '14.7%'], ['Pro Subscription', '€36.4k', '€1,517', '+12.2%', '12.8%'], ['Enterprise License', '€32.0k', '€8,000', '+8.9%', '11.3%'], ['Implementation', '€28.6k', '€4,767', '+6.4%', '10.0%']];
const recurring = [['TechCorp Ltd', 'Pro Subscription', '€8,400', 'Monthly', '01 Sep 2026', 'Active'], ['Acme GmbH', 'Managed Cloud', '€4,850', 'Monthly', '10 Sep 2026', 'Active'], ['Global Shop', 'Enterprise Plan', '€12,000', 'Annual', '08 Jan 2027', 'Active'], ['Alpha Partners', 'Advisory Retainer', '€3,200', 'Monthly', '04 Sep 2026', 'Paused']];
const statusStyles: Record<Status, string> = {
  Received: 'text-chart-4 bg-chart-4/10',
  Pending: 'text-chart-1 bg-chart-1/10',
  Outstanding: 'text-chart-1 bg-chart-1/10',
  Recorded: 'text-foreground bg-secondary',
  Cancelled: 'text-muted-foreground bg-secondary'
};
function SectionTitle({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle?: string;
  action?: string;
}) {
  return <header className="flex items-end justify-between gap-3 mb-4"><div><h2 className="text-[16px] font-bold text-foreground">{title}</h2>{subtitle && <p className="text-[12px] text-muted-foreground mt-1">{subtitle}</p>}</div>{action && <button className="text-[12px] font-semibold text-foreground hover:text-foreground">{action}</button>}</header>;
}
function SmallTable({
  headers,
  rows
}: {
  headers: string[];
  rows: string[][];
}) {
  return <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr>{headers.map(h => <th key={h} className="px-3 py-2 text-[10px] uppercase tracking-[.08em] text-muted-foreground font-bold border-b border-border whitespace-nowrap">{h}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[0]} className="hover:bg-card transition-colors">{row.map((cell, i) => <td key={`${row[0]}-${i}`} className={`px-3 py-2.5 text-[12px] whitespace-nowrap border-b border-border ${i === 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
export function LuluIncome() {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [activeRange, setActiveRange] = useState('Monthly');
  const [sent, setSent] = useState(false);
  const filtered = useMemo(() => incomeRows.filter(r => Object.values(r).join(' ').toLowerCase().includes(query.toLowerCase())), [query]);
  const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  return <main className="min-h-screen bg-[var(--background)] text-foreground flex font-sans">
  <aside className="w-[238px] shrink-0 bg-[var(--background)] text-foreground flex flex-col min-h-screen p-4 fixed inset-y-0 left-0 z-10"><div className="flex items-center gap-3 px-3 py-3 mb-5"><div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-black/40 text-primary-foreground"><Sparkles size={17} /></div><div><strong className="text-[16px] tracking-tight">lulu<span className="text-foreground">.</span></strong><p className="text-[9px] text-muted-foreground tracking-[.18em] uppercase">AI workspace</p></div></div><LuluSectionNavigation activeId="cool-rain-6499" /><div className="mt-auto p-3 rounded-xl bg-secondary border border-border"><div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">JD</div><div><p className="text-[11px] font-semibold">Jordan Davis</p><p className="text-[10px] text-muted-foreground">Administrator</p></div><MoreHorizontal size={15} className="ml-auto text-muted-foreground" /></div></div></aside>
  <section className="ml-[238px] flex-1 min-w-0"><div className="max-w-[1440px] mx-auto px-8 py-7"><div className="flex items-center justify-between mb-7"><div><div className="flex gap-2 text-[11px] text-muted-foreground mb-2"><span>Finance</span><span>/</span><span className="text-muted-foreground">Income</span></div><h1 className="text-[28px] font-bold tracking-[-.04em]">Income</h1><p className="text-[13px] text-muted-foreground mt-1">Track, understand and analyze where your business income comes from.</p></div><div className="flex items-center gap-2"><button className="bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-[12px] font-bold shadow-sm hover:bg-primary"><span>+ Record Income</span></button>{['Ask Lulu AI', 'Import', 'Export'].map(x => <button key={x} className="bg-card border border-border rounded-lg px-3 py-2.5 text-[12px] font-semibold text-foreground hover:border-border">{x}</button>)}<button className="p-2.5 rounded-lg border border-border bg-card"><MoreHorizontal size={16} /></button></div></div>
   <div className="grid grid-cols-7 gap-3 mb-6">{[['Total Income', '€284,650', 'Jan–Aug 2026', 'Connected'], ['Income Growth', '+12.4% ↑', 'vs Previous Period', 'Calculated'], ['Recurring Income', '€142,320', '50.0% of total', 'Observed'], ['One-Time Income', '€142,330', '50.0% of total', 'Observed'], ['Average Income', '€2,285', 'Per record', 'Calculated'], ['Largest Income Source', 'Direct Sales', '€98,400', 'Observed'], ['Outstanding Income', '€18,750', '14 records', 'Observed']].map(kpi => <article key={kpi[0]} className="bg-card rounded-xl border border-border/80 px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,.03)] min-w-0"><p className="text-[10px] uppercase tracking-[.06em] text-muted-foreground font-bold truncate">{kpi[0]}</p><p className="text-[20px] font-bold tracking-[-.04em] mt-2 truncate">{kpi[1]}</p><div className="flex flex-wrap gap-1.5 mt-2"><span className="text-[10px] text-muted-foreground">{kpi[2]}</span><span className="text-[9px] font-semibold text-foreground bg-secondary px-1.5 py-0.5 rounded">{kpi[3]}</span></div></article>)}</div>
   <section className="bg-card border border-border/80 rounded-xl mb-6"><div className="p-4 flex flex-wrap items-center gap-3 border-b border-border"><label className="text-[11px] font-bold text-muted-foreground">Reporting Currency<select className="block mt-1 w-[130px] rounded-md border border-border px-2 py-1.5 text-[12px] font-normal"><option>EUR €</option></select></label><label className="text-[11px] font-bold text-muted-foreground">Date Range<select className="block mt-1 w-[140px] rounded-md border border-border px-2 py-1.5 text-[12px] font-normal"><option>Year to Date</option></select></label><label className="text-[11px] font-bold text-muted-foreground">Compare With<select className="block mt-1 w-[150px] rounded-md border border-border px-2 py-1.5 text-[12px] font-normal"><option>Previous Year</option></select></label><div className="ml-auto flex items-center gap-2"><button className="p-2 border border-border rounded-md text-foreground"><Filter size={15} /></button><button className="px-3 py-2 border border-border rounded-md text-[11px] font-semibold">Save Filter</button></div></div><div className="p-4"><div className="relative"><Search size={15} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search income..." className="w-full rounded-lg border border-border pl-9 pr-3 py-2 text-[12px] outline-none focus:ring-2 focus:ring-ring" /></div><div className="flex flex-wrap gap-2 mt-3">{['Status', 'Source', 'Customer', 'Category', 'Account', 'Date', 'Amount', 'Currency', 'Recurring', 'Channel', 'Source Type'].map(x => <button key={x} className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1.5 text-[10px] text-foreground hover:border-border">{x}<ChevronDown size={11} /></button>)}<button className="text-[10px] text-foreground ml-1">Clear Filters</button></div></div></section>
   {selected.length > 0 && <div className="flex items-center gap-2 bg-secondary border border-border rounded-lg p-3 mb-2 text-[11px] text-foreground"><strong>{selected.length} selected</strong><button>Categorize</button><button>Assign Account</button><button>Export</button><button>Cancel</button><button className="text-chart-5">Delete</button></div>}
   <section className="bg-card border border-border/80 rounded-xl overflow-hidden mb-6"><div className="p-4 flex justify-between items-center"><SectionTitle title="Income records" subtitle="A complete view of every recorded income event" /><span className="text-[11px] text-muted-foreground">Updated just now</span></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-card/80">{['', 'Income ID', 'Date', 'Customer / Source', 'Category', 'Amount', 'Currency', 'Status', 'Account', 'Channel', 'Source Type', 'Created', ''].map((h, i) => <th key={`${h}-${i}`} className="px-3 py-2.5 text-[10px] uppercase tracking-[.07em] text-muted-foreground font-bold whitespace-nowrap">{h}</th>)}</tr></thead><tbody>{filtered.map(r => <tr key={r.id} className={`group hover:bg-secondary/30 border-t border-border ${r.status === 'Cancelled' ? 'text-muted-foreground line-through' : ''}`}><td className="px-3 py-3"><input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggle(r.id)} aria-label={`Select ${r.id}`} className="accent-primary" /></td><td className="px-3 py-3 text-[11px] font-semibold text-foreground whitespace-nowrap">{r.id}</td><td className="px-3 py-3 text-[11px] whitespace-nowrap">{r.date}</td><td className="px-3 py-3 text-[12px] font-semibold whitespace-nowrap">{r.customer}</td><td className="px-3 py-3 text-[11px] whitespace-nowrap">{r.category}</td><td className="px-3 py-3 text-[12px] font-bold whitespace-nowrap">{r.amount}</td><td className="px-3 py-3 text-[11px]">{r.currency}</td><td className="px-3 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold no-underline ${statusStyles[r.status]}`}><span>{r.status === 'Received' ? '✓' : r.status === 'Pending' ? '◷' : r.status === 'Outstanding' ? '!' : r.status === 'Recorded' ? '●' : '×'}</span><span>{r.status}</span></span></td><td className="px-3 py-3 text-[11px] whitespace-nowrap">{r.account}</td><td className="px-3 py-3 text-[11px] whitespace-nowrap">{r.channel}</td><td className="px-3 py-3 text-[11px] whitespace-nowrap">{r.source}</td><td className="px-3 py-3 text-[11px] whitespace-nowrap">{r.created}</td><td className="px-3 py-3"><button className="opacity-0 group-hover:opacity-100 text-foreground"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div><div className="flex items-center justify-between px-4 py-3 border-t border-border text-[11px] text-muted-foreground"><span>Showing 1–8 of 124 records</span><div className="flex items-center gap-3"><span>Rows per page <select className="border border-border rounded px-1 py-1 ml-1"><option>8</option><option>25</option></select></span><button><ChevronLeft size={15} /></button><strong className="text-foreground">1</strong><button><ChevronRight size={15} /></button></div></div></section>
   <section className="bg-card border border-border/80 rounded-xl p-5 mb-6"><SectionTitle title="Income Trend" subtitle="Jan 2026 – Aug 2026 vs Jan 2025 – Aug 2025" /><div className="flex justify-end gap-1 mb-2">{['Daily', 'Weekly', 'Monthly'].map(x => <button key={x} onClick={() => setActiveRange(x)} className={`px-3 py-1.5 rounded-md text-[10px] font-semibold ${activeRange === x ? 'bg-secondary text-foreground' : 'text-foreground hover:bg-card'}`}>{x}</button>)}</div><div className="h-[245px] flex"><div className="flex flex-col justify-between text-[10px] text-muted-foreground py-2 pr-3"><span>€50k</span><span>€35k</span><span>€20k</span><span>€0</span></div><div className="flex-1 relative"><div className="absolute inset-0 flex flex-col justify-between py-2">{[1, 2, 3, 4].map(n => <div key={n} className="border-t border-dashed border-border" />)}</div><svg className="relative w-full h-[210px]" viewBox="0 0 800 210" preserveAspectRatio="none" aria-label="Income trend chart"><path d="M0 174 C48 166 62 148 114 156 S180 126 228 133 S290 119 342 124 S400 96 456 104 S516 78 570 88 S628 53 684 66 S744 36 800 42" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M0 187 C58 177 70 174 114 180 S176 159 228 165 S292 145 342 151 S402 133 456 140 S518 116 570 124 S632 98 684 106 S746 85 800 91" fill="none" stroke="var(--chart-3)" strokeWidth="2" strokeDasharray="7 5" /><path d="M0 192 C54 187 74 180 114 186 S178 171 228 176 S290 162 342 167 S404 150 456 158 S518 136 570 145 S634 128 684 134 S748 112 800 119" fill="none" stroke="var(--chart-3)" strokeWidth="2" strokeDasharray="7 5" /><path d="M0 201 C62 197 74 195 114 198 S180 190 228 193 S290 184 342 190 S404 177 456 185 S518 165 570 177 S634 152 684 166 S746 142 800 153" fill="none" stroke="var(--foreground)" strokeWidth="2" strokeDasharray="2 5" /></svg><div className="flex justify-between text-[10px] text-muted-foreground">{months.map(m => <span key={m}>{m}</span>)}</div></div></div><div className="flex flex-wrap gap-5 mt-3 pl-8 text-[11px] text-muted-foreground"><span><i className="inline-block w-5 border-t-2 border-border mr-2 align-middle" />Total Income</span><span><i className="inline-block w-5 border-t-2 border-border border-dashed mr-2 align-middle" />Recurring Income</span><span><i className="inline-block w-5 border-t-2 border-border border-dashed mr-2 align-middle" />One-Time Income</span><span><i className="inline-block w-5 border-t-2 border-border border-dotted mr-2 align-middle" />Outstanding Income</span></div></section>
   <div className="grid grid-cols-2 gap-5 mb-6"><section className="bg-card border border-border/80 rounded-xl p-5"><SectionTitle title="Income by Source" subtitle="How income enters your business" /><div className="flex items-center gap-7 mb-4"><div className="h-36 w-36 rounded-full" style={{
                background: 'conic-gradient(var(--primary) 0 34.6%,var(--primary) 34.6% 61.4%,var(--primary) 61.4% 81.1%,var(--primary) 81.1% 92.5%,var(--muted) 92.5% 100%)'
              }}><div className="h-20 w-20 bg-card rounded-full relative top-8 left-8 flex items-center justify-center"><span className="text-center text-[11px] font-bold">€284.6k<small className="block text-[9px] text-muted-foreground font-normal">total</small></span></div></div><div className="space-y-2 text-[11px]">{sourceData.map((r, i) => <div key={r[0]} className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${['bg-primary', 'bg-primary', 'bg-primary', 'bg-primary', 'bg-muted'][i]}`} /><span>{r[0]}</span><strong className="ml-auto">{r[2]}</strong></div>)}</div></div><SmallTable headers={['Source', 'Income', '% of Total', 'Growth', 'Records']} rows={sourceData} /></section><section className="bg-card border border-border/80 rounded-xl p-5"><SectionTitle title="Income Categories" subtitle="Performance by category" /><div className="space-y-3 mb-5">{categoryData.map((r, i) => <div key={r[0]} className="grid grid-cols-[120px_1fr_42px] items-center gap-2 text-[11px]"><span className="truncate">{r[0]}</span><div className="h-2 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary text-primary-foreground" style={{
                    width: `${[100, 77, 68, 61, 52, 36][i]}%`
                  }} /></div><strong className="text-right">{r[1]}</strong></div>)}</div><SmallTable headers={['Category', 'Total', '%', 'Growth', 'Records']} rows={categoryData} /></section></div>
   <div className="grid grid-cols-2 gap-5 mb-6"><section className="bg-card border border-border/80 rounded-xl p-5"><SectionTitle title="Income by Customer" action="View all customers →" /><SmallTable headers={['Customer', 'Income', 'Records', 'Avg Income', 'Recurring', 'Growth', 'Last Income']} rows={customerData} /></section><section className="bg-card border border-border/80 rounded-xl p-5"><SectionTitle title="Product & Service Performance" /><SmallTable headers={['Product / Service', 'Income', 'Avg Value', 'Growth', 'Contribution']} rows={products} /></section></div>
   <div className="grid grid-cols-2 gap-5 mb-6"><section className="bg-card border border-border/80 rounded-xl p-5"><SectionTitle title="Income by Channel" /><div className="flex items-end gap-4 h-28 px-4 mb-4 border-b border-border">{[['Direct Sales', 88], ['Services', 68], ['Subscription', 54], ['Marketplace', 38], ['Ecommerce', 30]].map(x => <div key={x[0]} className="flex-1 flex flex-col items-center gap-1"><span className="text-[10px] text-muted-foreground">{x[1]}k</span><div className="w-full bg-primary rounded-t text-primary-foreground" style={{
                  height: `${x[1]}px`
                }} /><span className="text-[10px] text-muted-foreground truncate max-w-full">{x[0]}</span></div>)}</div><SmallTable headers={['Channel', 'Income', 'Growth', '% of Total', 'Records']} rows={sourceData.slice(0, 5).map(r => [r[0], r[1], r[3], r[2], r[4]])} /></section><section className="bg-card border border-border/80 rounded-xl p-5"><SectionTitle title="Recurring Income" action="View Recurring Revenue →" /><SmallTable headers={['Customer', 'Source', 'Amount', 'Frequency', 'Next Expected', 'Status']} rows={recurring} /></section></div>
   <div className="grid grid-cols-2 gap-5 mb-6"><section className="bg-card border border-border/80 rounded-xl p-5"><SectionTitle title="Outstanding Income" subtitle="Income awaiting collection" /><SmallTable headers={['Customer', 'Amount', 'Expected Date', 'Days Outstanding', 'Related Invoice', 'Status']} rows={[['StartupXYZ', '€6,750', '06 Aug 2026', '4 days', 'INV-2026-0088', 'Open'], ['Global Shop', '€7,200', '01 Aug 2026', '9 days', 'INV-2026-0079', 'Open'], ['RetailMax', '€4,800', '27 Jul 2026', '14 days', 'INV-2026-0064', 'Open']]} /><button className="mt-3 text-[11px] font-semibold text-foreground">Open invoices →</button></section><section className="bg-card border border-border/80 rounded-xl p-5"><SectionTitle title="Income Anomalies — AI-detected" /><div className="space-y-2">{[['🔴', 'High', 'Missing recurring income from RetailMax', 'Expected 1 Aug', 'Investigate'], ['🟡', 'Medium', 'Unusual income spike on 7 Aug (+340% vs avg)', 'Detected today', 'Investigate'], ['🔵', 'Low', 'Duplicate-looking income: INC-2026-00112 and INC-2026-00115', 'Detected 2 days ago', 'Investigate']].map(a => <div key={a[2]} className="border border-border rounded-lg p-3 hover:bg-card"><div className="flex gap-2 text-[12px] font-semibold"><span>{a[0]}</span><span>{a[2]}</span></div><div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground"><span>{a[1]} severity</span><span>{a[3]}</span><button className="ml-auto text-foreground font-semibold">{a[4]}</button>{a[1] !== 'Low' && <button className="text-foreground font-semibold">Ask Lulu AI</button>}</div></div>)}</div></section></div>
   <div className="grid grid-cols-2 gap-5 mb-6"><section className="bg-gradient-to-br from-secondary to-white border border-border rounded-xl p-5"><div className="flex items-center gap-2 text-foreground text-[11px] font-bold uppercase tracking-[.08em] mb-3"><Brain size={16} /><span>AI Insight — AI-generated</span></div><p className="text-[15px] leading-6 font-semibold text-foreground">Income increased 12.4% compared with the previous period, with the largest contribution coming from direct services revenue (+€8,200).</p><div className="grid grid-cols-4 gap-3 mt-5 pt-4 border-t border-border"><div><span className="text-[10px] text-muted-foreground">Current</span><strong className="block text-[13px]">€284,650</strong></div><div><span className="text-[10px] text-muted-foreground">Previous</span><strong className="block text-[13px]">€253,250</strong></div><div><span className="text-[10px] text-muted-foreground">Change</span><strong className="block text-[13px] text-foreground">+€31,400</strong></div><div><span className="text-[10px] text-muted-foreground">Top Source</span><strong className="block text-[13px]">Direct Sales</strong></div></div><p className="text-[10px] text-muted-foreground mt-4">AI-generated interpretation. Does not constitute financial advice.</p></section><section className="bg-card border border-border/80 rounded-xl p-5"><SectionTitle title="AI Recommendations" subtitle="AI Recommendation — AI-generated" />{[['💡', 'Review missing recurring income from RetailMax', 'Investigate'], ['💡', 'TechCorp Ltd generates 14.8% of total income — consider account expansion', 'View Customer'], ['💡', 'Marketplace income declined 8.2% — review channel performance', 'Analyze'], ['💡', '3 outstanding income records are 30+ days overdue', 'View Outstanding']].map(r => <div key={r[1]} className="flex items-center gap-2 py-2.5 border-b last:border-0 border-border text-[11px]"><span>{r[0]}</span><span className="flex-1 text-muted-foreground">{r[1]}</span><button className="text-[10px] text-foreground font-bold whitespace-nowrap">{r[2]}</button></div>)}</section></div>
   <section className="bg-[var(--card)] rounded-xl p-6 text-foreground mb-8"><div className="flex items-center gap-2 mb-1"><Sparkles size={17} className="text-foreground" /><h2 className="text-[17px] font-bold">Ask Lulu AI — Income Intelligence</h2></div><p className="text-[12px] text-muted-foreground mb-4">Ask questions about your income, trends, customers and opportunities.</p><div className="flex gap-2"><input className="flex-1 rounded-lg bg-secondary border border-border px-4 py-3 text-[12px] placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-ring" placeholder="Ask Lulu AI about your income..." /><button onClick={() => setSent(true)} className="bg-primary hover:bg-primary rounded-lg px-5 text-[12px] font-bold flex items-center gap-2 text-primary-foreground"><Send size={14} /><span>{sent ? 'Sent' : 'Ask Lulu'}</span></button></div><div className="flex flex-wrap gap-2 mt-4">{['How much income this month?', 'Top income sources?', 'Which customers generate most income?', 'Why did income change?', 'Compare with last month', 'Show recurring income', 'Find unusual activity', 'Create income report'].map(x => <button key={x} className="rounded-full border border-border px-3 py-1.5 text-[10px] text-foreground hover:bg-secondary">{x}</button>)}</div><p className="text-[10px] text-foreground/70 mt-4">Lulu AI uses your connected financial data. AI responses do not constitute financial advice.</p></section>
  </div></section></main>;
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
