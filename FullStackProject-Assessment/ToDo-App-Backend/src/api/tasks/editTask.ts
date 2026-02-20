import { taskServices } from "../../services/taskServices";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { TaskPayload } from "../../models/taskTableDefinition";


export const editTaskHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
    
        const id = request.params.id;
        const payload = request.payload as Pick<Partial<TaskPayload>, "taskName" | "description" | "assignedTo">;
    
        const task = await taskServices.editTask(id, payload);
    
        if (task === null) {
          return h.response({ error: "Task not found" }).code(404);
        }
    
        return h.response({
          message: "Task updated successfully",
          task: task,
        }).code(200);
    
      } catch (err: any) {
        console.error("ERROR IN partialUpdateTaskHandler:", err);
        return h.response({ error: err.message }).code(500);
      }
}
