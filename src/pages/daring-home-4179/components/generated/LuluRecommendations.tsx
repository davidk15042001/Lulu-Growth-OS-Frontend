import { Sparkles } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluRecommendations() {
  return <BackendResourceOverviewPage
    resourceType="ai_recommendations"
    eyebrow="Intelligence workspace"
    title="AI Recommendations"
    description="Live recommendations based on connected workspace data and authorized AI capabilities."
    emptyTitle="No live recommendations available yet"
    emptyDescription="Connect data sources and complete an authorized analysis to populate recommendations. No example impacts, scores, priorities or actions are displayed."
    emptyIcon={<Sparkles aria-hidden="true" size={22} />}
  />;
}
