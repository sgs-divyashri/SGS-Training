import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";
import { TaskPayload } from "../../models/taskTableDefinition";

export const fullUpdateTaskHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {

    const id = request.params.id;
    const payload = request.payload as Pick<TaskPayload, "taskName" | "description" | "createdBy" | "status">;

     if (!payload.taskName || !payload.description || !payload.createdBy || !payload.status) {
      return h.response({ error: "Invalid payload" }).code(400)
    }
    const task = await taskServices.fullUpdateTask(id, payload);

    if (task === null) {
      return h.response({ error: "Task not found" }).code(404); // Fixed: User → Task
    }

    return h.response({
      message: "Fully updated task successfully",
      task: task,
    }).code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
  
}