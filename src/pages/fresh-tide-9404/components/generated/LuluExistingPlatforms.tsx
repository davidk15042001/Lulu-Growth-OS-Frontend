import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, BarChart3, Check, CircleCheck, Search, ShieldCheck, Sparkles, Store, Trash2, UsersRound } from "lucide-react";
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
}];
const setupSteps = ["Company Information", "Business Description", "Existing Platforms", "Integrations", "AI Preferences", "Setup Complete"];
export const LuluExistingPlatforms = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [query, setQuery] = useState("");
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState('');
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
  const connectPlatform = async (name: string, category: string) => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId || platforms.some(platform => platform.name === name)) return;
    setError('');
    try {
      const response = await requestApi<{ id: string }>({
        path: `/workspaces/${workspaceId}/onboarding/platforms`,
        method: 'POST',
        body: {
          integrationKey: name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '') || null,
          name,
          category,
          connectionStatus: 'pending',
          settings: { provider: name, category },
        },
      });
      setPlatforms(current => [...current, { id: response.data.id, name, type: category, status: "Pending" }]);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'We could not start this connection. Please try again.'));
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
        <div className="w-full max-w-xl">
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
          <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            
            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              Search platforms
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search Salesforce, Google Ads, Analytics…" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition focus:border-[var(--border)]" />
            </label>
            <div className="space-y-5">
              {platformGroups.map(group => {
              const Icon = group.icon;
              const groupPlatforms = group.platforms.filter(name => name.toLowerCase().includes(query.toLowerCase()));
              return <section key={group.id} className="rounded-xl border border-[var(--border)] bg-[var(--secondary)]/45 p-4" aria-labelledby={`${group.id}-heading`}>
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                      <Icon size={16} />
                    </span>
                    <div>
                      <h2 id={`${group.id}-heading`} className="text-base font-semibold text-[var(--foreground)]">{group.label}</h2>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{group.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {groupPlatforms.map(name => {
                    const connected = platforms.find(platform => platform.name === name);
                    return <article key={name} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--secondary)] text-[var(--foreground)]">
                          {connected ? <CircleCheck size={16} /> : <Icon size={15} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className="block text-sm font-semibold text-[var(--foreground)]">{name}</strong>
                          <span className="mt-0.5 block text-xs text-[var(--muted-foreground)]">{connected ? connected.status : "Not connected"}</span>
                        </span>
                        {connected ? <button type="button" onClick={() => void removePlatform(connected.id)} className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-2 text-xs font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--destructive)] hover:text-[var(--destructive)]" aria-label={`Remove ${name}`}><Trash2 size={13} />Remove</button> : <button type="button" onClick={() => void connectPlatform(name, group.id)} className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)] transition hover:opacity-90">Connect</button>}
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
            {error && <p role="alert" className="text-sm text-[var(--destructive)]">{error}</p>}
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
    </main>;
};
