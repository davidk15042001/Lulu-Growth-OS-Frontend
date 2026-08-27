import type { OptionsResponse, SessionContext, SiteListItem } from '../types';

type HeroPanelProps = {
  options: OptionsResponse | null;
  sites: SiteListItem[];
  statusMessage: string;
  session: SessionContext | null;
};

export function HeroPanel({ options, sites, statusMessage, session }: HeroPanelProps) {
  return (
    <header className="hero-panel">
      <div>
        <p className="eyebrow">AI Website Growth OS</p>
        <h1>Autonomous SEO, GEO, and AEO control center</h1>
        <p className="hero-copy">
          Multi-country market packs with local-language-plus-English coverage, provider-aware
          optimization, and DataForSEO-driven market intelligence.
        </p>
      </div>
      <div className="hero-status">
        <div className="hero-stat">
          <span className="hero-stat__label">DataForSEO</span>
          <strong>{options?.liveDataForSeo ? 'Live mode available' : 'Mock-safe mode active'}</strong>
        </div>
        <div className="hero-stat">
          <span className="hero-stat__label">Connected sites</span>
          <strong>{sites.length}</strong>
        </div>
        <div className="hero-stat">
          <span className="hero-stat__label">Default market model</span>
          <strong>Local language + English</strong>
        </div>
        <div className="hero-stat">
          <span className="hero-stat__label">Workspace context</span>
          <strong>{session ? `${session.workspaceId} | ${session.role}` : 'Loading context'}</strong>
        </div>
        <div className="hero-stat">
          <span className="hero-stat__label">Status</span>
          <strong aria-live="polite">{statusMessage}</strong>
        </div>
      </div>
    </header>
  );
}
