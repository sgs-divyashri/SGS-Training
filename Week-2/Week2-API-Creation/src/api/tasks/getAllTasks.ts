import type { ResponseObject, ResponseToolkit, Request } from "@hapi/hapi";
import { Task } from "../../services/taskServices"
import { taskServices } from "../../services/taskServices";

export const getTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const allTasks: Task[] = taskServices.getAllTasks();
    return h.response({ message: "Retrieved all tasks...", allTasks }).code(200);
}
