'use strict';
import apiRoutes from "./api/index"
import Jwt from '@hapi/jwt';
import Hapi from '@hapi/hapi'
import { configureAuthStrategy } from "./auth/auth.strategy";
import { sequelize } from "./sequelize/sequelize";
import { initModels } from "./models";

const init = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }


    // Initialize models and associations
    initModels(sequelize);


    await sequelize.sync({ alter: true }); // create table schema and modify the structure like column, no data loss

    const server = Hapi.server({ // create a new server object from Hapi
        port: 3000, // server listens on port: 3000
        host: 'localhost', // accessibile from same machine - not from external networks
    });

    // To Register JWT plugin
    await server.register(Jwt); // Jwt - plugin object, functionality for JWT authentication.

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