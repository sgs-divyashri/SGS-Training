import { Claims } from "../types/tokenClaimsType";

export const isTokenExpired = (c: Claims | null): boolean => {
  if (!c?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return c.exp <= now;
}