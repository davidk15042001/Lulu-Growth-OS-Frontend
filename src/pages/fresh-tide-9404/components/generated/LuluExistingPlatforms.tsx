import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, BarChart3, Check, CircleCheck, MessageSquareText, Search, ShieldCheck, Sparkles, Store, Trash2, UsersRound } from "lucide-react";
import { navigateApp, routes } from '../../../../routing';
import { getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { getSelectedWorkspaceId } from '../../../../api/session';
interface Platform {
  id: string;
  name: string;
  type: string;
  status: string;
}
interface PlatformCategory {
  id: string;
  label: string;
  description: string;
  icon: typeof UsersRound;
}
const startingPlatforms: Platform[] = [{
  id: "hubspot",
  name: "HubSpot",
  type: "CRM",
  status: "Connected"
}, {
  id: "google-analytics",
  name: "Google Analytics",
  type: "Analytics",
  status: "Connected"
}, {
  id: "stripe",
  name: "Stripe",
  type: "Payments",
  status: "Needs review"
}];
const platformCategories: PlatformCategory[] = [{
  id: "crm",
  label: "CRM",
  description: "Customer records, deals, pipeline notes",
  icon: UsersRound
}, {
  id: "marketing-tools",
  label: "Marketing tools",
  description: "Campaigns, audiences, content performance",
  icon: Store
}, {
  id: "analytics-tools",
  label: "Analytics tools",
  description: "Traffic, attribution, product usage signal",
  icon: BarChart3
}, {
  id: "communication-platforms",
  label: "Communication platforms",
  description: "Team conversations and customer touchpoints",
  icon: MessageSquareText
}];
const setupSteps = ["Company Information", "Business Description", "Products & Services", "Existing Platforms", "Integrations", "AI Preferences", "Setup Complete"];
export const LuluExistingPlatforms = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["crm", "analytics-tools"]);
  const [customPlatform, setCustomPlatform] = useState("");
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
  const visiblePlatforms = useMemo(() => {
    return platforms.filter(platform => `${platform.name} ${platform.type} ${platform.status}`.toLowerCase().includes(query.toLowerCase()));
  }, [platforms, query]);
  const toggleCategory = (id: string) => {
    setSelectedCategories(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (synced) {
      navigateApp(routes.onboarding.aiPreferences);
      return;
    }
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    setError('');
    if (customPlatform.trim()) {
      const normalizedName = customPlatform.trim();
      try {
        const response = await requestApi<{ id: string }>({
          path: `/workspaces/${workspaceId}/onboarding/platforms`,
          method: 'POST',
          body: {
            integrationKey: normalizedName.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '') || null,
            name: normalizedName,
            category: 'custom',
            connectionStatus: 'pending',
            settings: { selectedCategories },
          },
        });
        setPlatforms(current => [...current, { id: response.data.id, name: normalizedName, type: "Custom", status: "Pending" }]);
        setCustomPlatform("");
      } catch (cause) {
        setError(getFriendlyErrorMessage(cause, 'We could not save this platform. Please try again.'));
        return;
      }
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
                Step 4 of 7
              </p>
            </div>
            <ol className="grid grid-cols-7 gap-1.5">
              {setupSteps.map((step, index) => <li key={step} className="min-w-0">
                  <span className={`block h-1.5 rounded-full ${index <= 3 ? "bg-[var(--primary)]" : "bg-[var(--secondary)]"}`} title={step} />
                
                  <span className="sr-only">{step}</span>
                </li>)}
            </ol>
          </nav>
          <p className="mt-10 text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
            04 / 07 · Company profile
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-[var(--foreground)]">
            Your existing platforms
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
            Connect the systems that hold your business signal. Lulu turns them
            into one context layer.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            
            <fieldset>
              <legend className="text-sm font-medium text-[var(--muted-foreground)]">
                Connected platforms
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {platformCategories.map(category => {
                const Icon = category.icon;
                const active = selectedCategories.includes(category.id);
                return <label key={category.id} className={active ? "flex cursor-pointer items-start gap-3 rounded-md border border-[var(--border)] bg-[var(--secondary)] p-3 text-[var(--foreground)]" : "flex cursor-pointer items-start gap-3 rounded-md border border-[var(--border)] bg-[var(--secondary)] p-3 text-[var(--foreground)] hover:border-[var(--border)]"}>
                      
                      <input type="checkbox" checked={active} onChange={() => toggleCategory(category.id)} className="sr-only" />
                      
                      <span className={active ? "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]" : "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--card)] text-[var(--foreground)]"}>
                        
                        {active ? <Check size={15} /> : <Icon size={15} />}
                      </span>
                      <span className="min-w-0">
                        <strong className="block text-sm font-semibold">
                          {category.label}
                        </strong>
                        <span className="mt-1 block text-xs leading-5 text-[var(--muted-foreground)]">
                          {category.description}
                        </span>
                      </span>
                    </label>;
              })}
              </div>
            </fieldset>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              Add another platform
              <input value={customPlatform} onChange={event => setCustomPlatform(event.target.value)} placeholder="e.g. Salesforce, Slack, Mailchimp" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition focus:border-[var(--border)]" />
              
            </label>
            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              Search
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search connected platforms" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition focus:border-[var(--border)]" />
              
            </label>
            <div className="rounded-md border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <Search size={15} className="text-[var(--foreground)]" />
                  Connected platforms
                </span>
                <span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-xs font-medium text-[var(--foreground)]">
                  {platforms.length}
                </span>
              </div>
              <div className="divide-y divide-[var(--foreground)]">
                {visiblePlatforms.map(platform => <article key={platform.id} className="flex items-center gap-3 px-3 py-3">
                  
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[var(--secondary)] text-[var(--foreground)]">
                      <CircleCheck size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm font-semibold text-[var(--foreground)]">
                        {platform.name}
                      </strong>
                      <span className="block text-xs text-[var(--muted-foreground)]">
                        {platform.type}
                      </span>
                    </span>
                    <span className={platform.status === "Connected" ? "rounded-full bg-[var(--secondary)] px-2 py-1 text-xs font-medium text-[var(--foreground)]" : "rounded-full bg-[var(--card)] px-2 py-1 text-xs font-medium text-[var(--muted-foreground)]"}>
                    
                      {platform.status}
                    </span>
                    <button type="button" onClick={() => void removePlatform(platform.id)} className="rounded-md p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]" aria-label={`Remove ${platform.name}`}>
                    
                      <Trash2 size={15} />
                    </button>
                  </article>)}
              </div>
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
