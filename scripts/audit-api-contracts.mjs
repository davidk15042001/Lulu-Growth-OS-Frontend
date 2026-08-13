import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const manifestSource = readFileSync(resolve(root, "src/pages-manifest.ts"), "utf8");
const manifestJson = manifestSource.match(/export const pages: PageDefinition\[\] = (\[[\s\S]*\]);/)?.[1];
if (!manifestJson) throw new Error("Unable to parse src/pages-manifest.ts");

const manifest = JSON.parse(manifestJson);
const manifestSlugs = new Set(manifest.map((page) => page.slug));
const contractsSource = readFileSync(resolve(root, "src/api/page-contracts.ts"), "utf8");
const contractedSlugs = new Set(
  [...contractsSource.matchAll(/["']([a-z]+(?:-[a-z]+)+-\d{4})["']/g)].map((match) => match[1]),
);
const resourceTypes = [...contractsSource.matchAll(/:\s*["']([a-z][a-z0-9_]*)["'],?\s*$/gm)]
  .map((match) => match[1]);
const uniqueResourceTypes = new Set(resourceTypes);
const issues = [];

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
  issues,
}, null, 2));

if (issues.length) process.exitCode = 1;
