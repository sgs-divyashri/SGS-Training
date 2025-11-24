import { Server } from '@hapi/hapi';
import { JWT_SECRET } from '../config/constants';

export const configureAuthStrategy = (server: Server) => {
    // REMOVE the server.register(Jwt) line from here
    // Only configure the strategy
    
    server.auth.strategy('jwt', 'jwt', {
        keys: JWT_SECRET,
        verify: {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 hours
            timeSkewSec: 15,
        },
        validate: (artifacts: any, request: any, h: any) => {
            return {
                isValid: true,
                credentials: {
                    userId: artifacts.decoded.payload.userId,
                    email: artifacts.decoded.payload.email,
                },
            };
        },
    });

    server.auth.default('jwt');
};