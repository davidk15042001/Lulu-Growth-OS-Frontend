import * as React from 'react';
import { ArrowDown, ArrowUp, ArrowRight, BarChart3, Bell, Bot, ChevronDown, Download, Filter, Globe2, LayoutDashboard, LineChart, Package, RefreshCw, Search, Settings, ShoppingBag, Sparkles, Store, Users, Zap } from 'lucide-react';
type Tone = 'good' | 'bad' | 'neutral' | 'warn';
type KPI = {
  label: string;
  value: string;
  previous: string;
  delta: string;
  tone: Tone;
  points: string;
};
const kpis: KPI[] = [{
  label: 'Revenue',
  value: '$2,184,700',
  previous: 'vs prev $2,011,300',
  delta: '+$173,400  +8.6%',
  tone: 'good',
  points: '1,20 8,18 15,19 23,12 31,14 39,5'
}, {
  label: 'Orders',
  value: '18,420',
  previous: 'vs prev 16,980',
  delta: '+1,440  +8.5%',
  tone: 'good',
  points: '1,19 8,15 15,17 23,9 31,12 39,4'
}, {
  label: 'Customers',
  value: '14,832',
  previous: 'vs prev 13,640',
  delta: '+1,192  +8.7%',
  tone: 'good',
  points: '1,20 8,18 15,15 23,16 31,8 39,5'
}, {
  label: 'Avg Order Value',
  value: '$118.60',
  previous: 'vs prev $118.40',
  delta: '+$0.20  +0.2%',
  tone: 'neutral',
  points: '1,13 8,13 15,12 23,14 31,12 39,13'
}, {
  label: 'Conversion Rate',
  value: '3.24%',
  previous: 'vs prev 3.11%',
  delta: '+0.13pp  +4.2%',
  tone: 'good',
  points: '1,20 8,18 15,17 23,11 31,13 39,7'
}, {
  label: 'Units Sold',
  value: '42,840',
  previous: 'vs prev 39,200',
  delta: '+3,640  +9.3%',
  tone: 'good',
  points: '1,18 8,17 15,13 23,15 31,7 39,4'
}, {
  label: 'Refunds',
  value: '$48,200',
  previous: 'vs prev $41,600',
  delta: '+$6,600  +15.9%',
  tone: 'bad',
  points: '1,18 8,17 15,18 23,10 31,12 39,3'
}, {
  label: 'Gross Profit',
  value: '$1,018,300',
  previous: 'vs prev $934,200',
  delta: '+$84,100  +9.0%',
  tone: 'good',
  points: '1,20 8,16 15,17 23,10 31,11 39,4'
}];
const products = [['Wireless Pro Headphones', '4,820', '$578,400', '4,200', '42,800', '38.2%', '9.8%', '$12,400', '+12.4%'], ['Smart Home Hub', '2,940', '$441,000', '2,940', '28,400', '31.6%', '10.4%', '$8,200', '+9.2%'], ['Ergonomic Desk Chair', '1,260', '$378,000', '1,260', '18,200', '22.4%', '6.9%', '$18,400', '+4.1%'], ['Noise-Cancelling Earbuds', '3,840', '$307,200', '3,840', '32,800', '29.8%', '11.7%', '$6,800', '+18.6%'], ['Mechanical Keyboard', '2,180', '$261,600', '2,180', '21,400', '26.4%', '10.2%', '$4,200', '+7.8%'], ['Standing Desk Converter', '980', '$196,000', '980', '14,200', '18.8%', '6.9%', '$9,200', '-3.2%'], ['USB-C Hub', '4,640', '$139,200', '4,640', '38,200', '34.2%', '12.1%', '$2,400', '+2.1%'], ['Monitor Arm', '840', '$134,400', '840', '11,800', '20.4%', '7.1%', '$7,200', '-8.4%']];
const channels = [['Organic Search', '182,400', '6,840', '5,420', '$811,900', '3.75%', '$118.70'], ['Paid Search', '142,800', '4,920', '4,240', '$583,900', '3.45%', '$118.70'], ['Email', '68,400', '3,280', '2,680', '$389,200', '4.80%', '$118.70'], ['Paid Social', '84,200', '1,840', '1,640', '$218,200', '2.18%', '$118.60'], ['Direct', '52,400', '1,180', '1,040', '$140,000', '2.25%', '$118.60'], ['Referral', '24,800', '284', '264', '$33,700', '1.15%', '$118.70'], ['Organic Social', '15,000', '76', '72', '$9,000', '0.51%', '$118.40']];
const categories = [['Audio & Headphones', '$886,600', '12,480', '10,920', '81.20', '8.6%', '54.2%'], ['Home Office', '$709,400', '7,840', '6,920', '102.50', '6.9%', '48.6%'], ['Smart Home', '$441,000', '2,940', '2,940', '150.00', '10.4%', '51.1%'], ['Accessories & Hubs', '$147,700', '6,420', '5,580', '26.47', '12.1%', '43.8%']];
const sectionStyle = 'border-t border-[var(--border)] pt-9 mt-10';
const toneClass = (tone: Tone) => tone === 'good' ? 'bg-[var(--secondary)] text-[var(--chart-4)]' : tone === 'bad' ? 'bg-[var(--secondary)] text-[var(--chart-5)]' : tone === 'warn' ? 'bg-[var(--secondary)] text-[var(--chart-1)]' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]';
function Spark({
  points,
  bad = false
}: {
  points: string;
  bad?: boolean;
}) {
  return <svg aria-label="trend sparkline" width="42" height="24" viewBox="0 0 42 24" fill="none"><polyline points={points} stroke={bad ? 'var(--chart-5)' : 'var(--chart-4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function TrendChart({
  small = false
}: {
  small?: boolean;
}) {
  return <svg className={small ? 'h-20 w-full' : 'h-64 w-full'} viewBox="0 0 640 220" preserveAspectRatio="none" role="img" aria-label="Ecommerce performance trend"><path d="M0 180 C70 160 90 168 140 140 S220 155 260 112 S340 126 390 84 S470 105 520 58 S590 74 640 24 V220 H0Z" fill="var(--border)" /><path d="M0 180 C70 160 90 168 140 140 S220 155 260 112 S340 126 390 84 S470 105 520 58 S590 74 640 24" fill="none" stroke="var(--chart-4)" strokeWidth="3" /><path d="M0 200 C70 190 100 184 150 178 S235 190 280 160 S360 171 410 135 S500 145 540 105 S600 120 640 91" fill="none" stroke="var(--chart-1)" strokeWidth="2" strokeDasharray="7 6" /><g stroke="var(--border)" strokeWidth="1"><path d="M0 50H640M0 105H640M0 160H640" /></g></svg>;
}
function Section({
  title,
  children,
  action
}: {
  title: string;
  children: React.ReactNode;
  action?: string;
}) {
  return <section className={sectionStyle}><div className="mb-4 flex items-center justify-between"><h2 className="text-[18px] font-semibold tracking-tight">{title}</h2>{action && <button className="text-sm font-semibold text-[var(--foreground)]">{action}</button>}</div>{children}</section>;
}
function DataTable({
  headers,
  rows
}: {
  headers: string[];
  rows: string[][];
}) {
  return <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-card"><table className="w-full min-w-[780px] border-collapse text-left"><thead className="bg-[var(--secondary)]"><tr>{headers.map(h => <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[.05em] text-[var(--muted-foreground)]">{h}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[0]} className="border-t border-[var(--border)] text-[14px]"><td className="px-4 py-3 font-medium">{row[0]}</td>{row.slice(1).map((cell, i) => <td key={`${row[0]}-${i}`} className={`px-4 py-3 ${cell.startsWith('-') ? 'text-[var(--chart-5)]' : cell.startsWith('+') ? 'text-[var(--foreground)]' : ''}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
export function LuluEcommerce() {
  const [range, setRange] = React.useState('Last 30 Days');
  const [query, setQuery] = React.useState('');
  const [ask, setAsk] = React.useState('');
  return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans"><style>{`*{box-sizing:border-box}button,input{font:inherit}button:focus-visible,input:focus-visible{outline:2px solid var(--border);outline-offset:2px}.ledger-card{border:1px solid var(--border);background:var(--card);border-radius:8px;padding:18px}.metric{font-size:26px;font-weight:700;letter-spacing:-.04em}.table-wrap{overflow-x:auto}.bar{height:10px;background:var(--secondary);border-radius:99px;overflow:hidden}.bar>i{display:block;height:100%;background:var(--primary);border-radius:99px;color:var(--primary-foreground)}@media(max-width:900px){.side{display:none}.main{padding:24px!important}.four{grid-template-columns:repeat(2,minmax(0,1fr))!important}.three{grid-template-columns:1fr!important}.two{grid-template-columns:1fr!important}}@media(max-width:560px){.four{grid-template-columns:1fr!important}.actions{flex-wrap:wrap}.filter{overflow-x:auto}.metric{font-size:23px}}`}</style>
 <aside className="side fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-[var(--sidebar)] p-4 lg:flex"><div className="mb-5 flex items-center gap-3 px-2 py-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</div><span className="font-semibold text-foreground">Lulu AI</span></div><LuluSectionNavigation activeId="bold-ocean-5847" /></aside>
 <main className="main px-12 py-7 lg:ml-60"><header><nav className="text-xs text-[var(--muted-foreground)]">Intelligence <span className="mx-2 text-[var(--muted-foreground)]">/</span> Business Intelligence <span className="mx-2 text-[var(--muted-foreground)]">/</span> Ecommerce</nav><div className="mt-4 flex items-start justify-between gap-6"><div><h1 className="text-[28px] font-bold tracking-[-.03em]">Ecommerce</h1><p className="mt-1 max-w-2xl text-[15px] text-[var(--muted-foreground)]">Understand your store performance, customers, products, orders and revenue across every connected ecommerce channel.</p></div><div className="actions flex shrink-0 gap-2"><button className="flex h-8 items-center gap-1.5 rounded-md bg-[var(--primary)] px-3 text-xs font-semibold text-primary-foreground"><Sparkles size={13} /> Ask Lulu AI</button><button className="flex h-8 items-center gap-1.5 rounded-md border border-[var(--muted-foreground)] bg-card px-3 text-xs"><RefreshCw size={13} /> Refresh</button><button className="flex h-8 items-center gap-1.5 rounded-md border border-[var(--muted-foreground)] bg-card px-3 text-xs"><span className="text-base">+</span> Create Report</button><button className="flex h-8 items-center gap-1.5 rounded-md border border-[var(--muted-foreground)] bg-card px-3 text-xs"><Download size={13} /> Export</button></div></div></header>
 <div className="filter mt-7 flex items-center gap-3 border-y border-[var(--border)] bg-card px-3 py-3 text-xs"><button onClick={() => setRange(range === 'Last 30 Days' ? 'Last 90 Days' : 'Last 30 Days')} className="rounded-md border border-[var(--border)] px-3 py-1.5 font-semibold">Date Range: {range} <ChevronDown size={12} className="ml-1 inline" /></button><span className="text-[var(--muted-foreground)]">vs</span><button className="rounded-md border border-[var(--border)] px-3 py-1.5">Previous Period <ChevronDown size={12} className="ml-1 inline" /></button><span className="text-[var(--muted-foreground)]">|</span><button className="rounded-md border border-[var(--border)] px-3 py-1.5">All Stores <ChevronDown size={12} className="ml-1 inline" /></button><span className="ml-auto whitespace-nowrap text-[var(--muted-foreground)]"><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--primary)] text-primary-foreground" />Last synced 3 min ago</span></div>
 <Section title="ECOMMERCE OVERVIEW"><div className="four grid grid-cols-4 gap-3">{kpis.map(k => <article key={k.label} className="ledger-card relative"><div className="flex items-start justify-between"><p className="text-[11px] font-semibold uppercase tracking-[.06em] text-[var(--muted-foreground)]">{k.label}</p><Spark points={k.points} bad={k.tone === 'bad'} /></div><div className="metric mt-3">{k.value}</div><p className="mt-1 text-xs text-[var(--muted-foreground)]">{k.previous}</p><span className={`mt-3 inline-block rounded-full px-2 py-1 text-[11px] font-medium ${toneClass(k.tone)}`}>{k.delta} {k.tone === 'good' ? '↑' : k.tone === 'bad' ? '↑' : '→'}</span><i className="absolute bottom-4 right-4 h-1.5 w-1.5 rounded-full bg-[var(--chart-4)]" /></article>)}</div></Section>
 <Section title="ECOMMERCE PERFORMANCE TREND"><div className="two grid grid-cols-[3fr_2fr] gap-4"><article className="ledger-card"><div className="mb-3 flex flex-wrap gap-2">{['Revenue ✓', 'Orders', 'Customers', 'AOV', 'Conversion Rate'].map(x => <button key={x} className={`rounded-full px-3 py-1.5 text-xs ${x === 'Revenue ✓' ? 'bg-[var(--secondary)] font-semibold text-[var(--foreground)]' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'}`}>{x}</button>)}</div><TrendChart /><div className="flex justify-between text-[11px] text-[var(--muted-foreground)]"><span>Mar 01</span><span>Mar 08</span><span>Mar 15</span><span>Mar 22</span><span>Mar 30</span></div></article><article className="ledger-card"><h3 className="font-semibold">Revenue Growth</h3>{[['Revenue Growth', '+8.6%', 'Accelerating'], ['Order Growth', '+8.5%', 'Growing'], ['Customer Growth', '+8.7%', 'Growing'], ['Unit Growth', '+9.3%', 'Growing'], ['AOV Growth', '+0.2%', 'Stable']].map(r => <div key={r[0]} className="flex items-center justify-between border-b border-[var(--border)] py-4 last:border-0"><div><p className="text-sm">{r[0]}</p><strong className="text-lg text-[var(--chart-4)]">{r[1]}</strong></div><span className={`rounded-full px-2 py-1 text-[11px] ${r[2] === 'Stable' ? 'bg-[var(--secondary)] text-[var(--muted-foreground)]' : 'bg-[var(--secondary)] text-[var(--foreground)]'}`}>{r[2]}</span></div>)}</article></div></Section>
 <Section title="ECOMMERCE CONVERSION"><div className="grid grid-cols-5 items-end gap-2">{[['Visitors', '570,000', '100%', ''], ['Product Views', '312,400', '54.8%', '45.2%'], ['Add to Cart', '98,600', '31.6%', '68.4%'], ['Checkout Started', '32,400', '32.9%', '67.1%'], ['Orders', '18,420', '56.9%', '43.1%']].map((f, i) => <div key={f[0]} className="text-center"><div className="mx-auto flex h-[${180-i*22}px] items-center justify-center rounded-t-md bg-[var(--primary)] p-3 text-primary-foreground" style={{
              height: `${180 - i * 26}px`,
              opacity: 1 - i * .13,
              clipPath: 'polygon(8% 0,92% 0,100% 100%,0 100%)'
            }}><strong className="text-sm">{f[0]}</strong></div><strong className="mt-3 block text-lg">{f[1]}</strong><span className="text-sm font-semibold text-[var(--foreground)]">{f[2]}</span><small className="block text-xs text-[var(--chart-5)]">{f[3] ? 'drop-off ' + f[3] : 'baseline'}</small></div>)}</div><div className="two mt-7 grid grid-cols-2 gap-3"><div className="ledger-card"><span className="text-xs text-[var(--muted-foreground)]">Overall Conversion Rate</span><strong className="ml-3 text-lg">3.24%</strong><small className="ml-2 text-[var(--muted-foreground)]">Visitors → Orders</small></div><div className="ledger-card"><span className="text-xs text-[var(--muted-foreground)]">Checkout Conversion</span><strong className="ml-3 text-lg text-[var(--foreground)]">56.9%</strong><small className="ml-2 text-[var(--muted-foreground)]">Checkouts → Orders</small></div></div></Section>
 <Section title="CART & CHECKOUT"><div className="three grid grid-cols-3 gap-4">{([["Add-to-Cart Performance", ["Product Views|312,400", "Add to Cart|98,600", "Add-to-Cart Rate|31.6%", "Avg Cart Value|$142.80", "Cart Abandonment|66.9%"]], ["Cart Abandonment", ["Abandoned carts|66,180", "Abandonment rate|66.9%", "Recovered carts|4,840", "Recovered revenue|$691,200"]], ["Checkout Performance", ["Checkout starts|32,400", "Completed|18,420", "Checkout CVR|56.9%", "Checkout abandonment|43.1%", "Payment step|82.4%", "Shipping step|91.2%", "Review step|95.8%"]]] as [string, string[]][]).map(card => <article key={card[0]} className="ledger-card"><h3 className="font-semibold">{card[0]}</h3>{card[1].map(item => {
              const [a, b] = item.split('|');
              return <div key={a} className="flex justify-between border-b border-[var(--border)] py-3 text-sm last:border-0"><span className="text-[var(--muted-foreground)]">{a}</span><strong>{b}</strong></div>;
            })}{card[0] === 'Cart Abandonment' && <><TrendChart small /><small className="text-[var(--muted-foreground)]">Cart Abandonment ≠ Checkout Abandonment</small></>}</article>)}</div></Section>
 <Section title="PRODUCT PERFORMANCE"><div className="mb-4 flex flex-wrap gap-2"><div className="relative"><Search size={14} className="absolute left-3 top-2.5 text-[var(--muted-foreground)]" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products" className="h-9 rounded-md border border-[var(--border)] bg-card pl-9 pr-3 text-sm" /></div>{['Category', 'Sort by: Revenue', 'Status: All'].map(x => <button key={x} className="rounded-md border border-[var(--border)] bg-card px-3 text-xs">{x} <ChevronDown size={12} className="ml-1 inline" /></button>)}</div><DataTable headers={['Product', 'Units Sold', 'Revenue', 'Orders', 'Views', 'Add-to-Cart Rate', 'Conversion', 'Refunds', 'Growth']} rows={products.filter(p => p[0].toLowerCase().includes(query.toLowerCase()))} /><p className="mt-3 text-xs text-[var(--muted-foreground)]">1–8 of 186 products.</p><div className="two mt-5 grid grid-cols-2 gap-4">{([["Best-Selling Products", ["1  Wireless Pro Headphones", "2  Smart Home Hub", "3  Noise-Cancelling Earbuds", "4  Mechanical Keyboard", "5  USB-C Hub"]], ["Underperforming Products", ["1  Ergonomic Desk Chair", "2  Standing Desk Converter", "3  Monitor Arm", "4  Smart Home Hub", "5  Mechanical Keyboard"]]] as [string, string[]][]).map(p => <article key={p[0]} className="ledger-card"><h3 className="mb-2 font-semibold">{p[0]}</h3>{p[1].map(x => <p key={x} className="border-b border-[var(--border)] py-2 text-sm">{x}</p>)}</article>)}</div></Section>
 <Section title="CATEGORY PERFORMANCE"><div className="two grid grid-cols-[1fr_1.3fr] gap-4"><article className="ledger-card">{[['Audio & Headphones', '$886,600', '100%'], ['Home Office', '$709,400', '80%'], ['Smart Home', '$441,000', '50%'], ['Accessories & Hubs', '$147,700', '24%']].map(c => <div key={c[0]} className="mb-5"><div className="mb-1 flex justify-between text-sm"><span>{c[0]}</span><strong>{c[1]}</strong></div><div className="bar"><i style={{
                  width: c[2]
                }} /></div></div>)}</article><DataTable headers={['Category', 'Revenue', 'Units', 'Orders', 'AOV', 'Conversion', 'Growth']} rows={categories} /></div></Section>
 <Section title="PRODUCT PROFITABILITY"><div className="three grid grid-cols-3 gap-4"><article className="ledger-card col-span-1"><h3 className="mb-4 font-semibold">Revenue vs Cost</h3>{[['Revenue', '$578K', '100%'], ['Product cost', '-$334K', '58%'], ['Gross profit', '$244K', '42%']].map(x => <div key={x[0]} className="mb-4"><div className="flex justify-between text-sm"><span>{x[0]}</span><b>{x[1]}</b></div><div className="bar mt-1"><i style={{
                  width: x[2]
                }} /></div></div>)}</article><div className="col-span-2"><DataTable headers={['Product', 'Revenue', 'Cost', 'Gross Profit', 'Gross Margin %']} rows={[['Wireless Pro Headphones', '$578,400', '$334,000', '$244,400', '42.3%'], ['Smart Home Hub', '$441,000', '$185,220', '$255,780', '58.0%'], ['Ergonomic Desk Chair', '$378,000', '$190,890', '$187,110', '49.5%'], ['Noise-Cancelling Earbuds', '$307,200', '$165,888', '$141,312', '46.0%']]} /></div></div><div className="mt-4 rounded-md bg-[var(--secondary)] px-4 py-3 text-xs text-[var(--muted-foreground)]">Revenue ≠ Profit — Gross margin shown only where product costs are configured.</div></Section>
 <Section title="ECOMMERCE CUSTOMERS"><div className="four grid grid-cols-4 gap-3">{[['Total Customers', '14,832', '+8.7%'], ['New Customers', '9,840', '66.3% of total'], ['Returning Customers', '4,992', '33.7%'], ['Repeat Purchase Rate', '33.7%', '+1.2pp']].map(x => <article key={x[0]} className="ledger-card"><span className="text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">{x[0]}</span><div className="metric mt-2">{x[1]}</div><small className="text-[var(--chart-4)]">{x[2]}</small></article>)}</div><div className="two mt-4 grid grid-cols-2 gap-4"><article className="ledger-card"><h3 className="font-semibold">New vs Returning Customers</h3><div className="mt-5 flex h-12 overflow-hidden rounded-md"><div className="flex w-[66.3%] items-center justify-center bg-[var(--primary)] text-sm text-primary-foreground">New 66.3%</div><div className="flex flex-1 items-center justify-center bg-[var(--muted)] text-sm">Returning 33.7%</div></div><p className="mt-4 text-xs text-[var(--muted-foreground)]">Revenue contribution: New 58.2% / Returning 41.8%</p></article><article className="ledger-card"><h3 className="font-semibold">Customer Purchase Behavior</h3>{['Orders/Customer|1.24', 'Units/Customer|2.89', 'Revenue/Customer|$147.30', 'Purchase Frequency|1.24', 'Repeat Rate|33.7%'].map(x => {
              const [a, b] = x.split('|');
              return <p key={a} className="flex justify-between border-b border-[var(--border)] py-2 text-sm"><span className="text-[var(--muted-foreground)]">{a}</span><strong>{b}</strong></p>;
            })}</article></div></Section>
 <Section title="CUSTOMER LIFETIME VALUE"><div className="three grid grid-cols-3 gap-4"><article className="ledger-card"><h3 className="font-semibold">CLV Summary</h3><div className="metric mt-5">$284.60</div><p className="text-xs text-[var(--muted-foreground)]">Avg CLV · Observed</p><div className="mt-4 text-xl font-bold">$198.40</div><p className="text-xs text-[var(--muted-foreground)]">Median CLV · Calculated</p></article><article className="ledger-card"><h3 className="font-semibold">CLV by Acquisition Channel</h3>{[['Email', '$384.20', '100%'], ['Organic', '$312.40', '81%'], ['Direct', '$296.40', '77%'], ['Paid Search', '$268.80', '70%'], ['Social', '$224.60', '58%']].map(x => <div key={x[0]} className="mt-3"><div className="flex justify-between text-sm"><span>{x[0]}</span><b>{x[1]}</b></div><div className="bar mt-1"><i style={{
                  width: x[2]
                }} /></div></div>)}</article><article className="ledger-card"><h3 className="font-semibold">CLV Trend</h3><TrendChart small /><p className="text-xs text-[var(--muted-foreground)]">12 month calculated trend</p></article></div></Section>
 <Section title="REPEAT PURCHASE PERFORMANCE"><div className="two grid grid-cols-[1fr_1.5fr] gap-4"><article className="ledger-card">{['Repeat rate|33.7%', 'Repeat orders|6,208', 'Repeat revenue|$898,200', 'Purchase frequency|1.24', 'Repeat revenue growth|+11.4%'].map(x => {
              const [a, b] = x.split('|');
              return <div key={a} className="flex justify-between border-b border-[var(--border)] py-3 text-sm"><span className="text-[var(--muted-foreground)]">{a}</span><strong className={b.startsWith('+') ? 'text-[var(--chart-4)]' : ''}>{b}</strong></div>;
            })}</article><article className="ledger-card"><h3 className="mb-3 font-semibold">Return period cohort</h3><div className="grid grid-cols-5 gap-1 text-center text-xs">{['Month', '0', '1', '2', '3', '4'].map(x => <b key={x} className="p-2 text-[var(--muted-foreground)]">{x}</b>)}{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => <React.Fragment key={m}><span className="p-2 text-left text-xs">{m}</span>{[12 + i, 22 + i, 31 + i, 38 + i].map((v, j) => <span key={`${m}-${j}`} className="rounded-sm p-2" style={{
                  backgroundColor: `rgba(44,95,46,${v / 50})`,
                  color: v > 28 ? 'white' : 'var(--foreground)'
                }}>{v}%</span>)}</React.Fragment>)}</div></article></div></Section>
 <Section title="CUSTOMER SEGMENTS"><DataTable headers={['Segment', 'Customers', 'Orders', 'Revenue', 'AOV', 'CLV', 'Repeat Rate']} rows={[['New Customers', '9,840', '10,220', '$1,270,000', '$124.27', '$182.40', '12.4%'], ['Returning Customers', '4,992', '8,200', '$898,200', '$109.54', '$486.20', '76.2%'], ['High-Value (top 20%)', '2,966', '5,840', '$812,400', '$139.11', '$642.80', '68.4%'], ['At-Risk', '1,820', '1,940', '$184,200', '$94.95', '$124.60', '8.2%'], ['Loyal', '2,204', '4,460', '$584,100', '$131.00', '$548.30', '82.1%']]} /></Section>
 <Section title="ECOMMERCE CHANNEL PERFORMANCE"><DataTable headers={['Channel', 'Traffic', 'Orders', 'Customers', 'Revenue', 'Conversion', 'AOV']} rows={channels} /></Section>
 <Section title="ATTRIBUTION & ADVERTISING CONTRIBUTION"><div className="two grid grid-cols-2 gap-4"><article className="ledger-card"><h3 className="mb-3 font-semibold">Ecommerce Attribution</h3><div className="flex flex-wrap gap-2">{['First Touch', 'Last Touch ✓', 'Linear', 'Position Based', 'Time Decay'].map(x => <button key={x} className={`rounded-full px-3 py-1.5 text-xs ${x === 'Last Touch ✓' ? 'bg-[var(--primary)] text-primary-foreground' : 'bg-[var(--secondary)]'}`}>{x}</button>)}</div><div className="metric mt-6">$1,082,400</div><p className="text-xs text-[var(--muted-foreground)]">Attributed revenue · Last Touch</p><p className="mt-4 text-xs text-[var(--muted-foreground)]">Attributed Revenue ≠ Total Ecommerce Revenue</p></article><article className="ledger-card"><h3 className="font-semibold">Advertising Contribution</h3>{['Ad Spend|$284,710', 'Attributed Revenue|$1,082,400', 'Orders|8,420', 'ROAS|3.80×', 'CAC|$47.20'].map(x => {
              const [a, b] = x.split('|');
              return <p key={a} className="flex justify-between border-b border-[var(--border)] py-3 text-sm"><span>{a}</span><strong>{b}</strong></p>;
            })}<button className="mt-4 text-sm font-semibold text-[var(--foreground)]">→ View Advertising Intelligence for full detail</button></article></div></Section>
 <Section title="GEOGRAPHIC & MARKET PERFORMANCE"><div className="two grid grid-cols-2 gap-4"><article className="ledger-card"><h3 className="font-semibold">Ecommerce by Geography</h3><svg className="my-3 h-36 w-full" viewBox="0 0 500 180" role="img" aria-label="World map revenue heatmap"><path d="M25 70l45-32 65 6 30-24 80 20 50-13 72 31 78 9 35 35-68 8-24 34-84-10-65 31-55-18-62 12-34-31z" fill="var(--border)" stroke="var(--border)" strokeWidth="8" /><path d="M70 55h72v39H70zM295 64h58v34h-58zM185 102h70v32h-70z" fill="var(--foreground)" opacity=".78" /></svg><DataTable headers={['Country', 'Revenue', 'Orders', 'Customers', 'AOV', 'Conversion']} rows={[['United States', '$1,422,100', '12,100', '9,420', '$117.53', '3.9%'], ['United Kingdom', '$284,200', '2,420', '1,980', '$117.44', '3.4%'], ['Canada', '$218,400', '1,840', '1,420', '$118.70', '3.2%'], ['Australia', '$142,800', '1,180', '920', '$121.02', '2.8%'], ['Germany', '$117,200', '880', '740', '$133.18', '2.4%']]} /></article><article className="ledger-card"><h3 className="font-semibold">Market Performance</h3>{[['United States', '$1.42M', '100%'], ['United Kingdom', '$284K', '42%'], ['Canada', '$218K', '33%'], ['Australia', '$143K', '22%'], ['Germany', '$117K', '18%']].map(x => <div key={x[0]} className="mt-5"><div className="flex justify-between text-sm"><span>{x[0]}</span><b>{x[1]}</b></div><div className="bar mt-1"><i style={{
                  width: x[2]
                }} /></div></div>)}</article></div></Section>
 <Section title="DEVICE PERFORMANCE"><DataTable headers={['Metric', 'Desktop', 'Mobile', 'Tablet']} rows={[['Traffic', '48.2%', '39.4%', '12.4%'], ['Product Views', '168,400', '112,800', '31,200'], ['Add to Cart', '58,400', '32,100', '8,100'], ['Checkout', '20,200', '9,840', '2,360'], ['Orders', '12,240', '5,820', '360'], ['Conversion', '4.84%', '1.82%', '2.96%'], ['Revenue', '$1,450,200', '$613,400', '$121,100'], ['AOV', '$118.48', '$105.39', '$119.72']]} /><p className="mt-3 text-xs text-[var(--chart-5)]">Mobile shows lower CVR — checkout experience analysis recommended.</p></Section>
 <Section title="PAYMENT, REFUNDS, CANCELLATIONS, DISCOUNTS, SHIPPING"><div className="three grid grid-cols-5 gap-3">{([["Payment Performance", "Card 84.2%", "PayPal 11.8%", "Other 4%", "Success rate 98.8%"], ["Refund Performance", "$48,200 refunded", "842 orders", "Refund rate 4.57%", "Top: Ergonomic Chair"], ["Order Cancellations", "284 orders", "Cancellation rate 1.54%", "Cancelled revenue $33,700", "Trend flat"], ["Discount Performance", "2,840 discounted orders", "$82,400 discount", "3.77% discount rate", "After discount $2.10M"], ["Shipping Performance", "$124,400 shipping revenue", "$89,600 shipping cost", "Avg shipping $6.75", "No management controls"]] as string[][]).map(x => <article key={x[0]} className="ledger-card"><h3 className="mb-3 text-sm font-semibold">{x[0]}</h3>{x.slice(1).map(y => <p key={y} className="border-b border-[var(--border)] py-2 text-xs text-[var(--muted-foreground)]">{y}</p>)}</article>)}</div></Section>
 <Section title="PROFITABILITY & EFFICIENCY"><div className="two grid grid-cols-2 gap-4"><article className="ledger-card"><h3 className="font-semibold">Ecommerce Profitability</h3>{[['Gross Sales', '$2,184,700', '100%'], ['Discounts', '-$82,400', '82%'], ['Refunds', '-$48,200', '76%'], ['Shipping Revenue', '+$124,400', '62%'], ['Product Costs', '-$1,160,200', '46%'], ['Gross Profit', '$1,018,300', '47%']].map(x => <div key={x[0]} className="mt-3"><div className="flex justify-between text-sm"><span>{x[0]}</span><b>{x[1]}</b></div><div className="bar mt-1"><i style={{
                  width: x[2]
                }} /></div></div>)}<p className="mt-4 text-xs text-[var(--muted-foreground)]">Revenue ≠ Profit. Scope: product costs, discounts, refunds, shipping.</p></article><article className="ledger-card"><h3 className="font-semibold">Ecommerce Efficiency</h3><div className="four grid grid-cols-2 gap-3">{['Revenue/Visitor|$3.83', 'Revenue/Customer|$147.30', 'Revenue/Order|$118.60', 'Orders/Visitor|0.032', 'Customers/Visitor|0.026', 'AOV|$118.60', 'CLV|$284.60', 'CLV/CAC|6.0×'].map(x => {
                const [a, b] = x.split('|');
                return <div key={a} className="border-b border-[var(--border)] py-2"><small className="block text-[var(--muted-foreground)]">{a}</small><strong>{b}</strong></div>;
              })}</div></article></div></Section>
 <Section title="TARGETS, GAP & BENCHMARK"><div className="three grid grid-cols-3 gap-4"><article className="ledger-card"><h3 className="mb-3 font-semibold">Ecommerce Targets</h3>{[['Revenue', '$2.4M target', '91.0%'], ['Orders', '20K', '92.1%'], ['Customers', '16K', '92.7%'], ['AOV', '$125', '94.9%'], ['CVR', '3.5%', '92.6%'], ['Gross Margin', '48%', '97.1%']].map(x => <div key={x[0]} className="mb-3"><div className="flex justify-between text-xs"><span>{x[0]} · {x[1]}</span><b>{x[2]}</b></div><div className="bar mt-1"><i style={{
                  width: x[2]
                }} /></div></div>)}<small className="text-[var(--muted-foreground)]">Targets are organization-defined — never set automatically.</small></article><DataTable headers={['Metric', 'Target', 'Actual', 'Gap', 'Status']} rows={[['Revenue', '$2.4M', '$2.18M', '-$215K', 'Behind'], ['Orders', '20K', '18,420', '-1,580', 'Behind'], ['Customers', '16K', '14,832', '-1,168', 'Behind'], ['AOV', '$125', '$118.60', '-$6.40', 'Behind']]} /><DataTable headers={['Metric', 'Your Performance', 'Internal Benchmark', 'Industry Benchmark']} rows={[['CVR', '3.24%', '3.11%', '2.8%'], ['AOV', '$118.60', '$114.20', '$95.40'], ['Repeat Rate', '33.7%', '31.2%', '28.0%'], ['Refund Rate', '4.57%', '4.80%', '5.2%']]} /></div></Section>
 <Section title="TRENDS"><div className="ledger-card"><div className="flex flex-wrap gap-2">{['Revenue ✓', 'Orders', 'Customers', 'AOV', 'Conversion', 'Units', 'Refunds', 'Repeat Purchase', 'Gross Margin'].map(x => <button key={x} className={`rounded-full px-3 py-1.5 text-xs ${x === 'Revenue ✓' ? 'bg-[var(--primary)] text-primary-foreground' : 'bg-[var(--secondary)]'}`}>{x}</button>)}</div><TrendChart /></div></Section>
 <Section title="ANOMALIES"><DataTable headers={['Metric', 'Date', 'Product/Market', 'Observed', 'Expected Range', 'Difference', '']} rows={[['Refund Rate', 'Mar 14', 'Ergonomic Desk Chair', '8.4%', '3–5%', '+3.4pp', 'View'], ['Conversion Rate', 'Mar 18', 'Mobile (all)', '1.1%', '1.6–2.2%', '-0.8pp', 'View'], ['Revenue', 'Mar 21', 'United Kingdom', '$4,200', '$9,000–$12,000', '-$6,800', 'View']]} /><button className="mt-3 text-sm font-semibold text-[var(--foreground)]">→ View all anomalies in Anomalies module</button></Section>
 <Section title="DATA HEALTH"><div className="two grid grid-cols-2 gap-4"><article className="ledger-card flex items-center justify-between"><div><h3 className="font-semibold">Main Store <span className="ml-2 rounded-full bg-[var(--secondary)] px-2 py-1 text-[11px] text-[var(--chart-4)]">Shopify</span></h3><p className="mt-2 text-xs text-[var(--muted-foreground)]">Connected ✓ · Last sync 3 min ago · Coverage 100%</p></div><span className="h-3 w-3 rounded-full bg-[var(--chart-4)]" /></article><article className="ledger-card flex items-center justify-between"><div><h3 className="font-semibold">EU Store <span className="ml-2 rounded-full bg-[var(--secondary)] px-2 py-1 text-[11px] text-[var(--foreground)]">WooCommerce</span></h3><p className="mt-2 text-xs text-[var(--muted-foreground)]">Connected ✓ · Missing periods Mar 8–10 · Partial metrics</p></div><span className="h-3 w-3 rounded-full bg-[var(--chart-1)]" /></article></div><p className="mt-3 text-xs text-[var(--muted-foreground)]">To manage store connections, open Integrations →</p></Section>
 <Section title="KEY ECOMMERCE KPIs" action="→ Open KPI Explorer"><div className="four grid grid-cols-4 gap-3">{['Revenue', '$2,184,700', 'Orders', '18,420', 'Customers', '14,832', 'AOV', '$118.60', 'CVR', '3.24%', 'Units Sold', '42,840', 'Refund Rate', '4.57%', 'Repeat Purchase Rate', '33.7%', 'CLV', '$284.60', 'Gross Profit', '$1,018,300', 'Gross Margin', '46.6%'].reduce((acc: string[], v) => acc.concat(v), []).reduce((acc: string[], v, i, arr) => i % 2 === 0 && arr[i + 1] ? [...acc, `${v}|${arr[i + 1]}`] : acc, []).map(x => {
            const [a, b] = x.split('|');
            return <article key={a} className="ledger-card"><span className="text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">{a}</span><div className="mt-2 flex items-end justify-between"><strong className="text-xl">{b}</strong><Spark points="1,18 8,16 15,17 23,10 31,12 39,4" /></div><small className="text-[var(--chart-4)]">+8.6% vs previous</small></article>;
          })}</div></Section>
 <Section title="EXPLAIN ECOMMERCE PERFORMANCE"><article className="border-l-[3px] border-[var(--chart-4)] bg-card p-5 pl-4"><div className="flex justify-between"><h3 className="flex items-center gap-2 font-semibold"><Bot size={17} className="text-[var(--chart-4)]" /> Lulu AI assessment</h3><span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-[11px] text-[var(--chart-4)]">⚙ AI Explanation — based on connected data</span></div><ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">{['Revenue grew 8.6% driven primarily by Audio & Headphones (+12.4%) and Smart Home (+9.2%)', 'Order volume up 8.5%; AOV flat at $118.60 indicating volume-driven growth', 'Noise-Cancelling Earbuds fastest-growing product (+18.6%)', 'Refunds increased 15.9% — Ergonomic Chair refund rate 8.4% above expected range', 'Repeat purchase rate improved from 32.5% → 33.7% (+1.2pp)', 'Mobile conversion (1.82%) significantly below desktop (4.84%) — funnel drop-off at checkout step'].map(x => <li key={x} className="list-inside list-disc">{x}</li>)}</ul><button className="mt-5 text-sm font-semibold text-[var(--foreground)]">Want to know what to do? → View AI Recommendations</button></article></Section>
 <section className="mt-10 border-t-[3px] border-[var(--border)] bg-card p-6"><h2 className="text-xs font-semibold tracking-[.12em]">ASK LULU AI</h2><form onSubmit={e => e.preventDefault()} className="mt-4 flex gap-3"><input value={ask} onChange={e => setAsk(e.target.value)} className="h-12 flex-1 rounded-md border border-[var(--border)] px-4 text-sm" placeholder="Ask Lulu AI about your ecommerce performance..." /><button className="rounded-md bg-[var(--primary)] px-5 text-sm font-semibold text-primary-foreground">Ask</button></form><div className="mt-4 grid grid-cols-4 gap-2">{['Which products generate the most revenue?', 'What is our conversion rate?', 'Which products are declining?', 'Compare with last year', 'What is our customer lifetime value?', 'Where are we losing customers in the funnel?', 'Which channels drive the most revenue?', 'What is our repeat purchase rate?'].map(x => <button onClick={() => setAsk(x)} key={x} className="rounded-md bg-[var(--secondary)] px-3 py-2 text-left text-xs text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)]">{x}</button>)}</div></section>
 <footer className="mt-8 border-t border-[var(--border)] py-5 text-xs text-[var(--muted-foreground)]">Data Sources: Shopify (Main Store), WooCommerce (EU Store) <span className="mx-2">|</span> Last updated: 3 min ago <span className="mx-2">|</span> Attribution: Last Touch <span className="mx-2">|</span> Currency: USD <span className="mx-2">|</span> Scope: Last 30 Days</footer>
 </main></div>;
}
export default LuluEcommerce;

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
    "id": "website-settings-9019",
    "label": "Website Settings"
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
