import type { CountryCode, CountryOption, ExecutionMode, MarketTarget, Provider } from '../types';

type SiteFormState = {
  name: string;
  websiteUrl: string;
  provider: Provider;
  targetKeywords: string;
  companyGoals: string;
  automationEnabled: boolean;
  automationHourUtc: number;
  targetCountries: CountryCode[];
  mode: ExecutionMode;
};

type SiteFormCardProps = {
  form: SiteFormState;
  options: {
    providers: Provider[];
    modes: ExecutionMode[];
    countries: CountryOption[];
  };
  marketTargetsPreview: MarketTarget[];
  busy: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onFormChange: (updater: (current: SiteFormState) => SiteFormState) => void;
  onToggleCountry: (countryCode: CountryCode) => void;
};

export function SiteFormCard({
  form,
  options,
  marketTargetsPreview,
  busy,
  onSubmit,
  onFormChange,
  onToggleCountry,
}: SiteFormCardProps) {
  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Connection</p>
          <h2>Create managed site</h2>
        </div>
      </div>

      <form className="site-form" onSubmit={onSubmit}>
        <label>
          Company name
          <input
            value={form.name}
            onChange={(event) => onFormChange((current) => ({ ...current, name: event.target.value }))}
            placeholder="Number one company"
            required
          />
        </label>
        <label>
          Website URL
          <input
            value={form.websiteUrl}
            onChange={(event) =>
              onFormChange((current) => ({ ...current, websiteUrl: event.target.value }))
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
              onFormChange((current) => ({ ...current, provider: event.target.value as Provider }))
            }
          >
            {options.providers.map((provider) => (
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
              onFormChange((current) => ({ ...current, mode: event.target.value as ExecutionMode }))
            }
          >
            {options.modes.map((mode) => (
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
            {options.countries.map((country) => {
              const active = form.targetCountries.includes(country.code);
              return (
                <button
                  key={country.code}
                  type="button"
                  className={`country-chip${active ? ' is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => onToggleCountry(country.code)}
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
              onFormChange((current) => ({ ...current, targetKeywords: event.target.value }))
            }
            rows={4}
          />
        </label>
        <label>
          Company goals
          <textarea
            value={form.companyGoals}
            onChange={(event) =>
              onFormChange((current) => ({ ...current, companyGoals: event.target.value }))
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
              onFormChange((current) => ({
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
              onFormChange((current) => ({
                ...current,
                automationEnabled: event.target.checked,
              }))
            }
          />
          Enable 24h automation cycle
        </label>
        <button className="primary-button" disabled={busy}>
          {busy ? 'Connecting...' : 'Connect site'}
        </button>
      </form>
    </section>
  );
}

export type { SiteFormState };
