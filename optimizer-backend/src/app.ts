import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { createAuthToken, hashPassword, verifyAuthToken, verifyPassword } from './auth.js';
import { config, isLiveDataForSeoEnabled } from './config.js';
import { buildDefaultMarketTargets, DEFAULT_COUNTRY_CODES, listCountryPresets } from './markets.js';
import {
  buildRequestContext,
  getUserByEmail,
  listWorkspaces,
  saveUser,
  seedAccessControlIfEmpty,
  seedDemoDataIfEmpty,
} from './store.js';
import {
  createSite,
  executeRun,
  getSiteWithRuns,
  listSitesWithRuns,
  runDueAutomations,
  updateSite,
} from './service.js';
import type {
  CountryCode,
  CreateSiteInput,
  Provider,
  RequestContext,
  UpdateSiteInput,
  UserRole,
} from './types.js';

const apiLimiter = new Map<string, { count: number; resetAt: number }>();

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

type AppLocals = {
  requestId: string;
  context?: RequestContext;
};

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

function readBearerToken(req: express.Request) {
  const authorization = req.header('authorization')?.trim();
  if (!authorization) {
    return null;
  }
  const [scheme, token] = authorization.split(/\s+/, 2);
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }
  return token;
}

const roleRank: Record<UserRole, number> = {
  viewer: 1,
  editor: 2,
  admin: 3,
};

async function requireAuthenticatedSession(
  req: express.Request,
  res: express.Response<any, AppLocals>,
  next: express.NextFunction,
) {
  const token = readBearerToken(req);
  if (!token) {
    next(new AppError(401, 'AUTH_REQUIRED', 'A valid login session is required.'));
    return;
  }

  try {
    const payload = verifyAuthToken(token);
    const context = await buildRequestContext(payload.workspaceId, payload.sub);
    if (!context) {
      next(new AppError(403, 'SESSION_REVOKED', 'This session is no longer valid.'));
      return;
    }
    res.locals.context = context;
    next();
  } catch (error) {
    next(
      new AppError(
        401,
        'INVALID_AUTH_TOKEN',
        error instanceof Error ? error.message : 'The provided token is invalid.',
      ),
    );
  }
}

function requireRole(minRole: UserRole) {
  return async (
    _req: express.Request,
    res: express.Response<any, AppLocals>,
    next: express.NextFunction,
  ) => {
    const context = res.locals.context;
    if (!context) {
      next(new AppError(500, 'REQUEST_CONTEXT_MISSING', 'Authenticated context was not attached.'));
      return;
    }
    if (roleRank[context.role] < roleRank[minRole]) {
      next(
        new AppError(
          403,
          'INSUFFICIENT_ROLE',
          `This operation requires ${minRole} privileges in the selected workspace.`,
        ),
      );
      return;
    }
    res.locals.context = context;
    next();
  };
}

function requestContext(res: express.Response<any, AppLocals>) {
  const context = res.locals.context;
  if (!context) {
    throw new AppError(500, 'REQUEST_CONTEXT_MISSING', 'Workspace context was not attached.');
  }
  return context;
}

function readSiteId(req: express.Request) {
  const siteId = req.params.siteId;
  if (typeof siteId !== 'string' || siteId.length === 0) {
    throw new AppError(400, 'SITE_ID_REQUIRED', 'A valid site id is required.');
  }
  return siteId;
}

const providerSchema = z.enum(['wordpress', 'webflow', 'shopify']);
const countrySchema = z.enum([
  'US',
  'DE',
  'CN',
  'GB',
  'NL',
  'SE',
  'DK',
  'NO',
  'CH',
  'CA',
  'AU',
  'AE',
  'IN',
  'PK',
  'BD',
]);
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

const loginSchema = z.object({
  workspaceId: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

function sanitizeCreateSiteInput(input: CreateSiteInput): CreateSiteInput {
  const targetKeywords = trimUnique(input.targetKeywords);
  const targetCountries = Array.from(new Set(input.targetCountries));
  const marketTargets = input.marketTargets?.filter((target) =>
    targetCountries.includes(target.countryCode),
  );
  return {
    ...input,
    websiteUrl: input.websiteUrl.trim(),
    targetKeywords,
    targetCountries,
    marketTargets:
      marketTargets && marketTargets.length > 0
        ? marketTargets
        : buildDefaultMarketTargets(targetCountries),
  };
}

function sanitizeUpdateSiteInput(input: UpdateSiteInput): UpdateSiteInput {
  const targetCountries = input.targetCountries
    ? Array.from(new Set(input.targetCountries))
    : undefined;
  const targetKeywords = input.targetKeywords ? trimUnique(input.targetKeywords) : undefined;
  const marketTargets = input.marketTargets?.filter(
    (target) => !targetCountries || targetCountries.includes(target.countryCode),
  );
  return {
    ...input,
    ...(input.websiteUrl ? { websiteUrl: input.websiteUrl.trim() } : {}),
    ...(targetKeywords ? { targetKeywords } : {}),
    ...(targetCountries ? { targetCountries } : {}),
    ...(marketTargets ? { marketTargets } : {}),
  };
}

export async function bootstrapDemoData() {
  const timestamp = new Date().toISOString();
  const demoPasswords = {
    admin: hashPassword('DemoAdmin!2026'),
    editor: hashPassword('DemoEditor!2026'),
    viewer: hashPassword('DemoViewer!2026'),
    secondAdmin: hashPassword('SecondAdmin!2026'),
  };
  const demoUsers = [
    {
      id: 'demo-admin',
      email: 'admin@demo.example',
      name: 'Demo Admin',
      createdAt: timestamp,
      passwordHash: demoPasswords.admin,
      passwordUpdatedAt: timestamp,
    },
    {
      id: 'demo-editor',
      email: 'editor@demo.example',
      name: 'Demo Editor',
      createdAt: timestamp,
      passwordHash: demoPasswords.editor,
      passwordUpdatedAt: timestamp,
    },
    {
      id: 'demo-viewer',
      email: 'viewer@demo.example',
      name: 'Demo Viewer',
      createdAt: timestamp,
      passwordHash: demoPasswords.viewer,
      passwordUpdatedAt: timestamp,
    },
    {
      id: 'second-admin',
      email: 'owner@second.example',
      name: 'Second Admin',
      createdAt: timestamp,
      passwordHash: demoPasswords.secondAdmin,
      passwordUpdatedAt: timestamp,
    },
  ];
  await seedAccessControlIfEmpty({
    workspaces: [
      { id: 'demo-workspace', name: 'Demo Workspace', createdAt: timestamp },
      { id: 'second-workspace', name: 'Second Workspace', createdAt: timestamp },
    ],
    users: demoUsers,
    memberships: [
      { workspaceId: 'demo-workspace', userId: 'demo-admin', role: 'admin', createdAt: timestamp },
      { workspaceId: 'demo-workspace', userId: 'demo-editor', role: 'editor', createdAt: timestamp },
      { workspaceId: 'demo-workspace', userId: 'demo-viewer', role: 'viewer', createdAt: timestamp },
      { workspaceId: 'second-workspace', userId: 'second-admin', role: 'admin', createdAt: timestamp },
    ],
  });
  await Promise.all(demoUsers.map((user) => saveUser(user)));

  const demoCountries: CountryCode[] = ['US', 'DE', 'CN', 'GB', 'IN'];
  await seedDemoDataIfEmpty([
    {
      id: 'demo-wordpress-site',
      workspaceId: 'demo-workspace',
      ownerUserId: 'demo-admin',
      name: 'Demo Growth Company',
      websiteUrl: 'https://demo-growth.example.com',
      provider: 'wordpress',
      targetKeywords: [
        'ai seo automation',
        'answer engine optimization',
        'website intelligence',
      ],
      companyGoals:
        'Increase qualified traffic, improve AI visibility, and automate safe site optimization every day.',
      automationEnabled: true,
      automationHourUtc: 4,
      targetCountries: demoCountries,
      marketTargets: buildDefaultMarketTargets(demoCountries),
      mode: isLiveDataForSeoEnabled ? 'live' : 'mock',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ]);
}

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.FRONTEND_ORIGIN,
      methods: ['GET', 'POST', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(rateLimit);
  app.use(express.json({ limit: '256kb' }));
  app.use((_req, res: express.Response<any, AppLocals>, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cache-Control', 'no-store');
    res.locals.requestId = randomUUID();
    next();
  });

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

  app.post('/api/auth/login', async (req, res, next) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(422).json({ success: false, error: parsed.error.flatten() });
        return;
      }

      const user = await getUserByEmail(parsed.data.email);
      if (!user?.passwordHash || !verifyPassword(parsed.data.password, user.passwordHash)) {
        next(new AppError(401, 'INVALID_CREDENTIALS', 'Invalid login credentials.'));
        return;
      }

      const context = await buildRequestContext(parsed.data.workspaceId, user.id);
      if (!context) {
        next(new AppError(401, 'INVALID_CREDENTIALS', 'Invalid login credentials.'));
        return;
      }

      const authToken = createAuthToken({
        userId: user.id,
        workspaceId: parsed.data.workspaceId,
      });

      res.json({
        success: true,
        data: {
          token: authToken.token,
          expiresAt: authToken.expiresAt,
          session: context,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/session', requireAuthenticatedSession, (_req, res) => {
    res.json({
      success: true,
      data: requestContext(res),
    });
  });

  app.use('/api/sites', requireAuthenticatedSession);
  app.use('/api/scheduler', requireAuthenticatedSession, requireRole('admin'));

  app.get('/api/sites', async (_req, res: express.Response<any, AppLocals>, next) => {
    try {
      const sites = await listSitesWithRuns(requestContext(res).workspaceId);
      res.json({ success: true, data: sites });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/sites', requireRole('editor'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const parsed = siteSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(422).json({ success: false, error: parsed.error.flatten() });
        return;
      }
      const context = requestContext(res);
      const site = await createSite(
        context.workspaceId,
        context.userId,
        sanitizeCreateSiteInput(parsed.data as CreateSiteInput),
      );
      res.status(201).json({ success: true, data: site });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/sites/:siteId', async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const data = await getSiteWithRuns(requestContext(res).workspaceId, readSiteId(req));
      if (!data) {
        res.status(404).json({ success: false, error: { message: 'Site not found' } });
        return;
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/sites/:siteId', requireRole('editor'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const parsed = siteUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(422).json({ success: false, error: parsed.error.flatten() });
        return;
      }
      const site = await updateSite(
        requestContext(res).workspaceId,
        readSiteId(req),
        sanitizeUpdateSiteInput(parsed.data as UpdateSiteInput),
      );
      if (!site) {
        res.status(404).json({ success: false, error: { message: 'Site not found' } });
        return;
      }
      res.json({ success: true, data: site });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/sites/:siteId/analyze', requireRole('editor'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const result = await executeRun(requestContext(res).workspaceId, readSiteId(req), 'analysis');
      if (!result) {
        res.status(404).json({ success: false, error: { message: 'Site not found' } });
        return;
      }
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/sites/:siteId/optimize', requireRole('editor'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const result = await executeRun(
        requestContext(res).workspaceId,
        readSiteId(req),
        'optimization',
      );
      if (!result) {
        res.status(404).json({ success: false, error: { message: 'Site not found' } });
        return;
      }
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/sites/:siteId/full-cycle', requireRole('editor'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const result = await executeRun(
        requestContext(res).workspaceId,
        readSiteId(req),
        'full_cycle',
      );
      if (!result) {
        res.status(404).json({ success: false, error: { message: 'Site not found' } });
        return;
      }
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/scheduler/run-due', async (_req, res: express.Response<any, AppLocals>, next) => {
    try {
      await runDueAutomations(requestContext(res).workspaceId);
      res.json({ success: true, data: { triggered: true } });
    } catch (error) {
      next(error);
    }
  });

  app.use(
    (
      error: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
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
    },
  );

  return app;
}

export function startScheduler() {
  return cron.schedule('0 * * * *', async () => {
    const workspaces = await listWorkspaces();
    for (const workspace of workspaces) {
      await runDueAutomations(workspace.id);
    }
  });
}
