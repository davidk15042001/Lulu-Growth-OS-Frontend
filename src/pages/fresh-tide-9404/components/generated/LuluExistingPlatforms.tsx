import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, CircleCheck, Globe, Store, Trash2, UsersRound, X } from "lucide-react";
import { navigateApp, routes } from '../../../../routing';
import { getFriendlyErrorMessage, getTechnicalErrorDetails, requestApi } from '../../../../api/client';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { getSelectedWorkspaceId } from '../../../../api/session';
import { onboardingApi } from '../../../../api/onboarding';
import { OnboardingHeader } from '../../../../components/OnboardingHeader';
interface Platform {
  id: string;
  integrationKey: string | null;
  name: string;
  type: string;
  connectionStatus: string;
  status: string;
}
interface PlatformGroup {
  id: string;
  label: string;
  description: string;
  icon: typeof UsersRound;
  platforms: string[];
  hidden?: boolean;
  comingSoon?: boolean;
  comingSoonPlatforms?: string[];
}
interface WhatsAppConnectionState {
  selfServiceAllowed: boolean;
  embeddedSignupConfigured: boolean;
  embeddedSignup: { appId: string; configurationId: string; partnerSolutionId: string; graphVersion: string } | null;
  customerConnection: { address: string; displayName: string; senderStatus: string; status: string; lastError: string | null } | null;
  adminFallback: { configured: boolean; address: string | null; displayName: string | null; status: string };
  effectiveMode: 'CUSTOMER_OWNED' | 'LULU_MANAGED';
}

type FacebookLoginResponse = { status?: string };
type FacebookSdk = {
  init: (options: { appId: string; autoLogAppEvents: boolean; xfbml: boolean; version: string }) => void;
  login: (callback: (response: FacebookLoginResponse) => void, options: Record<string, unknown>) => void;
};

declare global {
  interface Window { FB?: FacebookSdk; fbAsyncInit?: () => void; }
}
const platformGroups: PlatformGroup[] = [
  { id: 'crm', label: 'CRM & Sales', description: 'Connect customer, pipeline and sales systems that contain your business relationships.', icon: UsersRound, platforms: ['Salesforce', 'HubSpot', 'Pipedrive'], hidden: true },
  { id: 'website', label: 'Website & Publishing', description: 'Connect the website platforms Lulu can use for content, publishing and website intelligence.', icon: Globe, platforms: ['WordPress', 'Webflow'] },
  { id: 'commerce', label: 'Commerce', description: 'Connect commerce platforms to analyze products, orders and customer activity.', icon: Store, platforms: ['Shopify'] },
  { id: 'social', label: 'Social & Messaging', description: 'WhatsApp and Facebook Messenger run through Lulu’s managed Twilio transport. Instagram and LinkedIn remain direct account connections.', icon: UsersRound, platforms: ['WhatsApp', 'Facebook Messenger', 'Instagram', 'LinkedIn'] },
];
const providerKeysByName: Record<string, string> = {
  Salesforce: 'salesforce', Pipedrive: 'pipedrive', HubSpot: 'hubspot',
  Webflow: 'webflow', WordPress: 'wordpress', Shopify: 'shopify',
  WhatsApp: 'whatsapp', 'Facebook Messenger': 'twilio', Instagram: 'instagram', LinkedIn: 'linkedin',
};
  const guideContent: Record<string, { intro: string; steps: string[]; links?: Array<{ label: string; url: string }> }> = {
    Salesforce: { intro: "Connect a Salesforce organization through a Connected App. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/salesforce/callback", steps: ["Open Salesforce Setup → App Manager → New Connected App.", "Enable OAuth Settings and add the callback URL shown above.", "Add the `api`, `refresh_token` and `offline_access` scopes, then save.", "Wait for Salesforce to activate the app, return here and click Connect.", "Approve Lulu in Salesforce and choose the organization you want to connect."], links: [{ label: "Open Salesforce Developer Portal", url: "https://developer.salesforce.com/" }] },
    Pipedrive: { intro: "Connect the Pipedrive account that contains your sales pipeline. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/pipedrive/callback", steps: ["Open the Pipedrive Developer Hub and create an OAuth app.", "Enter the callback URL shown above as the app redirect URL.", "Copy the Client ID and Client Secret to the backend environment; never put them in the browser.", "Click Connect here and approve the requested `base` access in Pipedrive."], links: [{ label: "Open Pipedrive Developer Hub", url: "https://developers.pipedrive.com/" }] },
    HubSpot: { intro: "Connect one HubSpot portal with OAuth. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/hubspot/callback", steps: ["Open your HubSpot developer account and create a public app.", "In Auth settings, add the callback URL shown above.", "Add `oauth` and `crm.objects.contacts.read` to the required scopes.", "Have a HubSpot Super Admin install the app, then click Connect here.", "Select the portal and approve the requested permissions."], links: [{ label: "Open HubSpot Developer Account", url: "https://developers.hubspot.com/" }] },
    Webflow: { intro: "Connect a Webflow workspace or site. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/webflow/callback", steps: ["Open Webflow Developers and create a Data Client app.", "Set the callback URL shown above in the app settings.", "Enable the `sites:read` scope and copy the client credentials to the Lulu backend.", "Make sure you are a Webflow workspace administrator.", "Click Connect here and authorize the Webflow app."], links: [{ label: "Open Webflow Developers", url: "https://developers.webflow.com/" }, { label: "Read Webflow OAuth Guide", url: "https://developers.webflow.com/data/reference/oauth-app" }] },
    WordPress: { intro: "Connect a WordPress.com or Jetpack account. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/wordpress/callback", steps: ["Open the WordPress.com Developer Portal and create an OAuth application.", "Add the callback URL shown above and copy the Client ID and Client Secret to the backend.", "Confirm that the account can access the intended WordPress.com or Jetpack site.", "Click Connect here and approve the WordPress authorization."], links: [{ label: "Open WordPress Developer Portal", url: "https://developer.wordpress.com/apps/" }, { label: "Read WordPress OAuth2 Guide", url: "https://developer.wordpress.com/docs/api/oauth2/" }] },
    Shopify: { intro: "Connect a Shopify store using its myshopify.com domain. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/shopify/callback", steps: ["Open the Shopify Dev Dashboard and create or select the app.", "Configure the Admin API scopes `read_products` and `read_content` and add the callback URL shown above.", "Copy your store domain in the exact format `example.myshopify.com`.", "Click Connect here, enter the store domain, and approve the app installation."], links: [{ label: "Open Shopify Dev Dashboard", url: "https://dev.shopify.com/dashboard" }, { label: "Read Shopify OAuth Guide", url: "https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant" }] },
    WhatsApp: { intro: "Lulu uses its centrally managed WhatsApp sender by default. If your administrator enables a private connection, you can onboard your own WhatsApp Business number securely through Meta and Twilio.", steps: ["No setup is required while the Lulu-managed sender is active.", "If needed, ask an administrator to enable WhatsApp self-service for this workspace.", "Click Connect, enter your WhatsApp Business number and display name, then complete Meta Embedded Signup.", "Lulu creates an isolated Twilio subaccount, registers the sender and routes messages into the autonomous OmniChannel workflow."] },
    'Facebook Messenger': { intro: "Lulu uses Twilio’s Facebook Messenger channel for the approved Facebook Page.", steps: ["Connect the intended Facebook Page in the Twilio Console.", "Complete any provider review or public-beta access requirements.", "Lulu registers the Messenger sender against this workspace.", "Verify one inbound and outbound message before production traffic is enabled."] },
    Instagram: { intro: "Connect your own Instagram professional account after an administrator has enabled OAuth self-service for this workspace.", steps: ["Ask a Lulu administrator to enable Instagram for your workspace.", "Make sure the Instagram professional account is linked to the correct Meta business.", "Click Connect, choose the account and approve the requested permissions.", "Return to Lulu and confirm that the account is shown as connected."] },
    LinkedIn: { intro: "Connect your own LinkedIn account after an administrator has enabled OAuth self-service for this workspace.", steps: ["Ask a Lulu administrator to enable LinkedIn for your workspace.", "Click Connect and sign in with the LinkedIn account that manages the intended organization or campaigns.", "Approve the requested permissions.", "Return to Lulu and confirm that the account is shown as connected."] },
  };

let facebookSdkPromise: Promise<FacebookSdk> | null = null;
function loadFacebookSdk(appId: string, graphVersion: string) {
  if (window.FB) {
    window.FB.init({ appId, autoLogAppEvents: true, xfbml: false, version: graphVersion });
    return Promise.resolve(window.FB);
  }
  if (facebookSdkPromise) return facebookSdkPromise;
  facebookSdkPromise = new Promise<FacebookSdk>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      facebookSdkPromise = null;
      reject(new Error('Meta Embedded Signup could not be loaded.'));
    }, 15_000);
    window.fbAsyncInit = () => {
      if (!window.FB) return;
      window.clearTimeout(timeout);
      window.FB.init({ appId, autoLogAppEvents: true, xfbml: false, version: graphVersion });
      resolve(window.FB);
    };
    const existing = document.getElementById('facebook-jssdk');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.onerror = () => {
        window.clearTimeout(timeout);
        facebookSdkPromise = null;
        reject(new Error('Meta Embedded Signup could not be loaded.'));
      };
      document.body.appendChild(script);
    }
  });
  return facebookSdkPromise;
}

function isTrustedFacebookEventOrigin(origin: string) {
  try {
    const url = new URL(origin);
    return url.protocol === 'https:' && (url.hostname === 'facebook.com' || url.hostname.endsWith('.facebook.com'));
  } catch {
    return false;
  }
}

export const LuluExistingPlatforms = () => {
  const { updateWorkspace, can } = useLuluApp();
  const canEdit = can('edit');
  const isOnboarding = window.location.pathname.startsWith("/onboarding/");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [allowedSelfServiceProviders, setAllowedSelfServiceProviders] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [technicalDetails, setTechnicalDetails] = useState('');
  const [guidePlatform, setGuidePlatform] = useState<string | null>(null);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [whatsappConnection, setWhatsappConnection] = useState<WhatsAppConnectionState | null>(null);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [whatsappPhoneNumber, setWhatsappPhoneNumber] = useState('');
  const [whatsappDisplayName, setWhatsappDisplayName] = useState('');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('oauthError');
    const oauthCode = params.get('oauthCode');
    const oauthRequestId = params.get('oauthRequestId');
    if (oauthError) {
      setError(oauthError);
      setTechnicalDetails([oauthCode ? `Code: ${oauthCode}` : '', oauthRequestId ? `Request-ID: ${oauthRequestId}` : ''].filter(Boolean).join(' · '));
    }
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    Promise.all([
      requestApi<{ platforms: Array<{ id: string; integrationKey: string | null; name: string; category: string; connectionStatus: string }> }>({ path: `/workspaces/${workspaceId}/onboarding` }),
      onboardingApi.oauthSelfServicePermissions(workspaceId),
      onboardingApi.whatsappConnection(workspaceId),
    ])
      .then(([response, permissionResponse, whatsappResponse]) => {
        setAllowedSelfServiceProviders(permissionResponse.data.providers);
        setWhatsappConnection(whatsappResponse.data);
        setPlatforms(response.data.platforms.map(platform => ({
        id: platform.id,
        integrationKey: platform.integrationKey,
        name: platform.name,
        type: platform.category,
        connectionStatus: platform.connectionStatus,
        status: platform.connectionStatus === 'connected' ? 'Connected' : platform.connectionStatus === 'error' ? 'Needs review' : platform.connectionStatus === 'disconnected' ? 'Disconnected' : 'Pending',
        })));
      })
      .catch(cause => {
        setError(getFriendlyErrorMessage(cause, 'We could not load your platforms. Please try again.'));
        setTechnicalDetails(getTechnicalErrorDetails(cause));
      });
  }, []);
  const openWhatsAppSignup = () => {
    if (!whatsappConnection?.selfServiceAllowed) {
      setError('Your Lulu administrator has not enabled a private WhatsApp connection for this workspace. The Lulu-managed number remains active.');
      return;
    }
    if (!whatsappConnection.embeddedSignupConfigured || !whatsappConnection.embeddedSignup) {
      setError('WhatsApp self-service is enabled for this workspace, but Lulu is still awaiting Meta Tech Provider activation. The Lulu-managed number remains active.');
      return;
    }
    setError('');
    setTechnicalDetails('');
    setWhatsappPhoneNumber(whatsappConnection.customerConnection?.address.replace(/^whatsapp:/, '') ?? '');
    setWhatsappDisplayName(whatsappConnection.customerConnection?.displayName ?? '');
    setWhatsappDialogOpen(true);
  };
  const launchWhatsAppEmbeddedSignup = async () => {
    const workspaceId = getSelectedWorkspaceId();
    const configuration = whatsappConnection?.embeddedSignup;
    if (!workspaceId || !configuration || connectingPlatform) return;
    const phoneNumber = whatsappPhoneNumber.trim();
    const displayName = whatsappDisplayName.trim();
    if (!/^\+[1-9][0-9]{6,14}$/.test(phoneNumber.replace(/[\s().-]/g, ''))) {
      setError('Enter the WhatsApp number in international format, for example +491701234567.');
      return;
    }
    if (!displayName) {
      setError('Enter the WhatsApp Business display name customers should see.');
      return;
    }
    setConnectingPlatform('WhatsApp');
    setError('');
    setTechnicalDetails('');
    let listener: ((event: MessageEvent) => void) | null = null;
    try {
      const sdk = await loadFacebookSdk(configuration.appId, configuration.graphVersion);
      const session = new Promise<{ wabaId: string; phoneNumberId: string }>((resolve, reject) => {
        const timeout = window.setTimeout(() => reject(new Error('Meta Embedded Signup timed out. Please try again.')), 10 * 60_000);
        listener = (event: MessageEvent) => {
          if (!isTrustedFacebookEventOrigin(event.origin)) return;
          try {
            const value = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            if (!value || value.type !== 'WA_EMBEDDED_SIGNUP') return;
            if (value.event === 'FINISH') {
              const wabaId = String(value.data?.waba_id ?? '');
              const phoneNumberId = String(value.data?.phone_number_id ?? '');
              if (!/^\d{5,100}$/.test(wabaId) || !/^\d{5,100}$/.test(phoneNumberId)) {
                throw new Error('Meta returned incomplete WhatsApp account information.');
              }
              window.clearTimeout(timeout);
              resolve({ wabaId, phoneNumberId });
            } else if (value.event === 'CANCEL') {
              window.clearTimeout(timeout);
              reject(new Error('WhatsApp connection was cancelled.'));
            } else if (value.event === 'ERROR') {
              window.clearTimeout(timeout);
              reject(new Error(typeof value.data?.error_message === 'string' ? value.data.error_message : 'Meta could not complete WhatsApp signup.'));
            }
          } catch (cause) {
            window.clearTimeout(timeout);
            reject(cause instanceof Error ? cause : new Error('Meta returned an invalid WhatsApp signup response.'));
          }
        };
        window.addEventListener('message', listener);
        sdk.login(() => undefined, {
          config_id: configuration.configurationId,
          auth_type: 'rerequest',
          response_type: 'code',
          override_default_response_type: true,
          extras: { setup: { solutionID: configuration.partnerSolutionId } },
        });
      });
      const completed = await session;
      const response = await onboardingApi.completeWhatsAppEmbeddedSignup(workspaceId, { phoneNumber, displayName, ...completed });
      setWhatsappConnection(response.data as WhatsAppConnectionState);
      const snapshot = await requestApi<{ platforms: Array<{ id: string; integrationKey: string | null; name: string; category: string; connectionStatus: string }> }>({ path: `/workspaces/${workspaceId}/onboarding` });
      setPlatforms(snapshot.data.platforms.map(platform => ({
        id: platform.id,
        integrationKey: platform.integrationKey,
        name: platform.name,
        type: platform.category,
        connectionStatus: platform.connectionStatus,
        status: platform.connectionStatus === 'connected' ? 'Connected' : platform.connectionStatus === 'error' ? 'Needs review' : 'Pending',
      })));
      setWhatsappDialogOpen(false);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'We could not connect this WhatsApp Business number.'));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
    } finally {
      if (listener) window.removeEventListener('message', listener);
      setConnectingPlatform(null);
    }
  };
  const connectPlatform = async (name: string) => {
    if (!canEdit) return;
    if (name === 'WhatsApp') {
      openWhatsAppSignup();
      return;
    }
    const workspaceId = getSelectedWorkspaceId();
    const provider = providerKeysByName[name];
    if (!workspaceId || platforms.some(platform => (platform.integrationKey === provider || platform.name === name) && platform.connectionStatus === 'connected')) return;
    if (!provider) {
      setError(`${name} connection is not configured yet.`);
      return;
    }
    setError('');
    setTechnicalDetails('');
    setConnectingPlatform(name);
    try {
      const shop = provider === 'shopify' ? window.prompt('Enter your Shopify shop domain (example.myshopify.com)')?.trim() : undefined;
      if (provider === 'shopify' && !shop) {
        setConnectingPlatform(null);
        return;
      }
      const returnTo = `${window.location.pathname}${window.location.search}`;
      const response = await onboardingApi.startOAuth(workspaceId, provider, shop, returnTo);
      if (!response.data?.authorizationUrl) throw new Error('The provider authorization URL was not returned by the backend.');
      window.location.assign(response.data.authorizationUrl);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'We could not start this connection. Please try again.'));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
      setConnectingPlatform(null);
    }
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isOnboarding || !canEdit) return;
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    setError('');
    setTechnicalDetails('');
    try {
      const response = await onboardingApi.continueExistingPlatforms(workspaceId);
      updateWorkspace(response.data);
      navigateApp(routes.app.dashboard);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'We could not save this onboarding step. Please try again.'));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
    }
  };
  const removePlatform = async (id: string) => {
    if (!canEdit) return;
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    try {
      const platform = platforms.find(item => item.id === id);
      if (platform?.integrationKey === 'whatsapp') {
        await onboardingApi.disconnectWhatsApp(workspaceId);
        const state = await onboardingApi.whatsappConnection(workspaceId);
        setWhatsappConnection(state.data);
        setPlatforms(current => current.filter(item => item.id !== id));
        return;
      }
      await requestApi({ path: `/workspaces/${workspaceId}/onboarding/platforms/${id}`, method: 'DELETE' });
      setPlatforms(current => current.filter(item => item.id !== id));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'We could not remove this platform. Please try again.'));
    }
  };
  const guideIsManagedMessaging = guidePlatform === 'Facebook Messenger' || (guidePlatform === 'WhatsApp' && !whatsappConnection?.selfServiceAllowed);
  return <main className="min-h-screen bg-[var(--background)] font-['Poppins',sans-serif] text-[var(--foreground)]">
      <section className="flex items-center justify-center p-6 py-10 sm:p-8 lg:p-12">
        <div className="w-full max-w-3xl">
          {isOnboarding && <OnboardingHeader step={3} />}
          {isOnboarding && <p className="mt-10 text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
            03 / 04 · Company profile
          </p>}
          <form onSubmit={submit} className="mt-8 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:p-6 lg:p-7">
            {error && <div role="alert" className="space-y-2 rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-4 py-3 text-sm leading-6 text-[var(--destructive)]"><p className="font-medium text-[var(--destructive)]">{error}</p>{technicalDetails && <details><summary className="cursor-pointer text-xs font-semibold text-[var(--destructive)]">Show technical details</summary><p className="mt-2 break-words font-mono text-[11px] leading-5 text-[var(--destructive)]">{technicalDetails}</p></details>}</div>}
            <div className="space-y-5">
              {platformGroups.filter(group => !group.hidden).map(group => {
              const Icon = group.icon;
              const groupPlatforms = group.platforms;
              const comingSoon = group.comingSoon === true;
              return <section key={group.id} className={`rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/35 p-4 shadow-sm sm:p-5 ${comingSoon ? 'opacity-70' : ''}`} aria-labelledby={`${group.id}-heading`} aria-disabled={comingSoon}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 id={`${group.id}-heading`} className="text-base font-semibold tracking-tight text-[var(--foreground)]">{group.label}{comingSoon && <span className="ml-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Unavailable</span>}</h2>
                      <p className="mt-1 max-w-xl text-xs leading-5 text-[var(--muted-foreground)]">{group.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted-foreground)]">{groupPlatforms.length}</span>
                  </div>
                  <div className={`mt-5 grid gap-3 md:grid-cols-2 ${comingSoon ? 'pointer-events-none' : ''}`}>
                    {groupPlatforms.map(name => {
                    const provider = providerKeysByName[name];
                    const existing = platforms.find(platform => platform.integrationKey === provider || platform.name === name);
                    const connected = existing?.connectionStatus === 'connected' ? existing : undefined;
                    const isWhatsApp = name === 'WhatsApp';
                    const luluManagedMessaging = name === 'Facebook Messenger' || (isWhatsApp && !whatsappConnection?.selfServiceAllowed);
                    const needsAdminApproval = ['whatsapp', 'instagram', 'linkedin'].includes(provider);
                    const blockedByAdmin = needsAdminApproval && !allowedSelfServiceProviders.includes(provider);
                    const platformComingSoon = comingSoon || group.comingSoonPlatforms?.includes(name) === true;
                    return <article key={name} className={`grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:border-[var(--primary)]/45 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] [grid-template-columns:auto_minmax(0,1fr)] ${platformComingSoon ? 'opacity-65' : ''}`}>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--secondary)] text-[var(--foreground)]">
                          {connected ? <CircleCheck size={16} /> : <Icon size={15} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className="block text-sm font-semibold text-[var(--foreground)]">{name}{platformComingSoon && <span className="ml-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Unavailable</span>}</strong>
                          <span className="mt-0.5 block text-xs text-[var(--muted-foreground)]">{connected ? connected.status : isWhatsApp && whatsappConnection?.effectiveMode === 'LULU_MANAGED' ? (whatsappConnection.adminFallback.configured ? "Using Lulu’s WhatsApp number" : "Lulu sender awaiting activation") : luluManagedMessaging ? "Lulu-managed via Twilio" : blockedByAdmin ? "Provider access restricted" : existing?.status ?? "Not connected"}</span>
                        </span>
                        <div className={`col-span-2 flex w-full items-center gap-2 border-t border-[var(--border)] pt-3 ${platformComingSoon ? 'pointer-events-none' : ''}`}>{connected ? <button type="button" onClick={() => void removePlatform(connected.id)} disabled={!canEdit} aria-disabled={!canEdit} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-2 text-xs font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--destructive)] hover:text-[var(--destructive)] disabled:cursor-not-allowed disabled:opacity-50" aria-label={`Remove ${name}`}><Trash2 size={13} />Remove</button> : <button type="button" onClick={() => void connectPlatform(name)} disabled={luluManagedMessaging || platformComingSoon || blockedByAdmin || connectingPlatform === name || !canEdit} aria-disabled={luluManagedMessaging || platformComingSoon || blockedByAdmin || !canEdit} className="flex-1 rounded-lg bg-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)] transition hover:-translate-y-0.5 hover:opacity-90 sm:flex-none">{isWhatsApp && blockedByAdmin ? "Admin number" : luluManagedMessaging ? "Managed" : platformComingSoon ? "Unavailable" : blockedByAdmin ? "Restricted" : connectingPlatform === name ? "Opening…" : "Connect"}</button>}<button type="button" onClick={() => setGuidePlatform(name)} disabled={platformComingSoon} className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] transition hover:-translate-y-0.5 hover:border-[var(--foreground)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">{platformComingSoon ? "Unavailable" : "Guide"}</button></div>
                      </article>;
                  })}
                  </div>
                </section>;
              })}
            </div>
            {isOnboarding && <button type="submit" disabled={!canEdit} aria-disabled={!canEdit} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50">
              
              Continue
              <ArrowRight size={16} />
            </button>}
          </form>
        </div>
      </section>

      {whatsappDialogOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="whatsapp-connect-title" onClick={() => { if (!connectingPlatform) setWhatsappDialogOpen(false); }}>
        <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl" onClick={event => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--muted-foreground)]">Private workspace sender</p>
              <h2 id="whatsapp-connect-title" className="mt-2 text-2xl font-semibold text-[var(--foreground)]">Connect WhatsApp Business</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">Your number will be isolated in a dedicated Twilio subaccount. Until it is online, Lulu continues using the centrally managed sender.</p>
            </div>
            <button type="button" onClick={() => setWhatsappDialogOpen(false)} disabled={Boolean(connectingPlatform)} className="rounded-md p-2 text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)] disabled:opacity-50" aria-label="Close WhatsApp connection"><X size={18} /></button>
          </div>
          <div className="mt-6 space-y-4">
            {error && <div role="alert" className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-4 py-3 text-sm leading-6 text-[var(--destructive)]">{error}</div>}
            <label className="block text-sm font-medium text-[var(--foreground)]">WhatsApp phone number
              <input value={whatsappPhoneNumber} onChange={event => setWhatsappPhoneNumber(event.target.value)} disabled={Boolean(connectingPlatform)} placeholder="+491701234567" autoComplete="tel" inputMode="tel" className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)] disabled:opacity-60" />
            </label>
            <label className="block text-sm font-medium text-[var(--foreground)]">WhatsApp Business display name
              <input value={whatsappDisplayName} onChange={event => setWhatsappDisplayName(event.target.value)} disabled={Boolean(connectingPlatform)} placeholder="Your company name" autoComplete="organization" maxLength={160} className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)] disabled:opacity-60" />
            </label>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setWhatsappDialogOpen(false)} disabled={Boolean(connectingPlatform)} className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--muted-foreground)] disabled:opacity-50">Cancel</button>
            <button type="button" onClick={() => void launchWhatsAppEmbeddedSignup()} disabled={Boolean(connectingPlatform)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">{connectingPlatform === 'WhatsApp' ? 'Connecting…' : 'Continue with Meta'}<ArrowRight size={15} /></button>
          </div>
        </div>
      </div>}

      {guidePlatform && guideContent[guidePlatform] && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="platform-guide-title" onClick={() => setGuidePlatform(null)}>
        <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl" onClick={event => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--muted-foreground)]">Step-by-step guide</p>
              <h2 id="platform-guide-title" className="mt-2 text-2xl font-semibold text-[var(--foreground)]">Connect {guidePlatform}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{guideContent[guidePlatform].intro}</p>
            </div>
            <button type="button" onClick={() => setGuidePlatform(null)} className="rounded-md p-2 text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)]" aria-label="Close guide"><X size={18} /></button>
          </div>
          {guideContent[guidePlatform].links && <div className="mt-5 flex flex-wrap gap-2">{guideContent[guidePlatform].links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--primary)] hover:text-[var(--foreground)]">{link.label}</a>)}</div>}
          <ol className="mt-6 space-y-4">
            {guideContent[guidePlatform].steps.map((step, index) => <li key={step} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--primary-foreground)]">{index + 1}</span>
              <span className="pt-0.5 text-sm leading-6 text-[var(--foreground)]">{step}</span>
            </li>)}
          </ol>
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={() => { setGuidePlatform(null); if (!guideIsManagedMessaging) void connectPlatform(guidePlatform); }} disabled={!guideIsManagedMessaging && !canEdit} aria-disabled={!guideIsManagedMessaging && !canEdit} className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{guideIsManagedMessaging ? 'Close' : `Connect ${guidePlatform}`}{!guideIsManagedMessaging && <ArrowRight size={15} />}</button>
          </div>
        </div>
      </div>}
    </main>;
};
