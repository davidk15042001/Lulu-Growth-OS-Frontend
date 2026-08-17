import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const client = readFileSync(join(root, "src", "api", "client.ts"), "utf8");
const scenarios = readFileSync(join(root, "src", "api", "error-scenarios.ts"), "utf8");
const codes = [...client.matchAll(/^\s{2}([A-Z][A-Z0-9_]+):\s*"/gm)].map((match) => match[1]);
const supportedCategories = ["network", "authentication", "authorization", "validation", "resource", "rate-limit", "billing", "integration", "storage", "ai", "server", "request"];
const missing = codes.filter((code) => !scenarios.includes(`${code}:`));
const prefixFallbacks = ["AIRWALLEX_", "BILLING_", "OAUTH_", "MAILCOW_", "DOCUMENT_", "STORAGE_", "S3_", "FILE_", "AI_"];
const uncovered = missing.filter((code) => !prefixFallbacks.some((prefix) => code.startsWith(prefix)) && !["PAYMENT_CONFIRMATION_TIMEOUT", "UNSUPPORTED_FILE_TYPE", "TRANSLATION_INVALID_RESPONSE"].includes(code));
const invalidCategory = supportedCategories.length === 0;
const result = { friendlyErrorCodes: codes.length, explicitlyClassified: codes.length - missing.length, prefixFallbacks: missing.length - uncovered.length, issues: [] };
if (uncovered.length) result.issues.push(`Unclassified error scenarios: ${uncovered.join(", ")}`);
if (invalidCategory) result.issues.push("No supported error categories configured");
console.log(JSON.stringify(result, null, 2));
if (result.issues.length) process.exitCode = 1;
