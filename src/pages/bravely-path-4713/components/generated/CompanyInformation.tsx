import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Building2, Check, ShieldCheck, Sparkles } from "lucide-react";
import { navigateApp, routes } from '../../../../routing';
import { getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { getSelectedWorkspaceId, setSelectedWorkspaceId } from '../../../../api/session';
type CompanyForm = {
  companyName: string;
  industry: string;
  companySize: string;
  countryRegion: string;
};
const setupSteps = ["Company Information", "Business Description", "Existing Platforms", "Billing"];
export const CompanyInformation = () => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CompanyForm>({
    companyName: "",
    industry: "",
    companySize: "",
    countryRegion: ""
  });
  useEffect(() => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    requestApi<{ workspace: CompanyForm }>({ path: `/workspaces/${workspaceId}/onboarding` })
      .then(response => setForm({
        companyName: response.data.workspace.companyName,
        industry: response.data.workspace.industry ?? '',
        companySize: response.data.workspace.companySize ?? '',
        countryRegion: response.data.workspace.countryRegion ?? '',
      }))
      .catch(() => undefined);
  }, []);
  const update = (key: keyof CompanyForm, value: string) => {
    setForm({
      ...form,
      [key]: value
    });
    setSaved(false);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.companyName.trim() || loading) return;
    setLoading(true);
    setError('');
    try {
      let workspaceId = getSelectedWorkspaceId();
      if (!workspaceId) {
        const created = await requestApi<{ id: string }>({ path: '/workspaces', method: 'POST', body: form });
        workspaceId = created.data.id;
        setSelectedWorkspaceId(workspaceId);
      }
      await requestApi({ path: `/workspaces/${workspaceId}/onboarding/company-information`, method: 'PATCH', body: {
        companyName: form.companyName,
        industry: form.industry || null,
        companySize: form.companySize || null,
        countryRegion: form.countryRegion || null,
      } });
      setSaved(true);
      navigateApp(routes.onboarding.businessDescription);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'We could not save your company information. Please try again.'));
    } finally {
      setLoading(false);
    }
  };
  return <main className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)]">
      <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] font-bold text-[var(--primary-foreground)]">
              <span>L</span>
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
                Step 1 of 4
              </p>
            </div>
            <ol className="grid grid-cols-4 gap-1.5">
              {setupSteps.map((step, index) => <li key={step} className="min-w-0">
                  <span className={`block h-1.5 rounded-full ${index === 0 ? "bg-[var(--primary)]" : "bg-[var(--secondary)]"}`} title={step} />
                
                  <span className="sr-only">{step}</span>
                </li>)}
            </ol>
          </nav>

          <p className="mt-10 text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
            <span>01 / 04 · Company profile</span>
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-[var(--foreground)] sm:text-4xl">
            <span>Company information</span>
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
            <span>
              Keep your core business data accurate for better recommendations.
            </span>
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)]" aria-label="Company information onboarding form">
            
            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Legal company name</span>
              <input value={form.companyName} onChange={event => update("companyName", event.target.value)} type="text" autoComplete="organization" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Industry</span>
              <input value={form.industry} onChange={event => update("industry", event.target.value)} type="text" autoComplete="organization-title" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Company size</span>
              <input value={form.companySize} onChange={event => update("companySize", event.target.value)} type="text" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Country/region</span>
              <input value={form.countryRegion} onChange={event => update("countryRegion", event.target.value)} type="text" autoComplete="country-name" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <button type="submit" disabled={loading || !form.companyName.trim()} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 focus:ring-offset-[var(--border)]">
              
              <span>{loading ? "Saving…" : saved ? "Saved" : "Save changes"}</span>
              {saved ? <Check size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
            </button>

            {saved ? <p className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]" role="status">
              
                <Check size={15} aria-hidden="true" />
                <span>Company information saved.</span>
              </p> : null}
            {error && <p role="alert" className="text-sm text-[var(--destructive)]">{error}</p>}
          </form>
        </div>
      </section>

    </main>;
};
