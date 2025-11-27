import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";
import { generateToken } from "./taskAuthentication";
import { verifyToken } from "./taskAuthentication";

export const softDeleteTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    try {

        const id = request.params.id;

        // // Read Authorization header
        // const authHeader = request.headers.authorization;

        // if (!authHeader) {
        //     return h.response({ error: "Unauthorized" }).code(401);
        // }

        // // Extract token
        // const token = authHeader.replace("Bearer ", "");

        // // Verify token
        // const check = verifyToken(token);

        const task = taskServices.softDeleteTask(id);
        if (task === null) {
            return h.response({ error: 'Task not found' }).code(404);
        }


        return h.response({
            message: "Soft Deleted Task successfully",
            task: task,
        }).code(200);

    } catch (err) {
        console.error("ERROR IN softDeleteTaskHandler:", err);
        return h.response({ error: "Invalid token" }).code(401);
    }

    // const id = request.params.id;
    // const task = taskServices.softDeleteTask(id);

    // if (task === null) {
    //     return h.response({ error: 'Task not found' }).code(404);
    // }

    // const token = generateToken({
    //     id: task.id!
    // });
    // return h.response({
    //     message: "Task deleted successfully", 
    //     token,
    //     task: task.id,
    //     active: task.isActive
    // }).code(200);
}