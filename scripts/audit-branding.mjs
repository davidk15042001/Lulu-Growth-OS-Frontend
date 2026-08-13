import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const issues = [];
const logoPath = resolve(root, "public/branding/lulu-intelligence-logo.png");
const runtimePath = resolve(root, "src/api/runtime.tsx");
const brandingPath = resolve(root, "src/branding/GlobalBranding.tsx");
const manifestSource = readFileSync(resolve(root, "src/pages-manifest.ts"), "utf8");
const pageCount = [...manifestSource.matchAll(/"slug":/g)].length;

if (!existsSync(logoPath) || statSync(logoPath).size === 0) issues.push("The global logo asset is missing or empty.");
if (!existsSync(brandingPath)) issues.push("The global branding component is missing.");
else {
  const brandingSource = readFileSync(brandingPath, "utf8");
  if (!brandingSource.includes("/branding/lulu-intelligence-logo.png")) issues.push("The branding component does not use the supplied logo asset.");
  if (!brandingSource.includes("findBrandHosts")) issues.push("The branding component does not discover existing logo hosts.");
}
if (!readFileSync(runtimePath, "utf8").includes("<GlobalBranding")) issues.push("The branding component is not mounted by the page runtime.");
if (pageCount !== 141) issues.push(`Expected 141 routed pages, found ${pageCount}.`);

console.log(JSON.stringify({ routedPagesWithGlobalBranding: pageCount, logoBytes: existsSync(logoPath) ? statSync(logoPath).size : 0, issues }, null, 2));
if (issues.length) process.exitCode = 1;
