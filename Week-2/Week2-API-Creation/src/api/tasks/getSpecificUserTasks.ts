import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Task, taskServices } from "../../services/taskServices";

export const getSpecificUserTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const userId = Number(request.params.id);
    const userTasks = taskServices.getSpecificUserTasks(userId);
    if (userTasks.length === 0) {
        return h.response({ error: "No tasks found for this user" }).code(404);
    }
    return h.response({ message: `Tasks of User ID ${userId} retrieved...`, userTasks }).code(200);
}
