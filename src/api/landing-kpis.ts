import { requestApi } from './client';

export type LandingMetricUnit = 'count' | 'currency' | 'percent' | 'seconds' | 'hours' | 'ratio' | 'text';

export type LandingMetric = {
  value: number | string | null;
  unit: LandingMetricUnit;
  available: boolean;
  source: string;
  measuredAt: string | null;
};

export type LandingBreakdownItem = { label: string; count: number };

export type LandingKpisData = {
  available: boolean;
  generatedAt: string;
  period: { label: string; from: string | null; to: string };
  metrics: Record<string, LandingMetric>;
  breakdowns: {
    markets: LandingBreakdownItem[];
    categories: LandingBreakdownItem[];
    factories: LandingBreakdownItem[];
    caseStudies: LandingBreakdownItem[];
  };
  privacy: { factories: string; caseStudies: string };
};

export const landingKpisApi = {
  get(signal?: AbortSignal) {
    return requestApi<LandingKpisData>({ path: '/public/landing-kpis', signal, timeoutMs: 15_000 });
  },
};
