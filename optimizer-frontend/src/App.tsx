import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import './App.css';
import type {
  CountryCode,
  CountryOption,
  ExecutionMode,
  Issue,
  MarketTarget,
  OptimizationAction,
  OptionsResponse,
  Provider,
  SiteConnection,
  SiteDetailResponse,
  SiteListItem,
} from './types';

const initialForm = {
  name: '',
  websiteUrl: '',
  provider: 'wordpress' as Provider,
  targetKeywords: 'ai seo automation, answer engine optimization, geo visibility',
  companyGoals:
    'Grow qualified traffic, improve AI visibility, and automate safe optimization every day.',
  automationEnabled: true,
  automationHourUtc: 4,
  targetCountries: [] as CountryCode[],
  mode: 'mock' as ExecutionMode,
};

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

function buildMarketTargets(targetCountries: CountryCode[], countries: CountryOption[]): MarketTarget[] {
  return targetCountries.flatMap((countryCode) => {
    const country = countries.find((entry) => entry.code === countryCode);
    if (!country) return [];
    const languages = [country.primaryLanguage];
    if (country.englishSupported && country.primaryLanguage.code !== 'en') {
      languages.push({
        code: 'en',
        label: 'English',
        dataForSeoName: 'English',
      });
    }
    return [{
      countryCode: country.code,
      countryName: country.name,
      locationName: country.locationName,
      primaryLanguageCode: country.primaryLanguage.code,
      languages,
    }];
  });
}

function App() {
  const [options, setOptions] = useState<OptionsResponse | null>(null);
  const [sites, setSites] = useState<SiteListItem[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [siteDetail, setSiteDetail] = useState<SiteDetailResponse | null>(null);
  const [form, setForm] = useState(initialForm);
  const [statusMessage, setStatusMessage] = useState('Loading optimizer workspace...');
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshSites(nextSiteId?: string) {
    const [siteList, liveOptions] = await Promise.all([api.listSites(), api.getOptions()]);
    setSites(siteList);
    setOptions(liveOptions);
    setForm((current) =>
      current.targetCountries.length > 0
        ? current
        : { ...current, targetCountries: liveOptions.defaultCountryCodes },
    );
    const targetSiteId = nextSiteId ?? (selectedSiteId || siteList[0]?.id);
    if (targetSiteId) {
      setSelectedSiteId(targetSiteId);
      const detail = await api.getSite(targetSiteId);
      setSiteDetail(detail);
    } else {
      setSiteDetail(null);
    }
  }

  useEffect(() => {
    void (async () => {
      try {
        await refreshSites();
        setStatusMessage('Optimizer workspace ready.');
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : 'Failed to load workspace.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedSite = useMemo<SiteConnection | null>(() => siteDetail?.site ?? null, [siteDetail]);
  const analysis = siteDetail?.lastRun?.analysis ?? null;
  const marketTargetsPreview = useMemo(
    () => buildMarketTargets(form.targetCountries, options?.countries ?? []),
    [form.targetCountries, options?.countries],
  );

  async function selectSite(siteId: string) {
    setSelectedSiteId(siteId);
    setBusyAction('load-site');
    try {
      const detail = await api.getSite(siteId);
      setSiteDetail(detail);
      setStatusMessage(`Loaded ${detail.site.name}.`);
    } finally {
      setBusyAction(null);
    }
  }

  function toggleCountry(countryCode: CountryCode) {
    setForm((current) => {
      const exists = current.targetCountries.includes(countryCode);
      return {
        ...current,
        targetCountries: exists
          ? current.targetCountries.filter((entry) => entry !== countryCode)
          : [...current.targetCountries, countryCode],
      };
    });
  }

  async function handleCreateSite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (marketTargetsPreview.length === 0) {
      setStatusMessage('Select at least one target country before creating the site.');
      return;
    }
    setBusyAction('create-site');
    setStatusMessage('Connecting site and provisioning multi-country optimization workspace...');
    try {
      const payload = {
        ...form,
        marketTargets: marketTargetsPreview,
        targetKeywords: form.targetKeywords
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      };
      const created = await api.createSite(payload);
      await refreshSites(created.id);
      setForm({
        ...initialForm,
        targetCountries: options?.defaultCountryCodes ?? [],
      });
      setStatusMessage(`Connected ${created.name}.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to create site.');
    } finally {
      setBusyAction(null);
    }
  }

  async function runAction(action: 'analysis' | 'optimization' | 'full_cycle') {
    if (!selectedSite) return;
    setBusyAction(action);
    const label =
      action === 'analysis'
        ? 'Running AI analysis...'
        : action === 'optimization'
          ? 'Running optimization pass...'
          : 'Running full analyze-and-optimize cycle...';
    setStatusMessage(label);
    try {
      if (action === 'analysis') {
        await api.runAnalysis(selectedSite.id);
      } else if (action === 'optimization') {
        await api.runOptimization(selectedSite.id);
      } else {
        await api.runFullCycle(selectedSite.id);
      }
      const detail = await api.getSite(selectedSite.id);
      setSiteDetail(detail);
      setStatusMessage(`Completed ${action.replace('_', ' ')} for ${detail.site.name}.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Execution failed.');
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="app-shell">
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
            <span className="hero-stat__label">Status</span>
            <strong>{statusMessage}</strong>
          </div>
        </div>
      </header>

      <main className="layout">
        <section className="sidebar card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Connection</p>
              <h2>Create managed site</h2>
            </div>
          </div>

          <form className="site-form" onSubmit={handleCreateSite}>
            <label>
              Company name
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Number one company"
                required
              />
            </label>
            <label>
              Website URL
              <input
                value={form.websiteUrl}
                onChange={(event) =>
                  setForm((current) => ({ ...current, websiteUrl: event.target.value }))
                }
                placeholder="https://example.com"
                required
              />
            </label>
            <label>
              Provider
              <select
                value={form.provider}
                onChange={(event) =>
                  setForm((current) => ({ ...current, provider: event.target.value as Provider }))
                }
              >
                {(options?.providers ?? ['wordpress', 'webflow', 'shopify']).map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Mode
              <select
                value={form.mode}
                onChange={(event) =>
                  setForm((current) => ({ ...current, mode: event.target.value as ExecutionMode }))
                }
              >
                {(options?.modes ?? ['mock', 'live']).map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </label>

            <div className="multi-field">
              <div className="multi-field__header">
                <span>Target countries</span>
                <small>{marketTargetsPreview.length} country packs selected</small>
              </div>
              <div className="country-grid">
                {(options?.countries ?? []).map((country) => {
                  const active = form.targetCountries.includes(country.code);
                  return (
                    <button
                      key={country.code}
                      type="button"
                      className={`country-chip${active ? ' is-active' : ''}`}
                      onClick={() => toggleCountry(country.code)}
                    >
                      <strong>{country.name}</strong>
                      <small>
                        {country.primaryLanguage.label}
                        {country.primaryLanguage.code !== 'en' ? ' + English' : ''}
                      </small>
                    </button>
                  );
                })}
              </div>
              <p className="helper-copy">
                Language strategy is fixed to local market language plus English for every selected
                country.
              </p>
            </div>

            <div className="market-pack-preview">
              {marketTargetsPreview.map((market) => (
                <div key={market.countryCode} className="market-pack-card">
                  <strong>{market.countryName}</strong>
                  <small>{market.languages.map((entry) => entry.label).join(', ')}</small>
                </div>
              ))}
            </div>

            <label>
              Target keywords
              <textarea
                value={form.targetKeywords}
                onChange={(event) =>
                  setForm((current) => ({ ...current, targetKeywords: event.target.value }))
                }
                rows={4}
              />
            </label>
            <label>
              Company goals
              <textarea
                value={form.companyGoals}
                onChange={(event) =>
                  setForm((current) => ({ ...current, companyGoals: event.target.value }))
                }
                rows={5}
              />
            </label>
            <label>
              Daily automation hour (UTC)
              <input
                type="number"
                min={0}
                max={23}
                value={form.automationHourUtc}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    automationHourUtc: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={form.automationEnabled}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    automationEnabled: event.target.checked,
                  }))
                }
              />
              Enable 24h automation cycle
            </label>
            <button className="primary-button" disabled={busyAction === 'create-site'}>
              {busyAction === 'create-site' ? 'Connecting...' : 'Connect site'}
            </button>
          </form>

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
                onClick={() => void selectSite(site.id)}
              >
                <span>
                  <strong>{site.name}</strong>
                  <small>
                    {site.provider} | {site.targetCountries.length} countries
                  </small>
                </span>
                <span className="site-list__meta">
                  {site.lastRun?.analysis?.scores.overall ?? '--'}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="main-panel">
          {loading ? (
            <div className="card empty-state">Loading optimizer workspace...</div>
          ) : !selectedSite || !siteDetail ? (
            <div className="card empty-state">
              Connect the first website to unlock the autonomous analysis and optimization flow.
            </div>
          ) : (
            <>
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
                      onClick={() => void runAction('analysis')}
                      disabled={busyAction !== null}
                    >
                      Analyze
                    </button>
                    <button
                      className="ghost-button"
                      onClick={() => void runAction('optimization')}
                      disabled={busyAction !== null}
                    >
                      Optimize
                    </button>
                    <button
                      className="primary-button"
                      onClick={() => void runAction('full_cycle')}
                      disabled={busyAction !== null}
                    >
                      Full cycle
                    </button>
                  </div>
                </div>
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
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
