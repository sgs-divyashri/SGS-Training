'use strict';
import apiRoutes from "./api/index"
import Jwt from '@hapi/jwt';
import Hapi, { Server } from '@hapi/hapi'
import { configureAuthStrategy } from "./auth/auth.strategy";
import { sequelize } from "./sequelize/sequelize";
import { initModels } from "./models";
import { isTypedArray } from "util/types";

const init = async () => {
    // Initialize models and associations
    let server: Server
    server = await create()
    await server.start()
    console.log('Server running on %s', server.info.uri);

};

process.on('unhandledRejection', (err: any) => {
    console.log(err);
    process.exit(1);
});


const create = async (): Promise<Server> => {
    initModels(sequelize);

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    await sequelize.sync();

const server = Hapi.server({ // create a new server object from Hapi
    port: 3000, // server listens on port: 3000
    host: 'localhost', // accessibile from same machine - not from external networks
});

// To Register JWT plugin
await server.register(Jwt); // Jwt - plugin object, functionality for JWT authentication.

// Configure JWT auth strategy
configureAuthStrategy(server);

server.route(apiRoutes)

return server
}

export const init_test = async () => {
    let s: Server = await create()
    await s.initialize()
    return s
}

init();
