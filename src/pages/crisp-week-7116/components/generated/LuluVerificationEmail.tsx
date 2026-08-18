import { pageLinkProps } from '../../../../routing';

export function LuluVerificationEmail() {
  return <main className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)]">
      <header aria-label="Email preview details" className="border-b border-[var(--border)] bg-[var(--secondary)] px-4 py-3 sm:px-6">
        <div className="mx-auto grid max-w-[560px] gap-1 text-[12px] leading-[1.45] text-[var(--muted-foreground)] sm:grid-cols-[auto_1fr] sm:gap-x-3">
          <span className="font-medium text-[var(--muted-foreground)]">From</span>
          <span>noreply@lulu.ai</span>
          <span className="font-medium text-[var(--muted-foreground)]">To</span>
          <span>sarah@your-company.com</span>
          <span className="font-medium text-[var(--muted-foreground)]">Subject</span>
          <span>Verify your Lulu AI email address</span>
        </div>
      </header>

      <section className="w-full px-4 py-8 sm:px-6 sm:py-10" aria-label="Lulu AI email">
        <article className="mx-auto w-full max-w-[560px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
          <header className="flex items-center justify-center gap-2.5 bg-[var(--primary)] px-8 py-5 text-primary-foreground">
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-[var(--primary-foreground)] text-[17px] font-bold leading-none text-[var(--primary)]">L</span>
            <span className="text-[15px] font-bold tracking-[-0.02em] text-[var(--primary-foreground)]">Lulu AI</span>
          </header>

          <div className="px-6 py-8 sm:px-10 sm:py-9">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground)]">EMAIL VERIFICATION</p>
            <h1 className="mb-3 text-[22px] font-bold leading-tight tracking-[-0.025em] text-[var(--foreground)]">Verify your email address</h1>
            <p className="mb-6 text-[15px] font-normal leading-[1.6] text-[var(--muted-foreground)]">Welcome to Lulu AI. Please verify your email address to activate your account and continue setting up your AI business workspace.</p>

            <div className="mb-7 text-center">
              <a {...pageLinkProps('eagerly-bay-9885')} className="inline-flex items-center justify-center rounded-md bg-[var(--primary)] px-8 py-3.5 text-[14px] font-semibold text-[var(--primary-foreground)] no-underline transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2">Verify Email Address</a>
            </div>

            <hr className="mb-6 border-0 border-t border-[var(--border)]" />

            <section aria-labelledby="verification-code-title" className="mb-6">
              <h2 id="verification-code-title" className="mb-2 text-center text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--muted-foreground)]">Your verification code</h2>
              <div className="rounded-[10px] border-2 border-[var(--border)] bg-[var(--secondary)] px-4 py-5 text-center">
                <code className="font-mono text-[28px] font-bold tracking-[0.62em] text-[var(--foreground)] sm:text-[36px]">123456</code>
              </div>
              <p className="mt-2 text-center text-[12px] font-normal text-[var(--muted-foreground)]">This code expires in 10 minutes</p>
            </section>

            <section aria-labelledby="fallback-title" className="mb-6">
              <h2 id="fallback-title" className="mb-1.5 text-[12px] font-semibold text-[var(--foreground)]">Button not working</h2>
              <p className="mb-2 text-[13px] text-[var(--muted-foreground)]">Copy and paste this link into your browser</p>
              <a {...pageLinkProps('eagerly-bay-9885')} className="block break-all rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3.5 py-2.5 font-mono text-[12px] leading-[1.5] text-[var(--foreground)] no-underline transition hover:text-[var(--foreground)]">https://app.lulu.ai/verify-email?token=eyJhbGciOiJIUzI1NiJ9...</a>
            </section>

            <aside className="border-l-[3px] border-[var(--border)] bg-[var(--sidebar)] px-4 py-3" aria-label="Account security notice">
              <h2 className="mb-1 text-[13px] font-semibold text-[var(--foreground)]">Didn't create a Lulu AI account</h2>
              <p className="text-[13px] font-normal leading-[1.5] text-[var(--muted-foreground)]">If you did not request this email you can safely ignore it</p>
            </aside>
          </div>

          <footer className="border-t border-[var(--border)] bg-[var(--secondary)] px-6 py-5 text-center sm:px-10">
            <p className="mb-2 text-[13px] font-semibold text-[var(--foreground)]">Lulu AI</p>
            <nav aria-label="Email footer links" className="flex justify-center gap-4 text-[12px] text-[var(--foreground)]">
              <a href="https://lulu.ai/privacy" className="transition hover:underline">Privacy</a>
              <a href="https://lulu.ai/terms" className="transition hover:underline">Terms</a>
              <a href="https://lulu.ai/security" className="transition hover:underline">Security</a>
            </nav>
            <p className="mt-2 text-[11px] text-[var(--muted-foreground)]">Copyright 2025 Lulu AI. All rights reserved.</p>
          </footer>
        </article>
        <p className="mt-5 text-center text-[11px] text-[var(--muted-foreground)]">Lulu AI · AI Business Operating System</p>
      </section>
    </main>;
}
