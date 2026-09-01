import { useLiveRecords } from '../../../../api/useLiveRecords';
import { useMemo, useRef, useState } from 'react';
import { Activity, AlertTriangle, ArrowUpDown, BarChart3, BookOpen, Brain, CheckCircle2, ChevronDown, ChevronRight, Clock3, Database, FileText, Globe, Heart, HelpCircle, LayoutDashboard, LayoutTemplate, LineChart, MessageSquare, MessagesSquare, MoreHorizontal, Plus, RefreshCw, Search, Settings, ShieldCheck, ShoppingBag, Store, TrendingUp, Upload, X, Zap, Bot, Filter, Users, Sparkles, SlidersHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ingestRecord } from '../../../../api/records';
import { getFriendlyErrorMessage } from '../../../../api/client';
type Knowledge = {
  id: string;
  name: string;
  type: string;
  source: string;
  status: string;
  updated: string;
  used: string;
  access: string;
};
type Source = {
  id: string;
  name: string;
  type: string;
  icon: LucideIcon;
  color: string;
  status: string;
  health: string;
  items: string;
  sync: string;
};
const mainNav: Array<Record<string, any>> = [];
const platformNav = [{
  label: 'AI Assistant',
  icon: MessageSquare
}, {
  label: 'AI Agents',
  icon: Bot
}, {
  label: 'Agent Marketplace',
  icon: Store
}, {
  label: 'Agent Templates',
  icon: LayoutTemplate
}, {
  label: 'AI Memory',
  icon: Brain
}, {
  label: 'AI Knowledge',
  icon: BookOpen
}, {
  label: 'AI Actions',
  icon: Zap
}, {
  label: 'AI Conversations',
  icon: MessagesSquare
}, {
  label: 'AI Activity',
  icon: Activity
}];
const stats: Array<Record<string, any>> = [];
const sources: Source[] = [];
const knowledge: Knowledge[] = [];
const documents: Array<Record<string, any>> = [];
const usage: Array<Record<string, any>> = [];
const quality: Array<Record<string, any>> = [];
const filterOptions = ['Knowledge Type', 'Source', 'Status', 'Freshness'];
const statusColor = (status: string) => status === 'Active' || status === 'Ready' || status === 'Connected' || status === 'Healthy' || status === 'Synced' ? 'var(--chart-4)' : status === 'Processing' ? 'var(--primary)' : status === 'Needs Attention' || status === 'Failed' ? 'var(--chart-1)' : 'var(--muted-foreground)';
type UploadedFile = { name: string; type: string; dataUrl: string };
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
export const LuluAIKnowledge = () => {
  const { items, loading, error, refresh } = useLiveRecords('ai_knowledge');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(selected: FileList | null) {
    if (!selected) return;
    const next: UploadedFile[] = [];
    for (const file of Array.from(selected)) {
      const dataUrl = await readFileAsDataUrl(file);
      next.push({ name: file.name, type: file.type, dataUrl });
    }
    setFiles(prev => [...prev, ...next]);
  }

  async function handleSubmit() {
    setSubmitError(null);
    if (!title.trim() && !text.trim() && files.length === 0) {
      setSubmitError('Add a title, paste text, or upload at least one file.');
      return;
    }
    setSubmitting(true);
    try {
      await ingestRecord('ai_knowledge', {
        name: title.trim() || (files[0]?.name ?? 'Untitled knowledge'),
        text: text.trim(),
        files: files.map(f => ({ name: f.name, type: f.type, dataUrl: f.dataUrl }))
      });
      setTitle('');
      setText('');
      setFiles([]);
      setIsAddOpen(false);
      void refresh();
    } catch (cause) {
      setSubmitError(getFriendlyErrorMessage(cause, 'Knowledge could not be saved. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return <div className="lulu-shell"><aside className="lulu-sidebar" aria-label="Primary navigation"><div className="lulu-logo"><span className="sparkle">✦</span><span>Lulu AI</span></div><LuluSectionNavigation activeId="rich-field-1880" /></aside><main className="lulu-main"><header className="page-header"><div className="breadcrumb"><span>AI Platform</span><ChevronRight size={13} /><strong>AI Knowledge</strong></div><div className="title-row"><div><h1>AI Knowledge</h1><p>Manage the business knowledge available to Lulu AI.</p><p className="supporting">Connect trusted information sources and control which AI experiences can use them.</p></div><div className="header-actions"><button className="primary-button" onClick={() => setIsAddOpen(true)}><Plus size={15} />Add Knowledge</button></div></div></header><div className="grounding-banner"><Brain size={15} /><span>Knowledge grounds Lulu AI with verified business information. It is not AI-generated output.</span></div>{loading ? <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Loading live knowledge…</div> : error ? <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">{error}</div> : !items.length ? <section className="flex min-h-[560px] items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center"><div><BookOpen className="mx-auto text-muted-foreground" size={38} /><h2 className="mt-4 text-xl font-semibold text-foreground">No knowledge records available yet</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Connect a trusted source or add knowledge to populate this page. No example source counts, documents, health values or usage metrics are displayed.</p></div></section> : <section className="content-section"><div className="section-heading"><h2>Business Knowledge</h2><span>{items.length} live records</span></div><div className="recent-table knowledge-table" role="table"><div className="table-row table-header"><span>Name</span><span>Type</span><span>Source</span><span>Status</span><span>Last Updated</span><span>Used By</span><span>Access</span></div>{items.map(record => <div className="table-row" key={record.id}><strong>{record.name}</strong><span>{String(record.data?.type || 'Knowledge')}</span><span>{String(record.data?.source || 'Connected source')}</span><span className="table-status">{record.status || 'Recorded'}</span><span>{record.updatedAt}</span><span>{String(record.data?.usedBy || '—')}</span><span>{String(record.data?.access || 'Workspace')}</span></div>)}</div></section>}</main>{isAddOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-primary/70 p-4" role="dialog" aria-modal="true" aria-label="Add AI Knowledge" onClick={() => setIsAddOpen(false)}><div className="w-full max-w-xl rounded-2xl border border-border bg-[var(--secondary)] shadow-2xl" onClick={e => e.stopPropagation()}><header className="flex items-center justify-between border-b border-border px-6 py-5"><h2 className="text-lg font-semibold text-foreground">Add AI Knowledge</h2><button onClick={() => setIsAddOpen(false)} aria-label="Close dialog" className="rounded-md p-1.5 text-foreground hover:bg-secondary hover:text-foreground"><X size={18} /></button></header><div className="space-y-5 p-6"><label className="block text-xs font-medium text-muted-foreground">Title<input value={title} onChange={e => setTitle(e.target.value)} placeholder="Knowledge title" className="mt-1.5 w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" /></label><label className="block text-xs font-medium text-muted-foreground">Text<textarea value={text} onChange={e => setText(e.target.value)} rows={5} placeholder="Paste text content..." className="mt-1.5 w-full resize-none rounded-lg border border-border bg-[var(--background)] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" /></label><div><p className="text-xs font-medium text-muted-foreground">Images & Files</p><input ref={fileInputRef} type="file" multiple accept="image/*,.txt,.md,.pdf,.csv,.doc,.docx,.xls,.xlsx" onChange={e => handleFiles(e.target.files)} className="mt-1.5 block w-full text-sm text-muted-foreground file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground" />{files.length > 0 && <ul className="mt-3 space-y-2">{files.map((file, index) => <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-[var(--card)] px-3 py-2 text-xs text-foreground"><span className="flex min-w-0 items-center gap-2 truncate"><FileText size={14} className="shrink-0 text-muted-foreground" /><span className="truncate">{file.name}</span></span><button onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))} aria-label={`Remove ${file.name}`} className="text-muted-foreground hover:text-foreground"><X size={14} /></button></li>)}</ul>}</div>{submitError && <p className="text-sm text-chart-5">{submitError}</p>}</div><footer className="flex justify-end gap-2 border-t border-border px-6 py-4"><button onClick={() => setIsAddOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground">Cancel</button><button onClick={handleSubmit} disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60">{submitting ? 'Processing…' : 'Add Knowledge'}</button></footer></div></div>}</div>;
};
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
