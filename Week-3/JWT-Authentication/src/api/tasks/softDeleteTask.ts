import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";
import { generateToken } from "./taskAuthentication";

export const softDeleteTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const id = request.params.id;
    const task = taskServices.softDeleteTask(id);

    if (task === null) {
        return h.response({ error: 'Task not found' }).code(404);
    }

    const token = generateToken({
        id: task.id!
    });
    return h.response({
        message: "Task deleted successfully", 
        token,
        task: task.id,
        active: task.isActive
    }).code(200);
}