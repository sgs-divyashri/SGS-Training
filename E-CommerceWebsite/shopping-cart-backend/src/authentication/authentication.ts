import Jwt from "@hapi/jwt";
import { JWT_SECRET } from "../config/constants";
import { v4 as uuidv4 } from 'uuid';

export type TokenType = "access" | "refresh";

export interface JWTPayload {
  userId: number;
  email: string;
  purpose: "auth" | "password_reset";
  role: string;
  type: TokenType;
  jti?: string;
  aud: string;
  iss: string;
  iat: number;
  exp?: number;
}

type GenerateOptions = {
  expiresIn?: number | string;
  iat?: number;
  accessOnly?: boolean;
};

function toSeconds(value: number | string | undefined, fallbackSec: number) {
  if (value == null) return fallbackSec;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const s = String(value).trim();
  const match = /^(\d+)\s*([smhd])$/.exec(s);
  if (!match) return fallbackSec;
  const n = parseInt(match[1]!, 10);
  const unit = match[2]!;
  const mul =
    unit === "s" ? 1 : unit === "m" ? 60 : unit === "h" ? 3600 : 86400;
  return n * mul;
}

export const generateToken = (
  payload: Pick<JWTPayload, "userId" | "email" | "role" | "purpose">,
  options?: GenerateOptions,
) => {
  const iat = Math.floor(Date.now() / 1000);
  const aud = "urn:audience:test";
  const iss = "urn:issuer:test";
  const accessJti = uuidv4();
  const refreshJti = uuidv4();

  const accessPayload: JWTPayload = {
    ...payload,
    type: "access",
    aud,
    iss,
    iat,
    jti: accessJti,
  };

  const accessTtlSec = toSeconds(options?.expiresIn, 60); 

  const accessToken = Jwt.token.generate(
    accessPayload,
    { key: JWT_SECRET, algorithm: "HS256" },
    { ttlSec: accessTtlSec },
  );

  if (options?.accessOnly) {
    return { accessToken };
  }

  const refreshPayload: JWTPayload = {
    ...payload,
    type: "refresh",
    aud,
    iss,
    iat,
    jti: refreshJti,
  };

  const refreshToken = Jwt.token.generate(
    refreshPayload,
    { key: JWT_SECRET, algorithm: "HS256" },
    { ttlSec: 60 * 60 * 24 * 7 },
  );

  return {
    accessToken,
    refreshToken,
    accessJti,
    refreshJti,
  };
};
