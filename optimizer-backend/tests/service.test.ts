import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { bootstrapDemoData } from '../src/app.js';
import { executeRunJob, processRunQueue } from '../src/service.js';
import { getRunQueueJob, resetStateForTests, saveRun, saveRunQueueJob } from '../src/store.js';
import type { RunQueueJob, SiteRun } from '../src/types.js';

function nowIso() {
  return new Date().toISOString();
}

beforeEach(async () => {
  await resetStateForTests();
  await bootstrapDemoData();
});

describe('optimizer backend queue service', () => {
  it('does not reprocess dead-lettered jobs', async () => {
    const run: SiteRun = {
      id: 'run-dead-letter',
      siteId: 'demo-wordpress-site',
      type: 'analysis',
      status: 'failed',
      mode: 'mock',
      createdAt: nowIso(),
      error: 'Previous retries exhausted',
    };
    const job: RunQueueJob = {
      id: 'job-dead-letter',
      workspaceId: 'demo-workspace',
      siteId: 'demo-wordpress-site',
      runId: run.id,
      type: run.type,
      status: 'dead_letter',
      createdAt: nowIso(),
      attempts: 3,
      maxAttempts: 3,
      deadLetteredAt: nowIso(),
      error: 'Previous retries exhausted',
    };

    await saveRun(run);
    await saveRunQueueJob(job);

    const result = await executeRunJob(job.id);
    const savedJob = await getRunQueueJob(job.id);

    assert.equal(result?.status, 'failed');
    assert.equal(savedJob?.status, 'dead_letter');
    assert.equal(savedJob?.attempts, 3);
  });

  it('does not process queued jobs before their retry window opens', async () => {
    const run: SiteRun = {
      id: 'run-future-retry',
      siteId: 'demo-wordpress-site',
      type: 'analysis',
      status: 'queued',
      mode: 'mock',
      createdAt: nowIso(),
    };
    const job: RunQueueJob = {
      id: 'job-future-retry',
      workspaceId: 'demo-workspace',
      siteId: 'demo-wordpress-site',
      runId: run.id,
      type: run.type,
      status: 'queued',
      createdAt: nowIso(),
      attempts: 1,
      maxAttempts: 3,
      nextAttemptAt: new Date(Date.now() + 60_000).toISOString(),
    };

    await saveRun(run);
    await saveRunQueueJob(job);

    const processed = await processRunQueue('demo-workspace', 5);
    const savedJob = await getRunQueueJob(job.id);

    assert.equal(processed.length, 0);
    assert.equal(savedJob?.status, 'queued');
    assert.equal(savedJob?.attempts, 1);
  });
});
