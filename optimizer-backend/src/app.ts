import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import {
  createAuthToken,
  createRefreshToken,
  hashPassword,
  hashRefreshToken,
  verifyAuthToken,
  verifyPassword,
} from './auth.js';
import { config, isLiveDataForSeoEnabled } from './config.js';
import { buildDefaultMarketTargets, DEFAULT_COUNTRY_CODES, listCountryPresets } from './markets.js';
import {
  beginObservedRequest,
  getMetricsSnapshot,
  recordRefreshResult,
  writeAuditLog,
  writeStructuredLog,
} from './observability.js';
import {
  buildRequestContext,
  countActiveAuthSessions,
  getAuthSession,
  getAuthSessionByRefreshTokenHash,
  getUserByEmail,
  listWorkspaces,
  listAuditLogs,
  revokeAuthSession,
  revokeUserWorkspaceSessions,
  saveAuthSession,
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
  AuthSession,
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

function nowIso() {
  return new Date().toISOString();
}

function userAgent(req: express.Request) {
  return req.header('user-agent')?.trim() || undefined;
}

function sessionExpiresAtIso() {
  return new Date(Date.now() + config.AUTH_REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

async function issueSessionTokens(input: {
  userId: string;
  workspaceId: string;
  ipAddress?: string;
  userAgent?: string;
  revokedReasonForOthers?: string;
}) {
  const timestamp = nowIso();
  const sessionId = randomUUID();
  const refreshToken = createRefreshToken();
  const session: AuthSession = {
    id: sessionId,
    userId: input.userId,
    workspaceId: input.workspaceId,
    refreshTokenHash: hashRefreshToken(refreshToken),
    createdAt: timestamp,
    expiresAt: sessionExpiresAtIso(),
    lastUsedAt: timestamp,
    createdByIp: input.ipAddress,
    lastSeenIp: input.ipAddress,
    userAgent: input.userAgent,
  };
  await saveAuthSession(session);
  if (input.revokedReasonForOthers) {
    await revokeUserWorkspaceSessions(input.workspaceId, input.userId, {
      revokedAt: timestamp,
      reason: input.revokedReasonForOthers,
      exceptSessionId: sessionId,
    });
  }
  const authToken = createAuthToken({
    userId: input.userId,
    workspaceId: input.workspaceId,
    sessionId,
  });
  return {
    accessToken: authToken.token,
    accessTokenExpiresAt: authToken.expiresAt,
    refreshToken,
    session,
  };
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
    const session = await getAuthSession(payload.sid);
    if (!session || session.userId !== payload.sub || session.workspaceId !== payload.workspaceId) {
      next(new AppError(401, 'SESSION_REVOKED', 'This session is no longer valid.'));
      return;
    }
    if (session.revokedAt || new Date(session.expiresAt).getTime() <= Date.now()) {
      next(new AppError(401, 'SESSION_REVOKED', 'This session is no longer valid.'));
      return;
    }
    const context = await buildRequestContext(payload.workspaceId, payload.sub);
    if (!context) {
      next(new AppError(403, 'SESSION_REVOKED', 'This session is no longer valid.'));
      return;
    }
    await saveAuthSession({
      ...session,
      lastUsedAt: nowIso(),
      lastSeenIp: requestIp(req),
      userAgent: userAgent(req) ?? session.userAgent,
    });
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

const refreshSchema = z.object({
  refreshToken: z.string().min(32).max(512),
});

const auditQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
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
  app.use((req, res: express.Response<any, AppLocals>, next) => {
    const observedRequest = beginObservedRequest();
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cache-Control', 'no-store');
    res.locals.requestId = randomUUID();
    res.on('finish', () => {
      observedRequest.finish({ isError: res.statusCode >= 500 });
      writeStructuredLog({
        level: res.statusCode >= 500 ? 'error' : 'info',
        message: 'API request completed',
        requestId: res.locals.requestId,
        context: res.locals.context,
        details: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          ipAddress: requestIp(req),
        },
      });
    });
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
        await writeAuditLog({
          workspaceId: parsed.data.workspaceId,
          actorType: 'anonymous',
          actorEmail: parsed.data.email,
          action: 'auth.login',
          targetType: 'session',
          outcome: 'failure',
          ipAddress: requestIp(req),
          userAgent: userAgent(req),
          requestId: res.locals.requestId,
          details: {
            reason: 'invalid_credentials',
          },
        });
        next(new AppError(401, 'INVALID_CREDENTIALS', 'Invalid login credentials.'));
        return;
      }

      const context = await buildRequestContext(parsed.data.workspaceId, user.id);
      if (!context) {
        await writeAuditLog({
          workspaceId: parsed.data.workspaceId,
          actorType: 'user',
          actorUserId: user.id,
          actorEmail: user.email,
          action: 'auth.login',
          targetType: 'session',
          outcome: 'failure',
          ipAddress: requestIp(req),
          userAgent: userAgent(req),
          requestId: res.locals.requestId,
          details: {
            reason: 'workspace_membership_missing',
          },
        });
        next(new AppError(401, 'INVALID_CREDENTIALS', 'Invalid login credentials.'));
        return;
      }

      const tokens = await issueSessionTokens({
        userId: user.id,
        workspaceId: parsed.data.workspaceId,
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        revokedReasonForOthers: 'Superseded by a newer login session.',
      });
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'auth.login',
        targetType: 'session',
        targetId: tokens.session.id,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
      });
      res.json({
        success: true,
        data: {
          token: tokens.accessToken,
          expiresAt: tokens.accessTokenExpiresAt,
          refreshToken: tokens.refreshToken,
          refreshTokenExpiresAt: tokens.session.expiresAt,
          sessionId: tokens.session.id,
          session: context,
        },
      });
    } catch (error) {
      next(error);
    }
  });


  app.post('/api/auth/refresh', async (req, res, next) => {
    try {
      const parsed = refreshSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(422).json({ success: false, error: parsed.error.flatten() });
        return;
      }

      const existingSession = await getAuthSessionByRefreshTokenHash(
        hashRefreshToken(parsed.data.refreshToken),
      );
      if (!existingSession || existingSession.revokedAt) {
        recordRefreshResult(false);
        await writeAuditLog({
          actorType: 'anonymous',
          action: 'auth.refresh',
          targetType: 'session',
          outcome: 'failure',
          ipAddress: requestIp(req),
          userAgent: userAgent(req),
          requestId: res.locals.requestId,
          details: {
            reason: 'session_not_found_or_revoked',
          },
        });
        next(new AppError(401, 'INVALID_REFRESH_TOKEN', 'The refresh token is invalid.'));
        return;
      }

      if (new Date(existingSession.expiresAt).getTime() <= Date.now()) {
        await revokeAuthSession(existingSession.id, {
          revokedAt: nowIso(),
          reason: 'Refresh token expired.',
        });
        recordRefreshResult(false);
        next(new AppError(401, 'INVALID_REFRESH_TOKEN', 'The refresh token has expired.'));
        return;
      }

      const context = await buildRequestContext(existingSession.workspaceId, existingSession.userId);
      if (!context) {
        await revokeAuthSession(existingSession.id, {
          revokedAt: nowIso(),
          reason: 'Workspace membership missing during refresh.',
        });
        recordRefreshResult(false);
        next(new AppError(401, 'INVALID_REFRESH_TOKEN', 'The refresh token is invalid.'));
        return;
      }

      const rotated = await issueSessionTokens({
        userId: existingSession.userId,
        workspaceId: existingSession.workspaceId,
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
      });
      await revokeAuthSession(existingSession.id, {
        revokedAt: nowIso(),
        reason: 'Refresh token rotated.',
        replacedBySessionId: rotated.session.id,
      });
      recordRefreshResult(true);
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'auth.refresh',
        targetType: 'session',
        targetId: rotated.session.id,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
        details: {
          previousSessionId: existingSession.id,
        },
      });

      res.json({
        success: true,
        data: {
          token: rotated.accessToken,
          expiresAt: rotated.accessTokenExpiresAt,
          refreshToken: rotated.refreshToken,
          refreshTokenExpiresAt: rotated.session.expiresAt,
          sessionId: rotated.session.id,
          session: context,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/auth/logout', requireAuthenticatedSession, async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const token = readBearerToken(req);
      if (!token) {
        next(new AppError(401, 'AUTH_REQUIRED', 'A valid login session is required.'));
        return;
      }
      const payload = verifyAuthToken(token);
      await revokeAuthSession(payload.sid, {
        revokedAt: nowIso(),
        reason: 'User logout.',
      });
      const context = requestContext(res);
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'auth.logout',
        targetType: 'session',
        targetId: payload.sid,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
      });
      res.json({ success: true, data: { loggedOut: true } });
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
  app.use('/api/admin', requireAuthenticatedSession, requireRole('admin'));

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
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'site.create',
        targetType: 'site',
        targetId: site.id,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
        details: {
          provider: site.provider,
          targetCountries: site.targetCountries,
        },
      });
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
      const context = requestContext(res);
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'site.update',
        targetType: 'site',
        targetId: site.id,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
      });
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
      const context = requestContext(res);
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'site.analysis.run',
        targetType: 'run',
        targetId: result.id,
        outcome: result.status === 'completed' ? 'success' : 'failure',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
        details: {
          siteId: result.siteId,
          runType: result.type,
        },
      });
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
      const context = requestContext(res);
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'site.optimization.run',
        targetType: 'run',
        targetId: result.id,
        outcome: result.status === 'completed' ? 'success' : 'failure',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
        details: {
          siteId: result.siteId,
          runType: result.type,
        },
      });
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
      const context = requestContext(res);
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'site.full_cycle.run',
        targetType: 'run',
        targetId: result.id,
        outcome: result.status === 'completed' ? 'success' : 'failure',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
        details: {
          siteId: result.siteId,
          runType: result.type,
        },
      });
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

  app.get('/api/admin/audit-logs', async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const parsed = auditQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(422).json({ success: false, error: parsed.error.flatten() });
        return;
      }
      const context = requestContext(res);
      const entries = await listAuditLogs(context.workspaceId, parsed.data.limit);
      res.json({ success: true, data: entries });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/admin/metrics', async (_req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      res.json({
        success: true,
        data: {
          ...getMetricsSnapshot(),
          activeWorkspaceSessions: await countActiveAuthSessions(context.workspaceId),
        },
      });
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
