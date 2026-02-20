import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";
import { JWTPayload } from "../../authentication/auth";

export const getSpecificUserTaskHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  try {
    const role = String(request.auth.credentials.role).trim().toLowerCase();

    if (role !== "user") {
      return h.response({ error: "Insufficient permissions" }).code(403);
    }
    const { userId } = request.auth.credentials as Pick<JWTPayload, "userId">;

    const userTasks = await taskServices.getSpecificUserTasks(userId);
    if (!userTasks) {
      return h.response({ error: "No tasks found for this user" }).code(404);
    }

    return h
      .response({
        message: "Retrieved specific user's tasks successfully",
        tasks: userTasks,
      })
      .code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
};
