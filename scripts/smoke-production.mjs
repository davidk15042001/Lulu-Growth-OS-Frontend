#!/usr/bin/env node

/**
 * Read-only production smoke test.
 *
 * This intentionally exercises only public GET endpoints. It never logs in,
 * mutates a workspace, sends a provider message, or creates a payment.
 */

const baseUrl = (process.env.LULU_PRODUCTION_BASE_URL ?? "https://lulu-ai.tech").replace(/\/+$/, "");
const apiBaseUrl = (process.env.LULU_PRODUCTION_API_BASE_URL ?? "https://api.lulu-ai.tech/api/v1").replace(/\/+$/, "");
const timeoutMs = Number.parseInt(process.env.LULU_SMOKE_TIMEOUT_MS ?? "15000", 10);

if (!Number.isFinite(timeoutMs) || timeoutMs < 1000) {
  console.error("LULU_SMOKE_TIMEOUT_MS must be at least 1000ms.");
  process.exit(2);
}

const checks = [
  { name: "release manifest", path: "/release.json", kind: "release" },
  { name: "public root", path: "/", kind: "html" },
  { name: "login route", path: "/login", kind: "html" },
  { name: "registration route", path: "/register", kind: "html" },
  { name: "office route shell", path: "/app/office", kind: "html" },
  { name: "website preview shell", path: "/app/website-preview", kind: "html" },
  { name: "API health", url: `${apiBaseUrl}/health`, kind: "health" },
  { name: "API readiness", url: `${apiBaseUrl}/ready`, kind: "ready" },
];

const results = [];

async function request(check) {
  const url = check.url ?? `${baseUrl}${check.path}`;
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { accept: "application/json, text/html;q=0.9, */*;q=0.8" },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const contentType = response.headers.get("content-type") ?? "";
    const body = await response.text();
    const result = {
      name: check.name,
      path: check.path,
      status: response.status,
      contentType,
      durationMs: Date.now() - startedAt,
      ok: response.ok,
    };

    if (!response.ok) {
      return { ...result, ok: false, error: `HTTP ${response.status}` };
    }

    if (check.kind === "html") {
      if (!contentType.toLowerCase().includes("text/html") || !body.toLowerCase().includes("<html")) {
        return { ...result, ok: false, error: "response is not an HTML document" };
      }
      return result;
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      return { ...result, ok: false, error: "response is not valid JSON" };
    }

    if (check.kind === "release") {
      const valid = typeof payload.frontend === "string"
        && typeof payload.backend === "string"
        && typeof payload.builtAt === "string";
      return valid ? result : { ...result, ok: false, error: "release manifest is incomplete" };
    }

    if (check.kind === "health") {
      const valid = payload?.success === true && payload?.data?.status === "ok";
      return valid ? result : { ...result, ok: false, error: "health payload is not ready" };
    }

    if (check.kind === "ready") {
      const valid = payload?.success === true && payload?.data?.ready === true;
      return valid ? result : { ...result, ok: false, error: "readiness payload is not ready" };
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      name: check.name,
      path: check.path,
      status: null,
      contentType: "",
      durationMs: Date.now() - startedAt,
      ok: false,
      error: message,
    };
  }
}

for (const check of checks) {
  // Keep the order deterministic so a failed deploy is easy to diagnose.
  results.push(await request(check));
}

const failed = results.filter(result => !result.ok);
console.log(JSON.stringify({ baseUrl, passed: failed.length === 0, checks: results }, null, 2));

if (failed.length > 0) {
  process.exitCode = 1;
}
