import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { navigateApp, routes } from '../../../../routing';
import { ApiError, getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { clearSelectedWorkspaceId, clearStoredUser, getSelectedWorkspaceId, setSelectedWorkspaceId } from '../../../../api/session';
import { OnboardingHeader } from '../../../../components/OnboardingHeader';
import { useLuluApp } from '../../../../api/LuluAppContext';
type HasWebsiteChoice = "" | "yes" | "no";
type CompanyForm = {
  fullName: string;
  companyName: string;
  industry: string;
  countryRegion: string;
  taxId: string;
  address: string;
  hasWebsite: HasWebsiteChoice;
};
type CompanyInformationSnapshot = {
  workspace: Partial<CompanyForm>;
  aiPreferences: { detectionSettings?: Record<string, boolean> } | null;
};
export const CompanyInformation = () => {
  const { currentUser } = useLuluApp();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CompanyForm>({
    fullName: [currentUser?.firstName,currentUser?.lastName].filter(Boolean).join(' '),
    companyName: "",
    industry: "",
    countryRegion: "",
    taxId: "",
    address: "",
    hasWebsite: ""
  });
  useEffect(() => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    requestApi<CompanyInformationSnapshot>({ path: `/workspaces/${workspaceId}/onboarding` })
      .then(response => {
        const hasExistingWebsite = response.data.aiPreferences?.detectionSettings?.hasExistingWebsite;
        setForm({
          fullName: [currentUser?.firstName,currentUser?.lastName].filter(Boolean).join(' '),
          companyName: response.data.workspace.companyName ?? '',
          industry: response.data.workspace.industry ?? '',
          countryRegion: response.data.workspace.countryRegion ?? '',
          taxId: response.data.workspace.taxId ?? '',
          address: response.data.workspace.address ?? '',
          hasWebsite: hasExistingWebsite === true ? "yes" : hasExistingWebsite === false ? "no" : "",
        });
      })
      .catch(() => undefined);
  }, [currentUser?.firstName,currentUser?.lastName]);
  const update = <K extends keyof CompanyForm>(key: K, value: CompanyForm[K]) => {
    setForm({
      ...form,
      [key]: value
    });
    setSaved(false);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.companyName.trim() || !form.industry.trim() || !form.hasWebsite || loading) return;
    setLoading(true);
    setError('');
    try {
      let workspaceId = getSelectedWorkspaceId();
      if (workspaceId) {
        const workspaces = await requestApi<{ items: Array<{ id: string }> }>({ path: '/workspaces' });
        if (!workspaces.data.items.some(item => item.id === workspaceId)) {
          workspaceId = workspaces.data.items[0]?.id ?? null;
          if (workspaceId) setSelectedWorkspaceId(workspaceId);
          else clearSelectedWorkspaceId();
        }
      }
      if (!workspaceId) {
        const created = await requestApi<{ id: string }>({ path: '/workspaces', method: 'POST', body: {
          companyName: form.companyName.trim(),
          industry: form.industry.trim(),
        } });
        workspaceId = created.data.id;
        setSelectedWorkspaceId(workspaceId);
      }
      await requestApi({ path: `/workspaces/${workspaceId}/onboarding/company-information`, method: 'PATCH', body: {
        fullName: form.fullName,
        companyName: form.companyName,
        industry: form.industry || null,
        countryRegion: form.countryRegion || null,
        taxId: form.taxId || null,
        address: form.address || null,
        hasWebsite: form.hasWebsite === "yes",
      } });
      setSaved(true);
      window.location.assign(routes.onboarding.billing);
    } catch (cause) {
      if (cause instanceof ApiError && (cause.status === 401 || cause.code === 'SESSION_REFRESH_UNAVAILABLE')) {
        clearStoredUser();
        clearSelectedWorkspaceId();
        navigateApp(routes.auth.login, { replace: true });
        return;
      }
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
            <span>01 / 04 · Secure account &amp; company</span>
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-[var(--foreground)] sm:text-4xl">
            <span>Company information</span>
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
            <span>
              Confirm the account owner and the business Lulu will operate for.
            </span>
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)]" aria-label="Company information onboarding form">
            
            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Full name</span>
              <input required value={form.fullName} onChange={event => update("fullName", event.target.value)} type="text" autoComplete="name" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--ring)]" />
            </label>

            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Legal company name</span>
              <input required value={form.companyName} onChange={event => update("companyName", event.target.value)} type="text" autoComplete="organization" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Industry</span>
              <input required value={form.industry} onChange={event => update("industry", event.target.value)} type="text" autoComplete="organization-title" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-[var(--muted-foreground)]">Do you already have a website?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={`cursor-pointer rounded-md border p-3 transition ${form.hasWebsite === "yes" ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)]" : "border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}>
                  <input className="sr-only" required type="radio" name="hasWebsite" value="yes" checked={form.hasWebsite === "yes"} onChange={event => update("hasWebsite", event.target.value as HasWebsiteChoice)} />
                  <span className="block text-sm font-semibold text-[var(--foreground)]">Yes, we have one</span>
                  <span className="mt-1 block text-xs leading-5">Website, SEO, GEO and AEO agents stay hidden.</span>
                </label>
                <label className={`cursor-pointer rounded-md border p-3 transition ${form.hasWebsite === "no" ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)]" : "border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}>
                  <input className="sr-only" required type="radio" name="hasWebsite" value="no" checked={form.hasWebsite === "no"} onChange={event => update("hasWebsite", event.target.value as HasWebsiteChoice)} />
                  <span className="block text-sm font-semibold text-[var(--foreground)]">No website yet</span>
                  <span className="mt-1 block text-xs leading-5">Lulu can show website growth surfaces.</span>
                </label>
              </div>
            </fieldset>

            <button type="submit" disabled={loading || !form.fullName.trim() || !form.companyName.trim() || !form.industry.trim() || !form.hasWebsite} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 focus:ring-offset-[var(--border)]">
              
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
