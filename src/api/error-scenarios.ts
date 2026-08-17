export type ErrorScenarioCategory =
  | "network"
  | "authentication"
  | "authorization"
  | "validation"
  | "resource"
  | "rate-limit"
  | "billing"
  | "integration"
  | "storage"
  | "ai"
  | "server"
  | "request";

export type ErrorScenario = {
  category: ErrorScenarioCategory;
  userAction: "retry" | "sign-in" | "check-input" | "contact-admin" | "connect-platform" | "wait" | "contact-support";
  retryable: boolean;
};

const exactScenarios: Record<string, ErrorScenario> = {
  NETWORK_ERROR: { category: "network", userAction: "retry", retryable: true },
  API_TIMEOUT: { category: "network", userAction: "retry", retryable: true },
  UNAUTHORIZED: { category: "authentication", userAction: "sign-in", retryable: false },
  MISSING_REFRESH_TOKEN: { category: "authentication", userAction: "sign-in", retryable: false },
  INVALID_REFRESH_TOKEN: { category: "authentication", userAction: "sign-in", retryable: false },
  REFRESH_TOKEN_EXPIRED: { category: "authentication", userAction: "sign-in", retryable: false },
  FORBIDDEN: { category: "authorization", userAction: "contact-admin", retryable: false },
  VALIDATION_ERROR: { category: "validation", userAction: "check-input", retryable: false },
  BAD_REQUEST: { category: "request", userAction: "check-input", retryable: false },
  REQUEST_ERROR: { category: "request", userAction: "retry", retryable: true },
  NOT_FOUND: { category: "resource", userAction: "retry", retryable: false },
  CONFLICT: { category: "resource", userAction: "check-input", retryable: false },
  TOO_MANY_REQUESTS: { category: "rate-limit", userAction: "wait", retryable: true },
  INTERNAL_ERROR: { category: "server", userAction: "retry", retryable: true },
  API_ERROR: { category: "server", userAction: "contact-support", retryable: true },
  EMAIL_IN_USE: { category: "authentication", userAction: "sign-in", retryable: false },
  INVALID_CREDENTIALS: { category: "authentication", userAction: "sign-in", retryable: false },
  ACCOUNT_UNVERIFIED: { category: "authentication", userAction: "sign-in", retryable: false },
  ACCOUNT_NOT_FOUND: { category: "authentication", userAction: "sign-in", retryable: false },
  INVALID_OTP: { category: "authentication", userAction: "check-input", retryable: false },
  OTP_USED: { category: "authentication", userAction: "sign-in", retryable: false },
  OTP_EXPIRED: { category: "authentication", userAction: "sign-in", retryable: false },
  INVALID_RESET_CODE: { category: "authentication", userAction: "check-input", retryable: false },
  RESET_CODE_EXPIRED: { category: "authentication", userAction: "sign-in", retryable: false },
  METHOD_NOT_ALLOWED: { category: "request", userAction: "contact-support", retryable: false },
  INVALID_API_PATH: { category: "request", userAction: "contact-support", retryable: false },
  DOCUMENTS_NOT_READY: { category: "storage", userAction: "retry", retryable: true },
  DATABASE_MIGRATION_MISSING: { category: "storage", userAction: "contact-support", retryable: false },
};

export function getErrorScenario(code: string, status = 0): ErrorScenario {
  if (exactScenarios[code]) return exactScenarios[code];
  if (code.startsWith("AIRWALLEX_") || code.startsWith("BILLING_") || code === "PAYMENT_CONFIRMATION_TIMEOUT") {
    return { category: "billing", userAction: "retry", retryable: true };
  }
  if (code.startsWith("OAUTH_")) {
    return { category: "integration", userAction: "connect-platform", retryable: true };
  }
  if (code.startsWith("MAILCOW_") || code.startsWith("DOCUMENT_") || code.startsWith("STORAGE_") || code.startsWith("S3_") || code.startsWith("FILE_") || code === "UNSUPPORTED_FILE_TYPE") {
    return { category: "storage", userAction: "retry", retryable: true };
  }
  if (code.startsWith("AI_") || code === "TRANSLATION_INVALID_RESPONSE") {
    return { category: "ai", userAction: "retry", retryable: true };
  }
  if (status === 401) return exactScenarios.UNAUTHORIZED;
  if (status === 403) return exactScenarios.FORBIDDEN;
  if (status === 422) return exactScenarios.VALIDATION_ERROR;
  if (status >= 500) return exactScenarios.INTERNAL_ERROR;
  return exactScenarios.REQUEST_ERROR;
}

export function isRetryableError(code: string, status = 0) {
  return getErrorScenario(code, status).retryable;
}
