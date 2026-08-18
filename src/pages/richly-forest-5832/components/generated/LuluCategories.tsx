import * as React from 'react';
import { ChevronDown, ChevronRight, ChevronsUpDown, CircleAlert, CircleCheck, Clock3, Copy, Ellipsis, GripVertical, LayoutGrid, List, MoreHorizontal, Package, Plus, RefreshCw, Search, Settings2, Sparkles, Store, Tags, Trash2, Users, X, Zap } from 'lucide-react';
const navItems = ['Dashboard', 'AI Platform', 'CRM', 'Marketing', 'Advertising', 'Ecommerce', 'Reports', 'Settings'];
const subItems = ['Overview', 'Stores', 'Products', 'Categories', 'Orders', 'Inventory', 'Reviews', 'Merchandising', 'Automation'];
const treeItems = [{
  id: 'electronics',
  name: 'Electronics',
  count: 23,
  stores: ['Shopify', 'WooCommerce'],
  children: [{
    id: 'smartphones',
    name: 'Smartphones',
    count: 8
  }, {
    id: 'laptops',
    name: 'Laptops',
    count: 11
  }, {
    id: 'accessories-electronics',
    name: 'Accessories',
    count: 4
  }]
}, {
  id: 'clothing',
  name: 'Clothing',
  count: 31,
  stores: ['Shopify'],
  children: [{
    id: 'mens',
    name: "Men's",
    count: 14
  }, {
    id: 'womens',
    name: "Women's",
    count: 13
  }, {
    id: 'accessories-clothing',
    name: 'Accessories',
    count: 4
  }]
}, {
  id: 'home',
  name: 'Home',
  count: 18,
  stores: ['WooCommerce'],
  children: [{
    id: 'furniture',
    name: 'Furniture',
    count: 7
  }, {
    id: 'lighting',
    name: 'Lighting',
    count: 5
  }, {
    id: 'decor',
    name: 'Decor',
    count: 6
  }]
}];
const categories = [{
  id: 'electronics-row',
  name: 'Electronics',
  parent: '— (root)',
  store: 'Shopify',
  icon: '▦',
  products: 23,
  status: 'Active',
  visibility: 'Visible',
  updated: '2h ago',
  operational: 'Synced ✓'
}, {
  id: 'smartphones-row',
  name: 'Smartphones',
  parent: 'Electronics',
  store: 'Shopify',
  icon: '◫',
  products: 8,
  status: 'Active',
  visibility: 'Visible',
  updated: '1d ago',
  operational: 'Synced ✓'
}, {
  id: 'laptops-row',
  name: 'Laptops',
  parent: 'Electronics',
  store: 'Shopify',
  icon: '▤',
  products: 11,
  status: 'Active',
  visibility: 'Visible',
  updated: '1d ago',
  operational: 'Syncing ↻'
}, {
  id: 'summer-row',
  name: 'Summer Collection',
  parent: 'Clothing',
  store: 'WooCommerce',
  icon: '✦',
  products: 0,
  status: 'Draft',
  visibility: 'Hidden',
  updated: '5d ago',
  operational: '⚠ Attention'
}, {
  id: 'accessories-row',
  name: 'Accessories',
  parent: 'Home',
  store: 'Webflow',
  icon: '◇',
  products: 2,
  status: 'Active',
  visibility: 'Visible',
  updated: '3d ago',
  operational: 'Synced ✓'
}];
const emptyCategories = [{
  id: 'empty-summer',
  name: 'Summer Collection',
  store: 'WooCommerce',
  updated: '5d ago'
}, {
  id: 'empty-sale',
  name: 'Old Specials',
  store: 'Shopify',
  updated: '3d ago'
}, {
  id: 'empty-gifts',
  name: 'Gift Ideas',
  store: 'Webflow',
  updated: '8d ago'
}, {
  id: 'empty-new',
  name: 'New Arrivals',
  store: 'Shopify',
  updated: '12d ago'
}];
const uncategorized = [{
  id: 'p1',
  name: 'Canvas Travel Backpack',
  sku: 'LUL-2041',
  store: 'Shopify',
  status: 'Active'
}, {
  id: 'p2',
  name: 'Minimal Desk Lamp',
  sku: 'HOM-1180',
  store: 'WooCommerce',
  status: 'Active'
}, {
  id: 'p3',
  name: 'Everyday Cotton Shirt',
  sku: 'APP-3309',
  store: 'Shopify',
  status: 'Draft'
}];
const quality = [{
  id: 'q1',
  label: 'Name',
  state: 'Complete',
  percent: 100,
  tone: 'good'
}, {
  id: 'q2',
  label: 'Description',
  state: '6 incomplete',
  percent: 84,
  tone: 'warn'
}, {
  id: 'q3',
  label: 'Image',
  state: '11 missing',
  percent: 71,
  tone: 'bad'
}, {
  id: 'q4',
  label: 'SEO Metadata',
  state: '8 incomplete',
  percent: 78,
  tone: 'warn'
}, {
  id: 'q5',
  label: 'Parent Assignment',
  state: 'Complete',
  percent: 100,
  tone: 'good'
}, {
  id: 'q6',
  label: 'Store Sync',
  state: 'Synced',
  percent: 96,
  tone: 'good'
}];
const activity = [{
  id: 'a1',
  text: "Category 'Laptops' synced",
  who: 'System',
  time: '2h ago',
  store: 'Shopify'
}, {
  id: 'a2',
  text: "New category 'Summer Sale' created",
  who: 'Admin',
  time: '5h ago',
  store: 'WooCommerce'
}, {
  id: 'a3',
  text: "3 products assigned to 'Accessories'",
  who: 'Admin',
  time: '1d ago',
  store: 'Shopify'
}, {
  id: 'a4',
  text: 'AI categorized 5 products',
  who: 'Lulu AI',
  time: '2d ago',
  store: 'All Stores'
}, {
  id: 'a5',
  text: "Category 'Old Specials' archived",
  who: 'Admin',
  time: '3d ago',
  store: 'Shopify'
}];
function StoreMark({
  store
}: {
  store: string;
}) {
  return <span className={`store-mark ${store.toLowerCase().replace('woocommerce', 'woo')}`}>{store === 'Shopify' ? 'S' : store === 'WooCommerce' ? 'W' : 'Wf'}</span>;
}
function Status({
  children,
  tone = 'green'
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={`status status-${tone}`}><span className="status-dot" />{children}</span>;
}
function Sidebar({
  activeNav,
  setActiveNav
}: {
  activeNav: string;
  setActiveNav: (value: string) => void;
}) {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>Lulu<span className="brand-ai">AI</span></span></div><div className="workspace"><span className="workspace-avatar">L</span><span><strong>Lulu Workspace</strong><small>Admin workspace</small></span><ChevronsUpDown size={15} /></div><LuluSectionNavigation activeId="richly-forest-5832" /><div className="sidebar-bottom"><button className="help-button"><CircleAlert size={16} />Help & Support</button><div className="profile"><span className="profile-avatar">JD</span><span><strong>Jordan Davis</strong><small>jordan@lulu.ai</small></span><Ellipsis size={17} /></div></div></aside>;
}
export function LuluCategories() {
  const [activeNav, setActiveNav] = React.useState('Ecommerce');
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    products: true,
    electronics: true,
    clothing: true,
    home: true
  });
  const [view, setView] = React.useState('Hierarchy');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [collapsed, setCollapsed] = React.useState({
    empty: false,
    uncategorized: false
  });
  const toggle = (key: string) => setExpanded(current => ({
    ...current,
    [key]: !current[key]
  }));
  const toggleSelected = (id: string) => setSelected(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  return <div className="app-shell"><Sidebar activeNav={activeNav} setActiveNav={setActiveNav} /><main className="main-content"><header className="page-header"><div><div className="breadcrumb"><span>Ecommerce</span><span>/</span><strong>Categories</strong></div><h1>Categories</h1><p>Organize your products into clear, structured categories across your ecommerce stores.</p></div><div className="header-actions"><button className="button primary"><Plus size={17} />Add Category</button><button className="button ai"><Sparkles size={16} />Ask Lulu AI</button><button className="icon-button" aria-label="Refresh"><RefreshCw size={17} /></button><button className="icon-button" aria-label="More options"><MoreHorizontal size={18} /></button></div></header>
      <section className="toolbar"><button className="store-selector"><span className="store-selector-icon"><Store size={17} /></span><span><strong>All Stores</strong><small>3 connected stores <i /></small></span><ChevronDown size={16} /></button><label className="search-box"><Search size={17} /><input placeholder="Search categories by name, ID, or parent..." /></label><button className="filter-button"><Settings2 size={16} />Filters <span>2</span></button><div className="view-toggle">{[{
            id: 'List',
            icon: List
          }, {
            id: 'Hierarchy',
            icon: ChevronsUpDown
          }, {
            id: 'Grid',
            icon: LayoutGrid
          }].map(({
            id,
            icon: Icon
          }) => <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}><Icon size={16} />{id}</button>)}</div></section>
      <section className="summary-grid">{[{
          id: 'total',
          label: 'Total Categories',
          value: '48',
          sub: 'Across all stores',
          icon: Tags
        }, {
          id: 'active',
          label: 'Active Categories',
          value: '41',
          sub: '85.4% of total',
          icon: CircleCheck,
          tone: 'good'
        }, {
          id: 'empty',
          label: 'Empty Categories',
          value: '4',
          sub: 'Need attention',
          icon: Package,
          tone: 'warn'
        }, {
          id: 'uncat',
          label: 'Uncategorized Products',
          value: '12',
          sub: 'Across 3 stores',
          icon: Copy,
          tone: 'orange'
        }, {
          id: 'attention',
          label: 'Attention Required',
          value: '3',
          sub: 'Requires review',
          icon: CircleAlert,
          tone: 'bad'
        }].map(({
          id,
          label,
          value,
          sub,
          icon: Icon,
          tone
        }) => <article className="summary-card" key={id}><span className={`metric-icon ${tone || ''}`}><Icon size={18} /></span><div><p>{label}</p><strong>{value}</strong><small>{sub}</small></div>{tone === 'good' && <span className="metric-trend">↗</span>}</article>)}</section>
      <section className="panel hierarchy-panel"><div className="section-heading"><div><h2>Category Hierarchy</h2><p>Manage structure and relationships across your catalog.</p></div><div className="heading-actions"><span className="chip">All Stores <X size={13} /></span><button className="icon-button" aria-label="Collapse hierarchy" onClick={() => toggle('products')}><ChevronDown size={17} className={!expanded.products ? 'rotate-[-90deg]' : ''} /></button></div></div>{expanded.products && <div className="tree" role="tree"><div className="tree-row root" role="treeitem"><button className="chevron" onClick={() => toggle('products')}><ChevronDown size={16} /></button><GripVertical size={15} className="drag" /><span className="tree-name"><strong>Products</strong></span><span className="count-badge">72 products</span><Status>Active</Status><button className="row-menu" aria-label="Products actions"><Ellipsis size={17} /></button></div>{treeItems.map(item => <div className="tree-group" key={item.id}><div className="tree-row" role="treeitem"><button className="chevron" onClick={() => toggle(item.id)}>{expanded[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button><GripVertical size={15} className="drag" /><span className="tree-name"><strong>{item.name}</strong></span><span className="count-badge">{item.count} products</span>{item.stores.map(store => <span className="platform-chip" key={store}><StoreMark store={store} />{store}</span>)}<Status>Active</Status><button className="row-menu" aria-label={`${item.name} actions`}><Ellipsis size={17} /></button></div>{expanded[item.id] && <div className="tree-children">{item.children.map(child => <div className="tree-row child" role="treeitem" key={child.id}><span className="tree-branch" /><GripVertical size={15} className="drag" /><span className="tree-name">{child.name}</span><span className="count-badge">{child.count} products</span><Status>Active</Status><button className="row-menu" aria-label={`${child.name} actions`}><Ellipsis size={17} /></button></div>)}</div>}</div>)}</div>}</section>
      <section className="panel table-panel"><div className="section-heading"><div className="heading-inline"><h2>All Categories</h2><span className="count-badge">48</span></div>{selected.length > 0 && <div className="bulk-actions"><span>{selected.length} selected</span><button>Archive</button><button>Export</button></div>}</div><div className="table-wrap"><table><thead><tr><th><input type="checkbox" aria-label="Select all categories" /></th><th>Category</th><th>Parent Category</th><th>Store</th><th>Products</th><th>Status</th><th>Visibility</th><th>Updated</th><th>Operational Status</th><th>Actions</th></tr></thead><tbody>{categories.map(row => <tr key={row.id}><td><input type="checkbox" aria-label={`Select ${row.name}`} checked={selected.includes(row.id)} onChange={() => toggleSelected(row.id)} /></td><td><span className="category-cell"><span className="thumb">{row.icon}</span><strong>{row.name}</strong></span></td><td className="muted">{row.parent}</td><td><span className="store-cell"><StoreMark store={row.store} />{row.store}</span></td><td><strong>{row.products}</strong></td><td><Status tone={row.status === 'Draft' ? 'warn' : 'green'}>{row.status}</Status></td><td><span className="visibility">{row.visibility}</span></td><td className="muted">{row.updated}</td><td><span className={`operation ${row.operational.includes('Attention') ? 'attention' : ''}`}>{row.operational}</span></td><td><button className="open-button">Open</button><button className="table-icon" aria-label={`Edit ${row.name}`}><Settings2 size={15} /></button><button className="table-icon" aria-label="More"><Ellipsis size={16} /></button></td></tr>)}</tbody></table></div><div className="pagination"><span>Showing <strong>1–5</strong> of <strong>48</strong> categories</span><div><button disabled>Previous</button><button className="page-active">1</button><button>2</button><button>3</button><button>Next</button></div></div></section>
      <section className={`panel callout-panel ${collapsed.empty ? 'is-collapsed' : ''}`}><div className="section-heading"><div className="heading-inline"><button className="collapse-button" onClick={() => setCollapsed(current => ({
              ...current,
              empty: !current.empty
            }))}>{collapsed.empty ? <ChevronRight size={17} /> : <ChevronDown size={17} />}<h2>Empty Categories</h2><span className="count-badge amber">4</span><CircleAlert size={16} className="amber-text" /></button></div><button className="text-button">View all <span>→</span></button></div>{!collapsed.empty && <div className="empty-list">{emptyCategories.map(item => <div className="empty-row" key={item.id}><span className="thumb small">◇</span><strong>{item.name}</strong><span className="store-cell"><StoreMark store={item.store} />{item.store}</span><span className="muted">Updated {item.updated}</span><div className="row-actions"><button>Open Category</button><button>Assign Products</button><button className="danger-action" aria-label={`Archive ${item.name}`}><Trash2 size={15} /></button></div></div>)}</div>}</section>
      <section className={`panel callout-panel uncategorized ${collapsed.uncategorized ? 'is-collapsed' : ''}`}><div className="section-heading"><div className="heading-inline"><button className="collapse-button" onClick={() => setCollapsed(current => ({
              ...current,
              uncategorized: !current.uncategorized
            }))}>{collapsed.uncategorized ? <ChevronRight size={17} /> : <ChevronDown size={17} />}<h2>Uncategorized Products</h2><span className="count-badge orange">12</span></button></div><button className="button ai small-button"><Sparkles size={14} />Categorize All with AI</button></div>{!collapsed.uncategorized && <div className="product-list">{uncategorized.map(item => <div className="product-row" key={item.id}><span className="product-icon"><Package size={17} /></span><span><strong>{item.name}</strong><small>{item.sku}</small></span><span className="store-cell"><StoreMark store={item.store} />{item.store}</span><Status tone={item.status === 'Draft' ? 'warn' : 'green'}>{item.status}</Status><div className="row-actions"><button>Assign Category</button><button className="ai-link"><Sparkles size={14} />Categorize with AI</button></div></div>)}</div>}</section>
      <div className="bottom-grid"><section className="panel info-panel"><div className="section-heading"><h2>Category Data Quality</h2><button className="text-button">View all issues →</button></div><div className="quality-list">{quality.map(item => <div className="quality-row" key={item.id}><span className={`quality-icon ${item.tone}`}>{item.tone === 'good' ? '✓' : item.tone === 'warn' ? '!' : '×'}</span><span className="quality-label">{item.label}</span><span className="quality-state">{item.state}</span><div className="progress"><span className={item.tone} style={{
                  width: `${item.percent}%`
                }} /></div><strong>{item.percent}%</strong></div>)}</div></section><section className="panel info-panel"><div className="section-heading"><h2>Category Activity</h2><button className="text-button">View all →</button></div><ol className="activity-list">{activity.map(item => <li key={item.id}><span className="activity-icon">{item.who === 'Lulu AI' ? <Sparkles size={14} /> : <Clock3 size={14} />}</span><div><strong>{item.text}</strong><span><b>{item.who}</b> · {item.time} · <em>{item.store}</em></span></div></li>)}</ol></section></div>
      <aside className="assistant"><span className="assistant-icon"><Sparkles size={17} /></span><input aria-label="Ask Lulu AI" placeholder="Ask Lulu AI about your categories..." /><div className="suggestions"><button>Which products should be recategorized?</button><button>Find empty categories</button><button>Suggest subcategories for Electronics</button><button>Check category data quality</button></div><button className="send-button" aria-label="Send question"><Zap size={16} /></button></aside>
    </main></div>;
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
