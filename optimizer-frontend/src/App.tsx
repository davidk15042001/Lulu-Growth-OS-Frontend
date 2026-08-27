import { useEffect, useMemo, useRef, useState } from 'react';
import { ApiError, api } from './api';
import './App.css';
import { HeroPanel } from './components/HeroPanel';
import { LoginCard } from './components/LoginCard';
import { SiteFormCard, type SiteFormState } from './components/SiteFormCard';
import { SiteResultsPanel } from './components/SiteResultsPanel';
import { SitesListCard } from './components/SitesListCard';
import { buildMarketTargets } from './utils/markets';
import type {
  CountryCode,
  ExecutionMode,
  LoginInput,
  OptionsResponse,
  Provider,
  SessionContext,
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

const initialLoginForm: LoginInput = {
  workspaceId: 'demo-workspace',
  email: 'admin@demo.example',
  password: '',
};

function App() {
  const [options, setOptions] = useState<OptionsResponse | null>(null);
  const [session, setSession] = useState<SessionContext | null>(null);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [sites, setSites] = useState<SiteListItem[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [siteDetail, setSiteDetail] = useState<SiteDetailResponse | null>(null);
  const [form, setForm] = useState(initialForm);
  const [statusMessage, setStatusMessage] = useState('Loading optimizer workspace...');
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const loadSequence = useRef(0);

  function applyOptions(liveOptions: OptionsResponse) {
    setOptions(liveOptions);
    setForm((current) =>
      current.targetCountries.length > 0
        ? current
        : { ...current, targetCountries: liveOptions.defaultCountryCodes },
    );
  }

  function resetAuthenticatedState(message: string) {
    api.logout();
    setSession(null);
    setSites([]);
    setSelectedSiteId('');
    setSiteDetail(null);
    setBusyAction(null);
    setStatusMessage(message);
  }

  function resolveApiError(error: unknown, fallbackMessage: string) {
    if (error instanceof ApiError && error.status === 401) {
      resetAuthenticatedState('Session expired or invalid. Sign in again.');
      return 'Session expired or invalid. Sign in again.';
    }
    return error instanceof Error ? error.message : fallbackMessage;
  }

  async function refreshSites(nextSiteId?: string, providedOptions?: OptionsResponse | null) {
    const requestId = ++loadSequence.current;
    const liveOptions = providedOptions ?? options ?? (await api.getOptions());
    const [siteList, liveSession] = await Promise.all([api.listSites(), api.getSession()]);
    if (requestId !== loadSequence.current) return;
    applyOptions(liveOptions);
    setSites(siteList);
    setSession(liveSession);
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
        const liveOptions = await api.getOptions();
        applyOptions(liveOptions);
        if (api.hasStoredSession()) {
          const requestId = ++loadSequence.current;
          const [siteList, liveSession] = await Promise.all([api.listSites(), api.getSession()]);
          if (requestId !== loadSequence.current) return;
          setSites(siteList);
          setSession(liveSession);
          const nextSelectedSiteId = siteList[0]?.id ?? '';
          setSelectedSiteId(nextSelectedSiteId);
          if (nextSelectedSiteId) {
            const detail = await api.getSite(nextSelectedSiteId);
            if (requestId !== loadSequence.current) return;
            setSiteDetail(detail);
          } else {
            setSiteDetail(null);
          }
          setStatusMessage('Optimizer workspace ready.');
        } else {
          setStatusMessage('Sign in to load the enterprise workspace.');
        }
      } catch (error) {
        setStatusMessage(resolveApiError(error, 'Failed to load workspace.'));
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

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthBusy(true);
    setStatusMessage('Signing in to enterprise workspace...');
    try {
      const result = await api.login(loginForm);
      setSession(result.session);
      await refreshSites(undefined, options);
      setLoginForm((current) => ({ ...current, password: '' }));
      setStatusMessage(`Signed in as ${result.session.name}.`);
    } catch (error) {
      api.logout();
      setStatusMessage(error instanceof Error ? error.message : 'Failed to sign in.');
    } finally {
      setAuthBusy(false);
    }
  }

  function handleLogout() {
    resetAuthenticatedState('Signed out. Sign in to continue.');
  }

  async function selectSite(siteId: string) {
    const requestId = ++loadSequence.current;
    setSelectedSiteId(siteId);
    setBusyAction('load-site');
    try {
      const detail = await api.getSite(siteId);
      if (requestId !== loadSequence.current) return;
      setSiteDetail(detail);
      setStatusMessage(`Loaded ${detail.site.name}.`);
    } catch (error) {
      setStatusMessage(resolveApiError(error, 'Failed to load site.'));
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
      setStatusMessage(resolveApiError(error, 'Failed to create site.'));
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
      setStatusMessage(resolveApiError(error, 'Execution failed.'));
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="app-shell">
      <HeroPanel
        options={options}
        sites={sites}
        statusMessage={statusMessage}
        session={session}
        onLogout={handleLogout}
      />

      {session ? (
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
      ) : (
        <main className="layout layout--auth">
          <div className="sidebar">
            <LoginCard
              form={loginForm}
              busy={authBusy}
              onSubmit={handleLogin}
              onFormChange={setLoginForm}
            />
          </div>

          <section className="card empty-state">
            <div>
              <h2>Enterprise workspace access</h2>
              <p>
                Sign in to load workspace-scoped sites, protected automations, and role-based
                enterprise controls.
              </p>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
