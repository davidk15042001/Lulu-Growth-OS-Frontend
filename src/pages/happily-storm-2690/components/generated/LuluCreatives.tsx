import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, Archive, ArrowDownUp, BarChart3, Bell, Check, ChevronDown, ChevronRight, CircleAlert, Copy, Download, Edit3, Ellipsis, FileText, Globe2, Image, Layers, LayoutDashboard, LayoutGrid, Link2, Megaphone, MoreHorizontal, Plus, RefreshCw, Search, SearchX, Settings2, Share2, Sparkles, Table2, Tag, Target, Upload, Users, Video, X, Zap } from 'lucide-react';
type ViewMode = 'grid' | 'list' | 'performance';
type Modal = 'create' | 'upload' | 'edit' | 'duplicate' | 'archive' | 'connect' | 'sync' | null;
type Creative = {
  name: string;
  platform: string;
  format: string;
  campaign: string;
  status: string;
  performance: string;
  updated: string;
  gradient: string;
};
const navItems = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'Campaigns',
  icon: BarChart3
}, {
  label: 'Content',
  icon: FileText
}, {
  label: 'SEO',
  icon: Search
}, {
  label: 'GEO',
  icon: Globe2
}, {
  label: 'AEO',
  icon: Target
}, {
  label: 'Social',
  icon: Share2
}, {
  label: 'Advertising',
  icon: Megaphone
}, {
  label: 'Audiences',
  icon: Users
}, {
  label: 'Automations',
  icon: Zap
}, {
  label: 'Analytics',
  icon: Activity
}];
const platforms = [{
  label: 'All Platforms',
  tone: 'all'
}, {
  label: 'Google Ads',
  tone: 'google'
}, {
  label: 'Meta Ads',
  tone: 'meta'
}, {
  label: 'LinkedIn Ads',
  tone: 'linkedin'
}, {
  label: 'TikTok Ads',
  tone: 'tiktok'
}];
const creatives: Creative[] = [{
  name: 'Summer Sale — Hero Image',
  platform: 'Google Ads',
  format: 'Image Ad',
  campaign: 'Summer Product Launch',
  status: 'Active',
  performance: 'Top Performing',
  updated: '2 days ago',
  gradient: 'sunset'
}, {
  name: 'Q3 Brand Awareness Video',
  platform: 'Meta Ads',
  format: 'Video Ad',
  campaign: 'Brand Awareness Drive',
  status: 'Active',
  performance: 'Stable',
  updated: '4 days ago',
  gradient: 'violet'
}, {
  name: 'Product Carousel — EU Markets',
  platform: 'Meta Ads',
  format: 'Carousel',
  campaign: 'New Market Expansion',
  status: 'Active',
  performance: 'Top Performing',
  updated: '5 days ago',
  gradient: 'sky'
}, {
  name: 'Retargeting — Dynamic Display',
  platform: 'Google Ads',
  format: 'Responsive Ad',
  campaign: 'Customer Retention Q2',
  status: 'Active',
  performance: 'Declining',
  updated: '1 week ago',
  gradient: 'ink'
}, {
  name: 'LinkedIn Lead Gen — Enterprise',
  platform: 'LinkedIn Ads',
  format: 'Image Ad',
  campaign: 'Q3 Lead Generation',
  status: 'Paused',
  performance: 'Stable',
  updated: '1 week ago',
  gradient: 'blue'
}, {
  name: 'TikTok UGC — Product Launch',
  platform: 'TikTok Ads',
  format: 'Video Ad',
  campaign: 'Summer Product Launch',
  status: 'Active',
  performance: 'Underperforming',
  updated: '2 weeks ago',
  gradient: 'pink'
}];
const chartData = [{
  day: 'Jun 10',
  value: 28
}, {
  day: 'Jun 15',
  value: 34
}, {
  day: 'Jun 20',
  value: 31
}, {
  day: 'Jun 25',
  value: 46
}, {
  day: 'Jun 30',
  value: 42
}, {
  day: 'Jul 05',
  value: 57
}, {
  day: 'Jul 08',
  value: 64
}];
const filters = ['Platform', 'Creative Type', 'Status', 'Campaign', 'Performance', 'Date', 'Tags'];
const stats = [['Total Creatives', '247', 'Across all platforms', 'indigo'], ['Active Creatives', '184', '+12 this week', 'green'], ['Top Performing', '38', 'Above average CTR', 'blue'], ['Underperforming', '24', 'Declining performance', 'amber'], ['Needs Attention', '9', 'Errors or issues', 'red']];
export function LuluCreatives() {
  const [activeView, setActiveView] = useState<ViewMode>('grid');
  const [activePlatform, setActivePlatform] = useState('All Platforms');
  const [selectedCreative, setSelectedCreative] = useState(0);
  const [activeModal, setActiveModal] = useState<Modal>(null);
  const [createStep, setCreateStep] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const { items: liveCreatives, loading: liveLoading, error: liveError } = useLiveRecords('ad_creatives');
  const liveEmpty = !liveLoading && !liveError && liveCreatives.length === 0;
  const [activeTab, setActiveTab] = useState<'creatives' | 'comparison'>('creatives');
  const selected = creatives[selectedCreative];
  const visible = creatives.filter(item => item.name.toLowerCase().includes(query.toLowerCase()) && (activePlatform === 'All Platforms' || item.platform === activePlatform));
  const openModal = (modal: Modal) => setActiveModal(modal);
  return <div className="lulu-shell">
    <style>{`*{box-sizing:border-box}button,input,select{font:inherit}.lulu-shell{display:flex;min-height:100vh;background:var(--sidebar);color:var(--foreground);font:12px Inter,system-ui,sans-serif}.sidebar{width:232px;flex:0 0 232px;background:var(--sidebar);color:var(--muted-foreground);display:flex;flex-direction:column;padding:22px 12px 14px}.brand{display:flex;align-items:center;gap:9px;color:var(--foreground);font-size:18px;padding:0 12px 25px}.brand b{color:var(--foreground)}.brand-mark{width:27px;height:27px;display:grid;place-items:center;border-radius:8px;background:var(--primary);color:var(--primary-foreground)}.workspace{border:1px solid var(--muted-foreground);background:var(--background);border-radius:9px;padding:10px;display:flex;align-items:center;gap:8px;margin-bottom:25px}.workspace-avatar,.user-avatar,.top-avatar{display:grid;place-items:center;font-size:10px;font-weight:700}.workspace-avatar{width:27px;height:27px;border-radius:7px;background:var(--primary);color:var(--primary-foreground)}.workspace strong,.user strong{display:block;font-size:11px;color:var(--foreground)}.workspace small,.user small{display:block;font-size:10px;margin-top:3px;color:var(--muted-foreground)}.workspace svg{margin-left:auto}.nav-caption,.eyebrow,.panel-label{font-size:9px;letter-spacing:1.3px;font-weight:700;color:var(--muted-foreground)}.nav-caption{padding:0 12px;margin:0 0 9px}.nav-item{border:0;background:transparent;color:var(--muted-foreground);width:100%;display:flex;align-items:center;gap:11px;padding:9px 12px;border-radius:7px;text-align:left;font-size:12px;margin:2px 0}.nav-item:hover,.nav-item.active{background:var(--background);color:var(--foreground)}.nav-item.active{box-shadow:inset 3px 0 var(--foreground)}.subnav{padding:2px 0 7px 39px;border-left:1px solid var(--muted-foreground);margin-left:23px}.subnav button{display:block;background:none;border:0;color:var(--muted-foreground);padding:6px 0;font-size:10px;text-align:left}.subnav button.active{color:var(--foreground);font-weight:700}.sidebar-bottom{margin-top:auto}.user{border-top:1px solid var(--muted-foreground);margin-top:13px;padding:16px 8px 0;display:flex;align-items:center;gap:8px}.user-avatar,.top-avatar{width:28px;height:28px;border-radius:50%;background:var(--secondary);color:var(--foreground)}.user svg{margin-left:auto}.main-content{min-width:0;flex:1}.topbar{height:58px;background:var(--card);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 30px}.crumb{display:flex;align-items:center;gap:8px;color:var(--muted-foreground)}.crumb strong{color:var(--muted-foreground)}.top-actions{display:flex;align-items:center;gap:19px}.icon-button{border:0;background:transparent;color:var(--muted-foreground);position:relative}.icon-button i{width:5px;height:5px;background:var(--primary);border-radius:50%;position:absolute;right:0;top:0;color:var(--primary-foreground)}.page-content{padding:27px 30px 40px;max-width:1600px;margin:auto}.page-heading{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px}.page-heading h1{margin:5px 0 6px;font-size:28px;letter-spacing:-.8px}.page-heading p{margin:0;color:var(--muted-foreground)}.heading-actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.ghost-button,.primary-button,.mini-button{border:1px solid var(--border);border-radius:7px;padding:8px 10px;background:var(--card);color:var(--muted-foreground);display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:600}.ghost-button:hover,.mini-button:hover{border-color:var(--foreground);color:var(--foreground)}.primary-button{background:var(--primary);color:var(--primary-foreground);border-color:var(--primary-foreground);box-shadow:0 3px 8px var(--foreground)}.view-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.segmented{display:flex;background:var(--card);border:1px solid var(--border);border-radius:7px;padding:3px}.segmented button{border:0;background:transparent;padding:7px 10px;color:var(--muted-foreground);font-size:10px;display:flex;align-items:center;gap:6px;border-radius:5px}.segmented button.active{background:var(--secondary);color:var(--foreground);font-weight:700}.platform-tabs{display:flex;gap:7px;overflow:auto;margin-bottom:17px}.platform-tab{border:1px solid var(--border);background:var(--card);border-radius:15px;padding:7px 11px;color:var(--muted-foreground);display:flex;align-items:center;gap:7px;white-space:nowrap;font-size:10px}.platform-tab.active{border-color:var(--foreground);background:var(--secondary);color:var(--foreground)}.platform-icon{width:17px;height:17px;display:grid;place-items:center;border-radius:50%;font-size:9px;font-weight:800}.all{background:var(--secondary);color:var(--foreground)}.google{background:var(--secondary);color:var(--foreground)}.meta{background:var(--secondary);color:var(--foreground)}.linkedin{background:var(--secondary);color:var(--chart-4)}.tiktok{background:var(--secondary);color:var(--foreground)}.connected{color:var(--chart-4);font-size:8px}.kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:18px}.kpi-card{background:var(--card);border:1px solid var(--border);border-radius:9px;padding:13px 14px;position:relative}.kpi-card .accent{position:absolute;right:13px;top:14px;width:7px;height:7px;border-radius:50%}.kpi-card .indigo{background:var(--primary);color:var(--primary-foreground)}.kpi-card .green{background:var(--primary);color:var(--primary-foreground)}.kpi-card .blue{background:var(--primary);color:var(--primary-foreground)}.kpi-card .amber{background:var(--primary);color:var(--primary-foreground)}.kpi-card .red{background:var(--primary);color:var(--primary-foreground)}.kpi-card span{color:var(--muted-foreground);font-size:10px}.kpi-card strong{display:block;font-size:21px;margin:7px 0 3px}.kpi-card small{color:var(--muted-foreground);font-size:9px}.workspace-grid{display:grid;grid-template-columns:minmax(0,1.62fr) minmax(380px,.9fr);gap:18px;align-items:start}.creative-list,.detail-panel{background:var(--card);border:1px solid var(--border);border-radius:10px;min-width:0}.list-toolbar{padding:14px;border-bottom:1px solid var(--border)}.search-box{height:34px;border:1px solid var(--border);border-radius:6px;display:flex;align-items:center;gap:8px;padding:0 10px;color:var(--muted-foreground)}.search-box input{border:0;outline:0;flex:1;font-size:11px;color:var(--foreground)}.filter-row{display:flex;gap:6px;padding:10px 14px;border-bottom:1px solid var(--border);overflow:auto}.select-control,.clear-button{display:flex;align-items:center;gap:6px;white-space:nowrap;border:1px solid var(--border);border-radius:5px;background:var(--card);color:var(--muted-foreground);padding:7px 8px;font-size:10px}.clear-button{margin-left:auto;border:0;color:var(--foreground)}.quick-chips{display:flex;gap:6px;margin-top:10px;overflow:auto}.quick-chip{white-space:nowrap;border:1px solid var(--border);background:var(--card);color:var(--muted-foreground);border-radius:5px;font-size:10px;padding:6px 8px}.bulk-bar{display:flex;align-items:center;gap:14px;padding:9px 14px;background:var(--card);color:var(--foreground)}.bulk-bar button{border:0;background:none;color:var(--foreground);font-size:10px}.creative-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;padding:14px}.creative-card{border:1px solid var(--border);border-radius:8px;overflow:hidden;transition:.2s;background:var(--card)}.creative-card:hover,.creative-card.selected{border-color:var(--foreground);box-shadow:0 4px 15px var(--foreground)}.preview{height:126px;position:relative;display:grid;place-items:center;color:var(--foreground);letter-spacing:.3px;font-size:11px}.preview.sunset{background:linear-gradient(135deg,var(--primary),var(--primary));color:var(--primary-foreground)}.preview.violet{background:linear-gradient(135deg,var(--primary),var(--primary));color:var(--primary-foreground)}.preview.sky{background:linear-gradient(135deg,var(--primary),var(--primary));color:var(--primary-foreground)}.preview.ink{background:linear-gradient(135deg,var(--muted),var(--background))}.preview.blue{background:linear-gradient(135deg,var(--primary),var(--primary));color:var(--primary-foreground)}.preview.pink{background:linear-gradient(135deg,var(--primary),var(--primary));color:var(--primary-foreground)}.platform-badge{position:absolute;right:8px;top:8px;background:var(--card);color:var(--muted-foreground);border-radius:4px;padding:4px 6px;font-size:8px}.performance{position:absolute;left:8px;top:8px;background:var(--card);border-radius:4px;padding:4px 6px;font-size:8px;color:var(--muted-foreground);display:flex;align-items:center;gap:4px}.performance i,.status-badge i{width:5px;height:5px;border-radius:50%;background:currentColor}.top{color:var(--foreground)}.stable{color:var(--foreground)}.declining{color:var(--foreground)}.under{color:var(--chart-1)}.card-body{padding:11px}.card-body h3{font-size:12px;margin:0 0 4px;color:var(--foreground)}.campaign-label,.meta-line{color:var(--muted-foreground);font-size:9px}.meta-line{display:flex;justify-content:space-between;margin-top:11px}.status-badge{display:inline-flex;align-items:center;gap:5px;font-size:9px;border-radius:12px;padding:4px 7px;font-weight:650}.status-active{background:var(--secondary);color:var(--chart-4)}.status-paused{background:var(--secondary);color:var(--foreground)}.actions-row{display:flex;gap:5px;margin-top:11px}.actions-row button{border:1px solid var(--border);background:var(--card);color:var(--muted-foreground);border-radius:5px;padding:5px 7px;font-size:9px;display:flex;align-items:center;gap:4px}.actions-row button:hover{color:var(--foreground)}.table-footer{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;color:var(--muted-foreground);font-size:10px;border-top:1px solid var(--border)}.load-more{border:1px solid var(--border);background:var(--card);border-radius:5px;padding:6px 10px;color:var(--foreground);font-size:10px}.detail-panel{overflow:hidden}.detail-top{padding:17px 18px 12px;display:flex;justify-content:space-between}.detail-top h2{font-size:17px;margin:5px 0 9px;letter-spacing:-.3px}.close-detail{border:0;background:transparent;color:var(--muted-foreground);height:24px}.detail-actions{padding:0 18px 14px;display:flex;gap:5px;border-bottom:1px solid var(--border);overflow:auto}.detail-actions button{border:1px solid var(--border);background:var(--card);color:var(--muted-foreground);border-radius:5px;padding:6px 7px;font-size:9px;display:flex;align-items:center;gap:4px;white-space:nowrap}.detail-actions .ai-button{color:var(--foreground);border-color:var(--foreground);background:var(--card)}.detail-scroll{max-height:765px;overflow:auto}.overview,.panel-section,.ai-section{padding:15px 18px;border-bottom:1px solid var(--border)}.preview.large{height:150px;border-radius:7px;margin:0 0 14px}.overview dl{display:grid;grid-template-columns:1fr 1fr;gap:11px 14px;margin:0}.overview dt{color:var(--muted-foreground);font-size:9px;margin-bottom:4px}.overview dd{margin:0;color:var(--muted-foreground);font-size:10px}.section-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.section-title h3,.ai-heading h3{font-size:12px;margin:0;color:var(--foreground)}.mini-select{display:flex;align-items:center;gap:5px;border:1px solid var(--border);border-radius:5px;background:var(--card);color:var(--muted-foreground);padding:5px 7px;font-size:9px}.approval{display:flex;justify-content:space-between;background:var(--secondary);border-radius:6px;padding:9px;color:var(--foreground);font-size:10px}.performance-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.performance-stat span,.performance-stat small{display:block;color:var(--muted-foreground);font-size:9px}.performance-stat strong{display:block;color:var(--foreground);font-size:14px;margin:5px 0 3px}.performance-stat small{color:var(--chart-4)}.chart{margin-top:9px}.chart-labels{display:flex;justify-content:space-between;color:var(--muted-foreground);font-size:8px}.signal{display:grid;grid-template-columns:8px 1fr auto;gap:7px;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:9px}.signal i{width:7px;height:7px;border-radius:50%;background:var(--primary);color:var(--primary-foreground)}.signal.warning i{background:var(--chart-1)}.signal strong{display:block;color:var(--muted-foreground)}.signal small{display:block;color:var(--muted-foreground);margin-top:3px}.signal b{font-size:9px;color:var(--foreground)}.signal.warning b{color:var(--chart-1)}.ai-section{background:var(--card)}.ai-heading{display:flex;gap:8px;align-items:flex-start;margin-bottom:11px;color:var(--foreground)}.ai-heading small{color:var(--muted-foreground);font-size:8px;letter-spacing:.5px;display:block;margin-top:4px}.confidence{margin-left:auto;font-size:10px;color:var(--foreground);font-weight:700}.insight{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:9px;margin:6px 0}.insight strong{display:block;color:var(--muted-foreground);font-size:9px}.insight span{display:block;color:var(--muted-foreground);font-size:9px;line-height:1.4;margin-top:4px}.recommendation{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:9px;margin:6px 0}.recommendation strong{display:block;color:var(--muted-foreground);font-size:9px;line-height:1.35}.recommendation small{display:block;color:var(--muted-foreground);font-size:8px;margin-top:5px}.rec-actions{display:flex;gap:8px;margin-top:8px}.rec-actions button{border:0;background:none;padding:0;color:var(--foreground);font-size:9px;font-weight:600}.variant-row,.opportunity,.risk{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:9px}.variant-row strong,.opportunity strong,.risk strong{color:var(--muted-foreground)}.variant-row small,.opportunity small,.risk small{display:block;color:var(--muted-foreground);margin-top:3px}.add-variant{margin-top:10px;border:1px dashed var(--border);background:var(--card);border-radius:5px;color:var(--foreground);padding:7px 9px;font-size:9px}.modal-backdrop{position:fixed;inset:0;background:var(--background);display:grid;place-items:center;z-index:20;padding:20px}.modal{width:min(620px,100%);background:var(--card);border-radius:12px;box-shadow:0 18px 60px var(--muted-foreground);overflow:hidden}.modal-header{display:flex;justify-content:space-between;padding:21px 24px 17px;border-bottom:1px solid var(--border)}.modal-header h2{margin:5px 0 0;font-size:20px}.modal-header button{border:0;background:none;color:var(--muted-foreground)}.steps{display:flex;justify-content:space-between;padding:15px 24px;border-bottom:1px solid var(--border)}.steps div{display:flex;align-items:center;gap:5px;color:var(--muted-foreground);font-size:9px}.steps span{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--border)}.steps .current{color:var(--foreground)}.steps .current span,.steps .done span{background:var(--primary);color:var(--primary-foreground);border-color:var(--primary-foreground)}.modal-body{padding:21px 24px}.modal-body label{display:block;color:var(--muted-foreground);font-size:10px;font-weight:600;margin-bottom:14px}.modal-body input,.modal-body textarea,.modal-body select{display:block;width:100%;margin-top:6px;border:1px solid var(--border);border-radius:6px;padding:9px 10px;color:var(--muted-foreground);outline-color:var(--foreground);font-size:11px;background:var(--card)}.modal-body textarea{height:70px}.upload-zone{border:1px dashed var(--border);background:var(--card);border-radius:8px;padding:34px;text-align:center;color:var(--muted-foreground)}.upload-zone svg{color:var(--foreground);margin-bottom:8px}.modal-footer{display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:var(--card);border-top:1px solid var(--border)}.danger{background:var(--primary);color:var(--primary-foreground);border-color:var(--primary-foreground)}.platform-cards{display:grid;grid-template-columns:1fr 1fr;gap:9px}.platform-card{border:1px solid var(--border);border-radius:7px;padding:12px}.platform-card strong{display:block;font-size:11px}.platform-card p{color:var(--muted-foreground);font-size:9px;line-height:1.4}.platform-card button{border:1px solid var(--border);background:var(--sidebar);color:var(--foreground);border-radius:5px;padding:5px 8px;font-size:9px}@media(max-width:1200px){.sidebar{width:205px;flex-basis:205px}.workspace-grid{grid-template-columns:minmax(0,1.2fr) minmax(350px,1fr)}.kpi-grid{grid-template-columns:repeat(3,1fr)}.filter-row{flex-wrap:wrap}.clear-button{margin-left:0}}@media(max-width:900px){.sidebar{width:60px;flex-basis:60px;padding:18px 8px}.brand span,.workspace div:not(.workspace-avatar),.workspace>svg,.nav-caption,.nav-item span,.user div:not(.user-avatar),.user>svg,.subnav{display:none}.brand{padding:0 8px 25px}.workspace{padding:7px;justify-content:center}.nav-item{justify-content:center;padding:10px}.user{justify-content:center}.page-content{padding:20px 15px}.workspace-grid{grid-template-columns:1fr}.detail-panel{display:block}.page-heading{align-items:flex-start;gap:15px;flex-direction:column}.heading-actions{justify-content:flex-start}.topbar{padding:0 15px}}@media(max-width:620px){.sidebar{display:none}.page-content{padding:17px 10px}.page-heading h1{font-size:24px}.heading-actions{width:100%;overflow:auto;flex-wrap:nowrap}.heading-actions button{white-space:nowrap}.kpi-grid{grid-template-columns:repeat(2,1fr)}.creative-grid{grid-template-columns:1fr}.view-row{align-items:flex-start;gap:10px;flex-direction:column}.topbar{height:52px}.modal{max-height:92vh;overflow:auto}.platform-cards{grid-template-columns:1fr}.steps{overflow:auto;gap:12px}.steps div{flex-direction:column;min-width:55px}}`}</style>
    <aside className="sidebar"><div className="brand"><div className="brand-mark"><Sparkles size={17} /></div><span>Lulu <b>AI</b></span></div><div className="workspace"><div className="workspace-avatar">AC</div><div><strong>Workspace advertising</strong><small>Business OS</small></div><ChevronDown size={15} /></div><LuluSectionNavigation activeId="happily-storm-2690" /><div className="sidebar-bottom"><button className="nav-item"><Settings2 size={17} /><span>Settings</span></button><div className="user"><div className="user-avatar">JD</div><div><strong>Workspace administrator</strong><small>Administrator</small></div><MoreHorizontal size={16} /></div></div></aside>
    <main className="main-content">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">Loading live advertising creatives…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-4 py-3 text-xs text-muted-foreground">No live advertising creatives are available yet. Connect an advertising platform or upload a creative to begin.</div> : null}<header className="topbar"><div className="crumb"><span>Advertising</span><ChevronRight size={14} /><strong>Creatives</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-avatar">JD</div></div></header><section className="page-content">
      <div className="page-heading"><div><div className="eyebrow">ADVERTISING WORKSPACE</div><h1>Creatives</h1><p>Manage, review and optimize the creative assets used across your advertising campaigns.</p></div><div className="heading-actions"><button className="primary-button" onClick={() => {
              openModal('create');
              setCreateStep(1);
            }}><Plus size={15} />Create Creative</button><button className="ghost-button" onClick={() => openModal('upload')}><Upload size={14} />Upload Creative</button><button className="ghost-button" onClick={() => openModal('sync')}><RefreshCw size={14} />Sync Creatives</button><button className="ghost-button" onClick={() => openModal('connect')}><Link2 size={14} />Connect Platform</button><button className="ghost-button"><Download size={14} />Export</button><button className="ghost-button"><RefreshCw size={14} />Refresh</button><button className="ghost-button"><Sparkles size={14} />Ask Lulu AI</button></div></div>
      <div className="view-row"><div className="segmented">{[['grid', LayoutGrid, 'Grid View'], ['list', Table2, 'List View'], ['performance', BarChart3, 'Performance View']].map(([mode, Icon, label]) => <button key={String(mode)} className={activeView === mode ? 'active' : ''} onClick={() => setActiveView(mode as ViewMode)}><Icon size={14} />{String(label)}</button>)}</div><span className="panel-label">247 CREATIVE ASSETS</span></div>
      <div className="platform-tabs">{platforms.map(platform => <button key={platform.label} className={'platform-tab ' + (activePlatform === platform.label ? 'active' : '')} onClick={() => setActivePlatform(platform.label)}><span className={'platform-icon ' + platform.tone}>{platform.tone === 'all' ? '✦' : platform.tone === 'google' ? 'G' : platform.tone === 'meta' ? '∞' : platform.tone === 'linkedin' ? 'in' : '♪'}</span>{platform.label}{platform.label !== 'All Platforms' && <small className="connected">● Connected</small>}</button>)}</div>
      <div className="kpi-grid">{stats.map(stat => <article className="kpi-card" key={stat[0]}><i className={'accent ' + stat[3]} /><span>{stat[0]}{stat[0] === 'Needs Attention' && <Bell size={11} style={{
                marginLeft: 5,
                verticalAlign: 'middle'
              }} />}</span><strong>{stat[1]}</strong><small>{stat[2]}</small></article>)}</div>
      <div className="workspace-grid"><section className="creative-list" aria-label="Creative assets"><div className="list-toolbar"><div className="search-box"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search creatives..." aria-label="Search creatives" /></div><div className="quick-chips">{['All', 'Active', 'Top Performing', 'Underperforming', 'Needs Attention', 'Fatigue Detected'].map(chip => <button className="quick-chip" key={chip}>{chip}</button>)}<button className="quick-chip">Clear Filters</button></div></div><div className="filter-row">{filters.map(filter => <button className="select-control" key={filter}>{filter}<ChevronDown size={12} /></button>)}<button className="clear-button">Clear Filters</button></div>{selectedRows.length > 0 && <div className="bulk-bar"><strong>{selectedRows.length} selected</strong><button>Sync</button><button>Archive</button><button>Add Tags</button><button>Export</button><button>Create Task</button></div>}
        {activeTab === 'creatives' ? <div className="creative-grid">{visible.map((creative, index) => <article className={'creative-card ' + (selected.name === creative.name ? 'selected' : '')} key={creative.name} onClick={() => setSelectedCreative(creatives.findIndex(item => item.name === creative.name))}><div className={'preview ' + creative.gradient}><span>{creative.format}</span><span className="performance"><i className={creative.performance === 'Top Performing' ? 'top' : creative.performance === 'Stable' ? 'stable' : creative.performance === 'Declining' ? 'declining' : 'under'} />{creative.performance}</span><span className="platform-badge">{creative.platform}</span></div><div className="card-body"><h3>{creative.name}</h3><span className="campaign-label">{creative.campaign}</span><div className="meta-line"><span>{creative.format.replace(' Ad', '')}</span><span className={'status-badge ' + (creative.status === 'Active' ? 'status-active' : 'status-paused')}><i />{creative.status}</span></div><div className="meta-line"><span>Updated {creative.updated}</span><span>● Google API</span></div><div className="actions-row"><button onClick={event => {
                      event.stopPropagation();
                      setSelectedCreative(creatives.findIndex(item => item.name === creative.name));
                    }}><ChevronRight size={12} />Open</button><button onClick={event => {
                      event.stopPropagation();
                      openModal('edit');
                    }}><Edit3 size={12} />Edit</button><button aria-label="More actions"><Ellipsis size={14} /></button></div></div></article>)}</div> : <div className="table-wrap"><table><thead><tr><th /><th>CREATIVE <ArrowDownUp size={11} /></th><th>PLATFORM</th><th>STATUS</th><th>CTR</th><th>SPEND</th><th>UPDATED</th></tr></thead><tbody>{visible.map(creative => <tr key={creative.name}><td><input type="checkbox" checked={selectedRows.includes(creative.name)} onChange={event => setSelectedRows(event.target.checked ? [...selectedRows, creative.name] : selectedRows.filter(name => name !== creative.name))} /></td><td><strong>{creative.name}</strong><small>{creative.campaign}</small></td><td>{creative.platform}</td><td><span className={'status-badge ' + (creative.status === 'Active' ? 'status-active' : 'status-paused')}><i />{creative.status}</span></td><td>{creative.name === selected.name ? '2.41%' : '1.82%'}</td><td>€4,820</td><td>{creative.updated}</td></tr>)}</tbody></table></div>}
        <div className="table-footer"><span>Showing {visible.length} of 184 creatives</span><button className="load-more">Load More</button></div><div style={{
              display: 'flex',
              gap: 8,
              padding: '0 14px 14px'
            }}><button className="mini-button" onClick={() => setActiveTab('creatives')}>Creative Grid</button><button className="mini-button" onClick={() => setActiveTab('comparison')}><ArrowDownUp size={13} />Compare Creatives</button></div>{activeTab === 'comparison' && <div style={{
              padding: '0 14px 14px',
              overflow: 'auto'
            }}><table><thead><tr><th>CREATIVE NAME</th><th>IMPRESSIONS</th><th>CTR</th><th>SPEND</th><th>CONVERSIONS</th><th>CPA</th><th>ROAS</th></tr></thead><tbody><tr><td>Summer Sale — Hero Image</td><td>284,200</td><td>2.41%</td><td>€4,820</td><td>184</td><td>€26.20</td><td>3.82x</td></tr><tr><td>Q3 Brand Awareness Video</td><td>221,400</td><td>1.82%</td><td>€3,940</td><td>126</td><td>€31.27</td><td>2.94x</td></tr></tbody></table></div>}</section>
        <aside className="detail-panel" aria-label="Creative details"><div className="detail-top"><div><span className="panel-label">SELECTED CREATIVE</span><h2>{selected.name}</h2><span className="status-badge status-active"><i />Active</span><span className="platform-badge" style={{
                  position: 'static',
                  marginLeft: 6
                }}>Google Ads</span></div><button className="close-detail" aria-label="Close detail"><X size={17} /></button></div><div className="detail-actions"><button onClick={() => openModal('edit')}><Edit3 size={13} />Edit</button><button onClick={() => openModal('duplicate')}><Copy size={13} />Duplicate</button><button onClick={() => openModal('archive')}><Archive size={13} />Archive</button><button><RefreshCw size={13} />Sync</button><button className="ai-button"><Sparkles size={13} />Ask Lulu AI</button></div><div className="detail-scroll"><section className="overview"><div className="preview large sunset">Image Ad Preview — 1200×628</div><div className="section-title"><h3>Creative Overview</h3><span className="panel-label">OBSERVED</span></div><dl><div><dt>Platform</dt><dd>Google Ads</dd></div><div><dt>Format</dt><dd>Image</dd></div><div><dt>Campaign</dt><dd>Summer Product Launch</dd></div><div><dt>Ad Group</dt><dd>Summer — High Intent</dd></div><div><dt>Status</dt><dd>Active</dd></div><div><dt>Created</dt><dd>May 28, 2025</dd></div><div><dt>Last Updated</dt><dd>2 days ago</dd></div></dl></section><section className="panel-section"><div className="section-title"><h3>Approval / Policy Status</h3><span className="panel-label">GOOGLE ADS</span></div><div className="approval"><span><Check size={13} /> Approved</span><span>Policy: No issues detected</span></div></section><section className="panel-section"><div className="section-title"><h3>Creative Performance</h3><button className="mini-select">Last 30 Days <ChevronDown size={11} /></button></div><div className="performance-grid">{[['Impressions', '284,200'], ['Clicks', '6,840'], ['CTR', '2.41%'], ['Spend', '€4,820'], ['Conversions', '184'], ['CPA', '€26.20'], ['Revenue', '€18,400'], ['ROAS', '3.82x']].map(item => <div className="performance-stat" key={item[0]}><span>{item[0]}</span><strong>{item[1]}</strong><small>{item[0] === 'CTR' ? '+0.84% vs avg' : item[0] === 'CPA' ? '+12% vs prev' : 'Observed'}</small></div>)}</div><div className="chart"><ResponsiveContainer width="100%" height={130}><AreaChart data={chartData}><defs><linearGradient id="creativeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={.24} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs><Tooltip contentStyle={{
                        fontSize: 10,
                        borderRadius: 7,
                        border: '1px solid var(--border)'
                      }} /><Area type="monotone" dataKey="value" stroke="var(--chart-3)" strokeWidth={2.5} fill="url(#creativeFill)" /></AreaChart></ResponsiveContainer><div className="chart-labels"><span>Jun 10</span><span>Jun 20</span><span>Jun 30</span><span>Jul 08</span></div></div></section><section className="panel-section"><div className="section-title"><h3>Performance Signals</h3><span className="panel-label">LAST 30 DAYS</span></div><div className="signal"><i /><div><strong>Strong CTR — 2.41%</strong><small>+0.84% vs avg · Last 30 days</small></div><b>Positive impact</b></div><div className="signal"><i /><div><strong>Strong ROAS — 3.82x</strong><small>Above benchmark · Last 30 days</small></div><b>Positive impact</b></div><div className="signal warning"><i /><div><strong>Rising CPA — +12% vs prev period</strong><small>Last 7 days</small></div><b>Watch carefully</b></div></section><section className="panel-section"><div className="section-title"><h3>Creative Fatigue</h3><span className="status-badge status-active"><i />No Fatigue Detected</span></div><p style={{
                  margin: 0,
                  color: 'var(--muted-foreground)',
                  fontSize: 10
                }}>AI Detected · Frequency within healthy range</p><p style={{
                  margin: '8px 0 0',
                  color: 'var(--muted-foreground)',
                  fontSize: 9
                }}>Impression frequency: 2.4 per user</p></section><section className="ai-section"><div className="ai-heading"><Sparkles size={17} /><div><h3>Lulu AI Creative Analysis</h3><small>AI-GENERATED · UPDATED 6 MIN AGO</small></div><span className="confidence">91%</span></div>{[['What Is Working', 'CTR is 2.41%, significantly above platform average of 1.57%. Strong creative-audience alignment in the 25–44 demographic.'], ['What Is Declining', 'CPA has increased 12% in the last 7 days. Monitor frequency and ad fatigue potential.'], ['Why It Matters', 'This creative contributes 23% of total campaign revenue. Performance shifts have significant campaign-level impact.'], ['Recommended Next Step', 'Test a headline variant targeting the 35–44 age segment to improve CPA efficiency.']].map(item => <div className="insight" key={item[0]}><strong>{item[0]}</strong><span>{item[1]}</span></div>)}<small style={{
                  color: 'var(--muted-foreground)',
                  fontSize: 8
                }}>Data source: Google Ads API · Observed</small></section><section className="ai-section"><div className="ai-heading"><Sparkles size={17} /><div><h3>Lulu AI Recommendations</h3><small>AI-GENERATED · PRIORITIZED ACTIONS</small></div></div>{[['Test an additional headline variant for this creative.', 'High'], ['Consider duplicating this creative for the Q3 campaign.', 'Medium'], ['Monitor CPA trend over the next 7 days.', 'Medium']].map(item => <div className="recommendation" key={item[0]}><strong>{item[0]}</strong><small>Priority: {item[1]}</small><div className="rec-actions"><button>Create Task</button><button>Review</button></div></div>)}</section><section className="panel-section"><div className="section-title"><h3>Creative Variants</h3><span className="panel-label">SUMMER SALE VARIANTS</span></div>{[['Headline Variant A — Current', 'Active · CTR: 2.41%'], ['Headline Variant B', 'Paused · CTR: 1.82%'], ['Image Variant A', 'Scheduled · CTR: —']].map(item => <div className="variant-row" key={item[0]}><div><strong>{item[0]}</strong><small>{item[1]}</small></div><ChevronRight size={13} /></div>)}<button className="add-variant"><Plus size={12} /> Add Variant</button></section><section className="panel-section"><div className="section-title"><h3>Creative Opportunities</h3><Sparkles size={14} color="var(--primary)" /></div><div className="opportunity"><div><strong>Expand this high-performing creative to Meta Ads</strong><small>Strong CTR and ROAS · Potential: High</small></div><button className="mini-button">Create Task</button></div><div className="opportunity"><div><strong>Test video format variant</strong><small>Video outperforms image 18% on avg · Potential: Medium</small></div><button className="mini-button">Create Task</button></div></section><section className="panel-section"><div className="section-title"><h3>Creative Risks</h3><CircleAlert size={14} color="var(--chart-1)" /></div><div className="risk"><div><strong>Rising CPA</strong><small>Medium · Campaign efficiency · +12% CPA last 7 days</small></div><button className="mini-button">Review</button></div></section></div></aside></div>
    </section></main>
    {activeModal && <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">{activeModal === 'create' && <div><div className="modal-header"><div><span className="eyebrow">CREATIVE SETUP</span><h2 id="modal-title">Create Creative</h2></div><button onClick={() => setActiveModal(null)} aria-label="Close"><X size={18} /></button></div><div className="steps">{['Platform', 'Format', 'Campaign', 'Assets', 'Preview', 'Review'].map((step, index) => <div className={createStep === index + 1 ? 'current' : createStep > index + 1 ? 'done' : ''} key={step}><span>{createStep > index + 1 ? <Check size={12} /> : index + 1}</span>{step}</div>)}</div><div className="modal-body">{createStep === 1 ? <div className="platform-cards">{['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads'].map(platform => <div className="platform-card" key={platform}><strong>{platform}</strong><p>Connect your account to manage creative assets.</p><button onClick={() => setCreateStep(2)}>Select Platform</button></div>)}</div> : <div><label>Creative Name<input defaultValue="Summer Sale — Hero Image" /></label><label>Format<select><option>Image</option><option>Video</option><option>Carousel</option><option>Responsive</option></select></label><p style={{
                color: 'var(--muted-foreground)',
                fontSize: 10
              }}>Step {createStep} of 6 · Continue to configure this creative.</p></div>}</div><div className="modal-footer"><button className="ghost-button" onClick={() => setActiveModal(null)}>Cancel</button><div><button className="ghost-button" onClick={() => setCreateStep(Math.max(1, createStep - 1))}>Back</button><button className="primary-button" onClick={() => createStep < 6 ? setCreateStep(createStep + 1) : setActiveModal(null)}>{createStep === 6 ? 'Create Creative' : 'Continue'}<ChevronRight size={14} /></button></div></div></div>}{activeModal === 'upload' && <div><div className="modal-header"><div><span className="eyebrow">CREATIVE ASSETS</span><h2 id="modal-title">Upload Creative</h2></div><button onClick={() => setActiveModal(null)} aria-label="Close"><X size={18} /></button></div><div className="modal-body"><div className="upload-zone"><Upload size={25} /><strong>Drop files here or click to upload</strong><p>JPG, PNG, GIF, MP4, MOV · Max size: 30MB</p></div></div><div className="modal-footer"><button className="ghost-button" onClick={() => setActiveModal(null)}>Cancel</button><button className="primary-button" onClick={() => setActiveModal(null)}>Upload</button></div></div>}{(activeModal === 'edit' || activeModal === 'duplicate') && <div><div className="modal-header"><div><span className="eyebrow">CREATIVE ACTION</span><h2 id="modal-title">{activeModal === 'edit' ? 'Edit Creative' : 'Duplicate Creative'}</h2></div><button onClick={() => setActiveModal(null)} aria-label="Close"><X size={18} /></button></div><div className="modal-body"><label>{activeModal === 'edit' ? 'Creative Name' : 'New Creative Name'}<input defaultValue={selected.name} /></label><label>Headline<input defaultValue="Summer savings are here" /></label><label>Primary Text<textarea defaultValue="Make your campaign message count." /></label><label>Campaign<select><option>Summer Product Launch</option><option>Q3 Lead Generation</option></select></label><p style={{
              color: 'var(--muted-foreground)',
              fontSize: 10
            }}>Saved changes are kept as draft until published to the connected platform.</p></div><div className="modal-footer"><button className="ghost-button" onClick={() => setActiveModal(null)}>Cancel</button><button className="primary-button" onClick={() => setActiveModal(null)}>{activeModal === 'edit' ? 'Save Changes' : 'Duplicate Creative'}</button></div></div>}{activeModal === 'archive' && <div><div className="modal-header"><div><span className="eyebrow">CREATIVE ACTION</span><h2 id="modal-title">Archive Creative?</h2></div><button onClick={() => setActiveModal(null)} aria-label="Close"><X size={18} /></button></div><div className="modal-body"><p style={{
              color: 'var(--muted-foreground)',
              lineHeight: 1.6
            }}>The creative will be removed from the active Lulu AI creative workspace. Existing platform usage will not be changed unless explicitly supported and confirmed.</p></div><div className="modal-footer"><button className="ghost-button" onClick={() => setActiveModal(null)}>Cancel</button><button className="primary-button danger" onClick={() => setActiveModal(null)}>Archive Creative</button></div></div>}{(activeModal === 'connect' || activeModal === 'sync') && <div><div className="modal-header"><div><span className="eyebrow">ADVERTISING OPERATIONS</span><h2 id="modal-title">{activeModal === 'connect' ? 'Connect Advertising Platform' : 'Sync Creatives'}</h2></div><button onClick={() => setActiveModal(null)} aria-label="Close"><X size={18} /></button></div><div className="modal-body">{activeModal === 'connect' ? <div className="platform-cards">{['Google Ads', 'Meta Ads', 'Microsoft Advertising', 'LinkedIn Ads', 'TikTok Ads'].map(platform => <div className="platform-card" key={platform}><strong>{platform}</strong><p>{platform === 'Microsoft Advertising' || platform === 'TikTok Ads' ? 'Not connected' : 'Connected · Ready to sync'}</p><button>{platform === 'Microsoft Advertising' || platform === 'TikTok Ads' ? 'Connect' : 'Connected'}</button></div>)}</div> : <div><div className="approval"><span><Check size={13} /> Synced</span><span>Today at 09:42</span></div><p style={{
                color: 'var(--muted-foreground)',
                lineHeight: 1.7
              }}>Creatives found: 247<br />New: 12 · Updated: 8 · Conflicts: 2 · Failed: 0</p></div>}</div><div className="modal-footer"><button className="ghost-button" onClick={() => setActiveModal(null)}>Cancel</button><button className="primary-button" onClick={() => setActiveModal(null)}>{activeModal === 'connect' ? 'Connect' : 'Sync Now'}</button></div></div>}</div></div>}
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
