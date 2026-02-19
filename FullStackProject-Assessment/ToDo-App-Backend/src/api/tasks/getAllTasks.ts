import { ResponseToolkit, ResponseObject, Request } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { User } from "../../models/userTableDefinition";
import { taskServices } from "../../services/taskServices";
import { Task } from "../../models/taskTableDefinition";

export const getAllTasksHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const role = String(request.auth.credentials.role ?? "")
      .trim()
      .toLowerCase();

    if (role !== "admin") {
      return h.response({ error: "Insufficient permissions" }).code(403);
    }
    const allTasks: Task[] = await taskServices.getAllTasks();

    if (!allTasks) {
      h.response({ error: "Tasks not found" }).code(400);
    }

    return h
      .response({
        message: "Retrieved All Tasks successfully",
        tasks: allTasks,
      })
      .code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
};
