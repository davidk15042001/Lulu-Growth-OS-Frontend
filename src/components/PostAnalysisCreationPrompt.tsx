import { useEffect, useState } from 'react';
import { ArrowRight, Check, ShoppingBag, Sparkles, X } from 'lucide-react';
import { agentApi } from '../api/agents';
import { getFriendlyErrorMessage, requestApi } from '../api/client';
import { navigateApp, routes } from '../routing';

type ConnectedPlatform = { name: string; connectionStatus: string };
type OnboardingSnapshot = { platforms: ConnectedPlatform[] };
type PromptKind = 'website' | 'shop';
type PromptState = { kind: PromptKind; provider: string; snapshotKey: string };

function providerKind(name: string): PromptKind | null {
  const value = name.trim().toLowerCase();
  if (value.includes('wordpress') || value.includes('webflow')) return 'website';
  if (value.includes('shopify')) return 'shop';
  return null;
}

export function PostAnalysisCreationPrompt({ workspaceId }: { workspaceId: string }) {
  const [prompt, setPrompt] = useState<PromptState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!workspaceId) return;
    let active = true;
    let timer: number | undefined;
    const load = async () => {
      try {
        const [knowledgeResponse, onboardingResponse] = await Promise.all([
          agentApi.knowledge(workspaceId),
          requestApi<OnboardingSnapshot>({ path: `/workspaces/${workspaceId}/onboarding` }),
        ]);
        if (!active) return;
        const snapshot = knowledgeResponse.data.snapshot;
        if (!snapshot || snapshot.status !== 'completed' || !snapshot.generatedAt) {
          timer = window.setTimeout(load, 6000);
          return;
        }
        const connected = onboardingResponse.data.platforms.filter((item) => ['connected', 'active'].includes(item.connectionStatus));
        const website = connected.find((item) => providerKind(item.name) === 'website');
        const shop = connected.find((item) => providerKind(item.name) === 'shop');
        const selected = website ?? shop;
        if (!selected) return;
        const kind = providerKind(selected.name);
        if (!kind) return;
        const snapshotKey = `lulu:post-analysis-prompt:${workspaceId}:${snapshot.generatedAt}:${kind}`;
        if (window.localStorage.getItem(snapshotKey) === 'dismissed' || window.localStorage.getItem(snapshotKey) === 'accepted') return;
        setPrompt({ kind, provider: selected.name, snapshotKey });
      } catch {
        if (active) timer = window.setTimeout(load, 10000);
      }
    };
    void load();
    return () => {
      active = false;
      if (timer) window.clearTimeout(timer);
    };
  }, [workspaceId]);

  if (!prompt) return null;
  const isShop = prompt.kind === 'shop';
  const title = isShop ? 'Create your Shopify shop?' : 'Generate your website?';
  const description = isShop
    ? `Your business analysis is ready. Lulu can use it to prepare a Shopify shop based on your business data and connected ${prompt.provider} account.`
    : `Your business analysis is ready. Lulu can use it to prepare a website based on your business data and connected ${prompt.provider} account.`;

  const dismiss = () => {
    window.localStorage.setItem(prompt.snapshotKey, 'dismissed');
    setPrompt(null);
  };
  const accept = () => {
    window.localStorage.setItem(prompt.snapshotKey, 'accepted');
    setBusy(true);
    setError('');
    try {
      navigateApp(`${routes.app.website}?${isShop ? 'shopify=1' : 'generate=1'}`);
    } catch (cause) {
      setBusy(false);
      setError(getFriendlyErrorMessage(cause, 'The creation workspace could not be opened. Please try again.'));
    }
  };

  return <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="post-analysis-prompt-title">
    <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">{isShop ? <ShoppingBag size={20} /> : <Sparkles size={20} />}</span><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--muted-foreground)]">Lulu Intelligence</p><h2 id="post-analysis-prompt-title" className="mt-1 text-xl font-semibold text-[var(--foreground)]">{title}</h2></div></div>
        <button type="button" onClick={dismiss} aria-label="Close" className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"><X size={18} /></button>
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)]/50 p-4 text-sm leading-6 text-[var(--muted-foreground)]"><Check size={17} className="mt-1 shrink-0 text-[var(--primary)]" /><p>{description}</p></div>
      {error && <p role="alert" className="mt-4 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-3 py-2 text-sm text-[var(--destructive)]">{error}</p>}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={dismiss} className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)]">Not now</button><button type="button" onClick={accept} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60">{busy ? 'Opening…' : isShop ? 'Create shop' : 'Generate website'}<ArrowRight size={16} /></button></div>
    </div>
  </div>;
}
