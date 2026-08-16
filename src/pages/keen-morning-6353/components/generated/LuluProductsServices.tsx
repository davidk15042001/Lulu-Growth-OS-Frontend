import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, CircleHelp, DollarSign, PackageOpen, Sparkles, Star, Tags, Trash2, Upload, X } from "lucide-react";
import { navigateApp, routes } from '../../../../routing';
import { getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { getSelectedWorkspaceId } from '../../../../api/session';
type OfferingType = "Product" | "Service";
type OfferingStatus = "Active" | "Coming Soon" | "Planned" | "Discontinued";
type Offering = {
  id: string;
  name: string;
  type: OfferingType;
  category: string;
  description: string;
  customer: string;
  problem: string;
  value: string;
  pricing: string;
  price: string;
  status: OfferingStatus;
  primary: boolean;
  url: string;
  tags: string[];
};
type FieldProps = {
  label: string;
  children: ReactNode;
  hint?: string;
  required?: boolean;
};
const initialOfferings: Offering[] = [{
  id: "lulu-platform",
  name: "Lulu AI Platform",
  type: "Product",
  category: "Software · Marketing",
  description: "An intelligent growth platform that turns customer signals into clear, actionable marketing opportunities.",
  customer: "B2B · Mid-market",
  problem: "Growth teams need a faster way to connect insight with execution.",
  value: "One intelligent workspace for finding and acting on the next best opportunity.",
  pricing: "Subscription",
  price: "$299 / month",
  status: "Active",
  primary: true,
  url: "https://www.lulu.ai/platform",
  tags: ["Enterprise", "SaaS", "Best Seller"]
}, {
  id: "growth-consulting",
  name: "Growth Strategy Consulting",
  type: "Service",
  category: "Consulting",
  description: "Focused advisory engagements for teams building a more intelligent, measurable growth system.",
  customer: "B2B · Startups",
  problem: "Leaders need experienced guidance to prioritize the work that matters.",
  value: "A practical growth roadmap shaped around your customers, market, and team.",
  pricing: "Project-based",
  price: "From $4,500",
  status: "Active",
  primary: false,
  url: "",
  tags: ["Consulting", "High Margin"]
}];
const stepItems = [{
  id: "company-information",
  label: "Company Information",
  state: "complete"
}, {
  id: "business-description",
  label: "Business Description",
  state: "complete"
}, {
  id: "products-services",
  label: "Products & Services",
  state: "current"
}, {
  id: "existing-platforms",
  label: "Existing Platforms",
  state: "upcoming"
}, {
  id: "integrations",
  label: "Integrations",
  state: "upcoming"
  }, {
  id: "setup-complete",
  label: "Setup Complete",
  state: "upcoming"
}];
const offeringTypeOptions: {
  id: OfferingType;
  label: string;
}[] = [{
  id: "Product",
  label: "Product"
}, {
  id: "Service",
  label: "Service"
}];
const pricingModels = [{
  id: "one-time",
  label: "One-time purchase"
}, {
  id: "subscription",
  label: "Subscription"
}, {
  id: "usage-based",
  label: "Usage-based"
}, {
  id: "freemium",
  label: "Freemium"
}, {
  id: "commission",
  label: "Commission"
}, {
  id: "hourly",
  label: "Hourly"
}, {
  id: "project-based",
  label: "Project-based"
}, {
  id: "quote-based",
  label: "Quote-based"
}, {
  id: "custom",
  label: "Custom"
}, {
  id: "free",
  label: "Free"
}, {
  id: "other",
  label: "Other"
}];
const statusOptions: {
  id: OfferingStatus;
  label: OfferingStatus;
}[] = [{
  id: "Active",
  label: "Active"
}, {
  id: "Coming Soon",
  label: "Coming Soon"
}, {
  id: "Planned",
  label: "Planned"
}, {
  id: "Discontinued",
  label: "Discontinued"
}];
const emptyOffering = (): Offering => ({
  id: "",
  name: "",
  type: "Product",
  category: "",
  description: "",
  customer: "",
  problem: "",
  value: "",
  pricing: "Subscription",
  price: "",
  status: "Active",
  primary: false,
  url: "",
  tags: []
});
const inputClass = "mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--border)]";
const textareaClass = "mt-1 min-h-24 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]";
function Logo() {
  return <div className="flex items-center gap-2" aria-label="Lulu AI">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] font-bold text-primary-foreground">
        <span>L</span>
      </span>
      <strong className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
        <span>Lulu AI</span>
      </strong>
    </div>;
}
function Field({
  label,
  children,
  hint,
  required = false
}: FieldProps) {
  return <label className="block text-sm text-[var(--muted-foreground)]">
      <span className="font-medium">
        <span>{label}</span>
        {required ? <span className="ml-1 text-[var(--foreground)]">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs leading-5 text-[var(--muted-foreground)]">
          {hint}
        </span> : null}
    </label>;
}
function RightPanel() {
  return <aside className="hidden border-l border-[var(--border)] bg-[var(--sidebar)] p-8 text-[var(--foreground)] lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between xl:p-12">
      <div className="flex items-center justify-between">
        <Sparkles size={42} className="text-[var(--foreground)]" aria-hidden="true" />
        
        <span className="rounded-full border border-[var(--border)] bg-card px-3 py-1 text-xs font-medium text-[var(--foreground)]">
          <span>Step 3 of 5</span>
        </span>
      </div>

      <section aria-labelledby="context-heading" className="max-w-xl">
        <p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
          <span>Your offerings</span>
        </p>
        <h2 id="context-heading" className="mt-3 text-5xl font-semibold leading-tight tracking-[-0.045em] text-[var(--foreground)]">
          
          <span>Teach Lulu what your business sells.</span>
        </h2>
        <p className="mt-5 text-lg leading-8 text-[var(--muted-foreground)]">
          <span>
            Lulu AI uses products, services, pricing and differentiators to
            connect your company profile with better customer, marketing and
            growth recommendations.
          </span>
        </p>
      </section>

    </aside>;
}
export function LuluProductsServices() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [editing, setEditing] = useState<Offering>(emptyOffering());
  const [selectedId, setSelectedId] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    requestApi<{ offerings: Array<{
      id: string;
      name: string;
      offeringType: 'product' | 'service';
      category: string | null;
      description: string | null;
      targetCustomer: string | null;
      customerProblem: string | null;
      valueProposition: string | null;
      pricingModel: string | null;
      priceLabel: string | null;
      status: 'draft' | 'active' | 'inactive' | 'archived';
      url: string | null;
    }> }>({ path: `/workspaces/${workspaceId}/onboarding` }).then(response => {
      const loaded = response.data.offerings.map(item => ({
        id: item.id,
        name: item.name,
        type: item.offeringType === 'product' ? 'Product' as const : 'Service' as const,
        category: item.category ?? '',
        description: item.description ?? '',
        customer: item.targetCustomer ?? '',
        problem: item.customerProblem ?? '',
        value: item.valueProposition ?? '',
        pricing: item.pricingModel ?? 'Subscription',
        price: item.priceLabel ?? '',
        status: item.status === 'active' ? 'Active' as const : item.status === 'draft' ? 'Planned' as const : 'Discontinued' as const,
        primary: false,
        url: item.url ?? '',
        tags: [],
      }));
      setOfferings(loaded);
      setSelectedId(loaded[0]?.id ?? '');
    }).catch(() => setToast('Unable to load offerings'));
  }, []);
  const completenessItems = useMemo(() => [{
    id: "names",
    label: "Offering names",
    done: offerings.every(item => item.name)
  }, {
    id: "descriptions",
    label: "Descriptions",
    done: offerings.every(item => item.description)
  }, {
    id: "categories",
    label: "Categories",
    done: offerings.every(item => item.category)
  }, {
    id: "customers",
    label: "Target customers",
    done: offerings.every(item => item.customer)
  }, {
    id: "values",
    label: "Value propositions",
    done: offerings.every(item => item.value)
  }], [offerings]);
  const completeness = offerings.length ? Math.round(completenessItems.filter(item => item.done).length / completenessItems.length * 100) : 0;
  const selectedOffering = offerings.find(item => item.id === selectedId) ?? offerings[0];
  async function saveOffering(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing.name.trim()) return;
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    const body = {
      name: editing.name,
      offeringType: editing.type.toLowerCase(),
      category: editing.category || null,
      description: editing.description || null,
      targetCustomer: editing.customer || null,
      customerProblem: editing.problem || null,
      valueProposition: editing.value || null,
      pricingModel: editing.pricing || null,
      priceLabel: editing.price || null,
      status: editing.status === 'Active' ? 'active' : editing.status === 'Discontinued' ? 'inactive' : 'draft',
      url: editing.url || null,
    };
    try {
      const response = await requestApi<{ id: string }>({
        path: `/workspaces/${workspaceId}/onboarding/offerings${editing.id ? `/${editing.id}` : ''}`,
        method: editing.id ? 'PATCH' : 'POST',
        body,
      });
      const next = { ...editing, id: editing.id || response.data.id };
      setOfferings(current => editing.id ? current.map(item => item.id === editing.id ? next : item) : [...current, next]);
      setSelectedId(next.id);
      setEditing(emptyOffering());
      setToast("Offering saved");
    } catch (cause) {
      setToast(getFriendlyErrorMessage(cause, 'We could not save this product or service. Please try again.'));
    }
    window.setTimeout(() => setToast(""), 2200);
  }
  async function removeOffering(id: string) {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    try {
      await requestApi({ path: `/workspaces/${workspaceId}/onboarding/offerings/${id}`, method: 'DELETE' });
      setOfferings(current => current.filter(item => item.id !== id));
      setSelectedId(offerings.find(item => item.id !== id)?.id ?? "");
      setToast("Product or service removed");
    } catch (cause) {
      setToast(getFriendlyErrorMessage(cause, 'We could not remove this product or service. Please try again.'));
    }
    window.setTimeout(() => setToast(""), 2200);
  }
  function loadOffering(item: Offering) {
    setEditing(item);
    setSelectedId(item.id);
  }
  return <main className="min-h-screen bg-[var(--background)] font-[Inter,sans-serif] text-[var(--foreground)] lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,.88fr)]">
      <section className="flex justify-center px-4 py-6 sm:px-8 lg:items-start lg:px-12 lg:py-12 xl:px-16">
        <div className="w-full max-w-2xl">
          <Logo />

          <nav aria-label="Setup progress" className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.05)] sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
                <span>Company setup</span>
              </p>
              <p className="text-xs font-medium text-[var(--foreground)]">
                <span>Step 3 of 5</span>
              </p>
            </div>
            <ol className="grid grid-cols-5 gap-1.5" aria-label="Company setup steps">
              
              {stepItems.map(step => <li key={step.id} className="min-w-0">
                  <span className={`block h-1.5 rounded-full ${step.state === "complete" ? "bg-[var(--primary)]" : step.state === "current" ? "bg-[var(--primary)]" : "bg-[var(--secondary)]"}`} title={step.label} />
                
                  <span className="sr-only">{step.label}</span>
                </li>)}
            </ol>
          </nav>

          <section className="mt-8" aria-labelledby="products-heading">
            <p className="text-xs font-medium uppercase tracking-[.18em] text-[var(--foreground)]">
              <span>03 / 05 · Your offerings</span>
            </p>
            <h1 id="products-heading" className="mt-3 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">
              
              <span>Products &amp; Services</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
              <span>
                Tell Lulu AI what you sell, provide and deliver to your
                customers.
              </span>
            </p>
            <button type="button" onClick={() => setShowHelp(!showHelp)} className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-md">
              
              <CircleHelp size={16} aria-hidden="true" />
              <span>Why does Lulu AI need my products and services?</span>
            </button>
            {showHelp ? <p role="status" className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-sm leading-6 text-[var(--muted-foreground)] shadow-sm">
              
                <span>
                  Your offerings help Lulu AI understand what your business
                  sells and identify relevant opportunities across marketing,
                  search visibility, customers and growth.
                </span>
              </p> : null}
          </section>

          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--primary)]/[0.045] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.06)] sm:p-6" aria-labelledby="offer-question">
            
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--primary)] text-primary-foreground shadow-sm">
                <Sparkles size={18} aria-hidden="true" />
              </span>
              <div>
                <h2 id="offer-question" className="text-base font-semibold text-[var(--foreground)]">
                  
                  <span>What does your business offer?</span>
                </h2>
                <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                  <span>
                    Add the products and services that are most important to
                    your business. This helps Lulu AI understand what you sell,
                    who it’s for and where your growth opportunities may be.
                  </span>
                </p>
              </div>
            </div>
          </section>

          <form onSubmit={saveOffering} className="mt-6 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.09)] sm:p-7">
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  <span>What do you offer? </span>
                  <span className="text-[var(--foreground)]">*</span>
                </h2>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  <span>Choose the offering types you want to add.</span>
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Name" required>
                  <input value={editing.name} onChange={event => setEditing({
                  ...editing,
                  name: event.target.value
                })} placeholder="Enter product or service name" className={inputClass} required />
                  
                </Field>
              </div>

              <Field label="Category">
                <input value={editing.category} onChange={event => setEditing({
                ...editing,
                category: event.target.value
              })} placeholder="e.g. Software · Marketing" className={inputClass} />
                
              </Field>

              <div className="sm:col-span-2">
                <Field label="Description" hint="Include important features, benefits or outcomes when relevant.">
                  
                  <textarea value={editing.description} onChange={event => setEditing({
                  ...editing,
                  description: event.target.value
                })} placeholder="Describe this product or service and the value it provides." className={textareaClass} />
                  
                </Field>
              </div>

              <Field label="Product / Service URL">
                <input type="url" value={editing.url} onChange={event => setEditing({
                ...editing,
                url: event.target.value
              })} placeholder="https://www.example.com/product" className={inputClass} />
                
              </Field>

              <label className="flex h-11 items-center gap-3 self-end rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--muted-foreground)]">
                <input type="checkbox" checked={editing.primary} onChange={event => setEditing({
                ...editing,
                primary: event.target.checked
              })} className="h-4 w-4 accent-[var(--primary)]" />
                
                <span>
                  <span className="block font-medium text-[var(--foreground)]">
                    Mark as Primary
                  </span>
                </span>
              </label>

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-[var(--border)] bg-[var(--secondary)] p-4 text-sm text-[var(--muted-foreground)] hover:border-[var(--border)]">
                  <Upload size={17} aria-hidden="true" />
                  <span>
                    <span className="block font-medium text-[var(--foreground)]">
                      Upload product image
                    </span>
                    <small className="block text-xs text-[var(--muted-foreground)]">
                      PNG, JPG or SVG · optional
                    </small>
                  </span>
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="sr-only" />
                  
                </label>
              </div>
            </div>

            <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] font-semibold text-primary-foreground shadow-[0_12px_28px_color-mix(in_srgb,var(--primary)_24%,transparent)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_color-mix(in_srgb,var(--primary)_30%,transparent)] active:translate-y-0">
              
              <span>
                {editing.id ? "Save offering" : "Add Product or Service"}
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>

          {selectedOffering ? <section className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.07)] sm:p-6" aria-labelledby="understanding-heading">
            
              <div className="flex items-center gap-2">
                <Sparkles size={17} className="text-[var(--foreground)]" aria-hidden="true" />
              
                <h2 id="understanding-heading" className="text-base font-semibold text-[var(--foreground)]">
                
                  <span>Lulu AI Understanding</span>
                </h2>
              </div>
              <span className="mt-3 inline-block rounded-full border border-[var(--border)] bg-[var(--secondary)] px-2 py-1 text-[11px] font-medium text-[var(--foreground)]">
                <span>AI-generated summary</span>
              </span>
              <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                <span>Your company primarily offers </span>
                <strong className="font-semibold text-[var(--foreground)]">
                  {selectedOffering.category || selectedOffering.type}
                </strong>
                <span> for </span>
                <strong className="font-semibold text-[var(--foreground)]">
                  {selectedOffering.customer || "your target customers"}
                </strong>
                <span>. </span>
                <strong className="font-semibold text-[var(--foreground)]">
                  {selectedOffering.name}
                </strong>
                <span>
                  {" "}
                  is positioned around:{" "}
                  {selectedOffering.value || selectedOffering.description}
                </span>
              </p>
            </section> : null}

          <footer className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={() => navigateApp(routes.onboarding.businessDescription)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--foreground)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-md">
              
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back</span>
            </button>
            <button type="button" disabled={offerings.length === 0} onClick={() => navigateApp(routes.onboarding.existingPlatforms)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_color-mix(in_srgb,var(--primary)_24%,transparent)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_color-mix(in_srgb,var(--primary)_30%,transparent)] disabled:cursor-not-allowed disabled:opacity-50">
              
              <span>Continue</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </footer>
        </div>
      </section>

      <RightPanel />

      {toast ? <div role="status" className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--border)] bg-card px-4 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        
          <Check size={15} aria-hidden="true" />
          <span>{toast}</span>
          <button type="button" onClick={() => setToast("")} aria-label="Dismiss notification" className="rounded-full p-1 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]">
          
            <X size={13} aria-hidden="true" />
          </button>
        </div> : null}
    </main>;
}
