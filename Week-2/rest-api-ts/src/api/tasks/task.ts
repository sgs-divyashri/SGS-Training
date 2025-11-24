import type { ServerRoute } from "@hapi/hapi";
import { users } from "../users/user";

interface Task {
    ID: string;
    TaskName: string;
    Description: string;
    Status: string;
    createdBy: number;
    CreatedAt: string;
    UpdatedAt: string;
    isActive: boolean; //
}
const tasks: Task[] = [];
let taskCounter: number = 1;  
const allowedStatuses: string[] = ["To-Do", "In Progress", "Review", "Completed"];

function generateTaskId(): string {    // String dt
    const prefix = "T";   
    const minDigits = 3;  
    const digits = Math.max(String(taskCounter).length, minDigits);
    const taskId = prefix + String(taskCounter).padStart(digits, "0");
    taskCounter++; 
    return taskId;  
}


export const taskRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/tasks/home',
        handler: () => {return 'Tasks...'}
    },

    {
        method: 'GET',
        path: '/tasks',
        handler: () => {return tasks.filter((task) => task.isActive === true)}
    },

    {
        method: 'GET',
        path: '/tasks/{id}',
        handler: (request, h) => {
            const id = request.params.id;
            const task = tasks.find(t => t.ID === id && t.isActive === true);
            if (!task) {
                return h.response({ error: 'Task not found' }).code(404);
            }
            return task;
            // return task ? task : h.response({ error: 'Task not found' }).code(404);
        }
    },

    {
        method: 'GET',
        path: '/tasks/user/{id}',
        handler: (request, h) => {
            const userId = Number(request.params.id);
            const userTasks = tasks.filter(t => t.createdBy === userId && t.isActive === true);
            if (userTasks.length === 0) {
                return h.response({ error: "No tasks found for this user" }).code(404);
            }
            return userTasks;
        }
    },

    {
        method: 'POST',
        path: '/tasks',
        handler: (request, h) => {
            let Status = "To-Do";
            const { TaskName, Description, createdBy } = request.payload as {
                TaskName: string;
                Description: string;
                createdBy: number;
            };
            // Basic validation
            if (!TaskName || !Description || !createdBy) {
                return h.response({ 
                    error: 'TaskName, Description and createdBy are required' 
                }).code(400);
            }

            // Validate user exists
            const userExists = users.some(u => u.ID === createdBy && u.isActive);
            if (!userExists) {
                return h
                    .response({ error: "Invalid createdBy: User not found or inactive" })
                    .code(400);
            }

            const newTask: Task = {
                ID: generateTaskId(),
                TaskName,
                Description,
                Status,
                createdBy,
                CreatedAt: new Date().toLocaleString(),
                UpdatedAt: new Date().toLocaleString(),
                isActive: true
            };

            tasks.push(newTask);
            return h.response({ 
                message: 'User added successfully', 
                user: newTask  
            }).code(201);
        }
    },

    {
        method: "PUT",
        path: "/tasks/f_update/{id}",
        handler: (request, h) => {
            const id = request.params.id;
            const payload = request.payload as Partial<Task>;

            const task = tasks.find(t => t.ID === id && t.isActive);
            if (!task) {
                return h.response({ error: "Task not found" }).code(404);
            }

            // Validate: all fields must be present
            if (!payload.TaskName || !payload.Description || !payload.Status || !payload.createdBy) {
                return h.response({
                    error: "TaskName, Description and Status are required for full update"
                }).code(400);
            }

            // Validate status
            if (!allowedStatuses.includes(payload.Status)) {
                return h.response({ error: "Invalid status" }).code(400);
            }

            // FULL UPDATE
            task.TaskName = payload.TaskName;
            task.Description = payload.Description;
            task.Status = payload.Status;

            task.UpdatedAt = new Date().toLocaleString();

            return h.response({
                message: "Task fully updated",
                task
            }).code(200);
        }
    },

    {
        method: "PATCH",
        path: "/tasks/p_update/{id}",
        handler: (request, h) => {
            const id = request.params.id;
            const payload = request.payload as Partial<Task>;

            const task = tasks.find(t => t.ID === id && t.isActive);
            if (!task) {
                return h.response({ error: "Task not found" }).code(404);
            }

            // PARTIAL UPDATE (update only fields sent)
            if (payload.TaskName !== undefined) task.TaskName = payload.TaskName;
            if (payload.Description !== undefined) task.Description = payload.Description;
            if (payload.createdBy !== undefined) task.createdBy = payload.createdBy;
            if (payload.Status !== undefined) {
                if (!allowedStatuses.includes(payload.Status)) {
                    return h.response({ error: "Invalid status value" }).code(400);
                }
                task.Status = payload.Status;
            }

            task.UpdatedAt = new Date().toLocaleString();

            return h.response({
                message: "Task updated successfully",
                task
            }).code(200);
        }
    },

    {
        method: 'DELETE',
        path: '/tasks/{id}',
        handler: (request, h) => {
            const id = request.params.id;
            const task = tasks.find((t) => t.ID === id && t.isActive===true)
    
            if (!task) {
                return h.response({ error: 'Task not found' }).code(404);
            }
            return task.isActive=false
        }
    },
]