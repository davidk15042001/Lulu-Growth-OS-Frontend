import { useEffect, useMemo, useRef, useState } from "react";
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
  Mail,
  MessageCircle,
  Network,
  Package,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  WalletCards,
} from "lucide-react";
import { adSpendApi, type AdSpendOverview } from "../../api/adspend";
import { commercialDocumentsApi, type Invoice, type Quote } from "../../api/commercial-documents";
import { commerceApi, type CommerceOrder, type InventoryLevel } from "../../api/commerce";
import { calendarApi, type CalendarAccount, type CalendarEvent, type NativeCalendarEvent } from "../../api/calendar";
import { emailApi, type EmailAccount, type EmailDraft, type EmailThread } from "../../api/email";
import { executiveApi, type ExecutiveOverview } from "../../api/executive";
import { financeApi, type PayoutsData } from "../../api/finance";
import { omnichannelApi, type OmniConversation, type OmniMessage } from "../../api/omnichannel";
import { listRecords, type WorkspaceRecord } from "../../api/records";
import { providerControlApi, type ProviderConnection, type ProviderLaunchReadiness } from "../../api/providers";
import { productsApi, type Product } from "../../api/products";
import { socialPublishingApi, type SocialContent, type SocialPublicationJob } from "../../api/social-publishing";
import { websitesApi, type WebsiteSite } from "../../api/websites";
import { workspaceAppApi, type GoogleReviewsManagerState } from "../../api/workspace-app";
import type { OfficeEmployeeDetails } from "../../api/office";
import { ApiError, getFriendlyErrorMessage } from "../../api/client";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import { conciseOfficeCopy, officeEvidenceTypeLabel } from "./office-copy";
import "./agent-native-workspace.css";

type NativeWorkspaceKind = "command" | "crm" | "communications" | "email" | "calendar" | "commerce" | "finance" | "marketing" | "website" | "reputation" | "operations" | "intelligence";

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
  email: { label: "Email operations", description: "Connected inboxes, verified threads and draft delivery state.", icon: Mail },
  calendar: { label: "Calendar operations", description: "Connected calendars, upcoming appointments and synchronization state.", icon: CalendarDays },
  commerce: { label: "Commerce operations", description: "Products, orders and inventory supplied by the canonical commerce services.", icon: Store },
  finance: { label: "Financial operations", description: "Invoices, quotes, payouts and verified financial workflow state.", icon: Landmark },
  marketing: { label: "Growth studio", description: "Content, publications and paid-media funding state.", icon: Sparkles },
  website: { label: "Web presence", description: "Managed sites, domains and the web delivery state.", icon: Globe2 },
  reputation: { label: "Reputation desk", description: "Connected Google reviews, response coverage and verified reputation signals.", icon: Star },
  operations: { label: "Operations control", description: "Provider readiness, integrations and durable operational evidence.", icon: Network },
  intelligence: { label: "Company intelligence", description: "Executive findings, proposals and observable operating signals.", icon: BarChart3 },
};

function resolveKind(detail: OfficeEmployeeDetails): NativeWorkspaceKind {
  const key = detail.employee.key.toLowerCase().replaceAll("_", "-");
  const capabilities = detail.capabilities.map((capability) => capability.key);
  const has = (prefix: string) => capabilities.some((capability) => capability.startsWith(prefix));
  if (/calendar/.test(key)) return "calendar";
  if (/email|inbox|mail/.test(key)) return "email";
  if (/reputation|review/.test(key)) return "reputation";
  if (has("omnichannel.") || /support|communication/.test(key)) return "communications";
  if (has("invoices.") || has("finance.") || has("payouts.") || has("quotes.") || /invoice|billing|bookkeeping|finance|quote/.test(key)) return "finance";
  if (has("crm.") || has("leads.") || has("opportunities.") || /company|customer|lead|sales|follow-up|quote/.test(key)) return "crm";
  if (has("products.") || has("orders.") || /product|catalog|inventory|fulfillment|commerce|store|order/.test(key)) return "commerce";
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
  if (/waiting|awaiting|pending|queued|draft|paused|review/.test(normalized)) return "is-waiting";
  return "";
}

function SurfaceState({ loading, error, empty, children }: { loading: boolean; error: string; empty?: string; children: React.ReactNode }) {
  const t = useTranslation();
  if (loading) return <div className="lulu-native-agent__state"><RefreshCw size={18} className="lulu-station__spin" /><span>{t("Loading verified workspace data…")}</span></div>;
  if (error) return <div className="lulu-native-agent__state lulu-native-agent__state--error"><CircleAlert size={18} /><span>{error}</span></div>;
  if (empty) return <div className="lulu-native-agent__state"><Boxes size={18} /><span>{t(empty)}</span></div>;
  return <>{children}</>;
}

function Metric({ label, value, detail, icon }: { label: string; value: string | number; detail: string; icon: React.ReactNode }) {
  const t = useTranslation();
  return <div className="lulu-native-agent__metric"><span>{icon}{t(label)}</span><strong>{value}</strong><small>{t(detail)}</small></div>;
}

function Status({ children }: { children: string | null | undefined }) {
  const t = useTranslation();
  const label = children?.replaceAll("_", " ") ?? "unknown";
  return <span className={`lulu-native-agent__status ${statusClass(children)}`}>{t(label.toLowerCase())}</span>;
}

function CommandSurface({ detail }: { detail: OfficeEmployeeDetails }) {
  const t = useTranslation();
  const work = detail.currentWorkItem;
  const workStatus = detail.employee.status === "WAITING" && work?.status === "running"
    ? "awaiting recovery"
    : work?.status ?? detail.employee.status;
  return <div className="lulu-native-agent__command">
    <section className="lulu-native-agent__focus-card">
      <div><span className="lulu-native-agent__eyebrow">{t("CURRENT ASSIGNMENT")}</span><h3 title={work?.title}>{conciseOfficeCopy(work?.title, t("No active assignment"))}</h3><p title={work?.objective}>{conciseOfficeCopy(work?.objective, t("This agent is available. Lulu will only animate or execute when a persisted work item is assigned."), 260)}</p></div>
      <Status>{workStatus}</Status>
    </section>
    <section className="lulu-native-agent__evidence-grid">
      <div><span className="lulu-native-agent__eyebrow">{t("RECENT EVIDENCE")}</span>{detail.recentTimeline.length ? <ol>{detail.recentTimeline.slice(0, 5).map((item) => <li key={item.id}><i /><span><strong title={item.title}>{conciseOfficeCopy(item.title, t("Verified employee event"), 96)}</strong><small>{officeEvidenceTypeLabel(item.type, t)} · {formatTime(item.occurredAt)}</small></span></li>)}</ol> : <p className="lulu-native-agent__muted">{t("No persisted employee events are available yet.")}</p>}</div>
      <div><span className="lulu-native-agent__eyebrow">{t("WORKLOAD")}</span><div className="lulu-native-agent__stat-stack"><strong>{new Intl.NumberFormat().format(detail.workSummary.active)}<small>{t("open work")}</small></strong><strong>{new Intl.NumberFormat().format(detail.workSummary.completedToday)}<small>{t("completed today")}</small></strong><strong>{new Intl.NumberFormat().format(detail.workSummary.failed)}<small>{t("failed")}</small></strong></div></div>
    </section>
  </div>;
}

function CrmSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [items, setItems] = useState<WorkspaceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void listRecords("crm_companies", "limit=8", { includeTotal: true }).then((response) => { if (active) setItems(response.data.items); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Customer intelligence is unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [t, workspaceId]);
  const researching = items.filter((item) => ["queued", "researching"].includes(String(item.data.enrichment && typeof item.data.enrichment === "object" ? (item.data.enrichment as Record<string, unknown>).status : ""))).length;
  return <SurfaceState loading={loading} error={error} empty={!items.length ? "No companies are available in the customer graph." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Companies" value={items.length} detail="loaded in this view" icon={<Building2 size={14} />} /><Metric label="Research" value={researching} detail="verified in progress" icon={<Sparkles size={14} />} /><Metric label="Fresh signal" value={items.filter((item) => item.status !== "ARCHIVED").length} detail="active company profiles" icon={<Radio size={14} />} /></div><section className="lulu-native-agent__list"><div className="lulu-native-agent__list-head"><span>{t("Company intelligence")}</span><small>{t("Canonical CRM records")}</small></div>{items.map((item) => { const enrichment = item.data.enrichment && typeof item.data.enrichment === "object" ? item.data.enrichment as Record<string, unknown> : {}; return <article key={item.id}><span className="lulu-native-agent__initial">{item.name.slice(0, 2).toUpperCase()}</span><div><strong>{item.name}</strong><small>{String(item.data.industry ?? t("Industry is being verified"))} · {String(item.data.city ?? item.data.country ?? t("Location pending"))}</small></div><span className="lulu-native-agent__progress"><i style={{ width: `${Math.min(100, Number(enrichment.completeness ?? 0))}%` }} /><small>{Number(enrichment.completeness ?? 0)}%</small></span><Status>{String(enrichment.status ?? item.status)}</Status></article>; })}</section></SurfaceState>;
}

function CommunicationsSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [items, setItems] = useState<OmniConversation[]>([]);
  const [messages, setMessages] = useState<OmniMessage[]>([]);
  const [selected, setSelected] = useState<OmniConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messageRequestRef = useRef(0);
  useEffect(() => { let active = true; const requestId = ++messageRequestRef.current; setLoading(true); setError(""); void omnichannelApi.conversations(workspaceId, "limit=16").then((conversations) => { if (!active) return; setItems(conversations.data.items); const first = conversations.data.items[0] ?? null; setSelected(first); if (first) return omnichannelApi.conversation(workspaceId, first.id).then((response) => { if (active && requestId === messageRequestRef.current) setMessages(response.data.messages); }); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Customer conversations are unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; messageRequestRef.current += 1; }; }, [t, workspaceId]);
  const open = (conversation: OmniConversation) => { const requestId = ++messageRequestRef.current; setSelected(conversation); setMessages([]); setError(""); void omnichannelApi.conversation(workspaceId, conversation.id).then((response) => { if (requestId === messageRequestRef.current) setMessages(response.data.messages); }).catch((cause) => { if (requestId === messageRequestRef.current) setError(getFriendlyErrorMessage(cause, t("Conversation details are unavailable."))); }); };
  return <SurfaceState loading={loading} error={error} empty={!items.length ? "No connected customer conversations are available." : undefined}><div className="lulu-native-agent__conversation"><aside>{items.map((item) => <button type="button" className={selected?.id === item.id ? "is-selected" : ""} onClick={() => open(item)} key={item.id}><strong>{item.subject || t("New conversation")}</strong><span>{item.channelDisplayName || t("Connected channel")} · <Status>{item.handlingMode}</Status></span></button>)}</aside><section><header><div><span className="lulu-native-agent__eyebrow">{t("LIVE CONVERSATION")}</span><h3>{selected?.subject ?? t("Select a conversation")}</h3></div>{selected ? <Status>{selected.handlingMode}</Status> : null}</header><div className="lulu-native-agent__message-log">{selected ? messages.length ? messages.map((message) => <p key={message.id} className={message.direction === "INBOUND" ? "is-inbound" : ""}><small>{message.direction === "INBOUND" ? t("Customer") : message.direction === "INTERNAL" ? t("Internal note") : "Lulu"}</small>{message.textContent ?? t("Unsupported message content")}</p>) : <div className="lulu-native-agent__muted">{t("No messages are available for this conversation.")}</div> : <div className="lulu-native-agent__muted">{t("Choose a verified conversation to inspect its thread.")}</div>}</div></section></div></SurfaceState>;
}

function EmailSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void Promise.all([emailApi.accounts(workspaceId), emailApi.threads(workspaceId, { limit: 8 }), emailApi.drafts(workspaceId)]).then(([accountResponse, threadResponse, draftResponse]) => { if (!active) return; setAccounts(accountResponse.data.items); setThreads(threadResponse.data.items); setDrafts(draftResponse.data.items); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Email operations are unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [t, workspaceId]);
  const unread = threads.filter((thread) => thread.unread).length;
  return <SurfaceState loading={loading} error={error} empty={!accounts.length && !threads.length ? "No connected inbox is available for this workspace." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Inboxes" value={accounts.length} detail="connected email accounts" icon={<Mail size={14} />} /><Metric label="Unread" value={unread} detail="visible inbox threads" icon={<CircleAlert size={14} />} /><Metric label="Drafts" value={drafts.length} detail="pending delivery review" icon={<FileText size={14} />} /></div><div className="lulu-native-agent__split-list"><section><div className="lulu-native-agent__list-head"><span>{t("Inbox priority")}</span><small>{threads.length} {t("recent threads")}</small></div>{threads.length ? threads.slice(0, 5).map((thread) => <article key={thread.id}><div><strong>{thread.subject || t("Untitled email")}</strong><small>{thread.accountEmail} · {formatTime(thread.latestAt)}</small></div><Status>{thread.unread ? "unread" : "read"}</Status></article>) : <p className="lulu-native-agent__empty-list">{t("No inbox threads are available yet.")}</p>}</section><section><div className="lulu-native-agent__list-head"><span>{t("Draft queue")}</span><small>{t("Canonical drafts")}</small></div>{drafts.length ? drafts.slice(0, 5).map((draft) => <article key={draft.id}><div><strong>{draft.subject || t("Untitled draft")}</strong><small>{draft.accountEmail ?? t("Connected inbox")} · {formatTime(draft.updatedAt)}</small></div><Status>{draft.status}</Status></article>) : <p className="lulu-native-agent__empty-list">{t("No draft email is awaiting review.")}</p>}</section></div></SurfaceState>;
}

type CalendarPanelEvent = CalendarEvent | NativeCalendarEvent;

function calendarEventDetail(event: CalendarPanelEvent, t: (key: string) => string) {
  const attendees = "attendeeCount" in event ? `${event.attendeeCount} ${t(event.attendeeCount === 1 ? "attendee" : "attendees")}` : event.customerName ?? t("Lulu calendar");
  return [event.location, attendees].filter(Boolean).join(" · ");
}

function CalendarSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [accounts, setAccounts] = useState<CalendarAccount[]>([]);
  const [events, setEvents] = useState<CalendarPanelEvent[]>([]);
  const [summary, setSummary] = useState({ connectedAccounts: 0, syncedAccounts: 0, upcomingEvents: 0, providers: [] as string[] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void calendarApi.overview(workspaceId, { from: new Date().toISOString(), limit: 8 }).then((response) => { if (!active) return; setAccounts(response.data.accounts); setEvents([...response.data.nativeEvents, ...response.data.events].sort((left, right) => left.startAt.localeCompare(right.startAt)).slice(0, 8)); setSummary(response.data.summary); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Calendar operations are unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [t, workspaceId]);
  return <SurfaceState loading={loading} error={error} empty={!accounts.length && !events.length ? "No connected calendar is available for this workspace." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Calendars" value={summary.connectedAccounts} detail={`${summary.providers.length} ${t(summary.providers.length === 1 ? "provider connected" : "providers connected")}`} icon={<CalendarDays size={14} />} /><Metric label="Synced" value={summary.syncedAccounts} detail="calendar connections current" icon={<RefreshCw size={14} />} /><Metric label="Upcoming" value={summary.upcomingEvents} detail="scheduled customer interactions" icon={<CheckCircle2 size={14} />} /></div><div className="lulu-native-agent__split-list"><section><div className="lulu-native-agent__list-head"><span>{t("Upcoming schedule")}</span><small>{t("All connected calendars")}</small></div>{events.length ? events.slice(0, 5).map((event) => <article key={event.id}><div><strong>{event.title}</strong><small>{formatTime(event.startAt)}{calendarEventDetail(event, t) ? ` · ${calendarEventDetail(event, t)}` : ""}</small></div><Status>{event.status}</Status></article>) : <p className="lulu-native-agent__empty-list">{t("No upcoming calendar events are available.")}</p>}</section><section><div className="lulu-native-agent__list-head"><span>{t("Calendar connections")}</span><small>{t("Sync evidence")}</small></div>{accounts.length ? accounts.slice(0, 5).map((account) => <article key={account.id}><div><strong>{account.displayName ?? account.emailAddress ?? t("Connected calendar")}</strong><small>{account.provider} · {account.lastSyncAt ? `${t("synced")} ${formatTime(account.lastSyncAt)}` : t("sync pending")}</small></div><Status>{account.status}</Status></article>) : <p className="lulu-native-agent__empty-list">{t("No calendar connection is available.")}</p>}</section></div></SurfaceState>;
}

function CommerceSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [products, setProducts] = useState<Product[]>([]); const [orders, setOrders] = useState<CommerceOrder[]>([]); const [levels, setLevels] = useState<InventoryLevel[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void Promise.all([productsApi.list(workspaceId, "limit=8"), commerceApi.listOrders(workspaceId, { limit: 8 }), commerceApi.listLevels(workspaceId, { limit: 8 })]).then(([productResponse, orderResponse, levelResponse]) => { if (!active) return; setProducts(productResponse.data.items); setOrders(orderResponse.data.items); setLevels(levelResponse.data.items); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Commerce data is unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [t, workspaceId]);
  const atRisk = levels.filter((item) => Number(item.available) <= Number(item.reorderPoint)).length;
  return <SurfaceState loading={loading} error={error} empty={!products.length && !orders.length ? "No commerce records are available yet." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Products" value={products.length} detail="catalog records" icon={<Package size={14} />} /><Metric label="Orders" value={orders.length} detail="recent canonical orders" icon={<FileText size={14} />} /><Metric label="Stock attention" value={atRisk} detail="at or below reorder point" icon={<Boxes size={14} />} /></div><div className="lulu-native-agent__split-list"><section><div className="lulu-native-agent__list-head"><span>{t("Product catalog")}</span><small>{products.length} {t("visible")}</small></div>{products.slice(0, 5).map((product) => <article key={product.id}><div><strong>{product.name}</strong><small>{product.sku || t("No SKU")} · {product.status}</small></div><Status>{product.completeness?.readyForPublishing ? "ready" : product.status}</Status></article>)}</section><section><div className="lulu-native-agent__list-head"><span>{t("Order flow")}</span><small>{orders.length} {t("visible")}</small></div>{orders.slice(0, 5).map((order) => <article key={order.id}><div><strong>{order.orderNumber}</strong><small>{order.lineCount ?? 0} {t("lines ·")} {order.currency} {order.grandTotal}</small></div><Status>{order.status}</Status></article>)}</section></div></SurfaceState>;
}

function FinanceSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]); const [quotes, setQuotes] = useState<Quote[]>([]); const [payouts, setPayouts] = useState<PayoutsData | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void Promise.all([commercialDocumentsApi.listInvoices(workspaceId, "limit=8"), commercialDocumentsApi.listQuotes(workspaceId, "limit=8"), financeApi.listPayouts(workspaceId, 8)]).then(([invoiceResponse, quoteResponse, payoutResponse]) => { if (!active) return; setInvoices(invoiceResponse.data.items); setQuotes(quoteResponse.data.items); setPayouts(payoutResponse.data); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Financial records are unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [t, workspaceId]);
  const due = invoices.filter((item) => Number(item.amountDue) > 0).length;
  return <SurfaceState loading={loading} error={error} empty={!invoices.length && !quotes.length ? "No financial documents are available yet." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Invoices" value={invoices.length} detail={`${due} ${t("with outstanding balance")}`} icon={<FileText size={14} />} /><Metric label="Quotes" value={quotes.length} detail="commercial documents" icon={<WalletCards size={14} />} /><Metric label="Payouts" value={payouts?.items.length ?? 0} detail="canonical payout records" icon={<Landmark size={14} />} /></div><div className="lulu-native-agent__split-list"><section><div className="lulu-native-agent__list-head"><span>{t("Invoice flow")}</span><small>{t("Verified amounts")}</small></div>{invoices.slice(0, 5).map((invoice) => <article key={invoice.id}><div><strong>{invoice.invoiceNumber}</strong><small>{invoice.currency} {invoice.amountDue} {t("due ·")} {invoice.dueDate ? formatTime(invoice.dueDate) : t("No due date")}</small></div><Status>{invoice.status}</Status></article>)}</section><section><div className="lulu-native-agent__list-head"><span>{t("Quote pipeline")}</span><small>{t("Canonical records")}</small></div>{quotes.slice(0, 5).map((quote) => <article key={quote.id}><div><strong>{quote.quoteNumber}</strong><small>{quote.currency} {quote.grandTotal ?? "—"} · {quote.creationMode}</small></div><Status>{quote.status}</Status></article>)}</section></div></SurfaceState>;
}

function MarketingSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [content, setContent] = useState<SocialContent[]>([]); const [publications, setPublications] = useState<SocialPublicationJob[]>([]); const [ads, setAds] = useState<AdSpendOverview | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void Promise.all([socialPublishingApi.listContent(workspaceId), socialPublishingApi.listPublications(workspaceId), adSpendApi.overview(workspaceId)]).then(([contentResponse, publicationResponse, adSpendResponse]) => { if (!active) return; setContent(contentResponse.data.items); setPublications(publicationResponse.data.items); setAds(adSpendResponse.data); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Marketing data is unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [t, workspaceId]);
  return <SurfaceState loading={loading} error={error} empty={!content.length && !publications.length ? "No verified marketing work is available yet." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Content" value={content.length} detail="canonical social content" icon={<Sparkles size={14} />} /><Metric label="Publications" value={publications.length} detail="publication jobs" icon={<Radio size={14} />} /><Metric label="Ad balance" value={ads ? `${ads.wallet.availableAmount} ${ads.wallet.currency}` : "—"} detail={ads?.wallet.adsEnabled ? "funding available" : "ads not funded"} icon={<WalletCards size={14} />} /></div><section className="lulu-native-agent__list"><div className="lulu-native-agent__list-head"><span>{t("Publication queue")}</span><small>{t("Real publication state")}</small></div>{publications.slice(0, 6).map((item) => <article key={item.id}><div><strong>{item.content?.message?.slice(0, 80) || t("Untitled publication")}</strong><small>{item.account?.displayName ?? t("Social account")} · {formatTime(item.scheduledAt ?? item.createdAt)}</small></div><Status>{item.status}</Status></article>)}</section></SurfaceState>;
}

function WebsiteSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [sites, setSites] = useState<WebsiteSite[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void websitesApi.list(workspaceId).then((response) => active && setSites(response.data.items)).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Website data is unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [t, workspaceId]);
  return <SurfaceState loading={loading} error={error} empty={!sites.length ? "No managed website is connected to this workspace." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Managed sites" value={sites.length} detail="owned by this workspace" icon={<Globe2 size={14} />} /><Metric label="Domains" value={sites.reduce((sum, site) => sum + site.domains.length, 0)} detail="domain records" icon={<Network size={14} />} /><Metric label="Live" value={sites.filter((site) => /active|published|live/i.test(site.status)).length} detail="verified site status" icon={<CheckCircle2 size={14} />} /></div><section className="lulu-native-agent__list">{sites.map((site) => <article key={site.id}><div><strong>{site.name}</strong><small>{site.domains.map((domain) => domain.hostname).join(" · ") || t("No domain assigned")}</small></div><Status>{site.status}</Status></article>)}</section></SurfaceState>;
}

const REVIEW_URGENCY_RANK: Readonly<Record<GoogleReviewsManagerState["reviews"][number]["urgency"], number>> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function ReviewSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [manager, setManager] = useState<GoogleReviewsManagerState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connectionState, setConnectionState] = useState<"unknown" | "not_connected" | "reauth_required">("unknown");
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setManager(null);
    setConnectionState("unknown");
    void workspaceAppApi.googleReviews(workspaceId, { limit: 12 })
      .then((response) => { if (active) setManager(response.data); })
      .catch((cause) => {
        if (!active) return;
        if (cause instanceof ApiError && cause.code === "GOOGLE_BUSINESS_NOT_CONNECTED") {
          setConnectionState("not_connected");
          return;
        }
        if (cause instanceof ApiError && cause.code === "GOOGLE_BUSINESS_REAUTH_REQUIRED") {
          setConnectionState("reauth_required");
          return;
        }
        setError(getFriendlyErrorMessage(cause, t("Google review data is unavailable.")));
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [t, workspaceId]);
  const reviews = useMemo(() => (manager?.reviews ?? []).slice().sort((left, right) => {
    const urgency = REVIEW_URGENCY_RANK[right.urgency] - REVIEW_URGENCY_RANK[left.urgency];
    return urgency || Date.parse(right.updateTime ?? right.createTime ?? "") - Date.parse(left.updateTime ?? left.createTime ?? "");
  }).slice(0, 6), [manager]);
  const empty = connectionState === "reauth_required"
    ? "The Google Business connection needs reauthorization before review data can be read."
    : !manager?.connected
      ? "No connected Google Business review source is available for this workspace."
      : undefined;
  return <SurfaceState loading={loading} error={error} empty={empty}>
    <div className="lulu-native-agent__metrics">
      <Metric label="Reviews" value={manager?.summary.totalReviews ?? 0} detail="loaded Google reviews" icon={<Star size={14} />} />
      <Metric label="Rating" value={manager?.summary.averageRating?.toFixed(1) ?? "—"} detail="average rating out of 5" icon={<Star size={14} />} />
      <Metric label="Reply rate" value={`${manager?.summary.replyRate ?? 0}%`} detail={`${manager?.summary.unansweredCount ?? 0} unanswered`} icon={<MessageCircle size={14} />} />
    </div>
    <section className="lulu-native-agent__list">
      <div className="lulu-native-agent__list-head"><span>Priority review queue</span><small>Connected Google Business data</small></div>
      {reviews.length ? reviews.map((review) => <article key={review.id}>
        <span className="lulu-native-agent__initial">{review.reviewerDisplayName.slice(0, 2).toUpperCase()}</span>
        <div><strong>{review.reviewerDisplayName}</strong><small>{review.starRating.toFixed(1)} / 5 · {t(review.reviewReply ? "answered" : "unanswered")} · {formatTime(review.updateTime ?? review.createTime)}</small></div>
        <Status>{review.urgency}</Status>
      </article>) : <p className="lulu-native-agent__empty-list">{t("No Google reviews are available for the selected workspace.")}</p>}
    </section>
  </SurfaceState>;
}

function OperationsSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [connections, setConnections] = useState<ProviderConnection[]>([]); const [readiness, setReadiness] = useState<ProviderLaunchReadiness | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void Promise.all([providerControlApi.connections(workspaceId), providerControlApi.launchReadiness(workspaceId)]).then(([connectionResponse, readinessResponse]) => { if (!active) return; setConnections(connectionResponse.data.connections); setReadiness(readinessResponse.data); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Integration readiness is unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [t, workspaceId]);
  return <SurfaceState loading={loading} error={error} empty={!connections.length ? "No provider connection is available for this workspace." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Connections" value={connections.length} detail="provider control plane" icon={<Network size={14} />} /><Metric label="Ready" value={readiness?.readyCount ?? 0} detail={`${readiness?.totalConnections ?? 0} ${t("checked")}`} icon={<CheckCircle2 size={14} />} /><Metric label="Readiness" value={readiness?.overallReady ? "ready" : "gated"} detail="launch evidence" icon={<ShieldCheck size={14} />} /></div><section className="lulu-native-agent__list">{connections.slice(0, 8).map((connection) => <article key={connection.id}><div><strong>{connection.displayName}</strong><small>{connection.providerKey} · {connection.lastVerifiedAt ? `${t("verified")} ${formatTime(connection.lastVerifiedAt)}` : t("verification pending")}</small></div><Status>{connection.healthStatus}</Status></article>)}</section></SurfaceState>;
}

function IntelligenceSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [overview, setOverview] = useState<ExecutiveOverview | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void executiveApi.overview(workspaceId).then((response) => active && setOverview(response.data)).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Executive intelligence is unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [t, workspaceId]);
  return <SurfaceState loading={loading} error={error} empty={!overview ? "No executive intelligence is available yet." : undefined}><div className="lulu-native-agent__metrics"><Metric label="Findings" value={overview?.summary.visibleFindingCount ?? 0} detail="visible operating signals" icon={<CircleAlert size={14} />} /><Metric label="Proposals" value={overview?.summary.visibleProposalCount ?? 0} detail="decision-ready items" icon={<Sparkles size={14} />} /><Metric label="Forecasts" value={overview?.summary.forecastCount ?? 0} detail="evidence-backed scenarios" icon={<BarChart3 size={14} />} /></div><section className="lulu-native-agent__list"><div className="lulu-native-agent__list-head"><span>{t("Executive signals")}</span><small>{t("Verified cycle evidence")}</small></div>{overview?.findings.slice(0, 6).map((finding) => <article key={finding.id}><div><strong>{finding.title}</strong><small>{finding.description}</small></div><Status>{finding.status}</Status></article>)}</section></SurfaceState>;
}

export function AgentNativeWorkspace({ workspaceId, employeeDetail }: Props) {
  const t = useTranslation();
  const kind = useMemo(() => resolveKind(employeeDetail), [employeeDetail]);
  const definition = KINDS[kind];
  const Icon = definition.icon;
  return <section className="lulu-native-agent" aria-label={`${t(employeeDetail.employee.name)} ${t("native workspace")}`.trim()}>
    <header className="lulu-native-agent__header"><span className="lulu-native-agent__header-icon"><Icon size={17} /></span><div><span className="lulu-native-agent__eyebrow">{t(definition.label)}</span><h3>{t(employeeDetail.employee.name)}</h3><p>{t(definition.description)}</p></div><span className="lulu-native-agent__live"><i />{t("Native workspace")}</span></header>
    <div className="lulu-native-agent__content">
      {kind === "crm" ? <CrmSurface workspaceId={workspaceId} /> : null}
      {kind === "communications" ? <CommunicationsSurface workspaceId={workspaceId} /> : null}
      {kind === "email" ? <EmailSurface workspaceId={workspaceId} /> : null}
      {kind === "calendar" ? <CalendarSurface workspaceId={workspaceId} /> : null}
      {kind === "commerce" ? <CommerceSurface workspaceId={workspaceId} /> : null}
      {kind === "finance" ? <FinanceSurface workspaceId={workspaceId} /> : null}
      {kind === "marketing" ? <MarketingSurface workspaceId={workspaceId} /> : null}
      {kind === "website" ? <WebsiteSurface workspaceId={workspaceId} /> : null}
      {kind === "reputation" ? <ReviewSurface workspaceId={workspaceId} /> : null}
      {kind === "operations" ? <OperationsSurface workspaceId={workspaceId} /> : null}
      {kind === "intelligence" ? <IntelligenceSurface workspaceId={workspaceId} /> : null}
      {kind === "command" ? <CommandSurface detail={employeeDetail} /> : null}
    </div>
    <footer className="lulu-native-agent__footer"><ShieldCheck size={14} /><span>{t("Uses the same workspace-scoped APIs and permission checks as the full product surface.")}</span></footer>
  </section>;
}
