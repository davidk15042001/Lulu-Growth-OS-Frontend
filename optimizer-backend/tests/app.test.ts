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

async function authContext(userId: keyof typeof demoCredentials = 'demo-admin') {
  const response = await api.post('/api/auth/login').send(demoCredentials[userId]).expect(200);
  return {
    Authorization: `Bearer ${response.body.data.token}`,
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
    const response = await api.post('/api/auth/login').send(demoCredentials['demo-admin']).expect(200);
    assert.equal(typeof response.body.data.token, 'string');
    assert.equal(response.body.data.session.workspaceId, 'demo-workspace');
    assert.equal(response.body.data.session.userId, 'demo-admin');
    assert.equal(response.body.data.session.role, 'admin');
    assert.equal(response.body.data.session.email, 'admin@demo.example');
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
});
