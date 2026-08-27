import { randomUUID } from 'node:crypto';
import { saveAuditLog } from './store.js';
import type { AuditLogEntry, RequestContext } from './types.js';

type RequestMetric = {
  totalRequests: number;
  totalErrors: number;
  activeRequests: number;
  authRefreshSuccesses: number;
  authRefreshFailures: number;
  requestDurationsMs: number[];
};

const metrics: RequestMetric = {
  totalRequests: 0,
  totalErrors: 0,
  activeRequests: 0,
  authRefreshSuccesses: 0,
  authRefreshFailures: 0,
  requestDurationsMs: [],
};

function pushDuration(durationMs: number) {
  metrics.requestDurationsMs.push(durationMs);
  if (metrics.requestDurationsMs.length > 200) {
    metrics.requestDurationsMs.shift();
  }
}

export function beginObservedRequest() {
  metrics.totalRequests += 1;
  metrics.activeRequests += 1;
  const startedAt = Date.now();

  return {
    finish(input: { isError: boolean }) {
      metrics.activeRequests = Math.max(0, metrics.activeRequests - 1);
      if (input.isError) {
        metrics.totalErrors += 1;
      }
      pushDuration(Date.now() - startedAt);
    },
  };
}

export function recordRefreshResult(success: boolean) {
  if (success) {
    metrics.authRefreshSuccesses += 1;
  } else {
    metrics.authRefreshFailures += 1;
  }
}

function percentile(values: number[], targetPercentile: number) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((targetPercentile / 100) * sorted.length) - 1),
  );
  return sorted[index] ?? 0;
}

export function getMetricsSnapshot() {
  return {
    totalRequests: metrics.totalRequests,
    totalErrors: metrics.totalErrors,
    activeRequests: metrics.activeRequests,
    authRefreshSuccesses: metrics.authRefreshSuccesses,
    authRefreshFailures: metrics.authRefreshFailures,
    latencyMs: {
      p50: percentile(metrics.requestDurationsMs, 50),
      p95: percentile(metrics.requestDurationsMs, 95),
    },
  };
}

export function formatPrometheusMetrics(input?: {
  activeWorkspaceSessions?: number;
  queueBacklog?: number;
  queueQueued?: number;
  queueProcessing?: number;
  queueDeadLetter?: number;
}) {
  const snapshot = getMetricsSnapshot();
  const lines = [
    '# HELP optimizer_requests_total Total observed HTTP requests',
    '# TYPE optimizer_requests_total counter',
    `optimizer_requests_total ${snapshot.totalRequests}`,
    '# HELP optimizer_errors_total Total observed HTTP errors',
    '# TYPE optimizer_errors_total counter',
    `optimizer_errors_total ${snapshot.totalErrors}`,
    '# HELP optimizer_requests_active Active HTTP requests',
    '# TYPE optimizer_requests_active gauge',
    `optimizer_requests_active ${snapshot.activeRequests}`,
    '# HELP optimizer_auth_refresh_successes_total Successful refresh token rotations',
    '# TYPE optimizer_auth_refresh_successes_total counter',
    `optimizer_auth_refresh_successes_total ${snapshot.authRefreshSuccesses}`,
    '# HELP optimizer_auth_refresh_failures_total Failed refresh token rotations',
    '# TYPE optimizer_auth_refresh_failures_total counter',
    `optimizer_auth_refresh_failures_total ${snapshot.authRefreshFailures}`,
    '# HELP optimizer_request_latency_p50_ms P50 observed request latency in milliseconds',
    '# TYPE optimizer_request_latency_p50_ms gauge',
    `optimizer_request_latency_p50_ms ${snapshot.latencyMs.p50}`,
    '# HELP optimizer_request_latency_p95_ms P95 observed request latency in milliseconds',
    '# TYPE optimizer_request_latency_p95_ms gauge',
    `optimizer_request_latency_p95_ms ${snapshot.latencyMs.p95}`,
  ];

  if (typeof input?.activeWorkspaceSessions === 'number') {
    lines.push('# HELP optimizer_workspace_sessions_active Active authenticated sessions for the workspace');
    lines.push('# TYPE optimizer_workspace_sessions_active gauge');
    lines.push(`optimizer_workspace_sessions_active ${input.activeWorkspaceSessions}`);
  }

  if (typeof input?.queueBacklog === 'number') {
    lines.push('# HELP optimizer_queue_backlog Total non-completed jobs visible for the workspace');
    lines.push('# TYPE optimizer_queue_backlog gauge');
    lines.push(`optimizer_queue_backlog ${input.queueBacklog}`);
  }

  if (typeof input?.queueQueued === 'number') {
    lines.push('# HELP optimizer_queue_queued Queued jobs waiting for processing');
    lines.push('# TYPE optimizer_queue_queued gauge');
    lines.push(`optimizer_queue_queued ${input.queueQueued}`);
  }

  if (typeof input?.queueProcessing === 'number') {
    lines.push('# HELP optimizer_queue_processing Jobs currently being processed');
    lines.push('# TYPE optimizer_queue_processing gauge');
    lines.push(`optimizer_queue_processing ${input.queueProcessing}`);
  }

  if (typeof input?.queueDeadLetter === 'number') {
    lines.push('# HELP optimizer_queue_dead_letter Dead-lettered jobs for the workspace');
    lines.push('# TYPE optimizer_queue_dead_letter gauge');
    lines.push(`optimizer_queue_dead_letter ${input.queueDeadLetter}`);
  }

  return `${lines.join('\n')}\n`;
}

export async function writeAuditLog(input: {
  workspaceId?: string;
  actorType: AuditLogEntry['actorType'];
  actorUserId?: string;
  actorEmail?: string;
  action: string;
  targetType: string;
  targetId?: string;
  outcome: AuditLogEntry['outcome'];
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  details?: Record<string, unknown>;
}) {
  const entry: AuditLogEntry = {
    id: randomUUID(),
    workspaceId: input.workspaceId,
    actorType: input.actorType,
    actorUserId: input.actorUserId,
    actorEmail: input.actorEmail,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    outcome: input.outcome,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    requestId: input.requestId,
    createdAt: new Date().toISOString(),
    details: input.details,
  };
  await saveAuditLog(entry);
  return entry;
}

export function writeStructuredLog(input: {
  level: 'info' | 'warn' | 'error';
  message: string;
  requestId?: string;
  context?: RequestContext;
  details?: Record<string, unknown>;
}) {
  const payload = {
    timestamp: new Date().toISOString(),
    level: input.level,
    message: input.message,
    requestId: input.requestId,
    workspaceId: input.context?.workspaceId,
    userId: input.context?.userId,
    role: input.context?.role,
    details: input.details,
  };
  const serialized = JSON.stringify(payload);

  if (input.level === 'error') {
    console.error(serialized);
    return;
  }

  if (input.level === 'warn') {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
}
