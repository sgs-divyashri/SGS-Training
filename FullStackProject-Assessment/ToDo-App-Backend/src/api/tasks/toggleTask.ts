import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";

export const toggleTaskHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
        const id = request.params.taskId;

        if (!id) {
            return h.response({ error: 'Invalid user ID' }).code(400);
        }

        const task = await taskServices.toggleTask(id);
        if (task === null) {
            return h.response({ error: 'Task not found' }).code(404);
        }

        const isActive = Boolean(task.isActive);
        return h.response({ message: `Task ${isActive ? 'opened' : 'closed'} successfully`, task }).code(200);

    } catch (err: any) {
        console.error(err);
        return h.response({ error: err.message }).code(400);
    }
}