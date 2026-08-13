import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const issues = [];
const runtimeSource = readFileSync(join(root, "src", "api", "runtime.tsx"), "utf8");
const clientSource = readFileSync(join(root, "src", "api", "client.ts"), "utf8");
const uploadSource = readFileSync(join(root, "src", "uploads", "GlobalUploadFeedback.tsx"), "utf8");
const signupSource = readFileSync(join(root, "src", "pages", "finely-year-1146", "components", "generated", "LuluSignupPage.tsx"), "utf8");

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

const rawErrorFiles = sourceFiles(join(root, "src")).filter((path) => {
  const source = readFileSync(path, "utf8");
  return /instanceof Error\s*\?\s*[^:;\n]*\.message/.test(source) && !path.endsWith(join("api", "client.ts"));
});

if (rawErrorFiles.length) issues.push(`${rawErrorFiles.length} files can still display raw technical error messages.`);
if (!clientSource.includes("function createMessageId()")) issues.push("The secure-context-compatible request id fallback is missing.");
if (!clientSource.includes("FRIENDLY_API_MESSAGES")) issues.push("The friendly API error map is missing.");
if (!runtimeSource.includes("<GlobalUploadFeedback />")) issues.push("Global upload feedback is not mounted on every page.");
if (!uploadSource.includes('kind: "loading"') || !uploadSource.includes('kind: "success"') || !uploadSource.includes('kind: "error"')) {
  issues.push("Upload feedback does not cover loading, success and error states.");
}
if (!signupSource.includes("useState(false)") || !signupSource.includes("{password && <>") || !signupSource.includes("{confirmPassword &&")) {
  issues.push("Registration progress is still visible before the user enters information.");
}

console.log(JSON.stringify({
  friendlyErrorMap: clientSource.includes("FRIENDLY_API_MESSAGES"),
  globalUploadFeedback: runtimeSource.includes("<GlobalUploadFeedback />"),
  rawTechnicalErrorFiles: rawErrorFiles.length,
  issues,
}, null, 2));
if (issues.length) process.exitCode = 1;
