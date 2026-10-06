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
import { listWorkspaceRecords, type WorkspaceRecord } from "../../api/records";
import { providerControlApi, type ProviderConnection, type ProviderLaunchReadiness } from "../../api/providers";
import { productsApi, type Product } from "../../api/products";
import { socialPublishingApi, type SocialContent, type SocialPublicationJob } from "../../api/social-publishing";
import { websitesApi, type WebsiteSite } from "../../api/websites";
import { workspaceAppApi, type GoogleReviewsManagerState } from "../../api/workspace-app";
import type { AgentEcosystemDefinition } from "../../api/agents";
import type { OfficeEmployeeDetails } from "../../api/office";
import { ApiError, getFriendlyErrorMessage } from "../../api/client";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import { conciseOfficeCopy, officeEvidenceTypeLabel } from "./office-copy";
import "./agent-native-workspace.css";

export type NativeWorkspaceKind = "command" | "crm" | "communications" | "email" | "calendar" | "commerce" | "finance" | "marketing" | "website" | "reputation" | "operations" | "intelligence";

type Props = {
  workspaceId: string;
  employeeDetail?: OfficeEmployeeDetails;
  catalogAgent?: AgentEcosystemDefinition;
};

type AgentSurfaceSource = {
  key: string;
  name: string;
  capabilities: readonly string[];
  module?: string | null;
  pageId?: string | null;
  purpose?: string | null;
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

/**
 * Every employee rendered in the Station has an intentional native workspace.
 *
 * The Office employee detail currently exposes its department as `module`, so
 * resolving visible employees only from free-text capabilities could route a
 * role to an adjacent surface. Keep that deterministic here. The semantic
 * resolver below is deliberately retained for future catalog/Composio agents
 * that do not yet have an Office role projection.
 */
export const OFFICE_EMPLOYEE_WORKSPACE_KINDS: Readonly<Record<string, NativeWorkspaceKind>> = {
  "executive-orchestrator": "intelligence",
  "security-policy-auditor": "intelligence",
  "outcome-quality-auditor": "intelligence",
  "business-intelligence-analyst": "intelligence",
  "analytics-manager": "intelligence",
  "commerce-analytics-manager": "intelligence",

  "company-intelligence-specialist": "crm",
  "crm-manager": "crm",
  "follow-up-specialist": "crm",
  "customer-manager": "crm",
  "lead-generation-specialist": "crm",
  "lead-qualification-specialist": "crm",
  "opportunity-manager": "crm",
  "sales-representative": "crm",

  "quote-specialist": "finance",
  "invoice-manager": "finance",
  "billing-usage-manager": "finance",
  "bookkeeping-manager": "finance",
  "finance-operations-manager": "finance",

  "omnichannel-manager": "communications",
  "customer-communication-specialist": "communications",
  "customer-support-specialist": "communications",
  "email-specialist": "email",
  "calendar-coordinator": "calendar",

  "brand-content-strategist": "marketing",
  "paid-acquisition-specialist": "marketing",
  "social-publishing-specialist": "marketing",
  "marketing-manager": "marketing",
  "content-specialist": "marketing",

  "website-manager": "website",
  "pages-cms-manager": "website",
  "search-visibility-manager": "website",
  "media-assets-manager": "website",
  "domain-manager": "website",
  "reviews-reputation-manager": "reputation",

  "product-manager": "commerce",
  "premium-media-producer": "commerce",
  "category-manager": "commerce",
  "order-manager": "commerce",
  "inventory-manager": "commerce",
  "fulfillment-manager": "commerce",
  "store-manager": "commerce",

  "integration-manager": "operations",
  "automation-manager": "operations",
  "operations-manager": "operations",
};

/**
 * Catalog specialists are not provisioned Digital Employees, so their role
 * keys are intentionally more numerous than the Station roster.  Their
 * canonical module is still part of the API contract; resolve it before any
 * free-text heuristics so every on-demand specialist opens a predictable
 * native workspace rather than falling into a neighbouring surface because a
 * capability happened to share a keyword.
 */
const AGENT_MODULE_WORKSPACE_KINDS: Readonly<Record<string, NativeWorkspaceKind>> = {
  general: "command",
  dashboard: "intelligence",
  intelligence: "intelligence",
  finance: "finance",
  sales: "crm",
  crm: "crm",
  ai: "command",
  email: "email",
  calendar: "calendar",
  marketing: "marketing",
  ads: "marketing",
  website: "website",
  commerce: "commerce",
  reputation: "reputation",
  settings: "operations",
  seo: "website",
  geo: "website",
  aeo: "website",
};

function resolveKind(source: AgentSurfaceSource): NativeWorkspaceKind {
  const canonicalKind = OFFICE_EMPLOYEE_WORKSPACE_KINDS[source.key];
  if (canonicalKind) return canonicalKind;

  const moduleKind = source.module ? AGENT_MODULE_WORKSPACE_KINDS[source.module.toLowerCase()] : undefined;
  if (moduleKind) return moduleKind;

  const capabilities = source.capabilities.map((capability) => capability.toLowerCase());
  const classification = [source.key, source.name, source.module, source.pageId, ...capabilities]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replaceAll("_", "-");
  const has = (prefix: string) => capabilities.some((capability) => capability.startsWith(prefix));
  if (/calendar|scheduling|appointment/.test(classification)) return "calendar";
  if (/email|inbox|mail/.test(classification)) return "email";
  if (/reputation|review/.test(classification)) return "reputation";
  if (has("omnichannel.") || /omnichannel|support|communication|conversation/.test(classification)) return "communications";
  if (has("invoices.") || has("finance.") || has("payouts.") || has("quotes.") || /invoice|billing|bookkeeping|finance|quote|tax|commission/.test(classification)) return "finance";
  if (has("crm.") || has("leads.") || has("opportunities.") || /crm|company|contact|customer|lead|sales|follow-up|opportunity|deal|pipeline|territor/.test(classification)) return "crm";
  if (has("products.") || has("orders.") || /product|catalog|inventory|fulfillment|commerce|store|order/.test(classification)) return "commerce";
  if (has("social.") || has("advertising.") || /marketing|content|brand|social|acquisition|ads|campaign|keyword|audience/.test(classification)) return "marketing";
  if (has("website.") || /website|cms|media|domain|search|seo/.test(classification)) return "website";
  if (has("providers.") || has("settings.") || /integration|automation|operations|provider|settings|capability/.test(classification)) return "operations";
  if (/intelligence|analytics|executive|orchestrator|quality|security|knowledge|audit|assistant/.test(classification)) return "intelligence";
  return "command";
}

function activeLocale() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang || "en";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(activeLocale()).format(value);
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString(activeLocale(), { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function statusClass(value: string | null | undefined) {
  const normalized = (value ?? "unknown").toLowerCase();
  if (/failed|error|blocked|cancelled|unavailable/.test(normalized)) return "is-alert";
  if (/running|working|active|ready|completed|published|available|succeeded/.test(normalized)) return "is-positive";
  if (/waiting|awaiting|pending|queued|draft|paused|review/.test(normalized)) return "is-waiting";
  return "";
}

function SurfaceState({ loading, error, empty, children }: { loading: boolean; error: string; empty?: React.ReactNode; children: React.ReactNode }) {
  const t = useTranslation();
  if (loading) return <div className="lulu-native-agent__state"><RefreshCw size={18} className="lulu-station__spin" /><span>{t("Loading verified workspace data…")}</span></div>;
  if (error) return <div className="lulu-native-agent__state lulu-native-agent__state--error"><CircleAlert size={18} /><span>{error}</span></div>;
  if (empty) return <div className="lulu-native-agent__state"><Boxes size={18} /><span>{empty}</span></div>;
  return <>{children}</>;
}

function DataNotice({ children }: { children: React.ReactNode }) {
  return <p className="lulu-native-agent__notice" role="status"><CircleAlert size={14} /><span>{children}</span></p>;
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

function CommandSurface({ detail, source }: { detail?: OfficeEmployeeDetails; source: AgentSurfaceSource }) {
  const t = useTranslation();
  if (!detail) return <section className="lulu-native-agent__focus-card">
    <div><span className="lulu-native-agent__eyebrow">{t("WORKSPACE CONTEXT")}</span><h3>{t(source.name)}</h3><p>{t(source.purpose ?? "This specialist is available on demand. It has no persisted assignment or activity until the verified planner selects it.")}</p></div>
    <Status>{t("available on demand")}</Status>
  </section>;
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
      <div><span className="lulu-native-agent__eyebrow">{t("WORKLOAD")}</span><div className="lulu-native-agent__stat-stack"><strong>{formatNumber(detail.workSummary.active)}<small>{t("open work")}</small></strong><strong>{formatNumber(detail.workSummary.completedToday)}<small>{t("completed today")}</small></strong><strong>{formatNumber(detail.workSummary.failed)}<small>{t("failed")}</small></strong></div></div>
    </section>
  </div>;
}

function CrmSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [items, setItems] = useState<WorkspaceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void listWorkspaceRecords(workspaceId, "crm_companies", "limit=8", { includeTotal: true }).then((response) => { if (active) setItems(response.data.items); }).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Customer intelligence is unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [t, workspaceId]);
  const researching = items.filter((item) => ["queued", "researching"].includes(String(item.data.enrichment && typeof item.data.enrichment === "object" ? (item.data.enrichment as Record<string, unknown>).status : ""))).length;
  return <SurfaceState loading={loading} error={error} empty={!items.length ? t("No companies are available in the customer graph.") : undefined}><div className="lulu-native-agent__metrics"><Metric label="Companies" value={items.length} detail="loaded in this view" icon={<Building2 size={14} />} /><Metric label="Research" value={researching} detail="verified in progress" icon={<Sparkles size={14} />} /><Metric label="Fresh signal" value={items.filter((item) => item.status !== "ARCHIVED").length} detail="active company profiles" icon={<Radio size={14} />} /></div><section className="lulu-native-agent__list"><div className="lulu-native-agent__list-head"><span>{t("Company intelligence")}</span><small>{t("Canonical CRM records")}</small></div>{items.map((item) => { const enrichment = item.data.enrichment && typeof item.data.enrichment === "object" ? item.data.enrichment as Record<string, unknown> : {}; return <article key={item.id}><span className="lulu-native-agent__initial">{item.name.slice(0, 2).toUpperCase()}</span><div><strong>{item.name}</strong><small>{String(item.data.industry ?? t("Industry is being verified"))} · {String(item.data.city ?? item.data.country ?? t("Location pending"))}</small></div><span className="lulu-native-agent__progress"><i style={{ width: `${Math.min(100, Number(enrichment.completeness ?? 0))}%` }} /><small>{Number(enrichment.completeness ?? 0)}%</small></span><Status>{String(enrichment.status ?? item.status)}</Status></article>; })}</section></SurfaceState>;
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
  return <SurfaceState loading={loading} error={error} empty={!items.length ? t("No connected customer conversations are available.") : undefined}><div className="lulu-native-agent__conversation"><aside>{items.map((item) => <button type="button" className={selected?.id === item.id ? "is-selected" : ""} onClick={() => open(item)} key={item.id}><strong>{item.subject || t("New conversation")}</strong><span>{item.channelDisplayName || t("Connected channel")} · <Status>{item.handlingMode}</Status></span></button>)}</aside><section><header><div><span className="lulu-native-agent__eyebrow">{t("LIVE CONVERSATION")}</span><h3>{selected?.subject ?? t("Select a conversation")}</h3></div>{selected ? <Status>{selected.handlingMode}</Status> : null}</header><div className="lulu-native-agent__message-log">{selected ? messages.length ? messages.map((message) => <p key={message.id} className={message.direction === "INBOUND" ? "is-inbound" : ""}><small>{message.direction === "INBOUND" ? t("Customer") : message.direction === "INTERNAL" ? t("Internal note") : "Lulu"}</small>{message.textContent ?? t("Unsupported message content")}</p>) : <div className="lulu-native-agent__muted">{t("No messages are available for this conversation.")}</div> : <div className="lulu-native-agent__muted">{t("Choose a verified conversation to inspect its thread.")}</div>}</div></section></div></SurfaceState>;
}

function EmailSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [partial, setPartial] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setPartial(false);
    setAccounts([]);
    setThreads([]);
    setDrafts([]);
    void Promise.allSettled([
      emailApi.accounts(workspaceId),
      emailApi.threads(workspaceId, { limit: 8 }),
      emailApi.drafts(workspaceId),
    ]).then(([accountResult, threadResult, draftResult]) => {
      if (!active) return;
      if (accountResult.status === "fulfilled") setAccounts(accountResult.value.data.items);
      if (threadResult.status === "fulfilled") setThreads(threadResult.value.data.items);
      if (draftResult.status === "fulfilled") setDrafts(draftResult.value.data.items);
      const results = [accountResult, threadResult, draftResult];
      const rejected = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
      const allFailed = rejected.length === results.length;
      setPartial(rejected.length > 0 && !allFailed);
      if (allFailed) setError(getFriendlyErrorMessage(rejected[0].reason, t("Email operations are unavailable.")));
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [t, workspaceId]);
  const unread = threads.filter((thread) => thread.unread).length;
  return <SurfaceState loading={loading} error={error} empty={!accounts.length && !threads.length && !drafts.length ? t("No connected inbox is available for this workspace.") : undefined}><>{partial ? <DataNotice>{t("Verified records unavailable")}</DataNotice> : null}<div className="lulu-native-agent__metrics"><Metric label="Inboxes" value={accounts.length} detail="connected email accounts" icon={<Mail size={14} />} /><Metric label="Unread" value={unread} detail="visible inbox threads" icon={<CircleAlert size={14} />} /><Metric label="Drafts" value={drafts.length} detail="pending delivery review" icon={<FileText size={14} />} /></div><div className="lulu-native-agent__split-list"><section><div className="lulu-native-agent__list-head"><span>{t("Inbox priority")}</span><small>{threads.length} {t("recent threads")}</small></div>{threads.length ? threads.slice(0, 5).map((thread) => <article key={thread.id}><div><strong>{thread.subject || t("Untitled email")}</strong><small>{thread.accountEmail} · {formatTime(thread.latestAt)}</small></div><Status>{thread.unread ? "unread" : "read"}</Status></article>) : <p className="lulu-native-agent__empty-list">{t("No inbox threads are available yet.")}</p>}</section><section><div className="lulu-native-agent__list-head"><span>{t("Draft queue")}</span><small>{t("Canonical drafts")}</small></div>{drafts.length ? drafts.slice(0, 5).map((draft) => <article key={draft.id}><div><strong>{draft.subject || t("Untitled draft")}</strong><small>{draft.accountEmail ?? t("Connected inbox")} · {formatTime(draft.updatedAt)}</small></div><Status>{draft.status}</Status></article>) : <p className="lulu-native-agent__empty-list">{t("No draft email is awaiting review.")}</p>}</section></div></></SurfaceState>;
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
  return <SurfaceState loading={loading} error={error} empty={!accounts.length && !events.length ? t("No connected calendar is available for this workspace.") : undefined}><div className="lulu-native-agent__metrics"><Metric label="Calendars" value={summary.connectedAccounts} detail={`${summary.providers.length} ${t(summary.providers.length === 1 ? "provider connected" : "providers connected")}`} icon={<CalendarDays size={14} />} /><Metric label="Synced" value={summary.syncedAccounts} detail="calendar connections current" icon={<RefreshCw size={14} />} /><Metric label="Upcoming" value={summary.upcomingEvents} detail="scheduled customer interactions" icon={<CheckCircle2 size={14} />} /></div><div className="lulu-native-agent__split-list"><section><div className="lulu-native-agent__list-head"><span>{t("Upcoming schedule")}</span><small>{t("All connected calendars")}</small></div>{events.length ? events.slice(0, 5).map((event) => <article key={event.id}><div><strong>{event.title}</strong><small>{formatTime(event.startAt)}{calendarEventDetail(event, t) ? ` · ${calendarEventDetail(event, t)}` : ""}</small></div><Status>{event.status}</Status></article>) : <p className="lulu-native-agent__empty-list">{t("No upcoming calendar events are available.")}</p>}</section><section><div className="lulu-native-agent__list-head"><span>{t("Calendar connections")}</span><small>{t("Sync evidence")}</small></div>{accounts.length ? accounts.slice(0, 5).map((account) => <article key={account.id}><div><strong>{account.displayName ?? account.emailAddress ?? t("Connected calendar")}</strong><small>{account.provider} · {account.lastSyncAt ? `${t("synced")} ${formatTime(account.lastSyncAt)}` : t("sync pending")}</small></div><Status>{account.status}</Status></article>) : <p className="lulu-native-agent__empty-list">{t("No calendar connection is available.")}</p>}</section></div></SurfaceState>;
}

function CommerceSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [products, setProducts] = useState<Product[]>([]); const [orders, setOrders] = useState<CommerceOrder[]>([]); const [levels, setLevels] = useState<InventoryLevel[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [partial, setPartial] = useState(false);
  const [levelsAvailable, setLevelsAvailable] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setPartial(false);
    setLevelsAvailable(true);
    setProducts([]);
    setOrders([]);
    setLevels([]);
    void Promise.allSettled([
      productsApi.list(workspaceId, "limit=8"),
      commerceApi.listOrders(workspaceId, { limit: 8 }),
      commerceApi.listLevels(workspaceId, { limit: 8 }),
    ]).then(([productResult, orderResult, levelResult]) => {
      if (!active) return;
      if (productResult.status === "fulfilled") setProducts(productResult.value.data.items);
      if (orderResult.status === "fulfilled") setOrders(orderResult.value.data.items);
      if (levelResult.status === "fulfilled") setLevels(levelResult.value.data.items);
      const primaryResults = [productResult, orderResult];
      const primaryRejected = primaryResults.filter((result): result is PromiseRejectedResult => result.status === "rejected");
      const allPrimaryFailed = primaryRejected.length === primaryResults.length;
      setLevelsAvailable(levelResult.status === "fulfilled");
      setPartial((primaryRejected.length > 0 && !allPrimaryFailed) || levelResult.status === "rejected");
      if (allPrimaryFailed) setError(getFriendlyErrorMessage(primaryRejected[0].reason, t("Commerce data is unavailable.")));
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [t, workspaceId]);
  const atRisk = levels.filter((item) => Number(item.available) <= Number(item.reorderPoint)).length;
  return <SurfaceState loading={loading} error={error} empty={!products.length && !orders.length && !levels.length ? t("No commerce records are available yet.") : undefined}><>{partial ? <DataNotice>{t("Verified records unavailable")}</DataNotice> : null}<div className="lulu-native-agent__metrics"><Metric label="Products" value={products.length} detail="catalog records" icon={<Package size={14} />} /><Metric label="Orders" value={orders.length} detail="recent canonical orders" icon={<FileText size={14} />} /><Metric label="Stock attention" value={levelsAvailable ? atRisk : "—"} detail={levelsAvailable ? "at or below reorder point" : "Verified records unavailable"} icon={<Boxes size={14} />} /></div><div className="lulu-native-agent__split-list"><section><div className="lulu-native-agent__list-head"><span>{t("Product catalog")}</span><small>{products.length} {t("visible")}</small></div>{products.slice(0, 5).map((product) => <article key={product.id}><div><strong>{product.name}</strong><small>{product.sku || t("No SKU")} · {product.status}</small></div><Status>{product.completeness?.readyForPublishing ? "ready" : product.status}</Status></article>)}</section><section><div className="lulu-native-agent__list-head"><span>{t("Order flow")}</span><small>{orders.length} {t("visible")}</small></div>{orders.slice(0, 5).map((order) => <article key={order.id}><div><strong>{order.orderNumber}</strong><small>{order.lineCount ?? 0} {t("lines ·")} {order.currency} {order.grandTotal}</small></div><Status>{order.status}</Status></article>)}</section></div></></SurfaceState>;
}

function FinanceSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]); const [quotes, setQuotes] = useState<Quote[]>([]); const [payouts, setPayouts] = useState<PayoutsData | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [partial, setPartial] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setPartial(false);
    setInvoices([]);
    setQuotes([]);
    setPayouts(null);
    void Promise.allSettled([
      commercialDocumentsApi.listInvoices(workspaceId, "limit=8"),
      commercialDocumentsApi.listQuotes(workspaceId, "limit=8"),
      financeApi.listPayouts(workspaceId, 8),
    ]).then(([invoiceResult, quoteResult, payoutResult]) => {
      if (!active) return;
      if (invoiceResult.status === "fulfilled") setInvoices(invoiceResult.value.data.items);
      if (quoteResult.status === "fulfilled") setQuotes(quoteResult.value.data.items);
      if (payoutResult.status === "fulfilled") setPayouts(payoutResult.value.data);
      const primaryResults = [invoiceResult, quoteResult];
      const primaryRejected = primaryResults.filter((result): result is PromiseRejectedResult => result.status === "rejected");
      const allPrimaryFailed = primaryRejected.length === primaryResults.length;
      setPartial((primaryRejected.length > 0 && !allPrimaryFailed) || payoutResult.status === "rejected");
      if (allPrimaryFailed) setError(getFriendlyErrorMessage(primaryRejected[0].reason, t("Financial records are unavailable.")));
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [t, workspaceId]);
  const due = invoices.filter((item) => Number(item.amountDue) > 0).length;
  return <SurfaceState loading={loading} error={error} empty={!invoices.length && !quotes.length && !(payouts?.items.length) ? t("No financial documents are available yet.") : undefined}><>{partial ? <DataNotice>{t("Verified records unavailable")}</DataNotice> : null}<div className="lulu-native-agent__metrics"><Metric label="Invoices" value={invoices.length} detail={`${due} ${t("with outstanding balance")}`} icon={<FileText size={14} />} /><Metric label="Quotes" value={quotes.length} detail="commercial documents" icon={<WalletCards size={14} />} /><Metric label="Payouts" value={payouts?.items.length ?? "—"} detail={payouts ? "canonical payout records" : "Verified records unavailable"} icon={<Landmark size={14} />} /></div><div className="lulu-native-agent__split-list"><section><div className="lulu-native-agent__list-head"><span>{t("Invoice flow")}</span><small>{t("Verified amounts")}</small></div>{invoices.slice(0, 5).map((invoice) => <article key={invoice.id}><div><strong>{invoice.invoiceNumber}</strong><small>{invoice.currency} {invoice.amountDue} {t("due ·")} {invoice.dueDate ? formatTime(invoice.dueDate) : t("No due date")}</small></div><Status>{invoice.status}</Status></article>)}</section><section><div className="lulu-native-agent__list-head"><span>{t("Quote pipeline")}</span><small>{t("Canonical records")}</small></div>{quotes.slice(0, 5).map((quote) => <article key={quote.id}><div><strong>{quote.quoteNumber}</strong><small>{quote.currency} {quote.grandTotal ?? "—"} · {quote.creationMode}</small></div><Status>{quote.status}</Status></article>)}</section></div></></SurfaceState>;
}

function MarketingSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [content, setContent] = useState<SocialContent[]>([]); const [publications, setPublications] = useState<SocialPublicationJob[]>([]); const [ads, setAds] = useState<AdSpendOverview | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [partial, setPartial] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setPartial(false);
    setContent([]);
    setPublications([]);
    setAds(null);
    void Promise.allSettled([
      socialPublishingApi.listContent(workspaceId),
      socialPublishingApi.listPublications(workspaceId),
      adSpendApi.overview(workspaceId),
    ]).then(([contentResult, publicationResult, adSpendResult]) => {
      if (!active) return;
      if (contentResult.status === "fulfilled") setContent(contentResult.value.data.items);
      if (publicationResult.status === "fulfilled") setPublications(publicationResult.value.data.items);
      if (adSpendResult.status === "fulfilled") setAds(adSpendResult.value.data);
      const primaryResults = [contentResult, publicationResult];
      const primaryRejected = primaryResults.filter((result): result is PromiseRejectedResult => result.status === "rejected");
      const adSpendUnavailable = adSpendResult.status === "rejected";
      const allPrimaryFailed = primaryRejected.length === primaryResults.length;
      setPartial((primaryRejected.length > 0 && !allPrimaryFailed) || adSpendUnavailable);
      if (allPrimaryFailed) setError(getFriendlyErrorMessage(primaryRejected[0].reason, t("Marketing data is unavailable.")));
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [t, workspaceId]);
  return <SurfaceState loading={loading} error={error} empty={!content.length && !publications.length ? t("No verified marketing work is available yet.") : undefined}><>{partial ? <DataNotice>{t("Verified records unavailable")}</DataNotice> : null}<div className="lulu-native-agent__metrics"><Metric label="Content" value={content.length} detail="canonical social content" icon={<Sparkles size={14} />} /><Metric label="Publications" value={publications.length} detail="publication jobs" icon={<Radio size={14} />} /><Metric label="Ad balance" value={ads ? `${ads.wallet.availableAmount} ${ads.wallet.currency}` : "—"} detail={ads ? (ads.wallet.adsEnabled ? "funding available" : "ads not funded") : "Verified records unavailable"} icon={<WalletCards size={14} />} /></div><section className="lulu-native-agent__list"><div className="lulu-native-agent__list-head"><span>{t("Publication queue")}</span><small>{t("Real publication state")}</small></div>{publications.slice(0, 6).map((item) => <article key={item.id}><div><strong>{item.content?.message?.slice(0, 80) || t("Untitled publication")}</strong><small>{item.account?.displayName ?? t("Social account")} · {formatTime(item.scheduledAt ?? item.createdAt)}</small></div><Status>{item.status}</Status></article>)}</section></></SurfaceState>;
}

function WebsiteSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [sites, setSites] = useState<WebsiteSite[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void websitesApi.list(workspaceId).then((response) => active && setSites(response.data.items)).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Website data is unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [t, workspaceId]);
  return <SurfaceState loading={loading} error={error} empty={!sites.length ? t("No managed website is connected to this workspace.") : undefined}><div className="lulu-native-agent__metrics"><Metric label="Managed sites" value={sites.length} detail="owned by this workspace" icon={<Globe2 size={14} />} /><Metric label="Domains" value={sites.reduce((sum, site) => sum + site.domains.length, 0)} detail="domain records" icon={<Network size={14} />} /><Metric label="Live" value={sites.filter((site) => /active|published|live/i.test(site.status)).length} detail="verified site status" icon={<CheckCircle2 size={14} />} /></div><section className="lulu-native-agent__list">{sites.map((site) => <article key={site.id}><div><strong>{site.name}</strong><small>{site.domains.map((domain) => domain.hostname).join(" · ") || t("No domain assigned")}</small></div><Status>{site.status}</Status></article>)}</section></SurfaceState>;
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
    ? t("The Google Business connection needs reauthorization before review data can be read.")
    : !manager?.connected
      ? t("No connected Google Business review source is available for this workspace.")
      : undefined;
  return <SurfaceState loading={loading} error={error} empty={empty}>
    <div className="lulu-native-agent__metrics">
      <Metric label="Reviews" value={manager?.summary.totalReviews ?? 0} detail="loaded Google reviews" icon={<Star size={14} />} />
      <Metric label="Rating" value={manager?.summary.averageRating?.toFixed(1) ?? "—"} detail="average rating out of 5" icon={<Star size={14} />} />
      <Metric label="Reply rate" value={`${manager?.summary.replyRate ?? 0}%`} detail={`${manager?.summary.unansweredCount ?? 0} ${t("unanswered")}`} icon={<MessageCircle size={14} />} />
    </div>
    <section className="lulu-native-agent__list">
      <div className="lulu-native-agent__list-head"><span>{t("Priority review queue")}</span><small>{t("Connected Google Business data")}</small></div>
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
  const [partial, setPartial] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setPartial(false);
    setConnections([]);
    setReadiness(null);
    void Promise.allSettled([
      providerControlApi.connections(workspaceId),
      providerControlApi.launchReadiness(workspaceId),
    ]).then(([connectionResult, readinessResult]) => {
      if (!active) return;
      if (connectionResult.status === "fulfilled") setConnections(connectionResult.value.data.connections);
      if (readinessResult.status === "fulfilled") setReadiness(readinessResult.value.data);
      if (connectionResult.status === "rejected") setError(getFriendlyErrorMessage(connectionResult.reason, t("Integration readiness is unavailable.")));
      setPartial(readinessResult.status === "rejected" && connectionResult.status === "fulfilled");
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [t, workspaceId]);
  return <SurfaceState loading={loading} error={error} empty={!connections.length ? t("No provider connection is available for this workspace.") : undefined}><>{partial ? <DataNotice>{t("Verified records unavailable")}</DataNotice> : null}<div className="lulu-native-agent__metrics"><Metric label="Connections" value={connections.length} detail="provider control plane" icon={<Network size={14} />} /><Metric label="Ready" value={readiness?.readyCount ?? "—"} detail={readiness ? `${readiness.totalConnections} ${t("checked")}` : "Verified records unavailable"} icon={<CheckCircle2 size={14} />} /><Metric label="Readiness" value={readiness ? t(readiness.overallReady ? "ready" : "gated") : "—"} detail="launch evidence" icon={<ShieldCheck size={14} />} /></div><section className="lulu-native-agent__list">{connections.slice(0, 8).map((connection) => <article key={connection.id}><div><strong>{connection.displayName}</strong><small>{connection.providerKey} · {connection.lastVerifiedAt ? `${t("verified")} ${formatTime(connection.lastVerifiedAt)}` : t("verification pending")}</small></div><Status>{connection.healthStatus}</Status></article>)}</section></></SurfaceState>;
}

function IntelligenceSurface({ workspaceId }: { workspaceId: string }) {
  const t = useTranslation();
  const [overview, setOverview] = useState<ExecutiveOverview | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; setLoading(true); setError(""); void executiveApi.overview(workspaceId).then((response) => active && setOverview(response.data)).catch((cause) => active && setError(getFriendlyErrorMessage(cause, t("Executive intelligence is unavailable.")))).finally(() => active && setLoading(false)); return () => { active = false; }; }, [t, workspaceId]);
  const hasVisibleExecutiveEvidence = Boolean(
    overview && (overview.findings.length || overview.proposals.length || overview.forecasts.length || overview.scenarios.length || overview.learning.length),
  );
  const executiveItems = [
    ...(overview?.findings.map((finding) => ({ id: `finding:${finding.id}`, title: finding.title, detail: finding.description, status: finding.status })) ?? []),
    ...(overview?.proposals.map((proposal) => ({ id: `proposal:${proposal.id}`, title: proposal.title, detail: proposal.objective, status: proposal.status })) ?? []),
    ...(overview?.forecasts.map((forecast) => ({ id: `forecast:${forecast.id}`, title: forecast.metricName, detail: `${forecast.projectedBase} ${forecast.metricUnit} · ${forecast.metricDomain}`, status: forecast.status })) ?? []),
    ...(overview?.scenarios.map((scenario) => ({ id: `scenario:${scenario.id}`, title: scenario.name, detail: scenario.description, status: scenario.status })) ?? []),
    ...(overview?.learning.map((learning) => ({ id: `learning:${learning.id}`, title: learning.learningType, detail: learning.outcome, status: learning.verified ? "verified" : "pending" })) ?? []),
  ].slice(0, 6);
  return <SurfaceState loading={loading} error={error} empty={!hasVisibleExecutiveEvidence ? t("No executive intelligence is available yet.") : undefined}><div className="lulu-native-agent__metrics"><Metric label="Findings" value={overview?.summary.visibleFindingCount ?? 0} detail="visible operating signals" icon={<CircleAlert size={14} />} /><Metric label="Proposals" value={overview?.summary.visibleProposalCount ?? 0} detail="decision-ready items" icon={<Sparkles size={14} />} /><Metric label="Forecasts" value={overview?.summary.forecastCount ?? 0} detail="evidence-backed scenarios" icon={<BarChart3 size={14} />} /></div><section className="lulu-native-agent__list"><div className="lulu-native-agent__list-head"><span>{t("Executive signals")}</span><small>{t("Verified cycle evidence")}</small></div>{executiveItems.map((item) => <article key={item.id}><div><strong>{item.title}</strong><small>{item.detail}</small></div><Status>{item.status}</Status></article>)}</section></SurfaceState>;
}

export function AgentNativeWorkspace({ workspaceId, employeeDetail, catalogAgent }: Props) {
  const t = useTranslation();
  const source = useMemo<AgentSurfaceSource>(() => employeeDetail
    ? {
        key: employeeDetail.employee.key,
        name: employeeDetail.employee.name,
        capabilities: employeeDetail.capabilities.map((capability) => capability.key),
        module: employeeDetail.employee.department?.key,
        purpose: employeeDetail.employee.description ?? null,
      }
    : {
        key: catalogAgent?.pageId ?? catalogAgent?.id ?? "specialist",
        name: catalogAgent?.name ?? t("Digital employee"),
        capabilities: catalogAgent?.capabilities ?? [],
        module: catalogAgent?.module,
        pageId: catalogAgent?.pageId,
        purpose: catalogAgent?.purpose,
      }, [catalogAgent, employeeDetail, t]);
  const kind = useMemo(() => resolveKind(source), [source]);
  const definition = KINDS[kind];
  const Icon = definition.icon;
  const isCatalogPreview = Boolean(catalogAgent && !employeeDetail);
  return <section className="lulu-native-agent" aria-label={`${t(source.name)} ${t("native workspace")}`.trim()}>
    <header className="lulu-native-agent__header"><span className="lulu-native-agent__header-icon"><Icon size={17} /></span><div><span className="lulu-native-agent__eyebrow">{t(definition.label)}</span><h3>{t(source.name)}</h3><p>{t(definition.description)}</p></div><span className={`lulu-native-agent__live ${isCatalogPreview ? "is-preview" : "is-surface"}`}><i />{t(isCatalogPreview ? "Workspace context" : "Native workspace")}</span></header>
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
      {kind === "command" ? <CommandSurface detail={employeeDetail} source={source} /> : null}
    </div>
    <footer className="lulu-native-agent__footer"><ShieldCheck size={14} /><span>{t(isCatalogPreview ? "Shows verified workspace context. This specialist remains inactive until the planner assigns persisted work." : "Uses the same workspace-scoped APIs and permission checks as the full product surface.")}</span></footer>
  </section>;
}
