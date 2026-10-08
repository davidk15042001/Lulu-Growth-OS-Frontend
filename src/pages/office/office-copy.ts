const REFERENCE_MARKER = /\[[\w:-]+\]\s*/g;
const TECHNICAL_CONTEXT = /\bCanonical task context evidence\b[\s\S]*$/i;

type Translate = (key: string) => string;

const WORK_ITEM_STATUSES = new Set([
  "queued",
  "running",
  "waiting for approval",
  "human controlled",
  "waiting",
  "paused",
  "failed",
  "completed",
  "cancelled",
]);

function normalizedOfficeIdentifier(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function shortenAtWordBoundary(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const shortened = value.slice(0, Math.max(1, maxLength - 1)).replace(/\s+\S*$/, "").trimEnd();
  return `${shortened || value.slice(0, Math.max(1, maxLength - 1))}…`;
}

/**
 * Work-item records can contain internal routing tags and diagnostic context.
 * Keep the Office projection focused on the human-readable assignment while
 * leaving the complete verified record available through its canonical workspace.
 */
export function conciseOfficeCopy(value: string | null | undefined, fallback: string, maxLength = 180) {
  const normalized = (value ?? "")
    .replace(TECHNICAL_CONTEXT, "")
    .replace(REFERENCE_MARKER, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return fallback;

  const firstSentenceEnd = normalized.search(/[.!?](?=\s|$)/);
  const primaryMessage = firstSentenceEnd >= 0 ? normalized.slice(0, firstSentenceEnd + 1) : normalized;
  return shortenAtWordBoundary(primaryMessage, maxLength);
}

/**
 * Dynamic work records do not pass through static page-copy extraction.
 * Translate exact known operational phrases when a locale provides them,
 * while preserving workspace-authored text when no translation exists.
 */
export function translatedOfficeCopy(value: string | null | undefined, fallback: string, t: Translate, maxLength = 180) {
  const normalized = (value ?? "")
    .replace(TECHNICAL_CONTEXT, "")
    .replace(REFERENCE_MARKER, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return fallback;
  const concise = conciseOfficeCopy(normalized, fallback, Number.MAX_SAFE_INTEGER);
  const translated = t(concise);
  if (translated !== concise) return conciseOfficeCopy(translated, fallback, maxLength);

  // Some timeline providers already truncate their title before it reaches
  // the Office. Translate the stable beginning as well, so the projection
  // does not expose an English fragment just because the full source phrase
  // is no longer available in the payload.
  const knownPrefixes = ["Continuously build a trusted global brand"];
  const translatedPrefix = knownPrefixes.find((prefix) => concise.startsWith(prefix) && t(prefix) !== prefix);
  if (translatedPrefix) {
    return conciseOfficeCopy(`${t(translatedPrefix)}${concise.slice(translatedPrefix.length)}`, fallback, maxLength);
  }

  return conciseOfficeCopy(concise, fallback, maxLength);
}

/**
 * Events and related-object identifiers are canonical API evidence, but the
 * Office is a human-facing projection. Render a stable, localized summary
 * instead of leaking implementation keys such as `Office.Work_item.Paused`.
 */
export function officeEvidenceTypeLabel(value: string | null | undefined, t: Translate) {
  const normalized = normalizedOfficeIdentifier(value ?? "");
  const workItemStatus = normalized.match(/\bwork item\s+(queued|running|waiting for approval|human controlled|waiting|paused|failed|completed|cancelled)\b/)?.[1];
  if (workItemStatus && WORK_ITEM_STATUSES.has(workItemStatus)) return `${t("Work item")} ${t(workItemStatus)}`;
  if (/\bagent run\b/.test(normalized)) return t("AI agent run");
  if (/\baction packet\b/.test(normalized)) return t("Action packet");
  if (/\bworkflow\b/.test(normalized)) return t("Automated workflow");
  if (/\bmanual\b/.test(normalized)) return t("Manual work");
  if (/\bsystem\b|\bdomain event\b/.test(normalized)) return t("System event");
  return t("Verified event");
}

export function officeRelatedObjectLabel(value: string | null | undefined, t: Translate) {
  const normalized = normalizedOfficeIdentifier(value ?? "");
  if (/\bagent run\b/.test(normalized)) return t("AI agent run");
  if (/\baction packet\b/.test(normalized)) return t("Action packet");
  if (/\bworkflow\b/.test(normalized)) return t("Automated workflow");
  return normalized ? t("Related work") : "";
}
