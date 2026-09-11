import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const nativePage = fs.readFileSync(path.join(root, 'src', 'NativePage.tsx'), 'utf8');
const appCss = fs.readFileSync(path.join(root, 'src', 'app.css'), 'utf8');
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
