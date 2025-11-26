import { Task, taskServices } from "../../services/taskServices";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { generateToken } from "./taskAuthentication";

export const partialUpdateTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    const id = request.params.id;
    const payload = request.payload as Partial<Task>;

    const result = taskServices.partialUpdateTask(id, payload);

    if (result === null) {
        return h.response({ error: "Task not found" }).code(404);
    }

    if (result === "INVALID_STATUS") {
        return h.response({ error: "Invalid status value" }).code(400);
    }

    const token = generateToken({
        id: result.id!
    });

    return h.response({
        message: "Task updated successfully",
        token,
        result
    }).code(200);
}
