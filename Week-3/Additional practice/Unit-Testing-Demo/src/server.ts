'use strict';
import apiRoutes from "./api/index"
import Jwt from '@hapi/jwt';
import Hapi, { Server } from '@hapi/hapi'
import { configureAuthStrategy } from "./auth/auth.strategy";
import { sequelize } from "./sequelize/sequelize";
import { initModels } from "./model";

export const init = async () => {
    let server: Server
    console.log('Init function called...')
    server = await createServer()
    server.start();
    console.log('Server running on %s', server.info.uri);
    
};

process.on('unhandledRejection', (err: any) => {
    console.log(err);
    process.exit(1);
});

const createServer = async (): Promise<Server> => {
    console.log('create server function called...')
    let server: Server;
    server = Hapi.server({ port: 3000, host: 'localhost' });
    // Initialize models and associations
    initModels(sequelize);

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    await sequelize.sync({ alter: true });

    // To Register JWT plugin
    await server.register(Jwt); // Jwt - plugin object, functionality for JWT authentication.

    // Configure JWT auth strategy
    configureAuthStrategy(server);

    server.route(apiRoutes)

    return server

}



export const init_test = async (): Promise<Server> => {
    const s = await createServer();
    await s.initialize();        // initialize without listening on a port (great for tests)
    return s;                    // return server
}; 


init();