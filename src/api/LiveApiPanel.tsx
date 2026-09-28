import { useState } from "react";
import type { PageContract } from "./page-contracts";
import { livePanelStyles } from "./live-panel-ui";
import { AiPanel } from "./panels/AiPanel";
import { BillingPanel } from "./panels/BillingPanel";
import { IntegrationsPanel } from "./panels/IntegrationsPanel";
import { MetricsPanel } from "./panels/MetricsPanel";
import { ResourcePanel } from "./panels/ResourcePanel";
import { WorkspacePanel } from "./panels/WorkspacePanel";

export function LiveApiPanel({ workspaceId, contract }: { workspaceId: string; contract: PageContract }) {
  const [open, setOpen] = useState(false);
  if (contract.kind === "public" || contract.kind === "onboarding") return null;
  if (!open) return <><button className="lulu-live-launch" type="button" onClick={() => setOpen(true)}><i />Live data</button><style>{livePanelStyles}</style></>;
  const close = () => setOpen(false);
  if (contract.kind === "resource") return <ResourcePanel workspaceId={workspaceId} resourceType={contract.resourceType} onClose={close} />;
  if (contract.kind === "metrics") return <MetricsPanel workspaceId={workspaceId} onClose={close} />;
  if (contract.kind === "ai") return <AiPanel workspaceId={workspaceId} onClose={close} />;
  if (contract.kind === "billing") return <BillingPanel workspaceId={workspaceId} onClose={close} />;
  if (contract.kind === "integrations") return <IntegrationsPanel workspaceId={workspaceId} onClose={close} />;
  return <WorkspacePanel workspaceId={workspaceId} onClose={close} />;
}
