import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";

export const softDeleteTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const id = request.params.id;
    const task = taskServices.softDeleteTask(id);

    if (task === null) {
        return h.response({ error: 'Task not found' }).code(404);
    }
    return h.response({ message: "User deleted successfully", task: task.id, active: task.isActive }).code(200);
}