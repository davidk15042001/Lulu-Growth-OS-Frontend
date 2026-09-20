import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const nativePage = fs.readFileSync(path.join(root, 'src', 'NativePage.tsx'), 'utf8');
const appCss = fs.readFileSync(path.join(root, 'src', 'app.css'), 'utf8');
const authenticatedTopBar = fs.readFileSync(path.join(root, 'src', 'components', 'AuthenticatedWorkspaceTopBar.tsx'), 'utf8');
const globalNavigation = fs.readFileSync(path.join(root, 'src', 'components', 'LuluGlobalNavigation.tsx'), 'utf8');
const adminBillingPage = fs.readFileSync(path.join(root, 'src', 'pages', 'admin-billing-overview-9901', 'App.tsx'), 'utf8');
const loginPage = fs.readFileSync(path.join(root, 'src', 'pages', 'brightly-door-5741', 'components', 'generated', 'LuluLoginPage.tsx'), 'utf8');
const connectionSetupPage = fs.readFileSync(path.join(root, 'src', 'pages', 'fresh-tide-9404', 'components', 'generated', 'LuluExistingPlatforms.tsx'), 'utf8');
const appRouter = fs.readFileSync(path.join(root, 'src', 'App.tsx'), 'utf8');
const crmWorkspacePage = fs.readFileSync(path.join(root, 'src', 'pages', 'canonical-crm', 'CrmWorkspacePage.tsx'), 'utf8');
const assistantPage = fs.readFileSync(path.join(root, 'src', 'pages', 'fresh-moon-5374', 'components', 'generated', 'LuluAIAssistant.tsx'), 'utf8');
const minimalAgentPage = fs.readFileSync(path.join(root, 'src', 'components', 'MinimalAgentWorkspacePage.tsx'), 'utf8');
const fundsControl = fs.readFileSync(path.join(root, 'src', 'components', 'LuluUsageControl.tsx'), 'utf8');
const communicationsPage = fs.readFileSync(path.join(root, 'src', 'pages', 'canonical-omnichannel', 'OmniChannelPage.tsx'), 'utf8');
const profilePage = fs.readFileSync(path.join(root, 'src', 'pages', 'canonical-profile', 'ProfilePage.tsx'), 'utf8');
const capabilityRegistry = fs.readFileSync(path.join(root, 'src', 'config', 'workspace-capability-registry.ts'), 'utf8');
const observedAgentRuntime = fs.readFileSync(path.join(root, 'src', 'components', 'useLuluAgentRuntime.ts'), 'utf8');
const failures = [];

if (!nativePage.includes('contract?.kind === "resource" && !VERIFIED_RESOURCE_INTERFACES.has(slug)')) {
  failures.push('Resource pages are not protected by the live production-interface gate.');
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

if (authenticatedTopBar.includes('role="search"') || authenticatedTopBar.includes('Search Lulu AI')) {
  failures.push('The authenticated navigation still exposes the removed global search bar.');
}

if (!authenticatedTopBar.includes('className="lulu-auth-actions"')) {
  failures.push('Authenticated top-bar actions are not kept in their dedicated layout container.');
}

if ([authenticatedTopBar, globalNavigation, adminBillingPage, loginPage].some((source) => source.includes('140+'))) {
  failures.push('A removed 140+ AI agents promotional claim is still visible in the application shell.');
}

if (authenticatedTopBar.includes('lulu-auth-runtime') || globalNavigation.includes('lulu-global-navigation__system') || adminBillingPage.includes('lulu-admin-console__runtime')) {
  failures.push('A removed autonomous-execution navigation badge is still rendered.');
}

if (!connectionSetupPage.includes("id: 'crm'") || !connectionSetupPage.includes("hidden: true") || !connectionSetupPage.includes('platformGroups.filter(group => !group.hidden)')) {
  failures.push('The CRM & Sales connection block is not hidden from the connection setup page.');
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
