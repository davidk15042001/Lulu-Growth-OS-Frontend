import { useCallback, useEffect, useMemo, useState } from "react";
import {
  agentApi,
  agentModuleForContract,
  agentPageContextFromContract,
  autoAgentGoalForContract,
  type AgentRun,
  type AgentRunDetails,
} from "../api/agents";
import { getFriendlyErrorMessage } from "../api/client";
import type { LuluAgentContract } from "../config/lulu-agent-registry";

type AgentDecision = "approved" | "rejected" | "cancelled";

function newestFirst(left: AgentRun, right: AgentRun) {
  return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
}

export function usePageAgentRun(
  workspaceId: string | null,
  contract: LuluAgentContract,
  t: (key: string) => string,
) {
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");
  const [latestRun, setLatestRun] = useState<AgentRun | null>(null);
  const [details, setDetails] = useState<AgentRunDetails | null>(null);

  const load = useCallback(async (preserveDetails = false) => {
    if (!workspaceId) {
      setLatestRun(null);
      setDetails(null);
      setError("");
      return;
    }

    setLoading(true);
    try {
      const listResponse = await agentApi.list(workspaceId, { pageId: contract.pageId });
      const nextRun = listResponse.data.items.slice().sort(newestFirst)[0] ?? null;
      setLatestRun(nextRun);
      if (!nextRun) {
        setDetails(null);
        setError("");
        return;
      }
      if (preserveDetails && details?.run.id === nextRun.id) {
        setError("");
        return;
      }
      const detailResponse = await agentApi.detail(workspaceId, nextRun.id);
      setDetails(detailResponse.data);
      setError("");
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, t("The page agent runtime could not be loaded.")));
    } finally {
      setLoading(false);
    }
  }, [contract.pageId, details?.run.id, t, workspaceId]);

  useEffect(() => {
    void load();
    if (!workspaceId) return;
    const timer = window.setInterval(() => void load(true), 15_000);
    return () => window.clearInterval(timer);
  }, [load, workspaceId]);

  const start = useCallback(async () => {
    if (!workspaceId) return;
    setActing(true);
    try {
      const created = await agentApi.create(workspaceId, autoAgentGoalForContract(contract), {
        module: agentModuleForContract(contract),
        page: agentPageContextFromContract(contract),
        dedupeMinutes: 15,
      });
      const detailResponse = await agentApi.detail(workspaceId, created.data.id);
      setLatestRun(created.data);
      setDetails(detailResponse.data);
      setError("");
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, t("The page agent could not be started.")));
    } finally {
      setActing(false);
    }
  }, [contract, t, workspaceId]);

  const cancel = useCallback(async () => {
    if (!workspaceId || !latestRun) return;
    setActing(true);
    try {
      await agentApi.cancel(workspaceId, latestRun.id);
      await load();
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, t("The current page agent run could not be cancelled.")));
    } finally {
      setActing(false);
    }
  }, [latestRun, load, t, workspaceId]);

  const decide = useCallback(async (stepId: string, decision: AgentDecision) => {
    if (!workspaceId || !latestRun) return;
    setActing(true);
    try {
      const response = await agentApi.approve(workspaceId, latestRun.id, stepId, decision);
      setDetails(response.data);
      setLatestRun(response.data.run);
      setError("");
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, t("The approval decision could not be saved.")));
    } finally {
      setActing(false);
    }
  }, [latestRun, t, workspaceId]);

  const pendingApprovalSteps = useMemo(
    () => details?.steps.filter((step) => step.status === "waiting_approval") ?? [],
    [details],
  );

  const recentSteps = useMemo(
    () => (details?.steps ?? []).slice().sort((left, right) => right.sequenceNo - left.sequenceNo).slice(0, 6),
    [details],
  );

  return {
    loading,
    acting,
    error,
    latestRun,
    details,
    pendingApprovalSteps,
    recentSteps,
    refresh: () => load(),
    start,
    retry: start,
    cancel,
    decide,
  };
}
