import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { taskServices } from "../../services/taskServices";
import { Task, TaskPayload } from "../../models/taskTableDefinition";
import { User } from "../../models/userTableDefinition";
import { error } from "console";

export const createTaskHandler = async (
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> => {
  const role = String(request.auth.credentials.role ?? "")
    .trim()
    .toLowerCase();

  if (role !== "admin") {
    return h.response({ error: "Insufficient permissions" }).code(403);
  }
  const payload = request.payload as Pick<
    TaskPayload,
    "taskName" | "description" | "assignedTo"
  >;

  if (!payload.taskName || !payload.description || !payload.assignedTo) {
    return h
      .response({
        error: "TaskName, Description and AssignedTo are required",
      })
      .code(400);
  }

  const userExists = await User.findOne({
    where: { userId: payload.assignedTo, isActive: true },
  });
  if (!userExists) {
    return h.response({error: "Invalid assignedTo ID"}).code(400);
  }
  if (!userExists || userExists.role.toLowerCase() !== "user") {
    return h
      .response({ error: "assignedTo must be a valid active User (not Admin)" })
      .code(400);
  }

  try {
    const newTask = await taskServices.createTask({
      taskName: payload.taskName,
      description: payload.description,
      assignedTo: payload.assignedTo,
    });

    return h
      .response({
        message: "Task added successfully",
        taskId: newTask.taskId,
      })
      .code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
};
