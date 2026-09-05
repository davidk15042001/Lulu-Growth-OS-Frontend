import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  collectI18nSourceCatalog,
  hasMatchingPlaceholders,
  isLikelyEnglishSentence,
  isLikelyGermanSource,
  requiresHanTranslation,
} from "./i18n-source-catalog.mjs";
import { pageSlugFromSourcePath, STATISTICS_PAGE_SLUGS } from "./i18n-scope.mjs";

const root = process.cwd();
const languageSource = readFileSync(join(root, "src", "i18n", "languages.ts"), "utf8");
const runtimeSource = readFileSync(join(root, "src", "api", "runtime.tsx"), "utf8");
const isolatedEntrySource = readFileSync(join(root, "src", "isolated-entry.tsx"), "utf8");
const translationsSource = readFileSync(join(root, "src", "i18n", "translations.json"), "utf8");
const translations = JSON.parse(translationsSource);
const expectedCodes = ["en", "de", "zh-CN"];
const availableCodes = ["en", "de", "zh-CN"];
const localeDir = join(root, "src", "i18n", "locales");
const overrideDir = join(root, "src", "i18n", "runtime-overrides");
const mergedTranslations = Object.fromEntries(availableCodes.map((language) => {
  const localePath = join(localeDir, `${language}.json`);
  const overridePath = join(overrideDir, `${language}.json`);
  const locale = JSON.parse(readFileSync(localePath, "utf8"));
  const overrides = (() => { try { return JSON.parse(readFileSync(overridePath, "utf8")); } catch { return {}; } })();
  return [language, { ...locale, ...overrides }];
}));
const actualCodes = [...languageSource.matchAll(/\{ code: "([^"]+)"/g)].map((match) => match[1]);
const issues = [];
const blockingIssues = [];
const { values, valuesByFile } = collectI18nSourceCatalog(root);

if (JSON.stringify(actualCodes) !== JSON.stringify(expectedCodes)) {
  blockingIssues.push(`Language list mismatch: ${actualCodes.join(", ")}`);
}
if (!runtimeSource.includes("<GlobalLanguageSwitcher")) {
  blockingIssues.push("Global language switcher is not mounted in LuluRuntime");
}
if (!isolatedEntrySource.includes("<LuluRuntime slug={slug}>")) {
  blockingIssues.push("Isolated pages are not wrapped by LuluRuntime");
}
for (const language of expectedCodes) {
  if (!translationsSource.includes(`\"${language}\"`)) {
    blockingIssues.push(`Static translation bundle is missing ${language}`);
  }
}
values.delete("?raw");
for (const language of ["de", "zh-CN"]) {
  const missing = [...values].filter((source) => !mergedTranslations[language]?.[source]);
  if (missing.length) issues.push(`${language} is missing ${missing.length} UI strings (examples: ${missing.slice(0, 5).join(" | ")})`);
  const placeholderErrors = [...values].filter((source) => mergedTranslations[language]?.[source]
    && !hasMatchingPlaceholders(source, mergedTranslations[language][source]));
  if (placeholderErrors.length) issues.push(`${language} has ${placeholderErrors.length} placeholder mismatches (examples: ${placeholderErrors.slice(0, 5).join(" | ")})`);
  if (language === "zh-CN") {
    const untranslatedNaturalLanguage = [...values].filter((source) => requiresHanTranslation(source)
      && !/[\u3400-\u9fff]/.test(mergedTranslations[language]?.[source] ?? ""));
    if (untranslatedNaturalLanguage.length) {
      issues.push(`zh-CN has ${untranslatedNaturalLanguage.length} untranslated natural-language strings (examples: ${untranslatedNaturalLanguage.slice(0, 5).join(" | ")})`);
    }
  }
  if (process.env.I18N_REPORT_MISSING === "1" && (missing.length || placeholderErrors.length)) {
    console.error(JSON.stringify({ language, missing, placeholderErrors }, null, 2));
  }
}
const untranslatedEnglish = [...values].filter((source) => isLikelyGermanSource(source)
  && (!mergedTranslations.en?.[source] || mergedTranslations.en[source] === source));
if (untranslatedEnglish.length) {
  issues.push(`en is missing ${untranslatedEnglish.length} translations for non-English source strings (examples: ${untranslatedEnglish.slice(0, 5).join(" | ")})`);
  if (process.env.I18N_REPORT_MISSING === "1") {
    console.error(JSON.stringify({ untranslatedEnglish }, null, 2));
  }
}

const namespaceRoot = join(root, "src", "i18n", "namespaces");
const readNamespace = (kind, namespace, language) => {
  const file = namespace.startsWith("page:")
    ? join(namespaceRoot, kind, "pages", namespace.slice("page:".length), `${language}.json`)
    : join(namespaceRoot, kind, namespace, `${language}.json`);
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
};
const namespaceTable = (namespace, language) => ({
  ...readNamespace("locales", namespace, language),
  ...readNamespace("runtime-overrides", namespace, language),
});
for (const language of expectedCodes) {
  const core = namespaceTable("core", language);
  const workspace = namespaceTable("workspace-shell", language);
  const pages = new Map();
  const namespaceMissing = new Set();
  const namespacePlaceholderErrors = new Set();
  for (const [file, fileValues] of valuesByFile) {
    const slug = pageSlugFromSourcePath(file);
    const page = slug
      ? (pages.get(slug) ?? (() => {
        const table = namespaceTable(`page:${slug}`, language);
        pages.set(slug, table);
        return table;
      })())
      : {};
    for (const source of fileValues) {
      if (language === "en" && !isLikelyGermanSource(source)) continue;
      // The runtime always loads the complete active-language catalog before
      // route-specific tables. Scoped entries intentionally win, while the
      // global catalog guarantees shared labels and dynamic UI do not leak
      // their source language on another route.
      const translation = page[source] ?? workspace[source] ?? core[source] ?? mergedTranslations[language]?.[source];
      if (!translation) namespaceMissing.add(`${slug ?? "core"}: ${source}`);
      else if (!hasMatchingPlaceholders(source, translation)) namespacePlaceholderErrors.add(`${slug ?? "core"}: ${source}`);
    }
  }
  if (namespaceMissing.size) {
    const examples = [...namespaceMissing].slice(0, 5);
    issues.push(`${language} route namespaces are missing ${namespaceMissing.size} UI strings (examples: ${examples.join(" | ")})`);
  }
  if (namespacePlaceholderErrors.size) {
    const examples = [...namespacePlaceholderErrors].slice(0, 5);
    issues.push(`${language} route namespaces have ${namespacePlaceholderErrors.size} placeholder mismatches (examples: ${examples.join(" | ")})`);
  }
}
if (process.env.I18N_REPORT_IDENTITIES === "1") {
  const identities = Object.fromEntries(["de", "zh-CN"].map((language) => [
    language,
    [...values].filter((source) => isLikelyEnglishSentence(source) && mergedTranslations[language]?.[source] === source),
  ]));
  console.error(JSON.stringify({ untranslatedIdentities: identities }, null, 2));
}

console.log(JSON.stringify({
  languages: actualCodes.length,
  sourceStrings: values.size,
  excludedStatisticsPages: STATISTICS_PAGE_SLUGS.size,
  runtimeMounted: blockingIssues.length === 0,
  issues,
  blockingIssues,
}, null, 2));
if (blockingIssues.length || issues.length) process.exitCode = 1;
