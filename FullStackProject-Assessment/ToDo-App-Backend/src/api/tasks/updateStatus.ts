import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { TaskPayload } from "../../models/taskTableDefinition";
import { taskServices } from "../../services/taskServices";

export const statusUpdateHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const taskID = request.params.id;
    const payload = request.payload as Pick<TaskPayload, "status">;

    if (!payload.status) {
      return h.response({ error: "Invalid Status" }).code(400);
    }

    const task = await taskServices.updateTaskStatus(taskID, payload);

    if (task === null) {
      return h
        .response({ error: "Task not found or already deleted" })
        .code(404);
    }

    return h
      .response({
        message: "Task Status updated successfully",
        task: task,
      })
      .code(200);
  } catch (err: any) {
    return h.response({ error: err.message }).code(500);
  }
};
