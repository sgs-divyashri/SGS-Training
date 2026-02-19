import type { ServerRoute } from "@hapi/hapi";
import { createTaskHandler } from "./createTasks";
import { statusUpdateHandler } from "./updateStatus";
import { getAllTasksHandler } from "./getAllTasks";
import { getSpecificUserTaskHandler } from "./getSpecificUserTasks";
import { editTaskHandler } from "./editTask";

export const taskRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/create-tasks',
        handler: createTaskHandler,
    },

    {
        method: "GET",
        path: "/tasks",
        handler: getAllTasksHandler
    },

    {
        method: 'GET',
        path: '/tasks/me',
        handler: getSpecificUserTaskHandler
    },

    {
        method: "PUT",
        path: "/status/update/{id}",
        handler: statusUpdateHandler
    },

    {
        method: "PATCH",
        path: "/tasks/edit/{id}",
        handler: editTaskHandler
    },
]