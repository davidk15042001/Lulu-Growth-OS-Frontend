import { Search } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluKeywordsWorkspace = () => <BackendResourceOverviewPage
  resourceType="marketing_keywords"
  eyebrow="Marketing"
  title="Keywords"
  description="Canonical keyword records loaded from the current workspace."
  emptyTitle="No verified keywords yet"
  emptyDescription="Keywords will appear after a verified SEO workflow or connected marketing source persists them in the workspace."
  emptyIcon={<Search aria-hidden="true" size={24} />}
/>;
