import { BarChart3 } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluMarketingAnalytics = () => <BackendResourceOverviewPage
  resourceType="marketing_campaigns"
  eyebrow="Marketing"
  title="Marketing Analytics"
  description="Canonical marketing campaign records loaded from the current workspace."
  emptyTitle="No verified marketing campaigns yet"
  emptyDescription="Campaigns will appear after a connected marketing source or Lulu workflow persists them in the workspace."
  emptyIcon={<BarChart3 aria-hidden="true" size={24} />}
/>;
