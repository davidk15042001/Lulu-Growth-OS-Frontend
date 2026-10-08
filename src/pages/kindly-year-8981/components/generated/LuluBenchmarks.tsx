import { Gauge } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluBenchmarks = () => <BackendResourceOverviewPage
  resourceType="benchmarks"
  eyebrow="Intelligence / Benchmarks"
  title="Benchmarks"
  description="Verified benchmark records from the current workspace. Comparisons appear only when the backend has reference evidence to show."
  emptyTitle="No verified benchmarks yet"
  emptyDescription="Connect a data source or persist a benchmark record before comparing performance. No sample values or inferred market positions are displayed."
  emptyIcon={<Gauge aria-hidden="true" size={24} />}
/>;
