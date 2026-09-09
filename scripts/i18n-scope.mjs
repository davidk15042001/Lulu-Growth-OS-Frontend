import path from "node:path";

// Every routed page is part of the active translation contract. Keep the export
// for the audit report and older tooling, but do not exempt Statistics pages (or
// any other product area) from German, English and Simplified Chinese coverage.
export const STATISTICS_PAGE_SLUGS = new Set();

export function pageSlugFromSourcePath(sourcePath) {
  const normalized = sourcePath.split(path.sep).join("/");
  return normalized.match(/^src\/pages\/([^/]+)\//)?.[1] ?? null;
}

export function isTranslationSourceFile(sourcePath) {
  const slug = pageSlugFromSourcePath(sourcePath);
  return !slug || !STATISTICS_PAGE_SLUGS.has(slug);
}
