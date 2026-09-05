import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowUpRight, Database, Factory, Globe2, ShieldCheck, Tags } from 'lucide-react';
import { landingKpisApi, type LandingKpisData, type LandingMetric } from '../api/landing-kpis';
import { ApiError } from '../api/client';
import { useLanguage, useTranslation } from '../i18n/GlobalLanguageSwitcher';

type KpiKey = keyof LandingKpisData['metrics'];

const KPI_GROUPS: Array<{ title: string; keys: KpiKey[] }> = [
  {
    title: 'International reach',
    keys: ['activeFactories', 'activeUsingFactories', 'internationalizedProducts', 'internationalWebsites', 'supportedLanguages', 'targetMarkets', 'internationalWebsiteVisitors', 'organicInternationalTraffic'],
  },
  {
    title: 'Demand & advertising',
    keys: ['adImpressions', 'adClicks', 'averageCpc', 'internationalLeads', 'qualifiedLeads', 'buyerRequests', 'leadToQualifiedRate', 'leadToOfferRate', 'adRoas'],
  },
  {
    title: 'Sales & customers',
    keys: ['offersCreated', 'offerValue', 'internationalNewCustomers', 'internationalOrders', 'averageOrderValue', 'luluAttributedExportRevenue', 'offerToOrderRate'],
  },
  {
    title: 'Autonomous operations',
    keys: ['aiCustomerConversations', 'automaticallyAnsweredInquiries', 'averageResponseTime', 'automaticFollowUps', 'automaticTasks', 'autonomousProcessShare', 'timeSaved', 'costSaved'],
  },
  {
    title: 'Evidence & comparisons',
    keys: ['totalFactoryRoi', 'medianFactoryRoi', 'beforeAfter', 'byMarket', 'byCategory', 'byFactory', 'caseStudies', 'measurementPeriod'],
  },
];

const KPI_LABELS: Record<string, string> = {
  activeFactories: 'Active factories',
  activeUsingFactories: 'Factories actively using Lulu',
  internationalizedProducts: 'Internationalized products',
  internationalWebsites: 'Published international websites',
  supportedLanguages: 'Supported languages',
  targetMarkets: 'Target markets',
  internationalWebsiteVisitors: 'International website visitors',
  organicInternationalTraffic: 'Organic international traffic',
  adImpressions: 'Ad impressions',
  adClicks: 'Ad clicks',
  averageCpc: 'Average CPC',
  internationalLeads: 'International leads',
  qualifiedLeads: 'Qualified leads',
  buyerRequests: 'Buyer requests / RFQs',
  leadToQualifiedRate: 'Lead → qualified conversion',
  leadToOfferRate: 'Lead → offer conversion',
  adRoas: 'Advertising ROAS',
  offersCreated: 'Offers created',
  offerValue: 'Total offer value',
  internationalNewCustomers: 'International new customers',
  internationalOrders: 'International orders',
  averageOrderValue: 'Average order value',
  luluAttributedExportRevenue: 'Lulu-attributed export revenue',
  offerToOrderRate: 'Offer → order conversion',
  aiCustomerConversations: 'AI customer conversations',
  automaticallyAnsweredInquiries: 'Automatically answered inquiries',
  averageResponseTime: 'Average response time',
  automaticFollowUps: 'Automatic follow-ups',
  automaticTasks: 'Automatically executed tasks',
  autonomousProcessShare: 'Autonomous process share',
  timeSaved: 'Factory time saved',
  costSaved: 'Cost saved vs. manual marketing',
  totalFactoryRoi: 'Total factory ROI',
  medianFactoryRoi: 'Median ROI per factory',
  beforeAfter: 'Before Lulu vs. after Lulu',
  byMarket: 'Results by market',
  byCategory: 'Results by product category',
  byFactory: 'Results by factory',
  caseStudies: 'Best case studies',
  measurementPeriod: 'Measurement period',
};

function formatMetric(metric: LandingMetric, locale: string) {
  if (!metric.available || metric.value === null) return '—';
  if (typeof metric.value === 'string') return metric.value;
  const number = metric.value;
  if (!Number.isFinite(number)) return '—';
  if (metric.unit === 'percent') {
    const percent = Math.abs(number) <= 1 ? number * 100 : number;
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(percent)}%`;
  }
  if (metric.unit === 'currency') return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(number);
  if (metric.unit === 'seconds') return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(number)} s`;
  if (metric.unit === 'hours') return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(number)} h`;
  if (metric.unit === 'ratio') return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(number);
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(number);
}

export function LandingKpiPanel() {
  const t = useTranslation();
  const language = useLanguage();
  const locale = language === 'zh-CN' ? 'zh-CN' : language === 'de' ? 'de-DE' : 'en-US';
  const [data, setData] = useState<LandingKpisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    landingKpisApi.get(controller.signal)
      .then((response) => setData(response.data))
      .catch((cause) => {
        if (!(cause instanceof DOMException && cause.name === 'AbortError')) setError(cause instanceof ApiError || cause instanceof Error);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const featuredKeys = useMemo<KpiKey[]>(() => [
    'activeFactories',
    'internationalizedProducts',
    'internationalWebsites',
    'internationalLeads',
    'internationalOrders',
    'luluAttributedExportRevenue',
  ], []);

  return (
    <section aria-labelledby="landing-kpi-title" className="relative mx-auto mt-10 w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b1020] px-5 py-6 text-white shadow-2xl shadow-black/20 sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-emerald-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
              {t('Live from database')}
            </div>
            <h2 id="landing-kpi-title" className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{t('Lulu results, measured in reality.')}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{t('Verified aggregates from the Lulu platform. Missing source data stays visible as unavailable.')}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Database size={14} />
            <span>{loading ? t('Updating…') : data?.generatedAt ? new Date(data.generatedAt).toLocaleString(locale) : t('Not available')}</span>
          </div>
        </div>

        {error && <p role="status" className="mt-5 rounded-xl border border-amber-200/20 bg-amber-200/10 px-3 py-2 text-sm text-amber-100">{t('Live KPI data is temporarily unavailable.')}</p>}
        {loading && <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{featuredKeys.map((key) => <div key={key} className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/5" />)}</div>}

        {!loading && (
          <>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredKeys.map((key) => {
                const metric = data?.metrics[key];
                return <div key={key} title={metric?.source} className="rounded-2xl border border-white/10 bg-white/[.06] p-4 backdrop-blur">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400"><span>{t(KPI_LABELS[key])}</span><ArrowUpRight size={14} className="text-emerald-300" /></div>
                  <p className="mt-3 text-2xl font-semibold tracking-tight">{metric ? formatMetric(metric, locale) : '—'}</p>
                </div>;
              })}
            </div>

            <details className="mt-6 rounded-2xl border border-white/10 bg-black/10" open>
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-slate-200">
                <span>{t('All live KPIs')}</span><Activity size={16} className="text-sky-300" />
              </summary>
              <div className="grid gap-5 border-t border-white/10 px-4 py-5 lg:grid-cols-2">
                {KPI_GROUPS.map((group) => <div key={group.title}>
                  <h3 className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{t(group.title)}</h3>
                  <div className="mt-3 space-y-2">
                    {group.keys.map((key) => {
                      const metric = data?.metrics[key];
                      return <div key={key} title={metric?.source} className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[.035] px-3 py-2.5 text-sm">
                        <span className="text-slate-300">{t(KPI_LABELS[key])}</span><span className={`font-semibold ${metric?.available ? 'text-white' : 'text-slate-500'}`}>{metric ? formatMetric(metric, locale) : '—'}</span>
                      </div>;
                    })}
                  </div>
                </div>)}
              </div>
            </details>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-slate-400"><Globe2 size={14} className="text-sky-300" />{t('Results by market')}</div>
                {data?.breakdowns.markets.length ? <div className="mt-3 flex flex-wrap gap-2">{data.breakdowns.markets.map((item) => <span key={item.label} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">{item.label} · {item.count}</span>)}</div> : <p className="mt-3 text-sm text-slate-500">{t('No privacy-safe market breakdown yet.')}</p>}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-slate-400"><Tags size={14} className="text-emerald-300" />{t('Results by product category')}</div>
                {data?.breakdowns.categories.length ? <div className="mt-3 flex flex-wrap gap-2">{data.breakdowns.categories.map((item) => <span key={item.label} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">{item.label} · {item.count}</span>)}</div> : <p className="mt-3 text-sm text-slate-500">{t('No privacy-safe category breakdown yet.')}</p>}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-slate-400"><Factory size={14} className="text-violet-300" />{t('Factory and case-study privacy')}</div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{t(data?.privacy.factories ?? 'Factory-level identities are intentionally not exposed on the public login page.')}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-200"><ShieldCheck size={14} />{t('Aggregated public view')}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
