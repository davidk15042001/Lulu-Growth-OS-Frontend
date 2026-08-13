import { useState, type FormEvent } from "react";
import { ArrowRight, Building2, Check, ShieldCheck, Sparkles } from "lucide-react";
type CompanyForm = {
  companyName: string;
  industry: string;
  companySize: string;
  countryRegion: string;
};
const setupSteps = ["Company Information", "Business Description", "Products & Services", "Existing Platforms", "Integrations", "AI Preferences", "Setup Complete"];
export const CompanyInformation = () => {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<CompanyForm>({
    companyName: "Acme Technologies GmbH",
    industry: "B2B SaaS",
    companySize: "51–200",
    countryRegion: "Germany"
  });
  const update = (key: keyof CompanyForm, value: string) => {
    setForm({
      ...form,
      [key]: value
    });
    setSaved(false);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };
  return <main className="grid min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] lg:grid-cols-2">
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
                Step 1 of 7
              </p>
            </div>
            <ol className="grid grid-cols-7 gap-1.5">
              {setupSteps.map((step, index) => <li key={step} className="min-w-0">
                  <span className={`block h-1.5 rounded-full ${index === 0 ? "bg-[var(--primary)]" : "bg-[var(--secondary)]"}`} title={step} />
                
                  <span className="sr-only">{step}</span>
                </li>)}
            </ol>
          </nav>

          <p className="mt-10 text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
            <span>01 / 07 · Company profile</span>
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

            <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 focus:ring-offset-[var(--border)]">
              
              <span>{saved ? "Saved" : "Save changes"}</span>
              {saved ? <Check size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
            </button>

            {saved ? <p className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]" role="status">
              
                <Check size={15} aria-hidden="true" />
                <span>Company information saved.</span>
              </p> : null}
          </form>
        </div>
      </section>

      <aside className="hidden border-l border-[var(--border)] bg-[var(--sidebar)] p-12 text-[var(--foreground)] lg:flex lg:flex-col lg:justify-between">
        <Sparkles size={42} className="text-[var(--foreground)]" aria-hidden="true" />
        
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)]">
            <Building2 size={16} aria-hidden="true" />
            <span>Business context</span>
          </div>
          <h2 className="max-w-lg text-5xl font-semibold leading-tight text-[var(--foreground)]">
            <span>Give Lulu the company signal it needs.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-[var(--muted-foreground)]">
            <span>
              Your profile helps Lulu understand your market, size and operating
              region before it generates recommendations.
            </span>
          </p>
        </div>
        <p className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>Secure business onboarding</span>
        </p>
      </aside>
    </main>;
};