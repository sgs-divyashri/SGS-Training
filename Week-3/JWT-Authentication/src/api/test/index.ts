import type { ServerRoute } from "@hapi/hapi";
import { insertDataHandler } from "./insertData";
import { getAllDataHandler } from "./getAllData";
import { fullUpdateDataHandler } from "./fulUpdateData";
import { getSpecificDataHandler } from "./getSpecificData";

export const testRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/test',
        handler: insertDataHandler,
        options: {
            auth: false,
        },
    },
    
    {
        method: 'GET',
        path: '/test',
        handler: getAllDataHandler,
        options: {
            auth: false,
        },
    },

    {
        method: 'GET',
        path: '/test/{id}',
        handler: getSpecificDataHandler,
        options: {
            auth: false,
        },
    },

    {
        method: 'PUT',
        path: '/test/{id}',
        handler: fullUpdateDataHandler,
        options: {
            auth: false,
        },
    },

    {
        method: 'DELETE',
        path: '/test/{id}',
        handler: fullUpdateDataHandler,
        options: {
            auth: false,
        },
    }
]