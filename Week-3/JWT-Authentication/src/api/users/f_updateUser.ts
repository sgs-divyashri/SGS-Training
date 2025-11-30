import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { User } from "../../services/userServices";
import { generateToken } from "./authentication";
import { verifyToken } from "./authentication";

export const fullUpdateUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
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

    const task = userServices.fullUpdateUser(id, payload);

    if (task === null) {
      return h.response({ error: "Task not found" }).code(404); // Fixed: User → Task
    }

    if (task === "MISSING_FIELDS") {
      return h.response({ error: "All fields are required for full update" }).code(400);
    }

    if (task === "INVALID_STATUS") {
      return h.response({ error: "Invalid status value" }).code(400); // Fixed error message
    }

    return h.response({
      message: " Fully Updated Users successfully",
      token,
      task: task,
    }).code(200);

  } catch (err) {
    console.error("ERROR IN fullUpdateUserHandler:", err);
    return h.response({ error: "Invalid token" }).code(401);
  }

}