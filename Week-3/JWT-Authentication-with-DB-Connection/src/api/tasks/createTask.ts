import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";
import { TaskPayload } from "../../models/taskTableDefinition";
import { generateTaskId } from "./generateID";

export const createTaskHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const payload = request.payload as Pick<TaskPayload, "taskName" | "description" | "createdBy">;

    // Basic validation
    if (!payload.taskName || !payload.description || !payload.createdBy) {
        return h.response({
            error: 'TaskName, Description and createdBy are required'
        }).code(400);
    }

    try {
        const newTask = await taskServices.createTask({
            taskName: payload.taskName,
            description: payload.description,
            createdBy: payload.createdBy
        });

        return h.response({
            message: 'User added successfully',
            user: newTask
        }).code(201);
    } catch (err: any) {
        console.error(err);
        return h.response({ error: err.message }).code(400);
    }
}
