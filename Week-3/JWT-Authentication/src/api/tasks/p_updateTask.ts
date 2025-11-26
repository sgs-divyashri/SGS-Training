import { Task, taskServices } from "../../services/taskServices";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { generateToken } from "./taskAuthentication";
import { verifyToken } from "./taskAuthentication";

export const partialUpdateTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    try {
    
        const id = request.params.id;
        const payload = request.payload as Task;
        // Read Authorization header
        const authHeader = request.headers.authorization;
    
        if (!authHeader) {
          return h.response({ error: "Unauthorized" }).code(401);
        }
    
        // Extract token
        const token = authHeader.replace("Bearer ", "");
    
        // Verify token
        const check = verifyToken(token);
    
        const task = taskServices.partialUpdateTask(id, payload);
    
        if (task === null) {
          return h.response({ error: "Task not found" }).code(404); // Fixed: User → Task
        }
    
        if (task === "INVALID_STATUS") {
          return h.response({ error: "Invalid status value" }).code(400); // Fixed error message
        }
    
        return h.response({
          message: "Retrieved Users successfully",
          token,
          task: task,
        }).code(200);
    
      } catch (err) {
        console.error("ERROR IN partialUpdateTaskHandler:", err);
        return h.response({ error: "Invalid token" }).code(401);
      }
    
    // const id = request.params.id;
    // const payload = request.payload as Partial<Task>;

    // const result = taskServices.partialUpdateTask(id, payload);

    // if (result === null) {
    //     return h.response({ error: "Task not found" }).code(404);
    // }

    // if (result === "INVALID_STATUS") {
    //     return h.response({ error: "Invalid status value" }).code(400);
    // }

    // const token = generateToken({
    //     id: result.id!
    // });

    // return h.response({
    //     message: "Task updated successfully",
    //     token,
    //     result
    // }).code(200);
}
