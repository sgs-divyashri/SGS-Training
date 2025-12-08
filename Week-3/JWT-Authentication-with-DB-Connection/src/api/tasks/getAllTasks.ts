import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";

export const getTaskHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    try {
        const allTasks = await taskServices.getAllTasks();
        return h.response({
          message: "Retrieved All Tasks successfully",
          tasks: allTasks,
        }).code(200);
    
      } catch (err: any) {
        console.error(err);
        return h.response({ error: err.message }).code(400);
    }
}
