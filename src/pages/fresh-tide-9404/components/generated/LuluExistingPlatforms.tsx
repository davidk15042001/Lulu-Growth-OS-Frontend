import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, BarChart3, Check, CircleCheck, Globe, Search, ShieldCheck, Sparkles, Store, Trash2, UsersRound, X } from "lucide-react";
import { navigateApp, routes } from '../../../../routing';
import { getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { getSelectedWorkspaceId } from '../../../../api/session';
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
}
const platformGroups: PlatformGroup[] = [{
  id: "crm",
  label: "CRM",
  description: "Customer records, deals and pipeline context.",
  icon: UsersRound,
  platforms: ["Salesforce", "Pipedrive", "HubSpot"]
}, {
  id: "marketing",
  label: "Marketing",
  description: "Campaign performance and audience activation.",
  icon: Store,
  platforms: ["Google Ads API", "Meta Marketing API", "LinkedIn Ads Advertising API"]
}, {
  id: "analytics",
  label: "Analyse",
  description: "Measurement, attribution and conversion signals.",
  icon: BarChart3,
  platforms: ["Google Ads", "Google Analytics", "Meta Conversion API", "Ad Analytics API", "LinkedIn Conversion Tracking API"]
}, {
  id: "digital-appearance",
  label: "Digital Appearance",
  description: "Website builders and storefront platforms for your digital presence.",
  icon: Globe,
  platforms: ["Webflow", "WordPress", "Shopify"]
}];
  const setupSteps = ["Company Information", "Business Description", "Existing Platforms", "Integrations", "AI Preferences", "Setup Complete"];
  const guideContent: Record<string, { intro: string; steps: string[]; links?: Array<{ label: string; url: string }> }> = {
    Salesforce: { intro: "Connect a Salesforce organization through a Connected App. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/salesforce/callback", steps: ["Open Salesforce Setup → App Manager → New Connected App.", "Enable OAuth Settings and add the callback URL shown above.", "Add the `api`, `refresh_token` and `offline_access` scopes, then save.", "Wait for Salesforce to activate the app, return here and click Connect.", "Approve Lulu in Salesforce and choose the organization you want to connect."], links: [{ label: "Open Salesforce Developer Portal", url: "https://developer.salesforce.com/" }] },
    Pipedrive: { intro: "Connect the Pipedrive account that contains your sales pipeline. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/pipedrive/callback", steps: ["Open the Pipedrive Developer Hub and create an OAuth app.", "Enter the callback URL shown above as the app redirect URL.", "Copy the Client ID and Client Secret to the backend environment; never put them in the browser.", "Click Connect here and approve the requested `base` access in Pipedrive."], links: [{ label: "Open Pipedrive Developer Hub", url: "https://developers.pipedrive.com/" }] },
    HubSpot: { intro: "Connect one HubSpot portal with OAuth. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/hubspot/callback", steps: ["Open your HubSpot developer account and create a public app.", "In Auth settings, add the callback URL shown above.", "Add `oauth` and `crm.objects.contacts.read` to the required scopes.", "Have a HubSpot Super Admin install the app, then click Connect here.", "Select the portal and approve the requested permissions."], links: [{ label: "Open HubSpot Developer Account", url: "https://developers.hubspot.com/" }] },
    "Google Ads API": { intro: "Authorize Google Ads access. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/google-ads/callback", steps: ["Open Google Cloud Console → APIs & Services → Credentials.", "Create an OAuth Web application and add the callback URL shown above.", "Enable Google Ads API and configure the OAuth consent screen.", "Ensure a Google Ads developer token is configured on the Lulu backend.", "Click Connect here and approve the Google account with Ads access."], links: [{ label: "Open Google Cloud Credentials", url: "https://console.cloud.google.com/apis/credentials" }, { label: "Read Google Ads OAuth Guide", url: "https://developers.google.com/google-ads/api/docs/oauth/overview" }] },
    "Google Ads": { intro: "Connect Google Ads reporting with the same OAuth account. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/google-ads/callback", steps: ["Confirm that your Google account can access the correct Ads customer account.", "Make sure the Google Ads API and OAuth consent screen are configured.", "Ask the Lulu administrator to configure the Google Ads developer token.", "Click Connect here and select the Google account used for Ads reporting."], links: [{ label: "Open Google Cloud Credentials", url: "https://console.cloud.google.com/apis/credentials" }] },
    "Google Analytics": { intro: "Prepare Google Analytics access. This provider still requires its Analytics-specific backend connector.", steps: ["Confirm that your Google account has Viewer or higher access to the Analytics property.", "Open Google Cloud Console and enable Google Analytics Data API.", "Register the future Analytics callback URL in the OAuth client.", "The current Connect action becomes available after the Analytics connector is configured."], links: [{ label: "Open Google Analytics", url: "https://analytics.google.com/" }, { label: "Open Google Cloud APIs", url: "https://console.cloud.google.com/apis/library" }] },
    "Meta Marketing API": { intro: "Connect Meta Business marketing data. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/meta/callback", steps: ["Open Meta for Developers → My Apps and create or select an app.", "Add the Marketing API product and register the callback URL shown above.", "Request `ads_read` and `business_management`; Meta may require App Review.", "Make sure your user has access to the target Business Manager and ad account.", "Click Connect here and approve the Meta Business authorization."], links: [{ label: "Open Meta My Apps", url: "https://developers.facebook.com/apps/" }, { label: "Read Meta Marketing API Authorization", url: "https://developers.facebook.com/documentation/ads-commerce/marketing-api/get-started/authorization" }] },
    "Meta Conversion API": { intro: "Authorize the Meta business assets used for conversion data. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/meta/callback", steps: ["Confirm that your Business Manager owns or manages the dataset and ad account.", "Configure the Meta app and request the required business permissions.", "Complete Meta App Review if the requested permissions are not in development mode.", "Click Connect here and select the Business account to authorize."], links: [{ label: "Open Meta My Apps", url: "https://developers.facebook.com/apps/" }, { label: "Read Meta Token Authentication", url: "https://developers.facebook.com/documentation/ads-commerce/marketing-api/get-started/authentication" }] },
    "Ad Analytics API": { intro: "Prepare the ad analytics provider account before connecting.", steps: ["Confirm which advertising account should provide the analytics data.", "Create the provider API/OAuth app and register the Lulu callback URL.", "Grant only the read/reporting permissions needed for analytics.", "Click Connect here after the provider credentials are configured."] },
    "LinkedIn Ads Advertising API": { intro: "Connect LinkedIn Campaign Manager. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/linkedin/callback", steps: ["Open LinkedIn Developers → My apps and create or select an application.", "In the Auth tab, add the callback URL shown above.", "Request the approved Marketing API and `r_ads_reporting` permissions; LinkedIn approval may be required.", "Confirm that your LinkedIn member has access to the Campaign Manager ad account.", "Click Connect here and authorize the application."], links: [{ label: "Open LinkedIn Developer Apps", url: "https://www.linkedin.com/developers/apps" }, { label: "Read LinkedIn OAuth Guide", url: "https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow" }] },
    "LinkedIn Conversion Tracking API": { intro: "Authorize LinkedIn conversion reporting. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/linkedin/callback", steps: ["Confirm access to the Campaign Manager account and the conversion configuration.", "Open the LinkedIn developer app and request the required Marketing API permissions.", "Register the callback URL shown above and wait for any LinkedIn approval.", "Click Connect here and approve the requested access."], links: [{ label: "Read LinkedIn API Access", url: "https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access" }, { label: "Read LinkedIn Conversions API", url: "https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/conversions-api" }] },
    Webflow: { intro: "Connect a Webflow workspace or site. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/webflow/callback", steps: ["Open Webflow Developers and create a Data Client app.", "Set the callback URL shown above in the app settings.", "Enable the `sites:read` scope and copy the client credentials to the Lulu backend.", "Make sure you are a Webflow workspace administrator.", "Click Connect here and authorize the Webflow app."], links: [{ label: "Open Webflow Developers", url: "https://developers.webflow.com/" }, { label: "Read Webflow OAuth Guide", url: "https://developers.webflow.com/data/reference/oauth-app" }] },
    WordPress: { intro: "Connect a WordPress.com or Jetpack account. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/wordpress/callback", steps: ["Open the WordPress.com Developer Portal and create an OAuth application.", "Add the callback URL shown above and copy the Client ID and Client Secret to the backend.", "Confirm that the account can access the intended WordPress.com or Jetpack site.", "Click Connect here and approve the WordPress authorization."], links: [{ label: "Open WordPress Developer Portal", url: "https://developer.wordpress.com/apps/" }, { label: "Read WordPress OAuth2 Guide", url: "https://developer.wordpress.com/docs/api/oauth2/" }] },
    Shopify: { intro: "Connect a Shopify store using its myshopify.com domain. Callback URL: https://lulu-ai.cn/api/v1/onboarding/oauth/shopify/callback", steps: ["Open the Shopify Dev Dashboard and create or select the app.", "Configure the Admin API scopes `read_products` and `read_content` and add the callback URL shown above.", "Copy your store domain in the exact format `example.myshopify.com`.", "Click Connect here, enter the store domain, and approve the app installation."], links: [{ label: "Open Shopify Dev Dashboard", url: "https://dev.shopify.com/dashboard" }, { label: "Read Shopify OAuth Guide", url: "https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant" }] },
  };
export const LuluExistingPlatforms = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [query, setQuery] = useState("");
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState('');
  const [guidePlatform, setGuidePlatform] = useState<string | null>(null);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  useEffect(() => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    requestApi<{ platforms: Array<{ id: string; name: string; category: string; connectionStatus: string }> }>({ path: `/workspaces/${workspaceId}/onboarding` })
      .then(response => setPlatforms(response.data.platforms.map(platform => ({
        id: platform.id,
        name: platform.name,
        type: platform.category,
        status: platform.connectionStatus === 'connected' ? 'Connected' : platform.connectionStatus === 'error' ? 'Needs review' : 'Pending',
      }))))
      .catch(cause => setError(getFriendlyErrorMessage(cause, 'We could not load your platforms. Please try again.')));
  }, []);
  const connectPlatform = async (name: string) => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId || platforms.some(platform => platform.name === name)) return;
    const providerMap: Record<string, string> = {
      Salesforce: 'salesforce',
      Pipedrive: 'pipedrive',
      HubSpot: 'hubspot',
      'Google Ads API': 'google-ads',
      'Google Ads': 'google-ads',
      'Meta Marketing API': 'meta',
      'Meta Conversion API': 'meta',
      'LinkedIn Ads Advertising API': 'linkedin',
      'LinkedIn Conversion Tracking API': 'linkedin',
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
    setConnectingPlatform(name);
    try {
      const shop = provider === 'shopify' ? window.prompt('Enter your Shopify shop domain (example.myshopify.com)')?.trim() : undefined;
      if (provider === 'shopify' && !shop) {
        setConnectingPlatform(null);
        return;
      }
      const response = await requestApi<{ authorizationUrl: string }>({ path: `/workspaces/${workspaceId}/onboarding/platforms/${provider}/connect${shop ? `?shop=${encodeURIComponent(shop)}` : ''}` });
      if (!response.data?.authorizationUrl) throw new Error('The provider authorization URL was not returned by the backend.');
      window.location.assign(response.data.authorizationUrl);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'We could not start this connection. Please try again.'));
      setConnectingPlatform(null);
    }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (synced) {
      navigateApp(routes.onboarding.aiPreferences);
      return;
    }
    setSynced(true);
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
  return <main className="grid min-h-screen bg-[var(--background)] font-['Inter',sans-serif] text-[var(--foreground)] lg:grid-cols-[7fr_3fr]">
      <section className="flex items-center justify-center p-6 py-10 sm:p-8 lg:p-12">
        <div className="w-full max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] font-bold text-[var(--primary-foreground)]">
              L
            </span>
            <strong className="text-xl font-semibold text-[var(--foreground)]">
              Lulu AI
            </strong>
          </div>
          <nav aria-label="Setup progress" className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
                Company setup
              </p>
              <p className="text-xs font-medium text-[var(--foreground)]">
                Step 3 of 6
              </p>
            </div>
            <ol className="grid grid-cols-6 gap-1.5">
              {setupSteps.map((step, index) => <li key={step} className="min-w-0">
                  <span className={`block h-1.5 rounded-full ${index <= 2 ? "bg-[var(--primary)]" : "bg-[var(--secondary)]"}`} title={step} />
                
                  <span className="sr-only">{step}</span>
                </li>)}
            </ol>
          </nav>
          <p className="mt-10 text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
            03 / 06 · Company profile
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-[var(--foreground)]">
            Your existing platforms
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
            Connect the systems that hold your business signal. Lulu turns them
            into one context layer.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:p-6 lg:p-7">
            
            <label className="block text-sm font-medium text-[var(--foreground)]">
              <span className="flex items-center justify-between gap-3"><span>Search platforms</span><span className="text-xs font-normal text-[var(--muted-foreground)]">{platformGroups.reduce((count, group) => count + group.platforms.length, 0)} available</span></span>
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search Salesforce, Google Ads, Analytics…" className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-4 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15" />
            </label>
            {error && <div role="alert" className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-4 py-3 text-sm leading-6 text-[var(--destructive)]">{error}</div>}
            <div className="space-y-5">
              {platformGroups.map(group => {
              const Icon = group.icon;
              const groupPlatforms = group.platforms.filter(name => name.toLowerCase().includes(query.toLowerCase()));
              return <section key={group.id} className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/35 p-4 shadow-sm sm:p-5" aria-labelledby={`${group.id}-heading`}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 id={`${group.id}-heading`} className="text-base font-semibold tracking-tight text-[var(--foreground)]">{group.label}</h2>
                      <p className="mt-1 max-w-xl text-xs leading-5 text-[var(--muted-foreground)]">{group.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted-foreground)]">{groupPlatforms.length}</span>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {groupPlatforms.map(name => {
                    const connected = platforms.find(platform => platform.name === name);
                    return <article key={name} className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:border-[var(--primary)]/45 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] [grid-template-columns:auto_minmax(0,1fr)]">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--secondary)] text-[var(--foreground)]">
                          {connected ? <CircleCheck size={16} /> : <Icon size={15} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className="block text-sm font-semibold text-[var(--foreground)]">{name}</strong>
                          <span className="mt-0.5 block text-xs text-[var(--muted-foreground)]">{connected ? connected.status : "Not connected"}</span>
                        </span>
                        <div className="col-span-2 flex w-full items-center gap-2 border-t border-[var(--border)] pt-3">{connected ? <button type="button" onClick={() => void removePlatform(connected.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-2 text-xs font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--destructive)] hover:text-[var(--destructive)]" aria-label={`Remove ${name}`}><Trash2 size={13} />Remove</button> : <button type="button" onClick={() => void connectPlatform(name)} disabled={connectingPlatform === name} className="flex-1 rounded-lg bg-[var(--primary)] disabled:cursor-wait disabled:opacity-60 px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)] transition hover:-translate-y-0.5 hover:opacity-90 sm:flex-none">{connectingPlatform === name ? "Opening…" : "Connect"}</button>}<button type="button" onClick={() => setGuidePlatform(name)} className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] transition hover:-translate-y-0.5 hover:border-[var(--foreground)] hover:text-[var(--foreground)] sm:flex-none">Guide</button></div>
                      </article>;
                  })}
                  </div>
                </section>;
              })}
            </div>
            <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary)]">
              
              {synced ? "Save and continue" : "Sync all"}
              <ArrowRight size={16} />
            </button>
            {synced && <p className="flex items-start gap-2 text-sm leading-6 text-[var(--foreground)]">
                <Check size={15} className="mt-1 shrink-0" />
                <span>
                  <strong>Keep your context fresh.</strong>
                  <br />
                  <span className="text-[var(--muted-foreground)]">
                    Lulu checks connected sources every hour. You control what
                    is shared.
                  </span>
                </span>
              </p>}

          </form>
        </div>
      </section>
      <aside className="hidden border-l border-[var(--border)] bg-[var(--sidebar)] p-12 text-[var(--foreground)] lg:flex lg:flex-col lg:justify-between">
        <Sparkles size={42} className="text-[var(--foreground)]" />
        <div>
          <p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
            Signal layer
          </p>
          <h2 className="mt-3 text-5xl font-semibold leading-tight text-[var(--foreground)]">
            Bring every platform into one clear business context.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-[var(--muted-foreground)]">
            CRM, marketing, analytics, and communication data stay connected so
            Lulu can understand how your company actually works.
          </p>
        </div>
        <p className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
          <ShieldCheck size={18} /> Secure platform connections
        </p>
      </aside>
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
