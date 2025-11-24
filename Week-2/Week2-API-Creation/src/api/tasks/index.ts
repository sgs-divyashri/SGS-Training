import type { ServerRoute } from "@hapi/hapi";
import { createTaskHandler } from "./createTask";  
import { getTaskHandler } from "./getAllTasks";
import { getSpecificTaskHandler } from "./getSpecificTask";
import { getSpecificUserTaskHandler } from "./getSpecificUserTasks";
import { fullUpdateTaskHandler } from "./f_updateTask";
import { partialUpdateTaskHandler } from "./p_updateTask";
import { softDeleteTaskHandler } from "./softDeleteTask";


export const allowedStatuses: string[] = ["To-Do", "In Progress", "Review", "Completed"];

export const taskRoutes: ServerRoute[] = [

    {
        method: 'POST',
        path: '/tasks',
        handler: createTaskHandler
    },
    {
        method: 'GET',
        path: '/tasks',
        handler: getTaskHandler
    },

    {
        method: 'GET',
        path: '/tasks/{id}',
        handler: getSpecificTaskHandler
    },

    {
        method: 'GET',
        path: '/tasks/user/{id}',
        handler: getSpecificUserTaskHandler
    },
    

    {
        method: "PUT",
        path: "/tasks/f_update/{id}",
        handler: fullUpdateTaskHandler
    },

    {
        method: "PATCH",
        path: "/tasks/p_update/{id}",
        handler: partialUpdateTaskHandler
    },

    {
        method: 'DELETE',
        path: '/tasks/{id}',
        handler: softDeleteTaskHandler
    }
]