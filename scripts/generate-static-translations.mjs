import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import ts from "typescript";

const root = process.cwd();
const backendEnv = process.env.LULU_BACKEND_ENV ?? join(root, "..", "Lulu-Growth-OS-Backend", ".env");
const catalogPath = join(root, "src", "i18n", "translations.json");
const envText = existsSync(backendEnv) ? readFileSync(backendEnv, "utf8") : "";
const apiKey = process.env.OPENAI_API_KEY ?? envText.match(/^\s*OPENAI_API_KEY\s*=\s*(.+)\s*$/m)?.[1]?.trim();
if (!apiKey) throw new Error("OPENAI_API_KEY is missing from the environment or backend .env file.");

const languageMetadata = {
  en: "English",
  de: "German",
  "zh-CN": "Simplified Chinese",
  fr: "French",
  nl: "Dutch",
  pl: "Polish",
  nb: "Norwegian Bokmål",
  sv: "Swedish",
  fi: "Finnish",
  da: "Danish",
  ar: "Arabic",
  lb: "Luxembourgish",
  mn: "Mongolian",
  uk: "Ukrainian",
  ru: "Russian",
};
const supported = process.env.I18N_LANGUAGE
  ? [process.env.I18N_LANGUAGE]
  : Object.keys(languageMetadata).filter((language) => language !== "en");
if (!supported.every((language) => language in languageMetadata)) {
  throw new Error(`I18N_LANGUAGE must be one of: ${Object.keys(languageMetadata).join(", ")}`);
}
const files = execFileSync("rg", ["--files", "src", "-g", "*.tsx", "-g", "*.ts"], { encoding: "utf8" }).trim().split(/\r?\n/);
const values = new Set();
const looksLikeUiText = (value) => {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length >= 1 && text.length <= 400 && /[A-Za-z]/.test(text)
    && !/^(?:https?:\/\/\S+|[./#][\w./:-]+)$/i.test(text) && !text.includes("var(--")
    && !/(?:^|\s)(?:bg-|text-|border-|px-|py-|mt-|mb-|grid|flex|rounded|hover:|focus:|w-|h-|min-|max-)/.test(text);
};

for (const file of files) {
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
      const isAttribute = ts.isJsxAttribute(parent) && ["aria-label", "placeholder", "title"].includes(parent.name.getText(tree));
      let ancestor = parent;
      while (ancestor && (ts.isConditionalExpression(ancestor) || ts.isBinaryExpression(ancestor) || ts.isParenthesizedExpression(ancestor))) ancestor = ancestor.parent;
      const jsxAttribute = ancestor && ts.isJsxExpression(ancestor) && ts.isJsxAttribute(ancestor.parent) ? ancestor.parent : undefined;
      const isVisibleExpression = Boolean(ancestor && ts.isJsxExpression(ancestor) && (!jsxAttribute || ["aria-label", "placeholder", "title"].includes(jsxAttribute.name.getText(tree))));
      const isStructuredContent = ts.isArrayLiteralExpression(parent) || ts.isPropertyAssignment(parent);
      const isContentValue = isVisibleExpression || (isStructuredContent && !/^[\w./:-]+$/.test(text));
      if ((isAttribute || isContentValue) && looksLikeUiText(text)) values.add(text);
    }
    if (ts.isTemplateExpression(node)) {
      const parent = node.parent;
      const jsxExpression = ts.isJsxExpression(parent) ? parent : undefined;
      const attribute = jsxExpression && ts.isJsxAttribute(jsxExpression.parent) ? jsxExpression.parent : undefined;
      const attributeName = attribute?.name.getText(tree);
      const isVisible = Boolean(jsxExpression && (!attribute || ["aria-label", "placeholder", "title"].includes(attributeName ?? "")));
      if (isVisible) {
        const text = `${node.head.text}${node.templateSpans.map((span, index) => `{{${index}}}${span.literal.text}`).join("")}`.replace(/\s+/g, " ").trim();
        if (looksLikeUiText(text)) values.add(text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
}

const allStrings = [...values].sort();
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const batches = (items) => {
  const result = []; let current = []; let size = 0;
  for (const item of items) {
    if (current.length >= 20 || size + item.length > 4_000) { result.push(current); current = []; size = 0; }
    current.push(item); size += item.length;
  }
  if (current.length) result.push(current);
  return result;
};

async function translate(language, batch) {
  let response;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const endpoint = `${(process.env.OPENAI_API_BASE ?? "https://api.openai.com/v1").replace(/\/$/, "")}/responses`;
      response = await fetch(endpoint, {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      store: false,
      reasoning: { effort: "minimal" },
      max_output_tokens: 12_000,
      instructions: `You translate English UI text for Lulu Growth OS into ${languageMetadata[language]}. Preserve product names (Lulu AI, Lulu Intelligence), variables, URLs, emails, numbers, punctuation, shortcut keys, and markup-like tokens. Use concise, natural business-software terminology. Return one translation per input id and no commentary.`,
      input: JSON.stringify(batch.map((text, id) => ({ id: String(id), text }))),
      text: { format: { type: "json_schema", name: "ui_translations", strict: true, schema: { type: "object", properties: { translations: { type: "array", items: { type: "object", properties: { id: { type: "string" }, text: { type: "string" } }, required: ["id", "text"], additionalProperties: false } } }, required: ["translations"], additionalProperties: false } } },
    }),
      });
      if (response.ok || response.status < 500) break;
    } catch (error) {
      if (attempt === 5) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
  }
  if (!response) throw new Error("OpenAI request failed without a response.");
  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status} ${await response.text()}`);
  const payload = await response.json();
  const outputText = payload.output_text ?? payload.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text;
  if (typeof outputText !== "string" || !outputText.trim()) throw new Error("Translation response was empty.");
  const result = JSON.parse(outputText);
  if (!Array.isArray(result.translations) || result.translations.length !== batch.length) throw new Error(`Translation response did not match the input batch (${result.translations?.length ?? 0}/${batch.length}).`);
  return result.translations.map((entry, index) => {
    if (entry.id !== String(index) || typeof entry.text !== "string" || !entry.text.trim()) throw new Error("Translation response contained an invalid item.");
    return entry.text.trim();
  });
}

for (const language of supported) {
  catalog[language] ??= {};
  const missing = allStrings.filter((text) => !catalog[language][text]);
  const groups = batches(missing);
  console.log(`${language}: ${missing.length} missing strings in ${groups.length} batches`);
  for (let index = 0; index < groups.length; index += 1) {
    const group = groups[index];
    const translated = await translate(language, group);
    group.forEach((source, itemIndex) => { catalog[language][source] = translated[itemIndex]; });
    writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
    console.log(`${language}: ${index + 1}/${groups.length}`);
  }
}

console.log(`Completed static translation catalog with ${allStrings.length} source strings.`);
