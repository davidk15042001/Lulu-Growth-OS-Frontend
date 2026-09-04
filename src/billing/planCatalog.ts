export type BillingPlanId = "starter" | "ai";

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
    id: "starter",
    name: "Starter",
    eyebrow: "Take action yourself",
    description: "Automatically analyze all workspace statistics with AI. General recommendations and actions stay off; SEO, GEO, AEO and Website are automated exceptions.",
    features: [
      "Automatic AI analysis and statistics across the workspace",
      "All workspace and platform data stays available",
      "Automatic SEO, GEO, AEO and Website recommendations and actions",
      "API and AWS usage collected automatically every Monday",
      "General recommendations and actions remain disabled",
    ],
    limitations: "No general recommendations or actions outside SEO, GEO, AEO and Website",
    price: "RMB 4,200",
    pricePeriod: "per year",
    cta: "Choose Starter",
  },
  {
    id: "ai",
    name: "AI",
    eyebrow: "Let Lulu run growth",
    description: "Give Lulu the authority to recommend, execute and automate the work across your workspace.",
    features: [
      "Everything in Starter",
      "AI insights and recommendations",
      "AI-assisted content and decisions",
      "Full automation of supported workflows",
      "API and AWS usage collected automatically every Monday",
    ],
    limitations: "You stay in control with configurable approvals and safeguards",
    price: "RMB 30,000",
    pricePeriod: "per year",
    cta: "Choose AI",
  },
];

export type BillingCapability = {
  id: string;
  label: string;
  availability: Record<BillingPlanId, boolean>;
};

export const billingCapabilities: BillingCapability[] = [
  {
    id: "workspace-data",
    label: "View dashboards, reports and connected data",
    availability: { starter: true, ai: true },
  },
  {
    id: "workspace-management",
    label: "Manage workspace content and settings",
    availability: { starter: true, ai: true },
  },
  {
    id: "connected-platforms",
    label: "Manage connected websites and platforms",
    availability: { starter: true, ai: true },
  },
  {
    id: "automatic-analysis",
    label: "Automatic AI analysis and statistics",
    availability: { starter: true, ai: true },
  },
  {
    id: "specialized-automation",
    label: "SEO, GEO, AEO and Website recommendations and automation",
    availability: { starter: true, ai: true },
  },
  {
    id: "general-recommendations",
    label: "General AI insights and recommendations",
    availability: { starter: false, ai: true },
  },
  {
    id: "ai-assisted-decisions",
    label: "AI-assisted content and decisions",
    availability: { starter: false, ai: true },
  },
  {
    id: "general-automation",
    label: "Full automation of supported workflows",
    availability: { starter: false, ai: true },
  },
];
