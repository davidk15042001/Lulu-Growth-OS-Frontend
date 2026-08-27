import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from './api';
import './App.css';
import { HeroPanel } from './components/HeroPanel';
import { SiteFormCard, type SiteFormState } from './components/SiteFormCard';
import { SiteResultsPanel } from './components/SiteResultsPanel';
import { SitesListCard } from './components/SitesListCard';
import { buildMarketTargets } from './utils/markets';
import type {
  CountryCode,
  ExecutionMode,
  OptionsResponse,
  Provider,
  SiteConnection,
  SiteDetailResponse,
  SiteListItem,
} from './types';

const initialForm: SiteFormState = {
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

function App() {
  const [options, setOptions] = useState<OptionsResponse | null>(null);
  const [sites, setSites] = useState<SiteListItem[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [siteDetail, setSiteDetail] = useState<SiteDetailResponse | null>(null);
  const [form, setForm] = useState(initialForm);
  const [statusMessage, setStatusMessage] = useState('Loading optimizer workspace...');
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const loadSequence = useRef(0);

  async function refreshSites(nextSiteId?: string) {
    const requestId = ++loadSequence.current;
    const [siteList, liveOptions] = await Promise.all([api.listSites(), api.getOptions()]);
    if (requestId !== loadSequence.current) return;
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
      if (requestId !== loadSequence.current) return;
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
  const marketTargetsPreview = useMemo(
    () => buildMarketTargets(form.targetCountries, options?.countries ?? []),
    [form.targetCountries, options?.countries],
  );

  async function selectSite(siteId: string) {
    const requestId = ++loadSequence.current;
    setSelectedSiteId(siteId);
    setBusyAction('load-site');
    try {
      const detail = await api.getSite(siteId);
      if (requestId !== loadSequence.current) return;
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
      const requestId = ++loadSequence.current;
      const detail = await api.getSite(selectedSite.id);
      if (requestId !== loadSequence.current) return;
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
      <HeroPanel options={options} sites={sites} statusMessage={statusMessage} />

      <main className="layout">
        <div className="sidebar">
          <SiteFormCard
            form={form}
            options={{
              providers: options?.providers ?? ['wordpress', 'webflow', 'shopify'],
              modes: options?.modes ?? ['mock', 'live'],
              countries: options?.countries ?? [],
            }}
            marketTargetsPreview={marketTargetsPreview}
            busy={busyAction === 'create-site'}
            onSubmit={handleCreateSite}
            onFormChange={setForm}
            onToggleCountry={toggleCountry}
          />
          <SitesListCard
            sites={sites}
            selectedSiteId={selectedSiteId}
            onSelectSite={(siteId) => void selectSite(siteId)}
          />
        </div>

        <SiteResultsPanel
          loading={loading}
          selectedSite={selectedSite}
          siteDetail={siteDetail}
          busyAction={busyAction}
          onRunAction={(action) => void runAction(action)}
        />
      </main>
    </div>
  );
}

export default App;
