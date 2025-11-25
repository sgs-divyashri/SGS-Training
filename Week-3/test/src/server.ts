import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import { authRoutes } from './routes/auth.routes';
import { configureAuthStrategy } from './auth/auth.strategy';

const init = async () => {
    try {
        const server = Hapi.server({
            port: 3000,
            host: 'localhost',
        });

        // Register JWT plugin
        await server.register(Jwt);

        // Configure JWT auth strategy
        configureAuthStrategy(server);

        // Register routes
        server.route(authRoutes);

        // simple test route
        server.route({
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return { message: 'Server is running!' };
            },
            options: {
                auth: false,
            },
        });

        // Start server
        await server.start();
        console.log('Server running on %s', server.info.uri);

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err) => {
    console.log('Unhandled rejection:', err);
    process.exit(1);
});

init();