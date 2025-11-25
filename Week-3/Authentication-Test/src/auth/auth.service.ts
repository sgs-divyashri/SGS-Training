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
        ...payload,  // copies all properties from the payload object into this new object.
        aud: 'urn:audience:test', // audience
        iss: 'urn:issuer:test', // issuer
      },
      {
        key: JWT_SECRET,  // sign it 
        algorithm: 'HS256',  // hashing alg
      },
      {
        ttlSec: 7 * 24 * 60 * 60, // time-to-live - expire in 7 days
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

export const hashPassword = AuthService.hashPassword;
export const verifyPassword = AuthService.verifyPassword;