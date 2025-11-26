import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Task, taskServices } from "../../services/taskServices";
import { generateToken } from "./taskAuthentication";

export const getSpecificUserTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const userId = Number(request.params.id);
    const userTasks = taskServices.getSpecificUserTasks(userId);
    if (userTasks.length === 0) {
        return h.response({ error: "No tasks found for this user" }).code(404);
    }

    // Generate JWT token
    const tasks = userTasks.map(t => {

        const token = generateToken({
            id: t.id!
        });

        return { ...t, token };
    });
    return h.response({ message: `Tasks of User ID ${userId} retrieved...`, tasks }).code(200);
}
