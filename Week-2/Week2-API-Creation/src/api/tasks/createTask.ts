import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Task, taskServices } from "../../services/taskServices";

export const createTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const payload = request.payload as Pick<Task, 'taskName'|"description"|"createdBy">;
    
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

    return h.response({ 
        message: 'User added successfully', 
        user: newTask  
    }).code(201);
}
