import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { User, userServices } from "../../services/userServices";
import { generateToken } from "./authentication";
import { verifyToken } from "./authentication";


export const partialUpdateUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
  try {

    const id = Number(request.params.id);
    const payload = request.payload as User;
    // Read Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return h.response({ error: "Unauthorized" }).code(401);
    }

    // Extract token
    const token = authHeader.replace("Bearer ", "");

    // Verify token
    const check = verifyToken(token);

    const task = userServices.partialUpdateUser(id, payload);

    if (task === null) {
      return h.response({ error: "Task not found" }).code(404); // Fixed: User → Task
    }

    return h.response({
      message: "Partially Updated Users successfully",
      token,
      task: task,
    }).code(200);

  } catch (err) {
    console.error("ERROR IN partialUpdateTaskHandler:", err);
    return h.response({ error: "Invalid token" }).code(401);
  }
}