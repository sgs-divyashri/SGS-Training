import bcrypt from 'bcrypt';
import Jwt from '@hapi/jwt';
import { JWT_SECRET, BCRYPT_SALT_ROUNDS } from '../config/constants';

export interface JWTPayload {
  userId: number;
  email: string;
}

export class AuthService {
  // Hash password (synchronous)
  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
  }

  // Verify password (synchronous)
  static verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  // Generate JWT token
  static generateToken(payload: JWTPayload): string {
    return Jwt.token.generate(
      {
        ...payload,
        aud: 'urn:audience:test',
        iss: 'urn:issuer:test',
      },
      {
        key: JWT_SECRET,
        algorithm: 'HS256',
      },
      {
        ttlSec: 7 * 24 * 60 * 60, // 7 days
      }
    );
  }

  // Verify JWT token
  static verifyToken(token: string): JWTPayload {
    const artifacts = Jwt.token.decode(token);
    Jwt.token.verify(artifacts, JWT_SECRET);
    return artifacts.decoded.payload as JWTPayload;
  }
}

// Export functions for easier imports
export const hashPassword = AuthService.hashPassword;
export const verifyPassword = AuthService.verifyPassword;