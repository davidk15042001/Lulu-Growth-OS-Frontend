import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const issues = [];
const runtimeSource = readFileSync(join(root, "src", "api", "runtime.tsx"), "utf8");
const clientSource = readFileSync(join(root, "src", "api", "client.ts"), "utf8");
const uploadSource = readFileSync(join(root, "src", "uploads", "GlobalUploadFeedback.tsx"), "utf8");
const signupSource = readFileSync(join(root, "src", "pages", "finely-year-1146", "components", "generated", "LuluSignupPage.tsx"), "utf8");
const loginSource = readFileSync(join(root, "src", "pages", "brightly-door-5741", "components", "generated", "LuluLoginPage.tsx"), "utf8");
const resetPasswordSource = readFileSync(join(root, "src", "pages", "deep-coast-9085", "components", "generated", "LuluResetPassword.tsx"), "utf8");
const confirmDialogSource = readFileSync(join(root, "src", "components", "LuluConfirmDialog.tsx"), "utf8");

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

const nativeDialogFiles = sourceFiles(join(root, "src")).filter((path) => /window\.(?:confirm|alert)\s*\(/.test(readFileSync(path, "utf8")));

if (rawErrorFiles.length) issues.push(`${rawErrorFiles.length} files can still display raw technical error messages.`);
if (nativeDialogFiles.length) issues.push(`${nativeDialogFiles.length} files still use browser-native confirmation or alert dialogs.`);
if (!confirmDialogSource.includes("role=\"alertdialog\"") || !confirmDialogSource.includes("createPortal") || !confirmDialogSource.includes("event.key === \"Escape\"")) {
  issues.push("The shared confirmation dialog is missing an accessible modal implementation.");
}
if (!clientSource.includes("function createMessageId()")) issues.push("The secure-context-compatible request id fallback is missing.");
if (!clientSource.includes("FRIENDLY_API_MESSAGES")) issues.push("The friendly API error map is missing.");
if (!runtimeSource.includes("<GlobalUploadFeedback />")) issues.push("Global upload feedback is not mounted on every page.");
if (!uploadSource.includes('kind: "loading"') || !uploadSource.includes('kind: "success"') || !uploadSource.includes('kind: "error"')) {
  issues.push("Upload feedback does not cover loading, success and error states.");
}
if (!signupSource.includes("useState(false)") || !signupSource.includes("{password && <") || !signupSource.includes("{confirmPassword && <")) {
  issues.push("Registration progress is still visible before the user enters information.");
}
if (loginSource.includes("getTechnicalErrorDetails") || loginSource.includes("errorDetails")) {
  issues.push("The sign-in page can still expose internal request diagnostics to customers.");
}
if (resetPasswordSource.includes("State reference") || resetPasswordSource.includes("Reset password state reference")) {
  issues.push("The password-reset page still renders internal state-reference cards to customers.");
}
if (!resetPasswordSource.includes("const passwordsMatch = Boolean(confirmation)") || !resetPasswordSource.includes("{confirmation && <p id=\"password-match-message\"")) {
  issues.push("The password-reset page can show a match state before the user has confirmed a password.");
}

console.log(JSON.stringify({
  friendlyErrorMap: clientSource.includes("FRIENDLY_API_MESSAGES"),
  globalUploadFeedback: runtimeSource.includes("<GlobalUploadFeedback />"),
  rawTechnicalErrorFiles: rawErrorFiles.length,
  nativeDialogFiles: nativeDialogFiles.length,
  issues,
}, null, 2));
if (issues.length) process.exitCode = 1;
