import type { Issue, OptimizationAction, SiteConnection, SiteDetailResponse } from '../types';

function formatPercent(value: number) {
  return `${Math.round(value)} / 100`;
}

function severityClass(severity: Issue['severity']) {
  return `severity severity--${severity}`;
}

function actionClass(status: OptimizationAction['status']) {
  return `pill pill--${status}`;
}

function scoreTone(value: number) {
  if (value >= 85) return 'score-card score-card--great';
  if (value >= 70) return 'score-card score-card--good';
  return 'score-card score-card--warn';
}

type SiteResultsPanelProps = {
  loading: boolean;
  selectedSite: SiteConnection | null;
  siteDetail: SiteDetailResponse | null;
  busyAction: string | null;
  canExecuteRuns: boolean;
  onRunAction: (action: 'analysis' | 'optimization' | 'full_cycle') => void;
};

export function SiteResultsPanel({
  loading,
  selectedSite,
  siteDetail,
  busyAction,
  canExecuteRuns,
  onRunAction,
}: SiteResultsPanelProps) {
  const analysis = siteDetail?.lastRun?.analysis ?? null;

  if (loading) {
    return (
      <section className="main-panel">
        <div className="card empty-state">Loading optimizer workspace...</div>
      </section>
    );
  }

  if (!selectedSite || !siteDetail) {
    return (
      <section className="main-panel">
        <div className="card empty-state">
          Connect the first website to unlock the autonomous analysis and optimization flow.
        </div>
      </section>
    );
  }

  return (
    <section className="main-panel">
      <section className="card site-overview">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Active site</p>
            <h2>{selectedSite.name}</h2>
            <p className="section-subcopy">{selectedSite.websiteUrl}</p>
          </div>
          <div className="actions">
            <button
              className="ghost-button"
              onClick={() => onRunAction('analysis')}
              disabled={busyAction !== null || !canExecuteRuns}
            >
              Analyze
            </button>
            <button
              className="ghost-button"
              onClick={() => onRunAction('optimization')}
              disabled={busyAction !== null || !canExecuteRuns}
            >
              Optimize
            </button>
            <button
              className="primary-button"
              onClick={() => onRunAction('full_cycle')}
              disabled={busyAction !== null || !canExecuteRuns}
            >
              Full cycle
            </button>
          </div>
        </div>
        {!canExecuteRuns ? (
          <p className="section-subcopy">
            Your current workspace permissions allow read access only. An editor or admin can start
            new runs.
          </p>
        ) : null}
        <div className="site-badges">
          <span className="badge">{selectedSite.provider}</span>
          <span className="badge">{selectedSite.mode}</span>
          <span className="badge">{selectedSite.targetCountries.length} countries</span>
          <span className="badge">{selectedSite.marketTargets.length} market packs</span>
          <span className="badge">
            {selectedSite.automationEnabled
              ? `Daily at ${selectedSite.automationHourUtc}:00 UTC`
              : 'Automation disabled'}
          </span>
        </div>
        <div className="market-pack-preview market-pack-preview--compact">
          {selectedSite.marketTargets.map((market) => (
            <div key={market.countryCode} className="market-pack-card">
              <strong>{market.countryName}</strong>
              <small>{market.languages.map((entry) => entry.label).join(', ')}</small>
            </div>
          ))}
        </div>
        <div className="keyword-strip">
          {selectedSite.targetKeywords.map((keyword) => (
            <span className="keyword-chip" key={keyword}>
              {keyword}
            </span>
          ))}
        </div>
        <p className="goals">{selectedSite.companyGoals}</p>
      </section>

      {analysis ? (
        <>
          <section className="score-grid">
            {Object.entries(analysis.scores).map(([key, value]) => (
              <article key={key} className={scoreTone(value as number)}>
                <span className="score-card__label">{key}</span>
                <strong>{formatPercent(value as number)}</strong>
              </article>
            ))}
          </section>

          <section className="card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Executive summary</p>
                <h2>AI diagnosis</h2>
              </div>
            </div>
            <p className="summary-text">{analysis.summary}</p>
          </section>

          <section className="card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Market coverage</p>
                <h2>Country and language performance</h2>
              </div>
            </div>
            <div className="table-list">
              {analysis.marketInsights.map((market) => (
                <div key={market.marketKey} className="table-row">
                  <div>
                    <strong>{market.marketLabel}</strong>
                    <small>{market.source}</small>
                  </div>
                  <div className="table-row__metrics">
                    <span>SEO {market.seo}</span>
                    <span>GEO {market.geo}</span>
                    <span>AEO {market.aeo}</span>
                    <span>Opp. {market.opportunity}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="insight-grid">
            <article className="card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Keyword intelligence</p>
                  <h2>Opportunities</h2>
                </div>
              </div>
              <div className="table-list">
                {analysis.keywordInsights.map((item) => (
                  <div key={`${item.marketKey}:${item.keyword}`} className="table-row">
                    <div>
                      <strong>{item.keyword}</strong>
                      <small>
                        {item.marketLabel} | {item.intent}
                      </small>
                    </div>
                    <div className="table-row__metrics">
                      <span>Opp. {item.opportunity}</span>
                      <span>SV {item.searchVolume}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">SERP signals</p>
                  <h2>Competitors and features</h2>
                </div>
              </div>
              <div className="table-list">
                {analysis.serpInsights.map((item) => (
                  <div key={`${item.marketKey}:${item.keyword}`} className="table-row table-row--stack">
                    <div>
                      <strong>{item.keyword}</strong>
                      <small>
                        {item.marketLabel} | {item.snapshotSource}
                      </small>
                    </div>
                    <p>Features: {item.topFeatures.join(', ')}</p>
                    <p>Competitors: {item.competitorDomains.join(', ')}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">AI visibility</p>
                  <h2>GEO and AEO</h2>
                </div>
              </div>
              <div className="table-list">
                {analysis.aiInsights.map((item) => (
                  <div key={item.marketKey} className="table-row table-row--stack">
                    <div>
                      <strong>{item.prompt}</strong>
                      <small>
                        {item.marketLabel} | {item.source}
                      </small>
                    </div>
                    <p>
                      Visibility {item.answerVisibility} | Citation {item.citationRate}
                    </p>
                    <p>{item.recommendation}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="split-layout">
            <article className="card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Detected issues</p>
                  <h2>Priority backlog</h2>
                </div>
              </div>
              <div className="issue-list">
                {analysis.issues.map((issue) => (
                  <div key={issue.id} className="issue-card">
                    <div className="issue-card__top">
                      <span className={severityClass(issue.severity)}>{issue.severity}</span>
                      <span className="issue-card__score">Impact {issue.impact}</span>
                    </div>
                    <h3>{issue.title}</h3>
                    <p>{issue.summary}</p>
                    <ul>
                      {issue.evidence.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                    <p className="issue-card__recommendation">{issue.recommendation}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Optimization engine</p>
                  <h2>Planned actions</h2>
                </div>
              </div>
              <div className="issue-list">
                {analysis.optimizations.map((action) => (
                  <div key={action.id} className="issue-card">
                    <div className="issue-card__top">
                      <span className={actionClass(action.status)}>{action.status}</span>
                      <span className="issue-card__score">+{action.expectedImpact}</span>
                    </div>
                    <h3>{action.title}</h3>
                    <p>{action.description}</p>
                    <p>{action.providerAction}</p>
                    <p className="issue-card__recommendation">
                      {action.autoApplied
                        ? 'Marked safe for autonomous execution.'
                        : 'Generated for review-first execution.'}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      ) : (
        <section className="card empty-state">
          This site is connected. Run the first full cycle to generate scores, issues, market
          insights, and automated optimization actions.
        </section>
      )}

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Run history</p>
            <h2>Execution log</h2>
          </div>
        </div>
        <div className="table-list">
          {siteDetail.runs.map((run) => (
            <div key={run.id} className="table-row">
              <div>
                <strong>{run.type}</strong>
                <small>{new Date(run.createdAt).toLocaleString()}</small>
              </div>
              <div className="table-row__metrics">
                <span>{run.status}</span>
                <span>{run.mode}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
