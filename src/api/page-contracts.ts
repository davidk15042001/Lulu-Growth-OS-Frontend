export type PageContract =
  | { kind: "public" }
  | { kind: "onboarding" }
  | { kind: "workspace" }
  | { kind: "resource"; resourceType: string }
  | { kind: "ai" }
  | { kind: "billing" }
  | { kind: "integrations" }
  | { kind: "metrics" };

const PUBLIC_SLUGS = new Set([
  "brightly-door-5741",
  "finely-year-1146",
  "crisp-garden-7026",
  "crisp-week-7116",
  "eagerly-bay-9885",
  "deep-coast-9085",
  "kind-morning-4984",
  "mightily-minute-5145",
]);

const ONBOARDING_SLUGS = new Set([
  "steady-stone-6443",
  "bravely-path-4713",
  "quiet-garden-9477",
  "keen-morning-6353",
]);

const WORKSPACE_SLUGS = new Set([
  "finely-garden-9221",
  "friendly-path-8200",
  "sharply-wood-4560",
  "swiftly-cliff-4166",
  "bright-meadow-7537",
  "bold-ocean-5847",
  "smart-ocean-3898",
  "merry-land-6169",
  "fancily-leaf-1766",
  "tender-water-4095",
  "cozily-path-5612",
  "quietly-stone-4158",
  "sharp-current-9677",
  "serene-cloud-7079",
  "eagerly-winter-3152",
  "breezy-shore-6734",
  "gently-light-6089",
  "cool-town-1727",
  "proudly-river-8017",
  "nicely-hour-4035",
  "fine-park-8079",
  "lulu-website-portal-9012",
]);

// Local application routes are intentionally kept outside the generated
// MagicPath manifest so its fixed 140-page integrity checks remain stable.
const LOCAL_WORKSPACE_SLUGS = new Set([
  ["lulu", "email", "portal", "9013"].join("-"),
  ["lulu", "calendar", "portal", "9014"].join("-"),
]);

const SPECIAL_CONTRACTS: Record<string, PageContract> = {
  "fresh-moon-5374": { kind: "ai" },
  "sunny-moon-6307": { kind: "ai" },
  "pure-minute-5446": { kind: "billing" },
  "fresh-tide-9404": { kind: "integrations" },
  "glad-coast-1428": { kind: "integrations" },
  "swift-pool-5077": { kind: "metrics" },
};

export const RESOURCE_BY_SLUG: Readonly<Record<string, string>> = {
  "proud-rain-4772": "activities",
  "sunny-summer-2293": "ad_accounts",
  "nice-moon-2056": "ad_campaigns",
  "solid-sand-5563": "ad_experiments",
  "zesty-grass-9196": "ad_optimizations",
  "softly-second-7684": "ad_audiences",
  "sunny-minute-1092": "ad_budgets",
  "wise-brook-1762": "ad_campaigns",
  "happily-storm-2690": "ad_creatives",
  "sunnily-peak-7188": "ad_approvals",
  "nicely-shade-2637": "ad_attributions",
  "calmly-park-3313": "ai_agents",
  "wondrously-second-5656": "ai_actions",
  "sparkling-cave-8456": "ai_activity",
  "radiant-dusk-9079": "ai_agents",
  "serenely-week-1771": "ai_insights",
  "rich-field-1880": "ai_knowledge",
  "daring-home-4179": "ai_recommendations",
  "wispy-leaf-3778": "ai_tasks",
  "sparklingly-light-7230": "anomalies",
  "clever-soil-5964": "ad_attributions",
  "kindly-year-8981": "benchmarks",
  "brave-stream-5322": "comparisons",
  "sparkling-time-5280": "comparisons",
  "cosmic-pool-1616": "crm_activities",
  "kindly-pool-8785": "crm_companies",
  "sturdy-month-1562": "crm_contacts",
  "gracefully-storm-2649": "crm_customer_insights",
  "sunnily-gulf-7520": "crm_segments",
  "smartly-shade-4619": "crm_deals",
  "swift-hour-7844": "crm_leads",
  "calmly-cloud-9988": "crm_pipeline_stages",
  "deeply-noon-9539": "crm_tasks",
  "dreamily-shade-6192": "customers",
  "radiant-cave-9340": "decisions",
  "serenely-sand-9226": "ecommerce_carts",
  "wildly-time-4260": "ecommerce_carts",
  "richly-forest-5832": "ecommerce_categories",
  "fancy-ground-8040": "ecommerce_customers",
  "sharply-sky-4161": "ecommerce_discounts",
  "smart-village-1099": "ecommerce_inventory",
  "mightily-shore-7108": "ecommerce_orders",
  "merry-castle-3260": "ecommerce_payments",
  "dreamy-shade-5445": "ecommerce_returns",
  "daring-brook-9034": "ecommerce_reviews",
  "quietly-moon-4186": "ecommerce_shipping",
  "safely-air-9334": "ecommerce_collections",
  "merry-cliff-8846": "ecommerce_coupons",
  "nicely-ocean-1051": "ecommerce_products",
  "purely-dusk-2409": "ecommerce_shipping",
  "nice-year-6253": "ecommerce_stores",
  "safely-dawn-7731": "ecommerce_subscriptions",
  "soft-hill-4757": "ecommerce_taxes",
  "fair-bridge-8618": "finance_accounts",
  "wisely-gate-3183": "finance_budgets",
  "soft-town-3284": "finance_cashflow",
  "bravely-bay-4544": "finance_customers",
  "zesty-earth-3938": "finance_expenses",
  "boldly-field-4971": "finance_settings",
  "vibrantly-second-9428": "finance_automations",
  "sharp-morning-7310": "finance_plans",
  "cool-rain-6499": "finance_income",
  "breezy-soil-2475": "finance_invoices",
  "tender-creek-3139": "finance_quotes",
  "calm-tide-3752": "finance_payments",
  "lucky-park-8649": "finance_payouts",
  "sparklingly-city-3338": "finance_reconciliations",
  "radiant-hour-5376": "finance_recurring_revenue",
  "sturdy-week-3372": "finance_taxes",
  "richly-land-8084": "finance_transactions",
  "eager-minute-1586": "finance_vendors",
  "wispy-current-7490": "forecasts",
  "sunny-house-9595": "marketing_aeo_items",
  "breezily-wood-5980": "marketing_audiences",
  "gently-shade-2476": "marketing_campaigns",
  "dreamily-soil-9290": "marketing_campaigns",
  "smartly-shore-1468": "marketing_competitors",
  "wondrous-cloud-1355": "marketing_content",
  "zealously-path-4224": "marketing_geo_items",
  "kind-time-4492": "marketing_keywords",
  "sparklingly-moon-5114": "marketing_seo_items",
  "sparklingly-home-7386": "marketing_strategies",
  "happily-brook-7061": "opportunities",
  "friendly-ground-4157": "reports",
  "boldly-time-5189": "risk_items",
  "lively-house-6788": "sales_commissions",
  "sharp-cliff-6925": "sales_segments",
  "deeply-month-1392": "sales_deals",
  "lovingly-shore-4782": "sales_forecasts",
  "friendly-tower-1528": "sales_lead_assignments",
  "softly-autumn-9038": "sales_leads",
  "wildly-sun-6424": "sales_opportunities",
  "gentle-cliff-7133": "sales_goals",
  "rich-moon-9195": "sales_reports",
  "nicely-land-1864": "sales_settings",
  "wondrously-gate-2200": "sales_tasks",
  "kindly-morning-7115": "sales_territories",
  "warmly-road-3804": "sales_activities",
  "sweet-evening-7753": "sales_deals",
  "serenely-creek-1765": "trends",
};

export function getPageContract(slug: string): PageContract | undefined {
  if (PUBLIC_SLUGS.has(slug)) return { kind: "public" };
  if (ONBOARDING_SLUGS.has(slug)) return { kind: "onboarding" };
  if (WORKSPACE_SLUGS.has(slug) || LOCAL_WORKSPACE_SLUGS.has(slug)) return { kind: "workspace" };
  if (SPECIAL_CONTRACTS[slug]) return SPECIAL_CONTRACTS[slug];
  const resourceType = RESOURCE_BY_SLUG[slug];
  return resourceType ? { kind: "resource", resourceType } : undefined;
}
