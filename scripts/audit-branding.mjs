import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const issues = [];
const logoPath = resolve(root, "public/branding/lulu-agentic-logo.svg");
const darkLogoPath = resolve(root, "public/branding/lulu-agentic-logo-dark.svg");
const markPath = resolve(root, "public/branding/lulu-agentic-mark.svg");
const faviconPath = resolve(root, "public/favicon-agentic.svg");
const manifestPath = resolve(root, "public/site.webmanifest");
const indexPath = resolve(root, "index.html");
const runtimePath = resolve(root, "src/api/runtime.tsx");
const brandingPath = resolve(root, "src/branding/GlobalBranding.tsx");
const manifestSource = readFileSync(resolve(root, "src/pages-manifest.ts"), "utf8");
const pageCount = [...manifestSource.matchAll(/"slug":/g)].length;

if (!existsSync(logoPath) || statSync(logoPath).size === 0) issues.push("The global logo asset is missing or empty.");
if (!existsSync(darkLogoPath) || statSync(darkLogoPath).size === 0) issues.push("The dark-surface logo asset is missing or empty.");
if (!existsSync(markPath) || statSync(markPath).size === 0) issues.push("The compact logo mark is missing or empty.");
if (!existsSync(faviconPath) || statSync(faviconPath).size === 0) issues.push("The supplied favicon is missing or empty.");
if (!existsSync(manifestPath) || statSync(manifestPath).size === 0) issues.push("The web app manifest is missing or empty.");
const indexSource = readFileSync(indexPath, "utf8");
if (!indexSource.includes('/favicon-agentic.svg')) issues.push("The application document does not reference the supplied favicon.");
if (!indexSource.includes('/site.webmanifest')) issues.push("The application document does not reference the web app manifest.");
if (!existsSync(brandingPath)) issues.push("The global branding component is missing.");
else {
  const brandingSource = readFileSync(brandingPath, "utf8");
  if (!brandingSource.includes("/branding/lulu-agentic-logo.svg")) issues.push("The branding component does not use the supplied logo asset.");
  if (!brandingSource.includes("/branding/lulu-agentic-logo-dark.svg")) issues.push("The branding component does not use the dark-surface logo asset.");
  if (!brandingSource.includes("findBrandHosts")) issues.push("The branding component does not discover existing logo hosts.");
  if (!brandingSource.includes("background:transparent!important")) issues.push("The global logo is not rendered on a transparent background.");
}
if (!readFileSync(runtimePath, "utf8").includes("<GlobalBranding")) issues.push("The branding component is not mounted by the page runtime.");

console.log(JSON.stringify({
  routedPagesWithGlobalBranding: pageCount,
  logoBytes: existsSync(logoPath) ? statSync(logoPath).size : 0,
  darkLogoBytes: existsSync(darkLogoPath) ? statSync(darkLogoPath).size : 0,
  markBytes: existsSync(markPath) ? statSync(markPath).size : 0,
  faviconBytes: existsSync(faviconPath) ? statSync(faviconPath).size : 0,
  issues,
}, null, 2));
if (issues.length) process.exitCode = 1;
