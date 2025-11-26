import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { Task } from "../../services/taskServices";
import { taskServices } from "../../services/taskServices";
import { generateToken } from "./taskAuthentication";
import { verifyToken } from "./taskAuthentication";

export const getSpecificTaskHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
  try {
    // Authenticate user
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return h.response({ error: "Missing Authorization Header" }).code(401);
    }

    const token = authHeader.replace("Bearer ", "");
    const user = verifyToken(token);   // <-- VERIFY TOKEN HERE

    // After verification, fetch the task
    const id = request.params.id;
    const specificTask = taskServices.getSpecificTask(id);

    if (!specificTask) {
      return h.response({ error: "Task not found" }).code(404);
    }

    // Return the task (NO NEW TOKEN)
    return h
      .response({
        message: `Task ID ${id} retrieved successfully`,
        token,
        task: specificTask
      })
      .code(200);

  } catch (err) {
    return h.response({ error: "Invalid or expired token" }).code(401);
  }
};
  
  // const id = request.params.id;
  // const specficTask = taskServices.getSpecificTask(id)

  // if (!specficTask) {
  //   return h.response({ error: 'Task not found' }).code(404);
  // }

  // const token = generateToken({
  //   id: specficTask.id!
  // });

  // return h.response({ message: `Task ID ${id} retrieved...`, token, specficTask }).code(200);

