import { randomUUID } from 'node:crypto';
import { analyzeSite } from './analysis.js';
import { config } from './config.js';
import { buildDefaultMarketTargets } from './markets.js';
import {
  getRun,
  getSite,
  getRunQueueJob,
  listRunQueueJobs,
  listRuns,
  listSites,
  saveRun,
  saveRunQueueJob,
  saveSite,
} from './store.js';
import type { CreateSiteInput, RunQueueJob, SiteConnection, SiteRun, UpdateSiteInput } from './types.js';

function nowIso() {
  return new Date().toISOString();
}

function isReadyToRun(job: RunQueueJob, now = Date.now()) {
  if (job.status !== 'queued') return false;
  if (job.nextAttemptAt && new Date(job.nextAttemptAt).getTime() > now) {
    return false;
  }
  return true;
}

function queueRetryTime(attempts: number) {
  const multiplier = Math.max(1, 2 ** Math.max(0, attempts - 1));
  return new Date(Date.now() + config.QUEUE_RETRY_BACKOFF_MS * multiplier).toISOString();
}

function shouldDeadLetter(job: RunQueueJob, attempts: number) {
  return attempts >= (job.maxAttempts ?? config.QUEUE_MAX_ATTEMPTS);
}

async function failQueuedRun(
  job: RunQueueJob,
  input: {
    error: string;
    attempts: number;
    deadLetter: boolean;
  },
) {
  const finishedAt = nowIso();
  const nextAttemptAt = input.deadLetter ? undefined : queueRetryTime(input.attempts);
  const nextStatus: RunQueueJob['status'] = input.deadLetter ? 'dead_letter' : 'queued';
  await saveRunQueueJob({
    ...job,
    status: nextStatus,
    attempts: input.attempts,
    error: input.error,
    finishedAt: input.deadLetter ? finishedAt : undefined,
    nextAttemptAt,
    leaseExpiresAt: undefined,
    deadLetteredAt: input.deadLetter ? finishedAt : undefined,
  });

  const run = await getRun(job.runId);
  if (!run) return null;

  const nextRun: SiteRun = input.deadLetter
    ? {
        ...run,
        status: 'failed',
        finishedAt,
        error: input.error,
      }
    : {
        ...run,
        status: 'queued',
        error: input.error,
      };
  await saveRun(nextRun);
  return nextRun;
}

export async function createSite(workspaceId: string, userId: string, input: CreateSiteInput) {
  const timestamp = nowIso();
  const site: SiteConnection = {
    id: randomUUID(),
    workspaceId,
    ownerUserId: userId,
    name: input.name,
    websiteUrl: input.websiteUrl,
    provider: input.provider,
    targetKeywords: input.targetKeywords,
    companyGoals: input.companyGoals,
    automationEnabled: input.automationEnabled,
    automationHourUtc: input.automationHourUtc,
    targetCountries: input.targetCountries,
    marketTargets: input.marketTargets ?? buildDefaultMarketTargets(input.targetCountries),
    mode: input.mode ?? 'mock',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await saveSite(site);
  return site;
}

export async function updateSite(workspaceId: string, siteId: string, input: UpdateSiteInput) {
  const existing = await getSite(workspaceId, siteId);
  if (!existing) return null;
  const updated: SiteConnection = {
    ...existing,
    ...input,
    marketTargets:
      input.marketTargets
      ?? (input.targetCountries ? buildDefaultMarketTargets(input.targetCountries) : existing.marketTargets),
    updatedAt: nowIso(),
  };
  await saveSite(updated);
  return updated;
}

export async function listSitesWithRuns(workspaceId: string) {
  const [sites, runs] = await Promise.all([listSites(workspaceId), listRuns(workspaceId)]);
  return sites.map((site) => ({
    ...site,
    lastRun: runs.find((run) => run.siteId === site.id) ?? null,
  }));
}

export async function enqueueRun(workspaceId: string, siteId: string, type: SiteRun['type']) {
  const site = await getSite(workspaceId, siteId);
  if (!site) return null;

  const run: SiteRun = {
    id: randomUUID(),
    siteId: site.id,
    type,
    status: 'queued',
    mode: site.mode,
    createdAt: nowIso(),
  };
  await saveRun(run);
  const job: RunQueueJob = {
    id: randomUUID(),
    workspaceId,
    siteId: site.id,
    runId: run.id,
    type,
    status: 'queued',
    createdAt: nowIso(),
    attempts: 0,
    maxAttempts: config.QUEUE_MAX_ATTEMPTS,
    nextAttemptAt: nowIso(),
  };
  await saveRunQueueJob(job);
  return { run, job };
}

export async function executeRunJob(jobId: string) {
  const job = await getRunQueueJob(jobId);
  if (!job) return null;
  if (job.status === 'completed' || job.status === 'dead_letter') {
    return await getRun(job.runId);
  }
  if (!isReadyToRun(job)) {
    return await getRun(job.runId);
  }
  const site = await getSite(job.workspaceId, job.siteId);
  if (!site) {
    return await failQueuedRun(job, {
      error: 'Site not found for queued job.',
      attempts: job.attempts + 1,
      deadLetter: true,
    });
  }

  const processingJob: RunQueueJob = {
    ...job,
    status: 'processing',
    attempts: job.attempts + 1,
    startedAt: nowIso(),
    nextAttemptAt: undefined,
    leaseExpiresAt: new Date(Date.now() + config.QUEUE_LEASE_MS).toISOString(),
  };
  await saveRunQueueJob(processingJob);
  const activeRun = await getRun(job.runId);
  if (activeRun) {
    await saveRun({
      ...activeRun,
      status: 'running',
      startedAt: activeRun.startedAt ?? processingJob.startedAt,
    });
  }

  try {
    const analysis = await analyzeSite(site);
    const completed: SiteRun = {
      ...(await getRun(job.runId))!,
      status: 'completed',
      finishedAt: nowIso(),
      summary: analysis.summary,
      analysis,
    };
    await saveRun(completed);
    await saveRunQueueJob({
      ...processingJob,
      status: 'completed',
      finishedAt: nowIso(),
      leaseExpiresAt: undefined,
      nextAttemptAt: undefined,
    });
    await saveSite({
      ...site,
      lastRunId: completed.id,
      updatedAt: nowIso(),
    });
    return completed;
  } catch (error) {
    return await failQueuedRun(processingJob, {
      error: error instanceof Error ? error.message : 'Unknown execution error',
      attempts: processingJob.attempts,
      deadLetter: shouldDeadLetter(processingJob, processingJob.attempts),
    });
  }
}

export async function processRunQueue(workspaceId?: string, limit = 5) {
  const queuedJobs = await listRunQueueJobs(workspaceId, ['queued']);
  const jobsToProcess = queuedJobs.filter((job) => isReadyToRun(job)).slice(0, limit);
  const processedRuns = await Promise.all(jobsToProcess.map((job) => executeRunJob(job.id)));
  return processedRuns.filter((run): run is SiteRun => Boolean(run));
}

export async function getSiteWithRuns(workspaceId: string, siteId: string) {
  const site = await getSite(workspaceId, siteId);
  if (!site) return null;
  const runs = await listRuns(workspaceId, siteId);
  const lastRun = site.lastRunId ? await getRun(site.lastRunId) : runs[0] ?? null;
  return { site, lastRun, runs };
}

export async function runDueAutomations(workspaceId: string, currentDate = new Date()) {
  const sites = await listSites(workspaceId);
  const currentHour = currentDate.getUTCHours();
  const todayKey = currentDate.toISOString().slice(0, 10);

  for (const site of sites) {
    if (!site.automationEnabled || site.automationHourUtc !== currentHour) continue;
    const runs = await listRuns(workspaceId, site.id);
    const alreadyRanToday = runs.some(
      (run) => run.type === 'full_cycle' && run.createdAt.slice(0, 10) === todayKey,
    );
    if (!alreadyRanToday) {
      await enqueueRun(workspaceId, site.id, 'full_cycle');
    }
  }
}
