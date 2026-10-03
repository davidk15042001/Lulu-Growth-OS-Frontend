const REFERENCE_MARKER = /\[[\w:-]+\]\s*/g;
const TECHNICAL_CONTEXT = /\bCanonical task context evidence\b[\s\S]*$/i;

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
