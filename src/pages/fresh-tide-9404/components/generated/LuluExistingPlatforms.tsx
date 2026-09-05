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
  name: string;
  type: string;
  status: string;
}
interface PlatformGroup {
  id: string;
  label: string;
  description: string;
  icon: typeof UsersRound;
  platforms: string[];
  comingSoon?: boolean;
  comingSoonPlatforms?: string[];
}
const platformGroups: PlatformGroup[] = [
  { id: 'crm', label: 'CRM & Sales', description: 'Connect customer, pipeline and sales systems that contain your business relationships.', icon: UsersRound, platforms: ['Salesforce', 'HubSpot', 'Pipedrive'], comingSoonPlatforms: ['Salesforce', 'Pipedrive'] },
  { id: 'website', label: 'Website & Publishing', description: 'Connect the website platforms Lulu can use for content, publishing and website intelligence.', icon: Globe, platforms: ['WordPress', 'Webflow'] },
  { id: 'commerce', label: 'Commerce', description: 'Connect commerce platforms to analyze products, orders and customer activity.', icon: Store, platforms: ['Shopify'], comingSoonPlatforms: ['Shopify'] },
];
  const guideContent: Record<string, { intro: string; steps: string[]; links?: Array<{ label: string; url: string }> }> = {
    Salesforce: { intro: "Connect a Salesforce organization through a Connected App. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/salesforce/callback", steps: ["Open Salesforce Setup → App Manager → New Connected App.", "Enable OAuth Settings and add the callback URL shown above.", "Add the `api`, `refresh_token` and `offline_access` scopes, then save.", "Wait for Salesforce to activate the app, return here and click Connect.", "Approve Lulu in Salesforce and choose the organization you want to connect."], links: [{ label: "Open Salesforce Developer Portal", url: "https://developer.salesforce.com/" }] },
    Pipedrive: { intro: "Connect the Pipedrive account that contains your sales pipeline. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/pipedrive/callback", steps: ["Open the Pipedrive Developer Hub and create an OAuth app.", "Enter the callback URL shown above as the app redirect URL.", "Copy the Client ID and Client Secret to the backend environment; never put them in the browser.", "Click Connect here and approve the requested `base` access in Pipedrive."], links: [{ label: "Open Pipedrive Developer Hub", url: "https://developers.pipedrive.com/" }] },
    HubSpot: { intro: "Connect one HubSpot portal with OAuth. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/hubspot/callback", steps: ["Open your HubSpot developer account and create a public app.", "In Auth settings, add the callback URL shown above.", "Add `oauth` and `crm.objects.contacts.read` to the required scopes.", "Have a HubSpot Super Admin install the app, then click Connect here.", "Select the portal and approve the requested permissions."], links: [{ label: "Open HubSpot Developer Account", url: "https://developers.hubspot.com/" }] },
    Webflow: { intro: "Connect a Webflow workspace or site. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/webflow/callback", steps: ["Open Webflow Developers and create a Data Client app.", "Set the callback URL shown above in the app settings.", "Enable the `sites:read` scope and copy the client credentials to the Lulu backend.", "Make sure you are a Webflow workspace administrator.", "Click Connect here and authorize the Webflow app."], links: [{ label: "Open Webflow Developers", url: "https://developers.webflow.com/" }, { label: "Read Webflow OAuth Guide", url: "https://developers.webflow.com/data/reference/oauth-app" }] },
    WordPress: { intro: "Connect a WordPress.com or Jetpack account. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/wordpress/callback", steps: ["Open the WordPress.com Developer Portal and create an OAuth application.", "Add the callback URL shown above and copy the Client ID and Client Secret to the backend.", "Confirm that the account can access the intended WordPress.com or Jetpack site.", "Click Connect here and approve the WordPress authorization."], links: [{ label: "Open WordPress Developer Portal", url: "https://developer.wordpress.com/apps/" }, { label: "Read WordPress OAuth2 Guide", url: "https://developer.wordpress.com/docs/api/oauth2/" }] },
    Shopify: { intro: "Connect a Shopify store using its myshopify.com domain. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/shopify/callback", steps: ["Open the Shopify Dev Dashboard and create or select the app.", "Configure the Admin API scopes `read_products` and `read_content` and add the callback URL shown above.", "Copy your store domain in the exact format `example.myshopify.com`.", "Click Connect here, enter the store domain, and approve the app installation."], links: [{ label: "Open Shopify Dev Dashboard", url: "https://dev.shopify.com/dashboard" }, { label: "Read Shopify OAuth Guide", url: "https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant" }] },
  };
export const LuluExistingPlatforms = () => {
  const { updateWorkspace } = useLuluApp();
  const isOnboarding = window.location.pathname.startsWith("/onboarding/");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [error, setError] = useState('');
  const [technicalDetails, setTechnicalDetails] = useState('');
  const [guidePlatform, setGuidePlatform] = useState<string | null>(null);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
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
    requestApi<{ platforms: Array<{ id: string; name: string; category: string; connectionStatus: string }> }>({ path: `/workspaces/${workspaceId}/onboarding` })
      .then(response => setPlatforms(response.data.platforms.map(platform => ({
        id: platform.id,
        name: platform.name,
        type: platform.category,
        status: platform.connectionStatus === 'connected' ? 'Connected' : platform.connectionStatus === 'error' ? 'Needs review' : 'Pending',
      }))))
      .catch(cause => {
        setError(getFriendlyErrorMessage(cause, 'We could not load your platforms. Please try again.'));
        setTechnicalDetails(getTechnicalErrorDetails(cause));
      });
  }, []);
  const connectPlatform = async (name: string) => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId || platforms.some(platform => platform.name === name)) return;
    const providerMap: Record<string, string> = {
      Salesforce: 'salesforce',
      Pipedrive: 'pipedrive',
      HubSpot: 'hubspot',
      Webflow: 'webflow',
      WordPress: 'wordpress',
      Shopify: 'shopify',
    };
    const provider = providerMap[name];
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
    if (!isOnboarding) return;
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    setError('');
    setTechnicalDetails('');
    try {
      const response = await onboardingApi.continueExistingPlatforms(workspaceId);
      updateWorkspace(response.data);
      navigateApp(routes.onboarding.billing);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'We could not save this onboarding step. Please try again.'));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
    }
  };
  const removePlatform = async (id: string) => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    try {
      await requestApi({ path: `/workspaces/${workspaceId}/onboarding/platforms/${id}`, method: 'DELETE' });
      setPlatforms(current => current.filter(item => item.id !== id));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'We could not remove this platform. Please try again.'));
    }
  };
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
              {platformGroups.map(group => {
              const Icon = group.icon;
              const groupPlatforms = group.platforms;
              const comingSoon = group.comingSoon === true;
              return <section key={group.id} className={`rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/35 p-4 shadow-sm sm:p-5 ${comingSoon ? 'opacity-70' : ''}`} aria-labelledby={`${group.id}-heading`} aria-disabled={comingSoon}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 id={`${group.id}-heading`} className="text-base font-semibold tracking-tight text-[var(--foreground)]">{group.label}{comingSoon && <span className="ml-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">(soon)</span>}</h2>
                      <p className="mt-1 max-w-xl text-xs leading-5 text-[var(--muted-foreground)]">{group.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted-foreground)]">{groupPlatforms.length}</span>
                  </div>
                  <div className={`mt-5 grid gap-3 md:grid-cols-2 ${comingSoon ? 'pointer-events-none' : ''}`}>
                    {groupPlatforms.map(name => {
                    const connected = platforms.find(platform => platform.name === name);
                    const platformComingSoon = comingSoon || group.comingSoonPlatforms?.includes(name) === true;
                    return <article key={name} className={`grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:border-[var(--primary)]/45 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] [grid-template-columns:auto_minmax(0,1fr)] ${platformComingSoon ? 'opacity-65' : ''}`}>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--secondary)] text-[var(--foreground)]">
                          {connected ? <CircleCheck size={16} /> : <Icon size={15} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className="block text-sm font-semibold text-[var(--foreground)]">{name}{platformComingSoon && <span className="ml-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">(soon)</span>}</strong>
                          <span className="mt-0.5 block text-xs text-[var(--muted-foreground)]">{connected ? connected.status : "Not connected"}</span>
                        </span>
                        <div className={`col-span-2 flex w-full items-center gap-2 border-t border-[var(--border)] pt-3 ${platformComingSoon ? 'pointer-events-none' : ''}`}>{connected ? <button type="button" onClick={() => void removePlatform(connected.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-2 text-xs font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--destructive)] hover:text-[var(--destructive)]" aria-label={`Remove ${name}`}><Trash2 size={13} />Remove</button> : <button type="button" onClick={() => void connectPlatform(name)} disabled={platformComingSoon || connectingPlatform === name} className="flex-1 rounded-lg bg-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)] transition hover:-translate-y-0.5 hover:opacity-90 sm:flex-none">{platformComingSoon ? "(soon)" : connectingPlatform === name ? "Opening…" : "Connect"}</button>}<button type="button" onClick={() => setGuidePlatform(name)} disabled={platformComingSoon} className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] transition hover:-translate-y-0.5 hover:border-[var(--foreground)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">{platformComingSoon ? "(soon)" : "Guide"}</button></div>
                      </article>;
                  })}
                  </div>
                </section>;
              })}
            </div>
            {isOnboarding && <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary)]">
              
              Continue to billing
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
            <button type="button" onClick={() => { setGuidePlatform(null); void connectPlatform(guidePlatform); }} className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90">Connect {guidePlatform}<ArrowRight size={15} /></button>
          </div>
        </div>
      </div>}
    </main>;
};
