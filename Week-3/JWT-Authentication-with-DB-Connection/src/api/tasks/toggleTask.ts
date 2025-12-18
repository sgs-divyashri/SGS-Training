import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";

export const toggleTaskHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const id = request.params.taskId;

    if (!id) {
      return h.response({ error: 'Invalid user ID' }).code(400);
    }

    const user = await taskServices.toggleTask(id);
    if (user === null) {
      return h.response({ error: 'User not found' }).code(404);
    }

    return h.response({
      message: "Soft Deleted or Restored Task successfully",
      user: user,
    }).code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(400);
  }
}