import { getErrorScenario, type ErrorScenario } from "./error-scenarios";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequest = {
  path: string;
  method?: ApiMethod;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
};

export type ApiEnvelope<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiDiagnostics = {
  requestId?: string;
  endpoint?: string;
  timestamp?: string;
};

type ApiErrorEnvelope = {
  success: false;
  error?: { code?: string; message?: string; details?: unknown; diagnostics?: ApiDiagnostics };
};

const FRIENDLY_API_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: "We could not connect right now. Please check your internet connection and try again.",
  API_TIMEOUT: "This is taking longer than expected. Please try again.",
  EMAIL_IN_USE: "An account already exists with this email. Please sign in or use another email.",
  INVALID_CREDENTIALS: "The email or password is not correct. Please check both and try again.",
  ADMIN_MFA_INVALID: "The administrator verification code is invalid or expired.",
  ACCOUNT_UNVERIFIED: "Please confirm your email before signing in.",
  ACCOUNT_NOT_FOUND: "We could not find an account with this email.",
  INVALID_OTP: "This confirmation code is not correct. Please check it and try again.",
  OTP_USED: "This confirmation code has already been used. Please request a new one.",
  OTP_EXPIRED: "This confirmation code has expired. Please request a new one.",
  TWILIO_WHATSAPP_TEMPLATE_REQUIRED: "WhatsApp needs an approved message template because the 24-hour reply window has closed.",
  TWILIO_NOT_CONFIGURED: "Twilio messaging is not configured on the server yet.",
  TWILIO_API_ERROR: "Twilio could not deliver this message. Please try again.",
  INVALID_RESET_CODE: "This password reset code is not correct. Please check it and try again.",
  RESET_CODE_EXPIRED: "This password reset code has expired. Please request a new one.",
  MISSING_REFRESH_TOKEN: "Your session has ended. Please sign in again.",
  SESSION_REFRESH_UNAVAILABLE: "Your session is still saved, but the connection could not be restored. Please try again.",
  INVALID_REFRESH_TOKEN: "Your session has ended. Please sign in again.",
  REFRESH_TOKEN_EXPIRED: "Your session has ended. Please sign in again.",
  TOKEN_REVOKED: "This session was revoked. Please sign in again.",
  REFRESH_REUSE_DETECTED: "This session was ended for security reasons. Please sign in again.",
  OTP_RESEND_RATE_LIMITED: "Please wait 60 seconds before requesting another code.",
  IMPERSONATION_INVALID_TARGET: "This account cannot be opened in admin view.",
  IMPERSONATION_NOT_ACTIVE: "There is no active admin session to return to.",
  UNAUTHORIZED: "Please sign in to continue.",
  FORBIDDEN: "You do not have permission to do this. Ask a workspace administrator for help.",
  IMPERSONATION_PASSWORD_CHANGE_BLOCKED: "End the admin workspace view before changing this password.",
  CURRENT_PASSWORD_INVALID: "The current password is incorrect.",
  PASSWORD_UNCHANGED: "The new password must be different from your current password.",
  NOT_FOUND: "We could not find what you were looking for. It may have been removed.",
  CONFLICT: "This change could not be saved because the information is already in use.",
  VALIDATION_ERROR: "Please check your entries. Some information is missing or not valid.",
  BAD_REQUEST: "We could not complete this request. Please check your entries and try again.",
  REQUEST_ERROR: "We could not complete this request. Please check your entries and try again.",
  TOO_MANY_REQUESTS: "Too many requests. Please wait briefly and try again.",
  AI_NOT_CONFIGURED: "The AI assistant is temporarily unavailable. Please try again later.",
  AI_PROVIDER_NOT_CONFIGURED: "Lulu is waiting for an AI provider to be connected.",
  AI_PROVIDER_CIRCUITS_OPEN: "The AI assistant is temporarily unavailable. Please try again later.",
  AI_PROVIDERS_UNAVAILABLE: "The AI assistant is temporarily unavailable. Please try again later.",
  AI_FUNDS_REQUIRED: "Add AI funds before Lulu can continue this work.",
  AI_FUNDS_EXHAUSTED: "Lulu is waiting for more AI funds before continuing this work.",
  AI_REVERSAL_DEBT: "Lulu is waiting for a billing adjustment before continuing AI work.",
  AGENT_REASONING_NOT_CONFIGURED: "Lulu is waiting for the AI reasoning service to be configured.",
  AGENT_PREREQUISITE_REQUIRED: "Lulu is waiting for a required connection, permission, or company detail. It will not retry automatically.",
  PROFILE_COMPLETION_REQUIRED: "Complete the company profile before Lulu can continue this work.",
  COMMERCIAL_POLICY_MISSING: "Add the company billing policy before Lulu can create this document.",
  CUSTOMER_BUDGET_REQUIRED: "Add the customer's approved budget before Lulu can continue.",
  SEARCH_INTELLIGENCE_CONTEXT_MISSING: "Add company or market information before Lulu can research this.",
  EMAIL_PROVIDER_NOT_CONFIGURED: "Connect an email account before Lulu can send or synchronize messages.",
  EMAIL_IMAP_CONNECTION_FAILED: "Lulu cannot reach the connected email account. Reconnect it before resuming.",
  EMAIL_RECIPIENT_MISSING: "Add a recipient before Lulu can send this email.",
  CALENDAR_PROVIDER_NOT_CONFIGURED: "Connect a calendar before Lulu can schedule this event.",
  COMPOSIO_NOT_CONFIGURED: "Composio is not enabled on this server yet.",
  COMPOSIO_TOOLKIT_INVALID: "Choose a valid Composio app before connecting it.",
  COMPOSIO_CONNECT_LINK_MISSING: "Composio could not start this connection. Please try again.",
  CALENDAR_ACCOUNT_LOOKUP_FAILED: "Lulu cannot reach the connected calendar. Reconnect it before resuming.",
  OMNICHANNEL_DELIVERY_CONTEXT_MISSING: "Lulu needs a verified conversation and recipient before sending this message.",
  OMNICHANNEL_DELIVERY_PREVIOUSLY_FAILED: "The previous message attempt needs review before Lulu can send again.",
  UNIFYPORT_NOT_CONFIGURED: "Connect and authorize the UnifyPort WhatsApp account before resuming.",
  UNIFYPORT_ACCOUNT_ID_MISSING: "Select a running UnifyPort WhatsApp account before resuming.",
  UNIFYPORT_CHANNEL_UNSUPPORTED: "This WhatsApp channel is not supported by the connected UnifyPort account.",
  UNIFYPORT_RECIPIENT_INVALID: "Add a valid WhatsApp recipient before Lulu can send this message.",
  UNIFYPORT_MESSAGE_ID_MISSING: "UnifyPort did not confirm the message. Review the connection before retrying.",
  SOCIAL_PROVIDER_NOT_CONNECTED: "Connect the required social account before Lulu can publish.",
  SOCIAL_PROVIDER_SCOPE_MISSING: "Reconnect the social account with publishing permission before resuming.",
  GOOGLE_ADS_NOT_CONNECTED: "Connect a Google Ads account before Lulu can work on this campaign.",
  GOOGLE_ADS_CONFIGURATION_MISSING: "Complete the Google Ads connection before resuming.",
  GOOGLE_ADS_PAYER_MAPPING_MISSING: "Complete the Google Ads billing setup before launching a campaign.",
  AD_BUDGET_AUTHORIZATION_REQUIRED: "Approve the campaign budget before Lulu can launch paid advertising.",
  AD_SPEND_FUNDS_REQUIRED: "Add advertising funds before Lulu can launch or continue paid advertising.",
  ADVERTISING_PROVIDER_NOT_CONNECTED: "Connect the advertising account before Lulu can continue.",
  AI_EMPTY_RESPONSE: "The AI assistant could not prepare an answer. Please try again.",
  KIE_NOT_CONFIGURED: "Premium media is ready and will start once the Kie.ai server key is connected.",
  KIE_CREDITS_REQUIRED: "Premium media is paused until the Kie.ai platform balance is funded.",
  KIE_CALLBACK_URL_MISSING: "Premium media needs its secure public callback address on the server.",
  PREMIUM_MEDIA_STORAGE_NOT_CONFIGURED: "Premium media needs permanent private storage before production can start.",
  PREMIUM_MEDIA_REFERENCE_REQUIRED: "Add an authoritative product image; Lulu will start premium production automatically.",
  PREMIUM_IMAGE_QUALITY_REJECTED: "The generated images did not pass Lulu's premium identity gate.",
  PREMIUM_VIDEO_QUALITY_REJECTED: "The generated videos did not pass Lulu's premium quality gate.",
  AI_ENTITLEMENT_DISABLED: "AI actions are not enabled for this workspace. Ask a workspace administrator for help.",
  ASSISTANT_ACTION_FORBIDDEN: "You do not have permission to run this assistant action.",
  ASSISTANT_ACTION_APPROVAL_EXPIRED: "The approval for this assistant action has expired. Ask the assistant to prepare it again.",
  ASSISTANT_ACTION_REJECTED: "This assistant action was rejected and was not executed.",
  ASSISTANT_ACTION_EXECUTION_FAILED: "The assistant action could not be completed. Please try again.",
  ASSISTANT_ACTION_STATE_UNCERTAIN: "The server restarted while this action was running. Please review its result before trying again.",
  ASSISTANT_ACTION_EXECUTING: "This action has already started and cannot be cancelled automatically. Lulu will reconcile its provider result.",
  ASSISTANT_ACTION_CANCELLED: "This assistant action was cancelled before it was executed.",
  OFFICE_WORK_ITEM_VERSION_CONFLICT: "This work item changed while you were viewing it. Reload the employee before applying another control.",
  OFFICE_CONTROL_NOT_AVAILABLE: "This control is no longer available for the work item's current state.",
  VERSION_CONFLICT: "This record changed while you were viewing it. Reload the latest version and try again.",
  IDEMPOTENCY_CONFLICT: "This operation key was already used for a different commerce change. Please try again.",
  INSUFFICIENT_STOCK: "There is not enough available stock to complete this action. Review current reservations and inventory.",
  TRANSLATION_INVALID_RESPONSE: "This language is temporarily unavailable. Please try again in a moment.",
  METHOD_NOT_ALLOWED: "This action is not available here.",
  INVALID_API_PATH: "This action could not be opened. Please return to the previous page and try again.",
  FILE_REQUIRED: "Please choose a file before uploading.",
  FILE_TOO_LARGE: "Dateigröße ist zu groß.",
  UNSUPPORTED_FILE_TYPE: "This file type is not supported. Please choose an image, PDF, Office, TXT, or CSV file.",
  DOCUMENT_NOT_FOUND: "This document is no longer available.",
  DOCUMENTS_NOT_READY: "Document storage is not ready yet. Please try again shortly.",
  FILE_NAME_REQUIRED: "The selected file does not have a usable file name.",
  DOCUMENT_LIST_FAILED: "The saved documents could not be loaded.",
  DOCUMENT_CONTENT_FAILED: "The document preview could not be loaded.",
  DOCUMENT_DELETE_FAILED: "The document could not be deleted.",
  STORAGE_NOT_CONFIGURED: "Document storage is not configured on the server yet.",
  S3_UPLOAD_FAILED: "Amazon S3 could not save the document. Please try again.",
  S3_DOWNLOAD_FAILED: "Amazon S3 could not load the document preview.",
  S3_DELETE_FAILED: "Amazon S3 could not delete the document.",
  WORKSPACE_LOGO_EMPTY: "Please choose a logo before uploading.",
  WORKSPACE_LOGO_TYPE_UNSUPPORTED: "Use a PNG, JPG, JPEG, WebP or GIF image for the company logo.",
  WORKSPACE_LOGO_TOO_LARGE: "The company logo must be 5 MB or smaller.",
  WORKSPACE_LOGO_NOT_FOUND: "The company logo could not be found.",
  DATABASE_MIGRATION_MISSING: "Document storage is not enabled on the server yet.",
  INTERNAL_ERROR: "A server error occurred. Please send the technical details to support.",
  API_ERROR: "The API returned an unexpected error. Please send the technical details to support.",
  BILLING_PLAN_INVALID: "The selected billing plan is not supported.",
  BILLING_PLAN_NOT_AVAILABLE: "The selected billing plan is not available for this account.",
  BILLING_TEST_PLAN_DISABLED: "The internal Test plan is not enabled on this server.",
  BILLING_CHECKOUT_ALREADY_ACTIVE: "Another payment checkout is already active for this workspace.",
  ONBOARDING_INCOMPLETE: "Complete the required onboarding steps before choosing a billing plan.",
  AIRWALLEX_CREDENTIALS_MISSING: "Airwallex is not configured on the server yet.",
  AIRWALLEX_AUTH_FAILED: "Airwallex could not authenticate the billing request.",
  AIRWALLEX_PRICE_NOT_CONFIGURED: "The selected annual plan is not configured in Airwallex yet.",
  AIRWALLEX_CHECKOUT_CREATE_FAILED: "Airwallex rejected the checkout setup.",
  AIRWALLEX_CHECKOUT_ID_MISSING: "Airwallex did not return a checkout identifier.",
  AIRWALLEX_CHECKOUT_URL_MISSING: "Airwallex did not return a hosted checkout URL.",
  STOREFRONT_PAYMENT_AMOUNT_INVALID: "This storefront order cannot be paid because its amount is invalid.",
  STOREFRONT_PAYMENT_URL_MISSING: "The secure storefront payment link was not created. Please try again.",
  PAYOUT_BALANCE_INSUFFICIENT: "The payout amount is higher than the paid balance available for this currency.",
  PAYOUT_ACCOUNT_NOT_FOUND: "The selected payout account is no longer active.",
  PAYOUT_NOT_FOUND: "This payout could not be found.",
  STOREFRONT_PAYOUT_ID_MISSING: "The payment provider did not confirm the payout transfer.",
  AIRWALLEX_INVOICE_LOOKUP_FAILED: "Airwallex could not load the invoice yet. Please try again shortly.",
  AIRWALLEX_INVOICE_PDF_URL_MISSING: "The invoice is not ready as a PDF yet. Please try again shortly.",
  AIRWALLEX_INVOICE_PDF_DOWNLOAD_FAILED: "Airwallex could not download the invoice PDF.",
  AIRWALLEX_RAW_BODY_MISSING: "The Airwallex webhook request body could not be read.",
  AIRWALLEX_SUBSCRIPTION_STATUS_UNSUPPORTED: "Airwallex sent a subscription status that Lulu does not recognize yet.",
  AIRWALLEX_WEBHOOK_WORKSPACE_ID_MISSING: "The Airwallex webhook did not identify a Lulu workspace.",
  MAILCOW_SMTP_CONFIGURATION_MISSING: "Transactional email is not configured on the server yet.",
  MAILCOW_SMTP_SEND_FAILED: "The email service could not send this message. Please try again shortly.",
  BILLING_INVOICE_EMAIL_FAILED: "The payment succeeded, but the invoice email could not be sent yet.",
  OAUTH_PROVIDER_CREDENTIALS_MISSING: "This platform connection is not configured on the server yet.",
  OAUTH_PROVIDER_NOT_SUPPORTED: "This platform connection is not supported yet.",
  OAUTH_CALLBACK_BASE_URL: "The platform callback address is not configured on the server.",
  OAUTH_CALLBACK_NOT_CONFIGURED: "The platform callback is not configured on the server yet.",
  OAUTH_CALLBACK_INCOMPLETE: "The platform callback returned incomplete connection data.",
  OAUTH_CALLBACK_FAILED: "The platform connection could not be completed.",
  OAUTH_PROVIDER_DENIED: "The provider declined the connection. Please try again.",
  OAUTH_STATE_INVALID: "The platform connection session is invalid. Please start again.",
  OAUTH_STATE_EXPIRED: "The platform connection session expired. Please start again.",
  OAUTH_STATE_SIGNATURE_INVALID: "The platform connection session could not be verified.",
  OAUTH_TOKEN_EXCHANGE_FAILED: "The platform did not accept the authorization exchange.",
  OAUTH_TOKEN_REFRESH_FAILED: "The saved platform connection could not be refreshed. Please reconnect it.",
  OAUTH_REFRESH_TOKEN_MISSING: "This platform must be reconnected to stay authorized.",
  OAUTH_ACCESS_TOKEN_MISSING: "The platform did not return an access token.",
  OAUTH_ACCOUNT_LOOKUP_FAILED: "The connected platform account could not be loaded.",
  GOOGLE_BUSINESS_NOT_CONNECTED: "Google Business Profile is not connected for this workspace yet.",
  GOOGLE_BUSINESS_REAUTH_REQUIRED: "The Google Business Profile connection expired. Please reconnect it.",
  GOOGLE_BUSINESS_API_ERROR: "Google Business Profile rejected the request. Please verify account access and try again.",
  CRM_WRITE_OUTCOME_UNCERTAIN: "The CRM provider may already have received this company update. Lulu will not send it again automatically. Reconcile the company before retrying.",
  CRM_WRITE_IN_PROGRESS: "A CRM company update is already in progress. Please wait for the current operation to finish.",
  AIRWALLEX_WEBHOOK_SECRET_MISSING: "The Airwallex webhook is not configured on the server.",
  AIRWALLEX_WEBHOOK_HEADERS_MISSING: "Airwallex sent an incomplete webhook request.",
  AIRWALLEX_WEBHOOK_TIMESTAMP_INVALID: "Airwallex sent an invalid webhook timestamp.",
  AIRWALLEX_WEBHOOK_TIMESTAMP_EXPIRED: "The Airwallex webhook arrived outside the allowed time window.",
  AIRWALLEX_WEBHOOK_SIGNATURE_INVALID: "The Airwallex webhook signature could not be verified.",
  AIRWALLEX_WEBHOOK_EVENT_ID_MISSING: "Airwallex sent a webhook without an event ID.",
  AD_SPEND_AMOUNT_INVALID: "Enter an advertising budget of at least CNY 1.00.",
  AD_SPEND_PAYMENT_METHOD_UNAVAILABLE: "This advertising payment method is not enabled.",
  AD_SPEND_TOPUP_NOT_FOUND: "This advertising payment could not be found.",
  AIRWALLEX_AD_SPEND_INVOICE_ID_MISSING: "Airwallex did not return an invoice for this advertising payment.",
  AIRWALLEX_AD_SPEND_CHECKOUT_URL_MISSING: "Airwallex did not return a card checkout link.",
  AIRWALLEX_AD_SPEND_INTENT_ID_MISSING: "Airwallex did not create the advertising payment.",
  AIRWALLEX_AD_SPEND_QR_MISSING: "Airwallex did not return a payment QR code.",
  PAYMENT_CONFIRMATION_TIMEOUT: "Payment returned, but the subscription confirmation did not arrive in time.",
  WEBSITE_SITE_NOT_FOUND: "The connected website could not be found in this workspace.",
  WEBSITE_OWNERSHIP_MODE_INVALID: "The website ownership mode does not match the selected provider.",
  WEBSITE_DOMAIN_NOT_FOUND: "The website domain could not be found.",
  WEBSITE_GENERATION_JOB_NOT_FOUND: "The website generation job could not be found.",
  WEBSITE_PROVIDER_NOT_CONNECTED: "The selected website provider is not connected yet.",
  WEBSITE_PROVIDER_NO_SITE_AVAILABLE: "The provider account is connected, but it has no website yet. Create a site in the provider first, then try again.",
  WEBSITE_PROVIDER_WRITE_SCOPE_MISSING: "The connected provider does not have permission to change this website.",
  WEBSITE_GENERATION_FAILED: "The website could not be generated from this prompt.",
  WEBSITE_GENERATION_TIMEOUT: "Website generation took too long and was stopped. Please try again.",
  WEBSITE_AI_TIMEOUT: "The AI provider did not finish this generation step in time. Lulu will retry interrupted jobs automatically.",
  WEBSITE_AI_RATE_LIMITED: "The AI provider is temporarily limiting requests. Lulu will retry the generation automatically.",
  WEBSITE_AI_REQUEST_FAILED: "The AI provider could not complete this generation step.",
  WEBSITE_AI_EMPTY_RESPONSE: "The AI provider returned an empty website generation result.",
  WEBSITE_ARCHITECTURE_INVALID: "The AI provider did not return a valid website structure.",
  WEBSITE_PAGE_INVALID: "The AI provider did not return a valid generated page.",
  WEBSITE_GENERATION_QUALITY_FAILED: "The generated website did not meet Lulu's publication quality checks.",
  WEBSITE_GENERATION_RETRY_EXHAUSTED: "Website generation was interrupted repeatedly and could not be resumed.",
  WEBSITE_GENERATION_USER_MISSING: "The user who started this website generation no longer exists.",
  WEBSITE_PUBLISH_FAILED: "The generated website could not be published.",
  WEBSITE_DOMAIN_VERIFICATION_FAILED: "The domain could not be verified. Please check the DNS record and try again.",
  WEBSITE_PROVIDER_REQUEST_FAILED: "The website provider rejected the request.",
  WEBSITE_PROVIDER_TIMEOUT: "The website provider did not respond in time. Please try again shortly.",
  WEBSITE_PROVIDER_NETWORK_ERROR: "The website provider could not be reached. Please check the connection and try again.",
  WEBSITE_PROVIDER_TOKEN_INVALID: "The saved website connection could not be opened securely.",
  WEBSITE_PROVIDER_REAUTH_REQUIRED: "The website provider connection has expired. Please reconnect it.",
  WEBSITE_PROVIDER_CONFIGURATION_MISSING: "The website provider configuration is incomplete.",
  WEBSITE_PROVIDER_SITE_ID_MISSING: "The connected website does not have a provider site ID.",
  WEBSITE_PUBLISH_STATE_INVALID: "Only a generated website preview can be published.",
  WEBSITE_MANAGED_HOSTING_NOT_CONFIGURED: "Managed website hosting is not configured yet.",
  DATAFORSEO_NOT_CONFIGURED: "DataForSEO is not configured on the server yet.",
  DATAFORSEO_REQUEST_FAILED: "DataForSEO rejected the analysis request. Please try again or check the server credentials.",
  EMAIL_PROVIDER_REAUTH_REQUIRED: "This email account must be reconnected before it can synchronize or send.",
  EMAIL_PROVIDER_REQUEST_FAILED: "The email provider rejected the request. Please try again or reconnect the account.",
  EMAIL_PROVIDER_NOT_SUPPORTED: "This email provider is not supported.",
  EMAIL_OAUTH_CALLBACK_NOT_CONFIGURED: "The email connection callback is not configured on the server.",
  EMAIL_OAUTH_CALLBACK_INCOMPLETE: "The email provider returned incomplete connection data.",
  EMAIL_OAUTH_CALLBACK_FAILED: "The email connection could not be completed.",
  EMAIL_OAUTH_DENIED: "The email provider connection was cancelled or declined.",
  EMAIL_OAUTH_STATE_INVALID: "The email connection session is invalid. Please start again.",
  EMAIL_OAUTH_STATE_EXPIRED: "The email connection session expired. Please start again.",
  EMAIL_OAUTH_TOKEN_EXCHANGE_FAILED: "The email provider did not accept the authorization exchange.",
  EMAIL_OAUTH_ACCESS_TOKEN_MISSING: "The email provider did not return a usable access token.",
  EMAIL_ACCOUNT_LOOKUP_FAILED: "The connected email identity could not be loaded.",
  CALENDAR_PROVIDER_REAUTH_REQUIRED: "This calendar account must be reconnected before it can synchronize.",
  CALENDAR_PROVIDER_REQUEST_FAILED: "The calendar provider rejected the request. Please try again or reconnect the account.",
  CALENDAR_PROVIDER_NOT_SUPPORTED: "This calendar provider is not supported.",
  CALENDAR_OAUTH_CALLBACK_NOT_CONFIGURED: "The calendar connection callback is not configured on the server.",
  CALENDAR_OAUTH_CALLBACK_INCOMPLETE: "The calendar provider returned incomplete connection data.",
  CALENDAR_OAUTH_CALLBACK_FAILED: "The calendar connection could not be completed.",
  CALENDAR_OAUTH_DENIED: "The calendar provider connection was cancelled or declined.",
  CALENDAR_OAUTH_STATE_INVALID: "The calendar connection session is invalid. Please start again.",
  CALENDAR_OAUTH_STATE_EXPIRED: "The calendar connection session expired. Please start again.",
  CALENDAR_OAUTH_TOKEN_EXCHANGE_FAILED: "The calendar provider did not accept the authorization exchange.",
  CALENDAR_OAUTH_ACCESS_TOKEN_MISSING: "The calendar provider did not return a usable access token.",
  CALENDAR_SYNC_FAILED: "The calendar could not be synchronized.",
  EMAIL_IMAP_CONFIGURATION_INVALID: "The IMAP configuration is incomplete.",
  EMAIL_SMTP_CONFIGURATION_INVALID: "The SMTP configuration is incomplete.",
  EMAIL_SYNC_FAILED: "The mailbox could not be synchronized.",
  EMAIL_ACCOUNT_MISMATCH: "The selected conversation belongs to another email account.",
  EMAIL_THREAD_EMPTY: "This conversation has no message to answer.",
  EMAIL_DRAFT_CREATE_FAILED: "The email draft could not be saved.",
  EMAIL_DRAFT_STATE_INVALID: "This draft is already being sent or has already been sent.",
};

function friendlyApiMessage(status: number, code: string) {
  if (FRIENDLY_API_MESSAGES[code]) return FRIENDLY_API_MESSAGES[code];
  if (status === 401) return FRIENDLY_API_MESSAGES.UNAUTHORIZED;
  if (status === 403) return FRIENDLY_API_MESSAGES.FORBIDDEN;
  if (status === 404) return FRIENDLY_API_MESSAGES.NOT_FOUND;
  if (status === 409) return FRIENDLY_API_MESSAGES.CONFLICT;
  if (status === 422) return FRIENDLY_API_MESSAGES.VALIDATION_ERROR;
  if (status === 429) return FRIENDLY_API_MESSAGES.TOO_MANY_REQUESTS;
  if (status >= 500) return "Something went wrong on our side. Please try again in a moment.";
  return "Something went wrong. Please try again.";
}

function isMeaningfulServerErrorMessage(message: string, code: string) {
  const normalized = message.trim();
  if (!normalized) return false;
  if (/^API request failed/i.test(normalized)) return false;
  if ((code === "API_ERROR" || code === "INTERNAL_ERROR") && (
    normalized === FRIENDLY_API_MESSAGES.API_ERROR
    || normalized === FRIENDLY_API_MESSAGES.INTERNAL_ERROR
  )) {
    return false;
  }
  return true;
}

function isGenericServerErrorMessage(error: ApiError) {
  return error.code === "API_ERROR"
    || error.code === "INTERNAL_ERROR"
    || error.message === friendlyApiMessage(error.status, error.code);
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;
  readonly diagnostics?: ApiDiagnostics;
  readonly scenario: ErrorScenario;

  constructor(status: number, code: string, message: string, details?: unknown, diagnostics?: ApiDiagnostics) {
    const friendlyMessage = FRIENDLY_API_MESSAGES[code];
    const shouldPreferServerMessage = (code === "API_ERROR" || code === "INTERNAL_ERROR") && isMeaningfulServerErrorMessage(message, code);
    const resolvedMessage = shouldPreferServerMessage
      ? message
      : friendlyMessage ?? (isMeaningfulServerErrorMessage(message, code) ? message : friendlyApiMessage(status, ""));
    super(resolvedMessage);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.diagnostics = diagnostics;
    this.scenario = getErrorScenario(code, status);
  }
}

export function getFriendlyErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (!(error instanceof ApiError)) return fallback;
  const message = fallback && isGenericServerErrorMessage(error) ? fallback : error.message;
  // Server-side failures used to be reduced to a generic sentence by each
  // individual page. Keep the friendly text, but attach the same safe,
  // actionable request diagnostics everywhere so support can identify the
  // failing endpoint without exposing tokens, payloads or stack traces.
  if (error.status >= 500 || error.code === "API_ERROR" || error.code === "INTERNAL_ERROR") {
    return `${message} · ${getTechnicalErrorDetails(error)}`;
  }
  return message;
}

function safeTechnicalDetails(details: unknown) {
  if (!details || typeof details !== "object") return [] as string[];
  const value = details as Record<string, unknown>;
  const allowed = ['providerHttpStatus', 'providerCode', 'providerMessage', 'path', 'requiredEnv', 'missingEnv', 'requiredHeaders', 'signatureFormat', 'toleranceSeconds', 'reason', 'recipient', 'attachmentCount'];
  return allowed.flatMap((key) => {
    const item = value[key];
    if (item === undefined || item === null || item === "") return [];
    if (Array.isArray(item)) return [`${key}: ${item.join(", ")}`];
    if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") return [`${key}: ${String(item)}`];
    return [];
  });
}

export function getTechnicalErrorDetails(error: unknown) {
  if (!(error instanceof ApiError)) return "Code: UNKNOWN_ERROR";
  const diagnostics = error.diagnostics;
  const lines = [
    `Code: ${error.code}`,
    `HTTP status: ${error.status || "n/a"}`,
    ...safeTechnicalDetails(error.details),
    diagnostics?.requestId ? `Request-ID: ${diagnostics.requestId}` : undefined,
    diagnostics?.endpoint ? `Endpoint: ${diagnostics.endpoint}` : undefined,
    diagnostics?.timestamp ? `Time (UTC): ${diagnostics.timestamp}` : undefined,
  ].filter(Boolean);
  return lines.join(" · ");
}

const API_BASE_URL = (import.meta.env.VITE_API_URL?.trim() || "/api/v1").replace(/\/$/, "");
const API_REQUEST_MESSAGE = "lulu:api-request";
const API_RESPONSE_MESSAGE = "lulu:api-response";
const ACCESS_TOKEN_STORAGE_KEY = "lulu_access_token";

export function resolveApiMediaUrl(value: string | null | undefined) {
  const url = String(value ?? "").trim();
  if (!url) return null;
  if (/^(blob:|data:)/i.test(url)) return url;
  // Production media is served by the API hostname; the frontend hostname returns the SPA shell.
  const isProductionFrontend = ["lulu-ai.tech", "www.lulu-ai.tech"].includes(window.location.hostname);
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      if (isProductionFrontend && ["lulu-ai.tech", "www.lulu-ai.tech"].includes(parsed.hostname) && parsed.pathname.startsWith("/api/v1/")) {
        return new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, "https://api.lulu-ai.tech").toString();
      }
    } catch {
      return url;
    }
    return url;
  }
  const base = /^https?:\/\//i.test(API_BASE_URL)
    ? API_BASE_URL
    : isProductionFrontend
      ? "https://api.lulu-ai.tech/api/v1"
      : window.location.origin;
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}

function readStoredAccessToken() {
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    return window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    // Private browsing/storage restrictions must not break authentication.
    return null;
  }
}

function storeAccessToken(token: string | null) {
  accessToken = token;
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    if (token) window.sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    else window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    // Private browsing/storage restrictions must not break authentication.
  }
}

function clearClientSession() {
  storeAccessToken(null);
  try {
    window.localStorage.removeItem("lulu.current-user");
    window.sessionStorage.removeItem("lulu.current-user");
  } catch {
    // Private browsing/storage restrictions must not break authentication.
  }
}

// Logout must be able to clear the in-memory bearer token even when the
// server request fails. Otherwise a hard redirect can immediately restore the
// previous session and make the app appear to flash between routes.
export function clearAuthSession() {
  clearClientSession();
}

let accessToken: string | null = readStoredAccessToken();
type RefreshOutcome = { ok: true } | { ok: false; terminal: boolean };
let refreshPromise: Promise<RefreshOutcome> | null = null;

function createMessageId() {
  const cryptoApi = globalThis.crypto;
  if (typeof cryptoApi?.randomUUID === "function") return cryptoApi.randomUUID();

  const bytes = new Uint8Array(16);
  if (typeof cryptoApi?.getRandomValues === "function") {
    cryptoApi.getRandomValues(bytes);
    return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function validatedPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    throw new ApiError(400, "INVALID_API_PATH", "Invalid API path");
  }
  return path;
}

function captureSession(path: string, payload: unknown) {
  if (path === "/auth/logout" || path === "/auth/logout-all") {
    clearClientSession();
    return;
  }
  if (!payload || typeof payload !== "object") return;
  const data = (payload as { data?: unknown }).data;
  if (!data || typeof data !== "object") return;
  const token = (data as { token?: unknown }).token;
  if (typeof token === "string" && token) storeAccessToken(token);
}

async function executeRequest<T>(request: ApiRequest, allowRefresh = true, transientRetry = 0): Promise<ApiEnvelope<T>> {
  const path = validatedPath(request.path);
  const headers = new Headers({ accept: "application/json" });
  const isFormData = typeof FormData !== "undefined" && request.body instanceof FormData;
  if (request.body !== undefined && !isFormData) headers.set("content-type", "application/json");
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: request.method ?? "GET",
      headers,
      credentials: "include",
      body: request.body === undefined ? undefined : isFormData ? request.body as FormData : JSON.stringify(request.body),
      signal: request.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "NETWORK_ERROR", "The Lulu API is currently unreachable");
  }

  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | ApiErrorEnvelope | null;
  const method = request.method ?? "GET";
  if (method === "GET" && [502, 503, 504].includes(response.status) && transientRetry < 3) {
    await new Promise((resolve) => window.setTimeout(resolve, 500 * (2 ** transientRetry)));
    return executeRequest<T>(request, allowRefresh, transientRetry + 1);
  }
  if (response.status === 401 && allowRefresh && !/^\/auth\/(refresh|login|register|verify-otp|resend-otp|forgot-password|reset-password|logout)$/.test(path)) {
    const refreshed = await refreshSession();
    if (refreshed.ok) return executeRequest<T>(request, false);
    if (!refreshed.terminal) throw new ApiError(503, "SESSION_REFRESH_UNAVAILABLE", "The session could not be refreshed right now");
  }
  if (!response.ok || !payload || payload.success === false) {
    const error = payload && "error" in payload ? payload.error : undefined;
    if (response.status === 401 && (error?.code === "TOKEN_REVOKED" || error?.code === "INVALID_REFRESH_TOKEN" || error?.code === "REFRESH_TOKEN_EXPIRED" || error?.code === "MISSING_REFRESH_TOKEN")) {
      clearClientSession();
    }
    throw new ApiError(
      response.status,
      error?.code ?? "API_ERROR",
      error?.message ?? `API request failed (${response.status})`,
      error?.details,
      error?.diagnostics,
    );
  }
  captureSession(path, payload);
  return payload;
}

async function refreshSession(): Promise<RefreshOutcome> {
  const rotate = () => executeRequest<{ token: string }>(
    { path: "/auth/refresh", method: "POST", body: {} },
    false,
  );
  // The HttpOnly cookie is shared across tabs. Hold the lock through the response
  // so another tab rotates the replacement cookie, never its predecessor.
  refreshPromise ??= (typeof navigator !== 'undefined' && navigator.locks
    ? navigator.locks.request('lulu-session-refresh', rotate) : rotate()).then(() => ({ ok: true as const })).catch((error) => {
    const terminal = error instanceof ApiError && error.status === 401;
    if (terminal) clearClientSession();
    return { ok: false as const, terminal };
  }).finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

export async function requestApiBlob(path: string, signal?: AbortSignal, allowRefresh = true): Promise<Blob> {
  const validated = validatedPath(path);
  const headers = new Headers();
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${validated}`, { headers, credentials: "include", signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "NETWORK_ERROR", "The Lulu API is currently unreachable");
  }
  if (response.status === 401 && allowRefresh && validated !== "/auth/refresh") {
    const refreshed = await refreshSession();
    if (refreshed.ok) return requestApiBlob(validated, signal, false);
    if (!refreshed.terminal) throw new ApiError(503, "SESSION_REFRESH_UNAVAILABLE", "The session could not be refreshed right now");
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as ApiErrorEnvelope | null;
    const error = payload && "error" in payload ? payload.error : undefined;
    const diagnostics = error?.diagnostics ?? { requestId: response.headers.get("x-request-id") ?? undefined };
    throw new ApiError(response.status, error?.code ?? "API_ERROR", error?.message ?? `API request failed (${response.status})`, error?.details, diagnostics);
  }
  return response.blob();
}

type BrokerRequest = {
  type: typeof API_REQUEST_MESSAGE;
  id: string;
  request: Omit<ApiRequest, "signal">;
};

type BrokerResponse = {
  type: typeof API_RESPONSE_MESSAGE;
  id: string;
  result?: unknown;
  error?: { status: number; code: string; message: string; details?: unknown; diagnostics?: ApiDiagnostics };
};

function isBrokerRequest(value: unknown): value is BrokerRequest {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<BrokerRequest>;
  return message.type === API_REQUEST_MESSAGE
    && typeof message.id === "string"
    && !!message.request
    && typeof message.request.path === "string";
}

export function installApiBroker() {
  const listener = async (event: MessageEvent<unknown>) => {
    if (event.origin !== window.location.origin || !isBrokerRequest(event.data)) return;
    const source = event.source;
    if (!source || typeof source.postMessage !== "function") return;
    const response: BrokerResponse = { type: API_RESPONSE_MESSAGE, id: event.data.id };
    try {
      response.result = await executeRequest(event.data.request);
    } catch (error) {
      const apiError = error instanceof ApiError
        ? error
        : new ApiError(0, "UNKNOWN_ERROR", error instanceof Error ? error.message : "Unknown API error");
      response.error = {
        status: apiError.status,
        code: apiError.code,
        message: apiError.message,
        ...(apiError.details === undefined ? {} : { details: apiError.details }),
        ...(apiError.diagnostics === undefined ? {} : { diagnostics: apiError.diagnostics }),
      };
    }
    source.postMessage(response, { targetOrigin: event.origin });
  };
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}

export function requestApi<T>(request: ApiRequest): Promise<ApiEnvelope<T>> {
  if (window.parent === window) return executeRequest<T>(request);

  return new Promise((resolve, reject) => {
    const id = createMessageId();
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new ApiError(0, "API_TIMEOUT", "The Lulu API request timed out"));
    }, request.timeoutMs ?? 30_000);
    const listener = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const response = event.data as Partial<BrokerResponse> | null;
      if (!response || response.type !== API_RESPONSE_MESSAGE || response.id !== id) return;
      cleanup();
      if (response.error) {
        reject(new ApiError(response.error.status, response.error.code, response.error.message, response.error.details, response.error.diagnostics));
      } else {
        resolve(response.result as ApiEnvelope<T>);
      }
    };
    const onAbort = () => {
      cleanup();
      reject(new DOMException("The operation was aborted", "AbortError"));
    };
    const cleanup = () => {
      window.clearTimeout(timeout);
      window.removeEventListener("message", listener);
      request.signal?.removeEventListener("abort", onAbort);
    };
    window.addEventListener("message", listener);
    request.signal?.addEventListener("abort", onAbort, { once: true });
    const { signal: _signal, ...serializableRequest } = request;
    window.parent.postMessage({ type: API_REQUEST_MESSAGE, id, request: serializableRequest }, window.location.origin);
  });
}

export { API_BASE_URL };
export function getAccessToken() {
  return accessToken;
}
