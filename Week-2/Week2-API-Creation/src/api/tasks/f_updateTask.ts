import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Task, taskServices } from "../../services/taskServices";

export const fullUpdateTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const id = request.params.id;
    const payload = request.payload as Task;
    const task = taskServices.fullUpdateTask(id, payload);

    if (task === null) {
      return h.response({ error: "User not found" }).code(404);
    }

    if (task === "MISSING_FIELDS") {
      return h.response({ error: "All fields are required for full update" }).code(400);
    }

    if (task === "INVALID_STATUS") {
      return h.response({ error: "All fields are required for full update" }).code(400);
    }

    return h.response({
        message: "Task fully updated",
        task
    }).code(200);
}
