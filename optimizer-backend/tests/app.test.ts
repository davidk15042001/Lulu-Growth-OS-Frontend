import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
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

beforeEach(async () => {
  await resetStateForTests();
  await bootstrapDemoData();
});

describe('optimizer backend api', () => {
  it('allows health without authentication', async () => {
    const response = await api.get('/api/health').expect(200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.status, 'ok');
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
    assert.equal(response.session.email, 'admin@demo.example');
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
    assert.equal(response.body.error.code, 'INSUFFICIENT_ROLE');
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
    assert.equal(editorDenied.body.error.code, 'INSUFFICIENT_ROLE');

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
    assert.equal(auditDenied.body.error.code, 'INSUFFICIENT_ROLE');
  });
});
