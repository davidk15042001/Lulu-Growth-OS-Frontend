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
const agentRegistry = fs.readFileSync(path.join(root, 'src', 'config', 'lulu-agent-registry.ts'), 'utf8');
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

if (!appCss.includes('width: var(--lulu-workspace-navigation-width);') || !appCss.includes('grid-column: 2;')) {
  failures.push('The desktop navigation is not pinned independently from document height.');
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

if (
  !globalNavigation.includes('const STATISTICS_PAGE_IDS = new Set(["cosmic-pool-1616", "deeply-noon-9539"])')
  || !globalNavigation.includes('pages: crmSection.pages.filter((page) => !STATISTICS_PAGE_IDS.has(page.id))')
  || globalNavigation.includes('section.label !== STATISTICS_LABEL && section.pages.length > 0')
) {
  failures.push('CRM activities and tasks are not exposed exclusively through the Statistics navigation section.');
}

if (
  !agentRegistry.includes('const STATISTICS_PAGE_IDS = new Set(["cosmic-pool-1616", "deeply-noon-9539"])')
  || !agentRegistry.includes('pages: crmSection.pages.filter((page) => !STATISTICS_PAGE_IDS.has(page.id))')
) {
  failures.push('The agent registry does not match the Statistics navigation placement for CRM activities and tasks.');
}

if (
  !globalNavigation.includes('const CRM_LANDING_PAGE_ID = "sturdy-month-1562"')
  || !globalNavigation.includes('if (section.label === CRM_LABEL) {')
  || !globalNavigation.includes('const crmProps = pageLinkProps(CRM_LANDING_PAGE_ID)')
) {
  failures.push('CRM is not a direct navigation link to the companies workspace.');
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
