import { FileText } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluContent() {
  return <BackendResourceOverviewPage
    resourceType="marketing_content"
    eyebrow="Marketing"
    title="Content"
    description="Verified marketing content records from the selected workspace."
    emptyTitle="No live marketing content yet"
    emptyDescription="Connect an approved marketing source or create content through a canonical workspace workflow before reviewing content records."
    emptyIcon={<FileText aria-hidden="true" size={24} />}
  />;
}
