import { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Download, Plus, RefreshCw, Sparkles, ArrowRight, AlertTriangle, Check, CircleHelp, Send } from 'lucide-react';
type Tone = 'brass' | 'green' | 'red' | 'blue' | 'muted';
type Kpi = {
  label: string;
  value: string;
  prev: string;
  delta: string;
  percent: string;
  tone: Tone;
  points: string;
};
type Segment = {
  name: string;
  amount: string;
  share: string;
  growth: string;
  color: string;
};
const kpis: Kpi[] = [{
  label: 'Revenue',
  value: '$4,284,700',
  prev: '$3,942,100',
  delta: '+$342,600',
  percent: '+8.7%',
  tone: 'brass',
  points: '1,22 8,20 15,21 22,16 29,17 36,10 40,8'
}, {
  label: 'Gross Profit',
  value: '$2,398,400',
  prev: '$2,188,300',
  delta: '+$210,100',
  percent: '+9.6%',
  tone: 'brass',
  points: '1,21 8,19 15,18 22,20 29,13 36,11 40,7'
}, {
  label: 'Gross Margin',
  value: '56.0%',
  prev: '55.5%',
  delta: '+0.5pp',
  percent: '+0.9%',
  tone: 'brass',
  points: '1,19 8,18 15,18 22,16 29,16 36,12 40,11'
}, {
  label: 'Operating Expenses',
  value: '$1,642,800',
  prev: '$1,584,200',
  delta: '+$58,600',
  percent: '+3.7%',
  tone: 'red',
  points: '1,21 8,20 15,16 22,18 29,13 36,11 40,8'
}, {
  label: 'Operating Profit',
  value: '$755,600',
  prev: '$604,100',
  delta: '+$151,500',
  percent: '+25.1%',
  tone: 'green',
  points: '1,22 8,20 15,19 22,15 29,15 36,9 40,6'
}, {
  label: 'Net Profit',
  value: '$618,200',
  prev: '$489,400',
  delta: '+$128,800',
  percent: '+26.3%',
  tone: 'green',
  points: '1,22 8,21 15,18 22,19 29,12 36,10 40,5'
}, {
  label: 'Cash Balance',
  value: '$2,184,600',
  prev: '$1,996,200',
  delta: '+$188,400',
  percent: '+9.4%',
  tone: 'blue',
  points: '1,21 8,18 15,20 22,14 29,16 36,9 40,8'
}, {
  label: 'Operating Cash Flow',
  value: '$842,400',
  prev: '$724,800',
  delta: '+$117,600',
  percent: '+16.2%',
  tone: 'blue',
  points: '1,22 8,21 15,16 22,17 29,12 36,11 40,6'
}];
const segments: Segment[] = [{
  name: 'SaaS Subscriptions',
  amount: '$2,142,400',
  share: '50.0%',
  growth: '+7.4%',
  color: 'var(--foreground)'
}, {
  name: 'Professional Services',
  amount: '$856,900',
  share: '20.0%',
  growth: '+4.8%',
  color: 'var(--foreground)'
}, {
  name: 'Ecommerce',
  amount: '$642,700',
  share: '15.0%',
  growth: '+9.2%',
  color: 'var(--chart-4)'
}, {
  name: 'Consulting',
  amount: '$428,500',
  share: '10.0%',
  growth: '+6.1%',
  color: 'var(--foreground)'
}, {
  name: 'Other',
  amount: '$214,200',
  share: '5.0%',
  growth: '+1.8%',
  color: 'var(--muted-foreground)'
}];
const breakdown = [['Revenue Growth', '84%'], ['Gross Margin', '79%'], ['Operating Margin', '76%'], ['Cash Flow', '88%'], ['OPEX Control', '82%'], ['Net Margin', '78%']];
const costs = [['Salaries & People', '$892,400', '54.3%', ' +3.1%'], ['Marketing', '$284,100', '17.3%', '−5.3%'], ['Advertising', '$142,800', '8.7%', '+2.0%'], ['Software & Tools', '$98,400', '6.0%', '+12.4%'], ['Professional Services', '$72,600', '4.4%', '−2.1%'], ['Rent & Facilities', '$84,200', '5.1%', '+0.4%'], ['Other', '$68,300', '4.2%', '−1.8%']];
const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const tableProducts = [['Core Platform', '$1,842,400', '$508,100', '$1,334,300', '72.4%'], ['Growth Suite', '$986,200', '$318,800', '$667,400', '67.7%'], ['Services', '$856,900', '$444,200', '$412,700', '48.2%'], ['Commerce', '$642,700', '$342,400', '$300,300', '46.7%'], ['Advisory', '$428,500', '$264,000', '$164,500', '38.4%']];
const benchmarks = [['Revenue Growth', '+8.7%', '+7.2%', '+6.1%'], ['Gross Margin', '56.0%', '54.2%', '52.4%'], ['Operating Margin', '17.6%', '15.8%', '14.2%'], ['Net Margin', '14.4%', '12.4%', '10.8%'], ['OPEX Ratio', '38.3%', '39.6%', '41.8%']];
const prompts = ['What is our gross margin?', 'Which costs increased most?', 'How is our cash flow?', 'Are we on track for targets?', 'What is our burn rate?', 'Which products are most profitable?', 'Explain why profit changed', 'Compare with last year'];
const Spark = ({
  points,
  tone = 'brass'
}: {
  points: string;
  tone?: Tone;
}) => {
  const color = tone === 'green' ? 'var(--chart-4)' : tone === 'red' ? 'var(--chart-5)' : tone === 'blue' ? 'var(--primary)' : 'var(--foreground)';
  return <svg className="spark" viewBox="0 0 41 25" aria-hidden="true"><polyline points={points} fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
};
const Section = ({
  eyebrow,
  title,
  children,
  className = ''
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) => <section className={`section ${className}`}>{eyebrow && <p className="eyebrow">{eyebrow}</p>}{title && <h2>{title}</h2>}{children}</section>;
const Gauge = ({
  value,
  label,
  color = 'var(--foreground)'
}: {
  value: string;
  label: string;
  color?: string;
}) => <div className="dial"><div className="dial-arc" style={{
    borderTopColor: color,
    borderLeftColor: color,
    transform: `rotate(${Number.parseFloat(value) * 1.8 - 90}deg)`
  }} /><div className="dial-needle" style={{
    background: color,
    transform: `rotate(${Number.parseFloat(value) * 1.8 - 90}deg)`
  }} /><strong>{value}</strong><span>{label}</span></div>;
export const LuluFinance = () => {
  const [activeSeries, setActiveSeries] = useState('Revenue');
  const [period, setPeriod] = useState('Daily');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const toneClass = (tone: Tone) => `tone-${tone}`;
  const refresh = () => {
    setLoading(true);
    setError(false);
    window.setTimeout(() => setLoading(false), 700);
  };
  const chartPath = activeSeries === 'Gross Profit' ? '0,118 55,110 110,94 165,96 220,78 275,68 330,71 385,52 440,57 495,35 550,40 605,25 660,28' : activeSeries === 'Net Profit' ? '0,126 55,122 110,112 165,114 220,99 275,91 330,93 385,78 440,81 495,63 550,66 605,50 660,46' : '0,108 55,104 110,90 165,94 220,72 275,78 330,62 385,66 440,48 495,52 550,34 605,39 660,21';
  return <div className="flex min-h-screen bg-[var(--background)]"><aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-[var(--sidebar)] p-4 lg:flex"><div className="mb-5 flex items-center gap-3 px-2 py-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</div><span className="font-semibold text-foreground">Lulu AI</span></div><LuluSectionNavigation activeId="cozily-path-5612" /></aside><div className="min-w-0 flex-1"><main className="finance-shell">
    <style>{`*{box-sizing:border-box} .finance-shell{--bg:var(--background);--card:var(--card);--elev:var(--muted-foreground);--border:var(--border);--text:var(--foreground);--muted:var(--muted-foreground);--brass:var(--border);--green:var(--chart-4);--red:var(--chart-5);--blue:var(--border);background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,sans-serif;min-height:100vh;padding:34px 48px 48px;font-size:14px}.header{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding-bottom:28px}.crumb{color:var(--muted);font-size:12px;margin:0 0 13px}.crumb b{color:var(--muted-foreground);font-weight:400;padding:0 8px}.header h1{font-size:28px;letter-spacing:-.04em;margin:0 0 7px}.subtitle{color:var(--muted);margin:0;max-width:680px;font-size:15px}.actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.btn{border:1px solid var(--border);background:var(--card);color:var(--text);border-radius:6px;padding:9px 12px;display:inline-flex;align-items:center;gap:7px;font:600 12px inherit;cursor:pointer;transition:.2s}.btn:hover,.chip:hover{border-color:var(--brass);color:var(--brass)}.btn.primary{background:var(--brass);color:var(--bg);border-color:var(--brass)}button:focus-visible,input:focus-visible{outline:2px solid var(--brass);outline-offset:2px}.filter{background:var(--card);border-bottom:1px solid var(--border);border-top:1px solid var(--border);margin:0 -48px;padding:11px 48px;display:flex;align-items:center;gap:13px;color:var(--muted);font-size:12px}.filter-spacer{margin-left:auto}.dot{display:inline-block;width:6px;height:6px;background:var(--brass);border-radius:50%;margin:0 6px}.pill,.chip{border:1px solid var(--border);background:var(--elev);color:var(--text);border-radius:5px;padding:7px 10px;font:600 12px inherit;cursor:pointer}.section{border-top:1px solid var(--elev);padding-top:30px;margin-top:38px}.eyebrow{font-size:11px;letter-spacing:.13em;color:var(--muted);font-weight:700;margin:0 0 14px}.section h2{font-size:18px;margin:0 0 16px;letter-spacing:-.02em}.grid-kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:17px 18px}.kpi{min-height:144px;position:relative}.kpi-label,.table th{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);font-weight:700}.kpi-value{font-size:26px;letter-spacing:-.04em;font-weight:700;margin:16px 0 7px}.currency{font-size:10px;border:1px solid var(--border);padding:3px 5px;border-radius:3px;color:var(--muted);vertical-align:middle;letter-spacing:.04em}.prev{font-size:12px;color:var(--muted)}.delta{font-size:12px;font-weight:700;margin-top:10px;display:inline-block}.tone-brass{color:var(--brass)}.tone-green{color:var(--green)}.tone-red{color:var(--red)}.tone-blue{color:var(--blue)}.tone-muted{color:var(--muted)}.spark{position:absolute;right:17px;top:17px;width:41px;height:25px}.score{display:grid;grid-template-columns:260px 1fr;gap:34px;align-items:center}.score-gauge{display:flex;align-items:center;gap:23px}.score-ring{width:124px;height:124px;border-radius:50%;background:conic-gradient(var(--brass) 0 81%,var(--elev) 81%);display:grid;place-items:center;position:relative}.score-ring:after{content:'';width:94px;height:94px;background:var(--card);border-radius:50%;position:absolute}.score-ring strong,.score-ring span{z-index:1}.score-ring strong{font-size:27px}.score-ring span{font-size:11px;color:var(--muted);margin-top:38px;position:absolute}.score-copy strong{display:block;font-size:15px}.score-copy span{color:var(--muted);font-size:12px}.bars{display:grid;grid-template-columns:1fr 1fr;gap:14px 34px}.bar-row{display:grid;grid-template-columns:135px 1fr 34px;align-items:center;gap:10px;font-size:12px;color:var(--muted)}.bar-track{height:6px;border-radius:6px;background:var(--elev);overflow:hidden}.bar-fill{height:100%;background:var(--brass);border-radius:6px}.ai-note{color:var(--muted);font-size:12px;margin:18px 0 0;display:flex;align-items:center;gap:7px}.two-col{display:grid;grid-template-columns:3fr 2fr;gap:14px}.three-col{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.chart-card{min-height:330px}.chart-head{display:flex;justify-content:space-between;align-items:start;gap:12px}.chart-head h3,.card h3{font-size:14px;margin:0 0 5px}.caption{color:var(--muted);font-size:12px}.chips{display:flex;gap:5px;flex-wrap:wrap}.chip.active{background:var(--background);color:var(--brass);border-color:var(--chart-1)}.line-chart{width:100%;height:190px;margin-top:15px}.chart-legend{display:flex;gap:18px;color:var(--muted);font-size:11px}.legend i{width:8px;height:8px;display:inline-block;border-radius:50%;margin-right:5px}.tabs{display:flex;border-top:1px solid var(--border);margin-top:8px;padding-top:10px;gap:20px}.tabs button{background:none;border:0;color:var(--muted);padding:3px 0;cursor:pointer;font:600 12px inherit}.tabs button.active{color:var(--brass);border-bottom:1px solid var(--brass)}.donut-wrap{display:flex;align-items:center;gap:24px;margin:10px 0 16px}.donut{width:138px;height:138px;border-radius:50%;background:conic-gradient(var(--chart-1) 0 50%,var(--chart-3) 50% 70%,var(--chart-4) 70% 85%,var(--chart-1) 85% 95%,var(--muted) 95%);position:relative;flex:none}.donut:after{content:'';position:absolute;inset:29px;background:var(--card);border-radius:50%}.segment-list{display:grid;gap:7px;width:100%}.segment-list div{display:flex;justify-content:space-between;font-size:12px}.segment-list i{width:7px;height:7px;border-radius:50%;display:inline-block;margin-right:6px}.table-wrap{overflow-x:auto}.table{width:100%;border-collapse:collapse;min-width:470px}.table th{text-align:left;border-bottom:1px solid var(--border);padding:9px 8px}.table td{padding:10px 8px;border-bottom:1px solid var(--muted-foreground);color:var(--text);white-space:nowrap}.table tr:last-child td{border-bottom:0}.right{text-align:right!important}.metric-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.metric-strip .card{min-height:98px}.metric-value{font-size:21px;font-weight:700;margin-top:10px}.banner{border:1px solid var(--chart-1);background:var(--background);color:var(--chart-1);padding:12px 14px;border-radius:6px;font-size:12px;margin-bottom:14px}.waterfall{display:flex;align-items:flex-end;gap:11px;height:225px;border-bottom:1px solid var(--border);padding:0 8px}.wf-item{flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%;gap:6px}.wf-bar{border-radius:3px 3px 0 0;min-height:18px;position:relative}.wf-bar span{position:absolute;top:-25px;font-size:10px;white-space:nowrap;color:var(--muted)}.wf-label{font-size:10px;color:var(--muted);text-align:center}.waterfall .brass{background:var(--brass)}.waterfall .red{background:var(--red)}.waterfall .green{background:var(--green)}.waterfall .blue{background:var(--blue)}.mini-bars{display:grid;gap:13px;margin-top:16px}.mini-bar-head{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px}.mini-bar-head span:last-child{color:var(--muted)}.mini-track{height:8px;background:var(--elev);border-radius:10px}.mini-fill{height:100%;background:var(--brass);border-radius:10px}.margin-card{min-height:260px}.dial-row{display:flex;justify-content:space-around;margin:28px 0 18px}.dial{height:108px;width:145px;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden}.dial-arc{position:absolute;width:112px;height:112px;border:10px solid var(--elev);border-radius:50%;top:29px;transform-origin:center;clip-path:polygon(0 0,100% 0,100% 57%,0 57%)}.dial-needle{width:3px;height:48px;position:absolute;bottom:14px;transform-origin:bottom center;border-radius:2px}.dial strong{font-size:19px}.dial span{font-size:11px;color:var(--muted);margin-top:4px}.cash-summary{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.cash-summary .card{min-height:102px}.cash-flow-chart{height:235px;display:flex;align-items:end;gap:13px;padding:20px 8px 0;border-bottom:1px solid var(--border)}.month-bar{height:100%;display:flex;align-items:end;gap:2px;flex:1}.month-bar i{display:block;width:33%;border-radius:2px 2px 0 0}.ops{background:var(--blue)}.invest{background:var(--red)}.finance{background:var(--muted)}.month-name{font-size:10px;color:var(--muted);text-align:center;margin-top:7px}.breakdown-stack{display:grid;gap:10px}.breakdown-stack .card{padding:14px 16px}.definition{color:var(--muted);font-size:12px;line-height:1.5;margin:8px 0 0}.runway{display:flex;align-items:center;gap:18px}.runway strong{font-size:30px;letter-spacing:-.05em}.runway strong span{font-size:14px;color:var(--muted);font-weight:400}.runway-track{height:16px;background:linear-gradient(90deg,var(--red) 0 35%,var(--primary) 35% 58%,var(--green) 58%);border-radius:10px;margin:24px 0 8px}.runway-marker{height:22px;width:3px;background:var(--text);position:relative;left:73%;top:-3px}.aging{height:14px;border-radius:8px;display:flex;overflow:hidden;margin:14px 0 16px}.aging i{height:100%;display:block}.working{display:grid;grid-template-columns:repeat(4,1fr);align-items:center}.working .big{font-size:22px;font-weight:700}.eff-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);border:1px solid var(--border)}.eff-grid div{background:var(--card);padding:14px}.eff-grid strong{display:block;font-size:17px;margin-top:6px}.tag{font-size:10px;color:var(--muted);border:1px solid var(--border);border-radius:3px;padding:3px 5px;margin-left:5px}.status{font-size:11px;padding:4px 7px;border-radius:4px;background:var(--background);color:var(--green);font-weight:700}.status.warn{background:var(--background);color:var(--brass)}.status.bad{background:var(--background);color:var(--red)}.target-grid .card{min-height:160px}.progress{height:7px;background:var(--elev);border-radius:8px;margin:13px 0 9px}.progress b{display:block;height:100%;background:var(--brass);border-radius:8px}.progress.green b{background:var(--green)}.progress.red b{background:var(--red)}.target-foot{color:var(--muted);font-size:12px;display:flex;justify-content:space-between}.anomaly td{color:var(--foreground)}.health{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.health .card{min-height:150px}.health h3{display:flex;justify-content:space-between}.connected{color:var(--green);font-size:11px}.partial{color:var(--brass);font-size:11px}.kpi-explorer{float:right;color:var(--brass);font-size:12px;text-decoration:none}.explain{border-left:3px solid var(--brass);padding:20px 22px}.explain ul{display:grid;gap:11px;margin:18px 0;padding-left:20px;color:var(--muted-foreground);line-height:1.4}.ask{border-top:3px solid var(--brass);padding:22px}.ask label{color:var(--brass);font-size:11px;font-weight:700;letter-spacing:.12em}.ask-form{display:flex;margin:15px 0 13px}.ask-form input{background:var(--elev);border:1px solid var(--border);border-right:0;border-radius:5px 0 0 5px;flex:1;padding:13px;color:var(--text);font:14px inherit}.ask-form button{background:var(--brass);border:0;border-radius:0 5px 5px 0;padding:0 16px;color:var(--bg);cursor:pointer}.prompt-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.prompt-grid button{background:var(--elev);border:1px solid transparent;border-radius:5px;color:var(--muted);padding:9px 8px;text-align:left;cursor:pointer;font:12px inherit}.prompt-grid button:hover{border-color:var(--brass);color:var(--text)}.footer{border-top:1px solid var(--elev);margin-top:38px;padding-top:18px;color:var(--muted);font-size:12px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.skeleton{height:100px;background:linear-gradient(90deg,var(--elev),var(--background),var(--elev));background-size:200% 100%;animation:shine 1.3s infinite;border-radius:6px}@keyframes shine{to{background-position:-200% 0}}@media(max-width:1000px){.finance-shell{padding:26px 24px}.filter{margin:0 -24px;padding-left:24px;padding-right:24px}.header{align-items:flex-start;flex-direction:column}.actions{justify-content:flex-start}.grid-kpi{grid-template-columns:repeat(2,1fr)}.two-col,.three-col{grid-template-columns:1fr}.cash-summary{grid-template-columns:repeat(3,1fr)}.health{grid-template-columns:repeat(2,1fr)}}@media(max-width:620px){.finance-shell{padding:22px 15px}.filter{margin:0 -15px;padding:11px 15px;overflow-x:auto;white-space:nowrap}.grid-kpi,.metric-strip,.cash-summary,.health{grid-template-columns:1fr}.bars{grid-template-columns:1fr}.score{grid-template-columns:1fr}.working{grid-template-columns:1fr 1fr;gap:18px}.prompt-grid{grid-template-columns:1fr 1fr}.donut-wrap{align-items:flex-start;flex-direction:column}.donut{width:120px;height:120px}.header h1{font-size:25px}.kpi-value{font-size:23px}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}`}</style>
    <header className="header"><div><p className="crumb">Intelligence <b>/</b> Business Intelligence <b>/</b> Finance</p><h1>Finance</h1><p className="subtitle">Understand revenue, costs, profitability, cash flow and financial performance across your business.</p></div><div className="actions"><button className="btn primary"><Sparkles size={14} /><span>Ask Lulu AI</span></button><button className="btn" onClick={refresh}><RefreshCw size={14} /><span>Refresh</span></button><button className="btn"><Plus size={14} /><span>Create Report</span></button><button className="btn"><Download size={14} /><span>Export</span></button></div></header>
    <div className="filter"><span>Date Range</span><button className="pill">Last 30 Days <ChevronDown size={13} /></button><span>vs</span><button className="pill">Previous Period <ChevronDown size={13} /></button><b>|</b><span>Currency</span><button className="pill">USD (Reporting) <ChevronDown size={13} /></button><span className="filter-spacer">Last synced 4 min ago · <i className="dot" />All sources connected</span></div>
    <div className="banner"><AlertTriangle size={14} style={{
            verticalAlign: 'middle',
            marginRight: 7
          }} />Financial analysis is based on partial data — ERP System missing March 20–22. Some metrics may be incomplete.</div>
    <Section eyebrow="FINANCE OVERVIEW"><div className="grid-kpi">{loading ? kpis.map(item => <div className="card skeleton" key={item.label} aria-label="Loading financial metric" />) : kpis.map(item => <article className="card kpi" key={item.label}><span className="kpi-label">{item.label}</span><Spark points={item.points} tone={item.tone} /><div className="kpi-value">{item.value} <small className="currency">USD</small></div><div className="prev">vs prev {item.prev}</div><div className={`delta ${toneClass(item.tone)}`}><ArrowUp size={12} style={{
                  verticalAlign: '-2px'
                }} /> {item.delta} &nbsp; {item.percent}</div></article>)}</div></Section>
    <Section title="Financial Performance Score"><div className="card score"><div className="score-gauge"><div className="score-ring"><strong>81</strong><span>/100</span></div><div className="score-copy"><strong>Strong</strong><span>Measured financial health</span></div></div><div><div className="bars">{breakdown.map(([name, value]) => <div className="bar-row" key={name}><span>{name}</span><div className="bar-track"><div className="bar-fill" style={{
                      width: value
                    }} /></div><b>{value}</b></div>)}</div><p className="ai-note"><AlertTriangle size={13} className="tone-brass" /> AI-generated financial assessment — not an accounting or financial statement. Based on measured data only.</p></div></div></Section>
    <Section title="Revenue Performance & Trend"><div className="two-col"><article className="card chart-card"><div className="chart-head"><div><h3>Revenue Trend</h3><p className="caption">30-day performance against target</p></div><div className="chips">{['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(item => <button className={`chip ${period === item ? 'active' : ''}`} key={item} onClick={() => setPeriod(item)}>{item}{period === item ? ' ✓' : ''}</button>)}</div></div><svg className="line-chart" viewBox="0 0 660 150" preserveAspectRatio="none" role="img" aria-label="Revenue trend area chart"><path d={`${chartPath} L660,150 L0,150 Z`} fill="var(--chart-1)" opacity=".14" /><path d={chartPath} fill="none" stroke="var(--chart-1)" strokeWidth="3" /><path d="M0 128 L660 38" fill="none" stroke="var(--chart-1)" strokeDasharray="5 5" /><path d="M0 112 L660 20" fill="none" stroke="var(--chart-1)" strokeDasharray="2 6" opacity=".7" /><g fill="var(--muted-foreground)" fontSize="10"><text x="5" y="148">Apr</text><text x="320" y="148">Sep</text><text x="625" y="148">Mar</text><text x="5" y="15">$5M</text></g></svg><div className="chart-legend"><span className="legend"><i style={{
                    background: 'var(--chart-1)'
                  }} />Financial Target</span><span className="legend"><i style={{
                    background: 'var(--muted)'
                  }} />Previous Period</span></div><div className="tabs">{['Revenue', 'Gross Profit', 'Net Profit'].map(item => <button className={activeSeries === item ? 'active' : ''} key={item} onClick={() => setActiveSeries(item)}>{item}</button>)}</div></article><article className="card"><h3>Revenue Composition</h3><p className="caption">Current period · $4,284,700 total</p><div className="donut-wrap"><div className="donut" aria-label="Revenue composition donut chart" /><div className="segment-list">{segments.map(item => <div key={item.name}><span><i style={{
                        background: item.color
                      }} />{item.name}</span><b>{item.share}</b></div>)}</div></div><div className="table-wrap"><table className="table"><thead><tr><th>Segment</th><th>Revenue</th><th>Growth</th></tr></thead><tbody>{segments.map(item => <tr key={item.name}><td>{item.name}</td><td>{item.amount}</td><td className="tone-brass">{item.growth}</td></tr>)}</tbody></table></div></article></div></Section>
    <Section title="Recurring Revenue"><div className="metric-strip">{[['MRR', '$428,500', '+7.4% ↑'], ['ARR', '$5,142,000', '+7.4% ↑'], ['New Recurring Revenue', '+$42,800', 'new subscribers'], ['Churned Revenue', '−$18,400', 'lost subscribers']].map(([a, b, c]) => <article className="card" key={a}><span className="kpi-label">{a}</span><div className={`metric-value ${a === 'Churned Revenue' ? 'tone-red' : 'tone-brass'}`}>{b}</div><span className="caption">{c}</span></article>)}</div><p className="definition">Recurring revenue metrics reflect connected subscription data only. Non-subscription revenue not included.</p></Section>
    <Section title="Cost Performance & Profitability Waterfall"><div className="two-col"><article className="card"><h3>Profitability Waterfall</h3><p className="caption">How revenue becomes net profit</p><div className="waterfall">{[['Revenue', '$4.28M', 'brass', '90%'], ['COGS', '−$1.89M', 'red', '50%'], ['Gross Profit', '$2.40M', 'green', '58%'], ['OPEX', '−$1.64M', 'red', '38%'], ['Operating Profit', '$755.6K', 'brass', '28%'], ['Other', '−$137.4K', 'red', '17%'], ['Net Profit', '$618.2K', 'green', '23%']].map(([name, value, color, height]) => <div className="wf-item" key={name}><div className={`wf-bar ${color}`} style={{
                    height
                  }}><span>{value}</span></div><span className="wf-label">{name}</span></div>)}</div><p className="definition">Gross Profit 56.0% margin · Operating Profit 17.6% · Net Profit 14.4%</p></article><article className="card"><h3>Cost Breakdown</h3><p className="caption">OPEX by category · % of revenue</p><div className="mini-bars">{costs.map(([name, amount, share, growth]) => <div key={name}><div className="mini-bar-head"><span>{name}</span><span>{amount} · {share} <em className="tone-brass">{growth}</em></span></div><div className="mini-track"><div className="mini-fill" style={{
                      width: share
                    }} /></div></div>)}</div></article></div></Section>
    <Section title="Gross Margin & Operating Margin"><div className="three-col"><article className="card margin-card"><h3>Gross Margin Analysis</h3><div className="metric-value tone-brass">56.0%</div><p className="caption">Overall gross margin</p><div className="mini-bars">{[['SaaS', '72.4%'], ['Services', '48.2%'], ['Ecommerce', '46.6%'], ['Consulting', '38.4%']].map(([a, b]) => <div key={a}><div className="mini-bar-head"><span>{a}</span><span>{b}</span></div><div className="mini-track"><div className="mini-fill" style={{
                      width: b
                    }} /></div></div>)}</div><p className="definition">12-month trend improving with mix shift.</p></article><article className="card margin-card"><h3>OPEX Trend</h3><p className="caption">Monthly operating expenses</p><svg className="line-chart" viewBox="0 0 420 150" preserveAspectRatio="none"><path d="M0 112 L38 106 76 110 114 94 152 100 190 83 228 88 266 74 304 79 342 60 380 65 420 47 L420 150 L0 150Z" fill="var(--chart-3)" opacity=".13" /><path d="M0 112 L38 106 76 110 114 94 152 100 190 83 228 88 266 74 304 79 342 60 380 65 420 47" fill="none" stroke="var(--chart-3)" strokeWidth="2.5" /></svg><div className="chips"><button className="chip active">Absolute $</button><button className="chip">% of Revenue</button></div><p className="definition">OPEX/Revenue ratio is declining to 38.3%.</p></article><article className="card margin-card"><h3>Operating & Net Margin</h3><div className="dial-row"><Gauge value="17.6" label="Operating Margin" /><Gauge value="14.4" label="Net Margin" color="var(--foreground)" /></div><table className="table"><thead><tr><th>Metric</th><th>Current</th><th>Target</th></tr></thead><tbody><tr><td>Operating</td><td>17.6%</td><td>15.0%</td></tr><tr><td>Net</td><td>14.4%</td><td>12.0%</td></tr></tbody></table></article></div></Section>
    <Section title="Profitability by Segment"><div className="three-col"><article className="card"><div className="chart-head"><h3>Product Profitability</h3><a className="kpi-explorer" href="#products">→ Products</a></div><div className="table-wrap"><table className="table"><thead><tr><th>Product</th><th>Revenue</th><th>Direct Costs</th><th>Gross Profit</th><th>Margin</th></tr></thead><tbody>{tableProducts.map(row => <tr key={row[0]}>{row.map((cell, i) => <td className={i === 4 ? 'tone-brass' : ''} key={`${row[0]}-${cell}`}>{cell}</td>)}</tr>)}</tbody></table></div></article><article className="card"><h3>Customer Profitability</h3><div className="table-wrap"><table className="table"><thead><tr><th>Segment</th><th>Revenue</th><th>Margin</th><th>Contribution</th></tr></thead><tbody>{[['Enterprise', '$1.82M', '62.4%', '$1.14M'], ['Mid-market', '$1.28M', '56.2%', '$719K'], ['SMB', '$842K', '48.1%', '$405K'], ['Partners', '$342K', '41.7%', '$143K']].map(row => <tr key={row[0]}>{row.map(cell => <td key={`${row[0]}-${cell}`}>{cell}</td>)}</tr>)}</tbody></table></div><p className="definition">Customer-level data shown per permissions.</p></article><article className="card"><h3>Market Profitability</h3><div className="table-wrap"><table className="table"><thead><tr><th>Market</th><th>Revenue</th><th>Costs</th><th>Margin</th></tr></thead><tbody>{[['United States', '$2.24M', '$912K', '59.3%'], ['United Kingdom', '$684K', '$312K', '54.4%'], ['Europe', '$592K', '$286K', '51.7%'], ['Canada', '$384K', '$192K', '50.0%'], ['APAC', '$281K', '$156K', '44.5%']].map(row => <tr key={row[0]}>{row.map((cell, i) => <td className={i === 3 ? 'tone-brass' : ''} key={`${row[0]}-${cell}`}>{cell}</td>)}</tr>)}</tbody></table></div></article></div></Section>
    <Section eyebrow="CASH" title="Cash Position & Cash Flow"><div className="cash-summary">{[['Cash Balance', '$2,184,600', 'blue'], ['Operating Cash Flow', '$842,400', 'green'], ['Investing Cash Flow', '−$284,200', 'red'], ['Financing Cash Flow', '−$142,800', 'muted'], ['Net Cash Flow', '+$415,400', 'green']].map(([a, b, c]) => <article className="card" key={a}><span className="kpi-label">{a}</span><div className={`metric-value tone-${c}`}>{b}</div></article>)}</div><div className="two-col" style={{
            marginTop: 14
          }}><article className="card"><h3>Cash Flow Trend</h3><p className="caption">12 months · stacked cash flow and net line</p><div className="cash-flow-chart">{months.map((month, i) => <div key={month} style={{
                  flex: 1
                }}><div className="month-bar"><i className="ops" style={{
                      height: `${48 + i * 2}%`
                    }} /><i className="invest" style={{
                      height: `${20 + i % 3 * 4}%`
                    }} /><i className="finance" style={{
                      height: `${12 + i % 2 * 4}%`
                    }} /></div><div className="month-name">{month}</div></div>)}</div><div className="chart-legend" style={{
                marginTop: 12
              }}><span><i style={{
                    background: 'var(--chart-3)'
                  }} />Operating CF</span><span><i style={{
                    background: 'var(--primary)'
                  }} />Investing</span><span><i style={{
                    background: 'var(--muted)'
                  }} />Financing</span><span><i style={{
                    background: 'var(--primary)'
                  }} />Net CF</span></div></article><div className="breakdown-stack">{[['Operating CF', '$842,400', 'Cash from ops · Cash consumed', 'blue'], ['Investing CF', '−$284,200', 'CapEx $182,400 · Asset purchases $101,800', 'red'], ['Financing CF', '−$142,800', 'Debt repayment $142,800', 'muted']].map(([a, b, c, d]) => <article className="card" key={a}><h3 className={`tone-${d}`}>{a} <span style={{
                    float: 'right'
                  }}>{b}</span></h3><p className="definition">{c}</p></article>)}</div></div></Section>
    <Section title="Cash Runway & Burn Rate"><div className="two-col"><article className="card"><h3>Cash Runway</h3><div className="runway"><strong>26.4 <span>months</span></strong><span className="caption">Estimated</span></div><div className="runway-track"><div className="runway-marker" /></div><div className="target-foot"><span>Red &lt;12 mo</span><span>Amber 12–18 mo</span><span>Green &gt;18 mo</span></div><p className="definition">Current cash $2,184,600 / Avg monthly burn $82,800 = 26.4 months. Based on average 3-month net burn. Not a forecast of actual cash availability.</p></article><article className="card"><h3>Burn Rate</h3><svg className="line-chart" viewBox="0 0 600 150" preserveAspectRatio="none"><path d="M0 40 L55 52 110 45 165 64 220 58 275 72 330 76 385 82 440 90 495 98 550 104 600 110" fill="none" stroke="var(--chart-1)" strokeWidth="2.5" /><path d="M0 108 L55 112 110 105 165 117 220 110 275 121 330 116 385 125 440 120 495 130 550 125 600 132" fill="none" stroke="var(--chart-4)" strokeWidth="2.5" /></svg><div className="metric-strip"><span>Gross <b>$284,200</b></span><span>Net <b className="tone-green">$82,800</b></span></div><p className="definition">Gross Burn = total cash out. Net Burn = cash out minus cash in from operations.</p></article></div></Section>
    <Section title="Accounts Receivable & Payable"><div className="two-col"><article className="card"><div className="chart-head"><h3>Accounts Receivable</h3><strong className="tone-brass">$842,400</strong></div><div className="aging"><i style={{
                  width: '57.5%',
                  background: 'var(--primary)'
                }} /><i style={{
                  width: '21.9%',
                  background: 'var(--primary)'
                }} /><i style={{
                  width: '11.7%',
                  background: 'var(--primary)'
                }} /><i style={{
                  width: '5.1%',
                  background: 'var(--primary)'
                }} /><i style={{
                  width: '3.8%',
                  background: 'var(--primary)'
                }} /></div><table className="table"><tbody>{[['Current (0d)', '$484,200', '57.5%', 'tone-green'], ['1–30 days', '$184,600', '21.9%', 'tone-brass'], ['31–60 days', '$98,400', '11.7%', 'tone-brass'], ['61–90 days', '$42,800', '5.1%', 'tone-red'], ['90+ days', '$32,400', '3.8%', 'tone-red']].map(row => <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td className={row[3]}>{row[2]}</td></tr>)}</tbody></table><p className="definition">19.9% of receivables are over 30 days.</p></article><article className="card"><div className="chart-head"><h3>Accounts Payable</h3><strong className="tone-blue">$384,200</strong></div><div className="aging"><i style={{
                  width: '59.5%',
                  background: 'var(--primary)'
                }} /><i style={{
                  width: '25.6%',
                  background: 'var(--primary)'
                }} /><i style={{
                  width: '9.9%',
                  background: 'var(--primary)'
                }} /><i style={{
                  width: '3.2%',
                  background: 'var(--primary)'
                }} /><i style={{
                  width: '1.8%',
                  background: 'var(--primary)'
                }} /></div><table className="table"><tbody>{[['Current', '$228,400', '59.5%'], ['1–30 days', '$98,400', '25.6%'], ['31–60 days', '$38,200', '9.9%'], ['61–90 days', '$12,400', '3.2%'], ['90+ days', '$6,800', '1.8%']].map(row => <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td className="tone-blue">{row[2]}</td></tr>)}</tbody></table><p className="definition">Payment obligations remain within normal aging.</p></article></div></Section>
    <Section title="Working Capital"><div className="card working"><div><span className="kpi-label">Current Assets</span><div className="metric-value">$3,284,600</div></div><div><span className="kpi-label">Current Liabilities</span><div className="metric-value">$1,284,200</div></div><div><span className="kpi-label">Working Capital</span><div className="big tone-green">$2,000,400</div></div><div><span className="kpi-label">Working Capital Ratio</span><div className="big tone-brass">2.56×</div></div><p className="definition">Working Capital = Current Assets − Current Liabilities.</p><Spark points="1,22 8,20 15,21 22,14 29,16 36,8 40,5" tone="green" /></div></Section>
    <Section title="Financial Efficiency & Unit Economics"><div className="two-col"><article className="card"><h3>Financial Efficiency</h3><div className="eff-grid">{[['Revenue / Customer', '$2,142.40'], ['Revenue / Employee', '$84,800'], ['OPEX / Revenue', '38.3%'], ['COGS / Revenue', '44.0%'], ['Gross Profit / Revenue', '56.0%'], ['Operating CF / Revenue', '19.7%']].map(([a, b]) => <div key={a}><span className="caption">{a}</span><strong>{b}</strong></div>)}</div><p className="definition">Revenue / Employee shown where employee data available.</p></article><article className="card"><h3>Unit Economics</h3><div className="table-wrap"><table className="table"><tbody>{[['CAC', '$184.20', 'Calculated'], ['CLV', '$1,842.00', 'Calculated'], ['CLV/CAC', '10.0×', 'Calculated'], ['Gross Margin per Customer', '$1,031.50', 'Observed'], ['Revenue per Customer', '$2,142.40', 'Observed'], ['Contribution Margin', '48.1%', 'Calculated']].map(row => <tr key={row[0]}><td>{row[0]}</td><td><strong>{row[1]}</strong></td><td><span className="tag">{row[2]}</span></td></tr>)}</tbody></table></div><p className="definition">CLV calculated from historical cohort data. Estimated where insufficient history exists.</p></article></div></Section>
    <Section eyebrow="BUDGET VS ACTUAL"><article className="card"><div className="table-wrap"><table className="table"><thead><tr><th>Category</th><th>Budget</th><th>Actual</th><th>Variance $</th><th>Variance %</th><th>Status</th></tr></thead><tbody>{[['Revenue', '$4,200,000', '$4,284,700', '+$84,700', '+2.0%', 'Ahead'], ['COGS', '$1,960,000', '$1,886,300', '−$73,700', '−3.8%', 'Under Budget'], ['Salaries', '$900,000', '$892,400', '−$7,600', '−0.8%', 'On Budget'], ['Marketing', '$300,000', '$284,100', '−$15,900', '−5.3%', 'Under Budget'], ['Advertising', '$140,000', '$142,800', '+$2,800', '+2.0%', 'On Budget'], ['Software', '$100,000', '$98,400', '−$1,600', '−1.6%', 'On Budget'], ['Operating Profit', '$720,000', '$755,600', '+$35,600', '+4.9%', 'Ahead'], ['Net Profit', '$580,000', '$618,200', '+$38,200', '+6.6%', 'Ahead']].map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={`${row[0]}-${cell}`} className={i === 3 || i === 4 ? 'tone-brass' : ''}>{i === 5 ? <span className={`status ${cell === 'On Budget' ? 'warn' : ''}`}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div><p className="definition">Budgets are read-only here. Edit budgets in Finance module.</p></article></Section>
    <Section title="Financial Targets, Gap & Benchmarks"><div className="three-col target-grid"><article className="card"><h3>Financial Targets</h3>{[['Revenue', '$5M', '85.7%', '−$715K', 'brass'], ['Gross Margin', '58%', '96.6%', '−2pp', 'green'], ['Net Profit', '$800K', '77.3%', '−$181.8K', 'red'], ['Cash Balance', '$2.5M', '87.4%', '−$315K', 'brass']].map(row => <div key={row[0]} style={{
                marginTop: 14
              }}><div className="mini-bar-head"><span>{row[0]} <b>{row[1]}</b></span><span>{row[2]}</span></div><div className={`progress ${row[4]}`}><b style={{
                    width: row[2]
                  }} /></div><div className="target-foot"><span>{row[3]}</span><span>Dec 31</span></div></div>)}<p className="definition">Targets are organization-defined.</p></article><article className="card"><h3>Financial Gap</h3><table className="table"><thead><tr><th>Metric</th><th>Target</th><th>Actual</th><th>Gap</th></tr></thead><tbody>{[['Revenue', '$5M', '$4.28M', '−$715K'], ['Gross Margin', '58%', '56%', '−2pp'], ['Net Profit', '$800K', '$618K', '−$182K'], ['Cash', '$2.5M', '$2.18M', '−$315K']].map(r => <tr key={r[0]}>{r.map(c => <td key={`${r[0]}-${c}`}>{c}</td>)}</tr>)}</tbody></table></article><article className="card"><h3>Financial Benchmarks</h3><table className="table"><thead><tr><th>Metric</th><th className="tone-brass">Yours</th><th>Internal</th><th>Industry</th></tr></thead><tbody>{benchmarks.map(r => <tr key={r[0]}><td>{r[0]}</td><td className="tone-green">{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}</tbody></table></article></div></Section>
    <Section title="Financial Trends"><article className="card"><div className="chips">{['Revenue', 'Gross Profit', 'Net Profit', 'OPEX', 'Gross Margin', 'Cash Flow', 'Receivables', 'Payables'].map(item => <button className={`chip ${activeSeries === item ? 'active' : ''}`} key={item} onClick={() => setActiveSeries(item)}>{item}{activeSeries === item ? ' ✓' : ''}</button>)}</div><svg className="line-chart" viewBox="0 0 900 180" preserveAspectRatio="none"><path d="M0 142 L80 135 160 140 240 122 320 128 400 106 480 112 560 88 640 96 720 65 800 72 900 30 L900 180 L0 180Z" fill="var(--chart-1)" opacity=".15" /><path d="M0 142 L80 135 160 140 240 122 320 128 400 106 480 112 560 88 640 96 720 65 800 72 900 30" fill="none" stroke="var(--chart-1)" strokeWidth="3" /><path d="M0 150 L900 65" fill="none" stroke="var(--muted-foreground)" strokeDasharray="4 5" /></svg><div className="chart-legend"><span>12-month trend · {activeSeries}</span><span>Comparison overlay available</span></div></article></Section>
    <Section title="Financial Anomalies"><article className="card"><div className="table-wrap"><table className="table"><thead><tr><th>Metric</th><th>Date</th><th>Category</th><th>Observed</th><th>Expected Range</th><th>Difference</th><th></th></tr></thead><tbody>{[['Operating Expenses', 'Mar 14', 'Software & Tools', '$28,400', '$8,000–$10,000', '+$18,400'], ['Accounts Receivable', 'Mar 18', 'Enterprise Client A', '62 days overdue', '0–30 days', '+32 days'], ['Revenue', 'Mar 22', 'UK Market', '$82,400', '$148,000–$184,000', '−$79,600']].map(r => <tr className="anomaly" key={r[0]}>{r.map(c => <td key={`${r[0]}-${c}`}>{c}</td>)}<td><button className="chip">View</button></td></tr>)}</tbody></table></div><a className="kpi-explorer" style={{
              float: 'none',
              display: 'block',
              marginTop: 15
            }} href="#anomalies">→ View all anomalies in Anomalies module</a></article></Section>
    <Section title="Financial Data Health"><div className="health">{[['Accounting System (QuickBooks)', 'Connected ✓', 'Last sync: 4 min ago', 'Coverage: Jan 2024–present', 'Missing: None'], ['ERP System', 'Partial ⚠', 'Last sync: 2 hrs ago', 'Coverage: Jan 2024–present', 'Missing: March 20–22'], ['Stripe (Billing)', 'Connected ✓', 'Last sync: 1 min ago', 'Coverage: Current', 'Missing: None'], ['Shopify (Ecommerce)', 'Connected ✓', 'Last sync: 3 min ago', 'Coverage: Current', 'Missing: None']].map(r => <article className="card" key={r[0]}><h3>{r[0]} <span className={r[1].startsWith('Partial') ? 'partial' : 'connected'}>{r[1]}</span></h3><p className="definition">{r[2]}<br />{r[3]}<br />{r[4]}<br />Currency: USD</p></article>)}</div><p className="definition">To manage financial source connections, open Integrations →</p></Section>
    <Section title="Key Finance KPIs"><a className="kpi-explorer" href="#kpi-explorer">→ Open KPI Explorer</a><div className="grid-kpi">{[...kpis.slice(0, 2), ...kpis.slice(3), {
              label: 'Operating Margin',
              value: '17.6%',
              prev: '15.8%',
              delta: '',
              percent: '+1.8pp',
              tone: 'green',
              points: '1,22 8,20 15,19 22,15 29,15 36,10 40,7'
            }, {
              label: 'Net Margin',
              value: '14.4%',
              prev: '12.4%',
              delta: '',
              percent: '+2.0pp',
              tone: 'green',
              points: '1,22 8,21 15,18 22,19 29,12 36,10 40,5'
            }].slice(0, 13).map(item => <article className="card kpi" key={item.label}><span className="kpi-label">{item.label}</span><Spark points={item.points} tone={item.tone as Tone} /><div className="kpi-value">{item.value}</div><div className="prev">prev {item.prev} · <span className={`tone-${item.tone}`}>{item.percent}</span></div></article>)}</div></Section>
    <Section title="Explain Financial Performance"><article className="card explain"><p className="ai-note" style={{
              marginTop: 0
            }}><AlertTriangle size={13} className="tone-brass" /> AI Assessment — based on connected financial data. Not an accounting statement.</p><ul><li>Revenue grew 8.7% driven by SaaS subscription growth (+7.4% MRR) and ecommerce (+9.2%).</li><li>Gross margin improved 0.5pp to 56.0% due to favorable COGS mix shift toward higher-margin SaaS.</li><li>Operating profit surged +25.1% as revenue growth outpaced OPEX growth (8.7% vs 3.7%).</li><li>Software & Tools expense anomaly detected Mar 14: $28,400 vs expected $8,000–$10,000.</li><li>UK market revenue below expected range Mar 22 — see anomaly for detail.</li><li>Cash runway estimated at 26.4 months based on 3-month avg net burn of $82,800.</li><li>AR aging: 19.9% of receivables &gt;30 days; Enterprise Client A now 62 days overdue.</li></ul><a className="kpi-explorer" style={{
              float: 'none'
            }} href="#recommendations">Want to act on these findings? → View AI Recommendations</a></article></Section>
    <Section><article className="card ask"><label>ASK LULU AI</label><form className="ask-form" onSubmit={e => e.preventDefault()}><input aria-label="Ask Lulu AI" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask Lulu AI about your financial performance..." /><button aria-label="Send question"><Send size={16} /></button></form><div className="prompt-grid">{prompts.map(prompt => <button key={prompt} onClick={() => setQuestion(prompt)}>{prompt}</button>)}</div></article></Section>
    {error && <div className="banner" style={{
          borderColor: 'var(--chart-5)',
          color: 'var(--chart-5)'
        }}>Financial analysis couldn't be loaded <button className="btn" onClick={refresh} style={{
            marginLeft: 12
          }}>Try Again</button></div>}
    <footer className="footer"><span>Data Sources: QuickBooks, ERP System (Partial), Stripe, Shopify</span><span>Last updated: 4 min ago</span><span>Currency: USD</span><span>Period: Last 30 Days</span></footer>
  </main></div></div>;
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
