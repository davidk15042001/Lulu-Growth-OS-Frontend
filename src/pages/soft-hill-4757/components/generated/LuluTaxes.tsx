import { useState } from 'react';
import { Bell, Bot, ChevronDown, ChevronRight, CircleHelp, Download, ExternalLink, Eye, Filter, MoreHorizontal, Plus, RefreshCw, Search, Settings2, Sparkles, TriangleAlert, Upload, X } from 'lucide-react';
type Tone = 'green' | 'amber' | 'red' | 'blue' | 'violet' | 'slate';
type StatusProps = {
  label: string;
  tone: Tone;
  compact?: boolean;
};
const navItems = [{
  label: 'Dashboard',
  icon: '▦'
}, {
  label: 'AI Platform',
  icon: '✦'
}, {
  label: 'CRM',
  icon: '◌'
}, {
  label: 'Marketing',
  icon: '↗'
}, {
  label: 'Advertising',
  icon: '◈'
}, {
  label: 'Ecommerce',
  icon: '▣',
  open: true
}, {
  label: 'Finance',
  icon: '◒'
}, {
  label: 'Reports',
  icon: '▤'
}, {
  label: 'Analytics',
  icon: '⌁'
}, {
  label: 'Integrations',
  icon: '⌘'
}, {
  label: 'Automation',
  icon: '⚙'
}, {
  label: 'Settings',
  icon: '◉'
}];
const filters = ['Tax Status', 'Jurisdiction', 'Tax Rate', 'Store', 'Product Tax Category', 'Configuration Health'];
const configRows = [['Lulu Store', 'Shopify', 'Tax-Exclusive', 'Enabled', '8 jurisdictions', 'Shopify Tax', '2 min ago', 'Configured'], ['Lulu WooCommerce', 'WooCommerce', 'Tax-Inclusive', 'Enabled', '3 jurisdictions', 'WooCommerce Tax', '15 min ago', 'Partially Configured'], ['Lulu Webflow', 'Webflow', 'Tax-Exclusive', 'Disabled', '—', '—', '—', 'Not Configured']];
const issueRows = [['Lulu WooCommerce', 'France', 'Missing tax rate for reduced VAT category', 'High', 'Open', '2 hours ago'], ['Lulu WooCommerce', 'Netherlands', 'Tax collection not configured', 'Medium', 'Open', '2 hours ago'], ['Lulu Webflow', '—', 'Tax collection disabled', 'Low', 'Open', '1 day ago']];
const jurisdictionRows = [['Germany', 'Germany', 'All', 'Enabled', '19%', 'Platform', 'Standard', 'Active', '10 Aug'], ['France', 'France', 'All', 'Enabled', '20%', 'Platform', 'Standard', 'Active', '10 Aug'], ['United Kingdom', 'United Kingdom', 'All', 'Enabled', '20%', 'Platform', 'Standard', 'Active', '8 Aug'], ['Austria', 'Austria', 'All', 'Enabled', '20%', 'Platform', 'Standard', 'Active', '8 Aug'], ['Netherlands', 'Netherlands', 'All', 'Disabled', '—', '—', '—', 'Attention Required', '—'], ['United States — California', 'USA', 'CA', 'Enabled', '8.25%', 'Configured Rule', 'Custom', 'Active', '5 Aug']];
const collectionRows = [['Germany', '€112,430', '€21,362', '19%', '1,042', '€0', 'Healthy'], ['France', '€68,210', '€13,642', '20%', '486', '€1,240', 'Healthy'], ['United Kingdom', '€51,880', '€10,376', '20%', '390', '€3,100', 'Healthy'], ['Austria', '€31,420', '€6,284', '20%', '214', '€820', 'Healthy']];
const transactionRows = [['#10482', 'Max Mustermann', 'Lulu Store', 'Germany', '€100.00', '19%', '€19.00', 'Taxable', 'Platform', '10 Aug'], ['#10481', 'Sophie Martin', 'Lulu Store', 'France', '€250.00', '20%', '€50.00', 'Taxable', 'Platform', '10 Aug'], ['#10480', 'James Wilson', 'Lulu Store', 'United Kingdom', '€80.00', '20%', '€16.00', 'Taxable', 'Platform', '9 Aug'], ['#10479', 'Anna Schmidt', 'Lulu WooCommerce', 'Germany', '€45.00', '0%', '€0.00', 'Zero Rated', 'Platform', '9 Aug'], ['#10478', 'Carlos Rivera', 'Lulu Store', 'United States — CA', '€320.00', '8.25%', '€26.40', 'Taxable', 'Configured Rule', '8 Aug']];
const healthRows = [['Tax Configuration', 'Attention Required', 'amber'], ['Jurisdiction Coverage', 'Healthy', 'green'], ['Tax Rate Integrity', 'Healthy', 'green'], ['Product Tax Categories', 'Attention Required', 'amber'], ['Customer Tax Status', 'Healthy', 'green'], ['Tax Provider Connectivity', 'Healthy', 'green'], ['Tax Synchronization', 'Healthy', 'green'], ['Data Completeness', 'Healthy', 'green']];
const prompts = ['Which stores have incomplete tax configuration?', 'Which jurisdictions are configured?', 'What tax rates are currently active?', 'Find tax configuration issues', 'Show tax collected this month', 'Find products missing tax categories', 'Find unusual tax transactions', 'Compare tax configuration across stores'];
function Status({
  label,
  tone,
  compact
}: StatusProps) {
  return <span className={`status status-${tone} ${compact ? 'status-compact' : ''}`}><i />{label}</span>;
}
function SectionTitle({
  title,
  eyebrow,
  action
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return <header className="section-header"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>{action}</header>;
}
function TableCard({
  title,
  eyebrow,
  headers,
  rows,
  kind = 'standard',
  action
}: {
  title: string;
  eyebrow?: string;
  headers: string[];
  rows: string[][];
  kind?: string;
  action?: React.ReactNode;
}) {
  return <section className="panel"><SectionTitle title={title} eyebrow={eyebrow} action={action} /><div className="table-wrap"><table><thead><tr>{headers.map(head => <th key={head}>{head}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[0]}>{row.map((cell, cellIndex) => <td key={`${row[0]}-${cellIndex}`}>{kind === 'config' && cellIndex === 7 ? <Status label={cell} tone={cell === 'Configured' ? 'green' : cell === 'Partially Configured' ? 'amber' : 'red'} /> : kind === 'issue' && cellIndex === 3 ? <Status label={cell} tone={cell === 'High' ? 'red' : cell === 'Medium' ? 'amber' : 'blue'} compact /> : kind === 'issue' && cellIndex === 4 ? <Status label={cell} tone="amber" compact /> : kind === 'jurisdiction' && cellIndex === 7 ? <Status label={cell} tone={cell === 'Active' ? 'green' : 'amber'} compact /> : kind === 'collection' && cellIndex === 6 ? <Status label={cell} tone="green" compact /> : kind === 'transaction' && cellIndex === 7 ? <Status label={cell} tone={cell === 'Taxable' ? 'green' : 'blue'} compact /> : <span className={cell === '—' ? 'muted' : ''}>{cell}</span>}</td>)}<td className="actions">{kind === 'issue' ? <><button>Review</button>{row[3] !== 'Low' && <button className="text-violet">Fix</button>}</> : <button aria-label={`View ${row[0]}`}><Eye size={14} /> View</button>}</td></tr>)}</tbody></table></div></section>;
}
export function LuluTaxes() {
  const [range, setRange] = useState('Last 30 Days');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState(true);
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">✦</span><span>Lulu <b>AI</b></span></div><nav><p className="nav-label">Workspace</p>{navItems.map(item => <div key={item.label}><button className={`nav-item ${item.label === 'Ecommerce' ? 'active-parent' : ''}`}><span className="nav-icon">{item.icon}</span><span>{item.label}</span>{item.open && <ChevronDown size={14} />}</button>{item.open && <div className="subnav"><button className="subnav-active"><span />Taxes</button><button><span />Orders</button><button><span />Products</button></div>}</div>)}</nav><div className="sidebar-user"><div className="avatar">LM</div><div><strong>Laura Miller</strong><small>Administrator</small></div><MoreHorizontal size={16} /></div></aside>
    <main className="main"><div className="topbar"><div className="crumbs"><span>Ecommerce</span><ChevronRight size={14} /><strong>Taxes</strong></div><div className="top-actions"><button className="icon-button"><Bell size={17} /></button><span className="top-avatar">LM</span></div></div>
      <div className="content"><header className="page-header"><div><p className="eyebrow">ECOMMERCE / TAX OPERATIONS</p><h1>Taxes</h1><p className="subtitle">Manage ecommerce tax settings, jurisdictions and tax-related transaction data across your connected stores.</p></div><div className="header-actions"><button className="primary"><Settings2 size={15} /> Configure Taxes</button><button className="secondary"><Sparkles size={15} /> Ask Lulu AI</button><button className="icon-button"><RefreshCw size={16} /></button><button className="icon-button"><Download size={16} /></button><button className="icon-button"><MoreHorizontal size={16} /></button></div></header>
        {notice && <div className="notice"><CircleHelp size={17} /><p><strong>Tax information</strong> is provided for operational and informational purposes. Tax rules and obligations vary by jurisdiction. Consult a qualified tax professional for tax advice and compliance decisions.</p><button onClick={() => setNotice(false)} aria-label="Dismiss notice"><X size={15} /></button></div>}
        <div className="toolbar"><button className="store-select"><span className="store-dot">S</span> All Stores <ChevronDown size={15} /></button><label className="search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search orders, transactions, customers, SKUs, jurisdictions…" /></label><button className="filter-button"><Filter size={15} /> Filters <span className="filter-count">6</span></button><label className="range-select"><span>Period</span><select value={range} onChange={event => setRange(event.target.value)}><option>Today</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option><option>Year to Date</option><option>Custom Range</option></select><ChevronDown size={14} /></label></div><div className="filter-chips">{filters.map(filter => <button key={filter}>{filter}<ChevronDown size={13} /></button>)}</div>
        <section className="metrics">{[['€284,920', 'Taxable Sales', 'Calculated', 'green'], ['€43,218', 'Tax Collected', 'Calculated', 'green'], ['47', 'Tax Exempt', 'Last 30 days', 'blue'], ['12', 'Tax Jurisdictions', 'Configured', 'violet'], ['28', 'Tax Rates', 'Active', 'green'], ['3', 'Configuration Issues', 'Attention', 'amber'], ['2', 'Attention Required', 'Critical', 'red']].map(metric => <article className={`metric metric-${metric[3]}`} key={metric[1]}>{metric[3] === 'amber' && <TriangleAlert size={16} />}<strong>{metric[0]}</strong><span>{metric[1]}</span><small>{metric[2]}</small></article>)}</section>
        <TableCard title="Tax Configuration" eyebrow="CONNECTED STORES" headers={['Store', 'Platform', 'Pricing', 'Collection', 'Jurisdictions', 'Provider', 'Last Sync', 'Status', 'Actions']} rows={configRows} kind="config" />
        <TableCard title="Tax Configuration Issues" eyebrow="3 ISSUES DETECTED" headers={['Store', 'Jurisdiction', 'Issue', 'Severity', 'Status', 'Last Detected', 'Actions']} rows={issueRows} kind="issue" />
        <TableCard title="Tax Jurisdictions" eyebrow="12 CONFIGURED" headers={['Jurisdiction', 'Country', 'Region', 'Collection', 'Rate', 'Source', 'Product Rules', 'Status', 'Updated', 'Actions']} rows={jurisdictionRows} kind="jurisdiction" action={<button className="secondary small"><Plus size={14} /> Add Jurisdiction</button>} />
        <div className="collection-grid"><TableCard title="Tax by Jurisdiction" eyebrow="COLLECTION SUMMARY" headers={['Jurisdiction', 'Taxable Sales', 'Tax Collected', 'Rate', 'Transactions', 'Exempt', 'Status', 'Actions']} rows={collectionRows} kind="collection" /><section className="panel collection-stats"><p className="eyebrow">LAST 30 DAYS</p><h2>Collection summary</h2>{[['€284,920', 'Taxable Sales'], ['€43,218', 'Tax Collected'], ['€12,400', 'Tax-Exempt Sales'], ['€3,200', 'Zero-Rated']].map(stat => <div className="stat-line" key={stat[1]}><strong>{stat[0]}</strong><span>{stat[1]}</span></div>)}<p className="fine-print">Ecommerce transaction data. Not an official tax return.</p></section></div>
        <section className="panel"><SectionTitle title="Tax Transactions" eyebrow="2,184 RECORDS" action={<div className="table-tools"><label className="mini-search"><Search size={14} /><input placeholder="Search transactions" /></label><button className="filter-button">Filter <ChevronDown size={13} /></button></div>} /><p className="table-disclaimer">Ecommerce transaction-level tax records. Not finalized accounting records.</p><div className="table-wrap"><table><thead><tr>{['Order', 'Customer', 'Store', 'Jurisdiction', 'Taxable Amount', 'Rate', 'Tax Amount', 'Status', 'Source', 'Date', 'Actions'].map(head => <th key={head}>{head}</th>)}</tr></thead><tbody>{transactionRows.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`}>{index === 7 ? <Status label={cell} tone={cell === 'Taxable' ? 'green' : 'blue'} compact /> : <span>{cell}</span>}</td>)}<td className="actions"><button><Eye size={14} /> View</button></td></tr>)}</tbody></table></div><div className="pagination"><span>Showing <strong>1–5</strong> of 284 records</span><div><button disabled>Previous</button><button className="page-active">1</button><button>2</button><button>3</button><span>…</span><button>Next</button></div></div></section>
        <div className="bottom-grid"><div><section className="panel health"><SectionTitle title="Tax Operations Health" eyebrow="SYSTEM PULSE" /> <div className="health-grid">{healthRows.map(item => <div className="health-item" key={item[0]}><span>{item[0]}</span><Status label={item[1]} tone={item[2] as Tone} compact /></div>)}</div><p className="fine-print">Operational health only. Not a legal compliance score.</p></section><section className="panel sync"><SectionTitle title="Tax Synchronization" eyebrow="PROVIDER CONNECTIONS" /><div className="table-wrap"><table><thead><tr>{['Store', 'Platform', 'Provider', 'Status', 'Last Sync', 'Configs', 'Jurisdictions', 'Failed', 'Actions'].map(head => <th key={head}>{head}</th>)}</tr></thead><tbody>{[['Lulu Store', 'Shopify', 'Shopify Tax', 'Synced', '2 min ago', '8', '8', '0'], ['Lulu WooCommerce', 'WooCommerce', 'WooCommerce Tax', 'Synced', '15 min ago', '3', '3', '1'], ['Lulu Webflow', 'Webflow', '—', 'Disconnected', '—', '0', '0', '—']].map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`}>{index === 3 ? <Status label={cell} tone={cell === 'Synced' ? 'green' : 'red'} compact /> : <span>{cell}</span>}</td>)}<td className="actions"><button>{row[3] === 'Synced' ? 'Details' : 'Open Integrations'}</button>{row[0] === 'Lulu WooCommerce' && <button className="text-violet">Retry</button>}</td></tr>)}</tbody></table></div></section></div>
          <section className="panel ai-panel"><SectionTitle title="Ask Lulu AI" eyebrow="INTELLIGENCE LAYER" action={<Sparkles size={19} className="sparkle" />} /><label className="ai-input"><Sparkles size={16} /><input placeholder="Ask Lulu AI about taxes…" /><button aria-label="Submit question"><ExternalLink size={15} /></button></label><p className="eyebrow prompt-label">SUGGESTED PROMPTS</p><div className="prompts">{prompts.map(prompt => <button key={prompt}>{prompt}</button>)}</div><div className="ai-box insight"><div className="ai-box-title"><span><Sparkles size={14} /> AI Insight</span><small>AI-generated</small></div><p>3 connected stores have incomplete tax configuration for one or more jurisdictions.</p><div className="evidence"><div><span>Store</span><span>Jurisdiction</span><span>Missing Configuration</span><span>Last Sync</span></div><div><span>Lulu WooCommerce</span><span>France</span><span>Tax rate for reduced VAT</span><span>15 min ago</span></div><div><span>Lulu WooCommerce</span><span>Netherlands</span><span>Tax collection not configured</span><span>15 min ago</span></div><div><span>Lulu Webflow</span><span>All</span><span>Tax collection disabled</span><span>Not connected</span></div></div></div><div className="ai-box recommendation"><div className="ai-box-title"><span><Bot size={14} /> AI Recommendation</span><small>AI-generated</small></div><p>Review tax configuration for Lulu WooCommerce (France, Netherlands) and enable tax collection for Lulu Webflow. Changes require your explicit authorization.</p><button className="secondary full">Review recommendations <ChevronRight size={14} /></button></div></section></div>
      </div>
    </main>
  </div>;
}