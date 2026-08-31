import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const manifestSource = readFileSync(resolve(root, "src/pages-manifest.ts"), "utf8");
const manifestJson = manifestSource.match(/export const pages: PageDefinition\[\] = (\[[\s\S]*\]);/)?.[1];
if (!manifestJson) throw new Error("Unable to parse src/pages-manifest.ts");
const routingSource = readFileSync(resolve(root, "src/routing.ts"), "utf8");

const manifest = JSON.parse(manifestJson);
const removedBlock = routingSource.match(/const REMOVED_PAGE_SLUGS = new Set\(\[([\s\S]*?)\]\);/)?.[1] ?? "";
const removedSlugs = new Set(
  [...removedBlock.matchAll(/"([a-z]+(?:-[a-z]+)+-\d{4})"/g)].map((match) => match[1]),
);
const manifestSlugs = new Set(manifest.map((page) => page.slug).filter((slug) => !removedSlugs.has(slug)));
const contractsSource = readFileSync(resolve(root, "src/api/page-contracts.ts"), "utf8");
const contractedSlugs = new Set(
  [...contractsSource.matchAll(/["']([a-z]+(?:-[a-z]+)+-\d{4})["']/g)].map((match) => match[1]),
);
const resourceTypes = [...contractsSource.matchAll(/:\s*["']([a-z][a-z0-9_]*)["'],?\s*$/gm)]
  .map((match) => match[1]);
const uniqueResourceTypes = new Set(resourceTypes);
const issues = [];

const clientContracts = {
  "src/api/auth.ts": ["/auth/register", "/auth/verify-otp", "/auth/login", "/auth/refresh", "/auth/logout", "/auth/logout-all", "/auth/forgot-password", "/auth/resend-otp", "/auth/reset-password", "/auth/me"],
  "src/api/workspaces.ts": ["/workspaces", "/invitations/", "/accept", "/bootstrap"],
  "src/api/onboarding.ts": ["/onboarding", "/company-information", "/business-description", "/offerings", "/platforms", "/complete"],
  "src/api/records.ts": ["/resource-types", "/records/", "/restore"],
  "src/api/metrics.ts": ["/metrics", "/points"],
  "src/api/notifications.ts": ["/notifications", "/read-all", "/read"],
  "src/api/approvals.ts": ["/approvals", "/decision"],
  "src/api/ai.ts": ["/ai/conversations", "/messages", "/respond"],
  "src/api/workspace-app.ts": ["/members", "/saved-views", "/audit", "/billing", "/integrations/", "/sync"],
};

for (const [relativePath, markers] of Object.entries(clientContracts)) {
  const absolutePath = resolve(root, relativePath);
  if (!existsSync(absolutePath)) {
    issues.push(`Missing frontend API client: ${relativePath}`);
    continue;
  }
  const source = readFileSync(absolutePath, "utf8");
  for (const marker of markers) {
    if (!source.includes(marker)) issues.push(`Frontend API client ${relativePath} is missing endpoint ${marker}`);
  }
}

for (const slug of manifestSlugs) {
  if (!contractedSlugs.has(slug)) issues.push(`Page has no API contract: ${slug}`);
}
for (const slug of contractedSlugs) {
  if (!manifestSlugs.has(slug)) issues.push(`API contract references an unknown page: ${slug}`);
}

const backendRoot = process.env.LULU_BACKEND_PATH
  ? resolve(process.env.LULU_BACKEND_PATH)
  : resolve(root, "..", "Lulu-Growth-OS-Backend");
const catalogPath = resolve(backendRoot, "src/domain/resource-catalog.ts");
let backendResourceTypes;
if (existsSync(catalogPath)) {
  const catalogSource = readFileSync(catalogPath, "utf8");
  backendResourceTypes = new Set(
    [...catalogSource.matchAll(/\{ key: '([a-z][a-z0-9_]*)'/g)].map((match) => match[1]),
  );
  for (const resourceType of uniqueResourceTypes) {
    if (!backendResourceTypes.has(resourceType)) {
      issues.push(`Frontend resource contract is missing in the backend catalog: ${resourceType}`);
    }
  }
}

console.log(JSON.stringify({
  manifestPages: manifestSlugs.size,
  contractedPages: contractedSlugs.size,
  resourcePages: resourceTypes.length,
  referencedResourceTypes: uniqueResourceTypes.size,
  backendResourceTypes: backendResourceTypes?.size ?? "not checked (backend repository unavailable)",
  typedApiClients: Object.keys(clientContracts).length,
  issues,
}, null, 2));

if (issues.length) process.exitCode = 1;
