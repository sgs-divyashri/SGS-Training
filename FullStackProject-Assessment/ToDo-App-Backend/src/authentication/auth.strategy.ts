import { Server } from '@hapi/hapi';

export const configureAuthStrategy = (server: Server) => {   // server instance as parameter
    // configure the strategy
    server.auth.strategy('jwt', 'jwt', {
        keys: process.env.JWT_SECRET,
        verify: {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: false, 
            nbf: true, 
            exp: true, 
            maxAgeSec: 14400, 
            timeSkewSec: 15,
        },
        validate: (artifacts: any, request: any, h: any) => { 
            return {
                isValid: true, 
                credentials: { 
                    userId: artifacts.decoded.payload.userId,
                    email: artifacts.decoded.payload.email,
                    role: artifacts.decoded.payload.role
                },
            };
        },
    });

    server.auth.default('jwt');
};