import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { z } from 'zod';
import { config, isLiveDataForSeoEnabled } from './config.js';
import { seedDemoDataIfEmpty } from './store.js';
import { createSite, executeRun, getSiteWithRuns, listSitesWithRuns, runDueAutomations, updateSite } from './service.js';
import type { CreateSiteInput, Provider, UpdateSiteInput } from './types.js';

const app = express();

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
  }),
);
app.use(express.json());

const providerSchema = z.enum(['wordpress', 'webflow', 'shopify']);

const siteSchema = z.object({
  name: z.string().min(2),
  websiteUrl: z.string().url(),
  provider: providerSchema,
  targetKeywords: z.array(z.string().min(2)).max(12),
  companyGoals: z.string().min(10),
  automationEnabled: z.boolean(),
  automationHourUtc: z.number().int().min(0).max(23),
  mode: z.enum(['mock', 'live']).optional(),
});

const siteUpdateSchema = siteSchema.partial();

async function bootstrap() {
  await seedDemoDataIfEmpty([
    {
      id: 'demo-wordpress-site',
      name: 'Demo Growth Company',
      websiteUrl: 'https://demo-growth.example.com',
      provider: 'wordpress',
      targetKeywords: ['ai seo automation', 'answer engine optimization', 'website intelligence'],
      companyGoals: 'Increase qualified traffic, improve AI visibility, and automate safe site optimization every day.',
      automationEnabled: true,
      automationHourUtc: 4,
      mode: isLiveDataForSeoEnabled ? 'live' : 'mock',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
}

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      liveDataForSeo: isLiveDataForSeoEnabled,
      mockMode: config.DATAFORSEO_MOCK_MODE,
    },
  });
});

app.get('/api/options', (_req, res) => {
  res.json({
    success: true,
    data: {
      providers: ['wordpress', 'webflow', 'shopify'] satisfies Provider[],
      modes: ['mock', 'live'],
      liveDataForSeo: isLiveDataForSeoEnabled,
    },
  });
});

app.get('/api/sites', async (_req, res) => {
  const sites = await listSitesWithRuns();
  res.json({ success: true, data: sites });
});

app.post('/api/sites', async (req, res) => {
  const parsed = siteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: parsed.error.flatten() });
    return;
  }
  const site = await createSite(parsed.data as CreateSiteInput);
  res.status(201).json({ success: true, data: site });
});

app.get('/api/sites/:siteId', async (req, res) => {
  const data = await getSiteWithRuns(req.params.siteId);
  if (!data) {
    res.status(404).json({ success: false, error: { message: 'Site not found' } });
    return;
  }
  res.json({ success: true, data });
});

app.patch('/api/sites/:siteId', async (req, res) => {
  const parsed = siteUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: parsed.error.flatten() });
    return;
  }
  const site = await updateSite(req.params.siteId, parsed.data as UpdateSiteInput);
  if (!site) {
    res.status(404).json({ success: false, error: { message: 'Site not found' } });
    return;
  }
  res.json({ success: true, data: site });
});

app.post('/api/sites/:siteId/analyze', async (req, res) => {
  const result = await executeRun(req.params.siteId, 'analysis');
  if (!result) {
    res.status(404).json({ success: false, error: { message: 'Site not found' } });
    return;
  }
  res.json({ success: true, data: result });
});

app.post('/api/sites/:siteId/optimize', async (req, res) => {
  const result = await executeRun(req.params.siteId, 'optimization');
  if (!result) {
    res.status(404).json({ success: false, error: { message: 'Site not found' } });
    return;
  }
  res.json({ success: true, data: result });
});

app.post('/api/sites/:siteId/full-cycle', async (req, res) => {
  const result = await executeRun(req.params.siteId, 'full_cycle');
  if (!result) {
    res.status(404).json({ success: false, error: { message: 'Site not found' } });
    return;
  }
  res.json({ success: true, data: result });
});

app.post('/api/scheduler/run-due', async (_req, res) => {
  await runDueAutomations();
  res.json({ success: true, data: { triggered: true } });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Unknown server error';
  res.status(500).json({ success: false, error: { message } });
});

await bootstrap();

cron.schedule('0 * * * *', async () => {
  await runDueAutomations();
});

app.listen(config.PORT, () => {
  console.log(`Optimizer backend listening on http://localhost:${config.PORT}`);
});
