import { useEffect, useState } from "react";
import { ArrowRight, Check, Lock, ShieldCheck, Sparkles, WandSparkles, Zap } from "lucide-react";
import { getFriendlyErrorMessage, getTechnicalErrorDetails } from "../api/client";
import { onboardingApi } from "../api/onboarding";
import { workspaceAppApi } from "../api/workspace-app";
import { navigateApp, routes } from "../routing";
import { useLuluApp } from "../api/LuluAppContext";

type PlanId = "starter" | "ai" | "test";
 type Plan = { id: PlanId; name: string; eyebrow: string; description: string; icon: typeof Zap; accent: string; features: string[]; limitations: string; price: string; pricePeriod: string; cta: string };

const plans: Plan[] = [
  { id: "starter", name: "Starter", eyebrow: "Take action yourself", description: "Automatically analyze all workspace statistics with AI. General recommendations and actions stay off; SEO, GEO, AEO and Website are automated exceptions.", icon: Zap, accent: "bg-[var(--primary)] text-[var(--primary-foreground)]", features: ["Automatic AI analysis and statistics across the workspace", "All workspace and platform data stays available", "Automatic SEO, GEO, AEO and Website recommendations and actions", "General recommendations and actions remain disabled"], limitations: "No general recommendations or actions outside SEO, GEO, AEO and Website", price: "RMB 4,200", pricePeriod: "per year", cta: "Choose Starter" },
  { id: "ai", name: "AI", eyebrow: "Let Lulu run growth", description: "Give Lulu the authority to recommend, execute and automate the work across your workspace.", icon: WandSparkles, accent: "bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--primary)]/20", features: ["Everything in Starter", "AI insights and recommendations", "AI-assisted content and decisions", "Full automation of supported workflows"], limitations: "You stay in control with configurable approvals and safeguards", price: "RMB 30,000", pricePeriod: "per year", cta: "Choose AI" },
  { id: "test", name: "Test", eyebrow: "Full AI access for verification", description: "Use the complete AI package without payment. Enter the Test confirmation password to continue.", icon: WandSparkles, accent: "bg-[var(--secondary)] text-[var(--foreground)] border border-dashed border-[var(--primary)]/40", features: ["Everything in AI", "Full AI analysis, recommendations and actions", "Full automation of supported workflows", "Ideal for production checkout verification"], limitations: "No payment is collected. A confirmation password is required.", price: "Free", pricePeriod: "confirmation password required", cta: "Choose Test" },
];

const capabilityRows = [
  ["View dashboards, reports and connected data", true, true, true],
  ["Manage workspace content and settings", true, true, true],
  ["Manage connected websites and platforms", true, true, true],
  ["Automatic AI analysis and statistics", true, true, true],
  ["SEO, GEO, AEO and Website automation", true, true, true],
] as const;

export function DashboardBilling() {
  const { selectedWorkspace, refresh } = useLuluApp();
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [technicalError, setTechnicalError] = useState<string | null>(null);
  const [testPassword, setTestPassword] = useState("");
  const [paymentWaiting, setPaymentWaiting] = useState(new URLSearchParams(window.location.search).get("payment") === "success");

  useEffect(() => {
    if (!selectedWorkspace) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await workspaceAppApi.billing(selectedWorkspace.id);
        if (!active) return;
        const subscription = response.data.subscription;
        setCurrentPlan(subscription?.planKey ?? null);
        setSubscriptionStatus(subscription?.status ?? null);
        setPeriodEnd(subscription?.currentPeriodEndsAt ?? null);
      } catch (cause) {
        if (active) { setError(getFriendlyErrorMessage(cause, "We could not load the billing status.")); setTechnicalError(getTechnicalErrorDetails(cause)); }
      } finally { if (active) setLoading(false); }
    };
    void load();
    return () => { active = false; };
  }, [selectedWorkspace]);

  useEffect(() => {
    if (!paymentWaiting || !selectedWorkspace) return;
    let active = true;
    let attempts = 0;
    let timer: number | undefined;
    const poll = async () => {
      try {
        const response = await workspaceAppApi.billing(selectedWorkspace.id);
        const subscription = response.data.subscription;
        if (subscription?.status === "active") {
          await refresh();
          if (active) { setPaymentWaiting(false); setCurrentPlan(subscription.planKey); setSubscriptionStatus(subscription.status); setPeriodEnd(subscription.currentPeriodEndsAt); }
          return;
        }
        attempts += 1;
        if (attempts >= 30) { if (active) { setPaymentWaiting(false); setError("Payment returned, but the subscription confirmation has not arrived yet."); setTechnicalError("Code: PAYMENT_CONFIRMATION_TIMEOUT"); } return; }
        timer = window.setTimeout(() => void poll(), 2000);
      } catch (cause) { if (active) { setPaymentWaiting(false); setError("Payment returned, but billing status could not be loaded."); setTechnicalError(getTechnicalErrorDetails(cause)); } }
    };
    void poll();
    return () => { active = false; if (timer !== undefined) window.clearTimeout(timer); };
  }, [paymentWaiting, refresh, selectedWorkspace]);

  const choosePlan = async () => {
    if (!selectedPlan || !selectedWorkspace || submitting) return;
    setSubmitting(true); setError(null); setTechnicalError(null);
    try {
      const response = await onboardingApi.createBillingCheckout(selectedWorkspace.id, { planKey: selectedPlan, successUrl: `${window.location.origin}${window.location.pathname}?payment=success`, backUrl: `${window.location.origin}${window.location.pathname}?payment=cancelled`, ...(selectedPlan === "test" && testPassword ? { password: testPassword } : {}) });
      if (response.data.free) { await refresh(); setCurrentPlan(selectedPlan); setSubscriptionStatus("active"); setSubmitting(false); return; }
      if (!response.data.checkoutUrl) throw new Error("Airwallex did not return a checkout URL.");
      window.location.assign(response.data.checkoutUrl);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not start the billing checkout.")); setTechnicalError(getTechnicalErrorDetails(cause)); setSubmitting(false); }
  };

  if (!selectedWorkspace) return null;
  const selected = plans.find((plan) => plan.id === selectedPlan);
  const activePlan = plans.find((plan) => plan.id === currentPlan);

  return <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"><div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-12"><header className="flex flex-col gap-6 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--muted-foreground)]">Workspace billing</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">Choose how Lulu works for you.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted-foreground)]">The same access levels as onboarding, now connected to your live workspace subscription.</p></div><button type="button" onClick={() => navigateApp(routes.app.dashboard)} className="text-sm font-semibold underline underline-offset-4">Back to dashboard</button></header>
    {loading ? <div className="py-14 text-sm text-[var(--muted-foreground)]">Loading live billing status…</div> : <><section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-5 sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted-foreground)]">Current workspace plan</p><p className="mt-2 text-xl font-semibold">{activePlan?.name ?? "No confirmed plan"}</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">Status: {subscriptionStatus ?? "not confirmed"}{periodEnd ? ` · Current period ends ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(periodEnd))}` : ""}</p></div><ShieldCheck size={22} /></div></section>
    <section aria-label="Available plans" className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{plans.map((plan) => { const Icon = plan.icon; const isSelected = selectedPlan === plan.id; const isCurrent = currentPlan === plan.id && subscriptionStatus === "active"; return <article key={plan.id} className={`relative flex flex-col rounded-2xl border p-6 transition sm:p-7 ${isSelected ? "border-[var(--foreground)] shadow-[0_20px_60px_rgba(0,0,0,0.10)]" : "border-[var(--border)] bg-[var(--card)]"}`}>{plan.id === "ai" && <span className="absolute right-5 top-5 rounded-full bg-[var(--foreground)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--background)]">Recommended</span>}<div className={`grid h-10 w-10 place-items-center rounded-xl ${plan.accent}`}><Icon size={19} /></div><p className="mt-6 text-xs font-semibold uppercase tracking-[.16em] text-[var(--muted-foreground)]">{plan.eyebrow}</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{plan.name}</h2><div className="mt-4 flex items-baseline gap-2"><span className="text-2xl font-semibold tracking-[-0.04em]">{plan.price}</span><span className="text-xs text-[var(--muted-foreground)]">{plan.pricePeriod}</span></div><p className="mt-3 min-h-20 text-sm leading-6 text-[var(--muted-foreground)]">{plan.description}</p><div className="my-6 h-px bg-[var(--border)]" /><ul className="space-y-3 text-sm leading-6">{plan.features.map((feature) => <li key={feature} className="flex items-start gap-2.5"><Check size={16} className="mt-1 shrink-0" /><span>{feature}</span></li>)}</ul><p className="mt-6 flex items-start gap-2 text-xs leading-5 text-[var(--muted-foreground)]"><Lock size={14} className="mt-0.5 shrink-0" /><span>{plan.limitations}</span></p><button type="button" onClick={() => { setSelectedPlan(plan.id); if (plan.id !== "test") setTestPassword(""); }} disabled={isCurrent} aria-pressed={isSelected} className={`mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${isCurrent ? "bg-[var(--secondary)] text-[var(--muted-foreground)]" : isSelected ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "border border-[var(--border)] bg-[var(--card)] hover:border-[var(--foreground)]"}`}>{isCurrent ? "Current plan" : isSelected ? <><Check size={16} />Selected</> : plan.cta}</button></article>; })}</section>
    <section className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"><div className="border-b border-[var(--border)] px-5 py-5 sm:px-7"><h2 className="text-lg font-semibold">Compare access levels</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">Every plan uses the same connected business context. The difference is what Lulu can do with it.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="border-b border-[var(--border)] text-xs uppercase tracking-[.12em] text-[var(--muted-foreground)]"><th className="px-5 py-4 font-semibold sm:px-7">Capability</th>{plans.map((plan) => <th key={plan.id} className="px-4 py-4 text-center font-semibold">{plan.name}</th>)}</tr></thead><tbody>{capabilityRows.map(([label, starter, ai, test]) => <tr key={label} className="border-b border-[var(--border)] last:border-0"><th className="px-5 py-4 font-medium sm:px-7">{label}</th>{[starter, ai, test].map((enabled, index) => <td key={`${label}-${index}`} className="px-4 py-4 text-center">{enabled ? <Check className="mx-auto" size={17} /> : <span className="text-[var(--muted-foreground)]">—</span>}</td>)}</tr>)}</tbody></table></div></section>
    <footer className="mt-8 flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="flex items-start gap-3"><Sparkles size={19} className="mt-0.5 shrink-0" /><div><p className="text-sm font-semibold">{paymentWaiting ? "Payment received — confirming your subscription…" : selected ? `Selected plan: ${selected.name}` : activePlan ? `Current plan: ${activePlan.name}` : "Choose a plan"}</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">{paymentWaiting ? "We are waiting for Airwallex to confirm the payment." : selected?.description ?? "Select a plan to change workspace access."}</p>{error && <p className="mt-2 text-sm text-[var(--destructive)]" role="alert">{error}</p>}{technicalError && <details className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-left"><summary className="cursor-pointer text-xs font-semibold">Show technical details</summary><p className="mt-2 break-words font-mono text-[11px] leading-5 text-[var(--muted-foreground)]">{technicalError}</p></details>}</div></div>{selectedPlan === "test" && <label className="w-full text-xs font-semibold text-[var(--foreground)] sm:max-w-[280px]">Test confirmation password<input value={testPassword} onChange={(event) => setTestPassword(event.target.value)} type="password" autoComplete="off" placeholder="Enter the Test password" className="mt-1 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--primary)]" /></label>}<button type="button" onClick={() => void choosePlan()} disabled={!selectedPlan || submitting || paymentWaiting || selectedPlan === currentPlan || (selectedPlan === "test" && testPassword.length === 0)} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-not-allowed disabled:opacity-40">{paymentWaiting ? "Confirming payment…" : submitting ? "Opening secure checkout…" : selected ? `Confirm ${selected.name}` : "Select a plan first"}<ArrowRight size={16} /></button></footer></>}
  </div></main>;
}
