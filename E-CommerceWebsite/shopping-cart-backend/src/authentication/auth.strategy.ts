import { Server } from '@hapi/hapi';
import { JWT_SECRET } from '../config/constants';

export const configureAuthStrategy = (server: Server) => {   // server instance as parameter
    // configure the strategy
    server.auth.strategy('jwt', 'jwt', {
        keys: JWT_SECRET,
        verify: {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: false, // plugin userID - check from userID from payload
            nbf: true, // not before - check whether current time is earlier than nbf, token invalid
            exp: true, // if current time is after exp → token invalid (token expired).
            maxAgeSec: 14400, // 4 hours - the token must not be older than 14,400 seconds (4 hours) from when it was issued.
            timeSkewSec: 15,
        },
        validate: (artifacts: any, request: any, h: any) => { // artifacts - the object the plugin passes containing decoded token data and other info.
            return {
                isValid: true, // tells Hapi the token is acceptable for this request. If false, request is unauthorized.
                credentials: { // an object you create containing information about the authenticated user.
                    userId: artifacts.decoded.payload.userId,
                    email: artifacts.decoded.payload.email,
                    purpose: artifacts.decoded.payload.purpose,  
                },
            };
        },
    });

    server.auth.default('jwt');
};