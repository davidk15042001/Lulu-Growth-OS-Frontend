export type BillingPlanId = "ai";
export type BillingRegion = "cn" | "eu" | "us";

export const billingRegions: Array<{ id: BillingRegion; label: string; currency: "CNY" | "EUR" | "USD" }> = [
  { id: "cn", label: "China · RMB", currency: "CNY" },
  { id: "eu", label: "Europe · EUR", currency: "EUR" },
  { id: "us", label: "United States · USD", currency: "USD" },
];

export const billingPricing: Record<BillingRegion, { annualMinor: number; monthlyEquivalentMinor: number; currency: "CNY" | "EUR" | "USD"; annualLabel: string; monthlyLabel: string }> = {
  cn: { annualMinor: 3_499_900, monthlyEquivalentMinor: 3_499_900, currency: "CNY", annualLabel: "¥34,999 RMB / year", monthlyLabel: "¥34,999 RMB / year" },
  eu: { annualMinor: 999_900, monthlyEquivalentMinor: 109_900, currency: "EUR", annualLabel: "€9,999 billed annually", monthlyLabel: "€1,099 / month equivalent" },
  us: { annualMinor: 1_199_900, monthlyEquivalentMinor: 125_000, currency: "USD", annualLabel: "$11,999 billed annually", monthlyLabel: "$1,250 / month equivalent" },
};

/** Legacy import compatibility for non-billing screens during rollout. */
export const LULU_AI_ANNUAL_PRICE = billingPricing.cn.annualLabel;

export type BillingPlan = {
  id: BillingPlanId;
  name: string;
  eyebrow: string;
  description: string;
  features: string[];
  limitations: string;
  pricing: Record<BillingRegion, { annualLabel: string; monthlyLabel: string }>;
  pricePeriod: string;
  cta: string;
};

export const billingPlans: BillingPlan[] = [
  {
    id: "ai",
    name: "AI",
    eyebrow: "Let Lulu run growth",
    description: "Give Lulu the authority to recommend, execute and automate the work across your workspace.",
    features: [
      "AI insights and recommendations",
      "AI-assisted content and decisions",
      "Full automation of supported workflows",
      "Cloudflare R2 storage invoiced by manual checkout link",
      "No commission on Lulu-attributed sales",
    ],
    limitations: "Fully autonomous execution with prepaid ad spend as the only customer authorization boundary",
    pricing: Object.fromEntries(Object.entries(billingPricing).map(([region, value]) => [region, { annualLabel: value.annualLabel, monthlyLabel: value.monthlyLabel }])) as BillingPlan["pricing"],
    pricePeriod: "per year",
    cta: "Choose AI",
  },
];
