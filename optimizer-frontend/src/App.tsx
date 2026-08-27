import { useEffect, useMemo, useRef, useState } from 'react';
import { ApiError, api } from './api';
import './App.css';
import { AccountSecurityCard } from './components/AccountSecurityCard';
import { AdminConsoleCard } from './components/AdminConsoleCard';
import { HeroPanel } from './components/HeroPanel';
import { LoginCard } from './components/LoginCard';
import { PasswordResetCard } from './components/PasswordResetCard';
import { SiteFormCard, type SiteFormState } from './components/SiteFormCard';
import { SiteResultsPanel } from './components/SiteResultsPanel';
import { SitesListCard } from './components/SitesListCard';
import { buildMarketTargets } from './utils/markets';
import type {
  AuthSessionRecord,
  CountryCode,
  CreateWorkspaceUserInput,
  ExecutionMode,
  LoginInput,
  OptionsResponse,
  Provider,
  SessionContext,
  SiteConnection,
  SiteDetailResponse,
  SiteListItem,
  WorkspaceUser,
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

const initialCreateUserForm: CreateWorkspaceUserInput = {
  email: '',
  name: '',
  role: 'viewer',
  password: '',
};

function App() {
  const [options, setOptions] = useState<OptionsResponse | null>(null);
  const [session, setSession] = useState<SessionContext | null>(null);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [resetPasswordForm, setResetPasswordForm] = useState({ token: '', newPassword: '' });
  const [createUserForm, setCreateUserForm] = useState(initialCreateUserForm);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [sites, setSites] = useState<SiteListItem[]>([]);
  const [workspaceUsers, setWorkspaceUsers] = useState<WorkspaceUser[]>([]);
  const [workspaceSessions, setWorkspaceSessions] = useState<AuthSessionRecord[]>([]);
  const [mySessions, setMySessions] = useState<AuthSessionRecord[]>([]);
  const [resetTokenInfo, setResetTokenInfo] = useState<{
    token: string;
    email: string;
    expiresAt: string;
  } | null>(null);
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
    api.clearSession();
    setSession(null);
    setSites([]);
    setWorkspaceUsers([]);
    setWorkspaceSessions([]);
    setMySessions([]);
    setResetTokenInfo(null);
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

  async function refreshSecurityData(liveSession: SessionContext) {
    const [ownSessions, users, sessions] = await Promise.all([
      api.getMySessions(),
      liveSession.role === 'admin' ? api.listWorkspaceUsers() : Promise.resolve([]),
      liveSession.role === 'admin' ? api.listWorkspaceSessions() : Promise.resolve([]),
    ]);
    setMySessions(ownSessions);
    setWorkspaceUsers(users);
    setWorkspaceSessions(sessions);
  }

  async function refreshSites(nextSiteId?: string, providedOptions?: OptionsResponse | null) {
    const requestId = ++loadSequence.current;
    const liveOptions = providedOptions ?? options ?? (await api.getOptions());
    const [siteList, liveSession] = await Promise.all([api.listSites(), api.getSession()]);
    if (requestId !== loadSequence.current) return;
    applyOptions(liveOptions);
    setSites(siteList);
    setSession(liveSession);
    await refreshSecurityData(liveSession);
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
          await refreshSecurityData(liveSession);
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
      api.clearSession();
      setStatusMessage(error instanceof Error ? error.message : 'Failed to sign in.');
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleLogout() {
    setAuthBusy(true);
    try {
      await api.logout();
    } finally {
      setAuthBusy(false);
      resetAuthenticatedState('Signed out. Sign in to continue.');
    }
  }

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthBusy(true);
    try {
      await api.confirmPasswordReset(resetPasswordForm);
      setResetPasswordForm({ token: '', newPassword: '' });
      setStatusMessage('Password reset completed. Sign in with the new password.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to reset password.');
    } finally {
      setAuthBusy(false);
    }
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

  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyAction('change-password');
    try {
      await api.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      resetAuthenticatedState('Password changed. Sign in again with the new password.');
    } catch (error) {
      setStatusMessage(resolveApiError(error, 'Failed to change password.'));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleRevokeOwnSession(sessionId: string) {
    setBusyAction(`revoke-own-${sessionId}`);
    try {
      await api.revokeMySession(sessionId);
      if (session) {
        await refreshSecurityData(session);
      }
      setStatusMessage('Session revoked.');
    } catch (error) {
      setStatusMessage(resolveApiError(error, 'Failed to revoke session.'));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyAction('create-user');
    try {
      await api.createWorkspaceUser(createUserForm);
      if (session) {
        await refreshSecurityData(session);
      }
      setCreateUserForm(initialCreateUserForm);
      setStatusMessage('Workspace user created.');
    } catch (error) {
      setStatusMessage(resolveApiError(error, 'Failed to create user.'));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleUpdateUser(userId: string, payload: { role?: WorkspaceUser['role'] }) {
    setBusyAction(`update-user-${userId}`);
    try {
      await api.updateWorkspaceUser(userId, payload);
      if (session) {
        await refreshSecurityData(session);
      }
      setStatusMessage('Workspace user updated.');
    } catch (error) {
      setStatusMessage(resolveApiError(error, 'Failed to update user.'));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleRemoveMembership(userId: string) {
    setBusyAction(`remove-member-${userId}`);
    try {
      await api.deleteWorkspaceMembership(userId);
      if (session) {
        await refreshSecurityData(session);
      }
      setStatusMessage('Workspace member removed.');
    } catch (error) {
      setStatusMessage(resolveApiError(error, 'Failed to remove member.'));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleCreateResetToken(userId: string) {
    setBusyAction(`reset-token-${userId}`);
    try {
      const result = await api.createPasswordResetToken(userId);
      setResetTokenInfo({
        token: result.token,
        email: result.email,
        expiresAt: result.expiresAt,
      });
      setStatusMessage(`Password reset token created for ${result.email}.`);
    } catch (error) {
      setStatusMessage(resolveApiError(error, 'Failed to create password reset token.'));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleRevokeWorkspaceSession(sessionId: string) {
    setBusyAction(`revoke-session-${sessionId}`);
    try {
      await api.revokeWorkspaceSession(sessionId);
      if (session) {
        await refreshSecurityData(session);
      }
      setStatusMessage('Workspace session revoked.');
    } catch (error) {
      setStatusMessage(resolveApiError(error, 'Failed to revoke workspace session.'));
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
            <AccountSecurityCard
              sessions={mySessions}
              busy={busyAction}
              passwordForm={passwordForm}
              onPasswordFormChange={setPasswordForm}
              onChangePassword={handleChangePassword}
              onRevokeSession={(sessionId) => void handleRevokeOwnSession(sessionId)}
            />
          </div>
          <div className="main-panel">
            {session.role === 'admin' ? (
              <AdminConsoleCard
                users={workspaceUsers}
                sessions={workspaceSessions}
                createForm={createUserForm}
                busy={busyAction}
                resetTokenInfo={resetTokenInfo}
                onCreateFormChange={setCreateUserForm}
                onCreateUser={handleCreateUser}
                onUpdateUser={(userId, payload) => void handleUpdateUser(userId, payload)}
                onRemoveMembership={(userId) => void handleRemoveMembership(userId)}
                onCreateResetToken={(userId) => void handleCreateResetToken(userId)}
                onRevokeSession={(sessionId) => void handleRevokeWorkspaceSession(sessionId)}
              />
            ) : null}
            <SiteResultsPanel
              loading={loading}
              selectedSite={selectedSite}
              siteDetail={siteDetail}
              busyAction={busyAction}
              onRunAction={(action) => void runAction(action)}
            />
          </div>
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
            <PasswordResetCard
              form={resetPasswordForm}
              busy={authBusy}
              onSubmit={handleResetPassword}
              onFormChange={setResetPasswordForm}
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
