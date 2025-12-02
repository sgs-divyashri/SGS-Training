import { TaskPayload, taskServices } from "../../services/taskServices";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { generateToken } from "./taskAuthentication";


export const partialUpdateTaskHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
    
        const id = request.params.id;
        const payload = request.payload as Partial<{ taskName: string, description: string, createdBy: number, status: string }>;
    
        const task = await taskServices.partialUpdateTask(id, payload);
    
        if (task === null) {
          return h.response({ error: "Task not found" }).code(404); // Fixed: User → Task
        }
    
        return h.response({
          message: "Partially Updated Task successfully",
          task: task,
        }).code(200);
    
      } catch (err) {
        console.error("ERROR IN partialUpdateTaskHandler:", err);
        return h.response({ error: "Invalid token" }).code(401);
      }
}
