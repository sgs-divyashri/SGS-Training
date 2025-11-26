import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Task } from "../../services/taskServices"
import { taskServices } from "../../services/taskServices";
import { generateToken } from "./taskAuthentication";
import { verifyToken } from "./taskAuthentication";

export const getTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
    try {
        // Read Authorization header
        const authHeader = request.headers.authorization;
    
        if (!authHeader) {
          return h.response({ error: "Unauthorized" }).code(401);
        }
    
        // Extract token
        const token = authHeader.replace("Bearer ", "");
    
        // Verify token
        const payload = verifyToken(token);
        
        const allTasks: Task[] = taskServices.getAllTasks();
    
        return h.response({
          message: "Retrieved Users successfully",
          token,
          users: allTasks,
        }).code(200);
    
      } catch (err) {
        console.error("ERROR IN getTaskHandler:", err);
        return h.response({ error: "Invalid token" }).code(401);
      }
}
