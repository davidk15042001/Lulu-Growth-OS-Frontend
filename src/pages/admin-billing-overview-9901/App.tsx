import React, { useEffect, useMemo, useState } from "react";
import { ApiError, getFriendlyErrorMessage, getTechnicalErrorDetails, requestApi, requestApiBlob } from "../../api/client";
import { setAdminSurface, setStoredUser } from "../../api/session";
import { useLuluApp } from '../../api/LuluAppContext';
import { DEFAULT_LANGUAGE, isAvailableLanguageCode, LANGUAGE_STORAGE_KEY } from "../../i18n/languages";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import { routes } from "../../routing";
import SupportInbox from '../support/SupportPage';
import AdminOmniChannelPage from '../admin-omnichannel/AdminOmniChannelPage';
import {
  LayoutDashboard, Users, Building2, Contact2, CreditCard, Globe, Bot,
  Plug, KeyRound, CheckSquare2, AlertTriangle, Shield, Clock, FileArchive, Headphones,
  Settings as SettingsIcon, Search, ShieldCheck, ChevronRight,
  Lock, Unlock, UserCheck, RotateCcw, Ban, PlayCircle, Save, Filter, Trash2,
  LayoutGrid, MessageSquare, Menu, X, LogIn, ExternalLink, Unplug, LoaderCircle
} from "lucide-react";

type NavSection = { label: string; items: NavItem[] };
type NavItem = { key: PageKey; label: string; icon: React.ReactElement; badge?: string };
type PageKey =
  | "dashboard" | "users" | "workspaces" | "crm" | "billing" | "websites"
  | "agents" | "integrations" | "oauth-connections" | "approvals" | "conversations" | "files"
  | "support" | "errors" | "audit" | "jobs" | "settings";

const NAV: NavSection[] = [
  {
    label: "Overview",
    items: [
      { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
      { key: "billing", label: "Billing Overview", icon: <CreditCard size={16} /> },
    ],
  },
  {
    label: "Customers & CRM",
    items: [
      { key: "users", label: "Users", icon: <Users size={16} /> },
      { key: "workspaces", label: "Workspaces / Companies", icon: <Building2 size={16} /> },
      { key: "crm", label: "CRM Records", icon: <Contact2 size={16} /> },
    ],
  },
  {
    label: "Platform",
    items: [
      { key: "websites", label: "Websites & Shops", icon: <Globe size={16} /> },
      { key: "agents", label: "AI Agents", icon: <Bot size={16} /> },
      { key: "integrations", label: "Integrations", icon: <Plug size={16} /> },
      { key: "oauth-connections", label: "OAuth Connections", icon: <KeyRound size={16} /> },
      { key: "approvals", label: "Approvals", icon: <CheckSquare2 size={16} /> },
      { key: "conversations", label: "Inbox / Conversations", icon: <MessageSquare size={16} /> },
      { key: "files", label: "Files & Storage", icon: <FileArchive size={16} /> },
      { key: "support", label: "Support Tickets", icon: <Headphones size={16} /> },
    ],
  },
  {
    label: "Operations",
    items: [
      { key: "errors", label: "Error Center", icon: <AlertTriangle size={16} />, badge: "new" },
      { key: "audit", label: "Audit Logs", icon: <Shield size={16} /> },
      { key: "jobs", label: "Background Jobs", icon: <Clock size={16} /> },
      { key: "settings", label: "System Settings", icon: <SettingsIcon size={16} /> },
    ],
  },
];

type Plan = "explorer" | "starter" | "ai" | "test";
type Customer = {
  id: string; firstName: string | null; lastName: string | null; email: string;
  companyName: string; planKey: Plan; subscriptionStatus: string;
  customPriceMinor: string | number | null; customPriceCurrency: string | null;
  startDate: string | null; expiryDate: string | null;
  apiCostMinor: string; storageCostMinor: string; storageBytes: string;
  apiCostUsd: string; serverCostUsd: string;
};
type Overview = { month: string; periodStart: string; periodEnd: string; customers: Customer[] };

type UserRow = {
  id: string; email: string; firstName: string | null; lastName: string | null;
  role: string; verifiedAt: string | null; createdAt: string; updatedAt: string;
  tokenVersion: number; workspaceCount: number; activeSessions: number;
};
type UserDetail = UserRow & {
  workspaces: Array<{ id: string; companyName: string; role: string; onboardingStep: string; onboardingCompletedAt: string | null; joinedAt: string }>;
  sessions: Array<{ id: string; userAgent: string | null; ipAddress: string | null; createdAt: string; lastUsedAt: string | null; expiresAt: string; revoked: boolean }>;
  usage: Array<{ metricKey: string; total: string; periodStart: string | null; periodEnd: string | null }>;
  creditBalance: number;
};
type DeleteUserResult = {
  userId: string;
  previousEmail: string;
  deletedWorkspaceCount: number;
  deletedIntegrationCount: number;
  deletedMembershipCount: number;
  deletedSharedWorkspaceDataCount: number;
  deletedWorkspaceNames: string[];
};
type UserDeletionJob = {
  id: string;
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  targetUserId: string;
  targetEmail: string | null;
  attempts: number;
  errorMessage: string | null;
  result: DeleteUserResult | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
};
type SessionUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "user" | "admin";
  impersonation?: { active: boolean; adminEmail: string | null };
};

type WorkspaceRow = {
  id: string; companyName: string; slug: string | null; industry: string | null; companySize: string | null;
  countryRegion: string | null; onboardingStep: string; onboardingCompletedAt: string | null;
  filesPurgedAt: string | null; createdAt: string; updatedAt: string;
  planKey: Plan; subscriptionStatus: string; memberCount: number; ownerEmail: string | null;
};
type WorkspaceDetail = WorkspaceRow & {
  businessDescription: string | null; valueProposition: string | null; targetMarket: string | null;
  shortBrandDescription: string | null; positioningTags: string[] | null;
  legalForm: string | null; foundingYear: number | null; employeeCount: number | null; annualRevenueRange: string | null;
  businessModelType: string | null; companyStage: string | null; salesModel: string | null; salesCycleDays: number | null;
  primaryIcp: string | null; usp: string | null; mission: string | null; vision: string | null;
  primaryChallenges: string[] | null; languages: string[] | null; regulatedIndustries: string[] | null;
  fileReuploadRequired: boolean; trialEndsAt: string | null; periodStartsAt: string | null; periodEndsAt: string | null; seats: number | null;
  customPriceMinor: number | null; customPriceCurrency: string | null; customPriceReason: string | null; customPriceSetBy: string | null; customPriceSetAt: string | null;
  members: Array<{ id: string; email: string; firstName: string | null; lastName: string | null; role: string; joinedAt: string | null }>;
  crmByType: Array<{ resourceType: string; count: number }>;
  websites: Array<{ id: string; title: string; platform: string; status: string; domain: string | null; publishedAt: string | null; createdAt: string }>;
  usage: Array<{ metricKey: string; total: string; periodStart: string | null; periodEnd: string | null }>;
  creditBalance: number;
  paygUsage: {
    periodStart: string;
    periodEnd: string;
    apiCostUsd: number;
    serverCostUsd: number;
    apiCreditUsd: number;
    serverCreditUsd: number;
    storageCreditUsd: number;
    apiBillableUsd: number;
    serverBillableUsd: number;
    totalBillableUsd: number;
  } | null;
  usageAdjustments: Array<{
    id: string;
    metric: "api" | "server" | "storage";
    amountUsd: string;
    periodStart: string;
    periodEnd: string;
    paygPeriodId: string | null;
    appliedAt: string | null;
    reason: string;
    createdBy: string | null;
    createdByEmail: string | null;
    createdAt: string;
  }>;
};

type CrmRow = {
  id: string; workspaceId: string; workspaceName: string; resourceType: string; parentId: string | null;
  name: string; description: string | null; status: string; stage: string | null;
  valueAmount: string | null; currency: string | null;
  startsAt: string | null; endsAt: string | null; dueAt: string | null;
  assigneeId: string | null; assigneeEmail: string | null; source: string | null;
  tags: string[] | null; version: number; createdAt: string; updatedAt: string;
};
type WebsiteRow = {
  id: string; workspaceId: string; workspaceName: string; title: string; platform: string; status: string;
  domain: string | null; templateId: string | null; version: number;
  lastSyncedAt: string | null; publishedAt: string | null; lastGeneratedAt: string | null;
  createdAt: string; updatedAt: string;
};
type AgentRow = {
  id: string; workspaceId: string; workspaceName: string | null;
  name: string; agentType: string; mode: string; status: string; version: number;
  modelProvider: string | null; modelName: string | null;
  createdAt: string; updatedAt: string; runCount: number;
};
type IntegrationRow = {
  id: string; workspaceId: string; workspaceName: string | null;
  provider: string; status: string; scopes: string[] | null;
  connectedAt: string; expiresAt: string | null; lastSyncedAt: string | null;
  lastError: string | null; syncCount: number;
};
type OAuthConnectionRow = {
  id: string; connectionType: "admin" | "platform" | "email" | "calendar"; provider: string;
  displayName: string; workspaceId: string | null; workspaceName: string | null;
  management: "workspace" | "lulu_managed";
  sourceStatus: string; status: string; hasCredentials: boolean;
  accountIdentifier: string | null; scopes: string[] | null;
  tokenExpiresAt: string | null; lastSyncedAt: string | null; lastError: string | null;
  connectedAt: string; updatedAt: string;
};
type OAuthSelfServiceWorkspace = {
  workspaceId: string; workspaceName: string; ownerEmail: string | null;
  allowedProviders: string[];
};
type ApprovalRow = {
  id: string; workspaceId: string; workspaceName: string | null;
  approvalType: string; status: string; reason: string | null;
  requesterEmail: string | null; createdAt: string; resolvedAt: string | null;
};
type ConversationRow = {
  id: string; workspaceId: string; workspaceName: string | null;
  channel: string; subject: string | null; status: string; priority: string;
  externalId: string | null; lastMessageAt: string | null; messageCount: number;
  createdAt: string; updatedAt: string;
};
type FileRow = {
  id: string; workspaceId: string; workspaceName: string | null;
  uploadedById: string | null; uploadedByEmail: string | null;
  fileName: string; mimeType: string | null; fileSizeBytes: number;
  storageKey: string; source: string | null;
  uploadedAt: string; lastAccessedAt: string | null;
  purgeScheduledAt: string | null; purgedAt: string | null;
};
type SupportRow = {
  id: string; workspaceId: string; workspaceName: string | null;
  subject: string; status: string; priority: string; category: string | null;
  requesterEmail: string | null; assigneeId: string | null;
  slaDueAt: string | null; createdAt: string; updatedAt: string; closedAt: string | null;
};
type ErrorRow = {
  id: string; workspaceId: string | null; userId: string | null;
  level: string; message: string; source: string | null; status: string;
  requestId: string | null; correlationId: string | null;
  createdAt: string; resolvedAt: string | null; occurrenceCount: number;
};
type AuditRow = {
  id: string; actorId: string | null; actorType: string; action: string;
  resourceType: string; resourceId: string | null; workspaceId: string | null;
  result: string; reason: string | null;
  ipAddress: string | null; userAgent: string | null; createdAt: string;
};
type JobRow = {
  id: string; jobType: string; status: string; workspaceId: string | null;
  attempt: number; maxAttempts: number;
  scheduledAt: string | null; startedAt: string | null; completedAt: string | null; failedAt: string | null;
  errorMessage: string | null; correlationId: string | null; createdAt: string;
};
type SettingRow = { key: string; value: string; updatedAt: string; updatedBy: string | null };

type DashboardStats = {
  users: { total: number; verified: number; admins: number; newLast30d: number };
  workspaces: { total: number; onboarded: number; filesPurged: number; newLast30d: number };
  subscriptions: { total: number; active: number; trialing: number; canceled: number; aiPlan: number; starterPlan: number; explorerPlan: number; testPlan: number };
  crmByType: Array<{ resourceType: string; count: number }>;
  websites: { total: number; published: number; wordpress: number; shopify: number; webflow: number; woocommerce: number };
  notifications: { totalLast24h: number; errorsLast24h: number; warningsLast24h: number };
};

const money = (minor: string | number | null) => `${(Number(minor || 0) / 100).toFixed(2)} CNY`;
const moneyUsd = (amount: string | number | null) => {
  const value = Number(amount ?? 0);
  return `$${Number.isFinite(value) ? value.toFixed(2) : "0.00"} USD`;
};
const DATE_LOCALE_BY_LANGUAGE = {
  en: "en-US",
  de: "de-DE",
  "zh-CN": "zh-CN",
} as const;

function mapDateLocale(language: string | null) {
  if (language === "de") return DATE_LOCALE_BY_LANGUAGE.de;
  if (language === "zh-CN") return DATE_LOCALE_BY_LANGUAGE["zh-CN"];
  return DATE_LOCALE_BY_LANGUAGE.en;
}

function currentDateLocale() {
  if (typeof window === "undefined") return mapDateLocale(DEFAULT_LANGUAGE);
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isAvailableLanguageCode(stored)) return mapDateLocale(stored);
    const documentLanguage = document.documentElement.lang || null;
    if (isAvailableLanguageCode(documentLanguage)) return mapDateLocale(documentLanguage);
  } catch {
    /* Browser storage may be unavailable. */
  }
  return mapDateLocale(DEFAULT_LANGUAGE);
}

const date = (value: string | null | undefined) =>
  value ? new Intl.DateTimeFormat(currentDateLocale(), { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
const dateOnly = (value: string | null | undefined) =>
  value ? new Intl.DateTimeFormat(currentDateLocale(), { dateStyle: "medium" }).format(new Date(value)) : "—";
const monthNow = () => new Date().toISOString().slice(0, 7);
const sizeMB = (bytes: string | number | null) => `${(Number(bytes || 0) / 1024 / 1024).toFixed(2)} MB`;
const moneyCny = (minor: string | number | null | undefined) => new Intl.NumberFormat(currentDateLocale(), { style: "currency", currency: "CNY", maximumFractionDigits: 2 }).format(Number(minor ?? 0) / 100);
const nameOf = (first: string | null, last: string | null, fallback = "") => {
  const parts = [first, last].filter(Boolean);
  return parts.length ? parts.join(" ") : fallback;
};

function KPI({ label, value, hint, accent = "slate" }: { label: string; value: React.ReactNode; hint?: string; accent?: "slate" | "emerald" | "amber" | "rose" | "sky" | "violet" }) {
  const color = {
    slate: "border-slate-200 bg-white",
    emerald: "border-emerald-100 bg-emerald-50/40",
    amber: "border-amber-100 bg-amber-50/40",
    rose: "border-rose-100 bg-rose-50/40",
    sky: "border-sky-100 bg-sky-50/40",
    violet: "border-violet-100 bg-violet-50/40",
  }[accent];
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${color}`}>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

function Pill({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "emerald" | "amber" | "rose" | "sky" | "violet" | "gray" }) {
  const map: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-100 text-rose-800",
    sky: "bg-sky-100 text-sky-800",
    violet: "bg-violet-100 text-violet-800",
    gray: "bg-gray-100 text-gray-700",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[tone] ?? map.slate}`}>{children}</span>;
}

function toneFromStatus(status: string): "emerald" | "amber" | "rose" | "slate" | "sky" | "violet" {
  const s = String(status).toLowerCase();
  if (/active|verified|published|paid|completed|success|resolved|sent|connected/.test(s)) return "emerald";
  if (/trialing|pending|waiting|queued|new|in_progress|in progress|paused|draft/.test(s)) return "amber";
  if (/error|failed|canceled|cancelled|rejected|revoked|locked|deleted|warning|critical/.test(s)) return "rose";
  if (/inactive|unverified|suspended/.test(s)) return "slate";
  return "sky";
}

function DataTable<T>({ columns, rows, loading, searchOnChange, searchValue, getRowKey, onRowClick, selectedKey }: {
  columns: Array<{ key: string; label: string; render?: (row: T) => React.ReactNode; className?: string }>;
  rows: T[];
  loading?: boolean;
  searchOnChange?: (v: string) => void;
  searchValue?: string;
  getRowKey?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  selectedKey?: string | null;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {searchOnChange !== undefined ? (
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Search…"
              value={searchValue ?? ""}
              onChange={(e) => searchOnChange(e.target.value)}
            />
          </div>
          {!rows.length && !loading ? <span className="text-sm text-slate-500">No entries</span> : null}
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50/70 text-slate-600">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`whitespace-nowrap px-4 py-2.5 text-left font-medium ${col.className ?? ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">No data available.</td></tr>
            ) : rows.map((row, idx) => {
              const rowKey = getRowKey ? getRowKey(row, idx) : `row-${idx}`;
              const active = selectedKey !== null && selectedKey !== undefined && rowKey === selectedKey;
              return (
              <tr
                key={rowKey}
                className={`${onRowClick ? "cursor-pointer" : ""} ${active ? "bg-indigo-50/70" : "hover:bg-slate-50/60"}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`whitespace-nowrap px-4 py-2.5 text-slate-700 ${col.className ?? ""}`}>
                    {col.render ? col.render(row) : (row as unknown as Record<string, React.ReactNode>)[col.key]}
                  </td>
                ))}
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyPanel({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 p-8 text-center">
      <div className="text-base font-semibold text-slate-800">{title}</div>
      {hint ? <div className="mt-1 text-sm text-slate-500">{hint}</div> : null}
    </div>
  );
}

function DetailPanel({ title, rows, raw }: { title: string; rows: Array<{ label: string; value: React.ReactNode }>; raw: unknown }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="text-base font-semibold">{title}</div>
        <div className="text-sm text-slate-500">Direkter Drilldown mit den wichtigsten Metadaten.</div>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4 px-5 py-3">
            <div className="text-sm text-slate-500">{row.label}</div>
            <div className="max-w-[70%] text-right text-sm font-medium text-slate-900 break-all">{row.value}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 px-5 py-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Raw payload</div>
        <pre className="max-h-[420px] overflow-auto rounded-lg bg-slate-950 px-4 py-3 text-xs text-slate-100">
          {JSON.stringify(raw, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function App() {
  const { currentUser } = useLuluApp();
  const capabilities = currentUser?.adminCapabilities ?? [];
  const required: Record<PageKey,string[]> = {
    dashboard:['users.read','workspaces.read','billing.read','providers.read','agents.read','security.read'],
    users:['users.read'], workspaces:['workspaces.read'], billing:['billing.read'], crm:['workspaces.read'],
    websites:['providers.read'], agents:['agents.read'], integrations:['providers.read'], approvals:['agents.read'],
    'oauth-connections':['providers.read'],
    conversations:['users.read','workspaces.read'], files:['workspaces.read'], support:['users.read','workspaces.read'],
    errors:['security.read'],audit:['audit.read'],jobs:['agents.read','providers.read'],settings:['security.read'],
  };
  const visibleNav = NAV.map(section => ({...section,items:section.items.filter(item => required[item.key].every(capability => capabilities.includes(capability)))})).filter(section => section.items.length);
  const [selectedPage, setPage] = useState<PageKey>(() => {
    const requested = new URLSearchParams(window.location.search).get('page');
    return requested && NAV.some((section) => section.items.some((item) => item.key === requested)) ? requested as PageKey : 'dashboard';
  });
  const page = required[selectedPage].every(capability => capabilities.includes(capability)) ? selectedPage : visibleNav[0]?.items[0]?.key;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState("");

  return (
    <div className="lulu-admin-console min-h-screen bg-slate-50 text-slate-900" data-admin-page={page}>
      <div className="flex h-screen w-full">
        <aside className={`${sidebarOpen ? "w-64" : "w-0 -translate-x-full md:w-16 md:translate-x-0"} transition-all duration-200 shrink-0 border-r border-slate-200 bg-white md:static fixed left-0 top-0 z-30 h-full overflow-y-auto`}>
          <div className="lulu-admin-console__brand flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="lulu-admin-console__mark">
                <img src="/branding/lulu-agentic-mark.svg" alt="" aria-hidden="true" draggable={false} />
              </div>
              {sidebarOpen ? (
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold leading-tight">Lulu</div>
                  <div className="text-[11px] text-slate-500">Autonomous execution</div>
                </div>
              ) : null}
            </div>
            <button className="md:hidden text-slate-500 hover:text-slate-700" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
          </div>

          {sidebarOpen ? (
            <div className="lulu-admin-console__runtime mx-3 mt-3">
              <span className="lulu-admin-console__runtime-dot" aria-hidden="true" />
              <span><strong>140+</strong> AI agents</span>
              <small>live</small>
            </div>
          ) : null}

          <nav className="p-3 space-y-5">
            {visibleNav.map((section) => (
              <div key={section.label}>
                {sidebarOpen ? <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{section.label}</div> : null}
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = page === item.key;
                    return (
                      <li key={item.key}>
                        <button
                          onClick={() => { setPage(item.key); setSidebarOpen(true); }}
                          className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition
                            ${active ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                          title={item.label}
                        >
                          <span className={active ? "text-indigo-600" : "text-slate-400"}>{item.icon}</span>
                          {sidebarOpen ? (
                            <span className="flex-1 text-left">{item.label}</span>
                          ) : null}
                          {sidebarOpen && item.badge ? (
                            <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-rose-700">{item.badge}</span>
                          ) : null}
                          {active && sidebarOpen ? <ChevronRight size={14} className="text-indigo-500" /> : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {sidebarOpen ? <div className="md:hidden fixed inset-0 z-20 bg-black/20" onClick={() => setSidebarOpen(false)} /> : null}

        <div className="flex-1 flex flex-col min-w-0">
          <header className="lulu-admin-console__topbar flex items-center justify-between gap-3 border-b border-slate-200 bg-white/80 backdrop-blur px-6 py-3.5">
            <div className="flex items-center gap-3">
              <button className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 md:hidden" onClick={() => setSidebarOpen(true)}><Menu size={18} /></button>
              <button className="hidden md:inline-flex rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50" onClick={() => setSidebarOpen((v) => !v)}>
                {sidebarOpen ? <ChevronRight size={18} /> : <Menu size={18} />}
              </button>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400">Lulu Platform Operations</div>
                <div className="text-lg font-semibold text-slate-900">
                  {NAV.flatMap((s) => s.items).find((i) => i.key === page)?.label ?? "Dashboard"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="lulu-admin-console__live"><span aria-hidden="true" /> Live</span>
              <Pill tone="emerald"><ShieldCheck size={12} className="mr-1" /> {currentUser?.email}</Pill>
            </div>
          </header>

          {error ? (
            <div className="mx-6 mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 flex items-start justify-between gap-3">
              <div>{error}</div>
              <button className="text-rose-600 hover:text-rose-800" onClick={() => setError("")}><X size={16} /></button>
            </div>
          ) : null}

          <main className="lulu-admin-console__main flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {page === "dashboard" ? <DashboardPage onError={setError} /> : null}
            {page === "billing" ? <BillingPage onError={setError} /> : null}
            {page === "users" ? <UsersPage onError={setError} /> : null}
            {page === "workspaces" ? <WorkspacesPage onError={setError} /> : null}
            {page === "crm" ? <CrmPage onError={setError} /> : null}
            {page === "websites" ? <WebsitesPage onError={setError} /> : null}
            {page === "agents" ? <AgentsPage onError={setError} /> : null}
            {page === "integrations" ? <IntegrationsPage onError={setError} /> : null}
            {page === "oauth-connections" ? <OAuthConnectionsPage onError={setError} /> : null}
            {page === "approvals" ? <ApprovalsPage onError={setError} /> : null}
            {page === "conversations" ? <AdminOmniChannelPage /> : null}
            {page === "files" ? <FilesPage onError={setError} /> : null}
            {page === "support" ? <SupportInbox admin /> : null}
            {page === "errors" ? <ErrorsPage onError={setError} /> : null}
            {page === "audit" ? <AuditPage onError={setError} /> : null}
            {page === "jobs" ? <JobsPage onError={setError} /> : null}
            {page === "settings" ? <SettingsPage onError={setError} /> : null}
          </main>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const load = async () => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<DashboardStats>({ path: "/admin/dashboard" });
      setStats(res.data);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Dashboard konnte nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const crmMap = useMemo(() => Object.fromEntries((stats?.crmByType ?? []).map((x) => [x.resourceType, x.count])), [stats]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <button type="button" disabled={loading} onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"><RotateCcw size={14} className={loading ? "animate-spin" : undefined} /> Aktualisieren</button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Total Users" value={stats?.users.total ?? "—"} hint={`${stats?.users.newLast30d ?? 0} new last 30 days`} accent="sky" />
        <KPI label="Verified Users" value={stats?.users.verified ?? "—"} hint={`${stats?.users.admins ?? 0} admins`} accent="emerald" />
        <KPI label="Workspaces" value={stats?.workspaces.total ?? "—"} hint={`${stats?.workspaces.onboarded ?? 0} onboarded`} accent="violet" />
        <KPI label="Files Purged" value={stats?.workspaces.filesPurged ?? "—"} hint="5-day rule applied" accent="amber" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <KPI label="Subscriptions" value={stats?.subscriptions.total ?? "—"} accent="slate" />
        <KPI label="Active / Trialing" value={`${stats?.subscriptions.active ?? 0} / ${stats?.subscriptions.trialing ?? 0}`} accent="emerald" />
        <KPI label="Canceled" value={stats?.subscriptions.canceled ?? 0} accent="rose" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <KPI label="AI Plan" value={stats?.subscriptions.aiPlan ?? 0} accent="violet" />
        <KPI label="Starter Plan" value={stats?.subscriptions.starterPlan ?? 0} accent="sky" />
        <KPI label="Explorer Plan" value={stats?.subscriptions.explorerPlan ?? 0} accent="slate" />
        <KPI label="Test Plan" value={stats?.subscriptions.testPlan ?? 0} accent="amber" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <KPI label="Websites" value={stats?.websites.total ?? "—"} hint={`${stats?.websites.published ?? 0} published`} accent="sky" />
        <KPI label="Platform Split" value={`WP ${stats?.websites.wordpress ?? 0} · Shopify ${stats?.websites.shopify ?? 0}`} hint={`WF ${stats?.websites.webflow ?? 0} · WC ${stats?.websites.woocommerce ?? 0}`} accent="violet" />
        <KPI label="Events last 24h" value={stats?.notifications.totalLast24h ?? 0} hint={`${stats?.notifications.errorsLast24h ?? 0} errors · ${stats?.notifications.warningsLast24h ?? 0} warnings`} accent={stats?.notifications.errorsLast24h ? "rose" : "emerald"} />
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold text-slate-700">CRM by Type</div>
        {stats && Object.keys(crmMap).length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Object.entries(crmMap).map(([type, count]) => (
              <div key={type} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">{type}</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">{count}</div>
              </div>
            ))}
          </div>
        ) : loading ? <div className="text-sm text-slate-500">Loading CRM summary…</div> : <EmptyPanel title="No CRM records yet" />}
      </div>

      {loading ? null : null}
    </div>
  );
}

function BillingPage({ onError }: { onError: (m: string) => void }) {
  const t = useTranslation();
  const [month, setMonth] = useState(monthNow());
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [costEditor, setCostEditor] = useState<{ customer: Customer; apiAiCostUsd: string; storageCostUsd: string; reason: string } | null>(null);

  const load = async () => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<Overview>({ path: `/admin/billing-overview?month=${encodeURIComponent(month)}` });
      setOverview(res.data);
    } catch (cause) { onError(getFriendlyErrorMessage(cause, "Die Admin-Daten konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [month]);

  const updatePlan = async (customer: Customer, planKey: Plan) => {
    setSavingId(customer.id); onError("");
    try {
      await requestApi({ path: `/admin/workspaces/${customer.id}/plan`, method: "PATCH", body: { planKey } });
      setOverview((c) => c ? { ...c, customers: c.customers.map((i) => i.id === customer.id ? { ...i, planKey } : i) } : c);
    } catch (cause) { onError(getFriendlyErrorMessage(cause, "Das Abo-Modell konnte nicht geändert werden.")); }
    finally { setSavingId(""); }
  };

  const openCostEditor = async (customer: Customer) => {
    setSavingId(`${customer.id}:cost`); onError("");
    try {
      const detail = await requestApi<WorkspaceDetail>({ path: `/admin/workspaces/${customer.id}` });
      setCostEditor({
        customer,
        apiAiCostUsd: String(detail.data.paygUsage?.apiBillableUsd ?? Number(customer.apiCostUsd || 0)),
        storageCostUsd: String(detail.data.paygUsage?.serverBillableUsd ?? Number(customer.serverCostUsd || 0)),
        reason: "Manuelle Kostenanpassung durch Admin",
      });
    } catch (cause) { onError(getFriendlyErrorMessage(cause, "Die aktuellen Kosten konnten nicht geladen werden.")); }
    finally { setSavingId(""); }
  };

  const saveUsageCosts = async () => {
    if (!costEditor) return;
    const apiAiCostUsd = Number(costEditor.apiAiCostUsd);
    const storageCostUsd = Number(costEditor.storageCostUsd);
    if (![apiAiCostUsd, storageCostUsd].every((value) => Number.isFinite(value) && value >= 0) || !costEditor.reason.trim()) {
      onError("Bitte gültige Kostenwerte und einen Grund angeben.");
      return;
    }
    setSavingId(`${costEditor.customer.id}:cost`); onError("");
    try {
      const response = await requestApi<{ apiBillableUsd: number; serverBillableUsd: number }>({
        path: `/admin/workspaces/${costEditor.customer.id}/usage-costs`, method: "PUT",
        body: { apiAiCostUsd, storageCostUsd, reason: costEditor.reason.trim() },
      });
      setOverview((current) => current ? {
        ...current,
        customers: current.customers.map((item) => item.id === costEditor.customer.id
          ? { ...item, apiCostUsd: String(response.data.apiBillableUsd), serverCostUsd: String(response.data.serverBillableUsd) }
          : item),
      } : current);
      setCostEditor(null);
    } catch (cause) { onError(getFriendlyErrorMessage(cause, "Die API/AI- und Storage-Kosten konnten nicht gespeichert werden.")); }
    finally { setSavingId(""); }
  };

  const totalApi = overview?.customers.reduce((s, c) => s + Number(c.apiCostMinor || 0), 0) ?? 0;
  const totalApiUsd = overview?.customers.reduce((s, c) => s + Number(c.apiCostUsd || 0), 0) ?? 0;
  const totalServerUsd = overview?.customers.reduce((s, c) => s + Number(c.serverCostUsd || 0), 0) ?? 0;
  const totalStorageBytes = overview?.customers.reduce((s, c) => s + Number(c.storageBytes || 0), 0) ?? 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <label className="text-sm font-medium text-slate-700">Monat</label>
        <input type="month" className="rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400" value={month} onChange={(e) => setMonth(e.target.value)} />
        <div className="ml-auto flex items-center gap-2 text-sm">
          <Pill tone="sky">API: {moneyUsd(totalApiUsd)}{totalApi > 0 ? ` · ${money(totalApi)}` : ""}</Pill>
          <Pill tone="violet">Storage / Infrastruktur: {moneyUsd(totalServerUsd)}</Pill>
          <Pill tone="amber">Bytes: {sizeMB(totalStorageBytes)}</Pill>
          <button type="button" disabled={loading} onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"><RotateCcw size={14} className={loading ? "animate-spin" : undefined} /> Aktualisieren</button>
        </div>
      </div>

      {costEditor ? (
        <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-sm" aria-label="API AI und Storage Kosten bearbeiten">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h3 className="font-semibold text-slate-900">Kosten bearbeiten · {costEditor.customer.companyName}</h3><p className="mt-1 text-xs text-slate-600">Die Werte gelten für die offene Abrechnungsperiode und werden revisionssicher protokolliert.</p></div>
            <button type="button" onClick={() => setCostEditor(null)} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">Abbrechen</button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-[170px_170px_minmax(220px,1fr)_auto]">
            <label className="text-xs font-medium text-slate-600">API / AI in USD<input type="number" min="0" step="0.01" value={costEditor.apiAiCostUsd} onChange={(event) => setCostEditor({ ...costEditor, apiAiCostUsd: event.target.value })} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" /></label>
            <label className="text-xs font-medium text-slate-600">Storage in USD<input type="number" min="0" step="0.01" value={costEditor.storageCostUsd} onChange={(event) => setCostEditor({ ...costEditor, storageCostUsd: event.target.value })} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" /></label>
            <label className="text-xs font-medium text-slate-600">Grund<input value={costEditor.reason} maxLength={500} onChange={(event) => setCostEditor({ ...costEditor, reason: event.target.value })} className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" /></label>
            <button type="button" disabled={savingId === `${costEditor.customer.id}:cost`} onClick={() => void saveUsageCosts()} className="self-end rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">{savingId === `${costEditor.customer.id}:cost` ? "Speichere…" : "Kosten speichern"}</button>
          </div>
        </section>
      ) : null}

      <DataTable<Customer>
        loading={loading}
        rows={overview?.customers ?? []}
        columns={[
          { key: "companyName", label: "Company", render: (c) => (
            <div className="flex flex-col">
              <div className="font-medium text-slate-900">{c.companyName}</div>
              <div className="text-xs text-slate-500">{c.email}</div>
            </div>
          ) },
          { key: "owner", label: "Owner", render: (c) => nameOf(c.firstName, c.lastName, "—") },
          { key: "planKey", label: "Plan", render: (c) => (
            savingId === c.id ? <span className="text-xs text-slate-400">Speichere…</span> : (
              <select value={c.planKey} onChange={(e) => updatePlan(c, e.target.value as Plan)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-indigo-400">
                <option value="explorer">Explorer</option>
                <option value="starter">Starter</option>
                <option value="ai">AI</option>
                <option value="test">Test</option>
              </select>
            )
          ) },
          { key: "customPriceMinor", label: t("Customer price"), render: (c) => c.customPriceMinor === null || c.customPriceMinor === undefined ? t("Catalog price") : <span className="font-mono text-xs">{moneyCny(c.customPriceMinor)}</span> },
          { key: "subscriptionStatus", label: "Status", render: (c) => <Pill tone={toneFromStatus(c.subscriptionStatus)}>{c.subscriptionStatus}</Pill> },
          { key: "startDate", label: "Start", render: (c) => dateOnly(c.startDate) },
          { key: "expiryDate", label: "Ablauf", render: (c) => dateOnly(c.expiryDate) },
          { key: "apiCostUsd", label: "API", render: (c) => <span className="font-mono text-xs">{moneyUsd(c.apiCostUsd)}</span> },
          { key: "serverCostUsd", label: "Storage", render: (c) => <span className="font-mono text-xs">{moneyUsd(c.serverCostUsd)}</span> },
          { key: "storageBytes", label: "Größe", render: (c) => <span className="font-mono text-xs">{sizeMB(c.storageBytes)}</span> },
          { key: "costActions", label: "Kosten", render: (c) => <button type="button" disabled={savingId === `${c.id}:cost`} onClick={() => void openCostEditor(c)} className="rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50">{savingId === `${c.id}:cost` ? "Lade…" : "Bearbeiten"}</button> },
        ]}
      />
    </div>
  );
}

function UsersPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState("");
  const [workspaceSavingId, setWorkspaceSavingId] = useState("");
  const [impersonating, setImpersonating] = useState(false);
  const [notice, setNotice] = useState("");
  const [deletionJob, setDeletionJob] = useState<UserDeletionJob | null>(null);

  const load = async (q?: string) => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ users: UserRow[] }>({ path: `/admin/users?limit=200&offset=0${q ? `&search=${encodeURIComponent(q)}` : ""}` });
      setRows(res.data.users);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Users konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(search); }, []);

  useEffect(() => {
    if (!deletionJob || !["queued", "running"].includes(deletionJob.status)) return;
    const pendingJob = deletionJob;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const res = await requestApi<UserDeletionJob>({ path: `/admin/user-deletion-jobs/${pendingJob.id}` });
          const next = res.data;
          setDeletionJob(next);
          if (next.status === "succeeded") {
            const result = next.result;
            const email = result?.previousEmail ?? next.targetEmail ?? "Der Benutzer";
            setDetail((current) => current?.id === next.targetUserId ? null : current);
            setRows((current) => current.filter((row) => row.id !== next.targetUserId));
            setNotice(result
              ? `${email} wurde vollständig gelöscht. Entfernt: ${result.deletedWorkspaceCount} Workspace(s), ${result.deletedIntegrationCount} Integration(en), ${result.deletedMembershipCount} Mitgliedschaft(en) und ${result.deletedSharedWorkspaceDataCount} persönliche Einträge in geteilten Workspaces.`
              : `${email} wurde vollständig gelöscht.`);
            await load(search);
          } else if (next.status === "failed" || next.status === "cancelled") {
            onError(`Die vollständige Löschung konnte nicht abgeschlossen werden.${next.errorMessage ? ` · ${next.errorMessage}` : ""}`);
          }
        } catch (e) {
          const message = getFriendlyErrorMessage(e, "Der Löschstatus konnte nicht geladen werden.");
          onError(`${message} · ${e instanceof ApiError ? getTechnicalErrorDetails(e) : "Code: UNKNOWN_ERROR"}`);
        }
      })();
    }, 1_250);
    return () => window.clearTimeout(timer);
  }, [deletionJob?.id, deletionJob?.status]);

  const openDetail = async (id: string) => {
    setDetailLoading(true); onError(""); setNotice(""); setDetail(null);
    try {
      const res = await requestApi<UserDetail>({ path: `/admin/users/${id}` });
      setDetail(res.data);
    } catch (e) { onError(getFriendlyErrorMessage(e, "User details konnten nicht geladen werden.")); }
    finally { setDetailLoading(false); }
  };

  const runAction = async (action: "lock" | "unlock" | "verify" | "reset-sessions") => {
    if (!detail) return;
    setSaving(action); onError(""); setNotice("");
    try {
      const res = await requestApi<UserDetail>({ path: `/admin/users/${detail.id}`, method: "PATCH", body: { action } });
      setDetail(res.data);
      await load(search);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Aktion fehlgeschlagen.")); }
    finally { setSaving(""); }
  };

  const skipWorkspaceOnboarding = async (workspaceId: string) => {
    if (!detail) return;
    setWorkspaceSavingId(workspaceId); onError(""); setNotice("");
    try {
      await requestApi<WorkspaceDetail>({ path: `/admin/workspaces/${workspaceId}`, method: "PATCH", body: { action: "skip-onboarding" } });
      const res = await requestApi<UserDetail>({ path: `/admin/users/${detail.id}` });
      setDetail(res.data);
      await load(search);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Billing konnte nicht übersprungen werden.")); }
    finally { setWorkspaceSavingId(""); }
  };

  const impersonateUser = async () => {
    if (!detail) return;
    setImpersonating(true); onError(""); setNotice("");
    try {
      const res = await requestApi<{ token: string; user: SessionUser }>({ path: `/admin/users/${detail.id}/impersonate`, method: "POST", body: {} });
      setStoredUser(res.data.user);
      setAdminSurface("workspace");
      window.location.replace(routes.app.dashboard);
    } catch (e) {
      onError(getFriendlyErrorMessage(e, "Der Account konnte nicht zur Ansicht übernommen werden."));
    } finally {
      setImpersonating(false);
    }
  };

  const deleteUser = async () => {
    if (!detail) return;
    const confirmed = window.confirm(`Account ${detail.email} endgültig löschen? Der Zugang wird sofort beendet. Eigene Workspaces einschließlich Integrationen werden gelöscht; persönliche Inhalte in geteilten Workspaces werden ebenfalls entfernt. Diese Aktion kann nicht rückgängig gemacht werden.`);
    if (!confirmed) return;
    setSaving("delete"); onError(""); setNotice("");
    try {
      const res = await requestApi<UserDeletionJob>({ path: `/admin/users/${detail.id}`, method: "DELETE" });
      setDeletionJob(res.data);
      setNotice(`${detail.email} wird vollständig im Hintergrund gelöscht. Der Zugriff wurde beendet; große Workspaces können einige Minuten benötigen.`);
    } catch (e) {
      // The deletion is irreversible, so a generic error leaves an operator
      // unable to distinguish a rejected request from a safely rolled-back
      // server error. Surface only the already-sanitised API diagnostics.
      const message = getFriendlyErrorMessage(e, "Der User konnte nicht gelöscht werden.");
      onError(`${message} · ${e instanceof ApiError ? getTechnicalErrorDetails(e) : "Code: UNKNOWN_ERROR"}`);
    } finally {
      setSaving("");
    }
  };

  const debouncedSearch = (() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    return (v: string) => {
      setSearch(v);
      if (t) clearTimeout(t);
      t = setTimeout(() => load(v), 300);
    };
  })();

  const deletingCurrentUser = !!detail && deletionJob?.targetUserId === detail.id && ["queued", "running"].includes(deletionJob.status);

  return (
    <div className="space-y-5">
      {notice ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      ) : null}
      {deletionJob && ["queued", "running"].includes(deletionJob.status) ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-semibold">Löschung läuft im Hintergrund.</span>{" "}
          {deletionJob.targetEmail ?? "Der Benutzer"} wird vollständig bereinigt. Diese Ansicht aktualisiert sich automatisch.
        </div>
      ) : null}
      <DataTable<UserRow>
        loading={loading} rows={rows} searchValue={search} searchOnChange={debouncedSearch}
        columns={[
          { key: "email", label: "User", render: (r) => (
            <div className="flex items-center gap-3">
              <button
                onClick={() => openDetail(r.id)}
                className="group flex flex-col items-start text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900 group-hover:text-indigo-700">{r.email}</span>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500" />
                </div>
                <div className="text-xs text-slate-500">{nameOf(r.firstName, r.lastName) || "—"}</div>
              </button>
            </div>
          ) },
          { key: "role", label: "Role", render: (r) => <Pill tone={r.role === "admin" ? "violet" : "slate"}>{r.role}</Pill> },
          { key: "verified", label: "Verified", render: (r) => r.verifiedAt ? <Pill tone="emerald">✓ {dateOnly(r.verifiedAt)}</Pill> : <Pill tone="rose">No</Pill> },
          { key: "workspaceCount", label: "Workspaces", render: (r) => r.workspaceCount },
          { key: "activeSessions", label: "Sessions", render: (r) => r.activeSessions },
          { key: "createdAt", label: "Created", render: (r) => dateOnly(r.createdAt) },
        ]}
      />

      {detailLoading ? <EmptyPanel title="Loading user details…" /> : detail ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <div className="text-lg font-semibold text-slate-900">{detail.email}</div>
              <div className="text-sm text-slate-500">{nameOf(detail.firstName, detail.lastName)} · User ID {detail.id}</div>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-800">
                Credits: {detail.creditBalance ?? 0}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                disabled={!!saving || impersonating || deletingCurrentUser}
                onClick={() => void impersonateUser()}
                className="inline-flex items-center gap-1.5 rounded-md border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-100 disabled:opacity-50"
              >
                <LogIn size={14} /> {impersonating ? "Öffne Account…" : "Zum Account wechseln"}
              </button>
              <button disabled={!!saving || deletingCurrentUser} onClick={() => runAction("verify")} className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"><UserCheck size={14} /> Verify</button>
              <button disabled={!!saving || deletingCurrentUser} onClick={() => runAction("reset-sessions")} className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50"><RotateCcw size={14} /> Reset Sessions</button>
              <button disabled={!!saving || deletingCurrentUser} onClick={() => runAction("unlock")} className="inline-flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800 hover:bg-sky-100 disabled:opacity-50"><Unlock size={14} /> Unlock</button>
              <button disabled={!!saving || deletingCurrentUser} onClick={() => runAction("lock")} className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-800 hover:bg-rose-100 disabled:opacity-50"><Lock size={14} /> Lock</button>
              <button disabled={!!saving || impersonating || deletingCurrentUser} onClick={() => void deleteUser()} className="inline-flex items-center gap-1.5 rounded-md border border-rose-300 bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-50"><Trash2 size={14} /> {deletingCurrentUser ? "Löschung läuft…" : "Benutzer endgültig löschen"}</button>
              {saving ? <span className="text-xs text-slate-500">Speichere {saving}…</span> : null}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Workspaces</div>
              {detail.workspaces.length ? (
                <ul className="divide-y divide-slate-100 rounded-lg border border-slate-100">
                  {detail.workspaces.map((w) => (
                    <li key={w.id} className="flex items-center justify-between px-3 py-2 text-sm">
                      <div>
                        <div className="font-medium text-slate-900">{w.companyName}</div>
                        <div className="text-xs text-slate-500">Onboarding: {w.onboardingStep}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!w.onboardingCompletedAt ? (
                          <button
                            disabled={workspaceSavingId === w.id}
                            onClick={() => void skipWorkspaceOnboarding(w.id)}
                            className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
                          >
                            <PlayCircle size={12} />
                            {workspaceSavingId === w.id ? "Speichere…" : "Onboarding überspringen"}
                          </button>
                        ) : (
                          <Pill tone="emerald">Done</Pill>
                        )}
                        <Pill tone={w.role === "owner" ? "violet" : "slate"}>{w.role}</Pill>
                        <span className="text-xs text-slate-500">{dateOnly(w.joinedAt)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <EmptyPanel title="No workspaces" />}
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700">Sessions</div>
              {detail.sessions.length ? (
                <ul className="divide-y divide-slate-100 rounded-lg border border-slate-100 max-h-80 overflow-y-auto">
                  {detail.sessions.map((s) => (
                    <li key={s.id} className="flex items-start justify-between gap-3 px-3 py-2 text-xs">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-mono text-[11px] text-slate-500">{s.id.slice(0, 12)}...</div>
                        <div className="mt-0.5 truncate text-slate-600">{s.userAgent || "Unknown device"}</div>
                      </div>
                      <div className="text-right">
                        <div>{s.revoked ? <Pill tone="rose">Revoked</Pill> : <Pill tone="emerald">Active</Pill>}</div>
                        <div className="mt-1 text-[11px] text-slate-500">IP: {s.ipAddress || "—"}</div>
                        <div className="text-[11px] text-slate-500">Expires: {dateOnly(s.expiresAt)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <EmptyPanel title="No sessions" />}
            </div>

            <div className="lg:col-span-2">
              <div className="mb-2 text-sm font-semibold text-slate-700">Usage Summary</div>
              {detail.usage.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {detail.usage.map((u) => (
                    <div key={u.metricKey} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-slate-400">{u.metricKey}</div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">{String(u.total)}</div>
                      <div className="mt-1 text-[11px] text-slate-500">{dateOnly(u.periodStart)} – {dateOnly(u.periodEnd)}</div>
                    </div>
                  ))}
                </div>
              ) : <EmptyPanel title="No usage recorded" />}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function WorkspacesPage({ onError }: { onError: (m: string) => void }) {
  const t = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<WorkspaceRow[]>([]);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<WorkspaceDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditNote, setCreditNote] = useState("");
  const [creditSaving, setCreditSaving] = useState(false);
  const [usageMetric, setUsageMetric] = useState<"api" | "server" | "storage">("api");
  const [usageAmount, setUsageAmount] = useState("");
  const [usageReason, setUsageReason] = useState("");
  const [usageSaving, setUsageSaving] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState("");
  const [subscriptionPriceReason, setSubscriptionPriceReason] = useState("");
  const [subscriptionPriceSaving, setSubscriptionPriceSaving] = useState(false);

  const load = async (q?: string) => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ workspaces: WorkspaceRow[] }>({ path: `/admin/workspaces?limit=200${q ? `&search=${encodeURIComponent(q)}` : ""}` });
      setRows(res.data.workspaces);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Workspaces konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(search); }, []);

  const openDetail = async (id: string) => {
    setDetailLoading(true); onError(""); setDetail(null);
    try {
      const res = await requestApi<WorkspaceDetail>({ path: `/admin/workspaces/${id}` });
      setDetail(res.data);
      setSubscriptionPrice(res.data.customPriceMinor === null || res.data.customPriceMinor === undefined ? "" : (Number(res.data.customPriceMinor) / 100).toFixed(2));
      setSubscriptionPriceReason("");
    } catch (e) { onError(getFriendlyErrorMessage(e, "Workspace details konnten nicht geladen werden.")); }
    finally { setDetailLoading(false); }
  };

  const runAction = async (action: "lock" | "unlock" | "reset-onboarding" | "skip-onboarding" | "set-plan", planKey?: Plan) => {
    if (!detail) return;
    setSaving(action); onError("");
    try {
      const res = await requestApi<WorkspaceDetail>({ path: `/admin/workspaces/${detail.id}`, method: "PATCH", body: { action, planKey } });
      setDetail(res.data);
      await load(search);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Aktion fehlgeschlagen.")); }
    finally { setSaving(""); }
  };

  const addCredits = async () => {
    if (!detail) return;
    const amount = Number(creditAmount);
    if (!Number.isFinite(amount) || amount <= 0) { onError("Bitte eine gültige positive Credit-Anzahl eingeben."); return; }
    setCreditSaving(true); onError("");
    try {
      const res = await requestApi<{ workspaceId: string; balance: number; added: number }>({ path: `/admin/workspaces/${detail.id}/credits`, method: "POST", body: { amount, note: creditNote || undefined } });
      setDetail({ ...detail, creditBalance: res.data.balance });
      setCreditAmount(""); setCreditNote("");
      await load(search);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Credits konnten nicht zugewiesen werden.")); }
    finally { setCreditSaving(false); }
  };

  const addUsageAdjustment = async () => {
    if (!detail) return;
    const amountUsd = Number(usageAmount);
    const reason = usageReason.trim();
    if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
      onError("Bitte einen gültigen positiven USD-Betrag eingeben.");
      return;
    }
    if (!reason) {
      onError("Bitte einen Grund für die Nutzungs-Gutschrift angeben.");
      return;
    }
    setUsageSaving(true); onError("");
    try {
      await requestApi({
        path: `/admin/workspaces/${detail.id}/usage-adjustments`,
        method: "POST",
        body: { metric: usageMetric, amountUsd, reason },
      });
      const refreshed = await requestApi<WorkspaceDetail>({ path: `/admin/workspaces/${detail.id}` });
      setDetail(refreshed.data);
      setUsageAmount(""); setUsageReason("");
    } catch (e) {
      onError(getFriendlyErrorMessage(e, "Die Nutzungs-Gutschrift konnte nicht gespeichert werden."));
    } finally { setUsageSaving(false); }
  };

  const saveSubscriptionPrice = async (restoreCatalog = false) => {
    if (!detail) return;
    const rawAmount = subscriptionPrice.trim();
    const amountCny = restoreCatalog || rawAmount === "" ? null : Number(rawAmount);
    if (amountCny !== null && (!Number.isFinite(amountCny) || amountCny < 0 || amountCny > 10_000_000 || Math.abs(amountCny * 100 - Math.round(amountCny * 100)) > 1e-6)) {
      onError(t("Subscription price must be between 0 and 10,000,000 CNY with at most two decimal places"));
      return;
    }
    const reason = (restoreCatalog ? t("Catalog price restored") : subscriptionPriceReason).trim();
    if (!reason) {
      onError(t("A reason is required for every subscription price change"));
      return;
    }
    setSubscriptionPriceSaving(true); onError("");
    try {
      await requestApi({ path: `/admin/workspaces/${detail.id}/subscription-price`, method: "PATCH", body: { amountCny, reason } });
      const refreshed = await requestApi<WorkspaceDetail>({ path: `/admin/workspaces/${detail.id}` });
      setDetail(refreshed.data);
      setSubscriptionPrice(refreshed.data.customPriceMinor === null || refreshed.data.customPriceMinor === undefined ? "" : (Number(refreshed.data.customPriceMinor) / 100).toFixed(2));
      setSubscriptionPriceReason("");
      await load(search);
    } catch (e) {
      onError(getFriendlyErrorMessage(e, t("The subscription price could not be updated.")));
    } finally { setSubscriptionPriceSaving(false); }
  };

  const debounced = (() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    return (v: string) => { setSearch(v); if (t) clearTimeout(t); t = setTimeout(() => load(v), 300); };
  })();

  return (
    <div className="space-y-5">
      <DataTable<WorkspaceRow>
        loading={loading} rows={rows} searchValue={search} searchOnChange={debounced}
        columns={[
          { key: "companyName", label: "Company", render: (r) => (
            <button onClick={() => openDetail(r.id)} className="group flex flex-col items-start text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 group-hover:text-indigo-700">{r.companyName}</span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500" />
              </div>
              <div className="text-xs text-slate-500">{r.slug ?? "—"} · {r.industry ?? "—"}</div>
            </button>
          ) },
          { key: "ownerEmail", label: "Owner", render: (r) => r.ownerEmail ?? "—" },
          { key: "planKey", label: "Plan", render: (r) => <Pill tone="violet">{r.planKey}</Pill> },
          { key: "subscriptionStatus", label: "Sub", render: (r) => <Pill tone={toneFromStatus(r.subscriptionStatus)}>{r.subscriptionStatus}</Pill> },
          { key: "onboardingStep", label: "Onboarding", render: (r) => (
            <div className="flex items-center gap-2">
              <Pill tone={r.onboardingCompletedAt ? "emerald" : "amber"}>{r.onboardingCompletedAt ? "Done" : r.onboardingStep}</Pill>
              {r.filesPurgedAt ? <Pill tone="rose">Purged</Pill> : null}
            </div>
          ) },
          { key: "memberCount", label: "Members", render: (r) => r.memberCount },
          { key: "createdAt", label: "Created", render: (r) => dateOnly(r.createdAt) },
        ]}
      />

      {detailLoading ? <EmptyPanel title="Loading workspace details…" /> : detail ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <div className="text-lg font-semibold text-slate-900">{detail.companyName}</div>
              <div className="text-sm text-slate-500">{detail.slug ?? ""} · {detail.industry ?? "—"} · {detail.countryRegion ?? "—"}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                disabled={!!saving}
                value={detail.planKey}
                onChange={(e) => runAction("set-plan", e.target.value as Plan)}
                className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-indigo-400"
              >
                <option value="explorer">Explorer</option>
                <option value="starter">Starter</option>
                <option value="ai">AI</option>
                <option value="test">Test</option>
              </select>
              <button disabled={!!saving || detail.onboardingStep !== "billing" || Boolean(detail.onboardingCompletedAt)} onClick={() => runAction("skip-onboarding")} className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"><PlayCircle size={14} /> Skip Billing</button>
              <button disabled={!!saving} onClick={() => runAction("reset-onboarding")} className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50"><RotateCcw size={14} /> Reset Onboarding</button>
              <button disabled={!!saving} onClick={() => runAction("unlock")} className="inline-flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800 hover:bg-sky-100 disabled:opacity-50"><Unlock size={14} /> Unlock</button>
              <button disabled={!!saving} onClick={() => runAction("lock")} className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-800 hover:bg-rose-100 disabled:opacity-50"><Ban size={14} /> Lock</button>
              {saving ? <span className="text-xs text-slate-500">Speichere…</span> : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <div className="mb-2 text-sm font-semibold text-slate-700">Profile</div>
              <dl className="space-y-1 text-sm text-slate-700">
                <div className="flex justify-between"><dt className="text-slate-500">Plan</dt><dd className="font-medium">{detail.planKey} · {detail.subscriptionStatus}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">{t("Customer price")}</dt><dd className="font-medium">{detail.customPriceMinor === null || detail.customPriceMinor === undefined ? t("Catalog price") : moneyCny(detail.customPriceMinor)}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Trial ends</dt><dd>{dateOnly(detail.trialEndsAt)}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Period</dt><dd>{dateOnly(detail.periodStartsAt)} – {dateOnly(detail.periodEndsAt)}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Seats</dt><dd>{detail.seats ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Credits</dt><dd className="font-semibold text-indigo-700">{detail.creditBalance ?? 0}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Onboarding</dt><dd>{detail.onboardingStep}{detail.onboardingCompletedAt ? " (Done / skipped possible)" : ""}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Files purged</dt><dd>{dateOnly(detail.filesPurgedAt)}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Legal form</dt><dd>{detail.legalForm ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Founded</dt><dd>{detail.foundingYear ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Employees</dt><dd>{detail.employeeCount ?? detail.companySize ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Revenue range</dt><dd>{detail.annualRevenueRange ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Model</dt><dd>{detail.businessModelType ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Stage</dt><dd>{detail.companyStage ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Sales model</dt><dd>{detail.salesModel ?? "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Sales cycle</dt><dd>{detail.salesCycleDays ? `${detail.salesCycleDays} days` : "—"}</dd></div>
              </dl>
              <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
                <div className="mb-2 text-xs font-semibold text-indigo-800">Credits zuweisen</div>
                <div className="flex items-center gap-2">
                  <input
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    placeholder="Anzahl"
                    inputMode="decimal"
                    className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
                  />
                  <input
                    value={creditNote}
                    onChange={(e) => setCreditNote(e.target.value)}
                    placeholder="Notiz (optional)"
                    className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
                  />
                  <button
                    disabled={creditSaving}
                    onClick={() => void addCredits()}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-indigo-200 bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {creditSaving ? "Speichere…" : "Hinzufügen"}
                  </button>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-violet-100 bg-violet-50/50 p-3">
                <div className="mb-1 text-xs font-semibold text-violet-900">{t("Customer subscription price")}</div>
                <div className="mb-3 text-xs leading-5 text-slate-600">
                  {t("Set a workspace-specific annual price in CNY. It is used for future subscription checkouts; existing invoices and active provider subscriptions are not changed retroactively.")}
                </div>
                <div className="mb-2 text-xs text-slate-600">
                  {detail.customPriceMinor === null || detail.customPriceMinor === undefined
                    ? t("Currently using the catalog price")
                    : `${t("Current override")}: ${moneyCny(detail.customPriceMinor)}${detail.customPriceSetAt ? ` · ${dateOnly(detail.customPriceSetAt)}` : ""}`}
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[150px_minmax(0,1fr)]">
                  <input
                    value={subscriptionPrice}
                    onChange={(e) => setSubscriptionPrice(e.target.value)}
                    placeholder={t("Annual amount in CNY")}
                    inputMode="decimal"
                    type="number"
                    min="0"
                    max="10000000"
                    step="0.01"
                    disabled={subscriptionPriceSaving}
                    className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-violet-400 disabled:opacity-50"
                  />
                  <input
                    value={subscriptionPriceReason}
                    onChange={(e) => setSubscriptionPriceReason(e.target.value)}
                    placeholder={t("Reason (required)")}
                    maxLength={500}
                    disabled={subscriptionPriceSaving}
                    className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-violet-400 disabled:opacity-50"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    disabled={subscriptionPriceSaving}
                    onClick={() => void saveSubscriptionPrice()}
                    className="inline-flex items-center gap-1 rounded-md border border-violet-200 bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                  >
                    {subscriptionPriceSaving ? t("Saving…") : t("Save customer price")}
                  </button>
                  {detail.customPriceMinor !== null && detail.customPriceMinor !== undefined ? (
                    <button
                      disabled={subscriptionPriceSaving}
                      onClick={() => void saveSubscriptionPrice(true)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {t("Use catalog price")}
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="mt-3">
                <div className="text-slate-500 text-xs mb-1">Business Description</div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap break-words">{detail.businessDescription || "—"}</div>
              </div>
              <div className="mt-3 space-y-2">
                <div><div className="text-slate-500 text-xs mb-1">Value Proposition</div><div className="text-sm text-slate-700 whitespace-pre-wrap break-words">{detail.valueProposition || "—"}</div></div>
                <div><div className="text-slate-500 text-xs mb-1">Primary ICP</div><div className="text-sm text-slate-700 whitespace-pre-wrap break-words">{detail.primaryIcp || "—"}</div></div>
                <div><div className="text-slate-500 text-xs mb-1">USP</div><div className="text-sm text-slate-700 whitespace-pre-wrap break-words">{detail.usp || "—"}</div></div>
                <div><div className="text-slate-500 text-xs mb-1">Mission</div><div className="text-sm text-slate-700 whitespace-pre-wrap break-words">{detail.mission || "—"}</div></div>
                <div><div className="text-slate-500 text-xs mb-1">Vision</div><div className="text-sm text-slate-700 whitespace-pre-wrap break-words">{detail.vision || "—"}</div></div>
              </div>
              {detail.positioningTags?.length ? (
                <div className="mt-3 flex flex-wrap gap-1">
                  {detail.positioningTags.map((t) => <Pill key={t} tone="sky">{t}</Pill>)}
                </div>
              ) : null}
              {detail.primaryChallenges?.length ? (
                <div className="mt-3 flex flex-wrap gap-1">
                  {detail.primaryChallenges.map((item) => <Pill key={item} tone="amber">{item}</Pill>)}
                </div>
              ) : null}
              {detail.languages?.length ? (
                <div className="mt-3 flex flex-wrap gap-1">
                  {detail.languages.map((item) => <Pill key={item} tone="violet">{item}</Pill>)}
                </div>
              ) : null}
              {detail.regulatedIndustries?.length ? (
                <div className="mt-3 flex flex-wrap gap-1">
                  {detail.regulatedIndustries.map((item) => <Pill key={item} tone="rose">{item}</Pill>)}
                </div>
              ) : null}
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <div className="mb-2 text-sm font-semibold text-slate-700">Members ({detail.members.length})</div>
              {detail.members.length ? (
                <ul className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {detail.members.map((m) => (
                    <li key={m.id} className="flex items-center justify-between py-1.5 text-sm">
                      <div>
                        <div className="font-medium text-slate-900">{m.email}</div>
                        <div className="text-xs text-slate-500">{nameOf(m.firstName, m.lastName)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill tone={m.role === "owner" ? "violet" : m.role === "admin" ? "sky" : "slate"}>{m.role}</Pill>
                        <span className="text-xs text-slate-500">{dateOnly(m.joinedAt)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <EmptyPanel title="No members" />}
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <div className="mb-2 text-sm font-semibold text-slate-700">CRM Summary</div>
              {detail.crmByType.length ? (
                <ul className="divide-y divide-slate-100">
                  {detail.crmByType.map((x) => (
                    <li key={x.resourceType} className="flex items-center justify-between py-1.5 text-sm">
                      <span className="text-slate-600">{x.resourceType}</span>
                      <span className="font-mono font-semibold text-slate-900">{x.count}</span>
                    </li>
                  ))}
                </ul>
              ) : <EmptyPanel title="No CRM data" />}
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 xl:col-span-2">
              <div className="mb-2 text-sm font-semibold text-slate-700">Websites / Shops</div>
              {detail.websites.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase text-slate-400">
                      <tr><th className="text-left py-1 px-2">Title</th><th className="text-left py-1 px-2">Platform</th><th className="text-left py-1 px-2">Status</th><th className="text-left py-1 px-2">Domain</th><th className="text-left py-1 px-2">Published</th></tr>
                    </thead>
                    <tbody>
                      {detail.websites.map((w) => (
                        <tr key={w.id} className="border-t border-slate-100">
                          <td className="py-1.5 px-2 font-medium">{w.title}</td>
                          <td className="py-1.5 px-2"><Pill tone="violet">{w.platform}</Pill></td>
                          <td className="py-1.5 px-2"><Pill tone={toneFromStatus(w.status)}>{w.status}</Pill></td>
                          <td className="py-1.5 px-2 text-xs text-slate-600">{w.domain ?? "—"}</td>
                          <td className="py-1.5 px-2 text-xs text-slate-500">{dateOnly(w.publishedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <EmptyPanel title="No websites yet" />}
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 xl:col-span-3">
              <div className="mb-2 text-sm font-semibold text-slate-700">Usage</div>
              {detail.usage.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {detail.usage.map((u) => (
                    <div key={u.metricKey} className="rounded-md border border-white bg-white p-3 shadow-sm">
                      <div className="text-[11px] uppercase tracking-wide text-slate-400">{u.metricKey}</div>
                      <div className="mt-1 text-lg font-semibold">{String(u.total)}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{dateOnly(u.periodStart)} – {dateOnly(u.periodEnd)}</div>
                    </div>
                  ))}
                </div>
              ) : <EmptyPanel title="No usage" />}
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 xl:col-span-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
              <div className="text-sm font-semibold text-slate-800">API / AI / Storage-Kosten anpassen</div>
              <div className="mt-1 max-w-2xl text-xs leading-5 text-slate-600">
                    Auditiertes Angebot oder Geschenk: Eine Gutschrift reduziert ausschließlich die noch nicht abgerechnete aktuelle PAYG-Periode. API umfasst AI- und externe API-Aufrufe; Storage wird gemeinsam mit der Server-/Infrastruktur-Nutzung verrechnet. Rohdaten und bereits ausgestellte Rechnungen bleiben unverändert.
              </div>
                </div>
                {detail.paygUsage ? (
                  <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-right text-xs text-slate-600 sm:grid-cols-5">
                    <span>API offen <strong className="ml-1 text-slate-900">${detail.paygUsage.apiBillableUsd.toFixed(2)}</strong></span>
                    <span>Server offen <strong className="ml-1 text-slate-900">${detail.paygUsage.serverBillableUsd.toFixed(2)}</strong></span>
                    <span>API/AI-Gutschrift <strong className="ml-1 text-emerald-700">${detail.paygUsage.apiCreditUsd.toFixed(2)}</strong></span>
                    <span>Server-Gutschrift <strong className="ml-1 text-emerald-700">${detail.paygUsage.serverCreditUsd.toFixed(2)}</strong></span>
                    <span>Storage-Gutschrift <strong className="ml-1 text-emerald-700">${Number(detail.paygUsage.storageCreditUsd ?? 0).toFixed(2)}</strong></span>
                  </div>
                ) : <span className="text-xs text-slate-500">PAYG ist für diesen Workspace nicht konfiguriert.</span>}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-[150px_150px_minmax(0,1fr)_auto]">
                <select
                  value={usageMetric}
                  onChange={(e) => setUsageMetric(e.target.value as "api" | "server" | "storage")}
                  disabled={usageSaving || !detail.paygUsage}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-amber-400 disabled:opacity-50"
                >
                  <option value="api">API / AI-Gutschrift</option>
                  <option value="server">Server-Gutschrift</option>
                  <option value="storage">Storage-Gutschrift</option>
                </select>
                <input
                  value={usageAmount}
                  onChange={(e) => setUsageAmount(e.target.value)}
                  placeholder="Betrag in USD"
                  inputMode="decimal"
                  type="number"
                  min="0.01"
                  step="0.01"
                  disabled={usageSaving || !detail.paygUsage}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-amber-400 disabled:opacity-50"
                />
                <input
                  value={usageReason}
                  onChange={(e) => setUsageReason(e.target.value)}
                  placeholder="Grund (z. B. Willkommensangebot)"
                  maxLength={500}
                  disabled={usageSaving || !detail.paygUsage}
                  className="min-w-0 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-amber-400 disabled:opacity-50"
                />
                <button
                  disabled={usageSaving || !detail.paygUsage}
                  onClick={() => void addUsageAdjustment()}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-amber-300 bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  {usageSaving ? "Speichere…" : "Gutschrift geben"}
                </button>
              </div>
              {detail.usageAdjustments.length ? (
                <div className="mt-4 overflow-x-auto rounded-md border border-amber-100 bg-white">
                  <table className="w-full min-w-[680px] text-xs">
                    <thead className="border-b border-slate-100 text-left uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="px-3 py-2">Typ</th><th className="px-3 py-2">Betrag</th><th className="px-3 py-2">Grund</th><th className="px-3 py-2">Periode</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Erstellt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.usageAdjustments.map((adjustment) => (
                        <tr key={adjustment.id} className="border-b border-slate-50 last:border-0">
                          <td className="px-3 py-2 font-medium">{adjustment.metric === "api" ? "API / AI" : adjustment.metric === "storage" ? "Storage" : "Server"}</td>
                          <td className="px-3 py-2 font-semibold text-emerald-700">${Number(adjustment.amountUsd).toFixed(2)}</td>
                          <td className="max-w-[260px] truncate px-3 py-2 text-slate-600" title={adjustment.reason}>{adjustment.reason}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-slate-500">{dateOnly(adjustment.periodStart)} – {dateOnly(adjustment.periodEnd)}</td>
                          <td className="px-3 py-2"><Pill tone={adjustment.appliedAt ? "sky" : "amber"}>{adjustment.appliedAt ? "An Periode gebunden" : "Offen"}</Pill></td>
                          <td className="whitespace-nowrap px-3 py-2 text-slate-500">{dateOnly(adjustment.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <div className="mt-4 text-xs text-slate-500">Noch keine PAYG-Gutschriften vergeben.</div>}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CrmPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<CrmRow[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const load = async (q?: string, t?: string) => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ records: CrmRow[] }>({ path: `/admin/crm?limit=200${q ? `&search=${encodeURIComponent(q)}` : ""}${t ? `&resourceType=${encodeURIComponent(t)}` : ""}` });
      setRows(res.data.records);
    } catch (e) { onError(getFriendlyErrorMessage(e, "CRM data konnte nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const types = Array.from(new Set(rows.map((r) => r.resourceType))).sort();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
          <Filter size={14} className="text-slate-400" />
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); void load(search, e.target.value); }}
            className="bg-transparent text-sm outline-none">
            <option value="">All Types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button type="button" disabled={loading} onClick={() => void load(search, typeFilter)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"><RotateCcw size={14} className={loading ? "animate-spin" : undefined} /> Aktualisieren</button>
      </div>
      <DataTable<CrmRow>
        loading={loading} rows={rows} searchValue={search}
        searchOnChange={(v) => { setSearch(v); setTimeout(() => load(v, typeFilter), 250); }}
        columns={[
          { key: "workspaceName", label: "Workspace" },
          { key: "resourceType", label: "Type", render: (r) => <Pill tone="violet">{r.resourceType}</Pill> },
          { key: "name", label: "Name", render: (r) => (
            <div className="flex flex-col">
              <div className="font-medium text-slate-900">{r.name}</div>
              {r.description ? <div className="text-xs text-slate-500 max-w-md truncate">{r.description}</div> : null}
            </div>
          ) },
          { key: "status", label: "Status", render: (r) => <Pill tone={toneFromStatus(r.status)}>{r.status}</Pill> },
          { key: "stage", label: "Stage", render: (r) => r.stage ? <Pill tone="sky">{r.stage}</Pill> : "—" },
          { key: "valueAmount", label: "Value", render: (r) => r.valueAmount ? `${r.valueAmount}${r.currency ? " " + r.currency : ""}` : "—" },
          { key: "assigneeEmail", label: "Assignee", render: (r) => r.assigneeEmail ?? "—" },
          { key: "dueAt", label: "Due", render: (r) => dateOnly(r.dueAt) },
          { key: "tags", label: "Tags", render: (r) => r.tags?.length ? <div className="flex flex-wrap gap-1 max-w-[180px]">{r.tags.slice(0, 3).map((t) => <Pill key={t} tone="slate">{t}</Pill>)}</div> : "—" },
          { key: "updatedAt", label: "Updated", render: (r) => dateOnly(r.updatedAt) },
        ]}
      />
    </div>
  );
}

function WebsitesPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<WebsiteRow[]>([]);
  const [search, setSearch] = useState("");
  const load = async (q?: string) => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ websites: WebsiteRow[] }>({ path: `/admin/websites?limit=200${q ? `&search=${encodeURIComponent(q)}` : ""}` });
      setRows(res.data.websites);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Websites konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  return (
    <DataTable<WebsiteRow>
      loading={loading} rows={rows} searchValue={search}
      searchOnChange={(v) => { setSearch(v); setTimeout(() => load(v), 250); }}
      columns={[
        { key: "workspaceName", label: "Workspace" },
        { key: "title", label: "Website", render: (r) => (
          <div>
            <div className="font-medium">{r.title}</div>
            <div className="text-xs text-slate-500">{r.domain ?? "—"}</div>
          </div>
        ) },
        { key: "platform", label: "Platform", render: (r) => <Pill tone="violet">{r.platform}</Pill> },
        { key: "status", label: "Status", render: (r) => <Pill tone={toneFromStatus(r.status)}>{r.status}</Pill> },
        { key: "templateId", label: "Template", render: (r) => r.templateId ?? "—" },
        { key: "version", label: "V", render: (r) => r.version == null ? "—" : `v${r.version}` },
        { key: "lastGeneratedAt", label: "Generated", render: (r) => dateOnly(r.lastGeneratedAt) },
        { key: "lastSyncedAt", label: "Synced", render: (r) => dateOnly(r.lastSyncedAt) },
        { key: "publishedAt", label: "Published", render: (r) => dateOnly(r.publishedAt) },
      ]}
    />
  );
}

function AgentsPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<AgentRow[]>([]);
  const [selected, setSelected] = useState<AgentRow | null>(null);
  const load = async () => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ agents: AgentRow[] }>({ path: "/admin/agents?limit=200" });
      setRows(res.data.agents);
      setSelected((current) => res.data.agents.find((row) => row.id === current?.id) ?? res.data.agents[0] ?? null);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Agents konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
      <DataTable<AgentRow>
        loading={loading} rows={rows}
        getRowKey={(row) => row.id}
        onRowClick={setSelected}
        selectedKey={selected?.id ?? null}
        columns={[
          { key: "workspaceName", label: "Workspace", render: (r) => r.workspaceName ?? "—" },
          { key: "name", label: "Agent", render: (r) => <div className="flex items-center gap-2"><div className="font-medium">{r.name}</div><Pill tone="violet">{r.agentType}</Pill></div> },
          { key: "mode", label: "Mode", render: (r) => <Pill tone="sky">{r.mode}</Pill> },
          { key: "status", label: "Status", render: (r) => <Pill tone={toneFromStatus(r.status)}>{r.status}</Pill> },
          { key: "model", label: "Model", render: (r) => `${r.modelProvider ?? "—"} / ${r.modelName ?? "—"}` },
          { key: "version", label: "Version", render: (r) => r.version == null ? "—" : `v${r.version}` },
          { key: "runCount", label: "Runs", render: (r) => r.runCount },
          { key: "createdAt", label: "Created", render: (r) => dateOnly(r.createdAt) },
          { key: "updatedAt", label: "Updated", render: (r) => dateOnly(r.updatedAt) },
        ]}
      />
      {selected ? (
        <DetailPanel
          title={selected.name}
          rows={[
            { label: "Workspace", value: selected.workspaceName ?? "—" },
            { label: "Status", value: selected.status },
            { label: "Mode", value: selected.mode },
            { label: "Type", value: selected.agentType },
            { label: "Model", value: `${selected.modelProvider ?? "—"} / ${selected.modelName ?? "—"}` },
            { label: "Runs", value: selected.runCount },
            { label: "Updated", value: date(selected.updatedAt) },
          ]}
          raw={selected}
        />
      ) : <EmptyPanel title="Kein Agent ausgewählt" hint="Wähle links einen Agenten aus." />}
    </div>
  );
}

function IntegrationsPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<IntegrationRow[]>([]);
  const load = async () => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ integrations: IntegrationRow[] }>({ path: "/admin/integrations?limit=200" });
      setRows(res.data.integrations);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Integrations konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  return (
    <DataTable<IntegrationRow>
      loading={loading} rows={rows}
      columns={[
        { key: "workspaceName", label: "Workspace", render: (r) => r.workspaceName ?? "—" },
        { key: "provider", label: "Provider", render: (r) => <div className="font-medium capitalize">{r.provider}</div> },
        { key: "status", label: "Status", render: (r) => <Pill tone={toneFromStatus(r.status)}>{r.status}</Pill> },
        { key: "scopes", label: "Scopes", render: (r) => r.scopes?.length ? <span className="font-mono text-xs">{r.scopes.length} scopes</span> : "—" },
        { key: "connectedAt", label: "Connected", render: (r) => dateOnly(r.connectedAt) },
        { key: "lastSyncedAt", label: "Last Sync", render: (r) => dateOnly(r.lastSyncedAt) },
        { key: "syncCount", label: "Syncs", render: (r) => r.syncCount },
        { key: "expiresAt", label: "Expires", render: (r) => dateOnly(r.expiresAt) },
        { key: "lastError", label: "Last Error", render: (r) => r.lastError ? <Pill tone="rose">Error</Pill> : "—" },
      ]}
    />
  );
}

const oauthProviderLabels: Record<string, string> = {
  "google-ads": "Google Ads",
  "google-analytics": "Google Analytics",
  "google-business": "Google Business",
  meta: "Meta",
  facebook: "Facebook",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  linkedin: "LinkedIn",
  "tiktok-ads": "TikTok Ads",
  microsoft: "Microsoft",
  google: "Google",
};

function oauthProviderLabel(provider: string) {
  return oauthProviderLabels[provider] ?? provider.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function OAuthConnectionsPage({ onError }: { onError: (m: string) => void }) {
  const { currentUser } = useLuluApp();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<OAuthConnectionRow[]>([]);
  const [permissionRows, setPermissionRows] = useState<OAuthSelfServiceWorkspace[]>([]);
  const [permissionProviders, setPermissionProviders] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [busyProvider, setBusyProvider] = useState<string | null>(null);
  const [busyPermission, setBusyPermission] = useState<string | null>(null);
  const canManage = currentUser?.adminCapabilities?.includes("providers.manage") ?? false;
  const load = async () => {
    setLoading(true); onError("");
    try {
      const query = `/admin/oauth-connections?limit=500${search.trim() ? `&search=${encodeURIComponent(search.trim())}` : ""}`;
      const [connectionRes, permissionRes] = await Promise.all([
        requestApi<{ connections: OAuthConnectionRow[] }>({ path: query }),
        requestApi<{ workspaces: OAuthSelfServiceWorkspace[]; providers: string[] }>({ path: `/admin/oauth-self-service${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}` }),
      ]);
      setRows(connectionRes.data.connections);
      setPermissionRows(permissionRes.data.workspaces);
      setPermissionProviders(permissionRes.data.providers);
    } catch (e) { onError(getFriendlyErrorMessage(e, "OAuth-Verbindungen konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [search]);

  const connected = rows.filter((row) => row.hasCredentials && !["error", "reauth_required", "missing_credentials", "disconnected"].includes(row.status)).length;
  const needsAttention = rows.filter((row) => !row.hasCredentials || ["error", "reauth_required", "missing_credentials"].includes(row.status)).length;
  const providerCount = new Set(rows.map((row) => row.provider)).size;
  const managedProviders = [
    { provider: "google-ads", label: "Google Ads", detail: "Central Lulu Ads account for all workspace campaigns." },
    { provider: "google-analytics", label: "Google Analytics", detail: "Central measurement property used by Lulu-managed reporting." },
    { provider: "meta", label: "Meta Ads", detail: "Central Meta Business account for workspace campaigns." },
    { provider: "facebook", label: "Facebook", detail: "Central Facebook Pages account for publishing and engagement." },
    { provider: "instagram", label: "Instagram", detail: "Central Instagram professional account for content and messages." },
    { provider: "whatsapp", label: "WhatsApp", detail: "Central WhatsApp Business account for customer messaging." },
    { provider: "linkedin", label: "LinkedIn Ads", detail: "Central LinkedIn Ads account for workspace campaigns." },
    { provider: "tiktok-ads", label: "TikTok Ads", detail: "Central TikTok Ads account for workspace campaigns." },
  ] as const;
  const managedRowFor = (provider: string) => rows.find((row) => row.connectionType === "admin" && row.provider === provider) ?? null;
  const connectManaged = async (provider: string) => {
    if (!canManage || busyProvider) return;
    setBusyProvider(provider); onError("");
    try {
      const returnTo = "/app/admin-billing-overview-9901?page=oauth-connections";
      const result = await requestApi<{ authorizationUrl: string }>({ path: `/admin/oauth-connections/${encodeURIComponent(provider)}/start?returnTo=${encodeURIComponent(returnTo)}`, method: "POST", body: {} });
      window.location.assign(result.data.authorizationUrl);
    } catch (e) {
      onError(getFriendlyErrorMessage(e, "Die zentrale Provider-Verbindung konnte nicht gestartet werden."));
      setBusyProvider(null);
    }
  };
  const disconnectManaged = async (provider: string) => {
    if (!canManage || busyProvider) return;
    if (!window.confirm(`Die zentrale ${oauthProviderLabel(provider)}-Verbindung wirklich trennen?`)) return;
    setBusyProvider(provider); onError("");
    try {
      await requestApi({ path: `/admin/oauth-connections/${encodeURIComponent(provider)}`, method: "DELETE" });
      await load();
    } catch (e) { onError(getFriendlyErrorMessage(e, "Die zentrale Provider-Verbindung konnte nicht getrennt werden.")); }
    finally { setBusyProvider(null); }
  };
  const setSelfServicePermission = async (workspace: OAuthSelfServiceWorkspace, provider: string, allowed: boolean) => {
    if (!canManage || busyPermission) return;
    const key = `${workspace.workspaceId}:${provider}`;
    setBusyPermission(key); onError("");
    try {
      await requestApi({ path: `/admin/oauth-self-service/${workspace.workspaceId}/${encodeURIComponent(provider)}`, method: "PUT", body: { allowed } });
      setPermissionRows((current) => current.map((row) => row.workspaceId !== workspace.workspaceId ? row : {
        ...row,
        allowedProviders: allowed
          ? Array.from(new Set([...row.allowedProviders, provider])).sort()
          : row.allowedProviders.filter((item) => item !== provider),
      }));
    } catch (e) { onError(getFriendlyErrorMessage(e, "Die OAuth-Freigabe konnte nicht gespeichert werden.")); }
    finally { setBusyPermission(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs uppercase tracking-wide text-slate-400">Provider security</div>
        <h1 className="text-2xl font-semibold text-slate-900">OAuth Connections</h1>
        <p className="max-w-3xl text-sm text-slate-500">
          Zentrale Übersicht aller externen OAuth-Verbindungen. Lulu-managed Provider werden hier einmalig für Lulu verbunden; Workspace-Integrationen bleiben bei den jeweiligen Kunden.
        </p>
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Lulu managed</div>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Zentrale Marketing- und Analytics-Verbindungen</h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">Alle Kampagnen, die ein Workspace über Lulu anlegt, werden künftig über diese zentralen Provider-Konten ausgeführt. Google Business bleibt dagegen eine Workspace-Verbindung.</p>
          </div>
          <Pill tone="violet">Admin only</Pill>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {managedProviders.map(({ provider, label, detail }) => {
            const row = managedRowFor(provider);
            const connected = Boolean(row?.hasCredentials && row.status === "connected");
            const busy = busyProvider === provider;
            return <article key={provider} className="rounded-xl border border-white/80 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-900">{label}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div><Pill tone={connected ? "emerald" : "slate"}>{connected ? "Connected" : "Not connected"}</Pill></div>
              {row?.displayName ? <p className="mt-3 truncate text-xs text-slate-600" title={row.displayName}>Account: {row.displayName}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {connected ? <button type="button" onClick={() => void disconnectManaged(provider)} disabled={!canManage || busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"><Unplug size={14} />{busy ? "Working…" : "Disconnect"}</button> : <button type="button" onClick={() => void connectManaged(provider)} disabled={!canManage || busy} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? <LoaderCircle size={14} className="animate-spin" /> : <ExternalLink size={14} />}{busy ? "Opening…" : "Connect centrally"}</button>}
              </div>
            </article>;
          })}
        </div>
        {!canManage ? <p className="mt-4 text-xs text-slate-500">Deine Rolle besitzt nur Leserechte. Ein Administrator mit „providers.manage“ kann zentrale Verbindungen verwalten.</p> : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Eigene Benutzerkonten</div>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">OAuth-Self-Service pro Workspace</h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">Erlaubt ein Admin einen Provider, kann der Benutzer sein eigenes Konto verbinden. Ohne Freigabe nutzt Lulu weiterhin ausschließlich die zentrale Admin-Verbindung. Beim Entziehen der Freigabe werden gespeicherte Workspace-Tokens dieses Providers entfernt.</p>
          </div>
          <Pill tone="violet">Admin approval</Pill>
        </div>
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-500"><tr>
              <th className="sticky left-0 z-10 min-w-56 bg-slate-50 px-3 py-3 font-semibold">Workspace / Benutzer</th>
              {permissionProviders.map((provider) => <th key={provider} className="min-w-28 px-3 py-3 text-center font-semibold">{oauthProviderLabel(provider)}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {permissionRows.map((workspace) => <tr key={workspace.workspaceId}>
                <td className="sticky left-0 z-10 bg-white px-3 py-3"><div className="font-medium text-slate-900">{workspace.workspaceName}</div><div className="mt-0.5 text-slate-500">{workspace.ownerEmail ?? "Kein Owner"}</div></td>
                {permissionProviders.map((provider) => {
                  const allowed = workspace.allowedProviders.includes(provider);
                  const busy = busyPermission === `${workspace.workspaceId}:${provider}`;
                  return <td key={provider} className="px-3 py-3 text-center"><button type="button" role="switch" aria-checked={allowed} disabled={!canManage || Boolean(busyPermission)} onClick={() => void setSelfServicePermission(workspace, provider, !allowed)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${allowed ? "bg-emerald-500" : "bg-slate-300"} disabled:cursor-not-allowed disabled:opacity-50`} title={`${oauthProviderLabel(provider)}: ${allowed ? "eigene Verbindung erlaubt" : "nur zentrale Verbindung"}`}><span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${allowed ? "translate-x-6" : "translate-x-1"}`} />{busy ? <span className="sr-only">Speichere</span> : null}</button></td>;
                })}
              </tr>)}
              {!loading && permissionRows.length === 0 ? <tr><td colSpan={permissionProviders.length + 1} className="px-4 py-8 text-center text-sm text-slate-500">Keine Workspaces gefunden.</td></tr> : null}
            </tbody>
          </table>
        </div>
        {!canManage ? <p className="mt-3 text-xs text-slate-500">Deine Rolle besitzt nur Leserechte.</p> : null}
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="OAuth Connections" value={loading ? "—" : rows.length} hint="Loaded from all OAuth stores" accent="violet" />
        <KPI label="With Credentials" value={loading ? "—" : connected} hint="Stored encrypted token material" accent="emerald" />
        <KPI label="Needs Attention" value={loading ? "—" : needsAttention} hint="Missing, expired or errored" accent={needsAttention ? "rose" : "emerald"} />
        <KPI label="Providers" value={loading ? "—" : providerCount} hint="Unique provider keys" accent="sky" />
      </div>

      <DataTable<OAuthConnectionRow>
        loading={loading}
        rows={rows}
        searchOnChange={setSearch}
        searchValue={search}
        getRowKey={(row) => `${row.connectionType}-${row.id}`}
        columns={[
          { key: "workspaceName", label: "Workspace", render: (row) => row.workspaceName ?? (row.management === "lulu_managed" ? "Lulu central" : "—") },
          { key: "connectionType", label: "Source", render: (row) => <Pill tone="slate">{row.connectionType}</Pill> },
          { key: "provider", label: "Provider", render: (row) => <div className="font-medium">{oauthProviderLabel(row.provider)}</div> },
          { key: "management", label: "Management", render: (row) => <Pill tone={row.management === "lulu_managed" ? "violet" : "slate"}>{row.management === "lulu_managed" ? "Lulu managed" : "Workspace"}</Pill> },
          { key: "displayName", label: "Account", render: (row) => <div className="max-w-xs truncate" title={row.displayName}>{row.displayName || "—"}</div> },
          { key: "status", label: "Status", render: (row) => <Pill tone={toneFromStatus(row.status)}>{row.status}</Pill> },
          { key: "hasCredentials", label: "Credentials", render: (row) => <Pill tone={row.hasCredentials ? "emerald" : "rose"}>{row.hasCredentials ? "Stored" : "Missing"}</Pill> },
          { key: "scopes", label: "Scopes", render: (row) => row.scopes?.length ? <span className="font-mono text-xs">{row.scopes.length}</span> : "—" },
          { key: "accountIdentifier", label: "Account ID", render: (row) => row.accountIdentifier ? <span className="font-mono text-xs">{row.accountIdentifier}</span> : "—" },
          { key: "tokenExpiresAt", label: "Token Expires", render: (row) => date(row.tokenExpiresAt) },
          { key: "lastSyncedAt", label: "Last Sync", render: (row) => date(row.lastSyncedAt) },
          { key: "lastError", label: "Last Error", render: (row) => row.lastError ? <span className="max-w-xs truncate text-rose-700" title={row.lastError}>{row.lastError}</span> : "—" },
          { key: "updatedAt", label: "Updated", render: (row) => date(row.updatedAt) },
        ]}
      />
    </div>
  );
}

function ApprovalsPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ApprovalRow[]>([]);
  const [selected, setSelected] = useState<ApprovalRow | null>(null);
  const load = async () => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ approvals: ApprovalRow[] }>({ path: "/admin/approvals?limit=200" });
      setRows(res.data.approvals);
      setSelected((current) => res.data.approvals.find((row) => row.id === current?.id) ?? res.data.approvals[0] ?? null);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Approvals konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
      <DataTable<ApprovalRow>
        loading={loading} rows={rows}
        getRowKey={(row) => row.id}
        onRowClick={setSelected}
        selectedKey={selected?.id ?? null}
        columns={[
          { key: "workspaceName", label: "Workspace", render: (r) => r.workspaceName ?? "—" },
          { key: "approvalType", label: "Type", render: (r) => <Pill tone="violet">{r.approvalType}</Pill> },
          { key: "status", label: "Status", render: (r) => <Pill tone={toneFromStatus(r.status)}>{r.status}</Pill> },
          { key: "requesterEmail", label: "Requester", render: (r) => r.requesterEmail ?? "—" },
          { key: "reason", label: "Reason", render: (r) => r.reason ?? "—" },
          { key: "createdAt", label: "Created", render: (r) => date(r.createdAt) },
          { key: "resolvedAt", label: "Resolved", render: (r) => date(r.resolvedAt) },
        ]}
      />
      {selected ? (
        <DetailPanel
          title={`Approval ${selected.approvalType}`}
          rows={[
            { label: "Workspace", value: selected.workspaceName ?? "—" },
            { label: "Status", value: selected.status },
            { label: "Requester", value: selected.requesterEmail ?? "—" },
            { label: "Reason", value: selected.reason ?? "—" },
            { label: "Created", value: date(selected.createdAt) },
            { label: "Resolved", value: date(selected.resolvedAt) },
          ]}
          raw={selected}
        />
      ) : <EmptyPanel title="Keine Approval ausgewählt" hint="Wähle links eine Approval aus." />}
    </div>
  );
}

function ConversationsPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ConversationRow[]>([]);
  const load = async () => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ conversations: ConversationRow[] }>({ path: "/admin/conversations?limit=200" });
      setRows(res.data.conversations);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Conversations konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  return (
    <DataTable<ConversationRow>
      loading={loading} rows={rows}
      columns={[
        { key: "workspaceName", label: "Workspace", render: (r) => r.workspaceName ?? "—" },
        { key: "channel", label: "Channel", render: (r) => <Pill tone="violet">{r.channel}</Pill> },
        { key: "subject", label: "Subject", render: (r) => (
          <div className="max-w-md truncate font-medium">{r.subject ?? <span className="text-slate-400">(No subject)</span>}</div>
        ) },
        { key: "status", label: "Status", render: (r) => <Pill tone={toneFromStatus(r.status)}>{r.status}</Pill> },
        { key: "priority", label: "Priority", render: (r) => <Pill tone={r.priority === "high" ? "rose" : r.priority === "medium" ? "amber" : "slate"}>{r.priority}</Pill> },
        { key: "messageCount", label: "Messages", render: (r) => r.messageCount },
        { key: "lastMessageAt", label: "Last Activity", render: (r) => date(r.lastMessageAt) },
      ]}
    />
  );
}

function FilesPage({ onError }: { onError: (m: string) => void }) {
  const { currentUser } = useLuluApp();
  const [downloading,setDownloading] = useState<string|null>(null);
  const download = async (row:FileRow) => {
    setDownloading(row.id); onError('');
    try {
      const blob=await requestApiBlob(`/admin/files/${encodeURIComponent(row.source ?? '')}/${encodeURIComponent(row.id)}/download`);
      const url=URL.createObjectURL(blob);const link=document.createElement('a');
      link.href=url;link.download=row.fileName;document.body.appendChild(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    } catch(error) {onError(getFriendlyErrorMessage(error));} finally {setDownloading(null);}
  };
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<FileRow[]>([]);
  const [offset, setOffset] = useState(0);
  const load = async () => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ files: FileRow[] }>({ path: `/admin/files?limit=200&offset=${offset}` });
      setRows(res.data.files);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Files konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [offset]);
  return (<div className="space-y-3">
    <div className="flex gap-3"><button disabled={loading || offset===0} onClick={()=>setOffset(v=>Math.max(0,v-200))}>Previous</button><span>{offset+1}–{offset+rows.length}</span><button disabled={loading || rows.length<200} onClick={()=>setOffset(v=>v+200)}>Next</button><button disabled={loading} onClick={()=>void load()}>Refresh</button></div>
    <DataTable<FileRow>
      loading={loading} rows={rows}
      columns={[
        { key: "workspaceName", label: "Workspace", render: (r) => r.workspaceName ?? "—" },
        { key: "fileName", label: "File", render: (r) => (
          <div>
            <div className="font-medium">{r.fileName}</div>
            <div className="text-xs text-slate-500 font-mono">{r.mimeType ?? "—"}</div>
          </div>
        ) },
        { key: "fileSizeBytes", label: "Size", render: (r) => r.fileSizeBytes == null ? "—" : sizeMB(r.fileSizeBytes) },
        { key: "download", label: "Download", render: (r) => currentUser?.adminCapabilities?.includes('files.read') && ['onboarding','record','omnichannel'].includes(r.source ?? '') ? <button disabled={downloading!==null} onClick={()=>void download(r)}>Download</button> : '—' },
        { key: "source", label: "Source", render: (r) => r.source ? <Pill tone="sky">{r.source}</Pill> : "—" },
        { key: "uploadedByEmail", label: "Uploaded by", render: (r) => r.uploadedByEmail ?? "—" },
        { key: "uploadedAt", label: "Uploaded", render: (r) => date(r.uploadedAt) },
        { key: "lastAccessedAt", label: "Last Access", render: (r) => dateOnly(r.lastAccessedAt) },
        { key: "purgeState", label: "Purge", render: (r) => (
          <div className="flex flex-wrap gap-1">
            {r.purgedAt ? <Pill tone="rose">Purged</Pill> : r.purgeScheduledAt ? <Pill tone="amber">Due: {dateOnly(r.purgeScheduledAt)}</Pill> : <Pill tone="emerald">Active</Pill>}
          </div>
        ) },
      ]}
    /></div>
  );
}

function SupportPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<SupportRow[]>([]);
  const load = async () => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ tickets: SupportRow[] }>({ path: "/admin/support?limit=200" });
      setRows(res.data.tickets);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Support tickets konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  return (
    <DataTable<SupportRow>
      loading={loading} rows={rows}
      columns={[
        { key: "workspaceName", label: "Workspace", render: (r) => r.workspaceName ?? "—" },
        { key: "subject", label: "Ticket", render: (r) => <a href="/admin/support" className="max-w-md truncate font-medium underline">{r.subject}</a> },
        { key: "status", label: "Status", render: (r) => <Pill tone={toneFromStatus(r.status)}>{r.status}</Pill> },
        { key: "priority", label: "Priority", render: (r) => <Pill tone={r.priority === "high" ? "rose" : r.priority === "medium" ? "amber" : "slate"}>{r.priority}</Pill> },
        { key: "category", label: "Category", render: (r) => r.category ? <Pill tone="sky">{r.category}</Pill> : "—" },
        { key: "requesterEmail", label: "Requester", render: (r) => r.requesterEmail ?? "—" },
        { key: "slaDueAt", label: "SLA", render: (r) => r.slaDueAt ? <span className={new Date(r.slaDueAt) < new Date() ? "text-rose-700" : ""}>{dateOnly(r.slaDueAt)}</span> : "—" },
        { key: "createdAt", label: "Created", render: (r) => date(r.createdAt) },
        { key: "closedAt", label: "Closed", render: (r) => dateOnly(r.closedAt) },
      ]}
    />
  );
}

function ErrorsPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ErrorRow[]>([]);
  const [selected, setSelected] = useState<ErrorRow | null>(null);
  const load = async () => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ errors: ErrorRow[] }>({ path: "/admin/errors?limit=200" });
      setRows(res.data.errors);
      setSelected((current) => res.data.errors.find((row) => row.id === current?.id) ?? res.data.errors[0] ?? null);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Error events konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const toneFromLevel = (level: string) =>
    /error|critical|fatal/i.test(level) ? "rose" : /warn/i.test(level) ? "amber" : /info/i.test(level) ? "sky" : "slate";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <button type="button" disabled={loading} onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"><RotateCcw size={14} className={loading ? "animate-spin" : undefined} /> Aktualisieren</button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <DataTable<ErrorRow>
          loading={loading} rows={rows}
          getRowKey={(row) => row.id}
          onRowClick={setSelected}
          selectedKey={selected?.id ?? null}
          columns={[
            { key: "level", label: "Level", render: (r) => <Pill tone={toneFromLevel(r.level)}>{r.level.toUpperCase()}</Pill> },
            { key: "source", label: "Source", render: (r) => r.source ? <Pill tone="violet">{r.source}</Pill> : "—" },
            { key: "message", label: "Message", render: (r) => (
              <div className="max-w-2xl">
                <div className="truncate font-mono text-xs">{r.message}</div>
                {(r.requestId || r.correlationId) ? (
                  <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-slate-400 font-mono">
                    {r.requestId ? <>req: {r.requestId}</> : null}
                    {r.correlationId ? <>corr: {r.correlationId}</> : null}
                  </div>
                ) : null}
              </div>
            ) },
            { key: "status", label: "Status", render: (r) => <Pill tone={toneFromStatus(r.status)}>{r.status}</Pill> },
            { key: "occurrenceCount", label: "Occurrences", render: (r) => <span className="font-mono font-semibold">{r.occurrenceCount}</span> },
            { key: "workspaceId", label: "WS", render: (r) => r.workspaceId ? <span className="font-mono text-[11px] text-slate-500">{r.workspaceId.slice(0, 8)}…</span> : "—" },
            { key: "createdAt", label: "First seen", render: (r) => date(r.createdAt) },
            { key: "resolvedAt", label: "Resolved", render: (r) => dateOnly(r.resolvedAt) },
          ]}
        />
        {selected ? (
          <DetailPanel
            title={`Error ${selected.level.toUpperCase()}`}
            rows={[
              { label: "Source", value: selected.source ?? "—" },
              { label: "Status", value: selected.status },
              { label: "Occurrences", value: selected.occurrenceCount },
              { label: "Request", value: selected.requestId ?? "—" },
              { label: "Correlation", value: selected.correlationId ?? "—" },
              { label: "Created", value: date(selected.createdAt) },
              { label: "Resolved", value: date(selected.resolvedAt) },
            ]}
            raw={selected}
          />
        ) : <EmptyPanel title="Kein Error ausgewählt" hint="Wähle links einen Error aus." />}
      </div>
    </div>
  );
}

function AuditPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<AuditRow[]>([]);
  const load = async () => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ logs: AuditRow[] }>({ path: "/admin/audit-logs?limit=200" });
      setRows(res.data.logs);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Audit logs konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  return (
    <DataTable<AuditRow>
      loading={loading} rows={rows}
      columns={[
        { key: "createdAt", label: "Time", render: (r) => date(r.createdAt) },
        { key: "actorType", label: "Actor", render: (r) => (
          <div>
            <Pill tone="violet">{r.actorType}</Pill>
            <div className="mt-1 font-mono text-[11px] text-slate-500">{r.actorId ? r.actorId.slice(0, 10) + "…" : "—"}</div>
          </div>
        ) },
        { key: "action", label: "Action", render: (r) => <div className="font-mono text-xs">{r.action}</div> },
        { key: "resourceType", label: "Resource", render: (r) => <Pill tone="sky">{r.resourceType}</Pill> },
        { key: "resourceId", label: "ID", render: (r) => r.resourceId ? <span className="font-mono text-[11px] text-slate-500">{String(r.resourceId).slice(0, 12)}…</span> : "—" },
        { key: "workspaceId", label: "Workspace", render: (r) => r.workspaceId ? <span className="font-mono text-[11px] text-slate-500">{r.workspaceId.slice(0, 10)}…</span> : "—" },
        { key: "result", label: "Result", render: (r) => <Pill tone={toneFromStatus(r.result)}>{r.result}</Pill> },
        { key: "ip", label: "IP", render: (r) => r.ipAddress ?? "—" },
      ]}
    />
  );
}

function JobsPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<JobRow[]>([]);
  const [selected, setSelected] = useState<JobRow | null>(null);
  const load = async () => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ jobs: JobRow[] }>({ path: "/admin/jobs?limit=200" });
      setRows(res.data.jobs);
      setSelected((current) => res.data.jobs.find((row) => row.id === current?.id) ?? res.data.jobs[0] ?? null);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Jobs konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <button type="button" disabled={loading} onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"><RotateCcw size={14} className={loading ? "animate-spin" : undefined} /> Aktualisieren</button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <DataTable<JobRow>
          loading={loading} rows={rows}
          getRowKey={(row) => row.id}
          onRowClick={setSelected}
          selectedKey={selected?.id ?? null}
          columns={[
            { key: "jobType", label: "Job", render: (r) => <div className="font-mono text-xs">{r.jobType}</div> },
            { key: "status", label: "Status", render: (r) => <Pill tone={toneFromStatus(r.status)}>{r.status}</Pill> },
            { key: "attempt", label: "Attempt", render: (r) => `${r.attempt}/${r.maxAttempts}` },
            { key: "workspaceId", label: "WS", render: (r) => r.workspaceId ? <span className="font-mono text-[11px] text-slate-500">{r.workspaceId.slice(0, 8)}…</span> : "—" },
            { key: "scheduledAt", label: "Scheduled", render: (r) => date(r.scheduledAt) },
            { key: "startedAt", label: "Started", render: (r) => date(r.startedAt) },
            { key: "completedAt", label: "Completed", render: (r) => dateOnly(r.completedAt) },
            { key: "failedAt", label: "Failed", render: (r) => r.failedAt ? (
              <div>
                <div className="text-rose-700">{date(r.failedAt)}</div>
                {r.errorMessage ? <div className="text-[11px] text-rose-600 max-w-xs truncate font-mono">{r.errorMessage}</div> : null}
              </div>
            ) : "—" },
            { key: "correlationId", label: "Corr", render: (r) => r.correlationId ? <span className="font-mono text-[10px] text-slate-500">{r.correlationId.slice(0, 10)}…</span> : "—" },
          ]}
        />
        {selected ? (
          <DetailPanel
            title={selected.jobType}
            rows={[
              { label: "Status", value: selected.status },
              { label: "Attempt", value: `${selected.attempt}/${selected.maxAttempts}` },
              { label: "Workspace", value: selected.workspaceId ?? "—" },
              { label: "Scheduled", value: date(selected.scheduledAt) },
              { label: "Started", value: date(selected.startedAt) },
              { label: "Completed", value: date(selected.completedAt) },
              { label: "Failed", value: date(selected.failedAt) },
            ]}
            raw={selected}
          />
        ) : <EmptyPanel title="Kein Job ausgewählt" hint="Wähle links einen Job aus." />}
      </div>
    </div>
  );
}

function SettingsPage({ onError }: { onError: (m: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<SettingRow[]>([]);
  const load = async () => {
    setLoading(true); onError("");
    try {
      const res = await requestApi<{ settings: SettingRow[] }>({ path: "/admin/settings" });
      setRows(res.data.settings);
    } catch (e) { onError(getFriendlyErrorMessage(e, "Settings konnten nicht geladen werden.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <div className="text-base font-semibold">System Settings</div>
            <div className="text-sm text-slate-500">Globale Plattform-Parameter (read-only View)</div>
          </div>
          <button type="button" disabled={loading} onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"><RotateCcw size={14} className={loading ? "animate-spin" : undefined} /> Aktualisieren</button>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? <div className="p-10 text-center text-slate-500">Loading…</div> :
            rows.length === 0 ? <div className="p-10 text-center text-slate-500">No settings.</div> :
            rows.map((s) => (
              <div key={s.key} className="flex items-start justify-between px-5 py-3 gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs text-slate-500">{s.key}</div>
                  <div className="mt-0.5 break-words font-medium">{s.value}</div>
                </div>
                <div className="text-right text-xs text-slate-500 shrink-0">
                  <div>{dateOnly(s.updatedAt)}</div>
                  <div>by {s.updatedBy ?? "system"}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="text-base font-semibold mb-2">Admin Info</div>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-center gap-2"><LayoutGrid size={16} className="text-slate-400" /> <span>Backend API prefix: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">/api/v1/admin/*</code></span></li>
          <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-slate-400" /> <span>Admin access is checked against server-assigned capabilities on every request.</span></li>
          <li className="flex items-center gap-2"><PlayCircle size={16} className="text-slate-400" /> <span>Plan actions call <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">PATCH /admin/workspaces/:id</code> mit body <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">{`{action, planKey?}`}</code></span></li>
          <li className="flex items-center gap-2"><Save size={16} className="text-slate-400" /> <span>All list queries support <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">limit</code>, <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">offset</code>, and for some <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">search</code>.</span></li>
        </ul>
      </div>
    </div>
  );
}
