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
const values = new Set();
const userFacingCallPattern = /^(?:set(?:[A-Z]\w*)?(?:Answer|Error|Failure|Feedback|Message|Notice|Success|Toast|Warning)|showToast|toast|alert|confirm|getFriendlyErrorMessage)$/;
const enclosingUserFacingCall = (node) => {
  let current = node.parent;
  for (let depth = 0; current && depth < 6; depth += 1, current = current.parent) {
    if (!ts.isCallExpression(current)) continue;
    const callee = current.expression.getText();
    if (userFacingCallPattern.test(callee.split(".").at(-1) ?? "")) return current;
  }
};
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
      const isUserFacingCall = Boolean(enclosingUserFacingCall(node));
      if ((isAttribute || isContentValue || isUserFacingCall) && looksLikeUiText(text)) values.add(text);
    }
    if (ts.isTemplateExpression(node)) {
      const jsxExpression = ts.isJsxExpression(node.parent) ? node.parent : undefined;
      const attribute = jsxExpression && ts.isJsxAttribute(jsxExpression.parent) ? jsxExpression.parent : undefined;
      const attributeName = attribute?.name.getText(tree);
      if ((jsxExpression && (!attribute || ["aria-label", "placeholder", "title"].includes(attributeName ?? ""))) || enclosingUserFacingCall(node)) {
        const text = `${node.head.text}${node.templateSpans.map((span, index) => `{{${index}}}${span.literal.text}`).join("")}`.replace(/\s+/g, " ").trim();
        if (looksLikeUiText(text)) values.add(text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
}

if (JSON.stringify(actualCodes) !== JSON.stringify(expectedCodes)) {
  blockingIssues.push(`Language list mismatch: ${actualCodes.join(", ")}`);
}
if (!runtimeSource.includes("<GlobalLanguageSwitcher />")) {
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
  const placeholderErrors = [...values].filter((source) => {
    const expected = [...source.matchAll(/\{\{\d+\}\}/g)].map((match) => match[0]).sort();
    const actual = [...String(mergedTranslations[language]?.[source] ?? "").matchAll(/\{\{\d+\}\}/g)].map((match) => match[0]).sort();
    return JSON.stringify(expected) !== JSON.stringify(actual);
  });
  if (placeholderErrors.length) issues.push(`${language} has ${placeholderErrors.length} placeholder mismatches (examples: ${placeholderErrors.slice(0, 5).join(" | ")})`);
  if (process.env.I18N_REPORT_MISSING === "1" && (missing.length || placeholderErrors.length)) {
    console.error(JSON.stringify({ language, missing, placeholderErrors }, null, 2));
  }
}
const germanSourcePattern = /[äöüÄÖÜß]|\b(?:abbrechen|abgebrochen|abmelden|aktualisieren|alle|anmeldung|analysieren|ansehen|anzeigen|assets organisieren|ausstehend|auswählen|bearbeiten|beim|benutzer|bereich|beschreibe|bestätigt|beiträge|bilder|bitte|dabei|damit|dateien?|dein(?:e|en|er|es)?|der|des|die|dies(?:e|en|er|es)?|direkt|domains verwalten|durch|einträge|entwürfe|erneut|erstellen|erstellt|fehlgeschlagen|firmenbeschreibung|für|generiert|generierung|gespeicherte|gewählt|hochladen|inhalte|kann|keine|konnte|kunden|laden|löschen|medien|medienbibliothek|medienobjekt|monatliche|nach|nicht|noch|nur|öffnen|prüfe|seite|seiten|schließen|sicherheit|speichern|struktur|titel|über|unternehmen|verbinden|verbundener|verbindung|verbindungsmodus|verfügbar|verifiziert|veröffentlichung|veröffentlicht|verwalte|verwaltung aktiviert|vorschau|wenn|werden|wird|wähle|zeige|zurück)\b/i;
const untranslatedEnglish = [...values].filter((source) => germanSourcePattern.test(source)
  && (!mergedTranslations.en?.[source] || mergedTranslations.en[source] === source));
if (untranslatedEnglish.length) {
  issues.push(`en is missing ${untranslatedEnglish.length} translations for non-English source strings (examples: ${untranslatedEnglish.slice(0, 5).join(" | ")})`);
  if (process.env.I18N_REPORT_MISSING === "1") {
    console.error(JSON.stringify({ untranslatedEnglish }, null, 2));
  }
}
if (process.env.I18N_REPORT_IDENTITIES === "1") {
  const likelyEnglishText = (source) => !germanSourcePattern.test(source)
    && (source.match(/[A-Za-z][A-Za-z'-]{2,}/g)?.length ?? 0) >= 2
    && !/^(?:Lulu AI|WordPress|Jetpack|Webflow|Shopify|WooCommerce|Google|Meta|LinkedIn|Stripe|PayPal)(?:\s*[·/|&—-]\s*[\w .&/-]+)?$/i.test(source);
  const identities = Object.fromEntries(["de", "zh-CN"].map((language) => [
    language,
    [...values].filter((source) => likelyEnglishText(source) && mergedTranslations[language]?.[source] === source),
  ]));
  console.error(JSON.stringify({ untranslatedIdentities: identities }, null, 2));
}
if (!languageSource.includes('{ code: "ar"') || !languageSource.includes('direction: "rtl"')) {
  blockingIssues.push("Arabic RTL language configuration is missing");
}

console.log(JSON.stringify({
  languages: actualCodes.length,
  sourceStrings: values.size,
  runtimeMounted: blockingIssues.length === 0,
  issues,
  blockingIssues,
}, null, 2));
if (blockingIssues.length) process.exitCode = 1;
