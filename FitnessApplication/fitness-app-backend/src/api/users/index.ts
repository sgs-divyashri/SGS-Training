import type { ServerRoute } from "@hapi/hapi";
import { registerUserHandler } from "./registerUser";
import { checkEmail } from "./checkEmail";
import { loginUserHandler } from "./userLogin";
// import { getUserHandler } from "./getAllUsers";
// import { getSpecificUserHandler } from "./getSpecificUser";
// import { fullUpdateUserHandler } from "./f_updateUser";
// import { partialUpdateUserHandler } from "./p_updateUser";
// import { toggleUserHandler } from "./toggleUser";
// import { restoreUserHandler } from "./restoreSoftDeletedUser";

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
    },

    // {
    //     method: 'GET',
    //     path: '/users',
    //     handler: getUserHandler,
    // },

    // {
    //     method: 'GET',
    //     path: '/users/{id}',
    //     handler: getSpecificUserHandler
    // },

    // {
    //     method: "PUT",
    //     path: "/users/f_update/{id}",
    //     handler: fullUpdateUserHandler
    // },

    // {
    //     method: "PATCH",
    //     path: "/users/p_update/{id}",
    //     handler: partialUpdateUserHandler
    // },

    // // {
    // //     method: "PATCH",
    // //     path: "/users/restore/{userID}",
    // //     handler: restoreUserHandler
    // // },

    // {
    //     method: 'PATCH',
    //     path: '/users/toggle/{userID}',
    //     handler: toggleUserHandler,
    // }
]