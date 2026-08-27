import type { SiteListItem } from '../types';

type SitesListCardProps = {
  sites: SiteListItem[];
  selectedSiteId: string;
  onSelectSite: (siteId: string) => void;
};

export function SitesListCard({ sites, selectedSiteId, onSelectSite }: SitesListCardProps) {
  return (
    <section className="card">
      <div className="site-list">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Managed sites</p>
            <h2>Workspace</h2>
          </div>
        </div>
        {sites.map((site) => (
          <button
            key={site.id}
            type="button"
            className={`site-list__item${site.id === selectedSiteId ? ' is-active' : ''}`}
            onClick={() => onSelectSite(site.id)}
          >
            <span>
              <strong>{site.name}</strong>
              <small>
                {site.provider} | {site.targetCountries.length} countries
              </small>
            </span>
            <span className="site-list__meta">{site.lastRun?.analysis?.scores.overall ?? '--'}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
