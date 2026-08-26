type OnboardingHeaderProps = {
  step: number;
  totalSteps?: number;
  showBrandName?: boolean;
};

const steps = ["Company Information", "Business Description", "Existing Platforms", "Billing"];

export function OnboardingHeader({ step, totalSteps = steps.length, showBrandName = true }: OnboardingHeaderProps) {
  return (
    <header className="mx-auto w-full max-w-5xl px-5 pt-8 sm:px-8 lg:px-12 lg:pt-10">
      <div className="flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3" aria-label="Lulu Intelligence home">
          <img src="/branding/lulu-intelligence-logo.png" alt="Lulu Intelligence" className="h-9 w-auto object-contain" />
          {showBrandName && <span className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">Lulu AI</span>}
        </a>
        <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)]">
          Company setup · {step === totalSteps ? "Complete" : "In progress"}
        </span>
      </div>
      <nav aria-label="Setup progress" className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--foreground)]">Company setup</p>
          <p className="text-xs font-semibold text-[var(--foreground)]">Step {step} of {totalSteps}</p>
        </div>
        <ol className="grid grid-cols-4 gap-1.5">
          {steps.map((label, index) => (
            <li key={label} className="min-w-0">
              <span className={`block h-1.5 rounded-full ${index < step ? "bg-[var(--primary)]" : "bg-[var(--secondary)]"}`} title={label} />
              <span className="sr-only">{label}</span>
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}
