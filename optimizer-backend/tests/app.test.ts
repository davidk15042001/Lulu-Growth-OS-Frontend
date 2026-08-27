import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { bootstrapDemoData, createApp } from '../src/app.js';
import { config } from '../src/config.js';
import { resetStateForTests } from '../src/store.js';

const api = request(createApp());
const authHeader = { 'x-api-token': config.API_AUTH_TOKEN };

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

  it('lists demo sites with a valid api token', async () => {
    const response = await api.get('/api/sites').set(authHeader).expect(200);
    assert.equal(response.body.success, true);
    assert.equal(Array.isArray(response.body.data), true);
    assert.equal(response.body.data.length, 1);
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

    const response = await api.post('/api/sites').set(authHeader).send(payload).expect(201);
    assert.equal(response.body.data.targetCountries.length, 2);
    assert.deepEqual(response.body.data.targetCountries, ['DE', 'US']);
    assert.deepEqual(response.body.data.targetKeywords, ['seo automation', 'geo']);
    assert.equal(response.body.data.marketTargets.length, 2);
  });

  it('requires authentication for scheduler trigger', async () => {
    const response = await api.post('/api/scheduler/run-due').expect(401);
    assert.equal(response.body.error.code, 'UNAUTHORIZED');
  });
});
