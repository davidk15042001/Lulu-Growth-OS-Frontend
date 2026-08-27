import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { bootstrapDemoData, createApp } from '../src/app.js';
import { config } from '../src/config.js';
import { resetStateForTests } from '../src/store.js';

const api = request(createApp());

function authContext(workspaceId = 'demo-workspace', userId = 'demo-admin') {
  return {
    'x-api-token': config.API_AUTH_TOKEN,
    'x-workspace-id': workspaceId,
    'x-user-id': userId,
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

  it('blocks protected site endpoints without api token', async () => {
    const response = await api.get('/api/sites').expect(401);
    assert.equal(response.body.error.code, 'UNAUTHORIZED');
  });

  it('requires workspace and user context for protected routes', async () => {
    const response = await api
      .get('/api/sites')
      .set({ 'x-api-token': config.API_AUTH_TOKEN })
      .expect(401);
    assert.equal(response.body.error.code, 'CONTEXT_REQUIRED');
  });

  it('lists demo sites with a valid api token', async () => {
    const response = await api.get('/api/sites').set(authContext()).expect(200);
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

    const response = await api.post('/api/sites').set(authContext()).send(payload).expect(201);
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
      .set(authContext('demo-workspace', 'demo-viewer'))
      .send(payload)
      .expect(403);
    assert.equal(response.body.error.code, 'INSUFFICIENT_ROLE');
  });

  it('isolates workspaces from each other', async () => {
    const response = await api
      .get('/api/sites/demo-wordpress-site')
      .set(authContext('second-workspace', 'second-admin'))
      .expect(404);
    assert.equal(response.body.success, false);
  });

  it('requires admin role for scheduler trigger', async () => {
    const editorDenied = await api
      .post('/api/scheduler/run-due')
      .set(authContext('demo-workspace', 'demo-editor'))
      .expect(403);
    assert.equal(editorDenied.body.error.code, 'INSUFFICIENT_ROLE');

    const adminAllowed = await api
      .post('/api/scheduler/run-due')
      .set(authContext())
      .expect(200);
    assert.equal(adminAllowed.body.success, true);
  });
});
