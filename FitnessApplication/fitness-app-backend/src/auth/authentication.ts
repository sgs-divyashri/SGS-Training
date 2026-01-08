import Jwt from '@hapi/jwt';
import { JWT_SECRET } from '../config/constants';

export interface JWTPayload {
  userId: number;
  email: string;
}

// Generate JWT token
export const generateToken = (payload: JWTPayload): string => {
    return Jwt.token.generate(
        {
            ...payload,  // copies all properties from the payload object (id, name) into this new object.
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
