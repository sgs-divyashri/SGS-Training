import type { ServerRoute } from "@hapi/hapi";
import { createTaskHandler } from "./createTask";
import { getTaskHandler } from "./getAllTasks";
import { getSpecificTaskHandler } from "./getSpecificTask";
import { getSpecificUserTaskHandler } from "./getSpecificUserTasks";
import { fullUpdateTaskHandler } from "./f_updateTask";
import { toggleTaskHandler } from "./toggleTask";
import { partialUpdateTaskHandler } from "./p_updateTask";


export const allowedStatuses: string[] = ["To-Do", "In Progress", "Review", "Completed"];

export const taskRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/tasks',
        handler: createTaskHandler,
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
        path: '/tasks/me',
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
        method: 'PATCH',
        path: '/tasks/toggle/{taskId}',
        handler: toggleTaskHandler,
    }
]