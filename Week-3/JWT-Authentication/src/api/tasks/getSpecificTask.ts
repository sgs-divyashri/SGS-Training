import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Task } from "../../services/taskServices";
import { taskServices } from "../../services/taskServices";
import { generateToken } from "./taskAuthentication";

export const getSpecificTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
  const id = request.params.id;
  const specficTask = taskServices.getSpecificTask(id)

  if (!specficTask) {
    return h.response({ error: 'Task not found' }).code(404);
  }

  const token = generateToken({
    id: specficTask.id!
  });

  return h.response({ message: `Task ID ${id} retrieved...`, token, specficTask }).code(200);
}
