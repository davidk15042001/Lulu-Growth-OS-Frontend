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
import { getRecord, type WorkspaceRecord } from "../api/records";
import type { LuluAgentContract } from "../config/lulu-agent-registry";

type AgentDecision = "approved" | "rejected" | "cancelled";
type RecordRef = { id: string; resourceType: string };
type ExecutionPacket = { packet: WorkspaceRecord; results: WorkspaceRecord[] };

function newestFirst(left: AgentRun, right: AgentRun) {
  return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function extractActionRecordRefs(details: AgentRunDetails | null): RecordRef[] {
  if (!details) return [];
  const refs = new Map<string, RecordRef>();
  for (const step of details.steps) {
    const actionRecord = step.result?.actionRecord;
    if (!actionRecord || typeof actionRecord !== "object") continue;
    const recordId = stringValue((actionRecord as Record<string, unknown>).id);
    const resourceType = stringValue((actionRecord as Record<string, unknown>).resourceType);
    if (!recordId || !resourceType) continue;
    refs.set(`${resourceType}:${recordId}`, { id: recordId, resourceType });
  }
  return [...refs.values()];
}

function extractResultRecordRefs(packet: WorkspaceRecord): RecordRef[] {
  const ids = stringList(packet.data?.resultRecordIds);
  const resourceTypes = stringList(packet.data?.resultResourceTypes);
  return ids
    .map((id, index) => ({ id, resourceType: resourceTypes[index] ?? "" }))
    .filter((entry) => entry.id && entry.resourceType);
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
  const [executionPackets, setExecutionPackets] = useState<ExecutionPacket[]>([]);
  const [executionLoading, setExecutionLoading] = useState(false);
  const [executionError, setExecutionError] = useState("");

  const refreshExecution = useCallback(async (nextDetails: AgentRunDetails | null) => {
    const refs = extractActionRecordRefs(nextDetails);
    if (refs.length === 0) {
      setExecutionPackets([]);
      setExecutionError("");
      return;
    }

    setExecutionLoading(true);
    try {
      const packets = (await Promise.all(refs.map(async (ref) => {
        try {
          return await getRecord(ref.resourceType, ref.id);
        } catch {
          return null;
        }
      }))).filter((record): record is WorkspaceRecord => Boolean(record));

      const grouped = await Promise.all(
        packets.map(async (packet) => {
          const resultRefs = extractResultRecordRefs(packet);
          const results = (await Promise.all(resultRefs.map(async (ref) => {
            try {
              return await getRecord(ref.resourceType, ref.id);
            } catch {
              return null;
            }
          }))).filter((record): record is WorkspaceRecord => Boolean(record));
          return { packet, results };
        }),
      );

      setExecutionPackets(grouped.sort((left, right) => Date.parse(right.packet.updatedAt) - Date.parse(left.packet.updatedAt)));
      setExecutionError("");
    } catch (nextError) {
      setExecutionPackets([]);
      setExecutionError(getFriendlyErrorMessage(nextError, t("The execution records could not be loaded.")));
    } finally {
      setExecutionLoading(false);
    }
  }, [t]);

  const load = useCallback(async (preserveDetails = false) => {
    if (!workspaceId) {
      setLatestRun(null);
      setDetails(null);
      setExecutionPackets([]);
      setExecutionError("");
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
        setExecutionPackets([]);
        setExecutionError("");
        setError("");
        return;
      }
      if (preserveDetails && details?.run.id === nextRun.id) {
        await refreshExecution(details);
        setError("");
        return;
      }
      const detailResponse = await agentApi.detail(workspaceId, nextRun.id);
      setDetails(detailResponse.data);
      await refreshExecution(detailResponse.data);
      setError("");
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, t("The page agent runtime could not be loaded.")));
    } finally {
      setLoading(false);
    }
  }, [contract.pageId, details, refreshExecution, t, workspaceId]);

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
      await refreshExecution(detailResponse.data);
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
      await refreshExecution(response.data);
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

  const executionArtifacts = useMemo(
    () => executionPackets.flatMap((entry) => entry.results),
    [executionPackets],
  );

  return {
    loading,
    acting,
    error,
    latestRun,
    details,
    pendingApprovalSteps,
    recentSteps,
    executionPackets,
    executionArtifacts,
    executionLoading,
    executionError,
    refresh: () => load(),
    start,
    retry: start,
    cancel,
    decide,
  };
}
