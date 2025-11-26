import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Task, taskServices } from "../../services/taskServices";
import { generateToken } from "./taskAuthentication";

export const fullUpdateTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
  const id = request.params.id;
  const payload = request.payload as Task;
  const task = taskServices.fullUpdateTask(id, payload);

  if (task === null) {
    return h.response({ error: "Task not found" }).code(404); // Fixed: User → Task
  }

  if (task === "MISSING_FIELDS") {
    return h.response({ error: "All fields are required for full update" }).code(400);
  }

  if (task === "INVALID_STATUS") {
    return h.response({ error: "Invalid status value" }).code(400); // Fixed error message
  }

  // Generate JWT token
  const token = generateToken({
    id: task.id!,
  });

  return h.response({
    message: "Task fully updated",
    token,
    task
  }).code(200);
}