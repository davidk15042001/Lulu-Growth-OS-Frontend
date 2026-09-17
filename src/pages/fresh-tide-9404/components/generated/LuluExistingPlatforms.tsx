import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, CircleCheck, Globe, Store, Trash2, UsersRound, X } from "lucide-react";
import { navigateApp, routes } from '../../../../routing';
import { getFriendlyErrorMessage, getTechnicalErrorDetails, requestApi } from '../../../../api/client';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { getSelectedWorkspaceId } from '../../../../api/session';
import { onboardingApi } from '../../../../api/onboarding';
import { providerControlApi, type ProviderLaunchReadiness } from '../../../../api/providers';
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
  provider: "unifyport";
  selfServiceAllowed: boolean;
  customerConnection: { address: string; displayName: string; senderStatus: string; status: string; lastError: string | null } | null;
  pendingConnection?: { accountId: string; authStatus: string; runtimeStatus: string; authPayload: Record<string, unknown> | null; lastError: string | null; phone: string | null } | null;
  adminFallback: { configured: boolean; address: string | null; displayName: string | null; status: string; provider: "unifyport" };
  effectiveMode: 'CUSTOMER_OWNED' | 'LULU_MANAGED';
}
const platformGroups: PlatformGroup[] = [
  { id: 'crm', label: 'CRM & Sales', description: 'Connect customer, pipeline and sales systems that contain your business relationships.', icon: UsersRound, platforms: ['Salesforce', 'HubSpot', 'Pipedrive'], hidden: true },
  { id: 'website', label: 'Website & Publishing', description: 'Connect the website platforms Lulu can use for content, publishing and website intelligence.', icon: Globe, platforms: ['WordPress', 'Webflow'] },
  { id: 'commerce', label: 'Commerce', description: 'Connect commerce platforms to analyze products, orders and customer activity.', icon: Store, platforms: ['Shopify'] },
  { id: 'social', label: 'Social & Messaging', description: 'WhatsApp uses UnifyPort. If an administrator enables self-service, each workspace can securely pair its own number; otherwise the approved Lulu fallback is used.', icon: UsersRound, platforms: ['WhatsApp', 'Facebook Messenger', 'Instagram', 'LinkedIn'] },
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
    WhatsApp: { intro: "WhatsApp is connected through UnifyPort. Your administrator decides whether this workspace uses the shared Lulu sender or pairs its own WhatsApp number.", steps: ["No Meta or Twilio setup is required in this workspace.", "If self-service is enabled, click Connect and enter the workspace phone number.", "Open WhatsApp → Linked devices → Link with phone number and enter the UnifyPort pairing code.", "After authorization, Lulu registers the customer-owned sender in OmniChannel automatically."] },
    'Facebook Messenger': { intro: "Lulu uses Twilio’s Facebook Messenger channel for the approved Facebook Page.", steps: ["Connect the intended Facebook Page in the Twilio Console.", "Complete any provider review or public-beta access requirements.", "Lulu registers the Messenger sender against this workspace.", "Verify one inbound and outbound message before production traffic is enabled."] },
    Instagram: { intro: "Connect your own Instagram professional account after an administrator has enabled OAuth self-service for this workspace.", steps: ["Ask a Lulu administrator to enable Instagram for your workspace.", "Make sure the Instagram professional account is linked to the correct Meta business.", "Click Connect, choose the account and approve the requested permissions.", "Return to Lulu and confirm that the account is shown as connected."] },
    LinkedIn: { intro: "Connect your own LinkedIn account after an administrator has enabled OAuth self-service for this workspace.", steps: ["Ask a Lulu administrator to enable LinkedIn for your workspace.", "Click Connect and sign in with the LinkedIn account that manages the intended organization or campaigns.", "Approve the requested permissions.", "Return to Lulu and confirm that the account is shown as connected."] },
  };

export const LuluExistingPlatforms = () => {
  const { updateWorkspace, can } = useLuluApp();
  const canEdit = can('edit');
  const isOnboarding = window.location.pathname.startsWith("/onboarding/");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [error, setError] = useState('');
  const [technicalDetails, setTechnicalDetails] = useState('');
  const [guidePlatform, setGuidePlatform] = useState<string | null>(null);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [whatsappConnection, setWhatsappConnection] = useState<WhatsAppConnectionState | null>(null);
  const [whatsappSetupOpen, setWhatsappSetupOpen] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappDisplayName, setWhatsappDisplayName] = useState('');
  const [whatsappBusy, setWhatsappBusy] = useState(false);
  const [providerReadiness, setProviderReadiness] = useState<ProviderLaunchReadiness | null>(null);
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
      onboardingApi.whatsappConnection(workspaceId).catch(() => null),
      providerControlApi.launchReadiness(workspaceId).catch(() => null),
    ])
      .then(([response, whatsappResponse, readinessResponse]) => {
        setWhatsappConnection(whatsappResponse?.data ?? null);
        setProviderReadiness(readinessResponse?.data ?? null);
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
  useEffect(() => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    let active = true;
    let requestRunning = false;
    const refresh = async () => {
      if (requestRunning) return;
      requestRunning = true;
      try {
        const response = await onboardingApi.whatsappConnection(workspaceId);
        if (active) setWhatsappConnection(response.data);
      } catch {
        // The initial page load owns visible errors; background refreshes stay quiet.
      } finally {
        requestRunning = false;
      }
    };
    const timer = window.setInterval(() => { void refresh(); }, 5_000);
    window.addEventListener('focus', refresh);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  const openWhatsAppGuide = () => setGuidePlatform('WhatsApp');
  const beginWhatsApp = async () => {
    if (!canEdit || !whatsappPhone.trim()) return;
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    setWhatsappBusy(true); setError('');
    try {
      const response = await onboardingApi.connectWhatsApp(workspaceId, { phone: whatsappPhone.trim(), ...(whatsappDisplayName.trim() ? { displayName: whatsappDisplayName.trim() } : {}) });
      setWhatsappConnection(response.data.connection);
      setWhatsappSetupOpen(true);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, 'The WhatsApp pairing flow could not be started.')); setTechnicalDetails(getTechnicalErrorDetails(cause)); }
    finally { setWhatsappBusy(false); }
  };
  const connectPlatform = async (name: string) => {
    if (!canEdit) return;
    if (name === 'WhatsApp') {
      if (whatsappConnection?.selfServiceAllowed) setWhatsappSetupOpen(true);
      else openWhatsAppGuide();
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
      if (platform?.integrationKey === 'whatsapp') return;
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
            {providerReadiness && <section className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/35 p-4 sm:p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--muted-foreground)]">Production readiness</p><h2 className="mt-2 text-base font-semibold">Provider Control Plane</h2><p className="mt-1 max-w-xl text-xs leading-5 text-[var(--muted-foreground)]">Autonomous work is allowed only when every provider gate is ready.</p></div><span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${providerReadiness.overallReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{providerReadiness.overallReady ? 'Ready' : `${providerReadiness.readyCount}/${providerReadiness.totalConnections}`}</span></div>{!providerReadiness.overallReady && <div className="mt-4 space-y-2">{providerReadiness.connections.filter(connection => !connection.ready).map(connection => <article key={connection.connectionId} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-semibold">{connection.displayName}</p><p className="text-[11px] text-[var(--muted-foreground)]">{connection.providerKey}</p></div><span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-700">Readiness check</span></div><ul className="mt-2 space-y-1 text-xs leading-5 text-[var(--muted-foreground)]">{connection.blockers.map(blocker => <li key={`${connection.connectionId}-${blocker.code}`}>{blocker.message}</li>)}</ul></article>)}</div>}</section>}
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
                    const isWhatsApp = name === 'WhatsApp';
                    const existing = platforms.find(platform => platform.integrationKey === provider || platform.name === name);
                    const connected = !isWhatsApp && existing?.connectionStatus === 'connected' ? existing : undefined;
                    const whatsappSelfServiceAllowed = isWhatsApp && whatsappConnection?.selfServiceAllowed === true;
                    const whatsappCustomerConnected = isWhatsApp && Boolean(whatsappConnection?.customerConnection);
                    const luluManagedMessaging = name === 'Facebook Messenger' || (isWhatsApp && !whatsappSelfServiceAllowed);
                    const needsAdminApproval = ['whatsapp', 'instagram', 'linkedin'].includes(provider);
                    const blockedByAdmin = needsAdminApproval && name !== 'WhatsApp';
                    const platformComingSoon = comingSoon || group.comingSoonPlatforms?.includes(name) === true;
                    return <article key={name} className={`grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:border-[var(--primary)]/45 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] [grid-template-columns:auto_minmax(0,1fr)] ${platformComingSoon ? 'opacity-65' : ''}`}>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--secondary)] text-[var(--foreground)]">
                          {connected ? <CircleCheck size={16} /> : <Icon size={15} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className="block text-sm font-semibold text-[var(--foreground)]">{name}{platformComingSoon && <span className="ml-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Unavailable</span>}</strong>
                          <span className="mt-0.5 block text-xs text-[var(--muted-foreground)]">{connected ? connected.status : whatsappCustomerConnected ? `Connected · ${whatsappConnection?.customerConnection?.displayName ?? 'WhatsApp'}` : isWhatsApp && whatsappSelfServiceAllowed ? (whatsappConnection?.pendingConnection ? "Pairing in progress" : "Ready to connect") : isWhatsApp ? (whatsappConnection?.adminFallback.configured ? "Managed by Lulu via UnifyPort" : "UnifyPort admin sender awaiting activation") : luluManagedMessaging ? "Managed by Lulu" : blockedByAdmin ? "Provider access restricted" : existing?.status ?? "Not connected"}</span>
                        </span>
                        <div className={`col-span-2 flex w-full items-center gap-2 border-t border-[var(--border)] pt-3 ${platformComingSoon ? 'pointer-events-none' : ''}`}>{connected ? <button type="button" onClick={() => void removePlatform(connected.id)} disabled={!canEdit} aria-disabled={!canEdit} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-2 text-xs font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--destructive)] hover:text-[var(--destructive)] disabled:cursor-not-allowed disabled:opacity-50" aria-label={`Remove ${name}`}><Trash2 size={13} />Remove</button> : <button type="button" onClick={() => void connectPlatform(name)} disabled={luluManagedMessaging || platformComingSoon || blockedByAdmin || connectingPlatform === name || !canEdit} aria-disabled={luluManagedMessaging || platformComingSoon || blockedByAdmin || !canEdit} className="flex-1 rounded-lg bg-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)] transition hover:-translate-y-0.5 hover:opacity-90 sm:flex-none">{isWhatsApp && whatsappSelfServiceAllowed ? "Connect" : isWhatsApp ? "Managed via UnifyPort" : luluManagedMessaging ? "Managed" : platformComingSoon ? "Unavailable" : blockedByAdmin ? "Restricted" : connectingPlatform === name ? "Opening…" : "Connect"}</button>}<button type="button" onClick={() => setGuidePlatform(name)} disabled={platformComingSoon} className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] transition hover:-translate-y-0.5 hover:border-[var(--foreground)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">{platformComingSoon ? "Unavailable" : "Guide"}</button></div>
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
      {whatsappSetupOpen && whatsappConnection?.selfServiceAllowed && <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="whatsapp-setup-title"><div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--muted-foreground)]">UnifyPort WhatsApp</p><h2 id="whatsapp-setup-title" className="mt-2 text-2xl font-semibold">Connect your number</h2><p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">Lulu never receives your WhatsApp password. UnifyPort gives you a short pairing code.</p></div><button type="button" onClick={() => setWhatsappSetupOpen(false)} className="text-sm text-[var(--muted-foreground)]">Close</button></div>{whatsappConnection.pendingConnection ? <div className="mt-6 space-y-4"><div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-4"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--muted-foreground)]">Pairing code</p><p className="mt-2 text-3xl font-bold tracking-[.22em]">{typeof whatsappConnection.pendingConnection.authPayload?.verify_code === 'string' ? whatsappConnection.pendingConnection.authPayload.verify_code : 'Waiting…'}</p><p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">WhatsApp → Linked devices → Link with phone number. Enter the code before it expires.</p></div><p className="text-xs text-[var(--muted-foreground)]">Status: {whatsappConnection.pendingConnection.authStatus} · Runtime: {whatsappConnection.pendingConnection.runtimeStatus}</p></div> : whatsappConnection.customerConnection ? <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-sm">WhatsApp is connected as <strong>{whatsappConnection.customerConnection.displayName}</strong>.</div> : <div className="mt-6 space-y-4"><label className="block text-sm font-medium">WhatsApp phone number<input value={whatsappPhone} onChange={(event) => setWhatsappPhone(event.target.value)} placeholder="+491701234567" className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3" /></label><label className="block text-sm font-medium">Display name (optional)<input value={whatsappDisplayName} onChange={(event) => setWhatsappDisplayName(event.target.value)} placeholder="Customer Support" className="mt-2 h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3" /></label><button type="button" onClick={() => void beginWhatsApp()} disabled={whatsappBusy || !whatsappPhone.trim()} className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-50">{whatsappBusy ? 'Starting secure pairing…' : 'Start pairing'}</button></div>}</div></div>}
    </main>;
};
