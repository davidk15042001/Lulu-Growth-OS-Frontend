# Google Business Profile OAuth findings

## Official sources

- [Implement OAuth with Business Profile APIs](https://developers.google.com/my-business/content/implement-oauth)
- [Basic setup](https://developers.google.com/my-business/content/basic-setup)
- [Applying for Google Business Profile API access](https://support.google.com/business/workflow/16726127?hl=en)

## Key requirements

Google Business Profile APIs require OAuth 2.0 authorization for protected business data. The official documentation identifies `https://www.googleapis.com/auth/business.manage` as the current OAuth scope. Before API calls work, the Google Cloud project must have the Business Profile APIs enabled and the project may need approval/access through Google's request process. The official setup documentation lists the associated APIs, including Account Management and Business Information APIs, and notes that there is no sandbox environment.

The customer-facing flow should remain central-app OAuth: Lulu owns the Google OAuth client ID and secret in the backend; customers authorize their own Google account and do not enter client credentials. The callback URL for this project should be `https://lulu-ai.cn/api/v1/onboarding/oauth/google-business/callback`.

## Implementation implication

Google Business should be a separate OAuth provider from Google Ads and Google Analytics because it needs the `business.manage` scope and separate provider/account identity handling, even though it can use the same Google Cloud OAuth client if that client is configured with the required scope and verified appropriately.

## Caveat

Adding the UI and OAuth start route does not by itself guarantee live API access. Google's Business Profile API access approval and API enablement must be completed centrally before customer connections can successfully read business profiles.

Captured: 2026-08-16
