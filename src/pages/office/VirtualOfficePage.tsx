import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Bot, BriefcaseBusiness, Building2,
  CalendarClock, CheckCircle2, CircleDollarSign, Clock3, CloudOff, ExternalLink,
  FileText, Globe2, Hand, LoaderCircle, Mail, Megaphone, MessageSquare, Package,
  Pause, Play, RefreshCw, RotateCcw, Search, ShieldCheck, ShoppingBag, Sparkles,
  UserRound, UsersRound, WifiOff, X, XCircle,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../api/client";
import { useLuluApp } from "../../api/LuluAppContext";
import { commercialDocumentsApi, type Invoice, type Quote } from "../../api/commercial-documents";
import {
  officeApi,
  type OfficeControl,
  type OfficeEmployeeDetails,
  type OfficeEmployeeStatus,
  type OfficeEmployeeSummary,
  type OfficeOverview,
  type OfficeTimelineItem,
  type OfficeWorkItem,
  type OfficeWorkStatus,
} from "../../api/office";
import { useLanguage, useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import {
  buildWorkspaceDeepLink,
  resolveEmployeeWorkspaceRoute,
} from "../../config/workspace-capability-registry";
import { AuthenticatedWorkspaceTopBar } from "../../components/AuthenticatedWorkspaceTopBar";
import "./virtual-office.css";

const REFRESH_INTERVAL_MS = 15_000;

const departmentIcons: Readonly<Record<string, LucideIcon>> = {
  executive: ShieldCheck,
  "crm-sales": BriefcaseBusiness,
  communications: MessageSquare,
  marketing: Megaphone,
  "online-presence": Globe2,
  commerce: ShoppingBag,
  finance: CircleDollarSign,
  operations: CalendarClock,
  analytics: BarChart3,
};

const employeeIcons: Readonly<Record<string, LucideIcon>> = {
  "executive-orchestrator": Sparkles,
  "security-policy-auditor": ShieldCheck,
  "outcome-quality-auditor": CheckCircle2,
  "company-intelligence-specialist": Search,
  "crm-manager": BriefcaseBusiness,
  "follow-up-specialist": Clock3,
  "quote-specialist": FileText,
  "omnichannel-manager": MessageSquare,
  "customer-communication-specialist": UsersRound,
  "email-specialist": Mail,
  "calendar-coordinator": CalendarClock,
  "brand-content-strategist": Megaphone,
  "paid-acquisition-specialist": CircleDollarSign,
  "website-manager": Globe2,
  "pages-cms-manager": FileText,
  "reviews-reputation-manager": MessageSquare,
  "search-visibility-manager": Search,
  "product-manager": Package,
  "premium-media-producer": Sparkles,
  "category-manager": Package,
  "order-manager": ShoppingBag,
  "inventory-manager": Package,
  "fulfillment-manager": Package,
  "social-publishing-specialist": Megaphone,
  "invoice-manager": FileText,
  "billing-usage-manager": CircleDollarSign,
  "bookkeeping-manager": CircleDollarSign,
  "integration-manager": Activity,
  "business-intelligence-analyst": BarChart3,
};

const statusLabels: Record<OfficeEmployeeStatus, string> = {
  IDLE: "Idle",
  MONITORING: "Monitoring",
  WORKING: "Working",
  COLLABORATING: "Collaborating",
  WAITING: "Waiting",
  WAITING_FOR_APPROVAL: "Waiting for approval",
  HUMAN_CONTROLLED: "Human controlled",
  ERROR: "Needs attention",
  OFFLINE: "Offline",
};

const workStatusLabels: Record<OfficeWorkStatus, string> = {
  queued: "Queued",
  running: "Running",
  waiting: "Waiting",
  paused: "Paused",
  waiting_for_approval: "Waiting for approval",
  human_controlled: "Human controlled",
  failed: "Failed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const controlLabels: Record<OfficeControl, string> = {
  pause: "Pause",
  resume: "Resume",
  retry: "Retry",
  cancel: "Cancel",
  takeover: "Take over",
};

const controlIcons: Record<OfficeControl, LucideIcon> = {
  pause: Pause,
  resume: Play,
  retry: RotateCcw,
  cancel: XCircle,
  takeover: Hand,
};

function idempotencyKey(action: OfficeControl, workItemId: string) {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `office-ui:${action}:${workItemId}:${random}`;
}

function useOnlineStatus() {
  const [online, setOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine);
  useEffect(() => {
    const connected = () => setOnline(true);
    const disconnected = () => setOnline(false);
    window.addEventListener("online", connected);
    window.addEventListener("offline", disconnected);
    return () => {
      window.removeEventListener("online", connected);
      window.removeEventListener("offline", disconnected);
    };
  }, []);
  return online;
}

function useOfficeOverview(workspaceId: string | null) {
  const [snapshot, setSnapshot] = useState<{ workspaceId: string; overview: OfficeOverview } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [failure, setFailure] = useState<{ workspaceId: string; message: string } | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const overview = snapshot?.workspaceId === workspaceId ? snapshot.overview : null;
  const error = failure?.workspaceId === workspaceId ? failure.message : null;

  const load = useCallback(async (silent = false) => {
    if (silent && controllerRef.current) return;
    if (!workspaceId) {
      setSnapshot(null);
      setFailure(null);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await officeApi.overview(workspaceId, controller.signal);
      if (controller.signal.aborted) return;
      setSnapshot({ workspaceId, overview: response.data });
      setFailure(null);
    } catch (cause) {
      if (controller.signal.aborted) return;
      setFailure({
        workspaceId,
        message: getFriendlyErrorMessage(cause, "The Virtual Office could not load its verified operating state."),
      });
    } finally {
      if (controllerRef.current === controller) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [workspaceId]);

  useEffect(() => {
    void load(false);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine) void load(true);
    }, REFRESH_INTERVAL_MS);
    const refreshVisible = () => {
      if (document.visibilityState === "visible" && navigator.onLine) void load(true);
    };
    window.addEventListener("focus", refreshVisible);
    window.addEventListener("online", refreshVisible);
    document.addEventListener("visibilitychange", refreshVisible);
    return () => {
      controllerRef.current?.abort();
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshVisible);
      window.removeEventListener("online", refreshVisible);
      document.removeEventListener("visibilitychange", refreshVisible);
    };
  }, [load]);

  return {
    overview,
    loading: loading || Boolean(workspaceId && !overview && !error),
    refreshing,
    error,
    reload: () => load(Boolean(overview)),
  };
}

function EmployeeStatus({ status }: { status: OfficeEmployeeStatus }) {
  const t = useTranslation();
  return <span className={`lulu-office-status is-${status.toLowerCase().replaceAll("_", "-")}`}>
    <span aria-hidden="true" />{t(statusLabels[status])}
  </span>;
}

function WorkStatus({ status }: { status: OfficeWorkStatus }) {
  const t = useTranslation();
  return <span className={`lulu-office-work-status is-${status.replaceAll("_", "-")}`}>{t(workStatusLabels[status])}</span>;
}

function EmployeeCard({ employee, onOpen }: { employee: OfficeEmployeeSummary; onOpen: () => void }) {
  const t = useTranslation();
  const Icon = employeeIcons[employee.key] ?? UserRound;
  const trulyActive = employee.status === "WORKING" || employee.status === "COLLABORATING";
  return <button
    type="button"
    className={`lulu-office-employee is-${employee.status.toLowerCase().replaceAll("_", "-")}`}
    onClick={onOpen}
    aria-label={`${t("Open employee")}: ${employee.name}, ${t(statusLabels[employee.status])}`}
  >
    <span className="lulu-office-employee__station" aria-hidden="true">
      <span className="lulu-office-employee__monitor"><Activity size={13} /></span>
      <span className="lulu-office-employee__desk" />
      <span className="lulu-office-employee__avatar"><Icon size={16} /></span>
      {trulyActive && <span className="lulu-office-employee__signal" />}
    </span>
    <span className="lulu-office-employee__copy">
      <strong>{employee.name}</strong>
      <small>{employee.title}</small>
      <EmployeeStatus status={employee.status} />
      {employee.currentWorkItem && <span className="lulu-office-employee__task">{employee.currentWorkItem.title}</span>}
    </span>
  </button>;
}

function DepartmentZone({
  department,
  onOpenEmployee,
}: {
  department: OfficeOverview["departments"][number];
  onOpenEmployee: (employee: OfficeEmployeeSummary) => void;
}) {
  const t = useTranslation();
  const Icon = departmentIcons[department.key] ?? Building2;
  const working = department.employees.filter((employee) => employee.status === "WORKING" || employee.status === "COLLABORATING").length;
  const attention = department.employees.filter((employee) => employee.status === "ERROR" || employee.status === "WAITING_FOR_APPROVAL").length;
  return <section className="lulu-office-zone" data-department={department.key} aria-labelledby={`office-department-${department.id}`}>
    <header className="lulu-office-zone__header">
      <span className="lulu-office-zone__icon"><Icon aria-hidden="true" size={17} /></span>
      <span>
        <h2 id={`office-department-${department.id}`}>{department.name}</h2>
        <p>{department.description}</p>
      </span>
      <span className="lulu-office-zone__facts">
        <span>{department.employees.length} {t("employees")}</span>
        {working > 0 && <span>{working} {t("active")}</span>}
        {attention > 0 && <span className="is-attention">{attention} {t("attention")}</span>}
      </span>
    </header>
    <div className="lulu-office-zone__floor">
      {department.employees.map((employee) => <EmployeeCard key={employee.id} employee={employee} onOpen={() => onOpenEmployee(employee)} />)}
    </div>
  </section>;
}

function formatDateTime(value: string | null | undefined, language: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function simplifyWorkText(value: string | null | undefined, maxLength = 240) {
  if (!value) return "";
  const cleaned = value
    .replace(/\[[^\]]+\]\s*/g, "")
    .replace(/\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi, "")
    .replace(/\b(?:[A-Za-z][A-Za-z0-9/&-]*\s+){0,4}Agent:\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";
  const firstSentence = cleaned.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? cleaned;
  const readable = firstSentence.length >= 36 ? firstSentence : cleaned;
  return readable.length > maxLength ? `${readable.slice(0, maxLength - 1).trimEnd()}…` : readable;
}

function Timeline({
  items,
  language,
  currentUserCapabilities,
  onOpenEmployee,
  onOpenRecord,
}: {
  items: OfficeTimelineItem[];
  language: string;
  currentUserCapabilities: readonly string[];
  onOpenEmployee?: (id: string) => void;
  onOpenRecord: (item: OfficeTimelineItem) => void;
}) {
  const t = useTranslation();
  if (items.length === 0) return <div className="lulu-office-empty lulu-office-empty--compact">
    <CheckCircle2 aria-hidden="true" size={20} />
    <strong>{t("No verified activity yet")}</strong>
    <p>{t("Activity appears here only after Lulu records a real system event or work item.")}</p>
  </div>;
  return <ol className="lulu-office-timeline">
    {items.map((item) => <li key={`${item.source}:${item.id}`}>
      <span className={`lulu-office-timeline__marker is-${item.source}`} aria-hidden="true" />
      <div>
        <time dateTime={item.occurredAt}>{formatDateTime(item.occurredAt, language)}</time>
        <strong>{item.title}</strong>
        <p>
          {item.employeeName && (item.employeeId && onOpenEmployee
            ? <button type="button" onClick={() => onOpenEmployee(item.employeeId!)}>{item.employeeName}</button>
            : <span>{item.employeeName}</span>)}
          {item.statusTo && <span>{t("Status")}: {t(workStatusLabels[item.statusTo as OfficeWorkStatus] ?? item.statusTo)}</span>}
        </p>
      </div>
      {item.aggregateId && resolveEmployeeWorkspaceRoute({ relatedObjectType: item.aggregateType, currentUserCapabilities }) && <button type="button" className="lulu-office-icon-button" aria-label={t("Open related record")} onClick={() => onOpenRecord(item)}><ArrowRight aria-hidden="true" size={15} /></button>}
    </li>)}
  </ol>;
}

function WorkItemCard({
  item,
  employee,
  capabilities,
  currentUserCapabilities,
  canControl,
  busyAction,
  onControl,
  onOpenWorkspacePanel,
  onOpenWorkspace,
}: {
  item: OfficeWorkItem;
  employee: Pick<OfficeEmployeeSummary, "key" | "sourceAgentIds">;
  capabilities: readonly string[];
  currentUserCapabilities: readonly string[];
  canControl: boolean;
  busyAction: string | null;
  onControl: (item: OfficeWorkItem, action: OfficeControl) => void;
  onOpenWorkspacePanel: (item: OfficeWorkItem) => void;
  onOpenWorkspace: (item: OfficeWorkItem) => void;
}) {
  const t = useTranslation();
  const readableTitle = simplifyWorkText(item.title) || t("Work item");
  const readableObjective = simplifyWorkText(item.objective);
  const readableDescription = simplifyWorkText(item.description);
  const readableError = simplifyWorkText(item.errorMessage);
  const titleKey = readableTitle.toLowerCase();
  const showObjective = Boolean(readableObjective && readableObjective.toLowerCase() !== titleKey);
  const showDescription = Boolean(readableDescription
    && readableDescription.toLowerCase() !== titleKey
    && readableDescription.toLowerCase() !== readableObjective.toLowerCase());
  const route = resolveEmployeeWorkspaceRoute({
    employeeKey: employee.key,
    sourceAgentIds: employee.sourceAgentIds,
    capabilityKeys: capabilities,
    relatedObjectType: item.relatedObjectType,
    pageId: typeof item.context.pageId === "string" ? item.context.pageId : null,
    currentUserCapabilities,
  });
  return <article className="lulu-office-work-card">
    <div className="lulu-office-work-card__heading">
      <div>
        <strong>{readableTitle}</strong>
        {showObjective && <p>{readableObjective}</p>}
      </div>
      <WorkStatus status={item.status} />
    </div>
    {showDescription && <p className="lulu-office-work-card__description">{readableDescription}</p>}
    {readableError && <div className="lulu-office-work-card__error" role="alert"><AlertTriangle aria-hidden="true" size={15} /><span>{readableError}</span></div>}
    <div className="lulu-office-work-card__actions">
      {canControl && item.availableControls.map((action) => {
        const Icon = controlIcons[action];
        const actionKey = `${item.id}:${action}`;
        return <button key={action} type="button" disabled={Boolean(busyAction)} className={action === "cancel" ? "is-danger" : undefined} onClick={() => onControl(item, action)}>
          {busyAction === actionKey ? <LoaderCircle aria-hidden="true" size={14} className="lulu-office-spin" /> : <Icon aria-hidden="true" size={14} />}
          {t(controlLabels[action])}
        </button>;
      })}
      {route && <button type="button" onClick={() => onOpenWorkspacePanel(item)}><BriefcaseBusiness aria-hidden="true" size={14} />{t("Work here")}</button>}
      {route && <button type="button" onClick={() => onOpenWorkspace(item)}><ExternalLink aria-hidden="true" size={14} />{t("Open full Workspace")}</button>}
    </div>
  </article>;
}

type CommercialDocumentKind = "invoices" | "quotes";

function EmbeddedCommercialDocumentList({
  workspaceId,
  kind,
  onSelect,
}: {
  workspaceId: string;
  kind: CommercialDocumentKind;
  onSelect: (recordId: string) => void;
}) {
  const t = useTranslation();
  const language = useLanguage();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Array<Invoice | Quote>>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: "1", limit: "100" });
        if (query.trim()) params.set("search", query.trim());
        const response = kind === "invoices"
          ? await commercialDocumentsApi.listInvoices(workspaceId, params.toString())
          : await commercialDocumentsApi.listQuotes(workspaceId, params.toString());
        if (controller.signal.aborted) return;
        setItems(response.data.items);
        setTotal(response.data.pagination.total);
        setError(null);
      } catch (cause) {
        if (!controller.signal.aborted) setError(getFriendlyErrorMessage(cause, t("The document list could not be loaded.")));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [kind, query, t, workspaceId]);

  const formatMoney = (value: string | undefined, currency: string) => {
    const amount = Number(value ?? 0);
    return new Intl.NumberFormat(language, { style: "currency", currency, maximumFractionDigits: 2 }).format(Number.isFinite(amount) ? amount : 0);
  };
  const formatCreated = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(date);
  };

  return <section className="lulu-office-commercial-list" aria-label={kind === "invoices" ? t("Past invoices") : t("Past offers and quotes")}>
    <div className="lulu-office-commercial-list__heading">
      <div><span className="lulu-office-eyebrow">{t("Agent-managed documents")}</span><h3>{kind === "invoices" ? t("All invoices") : t("All offers and quotes")}</h3></div>
      <span>{total.toLocaleString(language)}</span>
    </div>
    <label className="lulu-office-commercial-list__search">
      <Search aria-hidden="true" size={15} />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search by document number or currency…")} />
    </label>
    {loading ? <div className="lulu-office-commercial-list__state"><LoaderCircle aria-hidden="true" size={17} className="lulu-office-spin" />{t("Loading documents…")}</div> : error ? <div className="lulu-office-error" role="alert"><AlertTriangle aria-hidden="true" size={16} /><span>{error}</span></div> : items.length === 0 ? <div className="lulu-office-commercial-list__state"><FileText aria-hidden="true" size={19} /><span>{query.trim() ? t("No matching documents found.") : t("No documents have been created yet.")}</span></div> : <div className="lulu-office-commercial-list__items">
      {items.map((item) => {
        const invoice = kind === "invoices" ? item as Invoice : null;
        const quote = kind === "quotes" ? item as Quote : null;
        const number = invoice?.invoiceNumber ?? quote?.quoteNumber ?? "—";
        const amount = invoice ? invoice.grandTotal : quote?.grandTotal;
        const status = invoice?.status ?? quote?.status ?? "—";
        return <button key={item.id} type="button" className="lulu-office-commercial-list__item" onClick={() => onSelect(item.id)}>
          <span className="lulu-office-commercial-list__item-main"><strong>{number}</strong><small>{formatCreated(item.createdAt)} · {status}</small></span>
          <span className="lulu-office-commercial-list__item-total">{formatMoney(amount, item.currency || "CNY")}<ArrowRight aria-hidden="true" size={14} /></span>
        </button>;
      })}
    </div>}
    {total > items.length && !loading ? <p className="lulu-office-commercial-list__hint">{t("Showing the first 100 documents. Use search to find older records.")}</p> : null}
  </section>;
}

function EmployeeWorkDrawer({
  workspaceId,
  employee,
  currentUserCapabilities,
  canControl,
  onClose,
  onChanged,
}: {
  workspaceId: string;
  employee: OfficeEmployeeSummary;
  currentUserCapabilities: readonly string[];
  canControl: boolean;
  onClose: () => void;
  onChanged: () => void;
}) {
  const t = useTranslation();
  const language = useLanguage();
  const navigate = useNavigate();
  const [details, setDetails] = useState<OfficeEmployeeDetails | null>(null);
  const [work, setWork] = useState<OfficeWorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ item: OfficeWorkItem; action: OfficeControl } | null>(null);
  const [panelMode, setPanelMode] = useState<"activity" | "workspace">("activity");
  const [workspaceActivated, setWorkspaceActivated] = useState(false);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceContext, setWorkspaceContext] = useState<{
    employeeId: string;
    relatedObjectType?: string | null;
    recordId?: string | null;
    pageId?: string | null;
  } | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLElement | null>(null);
  const confirmationDialogRef = useRef<HTMLDivElement | null>(null);
  const confirmationCancelRef = useRef<HTMLButtonElement | null>(null);
  const confirmationReturnFocusRef = useRef<HTMLElement | null>(null);
  const activeConfirmationRef = useRef(confirmation);
  const onCloseRef = useRef(onClose);

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => { activeConfirmationRef.current = confirmation; }, [confirmation]);
  useEffect(() => {
    if (!canControl || details?.canControl === false) setConfirmation(null);
  }, [canControl, details?.canControl]);

  const requestControllerRef = useRef<AbortController | null>(null);

  const load = useCallback(async (silent = false) => {
    if (silent && requestControllerRef.current) return;
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    if (!silent) setLoading(true);
    try {
      const [detailResult, workResult] = await Promise.all([
        officeApi.employee(workspaceId, employee.id, controller.signal),
        officeApi.employeeWork(workspaceId, employee.id, { limit: 50 }, controller.signal),
      ]);
      if (controller.signal.aborted) return;
      setDetails(detailResult.data);
      setWork(workResult.data.items);
      setError(null);
    } catch (cause) {
      if (!controller.signal.aborted) setError(getFriendlyErrorMessage(cause, "This employee's verified work state could not be loaded."));
    } finally {
      if (requestControllerRef.current === controller) {
        setLoading(false);
        requestControllerRef.current = null;
      }
    }
  }, [employee.id, workspaceId]);

  useEffect(() => {
    void load(false);
    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine) void load(true);
    }, REFRESH_INTERVAL_MS);
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const backgroundRegions = Array.from(document.querySelectorAll<HTMLElement>("main.lulu-office, [data-lulu-auth-topbar]"));
    const previousInert = backgroundRegions.map((element) => element.inert);
    backgroundRegions.forEach((element) => { element.inert = true; });
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (activeConfirmationRef.current) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], iframe, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hasAttribute("hidden") && element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      requestControllerRef.current?.abort();
      window.clearInterval(refreshTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      backgroundRegions.forEach((element, index) => { element.inert = previousInert[index] ?? false; });
      if (returnFocus?.isConnected) returnFocus.focus();
    };
  }, [load]);

  useEffect(() => {
    if (!confirmation) return;
    const returnFocus = confirmationReturnFocusRef.current;
    window.requestAnimationFrame(() => confirmationCancelRef.current?.focus());
    const onConfirmationKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        setConfirmation(null);
        return;
      }
      if (event.key !== "Tab" || !confirmationDialogRef.current) return;
      const focusable = Array.from(confirmationDialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        event.stopImmediatePropagation();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        event.stopImmediatePropagation();
        first.focus();
      }
    };
    window.addEventListener("keydown", onConfirmationKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onConfirmationKeyDown, true);
      if (returnFocus?.isConnected) window.requestAnimationFrame(() => { if (returnFocus.isConnected) returnFocus.focus(); });
    };
  }, [confirmation]);

  useEffect(() => {
    setPanelMode("activity");
    setWorkspaceActivated(false);
    setWorkspaceContext(null);
    setWorkspaceLoading(false);
  }, [employee.id]);

  const capabilityKeys = details?.capabilities.map((capability) => capability.key) ?? [];
  const activeWorkspaceContext = workspaceContext?.employeeId === employee.id ? workspaceContext : null;
  const panelRoute = details ? resolveEmployeeWorkspaceRoute({
    employeeKey: details.employee.key,
    sourceAgentIds: details.employee.sourceAgentIds,
    capabilityKeys,
    relatedObjectType: activeWorkspaceContext
      ? activeWorkspaceContext.relatedObjectType ?? null
      : details.currentWorkItem?.relatedObjectType,
    pageId: activeWorkspaceContext
      ? activeWorkspaceContext.pageId ?? null
      : typeof details.currentWorkItem?.context.pageId === "string" ? details.currentWorkItem.context.pageId : null,
    currentUserCapabilities,
  }) : null;
  const panelRecordId = activeWorkspaceContext
    ? activeWorkspaceContext.recordId ?? null
    : details?.currentWorkItem?.relatedObjectId;
  const panelWorkspaceUrl = panelRoute
    ? buildWorkspaceDeepLink(panelRoute.pageId, { recordId: panelRecordId, surface: "office-panel" })
    : null;
  const commercialDocumentKind: CommercialDocumentKind | null = panelRoute?.pageId === "breezy-soil-2475"
    ? "invoices"
    : panelRoute?.pageId === "tender-creek-3139"
      ? "quotes"
      : null;

  const selectPanelMode = (mode: "activity" | "workspace") => {
    if (mode === "workspace") {
      setWorkspaceActivated(true);
      setWorkspaceLoading(true);
    }
    setPanelMode(mode);
  };

  const openWorkspacePanel = (item?: Pick<OfficeWorkItem, "relatedObjectType" | "relatedObjectId" | "context">) => {
    setWorkspaceContext({
      employeeId: employee.id,
      relatedObjectType: item ? item.relatedObjectType : details?.currentWorkItem?.relatedObjectType,
      recordId: item ? item.relatedObjectId : details?.currentWorkItem?.relatedObjectId,
      pageId: item && typeof item.context.pageId === "string"
        ? item.context.pageId
        : typeof details?.currentWorkItem?.context.pageId === "string" ? details.currentWorkItem.context.pageId : null,
    });
    selectPanelMode("workspace");
  };

  const openWorkspace = (item?: OfficeWorkItem) => {
    const route = resolveEmployeeWorkspaceRoute({
      employeeKey: details?.employee.key ?? employee.key,
      sourceAgentIds: details?.employee.sourceAgentIds ?? employee.sourceAgentIds,
      capabilityKeys,
      relatedObjectType: item ? item.relatedObjectType : details?.currentWorkItem?.relatedObjectType,
      pageId: item && typeof item.context.pageId === "string"
        ? item.context.pageId
        : typeof details?.currentWorkItem?.context.pageId === "string" ? details.currentWorkItem.context.pageId : null,
      currentUserCapabilities,
    });
    if (!route) return;
    const recordId = item ? item.relatedObjectId : details?.currentWorkItem?.relatedObjectId;
    onClose();
    navigate(buildWorkspaceDeepLink(route.pageId, { recordId }));
  };

  const openCurrentWorkspace = () => {
    if (!panelRoute) return;
    onClose();
    navigate(buildWorkspaceDeepLink(panelRoute.pageId, { recordId: panelRecordId }));
  };

  const onWorkspaceFrameLoad = (event: SyntheticEvent<HTMLIFrameElement>) => {
    setWorkspaceLoading(false);
    try {
      event.currentTarget.contentDocument?.addEventListener("keydown", (keyboardEvent) => {
        if (keyboardEvent.key !== "Escape") return;
        keyboardEvent.preventDefault();
        if (activeConfirmationRef.current) setConfirmation(null);
        else onCloseRef.current();
      });
    } catch {
      // The canonical Office panel is same-origin. If a future route is not,
      // the browser's origin boundary safely prevents document access.
    }
  };

  const executeControl = async (item: OfficeWorkItem, action: OfficeControl) => {
    const key = `${item.id}:${action}`;
    setBusyAction(key);
    setError(null);
    try {
      const response = await officeApi.control(workspaceId, item.id, action, {
        expectedVersion: item.version,
        idempotencyKey: idempotencyKey(action, item.id),
        reason: "virtual_office_operator",
      });
      setWork((current) => current.map((candidate) => candidate.id === item.id ? response.data.item : candidate));
      setDetails((current) => current?.currentWorkItem?.id === item.id ? { ...current, currentWorkItem: response.data.item } : current);
      setConfirmation(null);
      onChanged();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "The work control could not be applied. Reload the employee and try again."));
    } finally {
      setBusyAction(null);
    }
  };

  const requestControl = (item: OfficeWorkItem, action: OfficeControl) => {
    if (action === "cancel" || action === "takeover") {
      confirmationReturnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setConfirmation({ item, action });
    }
    else void executeControl(item, action);
  };

  const Icon = employeeIcons[employee.key] ?? UserRound;
  const displayEmployee = details?.employee ?? employee;
  return <div className="lulu-office-drawer-layer" role="presentation" onMouseDown={(event) => {
    if (event.currentTarget !== event.target) return;
    if (confirmation) setConfirmation(null);
    else onClose();
  }}>
    <aside ref={drawerRef} className={`lulu-office-drawer${panelMode === "workspace" ? " is-workspace-mode" : ""}`} role="dialog" aria-modal="true" aria-labelledby="lulu-office-employee-title">
      <header className="lulu-office-drawer__header" inert={confirmation ? true : undefined}>
        <span className="lulu-office-drawer__avatar"><Icon aria-hidden="true" size={21} /></span>
        <div>
          <span className="lulu-office-eyebrow">{displayEmployee.department?.name ?? t("Digital employee")}</span>
          <h2 id="lulu-office-employee-title">{displayEmployee.name}</h2>
          <p>{displayEmployee.title}</p>
        </div>
        <button ref={closeButtonRef} type="button" className="lulu-office-icon-button" aria-label={t("Close employee panel")} onClick={onClose}><X aria-hidden="true" size={18} /></button>
      </header>
      <div className="lulu-office-drawer__tabs" role="tablist" aria-label={t("Employee panel view")} inert={confirmation ? true : undefined} onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const nextMode = panelMode === "activity" ? "workspace" : "activity";
        if (nextMode === "workspace" && (!details || !panelRoute)) return;
        selectPanelMode(nextMode);
        window.requestAnimationFrame(() => drawerRef.current?.querySelector<HTMLButtonElement>(`[data-office-panel-tab="${nextMode}"]`)?.focus());
      }}>
        <button data-office-panel-tab="activity" id="lulu-office-activity-tab" type="button" role="tab" tabIndex={panelMode === "activity" ? 0 : -1} aria-selected={panelMode === "activity"} aria-controls="lulu-office-activity-panel" className={panelMode === "activity" ? "is-active" : undefined} onClick={() => selectPanelMode("activity")}>
          <Activity aria-hidden="true" size={15} />{t("Activity")}
        </button>
        <button data-office-panel-tab="workspace" id="lulu-office-workspace-tab" type="button" role="tab" tabIndex={panelMode === "workspace" ? 0 : -1} aria-selected={panelMode === "workspace"} aria-controls="lulu-office-workspace-panel" className={panelMode === "workspace" ? "is-active" : undefined} disabled={!details || !panelRoute} onClick={() => selectPanelMode("workspace")}>
          <BriefcaseBusiness aria-hidden="true" size={15} />{t("Workspace")}
        </button>
      </div>
      <div id="lulu-office-activity-panel" className="lulu-office-drawer__body" role="tabpanel" aria-labelledby="lulu-office-activity-tab" hidden={panelMode !== "activity"} inert={confirmation ? true : undefined}>
        <section className="lulu-office-employee-summary">
          <div><span>{t("Status")}</span><EmployeeStatus status={displayEmployee.status} /></div>
          <div><span>{t("Active work")}</span><strong>{displayEmployee.workSummary.active}</strong></div>
          <div><span>{t("Completed today")}</span><strong>{displayEmployee.workSummary.completedToday}</strong></div>
          <div><span>{t("Failures")}</span><strong>{displayEmployee.workSummary.failed}</strong></div>
        </section>

        {displayEmployee.description && <p className="lulu-office-drawer__description">{displayEmployee.description}</p>}

        {loading && <div className="lulu-office-loading lulu-office-loading--drawer" role="status"><LoaderCircle aria-hidden="true" className="lulu-office-spin" /><span>{t("Loading verified work…")}</span></div>}
        {error && <div className="lulu-office-error" role="alert"><AlertTriangle aria-hidden="true" size={18} /><div><strong>{t("Work state unavailable")}</strong><p>{error}</p><button type="button" onClick={() => void load(false)}>{t("Try again")}</button></div></div>}

        {!loading && details && <>
          <section className="lulu-office-drawer__section">
            <div className="lulu-office-section-heading">
              <div><span className="lulu-office-eyebrow">{t("Authority")}</span><h3>{t("Real capabilities")}</h3></div>
              {panelRoute && <button type="button" onClick={() => openWorkspace()}><ExternalLink aria-hidden="true" size={14} />{t("Open in Workspace")}</button>}
            </div>
            <div className="lulu-office-capabilities">
              {details.capabilities.map((capability) => <span key={capability.key} title={capability.description}><b>{t(capability.accessMode)}</b>{capability.key}</span>)}
              {details.capabilities.length === 0 && <p>{t("No executable capability is assigned to this role.")}</p>}
            </div>
            {(displayEmployee.sourceAgentIds.length > 0 || displayEmployee.sourceModules.length > 0) && <div className="lulu-office-coordination">
              <span>{t("Coordinated systems")}</span>
              {[...displayEmployee.sourceAgentIds, ...displayEmployee.sourceModules].map((source) => <code key={source}>{source}</code>)}
            </div>}
          </section>

          <section className="lulu-office-drawer__section">
            <div className="lulu-office-section-heading"><div><span className="lulu-office-eyebrow">{t("Execution")}</span><h3>{t("What this employee is doing")}</h3></div><span>{work.length}</span></div>
            <div className="lulu-office-work-list">
              {work.map((item) => <WorkItemCard key={item.id} item={item} employee={displayEmployee} capabilities={capabilityKeys} currentUserCapabilities={currentUserCapabilities} canControl={canControl && details.canControl} busyAction={busyAction} onControl={requestControl} onOpenWorkspacePanel={openWorkspacePanel} onOpenWorkspace={openWorkspace} />)}
              {work.length === 0 && <div className="lulu-office-empty lulu-office-empty--compact"><Bot aria-hidden="true" size={20} /><strong>{t("No work yet")}</strong><p>{t("This employee will show work here when Lulu gives it a real task.")}</p></div>}
            </div>
          </section>

          <section className="lulu-office-drawer__section">
            <div className="lulu-office-section-heading"><div><span className="lulu-office-eyebrow">{t("Evidence")}</span><h3>{t("Employee timeline")}</h3></div></div>
            <Timeline items={details.recentTimeline} language={language} currentUserCapabilities={currentUserCapabilities} onOpenRecord={(item) => {
              const route = resolveEmployeeWorkspaceRoute({
                employeeKey: displayEmployee.key,
                sourceAgentIds: displayEmployee.sourceAgentIds,
                capabilityKeys,
                relatedObjectType: item.aggregateType,
                currentUserCapabilities,
              });
              if (route) {
                setWorkspaceContext({ employeeId: employee.id, relatedObjectType: item.aggregateType, recordId: item.aggregateId });
                selectPanelMode("workspace");
              }
            }} />
          </section>
        </>}
      </div>

      <div id="lulu-office-workspace-panel" className="lulu-office-drawer__workspace" role="tabpanel" aria-labelledby="lulu-office-workspace-tab" hidden={panelMode !== "workspace"} inert={confirmation ? true : undefined}>
        <div className="lulu-office-drawer__workspace-toolbar">
          <div>
            <span className="lulu-office-eyebrow">{t("Live Workspace")}</span>
            <strong>{panelRoute ? t(panelRoute.pageLabel) : t("Workspace unavailable")}</strong>
            {panelRecordId && <small>{t("Selected record")}: {panelRecordId}</small>}
          </div>
          <button type="button" disabled={!panelRoute} onClick={openCurrentWorkspace}><ExternalLink aria-hidden="true" size={14} />{t("Open full Workspace")}</button>
        </div>
        <div className="lulu-office-drawer__workspace-frame" aria-busy={workspaceLoading}>
          {commercialDocumentKind ? <EmbeddedCommercialDocumentList
            workspaceId={workspaceId}
            kind={commercialDocumentKind}
            onSelect={(recordId) => setWorkspaceContext({
              employeeId: employee.id,
              relatedObjectType: commercialDocumentKind === "invoices" ? "invoice" : "quote",
              recordId,
              pageId: panelRoute?.pageId,
            })}
          /> : workspaceActivated && panelWorkspaceUrl ? <>
            {workspaceLoading && <div className="lulu-office-drawer__workspace-loading" role="status"><LoaderCircle aria-hidden="true" className="lulu-office-spin" /><span>{t("Loading live Workspace…")}</span></div>}
            <iframe
              src={panelWorkspaceUrl}
              title={`${displayEmployee.name} — ${panelRoute?.pageLabel ?? t("Workspace")}`}
              referrerPolicy="same-origin"
              onLoad={onWorkspaceFrameLoad}
            />
          </> : <div className="lulu-office-empty"><BriefcaseBusiness aria-hidden="true" size={24} /><strong>{t("Workspace unavailable")}</strong><p>{t("This employee has no mapped Workspace capability yet.")}</p></div>}
        </div>
      </div>

      {canControl && details?.canControl && confirmation && <div className="lulu-office-confirm-layer">
        <div ref={confirmationDialogRef} className="lulu-office-confirm" role="alertdialog" aria-modal="true" aria-labelledby="lulu-office-confirm-title" aria-describedby="lulu-office-confirm-description">
          <strong id="lulu-office-confirm-title">{confirmation.action === "cancel" ? t("Cancel this work item?") : t("Take over this work item?")}</strong>
          <p id="lulu-office-confirm-description">{confirmation.action === "cancel"
            ? t("Lulu will stop this work item. Completed business actions are not reversed.")
            : t("Lulu will hand this work item to a human operator until it is resumed.")}</p>
          <div><button ref={confirmationCancelRef} type="button" onClick={() => setConfirmation(null)}>{t("Keep current state")}</button><button type="button" className={confirmation.action === "cancel" ? "is-danger" : "is-primary"} disabled={Boolean(busyAction)} onClick={() => void executeControl(confirmation.item, confirmation.action)}>{t(controlLabels[confirmation.action])}</button></div>
        </div>
      </div>}
    </aside>
  </div>;
}

function OverviewMetric({ icon: Icon, label, value, language, tone }: { icon: LucideIcon; label: string; value: number; language: string; tone?: string }) {
  return <article className={`lulu-office-metric${tone ? ` is-${tone}` : ""}`}>
    <span><Icon aria-hidden="true" size={17} /></span>
    <div><strong>{value.toLocaleString(language)}</strong><p>{label}</p></div>
  </article>;
}

export default function VirtualOfficePage() {
  const t = useTranslation();
  const language = useLanguage();
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const { selectedWorkspace, permissions } = useLuluApp();
  const canControlOffice = permissions.canEdit && permissions.capabilities.includes("agents.manage");
  const { overview, loading, refreshing, error, reload } = useOfficeOverview(selectedWorkspace?.id ?? null);
  const [selectedEmployee, setSelectedEmployee] = useState<OfficeEmployeeSummary | null>(null);

  const employeesById = useMemo(() => new Map(overview?.departments.flatMap((department) => department.employees).map((employee) => [employee.id, employee]) ?? []), [overview]);
  const openEmployeeById = (id: string) => {
    const employee = employeesById.get(id);
    if (employee) setSelectedEmployee(employee);
  };
  const openTimelineRecord = (item: OfficeTimelineItem) => {
    const route = resolveEmployeeWorkspaceRoute({ relatedObjectType: item.aggregateType, currentUserCapabilities: permissions.capabilities });
    if (route) navigate(buildWorkspaceDeepLink(route.pageId, { recordId: item.aggregateId }));
  };

  return <>
    <AuthenticatedWorkspaceTopBar navigationOpen={false} onToggleNavigation={() => undefined} onCloseNavigation={() => undefined} showNavigationToggle={false} />
    <main className="lulu-office" aria-labelledby="lulu-office-title">
      <div className="lulu-office__ambient" aria-hidden="true" />
      <header className="lulu-office-hero">
        <div>
          <span className="lulu-office-eyebrow"><span className="lulu-office-live-dot" aria-hidden="true" />{t("Autonomous company operations")}</span>
          <h1 id="lulu-office-title">{t("Virtual Office")}</h1>
          <p>{t("A live, evidence-backed view of what Lulu is doing for your company.")}</p>
        </div>
        <div className="lulu-office-hero__status">
          {!online && <span className="is-offline"><WifiOff aria-hidden="true" size={15} />{t("Offline — showing last verified state")}</span>}
          {online && overview && <span><ShieldCheck aria-hidden="true" size={15} />{t("Verified backend state")} · {formatDateTime(overview.generatedAt, language)}</span>}
          <button type="button" onClick={() => void reload()} disabled={refreshing || !online}><RefreshCw aria-hidden="true" size={15} className={refreshing ? "lulu-office-spin" : undefined} />{t("Refresh")}</button>
        </div>
      </header>

      {loading && !overview && <div className="lulu-office-loading" role="status"><LoaderCircle aria-hidden="true" className="lulu-office-spin" /><strong>{t("Opening the verified company state…")}</strong><p>{t("Lulu is loading real employees, work items, and events.")}</p></div>}

      {error && !overview && <div className="lulu-office-error lulu-office-error--page" role="alert">
        {online ? <AlertTriangle aria-hidden="true" size={22} /> : <CloudOff aria-hidden="true" size={22} />}
        <div><strong>{t("Virtual Office unavailable")}</strong><p>{error}</p><button type="button" onClick={() => void reload()} disabled={!online}>{t("Try again")}</button></div>
      </div>}

      {overview && <>
        {error && <div className="lulu-office-stale" role="status"><AlertTriangle aria-hidden="true" size={15} /><span>{t("Live refresh failed. The last verified state remains visible.")}</span></div>}
        <section className="lulu-office-metrics" aria-label={t("Company operating summary")}>
          <OverviewMetric icon={Activity} label={t("Active work items")} value={overview.summary.activeWorkItems} language={language} />
          <OverviewMetric icon={UsersRound} label={t("Employees working now")} value={overview.summary.workingEmployees} language={language} tone="active" />
          <OverviewMetric icon={CheckCircle2} label={t("Completed today")} value={overview.summary.completedToday} language={language} tone="success" />
          <OverviewMetric icon={AlertTriangle} label={t("Needs attention")} value={overview.summary.attentionEmployees} language={language} tone={overview.summary.attentionEmployees > 0 ? "attention" : undefined} />
        </section>

        <div className="lulu-office-layout">
          <section className="lulu-office-company" aria-labelledby="lulu-office-company-title">
            <div className="lulu-office-section-heading lulu-office-section-heading--main">
              <div><span className="lulu-office-eyebrow">{selectedWorkspace?.companyName ?? t("Company")}</span><h2 id="lulu-office-company-title">{t("Your digital organization")}</h2><p>{t("Every visible state below is projected from persisted Lulu work.")}</p></div>
              <span>{overview.summary.employeeCount} {t("digital employees")} · {overview.summary.departmentCount} {t("departments")}</span>
            </div>
            <div className="lulu-office-blueprint">
              {overview.departments.map((department) => <DepartmentZone key={department.id} department={department} onOpenEmployee={setSelectedEmployee} />)}
              {overview.departments.length === 0 && <div className="lulu-office-empty"><Building2 aria-hidden="true" size={26} /><strong>{t("No digital organization available")}</strong><p>{t("The backend has not provisioned a real office roster for this workspace yet.")}</p></div>}
            </div>
          </section>

          <aside className="lulu-office-activity" aria-labelledby="lulu-office-activity-title">
            <div className="lulu-office-section-heading">
              <div><span className="lulu-office-eyebrow">{t("Verified timeline")}</span><h2 id="lulu-office-activity-title">{t("What Lulu did today")}</h2></div>
              <Activity aria-hidden="true" size={18} />
            </div>
            <Timeline items={overview.timeline} language={language} currentUserCapabilities={permissions.capabilities} onOpenEmployee={openEmployeeById} onOpenRecord={openTimelineRecord} />
          </aside>
        </div>
      </>}
    </main>
    {selectedWorkspace && selectedEmployee && <EmployeeWorkDrawer workspaceId={selectedWorkspace.id} employee={selectedEmployee} currentUserCapabilities={permissions.capabilities} canControl={canControlOffice} onClose={() => setSelectedEmployee(null)} onChanged={() => void reload()} />}
  </>;
}
