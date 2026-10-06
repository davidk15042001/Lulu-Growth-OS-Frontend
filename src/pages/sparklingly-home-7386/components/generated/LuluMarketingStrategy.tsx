import { Compass } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluMarketingStrategy = () => <BackendResourceOverviewPage
  resourceType="marketing_strategies"
  eyebrow="Marketing"
  title="Marketing Strategy"
  description="Canonical marketing strategy records loaded from the current workspace."
  emptyTitle="No verified marketing strategy yet"
  emptyDescription="A strategy will appear after a verified planning workflow persists it in the workspace."
  emptyIcon={<Compass aria-hidden="true" size={24} />}
/>;
