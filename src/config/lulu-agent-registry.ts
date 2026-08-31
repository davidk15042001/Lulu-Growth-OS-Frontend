import { isPageAvailable } from "../routing";
import { luluDropdownNavigation } from "../pages/fancily-leaf-1766/components/generated/LuluExecutiveDashboard";

type NavigationPage = { id: string; label: string };
type NavigationSection = { label: string; pages: NavigationPage[] };

export type LuluAutonomyLevel = "A1" | "A2" | "A3" | "A4";

export type LuluAgentUiState =
  | "connecting"
  | "syncing"
  | "drafting"
  | "monitoring"
  | "analyzing"
  | "needs_approval"
  | "executing"
  | "completed"
  | "attention_required";

export type LuluAgentApprovalPolicy = {
  requiresApproval: boolean;
  gates: readonly string[];
};

type LuluAgentContractDetail = {
  agentName: string;
  autonomy: LuluAutonomyLevel;
  objective: string;
  integrations: readonly string[];
  jobs: readonly string[];
  approvalPolicy: LuluAgentApprovalPolicy;
  uiStates: readonly LuluAgentUiState[];
  successMetrics: readonly string[];
};

export type LuluAgentContract = LuluAgentContractDetail & {
  pageId: string;
  pageLabel: string;
  sectionLabel: string;
};

export type LuluAgentSection = {
  label: string;
  pages: readonly LuluAgentContract[];
};

const DASHBOARD_LABEL = "Dashboard";
const STATISTICS_LABEL = "Statistiken";
const GOOGLE_BUSINESS_LABEL = "Google Business";
const GOOGLE_BUSINESS_PAGE_IDS = new Set(["daring-brook-9034", "fresh-tide-9404", "glad-coast-1428"]);
const WEBSITE_AND_COMMERCE_LABEL = "Website & Commerce";
const FINANCE_LABEL = "Finance";
const SETTINGS_LABEL = "Settings";
const FINANCE_SECTION_KEEP_IDS = new Set(["breezy-soil-2475", "tender-creek-3139"]);

const UI_CONNECT_SYNC = ["connecting", "syncing", "completed", "attention_required"] as const satisfies readonly LuluAgentUiState[];
const UI_SYNC_ANALYZE = ["syncing", "analyzing", "completed"] as const satisfies readonly LuluAgentUiState[];
const UI_MONITOR_ANALYZE = ["monitoring", "analyzing", "completed"] as const satisfies readonly LuluAgentUiState[];
const UI_MONITOR_APPROVAL = ["monitoring", "needs_approval", "executing", "completed"] as const satisfies readonly LuluAgentUiState[];
const UI_ANALYZE_APPROVAL = ["analyzing", "needs_approval", "completed"] as const satisfies readonly LuluAgentUiState[];
const UI_DRAFT_APPROVAL = ["drafting", "needs_approval", "completed"] as const satisfies readonly LuluAgentUiState[];
const UI_EXECUTE_APPROVAL = ["executing", "needs_approval", "completed"] as const satisfies readonly LuluAgentUiState[];
const UI_ATTENTION_APPROVAL = ["monitoring", "attention_required", "needs_approval"] as const satisfies readonly LuluAgentUiState[];
const UI_COMPLETE = ["completed"] as const satisfies readonly LuluAgentUiState[];

const NO_APPROVAL: LuluAgentApprovalPolicy = Object.freeze({
  requiresApproval: false,
  gates: [],
});

function approval(...gates: string[]): LuluAgentApprovalPolicy {
  return { requiresApproval: true, gates };
}

function detail(
  agentName: string,
  autonomy: LuluAutonomyLevel,
  objective: string,
  integrations: readonly string[],
  jobs: readonly string[],
  approvalPolicy: LuluAgentApprovalPolicy,
  uiStates: readonly LuluAgentUiState[],
  successMetrics: readonly string[],
): LuluAgentContractDetail {
  return { agentName, autonomy, objective, integrations, jobs, approvalPolicy, uiStates, successMetrics };
}

const registryDetails: Readonly<Record<string, LuluAgentContractDetail>> = {
  "fancily-leaf-1766": detail("CEO Agent", "A2", "Run the workspace from one command center.", ["All connected systems"], ["roll up signals", "reprioritize work"], approval("cross-domain execution"), UI_ANALYZE_APPROVAL, ["issue detection speed", "task throughput"]),
  "serene-cloud-7079": detail("Chief Intelligence Agent", "A2", "Merge business signals into one model.", ["All domain data"], ["aggregate signals", "cluster themes"], NO_APPROVAL, UI_SYNC_ANALYZE, ["insight quality", "duplicate reduction"]),
  "tender-water-4095": detail("Management Briefing Agent", "A2", "Prepare the operator briefing.", ["All major KPIs", "risk and approval streams"], ["prepare daily brief", "summarize changes"], approval("external sharing"), UI_ANALYZE_APPROVAL, ["brief usefulness", "decision response time"]),
  "swiftly-cliff-4166": detail("Business Health Agent", "A2", "Detect business health deterioration early.", ["Revenue", "ops", "support", "traffic"], ["compute health score", "watch trend shifts"], approval("auto-remediation"), UI_ATTENTION_APPROVAL, ["time to detection", "alert precision"]),
  "sharp-current-9677": detail("Growth Agent", "A3", "Continuously find growth levers.", ["Marketing", "sales", "product", "finance"], ["find bottlenecks", "score opportunities"], approval("launching major growth actions"), UI_ANALYZE_APPROVAL, ["qualified opportunities", "revenue impact"]),
  "proudly-river-8017": detail("Revenue Agent", "A2", "Explain and improve revenue performance.", ["Orders", "subscriptions", "invoices", "attribution"], ["detect leakage", "trace revenue drivers"], approval("pricing changes"), UI_MONITOR_ANALYZE, ["revenue retention", "leakage reduction"]),
  "dreamily-shade-6192": detail("Customer Understanding Agent", "A2", "Explain who the best customers are.", ["CRM", "commerce", "reviews", "support"], ["build segments", "score customer value"], approval("outbound customer activation"), UI_MONITOR_ANALYZE, ["LTV prediction quality", "churn-risk coverage"]),
  "nicely-hour-4035": detail("Sales Oversight Agent", "A3", "Keep sales performance healthy.", ["CRM", "pipeline", "activities"], ["inspect pipeline", "rank deals"], approval("external sales communication"), UI_MONITOR_APPROVAL, ["pipeline velocity", "win rate lift"]),
  "eagerly-winter-3152": detail("Marketing Oversight Agent", "A3", "Coordinate the marketing system.", ["Campaign tools", "web analytics", "SEO"], ["rank priorities", "detect channel shifts"], approval("campaign launches"), UI_ANALYZE_APPROVAL, ["traffic growth", "conversion lift"]),
  "sharply-wood-4560": detail("Ads Intelligence Agent", "A3", "Explain paid media health.", ["Ad platforms", "attribution", "spend"], ["detect waste", "monitor ROAS"], approval("budget reallocations"), UI_MONITOR_ANALYZE, ["ROAS improvement", "wasted spend reduction"]),
  "bold-ocean-5847": detail("Commerce Intelligence Agent", "A3", "Explain store performance and buying behavior.", ["Storefronts", "catalog", "orders", "carts"], ["detect conversion leaks", "identify product patterns"], approval("live commerce changes"), UI_ANALYZE_APPROVAL, ["conversion rate", "AOV"]),
  "cozily-path-5612": detail("Finance Intelligence Agent", "A2", "Interpret the company's financial condition.", ["Finance records", "billing", "cash data"], ["model trends", "summarize cash position"], approval("money-moving actions"), UI_ATTENTION_APPROVAL, ["forecast accuracy", "liquidity visibility"]),
  "gently-light-6089": detail("Operations Agent", "A3", "Improve operational throughput.", ["Tasks", "fulfillment", "incidents"], ["find bottlenecks", "suggest automations"], approval("workflow changes with external effects"), UI_ANALYZE_APPROVAL, ["SLA compliance", "bottleneck resolution"]),
  "cool-town-1727": detail("Product Intelligence Agent", "A3", "Connect product demand with performance.", ["Catalog", "sales", "returns", "reviews"], ["rank product issues", "find winners and losers"], approval("live catalog changes"), UI_ANALYZE_APPROVAL, ["margin lift", "return reduction"]),
  "swift-pool-5077": detail("KPI Agent", "A2", "Explain KPI changes in plain language.", ["Metrics", "dimensions", "benchmarks"], ["compute deltas", "generate driver trees"], NO_APPROVAL, UI_MONITOR_ANALYZE, ["diagnostic speed", "explanation usefulness"]),
  "friendly-ground-4157": detail("Reporting Agent", "A3", "Generate recurring reports automatically.", ["All reporting sources"], ["build scheduled reports", "refresh narratives"], approval("external delivery"), UI_SYNC_ANALYZE, ["report latency", "manual reporting reduction"]),
  "sparkling-time-5280": detail("Comparison Agent", "A2", "Compare periods, segments, and entities.", ["Historical metrics", "cohorts", "targets"], ["compute deltas", "highlight drivers"], NO_APPROVAL, UI_ANALYZE_APPROVAL, ["comparison clarity", "decision support value"]),
  "wispy-current-7490": detail("Forecast Agent", "A2", "Predict future outcomes with uncertainty.", ["Historical KPIs", "pipeline", "seasonality"], ["refresh forecasts", "run scenarios"], approval("budget or commitment decisions"), UI_ANALYZE_APPROVAL, ["forecast accuracy", "scenario usefulness"]),
  "kindly-year-8981": detail("Benchmark Agent", "A2", "Measure performance against baselines.", ["Targets", "history", "external references"], ["refresh benchmark sets", "compute gaps"], NO_APPROVAL, UI_MONITOR_ANALYZE, ["benchmark coverage", "target adherence"]),
  "serenely-creek-1765": detail("Trend Agent", "A2", "Find sustained directional changes.", ["Historical time series"], ["detect emerging trends", "label significance"], NO_APPROVAL, UI_MONITOR_ANALYZE, ["early trend detection", "trend coverage"]),
  "sparklingly-light-7230": detail("Anomaly Agent", "A2", "Catch unusual behavior fast.", ["Event streams", "KPI streams"], ["run anomaly checks", "score severity"], approval("automatic intervention"), UI_ATTENTION_APPROVAL, ["alert precision", "alert recall"]),
  "clever-soil-5964": detail("Attribution Agent", "A2", "Map outcomes to the real source.", ["Web analytics", "ads", "CRM", "commerce"], ["update contribution models", "reconcile paths"], approval("budget reallocation"), UI_ANALYZE_APPROVAL, ["attribution trust", "channel decision quality"]),
  "serenely-week-1771": detail("Insight Agent", "A2", "Turn raw signals into useful insights.", ["Cross-domain events", "metrics"], ["cluster signals", "rank insights"], NO_APPROVAL, UI_ANALYZE_APPROVAL, ["insight adoption rate", "signal compression"]),
  "daring-home-4179": detail("Recommendation Agent", "A2", "Turn insights into next actions.", ["Insights", "goals", "constraints"], ["generate recommendations", "estimate impact"], approval("action execution"), UI_ANALYZE_APPROVAL, ["recommendation acceptance", "impact realized"]),
  "wispy-leaf-3778": detail("Task Orchestrator", "A3", "Convert strategy into executable tasks.", ["Recommendations", "task systems"], ["create tasks", "sequence dependencies"], approval("cross-system writes"), UI_EXECUTE_APPROVAL, ["task completion rate", "handoff speed"]),
  "happily-brook-7061": detail("Opportunity Agent", "A2", "Maintain a ranked opportunity backlog.", ["Growth", "sales", "product", "finance"], ["identify upside", "score value"], approval("launching major opportunities"), UI_ANALYZE_APPROVAL, ["opportunity realization", "pipeline quality"]),
  "radiant-cave-9340": detail("Decision Agent", "A2", "Support structured decision making.", ["Recommendations", "approvals", "historical outcomes"], ["draft decision memos", "record rationale"], approval("final decision sign-off"), UI_ANALYZE_APPROVAL, ["decision cycle time", "decision traceability"]),
  "boldly-time-5189": detail("Risk Agent", "A2", "Centralize risks and mitigation.", ["Alerts", "finance", "compliance", "ops"], ["maintain risk register", "monitor mitigation"], approval("remediation steps"), UI_ATTENTION_APPROVAL, ["prevented incidents", "mitigation coverage"]),
  "proud-rain-4772": detail("Activity Chronicle Agent", "A2", "Preserve an explainable history of action.", ["Agent logs", "sync logs", "approvals"], ["append events", "correlate cause and effect"], NO_APPROVAL, UI_SYNC_ANALYZE, ["audit completeness", "timeline coherence"]),

  "quietly-stone-4158": detail("CFO Agent", "A2", "Run the finance domain as a whole.", ["Finance stack", "billing", "revenue systems"], ["summarize finance status", "rank issues"], approval("financial execution"), UI_ANALYZE_APPROVAL, ["finance issue resolution speed", "cash visibility"]),
  "breezy-soil-2475": detail("Invoice Agent", "A3", "Keep invoicing accurate and timely.", ["Invoices", "CRM", "payments"], ["generate drafts", "chase overdue items"], approval("sending invoices"), UI_DRAFT_APPROVAL, ["DSO", "invoice error rate"]),
  "tender-creek-3139": detail("Quote Agent", "A2", "Produce better quotes faster.", ["Products", "pricing", "CRM"], ["assemble quote drafts", "check margin"], approval("sending quotes"), UI_DRAFT_APPROVAL, ["quote turnaround", "quote win rate"]),
  "cool-rain-6499": detail("Income Agent", "A2", "Monitor and explain incoming revenue.", ["Orders", "subscriptions", "invoices"], ["roll up income", "detect drops"], NO_APPROVAL, UI_MONITOR_ANALYZE, ["revenue visibility", "income anomaly coverage"]),
  "richly-land-8084": detail("Transaction Agent", "A3", "Keep transaction data categorized and trustworthy.", ["Payments", "cash feeds", "ledger"], ["classify transactions", "flag exceptions"], approval("writing back corrections"), UI_ATTENTION_APPROVAL, ["classification accuracy", "exception resolution time"]),
  "calm-tide-3752": detail("Payment Agent", "A3", "Guard payment collection quality.", ["Processors", "invoices", "subscriptions"], ["detect failures", "suggest retries"], approval("retrying or changing payment actions"), UI_MONITOR_APPROVAL, ["payment success rate", "failed payment recovery"]),
  "zesty-earth-3938": detail("Expense Agent", "A2", "Control spend and waste.", ["Expense tools", "cards", "vendors"], ["categorize spend", "find anomalies"], approval("approving spend"), UI_ANALYZE_APPROVAL, ["spend reduction", "anomaly detection"]),
  "bravely-bay-4544": detail("Debtor Agent", "A3", "Manage receivables risk.", ["AR", "invoices", "customer balances"], ["build aging views", "draft reminders"], approval("dunning outreach"), UI_ANALYZE_APPROVAL, ["overdue reduction", "collection speed"]),
  "eager-minute-1586": detail("Creditor Agent", "A2", "Manage vendor obligations cleanly.", ["AP", "contracts", "payout schedules"], ["watch due dates", "detect overcharges"], approval("paying vendors"), UI_MONITOR_APPROVAL, ["missed payment reduction", "vendor issue detection"]),
  "fair-bridge-8618": detail("Account Agent", "A2", "Keep account structure consistent.", ["Accounts", "ledger", "mappings"], ["watch account health", "detect orphan mappings"], approval("changing account structure"), UI_ATTENTION_APPROVAL, ["reconciliation readiness", "mapping correctness"]),
  "soft-town-3284": detail("Cash Flow Agent", "A2", "Prevent cash crunches.", ["Balances", "AR", "AP", "forecast"], ["project runway", "flag shortfalls"], approval("emergency cash actions"), UI_ATTENTION_APPROVAL, ["runway visibility", "surprise reduction"]),
  "wisely-gate-3183": detail("Budget Agent", "A3", "Plan and control budget allocation.", ["Actuals", "plans", "team budgets"], ["compare plan vs actual", "propose shifts"], approval("budget changes"), UI_MONITOR_APPROVAL, ["budget adherence", "spend efficiency"]),
  "sharp-morning-7310": detail("Planning Agent", "A2", "Model future financial scenarios.", ["Forecasts", "budgets", "assumptions"], ["run scenarios", "update assumptions"], approval("strategic commitment"), UI_ANALYZE_APPROVAL, ["scenario usefulness", "planning speed"]),
  "sparklingly-city-3338": detail("Reconciliation Agent", "A3", "Match records across finance systems.", ["Orders", "invoices", "payouts", "ledger"], ["detect mismatches", "suggest fixes"], approval("auto-fixes"), UI_ATTENTION_APPROVAL, ["reconciliation completion", "mismatch resolution time"]),
  "radiant-hour-5376": detail("Recurring Revenue Agent", "A2", "Protect recurring revenue quality.", ["Subscriptions", "churn", "upgrades"], ["compute movement", "detect churn patterns"], approval("pricing changes"), UI_MONITOR_ANALYZE, ["net revenue retention", "churn visibility"]),
  "lucky-park-8649": detail("Payout Agent", "A2", "Keep payouts visible and correct.", ["Processor payouts", "bank arrivals"], ["detect missing payouts", "track timing"], approval("payout configuration changes"), UI_ATTENTION_APPROVAL, ["payout accuracy", "payout latency"]),
  "vibrantly-second-9428": detail("Finance Automation Agent", "A4", "Automate repetitive finance work.", ["Finance workflows", "triggers", "approvals"], ["run automations", "route exceptions"], approval("enabling new automation rules"), UI_EXECUTE_APPROVAL, ["manual finance work reduction", "automation success rate"]),
  "sturdy-week-3372": detail("Tax Agent", "A2", "Reduce tax mistakes.", ["Tax settings", "invoices", "orders"], ["detect mismatches", "flag filing risk"], approval("filing or tax submission"), UI_ATTENTION_APPROVAL, ["tax error reduction", "tax issue detection"]),
  "fine-park-8079": detail("CSO Agent", "A2", "Run the sales domain from one overview.", ["CRM", "finance", "pipeline"], ["summarize sales health", "rank gaps"], approval("external sales action"), UI_ANALYZE_APPROVAL, ["sales visibility", "pipeline health"]),
  "softly-autumn-9038": detail("Lead Agent", "A3", "Qualify sales leads effectively.", ["CRM", "lead sources", "enrichment"], ["score leads", "route leads"], approval("external outreach"), UI_ANALYZE_APPROVAL, ["lead-to-opportunity rate", "lead response time"]),
  "wildly-sun-6424": detail("Opportunity Agent", "A3", "Develop qualified opportunities.", ["CRM", "meeting notes", "fit signals"], ["update opportunity briefs", "flag blockers"], approval("offer changes"), UI_MONITOR_APPROVAL, ["opportunity conversion", "opportunity cycle time"]),
  "deeply-month-1392": detail("Deal Agent", "A3", "Improve deal progression.", ["CRM", "pricing", "notes"], ["create deal plans", "surface objections"], approval("buyer commitments"), UI_MONITOR_APPROVAL, ["close rate", "deal velocity"]),
  "sweet-evening-7753": detail("Pipeline Agent", "A2", "Keep pipeline flowing.", ["Stages", "activities", "rep data"], ["detect stuck stages", "rebalance focus"], approval("bulk pipeline edits"), UI_ATTENTION_APPROVAL, ["pipeline velocity", "stalled-deal reduction"]),
  "warmly-road-3804": detail("Sales Activity Agent", "A2", "Measure sales activity quality.", ["Emails", "calls", "meetings"], ["score activity quality", "suggest cadence changes"], approval("auto-outreach"), UI_ANALYZE_APPROVAL, ["activity effectiveness", "follow-up quality"]),
  "wondrously-gate-2200": detail("Sales Task Agent", "A3", "Enforce disciplined follow-up.", ["CRM", "tasks", "history"], ["create follow-ups", "remind owners"], approval("external communication"), UI_EXECUTE_APPROVAL, ["task SLA compliance", "follow-up completion"]),
  "sharp-cliff-6925": detail("Sales Segmentation Agent", "A2", "Build actionable sales segments.", ["CRM", "revenue", "product fit"], ["generate segments", "refresh labels"], approval("activating segments externally"), UI_COMPLETE, ["segment usefulness", "segment adoption"]),
  "lovingly-shore-4782": detail("Sales Forecast Agent", "A2", "Predict bookings.", ["Pipeline", "stage history", "seasonality"], ["refresh forecast", "compare to actual"], approval("plan changes"), UI_ANALYZE_APPROVAL, ["forecast accuracy", "forecast confidence"]),
  "rich-moon-9195": detail("Sales Reporting Agent", "A3", "Generate sales reporting automatically.", ["CRM", "rep activity", "deal data"], ["produce reports", "summarize changes"], approval("external delivery"), UI_COMPLETE, ["reporting latency", "report consumption"]),
  "lively-house-6788": detail("Commission Agent", "A2", "Keep commission logic trusted.", ["Deals", "payout logic", "rep plans"], ["compute commissions", "flag discrepancies"], approval("commission payout"), UI_ANALYZE_APPROVAL, ["commission dispute reduction", "statement accuracy"]),
  "gentle-cliff-7133": detail("Goal Agent", "A2", "Track goal progress clearly.", ["Targets", "actuals", "teams"], ["watch attainment", "suggest interventions"], approval("changing goals"), UI_MONITOR_APPROVAL, ["quota attainment visibility", "intervention timeliness"]),
  "kindly-morning-7115": detail("Territory Agent", "A2", "Optimize territory design.", ["Accounts", "geo", "firmographics"], ["detect imbalance", "suggest territory changes"], approval("reassignment"), UI_ANALYZE_APPROVAL, ["coverage quality", "territory balance"]),
  "friendly-tower-1528": detail("Lead Routing Agent", "A4", "Route leads to the best owner.", ["Lead data", "territories", "rep capacity"], ["auto-assign leads", "rebalance rules"], approval("rule changes"), UI_EXECUTE_APPROVAL, ["routing speed", "lead response time"]),

  "fresh-moon-5374": detail("Universal Assistant Agent", "A3", "Let the user command the business in natural language.", ["All accessible tools", "workspace memory"], ["answer", "orchestrate work"], approval("sensitive execution"), UI_EXECUTE_APPROVAL, ["user task completion time", "assistant adoption"]),
  "radiant-dusk-9079": detail("Agent Manager", "A2", "Show and manage the active Lulu workforce.", ["Agent registry", "permissions", "logs"], ["run health checks", "summarize workload"], approval("permission changes"), UI_MONITOR_ANALYZE, ["agent uptime", "ownership clarity"]),
  "calmly-park-3313": detail("Capability Agent", "A2", "Expand available agent capabilities.", ["Template catalog", "installed modules"], ["match gaps", "recommend additions"], approval("installation"), UI_ANALYZE_APPROVAL, ["capability coverage", "feature adoption"]),
  "rich-field-1880": detail("Knowledge Agent", "A3", "Store reusable business memory.", ["Docs", "notes", "synced data", "chat history"], ["ingest knowledge", "link entities"], approval("deletion or sharing"), UI_SYNC_ANALYZE, ["retrieval quality", "knowledge freshness"]),
  "wondrously-second-5656": detail("Action Agent", "A4", "Execute approved tasks across systems.", ["Integrations", "workflows", "task definitions"], ["perform actions", "log runs"], approval("irreversible actions"), UI_EXECUTE_APPROVAL, ["successful action rate", "rollback readiness"]),
  "sunny-moon-6307": detail("Conversation Agent", "A2", "Preserve thread continuity across agents.", ["Chats", "artifacts", "memory"], ["summarize threads", "route context"], approval("external sending"), UI_COMPLETE, ["context retention quality", "handoff quality"]),
  "sparkling-cave-8456": detail("AI Audit Agent", "A2", "Make agent work inspectable.", ["Logs", "run history", "approvals"], ["render activity feed", "explain actions"], NO_APPROVAL, UI_COMPLETE, ["audit completeness", "traceability"]),

  "bright-meadow-7537": detail("CRM Lead Agent", "A2", "Keep the CRM healthy as one system.", ["CRM records", "tasks", "activities"], ["audit hygiene", "summarize state"], approval("bulk edits"), UI_MONITOR_ANALYZE, ["CRM completeness", "CRM hygiene"]),
  "sturdy-month-1562": detail("Contact Agent", "A3", "Maintain reliable person records.", ["CRM", "enrichment", "communications"], ["enrich contacts", "dedupe records"], approval("external outreach or deletion"), UI_SYNC_ANALYZE, ["contact completeness", "duplicate reduction"]),
  "kindly-pool-8785": detail("Company Agent", "A3", "Maintain reliable company records.", ["CRM", "enrichment", "deal data"], ["enrich companies", "detect duplicates"], approval("merge or delete operations"), UI_SYNC_ANALYZE, ["account completeness", "duplicate reduction"]),
  "swift-hour-7844": detail("CRM Lead Agent", "A3", "Turn inbound contacts into qualified leads.", ["Forms", "imports", "enrichment"], ["score leads", "classify leads"], approval("external outreach"), UI_ANALYZE_APPROVAL, ["qualification speed", "lead quality"]),
  "smartly-shade-4619": detail("CRM Deal Agent", "A3", "Improve CRM deal execution.", ["Pipeline", "contacts", "notes"], ["update next steps", "flag blockers"], approval("offers or commitments"), UI_MONITOR_APPROVAL, ["deal progression speed", "close probability"]),
  "calmly-cloud-9988": detail("CRM Pipeline Agent", "A2", "Preserve a clean, useful pipeline.", ["CRM stages", "owners", "activities"], ["detect stagnation", "suggest stage moves"], approval("bulk stage changes"), UI_ATTENTION_APPROVAL, ["stalled-deal reduction", "pipeline clarity"]),
  "cosmic-pool-1616": detail("CRM Activity Agent", "A2", "Keep relationship activity complete.", ["Email", "meetings", "calls"], ["summarize activity", "create follow-ups"], approval("auto-sending"), UI_COMPLETE, ["activity completeness", "follow-up creation rate"]),
  "deeply-noon-9539": detail("CRM Task Agent", "A3", "Ensure follow-up discipline.", ["CRM tasks", "SLAs", "records"], ["create reminders", "sequence tasks"], approval("external writes"), UI_EXECUTE_APPROVAL, ["follow-up compliance", "task closure rate"]),
  "sunnily-gulf-7520": detail("CRM Segmentation Agent", "A2", "Create usable CRM segments.", ["Contacts", "companies", "revenue", "behavior"], ["compute segments", "refresh labels"], approval("external activation"), UI_COMPLETE, ["segmentation adoption", "segment accuracy"]),
  "gracefully-storm-2649": detail("Customer Intelligence Agent", "A2", "Explain account and customer behavior deeply.", ["CRM", "sales", "commerce", "support"], ["produce account briefs", "score risk and value"], approval("customer-facing action"), UI_ANALYZE_APPROVAL, ["account insight quality", "risk detection"]),

  "email-inbox": detail("Inbox Agent", "A3", "Triage and draft responses for inbound mail.", ["Connected inboxes", "CRM", "calendar"], ["summarize threads", "classify urgency"], approval("sending replies"), UI_MONITOR_APPROVAL, ["inbox zero speed", "first-response time"]),
  "email-starred": detail("Priority Mail Agent", "A2", "Protect the highest-priority threads.", ["Mail provider", "starred labels"], ["maintain VIP queue", "detect overdue responses"], approval("sending replies"), UI_MONITOR_APPROVAL, ["VIP response time", "priority SLA adherence"]),
  "email-sent": detail("Sent Mail Agent", "A2", "Review outbound quality and response patterns.", ["Sent mail", "reply data"], ["detect follow-up needs", "summarize performance"], NO_APPROVAL, UI_MONITOR_ANALYZE, ["reply rate visibility", "outbound quality"]),
  "email-drafts": detail("Drafting Agent", "A3", "Produce high-quality drafts quickly.", ["Mail context", "templates", "CRM"], ["generate drafts", "personalize content"], approval("sending drafts"), UI_DRAFT_APPROVAL, ["draft acceptance rate", "drafting speed"]),
  "email-automations": detail("Email Automation Agent", "A4", "Run recurring email programs.", ["Mail provider", "workflow engine", "CRM"], ["execute sequences", "stop on replies"], approval("activating new automations"), UI_EXECUTE_APPROVAL, ["automation performance", "manual send reduction"]),
  "email-settings": detail("Email Config Agent", "A2", "Manage email account rules.", ["Sender config", "signatures", "routing rules"], ["validate settings", "surface errors"], approval("settings changes"), UI_COMPLETE, ["config health", "mail reliability"]),

  "calendar-overview": detail("Calendar Agent", "A3", "Coordinate time and scheduling intelligently.", ["Connected calendars", "tasks", "email"], ["detect conflicts", "propose slots"], approval("sending invites or rescheduling"), UI_MONITOR_APPROVAL, ["conflict reduction", "scheduling speed"]),
  "calendar-settings": detail("Calendar Config Agent", "A2", "Hold calendar operating rules.", ["Calendar providers", "booking preferences"], ["validate sync state", "recommend defaults"], approval("settings changes"), UI_COMPLETE, ["sync reliability", "config quality"]),

  "dreamily-soil-9290": detail("Campaign Agent", "A3", "Design and run marketing campaigns.", ["Campaign tools", "analytics", "content systems"], ["generate campaign plans", "monitor execution"], approval("launching campaigns"), UI_DRAFT_APPROVAL, ["campaign ROI", "launch speed"]),
  "wondrous-cloud-1355": detail("Content Agent", "A3", "Produce and improve marketing content.", ["CMS", "brand assets", "SEO data"], ["create drafts", "refresh old content"], approval("publishing"), UI_DRAFT_APPROVAL, ["content velocity", "content impact"]),
  "sparklingly-home-7386": detail("Strategy Agent", "A2", "Convert goals into a marketing plan.", ["Business goals", "channel data", "competition"], ["define priorities", "update roadmap"], approval("strategic approval"), UI_ANALYZE_APPROVAL, ["strategy adoption", "goal alignment"]),
  "gently-shade-2476": detail("Campaign Tracking Agent", "A2", "Monitor campaign execution health.", ["Campaign systems", "analytics", "spend"], ["check pacing", "track milestones"], NO_APPROVAL, UI_ATTENTION_APPROVAL, ["campaign visibility", "pacing accuracy"]),
  "kind-time-4492": detail("Keyword Agent", "A2", "Maintain a prioritized keyword map.", ["Search data", "rankings", "competitor signals"], ["cluster keywords", "detect opportunities"], approval("publishing content"), UI_ANALYZE_APPROVAL, ["keyword opportunity capture", "keyword coverage"]),
  "smartly-shore-1468": detail("Competitor Agent", "A2", "Track competitors continuously.", ["Websites", "SERPs", "ads", "offers"], ["refresh competitor dossiers", "detect changes"], NO_APPROVAL, UI_MONITOR_ANALYZE, ["competitor coverage", "reaction speed"]),
  "breezily-wood-5980": detail("Audience Agent", "A4", "Build living target audiences for the business.", ["Onboarding", "CRM", "website", "SEO/GEO/AEO", "commerce"], ["enrich segments", "score fit"], approval("activating in ad or email systems"), UI_ANALYZE_APPROVAL, ["audience quality", "segment lift"]),
  "breezy-shore-6734": detail("Marketing Analytics Agent", "A2", "Explain marketing performance.", ["Web analytics", "attribution", "campaign data"], ["run funnel diagnostics", "publish weekly summaries"], approval("budget reallocation"), UI_ANALYZE_APPROVAL, ["insight-to-action rate", "channel clarity"]),
  "finely-garden-9221": detail("CMO Agent", "A2", "Operate the whole marketing function.", ["All marketing systems"], ["summarize domain status", "prioritize work"], approval("major channel changes"), UI_ANALYZE_APPROVAL, ["channel coordination quality", "marketing responsiveness"]),
  "friendly-path-8200": detail("Ads Analytics Agent", "A3", "Explain ad performance clearly.", ["Ad platforms", "spend", "attribution"], ["detect fatigue", "track efficiency"], approval("budget changes"), UI_ANALYZE_APPROVAL, ["cost efficiency", "ads visibility"]),
  "wise-brook-1762": detail("Ads Campaign Agent", "A3", "Operate paid campaigns.", ["Ad accounts", "campaign data", "conversions"], ["adjust campaigns", "scale winners"], approval("publishing changes"), UI_EXECUTE_APPROVAL, ["campaign performance lift", "campaign stability"]),
  "happily-storm-2690": detail("Creative Agent", "A3", "Generate and test better ad creatives.", ["Brand assets", "products", "performance"], ["draft creatives", "rotate angles"], approval("publishing creatives"), UI_DRAFT_APPROVAL, ["creative refresh performance", "creative throughput"]),
  "sunny-minute-1092": detail("Media Budget Agent", "A3", "Allocate paid media budget intelligently.", ["Spend", "ROAS", "CAC", "constraints"], ["rebalance spend", "hold caps"], approval("changing budgets"), UI_MONITOR_APPROVAL, ["spend efficiency", "overspend prevention"]),
  "zesty-grass-9196": detail("Ads Optimization Agent", "A4", "Continuously optimize ads under constraints.", ["Campaign metrics", "bids", "budgets"], ["apply optimizations", "learn from outcomes"], approval("major scaling or pausing"), UI_EXECUTE_APPROVAL, ["incremental ROAS gain", "optimization win rate"]),
  "nicely-shade-2637": detail("Measurement Agent", "A3", "Maintain measurement integrity.", ["Pixels", "events", "UTM rules", "analytics"], ["check tracking health", "detect missing events"], approval("altering live tracking"), UI_ATTENTION_APPROVAL, ["measurement completeness", "tracking accuracy"]),
  "nice-moon-2056": detail("Ad Builder Agent", "A3", "Generate ready-to-launch ad structures.", ["Offer context", "audiences", "products"], ["build campaigns", "build ad sets"], approval("publishing"), UI_DRAFT_APPROVAL, ["launch preparation speed", "builder adoption"]),
  "sunnily-peak-7188": detail("Approval Agent", "A3", "Manage final launch control.", ["Draft assets", "approval queue", "policy rules"], ["validate readiness", "present approval queue"], approval("final publish"), UI_EXECUTE_APPROVAL, ["publishing error reduction", "approval turnaround"]),
  "solid-sand-5563": detail("Experiment Agent", "A4", "Systematically run experiments.", ["Campaign performance", "hypotheses", "variants"], ["design tests", "evaluate winners"], approval("launching tests"), UI_EXECUTE_APPROVAL, ["experiment velocity", "test win rate"]),
  "sunny-summer-2293": detail("Ad Platform Agent", "A2", "Keep ad platform connectivity stable.", ["OAuth", "ad account configs", "permissions"], ["monitor connection health", "sync accounts"], approval("permission or account changes"), UI_CONNECT_SYNC, ["integration uptime", "account sync success"]),

  "lulu-website-portal-9012": detail("Website Manager Agent", "A3", "Operate the web presence as one managed system.", ["CMS platforms", "website generation", "analytics"], ["monitor generation jobs", "plan changes"], approval("publishing site structure"), UI_CONNECT_SYNC, ["site health", "delivery speed"]),
  "website-wordpress-jetpack-9013": detail("WordPress Agent", "A3", "Manage WordPress operations.", ["WordPress", "Jetpack", "analytics"], ["sync content", "inspect publishing health"], approval("publishing"), UI_CONNECT_SYNC, ["WordPress sync success", "publishing reliability"]),
  "website-webflow-9014": detail("Webflow Agent", "A3", "Manage Webflow operations.", ["Webflow CMS", "publishing", "analytics"], ["sync collections", "inspect publish state"], approval("publishing"), UI_CONNECT_SYNC, ["Webflow publish reliability", "Webflow sync success"]),
  "website-pages-cms-9015": detail("CMS Agent", "A3", "Maintain site structure and page content.", ["CMS", "page tree", "templates"], ["create page drafts", "detect stale pages"], approval("publishing or deleting pages"), UI_DRAFT_APPROVAL, ["content freshness", "page quality"]),
  "website-posts-9016": detail("Publishing Agent", "A3", "Run editorial publishing.", ["CMS", "content calendar", "SEO data"], ["generate posts", "schedule posts"], approval("publishing posts"), UI_DRAFT_APPROVAL, ["content cadence", "editorial throughput"]),
  "website-media-assets-9017": detail("Asset Agent", "A2", "Keep assets organized and useful.", ["Media library", "CDN", "CMS"], ["tag assets", "detect duplicates"], approval("deleting assets"), UI_SYNC_ANALYZE, ["asset reuse rate", "duplicate reduction"]),
  "website-domains-9018": detail("Domain Agent", "A2", "Guard domain and SSL health.", ["DNS", "registrar", "SSL", "routing"], ["detect expiry", "check SSL issues"], approval("DNS or domain changes"), UI_ATTENTION_APPROVAL, ["domain uptime", "domain issue resolution"]),
  "sparklingly-moon-5114": detail("SEO Agent", "A4", "Improve classic search visibility.", ["Search data", "page content", "technical site data"], ["prioritize fixes", "monitor rankings"], approval("publishing technical or content changes"), UI_ANALYZE_APPROVAL, ["organic traffic growth", "rank improvement"]),
  "zealously-path-4224": detail("GEO Agent", "A3", "Improve generative search visibility.", ["Brand knowledge", "citations", "site structure"], ["generate citation tasks", "improve entity clarity"], approval("publishing source changes"), UI_ANALYZE_APPROVAL, ["generative visibility growth", "citation coverage"]),
  "sunny-house-9595": detail("AEO Agent", "A3", "Improve answer-engine readiness.", ["FAQs", "structured content", "page content"], ["generate answer blocks", "identify snippet opportunities"], approval("publishing answer content"), UI_DRAFT_APPROVAL, ["answer capture rate", "snippet coverage"]),
  "smart-ocean-3898": detail("Commerce Overview Agent", "A2", "Oversee website and commerce together.", ["Web analytics", "store data", "review data"], ["summarize status", "rank blockers"], approval("major cross-domain changes"), UI_ANALYZE_APPROVAL, ["web commerce health", "blocker resolution"]),
  "nice-year-6253": detail("Store Agent", "A2", "Manage connected storefronts.", ["Store platforms", "configs", "catalogs"], ["audit store health", "detect missing syncs"], approval("store config changes"), UI_CONNECT_SYNC, ["store uptime", "sync coverage"]),
  "nicely-ocean-1051": detail("Product Agent", "A3", "Keep product data and performance strong.", ["Catalog", "pricing", "inventory", "reviews"], ["update product drafts", "detect underperformers"], approval("publishing product changes"), UI_DRAFT_APPROVAL, ["product conversion rate", "product freshness"]),
  "richly-forest-5832": detail("Category Agent", "A3", "Maintain useful catalog structure.", ["Catalog hierarchy", "SEO", "conversion data"], ["detect taxonomy issues", "suggest reorganizations"], approval("changing categories live"), UI_ANALYZE_APPROVAL, ["category discoverability", "navigation clarity"]),
  "mightily-shore-7108": detail("Order Agent", "A3", "Watch order processing health.", ["Orders", "shipping", "payments", "support"], ["flag delays", "detect exceptions"], approval("customer-facing intervention"), UI_MONITOR_APPROVAL, ["order resolution speed", "order SLA performance"]),
  "fancy-ground-8040": detail("Commerce Customer Agent", "A2", "Understand buyers in the store context.", ["Orders", "CRM", "sessions", "support"], ["segment buyers", "score loyalty"], approval("outbound lifecycle actions"), UI_ANALYZE_APPROVAL, ["repeat purchase rate", "buyer insight quality"]),
  "serenely-sand-9226": detail("Cart Agent", "A3", "Monitor cart creation and drop-off.", ["Cart events", "site analytics", "products"], ["detect friction", "rank blockers"], approval("starting recovery actions"), UI_MONITOR_APPROVAL, ["cart recovery rate", "cart leak detection"]),
  "smart-village-1099": detail("Inventory Agent", "A3", "Keep stock aligned with demand.", ["Inventory", "sales velocity", "supplier timing"], ["detect stockouts", "detect overstock"], approval("stock or PO changes"), UI_MONITOR_APPROVAL, ["stockout reduction", "inventory efficiency"]),
  "dreamy-shade-5445": detail("Returns Agent", "A3", "Reduce costly returns and refund pain.", ["Returns", "refunds", "orders", "product data"], ["classify return reasons", "detect bad SKUs"], approval("issuing refunds automatically"), UI_ANALYZE_APPROVAL, ["return rate reduction", "refund issue detection"]),
  "sharply-sky-4161": detail("Promotion Agent", "A3", "Run profitable promotions.", ["Discount rules", "margin", "campaigns", "inventory"], ["propose promos", "measure results"], approval("launching promos"), UI_DRAFT_APPROVAL, ["promo margin quality", "promo conversion"]),
  "wildly-time-4260": detail("Recovery Agent", "A4", "Recover lost checkout intent.", ["Cart abandonment events", "CRM", "email"], ["trigger recovery flows", "personalize saves"], approval("sending recovery messages"), UI_EXECUTE_APPROVAL, ["recovered revenue", "recovery conversion"]),
  "quietly-moon-4186": detail("Shipping Agent", "A3", "Maintain delivery reliability.", ["Carriers", "shipments", "order events"], ["flag late shipments", "detect address issues"], approval("customer-facing changes"), UI_MONITOR_APPROVAL, ["on-time delivery rate", "shipping issue response"]),
  "merry-castle-3260": detail("Commerce Payment Agent", "A3", "Protect checkout payment quality.", ["Checkout", "processor events", "failure codes"], ["detect failure spikes", "trace payment drops"], approval("payment config changes"), UI_ATTENTION_APPROVAL, ["checkout success rate", "payment reliability"]),
  "merry-cliff-8846": detail("Coupon Agent", "A3", "Keep coupon strategy effective and clean.", ["Coupon rules", "order data", "campaigns"], ["detect abuse", "score usage"], approval("issuing or changing coupons"), UI_MONITOR_APPROVAL, ["coupon profitability", "abuse prevention"]),
  "safely-dawn-7731": detail("Subscription Agent", "A4", "Maintain recurring commerce health.", ["Subscription platform", "billing", "churn signals"], ["detect churn risk", "trigger save flows"], approval("billing changes or messages"), UI_EXECUTE_APPROVAL, ["subscription retention", "retry recovery"]),
  "purely-dusk-2409": detail("Fulfillment Agent", "A3", "Keep post-purchase operations healthy.", ["Warehouse", "shipping", "OMS"], ["detect bottlenecks", "watch SLAs"], approval("workflow changes"), UI_MONITOR_APPROVAL, ["fulfillment SLA performance", "throughput"]),
  "soft-hill-4757": detail("Commerce Tax Agent", "A2", "Maintain correct commerce tax setup.", ["Tax config", "checkout", "orders"], ["detect tax mismatches", "validate setup"], approval("changing tax config"), UI_ATTENTION_APPROVAL, ["tax correctness", "tax issue resolution"]),
  "safely-air-9334": detail("Merchandising Agent", "A3", "Curate high-performing groupings.", ["Catalog", "inventory", "seasonality", "demand"], ["build collections", "rotate merchandising"], approval("publishing collections"), UI_DRAFT_APPROVAL, ["collection conversion", "collection freshness"]),
  "merry-land-6169": detail("Store Performance Agent", "A4", "Improve end-to-end store output.", ["Web analytics", "checkout", "orders", "margin"], ["identify bottlenecks", "propose experiments"], approval("launching live tests"), UI_ANALYZE_APPROVAL, ["store conversion lift", "margin lift"]),

  "daring-brook-9034": detail("Google Reputation Agent", "A4", "Operate Google review management.", ["Google Business Profile APIs", "sentiment", "workspace context"], ["sync reviews", "draft replies"], approval("posting public replies"), UI_EXECUTE_APPROVAL, ["response time", "review sentiment"]),
  "fresh-tide-9404": detail("Google OAuth Agent", "A2", "Connect the account safely via OAuth.", ["OAuth", "Google account and location selection"], ["start auth", "validate scopes"], approval("final connect"), UI_CONNECT_SYNC, ["successful connection rate", "setup completion rate"]),
  "glad-coast-1428": detail("Google Integration Agent", "A3", "Keep Google sync healthy.", ["OAuth credentials", "sync jobs", "API status"], ["monitor token health", "retry syncs"], approval("remapping or reconnecting"), UI_CONNECT_SYNC, ["sync uptime", "integration health"]),

  "nicely-land-1864": detail("Workspace Admin Agent", "A2", "Hold workspace-wide defaults and operating rules.", ["Workspace profile", "permissions", "automation settings"], ["audit config", "suggest defaults"], approval("changing settings"), UI_COMPLETE, ["config quality", "policy consistency"]),
  "pure-minute-5446": detail("Billing Agent", "A2", "Keep the Lulu account commercially healthy.", ["Subscription", "invoices", "payment method", "usage"], ["summarize billing state", "detect payment issues"], approval("plan or payment changes"), UI_COMPLETE, ["billing issue resolution", "billing clarity"]),
};

const baseNavigationSections = (luluDropdownNavigation as unknown as readonly { label: string; pages: readonly NavigationPage[] }[])
  .map((section) => ({
    ...section,
    label: section.label === DASHBOARD_LABEL ? STATISTICS_LABEL : section.label,
    pages: [...section.pages].filter((page) => isPageAvailable(page.id) && !GOOGLE_BUSINESS_PAGE_IDS.has(page.id)),
  }))
  .filter((section) => section.pages.length > 0);

const googleBusinessSection: NavigationSection = {
  label: GOOGLE_BUSINESS_LABEL,
  pages: [
    { id: "daring-brook-9034", label: "Reviews" },
    { id: "fresh-tide-9404", label: "Connection Setup" },
    { id: "glad-coast-1428", label: "Integrations" },
  ].filter((page) => isPageAvailable(page.id)),
};

function buildVisibleSections() {
  const sections = [...baseNavigationSections];
  const websiteIndex = sections.findIndex((section) => section.label === WEBSITE_AND_COMMERCE_LABEL);

  if (websiteIndex !== -1 && googleBusinessSection.pages.length > 0) {
    sections.splice(websiteIndex + 1, 0, googleBusinessSection);
  } else if (googleBusinessSection.pages.length > 0) {
    sections.push(googleBusinessSection);
  }

  const currentFinanceIndex = sections.findIndex((section) => section.label === FINANCE_LABEL);
  const currentStatisticsIndex = sections.findIndex((section) => section.label === STATISTICS_LABEL);

  if (currentFinanceIndex !== -1 && currentStatisticsIndex !== -1) {
    const financeSection = sections[currentFinanceIndex];
    const statisticsSection = sections[currentStatisticsIndex];
    const keptFinancePages = financeSection.pages.filter((page) => FINANCE_SECTION_KEEP_IDS.has(page.id));
    const movedToStatistics = financeSection.pages.filter((page) => !FINANCE_SECTION_KEEP_IDS.has(page.id));

    sections[currentStatisticsIndex] = {
      ...statisticsSection,
      pages: [...statisticsSection.pages, ...movedToStatistics],
    };

    if (keptFinancePages.length > 0) {
      sections[currentFinanceIndex] = {
        ...financeSection,
        pages: keptFinancePages,
      };
    } else {
      sections.splice(currentFinanceIndex, 1);
    }
  }

  const financeIndex = sections.findIndex((section) => section.label === FINANCE_LABEL);
  const statisticsIndex = sections.findIndex((section) => section.label === STATISTICS_LABEL);
  const settingsIndex = sections.findIndex((section) => section.label === SETTINGS_LABEL);

  if (statisticsIndex !== -1 && settingsIndex !== -1) {
    const currentStatsIndex = sections.findIndex((section) => section.label === STATISTICS_LABEL);
    const [statisticsSection] = sections.splice(currentStatsIndex, 1);
    const refreshedSettingsIndex = sections.findIndex((section) => section.label === SETTINGS_LABEL);
    const currentFinanceIndexForOrder = sections.findIndex((section) => section.label === FINANCE_LABEL);

    if (currentFinanceIndexForOrder !== -1) {
      const [financeSection] = sections.splice(currentFinanceIndexForOrder, 1);
      const currentSettingsIndex = sections.findIndex((section) => section.label === SETTINGS_LABEL);
      sections.splice(currentSettingsIndex, 0, financeSection, statisticsSection);
    } else {
      sections.splice(refreshedSettingsIndex, 0, statisticsSection);
    }
  }

  return sections;
}

function getRegistryDetailOrThrow(pageId: string) {
  const match = registryDetails[pageId];
  if (!match) throw new Error(`Missing Lulu agent registry entry for page "${pageId}".`);
  return match;
}

const visibleSections = buildVisibleSections();

export const luluAgentRegistryByPageId: Readonly<Record<string, LuluAgentContract>> = Object.freeze(
  Object.fromEntries(
    visibleSections.flatMap((section) =>
      section.pages.map((page) => [
        page.id,
        {
          pageId: page.id,
          pageLabel: page.label,
          sectionLabel: section.label,
          ...getRegistryDetailOrThrow(page.id),
        } satisfies LuluAgentContract,
      ]),
    ),
  ),
);

export const luluVisibleNavigationAgentSections: readonly LuluAgentSection[] = Object.freeze(
  visibleSections.map((section) => ({
    label: section.label,
    pages: section.pages.map((page) => luluAgentRegistryByPageId[page.id]),
  })),
);

export const luluVisibleAgentPageIds = Object.freeze(
  luluVisibleNavigationAgentSections.flatMap((section) => section.pages.map((page) => page.pageId)),
);

export function getLuluAgentContract(pageId: string) {
  return luluAgentRegistryByPageId[pageId] ?? null;
}

export function requireLuluAgentContract(pageId: string) {
  const match = getLuluAgentContract(pageId);
  if (!match) throw new Error(`Unknown Lulu agent page "${pageId}".`);
  return match;
}

export function listLuluAgentContracts() {
  return luluVisibleNavigationAgentSections.flatMap((section) => section.pages);
}
