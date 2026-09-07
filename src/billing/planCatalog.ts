export type BillingPlanId = "ai";

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
    limitations: "You stay in control with configurable approvals and safeguards",
    price: "RMB 16,000",
    pricePeriod: "per year",
    cta: "Choose AI",
  },
];
