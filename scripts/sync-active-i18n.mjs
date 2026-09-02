import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  collectI18nSourceCatalog,
  hasMatchingPlaceholders,
  isLikelyEnglishSentence,
  isLikelyGermanSource,
  requiresHanTranslation,
} from "./i18n-source-catalog.mjs";
import { pageSlugFromSourcePath, STATISTICS_PAGE_SLUGS } from "./i18n-scope.mjs";

const root = process.cwd();
const languages = ["en", "de", "zh-CN"];
const localeDir = join(root, "src", "i18n", "locales");
const rootOverrideDir = join(root, "src", "i18n", "runtime-overrides");
const namespaceRoot = join(root, "src", "i18n", "namespaces", "runtime-overrides");
const splitMarker = "__LULU_SPLIT_9F3D__";

function readJson(file, fallback = {}) {
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : fallback;
}

function writeJson(file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

const rootLocales = Object.fromEntries(languages.map((language) => [
  language,
  readJson(join(localeDir, `${language}.json`)),
]));
const rootOverrides = Object.fromEntries(languages.map((language) => [
  language,
  readJson(join(rootOverrideDir, `${language}.json`)),
]));

function mergedRoot(language) {
  return { ...rootLocales[language], ...rootOverrides[language] };
}

function requiredForLanguage(language, source) {
  return language !== "en" || isLikelyGermanSource(source);
}

function needsTranslation(language, source, translation) {
  if (!requiredForLanguage(language, source)) return false;
  if (!translation || !hasMatchingPlaceholders(source, translation)) return true;
  if (language === "zh-CN" && requiresHanTranslation(source) && !/[\u3400-\u9fff]/.test(translation)) return true;
  return process.env.I18N_RETRANSLATE_IDENTITIES === "1"
    && language !== "en"
    && isLikelyEnglishSentence(source)
    && translation === source;
}

function protectPlaceholders(source) {
  const placeholders = [];
  const protectedText = source.replace(/\{\{\d+\}\}/g, (placeholder) => {
    const index = placeholders.push(placeholder) - 1;
    return `__LULU_VAR_${index}__`;
  });
  return {
    protectedText,
    restore(value) {
      return placeholders.reduce(
        (result, placeholder, index) => result.replace(new RegExp(`__\\s*LULU\\s*_\\s*VAR\\s*_\\s*${index}\\s*__`, "gi"), placeholder),
        value,
      );
    },
  };
}

function makeBatches(items) {
  const batches = [];
  let current = [];
  let size = 0;
  for (const item of items) {
    if (current.length >= 12 || size + item.source.length > 2_400) {
      batches.push(current);
      current = [];
      size = 0;
    }
    current.push(item);
    size += item.source.length;
  }
  if (current.length) batches.push(current);
  return batches;
}

async function googleTranslate(sourceLanguage, targetLanguage, batch) {
  const protectedItems = batch.map((item) => ({ ...item, ...protectPlaceholders(item.source) }));
  const query = protectedItems.map((item) => item.protectedText).join(`\n${splitMarker}\n`);
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", sourceLanguage);
  url.searchParams.set("tl", targetLanguage);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", query);

  let lastError;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!response.ok) throw new Error(`translation endpoint returned ${response.status}`);
      const payload = await response.json();
      const output = payload?.[0]?.map((part) => part?.[0] ?? "").join("") ?? "";
      const translated = output.split(new RegExp(`\\s*${splitMarker}\\s*`, "g"));
      if (translated.length !== batch.length) throw new Error(`translation batch shape mismatch (${translated.length}/${batch.length})`);
      return translated.map((value, index) => {
        const restored = protectedItems[index].restore(value.trim());
        if (!restored || !hasMatchingPlaceholders(batch[index].source, restored)) {
          throw new Error(`invalid placeholders for: ${batch[index].source}`);
        }
        return restored;
      });
    } catch (error) {
      lastError = error;
      if (attempt < 6) await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
    }
  }
  throw lastError;
}

async function translateItems(language, items, persist) {
  const sourceGroups = [
    { sourceLanguage: "en", items: items.filter((item) => !isLikelyGermanSource(item.source)) },
    { sourceLanguage: "de", items: items.filter((item) => isLikelyGermanSource(item.source)) },
  ].filter((group) => group.items.length);
  let completed = 0;
  const totalBatches = sourceGroups.reduce((sum, group) => sum + makeBatches(group.items).length, 0);

  for (const group of sourceGroups) {
    const batches = makeBatches(group.items);
    let nextBatch = 0;
    const workerCount = Math.min(3, batches.length);
    await Promise.all(Array.from({ length: workerCount }, async () => {
      while (nextBatch < batches.length) {
        const batchIndex = nextBatch;
        nextBatch += 1;
        const batch = batches[batchIndex];
        const translations = await googleTranslate(group.sourceLanguage, language, batch);
        batch.forEach((item, index) => { rootOverrides[language][item.source] = translations[index]; });
        completed += 1;
        persist();
        if (completed % 10 === 0 || completed === totalBatches) console.log(`${language}: ${completed}/${totalBatches} translation batches`);
      }
    }));
  }
}

const { values, valuesByFile } = collectI18nSourceCatalog(root);
console.log(`Active translation scope: ${values.size} UI strings; ${STATISTICS_PAGE_SLUGS.size} Statistics pages excluded.`);

for (const language of languages) {
  const current = mergedRoot(language);
  const pending = [...values]
    .filter((source) => needsTranslation(language, source, current[source]))
    .map((source) => ({ source }));

  if (language === "de") {
    for (const item of pending.filter((entry) => isLikelyGermanSource(entry.source))) rootOverrides.de[item.source] = item.source;
  }
  const remotePending = language === "de"
    ? pending.filter((entry) => !isLikelyGermanSource(entry.source))
    : pending;
  const persist = () => writeJson(join(rootOverrideDir, `${language}.json`), rootOverrides[language]);
  console.log(`${language}: ${pending.length} entries require correction; ${remotePending.length} require translation.`);
  if (remotePending.length) await translateItems(language, remotePending, persist);
  persist();
}

const finalRoots = Object.fromEntries(languages.map((language) => [language, mergedRoot(language)]));
for (const language of languages) {
  const missing = [...values].filter((source) => requiredForLanguage(language, source)
    && (!finalRoots[language][source] || !hasMatchingPlaceholders(source, finalRoots[language][source])));
  if (missing.length) throw new Error(`${language} still has ${missing.length} missing or invalid translations.`);
}

const pageValues = new Map();
const sharedValues = new Set();
for (const [file, fileValues] of valuesByFile) {
  const slug = pageSlugFromSourcePath(file);
  if (!slug) {
    for (const source of fileValues) sharedValues.add(source);
    continue;
  }
  const page = pageValues.get(slug) ?? new Set();
  for (const source of fileValues) page.add(source);
  pageValues.set(slug, page);
}

function namespaceTranslations(language, sources) {
  const output = {};
  for (const source of [...sources].sort((left, right) => left.localeCompare(right))) {
    const translation = finalRoots[language][source];
    if (translation && (language !== "en" || translation !== source)) output[source] = translation;
  }
  return output;
}

for (const language of languages) {
  const coreFile = join(namespaceRoot, "core", `${language}.json`);
  const core = readJson(coreFile);
  Object.assign(core, namespaceTranslations(language, sharedValues));
  writeJson(coreFile, core);

  const workspaceFile = join(namespaceRoot, "workspace-shell", `${language}.json`);
  const workspace = readJson(workspaceFile);
  for (const source of Object.keys(workspace)) {
    if (finalRoots[language][source] && (language !== "en" || finalRoots[language][source] !== source)) {
      workspace[source] = finalRoots[language][source];
    }
  }
  writeJson(workspaceFile, workspace);

  for (const [slug, sources] of pageValues) {
    const pageFile = join(namespaceRoot, "pages", slug, `${language}.json`);
    const page = readJson(pageFile);
    Object.assign(page, namespaceTranslations(language, sources));
    writeJson(pageFile, page);
  }
}

console.log(`Synchronized root catalogs and ${pageValues.size} active page namespaces.`);
