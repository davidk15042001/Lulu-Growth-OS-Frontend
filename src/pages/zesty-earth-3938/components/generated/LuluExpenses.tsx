import { Receipt } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluExpenses = () => <BackendResourceOverviewPage
  resourceType="finance_expenses"
  eyebrow="Finance"
  title="Expenses"
  description="Canonical expense records from the current workspace. Categories, vendors and reimbursement state appear only when returned by the backend."
  emptyTitle="No verified expense records yet"
  emptyDescription="Expense activity will appear after a connected finance provider or an authorized finance workflow persists records in the workspace."
  emptyIcon={<Receipt aria-hidden="true" size={24} />}
/>;
