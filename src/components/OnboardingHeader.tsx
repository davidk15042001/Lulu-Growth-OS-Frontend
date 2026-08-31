import { useState } from "react";
import { authApi } from "../api/auth";
import {
  clearPendingEmail,
  clearPendingInvitation,
  clearSelectedWorkspaceId,
  clearStoredUser,
} from "../api/session";
import { navigateApp, routes } from "../routing";

type OnboardingHeaderProps = {
  step: number;
  totalSteps?: number;
  showBrandName?: boolean;
};

const steps = ["Company Information", "Business Description", "Existing Platforms", "Billing"];

export async function exitOnboardingToLogin() {
  try {
    await authApi.logout();
  } catch {
    // The local session should still be cleared so the user can leave onboarding.
  } finally {
    clearStoredUser();
    clearSelectedWorkspaceId();
    clearPendingInvitation();
    clearPendingEmail();
    navigateApp(routes.auth.login, { replace: true });
  }
}

export function OnboardingHeader({ step, totalSteps = steps.length, showBrandName = true }: OnboardingHeaderProps) {
  const [exiting, setExiting] = useState(false);

  const handleExit = async () => {
    if (exiting) return;
    const confirmed = window.confirm("Onboarding abbrechen und zur Login-Seite zurueckkehren?");
    if (!confirmed) return;
    setExiting(true);
    await exitOnboardingToLogin();
  };

  return (
    <header className="mx-auto w-full max-w-5xl px-5 pt-8 sm:px-8 lg:px-12 lg:pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <a href="/" className="flex items-center gap-3" aria-label="Lulu Intelligence home">
          <img src="/branding/lulu-intelligence-logo.png" alt="Lulu Intelligence" className="h-9 w-auto object-contain" />
          {showBrandName && <span className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">Lulu AI</span>}
        </a>
        <div className="flex flex-col gap-2 sm:items-end">
          <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)]">
            Company setup · {step === totalSteps ? "Complete" : "In progress"}
          </span>
          <button
            type="button"
            onClick={() => void handleExit()}
            disabled={exiting}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--foreground)] shadow-sm transition hover:bg-[var(--secondary)] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
          >
            {exiting ? "Verlasse Onboarding..." : "Onboarding abbrechen"}
          </button>
        </div>
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
