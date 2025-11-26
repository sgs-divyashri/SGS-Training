import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Task, taskServices } from "../../services/taskServices";
import { generateToken } from "./taskAuthentication";
import { verifyToken } from "./taskAuthentication";

export const getSpecificUserTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    try {

        const id = Number(request.params.id);

        // Read Authorization header
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return h.response({ error: "Unauthorized" }).code(401);
        }

        // Extract token
        const token = authHeader.replace("Bearer ", "");

        // Verify token
        const check = verifyToken(token);

        const userTasks = taskServices.getSpecificUserTasks(id);
        if (userTasks.length === 0) {
            return h.response({ error: "No tasks found for this user" }).code(404);
        }

        return h.response({
            message: "Retrieved specific user's tasks successfully",
            token,
            task: userTasks,
        }).code(200);

    } catch (err) {
        console.error("ERROR IN partialUpdateTaskHandler:", err);
        return h.response({ error: "Invalid token" }).code(401);
    }

    // const userId = Number(request.params.id);
    // const userTasks = taskServices.getSpecificUserTasks(userId);
    // if (userTasks.length === 0) {
    //     return h.response({ error: "No tasks found for this user" }).code(404);
    // }

    // // Generate JWT token
    // const tasks = userTasks.map(t => {

    //     const token = generateToken({
    //         id: t.id!
    //     });

    //     return { ...t, token };
    // });
    // return h.response({ message: `Tasks of User ID ${userId} retrieved...`, tasks }).code(200);
}
