import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { navigateApp, routes } from '../../../../routing';
import { getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { getSelectedWorkspaceId, setSelectedWorkspaceId } from '../../../../api/session';
import { OnboardingHeader } from '../../../../components/OnboardingHeader';
type CompanyForm = {
  companyName: string;
  industry: string;
  countryRegion: string;
  taxId: string;
  address: string;
};
export const CompanyInformation = () => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CompanyForm>({
    companyName: "",
    industry: "",
    countryRegion: "",
    taxId: "",
    address: ""
  });
  useEffect(() => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    requestApi<{ workspace: CompanyForm }>({ path: `/workspaces/${workspaceId}/onboarding` })
      .then(response => setForm({
        companyName: response.data.workspace.companyName,
        industry: response.data.workspace.industry ?? '',
        countryRegion: response.data.workspace.countryRegion ?? '',
        taxId: response.data.workspace.taxId ?? '',
        address: response.data.workspace.address ?? '',
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
        countryRegion: form.countryRegion || null,
        taxId: form.taxId || null,
        address: form.address || null,
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
          <OnboardingHeader step={1} />

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
              <span>Country/region</span>
              <input value={form.countryRegion} onChange={event => update("countryRegion", event.target.value)} type="text" autoComplete="country-name" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Tax ID</span>
              <input value={form.taxId} onChange={event => update("taxId", event.target.value)} type="text" autoComplete="off" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
            </label>

            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Business address</span>
              <textarea value={form.address} onChange={event => update("address", event.target.value)} autoComplete="street-address" rows={3} className="mt-1 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-2.5 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
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
