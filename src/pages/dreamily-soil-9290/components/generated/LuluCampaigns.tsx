import { Target } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluCampaigns = () => <BackendResourceOverviewPage
  resourceType="marketing_campaigns"
  eyebrow="Marketing Workspace"
  title="Campaigns"
  description="Canonical marketing campaign records loaded from the current workspace."
  emptyTitle="No marketing campaigns yet"
  emptyDescription="Campaigns will appear after a verified platform or Lulu workflow persists them in the workspace."
  emptyIcon={<Target aria-hidden="true" size={24} />}
/>;
