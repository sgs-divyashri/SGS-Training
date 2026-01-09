import type { ServerRoute } from "@hapi/hapi";
import { registerUserHandler } from "./registerUser";
import { checkEmail } from "./checkEmail";
import { loginUserHandler } from "./userLogin";

export const userRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/users/register',
        handler: registerUserHandler,
        options: {
            auth: false,
        },
    },

    {
        method: 'POST',
        path: '/users/check-email',
        handler: checkEmail,
        options: {
            auth: false
        }
    },

    {
        method: 'POST',
        path: '/users/login',
        handler: loginUserHandler,
        options: {
            auth: false,
        },
    }
]