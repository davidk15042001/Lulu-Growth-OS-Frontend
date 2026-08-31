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
  TOKEN_REVOKED: { category: "authentication", userAction: "sign-in", retryable: false },
  SESSION_REFRESH_UNAVAILABLE: { category: "network", userAction: "retry", retryable: true },
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
  WEBSITE_SITE_NOT_FOUND: { category: "resource", userAction: "retry", retryable: false },
  WEBSITE_OWNERSHIP_MODE_INVALID: { category: "validation", userAction: "check-input", retryable: false },
  WEBSITE_DOMAIN_NOT_FOUND: { category: "resource", userAction: "retry", retryable: false },
  WEBSITE_GENERATION_JOB_NOT_FOUND: { category: "resource", userAction: "retry", retryable: false },
  WEBSITE_PROVIDER_NOT_CONNECTED: { category: "integration", userAction: "connect-platform", retryable: false },
  WEBSITE_PROVIDER_NO_SITE_AVAILABLE: { category: "integration", userAction: "connect-platform", retryable: false },
  WEBSITE_PROVIDER_COLLECTION_REQUIRED: { category: "integration", userAction: "check-input", retryable: false },
  WEBSITE_PROVIDER_WRITE_SCOPE_MISSING: { category: "authorization", userAction: "connect-platform", retryable: false },
  WEBSITE_GENERATION_FAILED: { category: "ai", userAction: "retry", retryable: true },
  WEBSITE_GENERATION_TIMEOUT: { category: "ai", userAction: "retry", retryable: true },
  WEBSITE_AI_TIMEOUT: { category: "ai", userAction: "retry", retryable: true },
  WEBSITE_AI_RATE_LIMITED: { category: "rate-limit", userAction: "wait", retryable: true },
  WEBSITE_AI_REQUEST_FAILED: { category: "ai", userAction: "retry", retryable: true },
  WEBSITE_AI_EMPTY_RESPONSE: { category: "ai", userAction: "retry", retryable: true },
  WEBSITE_ARCHITECTURE_INVALID: { category: "ai", userAction: "retry", retryable: true },
  WEBSITE_PAGE_INVALID: { category: "ai", userAction: "retry", retryable: true },
  WEBSITE_GENERATION_QUALITY_FAILED: { category: "ai", userAction: "retry", retryable: true },
  WEBSITE_GENERATION_RETRY_EXHAUSTED: { category: "server", userAction: "contact-support", retryable: false },
  WEBSITE_GENERATION_USER_MISSING: { category: "authentication", userAction: "sign-in", retryable: false },
  WEBSITE_PUBLISH_FAILED: { category: "integration", userAction: "retry", retryable: true },
  WEBSITE_DOMAIN_VERIFICATION_FAILED: { category: "integration", userAction: "check-input", retryable: true },
  WEBSITE_PROVIDER_REQUEST_FAILED: { category: "integration", userAction: "retry", retryable: true },
  WEBSITE_PROVIDER_TIMEOUT: { category: "integration", userAction: "retry", retryable: true },
  WEBSITE_PROVIDER_NETWORK_ERROR: { category: "network", userAction: "retry", retryable: true },
  WEBSITE_PROVIDER_RATE_LIMITED: { category: "integration", userAction: "wait", retryable: true },
  WEBSITE_PROVIDER_TOKEN_INVALID: { category: "integration", userAction: "connect-platform", retryable: false },
  WEBSITE_PROVIDER_CONFIGURATION_MISSING: { category: "integration", userAction: "contact-admin", retryable: false },
  WEBSITE_PROVIDER_SITE_ID_MISSING: { category: "integration", userAction: "connect-platform", retryable: false },
  WEBSITE_PUBLISH_STATE_INVALID: { category: "validation", userAction: "check-input", retryable: false },
  WEBSITE_MANAGED_HOSTING_NOT_CONFIGURED: { category: "integration", userAction: "contact-admin", retryable: false },
  AIRWALLEX_CREDENTIALS_MISSING: { category: "billing", userAction: "contact-admin", retryable: false },
  AIRWALLEX_AUTH_FAILED: { category: "billing", userAction: "contact-admin", retryable: false },
  AIRWALLEX_PRICE_NOT_CONFIGURED: { category: "billing", userAction: "contact-admin", retryable: false },
  AIRWALLEX_CHECKOUT_ID_MISSING: { category: "billing", userAction: "contact-support", retryable: false },
  AIRWALLEX_CHECKOUT_URL_MISSING: { category: "billing", userAction: "contact-support", retryable: false },
  AIRWALLEX_SUBSCRIPTION_STATUS_UNSUPPORTED: { category: "billing", userAction: "contact-support", retryable: false },
  AIRWALLEX_WEBHOOK_HEADERS_MISSING: { category: "billing", userAction: "contact-admin", retryable: false },
  AIRWALLEX_WEBHOOK_SECRET_MISSING: { category: "billing", userAction: "contact-admin", retryable: false },
  AIRWALLEX_WEBHOOK_SIGNATURE_INVALID: { category: "billing", userAction: "contact-admin", retryable: false },
  AIRWALLEX_WEBHOOK_TIMESTAMP_EXPIRED: { category: "billing", userAction: "wait", retryable: false },
  AIRWALLEX_WEBHOOK_TIMESTAMP_INVALID: { category: "billing", userAction: "contact-admin", retryable: false },
  AIRWALLEX_WEBHOOK_EVENT_ID_MISSING: { category: "billing", userAction: "contact-admin", retryable: false },
  AIRWALLEX_WEBHOOK_WORKSPACE_ID_MISSING: { category: "billing", userAction: "contact-support", retryable: false },
  AIRWALLEX_INVOICE_LOOKUP_FAILED: { category: "billing", userAction: "retry", retryable: true },
  AIRWALLEX_INVOICE_PDF_DOWNLOAD_FAILED: { category: "billing", userAction: "retry", retryable: true },
  AIRWALLEX_INVOICE_PDF_URL_MISSING: { category: "billing", userAction: "contact-support", retryable: false },
  BILLING_CHECKOUT_NOT_FOUND: { category: "billing", userAction: "retry", retryable: true },
  BILLING_INVOICE_EMAIL_FAILED: { category: "billing", userAction: "retry", retryable: true },
  BILLING_PLAN_INVALID: { category: "billing", userAction: "check-input", retryable: false },
  OAUTH_PROVIDER_CREDENTIALS_MISSING: { category: "integration", userAction: "contact-admin", retryable: false },
  OAUTH_PROVIDER_NOT_SUPPORTED: { category: "integration", userAction: "check-input", retryable: false },
  OAUTH_PROVIDER_DENIED: { category: "integration", userAction: "connect-platform", retryable: true },
  OAUTH_STATE_EXPIRED: { category: "integration", userAction: "connect-platform", retryable: true },
  OAUTH_STATE_INVALID: { category: "integration", userAction: "connect-platform", retryable: true },
  OAUTH_TOKEN_EXCHANGE_FAILED: { category: "integration", userAction: "retry", retryable: true },
  OAUTH_TOKEN_REFRESH_FAILED: { category: "integration", userAction: "connect-platform", retryable: false },
  OAUTH_REFRESH_TOKEN_MISSING: { category: "integration", userAction: "connect-platform", retryable: false },
  WORDPRESS_PUBLISH_VERIFICATION_FAILED: { category: "integration", userAction: "retry", retryable: true },
  WORDPRESS_PLACEHOLDER_CONTENT_DETECTED: { category: "validation", userAction: "check-input", retryable: false },
  WEBSITE_PROVIDER_REAUTH_REQUIRED: { category: "integration", userAction: "connect-platform", retryable: false },
  DATAFORSEO_NOT_CONFIGURED: { category: "integration", userAction: "contact-admin", retryable: false },
  DATAFORSEO_REQUEST_FAILED: { category: "integration", userAction: "retry", retryable: true },
  SEARCH_INTELLIGENCE_CONTEXT_MISSING: { category: "validation", userAction: "check-input", retryable: false },
  SHOPIFY_REQUEST_FAILED: { category: "integration", userAction: "connect-platform", retryable: true },
  EMAIL_PROVIDER_NOT_CONFIGURED: { category: "integration", userAction: "contact-admin", retryable: false },
  EMAIL_PROVIDER_REAUTH_REQUIRED: { category: "integration", userAction: "connect-platform", retryable: false },
  EMAIL_PROVIDER_REQUEST_FAILED: { category: "integration", userAction: "retry", retryable: true },
  EMAIL_PROVIDER_NOT_SUPPORTED: { category: "integration", userAction: "check-input", retryable: false },
  EMAIL_OAUTH_CALLBACK_NOT_CONFIGURED: { category: "integration", userAction: "contact-admin", retryable: false },
  EMAIL_OAUTH_CALLBACK_INCOMPLETE: { category: "integration", userAction: "connect-platform", retryable: true },
  EMAIL_OAUTH_CALLBACK_FAILED: { category: "integration", userAction: "connect-platform", retryable: true },
  EMAIL_OAUTH_DENIED: { category: "integration", userAction: "connect-platform", retryable: true },
  EMAIL_OAUTH_STATE_INVALID: { category: "integration", userAction: "connect-platform", retryable: true },
  EMAIL_OAUTH_STATE_EXPIRED: { category: "integration", userAction: "connect-platform", retryable: true },
  EMAIL_OAUTH_TOKEN_EXCHANGE_FAILED: { category: "integration", userAction: "retry", retryable: true },
  EMAIL_OAUTH_ACCESS_TOKEN_MISSING: { category: "integration", userAction: "connect-platform", retryable: false },
  EMAIL_ACCOUNT_LOOKUP_FAILED: { category: "integration", userAction: "retry", retryable: true },
  EMAIL_IMAP_CONFIGURATION_INVALID: { category: "validation", userAction: "check-input", retryable: false },
  EMAIL_SMTP_CONFIGURATION_INVALID: { category: "validation", userAction: "check-input", retryable: false },
  EMAIL_IMAP_CONNECTION_FAILED: { category: "integration", userAction: "check-input", retryable: true },
  EMAIL_SYNC_FAILED: { category: "integration", userAction: "retry", retryable: true },
  EMAIL_ACCOUNT_MISMATCH: { category: "validation", userAction: "check-input", retryable: false },
  EMAIL_THREAD_EMPTY: { category: "resource", userAction: "retry", retryable: false },
  EMAIL_RECIPIENT_MISSING: { category: "validation", userAction: "check-input", retryable: false },
  EMAIL_DRAFT_CREATE_FAILED: { category: "storage", userAction: "retry", retryable: true },
  EMAIL_DRAFT_STATE_INVALID: { category: "validation", userAction: "check-input", retryable: false },
  CALENDAR_PROVIDER_NOT_CONFIGURED: { category: "integration", userAction: "contact-admin", retryable: false },
  CALENDAR_PROVIDER_REAUTH_REQUIRED: { category: "integration", userAction: "connect-platform", retryable: false },
  CALENDAR_PROVIDER_REQUEST_FAILED: { category: "integration", userAction: "retry", retryable: true },
  CALENDAR_PROVIDER_NOT_SUPPORTED: { category: "integration", userAction: "check-input", retryable: false },
  CALENDAR_OAUTH_CALLBACK_NOT_CONFIGURED: { category: "integration", userAction: "contact-admin", retryable: false },
  CALENDAR_OAUTH_CALLBACK_INCOMPLETE: { category: "integration", userAction: "connect-platform", retryable: true },
  CALENDAR_OAUTH_CALLBACK_FAILED: { category: "integration", userAction: "connect-platform", retryable: true },
  CALENDAR_OAUTH_DENIED: { category: "integration", userAction: "connect-platform", retryable: true },
  CALENDAR_OAUTH_STATE_INVALID: { category: "integration", userAction: "connect-platform", retryable: true },
  CALENDAR_OAUTH_STATE_EXPIRED: { category: "integration", userAction: "connect-platform", retryable: true },
  CALENDAR_OAUTH_TOKEN_EXCHANGE_FAILED: { category: "integration", userAction: "retry", retryable: true },
  CALENDAR_OAUTH_ACCESS_TOKEN_MISSING: { category: "integration", userAction: "connect-platform", retryable: false },
  CALENDAR_ACCOUNT_LOOKUP_FAILED: { category: "integration", userAction: "retry", retryable: true },
  CALENDAR_SYNC_FAILED: { category: "integration", userAction: "retry", retryable: true },
  IMPERSONATION_INVALID_TARGET: { category: "authorization", userAction: "contact-admin", retryable: false },
  IMPERSONATION_NOT_ACTIVE: { category: "authorization", userAction: "sign-in", retryable: false },
  GOOGLE_BUSINESS_NOT_CONNECTED: { category: "integration", userAction: "connect-platform", retryable: false },
  GOOGLE_BUSINESS_REAUTH_REQUIRED: { category: "integration", userAction: "connect-platform", retryable: false },
  GOOGLE_BUSINESS_API_ERROR: { category: "integration", userAction: "retry", retryable: true },
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
