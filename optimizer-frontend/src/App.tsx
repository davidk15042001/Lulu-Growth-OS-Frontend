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
  AppliedMigration,
  AuthSessionRecord,
  CountryCode,
  CreateWorkspaceUserInput,
  ExecutionMode,
  LoginInput,
  MfaSetupResponse,
  MfaState,
  OptionsResponse,
  Permission,
  Provider,
  RunQueueJob,
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
  mfaCode: '',
};

const initialCreateUserForm: CreateWorkspaceUserInput = {
  email: '',
  name: '',
  role: 'viewer',
  password: '',
};

function hasPermission(session: SessionContext | null, permission: Permission) {
  return Boolean(session?.permissions.includes(permission));
}

function App() {
  const [options, setOptions] = useState<OptionsResponse | null>(null);
  const [session, setSession] = useState<SessionContext | null>(null);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [resetPasswordForm, setResetPasswordForm] = useState({ token: '', newPassword: '' });
  const [createUserForm, setCreateUserForm] = useState(initialCreateUserForm);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [mfaState, setMfaState] = useState<MfaState | null>(null);
  const [mfaSetup, setMfaSetup] = useState<Pick<MfaSetupResponse, 'secret' | 'otpAuthUrl'> | null>(null);
  const [mfaForm, setMfaForm] = useState({ verifyCode: '', disableCode: '', disablePassword: '' });
  const [sites, setSites] = useState<SiteListItem[]>([]);
  const [workspaceUsers, setWorkspaceUsers] = useState<WorkspaceUser[]>([]);
  const [workspaceSessions, setWorkspaceSessions] = useState<AuthSessionRecord[]>([]);
  const [queueJobs, setQueueJobs] = useState<RunQueueJob[]>([]);
  const [appliedMigrations, setAppliedMigrations] = useState<AppliedMigration[]>([]);
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
    setQueueJobs([]);
    setAppliedMigrations([]);
    setMySessions([]);
    setMfaState(null);
    setMfaSetup(null);
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
    const canReadUsers = hasPermission(liveSession, 'admin:users:read');
    const canReadSessions = hasPermission(liveSession, 'admin:sessions:read');
    const canReadQueue = hasPermission(liveSession, 'admin:queue:read');
    const canReadMigrations = hasPermission(liveSession, 'admin:migrations:read');
    const [ownSessions, users, sessions, nextMfaState, nextQueueJobs, nextAppliedMigrations] = await Promise.all([
      api.getMySessions(),
      canReadUsers ? api.listWorkspaceUsers() : Promise.resolve([]),
      canReadSessions ? api.listWorkspaceSessions() : Promise.resolve([]),
      api.getMfaState(),
      canReadQueue ? api.listRunQueueJobs() : Promise.resolve([]),
      canReadMigrations ? api.listAppliedMigrations() : Promise.resolve([]),
    ]);
    setMySessions(ownSessions);
    setWorkspaceUsers(users);
    setWorkspaceSessions(sessions);
    setQueueJobs(nextQueueJobs);
    setAppliedMigrations(nextAppliedMigrations);
    setMfaState(nextMfaState);
    if (!nextMfaState.pending) {
      setMfaSetup(null);
    }
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
  const canWriteSites = useMemo(() => hasPermission(session, 'sites:write'), [session]);
  const canExecuteRuns = useMemo(() => hasPermission(session, 'runs:execute'), [session]);
  const canSeeAdminConsole = useMemo(
    () =>
      hasPermission(session, 'admin:users:read') ||
      hasPermission(session, 'admin:sessions:read') ||
      hasPermission(session, 'admin:queue:read') ||
      hasPermission(session, 'admin:migrations:read'),
    [session],
  );
  const marketTargetsPreview = useMemo(
    () => buildMarketTargets(form.targetCountries, options?.countries ?? []),
    [form.targetCountries, options?.countries],
  );

  async function waitForRunCompletion(siteId: string, runId: string) {
    let latestDetail = await api.getSite(siteId);
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const trackedRun =
        latestDetail.runs.find((candidate) => candidate.id === runId) ??
        (latestDetail.lastRun?.id === runId ? latestDetail.lastRun : null);
      if (!trackedRun || trackedRun.status === 'completed' || trackedRun.status === 'failed') {
        return latestDetail;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 750));
      latestDetail = await api.getSite(siteId);
    }
    return latestDetail;
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthBusy(true);
    setStatusMessage('Signing in to enterprise workspace...');
    try {
      const result = await api.login(loginForm);
      setSession(result.session);
      await refreshSites(undefined, options);
      setLoginForm((current) => ({ ...current, password: '', mfaCode: '' }));
      setStatusMessage(`Signed in as ${result.session.name}.`);
    } catch (error) {
      api.clearSession();
      setStatusMessage(
        error instanceof ApiError && error.code === 'MFA_REQUIRED'
          ? 'MFA code required. Enter the 6-digit authenticator code and sign in again.'
          : error instanceof Error
            ? error.message
            : 'Failed to sign in.',
      );
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
    if (!selectedSite || !canExecuteRuns) return;
    setBusyAction(action);
    const label =
      action === 'analysis'
        ? 'Running AI analysis...'
        : action === 'optimization'
          ? 'Running optimization pass...'
          : 'Running full analyze-and-optimize cycle...';
    setStatusMessage(label);
    try {
      let submittedRun;
      if (action === 'analysis') {
        submittedRun = await api.runAnalysis(selectedSite.id);
      } else if (action === 'optimization') {
        submittedRun = await api.runOptimization(selectedSite.id);
      } else {
        submittedRun = await api.runFullCycle(selectedSite.id);
      }
      const requestId = ++loadSequence.current;
      const detail = await waitForRunCompletion(selectedSite.id, submittedRun.id);
      if (requestId !== loadSequence.current) return;
      setSiteDetail(detail);
      const latestRun =
        detail.runs.find((run) => run.id === submittedRun.id) ??
        (detail.lastRun?.id === submittedRun.id ? detail.lastRun : null);
      if (session) {
        await refreshSecurityData(session);
      }
      if (latestRun?.status === 'completed') {
        setStatusMessage(`Completed ${action.replace('_', ' ')} for ${detail.site.name}.`);
      } else if (latestRun?.status === 'failed') {
        setStatusMessage(latestRun.error || `Execution failed for ${detail.site.name}.`);
      } else {
        setStatusMessage(`Queued ${action.replace('_', ' ')} for ${detail.site.name}.`);
      }
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

  async function handleStartMfaSetup() {
    setBusyAction('mfa-setup');
    try {
      const result = await api.startMfaSetup();
      setMfaState({ enabled: result.enabled, pending: result.pending });
      setMfaSetup({ secret: result.secret, otpAuthUrl: result.otpAuthUrl });
      setStatusMessage('MFA secret generated. Add it to your authenticator app and verify the code.');
    } catch (error) {
      setStatusMessage(resolveApiError(error, 'Failed to start MFA setup.'));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleEnableMfa(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyAction('mfa-enable');
    try {
      const result = await api.enableMfa(mfaForm.verifyCode);
      setMfaState(result);
      setMfaSetup(null);
      setMfaForm({ verifyCode: '', disableCode: '', disablePassword: '' });
      setStatusMessage('MFA enabled successfully.');
      if (session) {
        await refreshSecurityData(session);
      }
    } catch (error) {
      setStatusMessage(resolveApiError(error, 'Failed to enable MFA.'));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleDisableMfa(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyAction('mfa-disable');
    try {
      const result = await api.disableMfa({
        password: mfaForm.disablePassword,
        code: mfaForm.disableCode,
      });
      setMfaState(result);
      setMfaSetup(null);
      setMfaForm({ verifyCode: '', disableCode: '', disablePassword: '' });
      setStatusMessage('MFA disabled.');
      if (session) {
        await refreshSecurityData(session);
      }
    } catch (error) {
      setStatusMessage(resolveApiError(error, 'Failed to disable MFA.'));
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
            {canWriteSites ? (
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
            ) : null}
            <SitesListCard
              sites={sites}
              selectedSiteId={selectedSiteId}
              onSelectSite={(siteId) => void selectSite(siteId)}
            />
            <AccountSecurityCard
              sessions={mySessions}
              mfaState={mfaState}
              mfaSetup={mfaSetup}
              mfaForm={mfaForm}
              busy={busyAction}
              passwordForm={passwordForm}
              onPasswordFormChange={setPasswordForm}
              onMfaFormChange={setMfaForm}
              onChangePassword={handleChangePassword}
              onStartMfaSetup={() => void handleStartMfaSetup()}
              onEnableMfa={handleEnableMfa}
              onDisableMfa={handleDisableMfa}
              onRevokeSession={(sessionId) => void handleRevokeOwnSession(sessionId)}
            />
          </div>
          <div className="main-panel">
            {canSeeAdminConsole ? (
              <AdminConsoleCard
                users={workspaceUsers}
                sessions={workspaceSessions}
                queueJobs={queueJobs}
                appliedMigrations={appliedMigrations}
                permissions={session.permissions}
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
              canExecuteRuns={canExecuteRuns}
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
                Sign in to load workspace-scoped sites, protected automations, and permission-based
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
