import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";
import { Task, TaskPayload } from "../../models/taskTableDefinition";

export const createTaskHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const payload = request.payload as Pick<TaskPayload, "taskName" | "description" | "createdBy">;
    const { userId } = request.auth.credentials as { userId?: number }
    // Basic validation
    if (!Number.isFinite(userId) || userId! <= 0) {
        return h.response({ error: "Invalid authenticated user id" }).code(401);
    }

    if (!payload.taskName || !payload.description) {
        return h.response({
            error: 'TaskName, Description are required'
        }).code(400);
    }

    try {
        const newTask = await taskServices.createTask({
            taskName: payload.taskName,
            description: payload.description,
            createdBy: Number(userId)
        });

        return h.response({
            message: 'User added successfully',
            taskId: newTask.taskId
        }).code(201);
    } catch (err: any) {
        console.error(err);
        return h.response({ error: err.message }).code(500);
    }
}
