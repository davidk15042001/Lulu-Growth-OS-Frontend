import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { isTranslationSourceFile } from "./i18n-scope.mjs";

export const germanSourcePattern = /[äöüÄÖÜß]|\b(?:abbrechen|abgebrochen|abmelden|aktualisieren|alle|anmeldung|analysiere|analysieren|anfrage|ansehen|anzeigen|antwort|assets organisieren|aufgabe|ausspielung|ausstehend|auswählen|automatisch|automatische|automatischer|bearbeiten|beim|benutzer|bereich|beschreibe|bestand|bestätigt|beiträge|bewertung|bilder|bitte|dabei|damit|daten|dateien?|dein(?:e|en|er|es)?|der|des|die|dies(?:e|en|er|es)?|direkt|domains verwalten|durch|einträge|entwürfe|erneut|ergebnis|ergebnisse|erstellen|erstellt|fehlgeschlagen|firmenbeschreibung|frage|freigabe|freigaben|fuer|für|gegen|generiert|generierung|gespeichert|gespeicherte|gewählt|halten|handelt|hauptquelle|hebel|hochladen|inhalte|jetzt|kann|keine|konnte|kunden|laden|lage|lauf|letzte|letzten|löschen|markt|medien|medienbibliothek|medienobjekt|meldet|metadaten|minuten|monatliche|nach|negativquote|neuer|nicht|noch|notiz|nur|offene|öffnen|persistierte|priorisiert|proaktiv|profil|prüfe|seite|seiten|schließen|schneller|sehr|sicherheit|signale|speichern|standort|struktur|strukturen|tabellen|titel|über|unternehmen|verbinden|verbunden|verbundener|verbindung|verbindungsmodus|verfügbar|verifiziert|verlasse|veröffentlichung|veröffentlicht|verwalte|verwaltung aktiviert|vorsprung|vorschau|wartet|warum|website generieren|wenn|werden|wettbewerber|wichtig|wird|wähle|zeige|ziele?|zuweisen|zurück)\b/i;

const userFacingCallPattern = /^(?:set(?:[A-Z]\w*)?(?:Answer|Error|Failure|Feedback|Message|Notice|Success|Toast|Warning)|showToast|toast|alert|confirm|getFriendlyErrorMessage)$/;
const jsxEntities = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: "\u00a0",
  quot: '"',
};

function decodeJsxText(value) {
  return value.replace(/&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/gi, (entity, decimal, hexadecimal, named) => {
    if (decimal) return String.fromCodePoint(Number(decimal));
    if (hexadecimal) return String.fromCodePoint(Number.parseInt(hexadecimal, 16));
    return jsxEntities[named.toLowerCase()] ?? entity;
  });
}

function enclosingUserFacingCall(node) {
  let current = node.parent;
  for (let depth = 0; current && depth < 6; depth += 1, current = current.parent) {
    if (!ts.isCallExpression(current)) continue;
    const callee = current.expression.getText();
    if (userFacingCallPattern.test(callee.split(".").at(-1) ?? "")) return current;
  }
}

export function looksLikeUiText(value) {
  const text = value.replace(/\s+/g, " ").trim();
  const technicalStyleLiteral = /(?:\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw)|rgba?\([^)]*\)|#[0-9a-f]{3,8})/i;
  return text.length >= 1 && text.length <= 400 && /[A-Za-z]/.test(text)
    && !technicalStyleLiteral.test(text)
    && !/^(?:https?:\/\/\S+|[./#][\w./:-]+)$/i.test(text) && !text.includes("var(--")
    && !/(?:^|\s)(?:bg-|text-|border-|px-|py-|mt-|mb-|grid|flex|rounded|hover:|focus:|w-|h-|min-|max-)/.test(text);
}

export function collectI18nSourceCatalog(root = process.cwd()) {
  const sourceFiles = [];
  const values = new Set();
  const valuesByFile = new Map();

  function collectSourceFiles(directory, relativeDirectory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const relativePath = join(relativeDirectory, entry.name);
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) collectSourceFiles(absolutePath, relativePath);
      else if (/\.(tsx?|ts)$/.test(entry.name) && isTranslationSourceFile(relativePath)) sourceFiles.push(relativePath);
    }
  }

  collectSourceFiles(join(root, "src"), "src");
  for (const file of sourceFiles) {
    const normalizedFile = file.split("\\").join("/");
    const isAgentRegistry = normalizedFile === "src/config/lulu-agent-registry.ts";
    const fileValues = new Set();
    const add = (value) => {
      const text = value.replace(/\s+/g, " ").trim();
      if (!looksLikeUiText(text)) return;
      values.add(text);
      fileValues.add(text);
    };
    const source = readFileSync(join(root, file), "utf8");
    const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const visit = (node) => {
      if (ts.isJsxText(node)) add(decodeJsxText(node.getText(tree)));
      if (ts.isStringLiteral(node)) {
        const text = node.text.replace(/\s+/g, " ").trim();
        const parent = node.parent;
        let ancestor = parent;
        while (ancestor && (ts.isConditionalExpression(ancestor) || ts.isBinaryExpression(ancestor) || ts.isParenthesizedExpression(ancestor))) ancestor = ancestor.parent;
        const jsxAttribute = ancestor && ts.isJsxExpression(ancestor) && ts.isJsxAttribute(ancestor.parent) ? ancestor.parent : undefined;
        const isVisibleExpression = Boolean(ancestor && ts.isJsxExpression(ancestor) && (!jsxAttribute || ["aria-label", "placeholder", "title"].includes(jsxAttribute.name.getText(tree))));
        const isStructuredContent = ts.isArrayLiteralExpression(parent) || ts.isPropertyAssignment(parent);
        const isStructuredUiValue = isStructuredContent
          && (!/^[\w./:-]+$/.test(text) || /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}$/.test(text));
        const isContentValue = isVisibleExpression || isStructuredUiValue;
        const isAttribute = ts.isJsxAttribute(parent) && ["aria-label", "placeholder", "title"].includes(parent.name.getText(tree));
        const isTranslationCall = ts.isCallExpression(parent)
          && (parent.expression.getText(tree).split(".").at(-1) ?? "") === "t";
        const registryCall = isAgentRegistry && ts.isCallExpression(parent)
          ? parent.expression.getText(tree).split(".").at(-1) ?? ""
          : "";
        const isRegistryContractValue = isAgentRegistry
          && ((["detail", "approval"].includes(registryCall) && !/^A[1-4]$/.test(text))
            || (ts.isVariableDeclaration(parent) && /_(?:LABEL|SUFFIX)$/.test(parent.name.getText(tree))));
        if (isAttribute || isContentValue || isTranslationCall || isRegistryContractValue || enclosingUserFacingCall(node)) add(text);
      }
      if (ts.isTemplateExpression(node)) {
        const jsxExpression = ts.isJsxExpression(node.parent) ? node.parent : undefined;
        const attribute = jsxExpression && ts.isJsxAttribute(jsxExpression.parent) ? jsxExpression.parent : undefined;
        const attributeName = attribute?.name.getText(tree);
        if ((jsxExpression && (!attribute || ["aria-label", "placeholder", "title"].includes(attributeName ?? ""))) || enclosingUserFacingCall(node)) {
          add(`${node.head.text}${node.templateSpans.map((span, index) => `{{${index}}}${span.literal.text}`).join("")}`.replace(/\s+/g, " ").trim());
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(tree);
    if (fileValues.size) valuesByFile.set(file, fileValues);
  }

  values.delete("?raw");
  return { sourceFiles, values, valuesByFile };
}

export function hasMatchingPlaceholders(source, translation) {
  const placeholders = (value) => [...String(value).matchAll(/\{\{\d+\}\}/g)].map((match) => match[0]).sort();
  return JSON.stringify(placeholders(source)) === JSON.stringify(placeholders(translation));
}

export function isLikelyGermanSource(source) {
  return germanSourcePattern.test(source);
}

export function isLikelyEnglishSentence(source) {
  if (isLikelyGermanSource(source)) return false;
  if ((source.match(/[A-Za-z][A-Za-z'-]{2,}/g)?.length ?? 0) < 2) return false;
  return !/^(?:Lulu(?: AI| Growth OS| Intelligence)?|WordPress|Jetpack|Webflow|Shopify|WooCommerce|Google(?: Analytics| Ads| Calendar| Business Profile)?|Meta(?: Ads)?|LinkedIn|Stripe|PayPal|Microsoft(?: Outlook)?|HubSpot|Salesforce|Slack|TikTok|Instagram|Facebook|YouTube|OpenAI|Anthropic)(?:\s*[·/|&—-]\s*[\w .&/-]+)?$/i.test(source);
}

export function requiresHanTranslation(source) {
  const plain = source.replace(/&[a-z]+;/gi, " ");
  if (/^(?:(?:Shopify|Google(?: Analytics| Ads)?|Meta Ads|CRM)[\s,·/+&]*)+\.?$/i.test(plain)) return false;
  if (isLikelyGermanSource(plain)) return true;
  const words = plain.match(/[A-Za-z][A-Za-z'-]{2,}/g)?.length ?? 0;
  return words >= 4 && isLikelyEnglishSentence(plain);
}
