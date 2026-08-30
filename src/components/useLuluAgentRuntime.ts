import { useEffect, useMemo, useState } from "react";
import { agentApi, type AgentRun, type IntelligenceBundle } from "../api/agents";
import { aiApi, type Conversation } from "../api/ai";
import { calendarApi, type CalendarAccount, type CalendarEvent } from "../api/calendar";
import { getFriendlyErrorMessage } from "../api/client";
import { emailApi, type EmailAccount, type EmailAutomationRule, type EmailDraft, type EmailThread } from "../api/email";
import { formatLiveDate } from "../api/live-panel-ui";
import { metricApi, type Metric } from "../api/metrics";
import { onboardingApi, type OnboardingSnapshot, type Platform } from "../api/onboarding";
import { getPageContract } from "../api/page-contracts";
import { listRecords, type WorkspaceRecord } from "../api/records";
import type { WorkspaceBootstrap } from "../api/types";
import { workspaceApi } from "../api/workspaces";
import { workspaceAppApi, type BillingState, type GoogleBusinessState, type GoogleReviewsManagerState } from "../api/workspace-app";
import { websitesApi, type WebsiteGenerationJob, type WebsiteSite } from "../api/websites";
import type { LuluAgentContract, LuluAgentUiState } from "../config/lulu-agent-registry";
import { useLanguage } from "../i18n/GlobalLanguageSwitcher";

export type LiveCard = {
  label: string;
  value: string;
  detail: string;
};

type SpecializedLiveData = {
  cards: LiveCard[];
  currentFocusDetail?: string;
  connectedSystemsDetail?: string;
  impactDetail?: string;
  activeJobCount?: number;
  pendingApprovalCount?: number;
  latestActivityAt?: string | null;
  runtimeStatusHint?: LuluAgentUiState;
};

type AgentRuntimeSnapshot = {
  bootstrap: WorkspaceBootstrap | null;
  platforms: Platform[];
  specializedLiveData: SpecializedLiveData | null;
  liveError: string;
  cachedAt: number;
};

type AgentRuntimeState = {
  liveLoading: boolean;
  liveError: string;
  visibleLiveCards: LiveCard[];
  runtimeStatus: LuluAgentUiState;
  latestActivityAt: string | null;
  currentFocusDetail: string;
  connectedSystemsDetail: string;
  impactDetail: string;
};

const AUDIENCE_PAGE_IDS = new Set(["breezily-wood-5980"]);
const GOOGLE_BUSINESS_SECTION_LABEL = "Google Business";
const WEBSITE_COMMERCE_SECTION_LABEL = "Website & Commerce";
const FINANCE_SECTION_LABEL = "Finance";
const CRM_SECTION_LABEL = "CRM";
const SALES_SECTION_LABEL = "Sales";
const EMAIL_SECTION_LABEL = "Email";
const CALENDAR_SECTION_LABEL = "Calendar";
const DASHBOARD_SECTION_LABEL = "Dashboard";
const AI_SECTION_LABEL = "AI";
const MARKETING_SECTION_LABEL = "Marketing";
const CACHE_TTL_MS = 30_000;

const runtimeCache = new Map<string, AgentRuntimeSnapshot>();
const inflightRuntimeLoads = new Map<string, Promise<AgentRuntimeSnapshot>>();

function interpolate(template: string, values: Array<string | number>) {
  return values.reduce<string>((message, value, index) => message.replace(`{{${index}}}`, String(value)), template);
}

function providerNames(platforms: readonly Platform[], limit: number) {
  return platforms.slice(0, limit).map((platform) => platform.name).join(" · ");
}

function listNames(items: readonly string[], limit: number) {
  return items.slice(0, limit).join(" · ");
}

function sumRecordValues(values: Record<string, number>) {
  return Object.values(values).reduce((total, value) => total + value, 0);
}

function isAudienceAgent(contract: LuluAgentContract) {
  return AUDIENCE_PAGE_IDS.has(contract.pageId);
}

function isGoogleBusinessAgent(contract: LuluAgentContract) {
  return contract.sectionLabel === GOOGLE_BUSINESS_SECTION_LABEL;
}

function isWebsiteCommerceAgent(contract: LuluAgentContract) {
  return contract.sectionLabel === WEBSITE_COMMERCE_SECTION_LABEL;
}

function isFinanceAgent(contract: LuluAgentContract) {
  return contract.sectionLabel === FINANCE_SECTION_LABEL || contract.pageId === "pure-minute-5446";
}

function isCrmAgent(contract: LuluAgentContract) {
  return contract.sectionLabel === CRM_SECTION_LABEL;
}

function isSalesAgent(contract: LuluAgentContract) {
  return contract.sectionLabel === SALES_SECTION_LABEL;
}

function isEmailAgent(contract: LuluAgentContract) {
  return contract.sectionLabel === EMAIL_SECTION_LABEL;
}

function isCalendarAgent(contract: LuluAgentContract) {
  return contract.sectionLabel === CALENDAR_SECTION_LABEL;
}

function isDashboardAgent(contract: LuluAgentContract) {
  return contract.sectionLabel === DASHBOARD_SECTION_LABEL;
}

function isAiAgent(contract: LuluAgentContract) {
  return contract.sectionLabel === AI_SECTION_LABEL;
}

function isMarketingAgent(contract: LuluAgentContract) {
  return contract.sectionLabel === MARKETING_SECTION_LABEL;
}

function buildRecordsLiveData(
  t: (key: string) => string,
  integrationCount: number,
  resourceLabel: string,
  resourceType: string,
  records: WorkspaceRecord[],
  emptyState: string,
  impactTemplate: string,
): SpecializedLiveData {
  const openRecords = records.filter((record) => !["done", "completed", "paid", "won", "archived"].includes(record.status));
  const stageNames = Array.from(new Set(records.map((record) => record.stage).filter((stage): stage is string => Boolean(stage)))).slice(0, 3);
  const tagNames = Array.from(new Set(records.flatMap((record) => record.tags).filter(Boolean))).slice(0, 3);
  return {
    cards: [
      {
        label: t("Live records"),
        value: interpolate(t("{{0}} records tracked"), [records.length]),
        detail: records.length > 0 ? listNames(records.slice(0, 3).map((record) => record.name), 3) : t(emptyState),
      },
      {
        label: t("Open workload"),
        value: interpolate(t("{{0}} records active"), [openRecords.length]),
        detail: stageNames.length > 0 ? interpolate(t("Top stages: {{0}}"), [listNames(stageNames, 3)]) : t("No staged work is recorded yet."),
      },
      {
        label: t("Signal tags"),
        value: interpolate(t("{{0}} tag cues"), [tagNames.length]),
        detail: tagNames.length > 0 ? interpolate(t("Dominant tags: {{0}}"), [listNames(tagNames, 3)]) : t("No dominant tags are mapped yet."),
      },
      {
        label: t("Resource type"),
        value: resourceType,
        detail: interpolate(t("Uses {{0}} connected systems around this workflow."), [integrationCount]),
      },
    ],
    currentFocusDetail: records[0] ? `${records[0].name} · ${records[0].status}` : t(emptyState),
    connectedSystemsDetail: interpolate(t("Uses {{0}} connected systems and {{1}} live records for {{2}}."), [integrationCount, records.length, resourceLabel.toLowerCase()]),
    impactDetail: interpolate(t(impactTemplate), [records.length, openRecords.length, tagNames.length]),
    latestActivityAt: records[0]?.updatedAt ?? null,
    runtimeStatusHint: records.length > 0 ? "monitoring" : undefined,
  };
}

function buildFinanceLiveData(
  t: (key: string) => string,
  integrationCount: number,
  billing: BillingState | null,
  records: WorkspaceRecord[],
  resourceType: string,
  pageLabel: string,
): SpecializedLiveData {
  const invoices = billing?.payg?.invoices ?? [];
  const paymentDue = invoices.filter((invoice) => ["payment_due", "payment_failed", "failed"].includes(invoice.status)).length;
  const activeSubscription = billing?.subscription;
  const base = buildRecordsLiveData(t, integrationCount, pageLabel, resourceType, records, "No finance records exist yet.", "Finance impact is grounded in {{0}} records, {{1}} active items and {{2}} signal tags.");
  return {
    ...base,
    cards: [
      {
        label: t("Billing plan"),
        value: activeSubscription?.planKey ?? t("No subscription"),
        detail: activeSubscription ? `${activeSubscription.status} · ${formatLiveDate(activeSubscription.currentPeriodEndsAt)}` : t("No active billing subscription is configured."),
      },
      {
        label: t("Invoice pressure"),
        value: interpolate(t("{{0}} invoices need attention"), [paymentDue]),
        detail: invoices.length > 0 ? interpolate(t("{{0}} pay-as-you-go invoices tracked."), [invoices.length]) : t("No pay-as-you-go invoices are recorded yet."),
      },
      ...base.cards.slice(0, 2),
    ],
    connectedSystemsDetail: interpolate(t("Uses {{0}} connected systems, billing state and {{1}} finance records."), [integrationCount, records.length]),
    impactDetail: activeSubscription ? interpolate(t("Finance impact is grounded in {{0}} records, {{1}} invoices and the {{2}} plan."), [records.length, invoices.length, activeSubscription.planKey]) : base.impactDetail,
  };
}

function buildEmailLiveData(
  t: (key: string) => string,
  integrationCount: number,
  accounts: EmailAccount[],
  threads: EmailThread[],
  drafts: EmailDraft[],
  automations: EmailAutomationRule[],
): SpecializedLiveData {
  const unreadThreads = threads.filter((thread) => thread.unread);
  const starredThreads = threads.filter((thread) => thread.starred);
  const enabledAutomations = automations.filter((rule) => rule.enabled);
  return {
    cards: [
      {
        label: t("Mailbox coverage"),
        value: interpolate(t("{{0}} accounts connected"), [accounts.length]),
        detail: accounts.length > 0 ? listNames(accounts.map((account) => account.emailAddress), 3) : t("No mailbox is connected yet."),
      },
      {
        label: t("Inbox pressure"),
        value: interpolate(t("{{0}} unread · {{1}} starred"), [unreadThreads.length, starredThreads.length]),
        detail: threads[0] ? threads[0].subject : t("No live email threads are available yet."),
      },
      {
        label: t("Draft queue"),
        value: interpolate(t("{{0}} drafts ready"), [drafts.length]),
        detail: drafts.length > 0 ? listNames(drafts.slice(0, 3).map((draft) => draft.subject || t("Untitled draft")), 3) : t("No email draft is waiting right now."),
      },
      {
        label: t("Automation load"),
        value: interpolate(t("{{0}} automations enabled"), [enabledAutomations.length]),
        detail: enabledAutomations.length > 0 ? listNames(enabledAutomations.map((rule) => rule.name), 3) : t("No email automation is enabled yet."),
      },
    ],
    currentFocusDetail: threads[0] ? `${threads[0].subject} · ${formatLiveDate(threads[0].latestAt)}` : t("Waiting for mailbox sync and the next inbound conversation."),
    connectedSystemsDetail: interpolate(t("Uses {{0}} connected systems, {{1}} email accounts and {{2}} live threads."), [integrationCount, accounts.length, threads.length]),
    impactDetail: interpolate(t("Email impact is grounded in {{0}} accounts, {{1}} unread threads and {{2}} active automations."), [accounts.length, unreadThreads.length, enabledAutomations.length]),
    latestActivityAt: threads[0]?.latestAt ?? null,
    activeJobCount: enabledAutomations.length,
    runtimeStatusHint: enabledAutomations.length > 0 ? "executing" : "monitoring",
  };
}

function buildCalendarLiveData(
  t: (key: string) => string,
  integrationCount: number,
  accounts: CalendarAccount[],
  events: CalendarEvent[],
): SpecializedLiveData {
  const upcomingEvents = events.filter((event) => new Date(event.startAt).getTime() >= Date.now());
  const providers = Array.from(new Set(accounts.map((account) => account.provider)));
  return {
    cards: [
      {
        label: t("Calendar coverage"),
        value: interpolate(t("{{0}} accounts connected"), [accounts.length]),
        detail: providers.length > 0 ? listNames(providers, 3) : t("No calendar provider is connected yet."),
      },
      {
        label: t("Upcoming load"),
        value: interpolate(t("{{0}} upcoming events"), [upcomingEvents.length]),
        detail: upcomingEvents[0] ? `${upcomingEvents[0].title} · ${formatLiveDate(upcomingEvents[0].startAt)}` : t("No upcoming events are synced yet."),
      },
      {
        label: t("Meeting intensity"),
        value: interpolate(t("{{0}} total events"), [events.length]),
        detail: events.length > 0 ? interpolate(t("{{0}} attendees across visible events."), [events.reduce((sum, event) => sum + event.attendeeCount, 0)]) : t("No event stream is available yet."),
      },
      {
        label: t("Sync health"),
        value: interpolate(t("{{0}} synced accounts"), [accounts.filter((account) => Boolean(account.lastSyncAt)).length]),
        detail: accounts.some((account) => account.lastErrorMessage) ? t("At least one calendar connection still needs attention.") : t("Calendar sync health looks stable."),
      },
    ],
    currentFocusDetail: upcomingEvents[0] ? `${upcomingEvents[0].title} · ${formatLiveDate(upcomingEvents[0].startAt)}` : t("Watching schedules, conflicts and booking flow."),
    connectedSystemsDetail: interpolate(t("Uses {{0}} connected systems, {{1}} calendar accounts and {{2}} synced events."), [integrationCount, accounts.length, events.length]),
    impactDetail: interpolate(t("Calendar impact is grounded in {{0}} accounts, {{1}} upcoming events and {{2}} providers."), [accounts.length, upcomingEvents.length, providers.length]),
    latestActivityAt: upcomingEvents[0]?.startAt ?? null,
    runtimeStatusHint: accounts.length > 0 ? "monitoring" : undefined,
  };
}

function buildDashboardLiveData(
  t: (key: string) => string,
  integrationCount: number,
  metrics: Metric[],
  agentRuns: AgentRun[],
  knowledge: IntelligenceBundle,
): SpecializedLiveData {
  const activeRuns = agentRuns.filter((run) => !["completed", "failed", "cancelled"].includes(run.status));
  const priorityItems = knowledge.snapshot?.priorities ?? [];
  const dataGaps = knowledge.snapshot?.dataGaps ?? [];
  const facts = knowledge.snapshot?.verifiedFacts ?? [];
  return {
    cards: [
      {
        label: t("Executive metrics"),
        value: interpolate(t("{{0}} KPIs live"), [metrics.length]),
        detail: metrics.length > 0 ? listNames(metrics.slice(0, 3).map((metric) => metric.name), 3) : t("No executive metrics are available yet."),
      },
      {
        label: t("Agent workforce"),
        value: interpolate(t("{{0}} active runs"), [activeRuns.length]),
        detail: activeRuns.length > 0 ? listNames(activeRuns.slice(0, 3).map((run) => run.goal), 3) : t("No active executive agent runs right now."),
      },
      {
        label: t("Priority stack"),
        value: interpolate(t("{{0}} priorities queued"), [priorityItems.length]),
        detail: priorityItems.length > 0 ? listNames(priorityItems, 3) : t("No strategic priorities are currently queued."),
      },
      {
        label: t("Data confidence"),
        value: interpolate(t("{{0}} facts · {{1}} gaps"), [facts.length, dataGaps.length]),
        detail: knowledge.snapshot?.confidence ? interpolate(t("Current intelligence confidence: {{0}}"), [knowledge.snapshot.confidence]) : t("No executive intelligence snapshot exists yet."),
      },
    ],
    currentFocusDetail: activeRuns[0] ? `${activeRuns[0].goal} · ${activeRuns[0].status}` : t("Watching business health, priorities and executive drift."),
    connectedSystemsDetail: interpolate(t("Uses {{0}} connected systems, {{1}} KPIs and {{2}} active agent runs."), [integrationCount, metrics.length, activeRuns.length]),
    impactDetail: interpolate(t("Executive impact is grounded in {{0}} KPIs, {{1}} verified facts and {{2}} strategic priorities."), [metrics.length, facts.length, priorityItems.length]),
    latestActivityAt: activeRuns[0]?.updatedAt ?? null,
    activeJobCount: activeRuns.length,
    runtimeStatusHint: activeRuns.length > 0 ? "analyzing" : "monitoring",
  };
}

function buildAiLiveData(
  t: (key: string) => string,
  integrationCount: number,
  conversations: Conversation[],
  agentRuns: AgentRun[],
  knowledge: IntelligenceBundle,
): SpecializedLiveData {
  const activeRuns = agentRuns.filter((run) => !["completed", "failed", "cancelled"].includes(run.status));
  const waitingApprovalRuns = agentRuns.filter((run) => run.status === "waiting_approval");
  const conversationTitles = conversations.slice(0, 3).map((conversation) => conversation.title || t("Untitled conversation"));
  return {
    cards: [
      {
        label: t("AI conversations"),
        value: interpolate(t("{{0}} live threads"), [conversations.length]),
        detail: conversations.length > 0 ? listNames(conversationTitles, 3) : t("No AI conversations exist yet."),
      },
      {
        label: t("Agent runs"),
        value: interpolate(t("{{0}} active runs"), [activeRuns.length]),
        detail: activeRuns.length > 0 ? listNames(activeRuns.slice(0, 3).map((run) => run.goal), 3) : t("No AI agent run is active right now."),
      },
      {
        label: t("Approval pressure"),
        value: interpolate(t("{{0}} runs waiting"), [waitingApprovalRuns.length]),
        detail: waitingApprovalRuns.length > 0 ? listNames(waitingApprovalRuns.slice(0, 3).map((run) => run.goal), 3) : t("No AI action is currently waiting for approval."),
      },
      {
        label: t("Knowledge depth"),
        value: interpolate(t("{{0}} sections loaded"), [knowledge.sections.length]),
        detail: knowledge.snapshot?.executiveSummary || t("No AI knowledge snapshot is available yet."),
      },
    ],
    currentFocusDetail: activeRuns[0] ? `${activeRuns[0].goal} · ${activeRuns[0].status}` : t("Watching conversations, agent runs and shared knowledge."),
    connectedSystemsDetail: interpolate(t("Uses {{0}} connected systems, {{1}} conversations and {{2}} knowledge sections."), [integrationCount, conversations.length, knowledge.sections.length]),
    impactDetail: interpolate(t("AI impact is grounded in {{0}} conversations, {{1}} active runs and {{2}} knowledge sections."), [conversations.length, activeRuns.length, knowledge.sections.length]),
    latestActivityAt: activeRuns[0]?.updatedAt ?? conversations[0]?.updatedAt ?? null,
    activeJobCount: activeRuns.length,
    pendingApprovalCount: waitingApprovalRuns.length,
    runtimeStatusHint: waitingApprovalRuns.length > 0 ? "needs_approval" : activeRuns.length > 0 ? "executing" : "monitoring",
  };
}

function buildAudienceLiveData(
  t: (key: string) => string,
  integrationCount: number,
  snapshot: OnboardingSnapshot,
  records: WorkspaceRecord[],
): SpecializedLiveData {
  const documentedSegments = snapshot.customerSegments.filter((segment) => segment.painPoints.length > 0 && segment.decisionCriteria.length > 0 && segment.buyingRoles.length > 0);
  const topSignalTags = Array.from(new Set(records.flatMap((record) => record.tags).filter(Boolean))).slice(0, 3);
  const topRecordNames = records.slice(0, 3).map((record) => record.name).filter(Boolean);
  return {
    cards: [
      {
        label: t("Audience model"),
        value: interpolate(t("{{0}} manual segments"), [snapshot.customerSegments.length]),
        detail: snapshot.customerSegments.length > 0 ? listNames(snapshot.customerSegments.map((segment) => segment.name), 3) : t("No manual segments documented yet."),
      },
      {
        label: t("Live validation"),
        value: interpolate(t("{{0}} audience records"), [records.length]),
        detail: topRecordNames.length > 0 ? interpolate(t("Top signals: {{0}}"), [listNames(topRecordNames, 3)]) : t("No live audience records yet."),
      },
      {
        label: t("Signal coverage"),
        value: interpolate(t("{{0}} strong cues"), [topSignalTags.length]),
        detail: topSignalTags.length > 0 ? interpolate(t("Top evidence: {{0}}"), [listNames(topSignalTags, 3)]) : t("No dominant audience signals mapped yet."),
      },
      {
        label: t("Activation readiness"),
        value: interpolate(t("{{0}} segments ready"), [documentedSegments.length]),
        detail: documentedSegments.length > 0 ? listNames(documentedSegments.map((segment) => segment.name), 3) : t("Audience segments still need stronger pain points, buying roles or criteria."),
      },
    ],
    currentFocusDetail: records[0] ? `${records[0].name} · ${records[0].status}` : interpolate(t("Runs {{0}} recurring jobs."), [snapshot.customerSegments.length || 1]),
    connectedSystemsDetail: interpolate(t("Uses {{0}} connected systems, {{1}} customer segments and {{2}} live records."), [integrationCount, snapshot.customerSegments.length, records.length]),
    impactDetail: interpolate(t("Audience impact is grounded in {{0}} segments, {{1}} live records and {{2}} offerings."), [snapshot.customerSegments.length, records.length, snapshot.offerings.length]),
    latestActivityAt: records[0]?.updatedAt ?? null,
    runtimeStatusHint: records.length > 0 ? "analyzing" : "monitoring",
  };
}

function buildGenericResourceSectionLiveData(
  t: (key: string) => string,
  integrationCount: number,
  contract: LuluAgentContract,
  resourceType: string,
  records: WorkspaceRecord[],
): SpecializedLiveData {
  return buildRecordsLiveData(
    t,
    integrationCount,
    contract.pageLabel,
    resourceType,
    records,
    "No live records exist yet.",
    "Operational impact is grounded in {{0}} records, {{1}} active items and {{2}} signal tags.",
  );
}

function buildGoogleBusinessLiveData(
  t: (key: string) => string,
  integrationCount: number,
  reviews: GoogleReviewsManagerState,
  business: GoogleBusinessState,
): SpecializedLiveData {
  const topTopics = reviews.insights.topTopics.slice(0, 3).map((topic) => topic.topic);
  return {
    cards: [
      {
        label: t("Review health"),
        value: reviews.summary.averageRating ? interpolate(t("{{0}} stars · {{1}} reviews"), [reviews.summary.averageRating.toFixed(1), reviews.summary.totalReviews]) : interpolate(t("{{0}} reviews tracked"), [reviews.summary.totalReviews]),
        detail: reviews.insights.headline || t("No review headline is available yet."),
      },
      {
        label: t("Reply queue"),
        value: interpolate(t("{{0}} unanswered · {{1}} priority"), [reviews.summary.unansweredCount, reviews.summary.priorityReviewCount]),
        detail: reviews.summary.unansweredCount > 0 ? t("The reputation agent still has customer replies to send.") : t("All visible reviews are currently answered."),
      },
      {
        label: t("Location coverage"),
        value: interpolate(t("{{0}} accounts · {{1}} locations"), [business.summary.accountCount, business.summary.locationCount]),
        detail: business.connected ? t("Google Business is connected and reachable.") : t("Google Business still needs a working connection."),
      },
      {
        label: t("Reputation risk"),
        value: interpolate(t("{{0}} negative · {{1}} mixed"), [reviews.summary.negativeCount, reviews.summary.mixedCount]),
        detail: topTopics.length > 0 ? interpolate(t("Top topics: {{0}}"), [listNames(topTopics, 3)]) : t("No topic clusters are available yet."),
      },
    ],
    currentFocusDetail: reviews.reviews[0] ? `${reviews.reviews[0].reviewerDisplayName} · ${reviews.reviews[0].urgency}` : t("Waiting for the next review sync."),
    connectedSystemsDetail: interpolate(t("Uses {{0}} connected systems, {{1}} Google accounts and {{2}} locations."), [integrationCount, business.summary.accountCount, business.summary.locationCount]),
    impactDetail: interpolate(t("Reputation impact is grounded in {{0}} reviews, {{1}} unanswered items and {{2}} locations."), [reviews.summary.totalReviews, reviews.summary.unansweredCount, business.summary.locationCount]),
    latestActivityAt: reviews.reviews[0]?.updateTime ?? reviews.reviews[0]?.createTime ?? null,
    pendingApprovalCount: reviews.summary.unansweredCount,
    runtimeStatusHint: reviews.summary.unansweredCount > 0 ? "needs_approval" : "monitoring",
  };
}

function isWebsiteCommercePlatform(platform: Platform) {
  const text = `${platform.integrationKey ?? ""} ${platform.name} ${platform.category}`.toLowerCase();
  return ["wordpress", "webflow", "shopify", "woocommerce", "commerce", "website", "store"].some((token) => text.includes(token));
}

function buildWebsiteCommerceLiveData(
  t: (key: string) => string,
  integrationCount: number,
  sites: WebsiteSite[],
  activeJobs: WebsiteGenerationJob[],
  platforms: Platform[],
): SpecializedLiveData {
  const totalDomains = sites.reduce((count, site) => count + site.domains.length, 0);
  const verifiedDomains = sites.reduce((count, site) => count + site.domains.filter((domain) => domain.status === "verified").length, 0);
  const connectedRelevantPlatforms = platforms.filter((platform) => isWebsiteCommercePlatform(platform) && ["connected", "syncing", "pending"].includes(platform.connectionStatus));
  const providerNamesList = Array.from(new Set(sites.map((site) => site.provider)));
  return {
    cards: [
      {
        label: t("Site estate"),
        value: interpolate(t("{{0}} sites tracked"), [sites.length]),
        detail: providerNamesList.length > 0 ? listNames(providerNamesList, 3) : t("No website or commerce site is connected yet."),
      },
      {
        label: t("Publishing jobs"),
        value: interpolate(t("{{0}} generation jobs active"), [activeJobs.length]),
        detail: activeJobs.length > 0 ? interpolate(t("Active generation jobs: {{0}}"), [listNames(activeJobs.map((job) => job.status), 3)]) : t("No generation job is active right now."),
      },
      {
        label: t("Domain health"),
        value: totalDomains > 0 ? interpolate(t("{{0}} / {{1}} domains verified"), [verifiedDomains, totalDomains]) : t("No domains connected yet."),
        detail: totalDomains > 0 ? interpolate(t("{{0}} domains still need attention."), [Math.max(totalDomains - verifiedDomains, 0)]) : t("Add a domain so Lulu can watch publishing and SSL health."),
      },
      {
        label: t("Provider coverage"),
        value: interpolate(t("{{0}} connected providers"), [connectedRelevantPlatforms.length]),
        detail: connectedRelevantPlatforms.length > 0 ? providerNames(connectedRelevantPlatforms, 3) : t("No web or commerce provider is connected yet."),
      },
    ],
    currentFocusDetail: activeJobs[0] ? `${activeJobs[0].status} · ${formatLiveDate(activeJobs[0].updatedAt)}` : t("Watching site sync, publishing and commerce health."),
    connectedSystemsDetail: interpolate(t("Uses {{0}} connected systems, {{1}} sites and {{2}} relevant providers."), [integrationCount, sites.length, connectedRelevantPlatforms.length]),
    impactDetail: interpolate(t("Web impact is grounded in {{0}} sites, {{1}} domains and {{2}} active jobs."), [sites.length, totalDomains, activeJobs.length]),
    latestActivityAt: activeJobs[0]?.updatedAt ?? sites[0]?.updatedAt ?? null,
    activeJobCount: activeJobs.length,
    runtimeStatusHint: activeJobs.length > 0 ? "executing" : connectedRelevantPlatforms.length > 0 ? "monitoring" : undefined,
  };
}

function resourceTypeForPage(contract: LuluAgentContract) {
  const pageContract = getPageContract(contract.pageId);
  if (pageContract?.kind === "resource") return pageContract.resourceType;
  if (isFinanceAgent(contract)) return "finance_invoices";
  if (isCrmAgent(contract)) return "crm_contacts";
  if (isSalesAgent(contract)) return "sales_deals";
  return null;
}

function createGenericCards(
  t: (key: string) => string,
  bootstrap: WorkspaceBootstrap | null,
  platforms: Platform[],
) {
  const connectedPlatforms = platforms.filter((platform) => ["connected", "syncing", "pending"].includes(platform.connectionStatus));
  const syncingPlatforms = platforms.filter((platform) => ["syncing", "pending"].includes(platform.connectionStatus));
  const brokenPlatforms = platforms.filter((platform) => ["error", "failed", "reauth_required"].includes(platform.connectionStatus.toLowerCase()));
  const totalProviderSignals = bootstrap ? sumRecordValues(bootstrap.integrations) : 0;
  return {
    cards: [
      {
        label: t("Connected providers"),
        value: interpolate(t("{{0}} providers live"), [connectedPlatforms.length]),
        detail: connectedPlatforms.length > 0 ? providerNames(connectedPlatforms, 3) : t("No provider is connected yet."),
      },
      {
        label: t("Active jobs"),
        value: interpolate(t("{{0}} jobs in motion"), [syncingPlatforms.length]),
        detail: syncingPlatforms.length > 0 ? providerNames(syncingPlatforms, 3) : t("No syncing or pending provider jobs right now."),
      },
      {
        label: t("Approval queue"),
        value: interpolate(t("{{0}} pending approvals"), [bootstrap?.approvals.pending ?? 0]),
        detail: interpolate(t("{{0}} unread notifications across the workspace."), [bootstrap?.notifications.unread ?? 0]),
      },
      {
        label: t("Live footprint"),
        value: interpolate(t("{{0}} records · {{1}} KPIs"), [bootstrap?.records.total ?? 0, bootstrap?.metrics.length ?? 0]),
        detail: interpolate(t("{{0}} integration signals are mapped in this workspace."), [totalProviderSignals]),
      },
    ],
    connectedPlatforms,
    activeJobCount: syncingPlatforms.length,
    pendingApprovalCount: bootstrap?.approvals.pending ?? 0,
    hasConnectionIssues: brokenPlatforms.length > 0,
    latestActivityAt: bootstrap?.recentActivity[0]?.createdAt ?? null,
  };
}

function allowedRuntimeStatus(contract: LuluAgentContract, status: LuluAgentUiState) {
  return contract.uiStates.includes(status);
}

function defaultRuntimeStatus(contract: LuluAgentContract) {
  return contract.uiStates[0] ?? "monitoring";
}

function resolveRuntimeStatus(
  contract: LuluAgentContract,
  signals: {
    liveError: string;
    hasConnectionIssues: boolean;
    connectedPlatformCount: number;
    activeJobCount: number;
    pendingApprovalCount: number;
    runtimeStatusHint?: LuluAgentUiState;
    latestActivityAt: string | null;
  },
) {
  if ((signals.liveError || signals.hasConnectionIssues) && allowedRuntimeStatus(contract, "attention_required")) {
    return "attention_required";
  }
  if (signals.connectedPlatformCount === 0 && contract.integrations.length > 0 && allowedRuntimeStatus(contract, "connecting")) {
    return "connecting";
  }
  if (signals.pendingApprovalCount > 0 && allowedRuntimeStatus(contract, "needs_approval")) {
    return "needs_approval";
  }
  if (signals.activeJobCount > 0) {
    if (signals.runtimeStatusHint && allowedRuntimeStatus(contract, signals.runtimeStatusHint)) {
      return signals.runtimeStatusHint;
    }
    for (const candidate of ["syncing", "executing", "drafting", "analyzing", "monitoring"] as const) {
      if (allowedRuntimeStatus(contract, candidate)) return candidate;
    }
  }
  if (signals.latestActivityAt && allowedRuntimeStatus(contract, "monitoring")) {
    return "monitoring";
  }
  if (allowedRuntimeStatus(contract, "completed")) return "completed";
  return defaultRuntimeStatus(contract);
}

async function loadSpecializedLiveData(
  workspaceId: string,
  contract: LuluAgentContract,
  platforms: Platform[],
  t: (key: string) => string,
) {
  if (isAudienceAgent(contract)) {
    const [snapshotResponse, recordsResponse] = await Promise.all([
      onboardingApi.snapshot(workspaceId),
      listRecords("marketing_audiences", "limit=25"),
    ]);
    return buildAudienceLiveData(t, contract.integrations.length, snapshotResponse.data, recordsResponse.data.items);
  }

  if (isGoogleBusinessAgent(contract)) {
    const [reviewsResponse, businessResponse] = await Promise.all([
      workspaceAppApi.googleReviews(workspaceId, { limit: 25 }),
      workspaceAppApi.googleBusiness(workspaceId),
    ]);
    return buildGoogleBusinessLiveData(t, contract.integrations.length, reviewsResponse.data, businessResponse.data);
  }

  if (isWebsiteCommerceAgent(contract)) {
    const sitesResponse = await websitesApi.list(workspaceId);
    const siteItems = sitesResponse.data.items;
    const activeJobResponses = await Promise.all(
      siteItems.slice(0, 3).map(async (site) => {
        try {
          return (await websitesApi.getActiveGenerationJob(workspaceId, site.id)).data;
        } catch {
          return null;
        }
      }),
    );
    return buildWebsiteCommerceLiveData(t, contract.integrations.length, siteItems, activeJobResponses.filter((job): job is WebsiteGenerationJob => Boolean(job)), platforms);
  }

  if (isFinanceAgent(contract)) {
    const resourceType = resourceTypeForPage(contract) ?? "finance_invoices";
    const [billingResponse, recordsResponse] = await Promise.all([
      workspaceAppApi.billing(workspaceId),
      listRecords(resourceType, "limit=25"),
    ]);
    return buildFinanceLiveData(t, contract.integrations.length, billingResponse.data, recordsResponse.data.items, resourceType, contract.pageLabel);
  }

  if (isCrmAgent(contract)) {
    const resourceType = resourceTypeForPage(contract) ?? "crm_contacts";
    const recordsResponse = await listRecords(resourceType, "limit=25");
    return buildRecordsLiveData(t, contract.integrations.length, contract.pageLabel, resourceType, recordsResponse.data.items, "No CRM records exist yet.", "CRM impact is grounded in {{0}} records, {{1}} active items and {{2}} signal tags.");
  }

  if (isSalesAgent(contract)) {
    const resourceType = resourceTypeForPage(contract) ?? "sales_deals";
    const recordsResponse = await listRecords(resourceType, "limit=25");
    return buildRecordsLiveData(t, contract.integrations.length, contract.pageLabel, resourceType, recordsResponse.data.items, "No sales records exist yet.", "Sales impact is grounded in {{0}} records, {{1}} active items and {{2}} signal tags.");
  }

  if (isEmailAgent(contract)) {
    const [accountsResponse, threadsResponse, draftsResponse, automationsResponse] = await Promise.all([
      emailApi.accounts(workspaceId),
      emailApi.threads(workspaceId, { limit: 25 }),
      emailApi.drafts(workspaceId),
      emailApi.automations(workspaceId),
    ]);
    return buildEmailLiveData(t, contract.integrations.length, accountsResponse.data.items, threadsResponse.data.items, draftsResponse.data.items, automationsResponse.data.items);
  }

  if (isCalendarAgent(contract)) {
    const overviewResponse = await calendarApi.overview(workspaceId, { limit: 25 });
    return buildCalendarLiveData(t, contract.integrations.length, overviewResponse.data.accounts, overviewResponse.data.events);
  }

  if (isDashboardAgent(contract)) {
    const [metricsResponse, agentRunsResponse, knowledgeResponse] = await Promise.all([
      metricApi.list(workspaceId),
      agentApi.list(workspaceId),
      agentApi.knowledge(workspaceId),
    ]);
    return buildDashboardLiveData(t, contract.integrations.length, metricsResponse.data.items, agentRunsResponse.data.items, knowledgeResponse.data);
  }

  if (isAiAgent(contract)) {
    const [conversationResponse, agentRunsResponse, knowledgeResponse] = await Promise.all([
      aiApi.conversations(workspaceId, "limit=25&archived=false"),
      agentApi.list(workspaceId),
      agentApi.knowledge(workspaceId),
    ]);
    return buildAiLiveData(t, contract.integrations.length, conversationResponse.data.items, agentRunsResponse.data.items, knowledgeResponse.data);
  }

  if (isMarketingAgent(contract) || getPageContract(contract.pageId)?.kind === "resource") {
    const resourceType = resourceTypeForPage(contract);
    if (!resourceType) return null;
    const recordsResponse = await listRecords(resourceType, "limit=25");
    return buildGenericResourceSectionLiveData(t, contract.integrations.length, contract, resourceType, recordsResponse.data.items);
  }

  return null;
}

function getRuntimeCacheKey(workspaceId: string, pageId: string, language: string) {
  return `${workspaceId}:${pageId}:${language}`;
}

async function loadRuntimeSnapshot(
  workspaceId: string,
  contract: LuluAgentContract,
  language: string,
  t: (key: string) => string,
) {
  const cacheKey = getRuntimeCacheKey(workspaceId, contract.pageId, language);
  const cached = runtimeCache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) return cached;

  const pending = inflightRuntimeLoads.get(cacheKey);
  if (pending) return pending;

  const loadPromise = (async () => {
    const [bootstrapResponse, platformResponse] = await Promise.all([
      workspaceApi.bootstrap(workspaceId),
      onboardingApi.platforms(workspaceId),
    ]);

    let specializedLiveData: SpecializedLiveData | null = null;
    let liveError = "";

    try {
      specializedLiveData = await loadSpecializedLiveData(workspaceId, contract, platformResponse.data.items, t);
    } catch (specializedError) {
      liveError = getFriendlyErrorMessage(specializedError, t("Page-specific live signals could not be loaded. Generic workspace signals remain available."));
    }

    const snapshot: AgentRuntimeSnapshot = {
      bootstrap: bootstrapResponse.data,
      platforms: platformResponse.data.items,
      specializedLiveData,
      liveError,
      cachedAt: Date.now(),
    };
    runtimeCache.set(cacheKey, snapshot);
    inflightRuntimeLoads.delete(cacheKey);
    return snapshot;
  })().catch((error) => {
    inflightRuntimeLoads.delete(cacheKey);
    throw error;
  });

  inflightRuntimeLoads.set(cacheKey, loadPromise);
  return loadPromise;
}

export function useLuluAgentRuntime(
  workspaceId: string | null,
  contract: LuluAgentContract,
  t: (key: string) => string,
): AgentRuntimeState {
  const language = useLanguage();
  const [snapshot, setSnapshot] = useState<AgentRuntimeSnapshot>({
    bootstrap: null,
    platforms: [],
    specializedLiveData: null,
    liveError: "",
    cachedAt: 0,
  });
  const [liveLoading, setLiveLoading] = useState(false);

  useEffect(() => {
    if (!workspaceId) {
      setSnapshot({
        bootstrap: null,
        platforms: [],
        specializedLiveData: null,
        liveError: "",
        cachedAt: 0,
      });
      setLiveLoading(false);
      return;
    }

    let active = true;

    const load = async () => {
      setLiveLoading(true);
      try {
        const next = await loadRuntimeSnapshot(workspaceId, contract, language, t);
        if (!active) return;
        setSnapshot(next);
      } catch (error) {
        if (!active) return;
        setSnapshot({
          bootstrap: null,
          platforms: [],
          specializedLiveData: null,
          liveError: getFriendlyErrorMessage(error, t("Live workspace data could not be loaded. Please refresh and try again.")),
          cachedAt: 0,
        });
      } finally {
        if (active) setLiveLoading(false);
      }
    };

    void load();
    const timer = window.setInterval(() => void load(), 45_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [contract, language, t, workspaceId]);

  return useMemo(() => {
    const generic = createGenericCards(t, snapshot.bootstrap, snapshot.platforms);
    const latestActivityAt = snapshot.specializedLiveData?.latestActivityAt ?? generic.latestActivityAt;
    const activeJobCount = Math.max(snapshot.specializedLiveData?.activeJobCount ?? 0, generic.activeJobCount);
    const pendingApprovalCount = Math.max(snapshot.specializedLiveData?.pendingApprovalCount ?? 0, generic.pendingApprovalCount);
    const runtimeStatus = resolveRuntimeStatus(contract, {
      liveError: snapshot.liveError,
      hasConnectionIssues: generic.hasConnectionIssues,
      connectedPlatformCount: generic.connectedPlatforms.length,
      activeJobCount,
      pendingApprovalCount,
      runtimeStatusHint: snapshot.specializedLiveData?.runtimeStatusHint,
      latestActivityAt,
    });
    const currentFocusDetail = snapshot.specializedLiveData?.currentFocusDetail
      ?? (snapshot.bootstrap?.recentActivity[0]
        ? `${snapshot.bootstrap.recentActivity[0].action} · ${snapshot.bootstrap.recentActivity[0].entityType}`
        : interpolate(t("Runs {{0}} recurring jobs."), [contract.jobs.length]));
    const connectedSystemsDetail = snapshot.specializedLiveData?.connectedSystemsDetail
      ?? (snapshot.bootstrap
        ? interpolate(t("Uses {{0}} connected systems and {{1}} live providers."), [contract.integrations.length, generic.connectedPlatforms.length])
        : interpolate(t("Uses {{0}} connected systems."), [contract.integrations.length]));
    const impactDetail = snapshot.specializedLiveData?.impactDetail
      ?? (snapshot.bootstrap
        ? interpolate(t("Live workspace impact is grounded in {{0}} records, {{1}} KPIs and {{2}} members."), [snapshot.bootstrap.records.total, snapshot.bootstrap.metrics.length, snapshot.bootstrap.members.total])
        : t("This is how Lulu measures whether this employee is helping the business."));

    return {
      liveLoading,
      liveError: snapshot.liveError,
      visibleLiveCards: snapshot.specializedLiveData?.cards ?? generic.cards,
      runtimeStatus,
      latestActivityAt,
      currentFocusDetail,
      connectedSystemsDetail,
      impactDetail,
    };
  }, [contract.integrations.length, contract.jobs.length, liveLoading, snapshot, t]);
}
