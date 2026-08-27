import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { config, isLiveDataForSeoEnabled } from './config.js';
import { buildDefaultMarketTargets, DEFAULT_COUNTRY_CODES, listCountryPresets } from './markets.js';
import { seedDemoDataIfEmpty } from './store.js';
import { createSite, executeRun, getSiteWithRuns, listSitesWithRuns, runDueAutomations, updateSite } from './service.js';
import type { CountryCode, CreateSiteInput, Provider, UpdateSiteInput } from './types.js';

const app = express();
const apiLimiter = new Map<string, { count: number; resetAt: number }>();

class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

function requestIp(req: express.Request) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function trimUnique(values: string[]) {
  return Array.from(new Set(values.map((entry) => entry.trim()).filter(Boolean)));
}

function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const now = Date.now();
  const ip = requestIp(req);
  const current = apiLimiter.get(ip);
  if (!current || current.resetAt <= now) {
    apiLimiter.set(ip, {
      count: 1,
      resetAt: now + config.API_RATE_LIMIT_WINDOW_MS,
    });
    next();
    return;
  }
  if (current.count >= config.API_RATE_LIMIT_MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please retry later.',
      },
    });
    return;
  }
  current.count += 1;
  apiLimiter.set(ip, current);
  next();
}

function requireApiAuth(req: express.Request, _res: express.Response, next: express.NextFunction) {
  const token = req.header('x-api-token')?.trim();
  if (token !== config.API_AUTH_TOKEN) {
    next(new AppError(401, 'UNAUTHORIZED', 'A valid API token is required.'));
    return;
  }
  next();
}

function sanitizeCreateSiteInput(input: CreateSiteInput): CreateSiteInput {
  const targetKeywords = trimUnique(input.targetKeywords);
  const targetCountries = Array.from(new Set(input.targetCountries));
  const marketTargets = input.marketTargets?.filter((target) => targetCountries.includes(target.countryCode));
  return {
    ...input,
    websiteUrl: input.websiteUrl.trim(),
    targetKeywords,
    targetCountries,
    marketTargets: marketTargets && marketTargets.length > 0 ? marketTargets : buildDefaultMarketTargets(targetCountries),
  };
}

function sanitizeUpdateSiteInput(input: UpdateSiteInput): UpdateSiteInput {
  const targetCountries = input.targetCountries ? Array.from(new Set(input.targetCountries)) : undefined;
  const targetKeywords = input.targetKeywords ? trimUnique(input.targetKeywords) : undefined;
  const marketTargets = input.marketTargets?.filter((target) => !targetCountries || targetCountries.includes(target.countryCode));
  return {
    ...input,
    ...(input.websiteUrl ? { websiteUrl: input.websiteUrl.trim() } : {}),
    ...(targetKeywords ? { targetKeywords } : {}),
    ...(targetCountries ? { targetCountries } : {}),
    ...(marketTargets ? { marketTargets } : {}),
  };
}

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type', 'X-API-Token'],
  }),
);
app.use(rateLimit);
app.use(express.json({ limit: '256kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-store');
  res.locals.requestId = randomUUID();
  next();
});

const providerSchema = z.enum(['wordpress', 'webflow', 'shopify']);
const countrySchema = z.enum(['US', 'DE', 'CN', 'GB', 'NL', 'SE', 'DK', 'NO', 'CH', 'CA', 'AU', 'AE', 'IN', 'PK', 'BD']);
const languageSchema = z.enum(['en', 'de', 'zh-CN', 'nl', 'sv', 'da', 'no', 'ar', 'hi', 'ur', 'bn']);

const marketLanguageSchema = z.object({
  code: languageSchema,
  label: z.string().min(2),
  dataForSeoName: z.string().min(2),
});

const marketTargetSchema = z.object({
  countryCode: countrySchema,
  countryName: z.string().min(2),
  locationName: z.string().min(2),
  primaryLanguageCode: languageSchema,
  languages: z.array(marketLanguageSchema).min(1),
});

const siteSchema = z.object({
  name: z.string().min(2),
  websiteUrl: z.string().url().refine((value) => value.startsWith('https://') || value.startsWith('http://'), {
    message: 'Website URL must use http or https.',
  }),
  provider: providerSchema,
  targetKeywords: z.array(z.string().trim().min(2)).min(1).max(12),
  companyGoals: z.string().min(10),
  automationEnabled: z.boolean(),
  automationHourUtc: z.number().int().min(0).max(23),
  targetCountries: z.array(countrySchema).min(1).max(15),
  marketTargets: z.array(marketTargetSchema).min(1).optional(),
  mode: z.enum(['mock', 'live']).optional(),
});

const siteUpdateSchema = siteSchema.partial();

async function bootstrap() {
  const demoCountries: CountryCode[] = ['US', 'DE', 'CN', 'GB', 'IN'];
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
      targetCountries: demoCountries,
      marketTargets: buildDefaultMarketTargets(demoCountries),
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
      countries: listCountryPresets(),
      defaultCountryCodes: DEFAULT_COUNTRY_CODES,
      languageStrategy: 'local_and_english',
    },
  });
});

app.use('/api/sites', requireApiAuth);
app.use('/api/scheduler', requireApiAuth);

app.get('/api/sites', async (_req, res, next) => {
  try {
  const sites = await listSitesWithRuns();
  res.json({ success: true, data: sites });
  } catch (error) {
    next(error);
  }
});

app.post('/api/sites', async (req, res, next) => {
  try {
  const parsed = siteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: parsed.error.flatten() });
    return;
  }
  const site = await createSite(sanitizeCreateSiteInput(parsed.data as CreateSiteInput));
  res.status(201).json({ success: true, data: site });
  } catch (error) {
    next(error);
  }
});

app.get('/api/sites/:siteId', async (req, res, next) => {
  try {
  const data = await getSiteWithRuns(req.params.siteId);
  if (!data) {
    res.status(404).json({ success: false, error: { message: 'Site not found' } });
    return;
  }
  res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/sites/:siteId', async (req, res, next) => {
  try {
  const parsed = siteUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: parsed.error.flatten() });
    return;
  }
  const site = await updateSite(req.params.siteId, sanitizeUpdateSiteInput(parsed.data as UpdateSiteInput));
  if (!site) {
    res.status(404).json({ success: false, error: { message: 'Site not found' } });
    return;
  }
  res.json({ success: true, data: site });
  } catch (error) {
    next(error);
  }
});

app.post('/api/sites/:siteId/analyze', async (req, res, next) => {
  try {
  const result = await executeRun(req.params.siteId, 'analysis');
  if (!result) {
    res.status(404).json({ success: false, error: { message: 'Site not found' } });
    return;
  }
  res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

app.post('/api/sites/:siteId/optimize', async (req, res, next) => {
  try {
  const result = await executeRun(req.params.siteId, 'optimization');
  if (!result) {
    res.status(404).json({ success: false, error: { message: 'Site not found' } });
    return;
  }
  res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

app.post('/api/sites/:siteId/full-cycle', async (req, res, next) => {
  try {
  const result = await executeRun(req.params.siteId, 'full_cycle');
  if (!result) {
    res.status(404).json({ success: false, error: { message: 'Site not found' } });
    return;
  }
  res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

app.post('/api/scheduler/run-due', async (_req, res, next) => {
  try {
    await runDueAutomations();
    res.json({ success: true, data: { triggered: true } });
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const appError = error instanceof AppError ? error : null;
  const statusCode = appError?.statusCode ?? 500;
  const code = appError?.code ?? 'INTERNAL_SERVER_ERROR';
  if (!appError) {
    console.error('Unhandled API error', error);
  }
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: appError?.message ?? 'The server could not complete the request.',
    },
  });
});

await bootstrap();

cron.schedule('0 * * * *', async () => {
  await runDueAutomations();
});

app.listen(config.PORT, () => {
  console.log(`Optimizer backend listening on http://localhost:${config.PORT}`);
});
