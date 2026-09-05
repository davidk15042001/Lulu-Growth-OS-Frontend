import { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Download, Plus, RefreshCw, Search, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Kpi = {
  label: string;
  value: string;
  prev: string;
  delta: string;
  pct: string;
  good: boolean;
  spark: string;
};
type Platform = {
  name: string;
  color: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  conversions: string;
  cpa: string;
  revenue: string;
  roas: string;
};
const platforms: Platform[] = []; /* Live advertising records populate this list when a paid-media connection is available. */

const kpis: Kpi[] = [];
const campaigns: string[] = [];
const audiences: string[] = [];
const funnel: any[][] = [];
function Sparkline({
  path,
  color = 'var(--chart-1)'
}: {
  path: string;
  color?: string;
}) {
  return <svg viewBox="0 0 90 34" aria-label="Trend sparkline" role="img" className="spark"><path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" /></svg>;
}
function Panel({
  title,
  children,
  className = ''
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`panel ${className}`}><div className="panel-head"><h2>{title}</h2><button className="icon-btn" aria-label={`More options for ${title}`}><SlidersHorizontal size={15} /></button></div>{children}</section>;
}
function Bars({
  items,
  color = 'var(--foreground)'
}: {
  items: {
    label: string;
    value: number;
    display?: string;
    color?: string;
  }[];
  color?: string;
}) {
  return <div className="bars">{items.map(item => <div className="bar-row" key={item.label}><span>{item.label}</span><div className="bar-track"><i style={{
          width: `${item.value}%`,
          background: item.color || color
        }} /></div><b>{item.display || `${item.value}%`}</b></div>)}</div>;
}
function LineChart({
  green: _green = false
}: {
  green?: boolean;
}) {
  return <div className="chart flex min-h-[190px] items-center justify-center text-sm text-muted-foreground" role="status">Advertising trend appears when live campaign data is available.</div>;
}
function Donut({
  label = '—'
}: {
  label?: string;
}) {
  return <div className="donut-wrap"><div className="donut"><div><strong>{label}</strong><small>Total</small></div></div></div>;
}
function Gauge({
  value = '—',
  score = 0
}: {
  value?: string;
  score?: number;
}) {
  return <div className="gauge-wrap"><div className="gauge"><div className="gauge-inner"><strong>{value}</strong><small>{score === 74 ? 'Good' : 'ROAS'}</small></div></div></div>;
}
export function LuluAdvertising() {
  const { items: advertisingRecords, loading: advertisingLoading, error: advertisingError } = useLiveRecords('ad_campaigns');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [model, setModel] = useState('Last Touch');
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [ask, setAsk] = useState('');
  const toggle = (name: string) => setExpanded(expanded === name ? null : name);
  if (advertisingLoading) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live advertising data…</main>;
  if (advertisingError) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{advertisingError}</main>;
  if (advertisingRecords.length === 0) return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-border bg-card p-8 text-center"><Sparkles className="mx-auto mb-4 text-muted-foreground" size={28} /><h1 className="text-2xl font-semibold">Advertising</h1><p className="mt-3 text-sm text-muted-foreground">No live advertising data is available yet. Connect a verified advertising platform before reviewing spend, ROAS or conversion metrics.</p></div></main>;
  return <div className="flex min-h-screen bg-[var(--background)]"><aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-hidden border-r border-border bg-[var(--sidebar)] p-4 lg:flex"><div className="mb-5 flex items-center gap-3 px-2 py-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</div><span className="font-semibold text-foreground">Lulu AI</span></div><LuluSectionNavigation activeId="sharply-wood-4560" /></aside><div className="min-w-0 flex-1"><main className="dashboard">
    <style>{styles}</style>
    <header className="header"><div><nav className="crumb">Intelligence <span>/</span> Business Intelligence <span>/</span> Advertising</nav><h1>Advertising</h1><p>Understand advertising spend, performance, conversions and revenue across every connected paid media platform.</p></div><div className="actions"><span className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">Use Update in the navigation bar</span><button><Plus size={14} /> Create Report</button><button><Download size={14} /> Export</button></div></header>
    {error && <div className="alert error"><X size={16} /> Advertising analysis couldn’t be loaded <button onClick={() => setError(false)}>Try Again</button></div>}
    <div className="filters"><button>Date Range <b>Live records</b><ChevronDown size={14} /></button><span className="vs">vs</span><button><b>Live comparison</b><ChevronDown size={14} /></button><i></i><button><b>Connected platforms</b><ChevronDown size={14} /></button><button>Accounts <b>Connected accounts</b><ChevronDown size={14} /></button><small>Live status</small></div>
    <div className="section"><label className="eyebrow">Advertising Overview</label><div className="kpi-grid">{kpis.map(k => <article className="kpi" key={k.label}><span className="eyebrow">{k.label}</span><strong>{k.value}</strong><small>vs previous {k.prev}</small><div className="kpi-bottom"><b className={k.good ? 'positive' : 'negative'}>{k.good ? <ArrowUp size={13} /> : <ArrowDown size={13} />} {k.delta} <span>{k.pct}</span></b><span className="coverage">4 platforms</span></div><Sparkline path={k.spark} /></article>)}</div></div>
    <Panel title="Advertising Performance Score" className="score-panel"><div className="score-content"><div className="score-left"><div className="score-gauge"><div><strong>—</strong><small>Live</small></div></div><b>Awaiting live data</b><span>AI assessment appears after connected advertising records are available.</span></div><div className="score-breakdown"><div className="py-6 text-sm text-muted-foreground">Live advertising metrics will appear here after a connection is available.</div></div><small className="disclaimer">⚠ AI-generated performance assessment — not an objective financial measure</small></div></Panel>
    <div className="two-col"><Panel title="Advertising Spend Trend"><LineChart /><div className="chart-meta"><div className="legend"><span className="amber-dot" />Current period <span className="gray-line" />Previous period</div><div className="segmented"><button>Daily</button><button>Weekly</button><button>Monthly</button></div></div><Bars items={platforms.map(p => ({
              label: p.name,
              value: Math.round(parseInt(p.spend.replace(/[$,]/g, '')) / 2847),
              display: p.spend,
              color: p.color
            }))} /></Panel><Panel title="Impression Trend"><LineChart green /><div className="chart-meta"><span className="legend"><span className="green-dot" />Current period</span><span className="muted">Daily impressions</span></div><Bars items={platforms.map(p => ({
              label: p.name,
              value: [46, 35, 12, 7][platforms.indexOf(p)],
              display: p.impressions,
              color: p.color
            }))} color="var(--chart-4)" /></Panel></div>
    <div className="two-col"><Panel title="Advertising Reach"><Donut /><p className="formula">Reach = unique users. Impressions = total ad views.</p><div className="mini-table">{platforms.map(p => <div key={p.name}><span><i style={{
                    background: p.color
                  }} />{p.name}</span><b>{['14.8M', '10.2M', '3.8M', '2.6M'][platforms.indexOf(p)]}</b></div>)}</div></Panel><Panel title="Advertising Frequency"><div className="frequency"><div className="frequency-gauge"><strong>1.53×</strong><span>Average</span></div><Bars items={[{
                label: 'Google',
                value: 70,
                display: '1.41×',
                color: 'var(--foreground)'
              }, {
                label: 'Meta',
                value: 84,
                display: '1.68×',
                color: 'var(--foreground)'
              }, {
                label: 'LinkedIn',
                value: 65,
                display: '1.29×',
                color: 'var(--foreground)'
              }, {
                label: 'TikTok',
                value: 91,
                display: '1.82×',
                color: 'var(--foreground)'
              }]} /></div><p className="formula">Frequency = Impressions ÷ Reach (calculated)</p></Panel></div>
    <div className="three-col"><Panel title="Click Performance"><strong className="big-number">1,284,600</strong><b className="positive">↑ —</b><Bars items={[{
              label: 'Google',
              value: 100,
              display: '680.2K',
              color: 'var(--foreground)'
            }, {
              label: 'Meta',
              value: 57,
              display: '388.1K',
              color: 'var(--foreground)'
            }, {
              label: 'LinkedIn',
              value: 21,
              display: '142.8K',
              color: 'var(--foreground)'
            }, {
              label: 'TikTok',
              value: 11,
              display: '73.5K',
              color: 'var(--foreground)'
            }]} /></Panel><Panel title="CTR"><strong className="big-number">—</strong><b className="positive">↑ 0.2pp</b><Bars items={[{
              label: 'Google',
              value: 100,
              display: '3.04%',
              color: 'var(--foreground)'
            }, {
              label: 'Meta',
              value: 76,
              display: '2.31%',
              color: 'var(--foreground)'
            }, {
              label: 'LinkedIn',
              value: 84,
              display: '2.55%',
              color: 'var(--foreground)'
            }, {
              label: 'TikTok',
              value: 71,
              display: '2.16%',
              color: 'var(--foreground)'
            }]} /><p className="formula">CTR = Clicks ÷ Impressions</p></Panel><Panel title="CPC & CPM"><div className="metric-pair"><strong>—<small>CPC</small></strong><strong>—<small>CPM</small></strong></div><LineChart green /><p className="formula">CPC = Spend ÷ Clicks · CPM = Spend ÷ Impressions × 1,000</p></Panel></div>
    <div className="four-col">{[['Conversions', '42,840', '+10.1%'], ['Conversion Rate', '3.34%', '+0.3pp'], ['CPA', '—', '-4.8%'], ['CAC', '—', '-5.2%']].map(item => <Panel title={item[0]} key={item[0]}><strong className="big-number">{item[1]}</strong><b className="positive">↑ {item[2]}</b><Donut label={item[0] === 'Conversions' ? '42.8K' : item[1]} /><p className="formula">{item[0] === 'CAC' ? 'Only shown where actual customer records are linked.' : item[0] === 'CPA' ? 'Cost per acquisition event — not to be confused with CAC' : 'Calculated from connected platform events'}</p></Panel>)}</div>
    <div className="three-col"><Panel title="Advertising Revenue"><strong className="big-number">—</strong><LineChart green /><div className="badge">Last Touch Attribution</div><Bars items={platforms.map(p => ({
              label: p.name,
              value: [63, 27, 6, 5][platforms.indexOf(p)],
              display: p.revenue,
              color: p.color
            }))} /></Panel><Panel title="ROAS"><Gauge /><Bars items={platforms.map(p => ({
              label: p.name,
              value: [100, 72, 38, 58][platforms.indexOf(p)],
              display: p.roas,
              color: p.color
            }))} /><p className="formula">ROAS = Attributed Revenue ÷ Ad Spend. ROAS ≠ Profit.</p></Panel><Panel title="Advertising Profitability"><div className="profit-list"><p>Revenue <b>—</b></p><p>Ad Spend <b>—</b></p><p>Gross Margin Contribution <b>—</b></p><p>Contribution after Spend <b className="positive">—</b></p></div><div className="callout">ROAS ≠ Profitability</div></Panel></div>
    <Panel title="Platform Performance"><div className="table-scroll"><table><thead><tr>{['Platform', 'Spend', 'Impressions', 'Clicks', 'CTR', 'CPC', 'Conversions', 'CPA', 'Revenue', 'ROAS'].map(h => <th key={h}>{h} ↕</th>)}</tr></thead><tbody>{platforms.map(p => <tr key={p.name}><td><i className="platform-dot" style={{
                      background: p.color
                    }} />{p.name}</td><td>{p.spend}</td><td>{p.impressions}</td><td>{p.clicks}</td><td>{p.ctr}</td><td>{p.cpc}</td><td>{p.conversions}</td><td>{p.cpa}</td><td>{p.revenue}</td><td className={parseFloat(p.roas) > 5 ? 'positive' : 'amber'}>{p.roas}</td></tr>)}</tbody></table></div></Panel>
    <Panel title="Campaign Performance"><div className="table-tools"><label><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search campaigns" /></label><button>All Platforms <ChevronDown size={14} /></button><button>Campaign type <ChevronDown size={14} /></button></div><div className="table-scroll"><table><thead><tr>{['Platform', 'Account', 'Campaign', 'Spend', 'Impressions', 'Reach', 'Clicks', 'CTR', 'CPC', 'Conversions', 'CPA', 'Revenue', 'ROAS'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{campaigns.filter(c => c.toLowerCase().includes(query.toLowerCase())).map((c, i) => <tr key={c}><td><i className="platform-dot" style={{
                      background: platforms[i % 4].color
                    }} />{platforms[i % 4].name.replace(' Ads', '')}</td><td>{i % 2 ? 'Lulu Growth' : 'Lulu Main'}</td><td>{c}</td><td>{['—', '—', '—', '—', '—', '—', '—', '—'][i]}</td><td>{['8.4M', '6.1M', '5.8M', '4.2M', '3.6M', '3.1M', '2.8M', '2.2M'][i]}</td><td>{['5.9M', '4.3M', '3.8M', '3.0M', '2.4M', '2.1M', '1.8M', '1.5M'][i]}</td><td>{['214K', '168K', '142K', '128K', '96K', '88K', '71K', '65K'][i]}</td><td>{['—', '2.76%', '2.44%', '3.05%', '2.66%', '2.84%', '2.53%', '2.95%'][i]}</td><td>—</td><td>{['6,420', '5,100', '4,800', '3,940', '3,180', '2,840', '2,210', '1,980'][i]}</td><td>—</td><td>—</td><td className="positive">{['8.20×', '5.90×', '5.20×', '4.81×', '4.10×', '5.30×', '4.40×', '6.10×'][i]}</td></tr>)}</tbody></table></div><div className="pagination">Showing 1–8 of 47 campaigns <span>‹ <b>1</b> 2 3 … 6 ›</span></div></Panel>
    {['Ad Group & Ad Set Performance', 'Placement Performance', 'Advertising Product Performance'].map(name => <section className="collapsible" key={name}><button onClick={() => toggle(name)}><h2>{name}</h2>{expanded === name ? <ChevronDown /> : <ChevronRight />}</button>{expanded === name && <div className="collapsed-body"><p className="muted">Detailed performance data is available at this level.</p><Bars items={[{
              label: 'Core intent',
              value: 84,
              display: 'High efficiency'
            }, {
              label: 'Brand reach',
              value: 68,
              display: 'Growing'
            }, {
              label: 'Retargeting',
              value: 52,
              display: 'Monitor'
            }]} /></div>}</section>)}
    <Panel title="Ad & Creative Performance"><div className="table-scroll"><table><thead><tr>{['Platform', 'Campaign', 'Ad', 'Format', 'Impressions', 'Reach', 'Clicks', 'CTR', 'Spend', 'Conversions', 'CPA', 'Revenue', 'ROAS'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{['Spring hero — blue', 'Founder story — 30s', 'Customer proof — carousel', 'Search text — enterprise'].map((ad, i) => <tr key={ad}><td>{platforms[i].name.replace(' Ads', '')}</td><td>{campaigns[i]}</td><td>{ad}</td><td><span className="badge">{['Image', 'Video', 'Carousel', 'Search Text'][i]}</span></td><td>{['2.4M', '1.8M', '1.2M', '980K'][i]}</td><td>1.5M</td><td>84K</td><td>—</td><td>—</td><td>2,840</td><td>—</td><td>—</td><td className="positive">5.65×</td></tr>)}</tbody></table></div></Panel>
    <Panel title="Audience Performance"><div className="table-scroll"><table><thead><tr>{['Platform', 'Audience', 'Reach', 'Impressions', 'Frequency', 'Clicks', 'CTR', 'Conversions', 'CPA', 'Revenue', 'ROAS'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{audiences.map((a, i) => <tr key={a}><td>{platforms[i % 4].name.replace(' Ads', '')}</td><td>{a}</td><td>6.2M</td><td>9.4M</td><td>1.53×</td><td>248K</td><td>—</td><td>8,420</td><td>—</td><td>—</td><td className="positive">6.47×</td></tr>)}</tbody></table></div></Panel>
    <div className="two-col"><Panel title="Device Performance"><Donut label="68%" /><div className="mini-table">{['Desktop', 'Mobile', 'Tablet', 'Other'].map((d, i) => <div key={d}><span>{d}</span><b>{[68, 27, 4, 1][i]}%</b></div>)}</div></Panel><Panel title="Geographic Performance"><div className="geo"><svg viewBox="0 0 500 190" aria-label="Simplified world map" role="img"><path d="M25 67l39-23 33 8 24-20 48 8 21 27 47-8 37 16 58-13 50 17 66-4 48 27-27 24-51-8-39 23-58-8-45 26-43-18-40 12-50-26-48 8-34-20z" fill="var(--muted-foreground)" stroke="var(--muted-foreground)" strokeWidth="1" /><path d="M106 75l42-16 22 15-17 29-39 5zM276 72l42-12 18 18-19 24-40-7zM374 86l31-9 31 20-34 16z" fill="var(--chart-1)" opacity=".8" /></svg></div><div className="ranked">{['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'].map((c, i) => <div key={c}><b>{i + 1}</b><span>{c}</span><strong>{['—', '—', '—', '—', '—'][i]}</strong><em>{['8.20×', '6.42×', '5.91×', '5.20×', '4.88×'][i]}</em></div>)}</div></Panel></div>
    <Panel title="Workspacegraphic Performance"><div className="tabs"><button>Age</button><button>Gender</button><button>Seniority</button><button>Industry</button></div><Bars items={[{
            label: '18–24',
            value: 38,
            display: '12%'
          }, {
            label: '25–34',
            value: 86,
            display: '28%'
          }, {
            label: '35–44',
            value: 100,
            display: '33%'
          }, {
            label: '45–54',
            value: 70,
            display: '19%'
          }, {
            label: '55+',
            value: 30,
            display: '8%'
          }]} /><p className="formula">Only showing dimensions available from connected platforms.</p></Panel>
    <Panel title="Search Performance"><div className="google-note">Google Ads — Search Performance</div><div className="two-col nested"><div><h3>Keywords</h3><div className="mini-table">{['business operating system', 'advertising intelligence', 'marketing analytics'].map((x, i) => <div key={x}><span>{x}</span><b>{['8.2×', '7.4×', '6.1×'][i]}</b></div>)}</div></div><div><h3>Search Terms</h3><div className="mini-table">{['lulu business software', 'best ad reporting tool', 'enterprise campaign insights'].map(x => <div key={x}><span>{x}</span><span className="badge">Broad</span></div>)}</div></div></div><p className="formula">Keyword ≠ Search Term — keywords trigger ads; search terms are actual user queries.</p></Panel>
    <Panel title="Advertising Funnel"><div className="funnel">{funnel.map((f, i) => <div className="funnel-row" key={f[0]}><strong style={{
                width: `${100 - i * 10}%`,
                background: i > 4 ? 'var(--primary)' : 'var(--primary)'
              }}>{f[0]} <span>{f[1]}</span></strong><small>{f[2]}</small></div>)}</div></Panel>
    <div className="two-col"><Panel title="Advertising Attribution"><div className="tabs model-tabs">{['First Touch', 'Last Touch', 'Linear', 'Position Based', 'Time Decay', 'Data-Driven'].map(m => <button className={model === m ? 'active' : ''} onClick={() => setModel(m)} key={m}>{m}{m === 'Last Touch' && ' ✓'}</button>)}</div><div className="attribution"><strong>42,840</strong><span>Attributed conversions</span><strong>—</strong><span>Attributed revenue</span></div><p className="formula">Attribution shows correlation, not causation.</p></Panel><Panel title="Cross-Platform Attribution"><div className="mini-table">{platforms.map(p => <div key={p.name}><span><i style={{
                    background: p.color
                  }} />{p.name.replace(' Ads', '')}</span><b>{p.conversions} → {['20,912', '10,142', '3,710', '1,982'][platforms.indexOf(p)]}</b></div>)}</div><div className="callout">Platforms may count the same conversion — total platform-reported conversions will exceed Lulu AI unified attributed total.</div></Panel></div>
    <Panel title="Advertising Budget"><div className="budget-grid">{platforms.map((p, i) => <div className="budget" key={p.name}><h3><i style={{
                  background: p.color
                }} />{p.name}</h3><div><span>Budget</span><b>{['—', '—', '—', '—'][i]}</b></div><div><span>Spend</span><b>{p.spend}</b></div><div className="util"><i style={{
                  width: `${[89, 94, 95, 91][i]}%`
                }} /></div><small>{[89, 94, 95, 91][i]}% utilized · <span className="amber">{i > 0 ? 'Near Limit' : 'On Budget'}</span></small></div>)}</div><p className="formula">Budgets are read-only here. Edit budgets in Advertising module.</p></Panel>
    <div className="three-col"><Panel title="Spend Allocation"><Donut label="100%" /><div className="tabs"><button>Platform</button><button>Campaign</button><button>Market</button></div></Panel><Panel title="Advertising Targets"><Bars items={[{
              label: 'Revenue',
              value: 92,
              display: '92%'
            }, {
              label: 'ROAS',
              value: 92,
              display: '92%'
            }, {
              label: 'CPA',
              value: 95,
              display: '95%'
            }, {
              label: 'CAC',
              value: 86,
              display: '86%'
            }, {
              label: 'Conversions',
              value: 88,
              display: '88%'
            }, {
              label: 'Spend',
              value: 91,
              display: '91%'
            }]} /><p className="formula">Targets are defined by your organization — not set automatically.</p></Panel><Panel title="Advertising Gap"><div className="mini-table">{['Revenue', 'ROAS', 'CPA', 'CAC'].map((x, i) => <div key={x}><span>{x}</span><span className={i < 2 ? 'amber' : 'positive'}>{i < 2 ? 'On Track' : 'Ahead'}</span></div>)}</div></Panel></div>
    <Panel title="Advertising Benchmark"><div className="benchmark"><div className="bench-head"><span>Metric</span><span>Your Performance</span><span>Internal Benchmark</span><span>Industry Benchmark</span></div>{[['CTR', '2.66%', '2.4%', '2.1%'], ['CPC', '—', '—', '—'], ['CPM', '—', '—', '—'], ['CPA', '—', '—', '—'], ['ROAS', '6.47×', '5.8×', '4.9×'], ['Conversion Rate', '3.34%', '3.0%', '2.7%']].map(r => <div className="bench-head" key={r[0]}><b>{r[0]}</b><strong>{r[1]}</strong><span>{r[2]}</span><span>{r[3]}</span></div>)}</div></Panel>
    <Panel title="Advertising Trends"><div className="chips">{['Spend', 'CTR', 'CPC', 'Conversions', 'ROAS', 'Revenue', 'CAC'].map(x => <button key={x} className={x === 'Spend' ? 'active' : ''}>{x}</button>)}</div><LineChart green /></Panel>
    <Panel title="Advertising Anomalies"><div className="table-scroll"><table><thead><tr>{['Metric', 'Platform', 'Campaign', 'Date', 'Observed', 'Expected Range', 'Difference', ''].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{[['Spend', 'Google Ads', 'Competitor Keywords', 'Not available', '—/day', '—–6K/day', '+52%'], ['ROAS', 'Meta Ads', 'Product Launch — Spring', 'Not available', '3.1×', '4.5–6.5×', '-32%'], ['CPA', 'TikTok Ads', 'TikTok Gen Z — App', 'Not available', '—', '—–11', '—']].map(r => <tr key={r[2]}>{r.map((x, i) => <td key={x} className={i === 6 ? 'negative' : ''}>{x}</td>)}<td><button className="link">View</button></td></tr>)}</tbody></table></div><button className="link">→ View all anomalies in Anomalies module</button></Panel>
    <Panel title="Advertising Data Health"><div className="health-grid">{platforms.map(p => <div className="health" key={p.name}><h3><i style={{
                  background: p.color
                }} />{p.name}<span className="status">Connected ✓</span></h3><p>Last sync: 2 min ago</p><p>Coverage: Not available – present</p><p>Missing periods: None</p><small>Available metrics: Spend · Clicks · Conversions · Revenue · ROAS</small></div>)}</div><p className="formula">To manage platform connections, visit Ad Accounts & Platform Management →</p></Panel>
    <Panel title="Key Advertising KPIs"><div className="key-grid">{['Spend', '—', 'Impressions', '48.2M', 'Reach', '31.4M', 'Clicks', '1.28M', 'CTR', '2.66%', 'CPC', '—', 'CPM', '—', 'Conversions', '42,840', 'Conversion Rate', '3.34%', 'CPA', '—', 'CAC', '—', 'Revenue', '—', 'ROAS', '6.47×', 'Profitability', '—'].reduce((acc, x, i, arr) => i % 2 === 0 ? [...acc, {
              label: x,
              value: arr[i + 1]
            }] : acc, [] as {
              label: string;
              value: string;
            }[]).map(k => <div key={k.label}><span>{k.label}</span><strong>{k.value}</strong><b className="positive">—</b><Sparkline path="M2 24 L18 20 L34 23 L50 12 L66 15 L88 5" /></div>)}</div><button className="link">→ Open KPI Explorer</button></Panel>
    <Panel title="Explain Advertising Performance" className="explain"><span className="ai-badge">✦ AI Assessment</span><ul><li>Spend increased — driven primarily by Google Ads (+—).</li><li>ROAS essentially flat at 6.47× vs 6.48× prior period.</li><li>Meta Ads conversion rate improved +0.3pp.</li><li>TikTok CAC remains highest at — CPA.</li><li>LinkedIn generated highest-quality leads by revenue per conversion.</li></ul><p>If you want recommendations → <button className="link">View AI Recommendations</button></p></Panel>
    
    <footer>Data Sources: Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads <span>·</span> Last updated: 2 min ago <span>·</span> Attribution: Last Touch <span>·</span> Currency: USD</footer>
  </main></div></div>;
}
const styles = `
:root{--black:var(--background);--panel:var(--card);--edge:var(--border);--text:var(--foreground);--muted:var(--muted-foreground);--amber:var(--chart-1);--green:var(--chart-4);--red:var(--chart-5)}*{box-sizing:border-box}body{background:var(--black)!important;color:var(--text)!important;font-family:Inter,Arial,sans-serif!important}.dashboard{max-width:1440px;margin:auto;padding:28px 32px 56px;overflow-x:hidden;background:var(--black);min-height:100vh}.header{display:flex;justify-content:space-between;gap:24px;padding-bottom:26px;border-bottom:1px solid var(--edge)}h1{font-size:28px;margin:15px 0 8px;letter-spacing:-.7px}.header p{color:var(--muted);font-size:14px;margin:0;max-width:680px}.crumb{font-size:12px;color:var(--muted)}.crumb span{margin:0 8px;color:var(--muted-foreground)}.actions{display:flex;align-items:flex-end;gap:8px}.actions button,.filters button,.segmented button,.tabs button,.chips button,.table-tools button{display:flex;align-items:center;gap:7px;border:1px solid var(--edge);background:var(--background);color:var(--text);border-radius:6px;padding:8px 11px;font-size:12px;white-space:nowrap}.actions button:hover,.filters button:hover,.tabs button:hover,.chips button:hover,.prompt-grid button:hover{border-color:var(--amber)}button{cursor:pointer;transition:.2s}button:focus-visible,input:focus-visible{outline:2px solid var(--amber);outline-offset:2px}.ask-btn{background:var(--primary)!important;color:var(--primary-foreground)!important;border-color:var(--primary)!important;font-weight:700}.alert{padding:10px 14px;border:1px solid var(--border);border-radius:6px;font-size:12px;margin:16px 0}.partial{color:var(--amber);background:var(--background)}.error{color:var(--chart-5);border-color:var(--chart-5);background:var(--background);display:flex;gap:10px;align-items:center}.error button{margin-left:auto;background:transparent;border:0;color:var(--text);text-decoration:underline}.filters{display:flex;align-items:center;gap:10px;background:var(--panel);border-bottom:1px solid var(--edge);padding:12px 14px;margin:0 -32px 26px}.filters button{background:transparent;border:0}.filters button b{font-weight:500}.filters i{height:24px;width:1px;background:var(--edge);margin:0 5px}.filters>small{margin-left:auto;color:var(--muted)}.vs{font-size:12px;color:var(--muted)}.dots{display:flex;gap:3px}.dots em,.platform-dot,.mini-table i,.health h3 i,.budget h3 i{width:7px;height:7px;border-radius:50%;display:inline-block}.section{padding:0 0 24px;border-bottom:1px solid var(--edge);margin-bottom:24px}.eyebrow{display:block;color:var(--muted);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.3px}.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:12px}.kpi,.panel,.collapsible,.ask-panel{background:var(--panel);border:1px solid var(--edge);border-radius:8px}.kpi{padding:15px;position:relative;min-height:142px}.kpi>strong{display:block;font-size:24px;margin:12px 0 5px;letter-spacing:-.5px}.kpi small{color:var(--muted);font-size:11px}.kpi-bottom{display:flex;justify-content:space-between;align-items:center;margin-top:12px}.positive{color:var(--green)!important}.negative{color:var(--red)!important}.positive,.negative{display:flex;align-items:center;gap:3px;font-size:12px}.positive span,.negative span{font-weight:500}.coverage,.badge,.ai-badge,.status{font-size:10px;color:var(--muted);border:1px solid var(--edge);border-radius:20px;padding:4px 7px}.spark{height:30px;width:86px;position:absolute;right:12px;bottom:11px}.panel{padding:17px;margin-bottom:24px;min-width:0}.panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}.panel h2,.collapsible h2,.ask-panel h2{font-size:18px;margin:0;font-weight:600;letter-spacing:-.2px}.icon-btn{color:var(--muted);background:transparent;border:0}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:24px}.three-col{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.four-col{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.score-content{display:grid;grid-template-columns:190px 1fr 260px;align-items:center;gap:26px}.score-left{text-align:center}.score-left>b{display:block;margin-top:8px;font-size:16px}.score-left>span{display:inline-block;margin-top:8px;color:var(--amber);font-size:10px}.score-gauge,.gauge{width:142px;height:142px;border-radius:50%;margin:auto;background:conic-gradient(var(--amber) 0 74%,var(--background) 74% 100%);display:grid;place-items:center}.score-gauge>div,.gauge-inner{width:112px;height:112px;background:var(--panel);border-radius:50%;display:grid;place-items:center;align-content:center}.score-gauge strong{font-size:38px}.score-gauge small,.gauge-inner small{color:var(--muted)}.score-breakdown{padding-right:22px}.bars{display:grid;gap:12px}.bar-row{display:grid;grid-template-columns:105px 1fr 58px;align-items:center;gap:10px;font-size:11px;color:var(--muted)}.bar-row b{color:var(--text);text-align:right;font-size:11px}.bar-track{height:6px;background:var(--background);border-radius:4px;overflow:hidden}.bar-track i{display:block;height:100%;border-radius:4px}.disclaimer,.formula{color:var(--muted);font-size:12px;line-height:1.5}.chart{width:100%;height:190px;display:block}.chart-meta{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--edge);padding:12px 0 16px}.legend{font-size:11px;color:var(--muted);display:flex;align-items:center;gap:7px}.amber-dot,.green-dot,.gray-line{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--amber)}.green-dot{background:var(--green)}.gray-line{height:2px;width:15px;border-radius:0;background:var(--muted);margin-left:10px}.segmented button{padding:5px 8px}.segmented button:first-child,.tabs button.active,.chips button.active{background:var(--primary);color:var(--primary-foreground);border-color:var(--primary)}.donut-wrap{text-align:center;padding:4px}.donut{width:145px;height:145px;border-radius:50%;background:conic-gradient(var(--chart-3) 0 47%,var(--chart-3) 47% 79%,var(--chart-3) 79% 91%,var(--chart-5) 91%);display:grid;place-items:center;margin:4px auto 15px}.donut>div{width:106px;height:106px;background:var(--panel);border-radius:50%;display:grid;place-items:center;align-content:center}.donut strong{font-size:20px}.donut small{color:var(--muted);font-size:11px}.mini-table{display:grid;gap:0}.mini-table>div{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--edge);font-size:12px}.mini-table span{display:flex;align-items:center;gap:8px}.frequency{display:flex;gap:28px;align-items:center}.frequency-gauge{width:118px;height:118px;border:10px solid var(--muted-foreground);border-top-color:var(--amber);border-right-color:var(--amber);border-radius:50%;display:grid;place-items:center;align-content:center;flex-shrink:0}.frequency-gauge strong{font-size:23px}.frequency-gauge span{font-size:11px;color:var(--muted)}.big-number{display:block;font-size:24px;margin:4px 0 5px}.three-col .panel .bars{margin-top:21px}.metric-pair{display:flex;gap:30px;margin:10px 0 15px}.metric-pair strong{font-size:25px}.metric-pair small{display:block;color:var(--muted);font-size:11px;font-weight:500}.profit-list{display:grid;gap:9px}.profit-list p{display:flex;justify-content:space-between;border-bottom:1px solid var(--edge);padding-bottom:9px;margin:0;color:var(--muted);font-size:13px}.profit-list b{color:var(--text)}.callout,.google-note{padding:10px;margin-top:16px;background:var(--background);color:var(--amber);font-size:12px;border-left:2px solid var(--amber)}.table-scroll{overflow-x:auto}.table-scroll table{width:100%;border-collapse:collapse;min-width:980px}th{text-align:left;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.7px;font-weight:600;padding:9px 10px;border-bottom:1px solid var(--edge);white-space:nowrap}td{font-size:13px;padding:13px 10px;border-bottom:1px solid var(--edge);white-space:nowrap}td:first-child{font-weight:600}.platform-dot{margin-right:8px}.table-tools{display:flex;gap:8px;margin-bottom:13px}.table-tools label{display:flex;align-items:center;gap:8px;background:var(--background);border:1px solid var(--edge);padding:0 10px;border-radius:6px;width:280px;color:var(--muted)}input{border:0;background:transparent;color:var(--text);padding:9px 0;outline:0;width:100%}.pagination{display:flex;justify-content:space-between;color:var(--muted);font-size:12px;padding-top:14px}.pagination span{word-spacing:10px}.pagination b{color:var(--amber)}.link{border:0;background:transparent;color:var(--foreground);font-size:12px;padding:5px 0}.collapsible{margin-bottom:24px}.collapsible>button{width:100%;padding:17px;background:transparent;color:var(--text);border:0;display:flex;justify-content:space-between;text-align:left}.collapsed-body{padding:0 17px 17px}.nested{gap:40px}.nested .panel{border:0;padding:0;margin:0}.nested h3{font-size:13px;margin:0 0 8px}.geo svg{width:100%;height:190px}.ranked{display:grid;gap:7px}.ranked div{display:grid;grid-template-columns:20px 1fr 75px 45px;font-size:12px;color:var(--muted)}.ranked strong,.ranked em{color:var(--text);font-style:normal;text-align:right}.tabs,.chips{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:17px}.tabs button,.chips button{padding:6px 10px}.model-tabs button{font-size:11px}.attribution{display:grid;grid-template-columns:1fr 1fr;gap:7px 24px}.attribution strong{font-size:28px}.attribution span{color:var(--muted);font-size:11px}.funnel{display:grid;gap:7px;justify-items:center}.funnel-row{display:flex;align-items:center;gap:12px;width:100%;justify-content:center}.funnel-row strong{display:flex;justify-content:space-between;padding:11px 16px;border-radius:3px;color:var(--foreground);font-size:12px;transition:width .2s}.funnel-row small{width:70px;color:var(--muted);font-size:11px}.budget-grid,.health-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.budget,.health{border:1px solid var(--edge);padding:13px;border-radius:6px}.budget h3,.health h3{font-size:13px;margin:0 0 15px;display:flex;align-items:center;gap:7px}.budget>div{display:flex;justify-content:space-between;font-size:12px;margin:7px 0}.budget>div span,.health p,.health small{color:var(--muted)}.util{height:5px;background:var(--background);border-radius:4px;overflow:hidden}.util i{display:block;height:100%;background:var(--amber)}.budget small{color:var(--muted)}.amber{color:var(--amber)!important}.benchmark{display:grid}.bench-head{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;border-bottom:1px solid var(--edge);padding:11px 4px;font-size:12px;gap:10px}.bench-head:first-child{color:var(--muted);text-transform:uppercase;font-size:10px}.bench-head strong{color:var(--green)}.key-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}.key-grid>div{border:1px solid var(--edge);border-radius:5px;padding:10px;min-width:0}.key-grid span{display:block;color:var(--muted);font-size:10px;text-transform:uppercase}.key-grid strong{display:block;font-size:17px;margin:8px 0}.key-grid .spark{position:static;width:100%;height:20px}.explain{border-left:3px solid var(--border)}.ai-badge{display:inline-block;color:var(--foreground);border-color:var(--foreground);margin-bottom:10px}.explain ul{padding-left:20px;margin:4px 0 16px;display:grid;gap:10px;font-size:13px}.explain p{color:var(--muted);font-size:12px}.ask-panel{padding:28px;border-top:2px solid var(--border);margin-top:28px}.ask-panel h2{font-size:23px;margin:8px 0 18px}.ask-input{display:flex;gap:8px;border:1px solid var(--edge);background:var(--background);border-radius:7px;padding:4px 4px 4px 13px}.ask-input input{font-size:14px}.prompt-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}.prompt-grid button{background:transparent;border:1px solid var(--edge);border-radius:5px;color:var(--muted);padding:9px;font-size:11px;text-align:left}footer{padding-top:25px;color:var(--muted);font-size:11px;text-align:center}footer span{color:var(--muted-foreground);margin:0 8px}.muted{color:var(--muted)}
@media(max-width:1050px){.three-col{grid-template-columns:1fr 1fr}.four-col{grid-template-columns:1fr 1fr}.key-grid{grid-template-columns:repeat(4,1fr)}.score-content{grid-template-columns:180px 1fr}.disclaimer{grid-column:1/-1}.budget-grid,.health-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:720px){.dashboard{padding:20px 16px 40px}.header{display:block}.actions{margin-top:20px;flex-wrap:wrap}.filters{margin:0 -16px 20px;overflow-x:auto}.filters>small{display:none}.kpi-grid,.two-col,.three-col,.four-col{grid-template-columns:1fr}.score-content{display:block}.score-breakdown{margin-top:20px}.score-left{margin-bottom:18px}.key-grid{grid-template-columns:repeat(2,1fr)}.prompt-grid{grid-template-columns:1fr 1fr}.benchmark{min-width:620px}.budget-grid,.health-grid{grid-template-columns:1fr 1fr}.frequency{display:block}.frequency-gauge{margin:0 auto 20px}.table-tools{overflow-x:auto}.table-tools label{min-width:230px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
`;

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

