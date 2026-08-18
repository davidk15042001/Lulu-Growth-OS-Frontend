import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bot, ChevronDown, Download, ExternalLink, Filter, GitCompareArrows, LayoutDashboard, PackageSearch, RefreshCw, Search, Settings2, Sparkles, Target, TrendingUp, Users, X } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
const purple = 'var(--chart-2)';
const trend = [{
  date: 'May 01',
  revenue: 168,
  units: 110,
  margin: 42,
  conversion: 3.1,
  returns: 5.2,
  views: 72,
  cart: 31,
  purchases: 15
}, {
  date: 'May 06',
  revenue: 181,
  units: 118,
  margin: 41,
  conversion: 3.4,
  returns: 4.9,
  views: 86,
  cart: 38,
  purchases: 18
}, {
  date: 'May 11',
  revenue: 176,
  units: 125,
  margin: 40,
  conversion: 3.6,
  returns: 4.6,
  views: 82,
  cart: 42,
  purchases: 21
}, {
  date: 'May 16',
  revenue: 208,
  units: 135,
  margin: 41,
  conversion: 3.8,
  returns: 4.3,
  views: 102,
  cart: 47,
  purchases: 25
}, {
  date: 'May 21',
  revenue: 221,
  units: 145,
  margin: 40,
  conversion: 3.7,
  returns: 4.1,
  views: 118,
  cart: 56,
  purchases: 29
}, {
  date: 'May 26',
  revenue: 244,
  units: 158,
  margin: 40,
  conversion: 3.84,
  returns: 4.2,
  views: 132,
  cart: 63,
  purchases: 34
}];
const products = [['Premium Wireless Headphones', 'Electronics', '8,942', '$527,890', '4,210', '118,402', '7.55%', '$211,156', '40.0%', '184', '4.2%', '+28%'], ['Smart Home Hub', 'Home Tech', '6,731', '$392,460', '3,106', '96,220', '6.98%', '$166,100', '42.3%', '102', '3.1%', '+19%'], ['Ergonomic Desk Lamp', 'Home Office', '5,884', '$188,288', '2,940', '84,311', '6.98%', '$82,848', '44.0%', '76', '2.4%', '+16%'], ['Everyday Canvas Tote', 'Accessories', '5,212', '$104,240', '4,712', '73,118', '7.25%', '$48,985', '47.0%', '211', '4.0%', '+14%'], ['Cloud Knit Throw', 'Home', '4,998', '$174,930', '3,082', '66,241', '7.29%', '$72,721', '41.6%', '122', '2.4%', '+11%'], ['Trail Running Shoes', 'Footwear', '4,602', '$413,980', '2,608', '61,180', '7.13%', '$153,172', '37.0%', '198', '4.3%', '+8%'], ['Ceramic Pour Over Set', 'Kitchen', '3,944', '$118,320', '2,110', '51,490', '7.66%', '$55,807', '47.1%', '64', '1.6%', '+6%'], ['Merino Travel Jacket', 'Apparel', '3,708', '$333,720', '1,902', '44,218', '6.73%', '$120,139', '36.0%', '244', '6.6%', '-3%'], ['Focus Timer Cube', 'Productivity', '2,992', '$74,800', '1,678', '38,502', '7.77%', '$34,408', '46.0%', '39', '1.3%', '-8%'], ['Minimal Leather Wallet', 'Accessories', '2,420', '$96,800', '1,344', '32,118', '7.56%', '$45,496', '47.0%', '108', '4.5%', '-12%']];
const categories = [['Electronics', '$920K', '15,673', '7,316', '7.2%', '$377K', '41.0%', '+21%'], ['Home', '$482K', '11,204', '6,018', '6.8%', '$209K', '43.4%', '+16%'], ['Accessories', '$318K', '12,442', '7,984', '7.4%', '$151K', '47.5%', '+12%'], ['Apparel', '$402K', '4,901', '2,710', '6.1%', '$143K', '35.6%', '+4%'], ['Footwear', '$414K', '4,602', '2,608', '7.1%', '$153K', '37.0%', '-3%'], ['Kitchen', '$311K', '5,220', '2,880', '6.9%', '$138K', '44.3%', '+9%']];
const channels = [['Organic', '$722K', '8,920', '13,201', '5.9%', '$54.18'], ['Paid Search', '$598K', '5,410', '8,244', '4.8%', '$61.40'], ['Paid Social', '$388K', '3,102', '5,900', '3.7%', '$56.22'], ['Email', '$311K', '3,418', '5,112', '7.1%', '$59.01'], ['Direct', '$512K', '4,883', '7,410', '6.4%', '$63.21'], ['Referral', '$188K', '1,422', '2,214', '4.9%', '$58.02'], ['Marketplace', '$128K', '1,102', '1,930', '3.2%', '$52.18']];
const sources = [['Shopify', 'Connected', '2 min ago', '98%'], ['Google Analytics', 'Connected', '8 min ago', '96%'], ['WooCommerce', 'Not connected', '—', '—'], ['Amazon Marketplace', 'Connected', '1 hr ago', '91%']];
const kpis = [['Product Revenue', '$2,847,392', '+14.2%', 'Observed'], ['Units Sold', '48,291', '+8.7%', 'Observed'], ['Products Sold', '1,247', '+3.1%', 'Observed'], ['Product Conversion Rate', '3.84%', '-0.3pp', 'Observed'], ['Avg Product Revenue', '$58.96', '+5.1%', 'Calculated'], ['Gross Product Profit', '$1,138,957', '+11.8%', 'Calculated'], ['Gross Product Margin', '40.0%', '-0.9pp', 'Calculated'], ['Product Return Rate', '4.2%', '-0.6pp', 'Observed']];
const demand = [['Product Views', '1.82M', '+18.4%'], ['Search Activity', '284K', '+12.1%'], ['Add-to-Cart Events', '92,410', '+9.6%'], ['Orders', '42,806', '+11.2%'], ['Units Sold', '48,291', '+8.7%']];
const topProducts = [['01', 'Premium Wireless Headphones', '$527,890', '+28%'], ['02', 'Smart Home Hub', '$392,460', '+19%'], ['03', 'Trail Running Shoes', '$413,980', '+8%'], ['04', 'Merino Travel Jacket', '$333,720', '+4%'], ['05', 'Ergonomic Desk Lamp', '$188,288', '+16%']];
const growing = [['Portable Projector', '$82,410', '$58,120', '+41%', '1,202', '812'], ['Smart Home Hub', '$392,460', '$329,800', '+19%', '6,731', '3,106'], ['Premium Wireless Headphones', '$527,890', '$412,400', '+28%', '8,942', '4,210'], ['Cloud Knit Throw', '$174,930', '$157,600', '+11%', '4,998', '3,082'], ['Ceramic Pour Over Set', '$118,320', '$111,600', '+6%', '3,944', '2,110']];
const lifecycle: Array<[string, string[], string]> = [['New', ['Solar Reading Light', 'Travel Organizer'], 'var(--border)'], ['Launching', ['Portable Projector', 'Linen Apron'], 'var(--background)'], ['Growing', ['Premium Wireless Headphones', 'Smart Home Hub'], 'var(--background)'], ['Mature', ['Everyday Canvas Tote', 'Ceramic Pour Over Set'], 'var(--background)'], ['Declining', ['Merino Travel Jacket', 'Focus Timer Cube'], 'var(--background)'], ['Dormant', ['Classic Alarm Clock', 'Desk Cable Tray'], 'var(--background)']];
const categoryGrowth: Array<[string, string[], string]> = [['Fastest Growing', ['Electronics +21%', 'Home +16%', 'Accessories +12%'], 'green'], ['Declining', ['Footwear -3%', 'Apparel -1%', 'Outdoor -6%'], 'red'], ['Stable', ['Kitchen +9%', 'Office +2%', 'Wellness +1%'], 'gray']];
const chartTooltip = {
  contentStyle: {
    borderRadius: 8,
    border: '1px solid var(--border)',
    boxShadow: '0 8px 24px rgba(0,0,0,.08)',
    fontSize: 12
  }
};
function Sidebar() {
  const nav = [['Overview', LayoutDashboard], ['Business Intelligence', TrendingUp], ['Products', PackageSearch], ['Customers', Users], ['Anomalies', AlertTriangle]];
  return <aside className="hidden w-[238px] shrink-0 bg-[var(--sidebar)] text-foreground lg:flex lg:flex-col"><div className="mb-5 flex items-center gap-3 px-2 py-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</div><span className="font-semibold text-foreground">Lulu AI</span></div><LuluSectionNavigation activeId="cool-town-1727" /></aside>;
}
function Section({
  title,
  eyebrow,
  children,
  action
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return <section className="border-t border-border py-8"><div className="mb-5 flex items-end justify-between gap-4"><div>{eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-foreground">{eyebrow}</p>}<h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2></div>{action}</div>{children}</section>;
}
function Badge({
  children,
  tone = 'blue'
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  const styles: Record<string, string> = {
    blue: 'bg-secondary text-foreground',
    teal: 'bg-secondary text-foreground',
    amber: 'bg-secondary text-foreground',
    purple: 'bg-secondary text-foreground',
    gray: 'bg-secondary text-muted-foreground',
    green: 'bg-secondary text-foreground',
    red: 'bg-chart-5/10 text-chart-5'
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles[tone] || styles.gray}`}>{children}</span>;
}
export function ProductsIntelligence() {
  const [range, setRange] = useState('Last 30 Days');
  const [period, setPeriod] = useState('Daily');
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [question, setQuestion] = useState('');
  const filtered = useMemo(() => products.filter(p => p[0].toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground"><div className="flex min-h-screen"><Sidebar /><main className="min-w-0 flex-1"><header className="border-b border-border bg-card px-5 py-6 sm:px-8 lg:px-10"><div className="mx-auto max-w-[1440px]"><div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>Intelligence</span><span>/</span><span>Business Intelligence</span><span>/</span><strong className="text-foreground">Products</strong></div><div className="flex flex-wrap items-end justify-between gap-5"><div><h1 className="text-3xl font-black tracking-[-.04em] sm:text-4xl">Products</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Understand product demand, performance, revenue, profitability, conversion and customer value across your business.</p></div><div className="flex flex-wrap gap-2"><button className="btn-primary"><Bot size={15} />Ask Lulu AI</button><button className="btn-light"><RefreshCw size={15} />Refresh</button><button className="btn-light">Create Report</button><button className="btn-light"><Download size={15} />Export</button></div></div></div></header><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10"><div className="sticky top-0 z-10 -mx-5 border-b border-border bg-[var(--card)]/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10"><div className="flex flex-wrap items-center gap-2"><label className="relative"><span className="sr-only">Date range</span><select value={range} onChange={e => setRange(e.target.value)} className="control pr-9"><option>Today</option><option>Yesterday</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option><option>Last 12 Months</option><option>Year to Date</option><option>Previous Year</option><option>Custom Range</option></select><ChevronDown className="pointer-events-none absolute right-2 top-2.5 text-muted-foreground" size={15} /></label><label className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium text-muted-foreground"><input type="checkbox" defaultChecked className="accent-primary" />vs. Previous Period</label><button onClick={() => setShowFilters(!showFilters)} className="btn-light"><Filter size={14} />Filters <span className="rounded-full bg-secondary px-1.5 text-[10px] text-foreground">11</span></button>{showFilters && <div className="flex flex-wrap gap-2">{['Store', 'Product', 'Category', 'Brand', 'SKU', 'Variant', 'Country', 'Market', 'Channel', 'Customer Segment', 'Device'].map(filter => <button key={filter} className="filter-pill">{filter}<ChevronDown size={12} /></button>)}</div>}<button className="ml-auto text-xs font-semibold text-foreground hover:text-foreground"><X size={13} className="mr-1 inline" />Clear Filters</button></div></div><Section title="Product Overview" eyebrow="Section 01"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{kpis.map((kpi, i) => <article key={kpi[0]} className="kpi-card"><div className="flex items-start justify-between"><p className="text-xs font-semibold text-muted-foreground">{kpi[0]}</p><Badge tone={kpi[3] === 'Calculated' ? 'teal' : 'blue'}>{kpi[3]}</Badge></div><p className="mt-3 text-2xl font-black tracking-tight text-foreground">{kpi[1]}</p><p className={`mt-1 flex items-center gap-1 text-xs font-semibold ${kpi[2].startsWith('-') ? 'text-chart-5' : 'text-chart-4'}`}>{kpi[2].startsWith('-') ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}<span>{kpi[2]} vs previous period</span></p><div className="mt-3 h-8"><ResponsiveContainer width="100%" height="100%"><LineChart data={trend.slice(i % 2, 6)}><Line type="monotone" dataKey={i === 3 ? 'conversion' : 'revenue'} stroke={kpi[2].startsWith('-') ? 'var(--chart-5)' : purple} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></article>)}</div></Section><Section title="Product Performance Trend" eyebrow="Section 02" action={<div className="segmented">{['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map(item => <button key={item} onClick={() => setPeriod(item)} className={period === item ? 'active' : ''}>{item}</button>)}</div>}><div className="chart-card h-[310px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={trend} margin={{
                  top: 10,
                  right: 15,
                  left: -20,
                  bottom: 0
                }}><CartesianGrid stroke="var(--background)" vertical={false} /><XAxis dataKey="date" tick={{
                    fontSize: 11,
                    fill: 'var(--muted-foreground)'
                  }} axisLine={false} tickLine={false} /><YAxis tick={{
                    fontSize: 11,
                    fill: 'var(--muted-foreground)'
                  }} axisLine={false} tickLine={false} /><Tooltip {...chartTooltip} /><Line dataKey="revenue" name="Revenue ($K)" stroke={purple} strokeWidth={3} dot={false} /><Line dataKey="units" name="Units Sold (K)" stroke="var(--foreground)" strokeWidth={2} dot={false} /><Line dataKey="margin" name="Gross Margin %" stroke="var(--foreground)" strokeWidth={2} dot={false} /><Line dataKey="conversion" name="Conversion Rate %" stroke="var(--chart-1)" strokeWidth={2} dot={false} /><Line dataKey="returns" name="Return Rate %" stroke="var(--chart-5)" strokeWidth={2} dot={false} /><Legend iconType="circle" wrapperStyle={{
                    fontSize: 11,
                    paddingTop: 12
                  }} /></LineChart></ResponsiveContainer></div></Section><Section title="Product Performance" eyebrow="Section 03" action={<div className="flex gap-2"><button className="btn-light"><GitCompareArrows size={14} />Compare</button><button className="btn-light"><Download size={14} />Export</button></div>}><div className="mb-3 flex flex-wrap gap-2"><label className="relative min-w-[240px] flex-1"><Search size={15} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products" className="control w-full pl-9" /></label><button className="btn-light">Sort <ChevronDown size={14} /></button><button className="btn-light">Filter <Filter size={14} /></button></div><div className="table-wrap"><table><thead><tr>{['Product', 'Category', 'Units Sold', 'Revenue', 'Orders', 'Product Views', 'Conversion Rate', 'Gross Profit', 'Gross Margin', 'Refunds', 'Return Rate', 'Growth'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{filtered.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${cell}`} className={index === 0 ? 'font-semibold text-foreground' : ''}>{index === 11 ? <span className={cell.startsWith('-') ? 'text-chart-5' : 'text-foreground'}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div><p className="mt-3 text-xs text-muted-foreground">Showing 1–10 of 1,247 products <span className="float-right font-semibold text-foreground">1 / 125 <span className="ml-3 text-muted-foreground">‹</span> <span className="text-foreground">›</span></span></p></Section><Section title="Top / Growing / Declining Products" eyebrow="Section 04"><div className="grid gap-4 xl:grid-cols-3"><article className="panel"><div className="flex items-center justify-between"><h3 className="font-bold">Top Products</h3><select className="mini-select"><option>Revenue</option><option>Units</option><option>Profit</option><option>Margin</option><option>Growth</option></select></div>{topProducts.map(item => <div key={item[1]} className="list-row"><b className="w-6 text-xs text-muted-foreground">{item[0]}</b><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item[1]}</p><p className="text-xs text-muted-foreground">Electronics · {item[2]}</p></div><Badge tone="green">{item[3]}</Badge></div>)}</article><article className="panel"><h3 className="font-bold">Fastest-Growing Products</h3>{growing.map(item => <div key={item[0]} className="list-row"><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item[0]}</p><p className="text-xs text-muted-foreground">{item[1]} current · {item[2]} prev</p></div><div className="text-right"><p className="text-sm font-bold text-foreground">{item[3]}</p><p className="text-[10px] text-muted-foreground">{item[4]} units · {item[5]} orders</p></div></div>)}</article><article className="panel"><h3 className="font-bold">Declining Products</h3>{products.slice(7, 10).concat([['Classic Alarm Clock', 'Home', '$41,220', '$54,100', '—', '—', '—', '—', '—', '—', '—', '-18%'], ['Linen Apron', 'Kitchen', '$38,920', '$44,100', '—', '—', '—', '—', '—', '—', '—', '-14%']]).map(item => <div key={item[0]} className="list-row"><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item[0]}</p><p className="text-xs text-muted-foreground">Current {item[2]} · prev {item[3]}</p></div><span className="text-sm font-bold text-chart-5">{item[11]}</span></div>)}</article></div></Section><Section title="Product Demand" eyebrow="Section 05"><div className="grid gap-3 md:grid-cols-5">{demand.map(item => <article key={item[0]} className="metric-tile"><p className="text-xs text-muted-foreground">{item[0]}</p><strong className="mt-2 block text-xl">{item[1]}</strong><span className="text-xs font-semibold text-chart-4">↗ {item[2]}</span></article>)}</div><div className="chart-card mt-4 h-[260px]"><div className="mb-2 flex justify-between"><h3 className="font-bold">Product Demand Trend</h3><Badge tone="observed">Observed</Badge></div><ResponsiveContainer width="100%" height="90%"><AreaChart data={trend}><CartesianGrid stroke="var(--background)" vertical={false} /><XAxis dataKey="date" tick={{
                    fontSize: 11,
                    fill: 'var(--muted-foreground)'
                  }} axisLine={false} tickLine={false} /><YAxis tick={{
                    fontSize: 11,
                    fill: 'var(--muted-foreground)'
                  }} axisLine={false} tickLine={false} /><Tooltip {...chartTooltip} /><Area dataKey="views" name="Views" stackId="1" stroke="var(--foreground)" fill="var(--background)" /><Area dataKey="cart" name="Add-to-Cart" stackId="1" stroke="var(--foreground)" fill="var(--foreground)" /><Area dataKey="purchases" name="Purchases" stackId="1" stroke="var(--foreground)" fill="var(--foreground)" /></AreaChart></ResponsiveContainer></div></Section><Section title="Product Conversion Funnel" eyebrow="Section 06"><div className="grid gap-3 md:grid-cols-4">{[['Product View', '1.82M', '100%', 'var(--background)'], ['Add to Cart', '92,410', '5.1%', 'var(--primary)'], ['Checkout', '61,840', '66.9%', 'var(--primary)'], ['Purchase', '42,806', '69.2%', 'var(--primary)']].map((stage, i) => <article key={stage[0]} className="funnel-stage" style={{
                background: stage[3]
              }}><p className={`text-xs font-bold ${i === 3 ? 'text-foreground/70' : 'text-foreground'}`}>{stage[0]}</p><strong className={`mt-2 block text-2xl ${i === 3 ? 'text-foreground' : 'text-foreground'}`}>{stage[1]}</strong><p className={`mt-1 text-xs ${i === 3 ? 'text-foreground/80' : 'text-muted-foreground'}`}>{stage[2]} conversion · {i ? `${100 - Number(stage[2].replace('%', ''))}% drop-off` : 'entry volume'}</p></article>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-2">{['Add-to-Cart Performance', 'Purchase Conversion'].map((title, i) => <div key={title} className="panel"><h3 className="mb-3 font-bold">{title}</h3><div className="table-wrap"><table><thead><tr>{(i ? ['Product', 'Views', 'Purchases', 'View-to-Purchase', 'Purchase Growth'] : ['Product', 'Views', 'Add-to-Cart', 'ATC Rate', 'Cart Value', 'Purchase Conv.']).map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{products.slice(0, 5).map(row => <tr key={`${title}-${row[0]}`}><td className="font-semibold">{row[0]}</td><td>{row[5]}</td><td>{i ? row[4] : '—'}</td><td className="text-foreground">{i ? row[11] : row[6]}</td><td>{i ? '—' : row[3]}</td>{!i && <td>{row[6]}</td>}</tr>)}</tbody></table></div></div>)}</div></Section><Section title="Revenue & Profitability" eyebrow="Section 07"><div className="grid gap-4 lg:grid-cols-2"><article className="panel"><p className="text-xs font-semibold text-muted-foreground">Product Revenue</p><strong className="mt-2 block text-3xl font-black">$2,847,392</strong><p className="mt-1 text-sm font-semibold text-chart-4">↗ 14.2% growth</p><p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">YoY comparison <strong className="float-right text-foreground">$2.49M · +14.2%</strong></p></article><article className="panel"><h3 className="mb-2 font-bold">Revenue by Category</h3><div className="h-40"><ResponsiveContainer><PieChart><Pie data={categories.slice(0, 5).map((c, i) => ({
                        name: c[0],
                        value: [920, 482, 318, 402, 414][i]
                      }))} dataKey="value" innerRadius={42} outerRadius={65} paddingAngle={3}>{categories.slice(0, 5).map((c, i) => <Cell key={c[0]} fill={['var(--chart-2)', 'var(--chart-2)', 'var(--chart-2)', 'var(--chart-3)', 'var(--border)'][i]} />)}</Pie><Tooltip {...chartTooltip} /><Legend iconType="circle" wrapperStyle={{
                        fontSize: 10
                      }} /></PieChart></ResponsiveContainer></div></article></div><div className="mt-4 grid gap-4 md:grid-cols-2"><div className="panel"><h3 className="mb-3 font-bold">Revenue by Market</h3><div className="h-32"><ResponsiveContainer><BarChart data={categories.slice(0, 5)}><Bar dataKey="1" fill="var(--foreground)" radius={[4, 4, 0, 0]} /><XAxis dataKey="0" hide /><YAxis hide /><Tooltip {...chartTooltip} /></BarChart></ResponsiveContainer></div></div><div className="panel"><h3 className="mb-3 font-bold">Revenue by Channel</h3><div className="h-32"><ResponsiveContainer><BarChart data={channels}><Bar dataKey="1" fill="var(--foreground)" radius={[4, 4, 0, 0]} /><XAxis dataKey="0" hide /><YAxis hide /><Tooltip {...chartTooltip} /></BarChart></ResponsiveContainer></div></div></div><div className="panel mt-4"><div className="flex items-center justify-between"><h3 className="font-bold">Product Profitability</h3><Badge tone="teal">Calculated</Badge></div><div className="table-wrap mt-3"><table><thead><tr>{['Product', 'Revenue', 'Product Cost', 'Gross Profit', 'Gross Margin', 'Profit Contribution'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{products.slice(0, 5).map(row => <tr key={`profit-${row[0]}`}><td className="font-semibold">{row[0]}</td><td>{row[3]}</td><td>$245,110</td><td>{row[7]}</td><td>{row[8]}</td><td>18.6%</td></tr>)}</tbody></table></div><p className="mt-3 text-xs text-muted-foreground">Gross profit and margin are calculated from available cost data. Labeled Estimated where cost data is incomplete.</p></div></Section><Section title="Category Intelligence" eyebrow="Section 08"><div className="grid gap-4 lg:grid-cols-2"><div className="panel"><h3 className="mb-3 font-bold">Category Performance</h3><div className="table-wrap"><table><thead><tr>{['Category', 'Revenue', 'Units', 'Orders', 'Conversion', 'Gross Profit', 'Gross Margin', 'Growth'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{categories.map(row => <tr key={row[0]}>{row.map((cell, j) => <td key={`${row[0]}-${j}`} className={j === 7 ? cell.startsWith('-') ? 'text-chart-5' : 'text-chart-4' : ''}>{cell}</td>)}</tr>)}</tbody></table></div></div><div className="panel"><h3 className="font-bold">Category Growth</h3>{categoryGrowth.map(group => <div key={group[0]} className="mt-4"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{group[0]}</p><div className="mt-2 flex flex-wrap gap-2">{group[1].map(item => <Badge key={item} tone={group[2]}>{item}</Badge>)}</div></div>)} </div></div><div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="panel"><h3 className="font-bold">Variant Performance</h3><p className="mb-3 mt-1 text-xs text-muted-foreground">Analytical only. Manage variants in Products module.</p><div className="table-wrap"><table><thead><tr>{['Variant', 'Units', 'Revenue', 'Orders', 'Conversion', 'Returns', 'Margin'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{['Midnight / M', 'Pearl / L', 'Graphite / One Size', 'Sand / M', 'Forest / XL'].map((v, i) => <tr key={v}><td className="font-semibold">{v}</td><td>{[3220, 2844, 2190, 1880, 1652][i]}</td><td>{['$189K', '$164K', '$120K', '$98K', '$86K'][i]}</td><td>{[1240, 1102, 940, 744, 620][i]}</td><td>6.8%</td><td>3.1%</td><td>41.2%</td></tr>)}</tbody></table></div></div><div className="panel"><h3 className="font-bold">SKU Performance</h3><div className="table-wrap mt-4"><table><thead><tr>{['SKU', 'Product', 'Units', 'Revenue', 'Orders', 'Margin', 'Return Rate'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{products.slice(0, 5).map((row, i) => <tr key={`sku-${row[0]}`}><td className="font-mono text-xs">LU-{4102 + i}</td><td className="font-semibold">{row[0]}</td><td>{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td><td>{row[8]}</td><td>{row[10]}</td></tr>)}</tbody></table></div></div></div></Section><Section title="Market, Channel & Customer Analysis" eyebrow="Section 09"><div className="grid gap-4 lg:grid-cols-2"><div className="panel"><h3 className="mb-3 font-bold">Products by Market</h3><div className="table-wrap"><table><thead><tr>{['Country / Market', 'Revenue', 'Units', 'Orders', 'Conversion', 'AOV', 'Margin'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{[['United States', '$1.42M', '22,810', '19,204', '4.1%', '$74.10', '41.2%'], ['United Kingdom', '$421K', '7,210', '5,840', '3.7%', '$72.08', '39.8%'], ['Canada', '$284K', '4,902', '3,980', '3.6%', '$71.35', '40.1%'], ['Australia', '$248K', '3,822', '3,110', '3.2%', '$79.74', '38.6%'], ['Germany', '$262K', '4,188', '3,420', '3.4%', '$76.61', '39.2%'], ['France', '$212K', '3,402', '2,740', '3.1%', '$77.37', '37.9%']].map(row => <tr key={row[0]}>{row.map((cell, j) => <td key={`${row[0]}-${j}`} className={j === 0 ? 'font-semibold' : ''}>{cell}</td>)}</tr>)}</tbody></table></div></div><div className="panel"><h3 className="mb-3 font-bold">Products by Channel</h3><div className="table-wrap"><table><thead><tr>{['Channel', 'Revenue', 'Orders', 'Units', 'Conversion', 'AOV'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{channels.map(row => <tr key={row[0]}>{row.map((cell, j) => <td key={`${row[0]}-${j}`} className={j === 0 ? 'font-semibold' : ''}>{cell}</td>)}</tr>)}</tbody></table></div></div></div><div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="panel"><h3 className="font-bold">Products by Customer Segment</h3><div className="table-wrap mt-3"><table><thead><tr>{['Product', 'Segment', 'Orders', 'Revenue', 'Units', 'AOV', 'Repeat Purchase'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{products.slice(0, 5).map(row => <tr key={`segment-${row[0]}`}><td className="font-semibold">{row[0]}</td><td>High Value</td><td>{row[4]}</td><td>{row[3]}</td><td>{row[2]}</td><td>$72.10</td><td>34%</td></tr>)}</tbody></table></div></div><div className="panel"><h3 className="font-bold">Product Purchases by Customer Type</h3><div className="mt-5 grid grid-cols-2 gap-4"><div className="rounded-lg bg-card p-4"><p className="text-xs font-semibold text-muted-foreground">New Customers</p><strong className="mt-2 block text-2xl">$1.19M</strong><p className="mt-3 text-xs text-muted-foreground">Units <b className="float-right text-foreground">21,410</b></p><p className="mt-1 text-xs text-muted-foreground">Orders <b className="float-right text-foreground">18,220</b></p></div><div className="rounded-lg bg-secondary p-4"><p className="text-xs font-semibold text-foreground">Returning Customers</p><strong className="mt-2 block text-2xl text-foreground">$1.66M</strong><p className="mt-3 text-xs text-foreground">Units <b className="float-right">26,881</b></p><p className="mt-1 text-xs text-foreground">Orders <b className="float-right">24,586</b></p></div></div></div></div></Section><Section title="Bundles & Associations" eyebrow="Section 10"><div className="grid gap-4 lg:grid-cols-2"><div className="panel"><h3 className="font-bold">Product Bundles</h3><p className="mb-3 mt-1 text-xs text-muted-foreground">Bundle analysis based on order data. Manage bundles in Products module.</p><div className="table-wrap"><table><thead><tr>{['Bundle Name', 'Products', 'Frequency', 'Revenue', 'Units', 'Avg Bundle Value'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{[['Work From Home Kit', '3', '1,820', '$128K', '3,640', '$70.32'], ['Morning Ritual Set', '4', '1,104', '$92K', '2,208', '$83.33'], ['Travel Essentials', '3', '884', '$68K', '1,768', '$76.92'], ['Connected Home Starter', '2', '740', '$57K', '1,480', '$77.03'], ['Weekend Hike Pack', '4', '510', '$44K', '1,020', '$86.27']].map(row => <tr key={row[0]}>{row.map((cell, j) => <td key={`${row[0]}-${j}`} className={j === 0 ? 'font-semibold' : ''}>{cell}</td>)}</tr>)}</tbody></table></div></div><div className="panel"><h3 className="font-bold">Product Associations</h3><div className="table-wrap mt-4"><table><thead><tr>{['Product A', 'Product B', 'Co-purchase Frequency', 'Revenue', '% of Orders'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{[['Headphones', 'Smart Home Hub', '428', '$31,640', '4.2%'], ['Desk Lamp', 'Canvas Tote', '312', '$18,220', '3.1%'], ['Pour Over Set', 'Cloud Knit Throw', '288', '$16,890', '2.8%'], ['Running Shoes', 'Travel Jacket', '240', '$15,100', '2.3%'], ['Hub', 'Cable Tray', '194', '$10,420', '1.9%']].map(row => <tr key={row[0]}>{row.map((cell, j) => <td key={`${row[0]}-${j}`} className={j < 2 ? 'font-semibold' : ''}>{cell}</td>)}</tr>)}</tbody></table></div></div></div></Section><Section title="Returns & Refunds" eyebrow="Section 11"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['Returned Units', '2,108', '-4.8%'], ['Returned Orders', '1,824', '-3.2%'], ['Return Rate', '4.2%', '-0.6pp'], ['Refund Amount', '$128,420', '-2.1%']].map(item => <article key={item[0]} className="kpi-card"><p className="text-xs text-muted-foreground">{item[0]}</p><strong className="mt-2 block text-2xl">{item[1]}</strong><p className="mt-1 text-xs font-semibold text-chart-4">↘ {item[2]} vs previous</p></article>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="chart-card h-60"><h3 className="mb-3 font-bold">Return Rate Trend</h3><ResponsiveContainer><LineChart data={trend}><Line dataKey="returns" stroke="var(--chart-5)" strokeWidth={3} dot={false} /><XAxis dataKey="date" hide /><YAxis hide /><Tooltip {...chartTooltip} /></LineChart></ResponsiveContainer></div><div className="panel"><h3 className="font-bold">Return Rate by Product</h3>{products.slice(0, 5).map((row, i) => <div key={`return-${row[0]}`} className="list-row"><span className="w-5 text-xs text-muted-foreground">{i + 1}</span><span className="flex-1 text-sm font-semibold">{row[0]}</span><span className="text-sm font-bold text-chart-5">{row[10]}</span><span className="text-xs text-muted-foreground">{[244, 211, 198, 184, 122][i]} units</span></div>)}</div></div></Section><Section title="Lifecycle & Momentum" eyebrow="Section 12"><div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">{lifecycle.map(stage => <article key={stage[0]} className="rounded-lg border border-border bg-card p-3" style={{
                borderTopColor: stage[2],
                borderTopWidth: 3
              }}><h3 className="text-sm font-bold">{stage[0]}</h3>{stage[1].map(item => <div key={item} className="mt-3 rounded-md bg-card p-2"><p className="text-xs font-semibold">{item}</p><Badge tone="purple"><Sparkles size={10} /> AI Classification</Badge></div>)}</article>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="panel"><h3 className="font-bold">Product Momentum</h3>{[['⬆⬆ Strong Positive Momentum', '12 products', 'Premium Wireless Headphones', 'green'], ['⬆ Positive Momentum', '38 products', 'Smart Home Hub', 'green'], ['➡ Stable', '862 products', 'Everyday Canvas Tote', 'gray'], ['⬇ Negative Momentum', '224 products', 'Merino Travel Jacket', 'amber'], ['⬇⬇ Strong Negative Momentum', '111 products', 'Minimal Leather Wallet', 'red']].map(item => <div key={item[0]} className="list-row"><span className="flex-1 text-sm font-semibold">{item[0]}</span><Badge tone={item[3]}>{item[1]}</Badge><span className="hidden text-xs text-muted-foreground sm:inline">{item[2]}</span></div>)}</div><div className="panel"><h3 className="font-bold">Product Dependency</h3>{[['Single Product Risk', '18.5%', 'Premium Wireless Headphones', 'Medium'], ['Single Category Risk', '32.3%', 'Electronics', 'Medium'], ['Single Market Risk', '49.9%', 'United States', 'High'], ['Single Channel Risk', '25.4%', 'Organic', 'Low']].map(item => <div key={item[0]} className="list-row"><div className="flex-1"><p className="text-sm font-semibold">{item[0]}</p><p className="text-xs text-muted-foreground">{item[2]}</p></div><strong className="mr-3 text-sm">{item[1]}</strong><Badge tone={item[3] === 'High' ? 'red' : item[3] === 'Medium' ? 'amber' : 'green'}>{item[3]}</Badge></div>)}<button className="mt-4 text-xs font-bold text-foreground">→ View Risk Center</button><p className="mt-2 text-[11px] text-muted-foreground">Analytical risk information. Manage risks in Risk Center.</p></div></div></Section><Section title="Targets & Benchmarks" eyebrow="Section 13"><div className="panel"><div className="table-wrap"><table><thead><tr>{['Metric', 'Target', 'Actual', 'Gap', 'Progress', 'Deadline', 'Status'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{[['Revenue', '$2.8M', '$2.85M', '+$47K', '102%', 'Jun 30', 'Ahead'], ['Units', '50,000', '48,291', '-1,709', '96.6%', 'Jun 30', 'On Track'], ['Conversion Rate', '4.0%', '3.84%', '-0.16pp', '96%', 'Jun 30', 'Behind'], ['Gross Margin', '40.0%', '40.0%', '0pp', '100%', 'Jun 30', 'On Track'], ['Growth', '12.0%', '14.2%', '+2.2pp', '118%', 'Jun 30', 'Ahead']].map(row => <tr key={row[0]}>{row.map((cell, j) => <td key={`${row[0]}-${j}`} className={j === 0 ? 'font-semibold' : ''}>{j === 4 ? <div className="flex items-center gap-2"><div className="h-1.5 w-16 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                              width: `${Math.min(Number(cell.replace('%', '')), 100)}%`
                            }} /></div>{cell}</div> : j === 6 ? <Badge tone={cell === 'Ahead' ? 'green' : cell === 'Behind' ? 'red' : 'blue'}>{cell}</Badge> : cell}</td>)}</tr>)}</tbody></table></div><p className="mt-3 text-xs text-muted-foreground">Targets are organization-defined. Lulu AI never creates targets automatically.</p></div><div className="panel mt-4"><h3 className="font-bold">Product Benchmark</h3><div className="table-wrap mt-3"><table><thead><tr>{['Metric', 'Actual', 'Historical Benchmark', 'Industry Benchmark', 'Target'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{[['Conversion Rate', '3.84%', '3.52%', '3.20%', '4.00%'], ['Gross Margin', '40.0%', '39.2%', '38.0%', '40.0%'], ['Return Rate', '4.2%', '4.8%', '5.1%', '< 4.5%'], ['Revenue Growth', '14.2%', '9.8%', '11.4%', '12.0%']].map(row => <tr key={row[0]}>{row.map((cell, j) => <td key={`${row[0]}-${j}`} className={j === 0 ? 'font-semibold' : ''}>{j > 0 && <Badge tone={j === 1 ? 'blue' : j === 2 ? 'gray' : j === 3 ? 'amber' : 'purple'}>{j === 1 ? 'Observed' : j === 2 ? 'Benchmark' : j === 3 ? 'Industry' : 'Target'}</Badge>}<span className="ml-2">{cell}</span></td>)}</tr>)}</tbody></table></div><p className="mt-3 text-xs text-muted-foreground">Benchmarks are reference comparisons only.</p></div></Section><Section title="Trends & Anomalies" eyebrow="Section 14"><div className="chart-card h-64"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold">Product Trends</h3><div className="segmented">{['Revenue', 'Units', 'Orders', 'Views', 'Conversion', 'Margin', 'Returns'].map((item, i) => <button key={item} className={i === 0 ? 'active' : ''}>{item}</button>)}</div></div><ResponsiveContainer><LineChart data={trend}><CartesianGrid stroke="var(--background)" vertical={false} /><XAxis dataKey="date" tick={{
                    fontSize: 11,
                    fill: 'var(--muted-foreground)'
                  }} axisLine={false} tickLine={false} /><YAxis hide /><Tooltip {...chartTooltip} /><Line dataKey="revenue" stroke={purple} strokeWidth={3} dot={false} /><Line dataKey="units" stroke="var(--background)" strokeDasharray="4 4" dot={false} /></LineChart></ResponsiveContainer></div><div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="panel"><h3 className="font-bold">Product Anomalies</h3>{[['Merino Travel Jacket', 'Return Rate', 'May 24', '9.8%', '4.0–7.0%', '+2.8pp'], ['Premium Wireless Headphones', 'Revenue', 'May 21', '$48.2K', '$31–42K', '+$6.2K'], ['Focus Timer Cube', 'Units Sold', 'May 18', '122', '180–240', '-58']].map(item => <div key={item[0]} className="list-row"><div className="flex-1"><p className="text-sm font-semibold">{item[0]}</p><p className="text-xs text-muted-foreground">{item[1]} · {item[2]}</p></div><span className="text-xs font-semibold text-chart-5">{item[5]}</span><button className="text-xs font-bold text-foreground">View Anomaly</button></div>)}<p className="mt-3 text-[11px] text-muted-foreground">Anomaly management available in Anomalies module.</p></div><div className="panel"><h3 className="font-bold">Product Data Health</h3>{sources.map(source => <div key={source[0]} className="list-row"><div className="flex-1"><p className="text-sm font-semibold">{source[0]}</p><p className="text-xs text-muted-foreground">Last sync {source[2]} · Coverage {source[3]}</p></div><Badge tone={source[1] === 'Connected' ? 'green' : 'gray'}>{source[1]}</Badge></div>)}<button className="mt-3 text-xs font-bold text-foreground">Open Integrations <ExternalLink size={12} className="inline" /></button></div></div></Section><Section title="KPIs, AI & Ask" eyebrow="Section 15"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{['Product Revenue', 'Units Sold', 'Product Conversion Rate', 'Gross Profit', 'Gross Margin', 'Return Rate', 'Product Growth', 'Product Views', 'Add-to-Cart Rate', 'Revenue Contribution'].map((name, i) => <article key={name} className="kpi-card"><p className="text-xs font-semibold text-muted-foreground">{name}</p><strong className="mt-2 block text-xl">{['$2.85M', '48,291', '3.84%', '$1.14M', '40.0%', '4.2%', '14.2%', '1.82M', '5.1%', '46.3%'][i]}</strong><p className="mt-1 text-xs font-semibold text-foreground">↗ +{[14, 8, 3, 11, 1, 6, 14, 18, 9, 4][i]}%</p></article>)}</div><button className="btn-light mt-4"><Activity size={14} />Open KPI Explorer</button><article className="ai-panel mt-5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary"><Sparkles size={20} /></div><div><h3 className="font-bold text-foreground">Explain Product Performance</h3><Badge tone="purple">AI Explanation</Badge></div></div><p className="mt-5 max-w-4xl text-sm leading-6 text-foreground">Product revenue grew 14.2% driven by Premium Wireless Headphones (+28%) and Smart Home Hub (+19%). Gross margin declined slightly due to higher return rates in the Electronics category, while repeat customers contributed 58.3% of product revenue.</p><button className="mt-4 rounded-lg bg-card px-3 py-2 text-xs font-bold text-foreground">View AI Recommendations</button><p className="mt-3 text-[11px] text-foreground">Explanations reference connected product data only.</p></article><div className="panel mt-4"><div className="flex items-center gap-2"><Bot size={18} className="text-muted-foreground" /><h3 className="font-bold">Ask Lulu AI</h3></div><div className="mt-3 flex gap-2"><input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask Lulu AI about your product performance..." className="control flex-1" /><button className="btn-primary">Ask</button></div><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{['Which products perform best?', 'Which generate most revenue?', 'Which are growing fastest?', 'Which have highest conversion?', 'Which have highest return rate?', 'Which categories perform best?', 'Compare with last year'].map(prompt => <button key={prompt} onClick={() => setQuestion(prompt)} className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-border hover:text-foreground">{prompt}</button>)}</div></div></Section><footer className="border-t border-border py-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-lg font-bold">Data Sources</h2><p className="mt-1 text-xs text-muted-foreground">Connected sources powering product intelligence</p></div><button className="text-xs font-bold text-foreground">Manage Integrations →</button></div><div className="mt-4 flex flex-wrap gap-3">{sources.map(source => <div key={`footer-${source[0]}`} className="rounded-lg border border-border bg-card px-4 py-3"><p className="text-sm font-semibold">{source[0]}</p><p className="mt-1 text-xs text-muted-foreground"><span className={source[1] === 'Connected' ? 'text-chart-4' : 'text-muted-foreground'}>● {source[1]}</span> · {source[2]}</p></div>)}</div></footer></div></main></div></div>;
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
