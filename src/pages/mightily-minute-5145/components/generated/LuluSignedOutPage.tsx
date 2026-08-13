import { Check, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { pageLinkProps } from '../../../../routing';
import { requestApi } from '../../../../api/client';
import { clearSelectedWorkspaceId } from '../../../../api/session';
type SignOutState = 'success' | 'error';
interface LuluSignedOutPageProps {
  initialState?: SignOutState;
}
const footerLinks = [{
  label: 'Privacy',
  href: '#privacy'
}, {
  label: 'Terms',
  href: '#terms'
}, {
  label: 'Security',
  href: '#security'
}];
export function LuluSignedOutPage({
  initialState = 'success'
}: LuluSignedOutPageProps) {
  const [state, setState] = useState<SignOutState>(initialState);
  const attemptedSignOut = useRef(false);
  const isError = state === 'error';
  const signOut = useCallback(() => {
    requestApi({ path: '/auth/logout', method: 'POST', body: {} })
      .then(() => {
        clearSelectedWorkspaceId();
        setState('success');
      })
      .catch(() => setState('error'));
  }, []);
  useEffect(() => {
    if (attemptedSignOut.current) return;
    attemptedSignOut.current = true;
    signOut();
  }, [signOut]);
  return <div className="flex min-h-screen flex-col bg-[var(--background)] font-sans text-[var(--foreground)]">
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <section aria-labelledby="signed-out-title" className="w-full max-w-md animate-[lulu-card-enter_0.45s_ease-out] rounded-xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-[0_12px_32px_rgba(0,0,0,0.08)] sm:p-9">
          <header className="text-center">
            <div className="mb-7 flex items-center justify-center gap-2.5">
              <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] text-lg font-bold text-[var(--primary-foreground)]">L</span>
              <span className="text-[17px] font-bold tracking-[-0.02em] text-[var(--foreground)]">Lulu AI</span>
            </div>

            {isError ? <div aria-hidden="true" className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-[var(--secondary)] text-[var(--destructive)]">
                <RotateCcw size={22} strokeWidth={1.8} />
              </div> : <div aria-hidden="true" className="mx-auto mb-5 grid h-12 w-12 animate-[lulu-check-in_0.4s_ease-out] place-items-center rounded-full bg-[var(--secondary)] text-[var(--chart-4)]">
                <Check size={25} strokeWidth={2.5} />
              </div>}

            <h1 id="signed-out-title" className="text-[22px] font-bold tracking-[-0.02em] text-[var(--foreground)]">
              {isError ? 'Sign-out could not be confirmed' : "You're signed out"}
            </h1>
            <p className="mx-auto mt-2 max-w-[310px] text-sm leading-6 text-[var(--muted-foreground)]">
              {isError ? "We couldn't confirm that your session was fully signed out. Please sign in again only after your session has been securely cleared." : 'You have been securely signed out of your Lulu AI account.'}
            </p>
          </header>

          <div className="mt-7" role="status" aria-live="polite">
            {isError ? <button type="button" onClick={signOut} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2">
                <RotateCcw size={16} aria-hidden="true" />
                <span>Try Again</span>
              </button> : <a {...pageLinkProps('brightly-door-5741')} className="flex h-11 w-full items-center justify-center rounded-md bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2">
                <span>Sign In Again</span>
              </a>}
          </div>

          {!isError && <div className="mt-6 border-t border-[var(--border)] pt-5 text-center">
              <p className="text-[13px] leading-5 text-[var(--muted-foreground)]">Your session has been ended.</p>
              <p className="mt-1 text-[13px] leading-5 text-[var(--foreground)]">For additional security, close this browser window if you're using a shared device.</p>
            </div>}

          <a {...pageLinkProps(isError ? 'brightly-door-5741' : 'fancily-leaf-1766')} className="mt-5 flex min-h-11 w-full items-center justify-center rounded-lg px-3 text-[13px] text-[var(--foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)] focus-visible:ring-offset-2">
            <span>{isError ? 'Return to Login' : 'Return to Lulu AI'}</span>
          </a>

          {!isError && <p className="mt-1 text-center text-xs text-[var(--muted-foreground)]">You can safely close this window.</p>}
        </section>
      </main>
      <footer className="flex min-h-[52px] items-center justify-center gap-5 px-4 pb-5 text-center text-xs text-[var(--foreground)] sm:pb-0">
        {footerLinks.map(link => <a key={link.label} href={link.href} className="transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--border)]">
            <span>{link.label}</span>
          </a>)}
      </footer>
    </div>;
}
