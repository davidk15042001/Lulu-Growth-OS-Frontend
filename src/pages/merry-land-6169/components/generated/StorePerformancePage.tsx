import { useState } from 'react';
import { Activity, AlertTriangle, ArrowDown, ArrowUp, BarChart3, Bot, ChevronDown, ChevronRight, CircleCheck, Clock3, Download, ExternalLink, Filter, Menu, MoreHorizontal, Package, RefreshCw, Search, Send, Settings2, Sparkles, Store, Users, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
const navItems = ['Overview', 'Stores', 'Products', 'Collections', 'Categories', 'Orders', 'Customers', 'Carts', 'Abandoned Carts', 'Returns', 'Shipping', 'Inventory', 'Reviews', 'Discounts & Promotions', 'Analytics', 'Settings'];
const kpis = [['Revenue', '$284,920', '+18%', 'up', 'blue'], ['Orders', '1,847', '+12%', 'up', 'purple'], ['Customers', '1,203', '+9%', 'up', 'teal'], ['Avg Order Value', '$154.30', '+5%', 'up', 'amber'], ['Conversion Rate', '3.24%', '+0.4pp', 'up', 'blue'], ['Units Sold', '4,291', '+14%', 'up', 'purple'], ['Refunds', '$8,340', '-2%', 'down', 'red'], ['Net Revenue', '$276,580', '+19%', 'up', 'teal']];
const products = [['Hydra-Lift Serum 50ml', '$42,840', '428', '+24%', '15.1%'], ['Glow Essence Toner', '$31,290', '521', '+18%', '11.0%'], ['Velvet Matte Lip Kit', '$28,470', '356', '+8%', '10.0%'], ['Brightening Eye Cream', '$22,140', '246', '-3%', '7.8%'], ['Repair Night Balm', '$18,620', '207', '+31%', '6.5%']];
const categories = [['Serums & Treatments', '$98,420', '621', '1,248', '+22%', '34.5%'], ['Moisturisers', '$72,310', '487', '918', '+14%', '25.4%'], ['Lip Products', '$44,180', '394', '712', '+9%', '15.5%'], ['Eye Care', '$38,940', '248', '489', '-2%', '13.7%'], ['Sun Care', '$31,070', '197', '422', '+6%', '10.9%']];
const activities = [['📊', 'Performance anomaly detected', 'Ultra-Firm Body Lotion refund spike', 'Lulu Store · 2 hrs ago · System'], ['🔄', 'Data synchronized', 'Lulu Store / Shopify · 1,284 orders', '3 min ago · System'], ['🤖', 'AI insight generated', 'Revenue analysis completed', 'Just now · Lulu AI'], ['📦', 'Revenue milestone reached', '$280K this month · Lulu Store', '6 hrs ago · System'], ['⚠️', 'Performance change detected', 'WooCommerce conversion -0.8pp', '1 day ago · System']];
const prompts = ['How is my store performing?', 'Why did revenue change?', 'Which store is performing best?', 'Which products drive the most revenue?', 'Why did orders decline?', 'What changed vs last month?', 'Analyze my conversion funnel', 'Compare my stores', 'Find unusual performance changes', 'Create a store performance report'];
const chartPoints = '0,152 20,144 40,148 60,132 80,139 100,119 120,124 140,112 160,116 180,94 200,103 220,86 240,92 260,72 280,80 300,56 320,64 340,48 360,55 380,35 400,42 420,22 440,28 460,12 480,20 500,5';
export function StorePerformancePage() {
  const [store, setStore] = useState('All Stores');
  const [range, setRange] = useState('Last 30 Days');
  const [compare, setCompare] = useState('Previous Period');
  const [metric, setMetric] = useState('Revenue');
  const [granularity, setGranularity] = useState('Daily');
  const [productTab, setProductTab] = useState('Revenue');
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [sort, setSort] = useState('Revenue');
  const { items: storeRecords, loading: storesLoading, error: storesError } = useLiveRecords('ecommerce_stores');
  const { items: orderRecords, loading: ordersLoading, error: ordersError } = useLiveRecords('ecommerce_orders');
  const { items: customerRecords, loading: customersLoading, error: customersError } = useLiveRecords('ecommerce_customers');
  const storeLoading = storesLoading || ordersLoading || customersLoading;
  const storeError = storesError || ordersError || customersError;
  const liveRevenue = orderRecords.reduce((sum, record) => sum + (Number(String(record.valueAmount ?? '').replace(/[^0-9.-]/g, '')) || 0), 0);
  const liveKpis = [['Revenue', liveRevenue ? liveRevenue.toLocaleString() : '—', 'Live records', 'up', 'blue'], ['Orders', String(orderRecords.length), 'Live records', 'up', 'purple'], ['Customers', String(customerRecords.length), 'Live records', 'up', 'teal'], ['Avg Order Value', orderRecords.length && liveRevenue ? (liveRevenue / orderRecords.length).toLocaleString() : '—', 'Calculated', 'up', 'amber'], ['Conversion Rate', '—', 'Analytics contract required', 'up', 'blue'], ['Units Sold', '—', 'Product contract required', 'up', 'purple'], ['Refunds', '—', 'Returns contract required', 'down', 'red'], ['Net Revenue', liveRevenue ? liveRevenue.toLocaleString() : '—', 'Calculated', 'up', 'teal']];
  const tabs = ['Revenue', 'Orders', 'Customers', 'AOV', 'Conversion Rate'];
  const selectClass = 'h-10 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground outline-none focus:border-border focus:ring-2 focus:ring-ring';
  return <main className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-30 flex w-[248px] flex-col bg-[var(--sidebar)] text-foreground transition-transform lg:translate-x-0 ${sidebar ? 'translate-x-0' : '-translate-x-full'}`}>
      <header className="flex h-20 items-center gap-3 border-b border-border px-6"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">L</span><div><p className="font-semibold tracking-tight text-foreground">LULU AI</p><p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Core platform</p></div></header>
      <LuluSectionNavigation activeId="merry-land-6169" />
      <footer className="border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary"><span className="grid h-8 w-8 place-items-center rounded-full bg-secondary/30 text-sm font-semibold text-foreground">—</span><span className="flex-1 text-sm text-foreground">Workspace owner<small className="block text-xs text-muted-foreground">Administrator</small></span><Settings2 className="h-4 w-4" /></button></footer>
    </aside>
    <div className="lg:pl-[248px]"><div className="mx-auto max-w-[1540px] px-5 py-5 sm:px-8 lg:px-10">{storeError && <div role="alert" className="mb-4 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Store performance data could not be loaded. Check the connected ecommerce platforms and try again.</div>}{!storeLoading && !storeError && storeRecords.length === 0 && orderRecords.length === 0 && <div className="mb-4 rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">No connected store performance records are available yet.</div>}
      <header className="mb-6 flex flex-col gap-5 border-b border-border pb-6 xl:flex-row xl:items-end xl:justify-between"><div className="flex items-start gap-3"><button onClick={() => setSidebar(true)} className="icon-btn mt-1 lg:hidden" aria-label="Open navigation"><Menu className="h-4 w-4" /></button><div><p className="mb-2 text-sm font-medium text-muted-foreground">Ecommerce <ChevronRight className="mx-1 inline h-3.5 w-3.5" /> Store Performance</p><h1 className="text-3xl font-bold tracking-[-.035em] text-foreground sm:text-4xl">Store Performance</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Understand how your ecommerce stores are performing and where growth opportunities exist.</p></div></div><div className="flex flex-wrap gap-2"><button className="secondary-btn"><Sparkles className="h-4 w-4 text-foreground" />Ask Lulu AI</button><button className="secondary-btn">Compare Stores</button><button aria-label="Refresh" className="icon-btn"><RefreshCw className="h-4 w-4" /></button><button aria-label="Export" className="icon-btn"><Download className="h-4 w-4" /></button><button aria-label="More actions" className="icon-btn"><MoreHorizontal className="h-4 w-4" /></button></div></header>
      <section className="mb-6 flex flex-wrap gap-3 rounded-lg border border-border bg-card p-3 shadow-sm"><label className="flex min-w-[220px] flex-1 items-center gap-2"><Store className="ml-2 h-4 w-4 text-foreground" /><select aria-label="Select store" className={`${selectClass} w-full border-0 p-0`} value={store} onChange={e => setStore(e.target.value)}><option>All Stores</option><option>Lulu Store (Shopify · Connected · USD)</option><option>Lulu WooCommerce (WooCommerce · Connected · USD)</option></select></label><label><select aria-label="Date range" className={selectClass} value={range} onChange={e => setRange(e.target.value)}><option>Today</option><option>Yesterday</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option><option>Month to Date</option><option>Previous Month</option><option>Quarter to Date</option><option>Year to Date</option></select></label><label><select aria-label="Compare with" className={selectClass} value={compare} onChange={e => setCompare(e.target.value)}><option>Previous Period</option><option>Previous Year</option><option>Custom Period</option><option>None</option></select></label><span className="inline-flex h-10 items-center rounded-full border border-border bg-secondary px-3 text-xs font-bold text-muted-foreground">USD</span></section>
      <section className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4"><>{(storeLoading ? [] : liveKpis).map(item => <article key={item[0]} className="rounded-lg border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-muted-foreground">{item[0]}</p><span className={`h-2 w-2 rounded-full ${item[4] === 'red' ? 'bg-destructive' : item[4] === 'amber' ? 'bg-chart-1' : 'bg-primary'}`} /></div><strong className="mt-2 block text-xl tracking-tight text-foreground">{item[1]}</strong><span className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${item[3] === 'down' ? 'text-chart-5' : 'text-foreground'}`}>{item[3] === 'down' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}{item[2]} <span className="font-normal text-muted-foreground">vs prev period</span></span><svg viewBox="0 0 100 24" className="mt-3 h-7 w-full" role="img" aria-label={`${item[0]} seven day trend`}><polyline points="0,19 14,16 28,18 42,11 56,14 70,7 84,10 100,3" fill="none" stroke={item[3] === 'down' ? 'var(--chart-5)' : 'var(--foreground)'} strokeWidth="2" /></svg></article>)}</></section>
      <section className="panel mb-7"><header className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Store Performance Trend</h2><p className="mt-1 text-xs text-muted-foreground">Observed platform data · {range}</p></div><div className="flex overflow-x-auto border-b border-border">{tabs.map(tab => <button key={tab} onClick={() => setMetric(tab)} className={`tab-btn px-3 ${metric === tab ? 'active' : ''}`}>{tab}</button>)}</div></header><div className="mt-5 h-[260px] rounded-md bg-card/70 p-3"><svg viewBox="0 0 520 190" className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="Revenue trend chart comparing current and previous periods"><path d="M0 160H520 M0 115H520 M0 70H520 M0 25H520" stroke="var(--border)" strokeWidth="1" /><polyline points={chartPoints} fill="none" stroke="var(--chart-3)" strokeWidth="3" /><polyline points="0,163 20,157 40,159 60,151 80,154 100,146 120,149 140,142 160,145 180,136 200,141 220,130 240,134 260,124 280,130 300,116 320,121 340,109 360,114 380,103 400,108 420,96 440,100 460,91 480,95 500,83" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="6 5" /><text x="8" y="184" fontSize="10" fill="var(--muted-foreground)">Aug 1</text><text x="245" y="184" fontSize="10" fill="var(--muted-foreground)">Aug 15</text><text x="480" y="184" fontSize="10" fill="var(--muted-foreground)">Aug 30</text></svg></div><footer className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><span><i className="mr-1 inline-block h-2 w-5 rounded bg-primary text-primary-foreground" />Current Period (Aug 1–30) <i className="ml-4 mr-1 inline-block h-0.5 w-5 border-t-2 border-dashed border-border" />Previous Period (Jul 1–30)</span><span>Hover chart for date, value and % change</span></footer></section>
      <div className="mb-7 grid gap-7 xl:grid-cols-[1.35fr_1fr]"><section className="panel"><header className="flex items-center justify-between"><div><h2 className="section-title">Revenue</h2><p className="mt-1 text-xs text-muted-foreground">Observed and calculated from platform data</p></div><div className="flex rounded-md border border-border p-0.5">{['Daily', 'Weekly', 'Monthly'].map(item => <button key={item} onClick={() => setGranularity(item)} className={`rounded px-2 py-1 text-xs ${granularity === item ? 'bg-secondary font-semibold text-foreground' : 'text-foreground'}`}>{item}</button>)}</div></header><div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">{[['Gross Revenue', '$293,260'], ['Discounts', '-$8,340'], ['Refunds', '-$8,340'], ['Net Revenue', '$276,580']].map(item => <div key={item[0]}><p className="text-xs text-muted-foreground">{item[0]}</p><strong className="mt-1 block text-base">{item[1]}</strong><span className="text-[10px] uppercase tracking-wide text-muted-foreground">{item[0] === 'Net Revenue' ? 'Calculated' : 'Observed'}</span></div>)}</div><div className="mt-6 flex h-28 items-end gap-1" aria-label="Daily revenue bar chart">{[42, 58, 48, 70, 52, 80, 62, 77, 65, 90, 74, 84, 68, 96, 75, 88, 80, 99, 84, 91, 78, 96, 87, 100, 91, 97, 88, 98, 93, 100].map((height, i) => <span key={`bar-${height}-${i}`} className="flex-1 rounded-t bg-secondary/80" style={{
                height: `${height}%`
              }} />)}</div><p className="mt-2 text-xs text-muted-foreground">Revenue Over Time · {granularity} view</p></section><section className="panel"><h2 className="section-title">Orders</h2><p className="mt-1 text-xs text-muted-foreground">Observed platform order status</p><div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4">{[['Total Orders', '1,847'], ['Completed', '1,724 (93.3%)'], ['Cancelled', '89 (4.8%)'], ['Refunded', '34 (1.8%)'], ['Avg Orders/Day', '61.6'], ['Order Growth', '+12% vs prev period']].map(item => <div key={item[0]}><p className="text-xs text-muted-foreground">{item[0]}</p><strong className="mt-1 block text-sm">{item[1]}</strong></div>)}</div><svg viewBox="0 0 300 70" className="mt-7 h-16 w-full" preserveAspectRatio="none" aria-label="Orders over time"><polyline points="0,55 25,47 50,53 75,35 100,42 125,25 150,34 175,20 200,27 225,13 250,19 275,8 300,12" fill="none" stroke="var(--foreground)" strokeWidth="3" /></svg><p className="text-xs text-muted-foreground">Orders Over Time</p></section></div>
      <div className="mb-7 grid gap-7 xl:grid-cols-2"><section className="panel"><h2 className="section-title">Customer Performance</h2><div className="mt-5 grid grid-cols-[120px_1fr] items-center gap-5"><div className="relative grid h-28 w-28 place-items-center rounded-full" style={{
                background: 'conic-gradient(var(--primary) 0 70.4%, var(--primary) 70.4% 100%)'
              }}><span className="grid h-16 w-16 place-items-center rounded-full bg-card text-center text-xs font-bold">1,203<br /><small className="font-normal text-muted-foreground">customers</small></span></div><div className="space-y-3">{[['New Customers', '847 (70.4%)', 'bg-primary'], ['Returning Customers', '356 (29.6%)', 'bg-primary'], ['Repeat Purchase Rate', '29.6%', 'bg-muted']].map(item => <div key={item[0]} className="flex items-start gap-2 text-sm"><span className={`mt-1 h-2.5 w-2.5 rounded-full ${item[2]}`} /><span><strong>{item[1]}</strong><small className="block text-xs text-muted-foreground">{item[0]}</small></span></div>)}</div></div><div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm"><div><span className="text-xs text-muted-foreground">New Customer Revenue</span><strong className="block">$184,240</strong></div><div><span className="text-xs text-muted-foreground">Returning Customer Revenue</span><strong className="block">$100,680</strong></div></div><p className="mt-4 text-xs text-muted-foreground">Repeat Purchase Rate · Calculated</p></section><section className="panel"><h2 className="section-title">Average Order Value</h2><div className="mt-5 flex items-end gap-4"><div><p className="text-xs text-muted-foreground">Current AOV</p><strong className="text-3xl tracking-tight">$154.30</strong></div><span className="mb-1 text-sm font-semibold text-foreground">+$7.40 (+5%)</span></div><svg viewBox="0 0 300 55" className="mt-5 h-14 w-full" preserveAspectRatio="none" aria-label="Average order value trend"><polyline points="0,43 30,38 60,41 90,29 120,34 150,22 180,28 210,17 240,22 270,10 300,14" fill="none" stroke="var(--foreground)" strokeWidth="3" /></svg><div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">{[['Previous Period AOV', '$146.90'], ['Avg Items per Order', '2.3'], ['Discount Impact', '-$4.52 per order'], ['Returning Customer AOV', '$176.80'], ['New Customer AOV', '$142.40']].map(item => <div key={item[0]}><span className="text-xs text-muted-foreground">{item[0]}</span><strong className="block">{item[1]}</strong></div>)}</div><p className="mt-4 text-xs text-muted-foreground">Calculated from connected platform order data</p></section></div>
      <section className="panel mb-7"><header className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Conversion Performance</h2><p className="mt-1 text-xs text-muted-foreground">Session and traffic data provided by connected analytics · Conversion Rate · Calculated</p></div><span className="severity medium">Conversion Rate · 6.54%</span></header><div className="mt-6 grid gap-2 md:grid-cols-5">{[['Sessions', '12,847', '—'], ['Product Views', '3,250', '25.3%'], ['Add to Cart', '1,566', '12.2%'], ['Checkout Started', '962', '7.5%'], ['Orders', '841', '6.5%']].map((item, i) => <div key={item[0]} className="relative rounded-md bg-card p-4 text-center"><strong className="block text-lg">{item[1]}</strong><span className="text-xs font-semibold text-muted-foreground">{item[0]}</span><small className="mt-1 block text-xs text-foreground">{item[2]}</small>{i < 4 ? <span className="absolute -right-2 top-1/2 z-10 hidden text-xs text-muted-foreground md:block">↓</span> : null}</div>)}</div></section>
      <div className="mb-7 grid gap-7 xl:grid-cols-[1.35fr_1fr]"><section className="panel"><header className="flex items-center justify-between"><h2 className="section-title">Top Products</h2><button className="text-sm font-semibold text-foreground">View All</button></header><div className="mt-3 flex gap-4 border-b border-border">{['Revenue', 'Units Sold', 'Orders', 'Growth'].map(tab => <button key={tab} onClick={() => setProductTab(tab)} className={`tab-btn ${productTab === tab ? 'active' : ''}`}>{tab}</button>)}</div><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground"><tr><th className="py-3"># / Product</th><th>Revenue</th><th>Units</th><th>Growth</th><th>Share</th><th>Actions</th></tr></thead><tbody className="divide-y divide-border">{products.map((item, i) => <tr key={item[0]} className="hover:bg-secondary/30"><td className="py-3"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">{i + 1}</span><strong className="whitespace-nowrap">{item[0]}</strong></div></td><td>{item[1]}</td><td>{item[2]}</td><td className={item[3].startsWith('-') ? 'text-chart-5' : 'text-foreground'}>{item[3]} {item[3].startsWith('-') ? '↓' : '↑'}</td><td>{item[4]}</td><td><button className="row-action">Analyze</button><button className="row-action">Ask AI</button></td></tr>)}</tbody></table></div></section><section className="panel"><header className="flex items-center justify-between"><h2 className="section-title">Products Requiring Attention</h2><span className="ai-badge">✦ AI Insight</span></header><div className="mt-4 divide-y divide-border">{[['Brightening Eye Cream', 'Revenue declining 3% · Low engagement trend'], ['Ultra-Firm Body Lotion', 'Unusual refund activity'], ['SPF 50 Daily Shield', 'Lower than expected conversion']].map(item => <div key={item[0]} className="py-4"><strong className="block text-sm">{item[0]}</strong><span className="mt-1 block text-xs text-muted-foreground">{item[1]}</span><button className="row-action mt-2 pl-0">Investigate</button><button className="row-action">Ask Lulu AI</button></div>)}</div><p className="mt-3 text-xs text-muted-foreground">AI Insight — Based on available platform performance data. Not confirmed causation.</p></section></div>
      <section className="panel mb-7"><header className="flex items-center justify-between"><h2 className="section-title">Category Performance</h2><button className="text-sm font-semibold text-foreground"><Filter className="mr-1 inline h-3.5 w-3.5" />Filter</button></header><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="border-y border-border text-[11px] uppercase tracking-wider text-muted-foreground"><tr><th className="py-3">Category</th><th>Revenue</th><th>Orders</th><th>Units</th><th>Growth</th><th>Share</th><th>Actions</th></tr></thead><tbody className="divide-y divide-border">{categories.map(item => <tr key={item[0]}><td className="py-3 font-semibold">{item[0]}</td><td>{item[1]}</td><td>{item[2]}</td><td>{item[3]}</td><td className={item[4].startsWith('-') ? 'text-chart-5' : 'text-foreground'}>{item[4]} {item[4].startsWith('-') ? '↓' : '↑'}</td><td>{item[5]}</td><td><button className="row-action">Analyze</button></td></tr>)}</tbody></table></div></section>
      <section className="panel mb-7"><header className="flex items-center justify-between"><div><h2 className="section-title">Store Comparison</h2><p className="mt-1 text-xs text-muted-foreground">Sortable comparison across connected stores</p></div><button className="secondary-btn"><Download className="h-4 w-4" />Export</button></header><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['🏆', 'Best Performing', 'Lulu Store (Revenue)'], ['🚀', 'Fastest Growing', 'Lulu WooCommerce (+31%)'], ['💎', 'Highest AOV', 'Lulu Store ($154.30)'], ['🎯', 'Highest Conversion', 'Lulu Store (3.24%)']].map(item => <div key={item[1]} className="rounded-md bg-card p-3"><span className="text-lg">{item[0]}</span><p className="mt-1 text-xs text-muted-foreground">{item[1]}</p><strong className="text-sm">{item[2]}</strong></div>)}</div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-y border-border text-[11px] uppercase tracking-wider text-muted-foreground"><tr>{['Store', 'Platform', 'Revenue', 'Orders', 'Customers', 'AOV', 'Conv. Rate', 'Growth', 'Units'].map(item => <th key={item} className="py-3"><button onClick={() => setSort(item)}>{item}{sort === item ? ' ↑' : ''}</button></th>)}</tr></thead><tbody className="divide-y divide-border"><tr><td className="py-3 font-semibold">Lulu Store</td><td>Shopify</td><td>$204,840</td><td>1,284</td><td>847</td><td>$159.50</td><td>3.24%</td><td className="text-foreground">+18%</td><td>3,012</td></tr><tr><td className="py-3 font-semibold">Lulu WooCommerce</td><td>WooCommerce</td><td>$80,080</td><td>563</td><td>356</td><td>$142.20</td><td>2.87%</td><td className="text-foreground">+31%</td><td>1,279</td></tr></tbody></table></div></section>
      <section className="mb-7"><header className="mb-4 flex items-center justify-between"><h2 className="section-title">Performance Anomalies <span className="count-badge amber">3 detected</span></h2><button className="text-sm font-semibold text-foreground">View All</button></header><div className="grid gap-3 lg:grid-cols-3">{[['border-l-chart-5', '🔴', 'Unusual Refund Activity', 'Ultra-Firm Body Lotion · +340% refund rate spike', 'High', '2 hrs ago'], ['border-l-border', '🟠', 'Conversion Rate Change', 'Lulu WooCommerce · -0.8pp drop in checkout conversion', 'Medium', '1 day ago'], ['border-l-border', '🟡', 'Unusual AOV Increase', 'All Stores · AOV +22% today vs 30-day avg', 'Low', '4 hrs ago']].map(item => <article key={item[2]} className={`rounded-lg border border-border border-l-4 ${item[0]} bg-card p-4 shadow-sm`}><span className="text-lg">{item[1]}</span><h3 className="mt-2 font-bold">{item[2]}</h3><p className="mt-1 text-sm text-muted-foreground">{item[3]}</p><div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>Detected: {item[5]}</span><span className="severity medium">{item[4]}</span></div><button className="row-action mt-3 pl-0">Investigate</button><button className="row-action">Ask AI</button></article>)}</div><p className="mt-3 text-xs text-muted-foreground">Anomalies are AI-detected based on statistical deviation from connected platform data.</p></section>
      <div className="mb-7 grid gap-7 xl:grid-cols-2"><section className="panel"><header className="flex items-center justify-between"><h2 className="section-title">Store Health</h2><span className="severity medium">Attention Required</span></header><div className="mt-4 divide-y divide-border">{[['Revenue Trend', 'Healthy', 'green'], ['Order Trend', 'Healthy', 'green'], ['Customer Trend', 'Healthy', 'green'], ['Conversion Availability', 'Healthy', 'green'], ['Data Freshness', 'Attention Required', 'amber'], ['Integration Status', 'Healthy', 'green'], ['Refund Rate', 'Attention Required · Ultra-Firm spike', 'amber'], ['Performance Anomalies', '3 detected', 'amber']].map(item => <div key={item[0]} className="flex items-center justify-between py-2.5 text-sm"><span>{item[0]}</span><span className={item[2] === 'green' ? 'status healthy' : 'status attention'}>{item[2] === 'green' ? <CircleCheck className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}{item[1]}</span></div>)}</div><p className="mt-3 text-xs text-muted-foreground">Ecommerce operational performance health — not the overall Business Health score.</p></section><section className="panel"><h2 className="section-title">Data Freshness</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground"><tr><th className="py-3">Store</th><th>Platform</th><th>Last Sync</th><th>Orders</th><th>Status</th></tr></thead><tbody className="divide-y divide-border"><tr><td className="py-3 font-semibold">Lulu Store</td><td>Shopify</td><td>3 min ago</td><td>1,284</td><td className="text-foreground">Up to date ✓</td></tr><tr><td className="py-3 font-semibold">Lulu WooCommerce</td><td>WooCommerce</td><td>Syncing…</td><td>—</td><td className="text-foreground">Syncing ⟳</td></tr></tbody></table></div><div className="mt-5 flex flex-wrap gap-2"><button className="secondary-btn text-xs">View Sync Details</button><button className="secondary-btn text-xs">Retry Sync</button><button className="secondary-btn text-xs">Open Integrations</button></div></section></div>
      <section className="panel mb-7"><header className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Store Performance Forecast <span className="ai-badge">✦ AI Forecast</span></h2><p className="mt-1 text-xs text-muted-foreground">Historical revenue and projected next 30 days</p></div><span className="severity medium">● Medium confidence</span></header><div className="mt-5 grid gap-6 lg:grid-cols-[1fr_300px]"><div><svg viewBox="0 0 520 160" className="h-48 w-full rounded-md bg-card p-2" preserveAspectRatio="none" aria-label="Ninety day historical revenue and thirty day forecast"><path d="M0 140H520 M0 100H520 M0 60H520 M0 20H520" stroke="var(--border)" /><polygon points="365,54 400,45 440,51 480,30 520,38 520,78 480,69 440,89 400,75 365,86" fill="var(--chart-3)" opacity=".3" /><polyline points="0,135 35,129 70,133 105,113 140,121 175,95 210,103 245,78 280,85 315,62 350,68 385,52" fill="none" stroke="var(--foreground)" strokeWidth="3" /><polyline points="385,52 420,60 455,45 490,50 520,32" fill="none" stroke="var(--foreground)" strokeWidth="3" strokeDasharray="7 5" /></svg><p className="mt-2 text-xs text-muted-foreground">Solid: observed history · Dashed: AI forecast with confidence band</p></div><div className="grid grid-cols-2 gap-4 text-sm"><div><span className="text-xs text-muted-foreground">Forecast Revenue</span><strong className="block">$298k – $318k</strong></div><div><span className="text-xs text-muted-foreground">Forecast Orders</span><strong className="block">1,920 – 2,050</strong></div><div><span className="text-xs text-muted-foreground">Expected Growth</span><strong className="block text-foreground">+8% – +14%</strong></div><div><span className="text-xs text-muted-foreground">Confidence</span><strong className="block text-foreground">Medium</strong></div></div></div><p className="mt-4 text-xs text-muted-foreground">AI Forecast — Based on connected platform historical data. Not a guaranteed outcome. Confidence: Medium.</p></section>
      <section className="ai-panel mb-7"><header className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary"><Sparkles className="h-5 w-5" /></span><div className="flex-1"><h2 className="text-xl font-bold">Ask Lulu AI <span className="ai-badge bg-secondary text-foreground">AI Assistant</span></h2><p className="mt-1 text-sm text-foreground">Turn store signals into your next best decision.</p><div className="mt-5 rounded-lg bg-secondary p-4 text-sm text-foreground"><strong>AI Insight</strong> · <em>AI-generated</em><p className="mt-2">Revenue increased 18% compared with the previous period, primarily driven by higher order volume (+12%) and improved AOV (+5%). Serums &amp; Treatments contributed the largest share of growth. One anomaly requires attention: unusual refund activity on Ultra-Firm Body Lotion.</p><div className="mt-3 flex flex-wrap gap-2">{['Revenue +18%', 'Orders +12%', 'AOV +5%', 'Top category: Serums', '1 anomaly'].map(item => <span key={item} className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs">{item}</span>)}</div></div><label className="mt-4 flex items-center gap-3 rounded-lg bg-card p-3 text-muted-foreground"><Bot className="h-5 w-5 text-muted-foreground" /><input aria-label="Ask Lulu AI" className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Ask Lulu AI about store performance…" value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => {
                  if (e.key === 'Enter') setAsked(true);
                }} /><button type="button" onClick={() => setAsked(true)} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Send className="h-4 w-4" /></button></label>{asked ? <p className="mt-2 text-sm text-foreground">Thanks — Lulu AI is preparing a grounded answer from your connected store data.</p> : null}<div className="mt-4 flex gap-2 overflow-x-auto pb-1">{prompts.map(prompt => <button key={prompt} onClick={() => setQuestion(prompt)} className="whitespace-nowrap rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-foreground hover:bg-secondary">{prompt}</button>)}</div><div className="mt-6 rounded-lg border border-border bg-primary/10 p-4"><h3 className="font-semibold">AI Recommendations <span className="text-xs font-normal text-foreground">· AI-generated</span></h3><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-foreground"><li>Review refund activity on Ultra-Firm Body Lotion — spike may indicate a product quality issue.</li><li>Investigate WooCommerce checkout conversion drop — possible checkout flow issue.</li><li>Brightening Eye Cream revenue declining — review product positioning or pricing.</li></ol><p className="mt-4 text-xs text-foreground">Clearly labeled AI Recommendation. Review before acting. Lulu AI does not automatically execute business changes.</p></div></div></header></section>
      <section className="panel mb-7"><header className="flex items-center justify-between"><h2 className="section-title">Store Activity</h2><button className="text-sm font-semibold text-foreground">View All</button></header><div className="mt-3 divide-y divide-border">{activities.map(item => <div key={item[1]} className="flex gap-3 py-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-sm">{item[0]}</span><div><p className="text-sm"><strong>{item[1]}</strong> <span className="text-muted-foreground">— {item[2]}</span></p><p className="mt-1 text-xs text-muted-foreground">{item[3]}</p></div></div>)}</div></section>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">Observed platform data, calculated metrics, and AI insights are clearly labeled. Live values appear when connected records are available.</footer>
    </div></div>
  </main>;
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
