import { TrendingUp } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluGrowth = () => <BackendResourceOverviewPage
  resourceType="growth_opportunities"
  eyebrow="Intelligence"
  title="Growth"
  description="Canonical growth-opportunity records from the current workspace. Contributions, segments and forecasts appear only when supported by persisted evidence."
  emptyTitle="No verified growth opportunities yet"
  emptyDescription="Connect CRM, commerce or marketing sources before reviewing verified growth opportunities."
  emptyIcon={<TrendingUp aria-hidden="true" size={24} />}
/>;
