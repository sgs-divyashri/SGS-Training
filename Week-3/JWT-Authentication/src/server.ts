'use strict';
import apiRoutes from "./api/index"
import Jwt from '@hapi/jwt';
import Hapi from '@hapi/hapi'
import { configureAuthStrategy } from "./auth/auth.strategy";

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });

    // Register JWT plugin
    await server.register(Jwt);
    
    // Configure JWT auth strategy
    configureAuthStrategy(server);

    server.route(apiRoutes)

    server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err: any) => {
    console.log(err);
    process.exit(1);
});

init();