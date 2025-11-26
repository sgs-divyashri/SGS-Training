import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Task } from "../../services/taskServices"
import { taskServices } from "../../services/taskServices";
import { generateToken } from "./taskAuthentication";

export const getTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const allTasks: Task[] = taskServices.getAllTasks();
    // Generate JWT token
    const tasks = allTasks.map(t => {

        const token = generateToken({
            id: t.id!
        });

        return { ...t, token };
    });
    return h.response({ message: "Retrieved all tasks...", tasks }).code(200);
}
