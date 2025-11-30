import type { ServerRoute } from "@hapi/hapi";
import { createTaskHandler } from "./createTask";
import { getTaskHandler } from "./getAllTasks";
import { getSpecificTaskHandler } from "./getSpecificTask";
import { getSpecificUserTaskHandler } from "./getSpecificUserTasks";
import { fullUpdateTaskHandler } from "./f_updateTask";
// import { partialUpdateTaskHandler } from "./p_updateTask";
import { softDeleteTaskHandler } from "./softDeleteTask";


export const allowedStatuses: string[] = ["To-Do", "In Progress", "Review", "Completed"];

export const taskRoutes: ServerRoute[] = [

    {
        method: 'POST',
        path: '/tasks',
        handler: createTaskHandler,
        options: {
            auth: false  
        },
    },
    {
        method: 'GET',
        path: '/tasks',
        handler: getTaskHandler,
        options: {
            auth: false,
        },
    },

    {
        method: 'GET',
        path: '/tasks/{id}',
        handler: getSpecificTaskHandler,
        options: {
            auth: false,
        },
    },

    {
        method: 'GET',
        path: '/tasks/user/{id}',
        handler: getSpecificUserTaskHandler,
        options: {
            auth: false,
        },
    },

    {
        method: "PUT",
        path: "/tasks/f_update/{id}",
        handler: fullUpdateTaskHandler,
        options: {
            auth: false,
        },
    },

    // {
    //     method: "PATCH",
    //     path: "/tasks/p_update/{id}",
    //     handler: partialUpdateTaskHandler,
    //     options: {
    //         auth: false,
    //     },
    // },

    {
        method: 'DELETE',
        path: '/tasks/{id}',
        handler: softDeleteTaskHandler,
        options: {
            auth: false,
        },
    }
]