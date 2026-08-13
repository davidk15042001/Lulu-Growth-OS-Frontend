import { useEffect, useState } from "react";
import { ArrowRight, Check, Plus, ShieldCheck, Sparkles, X } from "lucide-react";
import { navigateApp, routes } from '../../../../routing';
import { requestApi } from '../../../../api/client';
import { getSelectedWorkspaceId } from '../../../../api/session';
type Tag = {
  id: string;
  label: string;
};
const initialTags: Tag[] = [{
  id: "b2b-saas",
  label: "B2B SaaS"
}, {
  id: "revenue-intelligence",
  label: "Revenue intelligence"
}, {
  id: "europe",
  label: "Europe"
}];
const setupSteps = ["Company Information", "Business Description", "Products & Services", "Existing Platforms", "Integrations", "AI Preferences", "Setup Complete"];
export const BusinessDescription = () => {
  const [whatBusinessDoes, setWhatBusinessDoes] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [shortBrandDescription, setShortBrandDescription] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    requestApi<{ workspace: { businessDescription: string | null; valueProposition: string | null; targetMarket: string | null; shortBrandDescription: string | null; positioningTags: string[] } }>({ path: `/workspaces/${workspaceId}/onboarding` })
      .then(response => {
        const workspace = response.data.workspace;
        setWhatBusinessDoes(workspace.businessDescription ?? '');
        setValueProposition(workspace.valueProposition ?? '');
        setTargetMarket(workspace.targetMarket ?? '');
        setShortBrandDescription(workspace.shortBrandDescription ?? '');
        setTags(workspace.positioningTags.map(label => ({ id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'), label })));
      })
      .catch(() => undefined);
  }, []);
  const add = () => {
    const nextTag = draft.trim();
    if (nextTag && !tags.some(tag => tag.label.toLowerCase() === nextTag.toLowerCase())) {
      setTags([...tags, {
        id: nextTag.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: nextTag
      }]);
      setDraft("");
      setSaved(false);
    }
  };
  return <main className="grid min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] font-bold text-[var(--primary-foreground)]">
              L
            </span>
            <b className="text-xl text-[var(--foreground)]">Lulu AI</b>
          </div>

          <nav aria-label="Setup progress" className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
                Company setup
              </p>
              <p className="text-xs font-medium text-[var(--foreground)]">
                Step 2 of 7
              </p>
            </div>
            <ol className="grid grid-cols-7 gap-1.5">
              {setupSteps.map((step, index) => <li key={step} className="min-w-0">
                  <span className={`block h-1.5 rounded-full ${index <= 1 ? "bg-[var(--primary)]" : "bg-[var(--secondary)]"}`} title={step} />
                
                  <span className="sr-only">{step}</span>
                </li>)}
            </ol>
          </nav>

          <p className="mt-10 text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
            02 / 07 · Company profile
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
            Tell Lulu what makes your business matter.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--muted-foreground)]">
            This narrative guides your positioning, recommendations and
            generated market insight.
          </p>

          <form className="mt-8 space-y-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)]" onSubmit={async event => {
          event.preventDefault();
          const workspaceId = getSelectedWorkspaceId();
          if (!workspaceId || !whatBusinessDoes.trim() || loading) return;
          setLoading(true);
          setError('');
          try {
            await requestApi({ path: `/workspaces/${workspaceId}/onboarding/business-description`, method: 'PATCH', body: {
              businessDescription: whatBusinessDoes || null,
              valueProposition: valueProposition || null,
              targetMarket: targetMarket || null,
              shortBrandDescription: shortBrandDescription || null,
              positioningTags: tags.map(tag => tag.label),
            } });
            setSaved(true);
            navigateApp(routes.onboarding.productsServices);
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Unable to save the business description.');
          } finally {
            setLoading(false);
          }
        }}>
            
            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>What the business does</span>
              <textarea value={whatBusinessDoes} onChange={event => {
              setWhatBusinessDoes(event.target.value);
              setSaved(false);
            }} className="mt-1 min-h-24 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Value proposition</span>
              <textarea value={valueProposition} onChange={event => {
              setValueProposition(event.target.value);
              setSaved(false);
            }} className="mt-1 min-h-20 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Target market</span>
              <input value={targetMarket} onChange={event => {
              setTargetMarket(event.target.value);
              setSaved(false);
            }} className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Short brand description</span>
              <input value={shortBrandDescription} onChange={event => {
              setShortBrandDescription(event.target.value);
              setSaved(false);
            }} className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <section className="rounded-md border border-[var(--border)] bg-[var(--card)] p-4" aria-labelledby="business-narrative-title">
              
              <div className="flex items-center justify-between gap-4">
                <h2 id="business-narrative-title" className="text-sm font-semibold text-[var(--foreground)]">
                  
                  Business narrative
                </h2>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {whatBusinessDoes.length}/500 characters
                </span>
              </div>
              <p className="mt-3 rounded-md border border-[var(--border)] bg-[var(--secondary)] p-3 text-sm leading-6 text-[var(--foreground)]">
                <strong className="font-semibold">AI signal:</strong>
                <span>
                  {" "}
                  Clear audience and outcome. Add one differentiator to improve
                  market positioning.
                </span>
              </p>
            </section>

            <section className="rounded-md border border-[var(--border)] bg-[var(--card)] p-4" aria-labelledby="positioning-signals-title">
              
              <h2 id="positioning-signals-title" className="text-sm font-semibold text-[var(--foreground)]">
                
                Positioning signals
              </h2>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Terms Lulu uses to understand your business.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map(tag => <span key={tag.id} className="flex items-center gap-1 rounded-full bg-[var(--primary)] px-3 py-1.5 text-sm text-[var(--primary-foreground)]">
                  
                    <span>{tag.label}</span>
                    <button aria-label={`Remove ${tag.label}`} type="button" onClick={() => {
                  setTags(tags.filter(item => item.id !== tag.id));
                  setSaved(false);
                }}>
                    
                      <X size={13} className="text-[var(--foreground)]" />
                    </button>
                  </span>)}
              </div>
              <div className="mt-4 flex gap-2">
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Add a positioning term</span>
                  <input value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    add();
                  }
                }} placeholder="Add a positioning term" className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
                  
                </label>
                <button type="button" onClick={add} className="flex h-11 items-center justify-center gap-1 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary)]">
                  
                  <Plus size={15} />
                  <span>Add</span>
                </button>
              </div>
            </section>

            <button className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary)]">
              <span>{loading ? "Saving…" : saved ? "Saved" : "Save changes"}</span>
              <ArrowRight size={16} />
            </button>

            <p className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <Check size={15} />
              <span>Changes are used across your Lulu AI workspace.</span>
            </p>
            {error && <p role="alert" className="text-sm text-[var(--destructive)]">{error}</p>}
          </form>
        </div>
      </section>

      <aside className="hidden border-l border-[var(--border)] bg-[var(--sidebar)] p-12 text-[var(--foreground)] lg:flex lg:flex-col lg:justify-between">
        <Sparkles size={42} className="text-[var(--foreground)]" />
        <div>
          <p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
            Business Description
          </p>
          <h2 className="mt-3 max-w-lg text-5xl font-semibold leading-tight tracking-[-0.045em] text-[var(--foreground)]">
            A sharper company story creates sharper AI recommendations.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-[var(--muted-foreground)]">
            Lulu uses your description, value proposition, target market, and
            brand language to understand where your business fits and what
            actions matter next.
          </p>
        </div>
        <p className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
          <ShieldCheck size={18} />
          <span>Business context stays inside your secure workspace</span>
        </p>
      </aside>
    </main>;
};
