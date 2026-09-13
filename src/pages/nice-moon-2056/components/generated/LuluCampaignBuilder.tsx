import { Sparkles } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluCampaignBuilder = () => <BackendResourceOverviewPage
  resourceType="marketing_campaigns"
  eyebrow="Advertising / Campaign Builder"
  title="Campaign Builder"
  description="Verified campaign records available to Lulu's autonomous campaign workflow. Unsupported draft controls are intentionally not exposed."
  emptyTitle="No campaign context available yet"
  emptyDescription="Campaign context will appear after verified workspace data or a persisted campaign becomes available."
  emptyIcon={<Sparkles aria-hidden="true" size={24} />}
/>;
