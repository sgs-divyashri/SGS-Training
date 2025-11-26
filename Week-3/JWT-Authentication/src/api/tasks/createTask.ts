import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Task, taskServices } from "../../services/taskServices";
import { generateToken } from "./taskAuthentication";

export const createTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const payload = request.payload as Task;

    // Basic validation
    if (!payload.taskName || !payload.description || !payload.createdBy) {
        return h.response({
            error: 'TaskName, Description and createdBy are required'
        }).code(400);
    }

    const newTask: Task = taskServices.createTask({
        taskName: payload.taskName,
        description: payload.description,
        createdBy: payload.createdBy
    });

    // Generate JWT token
    const token = generateToken({
        id: newTask.id!,
    });

    return h.response({
        message: 'User added successfully',
        token,
        user: newTask
    }).code(201);
}
