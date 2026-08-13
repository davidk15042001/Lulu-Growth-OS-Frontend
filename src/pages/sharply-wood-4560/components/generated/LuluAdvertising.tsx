import { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Download, Plus, RefreshCw, Search, Sparkles, SlidersHorizontal, X } from 'lucide-react';
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
const platforms: Platform[] = [{
  name: 'Google Ads',
  color: 'var(--foreground)',
  spend: '$142,300',
  impressions: '22.4M',
  clicks: '680,200',
  ctr: '3.04%',
  cpc: '$0.209',
  conversions: '24,600',
  cpa: '$5.79',
  revenue: '$1,167,300',
  roas: '8.20×'
}, {
  name: 'Meta Ads',
  color: 'var(--foreground)',
  spend: '$84,200',
  impressions: '16.8M',
  clicks: '388,100',
  ctr: '2.31%',
  cpc: '$0.217',
  conversions: '11,840',
  cpa: '$7.11',
  revenue: '$497,100',
  roas: '5.90×'
}, {
  name: 'LinkedIn Ads',
  color: 'var(--foreground)',
  spend: '$38,100',
  impressions: '5.6M',
  clicks: '142,800',
  ctr: '2.55%',
  cpc: '$0.267',
  conversions: '4,280',
  cpa: '$8.90',
  revenue: '$118,200',
  roas: '3.10×'
}, {
  name: 'TikTok Ads',
  color: 'var(--foreground)',
  spend: '$20,110',
  impressions: '3.4M',
  clicks: '73,500',
  ctr: '2.16%',
  cpc: '$0.274',
  conversions: '2,120',
  cpa: '$9.49',
  revenue: '$96,700',
  roas: '4.81×'
}];
const kpis: Kpi[] = [{
  label: 'Advertising Spend',
  value: '$284,710',
  prev: '$261,430',
  delta: '+$23,280',
  pct: '+8.9%',
  good: true,
  spark: 'M2 31 L14 25 L26 27 L38 19 L50 22 L62 13 L74 16 L88 5'
}, {
  label: 'Impressions',
  value: '48.2M',
  prev: '44.1M',
  delta: '+4.1M',
  pct: '+9.3%',
  good: true,
  spark: 'M2 28 L14 22 L26 24 L38 15 L50 19 L62 10 L74 13 L88 4'
}, {
  label: 'Reach',
  value: '31.4M',
  prev: '29.8M',
  delta: '+1.6M',
  pct: '+5.4%',
  good: true,
  spark: 'M2 27 L14 25 L26 20 L38 22 L50 14 L62 16 L74 8 L88 11'
}, {
  label: 'Clicks',
  value: '1,284,600',
  prev: '1,198,200',
  delta: '+86,400',
  pct: '+7.2%',
  good: true,
  spark: 'M2 28 L14 23 L26 26 L38 18 L50 20 L62 9 L74 15 L88 3'
}, {
  label: 'Conversions',
  value: '42,840',
  prev: '38,920',
  delta: '+3,920',
  pct: '+10.1%',
  good: true,
  spark: 'M2 30 L14 26 L26 21 L38 23 L50 14 L62 17 L74 8 L88 5'
}, {
  label: 'Revenue',
  value: '$1,842,300',
  prev: '$1,694,100',
  delta: '+$148,200',
  pct: '+8.7%',
  good: true,
  spark: 'M2 30 L14 27 L26 19 L38 22 L50 13 L62 15 L74 7 L88 3'
}, {
  label: 'ROAS',
  value: '6.47×',
  prev: '6.48×',
  delta: '-0.01',
  pct: '-0.2%',
  good: false,
  spark: 'M2 8 L14 12 L26 10 L38 17 L50 14 L62 19 L74 18 L88 24'
}, {
  label: 'CAC',
  value: '$47.20',
  prev: '$49.80',
  delta: '-$2.60',
  pct: '-5.2%',
  good: true,
  spark: 'M2 8 L14 11 L26 16 L38 12 L50 19 L62 17 L74 24 L88 26'
}];
const campaigns = ['Brand Awareness Q1', 'Product Launch — Spring', 'Retargeting — High Intent', 'Competitor Keywords', 'LinkedIn Enterprise Outreach', 'Meta Lookalike — Buyers', 'TikTok Gen Z — App', 'Google Shopping — Core Products'];
const audiences = ['In-Market: Business Software', 'Lookalike — Top Customers', 'Retargeting — Site Visitors 30d', 'LinkedIn: Director+', 'TikTok: 25-34 Tech Interest'];
const funnel = [['Impressions', '48,200,000', '100%'], ['Reach', '31,400,000', '65.1%'], ['Clicks', '1,284,600', '2.66%'], ['Landing Page Visits', '1,102,400', '85.8%'], ['Leads', '87,300', '7.9%'], ['Customers', '6,032', '6.9%'], ['Revenue', '$1,842,300', '$305 avg']];
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
  green = false
}: {
  green?: boolean;
}) {
  return <svg className="chart" viewBox="0 0 620 190" preserveAspectRatio="none" aria-label="30 day performance trend" role="img"><path d="M0 157 C36 142 50 153 78 122 S126 140 157 108 S203 125 235 91 S278 117 310 80 S355 105 390 66 S438 92 468 51 S520 72 550 40 S590 57 620 22 L620 190 L0 190 Z" fill={green ? 'rgba(0,0,0,.12)' : 'rgba(0,0,0,.16)'} /><path d="M0 157 C36 142 50 153 78 122 S126 140 157 108 S203 125 235 91 S278 117 310 80 S355 105 390 66 S438 92 468 51 S520 72 550 40 S590 57 620 22" fill="none" stroke={green ? 'var(--chart-4)' : 'var(--chart-1)'} strokeWidth="3" /><path d="M0 171 C45 164 68 175 102 148 S152 167 187 136 S239 150 274 123 S320 146 355 104 S402 133 445 93 S494 120 530 83 S570 101 620 70" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeDasharray="5 6" opacity=".7" /><line x1="0" y1="190" x2="620" y2="190" stroke="var(--muted-foreground)" /></svg>;
}
function Donut({
  label = '31.4M'
}: {
  label?: string;
}) {
  return <div className="donut-wrap"><div className="donut"><div><strong>{label}</strong><small>Total</small></div></div></div>;
}
function Gauge({
  value = '6.47×',
  score = 74
}: {
  value?: string;
  score?: number;
}) {
  return <div className="gauge-wrap"><div className="gauge"><div className="gauge-inner"><strong>{value}</strong><small>{score === 74 ? 'Good' : 'ROAS'}</small></div></div></div>;
}
export function LuluAdvertising() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [model, setModel] = useState('Last Touch');
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [ask, setAsk] = useState('');
  const toggle = (name: string) => setExpanded(expanded === name ? null : name);
  return <main className="dashboard">
    <style>{styles}</style>
    <header className="header"><div><nav className="crumb">Intelligence <span>/</span> Business Intelligence <span>/</span> Advertising</nav><h1>Advertising</h1><p>Understand advertising spend, performance, conversions and revenue across every connected paid media platform.</p></div><div className="actions"><button className="ask-btn"><Sparkles size={15} /> Ask Lulu AI</button><button><RefreshCw size={14} /> Refresh</button><button><Plus size={14} /> Create Report</button><button><Download size={14} /> Export</button></div></header>
    {error && <div className="alert error"><X size={16} /> Advertising analysis couldn’t be loaded <button onClick={() => setError(false)}>Try Again</button></div>}
    <div className="alert partial">⚠ Advertising analysis is based on partial data — LinkedIn Ads data unavailable for Jan 12–15.</div>
    <div className="filters"><button>Date Range <b>Last 30 Days</b><ChevronDown size={14} /></button><span className="vs">vs</span><button><b>Previous Period</b><ChevronDown size={14} /></button><i></i><button><span className="dots"><em style={{
            background: 'var(--primary)'
          }} /><em style={{
            background: 'var(--primary)'
          }} /><em style={{
            background: 'var(--primary)'
          }} /><em style={{
            background: 'var(--primary)'
          }} /></span><b>All Platforms</b><ChevronDown size={14} /></button><button>Accounts <b>All Accounts</b><ChevronDown size={14} /></button><small>Data as of 2 min ago</small></div>
    <div className="section"><label className="eyebrow">Advertising Overview</label><div className="kpi-grid">{kpis.map(k => <article className="kpi" key={k.label}><span className="eyebrow">{k.label}</span><strong>{k.value}</strong><small>vs previous {k.prev}</small><div className="kpi-bottom"><b className={k.good ? 'positive' : 'negative'}>{k.good ? <ArrowUp size={13} /> : <ArrowDown size={13} />} {k.delta} <span>{k.pct}</span></b><span className="coverage">4 platforms</span></div><Sparkline path={k.spark} /></article>)}</div></div>
    <Panel title="Advertising Performance Score" className="score-panel"><div className="score-content"><div className="score-left"><div className="score-gauge"><div><strong>74</strong><small>/100</small></div></div><b>Good</b><span>AI Assessment</span></div><div className="score-breakdown"><Bars items={[{
            label: 'ROAS',
            value: 82
          }, {
            label: 'Conversion Rate',
            value: 71
          }, {
            label: 'CTR',
            value: 68
          }, {
            label: 'CPC Efficiency',
            value: 76
          }, {
            label: 'CPM Efficiency',
            value: 69
          }, {
            label: 'CAC',
            value: 80
          }]} /></div><small className="disclaimer">⚠ AI-generated performance assessment — not an objective financial measure</small></div></Panel>
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
    <div className="three-col"><Panel title="Click Performance"><strong className="big-number">1,284,600</strong><b className="positive">↑ 7.2%</b><Bars items={[{
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
        }]} /></Panel><Panel title="CTR"><strong className="big-number">2.66%</strong><b className="positive">↑ 0.2pp</b><Bars items={[{
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
        }]} /><p className="formula">CTR = Clicks ÷ Impressions</p></Panel><Panel title="CPC & CPM"><div className="metric-pair"><strong>$0.222<small>CPC</small></strong><strong>$5.91<small>CPM</small></strong></div><LineChart green /><p className="formula">CPC = Spend ÷ Clicks · CPM = Spend ÷ Impressions × 1,000</p></Panel></div>
    <div className="four-col">{[['Conversions', '42,840', '+10.1%'], ['Conversion Rate', '3.34%', '+0.3pp'], ['CPA', '$6.65', '-4.8%'], ['CAC', '$47.20', '-5.2%']].map(item => <Panel title={item[0]} key={item[0]}><strong className="big-number">{item[1]}</strong><b className="positive">↑ {item[2]}</b><Donut label={item[0] === 'Conversions' ? '42.8K' : item[1]} /><p className="formula">{item[0] === 'CAC' ? 'Only shown where actual customer records are linked.' : item[0] === 'CPA' ? 'Cost per acquisition event — not to be confused with CAC' : 'Calculated from connected platform events'}</p></Panel>)}</div>
    <div className="three-col"><Panel title="Advertising Revenue"><strong className="big-number">$1,842,300</strong><LineChart green /><div className="badge">Last Touch Attribution</div><Bars items={platforms.map(p => ({
          label: p.name,
          value: [63, 27, 6, 5][platforms.indexOf(p)],
          display: p.revenue,
          color: p.color
        }))} /></Panel><Panel title="ROAS"><Gauge /><Bars items={platforms.map(p => ({
          label: p.name,
          value: [100, 72, 38, 58][platforms.indexOf(p)],
          display: p.roas,
          color: p.color
        }))} /><p className="formula">ROAS = Attributed Revenue ÷ Ad Spend. ROAS ≠ Profit.</p></Panel><Panel title="Advertising Profitability"><div className="profit-list"><p>Revenue <b>$1.84M</b></p><p>Ad Spend <b>$284K</b></p><p>Gross Margin Contribution <b>$1.22M</b></p><p>Contribution after Spend <b className="positive">$938K</b></p></div><div className="callout">ROAS ≠ Profitability</div></Panel></div>
    <Panel title="Platform Performance"><div className="table-scroll"><table><thead><tr>{['Platform', 'Spend', 'Impressions', 'Clicks', 'CTR', 'CPC', 'Conversions', 'CPA', 'Revenue', 'ROAS'].map(h => <th key={h}>{h} ↕</th>)}</tr></thead><tbody>{platforms.map(p => <tr key={p.name}><td><i className="platform-dot" style={{
                  background: p.color
                }} />{p.name}</td><td>{p.spend}</td><td>{p.impressions}</td><td>{p.clicks}</td><td>{p.ctr}</td><td>{p.cpc}</td><td>{p.conversions}</td><td>{p.cpa}</td><td>{p.revenue}</td><td className={parseFloat(p.roas) > 5 ? 'positive' : 'amber'}>{p.roas}</td></tr>)}</tbody></table></div></Panel>
    <Panel title="Campaign Performance"><div className="table-tools"><label><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search campaigns" /></label><button>All Platforms <ChevronDown size={14} /></button><button>Campaign type <ChevronDown size={14} /></button></div><div className="table-scroll"><table><thead><tr>{['Platform', 'Account', 'Campaign', 'Spend', 'Impressions', 'Reach', 'Clicks', 'CTR', 'CPC', 'Conversions', 'CPA', 'Revenue', 'ROAS'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{campaigns.filter(c => c.toLowerCase().includes(query.toLowerCase())).map((c, i) => <tr key={c}><td><i className="platform-dot" style={{
                  background: platforms[i % 4].color
                }} />{platforms[i % 4].name.replace(' Ads', '')}</td><td>{i % 2 ? 'Lulu Growth' : 'Lulu Main'}</td><td>{c}</td><td>{['$38,400', '$31,220', '$28,610', '$24,900', '$22,140', '$19,880', '$16,430', '$14,760'][i]}</td><td>{['8.4M', '6.1M', '5.8M', '4.2M', '3.6M', '3.1M', '2.8M', '2.2M'][i]}</td><td>{['5.9M', '4.3M', '3.8M', '3.0M', '2.4M', '2.1M', '1.8M', '1.5M'][i]}</td><td>{['214K', '168K', '142K', '128K', '96K', '88K', '71K', '65K'][i]}</td><td>{['3.04%', '2.76%', '2.44%', '3.05%', '2.66%', '2.84%', '2.53%', '2.95%'][i]}</td><td>$0.22</td><td>{['6,420', '5,100', '4,800', '3,940', '3,180', '2,840', '2,210', '1,980'][i]}</td><td>$6.65</td><td>$84,200</td><td className="positive">{['8.20×', '5.90×', '5.20×', '4.81×', '4.10×', '5.30×', '4.40×', '6.10×'][i]}</td></tr>)}</tbody></table></div><div className="pagination">Showing 1–8 of 47 campaigns <span>‹ <b>1</b> 2 3 … 6 ›</span></div></Panel>
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
    <Panel title="Ad & Creative Performance"><div className="table-scroll"><table><thead><tr>{['Platform', 'Campaign', 'Ad', 'Format', 'Impressions', 'Reach', 'Clicks', 'CTR', 'Spend', 'Conversions', 'CPA', 'Revenue', 'ROAS'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{['Spring hero — blue', 'Founder story — 30s', 'Customer proof — carousel', 'Search text — enterprise'].map((ad, i) => <tr key={ad}><td>{platforms[i].name.replace(' Ads', '')}</td><td>{campaigns[i]}</td><td>{ad}</td><td><span className="badge">{['Image', 'Video', 'Carousel', 'Search Text'][i]}</span></td><td>{['2.4M', '1.8M', '1.2M', '980K'][i]}</td><td>1.5M</td><td>84K</td><td>2.66%</td><td>$18,400</td><td>2,840</td><td>$6.48</td><td>$104K</td><td className="positive">5.65×</td></tr>)}</tbody></table></div></Panel>
    <Panel title="Audience Performance"><div className="table-scroll"><table><thead><tr>{['Platform', 'Audience', 'Reach', 'Impressions', 'Frequency', 'Clicks', 'CTR', 'Conversions', 'CPA', 'Revenue', 'ROAS'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{audiences.map((a, i) => <tr key={a}><td>{platforms[i % 4].name.replace(' Ads', '')}</td><td>{a}</td><td>6.2M</td><td>9.4M</td><td>1.53×</td><td>248K</td><td>2.66%</td><td>8,420</td><td>$6.65</td><td>$342K</td><td className="positive">6.47×</td></tr>)}</tbody></table></div></Panel>
    <div className="two-col"><Panel title="Device Performance"><Donut label="68%" /><div className="mini-table">{['Desktop', 'Mobile', 'Tablet', 'Other'].map((d, i) => <div key={d}><span>{d}</span><b>{[68, 27, 4, 1][i]}%</b></div>)}</div></Panel><Panel title="Geographic Performance"><div className="geo"><svg viewBox="0 0 500 190" aria-label="Simplified world map" role="img"><path d="M25 67l39-23 33 8 24-20 48 8 21 27 47-8 37 16 58-13 50 17 66-4 48 27-27 24-51-8-39 23-58-8-45 26-43-18-40 12-50-26-48 8-34-20z" fill="var(--muted-foreground)" stroke="var(--muted-foreground)" strokeWidth="1" /><path d="M106 75l42-16 22 15-17 29-39 5zM276 72l42-12 18 18-19 24-40-7zM374 86l31-9 31 20-34 16z" fill="var(--chart-1)" opacity=".8" /></svg></div><div className="ranked">{['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'].map((c, i) => <div key={c}><b>{i + 1}</b><span>{c}</span><strong>{['$142K', '$38K', '$31K', '$22K', '$18K'][i]}</strong><em>{['8.20×', '6.42×', '5.91×', '5.20×', '4.88×'][i]}</em></div>)}</div></Panel></div>
    <Panel title="Demographic Performance"><div className="tabs"><button>Age</button><button>Gender</button><button>Seniority</button><button>Industry</button></div><Bars items={[{
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
    <div className="two-col"><Panel title="Advertising Attribution"><div className="tabs model-tabs">{['First Touch', 'Last Touch', 'Linear', 'Position Based', 'Time Decay', 'Data-Driven'].map(m => <button className={model === m ? 'active' : ''} onClick={() => setModel(m)} key={m}>{m}{m === 'Last Touch' && ' ✓'}</button>)}</div><div className="attribution"><strong>42,840</strong><span>Attributed conversions</span><strong>$1,842,300</strong><span>Attributed revenue</span></div><p className="formula">Attribution shows correlation, not causation.</p></Panel><Panel title="Cross-Platform Attribution"><div className="mini-table">{platforms.map(p => <div key={p.name}><span><i style={{
                background: p.color
              }} />{p.name.replace(' Ads', '')}</span><b>{p.conversions} → {['20,912', '10,142', '3,710', '1,982'][platforms.indexOf(p)]}</b></div>)}</div><div className="callout">Platforms may count the same conversion — total platform-reported conversions will exceed Lulu AI unified attributed total.</div></Panel></div>
    <Panel title="Advertising Budget"><div className="budget-grid">{platforms.map((p, i) => <div className="budget" key={p.name}><h3><i style={{
              background: p.color
            }} />{p.name}</h3><div><span>Budget</span><b>{['$160K', '$90K', '$40K', '$22K'][i]}</b></div><div><span>Spend</span><b>{p.spend}</b></div><div className="util"><i style={{
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
    <Panel title="Advertising Benchmark"><div className="benchmark"><div className="bench-head"><span>Metric</span><span>Your Performance</span><span>Internal Benchmark</span><span>Industry Benchmark</span></div>{[['CTR', '2.66%', '2.4%', '2.1%'], ['CPC', '$0.222', '$0.25', '$0.31'], ['CPM', '$5.91', '$6.20', '$7.10'], ['CPA', '$6.65', '$7.20', '$9.40'], ['ROAS', '6.47×', '5.8×', '4.9×'], ['Conversion Rate', '3.34%', '3.0%', '2.7%']].map(r => <div className="bench-head" key={r[0]}><b>{r[0]}</b><strong>{r[1]}</strong><span>{r[2]}</span><span>{r[3]}</span></div>)}</div></Panel>
    <Panel title="Advertising Trends"><div className="chips">{['Spend', 'CTR', 'CPC', 'Conversions', 'ROAS', 'Revenue', 'CAC'].map(x => <button key={x} className={x === 'Spend' ? 'active' : ''}>{x}</button>)}</div><LineChart green /></Panel>
    <Panel title="Advertising Anomalies"><div className="table-scroll"><table><thead><tr>{['Metric', 'Platform', 'Campaign', 'Date', 'Observed', 'Expected Range', 'Difference', ''].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{[['Spend', 'Google Ads', 'Competitor Keywords', 'Jan 18', '$8.4K/day', '$4–6K/day', '+52%'], ['ROAS', 'Meta Ads', 'Product Launch — Spring', 'Jan 22', '3.1×', '4.5–6.5×', '-32%'], ['CPA', 'TikTok Ads', 'TikTok Gen Z — App', 'Jan 25', '$14.20', '$7–11', '$3.20']].map(r => <tr key={r[2]}>{r.map((x, i) => <td key={x} className={i === 6 ? 'negative' : ''}>{x}</td>)}<td><button className="link">View</button></td></tr>)}</tbody></table></div><button className="link">→ View all anomalies in Anomalies module</button></Panel>
    <Panel title="Advertising Data Health"><div className="health-grid">{platforms.map(p => <div className="health" key={p.name}><h3><i style={{
              background: p.color
            }} />{p.name}<span className="status">Connected ✓</span></h3><p>Last sync: 2 min ago</p><p>Coverage: Jan 1 – present</p><p>Missing periods: None</p><small>Available metrics: Spend · Clicks · Conversions · Revenue · ROAS</small></div>)}</div><p className="formula">To manage platform connections, visit Ad Accounts & Platform Management →</p></Panel>
    <Panel title="Key Advertising KPIs"><div className="key-grid">{['Spend', '$284,710', 'Impressions', '48.2M', 'Reach', '31.4M', 'Clicks', '1.28M', 'CTR', '2.66%', 'CPC', '$0.222', 'CPM', '$5.91', 'Conversions', '42,840', 'Conversion Rate', '3.34%', 'CPA', '$6.65', 'CAC', '$47.20', 'Revenue', '$1.84M', 'ROAS', '6.47×', 'Profitability', '$938K'].reduce((acc, x, i, arr) => i % 2 === 0 ? [...acc, {
          label: x,
          value: arr[i + 1]
        }] : acc, [] as {
          label: string;
          value: string;
        }[]).map(k => <div key={k.label}><span>{k.label}</span><strong>{k.value}</strong><b className="positive">+8.9%</b><Sparkline path="M2 24 L18 20 L34 23 L50 12 L66 15 L88 5" /></div>)}</div><button className="link">→ Open KPI Explorer</button></Panel>
    <Panel title="Explain Advertising Performance" className="explain"><span className="ai-badge">✦ AI Assessment</span><ul><li>Spend increased 8.9% driven primarily by Google Ads (+$12.4K).</li><li>ROAS essentially flat at 6.47× vs 6.48× prior period.</li><li>Meta Ads conversion rate improved +0.3pp.</li><li>TikTok CAC remains highest at $9.49 CPA.</li><li>LinkedIn generated highest-quality leads by revenue per conversion.</li></ul><p>If you want recommendations → <button className="link">View AI Recommendations</button></p></Panel>
    <section className="ask-panel"><span className="ai-badge">✦ LULU AI</span><h2>Ask Lulu AI about your advertising performance</h2><div className="ask-input"><input value={ask} onChange={e => setAsk(e.target.value)} placeholder="Ask a question about your advertising data..." /><button className="ask-btn"><Sparkles size={15} /> Ask</button></div><div className="prompt-grid">{['Which platform performs best?', 'What is our ROAS?', 'Which campaigns drive the most revenue?', 'Compare Google Ads and Meta Ads', 'Why did our ROAS change?', 'Which audience performs best?', 'Explain our advertising funnel', 'What is our CAC?'].map(p => <button onClick={() => setAsk(p)} key={p}>{p}</button>)}</div></section>
    <footer>Data Sources: Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads <span>·</span> Last updated: 2 min ago <span>·</span> Attribution: Last Touch <span>·</span> Currency: USD</footer>
  </main>;
}
const styles = `
:root{--black:var(--background);--panel:var(--card);--edge:var(--border);--text:var(--foreground);--muted:var(--muted-foreground);--amber:var(--chart-1);--green:var(--chart-4);--red:var(--chart-5)}*{box-sizing:border-box}body{background:var(--black)!important;color:var(--text)!important;font-family:Inter,Arial,sans-serif!important}.dashboard{max-width:1440px;margin:auto;padding:28px 32px 56px;overflow-x:hidden;background:var(--black);min-height:100vh}.header{display:flex;justify-content:space-between;gap:24px;padding-bottom:26px;border-bottom:1px solid var(--edge)}h1{font-size:28px;margin:15px 0 8px;letter-spacing:-.7px}.header p{color:var(--muted);font-size:14px;margin:0;max-width:680px}.crumb{font-size:12px;color:var(--muted)}.crumb span{margin:0 8px;color:var(--muted-foreground)}.actions{display:flex;align-items:flex-end;gap:8px}.actions button,.filters button,.segmented button,.tabs button,.chips button,.table-tools button{display:flex;align-items:center;gap:7px;border:1px solid var(--edge);background:var(--background);color:var(--text);border-radius:6px;padding:8px 11px;font-size:12px;white-space:nowrap}.actions button:hover,.filters button:hover,.tabs button:hover,.chips button:hover,.prompt-grid button:hover{border-color:var(--amber)}button{cursor:pointer;transition:.2s}button:focus-visible,input:focus-visible{outline:2px solid var(--amber);outline-offset:2px}.ask-btn{background:var(--primary)!important;color:var(--primary-foreground)!important;border-color:var(--primary)!important;font-weight:700}.alert{padding:10px 14px;border:1px solid var(--border);border-radius:6px;font-size:12px;margin:16px 0}.partial{color:var(--amber);background:var(--background)}.error{color:var(--chart-5);border-color:var(--chart-5);background:var(--background);display:flex;gap:10px;align-items:center}.error button{margin-left:auto;background:transparent;border:0;color:var(--text);text-decoration:underline}.filters{display:flex;align-items:center;gap:10px;background:var(--panel);border-bottom:1px solid var(--edge);padding:12px 14px;margin:0 -32px 26px}.filters button{background:transparent;border:0}.filters button b{font-weight:500}.filters i{height:24px;width:1px;background:var(--edge);margin:0 5px}.filters>small{margin-left:auto;color:var(--muted)}.vs{font-size:12px;color:var(--muted)}.dots{display:flex;gap:3px}.dots em,.platform-dot,.mini-table i,.health h3 i,.budget h3 i{width:7px;height:7px;border-radius:50%;display:inline-block}.section{padding:0 0 24px;border-bottom:1px solid var(--edge);margin-bottom:24px}.eyebrow{display:block;color:var(--muted);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.3px}.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:12px}.kpi,.panel,.collapsible,.ask-panel{background:var(--panel);border:1px solid var(--edge);border-radius:8px}.kpi{padding:15px;position:relative;min-height:142px}.kpi>strong{display:block;font-size:24px;margin:12px 0 5px;letter-spacing:-.5px}.kpi small{color:var(--muted);font-size:11px}.kpi-bottom{display:flex;justify-content:space-between;align-items:center;margin-top:12px}.positive{color:var(--green)!important}.negative{color:var(--red)!important}.positive,.negative{display:flex;align-items:center;gap:3px;font-size:12px}.positive span,.negative span{font-weight:500}.coverage,.badge,.ai-badge,.status{font-size:10px;color:var(--muted);border:1px solid var(--edge);border-radius:20px;padding:4px 7px}.spark{height:30px;width:86px;position:absolute;right:12px;bottom:11px}.panel{padding:17px;margin-bottom:24px;min-width:0}.panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}.panel h2,.collapsible h2,.ask-panel h2{font-size:18px;margin:0;font-weight:600;letter-spacing:-.2px}.icon-btn{color:var(--muted);background:transparent;border:0}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:24px}.three-col{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.four-col{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.score-content{display:grid;grid-template-columns:190px 1fr 260px;align-items:center;gap:26px}.score-left{text-align:center}.score-left>b{display:block;margin-top:8px;font-size:16px}.score-left>span{display:inline-block;margin-top:8px;color:var(--amber);font-size:10px}.score-gauge,.gauge{width:142px;height:142px;border-radius:50%;margin:auto;background:conic-gradient(var(--amber) 0 74%,var(--background) 74% 100%);display:grid;place-items:center}.score-gauge>div,.gauge-inner{width:112px;height:112px;background:var(--panel);border-radius:50%;display:grid;place-items:center;align-content:center}.score-gauge strong{font-size:38px}.score-gauge small,.gauge-inner small{color:var(--muted)}.score-breakdown{padding-right:22px}.bars{display:grid;gap:12px}.bar-row{display:grid;grid-template-columns:105px 1fr 58px;align-items:center;gap:10px;font-size:11px;color:var(--muted)}.bar-row b{color:var(--text);text-align:right;font-size:11px}.bar-track{height:6px;background:var(--background);border-radius:4px;overflow:hidden}.bar-track i{display:block;height:100%;border-radius:4px}.disclaimer,.formula{color:var(--muted);font-size:12px;line-height:1.5}.chart{width:100%;height:190px;display:block}.chart-meta{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--edge);padding:12px 0 16px}.legend{font-size:11px;color:var(--muted);display:flex;align-items:center;gap:7px}.amber-dot,.green-dot,.gray-line{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--amber)}.green-dot{background:var(--green)}.gray-line{height:2px;width:15px;border-radius:0;background:var(--muted);margin-left:10px}.segmented button{padding:5px 8px}.segmented button:first-child,.tabs button.active,.chips button.active{background:var(--primary);color:var(--primary-foreground);border-color:var(--primary)}.donut-wrap{text-align:center;padding:4px}.donut{width:145px;height:145px;border-radius:50%;background:conic-gradient(var(--chart-3) 0 47%,var(--chart-3) 47% 79%,var(--chart-3) 79% 91%,var(--chart-5) 91%);display:grid;place-items:center;margin:4px auto 15px}.donut>div{width:106px;height:106px;background:var(--panel);border-radius:50%;display:grid;place-items:center;align-content:center}.donut strong{font-size:20px}.donut small{color:var(--muted);font-size:11px}.mini-table{display:grid;gap:0}.mini-table>div{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--edge);font-size:12px}.mini-table span{display:flex;align-items:center;gap:8px}.frequency{display:flex;gap:28px;align-items:center}.frequency-gauge{width:118px;height:118px;border:10px solid var(--muted-foreground);border-top-color:var(--amber);border-right-color:var(--amber);border-radius:50%;display:grid;place-items:center;align-content:center;flex-shrink:0}.frequency-gauge strong{font-size:23px}.frequency-gauge span{font-size:11px;color:var(--muted)}.big-number{display:block;font-size:24px;margin:4px 0 5px}.three-col .panel .bars{margin-top:21px}.metric-pair{display:flex;gap:30px;margin:10px 0 15px}.metric-pair strong{font-size:25px}.metric-pair small{display:block;color:var(--muted);font-size:11px;font-weight:500}.profit-list{display:grid;gap:9px}.profit-list p{display:flex;justify-content:space-between;border-bottom:1px solid var(--edge);padding-bottom:9px;margin:0;color:var(--muted);font-size:13px}.profit-list b{color:var(--text)}.callout,.google-note{padding:10px;margin-top:16px;background:var(--background);color:var(--amber);font-size:12px;border-left:2px solid var(--amber)}.table-scroll{overflow-x:auto}.table-scroll table{width:100%;border-collapse:collapse;min-width:980px}th{text-align:left;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.7px;font-weight:600;padding:9px 10px;border-bottom:1px solid var(--edge);white-space:nowrap}td{font-size:13px;padding:13px 10px;border-bottom:1px solid var(--edge);white-space:nowrap}td:first-child{font-weight:600}.platform-dot{margin-right:8px}.table-tools{display:flex;gap:8px;margin-bottom:13px}.table-tools label{display:flex;align-items:center;gap:8px;background:var(--background);border:1px solid var(--edge);padding:0 10px;border-radius:6px;width:280px;color:var(--muted)}input{border:0;background:transparent;color:var(--text);padding:9px 0;outline:0;width:100%}.pagination{display:flex;justify-content:space-between;color:var(--muted);font-size:12px;padding-top:14px}.pagination span{word-spacing:10px}.pagination b{color:var(--amber)}.link{border:0;background:transparent;color:var(--foreground);font-size:12px;padding:5px 0}.collapsible{margin-bottom:24px}.collapsible>button{width:100%;padding:17px;background:transparent;color:var(--text);border:0;display:flex;justify-content:space-between;text-align:left}.collapsed-body{padding:0 17px 17px}.nested{gap:40px}.nested .panel{border:0;padding:0;margin:0}.nested h3{font-size:13px;margin:0 0 8px}.geo svg{width:100%;height:190px}.ranked{display:grid;gap:7px}.ranked div{display:grid;grid-template-columns:20px 1fr 75px 45px;font-size:12px;color:var(--muted)}.ranked strong,.ranked em{color:var(--text);font-style:normal;text-align:right}.tabs,.chips{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:17px}.tabs button,.chips button{padding:6px 10px}.model-tabs button{font-size:11px}.attribution{display:grid;grid-template-columns:1fr 1fr;gap:7px 24px}.attribution strong{font-size:28px}.attribution span{color:var(--muted);font-size:11px}.funnel{display:grid;gap:7px;justify-items:center}.funnel-row{display:flex;align-items:center;gap:12px;width:100%;justify-content:center}.funnel-row strong{display:flex;justify-content:space-between;padding:11px 16px;border-radius:3px;color:var(--foreground);font-size:12px;transition:width .2s}.funnel-row small{width:70px;color:var(--muted);font-size:11px}.budget-grid,.health-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.budget,.health{border:1px solid var(--edge);padding:13px;border-radius:6px}.budget h3,.health h3{font-size:13px;margin:0 0 15px;display:flex;align-items:center;gap:7px}.budget>div{display:flex;justify-content:space-between;font-size:12px;margin:7px 0}.budget>div span,.health p,.health small{color:var(--muted)}.util{height:5px;background:var(--background);border-radius:4px;overflow:hidden}.util i{display:block;height:100%;background:var(--amber)}.budget small{color:var(--muted)}.amber{color:var(--amber)!important}.benchmark{display:grid}.bench-head{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;border-bottom:1px solid var(--edge);padding:11px 4px;font-size:12px;gap:10px}.bench-head:first-child{color:var(--muted);text-transform:uppercase;font-size:10px}.bench-head strong{color:var(--green)}.key-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}.key-grid>div{border:1px solid var(--edge);border-radius:5px;padding:10px;min-width:0}.key-grid span{display:block;color:var(--muted);font-size:10px;text-transform:uppercase}.key-grid strong{display:block;font-size:17px;margin:8px 0}.key-grid .spark{position:static;width:100%;height:20px}.explain{border-left:3px solid var(--border)}.ai-badge{display:inline-block;color:var(--foreground);border-color:var(--foreground);margin-bottom:10px}.explain ul{padding-left:20px;margin:4px 0 16px;display:grid;gap:10px;font-size:13px}.explain p{color:var(--muted);font-size:12px}.ask-panel{padding:28px;border-top:2px solid var(--border);margin-top:28px}.ask-panel h2{font-size:23px;margin:8px 0 18px}.ask-input{display:flex;gap:8px;border:1px solid var(--edge);background:var(--background);border-radius:7px;padding:4px 4px 4px 13px}.ask-input input{font-size:14px}.prompt-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}.prompt-grid button{background:transparent;border:1px solid var(--edge);border-radius:5px;color:var(--muted);padding:9px;font-size:11px;text-align:left}footer{padding-top:25px;color:var(--muted);font-size:11px;text-align:center}footer span{color:var(--muted-foreground);margin:0 8px}.muted{color:var(--muted)}
@media(max-width:1050px){.three-col{grid-template-columns:1fr 1fr}.four-col{grid-template-columns:1fr 1fr}.key-grid{grid-template-columns:repeat(4,1fr)}.score-content{grid-template-columns:180px 1fr}.disclaimer{grid-column:1/-1}.budget-grid,.health-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:720px){.dashboard{padding:20px 16px 40px}.header{display:block}.actions{margin-top:20px;flex-wrap:wrap}.filters{margin:0 -16px 20px;overflow-x:auto}.filters>small{display:none}.kpi-grid,.two-col,.three-col,.four-col{grid-template-columns:1fr}.score-content{display:block}.score-breakdown{margin-top:20px}.score-left{margin-bottom:18px}.key-grid{grid-template-columns:repeat(2,1fr)}.prompt-grid{grid-template-columns:1fr 1fr}.benchmark{min-width:620px}.budget-grid,.health-grid{grid-template-columns:1fr 1fr}.frequency{display:block}.frequency-gauge{margin:0 auto 20px}.table-tools{overflow-x:auto}.table-tools label{min-width:230px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
`;