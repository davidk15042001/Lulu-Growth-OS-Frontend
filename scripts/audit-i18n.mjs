import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const languageSource = readFileSync(join(root, "src", "i18n", "languages.ts"), "utf8");
const runtimeSource = readFileSync(join(root, "src", "api", "runtime.tsx"), "utf8");
const isolatedEntrySource = readFileSync(join(root, "src", "isolated-entry.tsx"), "utf8");
const translationsSource = readFileSync(join(root, "src", "i18n", "translations.json"), "utf8");
const expectedCodes = ["en", "de", "zh-CN", "fr", "nl", "pl", "nb", "sv", "fi", "da", "ar", "lb", "mn", "uk", "ru"];
const actualCodes = [...languageSource.matchAll(/\{ code: "([^"]+)"/g)].map((match) => match[1]);
const issues = [];

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
if (!languageSource.includes('{ code: "ar"') || !languageSource.includes('direction: "rtl"')) {
  issues.push("Arabic RTL language configuration is missing");
}

console.log(JSON.stringify({ languages: actualCodes.length, runtimeMounted: issues.length === 0, issues }, null, 2));
if (issues.length) process.exitCode = 1;
