import { useMemo, useState } from 'react';
import { BarChart3, Bell, Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, DollarSign, Download, Link2, Lock, MoreHorizontal, PieChart as PieIcon, Plus, RefreshCw, Search, Settings2, Sparkles, TrendingDown, Users, X, ArrowDownUp, AlertTriangle, Info, Calendar, Filter } from 'lucide-react';
import { Area, AreaChart, Cell, Legend, Line, LineChart, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Modal = 'set-budget' | 'edit-budget' | 'edit' | 'allocate' | 'connect' | 'export' | null;
type PageState = 'main' | 'empty' | 'no-results' | 'limited' | 'loading' | 'error' | 'permission';
type Platform = {
  name: string;
  budget: string;
  spend: string;
  remaining: string;
  utilization: number;
  variance: string;
  status: string;
  color: string;
};
type Campaign = {
  name: string;
  platform: string;
  budget: string;
  spend: string;
  remaining: string;
  utilization: number;
  pacing: string;
  status: string;
};
const navItems = [{
  label: 'Dashboard',
  icon: BarChart3
}, {
  label: 'Campaigns',
  icon: BarChart3
}, {
  label: 'Content',
  icon: PieIcon
}, {
  label: 'SEO',
  icon: Search
}, {
  label: 'GEO',
  icon: DollarSign
}, {
  label: 'AEO',
  icon: Sparkles
}, {
  label: 'Social',
  icon: Users
}, {
  label: 'Advertising',
  icon: TrendingDown
}, {
  label: 'Audiences',
  icon: Users
}, {
  label: 'Automations',
  icon: RefreshCw
}, {
  label: 'Analytics',
  icon: BarChart3
}];
const staticPlatforms: Platform[] = [{
  name: 'Google Ads',
  budget: '—',
  spend: '—',
  remaining: '—',
  utilization: 71.2,
  variance: '-—',
  status: 'On Track',
  color: 'var(--foreground)'
}, {
  name: 'Meta Ads',
  budget: '—',
  spend: '—',
  remaining: '—',
  utilization: 68.4,
  variance: '-—',
  status: 'On Track',
  color: 'var(--foreground)'
}, {
  name: 'LinkedIn Ads',
  budget: '—',
  spend: '—',
  remaining: '—',
  utilization: 52.8,
  variance: '+—',
  status: 'Underspending',
  color: 'var(--foreground)'
}, {
  name: 'TikTok Ads',
  budget: '—',
  spend: '—',
  remaining: '—',
  utilization: 46,
  variance: '+—',
  status: 'Underspending',
  color: 'var(--foreground)'
}];
const staticCampaigns: Campaign[] = [];
const trendData: Array<Record<string, any>> = [];
const forecastData: Array<Record<string, any>> = [];
const allocationData: Array<Record<string, any>> = [];
const pacingRows: any[][] = [];
const alerts: Array<Record<string, any>> = [];
export function LuluBudgets() {
  const [activeModal, setActiveModal] = useState<Modal>(null);
  const [pageState, setPageState] = useState<PageState>('main');
  const [dateRange, setDateRange] = useState('This Month');
  const [budgetPeriod, setBudgetPeriod] = useState('Monthly');
  const [activePlatform, setActivePlatform] = useState('All Platforms');
  const [query, setQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState('Platform');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [allocateStep, setAllocateStep] = useState(1);
  const { items: budgetRecords, loading: budgetsLoading, error: budgetsError } = useLiveRecords('ad_budgets');
  const getBudgetField = (record: typeof budgetRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const livePlatforms: Platform[] = budgetRecords.map(record => ({ name: getBudgetField(record, 'platform') || getBudgetField(record, 'name') || 'Advertising platform', budget: getBudgetField(record, 'budget') || '—', spend: getBudgetField(record, 'spend') || '—', remaining: getBudgetField(record, 'remaining') || '—', utilization: Number(getBudgetField(record, 'utilization')) || 0, variance: getBudgetField(record, 'variance') || '—', status: getBudgetField(record, 'status') || 'Unknown', color: 'var(--primary)' }));
  const liveCampaigns: Campaign[] = budgetRecords.map(record => ({ name: getBudgetField(record, 'campaign') || getBudgetField(record, 'name') || 'Advertising budget', platform: getBudgetField(record, 'platform') || '—', budget: getBudgetField(record, 'budget') || '—', spend: getBudgetField(record, 'spend') || '—', remaining: getBudgetField(record, 'remaining') || '—', utilization: Number(getBudgetField(record, 'utilization')) || 0, pacing: getBudgetField(record, 'pacing') || '—', status: getBudgetField(record, 'status') || 'Unknown' }));
  const visiblePlatforms = budgetsLoading ? [] : livePlatforms;
  const visibleCampaigns = useMemo(() => liveCampaigns.filter(item => item.name.toLowerCase().includes(query.toLowerCase()) && (activePlatform === 'All Platforms' || item.platform === activePlatform)), [query, activePlatform]);
  const openModal = (modal: Modal) => setActiveModal(modal);
  const statusBadge = (status: string) => <span className={'status ' + (status === 'On Track' || status === 'Active' ? 'good' : status === 'Underspending' ? 'warn' : 'info')}><i />{status}</span>;
  const button = (label: string, icon?: React.ReactNode, primary = false, action?: () => void) => <button className={primary ? 'btn primary' : 'btn'} onClick={action}>{icon}{label}</button>;
  return <div className="lulu-budgets"><style>{`*{box-sizing:border-box}button,input,select{font:inherit}.lulu-budgets{display:flex;min-height:100vh;background:var(--sidebar);color:var(--foreground);font:12px Inter,system-ui,sans-serif}.sidebar{width:240px;flex:0 0 240px;background:var(--sidebar);color:var(--muted-foreground);padding:22px 12px 14px;display:flex;flex-direction:column}.brand{display:flex;align-items:center;gap:9px;color:var(--foreground);font-size:18px;padding:0 12px 24px}.brand b{color:var(--foreground)}.mark{width:28px;height:28px;border-radius:8px;background:var(--primary);display:grid;place-items:center;color:var(--primary-foreground)}.workspace{display:flex;align-items:center;gap:8px;background:var(--background);border:1px solid var(--muted-foreground);border-radius:9px;padding:10px;margin-bottom:24px}.workspace-avatar{width:28px;height:28px;border-radius:7px;background:var(--primary);color:var(--primary-foreground);display:grid;place-items:center;font-size:10px;font-weight:700}.workspace strong,.user strong{display:block;color:var(--foreground);font-size:11px}.workspace small,.user small{display:block;color:var(--muted-foreground);font-size:10px;margin-top:3px}.workspace svg{margin-left:auto}.nav-caption,.eyebrow,.label{font-size:9px;letter-spacing:1.2px;font-weight:700;color:var(--muted-foreground)}.nav-caption{padding:0 12px;margin:0 0 8px}.nav-item{width:100%;display:flex;align-items:center;gap:11px;border:0;background:transparent;color:var(--muted-foreground);padding:9px 12px;border-radius:7px;text-align:left;margin:2px 0;font-size:12px}.nav-item:hover,.nav-item.active{background:var(--background);color:var(--foreground)}.nav-item.active{box-shadow:inset 3px 0 var(--foreground)}.nav-item svg:last-child{margin-left:auto}.subnav{padding:2px 0 7px 39px;border-left:1px solid var(--muted-foreground);margin-left:23px}.subnav button{display:block;border:0;background:none;color:var(--muted-foreground);padding:6px 0;font-size:10px}.subnav .active{color:var(--foreground);font-weight:700}.sidebar-bottom{margin-top:auto}.settings{margin-top:12px}.user{border-top:1px solid var(--muted-foreground);padding:16px 8px 0;margin-top:12px;display:flex;align-items:center;gap:8px}.avatar{width:29px;height:29px;border-radius:50%;background:var(--secondary);color:var(--foreground);display:grid;place-items:center;font-size:10px;font-weight:700}.user svg{margin-left:auto}.main{min-width:0;flex:1}.topbar{height:58px;background:var(--card);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;padding:0 30px}.crumb{display:flex;gap:8px;align-items:center;color:var(--muted-foreground)}.crumb strong{color:var(--muted-foreground)}.top-actions{display:flex;gap:18px;align-items:center}.icon-btn{border:0;background:transparent;color:var(--muted-foreground);position:relative}.dot{position:absolute;right:0;top:0;width:5px;height:5px;border-radius:50%;background:var(--primary);color:var(--primary-foreground)}.content{max-width:1600px;margin:auto;padding:26px 30px 48px}.page-heading{display:flex;justify-content:space-between;gap:20px;align-items:flex-end;margin-bottom:21px}.page-heading h1{font-size:28px;letter-spacing:-.8px;margin:6px 0}.page-heading p{color:var(--muted-foreground);margin:0}.heading-actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.btn{border:1px solid var(--border);border-radius:7px;background:var(--card);color:var(--muted-foreground);padding:8px 10px;display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:600;white-space:nowrap}.btn:hover{border-color:var(--foreground);color:var(--foreground)}.btn.primary{background:var(--primary);border-color:var(--primary-foreground);color:var(--primary-foreground);box-shadow:0 3px 8px var(--foreground)}.filters{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-bottom:18px}.select{display:flex;align-items:center;gap:6px;border:1px solid var(--border);background:var(--card);border-radius:7px;padding:8px 10px;color:var(--muted-foreground);font-size:10px}.select select{border:0;background:transparent;color:inherit;outline:0}.clear{border:0;background:transparent;color:var(--foreground);font-size:10px;margin-left:auto}.kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:18px}.kpi{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px;position:relative}.kpi .accent{position:absolute;right:14px;top:15px;width:7px;height:7px;border-radius:50%}.kpi .accent.blue{background:var(--primary);color:var(--primary-foreground)}.kpi .accent.indigo{background:var(--primary);color:var(--primary-foreground)}.kpi .accent.green{background:var(--primary);color:var(--primary-foreground)}.kpi .accent.teal{background:var(--primary);color:var(--primary-foreground)}.kpi .accent.amber{background:var(--primary);color:var(--primary-foreground)}.kpi span{color:var(--muted-foreground);font-size:10px}.kpi strong{display:block;font-size:21px;letter-spacing:-.5px;margin:8px 0 3px}.kpi small{color:var(--muted-foreground);font-size:9px}.thin{height:5px;background:var(--secondary);border-radius:5px;margin-top:9px}.thin i{display:block;height:100%;width:65%;background:var(--primary);border-radius:5px;color:var(--primary-foreground)}.section{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-bottom:18px}.section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px}.section-head h2{font-size:15px;margin:0;letter-spacing:-.2px}.section-head a{color:var(--foreground);font-size:10px;font-weight:700}.util-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:28px}.platform-row{display:grid;grid-template-columns:100px 1fr 48px 105px 93px;gap:10px;align-items:center;padding:11px 0;border-bottom:1px solid var(--border)}.platform-row:first-child{padding-top:0}.platform-row strong{font-size:10px}.bar{height:8px;border-radius:8px;background:var(--secondary);overflow:hidden}.bar i{display:block;height:100%;border-radius:8px}.platform-row em{font-style:normal;font-weight:700;font-size:10px}.platform-row small{color:var(--muted-foreground);font-size:9px}.status{display:inline-flex;align-items:center;gap:5px;border-radius:12px;padding:5px 8px;font-size:9px;white-space:nowrap}.status i{width:5px;height:5px;border-radius:50%;background:currentColor}.status.good{background:var(--secondary);color:var(--chart-4)}.status.warn{background:var(--secondary);color:var(--chart-1)}.status.info{background:var(--secondary);color:var(--chart-3)}.chart-wrap{height:225px}.chart-legend{display:flex;gap:18px;color:var(--muted-foreground);font-size:9px;margin-top:-3px}.chart-legend i{display:inline-block;width:15px;height:3px;border-radius:3px;margin-right:5px;vertical-align:middle}.pacing-card{background:var(--card);border:1px solid var(--border);border-radius:9px;padding:15px;margin-bottom:15px;display:grid;grid-template-columns:1.5fr repeat(4,1fr);gap:15px;align-items:center}.pacing-card strong{display:block;font-size:16px;margin:5px 0}.pacing-card span{color:var(--muted-foreground);font-size:9px}.pacing-card b{font-size:12px}.pacing-table,.data-table{width:100%;border-collapse:collapse;min-width:760px}.pacing-table th,.data-table th{text-align:left;color:var(--muted-foreground);font-size:9px;letter-spacing:.5px;font-weight:700;padding:10px 9px;border-bottom:1px solid var(--border)}.pacing-table td,.data-table td{padding:12px 9px;border-bottom:1px solid var(--border);color:var(--muted-foreground);font-size:10px}.pacing-table th:first-child,.pacing-table td:first-child,.data-table th:first-child,.data-table td:first-child{padding-left:0}.table-wrap{overflow:auto}.data-table strong{color:var(--foreground)}.data-table .bar-cell{display:flex;align-items:center;gap:7px}.data-table .bar{width:58px;height:5px}.table-actions{display:flex;gap:4px}.mini{border:1px solid var(--border);background:var(--card);color:var(--foreground);border-radius:5px;padding:5px 7px;font-size:9px;white-space:nowrap}.total td{font-weight:700;color:var(--foreground);background:var(--card)}.search{height:31px;border:1px solid var(--border);border-radius:6px;display:flex;align-items:center;gap:7px;padding:0 9px;color:var(--muted-foreground)}.search input{border:0;outline:0;width:170px;color:var(--foreground);font-size:10px}.section-head .search{margin-left:auto;margin-right:12px}.bulk{display:flex;align-items:center;gap:13px;background:var(--secondary);color:var(--foreground);padding:9px 11px;margin:-2px 0 10px;border-radius:6px}.bulk button{border:0;background:none;color:var(--chart-3);font-size:10px}.allocation{display:grid;grid-template-columns:.7fr 1.3fr;gap:30px;align-items:center}.donut{height:220px}.allocation-table{width:100%;border-collapse:collapse}.allocation-table th,.allocation-table td{text-align:left;border-bottom:1px solid var(--border);padding:10px 6px;font-size:10px}.allocation-table th{font-size:9px;color:var(--muted-foreground)}.ai-note{color:var(--foreground);background:var(--card);border-radius:5px;padding:8px 10px;font-size:9px;margin-top:12px}.forecast{background:var(--card);border-color:var(--foreground)}.forecast-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:25px}.forecast-chart{height:240px}.metric-table{width:100%;border-collapse:collapse}.metric-table td{padding:9px 0;border-bottom:1px solid var(--border);font-size:10px}.metric-table td:last-child{text-align:right}.observed{color:var(--foreground)}.estimated{color:var(--foreground)}.ai-inferred{color:var(--foreground)}.alert-list,.history{display:grid;gap:8px}.alert-row{display:grid;grid-template-columns:22px 1fr auto;gap:10px;align-items:start;border:1px solid var(--border);border-radius:8px;padding:12px}.alert-row svg{color:var(--foreground)}.alert-row.info svg{color:var(--foreground)}.alert-row strong{font-size:10px;display:block}.alert-row small{display:block;color:var(--muted-foreground);margin-top:5px;font-size:9px}.alert-actions{display:flex;gap:5px}.history-row{display:grid;grid-template-columns:10px 1.1fr 1fr 1.6fr .8fr;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)}.history-row i{width:8px;height:8px;border-radius:50%;background:var(--primary);color:var(--primary-foreground)}.history-row strong{font-size:10px}.history-row span,.history-row small{color:var(--muted-foreground);font-size:9px}.ai-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:18px}.ai-head{display:flex;align-items:flex-start;gap:9px;color:var(--foreground)}.ai-head h2{font-size:15px;color:var(--foreground);margin:0 0 4px}.ai-head small{color:var(--muted-foreground);font-size:8px;letter-spacing:.7px}.confidence{margin-left:auto;font-weight:700}.insights{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:15px}.insight{background:var(--card);border:1px solid var(--border);border-radius:7px;padding:11px}.insight strong{display:block;font-size:9px;color:var(--muted-foreground)}.insight p{font-size:9px;color:var(--muted-foreground);line-height:1.5;margin:5px 0 0}.ai-card footer{color:var(--muted-foreground);font-size:8px;margin-top:12px}.rec-grid,.opportunity-grid,.risk-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.rec,.opportunity,.risk{border:1px solid var(--border);border-radius:9px;padding:13px;background:var(--card)}.rec h3,.opportunity h3,.risk h3{font-size:10px;line-height:1.45;margin:9px 0;color:var(--muted-foreground)}.rec p,.opportunity p,.risk p{font-size:9px;color:var(--muted-foreground);line-height:1.4;margin:0 0 10px}.priority{font-size:8px;border-radius:10px;padding:4px 7px;font-weight:700}.high{background:var(--secondary);color:var(--foreground)}.medium{background:var(--secondary);color:var(--chart-1)}.rec .label,.opportunity .label,.risk .label{color:var(--muted-foreground);font-size:8px;letter-spacing:.6px}.rec-actions{display:flex;gap:6px;margin-top:10px}.rec-actions button{border:0;background:none;color:var(--foreground);padding:0;font-size:9px;font-weight:600}.opportunity-grid{grid-template-columns:repeat(3,1fr)}.risk-grid{grid-template-columns:repeat(2,1fr)}.risk{border-left:3px solid var(--chart-1)}.risk.high-risk{border-left-color:var(--foreground)}.empty{padding:85px 20px;text-align:center}.empty svg{color:var(--foreground);margin-bottom:12px}.empty h2{font-size:18px;margin:0 0 8px}.empty p{color:var(--muted-foreground);max-width:390px;margin:0 auto 18px;line-height:1.5}.empty-actions{display:flex;justify-content:center;gap:8px}.modal-backdrop{position:fixed;inset:0;background:var(--background);display:grid;place-items:center;padding:20px;z-index:10}.modal{width:min(640px,100%);max-height:92vh;overflow:auto;background:var(--card);border-radius:12px;box-shadow:0 18px 60px var(--muted-foreground)}.modal-header{display:flex;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid var(--border)}.modal-header h2{font-size:20px;margin:5px 0 0}.modal-header button{border:0;background:none;color:var(--muted-foreground)}.modal-body{padding:20px 24px}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}.modal label{display:block;color:var(--muted-foreground);font-size:10px;font-weight:600}.modal input,.modal select{display:block;width:100%;margin-top:6px;border:1px solid var(--border);border-radius:6px;padding:9px 10px;color:var(--muted-foreground);outline-color:var(--foreground);background:var(--card)}.full{grid-column:1/-1}.review{background:var(--secondary);border-radius:7px;padding:12px;margin-top:17px}.review p{display:flex;justify-content:space-between;color:var(--muted-foreground);font-size:10px;margin:7px 0}.note{font-size:9px;color:var(--muted-foreground);line-height:1.5;margin-top:15px}.modal-footer{display:flex;justify-content:space-between;padding:14px 24px;background:var(--card);border-top:1px solid var(--border)}.steps{display:flex;justify-content:space-between;padding:15px 24px;border-bottom:1px solid var(--border)}.steps span{display:flex;align-items:center;gap:5px;color:var(--muted-foreground);font-size:9px}.steps b{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;border:1px solid var(--border);font-weight:600}.steps .active{color:var(--foreground)}.steps .active b,.steps .done b{background:var(--primary);color:var(--primary-foreground);border-color:var(--primary-foreground)}.radio{display:flex;align-items:center;gap:8px;padding:12px;border:1px solid var(--border);border-radius:7px;margin:8px 0;font-size:10px}.radio input{width:auto;margin:0}.platform-cards{display:grid;grid-template-columns:1fr 1fr;gap:9px}.platform-card{border:1px solid var(--border);border-radius:7px;padding:12px}.platform-card strong{font-size:11px}.platform-card p{font-size:9px;color:var(--muted-foreground);line-height:1.4}.checkbox{display:flex;gap:8px;align-items:center;margin:12px 0;color:var(--muted-foreground);font-size:10px}.checkbox input{width:auto;margin:0}@media(max-width:1200px){.kpis{grid-template-columns:repeat(3,1fr)}.sidebar{width:210px;flex-basis:210px}.insights{grid-template-columns:repeat(3,1fr)}.rec-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:900px){.sidebar{width:60px;flex-basis:60px;padding:18px 8px}.brand span,.workspace div:not(.workspace-avatar),.workspace>svg,.nav-caption,.nav-item span,.user div:not(.avatar),.user>svg,.subnav{display:none}.brand{padding:0 8px 25px}.workspace{justify-content:center;padding:7px}.nav-item{justify-content:center;padding:10px}.user{justify-content:center}.content{padding:20px 15px}.page-heading{align-items:flex-start;flex-direction:column}.heading-actions{justify-content:flex-start}.util-grid,.forecast-grid,.allocation{grid-template-columns:1fr}.pacing-card{grid-template-columns:1fr 1fr}.history-row{grid-template-columns:10px 1fr 1fr}.history-row span:last-child{display:none}}@media(max-width:620px){.sidebar{display:none}.topbar{height:52px;padding:0 14px}.content{padding:17px 10px}.page-heading h1{font-size:24px}.heading-actions{width:—;overflow:auto;flex-wrap:nowrap}.kpis{grid-template-columns:repeat(2,1fr)}.section{padding:15px}.platform-row{grid-template-columns:85px 1fr 42px;gap:7px}.platform-row small,.platform-row .status{grid-column:2/-1}.insights,.rec-grid,.opportunity-grid,.risk-grid{grid-template-columns:1fr}.pacing-card{grid-template-columns:1fr 1fr}.section-head{align-items:flex-start;gap:8px}.section-head .search{order:3;margin:6px 0 0}.section-head:has(.search){flex-wrap:wrap}.form-grid,.platform-cards{grid-template-columns:1fr}.full{grid-column:auto}.modal-body{padding:17px}.steps{overflow:auto;gap:12px}.steps span{min-width:58px;flex-direction:column}.alert-row{grid-template-columns:20px 1fr}.alert-actions{grid-column:2}.history-row{grid-template-columns:8px 1fr}.history-row span{display:none}}`}</style>
    <aside className="sidebar"><div className="brand"><div className="mark"><Sparkles size={16} /></div><span>Lulu <b>AI</b></span></div><div className="workspace"><div className="workspace-avatar">AC</div><div><strong>Connected workspace</strong><small>Business OS</small></div><ChevronDown size={14} /></div><LuluSectionNavigation activeId="sunny-minute-1092" /><div className="sidebar-bottom"><button className="nav-item settings"><Settings2 size={16} /><span>Settings</span></button><div className="user"><div className="avatar">JD</div><div><strong>Workspace owner</strong><small>Administrator</small></div><MoreHorizontal size={16} /></div></div></aside>
    <main className="main"><header className="topbar"><div className="crumb"><span>Advertising</span><ChevronRight size={14} /><strong>Budgets</strong></div><div className="top-actions"><button className="icon-btn" aria-label="Notifications"><Bell size={18} /><i className="dot" /></button><div className="avatar">JD</div></div></header><section className="content"><div className="page-heading"><div><div className="eyebrow">ADVERTISING WORKSPACE</div><h1>Advertising Budgets</h1><p>Plan, monitor and control advertising spend across your connected platforms and campaigns.</p></div><div className="heading-actions">{button('Set Budget', <Plus size={14} />, true, () => openModal('set-budget'))}{button('Allocate Budget', <PieIcon size={14} />, false, () => openModal('allocate'))}{button('Connect Platform', <Link2 size={14} />, false, () => openModal('connect'))}{button('Export', <Download size={14} />, false, () => openModal('export'))}{button('Refresh', <RefreshCw size={14} />)}{button('Ask Lulu AI', <Sparkles size={14} />)}</div></div>
      <div className="filters"><div className="select"><Calendar size={13} /><select value={dateRange} onChange={e => setDateRange(e.target.value)}>{['Today', 'This Week', 'This Month', 'Last 30 Days', 'Last 90 Days', 'Year to Date', 'Previous Month', 'Previous Year', 'Custom Range'].map(item => <option key={item}>{item}</option>)}</select></div><div className="select"><Filter size={13} /><select value={budgetPeriod} onChange={e => setBudgetPeriod(e.target.value)}>{['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual', 'Campaign Lifetime'].map(item => <option key={item}>{item}</option>)}</select></div><div className="select"><select value={activePlatform} onChange={e => setActivePlatform(e.target.value)}>{['All Platforms', 'Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads'].map(item => <option key={item}>{item}</option>)}</select></div><div className="select"><select><option>All Campaigns</option></select></div><button className="clear" onClick={() => {
            setDateRange('This Month');
            setBudgetPeriod('Monthly');
            setActivePlatform('All Platforms');
            setQuery('');
          }}>Clear Filters</button></div>
      {pageState !== 'main' ? <div className="section empty">{pageState === 'permission' ? <Lock size={34} /> : pageState === 'error' ? <AlertTriangle size={34} /> : <DollarSign size={34} />}<h2>{pageState === 'empty' ? 'No Advertising Budgets Yet' : pageState === 'no-results' ? 'No Budget Data Found' : pageState === 'limited' ? 'Budget Data Is Limited' : pageState === 'loading' ? 'Loading budget workspace…' : pageState === 'error' ? "Advertising Budgets Couldn't Be Loaded" : 'Budget Management Restricted'}</h2><p>{pageState === 'permission' ? "You don't have permission to view or modify advertising budgets." : pageState === 'empty' ? 'Connect an advertising platform or create your first advertising budget to begin monitoring advertising spend.' : pageState === 'no-results' ? 'No advertising budget data is available for the selected period or filters.' : pageState === 'limited' ? 'Some budget information is unavailable because the connected advertising platform does not provide sufficient data or permissions.' : pageState === 'loading' ? 'Lulu AI is gathering the latest platform data.' : pageState === 'error' ? 'Advertising budget information is temporarily unavailable.' : 'Your workspace is ready for budget management.'}</p><div className="empty-actions">{button(pageState === 'error' ? 'Try Again' : pageState === 'permission' ? 'Review Connections' : 'Set Budget', <Plus size={14} />, true, () => setPageState('main'))}{button('Connect Platform', <Link2 size={14} />, false, () => openModal('connect'))}</div></div> : <div>
      <div className="kpis">{[['Planned Budget', '—', 'This month', 'blue'], ['Actual Spend', '—', '— remaining', 'indigo'], ['Remaining Budget', '—', '34.9% left', 'green'], ['Budget Utilization', '65.1%', 'On track for month', 'teal'], ['Budget Variance', '+—', 'Under planned', 'green'], ['At Risk', '2', 'Allocations need attention', 'amber']].map(item => <article className="kpi" key={item[0]}><i className={'accent ' + item[3]} /><span>{item[0]}</span><strong>{item[1]}</strong><small>{item[2]}</small>{item[0] === 'Budget Utilization' && <div className="thin"><i /></div>}{item[0] === 'At Risk' && <AlertTriangle size={13} color="var(--chart-1)" style={{
                position: 'absolute',
                right: 13,
                bottom: 14
              }} />}</article>)}</div>
      <section className="section"><div className="section-head"><h2>Budget Utilization</h2><a href="#details">View Details</a></div><div className="util-grid"><div><div className="platform-row"><strong>Overall</strong><div className="bar"><i style={{
                      width: '65.1%',
                      background: 'var(--primary)'
                    }} /></div><em>—</em><small>— / —</small>{statusBadge('On Track')}</div>{visiblePlatforms.map(platform => <div className="platform-row" key={platform.name}><strong>{platform.name}</strong><div className="bar"><i style={{
                      width: platform.utilization + '%',
                      background: platform.color
                    }} /></div><em>{platform.utilization}%</em><small>{platform.spend} / {platform.budget}</small>{statusBadge(platform.status)}</div>)}</div><div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData}><defs><linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--foreground)" stopOpacity={.18} /><stop offset="100%" stopColor="var(--foreground)" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="day" tick={{
                        fontSize: 9,
                        fill: 'var(--muted-foreground)'
                      }} /><YAxis tick={{
                        fontSize: 9,
                        fill: 'var(--muted-foreground)'
                  }} tickFormatter={value => '€' + value / 1000 + 'k'} /><Tooltip formatter={value => ['€' + Number(value ?? 0).toLocaleString(), 'Spend']} contentStyle={{
                        fontSize: 10,
                        borderRadius: 7,
                        border: '1px solid var(--border)'
                      }} /><Area type="monotone" dataKey="planned" stroke="var(--foreground)" strokeDasharray="5 4" fill="none" /><Area type="monotone" dataKey="actual" stroke="var(--chart-4)" strokeWidth={2.5} fill="url(#actualFill)" /></AreaChart></ResponsiveContainer></div><div className="chart-legend"><span><i style={{
                      background: 'var(--chart-3)'
                    }} />Planned Budget</span><span><i style={{
                      background: 'var(--chart-4)'
                    }} />Actual Spend</span></div></div></div></section>
      <section className="section"><div className="section-head"><h2>Budget Pacing</h2><span className="label">JUNE 2025 — DAY 22 OF 30</span></div><div className="pacing-card"><div><span>Current pace vs expected pace</span><strong>—</strong>{statusBadge('On Track')}</div><div><span>Planned daily pace</span><b>—/day</b></div><div><span>Actual daily pace</span><b>—/day</b></div><div><span>Variance</span><b className="observed">-—/day</b></div><div><span>Est. month-end spend</span><b>—</b></div></div><div className="table-wrap"><table className="pacing-table"><thead><tr>{['Platform', 'Planned Pace', 'Actual Pace', 'Daily Variance', 'Est. Month-End', 'Status'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{pacingRows.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 5 ? statusBadge(cell) : cell}</td>)}</tr>)}</tbody></table></div><p className="note"><span className="estimated">Estimated</span> · Estimated projections are based on current spend pace. Actual results may vary.</p></section>
      <section className="section"><div className="section-head"><h2>Budget by Platform</h2><button className="btn" onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}><ArrowDownUp size={13} /> Sort {sortColumn}</button></div><div className="table-wrap"><table className="data-table"><thead><tr>{['Platform', 'Planned Budget', 'Actual Spend', 'Remaining', 'Utilization', 'Variance', 'Status', 'Actions'].map(label => <th key={label}>{label} <ArrowDownUp size={10} /></th>)}</tr></thead><tbody>{visiblePlatforms.map(platform => <tr key={platform.name}><td><strong>{platform.name}</strong></td><td>{platform.budget}</td><td>{platform.spend}</td><td>{platform.remaining}</td><td><div className="bar-cell"><div className="bar"><i style={{
                            width: platform.utilization + '%',
                            background: platform.color
                          }} /></div>{platform.utilization}%</div></td><td>{platform.variance}</td><td>{statusBadge(platform.status)}</td><td><div className="table-actions"><button className="mini" onClick={() => openModal('edit-budget')}>Edit Budget</button><button className="mini">View</button></div></td></tr>)}<tr className="total"><td>Total</td><td>—</td><td>—</td><td>—</td><td>—</td><td>-—</td><td>—</td><td>—</td></tr></tbody></table></div></section>
      <section className="section"><div className="section-head"><h2>Budget by Campaign</h2><div className="search"><Search size={13} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search campaigns..." /></div></div>{selectedRows.length > 0 && <div className="bulk"><strong>{selectedRows.length} selected</strong><button>Export</button><button>Edit Alert Thresholds</button><button>Create Task</button><button>Archive</button></div>}<div className="table-wrap"><table className="data-table"><thead><tr><th></th>{['Campaign', 'Platform', 'Budget', 'Spend', 'Remaining', 'Utilization', 'Pacing', 'Status', 'Actions'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{visibleCampaigns.map(campaign => <tr key={campaign.name}><td><input type="checkbox" checked={selectedRows.includes(campaign.name)} onChange={e => setSelectedRows(e.target.checked ? [...selectedRows, campaign.name] : selectedRows.filter(item => item !== campaign.name))} /></td><td><strong>{campaign.name}</strong></td><td>{campaign.platform}</td><td>{campaign.budget}</td><td>{campaign.spend}</td><td>{campaign.remaining}</td><td>{campaign.utilization}%</td><td>{statusBadge(campaign.pacing)}</td><td>{statusBadge(campaign.status)}</td><td><div className="table-actions"><button className="mini">View</button><button className="mini" onClick={() => openModal('edit-budget')}>Edit Budget</button></div></td></tr>)}</tbody></table></div><div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'var(--muted-foreground)',
              fontSize: 10,
              paddingTop: 13
            }}><span>Showing {visibleCampaigns.length} of 14 campaigns</span><span><button className="mini"><ChevronLeft size={12} /></button> <button className="mini">1</button> <button className="mini">2</button> <button className="mini"><ChevronRight size={12} /></button></span></div></section>
      <section className="section"><div className="section-head"><h2>Budget Allocation</h2>{button('Allocate Budget', <Plus size={13} />, false, () => openModal('allocate'))}</div><div className="allocation"><div className="donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={allocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={83} paddingAngle={2}>{allocationData.map(item => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={value => '€' + Number(value ?? 0).toLocaleString()} /><Legend iconType="circle" wrapperStyle={{
                      fontSize: 10
                    }} /></PieChart></ResponsiveContainer></div><div><table className="allocation-table"><thead><tr><th>Platform</th><th>Current Allocation</th><th>%</th><th>Recommended %</th><th>Difference</th></tr></thead><tbody>{[['Google Ads', '—', '41.7%', '38%', '-3.7%'], ['Meta Ads', '—', '31.3%', '35%', '+3.7%'], ['LinkedIn Ads', '—', '20.8%', '20%', '-0.8%'], ['TikTok Ads', '—', '6.2%', '7%', '+0.8%']].map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={index === 4 && cell.startsWith('+') ? 'observed' : index === 4 ? 'estimated' : ''}>{cell}</td>)}</tr>)}</tbody></table><div className="ai-note"><Sparkles size={12} /> Recommended allocation is <strong>AI Inferred</strong>. Changes require manual confirmation.</div></div></div></section>
      <section className="section forecast"><div className="section-head"><h2>Budget Forecast</h2><span className="status info"><Sparkles size={11} /> AI Forecast · ESTIMATED</span></div><div className="forecast-grid"><div><span className="label">BASED ON CURRENT SPEND PACE</span><div className="forecast-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={forecastData}><XAxis dataKey="day" tick={{
                        fontSize: 9,
                        fill: 'var(--muted-foreground)'
                      }} /><YAxis tick={{
                        fontSize: 9,
                        fill: 'var(--muted-foreground)'
                  }} tickFormatter={v => '€' + v / 1000 + 'k'} /><Tooltip formatter={value => '€' + Number(value ?? 0).toLocaleString()} contentStyle={{
                        fontSize: 10
                      }} /><Line type="monotone" dataKey="planned" stroke="var(--foreground)" strokeDasharray="5 4" dot={false} /><Line type="monotone" dataKey="estimate" stroke="var(--foreground)" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer></div></div><div><table className="metric-table"><tbody>{[['Current Spend', '—', 'Observed'], ['Current Pacing', '—/day', 'Observed'], ['Est. Month-End Spend', '—', 'Estimated'], ['Planned Budget', '—', 'Observed'], ['Expected Variance', '-—', 'Estimated']].map(row => <tr key={row[0]}><td>{row[0]}</td><td><strong>{row[1]}</strong><br /><span className={row[2] === 'Estimated' ? 'estimated' : 'observed'}>{row[2]}</span></td></tr>)}</tbody></table></div></div><p className="note">This forecast is based on current spend pacing and may not reflect future changes. Not a guarantee. · Data source: Lulu AI Budget Model · Updated 8 min ago</p></section>
      <section className="section"><div className="section-head"><h2>Budget Alerts</h2>{button('Configure Alert', <Plus size={13} />)}</div><div className="alert-list">{alerts.map(alert => <div className={'alert-row ' + alert.tone} key={alert.text}>{alert.tone === 'info' ? <Info size={17} /> : <AlertTriangle size={17} />}<div><strong>{alert.text}</strong><small>Campaign: {alert.meta}</small></div><div className="alert-actions"><button className="mini">Review</button><button className="mini">Create Task</button></div></div>)}</div></section>
      <section className="section"><div className="section-head"><h2>Budget History</h2><span className="label">RECENT CHANGES</span></div><div className="history">{[['Google Ads Monthly Budget', '— → —', '+— — Monthly budget increased to support summer campaign.', 'Workspace owner · Not available, 2025'], ['Meta Ads Monthly Budget', '— → —', '+— — Budget increased for brand awareness push.', 'Workspace owner · Not available, 2025'], ['LinkedIn Ads Monthly Budget', '—', 'Budget set for Q3 Lead Generation campaign.', 'Workspace owner · Not available, 2025'], ['TikTok Ads Monthly Budget', '— → —', '+— — Budget increased for UGC launch.', 'Workspace owner · Not available, 2025']].map(item => <div className="history-row" key={item[0]}><i /><strong>{item[0]}</strong><span>{item[1]}</span><span>{item[2]}</span><small>{item[3]}</small></div>)}</div></section>
      <section className="section"><div className="ai-card"><div className="ai-head"><Sparkles size={18} /><div><h2>Lulu AI Budget Analysis</h2><small>AI-GENERATED · UPDATED 4 MIN AGO</small></div><span className="confidence">—</span></div><div className="insights">{[['Current Situation', 'Total advertising spend is — of the —onthly plan, representing 65.1% utilization at day 22 of 30 (73.3% of the period elapsed). Overall pacing is slightly below plan.'], ['Key Changes', 'Google Ads and Meta Ads budgets were increased in early June to support the summer campaign strategy. LinkedIn Ads is performing below expected pace.'], ['Risks', 'LinkedIn Ads (52.8%) and TikTok Ads (46.0%) are significantly underspending. At current pace, an estimated — of planned budget will be unused this month.'], ['Opportunities', 'Meta Ads is showing strong efficiency relative to spend. A modest budget reallocation from underspending platforms could improve overall ROI.'], ['Recommended Priorities', '1. Review LinkedIn Ads campaign targeting and creative. 2. Consider reallocating up to — from underperforming budgets to Meta Ads. 3. Monitor Summer Product Launch budget exhaustion risk.']].map(item => <article className="insight" key={item[0]}><strong>{item[0]}</strong><p>{item[1]}</p></article>)}</div><footer>Data source: Lulu AI Budget Model + Platform APIs · Observed + AI Inferred</footer></div></section>
      <section className="section"><div className="section-head"><h2><Sparkles size={15} color="var(--primary)" /> Lulu AI Recommendations</h2><span className="label">AI-GENERATED · PRIORITIZED ACTIONS</span></div><div className="rec-grid">{[['High', 'LinkedIn Ads is significantly underspending. Review campaign targeting and creative performance to identify the cause.', 'LinkedIn Ads'], ['High', 'Summer Product Launch is at 78% budget with 8 days remaining. Monitor for early budget exhaustion.', 'Google Ads'], ['Medium', 'Consider reallocating — from LinkedIn Ads underspend to Meta Ads, which is showing stronger efficiency.', 'All platforms'], ['Medium', 'TikTok Ads is 27 percentage points below expected monthly pacing. Review campaign delivery settings.', 'TikTok Ads']].map(item => <article className="rec" key={item[1]}><span className={'priority ' + (item[0] === 'High' ? 'high' : 'medium')}>{item[0]} Priority</span><h3>{item[1]}</h3><span className="label">PLATFORM: {item[2]}</span><div className="rec-actions"><button>Review</button><button>Create Task</button>{item[0] === 'High' && <button>Ask Lulu AI</button>}</div></article>)}</div></section>
      <section className="section"><div className="section-head"><h2>Budget Opportunities</h2><Sparkles size={15} color="var(--primary)" /></div><div className="opportunity-grid">{[['Reallocate underutilized LinkedIn Ads budget', '47.2% underspend vs plan', 'High', 'Q3 Lead Gen · LinkedIn Ads'], ['Meta Ads showing stronger efficiency — consider increasing allocation', '68.4% utilization with strong ROAS signals', 'Medium', 'Meta Ads'], ['Consolidate underspending TikTok budget with main summer push', 'Only 46% utilized at day 22', 'Medium', 'TikTok Ads']].map(item => <article className="opportunity" key={item[0]}><span className="label">POTENTIAL: {item[2]}</span><h3>{item[0]}</h3><p>Evidence: {item[1]}<br />{item[3]}</p><div className="rec-actions"><button>Review</button><button>Create Task</button></div></article>)}</div></section>
      <section className="section"><div className="section-head"><h2>Budget Risks</h2><CircleAlert size={15} color="var(--chart-1)" /></div><div className="risk-grid">{[['High', 'Budget exhaustion risk for Summer Product Launch', 'Summer Product Launch · Google Ads', '78% utilized, 8 days remaining, pacing accelerating'], ['Medium', 'Persistent underspending may indicate campaign delivery issues', 'Q3 Lead Generation · LinkedIn Ads', '52.8% utilized at day 22, consistently below pace']].map(item => <article className={'risk ' + (item[0] === 'High' ? 'high-risk' : '')} key={item[1]}><span className={'priority ' + (item[0] === 'High' ? 'high' : 'medium')}>{item[0]} Severity</span><h3>{item[1]}</h3><p>Campaign: {item[2]}<br />Evidence: {item[3]}</p><div className="rec-actions"><button>Review</button><button>Create Task</button></div></article>)}</div></section>
      </div>}</section></main>
      {activeModal && <div className="modal-backdrop"><div className="modal" role="dialog" aria-modal="true"><div className="modal-header"><div><div className="eyebrow">ADVERTISING OPERATIONS</div><h2>{activeModal === 'set-budget' ? 'Set Advertising Budget' : activeModal === 'edit-budget' ? 'Edit Budget' : activeModal === 'allocate' ? 'Allocate Budget' : activeModal === 'connect' ? 'Connect Advertising Platform' : 'Export Budget Data'}</h2></div><button onClick={() => setActiveModal(null)} aria-label="Close"><X size={18} /></button></div>{activeModal === 'allocate' && <div className="steps">{['Period', 'Platforms', 'Allocation', 'Review', 'Confirm'].map((step, index) => <span className={allocateStep === index + 1 ? 'active' : allocateStep > index + 1 ? 'done' : ''} key={step}><b>{allocateStep > index + 1 ? <Check size={11} /> : index + 1}</b>{step}</span>)}</div>}<div className="modal-body">{activeModal === 'connect' ? <div className="platform-cards">{[['Google Ads', 'G', 'Search and display advertising', 'Connected'], ['Meta Ads', '∞', 'Facebook and Instagram advertising', 'Connected'], ['Microsoft Advertising', 'MS', 'Bing search advertising', 'Not Connected'], ['LinkedIn Ads', 'in', 'Professional B2B advertising', 'Connected'], ['TikTok Ads', '♪', 'Short-form video advertising', 'Connected']].map(item => <article className="platform-card" key={item[0]}><strong>{item[1]} · {item[0]}</strong><p>{item[2]}</p>{statusBadge(item[3] === 'Connected' ? 'On Track' : 'Underspending')}<button className="mini">{item[3] === 'Connected' ? 'Connected ✓' : 'Connect'}</button></article>)}</div> : activeModal === 'export' ? <div><p>What to export</p>{['Budget Summary', 'Platform Budgets', 'Campaign Budgets', 'Budget History', 'Budget Alerts'].map(item => <label className="checkbox" key={item}><input type="checkbox" defaultChecked /> {item}</label>)}<p>Format</p><div className="empty-actions">{['CSV', 'Excel', 'PDF'].map(item => <button className="btn" key={item}>{item}</button>)}</div></div> : activeModal === 'allocate' ? <div><p><strong>— total</strong></p><div className="thin"><i style={{
                width: '65%'
              }} /></div><p>Select Budget Period</p>{['Monthly', 'Quarterly', 'Campaign Lifetime'].map(item => <label className="radio" key={item}><input type="radio" name="period" defaultChecked={item === 'Monthly'} />{item}</label>)}<p className="note">Budget allocation changes require confirmation. This will update your Lulu AI budget plan.</p></div> : <div className="form-grid"><label className="full">{activeModal === 'edit-budget' ? 'Budget Amount' : 'Budget Name'}<input defaultValue={activeModal === 'edit-budget' ? '20000' : ''} placeholder={activeModal === 'edit-budget' ? '—' : 'e.g. Google Ads — July 2025'} /></label>{activeModal === 'set-budget' && <><label>Platform<select><option>Google Ads</option><option>Meta Ads</option><option>LinkedIn Ads</option><option>TikTok Ads</option></select></label><label>Campaign<select><option>All campaigns</option><option>Summer Product Launch</option><option>Q3 Lead Generation</option></select></label><label>Budget Amount<input placeholder="—" /></label><label>Budget Period<select><option>Monthly</option><option>Daily</option><option>Campaign Lifetime</option></select></label><label>Start Date<input type="date" defaultValue="2025-06-01" /></label><label>End Date<input type="date" defaultValue="2025-06-30" /></label><label className="full">Alert Threshold (%)<input placeholder="Notify me when utilization reaches 80%" /></label></>}{activeModal === 'edit-budget' && <label className="full">Alert Threshold<input defaultValue="80" /></label>}<div className="review full"><p><span>Current Budget</span><strong>—</strong></p><p><span>New Budget</span><strong>—</strong></p><p><span>Change</span><strong>—</strong></p><p><span>Effective Date</span><strong>—</strong></p></div><p className="note full">Budget values are saved in Lulu AI. Platform budgets are updated separately through platform sync.</p></div>}</div><div className="modal-footer"><button className="btn" onClick={() => setActiveModal(null)}>Cancel</button><div>{activeModal === 'allocate' && <button className="btn" onClick={() => setAllocateStep(Math.max(1, allocateStep - 1))}>Back</button>}<button className="btn primary" onClick={() => activeModal === 'allocate' && allocateStep < 5 ? setAllocateStep(allocateStep + 1) : setActiveModal(null)}>{activeModal === 'allocate' && allocateStep < 5 ? 'Continue' : activeModal === 'export' ? 'Export' : activeModal === 'edit-budget' ? 'Save Changes' : activeModal === 'connect' ? 'Close' : activeModal === 'allocate' ? 'Confirm Allocation' : 'Save Budget'}</button></div></div></div></div>}
  </div>;
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
          <span data-lulu-section-soon={section.label !== "Website" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
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
