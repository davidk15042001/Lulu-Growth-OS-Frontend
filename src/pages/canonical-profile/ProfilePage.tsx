import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { Building2, CheckCircle2, Eye, EyeOff, ImagePlus, LockKeyhole, Save, Trash2, UserRound } from 'lucide-react';
import { authApi } from '../../api/auth';
import { ApiError, getFriendlyErrorMessage } from '../../api/client';
import { clearStoredUser } from '../../api/session';
import { useLuluApp } from '../../api/LuluAppContext';
import { workspaceProfileApi, type WorkspaceProfile } from '../../api/workspaces';
import { navigateApp, routes } from '../../routing';
import { OnboardingHeader } from '../../components/OnboardingHeader';
import { useTranslation } from '../../i18n/GlobalLanguageSwitcher';
import { WorkspaceSurfaceShell } from '../../components/WorkspaceSurfaceShell';

type ProfileField = 'companyName'|'industry'|'countryRegion'|'taxId'|'address'|'legalForm'|'legalRepresentative'|'phoneNumber'|'bankAccountNumber'|'bankOpeningBank'|'bankBranch'|'bankCode'|'branch';
type ProfileForm = Record<ProfileField,string>;
type AccountForm = { firstName: string; lastName: string };
type PasswordForm = { currentPassword: string; newPassword: string; confirmPassword: string };
type PendingLogo = { file: File; url: string; width: number; height: number; baseScale: number };
type CropOffset = { x: number; y: number };
type FieldErrorKey = ProfileField | keyof AccountForm | 'companyLogo';

const cropViewportSize = 320;

function resolveMediaUrl(value: string | null | undefined) {
  const url = String(value ?? '').trim();
  if (!url) return null;
  if (/^(blob:|data:|https?:\/\/)/i.test(url)) return url;
  try {
    return new URL(url, window.location.origin).toString();
  } catch {
    return url;
  }
}

const emptyProfile: ProfileForm = {
  companyName: '', industry: '', countryRegion: '', taxId: '', address: '', legalForm: '',
  legalRepresentative: '', phoneNumber: '', bankAccountNumber: '', bankOpeningBank: '', bankBranch: '', bankCode: '', branch: '',
};
const emptyPassword: PasswordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
const inputClass = 'w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[var(--ring)]';
const requiredActivationFields: FieldErrorKey[] = ['firstName', 'lastName', 'companyName', 'industry', 'countryRegion', 'taxId', 'legalForm', 'legalRepresentative', 'phoneNumber', 'address', 'companyLogo', 'bankAccountNumber', 'bankCode', 'bankOpeningBank', 'bankBranch', 'branch'];
const countries = ['China', 'Germany', 'United States', 'United Kingdom', 'France', 'Netherlands', 'Austria', 'Switzerland', 'Singapore', 'Hong Kong', 'Other'];
const industries = ['E-commerce', 'Manufacturing', 'SaaS', 'Professional services', 'Retail', 'Healthcare', 'Education', 'Finance', 'Logistics', 'Hospitality', 'Other'];
const branches = ['Consumer goods', 'Industrial goods', 'B2B services', 'B2C services', 'Software', 'Marketplace', 'Wholesale', 'Local services', 'Other'];
const legalFormsByCountry: Record<string, string[]> = {
  China: ['Limited liability company', 'Joint stock company', 'Partnership', 'Sole proprietorship', 'Foreign-invested enterprise', 'Other'],
  Germany: ['GmbH', 'UG', 'AG', 'e.K.', 'GbR', 'OHG', 'KG', 'Other'],
  'United States': ['LLC', 'Corporation', 'S Corporation', 'Partnership', 'Sole proprietorship', 'Nonprofit', 'Other'],
  'United Kingdom': ['Limited company', 'PLC', 'LLP', 'Partnership', 'Sole trader', 'Other'],
  France: ['SARL', 'SAS', 'SA', 'EURL', 'Entreprise individuelle', 'Other'],
  Netherlands: ['BV', 'NV', 'VOF', 'Eenmanszaak', 'Stichting', 'Other'],
  Austria: ['GmbH', 'AG', 'OG', 'KG', 'Einzelunternehmen', 'Other'],
  Switzerland: ['GmbH', 'AG', 'Kollektivgesellschaft', 'Einzelunternehmen', 'Other'],
  Singapore: ['Private limited company', 'Public company', 'LLP', 'Sole proprietorship', 'Other'],
  'Hong Kong': ['Private company limited by shares', 'Public company', 'Partnership', 'Sole proprietorship', 'Other'],
  Other: ['Limited company', 'Corporation', 'Partnership', 'Sole proprietorship', 'Nonprofit', 'Other'],
};

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

function legalFormOptions(countryRegion: string) {
  return legalFormsByCountry[countries.find((country) => country.toLowerCase() === countryRegion.trim().toLowerCase()) ?? 'Other'];
}

function extractFieldErrors(error: unknown) {
  if (!(error instanceof ApiError) || !error.details || typeof error.details !== 'object') return {};
  const fields = (error.details as { fields?: unknown }).fields;
  if (!fields || typeof fields !== 'object') return {};
  return Object.fromEntries(Object.entries(fields as Record<string, unknown>).filter(([, value]) => typeof value === 'string')) as Partial<Record<FieldErrorKey,string>>;
}

function constrainCropOffset(offset: CropOffset, width: number, height: number, scale: number): CropOffset {
  const maxX = Math.max(0, (width * scale - cropViewportSize) / 2);
  const maxY = Math.max(0, (height * scale - cropViewportSize) / 2);
  return {
    x: Math.min(maxX, Math.max(-maxX, offset.x)),
    y: Math.min(maxY, Math.max(-maxY, offset.y)),
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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldErrorKey,string>>>({});
  const [notice, setNotice] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [pendingLogo, setPendingLogo] = useState<PendingLogo | null>(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState<CropOffset>({ x: 0, y: 0 });
  const [cropImageLoaded, setCropImageLoaded] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const cropDragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const workspaceId = selectedWorkspace?.id;
  const activationMode = selectedWorkspace?.onboardingStep === 'profile_completion' && !selectedWorkspace.onboardingCompletedAt;
  // During activation the bootstrap endpoint can be unavailable because the
  // workspace gate intentionally blocks normal app data. The workspace list
  // still carries the authoritative membership role, so owners/admins must be
  // able to complete the profile without waiting for bootstrap permissions.
  const profileRole = selectedWorkspace?.role ?? permissions.role;
  const isOnboardingCreator = Boolean(activationMode && currentUser?.id && selectedWorkspace?.createdBy === currentUser.id);
  const canManageWorkspaceProfile = activationMode
    ? profileRole === 'owner' || profileRole === 'admin' || isOnboardingCreator
    : (profileRole === 'owner' || profileRole === 'admin') && permissions.status === 'ready';
  const [profileGateActive, setProfileGateActive] = useState(activationMode);
  const requiredProfileMode = activationMode || profileGateActive;

  useEffect(() => {
    setAccount({ firstName: currentUser?.firstName ?? '', lastName: currentUser?.lastName ?? '' });
  }, [currentUser?.firstName, currentUser?.lastName]);

  useEffect(() => {
    let active = true;
    if (!workspaceId || !canManageWorkspaceProfile) {
      setProfile(emptyProfile);
      setProfileGateActive(false);
      return () => { active = false; };
    }
    setProfileGateActive(activationMode);
    setLoading(true);
    setError('');
    void workspaceProfileApi.get(workspaceId)
      .then((response) => {
        if (!active) return;
        // Keep the response contract strict, but do not blank the complete
        // profile if a rolling deployment returns an incomplete envelope.
        if (response.data && typeof response.data === 'object') {
          setProfile(profileToForm(response.data));
          setAccount((current) => ({
            firstName: response.data.firstName ?? current.firstName,
            lastName: response.data.lastName ?? current.lastName,
          }));
          setLogoUrl(resolveMediaUrl(response.data.logoUrl));
          setLogoFileName(response.data.logoFileName ?? null);
          setLogoLoadError(false);
          setProfileGateActive(activationMode || (Array.isArray(response.data.missingRequiredFields) && response.data.missingRequiredFields.length > 0));
        }
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
          setProfileGateActive(activationMode);
          setError('');
          return;
        }
        setError(getFriendlyErrorMessage(cause, t('The company profile could not be loaded.')));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [workspaceId, canManageWorkspaceProfile, activationMode, t]);

  useEffect(() => () => {
    if (pendingLogo?.url) URL.revokeObjectURL(pendingLogo.url);
  }, [pendingLogo?.url]);

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
    const nextFieldErrors: Partial<Record<FieldErrorKey,string>> = {};
    if (requiredProfileMode) {
      for (const key of requiredActivationFields) {
        const value = key === 'companyLogo' ? logoUrl : key === 'firstName' || key === 'lastName' ? account[key] : profile[key];
        if (!String(value ?? '').trim()) nextFieldErrors[key] = t('Required');
      }
      if (!countries.some((country) => country.toLowerCase() === profile.countryRegion.trim().toLowerCase())) nextFieldErrors.countryRegion = t('Select a supported country or region.');
      if (!legalFormOptions(profile.countryRegion).some((legalForm) => legalForm.toLowerCase() === profile.legalForm.trim().toLowerCase())) nextFieldErrors.legalForm = t('Select a legal form for this country.');
      if (Object.keys(nextFieldErrors).length) {
        setFieldErrors(nextFieldErrors);
        setError(t('Complete every required profile field before continuing.'));
        return;
      }
    }
    const entries = Object.entries(profile).filter(([key, value]) => key !== 'companyName' || (typeof value === 'string' && value.trim()));
    if (entries.length === 0) { setError(t('Enter at least one profile detail.')); return; }
    setSavingProfile(true); setError(''); setNotice(''); setFieldErrors({});
    try {
      const payload = Object.fromEntries(entries.map(([key, value]) => [key, typeof value === 'string' && !value.trim() ? null : typeof value === 'string' ? value.trim() : value]));
      if (requiredProfileMode) await authApi.updateMe({ firstName: account.firstName.trim(), lastName: account.lastName.trim() });
      const response = await workspaceProfileApi.update(workspaceId, payload);
      // A rolling deployment or proxy may return a successful envelope before
      // the response body is populated. Keep the submitted values in that
      // case instead of turning a successful save into a client-side error.
      const savedProfile = response.data && typeof response.data === 'object'
        ? profileToForm(response.data)
        : profile;
      setProfile(savedProfile);
      setProfileGateActive(activationMode || Boolean(response.data?.missingRequiredFields?.length));
      if (response.data?.missingRequiredFields?.length) {
        setFieldErrors(Object.fromEntries(response.data.missingRequiredFields.map((field) => [field, t('Required')])) as Partial<Record<FieldErrorKey,string>>);
        setError(t('The profile is still incomplete. Review the highlighted fields.'));
        return;
      }
      // Keep the shared workspace header in sync for the next navigation.
      if (selectedWorkspace && response.data && typeof response.data === 'object') updateWorkspace({
        ...selectedWorkspace,
        companyName: response.data.companyName,
        industry: response.data.industry,
        countryRegion: response.data.countryRegion,
        taxId: response.data.taxId,
        address: response.data.address,
        legalForm: response.data.legalForm,
        onboardingStep: response.data.onboardingStep,
        profileCompletedAt: response.data.profileCompletedAt,
      });
      setNotice(t('Company profile was updated.'));
      if (activationMode && response.data?.onboardingStep === 'knowledge_base') {
        navigateApp(routes.app.knowledgeBase, { replace: true });
      }
    } catch (cause) {
      const apiFieldErrors = extractFieldErrors(cause);
      if (Object.keys(apiFieldErrors).length) setFieldErrors(apiFieldErrors);
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

  const updateField = (key: keyof ProfileForm, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };
  const uploadLogo = async (file: File | undefined): Promise<boolean> => {
    if (!workspaceId || !file) return false;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError(t('Use a PNG, JPEG or WebP image for the company logo.'));
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t('The company logo must be 5 MB or smaller.'));
      return false;
    }
    setLogoUploading(true); setError(''); setNotice('');
    try {
      const response = await workspaceProfileApi.uploadLogo(workspaceId, file);
      setLogoUrl(resolveMediaUrl(response.data.logoUrl)); setLogoFileName(response.data.logoFileName); setLogoLoadError(false);
      if (fieldErrors.companyLogo) setFieldErrors((current) => ({ ...current, companyLogo: undefined }));
      setNotice(t('Company logo was uploaded and will appear on new invoices and quotes.'));
      return true;
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('The company logo could not be uploaded.')));
      return false;
    } finally { setLogoUploading(false); }
  };
  const openLogoCropper = (file: File | undefined) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError(t('Use a PNG, JPEG or WebP image for the company logo.'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t('The company logo must be 5 MB or smaller.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const baseScale = Math.max(cropViewportSize / image.naturalWidth, cropViewportSize / image.naturalHeight);
      setPendingLogo({ file, url, width: image.naturalWidth, height: image.naturalHeight, baseScale });
      setCropZoom(1);
      setCropOffset({ x: 0, y: 0 });
      setCropImageLoaded(false);
      setError(''); setNotice('');
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError(t('The logo image could not be read.'));
    };
    image.src = url;
  };
  const cropScale = pendingLogo ? pendingLogo.baseScale * cropZoom : 1;
  const moveCrop = (event: PointerEvent<HTMLDivElement>) => {
    const drag = cropDragRef.current;
    if (!pendingLogo || !drag) return;
    setCropOffset(constrainCropOffset({ x: drag.originX + event.clientX - drag.startX, y: drag.originY + event.clientY - drag.startY }, pendingLogo.width, pendingLogo.height, cropScale));
  };
  const endCropDrag = (event?: PointerEvent<HTMLDivElement>) => {
    if (event && event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    cropDragRef.current = null;
  };
  const confirmCropAndUpload = async () => {
    if (!pendingLogo || !cropImageRef.current || !cropImageLoaded || logoUploading) return;
    const image = cropImageRef.current;
    const imageLeft = (cropViewportSize - pendingLogo.width * cropScale) / 2 + cropOffset.x;
    const imageTop = (cropViewportSize - pendingLogo.height * cropScale) / 2 + cropOffset.y;
    const sourceSize = Math.min(pendingLogo.width, pendingLogo.height, cropViewportSize / cropScale);
    const sourceX = Math.max(0, Math.min(pendingLogo.width - sourceSize, -imageLeft / cropScale));
    const sourceY = Math.max(0, Math.min(pendingLogo.height - sourceSize, -imageTop / cropScale));
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const context = canvas.getContext('2d');
    if (!context) { setError(t('The logo image could not be prepared.')); return; }
    context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
    context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) { setError(t('The logo image could not be prepared.')); return; }
    const originalName = pendingLogo.file.name.replace(/\.[^/.]+$/, '') || 'company-logo';
    const croppedFile = new File([blob], `${originalName}-cropped.png`, { type: 'image/png' });
    if (await uploadLogo(croppedFile)) setPendingLogo(null);
  };
  const removeLogo = async () => {
    if (!workspaceId || !logoUrl) return;
    setLogoUploading(true); setError(''); setNotice('');
    try {
      await workspaceProfileApi.deleteLogo(workspaceId);
      setLogoUrl(null); setLogoFileName(null); setNotice(t('Company logo was removed.'));
      if (requiredProfileMode) setFieldErrors((current) => ({ ...current, companyLogo: t('Required') }));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('The company logo could not be removed.')));
    } finally { setLogoUploading(false); }
  };
  const setAccountField = (key: keyof AccountForm, value: string) => {
    setAccount((current) => ({ ...current, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };
  const field = (key: keyof ProfileForm, label: string, options: { type?: string; sensitive?: boolean; wide?: boolean; list?: string; required?: boolean } = {}) => (
    <label key={key} className={options.wide ? 'sm:col-span-2' : undefined}>
      <span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{label}</span>
      <div className="relative">
        <input required={options.required} aria-required={options.required} list={options.list} type={options.sensitive ? 'password' : options.type ?? 'text'} value={profile[key] ?? ''} onChange={(event) => updateField(key, event.target.value)} className={`${inputClass}${options.sensitive ? ' pr-10' : ''} ${fieldErrors[key] ? 'border-rose-400 focus:ring-rose-200' : ''}`} autoComplete="off" />
      </div>
      {fieldErrors[key] ? <span className="mt-1.5 block text-xs font-medium text-rose-700">{fieldErrors[key]}</span> : null}
    </label>
  );
  const legalOptions = legalFormOptions(profile.countryRegion);
  const activationClientComplete = !loading && !savingProfile && !logoUploading && requiredActivationFields.every((key) => {
    const value = key === 'companyLogo' ? logoUrl : key === 'firstName' || key === 'lastName' ? account[key] : profile[key];
    return String(value ?? '').trim().length > 0;
  }) && countries.some((country) => country.toLowerCase() === profile.countryRegion.trim().toLowerCase());

  if (!selectedWorkspace) return <WorkspaceSurfaceShell activeSlug="profile"><main className="page-frame p-8"><h1 className="text-2xl font-semibold">{t('Profile')}</h1><p className="mt-2 text-[var(--muted-foreground)]">{t('Choose a workspace to continue.')}</p></main></WorkspaceSurfaceShell>;

  return <WorkspaceSurfaceShell activeSlug="profile" showNavigation={!activationMode}><main className={`profile-page page-frame ${activationMode ? 'profile-page--activation' : 'profile-page--settings'}`}>
    {activationMode ? <div className="profile-page__onboarding-header"><OnboardingHeader step={3} showBrandName={false}/></div> : null}
    <div className="profile-page__content mx-auto w-full max-w-5xl space-y-6">
    <header className="profile-page__heading"><p className="eyebrow">{activationMode ? '03 / 04 · Company profile' : t('Workspace settings')}</p><h1 className="text-3xl font-semibold tracking-tight">{t('Profile')}</h1><p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">{activationMode ? t('Confirm the minimum operating identity.') : requiredProfileMode ? t('Complete the required company and responsible-person profile.') : t('Manage your account and optional company details for this workspace.')}</p></header>
    {error ? <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div> : null}
    {notice ? <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><CheckCircle2 size={16}/>{notice}</div> : null}
    {activationMode?<section className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/35 p-5"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--muted-foreground)]">Activation gate · 3 of 4</p><h2 className="mt-2 text-xl font-semibold">Confirm the operating identity.</h2><p className="mt-2 text-sm text-[var(--muted-foreground)]">Every required profile field must be valid and saved before Lulu can build the Knowledge Base.</p></section>:null}

    {!requiredProfileMode ? <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3"><div className="rounded-xl bg-[var(--secondary)] p-2.5"><UserRound size={18}/></div><div><h2 className="text-lg font-semibold">{t('Your account')}</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">{t('Update your name or change your password.')}</p></div></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{t('Email')}</span><input value={currentUser?.email ?? ''} readOnly className={`${inputClass} cursor-not-allowed bg-[var(--secondary)]`} /></label><div /><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{t('First name')}</span><input value={account.firstName} onChange={(event) => setAccount({ ...account, firstName: event.target.value })} className={inputClass} autoComplete="given-name" /></label><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{t('Last name')}</span><input value={account.lastName} onChange={(event) => setAccount({ ...account, lastName: event.target.value })} className={inputClass} autoComplete="family-name" /></label></div>
      <div className="mt-4 flex justify-end"><button type="button" onClick={() => void updateAccount()} disabled={savingAccount} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-50"><Save size={15}/>{savingAccount ? t('Saving…') : t('Save account')}</button></div>
      <div className="mt-7 border-t border-[var(--border)] pt-6"><div className="flex items-start gap-3"><div className="rounded-xl bg-[var(--secondary)] p-2.5"><LockKeyhole size={18}/></div><div><h3 className="font-semibold">{t('Change password')}</h3><p className="mt-1 text-sm text-[var(--muted-foreground)]">{t('For your security, all active sessions will be signed out after a successful change.')}</p></div></div><div className="mt-4 grid gap-4 sm:grid-cols-3"><PasswordInput label={t('Current password')} value={password.currentPassword} onChange={(value) => setPassword({ ...password, currentPassword: value })} visible={showCurrentPassword} onToggle={() => setShowCurrentPassword((value) => !value)} autoComplete="current-password"/><PasswordInput label={t('New password')} value={password.newPassword} onChange={(value) => setPassword({ ...password, newPassword: value })} visible={showNewPassword} onToggle={() => setShowNewPassword((value) => !value)} autoComplete="new-password"/><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{t('Confirm new password')}</span><input type="password" value={password.confirmPassword} onChange={(event) => setPassword({ ...password, confirmPassword: event.target.value })} className={inputClass} autoComplete="new-password" /></label></div><p className={`mt-3 text-xs ${password.newPassword && !passwordRequirements ? 'text-amber-700' : 'text-[var(--muted-foreground)]'}`}>{t('At least 12 characters with upper case, lower case, a number and a special character.')}</p><div className="mt-4 flex justify-end"><button type="button" onClick={() => void changePassword()} disabled={changingPassword} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium disabled:opacity-50"><LockKeyhole size={15}/>{changingPassword ? t('Changing…') : t('Change password')}</button></div></div>
    </section> : null}

    <section className="profile-page__panel rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3"><div className="rounded-xl bg-[var(--secondary)] p-2.5"><Building2 size={18}/></div><div><h2 className="text-lg font-semibold">{t('Company profile')}</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">{canManageWorkspaceProfile ? (requiredProfileMode ? t('Complete the required company and responsible-person profile.') : t('Optional legal, contact and banking details support documents and business identity.')) : t('Only workspace owners and admins can view or edit company and banking details.')}</p></div></div>
      {!canManageWorkspaceProfile ? <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{t('Ask a workspace owner or admin to manage these details.')}</div> : <>
        {loading ? <div className="mt-6 rounded-xl bg-[var(--secondary)] p-8 text-center text-sm text-[var(--muted-foreground)]">{t('Loading profile…')}</div> : <>
          {requiredProfileMode ? <>
            <datalist id="profile-country-options">{countries.map((item) => <option key={item} value={item}/>)}</datalist>
            <datalist id="profile-industry-options">{industries.map((item) => <option key={item} value={item}/>)}</datalist>
            <datalist id="profile-legal-form-options">{legalOptions.map((item) => <option key={item} value={item}/>)}</datalist>
            <datalist id="profile-branch-options">{branches.map((item) => <option key={item} value={item}/>)}</datalist>
            <div className="mt-7 space-y-8">
              <section>
                <h3 className="text-sm font-semibold">{t('Personal Information')}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{t('First name')} *</span><input value={account.firstName} onChange={(event) => setAccountField('firstName', event.target.value)} className={`${inputClass} ${fieldErrors.firstName ? 'border-rose-400 focus:ring-rose-200' : ''}`} autoComplete="given-name" />{fieldErrors.firstName ? <span className="mt-1.5 block text-xs font-medium text-rose-700">{fieldErrors.firstName}</span> : null}</label>
                  <label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{t('Last name')} *</span><input value={account.lastName} onChange={(event) => setAccountField('lastName', event.target.value)} className={`${inputClass} ${fieldErrors.lastName ? 'border-rose-400 focus:ring-rose-200' : ''}`} autoComplete="family-name" />{fieldErrors.lastName ? <span className="mt-1.5 block text-xs font-medium text-rose-700">{fieldErrors.lastName}</span> : null}</label>
                </div>
              </section>
              <section className="border-t border-[var(--border)] pt-6">
                <h3 className="text-sm font-semibold">{t('Company Information')}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {field('companyName', `${t('Company name')} *`, { required: true })}
                  {field('industry', `${t('Industry')} *`, { required: true, list: 'profile-industry-options' })}
                  {field('countryRegion', `${t('Country / Region')} *`, { required: true, list: 'profile-country-options' })}
                  {field('legalForm', `${t('Legal form')} *`, { required: true, list: 'profile-legal-form-options' })}
                  {field('taxId', `${t('Tax ID')} *`, { required: true })}
                  {field('legalRepresentative', `${t('Legal representative')} *`, { required: true })}
                  {field('phoneNumber', `${t('Phone number')} *`, { required: true })}
                  {field('address', `${t('Address')} *`, { required: true, wide: true })}
                </div>
              </section>
            </div>
          </> : <div className="mt-6 grid gap-4 sm:grid-cols-2">{field('companyName', t('Company name'))}{field('industry', t('Industry'))}{field('countryRegion', t('Country / region'))}{field('taxId', t('Tax ID'))}{field('legalForm', t('Legal form'))}{field('legalRepresentative', t('Legal representative'))}{field('phoneNumber', t('Phone number'))}{field('address', t('Address'), { wide: true })}</div>}
          <div className="mt-7 border-t border-[var(--border)] pt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><h3 className="font-semibold">{requiredProfileMode ? `${t('Company Logo')} *` : t('Company logo')}</h3><p className="mt-1 text-sm text-[var(--muted-foreground)]">{t('This logo is shown on your invoices and quotes.')}</p></div>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--secondary)]">
                  <ImagePlus size={16}/>{logoUploading ? t('Uploading…') : logoUrl ? t('Replace logo') : t('Upload logo')}
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={logoUploading} onChange={(event) => { openLogoCropper(event.target.files?.[0]); event.currentTarget.value = ''; }}/>
                </label>
                {logoUrl ? <button type="button" disabled={logoUploading} onClick={() => void removeLogo()} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"><Trash2 size={15}/>{t('Remove')}</button> : null}
              </div>
            </div>
            <div className={`mt-4 flex min-h-24 items-center gap-4 rounded-xl border border-dashed bg-[var(--secondary)]/40 p-4 ${fieldErrors.companyLogo ? 'border-rose-400' : 'border-[var(--border)]'}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); openLogoCropper(event.dataTransfer.files?.[0]); }}>
              {logoUrl && !logoLoadError ? <img src={logoUrl} alt={profile.companyName ? `${profile.companyName} logo` : t('Company logo')} onError={() => setLogoLoadError(true)} className="max-h-20 max-w-48 rounded-lg bg-white object-contain p-2 shadow-sm" /> : <div className="grid h-20 w-32 place-items-center rounded-lg bg-white px-2 text-center text-xs text-[var(--muted-foreground)]">{logoUrl ? t('Logo preview unavailable') : t('No logo uploaded')}</div>}
              <div className="text-xs text-[var(--muted-foreground)]"><p>{logoFileName || t('Drag and drop, or choose PNG, JPEG or WebP')}</p><p className="mt-1">{t('Maximum 5 MB')}</p>{fieldErrors.companyLogo ? <p className="mt-1 font-medium text-rose-700">{fieldErrors.companyLogo}</p> : null}</div>
            </div>
          </div>
          <div className="mt-7 border-t border-[var(--border)] pt-6"><h3 className="font-semibold">{requiredProfileMode ? t('Banking Information') : t('Bank details')}</h3><p className="mt-1 text-sm text-[var(--muted-foreground)]">{t('Store the payout details used for this workspace. Access is limited to workspace admins.')}</p><div className="mt-4 grid gap-4 sm:grid-cols-2">{field('bankAccountNumber', requiredProfileMode ? `${t('Bank account number')} *` : t('Bank account number'), { required: requiredProfileMode })}{field('bankCode', requiredProfileMode ? `${t('Bank code')} *` : t('Bank code'), { required: requiredProfileMode })}{field('bankOpeningBank', requiredProfileMode ? `${t('Account opening bank name')} *` : t('Account opening bank'), { required: requiredProfileMode, wide: requiredProfileMode })}{field('bankBranch', requiredProfileMode ? `${t('Branch')} *` : t('Branch'), { required: requiredProfileMode, wide: requiredProfileMode })}</div></div>
          {requiredProfileMode ? <div className="mt-7 border-t border-[var(--border)] pt-6"><h3 className="font-semibold">{t('Business Classification')}</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">{field('branch', 'Branche *', { required: true, wide: true, list: 'profile-branch-options' })}</div></div> : null}
          <div className="mt-6 flex justify-end"><button type="button" onClick={() => void updateCompanyProfile()} disabled={requiredProfileMode ? !activationClientComplete : savingProfile || loading} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50"><Save size={15}/>{savingProfile ? t('Saving…') : activationMode ? t('Save & Continue') : t('Save company profile')}</button></div>
        </>}
      </>}
    </section>
    {pendingLogo ? <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-slate-950/70 p-3 sm:grid sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="company-logo-crop-title">
      <div className="mx-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/10 bg-[var(--card)] shadow-2xl sm:max-h-[calc(100dvh-2rem)]">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--border)] p-5 sm:p-6"><div><p className="eyebrow">{t('Company logo')}</p><h2 id="company-logo-crop-title" className="mt-1 text-xl font-semibold">{t('Adjust company logo')}</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">{t('Drag to position and use the slider to zoom.')}</p></div><button type="button" onClick={() => setPendingLogo(null)} disabled={logoUploading} className="shrink-0 rounded-xl border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-50">{t('Cancel')}</button></header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6"><div className="mx-auto w-fit max-w-full overflow-hidden rounded-2xl bg-slate-950 p-2 shadow-inner"><div className="relative overflow-hidden rounded-xl bg-[conic-gradient(#263248_25%,#111827_0_50%,#263248_0_75%,#111827_0)] bg-[length:24px_24px] cursor-grab active:cursor-grabbing" style={{ width: cropViewportSize, height: cropViewportSize, touchAction: 'none' }} onDoubleClick={() => { setCropZoom(1); setCropOffset({ x: 0, y: 0 }); }} onPointerDown={(event) => { if (!logoUploading) { event.currentTarget.setPointerCapture(event.pointerId); cropDragRef.current = { startX: event.clientX, startY: event.clientY, originX: cropOffset.x, originY: cropOffset.y }; } }} onPointerMove={moveCrop} onPointerUp={endCropDrag} onPointerCancel={endCropDrag}>
          <img ref={cropImageRef} src={pendingLogo.url} alt={t('Company logo')} onLoad={() => setCropImageLoaded(true)} onError={() => { setCropImageLoaded(false); setError(t('The logo image could not be loaded.')); }} draggable={false} className="pointer-events-none absolute max-w-none select-none" style={{ width: pendingLogo.width * cropScale, height: pendingLogo.height * cropScale, left: '50%', top: '50%', transform: `translate(-50%, -50%) translate(${cropOffset.x}px, ${cropOffset.y}px)` }} />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-inset ring-white/90" />
          <div className="pointer-events-none absolute inset-0 opacity-35"><span className="absolute left-1/3 top-0 h-full border-l border-white/70" /><span className="absolute left-2/3 top-0 h-full border-l border-white/70" /><span className="absolute left-0 top-1/3 w-full border-t border-white/70" /><span className="absolute left-0 top-2/3 w-full border-t border-white/70" /></div>
          {!cropImageLoaded ? <div className="pointer-events-none absolute inset-0 grid place-items-center bg-slate-950/45 px-6 text-center text-xs font-medium text-white">{t('Preparing image…')}</div> : null}
        </div></div>
        <div className="mx-auto mt-5 flex max-w-md items-center justify-between gap-3"><button type="button" onClick={() => { const nextZoom = Math.max(1, Number((cropZoom - 0.1).toFixed(2))); setCropZoom(nextZoom); if (pendingLogo) setCropOffset((current) => constrainCropOffset(current, pendingLogo.width, pendingLogo.height, pendingLogo.baseScale * nextZoom)); }} disabled={logoUploading || cropZoom <= 1} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-40" aria-label={t('Zoom out')}>−</button><label className="min-w-0 flex-1 text-sm font-medium">{t('Zoom')}<input type="range" min="1" max="4" step="0.01" value={cropZoom} onChange={(event) => { const nextZoom = Number(event.target.value); setCropZoom(nextZoom); if (pendingLogo) setCropOffset((current) => constrainCropOffset(current, pendingLogo.width, pendingLogo.height, pendingLogo.baseScale * nextZoom)); }} className="mt-3 w-full accent-indigo-600" aria-label={t('Zoom')} /></label><button type="button" onClick={() => { const nextZoom = Math.min(4, Number((cropZoom + 0.1).toFixed(2))); setCropZoom(nextZoom); if (pendingLogo) setCropOffset((current) => constrainCropOffset(current, pendingLogo.width, pendingLogo.height, pendingLogo.baseScale * nextZoom)); }} disabled={logoUploading || cropZoom >= 4} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-40" aria-label={t('Zoom in')}>+</button></div><button type="button" onClick={() => { setCropZoom(1); setCropOffset({ x: 0, y: 0 }); }} disabled={logoUploading} className="mx-auto mt-3 block text-xs font-medium text-[var(--muted-foreground)] underline underline-offset-4 disabled:opacity-50">{t('Reset position')}</button><p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">{t('Drag the image to position it. Double-click to reset.')}</p></div>
        <footer className="flex shrink-0 justify-end gap-3 border-t border-[var(--border)] p-5 sm:p-6"><button type="button" onClick={() => setPendingLogo(null)} disabled={logoUploading} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium disabled:opacity-50">{t('Cancel')}</button><button type="button" onClick={() => void confirmCropAndUpload()} disabled={logoUploading || !cropImageLoaded} className="rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-50">{logoUploading ? t('Uploading…') : t('Crop and upload')}</button></footer>
      </div>
    </div> : null}
  </div></main></WorkspaceSurfaceShell>;
}

function PasswordInput({ label, value, onChange, visible, onToggle, autoComplete }: { label: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle: () => void; autoComplete: string }) {
  return <label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">{label}</span><div className="relative"><input type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} pr-10`} autoComplete={autoComplete}/><button type="button" onClick={onToggle} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--muted-foreground)] hover:bg-[var(--secondary)]" aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={15}/> : <Eye size={15}/>}</button></div></label>;
}
