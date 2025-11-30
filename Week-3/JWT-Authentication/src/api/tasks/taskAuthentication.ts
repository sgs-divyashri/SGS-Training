import Jwt from '@hapi/jwt';
import { JWT_SECRET } from '../config/constants';
import { Task } from '../../services/taskServices';

// Generate JWT token
export const generateToken = (payload: Pick<Task, "id">): string => {
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
export const verifyToken = (token: string): Pick<Task, "id"> => {
    const artifacts = Jwt.token.decode(token);
    Jwt.token.verify(artifacts, JWT_SECRET);
    return artifacts.decoded.payload as Pick<Task, "id">;
}