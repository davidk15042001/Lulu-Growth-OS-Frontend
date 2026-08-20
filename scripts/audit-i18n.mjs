import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import ts from "typescript";

const root = process.cwd();
const languageSource = readFileSync(join(root, "src", "i18n", "languages.ts"), "utf8");
const runtimeSource = readFileSync(join(root, "src", "api", "runtime.tsx"), "utf8");
const isolatedEntrySource = readFileSync(join(root, "src", "isolated-entry.tsx"), "utf8");
const translationsSource = readFileSync(join(root, "src", "i18n", "translations.json"), "utf8");
const translations = JSON.parse(translationsSource);
const expectedCodes = ["en", "de", "zh-CN", "fr", "nl", "pl", "nb", "sv", "fi", "da", "ar", "lb", "mn", "uk", "ru"];
const overrideDir = join(root, "src", "i18n", "runtime-overrides");
const mergedTranslations = Object.fromEntries(expectedCodes.map((language) => {
  const overridePath = join(overrideDir, `${language}.json`);
  const overrides = (() => { try { return JSON.parse(readFileSync(overridePath, "utf8")); } catch { return {}; } })();
  return [language, { ...(translations[language] ?? {}), ...overrides }];
}));
const actualCodes = [...languageSource.matchAll(/\{ code: "([^"]+)"/g)].map((match) => match[1]);
const issues = [];
const values = new Set();
const looksLikeUiText = (value) => {
  const text = value.replace(/\s+/g, " ").trim();
  const technicalStyleLiteral = /(?:\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw)|rgba?\([^)]*\)|#[0-9a-f]{3,8})/i;
  return text.length >= 1 && text.length <= 400 && /[A-Za-z]/.test(text)
    && !technicalStyleLiteral.test(text)
    && !/^(?:https?:\/\/\S+|[./#][\w./:-]+)$/i.test(text) && !text.includes("var(--")
    && !/(?:^|\s)(?:bg-|text-|border-|px-|py-|mt-|mb-|grid|flex|rounded|hover:|focus:|w-|h-|min-|max-)/.test(text);
};
const sourceFiles = [];
function collectSourceFiles(directory, relativeDirectory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relativePath = join(relativeDirectory, entry.name);
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) collectSourceFiles(absolutePath, relativePath);
    else if (/\.(tsx?|ts)$/.test(entry.name)) sourceFiles.push(relativePath);
  }
}
collectSourceFiles(join(root, "src"), "src");
for (const file of sourceFiles) {
  const source = readFileSync(join(root, file), "utf8");
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (node) => {
    if (ts.isJsxText(node)) {
      const text = node.getText(tree).replace(/\s+/g, " ").trim();
      if (looksLikeUiText(text)) values.add(text);
    }
    if (ts.isStringLiteral(node)) {
      const text = node.text.replace(/\s+/g, " ").trim();
      const parent = node.parent;
      let ancestor = parent;
      while (ancestor && (ts.isConditionalExpression(ancestor) || ts.isBinaryExpression(ancestor) || ts.isParenthesizedExpression(ancestor))) ancestor = ancestor.parent;
      const jsxAttribute = ancestor && ts.isJsxExpression(ancestor) && ts.isJsxAttribute(ancestor.parent) ? ancestor.parent : undefined;
      const isVisibleExpression = Boolean(ancestor && ts.isJsxExpression(ancestor) && (!jsxAttribute || ["aria-label", "placeholder", "title"].includes(jsxAttribute.name.getText(tree))));
      const isStructuredContent = ts.isArrayLiteralExpression(parent) || ts.isPropertyAssignment(parent);
      const isContentValue = isVisibleExpression || (isStructuredContent && !/^[\w./:-]+$/.test(text));
      const isAttribute = ts.isJsxAttribute(parent) && ["aria-label", "placeholder", "title"].includes(parent.name.getText(tree));
      if ((isAttribute || isContentValue) && looksLikeUiText(text)) values.add(text);
    }
    if (ts.isTemplateExpression(node)) {
      const jsxExpression = ts.isJsxExpression(node.parent) ? node.parent : undefined;
      const attribute = jsxExpression && ts.isJsxAttribute(jsxExpression.parent) ? jsxExpression.parent : undefined;
      const attributeName = attribute?.name.getText(tree);
      if (jsxExpression && (!attribute || ["aria-label", "placeholder", "title"].includes(attributeName ?? ""))) {
        const text = `${node.head.text}${node.templateSpans.map((span, index) => `{{${index}}}${span.literal.text}`).join("")}`.replace(/\s+/g, " ").trim();
        if (looksLikeUiText(text)) values.add(text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
}

if (JSON.stringify(actualCodes) !== JSON.stringify(expectedCodes)) {
  issues.push(`Language list mismatch: ${actualCodes.join(", ")}`);
}
if (!runtimeSource.includes("<GlobalLanguageSwitcher />")) {
  issues.push("Global language switcher is not mounted in LuluRuntime");
}
if (!isolatedEntrySource.includes("<LuluRuntime slug={slug}>")) {
  issues.push("Isolated pages are not wrapped by LuluRuntime");
}
for (const language of expectedCodes) {
  if (!translationsSource.includes(`\"${language}\"`)) {
    issues.push(`Static translation bundle is missing ${language}`);
  }
}
for (const language of ["de", "zh-CN"]) {
  values.delete("?raw");
  const missing = [...values].filter((source) => !mergedTranslations[language]?.[source]);
  if (missing.length) issues.push(`${language} is missing ${missing.length} UI strings (examples: ${missing.slice(0, 5).join(" | ")})`);
  const placeholderErrors = [...values].filter((source) => {
    const expected = [...source.matchAll(/\{\{\d+\}\}/g)].map((match) => match[0]).sort();
    const actual = [...String(mergedTranslations[language]?.[source] ?? "").matchAll(/\{\{\d+\}\}/g)].map((match) => match[0]).sort();
    return JSON.stringify(expected) !== JSON.stringify(actual);
  });
  if (placeholderErrors.length) issues.push(`${language} has ${placeholderErrors.length} placeholder mismatches (examples: ${placeholderErrors.slice(0, 5).join(" | ")})`);
}
if (!languageSource.includes('{ code: "ar"') || !languageSource.includes('direction: "rtl"')) {
  issues.push("Arabic RTL language configuration is missing");
}

console.log(JSON.stringify({ languages: actualCodes.length, sourceStrings: values.size, runtimeMounted: issues.length === 0, issues }, null, 2));
if (issues.length) process.exitCode = 1;
