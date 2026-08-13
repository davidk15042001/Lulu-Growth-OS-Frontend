import { useEffect, useState } from "react";
import { workspaceAppApi, type BillingState } from "../workspace-app";
import { LiveEmpty, LiveError, LivePanelShell, LiveSection, formatLiveDate } from "../live-panel-ui";

export function BillingPanel({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { workspaceAppApi.billing(workspaceId).then((response) => setBilling(response.data)).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Billing could not be loaded.")); }, [workspaceId]);
  const subscription = billing?.subscription;
  return <LivePanelShell title="Live billing" subtitle="Subscription and usage from the backend" onClose={onClose}>
    <LiveError message={error} />
    <LiveSection title="Subscription">
      {!billing ? <LiveEmpty>Loading billing data…</LiveEmpty> : !subscription ? <LiveEmpty>No subscription is configured.</LiveEmpty> : <div className="lulu-live-kpis"><div className="lulu-live-kpi"><span>Plan</span><strong>{subscription.planKey}</strong></div><div className="lulu-live-kpi"><span>Status</span><strong>{subscription.status}</strong></div><div className="lulu-live-kpi"><span>Seats</span><strong>{subscription.seats}</strong></div><div className="lulu-live-kpi"><span>Renews</span><strong style={{ fontSize: 12 }}>{formatLiveDate(subscription.currentPeriodEndsAt)}</strong></div></div>}
    </LiveSection>
    <LiveSection title="Usage">
      {!billing?.usage.length ? <LiveEmpty>No usage has been recorded.</LiveEmpty> : billing.usage.map((entry) => <article className="lulu-live-row" key={`${entry.metricKey}-${entry.periodStart}`}><div className="lulu-live-row-top"><strong>{entry.metricKey}</strong><span className="lulu-live-badge good">{entry.quantity}</span></div><small>{formatLiveDate(entry.periodStart)} – {formatLiveDate(entry.periodEnd)}</small></article>)}
    </LiveSection>
  </LivePanelShell>;
}
