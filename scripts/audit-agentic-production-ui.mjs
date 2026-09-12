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

for (const label of ['Lulu', 'Companies', 'Communications', 'Growth', 'Online Presence', 'Finance']) {
  if (!globalNavigation.includes(`label: "${label}"`)) failures.push(`The consolidated ${label} navigation destination is missing.`);
}

if (globalNavigation.includes('STATISTICS_LABEL') || globalNavigation.includes('luluDropdownNavigation')) {
  failures.push('The customer navigation still depends on the legacy generated dropdown tree.');
}

if (!globalNavigation.includes('href: "/app/sturdy-month-1562"')) {
  failures.push('Companies is not a direct navigation link to the companies workspace.');
}

if (
  assistantPage.includes('LuluCommandCenter')
  || assistantPage.includes('setView("command")')
  || assistantPage.includes('`${storageKey}.view`')
) {
  failures.push('The removed command-center switcher is still rendered on the AI Assistant page.');
}

if (!globalNavigation.includes('label: "Knowledge Base", href: routes.app.knowledgeBase')) {
  failures.push('Knowledge is not exposed exclusively through the Settings navigation section.');
}

if (minimalAgentPage.includes('AgentRuntimeControlPanel') || minimalAgentPage.includes('usePageAgentRun') || minimalAgentPage.includes('Needs attention')) {
  failures.push('A customer-facing page still exposes agent runtime controls or a generic approval-like attention queue.');
}

if (authenticatedTopBar.includes('LuluWorkspaceRefreshButton')) {
  failures.push('The removed customer Update control is still mounted in the top bar.');
}

if (!fundsControl.includes('adSpendApi.overview') || !fundsControl.includes('routes.app.adSpend') || !fundsControl.includes('routes.app.funds')) {
  failures.push('Funds does not combine AI and advertising wallets.');
}

if (fundsControl.includes('storagePerGbMonthUsd') || fundsControl.includes('classAPerMillionOperationsUsd')) {
  failures.push('Funds exposes low-level storage-provider rates.');
}

if (communicationsPage.includes('omnichannelApi.send') || communicationsPage.includes('omnichannelApi.takeOver') || communicationsPage.includes('omnichannelApi.note')) {
  failures.push('Communications still exposes manual customer-message operations.');
}

if (!profilePage.includes("(['companyName', 'industry'] as const)") || profilePage.includes('Complete every company, legal, contact and banking field')) {
  failures.push('Profile activation is not limited to the minimum operating identity.');
}

if (!appRouter.includes('path={routes.app.communications}') || !appRouter.includes('path={routes.app.growth}') || !appRouter.includes('path={routes.app.finance}')) {
  failures.push('The consolidated customer routes are not mounted.');
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
  { pattern: /approvalApi|agentApi\.approve|Offene Freigaben|>\s*Freigeben\s*</i, label: 'legacy approval workflow' },
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
