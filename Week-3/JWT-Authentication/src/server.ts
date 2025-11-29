'use strict';
import apiRoutes from "./api/index"
import Jwt from '@hapi/jwt';
import Hapi from '@hapi/hapi'
import { configureAuthStrategy } from "./auth/auth.strategy";
import { sequelize } from "./sequelize.ts/sequelize";
import { User } from "./api/users/userTableDefinition";
import { Task } from "./api/tasks/taskTableDefinition";

const init = async () => {

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    
    User.hasMany(Task, {
        foreignKey: 'createdBy', // Task table column
        sourceKey: 'userId'
    });

    Task.belongsTo(User, {
        foreignKey: 'createdBy', // Task table column
        targetKey: 'userId'
    });

    await sequelize.sync({ alter: true });

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