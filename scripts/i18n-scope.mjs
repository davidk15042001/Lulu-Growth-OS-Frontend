import path from "node:path";

// These routes belong to the Statistics navigation group. They are intentionally
// outside the translation scope until that part of the product is enabled again.
export const STATISTICS_PAGE_SLUGS = new Set([
  "fancily-leaf-1766",
  "quietly-stone-4158",
  "cool-rain-6499",
  "richly-land-8084",
  "calm-tide-3752",
  "zesty-earth-3938",
  "bravely-bay-4544",
  "eager-minute-1586",
  "fair-bridge-8618",
  "soft-town-3284",
  "wisely-gate-3183",
  "sharp-morning-7310",
  "sparklingly-city-3338",
  "radiant-hour-5376",
  "lucky-park-8649",
  "vibrantly-second-9428",
  "sturdy-week-3372",
  "boldly-field-4971",
]);

export function pageSlugFromSourcePath(sourcePath) {
  const normalized = sourcePath.split(path.sep).join("/");
  return normalized.match(/^src\/pages\/([^/]+)\//)?.[1] ?? null;
}

export function isTranslationSourceFile(sourcePath) {
  const slug = pageSlugFromSourcePath(sourcePath);
  return !slug || !STATISTICS_PAGE_SLUGS.has(slug);
}
