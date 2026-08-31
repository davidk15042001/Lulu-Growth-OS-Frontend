import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pagesRoot = join(root, "src", "pages");
const manifestSource = readFileSync(join(root, "src", "pages-manifest.ts"), "utf8");
const manifestJson = manifestSource.match(/export const pages: PageDefinition\[\] = (\[[\s\S]*\]);/)?.[1];

if (!manifestJson) throw new Error("Unable to parse src/pages-manifest.ts");

const pages = JSON.parse(manifestJson);
const pageDirectories = readdirSync(pagesRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
const manifestPageDirectories = pageDirectories.filter((slug) => pages.some((page) => page.slug === slug));
const appSource = readFileSync(join(root, "src", "App.tsx"), "utf8");
const routingSource = readFileSync(join(root, "src", "routing.ts"), "utf8");
const issues = [];

if (pages.length !== manifestPageDirectories.length) {
  issues.push(`Manifest pages (${pages.length}) and manifest-backed page directories (${manifestPageDirectories.length}) are out of sync`);
}

for (const page of pages) {
  if (!manifestPageDirectories.includes(page.slug)) issues.push(`Missing page directory: ${page.slug}`);
}

const generatedFiles = manifestPageDirectories.flatMap((slug) => {
  const generatedRoot = join(pagesRoot, slug, "components", "generated");
  return readdirSync(generatedRoot).filter((name) => name.endsWith(".tsx")).map((name) => join(generatedRoot, name));
});
const navFiles = generatedFiles.filter((file) => readFileSync(file, "utf8").includes("function LuluSectionNavigation"));
const routedNavFiles = navFiles.filter((file) => readFileSync(file, "utf8").includes("pageLinkProps(page.id)"));
const oldHashNavFiles = navFiles.filter((file) => readFileSync(file, "utf8").includes("href={`#${page.id}`}"));

if (routedNavFiles.length !== navFiles.length) issues.push(`Expected all ${navFiles.length} navigation files to use routed links, found ${routedNavFiles.length}`);
if (oldHashNavFiles.length) issues.push(`${oldHashNavFiles.length} navigation files still use hash placeholders`);
if (!appSource.includes("pages.map((page)")) issues.push("App router does not generate routes from the full manifest");
if (!appSource.includes('path="/pages/:slug"')) issues.push("Legacy page redirect is missing");
if (!routingSource.includes("canonicalPathsBySlug")) issues.push("Canonical route map is missing");
if (!appSource.includes("admin-billing-overview-9901") || !pageDirectories.includes("admin-billing-overview-9901")) issues.push("Private admin billing route is missing");

const result = {
  manifestPages: pages.length,
  pageDirectories: pageDirectories.length,
  manifestPageDirectories: manifestPageDirectories.length,
  generatedFiles: generatedFiles.length,
  navigationFiles: navFiles.length,
  routedNavigationFiles: routedNavFiles.length,
  legacyHashNavigationFiles: oldHashNavFiles.length,
  issues,
};

console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exitCode = 1;
