import { useCallback, useEffect, useMemo, useState } from "react";
import {
  agentApi,
  agentModuleForContract,
  agentPageContextFromContract,
  autoAgentGoalForContract,
  type AgentHealth,
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
  const structured = packet.data?.resultRecords;
  if (Array.isArray(structured)) {
    const refs = new Map<string, RecordRef>();
    for (const entry of structured) {
      const recordId = stringValue((entry as Record<string, unknown>)?.id);
      const resourceType = stringValue((entry as Record<string, unknown>)?.resourceType);
      if (recordId && resourceType) refs.set(`${resourceType}:${recordId}`, { id: recordId, resourceType });
    }
    if (refs.size > 0) return [...refs.values()];
  }
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
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [latestRun, setLatestRun] = useState<AgentRun | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [details, setDetails] = useState<AgentRunDetails | null>(null);
  const [health, setHealth] = useState<AgentHealth | null>(null);
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
          const response = await getRecord(ref.resourceType, ref.id);
          return response.data;
        } catch {
          return null;
        }
      }))).filter((record): record is WorkspaceRecord => Boolean(record));

      const grouped = await Promise.all(
        packets.map(async (packet) => {
          const resultRefs = extractResultRecordRefs(packet);
          const results = (await Promise.all(resultRefs.map(async (ref) => {
            try {
              const response = await getRecord(ref.resourceType, ref.id);
              return response.data;
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
      setRuns([]);
      setSelectedRunId(null);
      setDetails(null);
      setHealth(null);
      setExecutionPackets([]);
      setExecutionError("");
      setError("");
      return;
    }

    setLoading(true);
    try {
      const [listResponse, healthResponse] = await Promise.all([
        agentApi.list(workspaceId, { pageId: contract.pageId }),
        agentApi.health(workspaceId, { pageId: contract.pageId }),
      ]);
      const sortedRuns = listResponse.data.items.slice().sort(newestFirst);
      const nextRun = sortedRuns[0] ?? null;
      const activeRunId = selectedRunId && sortedRuns.some((run) => run.id === selectedRunId)
        ? selectedRunId
        : nextRun?.id ?? null;
      setRuns(sortedRuns);
      setLatestRun(nextRun);
      setSelectedRunId(activeRunId);
      setHealth(healthResponse.data);
      if (!nextRun) {
        setDetails(null);
        setExecutionPackets([]);
        setExecutionError("");
        setError("");
        return;
      }
      if (preserveDetails && details?.run.id === activeRunId) {
        await refreshExecution(details);
        setError("");
        return;
      }
      const detailResponse = await agentApi.detail(workspaceId, activeRunId ?? nextRun.id);
      setDetails(detailResponse.data);
      await refreshExecution(detailResponse.data);
      setError("");
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, t("The page agent runtime could not be loaded.")));
    } finally {
      setLoading(false);
    }
  }, [contract.pageId, details, refreshExecution, selectedRunId, t, workspaceId]);

  useEffect(() => {
    void load();
    if (!workspaceId) return;
    const timer = window.setInterval(() => void load(true), 30_000);
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
      setRuns((current) => [created.data, ...current.filter((run) => run.id !== created.data.id)].sort(newestFirst));
      setLatestRun(created.data);
      setSelectedRunId(created.data.id);
      setDetails(detailResponse.data);
      const healthResponse = await agentApi.health(workspaceId, { pageId: contract.pageId });
      setHealth(healthResponse.data);
      await refreshExecution(detailResponse.data);
      setError("");
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, t("The page agent could not be started.")));
    } finally {
      setActing(false);
    }
  }, [contract, t, workspaceId]);

  const cancel = useCallback(async () => {
    const runId = details?.run.id ?? latestRun?.id;
    if (!workspaceId || !runId) return;
    setActing(true);
    try {
      await agentApi.cancel(workspaceId, runId);
      await load();
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, t("The current page agent run could not be cancelled.")));
    } finally {
      setActing(false);
    }
  }, [details, latestRun, load, t, workspaceId]);

  const decide = useCallback(async (stepId: string, decision: AgentDecision) => {
    const runId = details?.run.id ?? latestRun?.id;
    if (!workspaceId || !runId) return;
    setActing(true);
    try {
      const response = await agentApi.approve(workspaceId, runId, stepId, decision);
      setDetails(response.data);
      setLatestRun(response.data.run);
      await refreshExecution(response.data);
      setError("");
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, t("The approval decision could not be saved.")));
    } finally {
      setActing(false);
    }
  }, [details, latestRun, refreshExecution, t, workspaceId]);

  const pendingApprovalSteps = useMemo(
    () => details?.steps.filter((step) => step.status === "waiting_approval") ?? [],
    [details],
  );

  const recentSteps = useMemo(
    () => (details?.steps ?? []).slice().sort((left, right) => right.sequenceNo - left.sequenceNo).slice(0, 6),
    [details],
  );

  const recentEvents = useMemo(
    () => (details?.events ?? []).slice().sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)).slice(0, 12),
    [details],
  );

  const executionArtifacts = useMemo(
    () => executionPackets.flatMap((entry) => entry.results),
    [executionPackets],
  );

  const currentHealth = useMemo(
    () => health?.items.find((item) => item.pageId === contract.pageId) ?? null,
    [contract.pageId, health],
  );

  const selectRun = useCallback(async (runId: string) => {
    if (!workspaceId) return;
    setActing(true);
    try {
      const detailResponse = await agentApi.detail(workspaceId, runId);
      setSelectedRunId(runId);
      setDetails(detailResponse.data);
      setLatestRun((current) => current?.id === runId ? current : runs.find((run) => run.id === runId) ?? current);
      await refreshExecution(detailResponse.data);
      setError("");
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, t("The selected run could not be loaded.")));
    } finally {
      setActing(false);
    }
  }, [refreshExecution, runs, t, workspaceId]);

  return {
    loading,
    acting,
    error,
    runs,
    latestRun,
    selectedRunId,
    details,
    health,
    currentHealth,
    pendingApprovalSteps,
    recentSteps,
    recentEvents,
    executionPackets,
    executionArtifacts,
    executionLoading,
    executionError,
    refresh: () => load(),
    start,
    retry: start,
    cancel,
    decide,
    selectRun,
  };
}
