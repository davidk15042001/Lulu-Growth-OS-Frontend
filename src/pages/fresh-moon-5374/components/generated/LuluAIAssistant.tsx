import { useState } from 'react';
import { Activity, Archive, ArrowRight, BarChart3, Bell, BookOpen, Bot, Brain, CalendarDays, Check, CheckSquare, ChevronDown, ChevronRight, CircleHelp, Copy, FileText, GitBranch, Globe2, Heart, HelpCircle, History, LayoutDashboard, Lightbulb, LineChart, Menu, MessageSquare, Mic, MoreHorizontal, Paperclip, Package, PanelRightClose, Plus, RefreshCw, Search, Send, Settings, ShieldAlert, ShoppingBag, Sparkles, Target, TrendingUp, UserRound, X, Zap } from 'lucide-react';
import { getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { getSelectedWorkspaceId } from '../../../../api/session';
const C = {
  bg: 'var(--background)',
  sidebar: 'var(--sidebar)',
  surface: 'var(--card)',
  elevated: 'var(--popover)',
  border: 'var(--border)',
  borderHover: 'var(--ring)',
  violet: 'var(--primary)',
  soft: 'var(--primary-foreground)',
  text: 'var(--foreground)',
  secondary: 'var(--secondary-foreground)',
  muted: 'var(--muted-foreground)',
  green: 'var(--chart-4)',
  amber: 'var(--chart-1)',
  red: 'var(--destructive)',
  blue: 'var(--ring)'
};
type IconType = typeof LayoutDashboard;
type Conversation = {
  title: string;
  preview: string;
  time: string;
};
type Kpi = {
  label: string;
  value: string;
  delta: string;
  tone: 'good' | 'watch';
};
type LiveMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};
type ConversationResponse = { id: string };
type AiResponse = { assistantMessage: { id: string; content: string } };
const conversations: Conversation[] = [];
const prompts: Array<Record<string, any>> = [];
const kpis: Kpi[] = [];
const navMain: {
  label: string;
  icon: IconType;
}[] = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Insights Center',
  icon: LineChart
}, {
  label: 'Business Health',
  icon: Heart
}, {
  label: 'Growth Score',
  icon: TrendingUp
}, {
  label: 'KPI Explorer',
  icon: BarChart3
}];
const navAi: {
  label: string;
  icon: IconType;
}[] = [];
const platforms: Array<{ name: string; icon: IconType; dot: string }> = [];
const sources: Array<Record<string, any>> = [];
const contextKpis: Array<Record<string, any>> = [];
const knowledge: Array<Record<string, any>> = [];
function Avatar() {
  return <span className="ai-avatar" aria-label="Lulu AI">L</span>;
}
function SectionLabel({
  children
}: {
  children: string;
}) {
  return <p className="section-label">{children}</p>;
}
export function LuluAIAssistant() {
  const [activeConversation, setActiveConversation] = useState(0);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [voiceActive, setVoiceActive] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [processingState, setProcessingState] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([]);
  const [messageError, setMessageError] = useState('');
  const startNewConversation = () => {
    setConversationId(null);
    setLiveMessages([]);
    setQuery('');
    setMessageError('');
  };
  const sendMessage = async (message = query) => {
    const content = message.trim();
    const workspaceId = getSelectedWorkspaceId();
    if (!content || !workspaceId || processingState) return;
    setMessageError('');
    setQuery('');
    setLiveMessages(current => [...current, { id: `local-${Date.now()}`, role: 'user', content }]);
    setProcessingState(true);
    try {
      let activeId = conversationId;
      if (!activeId) {
        const conversation = await requestApi<ConversationResponse>({
          path: `/workspaces/${workspaceId}/ai/conversations`,
          method: 'POST',
          body: { title: content.slice(0, 80) }
        });
        activeId = conversation.data.id;
        setConversationId(activeId);
      }
      const response = await requestApi<AiResponse>({
        path: `/workspaces/${workspaceId}/ai/conversations/${activeId}/respond`,
        method: 'POST',
        body: { content }
      });
      setLiveMessages(current => [...current, {
        id: response.data.assistantMessage.id,
        role: 'assistant',
        content: response.data.assistantMessage.content
      }]);
    } catch (error) {
      setMessageError(getFriendlyErrorMessage(error, 'Lulu AI could not prepare an answer. Please try again.'));
    } finally {
      setProcessingState(false);
    }
  };
  return <div className="min-h-screen bg-[var(--background)] text-foreground"><aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-[var(--sidebar)] lg:block"><LuluSectionNavigation activeId="fresh-moon-5374" /></aside><main className="min-h-screen lg:ml-60"><header className="flex items-center justify-between border-b border-border bg-card px-5 py-4"><div><p className="text-xs uppercase tracking-[.16em] text-muted-foreground">AI Assistant</p><h1 className="text-xl font-bold">Lulu AI Assistant</h1></div><button type="button" onClick={startNewConversation} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"><Plus size={15} />New conversation</button></header><section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-4xl flex-col px-5 py-8"><div className="flex-1"><div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center"><Bot className="mx-auto text-muted-foreground" size={32} /><h2 className="mt-4 text-xl font-semibold">Ask Lulu about your workspace</h2><p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Answers are generated from your selected workspace and connected records. No example conversations or business metrics are displayed.</p></div>{liveMessages.length > 0 && <div className="mt-6 space-y-3">{liveMessages.map(message => <article key={message.id} className={`rounded-xl border border-border bg-card p-4 text-sm ${message.role === 'user' ? 'ml-8' : 'mr-8'}`}>{message.content}</article>)}</div>}{messageError && <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{messageError}</p>}</div><form className="mt-6 flex gap-2" onSubmit={event => { event.preventDefault(); void sendMessage(); }}><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Ask Lulu AI about your workspace…" className="min-w-0 flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" disabled={processingState} /><button type="submit" disabled={processingState || !query.trim()} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"><Send size={16} />{processingState ? 'Working…' : 'Send'}</button></form></section></main></div>;
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
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
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
