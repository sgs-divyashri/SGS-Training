import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";

export const getSpecificTaskHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
  try {
    const id = request.params.id;
    const specificTask = await taskServices.getSpecificTask(id);

    if (!specificTask) {
      return h.response({ error: "Task not found" }).code(404);
    }

    return h
      .response({
        message: `Task ID ${id} retrieved successfully`,
        task: specificTask
      })
      .code(200);

  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(400);
  }
};