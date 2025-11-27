'use strict';
import apiRoutes from "./api/index"
import Jwt from '@hapi/jwt';
import Hapi from '@hapi/hapi'
import { configureAuthStrategy } from "./auth/auth.strategy";
import { sequelize, Test } from "./api/test/testdb";

const init = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    await Test.sync();  // table creation

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