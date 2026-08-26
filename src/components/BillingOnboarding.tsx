import { useEffect, useState } from "react";
import { ArrowRight, Check, Cpu, Lock, Server, ShieldCheck, Sparkles, WandSparkles, X, Zap } from "lucide-react";
import { navigateApp, routes } from "../routing";
import { getFriendlyErrorMessage, getTechnicalErrorDetails } from "../api/client";
import { useLuluApp } from "../api/LuluAppContext";
import { onboardingApi } from "../api/onboarding";
import { workspaceAppApi } from "../api/workspace-app";
import { billingCapabilities, billingPlans, type BillingPlanId } from "../billing/planCatalog";
import { OnboardingHeader } from "./OnboardingHeader";

const planPresentation: Record<BillingPlanId, { icon: typeof Zap; accent: string }> = {
  starter: { icon: Zap, accent: "bg-[var(--primary)] text-[var(--primary-foreground)]" },
  ai: { icon: WandSparkles, accent: "bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--primary)]/20" },
  test: { icon: WandSparkles, accent: "bg-[var(--secondary)] text-[var(--foreground)] border border-dashed border-[var(--primary)]/40" },
};

export function BillingOnboarding() {
  const { currentUser, selectedWorkspace, loading, refresh } = useLuluApp();
  const [selectedPlan, setSelectedPlan] = useState<BillingPlanId | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [technicalError, setTechnicalError] = useState<string | null>(null);
  const [testPassword, setTestPassword] = useState("");
  const [testPasswordRequired, setTestPasswordRequired] = useState(false);
  const paymentSucceeded = new URLSearchParams(window.location.search).get("payment") === "success";
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "waiting" | "error">(paymentSucceeded ? "waiting" : "idle");

  useEffect(() => {
    if (!paymentSucceeded || !selectedWorkspace) return;
    let active = true;
    let attempts = 0;
    let timer: number | undefined;

    const pollBilling = async () => {
      try {
        const checkoutId = window.localStorage.getItem(`lulu:checkout-id:${selectedWorkspace.id}`);
        if (checkoutId) {
          const syncResponse = await workspaceAppApi.syncBillingCheckout(selectedWorkspace.id, checkoutId);
          if (syncResponse.data.status === "active") {
            window.localStorage.removeItem(`lulu:checkout-id:${selectedWorkspace.id}`);
            await refresh();
            if (active) navigateApp(routes.app.dashboard, { replace: true });
            return;
          }
        }
        const response = await workspaceAppApi.billing(selectedWorkspace.id);
        const subscription = response.data.subscription;
        if (subscription?.status === "active" && subscription.provider === "airwallex") {
          await refresh();
          if (active) navigateApp(routes.app.dashboard, { replace: true });
          return;
        }
        attempts += 1;
          if (attempts >= 30) {
          if (active) {
            setPaymentStatus("error");
            setTechnicalError("Code: PAYMENT_CONFIRMATION_TIMEOUT · Webhook confirmation was not observed after 60 seconds");
          }
          return;
        }
        timer = window.setTimeout(() => void pollBilling(), 2000);
      } catch (cause) {
        if (active) {
          setPaymentStatus("error");
          setTechnicalError(getTechnicalErrorDetails(cause));
        }
      }
    };

    void pollBilling();
    return () => {
      active = false;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [paymentSucceeded, refresh, selectedWorkspace]);

  useEffect(() => {
    if (loading || !selectedWorkspace?.onboardingCompletedAt || paymentSucceeded) return;
    navigateApp(routes.app.dashboard, { replace: true });
  }, [loading, paymentSucceeded, selectedWorkspace]);

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-[var(--background)] text-sm text-[var(--muted-foreground)]">Loading your workspace…</main>;
  }

  if (!currentUser) {
    navigateApp(routes.auth.login, { replace: true });
    return null;
  }

  if (!selectedWorkspace) {
    navigateApp(routes.onboarding.companyInformation, { replace: true });
    return null;
  }

  if (selectedWorkspace.onboardingFileReuploadRequired) {
    navigateApp(routes.onboarding.businessDescription, { replace: true });
    return null;
  }

  const startPlanCheckout = async (planId: BillingPlanId, password?: string) => {
    if (!selectedWorkspace || submitting || paymentStatus === "waiting") return;
    setSelectedPlan(planId);
    setSubmitting(true);
    setPaymentStatus("idle");
    setError(null);
    setTechnicalError(null);
    try {
      const billingResponse = await onboardingApi.createBillingCheckout(selectedWorkspace.id, {
        planKey: planId,
        successUrl: `${window.location.origin}${routes.onboarding.billing}?payment=success`,
        backUrl: `${window.location.origin}${routes.onboarding.billing}?payment=cancelled`,
        ...(planId === "test" && password ? { password } : {}),
      });
      const billingResult = billingResponse.data;
      window.localStorage.setItem(`lulu:selected-plan:${selectedWorkspace.id}`, planId);
      if (billingResult.free) {
        await refresh();
        navigateApp(routes.app.dashboard, { replace: true });
        return;
      }
      if (!billingResult.checkoutUrl) throw new Error("Airwallex did not return a checkout URL.");
      if (billingResult.checkoutId) window.localStorage.setItem(`lulu:checkout-id:${selectedWorkspace.id}`, billingResult.checkoutId);
      window.location.assign(billingResult.checkoutUrl);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not start the Airwallex checkout. Please try again."));
      setTechnicalError(getTechnicalErrorDetails(cause));
      setSubmitting(false);
    }
  };

  const selectPlan = (planId: BillingPlanId) => {
    if (submitting || paymentStatus === "waiting") return;
    if (planId === "test") {
      setSelectedPlan(planId);
      setTestPassword("");
      setTestPasswordRequired(true);
      setError(null);
      setTechnicalError(null);
      return;
    }
    setTestPasswordRequired(false);
    setTestPassword("");
    void startPlanCheckout(planId);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <OnboardingHeader step={4} showBrandName={false} />

        <section className="mx-auto max-w-3xl py-14 text-center sm:py-16">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <Sparkles size={22} aria-hidden="true" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[.18em] text-[var(--muted-foreground)]">Choose your workspace access</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Select the way you want Lulu to work.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg sm:leading-8">Choose the level of control that fits your business. Starter and AI access are billed annually in RMB; API and AWS usage is collected automatically every Monday.</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-[var(--foreground)]">Select a package to open the secure payment process immediately.</p>
        </section>

        <section className="mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]" aria-labelledby="payg-title">
          <div className="border-b border-[var(--border)] px-5 py-5 sm:px-7"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--muted-foreground)]">Transparent usage billing</p><h2 id="payg-title" className="mt-2 text-xl font-semibold">API and AWS costs are pay as you go.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">Usage closes every Monday and is charged automatically to the saved card. A payment link appears only if automatic collection fails.</p></div>
          <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2">
            <div className="flex gap-3 bg-[var(--card)] p-5 sm:p-6"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--secondary)]"><Cpu size={18} /></span><div><h3 className="text-sm font-semibold">API usage</h3><p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">Input tokens cost $5 per million and output tokens cost $10 per million.</p></div></div>
            <div className="flex gap-3 bg-[var(--card)] p-5 sm:p-6"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--secondary)]"><Server size={18} /></span><div><h3 className="text-sm font-semibold">AWS usage</h3><p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">Actual allocated AWS provider costs are charged at exactly twice the provider price, including for Test workspaces.</p></div></div>
          </div>
        </section>

        {(submitting || paymentStatus !== "idle" || error) && <section className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${error || paymentStatus === "error" ? "border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--destructive)]" : "border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)]"}`} role={error || paymentStatus === "error" ? "alert" : "status"}>
          <div className="flex items-start gap-3"><ShieldCheck size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><div><p className="font-semibold">{paymentStatus === "waiting" ? "Payment method received — confirming your access…" : submitting ? (selectedPlan === "test" ? "Checking Test password and opening secure card setup…" : "Opening secure checkout…") : paymentStatus === "error" ? "Payment confirmation is taking longer than expected." : error}</p>{paymentStatus === "waiting" && <p className="mt-1 text-[var(--muted-foreground)]">We are waiting for Airwallex to confirm the saved payment method. This page will continue automatically.</p>}{paymentStatus === "error" && <p className="mt-1">Please wait a moment and refresh this page.</p>}{error && paymentStatus !== "error" && <p className="mt-1">Select the package again to retry.</p>}{technicalError && <details className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-left"><summary className="cursor-pointer text-xs font-semibold">Show technical details</summary><p className="mt-2 break-words font-mono text-[11px] leading-5 text-[var(--muted-foreground)]">{technicalError}</p></details>}</div></div>
        </section>}

        <section aria-label="Available plans" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {billingPlans.map((plan) => {
            const { icon: Icon, accent } = planPresentation[plan.id];
            const isSelected = selectedPlan === plan.id;
            return (
              <article key={plan.id} className={`relative flex flex-col rounded-2xl border p-6 transition sm:p-7 ${isSelected ? "border-[var(--foreground)] shadow-[0_20px_60px_rgba(0,0,0,0.10)]" : "border-[var(--border)] bg-[var(--card)]"}`}>
                {plan.id === "ai" && <span className="absolute right-5 top-5 rounded-full bg-[var(--foreground)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--background)]">Recommended</span>}
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}><Icon size={19} aria-hidden="true" /></div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[.16em] text-[var(--muted-foreground)]">{plan.eyebrow}</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{plan.name}</h2>
                <div className="mt-4 flex items-baseline gap-2"><span className="text-2xl font-semibold tracking-[-0.04em]">{plan.price}</span><span className="text-xs text-[var(--muted-foreground)]">{plan.pricePeriod}</span></div>
                <p className="mt-3 min-h-20 text-sm leading-6 text-[var(--muted-foreground)]">{plan.description}</p>
                <div className="my-6 h-px bg-[var(--border)]" />
                <ul className="space-y-3 text-sm leading-6">
                  {plan.features.map((feature) => <li key={feature} className="flex items-start gap-2.5"><Check size={16} className="mt-1 shrink-0" aria-hidden="true" /><span>{feature}</span></li>)}
                </ul>
                <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-[var(--muted-foreground)]"><Lock size={14} className="mt-0.5 shrink-0" aria-hidden="true" /><span>{plan.limitations}</span></p>
                <button type="button" onClick={() => selectPlan(plan.id)} disabled={submitting || paymentStatus === "waiting"} aria-pressed={isSelected} className={`mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-55 ${isSelected ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "border border-[var(--border)] bg-[var(--card)] hover:border-[var(--foreground)]"}`}>
                  {isSelected && submitting ? (plan.id === "test" ? "Opening card setup…" : "Opening secure checkout…") : plan.cta}<ArrowRight size={16} aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-5 py-5 sm:px-7">
            <h2 className="text-lg font-semibold">Compare access levels</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">Every plan starts with the same connected business context. The difference is what Lulu can do with it.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead><tr className="border-b border-[var(--border)] text-xs uppercase tracking-[.12em] text-[var(--muted-foreground)]"><th className="px-5 py-4 font-semibold sm:px-7">Capability</th>{billingPlans.map((plan) => <th key={plan.id} className="px-4 py-4 text-center font-semibold">{plan.name}</th>)}</tr></thead>
              <tbody>{billingCapabilities.map((capability) => <tr key={capability.id} className="border-b border-[var(--border)] last:border-0"><th className="px-5 py-4 font-medium sm:px-7">{capability.label}</th>{billingPlans.map((plan) => <td key={`${capability.id}-${plan.id}`} className="px-4 py-4 text-center">{capability.availability[plan.id] ? <Check className="mx-auto" size={17} aria-label="Included" /> : <span className="text-[var(--muted-foreground)]" aria-label="Not included">—</span>}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>

      </div>

      {testPasswordRequired && selectedPlan === "test" && <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="test-plan-title" onMouseDown={(event) => { if (event.target === event.currentTarget && !submitting) { setTestPasswordRequired(false); setSelectedPlan(null); } }}><form className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl" onSubmit={(event) => { event.preventDefault(); if (testPassword) void startPlanCheckout("test", testPassword); }}><button type="button" disabled={submitting} onClick={() => { setTestPasswordRequired(false); setSelectedPlan(null); }} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--secondary)] disabled:opacity-50" aria-label="Close"><X size={18} /></button><p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--muted-foreground)]">Test plan</p><h2 id="test-plan-title" className="mt-2 text-2xl font-semibold">Test password and card setup</h2><p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">The Test plan has no access fee. Enter the confirmation password, then securely save a card with Airwallex for weekly usage charges before continuing to the dashboard.</p><label className="mt-5 block text-xs font-semibold text-[var(--foreground)]">Test confirmation password<input autoFocus value={testPassword} onChange={(event) => setTestPassword(event.target.value)} autoComplete="off" type="password" placeholder="Enter the Test password" className="mt-2 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--primary)]" /></label>{error && <p className="mt-3 text-sm text-[var(--destructive)]" role="alert">{error}</p>}<button type="submit" disabled={submitting || testPassword.length === 0} className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">{submitting ? "Opening card setup…" : "Continue to secure card setup"}<ArrowRight size={16} /></button></form></div>}
    </main>
  );
}
