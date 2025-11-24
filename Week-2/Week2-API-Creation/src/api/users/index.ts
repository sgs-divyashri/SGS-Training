import type { ServerRoute } from "@hapi/hapi";
import { createUserHandler } from "./createUser";
import { getUserHandler } from "./getAllUsers";
import { getSpecificUserHandler } from "./getSpecificUser";
import { fullUpdateUserHandler } from "./f_updateUser";
import { partialUpdateUserHandler } from "./p_updateUser";
import { softDeleteUserHandler } from "./softDeleteUser";

export const userRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/users',
        handler: createUserHandler
    },

    {
        method: 'GET',
        path: '/users',
        handler: getUserHandler
    },

    {
        method: 'GET',
        path: '/users/{id}',
        handler: getSpecificUserHandler
    },

    {
        method: "PUT",
        path: "/users/f_update/{id}",
        handler: fullUpdateUserHandler
    },
    
    {
        method: "PATCH",
        path: "/users/p_update/{id}",
        handler: partialUpdateUserHandler  
    },

    {
        method: 'DELETE',
        path: '/users/{id}',
        handler: softDeleteUserHandler
    }
]