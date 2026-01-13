
import Jwt from '@hapi/jwt';
import { JWT_SECRET } from '../config/constants';

export interface JWTPayload {
  userId: number;
  email: string;
  purpose: "auth" | "password_reset"
}

type GenerateOptions = {
  /** e.g. 900 (seconds) or '15m' | '2h' | '7d' */
  expiresIn?: number | string;
  /** override issued-at (seconds) if needed */
  iat?: number;
};

/** Parse '15m', '2h', '7d' etc. into seconds. Accepts value first, fallback second. */
function toSeconds(value: number | string, fallbackSec: number) {
  if (value == null) return fallbackSec;
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const match = /^(\d+)\s*([smhd])$/.exec(String(value).trim());
  if (!match) return fallbackSec;

  const n = parseInt(match[1]!, 10);
  const unit = match[2]!;
  const mul = unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3600 : 86400;
  return n * mul;
}

// Generate JWT token using @hapi/jwt; maps expiresIn -> ttlSec
export const generateToken = (payload: JWTPayload, options?: GenerateOptions): string => {
  const iat = options?.iat ?? Math.floor(Date.now() / 1000);
  const ttlSec = toSeconds(options?.expiresIn!, 7 * 24 * 60 * 60); // default 7 days

  const claims = {
    ...payload,
    aud: 'urn:audience:test',
    iss: 'urn:issuer:test',
    iat, // issued-at for clarity
  };

  return Jwt.token.generate(
    claims,
    { key: JWT_SECRET, algorithm: 'HS256' },
    { ttlSec }
  );
};
