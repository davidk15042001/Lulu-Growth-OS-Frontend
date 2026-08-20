import { BarChart3, Globe2, Link2, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';

const featureIcons = [Sparkles, BarChart3, Globe2, Workflow, Link2, ShieldCheck];
const featureKeys = [
  ['landingFeatureAiTitle', 'landingFeatureAiText'],
  ['landingFeatureInsightsTitle', 'landingFeatureInsightsText'],
  ['landingFeatureSeoTitle', 'landingFeatureSeoText'],
  ['landingFeatureWebsiteTitle', 'landingFeatureWebsiteText'],
  ['landingFeatureIntegrationsTitle', 'landingFeatureIntegrationsText'],
  ['landingFeatureSecurityTitle', 'landingFeatureSecurityText'],
] as const;

export const LoginFeaturesLanding = () => {
  const t = useTranslation();
  return (
    <section className="border-t border-[var(--border)] bg-[var(--background)] px-6 py-16 text-[var(--foreground)] sm:px-10 lg:px-16" aria-labelledby="lulu-platform-title">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--muted-foreground)]">{t('landingEyebrow')}</p>
          <h2 id="lulu-platform-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t('landingTitle')}</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted-foreground)]">{t('landingIntro')}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureKeys.map(([titleKey, textKey], index) => {
            const Icon = featureIcons[index];
            return <article key={titleKey} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
              <Icon size={22} aria-hidden="true" className="text-[var(--primary)]" />
              <h3 className="mt-5 text-base font-semibold">{t(titleKey)}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{t(textKey)}</p>
            </article>;
          })}
        </div>
        <div className="mt-10 grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--sidebar)] p-6 sm:grid-cols-3">
          <div><p className="text-2xl font-semibold">{t('landingStepOne')}</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">{t('landingStepOneText')}</p></div>
          <div><p className="text-2xl font-semibold">{t('landingStepTwo')}</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">{t('landingStepTwoText')}</p></div>
          <div><p className="text-2xl font-semibold">{t('landingStepThree')}</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">{t('landingStepThreeText')}</p></div>
        </div>
      </div>
    </section>
  );
};
export default LoginFeaturesLanding;
