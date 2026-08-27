import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import {
  createAuthToken,
  createRefreshToken,
  createOneTimeToken,
  createTotpOtpAuthUrl,
  createTotpSecret,
  hashPassword,
  hashOneTimeToken,
  hashRefreshToken,
  verifyTotpCode,
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
  deleteMembership,
  getAuthSession,
  getAuthSessionByRefreshTokenHash,
  getMembership,
  getPasswordResetTokenByHash,
  getUser,
  getUserByEmail,
  listAppliedMigrations,
  listAuthSessions,
  listMemberships,
  listRunQueueJobs,
  listWorkspaces,
  listAuditLogs,
  listUsers,
  revokeAuthSession,
  revokeOutstandingPasswordResetTokens,
  revokeUserWorkspaceSessions,
  saveAuthSession,
  saveMembership,
  savePasswordResetToken,
  saveUser,
  seedAccessControlIfEmpty,
  seedDemoDataIfEmpty,
} from './store.js';
import {
  createSite,
  enqueueRun,
  getSiteWithRuns,
  listSitesWithRuns,
  processRunQueue,
  runDueAutomations,
  updateSite,
} from './service.js';
import type {
  AuthSession,
  CountryCode,
  CreateSiteInput,
  PasswordResetToken,
  Permission,
  Provider,
  RequestContext,
  UpdateSiteInput,
  UserAccount,
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

function requirePermissions(...requiredPermissions: Permission[]) {
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
    const missingPermission = requiredPermissions.find(
      (permission) => !context.permissions.includes(permission),
    );
    if (missingPermission) {
      next(
        new AppError(
          403,
          'INSUFFICIENT_PERMISSION',
          `This operation requires the ${missingPermission} permission in the selected workspace.`,
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

function readUserId(req: express.Request) {
  const userId = req.params.userId;
  if (typeof userId !== 'string' || userId.length === 0) {
    throw new AppError(400, 'USER_ID_REQUIRED', 'A valid user id is required.');
  }
  return userId;
}

function readSessionId(req: express.Request) {
  const sessionId = req.params.sessionId;
  if (typeof sessionId !== 'string' || sessionId.length === 0) {
    throw new AppError(400, 'SESSION_ID_REQUIRED', 'A valid session id is required.');
  }
  return sessionId;
}

async function buildWorkspaceUserDirectory(workspaceId: string) {
  type WorkspaceDirectoryUser = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    role: UserRole;
    membershipCreatedAt: string;
    activeSessionCount: number;
    mfaEnabled: boolean;
  };

  const [memberships, users, sessions] = await Promise.all([
    listMemberships(workspaceId),
    listUsers(),
    listAuthSessions(workspaceId),
  ]);
  const userMap = new Map(users.map((user) => [user.id, user]));
  const activeSessionCounts = new Map<string, number>();

  for (const session of sessions) {
    if (!session.revokedAt && new Date(session.expiresAt).getTime() > Date.now()) {
      activeSessionCounts.set(session.userId, (activeSessionCounts.get(session.userId) ?? 0) + 1);
    }
  }

  return memberships
    .map((membership) => {
      const user = userMap.get(membership.userId);
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        role: membership.role,
        membershipCreatedAt: membership.createdAt,
        activeSessionCount: activeSessionCounts.get(user.id) ?? 0,
        mfaEnabled: Boolean(user.mfaEnabled),
      } satisfies WorkspaceDirectoryUser;
    })
    .filter((entry): entry is WorkspaceDirectoryUser => Boolean(entry));
}

function passwordResetExpiryIso() {
  return new Date(Date.now() + 60 * 60 * 1000).toISOString();
}

function serializeSession(session: AuthSession) {
  const { refreshTokenHash: _refreshTokenHash, ...safeSession } = session;
  return safeSession;
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
  mfaCode: z.string().trim().regex(/^\d{6}$/).optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(32).max(512),
});

const auditQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

const createUserSchema = z.object({
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
  name: z.string().trim().min(2).max(120),
  role: z.enum(['viewer', 'editor', 'admin']),
  password: z.string().min(8).max(128),
});

const updateUserSchema = z.object({
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()).optional(),
  name: z.string().trim().min(2).max(120).optional(),
  role: z.enum(['viewer', 'editor', 'admin']).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(128),
  newPassword: z.string().min(8).max(128),
});

const confirmPasswordResetSchema = z.object({
  token: z.string().min(32).max(512),
  newPassword: z.string().min(8).max(128),
});

const verifyMfaSchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/),
});

const disableMfaSchema = z.object({
  password: z.string().min(8).max(128),
  code: z.string().trim().regex(/^\d{6}$/),
});

function buildMfaState(user: UserAccount) {
  return {
    enabled: Boolean(user.mfaEnabled && user.totpSecret),
    pending: Boolean(user.pendingTotpSecret),
  };
}

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
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
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

      if (user.mfaEnabled && user.totpSecret) {
        if (!parsed.data.mfaCode || !verifyTotpCode({ secret: user.totpSecret, code: parsed.data.mfaCode })) {
          await writeAuditLog({
            workspaceId: context.workspaceId,
            actorType: 'user',
            actorUserId: context.userId,
            actorEmail: context.email,
            action: 'auth.login.mfa',
            targetType: 'session',
            outcome: 'failure',
            ipAddress: requestIp(req),
            userAgent: userAgent(req),
            requestId: res.locals.requestId,
            details: {
              reason: parsed.data.mfaCode ? 'invalid_mfa_code' : 'mfa_code_missing',
            },
          });
          next(new AppError(401, 'MFA_REQUIRED', 'A valid multi-factor authentication code is required.'));
          return;
        }
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
          mfaRequired: false,
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

  app.post('/api/auth/password-reset/confirm', async (req, res, next) => {
    try {
      const parsed = confirmPasswordResetSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(422).json({ success: false, error: parsed.error.flatten() });
        return;
      }

      const resetToken = await getPasswordResetTokenByHash(hashOneTimeToken(parsed.data.token));
      if (
        !resetToken ||
        resetToken.revokedAt ||
        resetToken.usedAt ||
        new Date(resetToken.expiresAt).getTime() <= Date.now()
      ) {
        next(new AppError(401, 'INVALID_RESET_TOKEN', 'The password reset token is invalid or expired.'));
        return;
      }

      const user = await getUser(resetToken.userId);
      if (!user) {
        next(new AppError(404, 'USER_NOT_FOUND', 'The selected user could not be found.'));
        return;
      }

      const timestamp = nowIso();
      await saveUser({
        ...user,
        passwordHash: hashPassword(parsed.data.newPassword),
        passwordUpdatedAt: timestamp,
      });
      await savePasswordResetToken({
        ...resetToken,
        usedAt: timestamp,
      });
      const activeSessions = await listAuthSessions(undefined, user.id);
      await Promise.all(
        activeSessions.map((session) =>
          revokeAuthSession(session.id, {
            revokedAt: timestamp,
            reason: 'Password reset completed.',
          }),
        ),
      );
      await revokeOutstandingPasswordResetTokens(user.id, timestamp);
      await writeAuditLog({
        actorType: 'anonymous',
        actorUserId: user.id,
        actorEmail: user.email,
        action: 'auth.password_reset.confirm',
        targetType: 'user',
        targetId: user.id,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
      });
      res.json({ success: true, data: { reset: true } });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/session', requireAuthenticatedSession, (_req, res) => {
    const context = requestContext(res);
    res.json({
      success: true,
      data: context,
    });
  });

  app.use('/api/account', requireAuthenticatedSession);
  app.use('/api/sites', requireAuthenticatedSession);
  app.use('/api/scheduler', requireAuthenticatedSession);
  app.use('/api/admin', requireAuthenticatedSession);

  app.get('/api/account/sessions', async (_req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const sessions = await listAuthSessions(context.workspaceId, context.userId);
      res.json({ success: true, data: sessions.map(serializeSession) });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/account/mfa', async (_req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const user = await getUser(context.userId);
      if (!user) {
        res.status(404).json({ success: false, error: { message: 'User not found' } });
        return;
      }
      res.json({
        success: true,
        data: buildMfaState(user),
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/account/mfa/setup', async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const user = await getUser(context.userId);
      if (!user) {
        res.status(404).json({ success: false, error: { message: 'User not found' } });
        return;
      }
      const pendingSecret = createTotpSecret();
      await saveUser({
        ...user,
        pendingTotpSecret: pendingSecret,
      });
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'account.mfa.setup',
        targetType: 'user',
        targetId: context.userId,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
      });
      res.json({
        success: true,
        data: {
          ...buildMfaState({ ...user, pendingTotpSecret: pendingSecret }),
          secret: pendingSecret,
          otpAuthUrl: createTotpOtpAuthUrl({
            secret: pendingSecret,
            email: user.email,
            workspaceId: context.workspaceId,
          }),
        },
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/account/mfa/enable', async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const parsed = verifyMfaSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(422).json({ success: false, error: parsed.error.flatten() });
        return;
      }
      const context = requestContext(res);
      const user = await getUser(context.userId);
      if (!user?.pendingTotpSecret) {
        next(new AppError(400, 'MFA_SETUP_REQUIRED', 'Start MFA setup before verifying a code.'));
        return;
      }
      if (!verifyTotpCode({ secret: user.pendingTotpSecret, code: parsed.data.code })) {
        next(new AppError(401, 'INVALID_MFA_CODE', 'The provided MFA code is invalid.'));
        return;
      }
      await saveUser({
        ...user,
        mfaEnabled: true,
        totpSecret: user.pendingTotpSecret,
        pendingTotpSecret: undefined,
      });
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'account.mfa.enable',
        targetType: 'user',
        targetId: context.userId,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
      });
      res.json({
        success: true,
        data: {
          enabled: true,
          pending: false,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/account/mfa/disable', async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const parsed = disableMfaSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(422).json({ success: false, error: parsed.error.flatten() });
        return;
      }
      const context = requestContext(res);
      const user = await getUser(context.userId);
      if (!user?.passwordHash || !verifyPassword(parsed.data.password, user.passwordHash)) {
        next(new AppError(401, 'INVALID_CREDENTIALS', 'The current password is incorrect.'));
        return;
      }
      if (!user.totpSecret || !user.mfaEnabled) {
        next(new AppError(400, 'MFA_NOT_ENABLED', 'Multi-factor authentication is not enabled.'));
        return;
      }
      if (!verifyTotpCode({ secret: user.totpSecret, code: parsed.data.code })) {
        next(new AppError(401, 'INVALID_MFA_CODE', 'The provided MFA code is invalid.'));
        return;
      }
      await saveUser({
        ...user,
        mfaEnabled: false,
        totpSecret: undefined,
        pendingTotpSecret: undefined,
      });
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'account.mfa.disable',
        targetType: 'user',
        targetId: context.userId,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
      });
      res.json({
        success: true,
        data: {
          enabled: false,
          pending: false,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/account/sessions/:sessionId/revoke', async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const session = await getAuthSession(readSessionId(req));
      if (!session || session.workspaceId !== context.workspaceId || session.userId !== context.userId) {
        res.status(404).json({ success: false, error: { message: 'Session not found' } });
        return;
      }
      await revokeAuthSession(session.id, {
        revokedAt: nowIso(),
        reason: 'User revoked own session.',
      });
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'account.session.revoke',
        targetType: 'session',
        targetId: session.id,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
      });
      res.json({ success: true, data: { revoked: true } });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/account/password', async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(422).json({ success: false, error: parsed.error.flatten() });
        return;
      }
      const context = requestContext(res);
      const user = await getUser(context.userId);
      if (!user?.passwordHash || !verifyPassword(parsed.data.currentPassword, user.passwordHash)) {
        next(new AppError(401, 'INVALID_CREDENTIALS', 'The current password is incorrect.'));
        return;
      }
      const timestamp = nowIso();
      await saveUser({
        ...user,
        passwordHash: hashPassword(parsed.data.newPassword),
        passwordUpdatedAt: timestamp,
      });
      const activeSessions = await listAuthSessions(undefined, context.userId);
      await Promise.all(
        activeSessions.map((session) =>
          revokeAuthSession(session.id, {
            revokedAt: timestamp,
            reason: 'Password changed by user.',
          }),
        ),
      );
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'account.password.change',
        targetType: 'user',
        targetId: context.userId,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
      });
      res.json({ success: true, data: { changed: true } });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/sites', async (_req, res: express.Response<any, AppLocals>, next) => {
    try {
      const sites = await listSitesWithRuns(requestContext(res).workspaceId);
      res.json({ success: true, data: sites });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/sites', requirePermissions('sites:write'), async (req, res: express.Response<any, AppLocals>, next) => {
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

  app.patch('/api/sites/:siteId', requirePermissions('sites:write'), async (req, res: express.Response<any, AppLocals>, next) => {
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

  app.post('/api/sites/:siteId/analyze', requirePermissions('runs:execute'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const result = await enqueueRun(context.workspaceId, readSiteId(req), 'analysis');
      if (!result) {
        res.status(404).json({ success: false, error: { message: 'Site not found' } });
        return;
      }
      void processRunQueue(context.workspaceId, 1);
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'site.analysis.run',
        targetType: 'run',
        targetId: result.run.id,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
        details: {
          siteId: result.run.siteId,
          runType: result.run.type,
          queueJobId: result.job.id,
        },
      });
      res.status(202).json({ success: true, data: result.run });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/sites/:siteId/optimize', requirePermissions('runs:execute'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const result = await enqueueRun(context.workspaceId, readSiteId(req), 'optimization');
      if (!result) {
        res.status(404).json({ success: false, error: { message: 'Site not found' } });
        return;
      }
      void processRunQueue(context.workspaceId, 1);
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'site.optimization.run',
        targetType: 'run',
        targetId: result.run.id,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
        details: {
          siteId: result.run.siteId,
          runType: result.run.type,
          queueJobId: result.job.id,
        },
      });
      res.status(202).json({ success: true, data: result.run });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/sites/:siteId/full-cycle', requirePermissions('runs:execute'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const result = await enqueueRun(context.workspaceId, readSiteId(req), 'full_cycle');
      if (!result) {
        res.status(404).json({ success: false, error: { message: 'Site not found' } });
        return;
      }
      void processRunQueue(context.workspaceId, 1);
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'site.full_cycle.run',
        targetType: 'run',
        targetId: result.run.id,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
        details: {
          siteId: result.run.siteId,
          runType: result.run.type,
          queueJobId: result.job.id,
        },
      });
      res.status(202).json({ success: true, data: result.run });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/scheduler/run-due', requirePermissions('scheduler:run'), async (_req, res: express.Response<any, AppLocals>, next) => {
    try {
      await runDueAutomations(requestContext(res).workspaceId);
      res.json({ success: true, data: { triggered: true } });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/admin/users', requirePermissions('admin:users:read'), async (_req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const users = await buildWorkspaceUserDirectory(context.workspaceId);
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/admin/users', requirePermissions('admin:users:write'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const parsed = createUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(422).json({ success: false, error: parsed.error.flatten() });
        return;
      }

      const existingUser = await getUserByEmail(parsed.data.email);
      if (existingUser) {
        next(new AppError(409, 'EMAIL_ALREADY_EXISTS', 'A user with this email already exists.'));
        return;
      }

      const context = requestContext(res);
      const timestamp = nowIso();
      const user: UserAccount = {
        id: randomUUID(),
        email: parsed.data.email,
        name: parsed.data.name,
        createdAt: timestamp,
        passwordHash: hashPassword(parsed.data.password),
        passwordUpdatedAt: timestamp,
      };
      await saveUser(user);
      await saveMembership({
        workspaceId: context.workspaceId,
        userId: user.id,
        role: parsed.data.role,
        createdAt: timestamp,
      });
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'admin.user.create',
        targetType: 'user',
        targetId: user.id,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
        details: {
          assignedRole: parsed.data.role,
        },
      });
      const users = await buildWorkspaceUserDirectory(context.workspaceId);
      const createdUser = users.find((entry) => entry.id === user.id);
      if (!createdUser) {
        next(new AppError(500, 'USER_DIRECTORY_SYNC_FAILED', 'The created user could not be loaded.'));
        return;
      }
      res.status(201).json({ success: true, data: createdUser });
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/admin/users/:userId', requirePermissions('admin:users:write'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const parsed = updateUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(422).json({ success: false, error: parsed.error.flatten() });
        return;
      }
      const context = requestContext(res);
      const userId = readUserId(req);
      const membership = await getMembership(context.workspaceId, userId);
      const user = await getUser(userId);
      if (!membership || !user) {
        res.status(404).json({ success: false, error: { message: 'User not found' } });
        return;
      }
      const updatedUser = await saveUser({
        ...user,
        email: parsed.data.email ?? user.email,
        name: parsed.data.name ?? user.name,
      });
      if (parsed.data.role) {
        await saveMembership({
          workspaceId: context.workspaceId,
          userId,
          role: parsed.data.role,
          createdAt: membership.createdAt,
        });
      }
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'admin.user.update',
        targetType: 'user',
        targetId: userId,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
      });
      const users = await buildWorkspaceUserDirectory(context.workspaceId);
      const entry = users.find((candidate) => candidate.id === updatedUser.id);
      if (!entry) {
        next(new AppError(500, 'USER_DIRECTORY_SYNC_FAILED', 'The updated user could not be loaded.'));
        return;
      }
      res.json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  });

  app.delete('/api/admin/users/:userId/membership', requirePermissions('admin:users:write'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const userId = readUserId(req);
      const removed = await deleteMembership(context.workspaceId, userId);
      if (!removed) {
        res.status(404).json({ success: false, error: { message: 'Membership not found' } });
        return;
      }
      await revokeUserWorkspaceSessions(context.workspaceId, userId, {
        revokedAt: nowIso(),
        reason: 'Workspace membership removed.',
      });
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'admin.membership.delete',
        targetType: 'user',
        targetId: userId,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
      });
      res.json({ success: true, data: { removed: true } });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/admin/sessions', requirePermissions('admin:sessions:read'), async (_req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const [sessions, users] = await Promise.all([
        listAuthSessions(context.workspaceId),
        buildWorkspaceUserDirectory(context.workspaceId),
      ]);
      const userMap = new Map(users.map((user) => [user.id, user] as const));
      res.json({
        success: true,
        data: sessions.map((session) => ({
          ...serializeSession(session),
          user: userMap.get(session.userId) ?? null,
        })),
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/admin/sessions/:sessionId/revoke', requirePermissions('admin:sessions:revoke'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const session = await getAuthSession(readSessionId(req));
      if (!session || session.workspaceId !== context.workspaceId) {
        res.status(404).json({ success: false, error: { message: 'Session not found' } });
        return;
      }
      await revokeAuthSession(session.id, {
        revokedAt: nowIso(),
        reason: 'Admin revoked session.',
      });
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'admin.session.revoke',
        targetType: 'session',
        targetId: session.id,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
        details: {
          revokedUserId: session.userId,
        },
      });
      res.json({ success: true, data: { revoked: true } });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/admin/users/:userId/password-reset', requirePermissions('admin:users:write'), async (req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const userId = readUserId(req);
      const membership = await getMembership(context.workspaceId, userId);
      const user = await getUser(userId);
      if (!membership || !user) {
        res.status(404).json({ success: false, error: { message: 'User not found' } });
        return;
      }
      const timestamp = nowIso();
      const resetTokenValue = createOneTimeToken();
      const resetToken: PasswordResetToken = {
        id: randomUUID(),
        userId,
        tokenHash: hashOneTimeToken(resetTokenValue),
        createdAt: timestamp,
        expiresAt: passwordResetExpiryIso(),
        createdByUserId: context.userId,
      };
      await revokeOutstandingPasswordResetTokens(userId, timestamp);
      await savePasswordResetToken(resetToken);
      await writeAuditLog({
        workspaceId: context.workspaceId,
        actorType: 'user',
        actorUserId: context.userId,
        actorEmail: context.email,
        action: 'admin.user.password_reset.request',
        targetType: 'user',
        targetId: userId,
        outcome: 'success',
        ipAddress: requestIp(req),
        userAgent: userAgent(req),
        requestId: res.locals.requestId,
      });
      res.json({
        success: true,
        data: {
          token: resetTokenValue,
          expiresAt: resetToken.expiresAt,
          userId,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/admin/audit-logs', requirePermissions('admin:audit:read'), async (req, res: express.Response<any, AppLocals>, next) => {
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

  app.get('/api/admin/metrics', requirePermissions('admin:metrics:read'), async (_req, res: express.Response<any, AppLocals>, next) => {
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

  app.get('/api/admin/run-queue', requirePermissions('admin:queue:read'), async (_req, res: express.Response<any, AppLocals>, next) => {
    try {
      const context = requestContext(res);
      const jobs = await listRunQueueJobs(context.workspaceId);
      res.json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/admin/migrations', requirePermissions('admin:migrations:read'), async (_req, res: express.Response<any, AppLocals>, next) => {
    try {
      const migrations = await listAppliedMigrations();
      res.json({ success: true, data: migrations });
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
      const sqliteConflict =
        !appError &&
        error instanceof Error &&
        /SQLITE_CONSTRAINT|UNIQUE constraint failed/i.test(error.message)
          ? new AppError(409, 'RESOURCE_CONFLICT', 'The requested resource already exists.')
          : null;
      const resolvedError = appError ?? sqliteConflict;
      const statusCode = resolvedError?.statusCode ?? 500;
      const code = resolvedError?.code ?? 'INTERNAL_SERVER_ERROR';
      if (!resolvedError) {
        writeStructuredLog({
          level: 'error',
          message: 'Unhandled API error',
          details: {
            error: error instanceof Error ? error.message : String(error),
          },
        });
      }
      res.status(statusCode).json({
        success: false,
        error: {
          code,
          message: resolvedError?.message ?? 'The server could not complete the request.',
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
