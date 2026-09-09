import { useEffect, useMemo, useState } from 'react';
import { Building2, CheckCircle2, Eye, EyeOff, LockKeyhole, Save, UserRound } from 'lucide-react';
import { authApi } from '../../api/auth';
import { getFriendlyErrorMessage } from '../../api/client';
import { clearStoredUser } from '../../api/session';
import { useLuluApp } from '../../api/LuluAppContext';
import { workspaceProfileApi, type WorkspaceProfile } from '../../api/workspaces';
import { routes } from '../../routing';
import { useTranslation } from '../../i18n/GlobalLanguageSwitcher';
import { WorkspaceSurfaceShell } from '../../components/WorkspaceSurfaceShell';

type ProfileForm = Omit<WorkspaceProfile, 'workspaceId'>;
type AccountForm = { firstName: string; lastName: string };
type PasswordForm = { currentPassword: string; newPassword: string; confirmPassword: string };

const emptyProfile: ProfileForm = {
  companyName: '', industry: '', countryRegion: '', taxId: '', address: '', legalForm: '',
  legalRepresentative: '', phoneNumber: '', bankAccountNumber: '', bankOpeningBank: '', bankBranch: '', bankCode: '',
};
const emptyPassword: PasswordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
const inputClass = 'w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[var(--ring)]';

function profileToForm(profile: WorkspaceProfile | null | undefined): ProfileForm {
  return Object.fromEntries(Object.keys(emptyProfile).map((key) => [key, profile?.[key as keyof ProfileForm] ?? ''])) as ProfileForm;
}

function workspaceToProfileForm(workspace: NonNullable<ReturnType<typeof useLuluApp>['selectedWorkspace']>): ProfileForm {
  return {
    ...emptyProfile,
    companyName: workspace.companyName ?? '',
    industry: workspace.industry ?? '',
    countryRegion: workspace.countryRegion ?? '',
    taxId: workspace.taxId ?? '',
    address: workspace.address ?? '',
    legalForm: workspace.legalForm ?? '',
  };
}

export default function ProfilePage() {
  const t = useTranslation();
  const { currentUser, selectedWorkspace, permissions, updateWorkspace } = useLuluApp();
  const [account, setAccount] = useState<AccountForm>({ firstName: currentUser?.firstName ?? '', lastName: currentUser?.lastName ?? '' });
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [loading, setLoading] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [password, setPassword] = useState<PasswordForm>(emptyPassword);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Company/legal identity is required before billing is active.  Keep this
  // screen available to workspace owners/admins even when the commercial
  // workspace.write entitlement is disabled; the backend still performs the
  // authoritative membership/capability check.
  const canManageWorkspaceProfile = permissions.role === 'owner' || permissions.role === 'admin';
  const workspaceId = selectedWorkspace?.id;

  useEffect(() => {
    setAccount({ firstName: currentUser?.firstName ?? '', lastName: currentUser?.lastName ?? '' });
  }, [currentUser?.firstName, currentUser?.lastName]);

  useEffect(() => {
    let active = true;
    if (!workspaceId || !canManageWorkspaceProfile) {
      setProfile(emptyProfile);
      return () => { active = false; };
    }
    setLoading(true);
    setError('');
    void workspaceProfileApi.get(workspaceId)
      .then((response) => {
        if (!active) return;
        // Keep the response contract strict, but do not blank the complete
        // profile if a rolling deployment returns an incomplete envelope.
        if (response.data && typeof response.data === 'object') setProfile(profileToForm(response.data));
        else if (selectedWorkspace) setProfile(workspaceToProfileForm(selectedWorkspace));
      })
      .catch((cause) => {
        if (!active) return;
        // The workspace list already contains the non-sensitive company
        // fields. Use it as a read-only fallback while the protected profile
        // endpoint recovers, so an optional banking-field issue cannot make
        // the whole Profile page unusable.
        if (selectedWorkspace) {
          setProfile(workspaceToProfileForm(selectedWorkspace));
          setError('');
          return;
        }
        setError(getFriendlyErrorMessage(cause, t('The company profile could not be loaded.')));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [workspaceId, canManageWorkspaceProfile, t]);

  const updateAccount = async () => {
    if (!account.firstName.trim() || !account.lastName.trim()) {
      setError(t('First and last name are required.'));
      return;
    }
    setSavingAccount(true); setError(''); setNotice('');
    try {
      const response = await authApi.updateMe({ firstName: account.firstName.trim(), lastName: account.lastName.trim() });
      updateAccountState(response.data);
      setNotice(t('Your personal profile was updated.'));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('Your personal profile could not be saved.')));
    } finally { setSavingAccount(false); }
  };

  const updateAccountState = (next: { firstName: string | null; lastName: string | null }) => {
    setAccount({ firstName: next.firstName ?? '', lastName: next.lastName ?? '' });
  };

  const updateCompanyProfile = async () => {
    if (!workspaceId || !canManageWorkspaceProfile) return;
    if (!profile.companyName.trim()) { setError(t('Company name is required.')); return; }
    setSavingProfile(true); setError(''); setNotice('');
    try {
      const payload = Object.fromEntries(Object.entries(profile).map(([key, value]) => [key, typeof value === 'string' && !value.trim() ? null : typeof value === 'string' ? value.trim() : value]));
      const response = await workspaceProfileApi.update(workspaceId, payload);
      // A rolling deployment or proxy may return a successful envelope before
      // the response body is populated. Keep the submitted values in that
      // case instead of turning a successful save into a client-side error.
      const savedProfile = response.data && typeof response.data === 'object'
        ? profileToForm(response.data)
        : profile;
      setProfile(savedProfile);
      // Keep the shared workspace header in sync for the next navigation.
      if (selectedWorkspace && response.data && typeof response.data === 'object') updateWorkspace({ ...selectedWorkspace, companyName: response.data.companyName, industry: response.data.industry, countryRegion: response.data.countryRegion, taxId: response.data.taxId, address: response.data.address, legalForm: response.data.legalForm });
      setNotice(t('Company profile was updated.'));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('The company profile could not be saved.')));
    } finally { setSavingProfile(false); }
  };

  const passwordRequirements = useMemo(() => password.newPassword.length >= 12
    && /[A-Z]/.test(password.newPassword)
    && /[a-z]/.test(password.newPassword)
    && /[0-9]/.test(password.newPassword)
    && /[^A-Za-z0-9]/.test(password.newPassword), [password.newPassword]);

  const changePassword = async () => {
    if (!password.currentPassword || !password.newPassword) { setError(t('Enter your current and new password.')); return; }
    if (!passwordRequirements) { setError(t('The new password must be at least 12 characters and include upper case, lower case, a number and a special character.')); return; }
    if (password.newPassword !== password.confirmPassword) { setError(t('The new passwords do not match.')); return; }
    setChangingPassword(true); setError(''); setNotice('');
    try {
      await authApi.changePassword({ currentPassword: password.currentPassword, newPassword: password.newPassword });
      clearStoredUser();
      window.location.replace(routes.auth.login);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('The password could not be changed.')));
      setChangingPassword(false);
    }
  };

  const updateField = (key: keyof ProfileForm, value: string) => setProfile((current) => ({ ...current, [key]: value }));
  const field = (key: keyof ProfileForm, label: string, options: { type?: string; sensitive?: boolean; wide?: boolean } = {}) => (
    <label key={key} className={options.wide ? 'sm:col-span-2' : undefined}>
      <span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{label}</span>
      <div className="relative">
        <input type={options.sensitive ? 'password' : options.type ?? 'text'} value={profile[key] ?? ''} onChange={(event) => updateField(key, event.target.value)} className={`${inputClass}${options.sensitive ? ' pr-10' : ''}`} autoComplete="off" />
      </div>
    </label>
  );

  if (!selectedWorkspace) return <WorkspaceSurfaceShell activeSlug="profile"><main className="page-frame p-8"><h1 className="text-2xl font-semibold">{t('Profile')}</h1><p className="mt-2 text-[var(--muted-foreground)]">{t('Choose a workspace to continue.')}</p></main></WorkspaceSurfaceShell>;

  return <WorkspaceSurfaceShell activeSlug="profile"><main className="page-frame min-h-screen bg-[var(--background)] p-4 sm:p-8"><div className="mx-auto max-w-5xl space-y-6">
    <header><p className="eyebrow">{t('Workspace settings')}</p><h1 className="text-3xl font-semibold tracking-tight">{t('Profile')}</h1><p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">{t('Manage your account and the legal, contact and banking details for this workspace.')}</p></header>
    {error ? <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div> : null}
    {notice ? <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><CheckCircle2 size={16}/>{notice}</div> : null}

    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3"><div className="rounded-xl bg-[var(--secondary)] p-2.5"><UserRound size={18}/></div><div><h2 className="text-lg font-semibold">{t('Your account')}</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">{t('Update your name or change your password.')}</p></div></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{t('Email')}</span><input value={currentUser?.email ?? ''} readOnly className={`${inputClass} cursor-not-allowed bg-[var(--secondary)]`} /></label><div /><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{t('First name')}</span><input value={account.firstName} onChange={(event) => setAccount({ ...account, firstName: event.target.value })} className={inputClass} autoComplete="given-name" /></label><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{t('Last name')}</span><input value={account.lastName} onChange={(event) => setAccount({ ...account, lastName: event.target.value })} className={inputClass} autoComplete="family-name" /></label></div>
      <div className="mt-4 flex justify-end"><button type="button" onClick={() => void updateAccount()} disabled={savingAccount} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-50"><Save size={15}/>{savingAccount ? t('Saving…') : t('Save account')}</button></div>
      <div className="mt-7 border-t border-[var(--border)] pt-6"><div className="flex items-start gap-3"><div className="rounded-xl bg-[var(--secondary)] p-2.5"><LockKeyhole size={18}/></div><div><h3 className="font-semibold">{t('Change password')}</h3><p className="mt-1 text-sm text-[var(--muted-foreground)]">{t('For your security, all active sessions will be signed out after a successful change.')}</p></div></div><div className="mt-4 grid gap-4 sm:grid-cols-3"><PasswordInput label={t('Current password')} value={password.currentPassword} onChange={(value) => setPassword({ ...password, currentPassword: value })} visible={showCurrentPassword} onToggle={() => setShowCurrentPassword((value) => !value)} autoComplete="current-password"/><PasswordInput label={t('New password')} value={password.newPassword} onChange={(value) => setPassword({ ...password, newPassword: value })} visible={showNewPassword} onToggle={() => setShowNewPassword((value) => !value)} autoComplete="new-password"/><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{t('Confirm new password')}</span><input type="password" value={password.confirmPassword} onChange={(event) => setPassword({ ...password, confirmPassword: event.target.value })} className={inputClass} autoComplete="new-password" /></label></div><p className={`mt-3 text-xs ${password.newPassword && !passwordRequirements ? 'text-amber-700' : 'text-[var(--muted-foreground)]'}`}>{t('At least 12 characters with upper case, lower case, a number and a special character.')}</p><div className="mt-4 flex justify-end"><button type="button" onClick={() => void changePassword()} disabled={changingPassword} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium disabled:opacity-50"><LockKeyhole size={15}/>{changingPassword ? t('Changing…') : t('Change password')}</button></div></div>
    </section>

    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3"><div className="rounded-xl bg-[var(--secondary)] p-2.5"><Building2 size={18}/></div><div><h2 className="text-lg font-semibold">{t('Company profile')}</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">{canManageWorkspaceProfile ? t('These details are used for documents, billing and business identity.') : t('Only workspace owners and admins can view or edit company and banking details.')}</p></div></div>
      {!canManageWorkspaceProfile ? <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{t('Ask a workspace owner or admin to manage these details.')}</div> : <>
        {loading ? <div className="mt-6 rounded-xl bg-[var(--secondary)] p-8 text-center text-sm text-[var(--muted-foreground)]">{t('Loading profile…')}</div> : <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">{field('companyName', t('Company name'))}{field('industry', t('Industry'))}{field('countryRegion', t('Country / region'))}{field('taxId', t('Tax ID'))}{field('legalForm', t('Legal form'))}{field('legalRepresentative', t('Legal representative'))}{field('phoneNumber', t('Phone number'))}{field('address', t('Address'), { wide: true })}</div>
          <div className="mt-7 border-t border-[var(--border)] pt-6"><h3 className="font-semibold">{t('Bank details')}</h3><p className="mt-1 text-sm text-[var(--muted-foreground)]">{t('Store the payout details used for this workspace. Access is limited to workspace admins.')}</p><div className="mt-4 grid gap-4 sm:grid-cols-2">{field('bankAccountNumber', t('Bank account number'))}{field('bankCode', t('Bank code'))}{field('bankOpeningBank', t('Account opening bank'))}{field('bankBranch', t('Branch'))}</div></div>
          <div className="mt-6 flex justify-end"><button type="button" onClick={() => void updateCompanyProfile()} disabled={savingProfile || loading} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-50"><Save size={15}/>{savingProfile ? t('Saving…') : t('Save company profile')}</button></div>
        </>}
      </>}
    </section>
  </div></main></WorkspaceSurfaceShell>;
}

function PasswordInput({ label, value, onChange, visible, onToggle, autoComplete }: { label: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle: () => void; autoComplete: string }) {
  return <label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{label}</span><div className="relative"><input type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} pr-10`} autoComplete={autoComplete}/><button type="button" onClick={onToggle} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--muted-foreground)] hover:bg-[var(--secondary)]" aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={15}/> : <Eye size={15}/>}</button></div></label>;
}
