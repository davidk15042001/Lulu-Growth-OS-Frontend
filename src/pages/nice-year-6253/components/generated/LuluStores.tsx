import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowUpRight, Bot, Box, ChevronDown, ChevronRight, CircleCheck, CircleDot, Cloud, Ellipsis, Grid2X2, LayoutList, Link2, Plus, RefreshCw, Search, Settings2, Sparkles, Store as StoreIcon, UserRound, X } from 'lucide-react';
type StoreStatus = 'connected' | 'attention' | 'disconnected';
type Filter = 'all' | 'connected' | 'operational' | 'attention' | 'disconnected' | 'sync';
interface Store {
  id: string;
  name: string;
  initial: string;
  platform: string;
  domain: string;
  status: StoreStatus;
  sync: string;
  syncTime: string;
  currency: string;
  timezone: string;
  market: string;
  coverage: string[];
  gradient: string;
  orders: string;
  products: string;
  customers: string;
  lowStock: string;
}
const stores: Store[] = [];
const navItems = ['Overview', 'Stores', 'Products', 'Categories', 'Orders', 'Customers', 'Carts', 'Abandoned Carts', 'Returns', 'Refunds', 'Shipping', 'Inventory', 'Ecommerce Automation', 'Ecommerce Settings'];
const filterTabs: {
  id: Filter;
  label: string;
  count: number;
}[] = [];
const activityItems: any[][] = [];
const prompts = ['Is this store operating normally?', 'What needs attention?', 'Are there sync issues?', 'Which stores need attention?', 'Compare my stores', 'What happened during the last sync?'];
function Sidebar() {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><strong>LULU</strong><span className="brand-ai">AI</span></div><div className="workspace"><span className="workspace-dot" /> <span>Workspace stores</span><ChevronDown size={14} /></div><LuluSectionNavigation activeId="nice-year-6253" /><div className="sidebar-bottom"><a className="nav-item"><Settings2 size={16} /><span>Workspace Settings</span></a><div className="user-row"><span className="user-avatar">AM</span><span><strong>Workspace administrator</strong><small>Administrator</small></span><Ellipsis size={16} /></div></div></aside>;
}
function StatusPill({
  status,
  sync = false
}: {
  status: StoreStatus;
  sync?: boolean;
}) {
  const attention = status === 'attention';
  return <span className={'status-pill ' + (attention ? 'amber' : 'green')} aria-label={attention ? 'Attention required' : sync ? 'Synced' : 'Connected'}>{attention ? <AlertTriangle size={12} /> : <CircleCheck size={12} />}<span>{sync ? attention ? 'Sync Delayed' : 'Synced' : attention ? 'Attention Required' : 'Connected'}</span></span>;
}
function StoreCard({
  store,
  onMore,
  onOpen
}: {
  store: Store;
  onMore: () => void;
  onOpen: () => void;
}) {
  return <article className={'store-card ' + (store.status === 'attention' ? 'attention-card' : '')}><header className="store-head"><span className="store-avatar" style={{
        background: store.gradient
      }}>{store.initial}</span><div className="store-title"><h3>{store.name}</h3><span className={'platform ' + (store.platform === 'Shopify' ? 'shopify' : 'woocommerce')}>{store.platform}</span></div><button className="icon-btn" aria-label={'More options for ' + store.name} onClick={onMore}><Ellipsis size={18} /></button></header><p className="domain">{store.domain}</p><div className="status-row"><StatusPill status={store.status} /><span className="sync-text">{store.status === 'attention' ? <AlertTriangle size={13} /> : <CircleCheck size={13} />} {store.sync} · {store.syncTime}</span></div><dl className="store-meta"><div><dt>Currency</dt><dd>{store.currency}</dd></div><div><dt>Timezone</dt><dd>{store.timezone}</dd></div><div><dt>Market</dt><dd>{store.market}</dd></div></dl><div className="coverage"><span>Data coverage</span><div className="coverage-list">{['Products', 'Orders', 'Customers', 'Inventory', 'Payments'].map(item => <span key={item} className={store.coverage.includes(item) ? 'covered' : 'missing'}>{store.coverage.includes(item) ? <CircleCheck size={13} /> : <AlertTriangle size={13} />} {item}</span>)}</div></div>{store.status === 'attention' && <div className="attention-strip"><AlertTriangle size={14} /><span>Sync delayed — Last successful sync 23 min ago</span></div>}<footer className="card-footer"><button className="primary small" onClick={onOpen}>Open Store <ArrowUpRight size={14} /></button><button className="more-button" onClick={onMore}><Ellipsis size={16} /> More</button></footer></article>;
}
export function LuluStores() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [menu, setMenu] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState('');
  const visibleStores = useMemo(() => stores.filter(store => {
    const matchesQuery = [store.name, store.domain, store.platform].join(' ').toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || filter === 'connected' || filter === 'operational' && store.status === 'connected' && store.id !== 'brand' || filter === 'attention' && store.status === 'attention' || filter === 'sync' && store.status === 'attention' || filter === 'disconnected' && store.status === 'disconnected';
    return matchesQuery && matchesFilter;
  }), [filter, query]);
  const action = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };
  const { items: liveStores, loading: liveLoading, error: liveError } = useLiveRecords('ecommerce_stores');
  const liveEmpty = !liveLoading && !liveError && liveStores.length === 0;
  return <div className="app-shell">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">Loading live stores…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-4 py-3 text-xs text-muted-foreground">No live stores are available yet. Connect your commerce platform or add a store to begin.</div> : null}<style>{styles}</style><Sidebar /><main className="main-content"><header className="page-header"><div><div className="breadcrumb"><span>Ecommerce</span><ChevronRight size={14} /><strong>Stores</strong></div><h1>Stores</h1><p>Manage your connected ecommerce stores and monitor their operational status.</p></div><div className="header-actions"><button className="primary" onClick={() => action('Opening store connection flow…')}><Plus size={16} /> Add Store</button><button className="secondary" onClick={() => document.getElementById('ask-lulu')?.scrollIntoView({
            behavior: 'smooth'
          })}><Sparkles size={15} /> Ask Lulu AI</button><button className="icon-btn bordered" aria-label="Refresh stores" onClick={() => action('Store status refreshed')}><RefreshCw size={16} /></button><button className="icon-btn bordered" aria-label="More actions"><Ellipsis size={18} /></button></div></header><section className="stats-grid" aria-label="Store summary">{[{
          label: 'Connected Stores',
          value: '3',
          icon: <CircleCheck />,
          tone: 'teal',
          id: 'connected'
        }, {
          label: 'Operational',
          value: '2',
          icon: <CircleDot />,
          tone: 'green',
          id: 'operational'
        }, {
          label: 'Attention Required',
          value: '1',
          icon: <AlertTriangle />,
          tone: 'amber',
          id: 'attention'
        }, {
          label: 'Disconnected',
          value: '0',
          icon: <Cloud />,
          tone: 'gray',
          id: 'disconnected'
        }, {
          label: 'Sync Issues',
          value: '1',
          icon: <RefreshCw />,
          tone: 'amber',
          id: 'sync'
        }].map(stat => <button key={stat.id} className={'stat-card ' + (filter === stat.id ? 'selected' : '')} onClick={() => setFilter(stat.id as Filter)}><span className={'stat-icon ' + stat.tone}>{stat.icon}</span><span className="stat-copy"><strong>{stat.value}</strong><small>{stat.label}</small></span><ChevronRight size={15} /></button>)}</section><section className="directory-section"><div className="section-heading"><div><h2>Connected stores</h2><p>All stores connected to your Lulu AI workspace</p></div><span className="result-count">{visibleStores.length} of 3 stores</span></div><div className="filter-bar"><label className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search stores by name, domain, platform..." aria-label="Search stores" /></label><div className="filter-tabs" role="tablist">{filterTabs.map(tab => <button key={tab.id} className={filter === tab.id ? 'tab-active' : ''} onClick={() => setFilter(tab.id)} role="tab" aria-selected={filter === tab.id}>{tab.label} <span>{tab.count}</span></button>)}</div><div className="select-filters"><button>Platform <ChevronDown size={14} /></button><button>Country <ChevronDown size={14} /></button><button>Currency <ChevronDown size={14} /></button><button>Store Type <ChevronDown size={14} /></button><button className="clear" onClick={() => {
              setFilter('all');
              setQuery('');
            }}>Clear Filters</button></div><div className="view-controls"><button className="sort-button">Sort: Last synced <ChevronDown size={14} /></button><button className={view === 'grid' ? 'view-active' : ''} onClick={() => setView('grid')} aria-label="Grid view"><Grid2X2 size={16} /></button><button className={view === 'list' ? 'view-active' : ''} onClick={() => setView('list')} aria-label="List view"><LayoutList size={17} /></button></div></div><div className={'store-grid ' + (view === 'list' ? 'list-view' : '')}>{visibleStores.map(store => <StoreCard key={store.id} store={store} onOpen={() => action('Opening ' + store.name + '…')} onMore={() => setMenu(menu === store.id ? null : store.id)} />)}<button className="add-store-card" onClick={() => action('Opening store connection flow…')}><span className="add-icon"><Plus size={22} /></span><strong>Add Store</strong><span>Connect Shopify, WooCommerce, Webflow Ecommerce or another platform</span><span className="outline-button">Add Store</span></button>{menu && <div className="more-menu" role="menu"><button onClick={() => action('Opening store…')}>Open Store</button><button onClick={() => action('Switching store…')}>Switch to Store</button><button>View Activity</button><button>View Sync Status</button><button>Reconnect</button><button>Store Settings</button><hr /><button className="danger" onClick={() => setModal(true)}>Disconnect</button></div>}</div></section><section className="attention-section"><div className="section-heading"><div><h2>Stores Requiring Attention <span className="amber-badge">1</span></h2><p>Operational issues that may need your attention</p></div></div><article className="alert-panel"><div className="alert-icon"><AlertTriangle size={19} /></div><div className="alert-main"><div className="alert-title"><strong>Brand Store</strong><span className="platform woocommerce">WooCommerce</span><StatusPill status="attention" sync /></div><p>Synchronization has exceeded expected timing. Last successful sync was 23 minutes ago. Inventory data may be out of date.</p><div className="alert-details"><span><strong>Severity</strong> Warning</span><span><strong>Affected areas</strong> Inventory sync</span><span><strong>Timestamp</strong> 23 min ago</span></div></div><div className="alert-actions"><button className="primary small" onClick={() => action('Opening Brand Store…')}>Open Store</button><button className="secondary small" onClick={() => action('Sync details opened')}>View Sync Details</button><button className="text-button" onClick={() => action('Opening Integrations…')}>Open Integrations</button></div></article><div className="subsection-title"><h3>Synchronization</h3><span>Brand Store · WooCommerce</span></div><div className="table-card"><table><thead><tr><th>Data Area</th><th>Status</th><th>Last Sync</th><th>Details</th></tr></thead><tbody>{[['Products', 'Synced', '5 min ago', '1,247 products'], ['Orders', 'Synced', '5 min ago', '142 orders'], ['Customers', 'Synced', '5 min ago', '892 customers'], ['Inventory', 'Delayed', '23 min ago', 'Sync exceeded expected time'], ['Payments', 'Synced', '5 min ago', '105 transactions'], ['Fulfillment', 'Synced', '5 min ago', '89 shipments']].map(row => <tr key={row[0]}><td><strong>{row[0]}</strong></td><td><span className={row[1] === 'Delayed' ? 'table-status delayed' : 'table-status'}>{row[1] === 'Delayed' ? <AlertTriangle size={13} /> : <CircleCheck size={13} />} {row[1]}</span></td><td>{row[2]}</td><td>{row[3]}</td></tr>)}</tbody></table><div className="table-actions"><button className="secondary small" onClick={() => action('Retrying Brand Store sync…')}><RefreshCw size={14} /> Retry Sync</button><button className="text-button">View Details <ArrowUpRight size={14} /></button></div></div></section><section className="comparison-section"><div className="section-heading"><div><h2>Store Comparison</h2><p>Operational comparison across connected stores</p></div><div className="heading-right"><span className="info-badge">Deep analytics available in Intelligence <ArrowUpRight size={13} /></span><button className="text-button">View Intelligence <ArrowUpRight size={14} /></button></div></div><div className="table-card comparison-table"><table><thead><tr><th>Metric</th>{stores.map(store => <th key={store.id}>{store.name}</th>)}</tr></thead><tbody>{[['Connection', 'connected', 'connected', 'connected'], ['Sync Status', 'synced', 'delayed', 'synced'], ['Orders (Today)', '142', '105', '67'], ['Products', '1,247', '892', '634'], ['Customers', '892', '567', '389'], ['Low Stock Items', '23', '18', '12'], ['Operational Health', 'healthy', 'attention', 'healthy']].map(row => <tr key={row[0]}><td><strong>{row[0]}</strong></td>{row.slice(1).map(cell => <td key={String(cell)}>{['connected', 'synced', 'healthy'].includes(cell) ? <span className="table-status"><CircleCheck size={13} /> {cell[0].toUpperCase() + cell.slice(1)}</span> : cell === 'delayed' || cell === 'attention' ? <span className="table-status delayed"><AlertTriangle size={13} /> {cell[0].toUpperCase() + cell.slice(1)}</span> : cell}</td>)}</tr>)}</tbody></table></div></section><section className="activity-section"><div className="section-heading"><div><h2>Recent Store Activity</h2><p>Latest operational events across your connected stores</p></div><button className="text-button">View All Activity <ArrowUpRight size={14} /></button></div><div className="activity-card">{activityItems.map(item => <div className="activity-row" key={item.join('-')}><span className={'activity-icon ' + item[0]}>{item[0] === 'check' ? <CircleCheck size={15} /> : item[0] === 'warn' ? <AlertTriangle size={15} /> : item[0] === 'box' ? <Box size={15} /> : item[0] === 'sync' ? <RefreshCw size={15} /> : item[0] === 'user' ? <UserRound size={15} /> : <Link2 size={15} />}</span><strong>{item[1]}</strong><span className="activity-store">{item[2]}</span><time>{item[3]}</time><span className="source">{item[4]}</span></div>)}</div></section><section className="connect-section"><div className="section-heading"><div><h2>Connect Another Store</h2><p>Connect a new ecommerce platform to Lulu AI</p></div></div><div className="platform-grid">{[['Shopify', 'Connect your Shopify store', 'shopify', 'Connect'], ['WooCommerce', 'Connect your WooCommerce store', 'woocommerce', 'Connect'], ['Webflow Ecommerce', 'Connect your Webflow store', 'webflow', 'Connect'], ['Other Platform', 'Connect another supported platform', 'other', 'Explore']].map(platform => <article className="platform-card" key={platform[0]}><span className={'platform-logo ' + platform[2]}>{platform[0] === 'Shopify' ? 'S' : platform[0] === 'WooCommerce' ? 'W' : platform[0] === 'Webflow Ecommerce' ? 'W' : '＋'}</span><strong>{platform[0]}</strong><p>{platform[1]}</p><button className="outline-button" onClick={() => action(platform[3] + ' ' + platform[0] + '…')}>{platform[3]}</button></article>)}</div><p className="integration-note">Platform authentication is handled through Lulu AI Integrations. <button className="text-button">Explore Integrations <ArrowUpRight size={13} /></button></p></section><section className="ask-section" id="ask-lulu"><div className="ask-header"><span className="ai-spark"><Sparkles size={18} /></span><div><span className="ai-label">AI INSIGHT</span><h2>Ask Lulu AI</h2></div></div><p className="ask-subtitle">Get operational answers from your connected store data.</p><label className="ai-input"><Sparkles size={17} /><input placeholder="Ask Lulu AI about your stores..." /><button onClick={() => action('Lulu AI is analyzing your stores…')} aria-label="Ask Lulu AI"><ArrowUpRight size={17} /></button></label><div className="prompt-row">{prompts.map(prompt => <button key={prompt} onClick={() => action('Prompt selected: ' + prompt)}>{prompt}</button>)}</div><div className="ai-actions">{['Analyze Store Health', 'Analyze Sync Issues', 'Compare Stores', 'Create Store Report', 'Find Operational Issues'].map(item => <button key={item} onClick={() => action(item + '…')}><Sparkles size={14} />{item}</button>)}</div><small>AI responses reference connected store data only.</small></section></main>{modal && <div className="modal-backdrop" role="presentation" onClick={() => setModal(false)}><section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="disconnect-title" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setModal(false)} aria-label="Close"><X size={18} /></button><span className="modal-warning"><AlertTriangle size={19} /></span><h2 id="disconnect-title">Disconnect Store?</h2><p>Disconnecting this store will stop synchronization with Lulu AI. Existing synchronized data will remain available according to your data-retention settings.</p><div className="modal-store"><span className="store-avatar" style={{
            background: stores[1].gradient
          }}>B</span><strong>Brand Store</strong><span>(WooCommerce)</span></div><footer><button className="secondary" onClick={() => setModal(false)}>Cancel</button><button className="danger-button" onClick={() => {
            setModal(false);
            action('Brand Store disconnected');
          }}>Disconnect Store</button></footer></section></div>}{notice && <div className="toast" role="status"><CircleCheck size={16} />{notice}</div>}</div>;
}
const styles = `
:root{--navy:var(--foreground);--navy-2:var(--foreground);--ink:var(--foreground);--muted:var(--muted-foreground);--line:var(--border);--violet:var(--primary);--teal:var(--primary);--amber:var(--chart-1);--canvas:var(--background)}*{box-sizing:border-box}button,input{font:inherit}button{cursor:pointer}body{font-family:Inter,ui-sans-serif,system-ui,sans-serif;background:var(--canvas);color:var(--ink)}.app-shell{display:flex;min-height:100vh}.sidebar{width:244px;flex:0 0 244px;background:var(--navy);color:var(--muted-foreground);padding:22px 13px 14px;display:flex;flex-direction:column}.brand{display:flex;align-items:center;gap:8px;color:var(--foreground);font-size:19px;letter-spacing:.06em;padding:0 12px 24px}.brand-mark{width:26px;height:26px;display:grid;place-items:center;background:var(--primary);border-radius:8px;color:var(--primary-foreground)}.brand-ai{font-size:10px;color:var(--muted-foreground);letter-spacing:.12em;margin-left:-5px;margin-top:4px}.workspace{margin:0 5px 24px;padding:11px 10px;border:1px solid var(--muted-foreground);border-radius:7px;color:var(--foreground);font-size:12px;display:flex;align-items:center;gap:8px}.workspace-dot{width:7px;height:7px;background:var(--primary);border-radius:50%;color:var(--primary-foreground)}.nav-label{font-size:10px;letter-spacing:.11em;font-weight:700;color:var(--muted-foreground);padding:0 13px;margin:0 0 7px}.ecommerce-label{display:flex;align-items:center;justify-content:space-between;margin-top:22px}.nav-item{height:32px;margin:2px 0;display:flex;align-items:center;gap:10px;color:var(--muted-foreground);text-decoration:none;padding:0 12px;border-radius:6px;font-size:12px;position:relative}.nav-item:hover{background:var(--background);color:var(--foreground)}.nav-item.active{background:var(--background);color:var(--foreground)}.subnav{padding-left:15px}.nav-bullet{width:16px;display:grid;place-items:center}.nav-bullet>span{width:4px;height:4px;background:var(--muted);border-radius:50%}.active .nav-bullet{color:var(--foreground)}.active-indicator{position:absolute;left:-13px;width:3px;height:22px;border-radius:0 3px 3px 0;background:var(--primary);color:var(--primary-foreground)}.sidebar-bottom{margin-top:auto}.user-row{border-top:1px solid var(--muted-foreground);padding:15px 7px 3px;margin-top:14px;display:flex;align-items:center;gap:9px;font-size:11px;color:var(--foreground)}.user-row strong,.user-row small{display:block}.user-row small{color:var(--muted-foreground);font-size:10px;margin-top:3px}.user-avatar{width:29px;height:29px;border-radius:50%;background:var(--muted);color:var(--foreground);display:grid;place-items:center;font-size:10px;font-weight:700}.user-row>svg{margin-left:auto;color:var(--muted-foreground)}.main-content{min-width:0;flex:1;padding:31px 38px 70px;max-width:1510px}.page-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:27px}.breadcrumb{display:flex;align-items:center;gap:8px;color:var(--muted-foreground);font-size:12px;margin-bottom:13px}.breadcrumb strong{color:var(--muted-foreground);font-weight:600}.page-header h1{font-size:30px;letter-spacing:-.04em;margin:0 0 5px;color:var(--foreground)}.page-header p,.section-heading p{margin:0;color:var(--muted);font-size:13px}.header-actions{display:flex;gap:9px;align-items:center}.primary,.secondary,.outline-button,.more-button,.text-button,.sort-button,.icon-btn,.select-filters button,.view-controls button,.filter-tabs button{border:0;background:none;display:inline-flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap}.primary{background:var(--violet);color:var(--primary-foreground);padding:10px 14px;border-radius:7px;font-size:12px;font-weight:650;box-shadow:0 2px 6px var(--border)}.primary:hover{background:var(--primary);color:var(--primary-foreground)}.secondary{background:var(--card);color:var(--muted-foreground);border:1px solid var(--line);padding:9px 13px;border-radius:7px;font-size:12px;font-weight:600}.secondary:hover,.more-button:hover{border-color:var(--foreground);color:var(--foreground)}.icon-btn{color:var(--muted-foreground);padding:7px;border-radius:6px}.bordered{background:var(--card);border:1px solid var(--line)}.stats-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:31px}.stat-card{background:var(--card);border:1px solid var(--line);border-radius:8px;box-shadow:0 2px 5px var(--muted-foreground);padding:14px 13px;display:flex;align-items:center;text-align:left;gap:10px;color:var(--muted-foreground);transition:.18s}.stat-card:hover,.stat-card.selected{border-color:var(--foreground);box-shadow:0 0 0 2px var(--foreground)}.stat-card>svg{margin-left:auto}.stat-icon{width:29px;height:29px;border-radius:7px;display:grid;place-items:center}.stat-icon svg{width:16px}.stat-icon.teal{color:var(--foreground);background:var(--secondary)}.stat-icon.green{color:var(--foreground);background:var(--secondary)}.stat-icon.amber{color:var(--foreground);background:var(--secondary)}.stat-icon.gray{color:var(--muted-foreground);background:var(--secondary)}.stat-copy strong,.stat-copy small{display:block}.stat-copy strong{color:var(--foreground);font-size:20px;line-height:20px}.stat-copy small{font-size:11px;margin-top:3px}.section-heading{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:15px}.section-heading h2{font-size:17px;letter-spacing:-.02em;margin:0 0 4px;color:var(--foreground)}.result-count{font-size:11px;color:var(--muted-foreground)}.filter-bar{display:grid;grid-template-columns:280px 1fr auto;gap:12px;align-items:center;margin-bottom:17px}.search-box{height:35px;background:var(--card);border:1px solid var(--line);border-radius:6px;display:flex;align-items:center;padding:0 10px;gap:8px;color:var(--muted-foreground)}.search-box input{border:0;outline:0;width:100%;font-size:11px;color:var(--foreground)}.filter-tabs{display:flex;align-items:center;gap:4px;overflow:auto}.filter-tabs button{padding:7px 8px;border-radius:18px;color:var(--muted-foreground);font-size:10px}.filter-tabs button:hover{background:var(--secondary);color:var(--foreground)}.filter-tabs button.tab-active{color:var(--foreground);background:var(--secondary);font-weight:650}.filter-tabs span{color:var(--muted-foreground)}.select-filters{display:flex;gap:4px;grid-column:1 / 3}.select-filters button{border:1px solid var(--line);background:var(--card);border-radius:5px;padding:7px 9px;color:var(--muted-foreground);font-size:10px}.select-filters .clear{border:0;color:var(--foreground);background:transparent;margin-left:5px}.view-controls{display:flex;gap:3px;justify-content:flex-end}.view-controls button{padding:7px;color:var(--muted-foreground);border:1px solid var(--line);background:var(--card)}.view-controls button:first-of-type{border-radius:5px 0 0 5px}.view-controls button:last-of-type{border-radius:0 5px 5px 0;margin-left:-4px}.view-controls .view-active{color:var(--foreground);background:var(--secondary)}.sort-button{margin-right:7px;border:1px solid var(--line)!important;border-radius:5px!important;font-size:10px!important;color:var(--muted-foreground)!important}.store-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;position:relative}.store-card,.add-store-card,.table-card,.activity-card{background:var(--card);border:1px solid var(--line);border-radius:8px;box-shadow:0 2px 7px var(--muted-foreground)}.store-card{padding:17px 17px 13px;min-height:310px;transition:transform .18s,box-shadow .18s}.store-card:hover{transform:translateY(-2px);box-shadow:0 7px 20px var(--foreground)}.attention-card{border-color:var(--chart-1);box-shadow:0 2px 7px var(--chart-1)}.store-head{display:flex;align-items:center;gap:10px}.store-avatar{flex:0 0 36px;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:var(--foreground);font-size:17px;font-weight:750}.store-title{min-width:0}.store-title h3{font-size:14px;margin:0 0 5px;color:var(--foreground)}.platform{display:inline-flex;align-items:center;border-radius:4px;padding:3px 6px;font-size:10px;font-weight:650}.platform.shopify{color:var(--foreground);background:var(--secondary)}.platform.woocommerce{color:var(--foreground);background:var(--secondary)}.store-head .icon-btn{margin-left:auto}.domain{font-size:11px;color:var(--muted-foreground);margin:13px 0 14px}.status-row{display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border);padding-bottom:13px}.status-pill{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:650;padding:4px 7px;border-radius:15px}.status-pill.green{background:var(--secondary);color:var(--foreground)}.status-pill.amber{background:var(--secondary);color:var(--chart-1)}.sync-text{display:flex;align-items:center;gap:4px;color:var(--muted-foreground);font-size:10px}.sync-text svg{color:var(--foreground)}.attention-card .sync-text svg{color:var(--chart-1)}.store-meta{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:8px;padding:13px 0;border-bottom:1px solid var(--border);margin:0}.store-meta dt{font-size:9px;color:var(--muted-foreground);margin-bottom:4px}.store-meta dd{font-size:10px;color:var(--muted-foreground);margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.coverage{padding:11px 0 10px}.coverage>span{font-size:9px;color:var(--muted-foreground)}.coverage-list{display:flex;gap:8px;margin-top:7px;flex-wrap:wrap}.coverage-list span{display:flex;align-items:center;gap:3px;font-size:9px;color:var(--muted-foreground)}.coverage-list .covered svg{color:var(--foreground)}.coverage-list .missing{color:var(--chart-1)}.coverage-list .missing svg{color:var(--chart-1)}.attention-strip{display:flex;align-items:center;gap:6px;background:var(--secondary);color:var(--chart-1);border-radius:4px;padding:7px 8px;font-size:9px;margin:2px 0 10px}.card-footer{display:flex;align-items:center;gap:8px;margin-top:7px}.small{font-size:10px;padding:7px 10px}.more-button{border:1px solid var(--line);padding:6px 9px;border-radius:5px;color:var(--muted-foreground);font-size:10px}.add-store-card{min-height:310px;border-style:dashed;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:27px;text-align:center;color:var(--muted-foreground);gap:9px;box-shadow:none}.add-store-card:hover{border-color:var(--foreground);background:var(--card)}.add-icon{width:41px;height:41px;border-radius:50%;background:var(--secondary);color:var(--foreground);display:grid;place-items:center}.add-store-card strong{font-size:14px;color:var(--muted-foreground)}.add-store-card>span:not(.add-icon):not(.outline-button){font-size:11px;line-height:17px;max-width:200px}.outline-button{border:1px solid var(--border);color:var(--foreground);border-radius:5px;padding:7px 13px;font-size:10px;background:var(--card)}.more-menu{position:absolute;right:13px;top:65px;width:174px;background:var(--card);border:1px solid var(--line);border-radius:7px;box-shadow:0 12px 25px var(--muted-foreground);padding:5px;z-index:4}.more-menu button{display:block;text-align:left;width:100%;border:0;background:transparent;padding:8px 9px;font-size:11px;color:var(--muted-foreground);border-radius:4px}.more-menu button:hover{background:var(--card);color:var(--foreground)}.more-menu .danger{color:var(--foreground)}.more-menu hr{border:0;border-top:1px solid var(--line);margin:4px}.attention-section,.comparison-section,.activity-section,.connect-section,.ask-section{margin-top:40px}.amber-badge{font-size:10px;color:var(--chart-1);background:var(--secondary);border-radius:12px;padding:3px 7px;vertical-align:2px;margin-left:5px}.alert-panel{display:flex;gap:14px;background:var(--card);border:1px solid var(--border);border-left:3px solid var(--border);border-radius:7px;padding:17px}.alert-icon{color:var(--foreground);background:var(--secondary);width:32px;height:32px;display:grid;place-items:center;border-radius:7px;flex:0 0 auto}.alert-main{flex:1;min-width:0}.alert-title{display:flex;align-items:center;gap:8px}.alert-title>strong{font-size:13px}.alert-title .status-pill{margin-left:auto}.alert-main p{font-size:11px;line-height:18px;color:var(--muted-foreground);margin:9px 0 13px}.alert-details{display:flex;gap:26px;color:var(--muted-foreground);font-size:10px}.alert-details strong{display:block;color:var(--foreground);font-size:9px;margin-bottom:3px}.alert-actions{display:flex;flex-direction:column;align-items:flex-end;gap:7px;min-width:125px}.text-button{color:var(--foreground);font-size:11px;padding:5px;font-weight:600}.subsection-title{display:flex;align-items:baseline;gap:10px;margin:28px 0 12px}.subsection-title h3{font-size:15px;margin:0}.subsection-title span{font-size:10px;color:var(--muted-foreground)}.table-card{overflow:hidden}.table-card table{width:100%;border-collapse:collapse;font-size:11px}.table-card th{background:var(--card);text-align:left;color:var(--muted-foreground);font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.05em}.table-card th,.table-card td{padding:11px 15px;border-bottom:1px solid var(--border)}.table-card td{color:var(--muted-foreground)}.table-card td strong{color:var(--muted-foreground);font-weight:600}.table-status{display:inline-flex;align-items:center;gap:4px;color:var(--foreground);font-size:10px}.table-status.delayed{color:var(--chart-1)}.table-actions{display:flex;align-items:center;gap:14px;padding:11px 15px}.heading-right{display:flex;align-items:center;gap:17px}.info-badge{display:flex;align-items:center;gap:4px;color:var(--foreground);background:var(--secondary);border-radius:15px;padding:5px 9px;font-size:10px}.comparison-table th:not(:first-child),.comparison-table td:not(:first-child){text-align:right}.activity-card{padding:4px 16px}.activity-row{min-height:42px;display:grid;grid-template-columns:26px 1.8fr 1.1fr .55fr .5fr;gap:10px;align-items:center;border-bottom:1px solid var(--border);font-size:10px}.activity-row:last-child{border:0}.activity-icon{width:24px;height:24px;border-radius:6px;display:grid;place-items:center;background:var(--secondary);color:var(--foreground)}.activity-icon.warn{color:var(--chart-1);background:var(--secondary)}.activity-icon.box{color:var(--foreground);background:var(--secondary)}.activity-icon.sync{color:var(--foreground);background:var(--secondary)}.activity-icon.user{color:var(--muted-foreground);background:var(--secondary)}.activity-icon.link{color:var(--foreground);background:var(--secondary)}.activity-row strong{color:var(--muted-foreground);font-weight:600}.activity-store{color:var(--foreground)}.activity-row time,.source{color:var(--muted-foreground)}.source{text-align:right}.platform-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.platform-card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:17px;min-height:156px;display:flex;flex-direction:column;align-items:flex-start}.platform-logo{width:30px;height:30px;border-radius:7px;display:grid;place-items:center;font-size:17px;font-weight:800;margin-bottom:12px}.platform-logo.shopify{color:var(--foreground);background:var(--secondary)}.platform-logo.woocommerce{color:var(--foreground);background:var(--secondary)}.platform-logo.webflow{color:var(--foreground);background:var(--secondary)}.platform-logo.other{color:var(--muted-foreground);background:var(--secondary)}.platform-card strong{font-size:12px}.platform-card p{font-size:10px;color:var(--muted-foreground);margin:6px 0 13px}.platform-card .outline-button{margin-top:auto}.integration-note{font-size:10px;color:var(--muted-foreground);margin:14px 0 0}.integration-note .text-button{font-size:10px}.ask-section{background:linear-gradient(110deg,var(--primary),var(--primary) 60%,var(--primary));border-radius:10px;color:var(--primary-foreground);padding:22px 25px;margin-bottom:30px}.ask-header{display:flex;align-items:center;gap:10px}.ai-spark{display:grid;place-items:center;width:32px;height:32px;background:var(--card);border:1px solid var(--border);border-radius:8px}.ai-label{font-size:9px;letter-spacing:.13em;color:var(--foreground)}.ask-section h2{font-size:18px;margin:2px 0 0}.ask-subtitle{font-size:11px;color:var(--foreground);margin:8px 0 16px}.ai-input{height:39px;border-radius:6px;background:var(--card);display:flex;align-items:center;gap:9px;padding:0 11px;color:var(--foreground)}.ai-input input{border:0;outline:0;flex:1;font-size:11px;color:var(--muted-foreground)}.ai-input button{border:0;background:var(--primary);color:var(--primary-foreground);width:27px;height:27px;border-radius:5px;display:grid;place-items:center}.prompt-row{display:flex;gap:7px;overflow:auto;margin:14px 0}.prompt-row button,.ai-actions button{border:1px solid var(--border);background:var(--card);color:var(--foreground);border-radius:15px;padding:6px 9px;font-size:10px;white-space:nowrap}.prompt-row button:hover,.ai-actions button:hover{background:var(--card)}.ai-actions{display:flex;gap:7px;flex-wrap:wrap}.ai-actions button{border-radius:5px;display:flex;align-items:center;gap:5px}.ask-section small{display:block;color:var(--foreground);font-size:9px;margin-top:18px}.modal-backdrop{position:fixed;inset:0;background:var(--background);display:grid;place-items:center;z-index:10;padding:20px}.confirm-modal{width:min(420px,100%);background:var(--card);border-radius:10px;padding:26px;box-shadow:0 20px 60px var(--muted-foreground);position:relative}.modal-close{position:absolute;right:14px;top:14px;border:0;background:none;color:var(--muted-foreground)}.modal-warning{width:38px;height:38px;border-radius:9px;background:var(--secondary);color:var(--chart-1);display:grid;place-items:center}.confirm-modal h2{margin:15px 0 7px;font-size:18px}.confirm-modal p{font-size:11px;line-height:18px;color:var(--muted-foreground);margin:0 0 17px}.modal-store{display:flex;align-items:center;gap:8px;padding:11px;background:var(--secondary);border-radius:6px;font-size:11px;margin-bottom:20px}.modal-store .store-avatar{width:28px;height:28px;font-size:13px}.modal-store span:last-child{color:var(--muted-foreground)}.confirm-modal footer{display:flex;justify-content:flex-end;gap:8px}.danger-button{border:0;background:var(--primary);color:var(--primary-foreground);border-radius:6px;padding:9px 12px;font-size:11px;font-weight:650}.danger-button:hover{background:var(--primary);color:var(--primary-foreground)}.toast{position:fixed;right:25px;bottom:24px;background:var(--background);color:var(--foreground);border-radius:7px;padding:11px 14px;display:flex;align-items:center;gap:8px;font-size:11px;box-shadow:0 8px 25px var(--foreground);z-index:12}.toast svg{color:var(--foreground)}.list-view{grid-template-columns:1fr}.list-view .store-card{min-height:auto}.list-view .add-store-card{min-height:150px}
@media(max-width:1100px){.sidebar{width:210px;flex-basis:210px}.main-content{padding:26px 22px}.filter-bar{grid-template-columns:1fr 1fr}.filter-tabs{grid-column:1 / -1;grid-row:2}.select-filters{grid-column:1 / -1;grid-row:3}.view-controls{grid-column:2;grid-row:3}.store-grid{grid-template-columns:repeat(2,1fr)}.platform-grid{grid-template-columns:repeat(2,1fr)}.stats-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:720px){.app-shell{display:block}.sidebar{width:100%;height:auto;padding:12px;display:block}.brand{padding-bottom:12px}.workspace,.sidebar nav,.sidebar-bottom{display:none}.main-content{padding:20px 14px 45px}.page-header{display:block}.page-header h1{font-size:27px}.header-actions{margin-top:17px;flex-wrap:wrap}.stats-grid{grid-template-columns:repeat(2,1fr);gap:8px}.stat-card{padding:11px 9px}.stat-copy small{font-size:10px}.filter-bar{display:flex;flex-wrap:wrap}.search-box{width:100%}.filter-tabs{width:100%;order:2}.select-filters{order:3;width:100%;overflow:auto}.view-controls{order:4;margin-left:auto}.store-grid{grid-template-columns:1fr}.store-card{min-height:0}.alert-panel{display:block}.alert-title{flex-wrap:wrap}.alert-title .status-pill{margin-left:0}.alert-details{gap:12px;flex-wrap:wrap}.alert-actions{margin-top:16px;align-items:flex-start;flex-direction:row;flex-wrap:wrap}.table-card{overflow-x:auto}.table-card table{min-width:610px}.heading-right{display:none}.activity-card{overflow-x:auto}.activity-row{min-width:610px}.platform-grid{grid-template-columns:1fr 1fr}.platform-card{padding:13px}.ask-section{padding:18px}.ai-actions{gap:5px}}
`;
export function LuluStoresStyles() {
  return <style>{styles}</style>;
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
