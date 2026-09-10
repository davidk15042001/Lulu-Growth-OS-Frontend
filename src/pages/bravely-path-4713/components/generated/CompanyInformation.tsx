import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { navigateApp, routes } from '../../../../routing';
import { ApiError, getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { clearSelectedWorkspaceId, clearStoredUser, getSelectedWorkspaceId, setSelectedWorkspaceId } from '../../../../api/session';
import { OnboardingHeader } from '../../../../components/OnboardingHeader';
import { useLuluApp } from '../../../../api/LuluAppContext';
type CompanyForm = {
  fullName: string;
  password: string;
  repeatPassword: string;
  companyName: string;
  industry: string;
  countryRegion: string;
  taxId: string;
  address: string;
};
export const CompanyInformation = () => {
  const { currentUser } = useLuluApp();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword,setShowPassword]=useState(false);
  const [form, setForm] = useState<CompanyForm>({
    fullName: [currentUser?.firstName,currentUser?.lastName].filter(Boolean).join(' '),
    password: "",
    repeatPassword: "",
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
        fullName: [currentUser?.firstName,currentUser?.lastName].filter(Boolean).join(' '),
        password: '', repeatPassword: '',
        companyName: response.data.workspace.companyName,
        industry: response.data.workspace.industry ?? '',
        countryRegion: response.data.workspace.countryRegion ?? '',
        taxId: response.data.workspace.taxId ?? '',
        address: response.data.workspace.address ?? '',
      }))
      .catch(() => undefined);
  }, [currentUser?.firstName,currentUser?.lastName]);
  const update = (key: keyof CompanyForm, value: string) => {
    setForm({
      ...form,
      [key]: value
    });
    setSaved(false);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.password || form.password !== form.repeatPassword || !form.companyName.trim() || !form.industry.trim() || loading) return;
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
        password: form.password,
        repeatPassword: form.repeatPassword,
        companyName: form.companyName,
        industry: form.industry || null,
        countryRegion: form.countryRegion || null,
        taxId: form.taxId || null,
        address: form.address || null,
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

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span>Password</span><span className="relative mt-1 block"><input required value={form.password} onChange={event=>update('password',event.target.value)} type={showPassword?'text':'password'} autoComplete="current-password" className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 pr-10 text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--ring)]"/><button type="button" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?'Hide password':'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--muted-foreground)]">{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></span></label>
              <label className="block text-sm font-medium text-[var(--muted-foreground)]"><span>Repeat password</span><input required value={form.repeatPassword} onChange={event=>update('repeatPassword',event.target.value)} type={showPassword?'text':'password'} autoComplete="current-password" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--ring)]"/></label>
            </div>
            {form.repeatPassword&&form.password!==form.repeatPassword?<p className="text-xs font-medium text-[var(--destructive)]">Passwords do not match.</p>:null}

            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Legal company name</span>
              <input required value={form.companyName} onChange={event => update("companyName", event.target.value)} type="text" autoComplete="organization" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <label className="block text-sm font-medium text-[var(--muted-foreground)]">
              <span>Industry</span>
              <input required value={form.industry} onChange={event => update("industry", event.target.value)} type="text" autoComplete="organization-title" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" />
              
            </label>

            <button type="submit" disabled={loading || !form.fullName.trim() || !form.password || form.password!==form.repeatPassword || !form.companyName.trim() || !form.industry.trim()} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 focus:ring-offset-[var(--border)]">
              
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
