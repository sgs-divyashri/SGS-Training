import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { generateToken } from "./authentication";
import { verifyToken } from "./authentication";

export const softDeleteUserHandler = (request: Request, h: ResponseToolkit): ResponseObject => {
  try {

    const id = Number(request.params.userID);

    // // Read Authorization header
    // const authHeader = request.headers.authorization;

    // if (!authHeader) {
    //   return h.response({ error: "Unauthorized" }).code(401);
    // }

    // // Extract token
    // const token = authHeader.replace("Bearer ", "");

    // // Verify token
    // const check = verifyToken(token);

    const task = userServices.softDeleteUser(id);
    if (task === null) {
      return h.response({ error: 'Task not found' }).code(404);
    }


    return h.response({
      message: "Soft Deleted User successfully",
      task: task,
    }).code(200);

  } catch (err) {
    console.error("ERROR IN fullUpdateTaskHandler:", err);
    return h.response({ error: "Invalid token" }).code(401);
  }
}