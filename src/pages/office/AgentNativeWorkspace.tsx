import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bot,
  Boxes,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  FileText,
  Globe2,
  Landmark,
  MessageCircle,
  Network,
  Package,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Store,
  WalletCards,
} from "lucide-react";
import { adSpendApi, type AdSpendOverview } from "../../api/adspend";
import { commercialDocumentsApi, type Invoice, type Quote } from "../../api/commercial-documents";
import { commerceApi, type CommerceOrder, type InventoryLevel } from "../../api/commerce";
import { executiveApi, type ExecutiveOverview } from "../../api/executive";
import { financeApi, type PayoutsData } from "../../api/finance";
import { omnichannelApi, type OmniConversation, type OmniMessage } from "../../api/omnichannel";
import { listRecords, type WorkspaceRecord } from "../../api/records";
import { providerControlApi, type ProviderConnection, type ProviderLaunchReadiness } from "../../api/providers";
import { productsApi, type Product } from "../../api/products";
import { socialPublishingApi, type SocialContent, type SocialPublicationJob } from "../../api/social-publishing";
import { websitesApi, type WebsiteSite } from "../../api/websites";
import type { OfficeEmployeeDetails } from "../../api/office";
import { getFriendlyErrorMessage } from "../../api/client";
import "./agent-native-workspace.css";

type NativeWorkspaceKind = "command" | "crm" | "communications" | "commerce" | "finance" | "marketing" | "website" | "operations" | "intelligence";

type Props = {
  workspaceId: string;
  employeeDetail: OfficeEmployeeDetails;
};

type KindDefinition = {
  label: string;
  description: string;
  icon: typeof Activity;
};

const KINDS: Record<NativeWorkspaceKind, KindDefinition> = {
  command: { label: "Agent workbench", description: "Verified work, evidence and handoffs for this digital employee.", icon: Activity },
  crm: { label: "Customer intelligence", description: "Companies, customer context and the current CRM signal.", icon: Building2 },
  communications: { label: "Customer conversations", description: "Live OmniChannel context, handling mode and recent messages.", icon: MessageCircle },
  commerce: { label: "Commerce operations", description: "Products, orders and inventory supplied by the canonical commerce services.", icon: Store },
  finance: { label: "Financial operations", description: "Invoices, quotes, payouts and verified financial workflow state.", icon: Landmark },
  marketing: { label: "Growth studio", description: "Content, publications and paid-media funding state.", icon: Sparkles },
  website: { label: "Web presence", description: "Managed sites, domains and the web delivery state.", icon: Globe2 },
  operations: { label: "Operations control", description: "Provider readiness, integrations and durable operational evidence.", icon: Network },
  intelligence: { label: "Company intelligence", description: "Executive findings, proposals and observable operating signals.", icon: BarChart3 },
};

function resolveKind(detail: OfficeEmployeeDetails): NativeWorkspaceKind {
  const key = detail.employee.key.toLowerCase().replaceAll("_", "-");
  const capabilities = detail.capabilities.map((capability) => capability.key);
  const has = (prefix: string) => capabilities.some((capability) => capability.startsWith(prefix));
  if (has("omnichannel.") || /email|calendar|support|communication/.test(key)) return "communications";
  if (has("crm.") || has("leads.") || has("opportunities.") || /company|customer|lead|sales|follow-up|quote/.test(key)) return "crm";
  if (has("products.") || has("orders.") || /product|catalog|inventory|fulfillment|commerce|store|order/.test(key)) return "commerce";
  if (has("invoices.") || has("finance.") || has("payouts.") || /invoice|billing|bookkeeping|finance/.test(key)) return "finance";
  if (has("social.") || has("advertising.") || /marketing|content|brand|social|acquisition|ads/.test(key)) return "marketing";
  if (has("website.") || /website|cms|media|domain|reputation|search/.test(key)) return "website";
  if (has("providers.") || has("settings.") || /integration|automation|operations/.test(key)) return "operations";
  if (/intelligence|analytics|executive|orchestrator|quality|security/.test(key)) return "intelligence";
  return "command";
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString([], { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function statusClass(value: string | null | undefined) {
  const normalized = (value ?? "unknown").toLowerCase();
  if (/failed|error|blocked|cancelled|unavailable/.test(normalized)) return "is-alert";
  if (/running|working|active|ready|completed|published|available|succeeded/.test(normalized)) return "is-positive";
  if (/waiting|pending|queued|draft|paused|review/.test(normalized)) return "is-waiting";
  return "";
}

function SurfaceState({ loading, error, empty, children }: { loading: boolean; error: string; empty?: string; children: React.ReactNode }) {
  if (loading) return <div className="lulu-native-agent__state"><RefreshCw size={18} className="lulu-station__spin" /><span>Loading verified workspace data…</span></div>;
  if (error) return <div className="lulu-native-agent__state lulu-native-agent__state--error"><CircleAlert size={18} /><span>{error}</span></div>;
  if (empty) return <div className="lulu-native-agent__state"><Boxes size={18} /><span>{empty}</span></div>;
  return <>{children}</>;
}

function Metric({ label, value, detail, icon }: { label: string; value: string | number; detail: string; icon: React.ReactNode }) {
  return <div className="lulu-native-agent__metric"><span>{icon}{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}

function Status({ children }: { children: string | null | undefined }) {
  return <span className={`lulu-native-agent__status ${statusClass(children)}`}>{children?.replaceAll("_", " ") ?? "unknown"}</span>;
}

function CommandSurface({ detail }: { detail: OfficeEmployeeDetails }) {
  const work = detail.currentWorkItem;
  return <div className="lulu-native-agent__command">
    <section className="lulu-native-agent__focus-card">
      <div><span className="lulu-native-agent__eyebrow">CURRENT ASSIGNMENT</span><h3>{work?.title ?? "No active assignment"}</h3><p>{work?.objective ?? "This agent is available. Lulu will only animate or execute when a persisted work item is assigned."}</p></div>
      <Status>{work?.status ?? detail.employee.status}</Status>
    </section>
    <section className="lulu-native-agent__evidence-grid">
      <div><span className="lulu-native-agent__eyebrow">RECENT EVIDENCE</span>{detail.recentTimeline.length ? <ol>{detail.recentTimeline.slice(0, 5).map((item) => <li key={item.id}><i /><span><strong>{item.title}</strong><small>{item.type.replaceAll("_", " ")} · {formatTime(item.occurredAt)}</small></span></li>)}</ol> : <p className="lulu-native-agent__muted">No persisted employee events are available yet.</p>}</div>
      <div><span className="lulu-native-agent__eyebrow">WORKLOAD</span><div className="lulu-native-agent__stat-stack"><strong>{detail.workSummary.active}<small>active work</small></strong><strong>{detail.workSummary.completedToday}<small>completed today</small></strong><strong>{detail.workSummary.failed}<small>failed</small></strong></div></div>
    </section>
  </div>;
}

function CrmSurface({ workspaceId }: { workspaceId: string }) {
  const [items, setItems] = useState<WorkspaceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void listRecords("crm_companies", "limit=8", { includeTotal: true }).then((response) => { if (active) setItems(response.data.items); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, "Customer intelligence is unavailable."))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [workspaceId]);
  const researching = items.filter((item) => ["queued", "researching"].includes(String(item.data.enrichment && typeof item.data.enrichment === "object" ? (item.data.enrichment as Record<string, unknown>).status : ""))).length;
  return <SurfaceState loading={loading} error={error} empty={!items.length ? "No companies are available in the customer graph." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Companies" value={items.length} detail="loaded in this view" icon={<Building2 size={14} />} /><Metric label="Research" value={researching} detail="verified in progress" icon={<Sparkles size={14} />} /><Metric label="Fresh signal" value={items.filter((item) => item.status !== "ARCHIVED").length} detail="active company profiles" icon={<Radio size={14} />} /></div><section className="lulu-native-agent__list"><div className="lulu-native-agent__list-head"><span>Company intelligence</span><small>Canonical CRM records</small></div>{items.map((item) => { const enrichment = item.data.enrichment && typeof item.data.enrichment === "object" ? item.data.enrichment as Record<string, unknown> : {}; return <article key={item.id}><span className="lulu-native-agent__initial">{item.name.slice(0, 2).toUpperCase()}</span><div><strong>{item.name}</strong><small>{String(item.data.industry ?? "Industry is being verified")} · {String(item.data.city ?? item.data.country ?? "Location pending")}</small></div><span className="lulu-native-agent__progress"><i style={{ width: `${Math.min(100, Number(enrichment.completeness ?? 0))}%` }} /><small>{Number(enrichment.completeness ?? 0)}%</small></span><Status>{String(enrichment.status ?? item.status)}</Status></article>; })}</section></SurfaceState>;
}

function CommunicationsSurface({ workspaceId }: { workspaceId: string }) {
  const [items, setItems] = useState<OmniConversation[]>([]);
  const [messages, setMessages] = useState<OmniMessage[]>([]);
  const [selected, setSelected] = useState<OmniConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void Promise.all([omnichannelApi.conversations(workspaceId, "limit=16"), omnichannelApi.analytics(workspaceId)]).then(([conversations]) => { if (!active) return; setItems(conversations.data.items); const first = conversations.data.items[0] ?? null; setSelected(first); if (first) return omnichannelApi.conversation(workspaceId, first.id).then((response) => active && setMessages(response.data.messages)); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, "Customer conversations are unavailable."))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [workspaceId]);
  const open = (conversation: OmniConversation) => { setSelected(conversation); setMessages([]); void omnichannelApi.conversation(workspaceId, conversation.id).then((response) => setMessages(response.data.messages)).catch((cause) => setError(getFriendlyErrorMessage(cause, "Conversation details are unavailable."))); };
  return <SurfaceState loading={loading} error={error} empty={!items.length ? "No connected customer conversations are available." : undefined}><div className="lulu-native-agent__conversation"><aside>{items.map((item) => <button type="button" className={selected?.id === item.id ? "is-selected" : ""} onClick={() => open(item)} key={item.id}><strong>{item.subject || "New conversation"}</strong><span>{item.channelDisplayName || "Connected channel"} · <Status>{item.handlingMode}</Status></span></button>)}</aside><section><header><div><span className="lulu-native-agent__eyebrow">LIVE CONVERSATION</span><h3>{selected?.subject ?? "Select a conversation"}</h3></div>{selected ? <Status>{selected.handlingMode}</Status> : null}</header><div className="lulu-native-agent__message-log">{selected ? messages.length ? messages.map((message) => <p key={message.id} className={message.direction === "INBOUND" ? "is-inbound" : ""}><small>{message.direction === "INBOUND" ? "Customer" : message.direction === "INTERNAL" ? "Internal note" : "Lulu"}</small>{message.textContent ?? "Unsupported message content"}</p>) : <div className="lulu-native-agent__muted">No messages are available for this conversation.</div> : <div className="lulu-native-agent__muted">Choose a verified conversation to inspect its thread.</div>}</div></section></div></SurfaceState>;
}

function CommerceSurface({ workspaceId }: { workspaceId: string }) {
  const [products, setProducts] = useState<Product[]>([]); const [orders, setOrders] = useState<CommerceOrder[]>([]); const [levels, setLevels] = useState<InventoryLevel[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void Promise.all([productsApi.list(workspaceId, "limit=8"), commerceApi.listOrders(workspaceId, { limit: 8 }), commerceApi.listLevels(workspaceId, { limit: 8 })]).then(([productResponse, orderResponse, levelResponse]) => { if (!active) return; setProducts(productResponse.data.items); setOrders(orderResponse.data.items); setLevels(levelResponse.data.items); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, "Commerce data is unavailable."))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [workspaceId]);
  const atRisk = levels.filter((item) => Number(item.available) <= Number(item.reorderPoint)).length;
  return <SurfaceState loading={loading} error={error} empty={!products.length && !orders.length ? "No commerce records are available yet." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Products" value={products.length} detail="catalog records" icon={<Package size={14} />} /><Metric label="Orders" value={orders.length} detail="recent canonical orders" icon={<FileText size={14} />} /><Metric label="Stock attention" value={atRisk} detail="at or below reorder point" icon={<Boxes size={14} />} /></div><div className="lulu-native-agent__split-list"><section><div className="lulu-native-agent__list-head"><span>Product catalog</span><small>{products.length} visible</small></div>{products.slice(0, 5).map((product) => <article key={product.id}><div><strong>{product.name}</strong><small>{product.sku || "No SKU"} · {product.status}</small></div><Status>{product.completeness?.readyForPublishing ? "ready" : product.status}</Status></article>)}</section><section><div className="lulu-native-agent__list-head"><span>Order flow</span><small>{orders.length} visible</small></div>{orders.slice(0, 5).map((order) => <article key={order.id}><div><strong>{order.orderNumber}</strong><small>{order.lineCount ?? 0} lines · {order.currency} {order.grandTotal}</small></div><Status>{order.status}</Status></article>)}</section></div></SurfaceState>;
}

function FinanceSurface({ workspaceId }: { workspaceId: string }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]); const [quotes, setQuotes] = useState<Quote[]>([]); const [payouts, setPayouts] = useState<PayoutsData | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void Promise.all([commercialDocumentsApi.listInvoices(workspaceId, "limit=8"), commercialDocumentsApi.listQuotes(workspaceId, "limit=8"), financeApi.listPayouts(workspaceId, 8)]).then(([invoiceResponse, quoteResponse, payoutResponse]) => { if (!active) return; setInvoices(invoiceResponse.data.items); setQuotes(quoteResponse.data.items); setPayouts(payoutResponse.data); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, "Financial records are unavailable."))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [workspaceId]);
  const due = invoices.filter((item) => Number(item.amountDue) > 0).length;
  return <SurfaceState loading={loading} error={error} empty={!invoices.length && !quotes.length ? "No financial documents are available yet." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Invoices" value={invoices.length} detail={`${due} with outstanding balance`} icon={<FileText size={14} />} /><Metric label="Quotes" value={quotes.length} detail="commercial documents" icon={<WalletCards size={14} />} /><Metric label="Payouts" value={payouts?.items.length ?? 0} detail="canonical payout records" icon={<Landmark size={14} />} /></div><div className="lulu-native-agent__split-list"><section><div className="lulu-native-agent__list-head"><span>Invoice flow</span><small>Verified amounts</small></div>{invoices.slice(0, 5).map((invoice) => <article key={invoice.id}><div><strong>{invoice.invoiceNumber}</strong><small>{invoice.currency} {invoice.amountDue} due · {invoice.dueDate ? formatTime(invoice.dueDate) : "No due date"}</small></div><Status>{invoice.status}</Status></article>)}</section><section><div className="lulu-native-agent__list-head"><span>Quote pipeline</span><small>Canonical records</small></div>{quotes.slice(0, 5).map((quote) => <article key={quote.id}><div><strong>{quote.quoteNumber}</strong><small>{quote.currency} {quote.grandTotal ?? "—"} · {quote.creationMode}</small></div><Status>{quote.status}</Status></article>)}</section></div></SurfaceState>;
}

function MarketingSurface({ workspaceId }: { workspaceId: string }) {
  const [content, setContent] = useState<SocialContent[]>([]); const [publications, setPublications] = useState<SocialPublicationJob[]>([]); const [ads, setAds] = useState<AdSpendOverview | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void Promise.all([socialPublishingApi.listContent(workspaceId), socialPublishingApi.listPublications(workspaceId), adSpendApi.overview(workspaceId)]).then(([contentResponse, publicationResponse, adSpendResponse]) => { if (!active) return; setContent(contentResponse.data.items); setPublications(publicationResponse.data.items); setAds(adSpendResponse.data); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, "Marketing data is unavailable."))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [workspaceId]);
  return <SurfaceState loading={loading} error={error} empty={!content.length && !publications.length ? "No verified marketing work is available yet." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Content" value={content.length} detail="canonical social content" icon={<Sparkles size={14} />} /><Metric label="Publications" value={publications.length} detail="publication jobs" icon={<Radio size={14} />} /><Metric label="Ad balance" value={ads ? `${ads.wallet.availableAmount} ${ads.wallet.currency}` : "—"} detail={ads?.wallet.adsEnabled ? "funding available" : "ads not funded"} icon={<WalletCards size={14} />} /></div><section className="lulu-native-agent__list"><div className="lulu-native-agent__list-head"><span>Publication queue</span><small>Real publication state</small></div>{publications.slice(0, 6).map((item) => <article key={item.id}><div><strong>{item.content?.message?.slice(0, 80) || "Untitled publication"}</strong><small>{item.account?.displayName ?? "Social account"} · {formatTime(item.scheduledAt ?? item.createdAt)}</small></div><Status>{item.status}</Status></article>)}</section></SurfaceState>;
}

function WebsiteSurface({ workspaceId }: { workspaceId: string }) {
  const [sites, setSites] = useState<WebsiteSite[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void websitesApi.list(workspaceId).then((response) => active && setSites(response.data.items)).catch((cause) => active && setError(getFriendlyErrorMessage(cause, "Website data is unavailable."))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [workspaceId]);
  return <SurfaceState loading={loading} error={error} empty={!sites.length ? "No managed website is connected to this workspace." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Managed sites" value={sites.length} detail="owned by this workspace" icon={<Globe2 size={14} />} /><Metric label="Domains" value={sites.reduce((sum, site) => sum + site.domains.length, 0)} detail="domain records" icon={<Network size={14} />} /><Metric label="Live" value={sites.filter((site) => /active|published|live/i.test(site.status)).length} detail="verified site status" icon={<CheckCircle2 size={14} />} /></div><section className="lulu-native-agent__list">{sites.map((site) => <article key={site.id}><div><strong>{site.name}</strong><small>{site.domains.map((domain) => domain.hostname).join(" · ") || "No domain assigned"}</small></div><Status>{site.status}</Status></article>)}</section></SurfaceState>;
}

function OperationsSurface({ workspaceId }: { workspaceId: string }) {
  const [connections, setConnections] = useState<ProviderConnection[]>([]); const [readiness, setReadiness] = useState<ProviderLaunchReadiness | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void Promise.all([providerControlApi.connections(workspaceId), providerControlApi.launchReadiness(workspaceId)]).then(([connectionResponse, readinessResponse]) => { if (!active) return; setConnections(connectionResponse.data.connections); setReadiness(readinessResponse.data); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, "Integration readiness is unavailable."))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [workspaceId]);
  return <SurfaceState loading={loading} error={error} empty={!connections.length ? "No provider connection is available for this workspace." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Connections" value={connections.length} detail="provider control plane" icon={<Network size={14} />} /><Metric label="Ready" value={readiness?.readyCount ?? 0} detail={`${readiness?.totalConnections ?? 0} checked`} icon={<CheckCircle2 size={14} />} /><Metric label="Readiness" value={readiness?.overallReady ? "ready" : "gated"} detail="launch evidence" icon={<ShieldCheck size={14} />} /></div><section className="lulu-native-agent__list">{connections.slice(0, 8).map((connection) => <article key={connection.id}><div><strong>{connection.displayName}</strong><small>{connection.providerKey} · {connection.lastVerifiedAt ? `verified ${formatTime(connection.lastVerifiedAt)}` : "verification pending"}</small></div><Status>{connection.healthStatus}</Status></article>)}</section></SurfaceState>;
}

function IntelligenceSurface({ workspaceId }: { workspaceId: string }) {
  const [overview, setOverview] = useState<ExecutiveOverview | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void executiveApi.overview(workspaceId).then((response) => active && setOverview(response.data)).catch((cause) => active && setError(getFriendlyErrorMessage(cause, "Executive intelligence is unavailable."))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [workspaceId]);
  return <SurfaceState loading={loading} error={error} empty={!overview ? "No executive intelligence is available yet." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Findings" value={overview?.summary.visibleFindingCount ?? 0} detail="visible operating signals" icon={<CircleAlert size={14} />} /><Metric label="Proposals" value={overview?.summary.visibleProposalCount ?? 0} detail="decision-ready items" icon={<Sparkles size={14} />} /><Metric label="Forecasts" value={overview?.summary.forecastCount ?? 0} detail="evidence-backed scenarios" icon={<BarChart3 size={14} />} /></div><section className="lulu-native-agent__list"><div className="lulu-native-agent__list-head"><span>Executive signals</span><small>Verified cycle evidence</small></div>{overview?.findings.slice(0, 6).map((finding) => <article key={finding.id}><div><strong>{finding.title}</strong><small>{finding.description}</small></div><Status>{finding.status}</Status></article>)}</section></SurfaceState>;
}

export function AgentNativeWorkspace({ workspaceId, employeeDetail }: Props) {
  const kind = useMemo(() => resolveKind(employeeDetail), [employeeDetail]);
  const definition = KINDS[kind];
  const Icon = definition.icon;
  return <section className="lulu-native-agent" aria-label={`${employeeDetail.employee.name} native workspace`}>
    <header className="lulu-native-agent__header"><span className="lulu-native-agent__header-icon"><Icon size={17} /></span><div><span className="lulu-native-agent__eyebrow">{definition.label}</span><h3>{employeeDetail.employee.name}</h3><p>{definition.description}</p></div><span className="lulu-native-agent__live"><i />Native workspace</span></header>
    <div className="lulu-native-agent__content">
      {kind === "crm" ? <CrmSurface workspaceId={workspaceId} /> : null}
      {kind === "communications" ? <CommunicationsSurface workspaceId={workspaceId} /> : null}
      {kind === "commerce" ? <CommerceSurface workspaceId={workspaceId} /> : null}
      {kind === "finance" ? <FinanceSurface workspaceId={workspaceId} /> : null}
      {kind === "marketing" ? <MarketingSurface workspaceId={workspaceId} /> : null}
      {kind === "website" ? <WebsiteSurface workspaceId={workspaceId} /> : null}
      {kind === "operations" ? <OperationsSurface workspaceId={workspaceId} /> : null}
      {kind === "intelligence" ? <IntelligenceSurface workspaceId={workspaceId} /> : null}
      {kind === "command" ? <CommandSurface detail={employeeDetail} /> : null}
    </div>
    <footer className="lulu-native-agent__footer"><ShieldCheck size={14} /><span>Uses the same workspace-scoped APIs and permission checks as the full product surface.</span></footer>
  </section>;
}
