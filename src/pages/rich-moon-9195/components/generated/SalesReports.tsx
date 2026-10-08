import { FileBarChart } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function SalesReports() {
  return (
    <BackendResourceOverviewPage
      resourceType="sales_reports"
      eyebrow="Sales"
      title="Sales Reports"
      description="Verified sales report records from the selected workspace."
      emptyTitle="No live sales reports yet"
      emptyDescription="Reports appear after an authorized sales workflow durably generates them. No example totals, trends or rankings are displayed."
      emptyIcon={<FileBarChart aria-hidden="true" size={24} />}
    />
  );
}
