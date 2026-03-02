export interface RefreshTokenPayload {
  token: string;
  userId: number;
  revokedAt: Date | null;
  expiresAt?: Date;
}