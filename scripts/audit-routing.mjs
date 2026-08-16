import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pagesRoot = join(root, "src", "pages");
const manifestSource = readFileSync(join(root, "src", "pages-manifest.ts"), "utf8");
const manifestJson = manifestSource.match(/export const pages: PageDefinition\[\] = (\[[\s\S]*\]);/)?.[1];

if (!manifestJson) throw new Error("Unable to parse src/pages-manifest.ts");

const pages = JSON.parse(manifestJson);
const pageDirectories = readdirSync(pagesRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
const appSource = readFileSync(join(root, "src", "App.tsx"), "utf8");
const routingSource = readFileSync(join(root, "src", "routing.ts"), "utf8");
const issues = [];

if (pages.length !== 140) issues.push(`Expected 140 manifest pages, found ${pages.length}`);
if (pageDirectories.length !== 140) issues.push(`Expected 140 page directories, found ${pageDirectories.length}`);

for (const page of pages) {
  if (!pageDirectories.includes(page.slug)) issues.push(`Missing page directory: ${page.slug}`);
}

const generatedFiles = pageDirectories.flatMap((slug) => {
  const generatedRoot = join(pagesRoot, slug, "components", "generated");
  return readdirSync(generatedRoot).filter((name) => name.endsWith(".tsx")).map((name) => join(generatedRoot, name));
});
const navFiles = generatedFiles.filter((file) => readFileSync(file, "utf8").includes("function LuluSectionNavigation"));
const routedNavFiles = navFiles.filter((file) => readFileSync(file, "utf8").includes("pageLinkProps(page.id)"));
const oldHashNavFiles = navFiles.filter((file) => readFileSync(file, "utf8").includes("href={`#${page.id}`}"));

if (navFiles.length !== 126) issues.push(`Expected 126 navigation files, found ${navFiles.length}`);
if (routedNavFiles.length !== 126) issues.push(`Expected 126 routed navigation files, found ${routedNavFiles.length}`);
if (oldHashNavFiles.length) issues.push(`${oldHashNavFiles.length} navigation files still use hash placeholders`);
if (!appSource.includes("pages.map((page)")) issues.push("App router does not generate routes from the full manifest");
if (!appSource.includes('path="/pages/:slug"')) issues.push("Legacy page redirect is missing");
if (!routingSource.includes("canonicalPathsBySlug")) issues.push("Canonical route map is missing");

const result = {
  manifestPages: pages.length,
  pageDirectories: pageDirectories.length,
  generatedFiles: generatedFiles.length,
  navigationFiles: navFiles.length,
  routedNavigationFiles: routedNavFiles.length,
  legacyHashNavigationFiles: oldHashNavFiles.length,
  issues,
};

console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exitCode = 1;
