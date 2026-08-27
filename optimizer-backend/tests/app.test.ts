import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { generateTotpCode } from '../src/auth.js';
import { bootstrapDemoData, createApp } from '../src/app.js';
import { resetStateForTests } from '../src/store.js';

const api = request(createApp());

const demoCredentials = {
  'demo-admin': { workspaceId: 'demo-workspace', email: 'admin@demo.example', password: 'DemoAdmin!2026' },
  'demo-editor': { workspaceId: 'demo-workspace', email: 'editor@demo.example', password: 'DemoEditor!2026' },
  'demo-viewer': { workspaceId: 'demo-workspace', email: 'viewer@demo.example', password: 'DemoViewer!2026' },
  'second-admin': {
    workspaceId: 'second-workspace',
    email: 'owner@second.example',
    password: 'SecondAdmin!2026',
  },
} as const;

async function loginAs(userId: keyof typeof demoCredentials = 'demo-admin') {
  const response = await api.post('/api/auth/login').send(demoCredentials[userId]).expect(200);
  return response.body.data as {
    token: string;
    refreshToken: string;
    session: {
      workspaceId: string;
      userId: string;
      role: string;
      permissions: string[];
      email: string;
      name: string;
    };
  };
}

async function authContext(userId: keyof typeof demoCredentials = 'demo-admin') {
  const response = await loginAs(userId);
  return {
    Authorization: `Bearer ${response.token}`,
  };
}

async function waitForRun(siteId: string, runId: string) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const detail = await api.get(`/api/sites/${siteId}`).set(await authContext()).expect(200);
    const run =
      detail.body.data.runs.find((entry: { id: string }) => entry.id === runId) ??
      (detail.body.data.lastRun?.id === runId ? detail.body.data.lastRun : null);
    if (!run || run.status === 'completed' || run.status === 'failed') {
      return detail.body.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return (await api.get(`/api/sites/${siteId}`).set(await authContext()).expect(200)).body.data;
}

beforeEach(async () => {
  await resetStateForTests();
  await bootstrapDemoData();
});

describe('optimizer backend api', () => {
  it('allows health without authentication', async () => {
    const response = await api.get('/api/health').expect(200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.status, 'ok');
    assert.equal(typeof response.body.data.uptimeSeconds, 'number');
  });

  it('reports readiness with store and queue details', async () => {
    const response = await api.get('/api/ready').expect(200);
    assert.equal(response.body.data.status, 'ready');
    assert.equal(response.body.data.store.exists, true);
    assert.equal(typeof response.body.data.queue.backlog, 'number');
  });

  it('rejects invalid login credentials', async () => {
    const response = await api
      .post('/api/auth/login')
      .send({
        workspaceId: 'demo-workspace',
        email: 'admin@demo.example',
        password: 'wrong-password',
      })
      .expect(401);
    assert.equal(response.body.error.code, 'INVALID_CREDENTIALS');
  });

  it('creates a bearer token through login', async () => {
    const response = await loginAs('demo-admin');
    assert.equal(typeof response.token, 'string');
    assert.equal(typeof response.refreshToken, 'string');
    assert.equal(response.session.workspaceId, 'demo-workspace');
    assert.equal(response.session.userId, 'demo-admin');
    assert.equal(response.session.role, 'admin');
    assert.equal(response.session.permissions.includes('admin:users:read'), true);
    assert.equal(response.session.email, 'admin@demo.example');
  });

  it('requires MFA once enabled and accepts valid TOTP codes', async () => {
    const auth = await authContext('demo-admin');
    const setup = await api.post('/api/account/mfa/setup').set(auth).expect(200);
    const code = generateTotpCode(setup.body.data.secret);

    await api.post('/api/account/mfa/enable').set(auth).send({ code }).expect(200);

    const denied = await api.post('/api/auth/login').send(demoCredentials['demo-admin']).expect(401);
    assert.equal(denied.body.error.code, 'MFA_REQUIRED');

    const allowed = await api
      .post('/api/auth/login')
      .send({
        ...demoCredentials['demo-admin'],
        mfaCode: generateTotpCode(setup.body.data.secret),
      })
      .expect(200);

    assert.equal(allowed.body.data.session.email, 'admin@demo.example');
  });

  it('disables MFA with password and valid TOTP code', async () => {
    const auth = await authContext('demo-admin');
    const setup = await api.post('/api/account/mfa/setup').set(auth).expect(200);
    await api
      .post('/api/account/mfa/enable')
      .set(auth)
      .send({ code: generateTotpCode(setup.body.data.secret) })
      .expect(200);

    await api
      .post('/api/account/mfa/disable')
      .set(auth)
      .send({
        password: 'DemoAdmin!2026',
        code: generateTotpCode(setup.body.data.secret),
      })
      .expect(200);

    const login = await api.post('/api/auth/login').send(demoCredentials['demo-admin']).expect(200);
    assert.equal(login.body.data.session.email, 'admin@demo.example');
  });

  it('refreshes the session and rotates the refresh token', async () => {
    const login = await loginAs('demo-admin');
    const refreshed = await api
      .post('/api/auth/refresh')
      .send({ refreshToken: login.refreshToken })
      .expect(200);

    assert.notEqual(refreshed.body.data.token, login.token);
    assert.notEqual(refreshed.body.data.refreshToken, login.refreshToken);

    await api.post('/api/auth/refresh').send({ refreshToken: login.refreshToken }).expect(401);
  });

  it('allows admins to create, update and remove workspace users', async () => {
    const created = await api
      .post('/api/admin/users')
      .set(await authContext())
      .send({
        email: 'new.user@example.com',
        name: 'New User',
        role: 'viewer',
        password: 'StrongPass!2026',
      })
      .expect(201);

    assert.equal(created.body.data.email, 'new.user@example.com');
    assert.equal(created.body.data.role, 'viewer');

    const updated = await api
      .patch(`/api/admin/users/${created.body.data.id}`)
      .set(await authContext())
      .send({ role: 'editor', name: 'Updated User' })
      .expect(200);

    assert.equal(updated.body.data.role, 'editor');
    assert.equal(updated.body.data.name, 'Updated User');

    const usersBeforeDelete = await api.get('/api/admin/users').set(await authContext()).expect(200);
    assert.equal(
      usersBeforeDelete.body.data.some((entry: { email: string }) => entry.email === 'new.user@example.com'),
      true,
    );

    await api
      .delete(`/api/admin/users/${created.body.data.id}/membership`)
      .set(await authContext())
      .expect(200);

    const usersAfterDelete = await api.get('/api/admin/users').set(await authContext()).expect(200);
    assert.equal(
      usersAfterDelete.body.data.some((entry: { email: string }) => entry.email === 'new.user@example.com'),
      false,
    );
  });

  it('creates a password reset token and accepts the reset confirmation', async () => {
    const createUser = await api
      .post('/api/admin/users')
      .set(await authContext())
      .send({
        email: 'reset.user@example.com',
        name: 'Reset User',
        role: 'viewer',
        password: 'OriginalPass!2026',
      })
      .expect(201);

    const resetToken = await api
      .post(`/api/admin/users/${createUser.body.data.id}/password-reset`)
      .set(await authContext())
      .expect(200);

    assert.equal(typeof resetToken.body.data.token, 'string');

    await api
      .post('/api/auth/password-reset/confirm')
      .send({
        token: resetToken.body.data.token,
        newPassword: 'ChangedPass!2026',
      })
      .expect(200);

    const login = await api
      .post('/api/auth/login')
      .send({
        workspaceId: 'demo-workspace',
        email: 'reset.user@example.com',
        password: 'ChangedPass!2026',
      })
      .expect(200);

    assert.equal(login.body.data.session.email, 'reset.user@example.com');
  });

  it('blocks protected site endpoints without a bearer token', async () => {
    const response = await api.get('/api/sites').expect(401);
    assert.equal(response.body.error.code, 'AUTH_REQUIRED');
  });

  it('returns the authenticated session context', async () => {
    const response = await api.get('/api/session').set(await authContext()).expect(200);
    assert.equal(response.body.data.workspaceId, 'demo-workspace');
    assert.equal(response.body.data.userId, 'demo-admin');
    assert.equal(response.body.data.role, 'admin');
    assert.equal(response.body.data.name, 'Demo Admin');
  });

  it('lets users change their password and invalidates the old one', async () => {
    const login = await loginAs('demo-admin');

    await api
      .post('/api/account/password')
      .set({ Authorization: `Bearer ${login.token}` })
      .send({
        currentPassword: 'DemoAdmin!2026',
        newPassword: 'DemoAdmin!2027',
      })
      .expect(200);

    await api.get('/api/session').set({ Authorization: `Bearer ${login.token}` }).expect(401);

    await api
      .post('/api/auth/login')
      .send({
        workspaceId: 'demo-workspace',
        email: 'admin@demo.example',
        password: 'DemoAdmin!2027',
      })
      .expect(200);
  });

  it('lists and revokes own sessions', async () => {
    const login = await loginAs('demo-admin');
    const sessions = await api
      .get('/api/account/sessions')
      .set({ Authorization: `Bearer ${login.token}` })
      .expect(200);

    assert.equal(Array.isArray(sessions.body.data), true);
    assert.equal(sessions.body.data.length > 0, true);

    await api
      .post(`/api/account/sessions/${sessions.body.data[0].id}/revoke`)
      .set({ Authorization: `Bearer ${login.token}` })
      .expect(200);
  });

  it('revokes the session on logout', async () => {
    const login = await loginAs('demo-admin');
    await api.post('/api/auth/logout').set({ Authorization: `Bearer ${login.token}` }).expect(200);

    const denied = await api.get('/api/session').set({ Authorization: `Bearer ${login.token}` }).expect(401);
    assert.equal(denied.body.error.code, 'SESSION_REVOKED');
  });

  it('lists demo sites with a valid session', async () => {
    const response = await api.get('/api/sites').set(await authContext()).expect(200);
    assert.equal(response.body.success, true);
    assert.equal(Array.isArray(response.body.data), true);
    assert.equal(response.body.data.length, 1);
    assert.equal(response.body.data[0].workspaceId, 'demo-workspace');
  });

  it('creates a site with deduplicated countries and keywords', async () => {
    const payload = {
      name: 'Enterprise Example',
      websiteUrl: 'https://enterprise.example.com',
      provider: 'wordpress',
      targetKeywords: [' seo automation ', 'seo automation', 'geo'],
      companyGoals: 'Drive enterprise growth with safer multi-country optimization.',
      automationEnabled: true,
      automationHourUtc: 6,
      targetCountries: ['DE', 'DE', 'US'],
      mode: 'mock',
    };

    const response = await api.post('/api/sites').set(await authContext()).send(payload).expect(201);
    assert.equal(response.body.data.targetCountries.length, 2);
    assert.deepEqual(response.body.data.targetCountries, ['DE', 'US']);
    assert.deepEqual(response.body.data.targetKeywords, ['seo automation', 'geo']);
    assert.equal(response.body.data.marketTargets.length, 2);
    assert.equal(response.body.data.workspaceId, 'demo-workspace');
    assert.equal(response.body.data.ownerUserId, 'demo-admin');
  });

  it('blocks write actions for viewer role', async () => {
    const payload = {
      name: 'Viewer Example',
      websiteUrl: 'https://viewer.example.com',
      provider: 'wordpress',
      targetKeywords: ['viewer seo'],
      companyGoals: 'Attempt to create a site with read only role.',
      automationEnabled: false,
      automationHourUtc: 8,
      targetCountries: ['DE'],
      mode: 'mock',
    };

    const response = await api
      .post('/api/sites')
      .set(await authContext('demo-viewer'))
      .send(payload)
      .expect(403);
    assert.equal(response.body.error.code, 'INSUFFICIENT_PERMISSION');
  });

  it('isolates workspaces from each other', async () => {
    const response = await api
      .get('/api/sites/demo-wordpress-site')
      .set(await authContext('second-admin'))
      .expect(404);
    assert.equal(response.body.success, false);
  });

  it('requires admin role for scheduler trigger', async () => {
    const editorDenied = await api
      .post('/api/scheduler/run-due')
      .set(await authContext('demo-editor'))
      .expect(403);
    assert.equal(editorDenied.body.error.code, 'INSUFFICIENT_PERMISSION');

    const adminAllowed = await api
      .post('/api/scheduler/run-due')
      .set(await authContext())
      .expect(200);
    assert.equal(adminAllowed.body.success, true);
  });

  it('exposes admin audit logs and metrics for admin users', async () => {
    await api.get('/api/sites').set(await authContext()).expect(200);

    const auditResponse = await api.get('/api/admin/audit-logs').set(await authContext()).expect(200);
    assert.equal(Array.isArray(auditResponse.body.data), true);
    assert.equal(auditResponse.body.data.some((entry: { action: string }) => entry.action === 'auth.login'), true);

    const metricsResponse = await api.get('/api/admin/metrics').set(await authContext()).expect(200);
    assert.equal(typeof metricsResponse.body.data.totalRequests, 'number');
    assert.equal(typeof metricsResponse.body.data.activeWorkspaceSessions, 'number');
  });

  it('exposes schema migrations and run queue for admins', async () => {
    const runResponse = await api
      .post('/api/sites/demo-wordpress-site/full-cycle')
      .set(await authContext())
      .expect(202);

    const queueResponse = await api.get('/api/admin/run-queue').set(await authContext()).expect(200);
    assert.equal(
      queueResponse.body.data.some((job: { runId: string }) => job.runId === runResponse.body.data.id),
      true,
    );

    const migrationResponse = await api.get('/api/admin/migrations').set(await authContext()).expect(200);
    assert.equal(Array.isArray(migrationResponse.body.data), true);
    assert.equal(migrationResponse.body.data.some((entry: { version: number }) => entry.version === 3), true);
  });

  it('creates, lists and restores store backups for admins', async () => {
    const baselineSite = await api
      .post('/api/sites')
      .set(await authContext())
      .send({
        name: 'Baseline Site',
        websiteUrl: 'https://baseline.example.com',
        provider: 'wordpress',
        targetKeywords: ['baseline seo'],
        companyGoals: 'Preserve baseline state before additional changes.',
        automationEnabled: false,
        automationHourUtc: 3,
        targetCountries: ['DE'],
        mode: 'mock',
      })
      .expect(201);

    const backupResponse = await api
      .post('/api/admin/backups')
      .set(await authContext())
      .send({ reason: 'pre-restore-check' })
      .expect(201);

    assert.equal(typeof backupResponse.body.data.id, 'string');
    assert.equal(backupResponse.body.data.reason, 'pre-restore-check');

    const backupList = await api.get('/api/admin/backups').set(await authContext()).expect(200);
    assert.equal(
      backupList.body.data.some((entry: { id: string }) => entry.id === backupResponse.body.data.id),
      true,
    );

    await api
      .post('/api/sites')
      .set(await authContext())
      .send({
        name: 'Transient Site',
        websiteUrl: 'https://transient.example.com',
        provider: 'wordpress',
        targetKeywords: ['transient seo'],
        companyGoals: 'This site should disappear after restore.',
        automationEnabled: false,
        automationHourUtc: 5,
        targetCountries: ['US'],
        mode: 'mock',
      })
      .expect(201);

    await api
      .post(`/api/admin/backups/${backupResponse.body.data.id}/restore`)
      .set(await authContext())
      .expect(200);

    const sitesAfterRestore = await api.get('/api/sites').set(await authContext()).expect(200);
    assert.equal(
      sitesAfterRestore.body.data.some((entry: { name: string }) => entry.name === 'Transient Site'),
      false,
    );
    assert.equal(
      sitesAfterRestore.body.data.some((entry: { id: string }) => entry.id === baselineSite.body.data.id),
      true,
    );
  });

  it('queues runs and completes them through the worker flow', async () => {
    const runResponse = await api
      .post('/api/sites/demo-wordpress-site/analyze')
      .set(await authContext('demo-editor'))
      .expect(202);

    assert.equal(runResponse.body.data.status, 'queued');

    const detail = await waitForRun('demo-wordpress-site', runResponse.body.data.id);
    const completedRun =
      detail.runs.find((entry: { id: string }) => entry.id === runResponse.body.data.id) ??
      detail.lastRun;

    assert.equal(completedRun.status, 'completed');
    assert.equal(typeof completedRun.analysis.summary, 'string');
  });

  it('lists and revokes workspace sessions for admins', async () => {
    const login = await loginAs('demo-admin');
    const sessions = await api
      .get('/api/admin/sessions')
      .set({ Authorization: `Bearer ${login.token}` })
      .expect(200);

    assert.equal(Array.isArray(sessions.body.data), true);
    assert.equal(sessions.body.data.length > 0, true);

    await api
      .post(`/api/admin/sessions/${sessions.body.data[0].id}/revoke`)
      .set({ Authorization: `Bearer ${login.token}` })
      .expect(200);
  });

  it('blocks viewer access to admin observability endpoints', async () => {
    const auditDenied = await api
      .get('/api/admin/audit-logs')
      .set(await authContext('demo-viewer'))
      .expect(403);
    assert.equal(auditDenied.body.error.code, 'INSUFFICIENT_PERMISSION');
  });

  it('blocks editor access to backup administration endpoints', async () => {
    const denied = await api.get('/api/admin/backups').set(await authContext('demo-editor')).expect(403);
    assert.equal(denied.body.error.code, 'INSUFFICIENT_PERMISSION');
  });
});
