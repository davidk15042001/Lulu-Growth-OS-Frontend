export type BillingPlanId = "ai";

/** Canonical annual price shown for the customer-facing Lulu AI package. */
export const LULU_AI_ANNUAL_PRICE = "¥17,888 CNY";

export type BillingPlan = {
  id: BillingPlanId;
  name: string;
  eyebrow: string;
  description: string;
  features: string[];
  limitations: string;
  price: string;
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
      "API and AWS usage collected automatically every Monday",
      "5% commission on each Lulu-attributed sale",
    ],
    limitations: "Fully autonomous execution with prepaid ad spend as the only customer authorization boundary",
    price: LULU_AI_ANNUAL_PRICE,
    pricePeriod: "per year",
    cta: "Choose AI",
  },
];
