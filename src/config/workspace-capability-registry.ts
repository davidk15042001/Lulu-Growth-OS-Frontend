import { luluDropdownNavigation as generatedNavigation } from "../pages/fancily-leaf-1766/components/generated/LuluExecutiveDashboard";
import { RESOURCE_BY_SLUG } from "../api/page-contracts";
import { isPageAvailable, pagePath } from "../routing";

export type WorkspaceCapability =
  | "workspace.read" | "workspace.write" | "workspace.manage"
  | "members.read" | "members.invite" | "members.manage" | "members.remove"
  | "products.read" | "products.create" | "products.update" | "products.delete"
  | "crm.read" | "crm.manage" | "leads.read" | "leads.manage"
  | "opportunities.read" | "opportunities.manage"
  | "quotes.read" | "quotes.create" | "quotes.update" | "quotes.send" | "quotes.approve"
  | "invoices.read" | "invoices.create" | "invoices.issue" | "invoices.send" | "invoices.cancel"
  | "commercial_policy.read" | "commercial_policy.manage"
  | "orders.read" | "orders.manage" | "website.read" | "website.manage" | "website.publish"
  | "omnichannel.read" | "omnichannel.reply" | "omnichannel.manage"
  | "social.read" | "social.manage" | "social.publish"
  | "advertising.read" | "advertising.manage" | "advertising.budget_authorize"
  | "finance.read" | "finance.manage" | "payouts.request" | "payouts.manage"
  | "providers.read" | "providers.connect" | "providers.manage"
  | "agents.read" | "agents.manage" | "agents.execute"
  | "settings.read" | "settings.manage" | "audit.read";

export type DigitalDepartment =
  | "Executive" | "AI" | "CRM" | "Sales" | "Communications" | "Marketing"
  | "Advertising" | "Online Presence" | "Commerce" | "Finance" | "Operations" | "Analytics";

export type NavigationPage = { id: string; label: string; soon?: boolean };
export type NavigationSection = { label: string; pages: NavigationPage[] };

export type DigitalEmployeeRoute = {
  id: string;
  name: string;
  department: DigitalDepartment;
};

export type WorkspaceCapabilityRoute = {
  pageId: string;
  pageLabel: string;
  sectionLabel: string;
  capabilityKey: string;
  href: string;
  requiredPermissions: readonly WorkspaceCapability[];
  employee: DigitalEmployeeRoute;
  recordQueryParam: "recordId";
};

export const DASHBOARD_LABEL = "Dashboard";
export const STATISTICS_LABEL = "Statistiken";
export const WEBSITE_AND_COMMERCE_LABEL = "Website & Commerce";
export const FINANCE_LABEL = "Finance";
export const SETTINGS_LABEL = "Settings";
export const AI_LABEL = "AI";
export const CRM_LABEL = "CRM";
export const CRM_LANDING_PAGE_ID = "sturdy-month-1562";
export const CRM_PARTNERS_PAGE_ID = "partner-operations-9020";
export const OMNICHANNEL_LABEL = "OmniChannel";
export const DIRECT_SECTION_LABELS = new Set([AI_LABEL, OMNICHANNEL_LABEL]);

// Website work is owned and executed by Lulu itself. Former provider pages
// are retired and are not part of customer navigation.
const LEGACY_EXTERNAL_WEBSITE_PAGE_IDS = new Set([
  "website-wordpress-jetpack-9013",
  "website-webflow-9014",
  "website-pages-cms-9015",
  "website-posts-9016",
  "website-media-assets-9017",
  "website-domains-9018",
]);

const MANAGED_WEBSITE_NAVIGATION_PAGES: NavigationPage[] = [
  { id: "lulu-website-editor-9012", label: "Website" },
];

const SETTINGS_PAGE_IDS = new Set(["rich-field-1880"]);
const LEGACY_CRM_COMPANIES_PAGE_ID = "kindly-pool-8785";
const LABEL_OVERRIDES = new Map([
  ["glad-coast-1428", "Integrations"],
  ["fresh-tide-9404", "Verbindungen"],
  [CRM_LANDING_PAGE_ID, "Companies"],
]);

const SECTION_METADATA: Readonly<Record<string, {
  department: DigitalDepartment;
  employee: string;
  readPermission: WorkspaceCapability;
  capabilityPrefix: string;
}>> = {
  Dashboard: { department: "Executive", employee: "Executive Orchestrator", readPermission: "workspace.read", capabilityPrefix: "executive" },
  Statistiken: { department: "Analytics", employee: "Business Intelligence Analyst", readPermission: "workspace.read", capabilityPrefix: "analytics" },
  AI: { department: "AI", employee: "AI Operations Manager", readPermission: "agents.read", capabilityPrefix: "agents" },
  Intelligence: { department: "Analytics", employee: "Business Intelligence Analyst", readPermission: "workspace.read", capabilityPrefix: "intelligence" },
  CRM: { department: "CRM", employee: "CRM Manager", readPermission: "crm.read", capabilityPrefix: "crm" },
  Sales: { department: "Sales", employee: "Sales Operations Manager", readPermission: "leads.read", capabilityPrefix: "sales" },
  Email: { department: "Communications", employee: "Email Specialist", readPermission: "workspace.read", capabilityPrefix: "email" },
  Calendar: { department: "Operations", employee: "Calendar Coordinator", readPermission: "workspace.read", capabilityPrefix: "calendar" },
  OmniChannel: { department: "Communications", employee: "OmniChannel Manager", readPermission: "omnichannel.read", capabilityPrefix: "omnichannel" },
  Marketing: { department: "Marketing", employee: "Marketing Manager", readPermission: "workspace.read", capabilityPrefix: "marketing" },
  Advertising: { department: "Advertising", employee: "Paid Acquisition Specialist", readPermission: "advertising.read", capabilityPrefix: "advertising" },
  "Website & Commerce": { department: "Online Presence", employee: "Online Presence Manager", readPermission: "website.read", capabilityPrefix: "online_presence" },
  Finance: { department: "Finance", employee: "Financial Operations Manager", readPermission: "finance.read", capabilityPrefix: "finance" },
  Settings: { department: "Operations", employee: "Workspace Operations Manager", readPermission: "settings.read", capabilityPrefix: "settings" },
};

const PAGE_METADATA: Readonly<Record<string, Partial<{
  department: DigitalDepartment;
  employee: string;
  capabilityKey: string;
  readPermission: WorkspaceCapability;
}>>> = {
  [CRM_LANDING_PAGE_ID]: { department: "CRM", employee: "Company Intelligence Specialist", capabilityKey: "crm.companies", readPermission: "crm.read" },
  [CRM_PARTNERS_PAGE_ID]: { department: "CRM", employee: "Partner Operations Manager", capabilityKey: "crm.partners", readPermission: "crm.read" },
  omnichannel: { department: "Communications", employee: "OmniChannel Manager", capabilityKey: "omnichannel.conversations", readPermission: "omnichannel.read" },
  "lulu-email-portal-9013": { department: "Communications", employee: "Email Specialist", capabilityKey: "communications.email", readPermission: "workspace.read" },
  "lulu-calendar-portal-9014": { department: "Operations", employee: "Calendar Coordinator", capabilityKey: "operations.calendar", readPermission: "workspace.read" },
  "nicely-ocean-1051": { department: "Commerce", employee: "Product Manager", capabilityKey: "commerce.products", readPermission: "products.read" },
  "wondrous-cloud-1355": { department: "Marketing", employee: "Social Publishing Specialist", capabilityKey: "marketing.social_publishing", readPermission: "social.read" },
  "richly-forest-5832": { department: "Commerce", employee: "Category Manager", capabilityKey: "commerce.categories", readPermission: "products.read" },
  "mightily-shore-7108": { department: "Commerce", employee: "Order Manager", capabilityKey: "commerce.orders", readPermission: "orders.read" },
  "smart-village-1099": { department: "Commerce", employee: "Inventory Manager", capabilityKey: "commerce.inventory", readPermission: "orders.read" },
  "purely-dusk-2409": { department: "Commerce", employee: "Fulfillment Manager", capabilityKey: "commerce.fulfillment", readPermission: "orders.read" },
  "breezy-soil-2475": { department: "Finance", employee: "Invoice Manager", capabilityKey: "finance.invoices", readPermission: "invoices.read" },
  "tender-creek-3139": { department: "Sales", employee: "Quote Specialist", capabilityKey: "sales.quotes", readPermission: "quotes.read" },
  "daring-brook-9034": { department: "Online Presence", employee: "Reviews & Reputation Manager", capabilityKey: "online_presence.reviews", readPermission: "website.read" },
  "lulu-website-editor-9012": { department: "Online Presence", employee: "Website Editor", capabilityKey: "online_presence.editor", readPermission: "website.read" },
  "lulu-website-preview-9012": { department: "Online Presence", employee: "Website Preview Manager", capabilityKey: "online_presence.preview", readPermission: "website.read" },
  "lulu-website-media-9017": { department: "Online Presence", employee: "Website Media Manager", capabilityKey: "online_presence.media", readPermission: "website.read" },
  "lulu-website-domains-9018": { department: "Online Presence", employee: "Domain Manager", capabilityKey: "online_presence.domains", readPermission: "website.read" },
  "lulu-website-portal-9012": { department: "Online Presence", employee: "Website Manager", capabilityKey: "online_presence.website", readPermission: "website.read" },
  "fresh-tide-9404": { department: "Operations", employee: "Integration Manager", capabilityKey: "operations.connections", readPermission: "providers.read" },
  "glad-coast-1428": { department: "Operations", employee: "Integration Manager", capabilityKey: "operations.integrations", readPermission: "providers.read" },
  "pure-minute-5446": { department: "Operations", employee: "Billing & Usage Manager", capabilityKey: "operations.billing", readPermission: "workspace.read" },
  profile: { department: "Operations", employee: "Workspace Operations Manager", capabilityKey: "settings.profile", readPermission: "settings.read" },
  support: { department: "Operations", employee: "Customer Support Specialist", capabilityKey: "operations.support", readPermission: "workspace.read" },
};

function identifier(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

/**
 * Employee keys are persisted by the Office service, but older workspaces
 * (and a few imported rosters) used underscores or display-name casing. Keep
 * the UI route registry tolerant of those representations so a real employee
 * never falls back to the generic "Workspace unavailable" state just because
 * its identifier was serialized differently.
 */
function normalizeEmployeeKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function navigationPageLabel(page: NavigationPage) {
  return LABEL_OVERRIDES.get(page.id) ?? page.label;
}

function createWorkspaceNavigationSections(): { all: NavigationSection[]; visible: NavigationSection[] } {
  const sections: NavigationSection[] = (generatedNavigation as readonly { label: string; pages: readonly NavigationPage[] }[])
    .map((section) => ({
      label: section.label === DASHBOARD_LABEL ? STATISTICS_LABEL : section.label,
      pages: section.pages
        .filter((page) => isPageAvailable(page.id) && page.label !== "Revenue" && page.id !== "nicely-land-1864" && !LEGACY_EXTERNAL_WEBSITE_PAGE_IDS.has(page.id))
        .map((page) => ({ ...page, label: navigationPageLabel(page) })),
    }))
    .filter((section) => section.label !== "Revenue" && section.pages.length > 0);

  const crm = sections.find((section) => section.label === CRM_LABEL);
  if (crm) crm.pages = crm.pages.filter((page) => page.id !== LEGACY_CRM_COMPANIES_PAGE_ID);
  if (crm) crm.pages = [...crm.pages, { id: CRM_PARTNERS_PAGE_ID, label: "Partnernetzwerk" }];

  const ai = sections.find((section) => section.label === AI_LABEL);
  let settings = sections.find((section) => section.label === SETTINGS_LABEL);
  if (!settings) {
    settings = { label: SETTINGS_LABEL, pages: [] };
    sections.push(settings);
  }
  if (ai) {
    settings.pages = [...settings.pages, ...ai.pages.filter((page) => SETTINGS_PAGE_IDS.has(page.id))];
    ai.pages = ai.pages.filter((page) => !SETTINGS_PAGE_IDS.has(page.id));
  }
  settings.pages = [...settings.pages, { id: "profile", label: "Profile" }, { id: "support", label: "Support" }];

  if (!sections.some((section) => section.label === OMNICHANNEL_LABEL)) {
    const emailIndex = sections.findIndex((section) => section.label === "Email");
    sections.splice(emailIndex < 0 ? 0 : emailIndex + 1, 0, { label: OMNICHANNEL_LABEL, pages: [{ id: "omnichannel", label: "Inbox" }] });
  }

  const finance = sections.find((section) => section.label === FINANCE_LABEL);
  if (finance && !finance.pages.some((page) => page.id === "quietly-stone-4158")) {
    finance.pages = [{ id: "quietly-stone-4158", label: "Finance" }, ...finance.pages];
  }

  const website = sections.find((section) => section.label === WEBSITE_AND_COMMERCE_LABEL);
  if (website) {
    website.pages = [
      ...MANAGED_WEBSITE_NAVIGATION_PAGES,
      ...website.pages.filter((page) => page.id !== "lulu-website-portal-9012"),
    ];
  }

  const all = sections.filter((section) => section.pages.length > 0)
    .map((section) => ({ ...section, pages: section.pages.map((page) => ({ ...page })) }));
  const visible = sections.filter((section) => section.pages.length > 0 && section.label !== STATISTICS_LABEL);
  const financeIndex = visible.findIndex((section) => section.label === FINANCE_LABEL);
  if (financeIndex >= 0) {
    const [financeSection] = visible.splice(financeIndex, 1);
    const settingsIndex = visible.findIndex((section) => section.label === SETTINGS_LABEL);
    visible.splice(settingsIndex < 0 ? visible.length : settingsIndex, 0, financeSection!);
  }
  return { all, visible };
}

const navigation = createWorkspaceNavigationSections();

export function getWorkspaceNavigationSections(): NavigationSection[] {
  return navigation.visible.map((section) => ({ ...section, pages: section.pages.map((page) => ({ ...page })) }));
}

const generatedWorkspaceCapabilityRoutes: WorkspaceCapabilityRoute[] = navigation.all.flatMap((section) => section.pages.map((page) => {
  const sectionMetadata = SECTION_METADATA[section.label] ?? SECTION_METADATA.Dashboard!;
  const pageMetadata = PAGE_METADATA[page.id] ?? {};
  const department = pageMetadata.department ?? sectionMetadata.department;
  const employeeName = pageMetadata.employee ?? `${navigationPageLabel(page)} Specialist`;
  return {
    pageId: page.id,
    pageLabel: navigationPageLabel(page),
    sectionLabel: section.label,
    capabilityKey: pageMetadata.capabilityKey ?? `${sectionMetadata.capabilityPrefix}.${identifier(page.label)}`,
    href: pagePath(page.id),
    requiredPermissions: [pageMetadata.readPermission ?? sectionMetadata.readPermission],
    employee: { id: `${identifier(department)}.${identifier(employeeName)}`, name: employeeName, department },
    recordQueryParam: "recordId" as const,
  };
}));

// Some operational workspaces are intentionally hidden from the sidebar
// (Finance is agent-managed), but they remain canonical destinations for the
// corresponding Digital Employee panels. Keep them in the same route registry
// so Office → employee → Workspace never degrades to a false unavailable state.
const hiddenEmployeeWorkspaceRoutes: WorkspaceCapabilityRoute[] = [
  {
    pageId: "lulu-website-portal-9012",
    pageLabel: "Website",
    sectionLabel: WEBSITE_AND_COMMERCE_LABEL,
    capabilityKey: "online_presence.website",
    href: pagePath("lulu-website-portal-9012"),
    requiredPermissions: ["website.read"],
    employee: { id: "online_presence.website_manager", name: "Website Manager", department: "Online Presence" },
    recordQueryParam: "recordId",
  },
  {
    pageId: "lulu-website-preview-9012",
    pageLabel: "Website Preview",
    sectionLabel: WEBSITE_AND_COMMERCE_LABEL,
    capabilityKey: "online_presence.preview",
    href: pagePath("lulu-website-preview-9012"),
    requiredPermissions: ["website.read"],
    employee: { id: "online_presence.website_preview_manager", name: "Website Preview Manager", department: "Online Presence" },
    recordQueryParam: "recordId",
  },
  {
    pageId: "lulu-website-media-9017",
    pageLabel: "Website Media",
    sectionLabel: WEBSITE_AND_COMMERCE_LABEL,
    capabilityKey: "online_presence.media",
    href: pagePath("lulu-website-media-9017"),
    requiredPermissions: ["website.read"],
    employee: { id: "online_presence.website_media_manager", name: "Website Media Manager", department: "Online Presence" },
    recordQueryParam: "recordId",
  },
  {
    pageId: "lulu-website-domains-9018",
    pageLabel: "Domains",
    sectionLabel: WEBSITE_AND_COMMERCE_LABEL,
    capabilityKey: "online_presence.domains",
    href: pagePath("lulu-website-domains-9018"),
    requiredPermissions: ["website.read"],
    employee: { id: "online_presence.domain_manager", name: "Domain Manager", department: "Online Presence" },
    recordQueryParam: "recordId",
  },
];

export const workspaceCapabilityRoutes: readonly WorkspaceCapabilityRoute[] = [
  ...generatedWorkspaceCapabilityRoutes,
  ...hiddenEmployeeWorkspaceRoutes,
];

const routesByPageId = new Map(workspaceCapabilityRoutes.map((route) => [route.pageId, route]));
const routesByCapabilityKey = new Map(workspaceCapabilityRoutes.map((route) => [route.capabilityKey, route]));

const PERMISSION_WORKSPACE_PAGE: Readonly<Record<string, string>> = {
  "agents.read": "fresh-moon-5374",
  "agents.manage": "fresh-moon-5374",
  "agents.execute": "fresh-moon-5374",
  "audit.read": "proud-rain-4772",
  "crm.read": CRM_LANDING_PAGE_ID,
  "crm.manage": CRM_LANDING_PAGE_ID,
  "leads.read": "softly-autumn-9038",
  "leads.manage": "softly-autumn-9038",
  "quotes.read": "tender-creek-3139",
  "quotes.create": "tender-creek-3139",
  "invoices.read": "breezy-soil-2475",
  "invoices.create": "breezy-soil-2475",
  "omnichannel.read": "omnichannel",
  "omnichannel.reply": "omnichannel",
  "omnichannel.manage": "omnichannel",
  "social.read": "wondrous-cloud-1355",
  "social.manage": "wondrous-cloud-1355",
  "social.publish": "wondrous-cloud-1355",
  "advertising.read": "wise-brook-1762",
  "advertising.manage": "wise-brook-1762",
  "website.read": "lulu-website-portal-9012",
  "website.manage": "lulu-website-portal-9012",
  "website.publish": "lulu-website-portal-9012",
  "products.read": "nicely-ocean-1051",
  "products.update": "nicely-ocean-1051",
  "finance.read": "quietly-stone-4158",
  "providers.read": "fresh-tide-9404",
  "providers.manage": "fresh-tide-9404",
  "settings.read": "profile",
  "settings.manage": "profile",
  "workspace.read": "fancily-leaf-1766",
  "workspace.write": "fancily-leaf-1766",
};

const OBJECT_WORKSPACE_PAGE: Readonly<Record<string, string>> = {
  company: CRM_LANDING_PAGE_ID,
  companies: CRM_LANDING_PAGE_ID,
  crm_company: CRM_LANDING_PAGE_ID,
  crm_companies: CRM_LANDING_PAGE_ID,
  crm_partners: CRM_PARTNERS_PAGE_ID,
  crm_partner_reviews: CRM_PARTNERS_PAGE_ID,
  crm_partner_work_orders: CRM_PARTNERS_PAGE_ID,
  customer: CRM_LANDING_PAGE_ID,
  customers: CRM_LANDING_PAGE_ID,
  lead: "softly-autumn-9038",
  leads: "softly-autumn-9038",
  quote: "tender-creek-3139",
  quotes: "tender-creek-3139",
  invoice: "breezy-soil-2475",
  invoices: "breezy-soil-2475",
  product: "nicely-ocean-1051",
  products: "nicely-ocean-1051",
  order: "mightily-shore-7108",
  orders: "mightily-shore-7108",
  commerce_order: "mightily-shore-7108",
  inventory: "smart-village-1099",
  inventory_level: "smart-village-1099",
  inventory_location: "smart-village-1099",
  fulfillment: "mightily-shore-7108",
  commerce_fulfillment: "mightily-shore-7108",
  conversation: "omnichannel",
  omnichannel_conversation: "omnichannel",
  website: "lulu-website-portal-9012",
  // CMS pages and posts are now owned by the managed Lulu website editor.
  // Keep their object deep-links pointed at that canonical surface even
  // though the former standalone provider pages are intentionally hidden.
  page: "lulu-website-editor-9012",
  post: "lulu-website-editor-9012",
  review: "daring-brook-9034",
  campaign: "wise-brook-1762",
  social_account: "wondrous-cloud-1355",
  social_content: "wondrous-cloud-1355",
  social_publication: "wondrous-cloud-1355",
  social_publication_job: "wondrous-cloud-1355",
  integration: "fresh-tide-9404",
  provider_connection: "fresh-tide-9404",
};

/**
 * Stable Office identities are a safer default than guessing from a broad
 * capability such as workspace.read. Explicit page:* identities supplied by
 * the backend take precedence over this compatibility map.
 */
const EMPLOYEE_WORKSPACE_PAGE: Readonly<Record<string, string>> = {
  "executive-orchestrator": "fresh-moon-5374",
  "security-policy-auditor": "proud-rain-4772",
  "outcome-quality-auditor": "fresh-moon-5374",
  "company-intelligence-specialist": CRM_LANDING_PAGE_ID,
  "crm-manager": CRM_LANDING_PAGE_ID,
  "customer-manager": CRM_LANDING_PAGE_ID,
  "lead-generation-specialist": "softly-autumn-9038",
  "lead-qualification-specialist": "softly-autumn-9038",
  "opportunity-manager": "softly-autumn-9038",
  "sales-representative": "softly-autumn-9038",
  "follow-up-specialist": "softly-autumn-9038",
  "quote-specialist": "tender-creek-3139",
  "omnichannel-manager": "omnichannel",
  "customer-communication-specialist": "omnichannel",
  "customer-support-specialist": "omnichannel",
  "email-specialist": "lulu-email-portal-9013",
  "calendar-coordinator": "lulu-calendar-portal-9014",
  "marketing-manager": "wondrous-cloud-1355",
  "content-specialist": "lulu-website-editor-9012",
  "brand-content-strategist": "lulu-website-editor-9012",
  "social-publishing-specialist": "wondrous-cloud-1355",
  "paid-acquisition-specialist": "wise-brook-1762",
  "website-manager": "lulu-website-portal-9012",
  "pages-cms-manager": "lulu-website-editor-9012",
  "media-assets-manager": "lulu-website-editor-9012",
  "domain-manager": "lulu-website-editor-9012",
  "reviews-reputation-manager": "daring-brook-9034",
  "search-visibility-manager": "lulu-website-editor-9012",
  "product-manager": "nicely-ocean-1051",
  "premium-media-producer": "nicely-ocean-1051",
  "category-manager": "richly-forest-5832",
  "store-manager": "mightily-shore-7108",
  "order-manager": "mightily-shore-7108",
  "inventory-manager": "smart-village-1099",
  "fulfillment-manager": "purely-dusk-2409",
  "invoice-manager": "breezy-soil-2475",
  "finance-operations-manager": "pure-minute-5446",
  "billing-usage-manager": "pure-minute-5446",
  "automation-manager": "fresh-moon-5374",
  "operations-manager": "fresh-tide-9404",
  "bookkeeping-manager": "quietly-stone-4158",
  "integration-manager": "fresh-tide-9404",
  "business-intelligence-analyst": "serene-cloud-7079",
  "analytics-manager": "serene-cloud-7079",
  "commerce-analytics-manager": "serene-cloud-7079",
};

export function getWorkspaceCapabilityRoute(pageId: string) {
  return routesByPageId.get(pageId) ?? null;
}

export function getWorkspaceRouteForCapability(capabilityKey: string) {
  const exact = routesByCapabilityKey.get(capabilityKey);
  if (exact) return exact;
  const pageId = PERMISSION_WORKSPACE_PAGE[capabilityKey];
  return pageId ? getWorkspaceCapabilityRoute(pageId) : null;
}

export function getWorkspaceRouteForObjectType(objectType: string | null | undefined) {
  if (!objectType) return null;
  const normalized = objectType.toLowerCase().replace(/[.-]/g, "_");
  const pageId = OBJECT_WORKSPACE_PAGE[normalized]
    ?? OBJECT_WORKSPACE_PAGE[normalized.replace(/^canonical_/, "")]
    ?? OBJECT_WORKSPACE_PAGE[normalized.replace(/_records?$/, "")]
    ?? Object.entries(RESOURCE_BY_SLUG).find(([candidatePageId, resourceType]) => (
      resourceType.toLowerCase() === normalized && isPageAvailable(candidatePageId)
    ))?.[0];
  return pageId ? getWorkspaceCapabilityRoute(pageId) : null;
}

export function canReadWorkspaceRoute(
  route: WorkspaceCapabilityRoute | null | undefined,
  currentUserCapabilities: readonly string[] | null | undefined,
) {
  if (!route || !currentUserCapabilities) return false;
  const granted = new Set(currentUserCapabilities);
  return route.requiredPermissions.every((permission) => granted.has(permission));
}

function getWorkspaceRouteForEmployeeIdentity(
  employeeKey: string | null | undefined,
  sourceAgentIds: readonly string[] | null | undefined,
) {
  for (const sourceAgentId of sourceAgentIds ?? []) {
    const normalizedSource = sourceAgentId.trim();
    if (!normalizedSource.toLowerCase().startsWith("page:")) continue;
    const route = getWorkspaceCapabilityRoute(normalizedSource.slice("page:".length));
    if (route) return route;
  }
  const normalizedKey = employeeKey ? normalizeEmployeeKey(employeeKey) : "";
  const keyCandidates = employeeKey
    ? [
        employeeKey,
        normalizedKey,
        employeeKey.replaceAll("_", "-"),
        ...employeeKey.split(/[.:/\\]/).map(normalizeEmployeeKey),
      ].filter(Boolean)
    : [];
  const pageId = keyCandidates.map((candidate) => EMPLOYEE_WORKSPACE_PAGE[candidate]).find(Boolean)
    ?? Object.entries(EMPLOYEE_WORKSPACE_PAGE).find(([candidate]) => normalizedKey.endsWith(`-${candidate}`))?.[1];
  return pageId ? getWorkspaceCapabilityRoute(pageId) : null;
}

export function resolveEmployeeWorkspaceRoute(input: {
  employeeKey?: string | null;
  sourceAgentIds?: readonly string[];
  capabilityKeys?: readonly string[];
  relatedObjectType?: string | null;
  pageId?: string | null;
  currentUserCapabilities?: readonly string[];
  /**
   * The Office drawer is a canonical control surface over the same backend
   * Workspace. A missing/stale bootstrap capability list must not hide a
   * mapped employee there; the destination still enforces authorization on
   * every API request. Other navigation affordances keep strict client-side
   * permission filtering by default.
   */
  allowKnownEmployeeRoute?: boolean;
}) {
  const candidates = [
    getWorkspaceRouteForObjectType(input.relatedObjectType),
    input.pageId ? getWorkspaceCapabilityRoute(input.pageId) : null,
    getWorkspaceRouteForEmployeeIdentity(input.employeeKey, input.sourceAgentIds),
    ...(input.capabilityKeys
      ?.filter((capabilityKey) => capabilityKey !== "workspace.read")
      .map(getWorkspaceRouteForCapability) ?? []),
  ];
  const permitted = candidates.find((route) => canReadWorkspaceRoute(route, input.currentUserCapabilities));
  if (permitted) return permitted;
  if (input.allowKnownEmployeeRoute) return candidates.find((route) => Boolean(route)) ?? null;
  return null;
}

export function buildWorkspaceDeepLink(
  pageId: string,
  context: {
    recordId?: string | null;
    section?: string | null;
    conversationId?: string | null;
    surface?: "office-panel" | null;
  } = {},
) {
  const route = getWorkspaceCapabilityRoute(pageId);
  const url = new URL(route?.href ?? pagePath(pageId), "https://lulu.local");
  if (context.recordId) {
    if (pageId === "omnichannel" && !context.conversationId) url.searchParams.set("conversationId", context.recordId);
    else url.searchParams.set("recordId", context.recordId);
  }
  if (context.conversationId) url.searchParams.set("conversationId", context.conversationId);
  if (context.section) url.searchParams.set("section", context.section);
  if (context.surface) url.searchParams.set("surface", context.surface);
  return `${url.pathname}${url.search}${url.hash}`;
}
