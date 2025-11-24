'use strict';
import apiRoutes from "./api/index" 
import Hapi from '@hapi/hapi'

const init = () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });

    server.route(apiRoutes)

    server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err: any) => {
    console.log(err);
    process.exit(1);
});

init();