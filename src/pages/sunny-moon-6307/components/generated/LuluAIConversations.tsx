import { useMemo, useState } from 'react';
import { Activity, Archive, ArrowDownUp, BarChart3, Bell, BookOpen, Bot, Brain, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Code2, Copy, Download, FileText, Filter, FolderOpen, Grip, Hash, Lightbulb, MessageSquare, MessagesSquare, MoreHorizontal, Paperclip, Pin, Plus, Search, Send, Settings, Share2, Sparkles, Tag, Trash2, UserRound, Wrench, X, Zap } from 'lucide-react';
type Conversation = {
  id: string;
  title: string;
  preview: string;
  participant: string;
  agent: string;
  time: string;
  messages: string;
  status: 'Active' | 'Completed' | 'Archived';
  context: string;
  pinned?: boolean;
};
type ModalType = 'rename' | 'archive' | 'delete' | 'export' | 'share' | null;
const platformNav = [['AI Assistant', MessageSquare], ['AI Agents', Bot], ['Agent Marketplace', FolderOpen], ['Agent Templates', FileText], ['AI Memory', Brain], ['AI Knowledge', BookOpen], ['AI Actions', Zap], ['AI Activity', Activity]] as const;
const metrics: Array<readonly [string, string, typeof MessagesSquare, string]> = [];
const conversations: Conversation[] = []; /* populated from live records */
const emptyConversation: Conversation = { id: '', title: '', preview: '', participant: '', agent: '', time: '', messages: '', status: 'Active', context: '' };
/*
  id: 'q4',
  title: 'Q4 Marketing Strategy Review',
  preview: 'Can you analyze our Q4 marketing performance and identify...',
  participant: 'You',
  agent: 'AI Assistant',
  time: '5 min ago',
  messages: '23',
  status: 'Active',
  context: 'Marketing'
}, {
  id: 'shopify',
  title: 'Shopify Product Optimization',
  preview: 'Here are the highest-impact product page opportunities...',
  participant: 'You',
  agent: 'Growth Scout Agent',
  time: '2 hr ago',
  messages: '47',
  status: 'Completed',
  context: 'E-commerce',
  pinned: true
}, {
  id: 'seo',
  title: 'SEO Audit Results',
  preview: 'The technical audit surfaced 18 opportunities across...',
  participant: 'You',
  agent: 'SEO Analyst Agent',
  time: 'Yesterday',
  messages: '31',
  status: 'Completed',
  context: 'SEO'
}, {
  id: 'ads',
  title: 'Ad Campaign Performance',
  preview: 'Your paid social campaigns are trending above benchmark...',
  participant: 'You',
  agent: 'Growth Scout Agent',
  time: '1 hr ago',
  messages: '18',
  status: 'Active',
  context: 'Advertising'
}, {
  id: 'segments',
  title: 'Customer Segment Analysis',
  preview: 'The highest-value segment is returning customers who...',
  participant: 'You',
  agent: 'Analytics Agent',
  time: '2 days ago',
  messages: '22',
  status: 'Completed',
  context: 'Analytics'
}, {
  id: 'blog',
  title: 'Blog Content Planning',
  preview: 'I mapped six content opportunities to your Q1 priorities...',
  participant: 'You',
  agent: 'Content Agent',
  time: '3 hr ago',
  messages: '9',
  status: 'Active',
  context: 'Content'
}, {
  id: 'ops',
  title: 'Weekly Operations Review',
  preview: 'Here is the weekly summary across your key operating...',
  participant: 'You',
  agent: 'AI Assistant',
  time: '3 days ago',
  messages: '15',
  status: 'Completed',
  context: 'Operations'
}, {
  id: 'launch',
  title: 'Product Launch Brief',
  preview: 'I have organized the launch brief around audience, timing...',
  participant: 'You',
  agent: 'AI Assistant',
  time: 'Today',
  messages: '11',
  status: 'Active',
  context: 'General'\n}]; */
const activityItems: Array<readonly [string, string, typeof MessageSquare]> = [];
export const LuluAIConversations = () => {
  const [selectedId, setSelectedId] = useState('');
  const [query, setQuery] = useState('');
  const [contextOpen, setContextOpen] = useState(true);
  const [expanded, setExpanded] = useState<string | null>('first');
  const [modal, setModal] = useState<ModalType>(null);
  const selected = conversations.find(item => item.id === selectedId) ?? emptyConversation;
  const filtered = useMemo(() => conversations.filter(item => `${item.title} ${item.preview} ${item.context} ${item.agent}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="conversation-shell">
    <style>{`
      *{box-sizing:border-box} .conversation-shell{height:100vh;display:flex;overflow:hidden;background:var(--background);color:var(--foreground);font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:13px} button,input{font:inherit} button{cursor:pointer} button:focus-visible,input:focus-visible{outline:2px solid var(--border);outline-offset:2px}.sidebar{width:232px;flex:none;display:flex;flex-direction:column;padding:22px 12px 14px;background:var(--sidebar);border-right:1px solid rgba(0,0,0,.07)}.brand{display:flex;align-items:center;gap:9px;padding:0 11px 28px;color:var(--foreground);font-size:16px;font-weight:700}.brand svg{color:var(--foreground)}.nav-label{margin:0 12px 8px;color:var(--muted-foreground);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.nav-label.platform{margin-top:22px}.nav-item{width:100%;display:flex;align-items:center;gap:10px;margin:2px 0;padding:9px 12px;border:0;border-radius:7px;color:var(--muted-foreground);background:transparent;text-align:left;font-size:12px}.nav-item:hover{color:var(--muted-foreground);background:rgba(0,0,0,.045)}.nav-item.active{padding-left:9px;border-left:3px solid var(--border);color:var(--foreground);background:rgba(0,0,0,.14)}.side-bottom{margin-top:auto;padding-top:13px;border-top:1px solid rgba(0,0,0,.07)}.profile{display:flex;align-items:center;gap:9px;width:100%;padding:9px;border:0;border-radius:7px;color:var(--muted-foreground);background:transparent;text-align:left}.profile:hover{background:rgba(0,0,0,.04)}.profile span{display:flex;flex:1;flex-direction:column;gap:2px}.profile strong{font-size:12px;color:var(--foreground)}.profile small{font-size:11px;color:var(--muted-foreground)}.avatar{width:28px;height:28px;display:grid!important;place-items:center;border-radius:50%;color:var(--primary-foreground)!important;background:var(--primary);font-size:10px;font-weight:700}.workspace{min-width:0;flex:1;display:flex;flex-direction:column;overflow:hidden}.topbar{height:65px;display:flex;align-items:center;justify-content:space-between;padding:0 26px;border-bottom:1px solid rgba(0,0,0,.07);background:var(--background)}.crumb{display:flex;align-items:center;gap:7px;color:var(--muted-foreground);font-size:12px}.crumb strong{color:var(--foreground);font-weight:500}.top-actions{display:flex;align-items:center;gap:10px}.icon-btn,.secondary,.primary,.action-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid rgba(0,0,0,.1);border-radius:7px;color:var(--muted-foreground);background:var(--background)}.icon-btn{width:31px;height:31px;padding:0}.icon-btn:hover,.secondary:hover,.action-btn:hover{border-color:rgba(0,0,0,.22);color:var(--foreground)}.primary{padding:9px 13px;border-color:var(--primary-foreground);color:var(--primary-foreground);background:var(--primary)}.primary:hover{background:var(--primary);color:var(--primary-foreground)}.secondary{padding:9px 13px}.page{overflow:auto;padding:28px 28px 50px}.page-header{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:24px}.eyebrow{display:flex;align-items:center;gap:7px;color:var(--foreground);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.page h1{margin:9px 0 7px;color:var(--foreground);font-size:28px;letter-spacing:-.035em}.page-header p{max-width:640px;margin:0;color:var(--muted-foreground);line-height:1.55}.header-buttons{display:flex;gap:9px;flex:none}.metrics{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;margin-bottom:24px}.metric{min-width:0;padding:15px 16px;border:1px solid rgba(0,0,0,.07);border-radius:9px;background:var(--background)}.metric-top{display:flex;align-items:center;justify-content:space-between;color:var(--muted-foreground)}.metric svg{color:var(--foreground)}.metric.green svg,.status-active{color:var(--chart-4)}.metric.blue svg{color:var(--foreground)}.metric.cyan svg{color:var(--foreground)}.metric.dim{opacity:.68}.metric label{display:block;margin-top:12px;color:var(--muted-foreground);font-size:11px}.metric strong{display:block;margin-top:4px;color:var(--foreground);font-size:22px;letter-spacing:-.04em}.workspace-grid{display:grid;grid-template-columns:280px minmax(430px,1fr) 268px;min-height:640px;border:1px solid rgba(0,0,0,.07);border-radius:10px;overflow:hidden;background:var(--background)}.list-column,.detail-column,.context-column{min-width:0}.list-column{border-right:1px solid rgba(0,0,0,.07)}.detail-column{border-right:1px solid rgba(0,0,0,.07)}.column-header{padding:18px 16px 12px;border-bottom:1px solid rgba(0,0,0,.06)}.column-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px}.column-title h2{margin:0;color:var(--foreground);font-size:14px}.count{color:var(--muted-foreground);font-size:11px}.search-box{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid rgba(0,0,0,.08);border-radius:7px;color:var(--muted-foreground);background:var(--background)}.search-box:focus-within{border-color:var(--muted-foreground)}.search-box input{width:100%;border:0;outline:0;color:var(--foreground);background:transparent;font-size:12px}.search-box input::placeholder{color:var(--muted-foreground)}.filter-row{display:flex;gap:5px;margin-top:8px;overflow:hidden}.filter-row button{display:flex;align-items:center;gap:4px;padding:6px 7px;border:1px solid rgba(0,0,0,.07);border-radius:6px;color:var(--muted-foreground);background:var(--background);white-space:nowrap;font-size:10px}.filter-row button:hover{color:var(--foreground);border-color:rgba(0,0,0,.16)}.list-sort{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;color:var(--muted-foreground);font-size:11px}.list-sort button{display:flex;align-items:center;gap:5px;border:0;color:var(--muted-foreground);background:transparent;font-size:11px}.conversation-list{overflow:auto;max-height:540px;padding:0 8px 10px}.conversation-card{position:relative;padding:13px 9px;margin-bottom:3px;border:1px solid transparent;border-radius:8px;cursor:pointer;transition:.15s}.conversation-card:hover{border-color:rgba(0,0,0,.1);background:var(--background)}.conversation-card.selected{border-color:rgba(0,0,0,.45);background:rgba(0,0,0,.12)}.conversation-card h3{display:flex;align-items:center;gap:5px;margin:0;color:var(--foreground);font-size:12px;font-weight:600}.conversation-card h3 span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pin{color:var(--foreground);flex:none}.preview{overflow:hidden;margin:6px 0;color:var(--muted-foreground);font-size:11px;line-height:1.4;text-overflow:ellipsis;white-space:nowrap}.card-meta{display:flex;align-items:center;justify-content:space-between;color:var(--muted-foreground);font-size:10px}.agent-line{overflow:hidden;max-width:145px;text-overflow:ellipsis;white-space:nowrap}.status{padding:3px 6px;border-radius:5px;font-size:9px;font-weight:600}.status.active{color:var(--chart-4);background:rgba(0,0,0,.12)}.status.completed{color:var(--muted-foreground);background:rgba(0,0,0,.11)}.status.archived{color:var(--muted-foreground);background:rgba(0,0,0,.12)}.context-tag{display:inline-flex;margin-top:8px;padding:3px 6px;border-radius:4px;color:var(--foreground);background:rgba(0,0,0,.12);font-size:9px}.hover-actions{display:none;gap:3px;position:absolute;right:7px;top:10px}.conversation-card:hover .hover-actions{display:flex}.hover-actions button{width:23px;height:23px;padding:0;border:1px solid rgba(0,0,0,.12);border-radius:5px;color:var(--muted-foreground);background:var(--background)}.detail-header{padding:19px 21px 16px;border-bottom:1px solid rgba(0,0,0,.07)}.detail-headline{display:flex;justify-content:space-between;gap:15px}.detail-headline h2{margin:0;color:var(--foreground);font-size:18px;letter-spacing:-.025em}.detail-headline p{margin:7px 0 0;color:var(--muted-foreground);font-size:11px}.detail-badges{display:flex;flex-wrap:wrap;gap:6px;margin-top:13px}.tag{padding:4px 7px;border-radius:4px;color:var(--muted-foreground);background:var(--background);font-size:10px}.tag.violet{color:var(--foreground);background:rgba(0,0,0,.12)}.detail-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:15px}.action-btn{padding:7px 9px;font-size:10px}.action-btn.primary-action{border-color:var(--primary-foreground);color:var(--primary-foreground);background:var(--primary)}.messages{overflow:auto;max-height:570px;padding:22px 21px 10px}.message{display:flex;gap:10px;margin-bottom:19px}.message.user{justify-content:flex-end}.message.user .bubble-wrap{align-items:flex-end}.bubble-wrap{display:flex;max-width:88%;flex-direction:column;align-items:flex-start}.speaker{display:flex;align-items:center;gap:6px;margin-bottom:6px;color:var(--muted-foreground);font-size:10px}.speaker strong{color:var(--foreground);font-weight:600}.message.user .speaker{flex-direction:row-reverse}.ai-mark,.user-mark{width:23px;height:23px;display:grid;place-items:center;border-radius:7px}.ai-mark{color:var(--foreground);background:rgba(0,0,0,.16)}.user-mark{color:var(--muted-foreground);background:var(--background)}.bubble{padding:11px 13px;border:1px solid rgba(0,0,0,.07);border-radius:4px 10px 10px 10px;color:var(--muted-foreground);background:var(--background);line-height:1.55}.message.user .bubble{border-color:rgba(0,0,0,.18);border-radius:10px 4px 10px 10px;color:var(--foreground);background:var(--background)}.time{margin-top:5px;color:var(--muted-foreground);font-size:9px}.context-card{width:100%;margin-top:9px;border:1px solid rgba(0,0,0,.065);border-radius:7px;background:var(--background)}.context-toggle{width:100%;display:flex;align-items:center;justify-content:space-between;padding:9px 10px;border:0;color:var(--muted-foreground);background:transparent;text-align:left;font-size:10px}.context-content{padding:0 10px 9px}.context-row{display:flex;gap:8px;padding:7px 0;border-top:1px solid rgba(0,0,0,.05);color:var(--muted-foreground);font-size:10px}.context-row svg{flex:none;color:var(--foreground)}.context-row strong{display:block;margin-bottom:2px;color:var(--foreground);font-weight:500}.context-row span{color:var(--muted-foreground)}.view-action{margin-left:auto;border:0;color:var(--foreground);background:transparent;font-size:10px}.composer{display:flex;align-items:center;gap:8px;margin:10px 21px 18px;padding:8px;border:1px solid rgba(0,0,0,.09);border-radius:8px;background:var(--background)}.composer input{min-width:0;flex:1;border:0;outline:0;color:var(--foreground);background:transparent;font-size:12px}.composer button{display:flex;align-items:center;gap:5px;padding:7px 10px;border:0;border-radius:6px;color:var(--primary-foreground);background:var(--primary);font-size:11px}.composer .attach{padding:6px;border:0;color:var(--muted-foreground);background:transparent}.context-column{overflow:auto;padding:18px 16px}.context-column-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}.context-column h2{margin:0;color:var(--foreground);font-size:13px}.context-section{padding:0 0 18px;margin-bottom:18px;border-bottom:1px solid rgba(0,0,0,.07)}.context-section h3{display:flex;align-items:center;gap:7px;margin:0 0 11px;color:var(--muted-foreground);font-size:10px;letter-spacing:.08em;text-transform:uppercase}.context-section h3 svg{color:var(--foreground)}.agent-summary{display:flex;align-items:center;gap:9px}.agent-icon{width:32px;height:32px;display:grid;place-items:center;border-radius:8px;color:var(--foreground);background:rgba(0,0,0,.16)}.agent-summary strong{display:block;color:var(--foreground);font-size:12px}.agent-summary small{display:block;margin-top:3px;color:var(--muted-foreground);font-size:10px}.context-section p{margin:10px 0;color:var(--muted-foreground);font-size:11px;line-height:1.5}.open-link{display:flex;align-items:center;gap:5px;padding:0;border:0;color:var(--foreground);background:transparent;font-size:10px}.resource{display:flex;align-items:center;gap:8px;padding:7px 0;color:var(--muted-foreground);font-size:11px}.resource svg{color:var(--foreground)}.pending{margin-left:auto;padding:3px 5px;border-radius:4px;color:var(--chart-1);background:rgba(0,0,0,.12);font-size:9px}.timeline{list-style:none;padding:0;margin:0}.timeline li{display:flex;gap:8px;padding:7px 0;color:var(--muted-foreground);font-size:10px;line-height:1.35}.timeline li svg{flex:none;color:var(--foreground);margin-top:1px}.timeline time{display:block;color:var(--muted-foreground);font-size:9px}.dialog{width:min(430px,calc(100vw - 28px));padding:23px;border:1px solid rgba(0,0,0,.12);border-radius:12px;color:var(--foreground);background:var(--background);box-shadow:0 24px 80px var(--background);z-index:5}.dialog::backdrop{background:rgba(0,0,0,.78)}.dialog header{display:flex;align-items:center;justify-content:space-between}.dialog h2{margin:0;color:var(--foreground);font-size:16px}.dialog p{color:var(--muted-foreground);line-height:1.5}.dialog input,.dialog select{width:100%;padding:10px;border:1px solid rgba(0,0,0,.12);border-radius:7px;outline:0;color:var(--foreground);background:var(--background)}.dialog-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}.danger{border-color:rgba(0,0,0,.4);color:var(--primary-foreground);background:var(--primary)}.format-options{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.format-options label{padding:12px;border:1px solid rgba(0,0,0,.1);border-radius:7px;color:var(--muted-foreground);background:var(--background);text-align:center}.format-options input{width:auto;margin-right:5px}.empty-state{padding:40px 20px;text-align:center;color:var(--muted-foreground)}.empty-state h3{color:var(--foreground);font-size:14px}.empty-state p{font-size:12px}.mobile-nav{display:none}@media(max-width:1240px){.workspace-grid{grid-template-columns:250px minmax(390px,1fr)}.context-column{display:none}.metrics{grid-template-columns:repeat(3,1fr)}}@media(max-width:900px){.sidebar{width:64px;padding-inline:8px}.brand span,.nav-label,.nav-item span,.side-bottom .nav-item span,.profile span:not(.avatar),.profile>svg{display:none}.brand{justify-content:center;padding-inline:0}.nav-item{justify-content:center;padding-inline:8px}.workspace-grid{grid-template-columns:230px minmax(350px,1fr)}.page{padding:22px 18px 40px}}@media(max-width:700px){.conversation-shell{overflow:auto}.sidebar{display:none}.workspace{width:100%;overflow:visible}.topbar{padding:0 14px}.page{overflow:visible;padding:18px 12px}.page-header{display:block}.header-buttons{margin-top:15px}.metrics{grid-template-columns:repeat(2,1fr)}.workspace-grid{display:block;min-height:0}.list-column,.detail-column{border:0}.list-column{max-height:500px;border-bottom:1px solid rgba(0,0,0,.08)}.conversation-list{max-height:330px}.messages{max-height:none}.detail-actions{display:none}.context-column{display:block}.page h1{font-size:25px}}
      @media(prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:.01ms!important;animation-duration:.01ms!important}}
    `}</style>
    <aside className="sidebar" aria-label="Primary navigation"><div className="brand"><Sparkles size={18} /><span>Lulu AI</span></div><LuluSectionNavigation activeId="sunny-moon-6307" /><div className="side-bottom"><button className="nav-item"><Settings size={16} /><span>Settings</span></button><button className="nav-item"><CircleHelp size={16} /><span>Help</span></button><button className="profile"><span className="avatar">SM</span><span><strong>Sarah Mitchell</strong><small>CEO</small></span><ChevronDown size={14} /></button></div></aside>
    <main className="workspace"><header className="topbar"><div className="crumb"><span>AI Platform</span><ChevronRight size={13} /><strong>AI Conversations</strong></div><div className="top-actions"><button className="icon-btn" aria-label="Notifications"><Bell size={15} /></button><button className="icon-btn" aria-label="Help"><CircleHelp size={15} /></button><button className="avatar" aria-label="Open profile">SM</button></div></header><div className="page"><section className="page-header"><div><span className="eyebrow"><MessagesSquare size={12} />Conversation workspace</span><h1>AI Conversations</h1><p>View and manage your AI conversations in one place. Search previous conversations, understand context, review outcomes and continue where you left off.</p></div><div className="header-buttons"><button className="secondary" onClick={() => setModal('share')}><Settings size={14} />Conversation Settings</button><button className="primary" onClick={() => setSelectedId('q4')}><Plus size={15} />New Conversation</button></div></section>
      <section className="metrics" aria-label="Conversation overview">{metrics.map(([label, value, Icon, tone]) => <article className={`metric ${tone}`} key={label}><div className="metric-top"><Icon size={16} /><span>···</span></div><label>{label}</label><strong>{value}</strong></article>)}</section>
      <section className="workspace-grid" aria-label="Conversation workspace"><section className="list-column"><div className="column-header"><div className="column-title"><h2>Conversations</h2><span className="count">284 total</span></div><label className="search-box"><Search size={14} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search conversations" aria-label="Search conversations" /></label><div className="filter-row"><button><Filter size={11} />Participant<ChevronDown size={11} /></button><button>Status<ChevronDown size={11} /></button><button>Date<ChevronDown size={11} /></button><button>Context<ChevronDown size={11} /></button></div></div><div className="list-sort"><span>{filtered.length} conversations</span><button><ArrowDownUp size={12} />Most Recent<ChevronDown size={11} /></button></div><div className="conversation-list">{filtered.map(item => <article key={item.id} className={`conversation-card ${selectedId === item.id ? 'selected' : ''}`} onClick={() => setSelectedId(item.id)} tabIndex={0} onKeyDown={event => {
                if (event.key === 'Enter') setSelectedId(item.id);
              }}><h3>{item.pinned && <Pin className="pin" size={11} />}<span>{item.title}</span></h3><p className="preview">{item.preview}</p><div className="card-meta"><span className="agent-line">{item.agent} · {item.time}</span><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></div><span className="context-tag">{item.context} · {item.messages} msgs</span><div className="hover-actions"><button aria-label={`Open ${item.title}`}><FolderOpen size={11} /></button><button aria-label={`Archive ${item.title}`} onClick={event => {
                    event.stopPropagation();
                    setModal('archive');
                  }}><Archive size={11} /></button><button aria-label={`Delete ${item.title}`} onClick={event => {
                    event.stopPropagation();
                    setModal('delete');
                  }}><Trash2 size={11} /></button></div></article>)}{filtered.length === 0 && <div className="empty-state"><Search size={25} /><h3>No Conversations Found</h3><p>Try another search or clear your filters.</p><button className="secondary" onClick={() => setQuery('')}>Clear Filters</button></div>}</div></section>
        <section className="detail-column"><header className="detail-header"><div className="detail-headline"><div><h2>{selected.title}</h2><p><span className="status active">Active</span> &nbsp; Created Oct 14, 2024 · Last updated 5 min ago</p></div><button className="icon-btn" aria-label="More conversation options" onClick={() => setModal('rename')}><MoreHorizontal size={16} /></button></div><div className="detail-badges"><span className="tag violet">Marketing</span><span className="tag">Strategy</span><span className="tag">Follow-up</span></div><div className="detail-actions"><button className="action-btn primary-action"><MessageSquare size={12} />Continue Conversation</button><button className="action-btn" onClick={() => setModal('rename')}>Rename</button><button className="action-btn" onClick={() => setModal('export')}><Download size={12} />Export</button><button className="action-btn" onClick={() => setModal('share')}><Share2 size={12} />Share</button><button className="action-btn" onClick={() => setModal('archive')}><Archive size={12} />Archive</button></div></header>
          <div className="messages"><article className="message user"><div className="bubble-wrap"><div className="speaker"><span>User</span><strong>10:22 AM</strong><span className="user-mark"><UserRound size={13} /></span></div><div className="bubble">Can you analyze our Q4 marketing performance and identify the top opportunities for improvement?</div><span className="time">Delivered</span></div></article><article className="message"><div className="bubble-wrap"><div className="speaker"><span className="ai-mark"><Sparkles size={13} /></span><strong>AI Assistant</strong><span>10:22 AM</span></div><div className="bubble">Here is a comprehensive analysis of your Q4 marketing performance covering paid advertising, organic content, and email campaigns.</div><div className="context-card"><button className="context-toggle" onClick={() => setExpanded(expanded === 'first' ? null : 'first')}><span><Sparkles size={12} /> AI Context</span>{expanded === 'first' ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</button>{expanded === 'first' && <div className="context-content"><div className="context-row"><BookOpen size={13} /><div><strong>Knowledge Used</strong><span>Company Information · Marketing Analytics Report Q4</span></div></div><div className="context-row"><Brain size={13} /><div><strong>Memory Used</strong><span>Previous campaign preferences</span></div></div><div className="context-row"><Wrench size={13} /><div><strong>Tools Used</strong><span>Analytics tool · Retrieved 30 days of campaign data</span></div></div></div>}</div><span className="time">10:22 AM</span></div></article><article className="message user"><div className="bubble-wrap"><div className="speaker"><span>User</span><strong>10:28 AM</strong><span className="user-mark"><UserRound size={13} /></span></div><div className="bubble">What specific actions should we take to improve our paid advertising ROI?</div><span className="time">10:28 AM</span></div></article><article className="message"><div className="bubble-wrap"><div className="speaker"><span className="ai-mark"><Sparkles size={13} /></span><strong>AI Assistant</strong><span>10:29 AM</span></div><div className="bubble">Based on your current Google Ads performance I recommend pausing three underperforming ad sets and reallocating budget to top performers.</div><div className="context-card"><button className="context-toggle" onClick={() => setExpanded(expanded === 'second' ? null : 'second')}><span><Sparkles size={12} /> AI Context</span>{expanded === 'second' ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</button>{expanded === 'second' && <div className="context-content"><div className="context-row"><BookOpen size={13} /><div><strong>Knowledge Used</strong><span>Google Ads Performance Data</span></div></div><div className="context-row"><Zap size={13} /><div><strong>Actions Performed</strong><span>Pause Ad Campaign · Target Underperforming ad set · Result Pending Approval</span><button className="view-action">View Action</button></div></div></div>}</div><span className="time">10:29 AM</span></div></article><article className="message user"><div className="bubble-wrap"><div className="speaker"><span>User</span><strong>10:35 AM</strong><span className="user-mark"><UserRound size={13} /></span></div><div className="bubble">Can you draft an updated campaign strategy document?</div><span className="time">10:35 AM</span></div></article><article className="message"><div className="bubble-wrap"><div className="speaker"><span className="ai-mark"><Sparkles size={13} /></span><strong>AI Assistant</strong><span>10:36 AM</span></div><div className="bubble">I have prepared a draft Q4 campaign strategy document incorporating the analysis and recommendations.</div><div className="context-card"><button className="context-toggle" onClick={() => setExpanded(expanded === 'third' ? null : 'third')}><span><Sparkles size={12} /> AI Context</span>{expanded === 'third' ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</button>{expanded === 'third' && <div className="context-content"><div className="context-row"><Wrench size={13} /><div><strong>Tools Used</strong><span>Content generation tool</span></div></div><div className="context-row"><Brain size={13} /><div><strong>Memory Used</strong><span>Brand voice preferences</span></div></div></div>}</div></div></article></div><form className="composer" onSubmit={event => event.preventDefault()}><button type="button" className="attach" aria-label="Attach file"><Paperclip size={15} /></button><input placeholder="Continue the conversation..." aria-label="Continue the conversation" /><button type="submit"><Send size={13} />Send</button></form></section>
        {contextOpen && <aside className="context-column" aria-label="Conversation context"><div className="context-column-head"><h2>Conversation Context</h2><button className="icon-btn" onClick={() => setContextOpen(false)} aria-label="Collapse context panel"><ChevronRight size={15} /></button></div><section className="context-section"><h3><Bot size={13} />Agent</h3><div className="agent-summary"><span className="agent-icon"><Sparkles size={16} /></span><span><strong>AI Assistant</strong><small className="status-active">● Active</small></span></div><p>General AI assistant for thoughtful business analysis and everyday work.</p><button className="open-link">Open Agent <ChevronRight size={12} /></button></section><section className="context-section"><h3><BookOpen size={13} />Related Knowledge</h3><div className="resource"><BookOpen size={13} />Company Information</div><div className="resource"><FileText size={13} />Marketing Analytics Report Q4</div><div className="resource"><BarChart3 size={13} />Google Ads Performance Data</div><button className="open-link">Open Knowledge <ChevronRight size={12} /></button></section><section className="context-section"><h3><Brain size={13} />Memory Used</h3><div className="resource"><Brain size={13} />Campaign preferences</div><div className="resource"><Tag size={13} />Brand voice settings</div><button className="open-link">View Memory <ChevronRight size={12} /></button></section><section className="context-section"><h3><Zap size={13} />Related Actions</h3><div className="resource"><Zap size={13} />Pause Ad Campaign <span className="pending">Pending Approval</span></div><button className="open-link">View Actions <ChevronRight size={12} /></button></section><section className="context-section"><h3><Activity size={13} />Conversation Activity</h3><ol className="timeline">{activityItems.map(([label, detail, Icon]) => <li key={label + detail}><Icon size={13} /><span><strong>{label}</strong><time>{detail}</time></span></li>)}</ol></section></aside>}</section></div></main>
    {modal === 'rename' && <dialog open className="dialog" aria-labelledby="rename-title"><header><h2 id="rename-title">Rename Conversation</h2><button className="icon-btn" onClick={() => setModal(null)} aria-label="Close rename dialog"><X size={15} /></button></header><p>Give this conversation a clear, memorable name.</p><input defaultValue={selected.title} aria-label="Conversation name" /><div className="dialog-actions"><button className="secondary" onClick={() => setModal(null)}>Cancel</button><button className="primary" onClick={() => setModal(null)}>Save</button></div></dialog>}
    {modal === 'archive' && <dialog open className="dialog" aria-labelledby="archive-title"><header><h2 id="archive-title">Archive Conversation?</h2><button className="icon-btn" onClick={() => setModal(null)} aria-label="Close archive dialog"><X size={15} /></button></header><p>This conversation will move to your archive. You can restore it later from Archived.</p><div className="dialog-actions"><button className="secondary" onClick={() => setModal(null)}>Cancel</button><button className="primary" onClick={() => setModal(null)}>Archive</button></div></dialog>}
    {modal === 'delete' && <dialog open className="dialog" aria-labelledby="delete-title"><header><h2 id="delete-title">Delete Conversation?</h2><button className="icon-btn" onClick={() => setModal(null)} aria-label="Close delete dialog"><X size={15} /></button></header><p>This permanently deletes the conversation and its message history. This action cannot be undone.</p><div className="dialog-actions"><button className="secondary" onClick={() => setModal(null)}>Cancel</button><button className="primary danger" onClick={() => setModal(null)}>Delete</button></div></dialog>}
    {modal === 'export' && <dialog open className="dialog" aria-labelledby="export-title"><header><h2 id="export-title">Export Conversation</h2><button className="icon-btn" onClick={() => setModal(null)} aria-label="Close export dialog"><X size={15} /></button></header><p>Choose a format for your conversation export.</p><div className="format-options"><label><input type="radio" name="format" defaultChecked />PDF</label><label><input type="radio" name="format" />Text</label><label><input type="radio" name="format" />JSON</label></div><div className="dialog-actions"><button className="secondary" onClick={() => setModal(null)}>Cancel</button><button className="primary" onClick={() => setModal(null)}><Download size={14} />Export</button></div></dialog>}
    {modal === 'share' && <dialog open className="dialog" aria-labelledby="share-title"><header><h2 id="share-title">Share Conversation</h2><button className="icon-btn" onClick={() => setModal(null)} aria-label="Close share dialog"><X size={15} /></button></header><p>Invite teammates to review this conversation without exposing private context.</p><label>Access scope<select aria-label="Access scope"><option>Only invited people</option><option>Anyone in the workspace</option></select></label><div className="dialog-actions"><button className="secondary" onClick={() => setModal(null)}>Cancel</button><button className="primary" onClick={() => setModal(null)}><Share2 size={14} />Create secure link</button></div></dialog>}
  </div>;
};
void [Check, CheckCircle2, ChevronLeft, Copy, Code2, Grip, Hash];
void [ArrowDownUp];

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
