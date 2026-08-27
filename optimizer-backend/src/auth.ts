import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { config } from './config.js';

type TokenHeader = {
  alg: 'HS256';
  typ: 'JWT';
};

export type AuthTokenPayload = {
  sub: string;
  workspaceId: string;
  sid: string;
  iat: number;
  exp: number;
};

function base64UrlEncode(value: Buffer | string) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(unsignedToken: string) {
  return createHmac('sha256', config.AUTH_JWT_SECRET).update(unsignedToken).digest();
}

function encodeSegment(value: unknown) {
  return base64UrlEncode(JSON.stringify(value));
}

function normalizePassword(password: string) {
  return password.normalize('NFKC');
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('base64url');
  const derivedKey = scryptSync(normalizePassword(password), salt, 64).toString('base64url');
  return `scrypt$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, expectedHash] = storedHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !expectedHash) {
    return false;
  }

  const actualHash = scryptSync(normalizePassword(password), salt, 64).toString('base64url');
  const expectedBuffer = Buffer.from(expectedHash);
  const actualBuffer = Buffer.from(actualHash);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}

export function createAuthToken(input: { userId: string; workspaceId: string; sessionId: string }) {
  const issuedAtSeconds = Math.floor(Date.now() / 1000);
  const expiresAtSeconds = issuedAtSeconds + config.AUTH_TOKEN_TTL_MINUTES * 60;
  const header: TokenHeader = {
    alg: 'HS256',
    typ: 'JWT',
  };
  const payload: AuthTokenPayload = {
    sub: input.userId,
    workspaceId: input.workspaceId,
    sid: input.sessionId,
    iat: issuedAtSeconds,
    exp: expiresAtSeconds,
  };

  const unsignedToken = `${encodeSegment(header)}.${encodeSegment(payload)}`;
  const signature = base64UrlEncode(sign(unsignedToken));

  return {
    token: `${unsignedToken}.${signature}`,
    expiresAt: new Date(expiresAtSeconds * 1000).toISOString(),
  };
}

export function createRefreshToken() {
  return randomBytes(48).toString('base64url');
}

export function hashRefreshToken(refreshToken: string) {
  return createHmac('sha256', config.AUTH_JWT_SECRET).update(refreshToken).digest('base64url');
}

export function createOneTimeToken() {
  return randomBytes(32).toString('base64url');
}

export function hashOneTimeToken(token: string) {
  return createHmac('sha256', config.AUTH_JWT_SECRET).update(token).digest('base64url');
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    throw new Error('Malformed token.');
  }

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = sign(unsignedToken);
  const providedSignature = Buffer.from(encodedSignature, 'base64url');

  if (
    providedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(providedSignature, expectedSignature)
  ) {
    throw new Error('Invalid token signature.');
  }

  const header = JSON.parse(base64UrlDecode(encodedHeader)) as TokenHeader;
  if (header.alg !== 'HS256' || header.typ !== 'JWT') {
    throw new Error('Unsupported token format.');
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AuthTokenPayload;
  if (
    typeof payload.sub !== 'string' ||
    typeof payload.workspaceId !== 'string' ||
    typeof payload.sid !== 'string' ||
    typeof payload.iat !== 'number' ||
    typeof payload.exp !== 'number'
  ) {
    throw new Error('Invalid token payload.');
  }

  if (payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired.');
  }

  return payload;
}
