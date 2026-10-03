import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const nativePage = fs.readFileSync(path.join(root, 'src', 'NativePage.tsx'), 'utf8');
const appCss = fs.readFileSync(path.join(root, 'src', 'app.css'), 'utf8');
const routing = fs.readFileSync(path.join(root, 'src', 'routing.ts'), 'utf8');
const globalBranding = fs.readFileSync(path.join(root, 'src', 'branding', 'GlobalBranding.tsx'), 'utf8');
const authenticatedTopBar = fs.readFileSync(path.join(root, 'src', 'components', 'AuthenticatedWorkspaceTopBar.tsx'), 'utf8');
const globalNavigation = fs.readFileSync(path.join(root, 'src', 'components', 'LuluGlobalNavigation.tsx'), 'utf8');
const adminBillingPage = fs.readFileSync(path.join(root, 'src', 'pages', 'admin-billing-overview-9901', 'App.tsx'), 'utf8');
const loginPage = fs.readFileSync(path.join(root, 'src', 'pages', 'brightly-door-5741', 'components', 'generated', 'LuluLoginPage.tsx'), 'utf8');
const connectionSetupPage = fs.readFileSync(path.join(root, 'src', 'pages', 'fresh-tide-9404', 'components', 'generated', 'LuluExistingPlatforms.tsx'), 'utf8');
const budgetsPage = fs.readFileSync(path.join(root, 'src', 'pages', 'sunny-minute-1092', 'components', 'generated', 'LuluBudgets.tsx'), 'utf8');
const advertisingConnectionsPage = fs.readFileSync(path.join(root, 'src', 'pages', 'sunny-summer-2293', 'components', 'generated', 'AdAccountsWorkspace.tsx'), 'utf8');
const googleReviewsPage = fs.readFileSync(path.join(root, 'src', 'pages', 'daring-brook-9034', 'components', 'generated', 'LuluReviewsPage.tsx'), 'utf8');
const knowledgePage = fs.readFileSync(path.join(root, 'src', 'pages', 'rich-field-1880', 'components', 'generated', 'LuluAIKnowledge.tsx'), 'utf8');
const appRouter = fs.readFileSync(path.join(root, 'src', 'App.tsx'), 'utf8');
const crmWorkspacePage = fs.readFileSync(path.join(root, 'src', 'pages', 'canonical-crm', 'CrmWorkspacePage.tsx'), 'utf8');
const assistantPage = fs.readFileSync(path.join(root, 'src', 'pages', 'fresh-moon-5374', 'components', 'generated', 'LuluAIAssistant.tsx'), 'utf8');
const minimalAgentPage = fs.readFileSync(path.join(root, 'src', 'components', 'MinimalAgentWorkspacePage.tsx'), 'utf8');
const fundsControl = fs.readFileSync(path.join(root, 'src', 'components', 'LuluUsageControl.tsx'), 'utf8');
const communicationsPage = fs.readFileSync(path.join(root, 'src', 'pages', 'canonical-omnichannel', 'OmniChannelPage.tsx'), 'utf8');
const profilePage = fs.readFileSync(path.join(root, 'src', 'pages', 'canonical-profile', 'ProfilePage.tsx'), 'utf8');
const capabilityRegistry = fs.readFileSync(path.join(root, 'src', 'config', 'workspace-capability-registry.ts'), 'utf8');
const observedAgentRuntime = fs.readFileSync(path.join(root, 'src', 'components', 'useLuluAgentRuntime.ts'), 'utf8');
const virtualOfficePage = fs.readFileSync(path.join(root, 'src', 'pages', 'office', 'VirtualOfficePage.tsx'), 'utf8');
const officeCommandCenter = fs.readFileSync(path.join(root, 'src', 'pages', 'office', 'OfficeCommandCenter.tsx'), 'utf8');
const luluStation = fs.readFileSync(path.join(root, 'src', 'pages', 'office', 'LuluStation.tsx'), 'utf8');
const nativeAgentWorkspace = fs.readFileSync(path.join(root, 'src', 'pages', 'office', 'AgentNativeWorkspace.tsx'), 'utf8');
const calendarPortal = fs.readFileSync(path.join(root, 'src', 'pages', 'lulu-calendar-portal-9014', 'components', 'generated', 'LuluCalendarPortal.tsx'), 'utf8');
const calendarApi = fs.readFileSync(path.join(root, 'src', 'api', 'calendar.ts'), 'utf8');
const luluStationCss = fs.readFileSync(path.join(root, 'src', 'pages', 'office', 'lulu-station.css'), 'utf8');
const executivePage = fs.readFileSync(path.join(root, 'src', 'pages', 'tender-water-4095', 'App.tsx'), 'utf8');
const executiveWorkspace = fs.readFileSync(path.join(root, 'src', 'components', 'ExecutiveOverviewWorkspace.tsx'), 'utf8');
const removedOfficeControlSurfaces = [
  path.join(root, 'src', 'pages', 'office', 'VirtualOfficeControlCenter.tsx'),
  path.join(root, 'src', 'pages', 'office', 'WorkforceControlCenterCompletion.tsx'),
];
const failures = [];

if (!nativePage.includes('contract?.kind === "resource" && !VERIFIED_RESOURCE_INTERFACES.has(slug)')) {
  failures.push('Resource pages are not protected by the live production-interface gate.');
}

if (!nativePage.includes('const useLiveResourceFallback') || !nativePage.includes('<LiveResourceRoute resourceType={contract.resourceType} />')) {
  failures.push('A resource page without a dedicated agent could fall back to a static generated interface.');
}

const expectedVerifiedResourceInterfaces = [
  'sunny-minute-1092',
  'sunny-summer-2293',
  'daring-brook-9034',
  'rich-field-1880',
];
const verifiedResourceInterfaceBlock = nativePage.match(/const VERIFIED_RESOURCE_INTERFACES = new Set\(\[([\s\S]*?)\]\);/);
const verifiedResourceInterfaces = verifiedResourceInterfaceBlock
  ? [...verifiedResourceInterfaceBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1])
  : [];

if (
  verifiedResourceInterfaces.length !== expectedVerifiedResourceInterfaces.length
  || !expectedVerifiedResourceInterfaces.every((slug) => verifiedResourceInterfaces.includes(slug))
) {
  failures.push('The live-resource exception list has changed without an explicit production-interface review.');
}

if (
  !budgetsPage.includes("useLiveRecords('ad_budgets')")
  || !budgetsPage.includes('adSpendApi.overview(targetWorkspaceId)')
  || !budgetsPage.includes('adSpendApi.listBudgetAuthorizations(targetWorkspaceId)')
  || !budgetsPage.includes('adSpendApi.createBudgetAuthorization(targetWorkspaceId')
  || !advertisingConnectionsPage.includes('providerControlApi.catalog(workspaceId)')
  || !advertisingConnectionsPage.includes('providerControlApi.connections(workspaceId)')
  || !advertisingConnectionsPage.includes('providerControlApi.launchReadiness(workspaceId)')
  || !advertisingConnectionsPage.includes('providerControlApi.verify(workspaceId, connection.id)')
  || !googleReviewsPage.includes('workspaceAppApi.googleReviews(workspaceId')
  || !googleReviewsPage.includes('workspaceAppApi.updateGoogleReviewReply(workspaceId, review.id')
  || !knowledgePage.includes("useLiveRecords('ai_knowledge')")
  || !knowledgePage.includes("ingestRecord('ai_knowledge', form)")
) {
  failures.push('A custom resource interface is no longer fully backed by its canonical live Workspace API.');
}

if (!appCss.includes('body { display: block !important; height: auto !important;')) {
  failures.push('Page-local generated styles can override the root document flow.');
}

if (!appCss.includes('overflow-x: clip !important;')) {
  failures.push('The application root does not prevent document-level horizontal scrolling.');
}

if (
  !appCss.includes('position: sticky;')
  || !appCss.includes('width: var(--lulu-workspace-navigation-width);')
  || !appCss.includes('grid-column: 2;')
) {
  failures.push('The desktop navigation is not pinned independently from document height.');
}

if (appCss.includes('position: fixed;\n    top: var(--lulu-workspace-topbar-height);')) {
  failures.push('The desktop navigation can receive the top-bar offset twice.');
}

if (appCss.includes('a[data-lulu-soon="true"]') || appCss.includes('[data-lulu-section-soon="true"]')) {
  failures.push('The application still visually disables Workspace navigation as “soon”.');
}

if (authenticatedTopBar.includes('role="search"') || authenticatedTopBar.includes('Search Lulu AI')) {
  failures.push('The authenticated navigation still exposes the removed global search bar.');
}

if (!authenticatedTopBar.includes('className="lulu-auth-actions"')) {
  failures.push('Authenticated top-bar actions are not kept in their dedicated layout container.');
}

if ([authenticatedTopBar, globalNavigation, adminBillingPage, loginPage].some((source) => source.includes('140+'))) {
  failures.push('A removed 140+ AI agents promotional claim is still visible in the application shell.');
}

if (
  !loginPage.includes('data-lulu-local-brand="true"')
  || !globalBranding.includes('LOCAL_BRAND_SELECTOR')
  || !globalBranding.includes('!node.parentElement.closest(LOCAL_BRAND_SELECTOR)')
) {
  failures.push('The login hero can be replaced by the global-branding logo injection instead of its intended compact product label.');
}

if (
  !routing.includes('"brightly-door-5741": routes.auth.login')
  || !appRouter.includes('const isAuthPage = resolvedPath === routes.auth.login')
  || !appRouter.includes('<PublicAuthRoute><PageRoute page={page} /></PublicAuthRoute>')
) {
  failures.push('The public /login route is no longer guaranteed to render the redesigned Lulu login experience.');
}

if (authenticatedTopBar.includes('lulu-auth-runtime') || globalNavigation.includes('lulu-global-navigation__system') || adminBillingPage.includes('lulu-admin-console__runtime')) {
  failures.push('A removed autonomous-execution navigation badge is still rendered.');
}

if (!connectionSetupPage.includes("id: 'crm'") || !connectionSetupPage.includes("hidden: true") || !connectionSetupPage.includes('platformGroups.filter(group => !group.hidden)')) {
  failures.push('The CRM & Sales connection block is not hidden from the connection setup page.');
}

if (
  !connectionSetupPage.includes('oauthSelfServicePermissions(workspaceId)')
  || !connectionSetupPage.includes('Secure connection is not enabled for this workspace')
  || !connectionSetupPage.includes("guidePlatform === 'WhatsApp'")
  || connectionSetupPage.includes('Client ID and Client Secret')
  || connectionSetupPage.includes('Callback URL: https://api.lulu-ai.tech')
  || !advertisingConnectionsPage.includes('connectionAvailable')
  || !advertisingConnectionsPage.includes('is not enabled for secure self-service connection in this workspace')
  || !googleReviewsPage.includes("providers.includes('google-business')")
  || !googleReviewsPage.includes('disabled={busyConnect || !googleOauthEnabled}')
) {
  failures.push('Provider connection screens can expose setup secrets or start OAuth when server-side self-service is not enabled.');
}

if (!appRouter.includes('<CrmWorkspacePage kind="companies" showEntitySwitcher={false} />')) {
  failures.push('The sturdy-month CRM route is not locked to its companies-only view.');
}

if (!crmWorkspacePage.includes('showEntitySwitcher &&')) {
  failures.push('The canonical CRM page cannot hide its contacts/companies tab switcher.');
}

if (!capabilityRegistry.includes('section.label !== STATISTICS_LABEL')) {
  failures.push('Statistics is not hidden from the restored customer navigation.');
}

if (!capabilityRegistry.includes('DIRECT_SECTION_LABELS = new Set([AI_LABEL, OMNICHANNEL_LABEL])')) {
  failures.push('AI and OmniChannel are not direct navigation links.');
}

if (!globalNavigation.includes('if (section.label === CRM_LABEL) return directLink(section, CRM_LANDING_PAGE_ID)')) {
  failures.push('CRM is not a direct navigation link to the companies workspace.');
}

if (
  assistantPage.includes('LuluCommandCenter')
  || assistantPage.includes('setView("command")')
  || assistantPage.includes('`${storageKey}.view`')
) {
  failures.push('The removed command-center switcher is still rendered on the AI Assistant page.');
}

if (!capabilityRegistry.includes('SETTINGS_PAGE_IDS = new Set(["rich-field-1880"])') || !capabilityRegistry.includes('settings.pages = [...settings.pages, ...ai.pages.filter')) {
  failures.push('Knowledge is not exposed exclusively through the Settings navigation section.');
}

if (minimalAgentPage.includes('AgentRuntimeControlPanel') || minimalAgentPage.includes('usePageAgentRun') || minimalAgentPage.includes('Needs attention')) {
  failures.push('A customer-facing page still exposes agent runtime controls or a generic approval-like attention queue.');
}

if (
  minimalAgentPage.includes('Only new paid-media funds need customer authorization')
  || minimalAgentPage.includes('until an authorized workspace administrator approves the exact action')
  || !minimalAgentPage.includes('the server rechecks authorization, funding, provider readiness and verification')
  || !minimalAgentPage.includes('canonical execution policy permits the workspace, capability, provider state, funding and verification route')
) {
  failures.push('The agent workspace presents an autonomy boundary that does not match the server-side policy gates.');
}

if (!fundsControl.includes('adSpendApi.overview') || !fundsControl.includes('routes.app.adSpend') || !fundsControl.includes('routes.app.funds')) {
  failures.push('Funds does not combine AI and advertising wallets.');
}

if (fundsControl.includes('storagePerGbMonthUsd') || fundsControl.includes('classAPerMillionOperationsUsd')) {
  failures.push('Funds exposes low-level storage-provider rates.');
}

if (!communicationsPage.includes('omnichannelApi.send') || !communicationsPage.includes('omnichannelApi.takeOver') || !communicationsPage.includes('omnichannelApi.note') || !communicationsPage.includes('omnichannelApi.returnToAi')) {
  failures.push('Communications does not expose the canonical manual send, note, takeover and return-to-AI controls.');
}

if (observedAgentRuntime.includes('agentApi.create')) {
  failures.push('Rendering an agent-aware page can still create an agent run implicitly.');
}

if (!capabilityRegistry.includes('workspaceCapabilityRoutes') || !capabilityRegistry.includes('buildWorkspaceDeepLink') || !globalNavigation.includes('getWorkspaceNavigationSections')) {
  failures.push('Navigation and future Office deep links do not share the typed capability registry.');
}

if (
  !profilePage.includes('requiredActivationFields')
  || !profilePage.includes("'companyLogo'")
  || !profilePage.includes("'bankAccountNumber'")
  || !profilePage.includes("'branch'")
  || !profilePage.includes('Every required profile field must be valid and saved before Lulu can build the Knowledge Base.')
) {
  failures.push('Profile activation does not enforce the complete required profile gate.');
}

if (!appRouter.includes('path={routes.app.omnichannel}') || !appRouter.includes('path={routes.app.growth}') || !appRouter.includes('path={routes.app.finance}')) {
  failures.push('The consolidated customer routes are not mounted.');
}

if (!appRouter.includes('<EmailWorkspacePage />') || !appRouter.includes('<CalendarWorkspacePage />')) {
  failures.push('The canonical email and calendar routes do not render their real workspaces.');
}

if (!calendarPortal.includes('CalendarDeliverySettings')
  || !calendarPortal.includes('CalendarDeliveryTargetDialog')
  || !calendarPortal.includes('composioApi.teams(workspaceId')
  || !calendarPortal.includes('calendarApi.deliveryTargetCandidates(workspaceId, teamId)')
  || !calendarPortal.includes('calendarApi.createDeliveryTarget(workspaceId, body)')
  || !calendarPortal.includes('calendarApi.updateDeliveryTarget(workspaceId, target.id, body)')
  || !calendarApi.includes('deliveryTargets:')
  || !calendarApi.includes('deliveryTargetCandidates:')
  || !calendarApi.includes('createDeliveryTarget:')
  || !calendarApi.includes('updateDeliveryTarget:')) {
  failures.push('The calendar workspace must expose the existing tenant-scoped Composio delivery targets and their safe lifecycle configuration.');
}

if (luluStation.includes('<iframe') || nativeAgentWorkspace.includes('<iframe')) {
  failures.push('Office employee dialogs must render native workspace surfaces, not iframes.');
}

if (
  !luluStationCss.includes('.lulu-station__modal-body > * { min-width: 0; }')
  || !luluStationCss.includes('.lulu-station__modal-details { display: grid; min-width: 0;')
  || !luluStationCss.includes('overflow-wrap: anywhere;')
  || !luluStationCss.includes('.lulu-station__modal-layer { position: fixed; z-index: 100;')
  || !luluStation.includes('createPortal(<div className="lulu-station__modal-layer"')
  || !luluStation.includes('>, document.body) : null}')
) {
  failures.push('Office employee workspaces can overflow or be obscured by the persistent command surface.');
}

if (
  !nativeAgentWorkspace.includes('function EmailSurface')
  || !nativeAgentWorkspace.includes('function CalendarSurface')
  || !nativeAgentWorkspace.includes('function ReviewSurface')
  || !nativeAgentWorkspace.includes('function CommunicationsSurface')
  || !nativeAgentWorkspace.includes('function CommerceSurface')
  || !nativeAgentWorkspace.includes('function FinanceSurface')
  || !nativeAgentWorkspace.includes('function MarketingSurface')
  || !nativeAgentWorkspace.includes('function WebsiteSurface')
  || !nativeAgentWorkspace.includes('function OperationsSurface')
  || !nativeAgentWorkspace.includes('function IntelligenceSurface')
  || !nativeAgentWorkspace.includes('if (/calendar/.test(key)) return "calendar";')
  || !nativeAgentWorkspace.includes('if (/email|inbox|mail/.test(key)) return "email";')
  || !nativeAgentWorkspace.includes('if (/reputation|review/.test(key)) return "reputation";')
  || !nativeAgentWorkspace.includes('if (has("omnichannel.") || /support|communication/.test(key)) return "communications";')
  || !nativeAgentWorkspace.includes('has("quotes.")')
  || !nativeAgentWorkspace.includes('/invoice|billing|bookkeeping|finance|quote/.test(key)')
  || !nativeAgentWorkspace.includes('omnichannelApi.conversations(workspaceId, "limit=16")')
  || !nativeAgentWorkspace.includes('omnichannelApi.conversation(workspaceId, first.id)')
  || !nativeAgentWorkspace.includes('const messageRequestRef = useRef(0);')
  || !nativeAgentWorkspace.includes('requestId === messageRequestRef.current')
  || nativeAgentWorkspace.includes('omnichannelApi.analytics(workspaceId)')
  || !nativeAgentWorkspace.includes('commerceApi.listOrders(workspaceId, { limit: 8 })')
  || !nativeAgentWorkspace.includes('commercialDocumentsApi.listInvoices(workspaceId, "limit=8")')
  || !nativeAgentWorkspace.includes('socialPublishingApi.listPublications(workspaceId)')
  || !nativeAgentWorkspace.includes('websitesApi.list(workspaceId)')
  || !nativeAgentWorkspace.includes('providerControlApi.launchReadiness(workspaceId)')
  || !nativeAgentWorkspace.includes('executiveApi.overview(workspaceId)')
  || !nativeAgentWorkspace.includes('workspaceAppApi.googleReviews(workspaceId, { limit: 12 })')
  || !nativeAgentWorkspace.includes('GOOGLE_BUSINESS_NOT_CONNECTED')
  || !nativeAgentWorkspace.includes('GOOGLE_BUSINESS_REAUTH_REQUIRED')
  || !nativeAgentWorkspace.includes('setManager(null);')
) {
  failures.push('Dedicated communication, scheduling and reputation employees do not resolve to their native live workspace surfaces.');
}

if (!luluStation.includes('routes.app.dashboard') || !luluStation.includes('Open workspace')) {
  failures.push('The Office does not provide a direct route back to the workspace dashboard.');
}

if (
  (luluStation.match(/Open workspace/g) ?? []).length < 2
  || !luluStation.includes('const ROOM_ZONE_CAPACITY = 8')
  || !luluStation.includes('employees: department.employees.slice(zoneIndex * ROOM_ZONE_CAPACITY, (zoneIndex + 1) * ROOM_ZONE_CAPACITY)')
  || !luluStation.includes('>{employees.length} CREW</text>')
) {
  failures.push('The Office does not keep every visible room crew bounded, accurately counted and reachable from a workspace entry point.');
}

if (!luluStation.includes('overview.summary.runningWorkItems') || !luluStation.includes('queuedOrWaitingWork')) {
  failures.push('Office work summary does not distinguish running work from queued or human-gated items.');
}

if (
  !luluStation.includes('platformFundedAi')
  || !luluStation.includes('Platform-funded work')
  || !luluStation.includes('prepaid AI credit is not being used')
  || !luluStationCss.includes('.lulu-station__metrics > div.is-platform-funded')
) {
  failures.push('Office activity does not clearly distinguish platform-funded AI work from customer prepaid-credit work.');
}

if (
  !luluStation.includes('overviewSnapshot?.workspaceId === workspaceId')
  || !luluStation.includes('employeeDetailSnapshot?.workspaceId === workspaceId && employeeDetailSnapshot.employeeId === selectedEmployeeId')
  || !luluStation.includes('const overviewRequestRef = useRef(0);')
  || !luluStation.includes('const employeeRequestRef = useRef(0);')
  || !luluStation.includes('setOverviewSnapshot({ workspaceId, data: response.data });')
  || !luluStation.includes('setEmployeeDetailSnapshot({ workspaceId, employeeId: employee.id, data: response.data });')
  || !luluStation.includes('employeeRequestRef.current += 1;')
) {
  failures.push('The Office can render a stale overview or employee detail after a workspace or agent selection changes.');
}

if (
  !luluStation.includes('is-working" />working')
  || !luluStation.includes('is-monitoring" />monitoring')
  || !luluStation.includes('is-waiting" />waiting / human control')
  || !luluStation.includes('is-attention" />approval / error')
  || !luluStation.includes('is-blocked" />AI credit required')
  || !luluStation.includes('is-idle" />idle')
  || !luluStation.includes('is-offline" />offline')
  || !luluStationCss.includes('.lulu-station__character--offline .lulu-station__character-status { fill: #526a74; }')
) {
  failures.push('The Office status legend does not fully and truthfully match the visible employee status colors.');
}

if (
  !luluStation.includes('className="lulu-station__character-frame"')
  || !luluStation.includes('transform={`translate(${x} ${y})`}')
  || !luluStation.includes('className={`lulu-station__character lulu-station__character--${tone}')
) {
  failures.push('Office agent animations can override their SVG room coordinates and displace crew members from their stations.');
}

if (luluStation.includes('Open control center') || luluStation.includes('Open operational control center')) {
  failures.push('The Office still exposes a control-center link whose legacy surface is not rendered.');
}

if (!virtualOfficePage.includes('<LuluStation />') || !virtualOfficePage.includes('<OfficeCommandCenter />')) {
  failures.push('The Office route no longer composes the station and its governed Lulu command surface.');
}

const removedOfficeCopy = [
  'AI workforce control center',
  'Operational cockpit',
  'Where the company works',
  'AGENT REGISTRY / CAPABILITY CATALOG',
];
if ([virtualOfficePage, officeCommandCenter, luluStation].some((source) => removedOfficeCopy.some((copy) => source.includes(copy)))) {
  failures.push('The Office still renders a heading that was explicitly removed from the customer experience.');
}

if (removedOfficeControlSurfaces.some((surface) => fs.existsSync(surface))) {
  failures.push('A removed legacy Office control-center surface is still present in the production source tree.');
}

if (
  !executivePage.includes('ExecutiveOverviewWorkspace')
  || executivePage.includes('LuluExecutiveOverview')
  || !executiveWorkspace.includes('executiveApi.overview')
  || executiveWorkspace.includes('Business Status: Strong')
  || executiveWorkspace.includes('Your business is performing strongly overall')
  || executiveWorkspace.includes('createdAt) - Date.parse(left!.createdAt)')
  || !executiveWorkspace.includes('right.completedAt ?? right.updatedAt')
) {
  failures.push('The Executive Overview can still render a static management-health claim instead of canonical executive evidence.');
}

const inspectedRoots = [
  path.join(root, 'src', 'components'),
  path.join(root, 'src', 'pages', 'sunny-minute-1092'),
  path.join(root, 'src', 'pages', 'sunny-summer-2293'),
  path.join(root, 'src', 'pages', 'daring-brook-9034'),
  path.join(root, 'src', 'pages', 'rich-field-1880'),
  path.join(root, 'src', 'pages', 'fresh-tide-9404'),
  path.join(root, 'src', 'pages', 'fresh-moon-5374'),
];

function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    return /\.(tsx?|jsx?)$/.test(entry.name) ? [target] : [];
  });
}

const forbidden = [
  { pattern: /\(soon\)|coming soon/i, label: 'coming-soon prototype copy' },
  { pattern: /1,284 collections|94% confidence|Today at 10:32/i, label: 'known static sample claim' },
  { pattern: />\s*Approve\s*</i, label: 'operational approval control' },
  { pattern: /(?<!growth)approvalApi|agentApi\.approve|Offene Freigaben|>\s*Freigeben\s*</i, label: 'legacy approval workflow' },
];

for (const file of inspectedRoots.flatMap(sourceFiles)) {
  const source = fs.readFileSync(file, 'utf8');
  for (const rule of forbidden) {
    if (rule.pattern.test(source)) failures.push(`${path.relative(root, file)} contains ${rule.label}.`);
  }
}

if (failures.length) {
  console.error(['Agentic production UI audit failed:', ...failures.map((failure) => `- ${failure}`)].join('\n'));
  process.exit(1);
}

console.log('Agentic production UI audit passed.');
